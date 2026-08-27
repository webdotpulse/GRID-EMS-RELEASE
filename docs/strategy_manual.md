# GEMS: Strategy & Settings Manual

This manual provides an in-depth guide to configuring and using the strategy engine within GEMS. The strategy engine is the core component that coordinates your home energy ecosystem—Grid, Solar, Battery, and EV Chargers—to optimize energy consumption, maximize self-consumption, and reduce costs.

## 1. Overview of the Strategy Engine

The strategy engine continuously evaluates your home's energy flow based on a unified configuration interface in the UI. No YAML or text configuration files are required.

The core control loop executes every second, assessing current hardware states and applying dynamic smart overrides before enacting specific geographical or behavioral strategies.

## 2. Global Site Optimization (Strategy Modes)

The primary operational behavior of the system is determined by the `strategy_mode` setting, which provides three distinct ways to optimize your home.

![Strategy Tab](../screenshots/settings_strategy.png)

### 2.1 Eco Mode
**Goal:** Maximize self-consumption of solar energy and minimize grid reliance.
- **Behavior:** This is the default setting. The system naturally tries to balance solar generation by directing excess power to connected batteries or EV chargers. It does not actively enforce rigid caps on grid imports or exports unless dynamic price charging overrides are configured.

### 2.2 Flanders Mode (Predictive Peak Shaving)
**Goal:** Prevent high capacity grid tariffs by actively avoiding power spikes, based on the Belgian/Flanders capacity tariff model.
- **Behavior:** The engine calculates a projected 15-minute rolling average for grid import. If the projection breaches the allowed threshold, it takes active measures.
- **Actions:**
  - Sequentially ramps down (throttles) EV chargers.
  - Discharges the home battery to cover immediate usage spikes.
  - Triggers proactive Webhook alerts if the limit is approaching.
- **Key Parameters:**
  - `capacity_peak_limit_kw`: The absolute maximum average quarter-hour grid import allowed.
  - `peak_shaving_buffer_w`: A safety buffer applied to prevent overshoot.
  - `peak_shaving_rampup_w`: Defines how quickly a throttled device can increase power when capacity becomes available.

### 2.3 Netherlands Mode (Zero-Export)
**Goal:** Minimize or entirely eliminate solar feed-in to the grid.
- **Behavior:** Operates with a zero-export constraint. If excess solar generation is detected, the engine attempts to sink that power locally.
- **Actions:**
  - Ramps up EV chargers or charges the home battery to absorb excess solar.
  - If local storage is full and export continues, the system will actively throttle (curtail) the solar inverter's power limit (active inverter curtailment).
- **Key Parameters:**
  - `allowed_grid_export_kw`: A hard limit on solar feed-in. Set to 0 for strict zero-export.
  - `active_inverter_curtailment`: Must be enabled to allow the system to throttle solar inverters.

## 3. Dynamic Battery Arbitrage & Schedules

GEMS leverages Day-Ahead (EPEX) spot prices and solar forecasting to smartly manage your battery, enabling you to buy cheap energy and use (or sell) it when prices are high.

### 3.1 Grid Charge Strategies (`battery_grid_charge_strategy`)
- **`price_only`**: The battery is forced to charge or discharge purely based on user-defined spot price thresholds.
- **`super_dal_only`**: Grid charging is restricted to highly optimized specific contract windows (e.g., Engie Superdal).
- **`hybrid`**: Combines price-based charging with Superdal optimizations.
- **`dynamic_forecast`**: The most advanced mode. Maps optimal hourly charge/discharge behavior over a 24-hour period based on Open-Meteo solar irradiance forecasts and the home's baseline load (`home_base_load_w`).

### 3.2 Key Battery Parameters
- **`force_charge_below_euro`**: Force charges the battery from the grid when the spot price drops below this value (€/kWh).
- **`force_discharge_above_euro`**: Force discharges the battery to the grid when the spot price spikes above this value.
- **`custom_charge_schedule`**: Configurable manual forced-charge windows (start time, end time, and target SOC).
- **`superdal_target_soc`**: The desired State of Charge (SOC) to reach by the end of an optimized time window.

## 4. Smart EV Charging

GEMS can intelligently manage your EV charging based on real-time prices or schedules.
- **`smart_ev_cheapest_hours`**: Automatically identifies the $N$ cheapest hours of the day to charge your EV. If the current hour is among the cheapest, the EV charger setpoint is boosted. If not, charging is overridden to 0A (unless custom schedules are active).
- **Custom Charging Schedules**: Allows users to define specific charging intervals and target SOCs, which supersede standard Smart EV logic.

## 5. Other Optimization Features

### 5.1 Thermal Load Control
GEMS manages smart thermostats by overriding setpoints when excess solar is available.
- Features normal and boost temperature overrides.
- Utilizes time-based hysteresis (`thermostatBoostUntil`) to prevent short-cycling of heating equipment.

### 5.2 Phase Load Balancing
The engine tracks individual phase currents (e.g., `Phase1A`, `Phase2A`, `Phase3A`) to prevent blowing main grid fuses.
- **`grid_nominal_current_a`**: Your household's main grid connection amperage (e.g., 25, 32, 40).
- If a single phase exceeds 90% of the fuse limit, the engine aggressively throttles EV chargers to protect the grid connection.

### 5.3 Appliance Turn On Excess
- **`appliance_turn_on_excess_w`**: (Note: This feature was explicitly removed from the codebase and should not be relied upon).

## 6. Energy Contracts & Pricing

In the Settings view, you can accurately map your energy bill parameters to the UI calculations to ensure optimal strategy execution based on true costs.

![Energy Contract Tab](../screenshots/settings_contract.png)

- **`contract_type`**: Select `dynamic` (market spot prices) or `fixed` (static peak/off-peak).
- **Dynamic Pricing Adjustments**:
  - Add simple flat markups (`dynamic_markup_kwh`), injection multipliers (`dynamic_inject_multiplier`), and provider-specific configurations (like base fees) to calculate the true cost of energy per kWh.
