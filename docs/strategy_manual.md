# GEMS: Strategy & Optimization Manual

This manual provides an in-depth guide to configuring and using the strategy engine within GEMS (Grid Energy Management System). The strategy engine is the core component that coordinates your home energy ecosystem—Grid, Solar, Battery, EV Chargers, and Smart Relays—to optimize energy consumption, maximize self-consumption, avoid peak capacity grid surcharges, and execute cost-effective energy arbitrage.

> [!TIP]
> **Download Official Field Manuals (PDF):**
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

### 2.1 Eco Mode (Maximum Self-Consumption)
**Goal:** Maximize direct self-consumption of rooftop solar generation and minimize grid reliance.
- **Behavior:** Directs surplus solar generation to home battery charging and EV charging before feeding into the grid. When solar diminishes, the home battery automatically discharges to support household base loads.
- **Suitability:** Ideal for installations with standard net-metering, flat tariffs, or high feed-in compensation.

### 2.2 Flanders Mode (Predictive Peak Shaving & Adaptive Ceiling)
**Goal:** Actively prevent high capacity tariff (*Capaciteitstarief*) surcharges in Flanders/Belgium by capping 15-minute average power spikes.
- **Mechanism:**
  - Continuously calculates projected 15-minute rolling average grid import:
    $$P_{\text{projected}} = \frac{E_{\text{elapsed}} + P_{\text{inst}} \times (900 - t_{\text{elapsed}})}{900}$$
  - If $P_{\text{projected}} > (\text{Limit} - \text{Buffer})$, the system instantly throttles EV charging current and commands the battery to discharge.
- **Smart Adaptive Ceiling:**
  - GEMS stores monthly peak import records in the SQLite database (`/api/peaks/monthly`).
  - If an unavoidable peak occurs during the month (e.g. 4.2 kW caused by oven + induction cooking), GEMS dynamically adapts its operational ceiling up to that incurred peak for the rest of the calendar month.
  - This allows the homeowner to charge their EV faster and utilize available capacity without increasing their capacity tariff bill.
- **Key Parameters:**
  - `capacity_peak_limit_kw`: Base target 15-minute grid import ceiling (e.g., `2.5` kW).
  - `peak_shaving_buffer_w`: Proactive safety buffer in Watts (e.g., `200` W) subtracted from the ceiling to prevent overshoot.
  - `peak_shaving_rampup_w`: Deadband hysteresis power step (e.g., `150` W) required before throttled devices ramp back up.

### 2.3 Netherlands Mode (Smart Saldering & Zero-Export)
**Goal:** Mitigate solar export penalties, negative Day-Ahead prices, and phasing out of Dutch salderingsregeling.
- **Behavior:**
  - Maximizes local battery charging and EV absorption when solar production exceeds household load.
  - **`min_profitable_export_price`**: Dynamically allows solar feed-in only when the real-time export return is profitable.
  - **`active_inverter_curtailment`**: If storage is full and market prices drop below the minimum profitable threshold, GEMS actively curtails solar inverter active power output via Modbus registers.

### 2.4 Flemish Groenestroomcertificaten (GSC) Value Protection
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
- **`dynamic_forecast`**: Computes an optimal 24-hour linear schedule by combining EPEX hourly spot prices with solar forecasts and baseline household consumption (`home_base_load_w`).

### 3.2 Custom Scheduled Windows
Users can define multiple custom charging windows with precise start/end times and target SOC percentages (e.g., 02:00 - 05:00 to 90% SOC). Custom schedules take priority over general arbitrage logic.

---

## 4. Smart EV Charging (Preferred Modbus TCP & Native OCPP)

GEMS controls smart EV charging stations via **Modbus TCP fieldbus (preferred)** or its embedded **Native OCPP 1.6-J / 2.0.1 WebSocket server** (`ws://<EMS-IP>:8887/<ChargePointID>`):

- **Why Modbus TCP is Preferred**: Modbus register writes provide instantaneous, sub-second current throttling (6A to 32A). This is essential for reactive Flanders capacity peak shaving and solar surplus matching. Crucially, it allows home or fleet wallboxes to remain connected to employer reimbursement / CPO backends (E-Flux, Road, Optimile, Easee Cloud) over OCPP without interference.
- **Native OCPP Server**: Available for chargers without Modbus TCP or installations requiring standalone, zero-cloud residential charging.
- **`smart_ev_cheapest_hours`**: Automatically scans the 24-hour EPEX tariff curve and boosts EV charging current during the $N$ cheapest hours of the day.
- **Dynamic Load Balancing**: Continuously balances EV setpoints against main grid fuse limits (`grid_nominal_current_a`) and phase imbalances (`phase_limit_amps`).

---

## 5. 24-Hour Effective Tariff Visualizer & Belgian Contracts

| Energy Contract Configuration | 24-Hour Tariff Visualizer Curve |
| :---: | :---: |
| ![Energy Contract Tab](../screenshots/settings_contract.png) | ![Tariff Visualizer](../screenshots/settings_contract_tariffs.png) |

### 5.1 Supported Belgian Provider Presets
- **TotalEnergies Pixel Dynamic**: Multiplier, markup (€/kWh), annual base subscription fee, and injection deductions.
- **Mega Smart / Cosy Dynamic**: Transparent dynamic formula with custom multiplier and retail markup.
- **Bolt Dynamisch**: 100% local green dynamic contract with real-time pass-through pricing.
- **Engie Dynamic & Flextime**: EPEX pass-through and multi-tier time-of-use markups.
- **Luminus Dynamic, Eneco, Frank Energie, Ecopower, Dats 24, Octa+, Trevion, Aspiravi**.
- **Belgian Dual-Tariff (Piek/Dal)**: Day/night rate schedules with DNO distribution grid fee presets.

### 5.2 DNO Grid & Distribution Presets
- **Fluvius (Flanders)**: €0.0204/kWh distribution grid and transmission excise + 6% BTW.
- **ORES (Wallonia)**: €0.0950/kWh network fee + 6% BTW.
- **RESA (Liège)**: €0.0920/kWh network fee + 6% BTW.
- **SIBELGA (Brussels)**: €0.0820/kWh network fee + 6% BTW.

### 5.3 Live 24-Hour Tariff Curve Visualizer
- **Stacked Cost Breakdown**: Visualizes the 4 cost components for every hour: Raw EPEX Spot wholesale, Supplier Markup, DNO Distribution Fee, and Taxes & 6% VAT.
- **Dynamic Solar Return Line**: Shows actual feed-in compensation and highlights negative return hours with a **Solar Curtailment Advisory**.
