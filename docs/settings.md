# GEMS: Settings Documentation

This document provides a comprehensive and detailed explanation of all configuration parameters within GEMS (Grid Energy Management System). These settings correspond directly to the `SiteSettings` model and dictate how GEMS manages, optimizes, and interacts with your home energy ecosystem.

---

## 1. Site Optimization & General Strategy

This group of settings defines the core behavior of the EMS, governing how it interacts with the grid, limits import/export, and prioritizes energy distribution among devices.

| Strategy Tab Overview | Operational Strategy Modes |
| :---: | :---: |
| ![Strategy Tab](../screenshots/settings_strategy.png) | ![Strategy Modes](../screenshots/settings_strategy_modes.png) |

* **`strategy_mode`**
  * **Description:** The primary operational optimization mode of the system.
  * **Values:**
    * `eco`: Prioritizes self-consumption of solar energy and limits reliance on the grid.
    * `flanders`: Activates predictive Peak Shaving based on the Belgian/Flanders capacity tariff model, capping the 15-minute rolling average grid import with Smart Adaptive Ceiling support.
    * `netherlands`: Focuses on smart saldering, minimum profitable export pricing, and optional zero-export with active inverter curtailment.
* **`capacity_peak_limit_kw`**
  * **Description:** The base target 15-minute average grid import ceiling (e.g. 2.5 kW). Essential for Flanders mode to prevent expensive monthly capacity tariff spikes.
* **`peak_shaving_buffer_w`**
  * **Description:** Safety margin in Watts (e.g. 200 W) subtracted from the capacity limit to trigger proactive throttling before breaching the quarter-hour ceiling.
* **`peak_shaving_rampup_w`**
  * **Description:** Power hysteresis step (e.g. 150 W) required before re-accelerating throttled EV chargers or reducing battery discharge when capacity frees up.
* **`active_inverter_curtailment`**
  * **Description:** Allows the EMS to actively throttle solar inverter active power output via Modbus registers to match house load when dynamic market export return is negative and unprofitable. Available across all strategy modes.
* **`min_profitable_export_price`**
  * **Description:** Base threshold for profitable solar export (€/kWh). Export is permitted when real-time return is at or above this threshold minus GSC compensation. When below, excess power is sunk into battery/EV storage, and inverters are curtailed if storage is full.
* **`gsc_value_eur_mwh`**
  * **Description:** Guaranteed value of Flemish/Belgian Groenestroomcertificaten (GSC) in € per certificate or €/MWh (e.g. 250, 350, 450). Solar generation and injection remain profitable during negative spot price hours as long as the negative price does not outweigh the GSC value. Curtailment only activates when the export price drops below `min_profitable_export_price - (gsc_value_eur_mwh / 1000.0)` (e.g. at -251 €/MWh for a 250 €/MWh GSC).
* **`battery_grid_charge_strategy`**
  * **Description:** Controls how the home battery utilizes grid power for charging and arbitrage.
  * **Values:**
    * `price_only`: Charges/discharges based strictly on EPEX spot price thresholds (`force_charge_below_euro` / `force_discharge_above_euro`).
    * `super_dal_only`: Restricts grid charging to supplier off-peak contract windows (e.g. Engie Superdal).
    * `hybrid`: Combines price-based threshold charging with supplier off-peak windows.
    * `dynamic_forecast`: Solves a 24-hour cost-optimal charge/discharge curve using Open-Meteo solar forecasts and household base load.
* **`force_charge_below_euro`**
  * **Description:** Spot price threshold (€/kWh) to trigger forced grid battery charging.
* **`force_discharge_above_euro`**
  * **Description:** Spot price threshold (€/kWh) to allow battery grid feed-in during peak market rates.
* **`smart_ev_cheapest_hours`**
  * **Description:** Automatically identifies the specified number of cheapest hours of the day (e.g. 3) to charge your EV.
* **`grid_nominal_current_a`**
  * **Description:** Your household's main incoming grid connection amperage (e.g., 25, 32, 40). GEMS throttles chargers to protect the main fuse from tripping.
* **`phase_limit_amps`**
  * **Description:** The maximum current allowed per individual phase ($L_1, L_2, L_3$) for phase load balancing.
* **`grid_system`**
  * **Description:** Physical electrical grid wiring type.
  * **Values:** `single_phase_230v`, `three_phase_400v` (400V + Neutral), or `three_phase_230v_delta` (Belgian 3x230V without Neutral).
* **`allowed_grid_import_kw`**
  * **Description:** A continuous hard cap on grid import power in kW.
* **`allowed_grid_export_kw`**
  * **Description:** A continuous hard cap on solar grid feed-in in kW (set to `0.0` for strict zero-export).

---

## 2. System Information and Location

Settings related to the physical location, time synchronization, and general system diagnostics.

![System Info Tab](../screenshots/settings_system_info.png)

* **`timezone`**
  * **Description:** Installation timezone (e.g., `Europe/Brussels`, `Europe/Amsterdam`), critical for accurate day-ahead price synchronization and quarter-hour billing boundaries.
* **`address`**
  * **Description:** Street address of the installation.
* **`latitude`** & **`longitude`**
  * **Description:** GPS coordinates automatically resolved via OpenStreetMap Nominatim geocoding, used for Open-Meteo solar irradiance forecasting.
* **`log_level`**
  * **Description:** Controls backend diagnostic logging verbosity (`INFO`, `DEBUG`, `WARN`, `ERROR`).
* **`language`**
  * **Description:** UI language (`en`, `nl`, `fr`, `de`).

---

## 3. Energy Contract & Regional Dynamic Pricing

Configures your supplier contract formula to calculate real-time net import and export costs.

| Energy Contract Configuration | 24-Hour Tariff Visualizer Curve |
| :---: | :---: |
| ![Energy Contract Tab](../screenshots/settings_contract.png) | ![Tariff Visualizer](../screenshots/settings_contract_tariffs.png) |

### 3.1 Contract Types (`contract_type`)
* `totalenergies_dynamic`: TotalEnergies Pixel Dynamic (Belgium EPEX Spot BE pass-through).
* `mega_dynamic`: Mega Smart / Cosy Dynamic (Belgium).
* `bolt_dynamic`: Bolt Dynamisch (Belgium 100% local green pass-through).
* `engie_dynamic`: Engie Dynamic Day-Ahead (Belgium).
* `engie_flextime`: Engie Flextime Time-of-Use structure.
* `luminus_dynamic`: Luminus Dynamic (Belgium).
* `eneco_dynamic`: Eneco Dynamic (Belgium / Netherlands).
* `frank_energie_dynamic`: Frank Energie Dynamic (BE / NL).
* `ecopower_dynamic`: Ecopower Dynamic (Belgium).
* `dats24_dynamic`: Dats 24 Dynamisch (Belgium).
* `octa_dynamic`: Octa+ Dynamic (Belgium).
* `trevion_dynamic`: Trevion Dynamisch (Belgium).
* `aspiravi_dynamic`: Aspiravi Dynamisch (Belgium).
* `belgian_dual_tariff`: Belgian Fixed Peak/Off-Peak (Piek/Dal + 6% BTW).
* `fixed`: Generic Fixed Rate structure.
* `dynamic`: Generic EPEX Dynamic structure.
* `enovos_dynamic`: Enovos Dynamic (Luxembourg).

### 3.2 Dynamic Formula Parameters
For Belgian dynamic contracts, the effective import price is calculated as:
$$\text{Price}_{\text{import}} = \left( (\text{EPEX} \times \text{Multiplier}) + \text{Markup} + \frac{\text{BaseFee}}{8760} + \text{DNO}_{\text{tax}} \right) \times (1 + \text{VAT})$$

And dynamic solar export return:
$$\text{Price}_{\text{export}} = (\text{EPEX} \times \text{InjectMultiplier}) - \text{InjectMarkup}$$

* **`tax_kwh`**: Distribution grid & transmission taxes per consumed kWh (e.g., `0.0204` €/kWh for Fluvius Flanders, `0.0950` €/kWh for ORES Wallonia).
* **`vat_rate`**: Value Added Tax rate entered as a decimal (e.g., `0.06` for 6% BTW in Belgium, `0.21` for 21% in the Netherlands).
* **Provider Multipliers & Markups**: Dedicated parameters for each supplier (e.g. `totalenergies_multiplier`, `totalenergies_markup`, `totalenergies_base_fee`, `totalenergies_inject_multiplier`, `totalenergies_inject_markup`).

---

## 4. Custom Schedules & Optimization

Manual overrides and scheduled charging windows.

* **`custom_charge_schedule`**
  * **Description:** A JSON string defining forced battery charging intervals with start time, end time, and target State of Charge (SOC) (e.g. `[{"start":"02:00","end":"05:00","target_soc":90}]`).
* **`superdal_optimization_enabled`**
  * **Description:** Enables provider off-peak target optimization (like Engie Superdal).
* **`superdal_target_soc`**
  * **Description:** Target State of Charge (SOC %) to achieve by the end of the off-peak window.
* **`home_base_load_w`**
  * **Description:** Household background base consumption (Watts), used by the dynamic forecast solver to predict battery depletion.

---

## 5. System Update & Remote Diagnostics

Configuration for automated OTA updates and GitHub release tracking.

* **`github_token`**
  * **Description:** Optional GitHub Personal Access Token (classic) to prevent IP rate limiting when querying the release repository for new GEMS versions.

---

## 6. Alerts & Webhook Notifications

Configuration for external webhook alerts and capacity threshold warnings.

![Notifications Tab](../screenshots/settings_notifications.png)

* **`alert_webhook_url`**
  * **Description:** HTTP(S) Webhook URL (e.g. Discord, Slack, Home Assistant) where GEMS posts instant notifications for device offline events, consecutive poll failures, or when the 15-minute capacity peak approaches 90% of the limit.
* **`weekly_report_enabled`**
  * **Description:** Toggles automatic generation and delivery of weekly PDF energy summaries.
* **`report_email`**
  * **Description:** Destination email address for automated reports.
* **SMTP Settings (`smtp_host`, `smtp_port`, `smtp_username`, `smtp_password`, `smtp_sender`)**
  * **Description:** Outbound mail server credentials for report delivery.

---

## 7. Smart Relays & Actuators

Configuration for contactors, SG-Ready heat pumps, and electric water heaters.

| Smart Relays Management | Relay Automation Rules |
| :---: | :---: |
| ![Relays Tab](../screenshots/settings_relays.png) | ![Relay Rules](../screenshots/settings_relays_rules.png) |

* **Relay Rules Engine**: Configurable trigger conditions (`excess_solar`, `negative_spot_price`, `time_schedule`), threshold values, hysteresis delays (`min_run_time`, `min_off_time`), and automated actions (`turn_on`, `turn_off`).

