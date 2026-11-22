# GEMS: Strategy & Optimization Manual

> 🌐 **Language / Taal / Langue:** **English** | [Nederlands](nl/strategy_manual.md) | [Français](fr/strategy_manual.md)

This manual provides an in-depth guide to configuring and using the strategy engine within GEMS (Grid Energy Management System). The strategy engine is the core component that coordinates your home energy ecosystem—Grid, Solar, Battery, EV Chargers, and Smart Relays—to optimize energy consumption, maximize self-consumption, avoid peak capacity grid surcharges, and execute cost-effective energy arbitrage.

> [!TIP]
> **Download Official Field Manuals & Strategy Playbook (PDF):**
> - 🧭 **[GRID-EMS Optimal Strategy Guide — Per Country & Installation (PDF)](GRID-EMS-Strategy-Guide.pdf)** (`EN` | [NL](nl/GRID-EMS-Strategy-Guide-nl.pdf) | [FR](fr/GRID-EMS-Strategy-Guide-fr.pdf))
> - 📕 **[GEMS Installer & Commissioning Manual (PDF)](../manuals/gems-installer-manual.pdf)** (5.7 MB)
> - 📗 **[GEMS Homeowner & User Manual (PDF)](../manuals/gems-user-manual.pdf)** (3.5 MB)
> - ☁️ **[GEMS GRID-EMS-SERVER Connection Manual (PDF)](../manuals/gems-server-connection-manual.pdf)** (1.1 MB)
> - 💻 **[Interactive Documentation Hub](../manuals/index.html)**


---

## 1. Overview of the Strategy Engine

The strategy engine continuously evaluates your home's energy flow based on a unified configuration interface in the UI. Zero YAML or configuration files are required.

The core control loop executes every second:
1. **Reads Telemetry**: Pulls active power from smart meters (P1/Modbus), solar inverters, battery storage (BESS), and EV chargers.
2. **Evaluates 15-Minute Rolling Average**: Updates the current quarter-hour rolling average import and tracks monthly peak records in SQLite.
3. **Applies Regional & Site Rules**: Evaluates active mode rules (Eco, Flanders, Netherlands), battery arbitrage thresholds, and scheduled windows.
4. **Dispatches Dynamic Setpoints**: Sends non-blocking Modbus, OCPP, or REST setpoint commands to inverters, EV chargers, and smart relays.

---

## 2. Global Site Optimization (Strategy Modes)

| Strategy Tab Overview | Operational Strategy Modes |
| :---: | :---: |
| ![Strategy Tab](../screenshots/settings_strategy.png) | ![Strategy Modes](../screenshots/settings_strategy_modes.png) |

### 2.0 Optimal Strategy Profiles (1-Click Presets)
At the top of **Settings → Strategy**, GEMS provides region-filtered **1-Click Optimal Strategy Profiles** with built-in **How it works** and **When to use it** guidance:
1. **Pure Solar Self-Consumption (`ECO`):** Charges the battery strictly from free solar PV surplus (`0 W` paid grid charging, `force_discharge_above_euro = 999`) with uncurtailed PV. Best for fixed or variable electricity contracts.
2. **Netherlands Zero Net Export (`0-Export & Terugleverkosten Shield` — `NL` Only):** Routes surplus solar to **Raedian** EV wallboxes and **Solis** storage first (`price_and_solar` with `force_charge_below_euro = 0`), then smoothly curtails inverter output down to local house load (`active_inverter_curtailment = true`, `min_profitable_export_price = 999`) so net grid injection stays at `0 W` on both fixed/variable and dynamic Dutch contracts.
3. **Flanders Capacity Peak Shield (`Fluvius` — `BE` + `flanders` Only):** Guards your rolling 15-minute *Capaciteitstarief* ceiling (`2.50 kW` floor + `200 W` safety buffer) via `hybrid` solar + spot forecasting, negative-price curtailment, and winter low-SoC reserve protection.
4. **Wallonia `Tarif Impact` Shifter (`ORES / RESA` — `BE` + `wallonia` Only):** Pre-charges during Wallonian `ECO` slots (`01:00–07:00` & `11:00–17:00`) and reserves stored battery energy to cover the `17:00–22:00` `PIC` distribution tariff peak.
5. **Dynamic Tariff — Smart 24h Forecast:** All-round `dynamic_forecast` profile combining Open-Meteo solar forecasts, learned household load, negative-price curtailment (`0.00 €/kWh`), and load-following discharge (`force_discharge_above_euro = 999`).
6. **Dynamic Tariff — Active Spread Arbitrage:** Extends `dynamic_forecast` for larger batteries (`10+ kWh`), charging below `0.05 €/kWh` and actively exporting excess battery energy above `0.35 €/kWh` when the spread beats battery wear (`0.04 €/kWh`).

### 2.1 Eco Mode (Maximum Self-Consumption)
**Goal:** Maximize direct self-consumption of rooftop solar generation and minimize grid reliance.
- **Behavior:** Directs surplus solar generation to home battery charging and EV charging before feeding into the grid. When solar diminishes, the home battery automatically discharges to support household base loads.
- **Suitability:** Ideal for installations with standard net-metering, flat tariffs, or high feed-in compensation.

### 2.2 Flanders Mode (Predictive Peak Shaving & Adaptive Ceiling)
**Goal:** Actively prevent high capacity tariff (*Capaciteitstarief*) surcharges in Flanders/Belgium by capping 15-minute average power spikes.
- **Mechanism:**
  - Continuously monitors the projected 15-minute rolling average grid import across each billing quarter-hour window.
  - Whenever projected quarter-hour import approaches the configured ceiling minus safety buffer, the system instantly throttles EV charging current and commands the battery to discharge.
- **Smart Adaptive Ceiling:**
  - GEMS stores monthly peak import records locally on the appliance.
  - If an unavoidable peak occurs during the month (e.g. 4.2 kW caused by oven + induction cooking), GEMS dynamically adapts its operational ceiling up to that incurred peak for the rest of the calendar month.
  - This allows the homeowner to charge their EV faster and utilize available capacity without increasing their capacity tariff bill.
- **Key Parameters:**
  - `capacity_peak_limit_kw`: Base target 15-minute grid import ceiling (e.g., `2.5` kW).
  - `peak_shaving_buffer_w`: Proactive safety buffer in Watts (e.g., `200` W) subtracted from the ceiling to prevent overshoot.
  - `peak_shaving_rampup_w`: Deadband hysteresis power step (default `500` W) required before throttled devices ramp back up.

### 2.3 Netherlands Mode (Smart Saldering, Terugleverkosten Shield & 3×25A Main-Fuse Guard)
**Goal:** Deliver the optimal energy strategy for Dutch homeowners and SMEs—protecting `3×25A` residential grid connections against costly DSO capacity tier upgrades, avoiding supplier solar feed-in surcharges (*terugleverkosten*), curtailing negative EPEX NL hours, and maximizing dynamic day-ahead battery/EV arbitrage ahead of and after the *salderingsregeling* phase-out.
- **Why Dutch Optimization Differs from Flanders:**
  - Unlike Flanders (where Fluvius bills a rolling 15-minute *Capaciteitstarief* peak above `2.50 kW`), Dutch regional grid operators (**Liander**, **Enexis**, **Stedin**) bill a fixed annual connection capacity tier (*vastrecht aansluitcapaciteit*). Stepping up from a standard residential **`3×25A`** (`17.25 kW`) connection to **`3×35A`** adds roughly **€1,000+ per year** in recurring DSO standing charges.
  - Consequently, the optimal Dutch strategy combines four pillars without artificially throttling household power to a `2.50 kW` quarter-hour cap:
    1. **Per-Phase `3×25A` Dynamic Load Balancing (DLB):** Continuously monitors `L1`, `L2`, and `L3` currents from the DSMR P1 meter so **Raedian** EV wallboxes, **Solis** hybrid storage, heat pumps, and induction cooking coexist safely on a `3×25A` fuse without upgrading to `3×35A`.
    2. **Direct Solar Self-Consumption & Thermal/EV Sinking:** Routes every surplus PV watt into household loads, **Solis** battery storage, **Raedian** 1P/3P solar EV charging, and SG-Ready heat pumps first to minimize grid export volume subject to supplier *terugleverkosten*.
    3. **Negative EPEX NL Curtailment (`min_profitable_export_price` & `active_inverter_curtailment`):** Dynamically permits grid export only when net feed-in compensation is profitable, and smoothly curtails solar inverter output down to local house load once storage buffers are full and net export prices turn negative.
    4. **EPEX NL Day-Ahead Arbitrage (`dynamic_forecast`):** Pre-charges batteries and schedules EV charging during the lowest-priced EPEX NL hours while discharging into expensive evening peaks (`17:00–21:00`).

### 2.4 Strict Country & Regional Isolation Guarantee
**Goal:** Ensure country-specific regulatory mechanisms never affect or appear on installations in another country.
- **Flanders (`BE` + `flanders`):** Exclusively enables the 15-minute *Capaciteitstarief* rolling peak shaver (`capacity_peak_limit_kw`, `2.50 kW` statutory baseline), Smart Adaptive Ceiling, peak-ceiling warnings, and Flemish Green Power Certificates (*Groenestroomcertificaten* / GSC).
- **Wallonia (`BE` + `wallonia`):** Exclusively enables the official CWaPE 7-days/week **`Tarif Impact`** distribution schedule (`ECO`: `01:00–07:00` & `11:00–17:00`; `MEDIUM`: `07:00–11:00` & `22:00–01:00`; `PIC`: `17:00–22:00`), shifting `dynamic_forecast` battery charging and Smart EV charging into `ECO` windows while discharging into `17:00–22:00` `PIC` windows.
- **Belgium (`BE` — Flanders, Wallonia, Brussels):** Exclusively enables Belgian Elia renewable grid-mix synchronization, Belgian Super-Dal (`01:00–07:00`) optimization, 2027 Belgian federal special excise (`€0.0392/kWh` excl. 6% BTW) helpers, and Belgian DSO IEC 60870-5-104 telecontrol.
- **Netherlands (`NL`), Germany (`DE`), Luxembourg (`LU`), and Other Regions:** Selecting a non-Flemish country or a Dutch energy contract automatically disables and hides Flemish *Capaciteitstarief* peak shaving, zeroes GSC subsidy offsets, disables Belgian Elia/Super-Dal/IEC-104 services, restricts post-2027 Dutch *salderingsregeling* feed-in cost (`fixed_feed_in_cost_kwh`) and `>= 50%` bare-supply export floor checks strictly to `NL`, and restricts German `§14a EnWG` controllable-load dimming strictly to German (`DE`) installations.

### 2.5 Flemish Groenestroomcertificaten (GSC) Value Protection (Flanders Only)
**Goal:** Prevent unwarranted solar curtailment and preserve green certificate income for legacy Flemish PV installations during negative Day-Ahead spot price hours.
- **Problem:** Many legacy systems receive €90, €210, €230, €250, €270, €330, €350, or €450 per 1,000 kWh produced. If spot export prices drop to -€0.10/kWh, naive curtailment would shut off the inverter and lose €0.25/kWh in certificate revenue, netting a €0.15/kWh loss!
- **Formula:**
  $$\text{Effective Curtailment Threshold} = \text{min\_profitable\_export\_price} - \frac{\text{gsc\_value\_eur\_mwh}}{1000.0}$$
- **Behavior:** With `gsc_value_eur_mwh: 250` and `min_profitable_export_price: 0.00`, solar injection remains active and profitable down to **-250.0 €/MWh (-0.250 €/kWh)**. Curtailment only triggers if the negative injection penalty exceeds the subsidy value.


---

## 3. Dynamic Battery Arbitrage & Schedules

GEMS integrates EPEX Spot Day-Ahead electricity prices (fetched daily at 14:00 CET) and Open-Meteo solar irradiance forecasting to intelligently optimize battery storage.

### 3.1 Grid Charging Strategies (`battery_grid_charge_strategy`)
- **`price_only`**: Force charges the battery from the grid when the spot price drops below `force_charge_below_euro`, and discharges to the grid when price spikes above `force_discharge_above_euro`.
- **`super_dal_only`**: Restricts grid charging exclusively to provider off-peak contract windows (e.g., Engie Superdal).
- **`hybrid`**: Combines price-based charging with provider off-peak window optimization.
- **`dynamic_forecast`**: Computes an optimal 24-hour schedule by combining EPEX hourly/quarter-hour spot prices with solar forecasts (`solar_forecast_enabled`, default `true`) and separate **Weekday vs. Weekend adaptive load profiles** learned over the trailing 30 days (`home_base_load_w` fallback), reserving stored battery energy ahead of peak evening tariffs, prioritizing free rooftop solar surplus over paid grid import, and covering local demand without forced grid feed-in unless `force_discharge_above_euro` is explicitly configured.
- **Configured Battery SoC Guardrails (`min_battery_soc` & `max_battery_soc`)**: Discharging automatically stops at `min_battery_soc` (`0%–80%`, default `10%`), and scheduled/grid/solar charging respects `max_battery_soc` (`50%–100%`, default `100%`, with `min_battery_soc < max_battery_soc`) to protect cycle longevity and reserve capacity.

### 3.2 Live BMS Dynamic Power Envelopes, Solar Headroom & Multi-Battery SOC Balancing
- **Live BMS & Hybrid Inverter AC Headroom Clamping**: Both real-time battery dispatch and the 24-hour dynamic arbitrage forecast query live BMS dynamic maximum charge and discharge power limits derived from real-time BMS current envelopes and pack voltage, while capping hybrid inverter battery discharge to remaining AC output stage headroom so active rooftop solar PV generation is never clipped.
- **SOC-Headroom-Weighted Multi-Battery Distribution**: On sites with multiple hybrid inverters or dedicated BESS units, GEMS distributes total charge power proportionally to each unit's remaining charge headroom ($\text{MaxCap}_i \times (100 - \text{SOC}_i)$) and discharge power proportionally to available stored energy above the reserve floor ($\text{MaxCap}_i \times (\text{SOC}_i - \text{MinSOC})$), ensuring all battery banks converge toward balanced SOC.
- **Damped Closed-Loop Setpoint Regulation**: When compensating net household grid import or modulating zero-export PV curtailment against an external smart meter, GEMS applies closed-loop setpoint damping to eliminate meter-to-inverter phase-lag oscillation.

### 3.3 Custom Scheduled Windows & Winter / Low-Solar Fallback
- **Custom Scheduled Windows**: Users can define multiple custom charging windows with precise start/end times and target SOC percentages (e.g., 02:00 - 05:00 to 90% SOC). Custom schedules take priority over general arbitrage logic.
- **Winter / Low-Solar Grid Charge Fallback (`winter_fallback_enabled`)**: When the battery remains at or below `winter_fallback_trigger_soc` (default `25%`) due to extended cloudy weather or winter and the 24-hour solar forecast (or trailing 24-hour solar yield) cannot cover battery recharge, GEMS automatically charges the battery during the `winter_fallback_cheapest_hours` (default `2` hours) lowest-priced slots of the day up to `winter_fallback_target_soc` (default `65%`, leaving headroom for unexpected daytime solar). Both real-time control and the 24-hour dynamic forecast respect Flanders 15-minute capacity peak limits and per-phase main fuse limits, keeping the battery useful for peak shaving and evening self-consumption all winter.

---

## 4. Smart EV Charging (Preferred Modbus TCP & Native OCPP)

GEMS controls smart EV charging stations via **Modbus TCP/RTU fieldbus (preferred)** or its embedded **Native OCPP 1.6-J WebSocket server** (`ws://<EMS-IP>:8887/<ChargePointID>` and `ws://<EMS-IP>:8080/api/ocpp/<ChargePointID>`):

- **Why Modbus TCP is Preferred**: Modbus register writes provide instantaneous, sub-second current throttling (6A to 32A). This is essential for reactive Flanders capacity peak shaving and solar surplus matching. Crucially, it allows home or fleet wallboxes to remain connected to employer reimbursement / CPO backends over OCPP without interference.
- **Native OCPP Server**: Available for chargers without Modbus TCP or installations requiring standalone, zero-cloud residential charging.
- **`smart_ev_cheapest_hours`**: Automatically scans the 24-hour EPEX tariff curve and boosts EV charging current during the $N$ cheapest hours of the day.
- **Dynamic Load Balancing & Priority Tiers**: Continuously balances EV setpoints against main grid fuse limits (`grid_nominal_current_a`) and phase imbalances (`phase_limit_amps`) across `1×230V`, `3×230V` Delta, and `3×400V+N` topologies. In Fleet `Priority Queue` mode, stations follow five strict tiers (`VIP > High > Normal > Low > Solar Only`), where `Low` yields to `Normal` bays during capacity constraints while remaining eligible for grid/off-peak charging.

---

## 5. 24-Hour Effective Tariff Visualizer, Regional Contracts & Savings Attribution

| Energy Contract Configuration | 24-Hour Tariff Visualizer Curve |
| :---: | :---: |
| ![Energy Contract Tab](../screenshots/settings_contract.png) | ![Tariff Visualizer](../screenshots/settings_contract_tariffs.png) |

### 5.1 Supported Belgian & Dutch Provider Presets
- **Vattenfall Nederland — FlexPrijs (`vattenfall_dynamic`, NL)**: Quarter-hour (`15m`) or clock-hour averaged (`60m`) EPEX Spot NL (`1.00×`) pass-through + `€0.0211/kWh` procurement markup (*Inkoopvergoeding*), `€95.40/yr` fixed subscription (*Vastrecht*), statutory excl.-VAT Dutch *Energiebelasting* presets (**2026: `€0.09161/kWh`** / **2027: `€0.08802/kWh`** excl. `21%` BTW), `21%` BTW, and `1.00×` EPEX Spot NL feed-in compensation (`€0.0000/kWh` deduction).
- **Eneco Dynamic & Frank Energie Dynamic (`NL` / `BE`)**: Regional EPEX NL or EPEX BE spot formulas with selectable `15m` vs `60m` spot settlement granularity, automatic VAT (`21%` NL / `6%` BE), and statutory tax presets.
- **TotalEnergies Pixel Dynamic**: Multiplier, markup (€/kWh), annual base subscription fee, and injection deductions.
- **Mega Smart / Cosy Dynamic**: Transparent dynamic formula with custom multiplier and retail markup.
- **Bolt Dynamisch**: 100% local green dynamic contract with real-time pass-through pricing.
- **Engie Dynamic & Flextime**: EPEX pass-through and multi-tier time-of-use markups.
- **Luminus Dynamic, Ecopower, Dats 24, Octa+, Trevion, Aspiravi**.
- **Belgian Dual-Tariff (Piek/Dal) & Dutch Post-2027 Fixed Contracts**: Day/night rate schedules with DNO presets, plus optional Dutch post-saldering *terugleverkosten* (`fixed_feed_in_cost_kwh`) and statutory `>= 50%` bare-supply export floor checks.

### 5.2 DNO Grid & Distribution Presets
- **Netherlands (Liander / Enexis / Stedin)**: Statutory excl.-VAT Dutch *Energiebelasting* presets (**2026: `€0.09161/kWh`** / **2027: `€0.08802/kWh`**) + `21%` BTW (`3×25A` residential connection tier protection via per-phase DLB).
- **Fluvius (Flanders)**: €0.0204/kWh distribution grid fee or 2027 combined DNO + federal special excise (`€0.0392/kWh` = €39.20/MWh) preset + 6% BTW.
- **ORES & RESA (Wallonia — Flat or CWaPE `Tarif Impact`)**: Flat network presets (€0.0950 / €0.0920/kWh + 2027 federal excise helper) or CWaPE 7-days/week **`Tarif Impact`** (`ECO`: `01:00–07:00` & `11:00–17:00`, RESA `€0.0252` / ORES `€0.0284`; `MEDIUM`: `07:00–11:00` & `22:00–01:00`, RESA `€0.0755` / ORES `€0.0812`; `PIC`: `17:00–22:00`, RESA `€0.1258` / ORES `€0.1345` €/kWh excl. 6% BTW).
- **SIBELGA (Brussels)**: €0.0820/kWh network fee (plus 2027 federal excise preset) + 6% BTW.

### 5.3 Live 24-Hour Tariff Curve Visualizer
- **Stacked Cost Breakdown**: Visualizes the 4 cost components for every hour: Raw EPEX Spot wholesale, Supplier Markup, DNO Distribution / Energy Tax Fee, and VAT (`6%` BE residential / `21%` NL).
- **Dynamic Solar Return Line**: Shows actual feed-in compensation and highlights negative return hours with a **Solar Curtailment Advisory**.

### 5.4 Telemetry-Backed Financial Savings Estimation
GEMS computes real-time **Estimated GRID-EMS Savings** (`Today`, `Month`, `Year`, and `Lifetime`) directly from verified smart-meter, inverter, battery, and charger telemetry paired with your active retail tariff schedule—without relying on hypothetical household baselines:
- **Solar Self-Consumption Value (`solar_savings_eur`)**: Direct PV energy consumed in-home or routed locally valued at the avoided retail import rate minus any foregone positive feed-in rate.
- **Battery Discharge & Arbitrage (`battery_savings_eur`)**: Stored battery energy discharged during expensive hours valued against the actual charging cost of that stored energy.
- **Smart Off-Peak Dispatch & Negative-Export Shield (`smart_dispatch_savings_eur`)**: Verified off-peak EV/battery price-spread gains vs. the daily mean tariff plus avoided negative export charges from active solar curtailment and local sinking.
- **Capacity Peak Shaving (`peak_shaving_savings_eur`, Flanders Only)**: Avoided monthly *Capaciteitstarief* kW surcharges when active battery/EV peak shaving holds the 15-minute grid peak below unshaved site load (strictly `€0.00` and hidden outside Flanders).

---

## 6. 24-Hour Dynamic Battery Planner, EV Departure Scheduling & Thermal Buffering
- **Peak-Aware 24-Hour Battery Planning & Morning Solar Headroom (`solar_hold`)**: Evaluates 15-minute (`15m`) and hourly (`60m`) effective import and export tariffs alongside de-polluted Weekday/Weekend household load profiles and geometry-aware solar forecasts. When afternoon export prices turn unprofitable or negative, GEMS holds morning battery SoC headroom (`solar_hold`) while solar exports profitably so the battery absorbs midday solar before inverter curtailment is needed.
- **Charger-Side EV Departure Target (`+kWh by HH:MM`)**: Allocates solar surplus and the lowest-cost 15-minute slots ahead of `departure_time` while respecting Flanders capacity peak ceilings and per-phase main fuse limits, automatically engaging continuous peak-safe catch-up charging when remaining time requires it.
- **4-State SG-Ready & Thermostat Thermal Pre-Heating / Peak Shedding**: Raises thermal comfort targets during solar surplus, negative prices, or low-cost pre-peak slots (`State 3` / `State 4`) and sheds non-essential thermal boost or commands bounded `State 1` lockout only as a last resort when EV charging is already at `0 A` and battery support is maxed out.
