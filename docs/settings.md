# GEMS: Settings Documentation

This document provides a comprehensive and detailed explanation of all configuration parameters within the EMS. These settings correspond directly to the `SiteSettings` struct and dictate how GEMS manages, optimizes, and interacts with your energy ecosystem.

---

## 1. Site Optimization & General Strategy

This group of settings defines the core behavior of the EMS, governing how it interacts with the grid, limits import/export, and prioritizes energy distribution among devices.

![Strategy Tab](../screenshots/settings_strategy.png)

*   **`strategy_mode`**
    *   **Description:** The primary operational behavior of the system.
    *   **Values:**
        *   `eco`: Prioritizes self-consumption of solar energy and limits reliance on the grid.
        *   `flanders`: Activates predictive Peak Shaving based on the Belgian/Flanders capacity tariff model, capping the 15-minute rolling average grid import.
        *   `netherlands`: Focuses on minimizing or eliminating solar feed-in to the grid (zero-export).
*   **`capacity_peak_limit_kw`**
    *   **Description:** The absolute maximum average quarter-hour grid import allowed. Critical for Flanders mode to avoid high capacity tariffs.
*   **`active_inverter_curtailment`**
    *   **Description:** Allows the system to actively throttle solar inverters' active power limit to respect the `allowed_grid_export_kw` setting. Often used in Netherlands mode for zero-export.
*   **`min_profitable_export_price`**
    *   **Description:** In Netherlands mode (Smart Saldering), the system will dynamically curtail solar export only when real-time EPEX spot prices drop below this profitability threshold.
*   **`battery_grid_charge_strategy`**
    *   **Description:** Defines how the system uses the grid to charge the battery.
    *   **Values:**
        *   `price_only`: Charges based on simple EPEX spot price thresholds (`force_charge_below_euro`).
        *   `super_dal_only`: Restricts grid charging to specific highly optimized contract windows (like Engie Superdal).
        *   `hybrid`: Combines price-based charging with Superdal optimization.
        *   `dynamic_forecast`: Maps optimal hourly charge/discharge behavior based on solar weather forecasts and the home's baseline load.
*   **`force_charge_below_euro`**
    *   **Description:** Force charges the battery from the grid when the day-ahead spot price drops below this value (€/kWh). Used in `price_only` and `hybrid` battery strategies.
*   **`force_discharge_above_euro`**
    *   **Description:** Force discharges the battery to the grid when the spot price spikes above this value (€/kWh). Used for Day-Ahead BESS Arbitrage.
*   **`smart_ev_cheapest_hours`**
    *   **Description:** Automatically identifies the specified number of cheapest hours of the day to charge your EV.
*   **`grid_nominal_current_a`**
    *   **Description:** Your household's main grid connection amperage (e.g., 25, 32, 40). The system proactively throttles chargers to protect the main fuse if total load exceeds this limit.
*   **`phase_limit_amps`**
    *   **Description:** The maximum current allowed per individual phase. Used by the phase load balancing logic to prevent phase unbalance.
*   **`grid_system`**
    *   **Description:** Specifies the physical wiring setup of your grid connection.
    *   **Values:** E.g., `single_phase_230v` or `three_phase_400v`. Adjusts power-to-amps calculations across the system.
*   **`allowed_grid_import_kw`**
    *   **Description:** A hard continuous limit on grid import. Devices will be throttled to respect this threshold.
*   **`allowed_grid_export_kw`**
    *   **Description:** A hard continuous limit on solar feed-in to the grid. Set to 0.0 for strict zero-export.
*   **`peak_shaving_buffer_w`**
    *   **Description:** The safety margin applied when nearing the capacity peak limit (in Flanders mode) to prevent overshoot.
*   **`peak_shaving_rampup_w`**
    *   **Description:** Defines how quickly a throttled device (like an EV charger) is allowed to increase its power consumption when grid capacity frees up.

---

## 2. System Information and Location

Settings related to the physical location and general system preferences.

![System Info Tab](../screenshots/settings_system_info.png)

*   **`timezone`**
    *   **Description:** The timezone of the installation, critical for accurately mapping day-ahead prices and 15-minute billing cycles.
*   **`log_level`**
    *   **Description:** Controls the verbosity of backend system logs (e.g., `info`, `debug`, `error`).
*   **`language`**
    *   **Description:** The user's preferred language for the UI (managed via vue-i18n, e.g., `en`, `nl`, `fr`).
*   **`address`**
    *   **Description:** The physical address of the site, used for geocoding.
*   **`latitude`** & **`longitude`**
    *   **Description:** The GPS coordinates of the site. Calculated via OpenStreetMap Nominatim based on the address and used for accurate solar irradiance forecasting.

---

## 3. Energy Contract Configuration

Maps your actual energy bill parameters to the UI calculations to ensure optimal strategy execution based on true costs.

![Energy Contract Tab](../screenshots/settings_contract.png)

*   **`contract_type`**
    *   **Description:** The type of energy contract you have.
    *   **Values:** `dynamic` (market spot prices) or `fixed` (static peak/off-peak rates).
*   **`fixed_price_peak_kwh`** & **`fixed_price_off_peak_kwh`**
    *   **Description:** Your import rates (€/kWh) if `contract_type` is `fixed`.
*   **`fixed_inject_price_kwh`**
    *   **Description:** The rate (€/kWh) you receive for feeding solar into the grid on a fixed contract.
*   **`dynamic_markup_kwh`**
    *   **Description:** A simple flat markup applied on top of the base EPEX spot price for import.
*   **`dynamic_inject_multiplier`**
    *   **Description:** A multiplier applied to spot prices for energy injection, often used to calculate provider feed-in fees.
*   **Provider-Specific Settings:**
    *   These settings allow for exact mapping of complex provider formulas. They include base fees, markup structures, and pricing multipliers.
    *   **Engie:** `engie_markup_peak`, `engie_markup_off_peak`, `engie_markup_super_off_peak`, `engie_multiplier`, `engie_inject_multiplier`, `engie_base_fee`
    *   **Luminus:** `luminus_markup`, `luminus_multiplier`, `luminus_inject_multiplier`, `luminus_base_fee`
    *   **Eneco:** `eneco_markup`, `eneco_multiplier`, `eneco_inject_multiplier`, `eneco_base_fee`
    *   **Frank Energie:** `frank_markup`, `frank_multiplier`, `frank_inject_multiplier`, `frank_base_fee`
    *   **Ecopower:** `ecopower_markup`, `ecopower_multiplier`, `ecopower_inject_multiplier`, `ecopower_base_fee`
    *   **Enovos:** `enovos_markup`, `enovos_multiplier`, `enovos_inject_multiplier`, `enovos_base_fee`
*   **`tax_kwh`**
    *   **Description:** Country-specific volumetric energy taxes applied per kWh of import.
*   **`vat_rate`**
    *   **Description:** The Value Added Tax percentage applied to your energy costs (e.g., 6.0 or 21.0).

---

## 4. Custom Schedules & Optimization

Manual overrides and specific provider logic for targeted battery/EV charging.

*   **`custom_charge_schedule`**
    *   **Description:** A JSON string defining configurable forced-charge windows, utilizing a start time, end time, and target State of Charge (SOC).
*   **`superdal_optimization_enabled`**
    *   **Description:** Enables specific provider logic (like Engie Superdal) to charge the battery exactly during predefined cheap tariff slots.
*   **`superdal_target_soc`**
    *   **Description:** The desired State of Charge to reach by the end of the optimized time window when Superdal optimization is active.

---

## 5. Dynamic Forecast

Settings used exclusively by the `dynamic_forecast` battery strategy.

*   **`home_base_load_w`**
    *   **Description:** The estimated average background consumption of your house. Used to predict future battery depletion rates alongside solar weather forecasts.

---

## 6. System Update

Configuration for over-the-air updates.

*   **`github_token`**
    *   **Description:** A Personal Access Token (classic) to authenticate update queries against the GitHub API, preventing IP rate limits when checking for the latest GEMS releases.

---

## 7. Alerts & Notifications

Configuration for external notifications and webhook alerting.

![Notifications Tab](../screenshots/settings_notifications.png)

*   **`alert_webhook_url`**
    *   **Description:** An external URL where the EMS sends HTTP POST payloads for proactive alerts, such as consecutive device polling failures or when the capacity peak is nearing 90%.

---

## 8. Reporting

Settings for generating and delivering energy reports.

*   **`weekly_report_enabled`**
    *   **Description:** Toggles whether the EMS should automatically generate and email weekly PDF energy reports.
*   **`report_email`**
    *   **Description:** The destination email address for the generated reports.
*   **SMTP Configuration:**
    *   **Description:** Credentials and server details required for the EMS to send outbound emails.
    *   **Fields:** `smtp_host`, `smtp_port`, `smtp_username`, `smtp_password`, `smtp_sender`
