# Supported Devices & Hardware Integration Reference

> 🌐 **Language**: **🇬🇧 English** | [🇳🇱 Nederlands (`Supported_devices.nl.md`)](Supported_devices.nl.md) | [🇫🇷 Français (`Supported_devices.fr.md`)](Supported_devices.fr.md)

> **GEMS (Grid Energy Management System)** — Complete Hardware Compatibility, Register Telemetry, Writable Setpoints, and Practical Automation Capabilities for All 172 Hardware Profiles (184 Registered Templates).

---

## Table of Contents

1. [Executive Overview & System Architecture](#executive-overview--system-architecture)
2. [What GEMS Actually Does With Devices](#what-gems-actually-does-with-devices)
3. [Summary Matrix by Category](#summary-matrix-by-category)
   - [Solar & Hybrid Inverters (37 Devices)](#summary-table-solar--hybrid-inverters-37-devices)
   - [Dedicated Battery Storage Systems (18 Devices)](#summary-table-dedicated-battery-energy-storage-systems-bess-18-devices)
   - [EV Charging Stations & Wallboxes (61 Devices)](#summary-table-electric-vehicle-ev-charging-stations--wallboxes-61-devices)
   - [Grid Smart Meters & Energy Analyzers (40 Devices)](#summary-table-grid-smart-meters--energy-analyzers-40-devices)
   - [Smart Relays & Load Actuators (12 Devices)](#summary-table-smart-relays--load-actuators-12-devices)
4. [Detailed Per-Device Breakdown](#detailed-per-device-breakdown)
   - [1. Solar & Hybrid Inverters (37 Devices)](#1-solar--hybrid-inverters-37-devices)
   - [2. Dedicated Battery Storage Systems (18 Devices)](#2-dedicated-battery-energy-storage-systems-bess-18-devices)
   - [3. EV Charging Stations & Wallboxes (61 Devices)](#3-electric-vehicle-ev-charging-stations--wallboxes-61-devices)
   - [4. Grid Smart Meters & Energy Analyzers (40 Devices)](#4-grid-smart-meters--energy-analyzers-40-devices)
   - [5. Smart Relays & Load Actuators (12 Devices)](#5-smart-relays--load-actuators-12-devices)
5. [Communication Protocols & Network Configuration](#communication-protocols--network-configuration)

---

## Executive Overview & System Architecture

GEMS is a lightweight, low-latency, fully UI-driven Energy Management System optimized to run on a Raspberry Pi (Debian/Linux). The entire system operates **locally first**, executing a high-speed closed-loop regulation cycle every second. Zero YAML or configuration files are required: all hardware discovery, configuration, and control are managed entirely through the web interface.

### Commercial Support Tiers & Capability Badges
Every native hardware driver in GEMS is classified into an explicit commercial support tier and capability profile:
- **Verified (`verified`)**: Field-validated Tier-1 commercial drivers (including reference platforms **Solis** and **RAEDIAN**, standard SunSpec inverters, DSMR/P1 meters, Eastron/Carlo Gavazzi/Chint/Siemens Modbus meters, OCPP 1.6-J wallboxes, and Shelly/SG-Ready relays). Displayed by default during commissioning and onboarding.
- **Experimental (`experimental`)**: Secondary regional hardware and cloud-bridged drivers accessible via the **Show Experimental Drivers** toggle in **Settings &rarr; Devices** (with Installer Mode unlocked).
- **Monitor Only (`monitor_only`)**: Read-only telemetry drivers for closed-protocol hardware. GEMS ingests live power, energy, and phase currents into site balancing calculations without issuing unverified register writes.

### Standardized Hardware Capability Profiles
Every hardware integration in GEMS exposes a standardized set of telemetry and active control capabilities:

- **Universal Telemetry Ingestion**: Supported across all 168 hardware profiles (180 registered templates), standardizing connection health supervision, real-time active power (W), battery power (W), grid flow (W), cumulative energy (kWh), and battery State of Charge (%).
- **Dynamic EV Current & Phase Control**: Implemented by smart EV chargers for real-time current modulation (6A–32A) and automated 1-phase / 3-phase contactor switching.
- **Bidirectional Storage Control & Dynamic BMS Limits**: Implemented by hybrid inverters and dedicated BESS platforms for forced charge/discharge dispatch while honoring live BMS cell temperature and top-of-charge power limits.
- **Active Solar Curtailment**: Implemented by solar inverters for proportional active power derating during negative spot price hours, Flemish DSO telecontrol events, and Dutch zero-export compliance.
- **Smart Relay & SG-Ready Actuation**: Implemented by smart contactors, heat pump interfaces, and linear PV diverters for domestic hot water and space-heating boost states.
- **Directional Phase Current & Voltage Sensing**: Implemented by smart meters and advanced chargers to report per-phase currents ($I_{L1}, I_{L2}, I_{L3}$) and voltages ($V_{L1}, V_{L2}, V_{L3}$) for main fuse protection.
- **Extended Utility & Fiscal Peak Metering**: Implemented by DSMR/P1 and utility meters to track export counters, coupled gas consumption ($m^3$), and the official 15-minute rolling average capacity tariff peak demand (W).
- **Multi-Connector EVSE Coordination**: Implemented by dual-socket stations (such as RAEDIAN Gemini) to manage independent telemetry and coordinated current limits across multiple charging ports.

---

## What GEMS Actually Does With Devices

GEMS coordinates devices into a unified, intelligent energy ecosystem. Below are the specific real-world automated actions executed by the GEMS strategy engine:

### 1. 🌞 Eco Mode (100% Solar Self-Consumption)
- **Behavior**: The engine continuously monitors instantaneous behind-the-meter solar surplus.
- **Action**: Surplus power is routed sequentially:
  1. First, charges the home battery (BESS) up to its target capacity.
  2. Second, modulates EV charging current from 6A to 32A (or switches from 1-phase to 3-phase) to absorb remaining solar surplus.
  3. Third, triggers smart relays to power domestic hot water (DHW) immersion heaters or SG-Ready heat pumps.
- **Result**: Prevents feeding power back into the grid at low feed-in tariffs, maximizing self-consumption of free green energy.

### 2. 🇧🇪 Flanders Capacity Tariff Peak Shaving & Dynamic Adaptive Ceiling
- **Behavior**: Actively prevents high Flemish capacity tariff (*Capaciteitstarief*) monthly surcharges by monitoring household grid demand across every synchronized 15-minute billing window.
- **Action**: Whenever projected quarter-hour average import approaches your configured capacity ceiling minus safety buffer:
  1. Immediately throttles EV charging current down to 6A or pauses charging (0A).
  2. Commands hybrid battery storage to discharge power into the household to shave the peak.
  3. Disengages non-critical smart relays.
- **Dynamic Adaptive Ceiling**: If an unavoidable domestic spike occurs during the month (e.g. 4.8 kW from cooking + oven), GEMS automatically adjusts its operational ceiling up to that incurred peak for the rest of the calendar month. This allows the homeowner to charge their car faster without increasing their monthly capacity bill by a single euro.

### 3. 🇳🇱 Netherlands Zero-Export & Solar Curtailment
- **Behavior**: Protects Dutch homeowners from grid export penalty charges and phase-out of the *salderingsregeling*.
- **Action**: Prioritizes local battery charging and EV absorption. If storage is full and grid export exceeds connection thresholds, GEMS writes Modbus curtailment limits to solar inverters (`SetActivePowerLimit`) to throttle or stop export entirely.

### 4. 💶 Negative Spot Price Protection & Flemish GSC Subsidy Shield
- **Behavior**: Protects homeowners with dynamic energy contracts (EPEX Spot Day-Ahead) from paying export penalties during negative electricity price hours (e.g. sunny weekends with low industrial demand).
- **Action**: Automatically curtails solar inverters whenever the spot export price falls below `min_profitable_export_price`.
- **Groenestroomcertificaten (GSC) Subsidy Shield**: For legacy Belgian installations receiving green certificates (e.g. €250/MWh or €0.25/kWh), naive curtailment would lose substantial subsidy income! GEMS applies the formula:
  $$\text{Effective Curtailment Threshold} = \text{min\_profitable\_export\_price} - \frac{\text{gsc\_value\_eur\_mwh}}{1000.0}$$
  With a €250/MWh subsidy, GEMS keeps solar injection active down to **-€0.250/kWh**, only curtailing if the negative penalty exceeds the subsidy value.

### 5. 🔋 EPEX Day-Ahead Dynamic Battery Arbitrage
- **Behavior**: Integrates Day-Ahead spot market electricity prices (retrieved daily at 14:00 CET) with Open-Meteo 24-hour solar irradiance forecasts.
- **Action**:
  - **Force Charging**: Commands the home battery to charge from the grid during the cheapest/negative hours of the day (e.g. 02:00–05:00 or negative afternoon hours) or provider off-peak windows (e.g. Engie Superdal).
  - **Peak Discharge**: Preserves or discharges battery power during evening peak price hours (18:00–21:00) to power the house without drawing from the grid.

### 6. 🚗 Smart EV Charging (Cheapest Hours Boost)
- **Behavior**: Automatically scans the 24-hour EPEX tariff curve to identify the $N$ cheapest hours of the day (`smart_ev_cheapest_hours`).
- **Action**: Boosts EV charging to maximum current (16A or 32A) during those specific hours, throttling to 0A during high-price hours unless user schedules override.

### 7. ⚡ Dynamic Phase Load Balancing & Main Fuse Protection
- **Behavior**: Continuously monitors individual phase currents ($I_{L1}, I_{L2}, I_{L3}$) at the smart meter against the home's main grid connection fuse limit (`grid_nominal_current_a`, e.g. 25A, 32A, 40A, or 63A).
- **Action**: If any individual phase exceeds 90% of the breaker limit, GEMS immediately throttles down the EV charger within milliseconds to prevent tripping the main domestic circuit breaker.

### 8. 🔌 Dynamic Phase Switching (1-Phase / 3-Phase)
- **Behavior**: EV charging requires a minimum current of 6A. On a 3-phase connection, 3x6A = 18A (~4.1 kW), which means solar surplus below 4.1 kW cannot charge the vehicle without importing grid power.
- **Action**: For supported chargers (e.g. go-e, RAEDIAN, Alfen, Mennekes, Peblar, Huawei), GEMS commands 1-phase mode (1.4 kW to 7.4 kW) when solar surplus is modest, and automatically switches to 3-phase mode (4.1 kW to 22 kW) once solar surplus exceeds 4.2 kW.

### 9. 🚰 Thermal Storage & Smart Relay Automation
- **Behavior**: Controls heating equipment via potential-free relay contacts or smart plugs.
- **Action**: Turns on contactors for domestic hot water (DHW) boilers, pool pumps, or triggers Heat Pump **SG-Ready Operating State 3 (Boost mode)** when solar export exceeds configurable thresholds (e.g. > 1500W for 2 minutes). Enforces strict minimum run-time and off-time hysteresis to prevent short-cycling.

---

## Summary Matrix by Category

### Summary Table: Solar & Hybrid Inverters (37 Devices)

| Device Name | Template ID | Vendor | Protocol | Default Port / Bus | Data Read | Data Written / Controlled | Key GEMS Automation Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ABB / Fimer Solar & Hybrid Inverter** | `abb_fimer_inverter` | ABB / Fimer | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+3 more) | Active Power Curtailment Limit (W or %) | SunSpec standard Modbus integration: real-time PV generation monitoring, REACT 2 battery telemetry, and zero-export curtailment. |
| **Afore Hybrid Inverter** | `afore_inverter` | Afore | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Live BMS Charge/Discharge Limits (W), Grid Import / Export Power (W) | EMS Battery Force Charge / Discharge Setpoints (`3000`–`3004`) & Active Power Curtailment (`3005`) | Closed-loop hybrid battery arbitrage, capacity peak shaving, and negative-price PV curtailment with 300s hardware watchdog. |
| **Alpha ESS Storion SMILE** | `alpha_ess_inverter` | Alpha ESS | `MODBUS` | Default Port: 502 or 8502, Slave ID: 85 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+3 more) | Dispatch Mode & Forced Battery Charge / Discharge (W) + Active Curtailment | Closed-loop SMILE hybrid storage arbitrage, Flanders peak shaving, and negative-price curtailment. |
| **Anker SOLIX X1 Hybrid Inverter** | `anker_inverter` | Anker | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+4 more) | EMS Battery Charge / Discharge Power Setpoints & Active Curtailment | Full 3-phase SOLIX X1 hybrid telemetry, battery peak shaving, and PV export curtailment. |
| **Autarco Solar & Hybrid Inverter** | `autarco_inverter` | Autarco | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Power (W), Battery SOC (%), Grid Import/Export Power (W) | Monitor-Only (Read-Only Telemetry) | Telemetry ingestion into GEMS real-time flow chart and solar surplus balancing. |
| **Chisage ESS C&I / Hybrid Storage** | `chisage_ess` | Chisage ESS | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Generation (W), Battery Charge/Discharge Power (W), Battery SOC (%), Grid Power (W) | Monitor-Only (Read-Only Telemetry) | Commercial & industrial hybrid storage telemetry ingestion for site load balancing. |
| **Delta Electronics Solar Inverter** | `delta_inverter` | Delta Electronics | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Generation Power (W), Cumulative Energy (kWh), Battery Power (W), SOC (%) | SunSpec M123 Active Power Curtailment & M124 Storage Control | Standardized SunSpec telemetry, active PV curtailment, and storage dispatch. |
| **Deye / Sunsynk Hybrid Inverter** | `deye_inverter` | Deye | `MODBUS` | Default Port: 502 or 8899, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+3 more) | Battery Force Charge / Discharge Setpoints & Active Power Curtailment | Closed-loop Deye/Sunsynk hybrid storage control, capacity peak shaving, and solar curtailment. |
| **Enerlution Hybrid Inverter** | `enerlution_inverter` | Enerlution | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+3 more) | Active Power Curtailment Limit (W or %) & Battery Control | Full active curtailment and hybrid storage integration. |
| **Enphase IQ Gateway / Envoy** | `enphase_envoy` | Enphase | `HTTP` | Default Port: 80 / 443, Local HTTPS | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+4 more) | Local Gateway Telemetry & Supported Profile Dispatch | Integrates Enphase microinverter arrays and IQ Battery telemetry without cloud reliance. |
| **FoxESS H1 / H3 / H3-Pro Hybrid Inverter** | `foxess_inverter` | FoxESS | `MODBUS` | Default Port: 502, Slave ID: 1 or 247 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+3 more) | Work Mode, Battery Charge / Discharge Limits & Active Curtailment | Full local Modbus hybrid battery arbitrage, peak shaving, and PV export curtailment. |
| **Fronius Gen24 Inverter** | `fronius_inverter` | Fronius | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+2 more) | SunSpec M123 Curtailment & M124 BYD Storage Control | Closed-loop SunSpec control for Fronius Gen24 & Symo installations with BYD storage. |
| **GoodWe Inverter** | `goodwe_inverter` | GoodWe | `MODBUS` | Default Port: 502 or 8899, Slave ID: 247 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+2 more) | EMS Mode, Battery Charge / Discharge Power & Export Limit | Full local Modbus control of GoodWe ET/EH/ES hybrid inverters and storage. |
| **Growatt Inverter** | `growatt_inverter` | Growatt | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+2 more) | Battery First / Load First Dispatch & Active Power Limit | Closed-loop Growatt SPH/MIN/MOD hybrid battery control and active curtailment. |
| **Huawei Hybrid Inverter** | `huawei_inverter` | Huawei | `MODBUS` | Default Port: 502, Slave ID: 1 or 2 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+2 more) | Active Power Curtailment Limit & LUNA2000 Forced Charge / Discharge | Full bidirectional LUNA2000 battery control and zero-export curtailment. |
| **HYXiPOWER Solar & Hybrid Inverter** | `hyxipower_inverter` | HYXiPOWER | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Generation (W), Battery Charge/Discharge Power (W), Battery SOC (%), Grid Power (W) | Monitor-Only (Read-Only Telemetry) | Real-time hybrid flow monitoring and site energy accounting. |
| **KSTAR BluE Solar & Hybrid Inverter** | `kstar_inverter` | KSTAR | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Power (W), Battery Power (W), SOC (%), Grid Power (W) | EMS Battery Charge / Discharge Power Setpoints (`10109`–`10112`) & Active Power Curtailment (`10105`) | Full closed-loop residential and C&I BluE hybrid battery control and active PV curtailment. |
| **KACO blueplanet hybrid NH3 / gridsave TL3** | `kaco_inverter` | KACO | `MODBUS` | Default Port: 502, Unit ID: 1 | Solar PV Active Power (W), Cumulative Energy (kWh), Battery Power (W), SOC (%), Live BMS Charge/Discharge Limits (W), 3-Phase Currents & Voltages. | SunSpec M123 Active Power Curtailment (`40232`–`40236`) & M124 Storage Control (`40348`–`40356`) | Full closed-loop control for KACO blueplanet hybrid 6.0–12.0 NH3 and commercial gridsave inverters. |
| **LG ESS Home (8 / 10 / 15)** | `lg_ess` | LG | `HTTP` | Default Port: 80 / 443, Local HTTPS | Solar PV Active Generation Power (W), Grid Import / Export Power (W), Lifetime Solar Generation Energy (kWh) (+1 more) | Local Winter / Charge / Discharge Control | Local LAN telemetry and storage mode management for LG ESS Home systems. |
| **Marstek Venus / Jupiter Storage** | `marstek_storage` | Marstek | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+2 more) | Bidirectional AC Charge / Discharge Power Setpoints | Closed-loop control for residential AC-coupled Marstek Venus and Jupiter storage. |
| **SAJ eSolar (H1 / H2 / R5 / R6 Hybrid Inverter)** | `saj_hybrid` | SAJ | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+3 more) | Passive EMS Battery Charge / Discharge & Active Power Limit | Closed-loop SAJ H1/H2 hybrid storage dispatch and active solar curtailment. |
| **SMA Sunny Boy / Tripower / Storage Inverter** | `sma_inverter` | SMA | `MODBUS` | Default Port: 502, Slave ID: 126 or 3 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+4 more) | Active Power Curtailment (W / %) & Storage Charge / Discharge Setpoints | Full closed-loop SMA Speedwire/Modbus curtailment and battery peak shaving. |
| **Senergy (SE Series / Hybrid Inverter)** | `senergy_inverter` | Senergy | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+2 more) | Proportional Battery Charge / Discharge & Active Curtailment | Closed-loop Senergy SE hybrid battery arbitrage and export curtailment. |
| **Sigenergy SigenStor (Hybrid Inverter & Storage)** | `sigenergy_hybrid` | Sigenergy | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+3 more) | Remote EMS Charge / Discharge Setpoints & PV Curtailment | Full high-precision 5-in-1 SigenStor storage dispatch and active curtailment. |
| **SofarSolar (HYD / G3 / AMASS Hybrid Inverter)** | `sofarsolar_hybrid` | SofarSolar | `MODBUS` | Default Port: 8899 or 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+3 more) | Passive Mode Battery Charge / Discharge & Export Derating | Closed-loop SofarSolar HYD G3 battery peak shaving and active curtailment. |
| **Solinteg Integ M Hybrid Inverter** | `solinteg_inverter` | Solinteg | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Power (W), Battery Power (W), Battery SOC (%), Grid Power (W) | Monitor-Only (Read-Only Telemetry) | Integ M hybrid series telemetry ingestion and grid power flow balancing. |
| **Solplanet (AISWEI) Hybrid Inverter** | `solplanet_inverter` | Solplanet (AISWEI) | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Power (W), Battery Power (W), Battery SOC (%), Grid Power (W) | Battery Charge / Discharge Control & Active Curtailment | ASW H-T series hybrid telemetry and active storage/curtailment control. |
| **SolaX Inverter** | `solax_inverter` | SolaX | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+2 more) | Remote Control Charge / Discharge Wattage & Export Limit | Closed-loop SolaX X1/X3 hybrid battery arbitrage and active curtailment. |
| **SolarEdge 3-Phase Inverter** | `solaredge_3phase` | SolarEdge | `MODBUS` | Default Port: 1502 or 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+2 more) | Dynamic Active Power Limit & StorEdge Remote Charge / Discharge | Closed-loop SunSpec 3-phase SolarEdge curtailment and battery dispatch. |
| **SolarEdge Inverter** | `solaredge_inverter` | SolarEdge | `MODBUS` | Default Port: 1502 or 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+2 more) | Dynamic Active Power Limit & StorEdge Remote Charge / Discharge | Closed-loop SunSpec 1-phase SolarEdge curtailment and battery dispatch. |
| **Solis Hybrid & Retrofit Inverters** *(Primary Reference)* | `solis_hybrid` / `solis_retrofit` | Solis | `MODBUS` | Default Port: 502 or 8899, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Battery SOC (%), Grid Power (W), Cumulative Generation (kWh), 3-Phase Currents & Voltages | Active Power Curtailment Limit (W or %), Force Battery Charge / Discharge (W) | Primary reference hybrid & retrofit platform: dynamic solar matching, active negative-price curtailment, battery peak shaving, and Flanders ceiling protection. |
| **Sungrow Inverter** | `sungrow_inverter` | Sungrow | `MODBUS` | Default Port: 502, Slave ID: 1 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+2 more) | EMS Forced Charge / Discharge Power & Active Curtailment | Closed-loop Sungrow SH hybrid battery dispatch and active solar curtailment. |
| **Victron Inverter/GX** | `victron_inverter` | Victron | `MODBUS` | Default Port: 502, Unit ID: 100 | Solar PV Active Generation Power (W), Battery Charge / Discharge Power (W), Grid Import / Export Power (W) (+2 more) | ESS Grid Setpoint Regulation & Solar Feed-In Curtailment | Closed-loop Venus OS / MultiPlus-II ESS battery arbitrage, peak shaving, and zero-export control. |
| **APsystems EZ1-M / EZ1-D Local Microinverter** | `apsystems_ez1` | APsystems | `REST` | Default Port: 8050, Local HTTP API | Channel 1 & Channel 2 PV Active Power (W), Lifetime Cumulative Generation Energy (kWh). | Direct Local Max AC Output Power Setpoint (`/setMaxPower?p=30..800` W). | 100% cloud-free local microinverter telemetry and stepless active power curtailment during negative EPEX spot prices or zero-export operation. |
| **FENECON Home / OpenEMS Edge (FEMS)** | `fenecon_fems` | FENECON | `REST` | Default Port: 8084, Local OpenEMS REST | Solar PV Production Power (W), Cumulative PV Energy (kWh), Battery Charge/Discharge Power (W), Battery SOC (%), Grid Active Power (W). | Exact ESS Charge / Discharge Active Power Setpoint (`ess0/SetActivePowerEquals` W) and PV Active Power Curtailment (`pvInverter0/SetActivePowerLimit` W). | Full closed-loop local integration for FENECON Home & OpenEMS systems: coordinates EPEX Day-Ahead battery arbitrage, Flemish capacity ceiling peak shaving, and negative-price curtailment. |
| **Hoymiles DTU-Pro / OpenDTU Microinverter** | `hoymiles_dtu` | Hoymiles | `MODBUS` | Default Port: 502 (DTU-Pro) or 80 (OpenDTU) | Aggregated & Per-Port Solar PV Active Power (W), Cumulative Solar Yield (kWh). | Active Power Output Limit (`0xC006` % on DTU-Pro Modbus; volatile RAM `limit_type=1` % on OpenDTU without EEPROM wear). | Zero-cloud microinverter monitoring and dynamic PV curtailment during negative spot market hours. |
| **KOSTAL Plenticore Plus / G2 / G3 Hybrid** | `kostal_plenticore` | KOSTAL | `MODBUS` | Default Port: 1502, Unit ID: 71 | Total DC PV Power (W), Cumulative Yield (kWh), Battery Charge/Discharge Power (W), Battery SOC (%), Grid Sensor Power (W), 3-Phase Voltages & Currents. | External Battery Management Signed Power Setpoint (Holding `1034` Float32 W) and SunSpec Model 123 Active Power Curtailment (`WMaxLimPct`). | Full closed-loop control for KOSTAL Plenticore hybrid installations: executes battery peak shaving, Day-Ahead spot arbitrage, and negative-price solar curtailment. |

### Summary Table: Dedicated Battery Energy Storage Systems (BESS) (18 Devices)

| Device Name | Template ID | Vendor | Protocol | Default Port / Bus | Data Read | Data Written / Controlled | Key GEMS Automation Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Duracell Energy Residential Storage** | `duracell_energy` | Duracell Energy | `MODBUS` | Default Port: 502, Slave ID: 1 | Battery Charge / Discharge Power (W), Battery SOC (%), Grid Power Flow (W) | Monitor-Only (Read-Only Telemetry) | Dura5 & DuraCharge residential storage telemetry integration. |
| **Dyness Battery Storage System** | `dyness_battery` | Dyness | `MODBUS` | Default Port: 502, Slave ID: 1 | Battery Charge / Discharge Power (W), Battery SOC (%), Cell Voltage & Current, Live BMS Charge/Discharge Limits (W) | Monitor-Only (Read-Only Telemetry) | Dyness Tower / Powerbox / DL5.0 BMS telemetry and dynamic BMS power limits integration. |
| **Elecnova Commercial & Industrial BESS** | `elecnova_bess` | Elecnova | `MODBUS` | Default Port: 502, Slave ID: 1 | Battery Active Power (W), Battery SOC (%), Grid Exchange Power (W), Cumulative Energy (kWh) | Monitor-Only (Read-Only Telemetry) | Large-scale C&I BESS power and SOC telemetry monitoring. |
| **Goneo Residential Storage System** | `goneo_storage` | Goneo | `MODBUS` | Default Port: 502, Slave ID: 1 | Battery Power (W), SOC (%), Grid Power Flow (W), Total Energy (kWh) | Monitor-Only (Read-Only Telemetry) | Residential ESS telemetry monitoring. |
| **Mastervolt MLI Ultra / Combi CZone** | `mastervolt_storage` | Mastervolt | `MODBUS` | Default Port: 502, Slave ID: 1 | Battery Power (W), Battery SOC (%), AC Power (W), DC Voltage (V) | Monitor-Only (Read-Only Telemetry) | Marine & off-grid CZone Modbus bridge telemetry integration. |
| **Power Sonic C&I Energy Storage** | `powersonic_bess` | Power Sonic | `MODBUS` | Default Port: 502, Slave ID: 1 | Battery Active Power (W), Battery SOC (%), Grid Power Flow (W) | Monitor-Only (Read-Only Telemetry) | Commercial BESS power and SOC telemetry monitoring. |
| **Poweroad Residential & C&I Storage** | `poweroad_storage` | Poweroad | `MODBUS` | Default Port: 502, Slave ID: 1 | Battery Power (W), SOC (%), Grid Flow (W), Total Energy (kWh) | Monitor-Only (Read-Only Telemetry) | Residential ESS & Centauri commercial BESS telemetry monitoring. |
| **Pylontech Battery Storage (US / Force)** | `pylontech_storage` | Pylontech | `MODBUS` | Default Port: 502, Slave ID: 1 | Battery Power (W), Battery SOC (%), Voltage (V), Current (A), Live BMS Charge/Discharge Limits (W) | Monitor-Only (Read-Only Telemetry) | Pylontech US2000/US3000/US5000 & Force-H1/H2 BMS telemetry and dynamic BMS limit integration. |
| **Siemens Junelight Smart Battery** | `siemens_junelight` | Siemens | `MODBUS` | Default Port: 502, Slave ID: 1 | Battery Charge / Discharge Power (W), Battery State of Charge (SOC %), Grid Power Flow (W) | Monitor-Only (Read-Only Telemetry) | Displays Junelight battery storage on the live dashboard. |
| **Sinexcel PWS Bi-Directional PCS / Commercial BESS** | `sinexcel_bess` | Sinexcel | `MODBUS` | Default Port: 502, Unit ID: 1 | Battery Active Power (`106` 0.1 kW), SOC (`109` 0.1%), Live BMS Charge/Discharge Limits (`112`–`113`), 3-Phase Voltages & Currents. | Remote PCS Run/Standby (`600`), Constant-Power Mode (`601`), Signed Active Power Setpoint (`602` 0.1 kW), and 60s Hardware Watchdog (`610`). | Industrial C&I battery peak shaving, grid capacity protection, and EPEX spot market arbitrage. |
| **Socomec SUNSYS C-System / HES BESS** | `socomec_bess` | Socomec | `MODBUS` | Default Port: 502, Slave ID: 1 | Battery Active Power (W), Battery SOC (%), Live BMS Charge/Discharge Limits (W), Grid Power Flow (W) | PCS Active Power Setpoint (`0xC100`–`0xC103` with 300s Watchdog) & SunSpec M124 Storage Control | Commercial and industrial microgrid battery peak shaving and dynamic arbitrage. |
| **Solarwatt (EnergyManager / MyReserve Matrix)** | `solarwatt_storage` | Solarwatt | `REST` | Default Port: 80, JSON endpoint:... | Battery Charge / Discharge Power (W), Battery State of Charge (SOC %), Grid Power Flow (W) (+1 more) | Monitor-Only (Read-Only Telemetry) | Local zero-cloud polling of Solarwatt EnergyManager. |
| **sonnenBatterie (eco 6 / 8 / 10 / hybrid)** | `sonnen_batterie` | Sonnen | `REST` | Default Port: 80, JSON endpoint:... | Battery Charge / Discharge Power (W), Battery State of Charge (SOC %), Grid Power Flow (W) | Force Charge / Discharge Setpoints (REST v2) | Polls sonnen local REST API v2 and dispatches storage setpoints when API token is configured. |
| **Sunwoda AtSmart Energy Storage** | `sunwoda_energy` | Sunwoda Energy | `MODBUS` | Default Port: 502, Slave ID: 1 | Battery Charge/Discharge Power (W), SOC (%), Grid Flow (W) | Monitor-Only (Read-Only Telemetry) | Residential & C&I battery telemetry monitoring. |
| **Sessy Smart Battery (AC Home Storage)** | `sessy_battery` | Sessy | `REST` | Default Port: 80, Local Dongle REST API | Battery Charge/Discharge Power (W), State of Charge (SOC %), Exported Energy (kWh), Per-Phase RMS Voltages (V) & Currents (A). | Dynamic Strategy Selection (`POWER_STRATEGY_API` vs `POWER_STRATEGY_NOM`) and Signed Watt Setpoint (`-W` Charge / `+W` Discharge). | Zero-cloud local control of Dutch-engineered Sessy retrofit batteries for solar self-consumption, Flanders capacity peak shaving, and EPEX spot arbitrage. |
| **Tesla Powerwall 2 / 3 & Backup Gateway (Local HTTPS)** | `tesla_powerwall` | Tesla Energy | `REST` | Default Port: 443, Local TEG HTTPS API | Battery Power (W), Usable State of Energy (SOC %), Site Grid Power (W), Solar Power (W), Cumulative Energy (kWh), 3-Phase Site Currents & Voltage. | Monitor-Only (Local Gateway v23+ firmware enforces read-only local telemetry). | High-speed local HTTPS ingestion of stationary Powerwall site, solar, and battery flows to drive EV charging surplus regulation and capacity peak protection. |
| **VARTA pulse / neo / element Home Storage** | `varta_storage` | VARTA | `MODBUS` | Default Port: 502, Unit ID: 255 | Battery Charge/Discharge Power (W), Battery SOC (%), Cumulative Charged Energy (kWh), Grid Sensor Power (W), Attached PV Sensor Power (W). | VARTA EMS Active Power Control (`2065` Command: Charge/Discharge/Auto, `2066` Power W; fallback `1074`). | Closed-loop local Modbus TCP control for VARTA AC-coupled storage systems: automates off-peak spot charging and household peak shaving. |
| **Zendure SolarFlow AC / Hyper 2000** | `zendure_solarflow` | Zendure | `REST` | Default Port: 80, Local HTTP JSON API | Solar Input Power (W), Battery Pack Charge & Discharge Power (W), State of Charge (`electricLevel` %). | Smart AC Mode (`acMode` Charge/Discharge) and Stepless `inputLimit` / `outputLimit` Watt Setpoints (`0–2400 W`). | 100% local zero-cloud control for plug-in and AC-coupled Zendure storage: absorbs surplus PV and discharges to cover household evening peaks. |

### Summary Table: Electric Vehicle (EV) Charging Stations & Wallboxes (61 Devices)

| Device Name | Template ID | Vendor | Protocol | Default Port / Bus | Data Read | Data Written / Controlled | Key GEMS Automation Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ABB Charger** | `abb_charger` | ABB | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (... | Sub-second current throttling over Modbus ... |
| **ABL eM4 Single/Twin (SBCx)** | `abl_em4_charger` | ABL | `MODBUS` | Default Port: 502, Unit ID: 255 ... | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Direct Modbus control: throttles single or... |
| **ABL eMH1 / eMH2 / eMH3** | `abl_emh_charger` | ABL | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), 3-Phase Charging Currents (L1, L2, L3 in Amps) | Dynamic Charging Current Throttling (... | Integrates legacy and modern ABL eMH charg... |
| **AUTEL AC MaxiCharger** | `autel_charger` | AUTEL | `OCPP` | Port: 8887, ws://<EMS-IP>:8887/<... | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Autonomous residential charging over nativ... |
| **Alfen Charger** | `alfen_charger` | Alfen | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Currents | Dynamic Charging Current Throttling (6A–32A) & 1P/3P Phase Switching | Preferred Modbus TCP integration: sub-second dynamic load balancing and solar surplus tracking. |
| **Alpitronic Hypercharger** | `alpitronic_charger` | Alpitronic | `MODBUS` | Default Port: 502 or 8887, Unit ... | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (... | Dynamically limits DC fast charging output... |
| **BMW i Wallbox (Connect/Pro)** | `bmw_charger` | BMW | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (... | Local LAN current regulation; coordinates ... |
| **Bender Charger** | `bender_charger` | Bender | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (6A–32A) | Direct Modbus TCP current control over Bender CC612/CC613 controllers. |
| **Blitzpower / Phoenix CharX** | `blitzpower_charger` | Blitzpower | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (... | Fast Modbus register regulation: modulates... |
| **Delta AC MAX / SLIM / Ultra Fast Charger** | `delta_charger` | Delta | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (... | Modulates Delta wallbox current setpoint v... |
| **EN+ AC EV Charger** | `enplus_charger` | EN+ | `OCPP` | Port: 8887 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Autonomous solar tracking and peak shaving... |
| **ETEK EKEPC2-C/S Charge Controller** | `etek_charger` | ETEK | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (... | Direct register writes to adjust charge ra... |
| **EVBox Elvi / Livo / BusinessLine** | `evbox_charger` | EVBox | `OCPP` | Port: 8887, ws://<EMS-IP>:8887/<... | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Full native OCPP support for EVBox: dynami... |
| **Easee Charger** | `easee_charger` | Easee | `CLOUD` | Cloud credentials authentication | Real-time Charging Power (W), Session Energy (kWh) | Dynamic Charging Current Throttling (6A–32A) & Pause/Resume | Rate-limited cloud API setpoint dispatch for Easee Home/Charge wallboxes. |
| **Enovates SingleWallBox** | `enovates_charger` | Enovates | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Direct local Modbus control; operates in h... |
| **Ensto Chago Wallbox / Pro** | `ensto_charger` | Ensto | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | High-reliability Scandinavian commercial/h... |
| **Etrel INCH / sonnenCharger** | `etrel_charger` | Etrel | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) | Dynamic Charging Current Throttling (... | Local Modbus TCP regulation; optimizes cha... |
| **Generic Local REST EVSE Gateway** | `generic_rest_evse` | Generic REST | `REST` | Default Port: 80, REST Endpoint: /api/v1 | Real-time Charging Power (W), Cumulative Energy (kWh) | Dynamic Charging Current Throttling (A) | Distributed multi-charger load management and dynamic peak shaving. |
| **Fronius Wattpilot (Home / Go)** | `fronius_wattpilot` | Fronius | `OCPP` | Port: 8887 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Operates Wattpilot in zero-cloud mode dire... |
| **GoodWe HCA Series EV Wallbox (Gen 2)** | `goodwe_charger` | GoodWe | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Coordinates GoodWe wallboxes with GoodWe h... |
| **Hager witty (one / plus / pro / park 2)** | `hager_charger` | Hager | `OCPP` | Port: 8887 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Zero-cloud residential management of Hager... |
| **Hardy Barth cPµ1 / cPµ2 (Salia / eCB1) Wallbox** | `hardy_barth_charger` | Hardy Barth | `REST` | Default Port: 80, `/api/v1/chargecontrols/1` or `/api/secc` | Real-Time Charging Power (W), Cumulative Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) & Voltages (V). | Local REST Current Limit (`manualmodeamp` `6–32 A` / `stop` Mode; Salia `grid_current_limit` fallback). | Zero-cloud local REST load balancing and solar surplus charging for Hardy Barth cPµ1/cPµ2 and Salia wallboxes. |
| **Huawei FusionCharge (SCharger-7KS / 22KT)** | `huawei_scharger` | Huawei | `OCPP` | Port: 8887, ws://<EMS-IP>:8887/<... | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Direct local control of Huawei FusionCharg... |
| **KEBA KeContact P30/P40** | `keba_charger` | KEBA | `MODBUS` | Default Port: 502, Unit ID: 255 | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (... | Extremely robust Austrian industrial wallb... |
| **Kempower Fast Charging Infrastructure** | `kempower_charger` | Kempower | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Session Energy (kWh), Phase Currents (L1, L2, L3 in Amps) | Monitor-Only (Use OCPP 1.6-J for Control) | High-power C&I charging infrastructure telemetry monitoring. |
| **Mennekes AMTRON (4You / 4Business / ACU / AMEDIO)** | `mennekes_ocpp` | Mennekes | `OCPP` | Port: 8887 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Universal OCPP control for modern Mennekes... |
| **Mennekes AMTRON (Xtra / Premium / HCC3 Modbus)** | `mennekes_modbus` | Mennekes | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Direct local Modbus control for Mennekes p... |
| **Mercedes-Benz Wallbox** | `mercedes_wallbox` | Mercedes-Benz | `OCPP` | Port: 8887 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Autonomous home charging for Mercedes-Benz... |
| **MyEnergi Zappi EV Charger** | `myenergi_zappi` | MyEnergi | `REST` | Default Port: 80, Local CGI / Hub API | Real-time Charging Power (W), Session Added Energy (kWh) | Fast / Eco / Stop Mode Switching & Current Throttling | Local LAN setpoint regulation of Zappi chargers without cloud latency. |
| **NRGkick (Gen 2)** | `nrgkick_gen2` | NRGkick | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Local Modbus TCP regulation for mobile/wal... |
| **OCPP Charger** | `ocpp_charger` | Generic | `OCPP` | Default Port: 8887, ws://<EMS-IP... | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Vendor-agnostic central system: supports h... |
| **Peblar EV Charger (Home / Business / Plus)** | `peblar_charger` | Peblar | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Dutch engineering wallbox: allows GEMS to ... |
| **Phoenix Contact Charx Charger** | `phoenix_charger` | Phoenix Contact | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (6A–32A) | Industrial EV charge controller Modbus TCP load balancing and peak shaving. |
| **Phoenix Contact EV-CC / CHARX (Modbus TCP)** | `phoenix_contact_evcc` | Phoenix Contact | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Direct register writes to adjust charge ra... |
| **External CPO Wallbox (OCPP 1.6-J)** | `generic_cpo_ocpp` | Generic OCPP | `OCPP` | Port: 8080 (`/api/ocpp/<ID>`) | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Zero-cloud smart charging; modulates curre... |
| **Porsche Wallbox / Mobile Charger Connect** | `porsche_wallbox` | Porsche | `OCPP` | Port: 8887 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Connects Porsche chargers directly to GEMS... |
| **RAEDIAN Gemini AC Wallbox** | `raedian_gemini` | RAEDIAN | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+3 more) | Dynamic Charging Current Throttling (... | Advanced dual-socket load management: bala... |
| **RAEDIAN NEO / NEX AC Wallbox** | `raedian_charger` | RAEDIAN | `MODBUS` | Default Port: 502, Slave ID: 1 or 2 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+2 more) | Dynamic Charging Current Throttling (... | Preferred Modbus TCP flagship integration:... |
| **SMA EV Charger (7.4 / 22 / eCharger)** | `sma_evcharger` | SMA | `REST` | Default Port: 80 / 443 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) | Monitor-Only (Read-Only Telemetry) | Local telemetry monitoring for SMA EV Charger installations. |
| **Schneider Electric EVlink (Wallbox / Pro AC)** | `schneider_evlink` | Schneider Electric | `OCPP` | Port: 8887 | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Native OCPP setpoint regulation; provides ... |
| **Siemens VersiCharge GEN3 Wallbox** | `siemens_versicharge` | Siemens | `OCPP` | Port: 8887, ws://<EMS-IP>:8887/<... | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Connects Siemens VersiCharge GEN3 to GEMS ... |
| **Sigenergy SigenStor EVAC / EVDC Charger** | `sigenergy_evac` | Sigenergy | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (... | Direct Modbus control over Sigen EV chargi... |
| **SmartEVSE v2 / v3 (HTTP / Modbus)** | `smartevse_charger` | SmartEVSE | `REST` | Default Port: 80, REST endpoint:... | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Local REST setpoint modulation; allows ope... |
| **SolarEdge EV Charger** | `solaredge_evse` | SolarEdge | `MODBUS` | Default Port: 502 / 1502, Slave ... | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (... | Synchronizes charging rate with SolarEdge ... |
| **SolaX Smart EV Charger** | `solax_evcharger` | SolaX | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh), Phase Currents (L1, L2, L3 in Amps) | Monitor-Only (Use OCPP 1.6-J for Control) | Modbus TCP telemetry monitoring (use OCPP template for active throttling). |
| **Teltonika TeltoCharge** | `teltonika_teltocharge` | Teltonika | `OCPP` | Port: 8887, ws://<EMS-IP>:8887/<ID> | Real-time Charging Power (W), Cumulative Energy (kWh), 3-Phase Currents & Voltages | Dynamic Charging Current Throttling (6A–32A) | Native OCPP server connection for residential smart charging. |
| **Veton / Phoenix CharX** | `veton_charger` | Veton | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (... | Direct Modbus TCP register writes; provide... |
| **Volkswagen / Elli / Skoda / SEAT (ID. Charger Connect / Pro)** | `elli_charger` | Volkswagen / Elli | `OCPP` | Port: 8887, ws://<EMS-IP>:8887/<... | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | Direct native OCPP server integration: all... |
| **Volt Time Source EV Charger** | `volttime_source` | Volt Time | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Energy (kWh), Phase Currents (L1, L2, L3 in Amps) | Monitor-Only (Use OCPP 1.6-J for Control) | Dutch engineered smart wallbox Modbus telemetry monitoring (use OCPP template for active throttling). |
| **Wallbox Pulsar Plus / Commander (OCPP)** | `wallbox_ocpp` | Wallbox | `OCPP` | Port: 8887, ws://<EMS-IP>:8887/<ID> | Real-time Charging Power (W), Cumulative Energy (kWh), 3-Phase Currents & Voltages | Dynamic Charging Current Throttling (6A–32A) | Direct local zero-cloud OCPP integration for Wallbox Pulsar Plus and Commander. |
| **Wallbox Pulsar/Commander** | `wallbox_charger` | Wallbox | `CLOUD` | Wallbox Cloud Credentials Authen... | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (... | Controls Wallbox charging current via clou... |
| **Webasto Next Charger** | `webasto_charger` | Webasto | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (... | Direct Modbus control: throttles Webasto w... |
| **Zaptec Pro/Go** | `zaptec_charger` | Zaptec | `CLOUD` | Zaptec OAuth2 authentication | Real-time Charging Power (W), Cumulative Session Energy (kWh) | Dynamic Charging Current Throttling (... | Cloud setpoint modulation for Zaptec wallb... |
| **go-e Charger Gemini / HOMEfix / PRO** | `goe_charger` | go-e | `HTTP` | Default Port: 80, JSON endpoints... | Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps) (+1 more) | Dynamic Charging Current Throttling (... | High-speed local HTTP API: allows GEMS to ... |
| **cFos Power Brain Wallbox / Solar** | `cfos_powerbrain` | cFos | `MODBUS` | Default Port: 4701, Unit ID: 1 | Real-Time Charging Power (W), Cumulative Imported Energy (kWh), 3-Phase Charging Currents (0.1 A), Active Phase Relay State. | 0.1 A Charging Current Limit (`8093`), Charge Enable (`8094`), and 1-Phase / 3-Phase Contactor Switching (`8087`). | High-precision 0.1 A solar surplus tracking, main breaker protection, and automated 1P/3P solar contactor switching. |
| **FoxESS EV Charger A7300 / A011K / A022K** | `foxess_evcharger` | FoxESS | `MODBUS` | Default Port: 502, Unit ID: 1 | Charging Power (W), Cumulative Energy (kWh), 3-Phase Currents (A), 3-Phase Voltages (V), Charger Status. | 0.1 kW Stepped Power Limit (`0x3002`: `1.4–4.1 kW` 1-Phase band, `4.2–22.0 kW` 3-Phase band, `0` Pause) & Auto Phase Switch (`0x300A`). | Seamless ecosystem companion for FoxESS hybrid inverters with fine-grained solar surplus modulation and 1P/3P switching. |
| **Heidelberg Energy Control / Amperfied connect.solar** | `heidelberg_ampere` | Amperfied (Heidelberg) | `MODBUS` | Default Port: 502 (TCP ID 255) or RS485 (ID 1) | Active Charging Power (W), Total Energy (kWh), 3-Phase Currents (0.1 A), 3-Phase Voltages (V), IEC Vehicle State, Active Phase Count. | 0.1 A Charging Current Limit (Holding `261`), Standby/Lock Management (`258`–`259`), and 1-Phase / 3-Phase Switching (`501` on `connect.solar`). | Sub-second 0.1 A current modulation for Flanders capacity peak shaving and seamless 1P/3P solar charging. |
| **openWB Pro / openWB series2 (HTTP & Modbus)** | `openwb_pro` | openWB | `REST` | Default Port: 80 (`/connect.php`) or 1502 (Modbus) | Real-Time Charging Power (W), Imported Energy (kWh), 3-Phase Currents (A), 3-Phase Voltages (V), Plug & Charge State, Active Phases. | 0.1 A / 0.01 A Dynamic Current Limit (`ampere` / Holding `10171`) and Automated 1-Phase / 3-Phase Contactor Switching (`phasetarget` / `10180`). | Ultra-fine 10–100 mA solar surplus tracking and hardware 1P/3P phase switching with zero cloud dependency. |
| **Sungrow AC011E-01 / AC22E-01 EV Charger** | `sungrow_evcharger` | Sungrow | `MODBUS` | Default Port: 502, Unit ID: 248 | Active Charging Power (W), Cumulative Energy (kWh), 3-Phase Currents (0.1 A), 3-Phase Voltages (0.1 V), Phase Switch Status. | 0.1 A Output Current Limit (`21202`), Start/Stop Control (`21211`), and 1-Phase / 3-Phase Switching (`21203`). | Direct local Modbus companion for Sungrow SH/SG installations with 0.1 A surplus regulation and 1P/3P switching. |
| **Tinkerforge WARP Charger 2 / 3 (Smart & Pro)** | `warp_charger` | Tinkerforge | `REST` | Default Port: 80, Local HTTP REST API | Active Charging Power (W), Absolute Energy (kWh), 3-Phase Currents (A), 3-Phase Voltages (V), IEC 61851 State, 1P/3P Contactor State. | 1 mA Resolution External Current Limit (`6000–32000 mA`, `0` Pause) and WARP3 1-Phase / 3-Phase Contactor Switching (`phases_wanted`). | Industrial open-interface wallbox integration with 1 mA precision solar tracking and automated 1P/3P contactor control. |
| **Vestel EVC04 Home Smart / Mobility** | `vestel_evc04` | Vestel | `MODBUS` | Default Port: 502, Unit ID: 255 | Total Active Power (W), Cumulative Energy (kWh), 3-Phase Currents (mA), 3-Phase Voltages (V), Chargepoint & Cable State. | Dynamic Charging Current Limit (`5004`, `0` or `6–32 A`), Fail-Safe Watchdog (`6000`), and 1-Phase / 3-Phase Switching (`405`). | Reliable local Modbus TCP load balancing, main fuse protection, and 1P/3P solar switching for Vestel EVC04 wallboxes. |

### Summary Table: Grid Smart Meters & Energy Analyzers (40 Devices)

| Device Name | Template ID | Vendor | Protocol | Default Port / Bus | Data Read | Data Written / Controlled | Key GEMS Automation Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ABB A43 / A44 / B23 / B24 Meter** | `abb_meter` | ABB | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | High-precision grid boundary metering; fee... |
| **Accuenergy AcuRev / Acuvim Series Meter** | `accuenergy_meter` | Accuenergy | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Power (W), Total Import Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V) | Autonomous / Read-Only | Precision 3-phase grid boundary monitoring and phase load balancing. |
| **Acrel ADW300 Meter** | `acrel_adw300` | Acrel | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | Monitors main grid connection or sub-distr... |
| **Algodue UPM209 / UPM309 Series Meter** | `algodue_meter` | Algodue | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Power (W), Total Import Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V) | Autonomous / Read-Only | High-accuracy utility metering and breaker protection. |
| **B+GE-TECH WS100 / DS100 Meter** | `bgetech_ws100` | B+GE-TECH | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | Direct grid boundary metering; provides re... |
| **Carlo Gavazzi EM112 / EM340 / EM540** | `carlogavazzi_em340` | Carlo Gavazzi | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | Fast sub-second boundary meter (especially... |
| **Carlo Gavazzi EM24 (RS485/Ethernet)** | `carlogavazzi_em24` | Carlo Gavazzi | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | Industry-standard utility meter used in pr... |
| **Chint DTSU666 / DTSU666-H 3-Phase Meter** | `chint_dtsu666` | Chint | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Power (W), Total Import & Export Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V) | Autonomous / Read-Only | Standard 3-phase bidirectional grid meter for solar systems and submetering. |
| **ESPHome DSMR / DLMS Smart Meter** | `esphome_meter` | ESPHome | `HTTP` | Default Port: 80, Endpoint: /sen... | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | Integrates DIY open-hardware P1 readers in... |
| **Eastron SDM120 / SDM220 / SDM230 (1-Phase Meter)** | `eastron_sdm120_230` | Eastron | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | Monitors single-phase grid connections, de... |
| **Eastron SDM630 3-Phase Meter** | `eastron_sdm630` | Eastron | `MODBUS` | Default Port: 502, Slave ID: 1, ... | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | Widely deployed 3-phase meter; provides fo... |
| **Eastron SDM72D / SMART X96 3-Phase Meter** | `eastron_sdm72_x96` | Eastron | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | High-density DIN-rail energy monitoring; f... |
| **Eltako DSZ15DZMOD / DSZ16 Meter** | `eltako_meter` | Eltako | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | German precision submetering; provides rea... |
| **Finder 7M.24 / 7M.38 Meter** | `finder_7m` | Finder | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | Reliable MID-certified grid metering; feed... |
| **Hager ECM / ECR / ECP Energy Meter** | `hager_meter` | Hager | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Power (W), Total Import Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V) | Autonomous / Read-Only | DIN-rail Modbus energy metering in residential distribution panels. |
| **HomeWizard Meter** | `homewizard_meter` | HomeWizard | `REST` | Default Port: 80, JSON Endpoint:... | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh) | Autonomous / Read-Only | Plug-and-play Wi-Fi P1 reader: enables GEM... |
| **Homey Energy Dongle (P1)** | `homey_p1` | Homey | `NETWORK` | Default Port: 80 | Real-Time Net Grid Import / Export Power (W) | Autonomous / Read-Only | Captures local network telemetry broadcast... |
| **Inepro PRO380-MOD / PRO1-MOD Meter** | `inepro_pro380` | Inepro | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | High-accuracy Dutch utility metering; supp... |
| **Janitza UMG Series Power Analyzer** | `janitza_umg` | Janitza | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Power (W), Total Import Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V) | Autonomous / Read-Only | Industrial power analyzer: high-frequency grid flow and phase angle telemetry. |
| **Kamstrup Energy Meter (Modbus Gateway)** | `kamstrup_meter` | Kamstrup | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Power (W), Total Import Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V) | Autonomous / Read-Only | Utility electricity and thermal metering via Modbus / M-Bus bridge. |
| **Landis+Gyr Industrial Utility Meter** | `landisgyr_meter` | Landis+Gyr | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Power (W), Total Import Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V) | Autonomous / Read-Only | High-voltage and commercial grid boundary measurement. |
| **Lovato DMG610 3-Phase Meter** | `lovato_dmg610` | Lovato | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | Industrial-grade grid analyzer; provides r... |
| **Loxone Miniserver** | `loxone_miniserver` | Loxone | `HTTP` | Default Port: 80 / 443, Endpoint... | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh) | Autonomous / Read-Only | Bridges smart home installations running L... |
| **Niko Home Control (NHC II)** | `niko_nhc` | Niko | `HTTP` | Default Port: 8884 or 80, JSON E... | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh) | Autonomous / Read-Only | Seamless integration with popular Belgian ... |
| **P1 Smart Meter (Network/TCP)** | `p1_network` | Generic | `NETWORK` | Default Port: 23, 8088, or 8234,... | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+3 more) | Autonomous / Read-Only | Primary grid interface for remote P1 meter... |
| **P1 Smart Meter (USB/Serial)** | `p1_serial` | Generic | `SERIAL` | /dev/ttyUSB0 or /dev/ttyAMA0, Ba... | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+3 more) | Autonomous / Read-Only | Direct zero-latency hardware connection to... |
| **Phoenix Contact EMpro Energy Meter** | `phoenix_empro` | Phoenix Contact | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Power (W), Total Import Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V) | Autonomous / Read-Only | EMpro EEM-MA/MB series industrial DIN-rail metering. |
| **SMA Energy Meter 2.0 / Data Manager M (Modbus TCP)** | `sma_energymeter` | SMA | `MODBUS` | Default Port: 502, Slave ID: 2 o... | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+1 more) | Inverter Power Limit Dispatch (via SM... | Measures grid boundary power and acts as a... |
| **Schneider Electric Acti9 iEM3000 / PM3200 Series** | `schneider_iem3000` | Schneider Electric | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | Commercial and residential grade submeteri... |
| **Shelly 3EM (Gen 1 3-Phase Meter)** | `shelly_3em` | Shelly | `REST` | Default Port: 80, JSON Endpoint:... | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Built-in Auxiliary Relay Output (On /... | Reads high-speed 3-phase clamp measurement... |
| **Shelly Pro 3EM / Gen3 3EM-63T (3-Phase Meter)** | `shelly_pro_3em` | Shelly | `REST` | Default Port: 80, JSON Endpoint:... | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Built-in Auxiliary Relay Output (On /... | High-reliability Ethernet-connected DIN me... |
| **Siemens SENTRON (PAC2200 / 7KT1665 Meter)** | `siemens_pac2200` | Siemens | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | Premium industrial grade metering; monitor... |
| **Socomec COUNTIS E24/E34/E44 / DIRIS A-40** | `socomec_meter` | Socomec | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | Accurate 3-phase commercial and domestic m... |
| **WAGO 879 Series (879-3000 / 879-3020 / 879-3040)** | `wago_879` | WAGO | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Import / Export Power (W), Total Import & Export Energy Registers (kWh), Individual Phase Currents (L1, L2, L3 in Amps) (+2 more) | Autonomous / Read-Only | Precision DIN-rail meter; streams 3-phase ... |
| **Weidmüller Energy Meter (500 / 600 / 700)** | `weidmuller_meter` | Weidmüller | `MODBUS` | Default Port: 502, Slave ID: 1 | Real-Time Net Grid Power (W), Total Import Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V) | Autonomous / Read-Only | Precision industrial power and energy measurement. |
| **YouLess LS120 Pulse & P1 Meter** | `youless_ls120` | YouLess | `REST` | Default Port: 80, Local JSON Endpoint | Real-Time Net Grid Power (W), Total Import Energy (kWh) | Autonomous / Read-Only | Optical pulse and P1 port reader for digital meters over local LAN. |
| **Fronius Smart Meter IP / Solar API v1** | `fronius_smartmeter_ip` | Fronius | `REST` | Default Port: 80, `/solar_api/v1/GetMeterRealtimeData.cgi` | Signed Net Grid Power (W), Total Imported & Exported Energy (kWh), Signed Per-Phase Currents (L1, L2, L3 in Amps), Phase Voltages (V). | Autonomous / Read-Only | Zero-wiring local HTTP grid boundary metering for Fronius ecosystems, feeding signed per-phase currents into main fuse protection and peak shaving. |
| **Huawei EMMA-A02 / DTSU666-H Smart Power Sensor** | `huawei_emma` | Huawei | `MODBUS` | Default Port: 502, Unit ID: 1 (EMMA) or 11 (DTSU666-H) | Signed Grid Supply-Point Power (W), Total Import & Export Energy (kWh), Signed 3-Phase Currents (A), 3-Phase Voltages (V). | Autonomous / Read-Only | High-speed grid boundary telemetry for Huawei SUN2000 & LUNA2000 sites with EMMA-A02 or standalone RS485 power sensors. |
| **KOSTAL Smart Energy Meter (KSEM G1 / G2)** | `kostal_ksem` | KOSTAL | `MODBUS` | Default Port: 502, Unit ID: 71 or 1 | Active Import & Export Power (0.1 W), Total Import & Export Energy (0.1 Wh -> kWh), Directional Per-Phase Currents (A) & Voltages (V). | Autonomous / Read-Only | Sub-second Ethernet DIN-rail grid boundary metering with per-phase directional current signing for DLB and capacity peak shaving. |
| **Tasmota SML / OBIS Optical IR Reader & EcoTracker** | `tasmota_sml` | Tasmota | `REST` | Default Port: 80, `/cm?cmnd=Status%208` or `/v1/json` | Real-Time Net Grid Power (W), Total Import & Export Energy Counters (kWh), Phase Currents (A) & Voltages (V). | Autonomous / Read-Only | Cloud-free optical IR smart meter reading for modern European digital utility meters lacking RJ12 P1 ports. |

### Summary Table: Smart Relays & Load Actuators (12 Devices)

| Device Name | Template ID | Vendor | Protocol | Default Port / Bus | Data Read | Data Written / Controlled | Key GEMS Automation Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Askoma ASKOHEAT+ Modbus TCP PV Immersion Heater** | `askoheat_diverter` | Askoma | `MODBUS` | Default Port: 502, Unit ID: 1 | Actual Immersion Heating Power (`300` W), Boiler Water Temperature (`302` 0.1 °C), Cumulative Thermal Energy (`304` 0.1 kWh). | Stepless Feed-In / Load Setpoint (`200`–`201` W), 7-Step Heater Stage Control (`100` Stages 0–7), Legionella Boost, and Max Temp Setpoint (`202`). | Stepless 7-stage solar thermal water heating and negative-price surplus absorption for Askoma ASKOHEAT+ flange heaters. |
| **Generic HTTP Relay** | `generic_relay` | Generic | `REST` | Default Port: 80 / 8080, Configu... | Connected Load Active Power Consumption (W) | Relay Contactor Output State (On / Off) | Automated contactor control: engages domes... |
| **Modbus Digital I/O Relay Module** | `modbus_relay` | Modbus Relais / I/O | `MODBUS` | Default Port: 502, Slave ID: 1 | Digital Input / Output States | Modbus Coil & Register Actuation (On / Off) | Industrial-grade contactor switching for high-current loads and peak shaving. |
| **SG-Ready Heat Pump (Daikin/Nibe/Bosch/Vaillant/Panasonic)** | `sgready_heatpump` | SG-Ready | `REST` | Default Port: 80, REST Endpoint | Operating State & Power (W) | SG-Ready Operating State (State 2 Normal / State 3 Boost) | Automated heat pump boost during solar excess or negative price windows. |
| **Shelly Plus 1 / Pro 1 (Dry Contact Relay)** | `shelly_plus_1` | Shelly | `REST` | Default Port: 80, Gen2 RPC Endpoint | Connected Load Power (W) | Relay Output State (On / Off) | Potential-free contact switching for heat pumps, domestic hot water, and gates. |
| **Shelly Plus 1PM / Pro 1PM / Plug S (Relay & Power)** | `shelly_plus_1pm` | Shelly | `REST` | Default Port: 80, Endpoints: /rp... | Connected Load Active Power Consumption (W), Cumulative Energy Consumption (kWh), Phase Currents (Amps) (+1 more) | Relay Contactor Output State (On / Off) | SG-Ready Heat Pump Boost & Appliance Autom... |
| **Shelly Plus 2PM / Pro 2PM (Dual Relay & Meter)** | `shelly_plus_2pm` | Shelly | `REST` | Default Port: 80, Gen2 RPC Endpoint | Channel Power Consumption (W), Total Energy (kWh) | Dual Relay Output States (On / Off) | Independent dual-channel control and metering for immersion heaters and heat pumps. |
| **Daikin Altherma 3 & HomeHub (Smart Grid Modbus)** | `daikin_altherma` | Daikin | `MODBUS` | Default Port: 502, Unit ID: 1 | Instantaneous Heat Pump Electrical Power (W), DHW Tank Temperature (°C), Leaving Water Temperature (°C), Smart Grid Status. | Smart Grid Operating Mode (`53`: Free Running Normal vs Recommended On PV Surplus Boost) & DHW Temperature Setpoint (`2`). | Native Modbus TCP thermal storage automation for Daikin Altherma 3 heat pumps: converts excess PV and negative-price electricity into domestic hot water and space heating. |
| **my-PV AC•THOR / AC•THOR 9s / AC ELWA 2 Solar Diverter** | `mypv_acthor` | my-PV | `MODBUS` | Default Port: 502, Unit ID: 1 | Actual Immersion Heating Power (W), Domestic Hot Water Tank Temperature (`0.1 °C`), Operating Status. | Stepless Linear Heating Power Setpoint (`1000`: `0–9000 W`), Relay Boost State, and Max Tank Temperature Setpoint (`1002`). | Proportional zero-export thermal storage: diverts exact watt-for-watt PV surplus into hot water buffers before any grid export or curtailment occurs. |
| **NIBE S-Series Heat Pump (S1155 / S1255 / S2125 / VVM)** | `nibe_heatpump` | NIBE | `MODBUS` | Default Port: 502, Unit ID: 1 | Instantaneous Compressor Electrical Power (`2166` W), Cumulative Consumed Electrical Energy (`2285` kWh), DHW Top Temperature (`8` °C). | SG-Ready / Smart Price Luxury DHW Boost (`697` / `47`) and Comfort Temperature Setpoint (`707` `0.1 °C`). | Direct Wi-Fi/Ethernet Modbus TCP integration for NIBE S-Series heat pumps: boosts thermal storage during solar surplus and cheap EPEX hours. |
| **Stiebel Eltron / Tecalor ISG Web & Plus (WPM)** | `stiebel_eltron_isg` | Stiebel Eltron | `MODBUS` | Default Port: 502, Unit ID: 1 | DHW Cylinder Temperature (`521` °C), Compressor & DHW Pump Status (`2500`), Cumulative Electrical Energy (kWh). | SG-Ready Energy Management Enable (`4000=1`), SG-Ready State 2 / State 3 PV Boost (`4001`–`4002`), and Comfort DHW Setpoint (`1509`). | Standardized Modbus TCP SG-Ready boost and comfort temperature control for Stiebel Eltron and Tecalor heat pumps. |
| **Tasmota Smart Plug / DIN Power Relay** | `tasmota_relay` | Tasmota | `REST` | Default Port: 80, `/cm?cmnd=Power` & `Status%208` | Active Load Power (W), Cumulative Energy (kWh), Supply Voltage (V), Load Current (A). | Relay Channel Output State (`Power{1..8} On` / `Off` with hysteresis protection). | 100% local cloud-free switching and power metering for resistive water heaters, pool pumps, e-bike chargers, and auxiliary relays. |

---

## Detailed Per-Device Breakdown

Below is the exhaustive, detailed specification for all 168 hardware integration profiles natively supported in GEMS.

## 1. Solar & Hybrid Inverters (37 Devices)

Inverter templates communicate directly via Modbus TCP (Ethernet / Wi-Fi dongles), SunSpec industrial standards, or local HTTP REST APIs. They monitor real-time photovoltaic (PV) solar production, hybrid battery State of Charge (SOC %), battery charge/discharge wattage, and grid flow. Advanced templates support active power curtailment for negative spot price protection and forced battery charging/discharging setpoints for energy arbitrage.

### 1.1 Afore Hybrid Inverter

- **Template Identifier**: `afore_inverter`
- **Manufacturer / Vendor**: Afore
- **Supported Hardware Models**: Afore AF-T (3-Phase) & AF-S (1-Phase) Series Hybrid Inverters (1kW – 30kW)
- **Communication Interface**: Modbus TCP via Ethernet / Wi-Fi dongle (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-time solar PV generation (W), Battery charge/discharge power (W), Grid import/export power (W), Cumulative solar production (kWh), Battery State of Charge (SOC %), 3-Phase inverter output currents (L1, L2, L3 in Amps).

#### Controllable Setpoints & Data Written by GEMS
EMS Energy Mode & Forced Charge/Discharge Power Setpoints (Holding `3000`/`3002`), plus Active Power Derating Limit (`0–100%`).

#### What GEMS Actually Does With This Device
Closed-loop hybrid management for Afore AF-S and AF-T inverters: dynamically charges/discharges storage for Flanders capacity peak shaving and EPEX spot arbitrage while curtailing PV export during negative price windows.

---

### 1.2 Alpha ESS Storion SMILE

- **Template Identifier**: `alpha_ess_inverter`
- **Manufacturer / Vendor**: Alpha ESS
- **Supported Hardware Models**: Alpha ESS Storion SMILE5, SMILE-T10, SMILE-G3 Hybrid Inverter & Storage Systems
- **Communication Interface**: Modbus TCP via local network dongle (Default Port: 502 or 8502, Slave ID: 85)

#### Telemetry Data Read by GEMS
Solar PV active power (W), Battery charging/discharging power (W), Net grid import/export (W), Cumulative energy (kWh), Battery SOC (%), 3-Phase currents (L1, L2, L3 in Amps).

#### Controllable Setpoints & Data Written by GEMS
Dispatch Mode Control (`0x084F`), Active Power Offset Setpoint (`0x0850`–`0x0851` with 32000 W bias), Dispatch SOC Target, and Grid Feed-In Power Limit.

#### What GEMS Actually Does With This Device
Full closed-loop Alpha ESS Storion SMILE control: dispatches exact wattage charge/discharge setpoints for EPEX Day-Ahead arbitrage and Flemish capacity ceiling protection, plus active solar curtailment.

---

### 1.3 Anker SOLIX X1 Hybrid Inverter

- **Template Identifier**: `anker_inverter`
- **Manufacturer / Vendor**: Anker
- **Supported Hardware Models**: Anker SOLIX X1 Hybrid Energy Storage System (Single-Phase & Three-Phase)
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV power (W), Battery flow (W), Grid exchange power (W), Total lifetime energy (kWh), Battery SOC (%), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Anker SOLIX X1 EMS Operating Mode and Forced Charge/Discharge Power Setpoints (W), plus Active Power Export Curtailment.

#### What GEMS Actually Does With This Device
Closed-loop residential 3-phase hybrid control for Anker SOLIX X1: executes automated battery peak shaving, off-peak spot charging, and negative-price solar curtailment.

---

### 1.4 Deye / Sunsynk Hybrid Inverter

- **Template Identifier**: `deye_inverter`
- **Manufacturer / Vendor**: Deye
- **Supported Hardware Models**: Deye SUN-(3-12)K-SG04LP3 / SUN-(5-16)K-SG01LP1, Sunsynk Hybrid Inverters
- **Communication Interface**: Modbus TCP via Ethernet LAN or Solarman/Deye Wi-Fi logger (Default Port: 502 or 8899, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV production (W), Battery charge/discharge power (W), Grid meter power (W), Lifetime energy (kWh), Battery SOC (%), 3-Phase inverter currents (L1, L2, L3 in Amps).

#### Controllable Setpoints & Data Written by GEMS
Time-of-Use Grid Charge & Discharge Power Setpoints, Minimum/Target SOC Windows, and Dynamic Max Solar Sell Power Limit (Holding `143` / `340`, LV & HV auto-scaled).

#### What GEMS Actually Does With This Device
Full closed-loop control for Deye and Sunsynk LV/HV hybrid inverters: executes sub-second Flemish capacity peak shaving, Day-Ahead EPEX battery arbitrage, and zero-export / negative-price curtailment.

---

### 1.5 Enerlution Hybrid Inverter

- **Template Identifier**: `enerlution_inverter`
- **Manufacturer / Vendor**: Enerlution
- **Supported Hardware Models**: Enerlution Hybrid Energy Storage Inverters (L3-L12 Series)
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV power (W), Battery power (W), Grid power (W), Cumulative energy (kWh), Battery SOC (%), 3-Phase currents (L1, L2, L3 in Amps).

#### Controllable Setpoints & Data Written by GEMS
Active Power Curtailment Limit (W or % via Modbus registers 40400/40441).

#### What GEMS Actually Does With This Device
Full active curtailment integration: automatically reduces inverter power output during negative EPEX Day-Ahead spot price hours (Netherlands Mode / Zero-Export) while respecting Flemish GSC subsidy offsets; manages solar surplus routing into battery and EV.

---

### 1.6 Enphase IQ Gateway / Envoy

- **Template Identifier**: `enphase_envoy`
- **Manufacturer / Vendor**: Enphase
- **Supported Hardware Models**: Enphase IQ Gateway, Envoy-S Standard / Metered, IQ System Controller (IQ Battery 3T/10T)
- **Communication Interface**: Local HTTP REST API via token/digest authentication (Default Port: 80 / 443, Endpoints: /api/v1/production, /ivp/livedata/status)

#### Telemetry Data Read by GEMS
Microinverter aggregated solar PV generation (W), IQ Battery charge/discharge wattage (W), Net grid import/export (W), Total lifetime generation (kWh), Battery SOC (%), Per-phase currents and voltages.

#### Controllable Setpoints & Data Written by GEMS
Local Enphase IQ Gateway HTTPS Bearer JWT dynamic power-export limiting and IQ Battery storage mode dispatch.

#### What GEMS Actually Does With This Device
Local-first integration with Enphase IQ Gateway Metered and IQ Batteries: streams production/consumption/storage metrics and coordinates negative-price export limiting.

---

### 1.7 FoxESS H1 / H3 / H3-Pro Hybrid Inverter

- **Template Identifier**: `foxess_inverter`
- **Manufacturer / Vendor**: FoxESS
- **Supported Hardware Models**: FoxESS H1, AC1, H3, H3-Pro, AIO Series Hybrid Storage Inverters
- **Communication Interface**: Modbus TCP via LAN or RS485 Ethernet converter (Default Port: 502, Slave ID: 1 or 247)

#### Telemetry Data Read by GEMS
Solar PV generation (W), Battery power (W), Grid active power (W), Total energy (kWh), Battery SOC (%), 3-Phase currents (L1, L2, L3 in Amps).

#### Controllable Setpoints & Data Written by GEMS
FoxESS Work Mode (`41000` / `44000`), Remote EMS Power Setpoints (W), Min SOC Floor, and Active Export Power Limit.

#### What GEMS Actually Does With This Device
Full closed-loop control across FoxESS H1, H3, and H3-Pro hybrid series: dispatches forced battery charging/discharging for spot arbitrage and capacity peak shaving alongside active solar curtailment.

---

### 1.8 Fronius Gen24 Inverter

- **Template Identifier**: `fronius_inverter`
- **Manufacturer / Vendor**: Fronius
- **Supported Hardware Models**: Fronius Primo Gen24, Symo Gen24 Plus, Symo Hybrid, Tauro (SunSpec Modbus)
- **Communication Interface**: Modbus TCP via SunSpec protocol (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV generation (W), Battery charge/discharge wattage (W), Grid power flow (W), Cumulative energy (kWh), BYD / Fronius Battery SOC (%).

#### Controllable Setpoints & Data Written by GEMS
SunSpec Model 123 Active Power Limit (`WMaxLimPct` single-register FC06) and SunSpec Model 124 Storage Charge/Discharge Control (`StorCtl_Mod`, `OutWRte`, `InWRte`).

#### What GEMS Actually Does With This Device
Full closed-loop Fronius Symo / Primo / Gen24 Plus control: regulates BYD Battery-Box HVS/HVM charge/discharge rates for spot arbitrage and peak shaving, and curtails PV output during negative market prices.

---

### 1.9 GoodWe Inverter

- **Template Identifier**: `goodwe_inverter`
- **Manufacturer / Vendor**: GoodWe
- **Supported Hardware Models**: GoodWe ET, EH, ES, EM, Lynx Home F Series Hybrid Inverters (ARM/DSP)
- **Communication Interface**: Modbus TCP / UDP via LAN or Wi-Fi+LAN kit (Default Port: 502 or 8899, Slave ID: 247)

#### Telemetry Data Read by GEMS
Solar PV power (W), Battery charge/discharge power (W), Net grid flow (W), Lifetime energy (kWh), Battery SOC (%).

#### Controllable Setpoints & Data Written by GEMS
GoodWe ET/EH/BT/BH EMS Power Mode (`47511` modes `1`/`2`/`8`/`9`), EMS Power Setpoint (`47512` W), and Grid Export Power Limit Enable & Value (`47509`–`47510`).

#### What GEMS Actually Does With This Device
Verified closed-loop hybrid control for GoodWe ET/EH/BT/BH inverters: executes automated battery peak shaving, Day-Ahead spot arbitrage, and dynamic PV export curtailment.

---

### 1.10 Growatt Inverter

- **Template Identifier**: `growatt_inverter`
- **Manufacturer / Vendor**: Growatt
- **Supported Hardware Models**: Growatt SPH, MIN, MOD, MID Series Hybrid and Grid-Tied Inverters (ShineLAN-X)
- **Communication Interface**: Modbus TCP via ShineLAN-X Ethernet dongle (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV active power (W), Battery power (W), Grid feed-in/consumption (W), Cumulative kWh, Battery SOC (%).

#### Controllable Setpoints & Data Written by GEMS
Growatt SPH / MOD TL3-XH Priority Mode (`1044` / `3049`), Charge/Discharge Rate & Stop SOC (`1070`–`1092`), and Active Power Rate / Export Limit (`3`, `122`–`123`).

#### What GEMS Actually Does With This Device
Verified closed-loop control for Growatt SPH and MOD hybrid/string inverters: manages forced battery charging, peak discharge, and negative spot price PV curtailment.

---

### 1.11 Huawei Hybrid Inverter

- **Template Identifier**: `huawei_inverter`
- **Manufacturer / Vendor**: Huawei
- **Supported Hardware Models**: Huawei SUN2000 Series (2KTL-6KTL-L1, 3KTL-10KTL-M1, 12KTL-25KTL-M2/M5, 30KTL-100KTL-M3, MAP0, MB0) with LUNA2000 Battery (5kWh-30kWh)
- **Communication Interface**: Modbus TCP via SDongleA-05 (Ethernet/WLAN) or SmartLogger3000 (Default Port: 502, Slave ID: 1 or 2)

#### Telemetry Data Read by GEMS
Active solar PV generation (W, reg 32080), LUNA2000 Battery charge/discharge power (W, reg 37001), Grid import/export power via DTSU666-H (W, reg 37113), Cumulative generation (kWh, reg 32106), Battery SOC (%, reg 37004).

#### Controllable Setpoints & Data Written by GEMS
Forced Battery Charge / Discharge Power Setpoint (W, reg 40118/40120), Active Power Curtailment Limit (W or % of rated power, reg 40118/40125).

#### What GEMS Actually Does With This Device
Full bidirectional battery and curtailment control: commands LUNA2000 to discharge during household peak spikes (Flanders capacity peak shaving); commands grid force-charging during negative/cheap EPEX spot hours; curtails active PV output during negative export prices or zero-export mandates.

---

### 1.12 LG ESS Home (8 / 10 / 15)

- **Template Identifier**: `lg_ess`
- **Manufacturer / Vendor**: LG
- **Supported Hardware Models**: LG ESS Home 8, Home 10, Home 15 Hybrid Energy Storage Systems
- **Communication Interface**: Local HTTP REST API (Default Port: 80 / 443, JSON endpoints: /v1/user/setting/network)

#### Telemetry Data Read by GEMS
Solar PV production (W), Battery power flow (W), Grid import/export (W), Cumulative energy (kWh), Battery SOC (%).

#### Controllable Setpoints & Data Written by GEMS
Local LG ESS Home `/v1/user/setting/batt` forced-charge / self-consumption control and PCS power curtailment.

#### What GEMS Actually Does With This Device
Local zero-cloud HTTPS integration for LG ESS Home 8 / 10 / 15 systems with automated off-peak battery charging and grid flow balancing.

---

### 1.13 Marstek Venus / Jupiter Storage

- **Template Identifier**: `marstek_storage`
- **Manufacturer / Vendor**: Marstek
- **Supported Hardware Models**: Marstek Venus Series, Jupiter Hybrid All-In-One Battery Energy Storage
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV power (W), Battery charge/discharge power (W), Grid exchange power (W), Total energy (kWh), Battery SOC (%).

#### Controllable Setpoints & Data Written by GEMS
Marstek Venus C / E / Jupiter Passive Mode Enable (`42000 = 0x55AA`), Direction Control (`42010`), and Exact Charge/Discharge Watt Setpoints (`42020`–`42021`).

#### What GEMS Actually Does With This Device
Full closed-loop AC-coupled storage control for Marstek Venus C/E and Jupiter batteries: absorbs excess rooftop solar, shaves domestic capacity peaks, and executes Day-Ahead spot arbitrage.

---

### 1.14 SAJ eSolar (H1 / H2 / R5 / R6 Hybrid Inverter)

- **Template Identifier**: `saj_hybrid`
- **Manufacturer / Vendor**: SAJ
- **Supported Hardware Models**: SAJ eSolar H1, H2, R5, R6 Series Hybrid & Storage Inverters (B1/B2 Batteries)
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV generation (W), Battery power (W), Grid active power (W), Total energy (kWh), Battery SOC (%), 3-Phase currents (L1, L2, L3 in Amps).

#### Controllable Setpoints & Data Written by GEMS
SAJ H1 / H2 / R5 / R6 AppMode / Passive Charge & Discharge Wattage Setpoints and Active Power Derating Limit (`0.1%`).

#### What GEMS Actually Does With This Device
Closed-loop hybrid management for SAJ H1/H2 systems: coordinates 3-phase PV curtailment, forced off-peak battery charging, and peak demand shaving.

---

### 1.15 SMA Sunny Boy / Tripower / Storage Inverter

- **Template Identifier**: `sma_inverter`
- **Manufacturer / Vendor**: SMA
- **Supported Hardware Models**: SMA Sunny Boy (1.5-6.0), Sunny Tripower (3.0-10.0, X, Smart Energy), Sunny Island, Sunny Boy Storage
- **Communication Interface**: Modbus TCP via Speedwire / SunSpec (Default Port: 502, Slave ID: 126 or 3)

#### Telemetry Data Read by GEMS
Solar PV generation (W, reg 30775), Battery charge/discharge power (W, reg 31393), Grid active power (W, reg 30865), Total energy (kWh, reg 30513), Battery SOC (%, reg 30845), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
SMA Active Power Limit (`WModCfg` / `WMaxLimPct`) and Bidirectional Battery Control across both Sunny Island / Sunny Boy Storage (`40151=802`, `40149`) and Sunny Tripower Smart Energy (`40236`, `40793`–`40801`).

#### What GEMS Actually Does With This Device
Complete closed-loop solar curtailment and battery arbitrage across SMA Sunny Boy, Sunny Tripower, Sunny Tripower Smart Energy (STP-SE), and Sunny Boy Storage.

---

### 1.16 Senergy (SE Series / Hybrid Inverter)

- **Template Identifier**: `senergy_inverter`
- **Manufacturer / Vendor**: Senergy
- **Supported Hardware Models**: Senergy SE Series Hybrid & Storage Inverters (3kW – 15kW)
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV active power (W), Battery charge/discharge power (W), Grid exchange (W), Cumulative energy (kWh), Battery SOC (%).

#### Controllable Setpoints & Data Written by GEMS
Senergy SE Hybrid Passive Mode Charge/Discharge Power Setpoints (W) and Active Power Output Limit (%).

#### What GEMS Actually Does With This Device
Closed-loop control for Senergy hybrid inverters: automates battery peak shaving, off-peak charging, and negative-price PV curtailment.

---

### 1.17 Sigenergy SigenStor (Hybrid Inverter & Storage)

- **Template Identifier**: `sigenergy_hybrid`
- **Manufacturer / Vendor**: Sigenergy
- **Supported Hardware Models**: Sigenergy SigenStor 5-in-1 Energy Storage System (Inverter, Battery, EVDC/EVAC)
- **Communication Interface**: Modbus TCP via Sigen Gateway / Inverter (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV power (W), Sigen Battery flow (W), Grid exchange power (W), Total energy (kWh), Sigen Battery SOC (%), 3-Phase currents (L1, L2, L3 in Amps).

#### Controllable Setpoints & Data Written by GEMS
SigenStor Remote EMS Enable (`40029`), Operating Mode (`40031`), Max Charge/Discharge Power Setpoints (`40032`–`40034` U32 W), and PV Curtailment Limit (`40038`).

#### What GEMS Actually Does With This Device
High-precision closed-loop EMS control for Sigenergy SigenStor 5-in-1 energy systems: executes sub-second capacity peak shaving, EPEX spot arbitrage, and PV export curtailment.

---

### 1.18 SofarSolar (HYD / G3 / AMASS Hybrid Inverter)

- **Template Identifier**: `sofarsolar_hybrid`
- **Manufacturer / Vendor**: SofarSolar
- **Supported Hardware Models**: SofarSolar HYD 3000-6000-ES, HYD 5K-20KTL-3PH, G3 Series, AMASS StoreEdge Batteries
- **Communication Interface**: Modbus TCP via Ethernet/Wi-Fi stick (Default Port: 8899 or 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV power (W), Battery charge/discharge power (W), Grid power flow (W), Lifetime energy (kWh), Battery SOC (%), 3-Phase currents (L1, L2, L3 in Amps).

#### Controllable Setpoints & Data Written by GEMS
SofarSolar HYD 5K–20KTL-3PH Passive Storage Setpoints (`0x1187` mode, `0x1189`–`0x118D` signed S32 W) and Active Power / Anti-Reflux Export Limit.

#### What GEMS Actually Does With This Device
Verified closed-loop control for SofarSolar HYD 3PH G3 and ME3000SP hybrid systems: regulates battery charge/discharge wattage and solar curtailment.

---

### 1.19 SolaX Inverter

- **Template Identifier**: `solax_inverter`
- **Manufacturer / Vendor**: SolaX
- **Supported Hardware Models**: SolaX Power X1-Hybrid, X3-Hybrid Gen 2/3/4, X1/X3-Fit, Triple Power Batteries
- **Communication Interface**: Modbus TCP via Pocket LAN or Pocket Wi-Fi (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV active power (W), Battery power (W), Grid active power (W), Total energy (kWh), Battery SOC (%).

#### Controllable Setpoints & Data Written by GEMS
SolaX X1/X3-Hybrid G4 Remote Control Power Mode (`0x007C`–`0x0080`, exact active power target W + watchdog) with `0x001F` Manual Mode fallback, plus Export Control User Limit (`0x0042`).

#### What GEMS Actually Does With This Device
Verified sub-second closed-loop control for SolaX X1/X3-Hybrid and Fit systems: executes dynamic solar self-consumption, spot-price arbitrage, and PV curtailment.

---

### 1.20 SolarEdge 3-Phase Inverter

- **Template Identifier**: `solaredge_3phase`
- **Manufacturer / Vendor**: SolarEdge
- **Supported Hardware Models**: SolarEdge 3-Phase Inverters (SE3K – SE33.3K, StorEdge 3-Phase with SetApp)
- **Communication Interface**: Modbus TCP via SunSpec protocol (Default Port: 1502 or 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV generation (W), Battery charge/discharge power (W), Grid meter power (W), Total energy (kWh), Connected Energy Bank SOC (%).

#### Controllable Setpoints & Data Written by GEMS
SolarEdge StorEdge Control Mode `4` (Remote), Charge/Discharge Limit (`0xE00E`/`0xE010` float32 W), Mode Command (`0xE00D`), and Advanced Power Control (`0xF001` / SunSpec M123).

#### What GEMS Actually Does With This Device
Full closed-loop 3-phase SolarEdge Home Hub & StorEdge control: modulates home battery charge/discharge wattage and curtails PV generation during negative spot prices.

---

### 1.21 SolarEdge Inverter

- **Template Identifier**: `solaredge_inverter`
- **Manufacturer / Vendor**: SolarEdge
- **Supported Hardware Models**: SolarEdge 1-Phase HD-Wave Inverters (SE2200H – SE6000H, StorEdge 1-Phase)
- **Communication Interface**: Modbus TCP via SunSpec protocol (Default Port: 1502 or 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV generation (W), Battery charge/discharge power (W), Grid active power (W), Total energy (kWh), Battery SOC (%).

#### Controllable Setpoints & Data Written by GEMS
SolarEdge StorEdge Control Mode `4` (Remote), Charge/Discharge Limit (`0xE00E`/`0xE010` float32 W), Mode Command (`0xE00D`), and Advanced Power Control (`0xF001` / SunSpec M123).

#### What GEMS Actually Does With This Device
Full closed-loop 1-phase SolarEdge HD-Wave & Home Hub control: regulates StorEdge / Home Battery charge and discharge setpoints and curtails solar production when required.

---

### 1.22 Solis Hybrid & Retrofit Inverters (Primary Reference)

- **Template Identifier**: `solis_hybrid`, `solis_retrofit`, `solis_inverter`
- **Manufacturer / Vendor**: Solis
- **Supported Hardware Models**: Solis S5-EH1P, S6-EH1P Series (Single-Phase Hybrid), S6-EH3P Series (Three-Phase Hybrid 5kW-20kW), Solis RAI-3K-48V-5G, S6-EA1P3.6K-L, S6-EA1P5K-L Series (AC-Coupled Storage Retrofit)
- **Communication Interface**: Modbus TCP via direct internal Ethernet / Ginlong Wi-Fi/LAN stick (Default Port: 502 or 8899, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV Active Generation Power (W, reg 33079), Battery Charge/Discharge Power (W, reg 33149), Battery SOC (%, reg 33139), Grid Meter Active Power (W, reg 33130), Total Cumulative Energy Yield (kWh, reg 33029), 3-Phase AC Currents (0.1A, regs 33073-33075), 3-Phase Voltages (0.1V, regs 33076-33078).

#### Controllable Setpoints & Data Written by GEMS
Active Power Curtailment Mode and Limit (W / % via holding registers 43052/43070 on Hybrid and 3051/3052 on String), Forced Battery Charging & Discharging Setpoint (W via registers 43110/43129/43135/43136).

#### What GEMS Actually Does With This Device
Designated primary reference platform for hybrid solar and battery energy storage. Executes sub-second closed-loop active power curtailment during negative spot price hours (Netherlands Mode / Zero-Export), manages automatic solar surplus sinking into battery storage, dynamically throttles charging during Flanders capacity tariff peak shaving, and orchestrates spot market arbitrage (EPEX Day-Ahead price force charging and peak discharging). Solis Retrofit models operate seamlessly as AC-coupled storage units with dedicated battery control and zero solar PV string dependency.

---

### 1.23 Sungrow Inverter

- **Template Identifier**: `sungrow_inverter`
- **Manufacturer / Vendor**: Sungrow
- **Supported Hardware Models**: Sungrow SH5.0RT, SH6.0RT, SH8.0RT, SH10RT, SH15T, SH20T Hybrid Inverters (SBR096-SBR256)
- **Communication Interface**: Modbus TCP via direct internal LAN RJ45 port (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV generation (W, reg 5016), Battery charge/discharge power (W, reg 13021), Grid exchange power (W, reg 13009), Cumulative generation (kWh, reg 5003), SBR Battery SOC (%, reg 13022).

#### Controllable Setpoints & Data Written by GEMS
Sungrow SH-RS / SH-RT / SH-T EMS Mode Selection (`13049`), Charge/Discharge Command (`13050` `0xAA`/`0xBB`/`0xCC`), Power Setpoint (`13051` W), and Active Power Limitation (`5006`–`5007`).

#### What GEMS Actually Does With This Device
Verified high-speed closed-loop control for Sungrow SH hybrid and SG string inverters: executes sub-second peak shaving, EPEX battery arbitrage, and PV curtailment.

---

### 1.24 Victron Inverter/GX

- **Template Identifier**: `victron_inverter`
- **Manufacturer / Vendor**: Victron
- **Supported Hardware Models**: Victron Energy MultiPlus-II, Quattro, Cerbo GX, Ekrano GX, Color Control GX (Venus OS)
- **Communication Interface**: Modbus TCP via Venus OS (Default Port: 502, Unit ID: 100 for System Calc / 228 for Inverter)

#### Telemetry Data Read by GEMS
Solar PV DC/AC power (W, reg 811), Battery charge/discharge power (W, reg 842), Net AC grid import/export (W, reg 820), Total energy (kWh), Battery SOC (%, reg 843).

#### Controllable Setpoints & Data Written by GEMS
Victron Venus OS / Cerbo GX ESS Grid Power Setpoint (`2700` S16 / `2703` S32 W), ESS Discharge Disable, and Signed Max PV Feed-In Power Limit (`2706` in 100 W steps).

#### What GEMS Actually Does With This Device
Deep closed-loop integration with Victron MultiPlus-II / Quattro GX ESS installations: steers AC grid setpoint for battery arbitrage/peak shaving and curtails excess feed-in.

### 1.25 ABB / Fimer Solar & Hybrid Inverter

- **Template Identifier**: `abb_fimer_inverter`
- **Manufacturer / Vendor**: ABB / Fimer
- **Supported Hardware Models**: ABB UNO-DM-PLUS, REACT 2, TRIO, PVI, and Fimer string/hybrid inverters
- **Communication Interface**: Modbus SunSpec over TCP/RTU (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV Active Power (W, SunSpec standard register 40083), Battery State of Charge (SOC %), Battery Charge / Discharge Power (W), Grid Feed-in Power (W), Cumulative Generation Energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
SunSpec Model 123 Active Power Curtailment (`WMaxLimPct`, `WMaxLim_Ena`) and SunSpec Model 124 Storage Charge/Discharge Rate Control (`StorCtl_Mod`, `OutWRte`, `InWRte`).

#### What GEMS Actually Does With This Device
Full closed-loop SunSpec control for ABB / Fimer PV and REACT 2 hybrid installations: executes negative spot price solar curtailment, zero-export limiting, and automated battery peak shaving and Day-Ahead spot arbitrage.

---

### 1.26 Autarco Solar Inverter

- **Template Identifier**: `autarco_inverter`
- **Manufacturer / Vendor**: Autarco
- **Supported Hardware Models**: Autarco SX, MX, and LX series single-phase and three-phase solar inverters
- **Communication Interface**: Modbus TCP via local network dongle/gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV Active Power (W), Total Daily & Lifetime Generation (kWh), Grid AC Voltage (V), AC Frequency (Hz).

#### Controllable Setpoints & Data Written by GEMS
Remote Control Battery Charge/Discharge Power Setpoints (`43129` / `43135`–`43136`) and Active Power Curtailment Limit (`43052` / `0–100%`).

#### What GEMS Actually Does With This Device
Full closed-loop hybrid inverter and PV curtailment control for Autarco S2.x / MH / LX systems: coordinates solar self-consumption, spot-price battery arbitrage, and Flemish capacity peak shaving.

---

### 1.27 Chisage ESS Hybrid Inverter

- **Template Identifier**: `chisage_ess`
- **Manufacturer / Vendor**: Chisage ESS
- **Supported Hardware Models**: Chisage ESS Commercial, Industrial & Residential Hybrid Inverters (3kW – 50kW)
- **Communication Interface**: Modbus TCP / RTU via RS485 Ethernet Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV Active Power (W), Battery Charge / Discharge Power (W), Battery SOC (%), Grid Import / Export Power (W), Cumulative Inverter Energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Monitor-Only (Read-Only Telemetry — closed register control map).

#### What GEMS Actually Does With This Device
Integrates commercial, industrial, and residential Chisage ESS hybrid solar and battery telemetry into GEMS site load balancing.

---

### 1.28 Delta Electronics Solar Inverter

- **Template Identifier**: `delta_inverter`
- **Manufacturer / Vendor**: Delta Electronics
- **Supported Hardware Models**: Delta M6A, M8A, M10A, M15A, M50A, and RPI commercial/residential series
- **Communication Interface**: Modbus SunSpec over TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV Generation Power (W), DC String Voltages and Currents, Cumulative Generation (kWh), Grid AC Power (W).

#### Controllable Setpoints & Data Written by GEMS
SunSpec Model 123 Active Power Curtailment (`WMaxLimPct`, `WMaxLim_Ena`) and SunSpec Model 124 Basic Storage Control.

#### What GEMS Actually Does With This Device
Standardized SunSpec closed-loop telemetry and active power curtailment for Delta residential and commercial solar/hybrid inverters.

---

### 1.29 HYXiPOWER Hybrid Inverter

- **Template Identifier**: `hyxipower_inverter`
- **Manufacturer / Vendor**: HYXiPOWER
- **Supported Hardware Models**: HYXiPOWER 1-Phase & 3-Phase Residential & Commercial Hybrid Inverters
- **Communication Interface**: Modbus TCP via Wi-Fi/Ethernet dongle (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV Generation (W), Battery Charge / Discharge Power (W), Battery SOC (%), Grid Exchange (W), Cumulative Energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only telemetry poller.

#### What GEMS Actually Does With This Device
Streams PV production and battery storage metrics to the GEMS flow chart and telemetry pipeline.

---

### 1.30 KSTAR BluE Hybrid Inverter

- **Template Identifier**: `kstar_inverter`
- **Manufacturer / Vendor**: KSTAR
- **Supported Hardware Models**: KSTAR BluE-S, BluE-H3, and BluE-G residential and C&I hybrid systems
- **Communication Interface**: Modbus RTU / TCP via RS485 Ethernet converter (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV Active Power (W), Battery Charge / Discharge Power (W), Battery SOC (%), Grid Power Flow (W), Phase Currents (L1, L2, L3 in Amps).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only telemetry poller.

#### What GEMS Actually Does With This Device
Feeds hybrid solar and battery metrics into the GEMS load balancer and multi-tariff cost optimization engine.

---

### 1.31 Solinteg Integ M Hybrid Inverter

- **Template Identifier**: `solinteg_inverter`
- **Manufacturer / Vendor**: Solinteg
- **Supported Hardware Models**: Solinteg Integ M OHT/OMT Series (3kW – 50kW) 3-Phase Hybrid Inverters
- **Communication Interface**: Modbus RTU / TCP via LAN/Wi-Fi stick (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV Active Power (W), Battery Charge / Discharge Power (W), Battery SOC (%), Grid Net Exchange Power (W), Cumulative Generation (kWh).

#### Controllable Setpoints & Data Written by GEMS
Solinteg Integ M series Remote EMS Mode, Charge/Discharge Power Setpoints, and Active Power Limit.

#### What GEMS Actually Does With This Device
Verified closed-loop 3-phase high-voltage hybrid control for Solinteg Integ M (4–50 kW) commercial and residential inverters.

---

### 1.32 Solplanet / AISWEI Inverter

- **Template Identifier**: `solplanet_inverter`
- **Manufacturer / Vendor**: Solplanet (AISWEI)
- **Supported Hardware Models**: Solplanet ASW H-S2, ASW H-T2, ASW-LT-G2/G3 Single and 3-Phase Inverters
- **Communication Interface**: Modbus RTU / TCP via Ethernet/Wi-Fi Ai-Dongle (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Solar PV Active Power (W), Total Yield Energy (kWh), AC Voltage and Current per phase, Grid Import/Export (W).

#### Controllable Setpoints & Data Written by GEMS
AISWEI / Solplanet Battery Working Mode (`1103` wire / `41104` doc), Signed Charge/Discharge Power Setpoint (`1152` wire S16 W), and Active Power Control (`4000` / `5402` `0.01%`).

#### What GEMS Actually Does With This Device
Verified closed-loop control for Solplanet ASW H-T2/T3 and KACO blueplanet hybrid NH3 inverters: dispatches exact Watt storage setpoints and dynamic PV curtailment.

---

### 1.33 APsystems EZ1-M / EZ1-D Local Microinverter

- **Template Identifier**: `apsystems_ez1`
- **Manufacturer / Vendor**: APsystems
- **Supported Hardware Models**: APsystems EZ1-M, EZ1-D Wi-Fi Balcony & Rooftop Microinverters (Local Mode)
- **Communication Interface**: Local HTTP JSON API (Default Port: 8050, Endpoints: `/getOutputData`, `/setMaxPower`)

#### Telemetry Data Read by GEMS
Channel 1 & Channel 2 PV Active Power (W), Lifetime Cumulative Generation Energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Direct Local Max AC Output Power Setpoint (`/setMaxPower?p=30..800` W).

#### What GEMS Actually Does With This Device
100% cloud-free local microinverter telemetry and stepless active power curtailment during negative EPEX spot prices or zero-export operation.

---

### 1.34 FENECON Home / OpenEMS Edge (FEMS)

- **Template Identifier**: `fenecon_fems`
- **Manufacturer / Vendor**: FENECON
- **Supported Hardware Models**: FENECON Home 6, Home 10, Home 15, Home 20, Home 30 & OpenEMS Edge Controllers
- **Communication Interface**: Local HTTP REST API (Default Port: 8084, `/rest/channel/_sum/*` & `/rest/channel/ess0/*`)

#### Telemetry Data Read by GEMS
Solar PV Production Power (W), Cumulative PV Energy (kWh), Battery Charge/Discharge Power (W), Battery SOC (%), Grid Active Power (W).

#### Controllable Setpoints & Data Written by GEMS
Exact ESS Charge / Discharge Active Power Setpoint (`ess0/SetActivePowerEquals` W) and PV Active Power Curtailment (`pvInverter0/SetActivePowerLimit` W).

#### What GEMS Actually Does With This Device
Full closed-loop local integration for FENECON Home & OpenEMS systems: coordinates EPEX Day-Ahead battery arbitrage, Flemish capacity ceiling peak shaving, and negative-price curtailment.

---

### 1.35 Hoymiles DTU-Pro / OpenDTU Microinverter

- **Template Identifier**: `hoymiles_dtu`
- **Manufacturer / Vendor**: Hoymiles
- **Supported Hardware Models**: Hoymiles HM / HMS / HMT Series Microinverters via DTU-Pro, DTU-Pro-S, OpenDTU, or AhoyDTU
- **Communication Interface**: Modbus TCP (Default Port: 502, Unit ID: 1) or Local OpenDTU HTTP REST (`/api/livedata/status`, `/api/limit/config`)

#### Telemetry Data Read by GEMS
Aggregated & Per-Port Solar PV Active Power (W), Cumulative Solar Yield (kWh).

#### Controllable Setpoints & Data Written by GEMS
Active Power Output Limit (`0xC006` % on DTU-Pro Modbus; volatile RAM `limit_type=1` % on OpenDTU without EEPROM wear).

#### What GEMS Actually Does With This Device
Zero-cloud microinverter monitoring and dynamic PV curtailment during negative spot market hours.

---

### 1.36 KOSTAL Plenticore Plus / G2 / G3 Hybrid

- **Template Identifier**: `kostal_plenticore`
- **Manufacturer / Vendor**: KOSTAL
- **Supported Hardware Models**: KOSTAL Plenticore Plus, Plenticore BI, Plenticore G2, and Plenticore G3 Hybrid Inverters
- **Communication Interface**: Modbus TCP (Default Port: 1502, Unit ID: 71, Auto-detected CDAB/ABCD IEEE-754 Float32)

#### Telemetry Data Read by GEMS
Total DC PV Power (W), Cumulative Yield (kWh), Battery Charge/Discharge Power (W), Battery SOC (%), Grid Sensor Power (W), 3-Phase Voltages & Currents.

#### Controllable Setpoints & Data Written by GEMS
External Battery Management Signed Power Setpoint (Holding `1034` Float32 W) and SunSpec Model 123 Active Power Curtailment (`WMaxLimPct`).

#### What GEMS Actually Does With This Device
Full closed-loop control for KOSTAL Plenticore hybrid installations: executes battery peak shaving, Day-Ahead spot arbitrage, and negative-price solar curtailment.

---

### 1.37 KACO blueplanet hybrid NH3 / gridsave TL3

- **Template Identifier**: `kaco_inverter`
- **Manufacturer / Vendor**: KACO
- **Supported Hardware Models**: KACO blueplanet hybrid 6.0 / 8.0 / 10.0 / 12.0 NH3, blueplanet TL3, and gridsave 50.0 / 92.0 TL3-S Commercial Storage Inverters
- **Communication Interface**: Modbus TCP / RTU (Default Port: 502, Unit ID: 1, SunSpec Models 103/123/124 & NH3 Storage Block `40200`–`40203`)

#### Telemetry Data Read by GEMS
Solar PV Active Power (W), Cumulative Energy (kWh), Battery Charge/Discharge Power (W), Battery SOC (%), Live BMS Charge/Discharge Power Limits (`40202`–`40203` W), 3-Phase Currents & Voltages.

#### Controllable Setpoints & Data Written by GEMS
SunSpec Model 123 Active Power Curtailment (`WMaxLimPct`, `WMaxLim_Ena`) and Model 124 Storage Control (`WChaMax`, `WChaGra`, `WDisChaGra`, `StorCtl_Mod`, `WChaMaxRvrtTms=300s` Watchdog) plus NH3 EMS fallback (`40210`–`40212`).

#### What GEMS Actually Does With This Device
Full closed-loop control for KACO blueplanet hybrid NH3 and commercial gridsave TL3 installations: executes battery peak shaving, EPEX Day-Ahead spot arbitrage, and negative-price solar curtailment.

---

### 1.38 Custom Modbus Inverter (UI Register Profile)

- **Template Identifier**: `custom_modbus_inverter`
- **Manufacturer / Vendor**: Custom Modbus
- **Supported Hardware Models**: Any Modbus TCP or RS-485 RTU String, Micro, or Hybrid Inverter configured via the Certified Installer UI Register Profile Builder
- **Communication Interface**: Modbus TCP / RTU (Configurable Port or `/dev/serial/by-id/*` Bus, Unit ID, `FC03`/`FC04` Reads & Optional `FC06`/`FC16` Writes)

#### Telemetry Data Read by GEMS
UI-mapped Solar PV Power (W), Battery Power (W), Battery SOC (%), Net Grid Power (W), Cumulative Energy (kWh), 3-Phase Voltages & Currents (`int16`, `uint16`, `int32`, `uint32`, `float32`, or SunSpec Scale Factor `ABCD`/`CDAB`/`BADC`/`DCBA`).

#### Controllable Setpoints & Data Written by GEMS
Optional UI-mapped Active Power Curtailment Limit (`curtailment_limit_w` / `curtailment_limit_pct`), Battery Charge/Discharge Power (`battery_power_w`), Periodic Hardware Watchdog Heartbeat, and Safe Shutdown Fallback Register.

#### What GEMS Actually Does With This Device
Enables certified installers to onboard non-catalog solar and hybrid inverters directly from the web UI with live register testing, JSON profile import/export, and safe fail-safe shutdown restoration.

---

## 2. Dedicated Battery Energy Storage Systems (BESS) (18 Devices)

Dedicated residential BESS storage devices interface over Modbus TCP or local HTTP REST APIs to monitor stationary battery storage systems independent of solar inverters. They provide real-time State of Charge (SOC %), charge/discharge wattage, and grid exchange metrics to power GEMS energy arbitrage, self-consumption maximization, and peak shaving algorithms.

### 2.1 Siemens Junelight Smart Battery

- **Template Identifier**: `siemens_junelight`
- **Manufacturer / Vendor**: Siemens
- **Supported Hardware Models**: Siemens Junelight Smart Battery Energy Storage System (3.3kWh – 19.8kWh)
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Battery charge/discharge power (W), Battery State of Charge (SOC %), Net grid power flow (W), Internal battery status.

#### Controllable Setpoints & Data Written by GEMS
Siemens Junelight Smart Battery EMS Operating Mode and Forced Charge/Discharge Power Setpoints (W).

#### What GEMS Actually Does With This Device
Verified integration with Siemens Junelight residential storage for solar self-consumption, peak shaving, and off-peak charging.

---

### 2.2 Solarwatt (EnergyManager / MyReserve Matrix)

- **Template Identifier**: `solarwatt_storage`
- **Manufacturer / Vendor**: Solarwatt
- **Supported Hardware Models**: Solarwatt EnergyManager Pro, MyReserve Matrix Battery Storage System
- **Communication Interface**: Local HTTP REST API (Default Port: 80, JSON endpoint: /rest/kiwigrid/private/items)

#### Telemetry Data Read by GEMS
Battery power flow (W), Battery SOC (%), Solar generation (W), Grid exchange (W), Cumulative energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Solarwatt EnergyManager / Reserve local `/rest/items` battery charge/discharge control and telemetry ingestion.

#### What GEMS Actually Does With This Device
Verified zero-cloud local LAN integration for Solarwatt EnergyManager Pro and MyReserve / Battery flex storage.

---

### 2.3 sonnenBatterie (eco 6 / 8 / 10 / hybrid)

- **Template Identifier**: `sonnen_batterie`
- **Manufacturer / Vendor**: Sonnen
- **Supported Hardware Models**: sonnenBatterie eco 6, eco 8, eco 8.2, eco 10, sonnenBatterie hybrid 9.53
- **Communication Interface**: Local HTTP REST API v1/v2 (Default Port: 80, JSON endpoint: /api/v2/status)

#### Telemetry Data Read by GEMS
Battery charge/discharge wattage (W), Battery SOC (%), Solar PV production (W), Grid feed-in / consumption (W).

#### Controllable Setpoints & Data Written by GEMS
sonnenBatterie Local API v2 `PUT /api/v2/configurations` (`EM_OperatingMode=1` Manual / `2` Self-Consumption) and `POST /api/v2/setpoint/charge|discharge/{W}`.

#### What GEMS Actually Does With This Device
Complete closed-loop control for sonnenBatterie eco 8 / 10 / performance: switches cleanly into Manual API mode during forced arbitrage or peak shaving and restores autonomous self-consumption afterward.

---

### 2.4 Duracell Energy Residential Storage

- **Template Identifier**: `duracell_energy`
- **Manufacturer / Vendor**: Duracell Energy
- **Supported Hardware Models**: Duracell Energy Dura5, DuraCharge, and Durai storage systems
- **Communication Interface**: Modbus RTU / TCP via Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Battery Charge / Discharge Power (W), Battery State of Charge (SOC %), Grid Power Flow (W), Inverter AC Power (W).

#### Controllable Setpoints & Data Written by GEMS
Monitor-Only (Read-Only Telemetry).

#### What GEMS Actually Does With This Device
Monitors Duracell residential battery SOC and power exchange for site load balancing and EV solar surplus routing.

---

### 2.5 Dyness Battery Storage System

- **Template Identifier**: `dyness_battery`
- **Manufacturer / Vendor**: Dyness
- **Supported Hardware Models**: Dyness Tower, Powerbox F, DL5.0C, and A48100 residential lithium batteries
- **Communication Interface**: Modbus RTU / TCP via Gateway / Inverter BMS Port (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Battery Charge / Discharge Power (W), Battery State of Charge (SOC %), Total Pack Voltage (V), Current (A), Cell Temperatures (°C).

#### Controllable Setpoints & Data Written by GEMS
Dyness Tower / Powerbox / Junior Box Modbus EMS Operating Mode and Charge/Discharge Power Limits (W).

#### What GEMS Actually Does With This Device
Verified BMS & PCS storage integration for Dyness HV/LV battery stacks with closed-loop charge/discharge dispatch.

---

### 2.6 Elecnova Commercial & Industrial BESS

- **Template Identifier**: `elecnova_bess`
- **Manufacturer / Vendor**: Elecnova
- **Supported Hardware Models**: Elecnova ECO Series Commercial & Industrial Outdoor Cabinet BESS (50kW – 500kW)
- **Communication Interface**: Modbus TCP via Industrial Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Battery Active Power (W), Battery State of Charge (SOC %), Grid Exchange Power (W), Cumulative In / Out Energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Monitor-Only (Read-Only Telemetry).

#### What GEMS Actually Does With This Device
Monitors commercial BESS power flow, state of charge, and cumulative energy on the live dashboard.

---

### 2.7 Goneo Residential Storage System

- **Template Identifier**: `goneo_storage`
- **Manufacturer / Vendor**: Goneo
- **Supported Hardware Models**: Goneo Residential All-in-One Energy Storage Systems
- **Communication Interface**: Modbus TCP / RTU via Wi-Fi/Ethernet Module (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Battery Charge / Discharge Power (W), Battery SOC (%), Grid Power Flow (W), Total Energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Monitor-Only (Read-Only Telemetry).

#### What GEMS Actually Does With This Device
Monitors residential battery storage SOC and power exchange for coordinated EV and relay load balancing.

---

### 2.8 Mastervolt MLI Ultra / Combi CZone

- **Template Identifier**: `mastervolt_storage`
- **Manufacturer / Vendor**: Mastervolt
- **Supported Hardware Models**: Mastervolt MLI Ultra Lithium-ion series, Mass Combi Ultra, CZone Modbus Bridge
- **Communication Interface**: Modbus RTU / TCP via CZone Bridge / MasterBus gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Battery Power (W), Battery SOC (%), Inverter AC Output Power (W), DC Bus Voltage (V), Battery Current (A).

#### Controllable Setpoints & Data Written by GEMS
Monitor-Only (Read-Only Telemetry).

#### What GEMS Actually Does With This Device
Provides off-grid, marine, and residential Mastervolt / CZone battery system telemetry monitoring.

---

### 2.9 Power Sonic C&I Energy Storage

- **Template Identifier**: `powersonic_bess`
- **Manufacturer / Vendor**: Power Sonic
- **Supported Hardware Models**: Power Sonic PS-C&I and PowerBlock Commercial & Industrial BESS
- **Communication Interface**: Modbus TCP via BMS/PCS Controller (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Battery Active Power (W), Battery State of Charge (SOC %), Grid Power Flow (W), Fault Status Registers.

#### Controllable Setpoints & Data Written by GEMS
Monitor-Only (Read-Only Telemetry).

#### What GEMS Actually Does With This Device
Monitors commercial BESS power flow and state of charge on the live GEMS dashboard.

---

### 2.10 Poweroad Residential & C&I Storage

- **Template Identifier**: `poweroad_storage`
- **Manufacturer / Vendor**: Poweroad
- **Supported Hardware Models**: Poweroad ERA, Centauri, and H-ES residential & commercial energy storage systems
- **Communication Interface**: Modbus RTU / TCP via Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Battery Power (W), Battery State of Charge (SOC %), Grid Flow (W), Cumulative In / Out Energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Monitor-Only (Read-Only Telemetry).

#### What GEMS Actually Does With This Device
Monitors residential and light-commercial Poweroad battery storage telemetry.

---

### 2.11 Pylontech Battery Storage (US / Force)

- **Template Identifier**: `pylontech_storage`
- **Manufacturer / Vendor**: Pylontech
- **Supported Hardware Models**: Pylontech US2000, US3000, US5000, Force-H1, Force-H2, and Pelio series
- **Communication Interface**: Modbus RTU / TCP via Inverter Gateway or SC0500/SC1000 controller (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Battery Charge / Discharge Power (W), State of Charge (SOC %), Pack Voltage (V), Pack Current (A), SOH (%).

#### Controllable Setpoints & Data Written by GEMS
Pylontech US2000/US3000/US5000 & Force-H1/H2 BMS/EMS Charge and Discharge Power Setpoints via Modbus TCP/RTU.

#### What GEMS Actually Does With This Device
Verified closed-loop telemetry and dispatch for Pylontech low-voltage and high-voltage stationary storage racks.

---

### 2.12 Socomec SUNSYS C-System / HES BESS

- **Template Identifier**: `socomec_bess`
- **Manufacturer / Vendor**: Socomec
- **Supported Hardware Models**: Socomec SUNSYS C-System and SUNSYS HES L / XL Industrial Energy Storage Systems
- **Communication Interface**: Modbus TCP via Diris Digiware / BESS Controller (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Battery Active Power (W), Battery SOC (%), Live BMS Max Charge/Discharge Limits (`0xC008`–`0xC009` W), Grid Active Power Flow (W), Cumulative Energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Socomec SUNSYS PCS Remote Active Power Control (`0xC100` Mode, `0xC101`–`0xC102` S32 0.1 kW Setpoint, `0xC103=300s` Hardware Watchdog) with SunSpec Model 124 Storage Control fallback.

#### What GEMS Actually Does With This Device
Verified closed-loop C&I battery control for Socomec SUNSYS HES L/XL and PCS+: executes industrial peak shaving, capacity ceiling protection, and EPEX spot market arbitrage.

---

### 2.13 Sunwoda AtSmart Energy Storage

- **Template Identifier**: `sunwoda_energy`
- **Manufacturer / Vendor**: Sunwoda Energy
- **Supported Hardware Models**: Sunwoda AtSmart Residential Battery System and Noah C&I BESS
- **Communication Interface**: Modbus TCP via BMS Communication Hub (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Battery Charge / Discharge Power (W), Battery State of Charge (SOC %), Grid Power Flow (W), Temperature (°C).

#### Controllable Setpoints & Data Written by GEMS
Monitor-Only (Read-Only Telemetry).

#### What GEMS Actually Does With This Device
Monitors Sunwoda battery state of charge and power exchange on the live GEMS dashboard.

---

### 2.14 Sessy Smart Battery (AC Home Storage)

- **Template Identifier**: `sessy_battery`
- **Manufacturer / Vendor**: Sessy
- **Supported Hardware Models**: Sessy 5 kWh Modular AC-Coupled Retrofit Home Battery
- **Communication Interface**: Local HTTP REST API with Basic Auth (`/api/v1/power/status`, `/api/v1/power/active_strategy`, `/api/v1/power/setpoint`)

#### Telemetry Data Read by GEMS
Battery Charge/Discharge Power (W), State of Charge (SOC %), Exported Energy (kWh), Per-Phase RMS Voltages (V) & Currents (A).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Strategy Selection (`POWER_STRATEGY_API` vs `POWER_STRATEGY_NOM`) and Signed Watt Setpoint (`-W` Charge / `+W` Discharge).

#### What GEMS Actually Does With This Device
Zero-cloud local control of Dutch-engineered Sessy retrofit batteries for solar self-consumption, Flanders capacity peak shaving, and EPEX spot arbitrage.

---

### 2.15 Tesla Powerwall 2 / 3 & Backup Gateway (Local HTTPS)

- **Template Identifier**: `tesla_powerwall`
- **Manufacturer / Vendor**: Tesla Energy
- **Supported Hardware Models**: Tesla Powerwall 2, Powerwall+, Powerwall 3 & Backup Gateway 2 (Stationary Home Storage)
- **Communication Interface**: Local HTTPS Gateway API (`POST /api/login/Basic`, `GET /api/meters/aggregates`, `GET /api/system_status/soe`)

#### Telemetry Data Read by GEMS
Battery Power (W), Usable State of Energy (SOC %), Site Grid Power (W), Solar Power (W), Cumulative Energy (kWh), 3-Phase Site Currents & Voltage.

#### Controllable Setpoints & Data Written by GEMS
Monitor-Only (Local Gateway v23+ firmware enforces read-only local telemetry).

#### What GEMS Actually Does With This Device
High-speed local HTTPS ingestion of stationary Powerwall site, solar, and battery flows to drive EV charging surplus regulation and capacity peak protection.

---

### 2.16 VARTA pulse / neo / element Home Storage

- **Template Identifier**: `varta_storage`
- **Manufacturer / Vendor**: VARTA
- **Supported Hardware Models**: VARTA pulse, VARTA pulse neo, VARTA element, VARTA element backup, VARTA link
- **Communication Interface**: Modbus TCP (Default Port: 502, Unit ID: 255, Holding Registers `1066`–`1102` & `2065`–`2066`)

#### Telemetry Data Read by GEMS
Battery Charge/Discharge Power (W), Battery SOC (%), Cumulative Charged Energy (kWh), Grid Sensor Power (W), Attached PV Sensor Power (W).

#### Controllable Setpoints & Data Written by GEMS
VARTA EMS Active Power Control (`2065` Command: Charge/Discharge/Auto, `2066` Power W; fallback `1074`).

#### What GEMS Actually Does With This Device
Closed-loop local Modbus TCP control for VARTA AC-coupled storage systems: automates off-peak spot charging and household peak shaving.

---

### 2.17 Zendure SolarFlow AC / Hyper 2000

- **Template Identifier**: `zendure_solarflow`
- **Manufacturer / Vendor**: Zendure
- **Supported Hardware Models**: Zendure Hyper 2000, SolarFlow 800, SolarFlow AB1000/AB2000, SolarFlow 2400 AC
- **Communication Interface**: Local HTTP JSON API (`GET /properties/report`, `POST /properties/write`)

#### Telemetry Data Read by GEMS
Solar Input Power (W), Battery Pack Charge & Discharge Power (W), State of Charge (`electricLevel` %).

#### Controllable Setpoints & Data Written by GEMS
Smart AC Mode (`acMode` Charge/Discharge) and Stepless `inputLimit` / `outputLimit` Watt Setpoints (`0–2400 W`).

#### What GEMS Actually Does With This Device
100% local zero-cloud control for plug-in and AC-coupled Zendure storage: absorbs surplus PV and discharges to cover household evening peaks.

---

### 2.18 Sinexcel PWS Bi-Directional PCS / Commercial BESS

- **Template Identifier**: `sinexcel_bess`
- **Manufacturer / Vendor**: Sinexcel
- **Supported Hardware Models**: Sinexcel PWS1-30K / 50K / 100K / 250K / 500K / 630K Bi-Directional PCS & Commercial BESS Racks
- **Communication Interface**: Modbus TCP / RTU (Default Port: 502, Unit ID: 1, Holding `100`–`113` & `600`–`610`)

#### Telemetry Data Read by GEMS
Battery Active Power (`106` 0.1 kW), Battery SOC (`109` 0.1%), Cumulative Discharged Energy (`110`–`111` 0.1 kWh), Live BMS Max Charge/Discharge Power Limits (`112`–`113` 0.1 kW), 3-Phase Voltages & Currents.

#### Controllable Setpoints & Data Written by GEMS
Remote PCS Start/Standby (`600`), Constant-Power PQ Mode (`601`), Signed Active Power Setpoint (`602` S16 0.1 kW), and 60-Second Fail-Safe Watchdog (`610`).

#### What GEMS Actually Does With This Device
Closed-loop industrial and C&I battery control for Sinexcel PWS storage converters: automates high-power peak shaving, grid transformer capacity protection, and Day-Ahead spot arbitrage.

---

### 2.19 Custom Modbus Battery Storage (UI Register Profile)

- **Template Identifier**: `custom_modbus_battery`
- **Manufacturer / Vendor**: Custom Modbus
- **Supported Hardware Models**: Any Modbus TCP or RS-485 RTU Stationary Home Battery, PCS, or BMS Gateway configured via the Certified Installer UI Register Profile Builder
- **Communication Interface**: Modbus TCP / RTU (Configurable Port or `/dev/serial/by-id/*` Bus, Unit ID, `FC03`/`FC04` Reads & Optional `FC06`/`FC16` Writes)

#### Telemetry Data Read by GEMS
UI-mapped Battery Charge/Discharge Power (W), Battery SOC (%), Live BMS Max Charge/Discharge Limits (W), Cumulative Energy (kWh), and 3-Phase Voltages & Currents.

#### Controllable Setpoints & Data Written by GEMS
Optional UI-mapped Signed or Directional Battery Power Setpoints (`battery_power_w`, `battery_charge_w`, `battery_discharge_w`), Clamped Min/Max Safety Bounds, Watchdog Heartbeat, and Safe Self-Consumption Fallback.

#### What GEMS Actually Does With This Device
Integrates custom residential and commercial Modbus BESS units into GEMS 24-hour dynamic arbitrage, Flanders peak shaving, and negative-price solar absorption without custom code.

---

## 3. Electric Vehicle (EV) Charging Stations & Wallboxes (61 Devices)

EV charging stations interface via **Modbus TCP/RTU fieldbus (recommended & preferred)**, **Universal Native OCPP 1.6-J WebSocket Server**, or **Local HTTP REST APIs**. Chargers support dynamic sub-second current throttling (6A to 32A in 0.1A or 1A increments), opt-in 1-phase / 3-phase switching (1.4 kW to 22 kW on supported dual-contactor hardware), excess solar tracking (Eco mode), Flanders capacity tariff peak shaving, and main service fuse overload protection. Critically, Modbus TCP integration allows GEMS to regulate charging speed locally without interfering with or disconnecting third-party corporate billing / employer reimbursement backends.

### 3.1 ABB Charger

- **Template Identifier**: `abb_charger`
- **Manufacturer / Vendor**: ABB
- **Supported Hardware Models**: ABB Terra AC Wallbox (TAC-W7, TAC-W11, TAC-W22 Series)
- **Communication Interface**: Modbus TCP via Ethernet / Wi-Fi (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active charging power (W, reg 0x401C), Cumulative session energy (kWh, reg 0x401E).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Charging Current Throttling (Amps, reg 0x4100, 6A to 32A in 1mA steps).

#### What GEMS Actually Does With This Device
Sub-second current throttling over Modbus TCP: dynamically modulates charging current based on solar surplus (Eco mode) and throttles down immediately during capacity peaks (Flanders mode); coexists seamlessly with third-party billing/reimbursement backends.

---

### 3.2 ABL eM4 Single/Twin (SBCx)

- **Template Identifier**: `abl_em4_charger`
- **Manufacturer / Vendor**: ABL
- **Supported Hardware Models**: ABL Wallbox eM4 Single & eM4 Twin (with internal SBCx Controller)
- **Communication Interface**: Modbus TCP (Default Port: 502, Unit ID: 255 or 1)

#### Telemetry Data Read by GEMS
Active charging power (W, reg 0x300D), Total energy (kWh, reg 0x300F).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Charging Current Throttling (Amps, reg 0x3001, 6A to 32A).

#### What GEMS Actually Does With This Device
Direct Modbus control: throttles single or dual socket charging currents to match rooftop solar surplus and Flanders capacity limits without disconnecting corporate billing.

---

### 3.3 ABL eMH1 / eMH2 / eMH3

- **Template Identifier**: `abl_emh_charger`
- **Manufacturer / Vendor**: ABL
- **Supported Hardware Models**: ABL Wallbox eMH1, eMH2, eMH3 Series (with RS485-to-Ethernet Bridge)
- **Communication Interface**: Modbus RTU over TCP Bridge (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-time charging power (W), Session energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Charging Current Throttling (Amps, 6A to 32A).

#### What GEMS Actually Does With This Device
Integrates legacy and modern ABL eMH chargers; provides automated solar-following charging and peak shaving.

---

### 3.4 AUTEL AC MaxiCharger

- **Template Identifier**: `autel_charger`
- **Manufacturer / Vendor**: AUTEL
- **Supported Hardware Models**: Autel MaxiCharger AC Compact / MaxiCharger AC Wallbox (7.4kW, 11kW, 22kW)
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (Port: 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Telemetry Data Read by GEMS
Real-time charging power (W), Session energy (kWh), Vehicle connection state, 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling via SetChargingProfile (6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Autonomous residential charging over native OCPP: adjusts charging speed to solar excess and halts charging during peak tariff periods.

---

### 3.5 Alfen Charger

- **Template Identifier**: `alfen_charger`
- **Manufacturer / Vendor**: Alfen
- **Supported Hardware Models**: Alfen Eve Single Pro-line, Eve Single S-line, Eve Double Pro-line (Direct Modbus TCP)
- **Communication Interface**: Modbus TCP / Active Load Balancing license (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active charging power (W), Total energy (kWh), Per-phase charging currents (Amps).

#### Controllable Setpoints & Data Written by GEMS
Modbus Slave Max Current (`1210` IEEE-754 Float32 Amps with station watchdog) and Contactor Phase Switching (`1215`: `1` = 1-Phase, `3` = 3-Phase).

#### What GEMS Actually Does With This Device
Preferred Benelux Modbus TCP integration for Alfen Eve Single & Double Pro-line: sub-second solar surplus tracking, main fuse protection, and automated 1P/3P switching.

---

### 3.6 Alpitronic Hypercharger

- **Template Identifier**: `alpitronic_charger`
- **Manufacturer / Vendor**: Alpitronic
- **Supported Hardware Models**: Alpitronic Hypercharger HYC50, HYC150, HYC300, HYC400 DC Fast Chargers
- **Communication Interface**: Modbus TCP / OCPP 1.6-J (Default Port: 502 or 8887, Unit ID: 1)

#### Telemetry Data Read by GEMS
Active DC charging power (kW/W), Cumulative delivered energy (kWh), Connector status.

#### Controllable Setpoints & Data Written by GEMS
Dynamic Charging Power Limit (kW / Amps setpoints).

#### What GEMS Actually Does With This Device
Dynamically limits DC fast charging output to stay strictly below site grid connection capacity and Flemish peak limits during high-demand periods.

---

### 3.7 BMW i Wallbox (Connect/Pro)

- **Template Identifier**: `bmw_charger`
- **Manufacturer / Vendor**: BMW
- **Supported Hardware Models**: BMW i Wallbox Connect, BMW i Wallbox Pro (Modbus TCP / UDP)
- **Communication Interface**: Modbus TCP via LAN (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Charging power (W), Session energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Setpoint (Amps, 6A to 32A).

#### What GEMS Actually Does With This Device
Local LAN current regulation; coordinates charging with home solar availability and off-peak EPEX price hours.

---

### 3.8 Bender Charger

- **Template Identifier**: `bender_charger`
- **Manufacturer / Vendor**: Bender
- **Supported Hardware Models**: Bender CC612, CC613 Charge Controllers (embedded in various OEM wallboxes)
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active charging power (W), Session energy (kWh), Pilot state.

#### Controllable Setpoints & Data Written by GEMS
Bender CC612 / CC613 HEMSw Limit (`1001` 0.1 A on FW >= 4.70, fallback `1000` 1 A) and Dynamic 1-Phase / 3-Phase Switching (`1002`).

#### What GEMS Actually Does With This Device
Direct local Modbus TCP control for Bender CC612/CC613 controllers (EBEE, Compleo, Mennekes OEMs) with sub-amp throttling and 1P/3P solar switching.

---

### 3.9 Blitzpower / Phoenix CharX

- **Template Identifier**: `blitzpower_charger`
- **Manufacturer / Vendor**: Blitzpower
- **Supported Hardware Models**: Blitzpower AC Wallbox Series (Phoenix Contact CHARX architecture)
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Charging power (W), Cumulative energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Charging Current Throttling (Amps, 6A to 32A).

#### What GEMS Actually Does With This Device
Fast Modbus register regulation: modulates current setpoints for solar surplus charging and peak shaving.

---

### 3.10 Delta AC MAX / SLIM / Ultra Fast Charger

- **Template Identifier**: `delta_charger`
- **Manufacturer / Vendor**: Delta
- **Supported Hardware Models**: Delta AC MAX Basic/Smart (7.4kW/11kW/22kW), Delta SLIM, Ultra Fast EV Chargers
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active charging power (W), Total energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Charging Current Setpoint (Amps, 6A to 32A).

#### What GEMS Actually Does With This Device
Modulates Delta wallbox current setpoint via Modbus TCP; optimizes charging speed to absorb solar production without importing expensive grid power.

---

### 3.11 EN+ AC EV Charger

- **Template Identifier**: `enplus_charger`
- **Manufacturer / Vendor**: EN+
- **Supported Hardware Models**: EN+ AC EV Charger Series (Home / Commercial Series)
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (Port: 8887)

#### Telemetry Data Read by GEMS
Charging power (W), Energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages.

#### Controllable Setpoints & Data Written by GEMS
Charging Current Throttling (Amps, 6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Autonomous solar tracking and peak shaving via OCPP SetChargingProfile commands.

---

### 3.12 ETEK EKEPC2-C/S Charge Controller

- **Template Identifier**: `etek_charger`
- **Manufacturer / Vendor**: ETEK
- **Supported Hardware Models**: ETEK EKEPC2-C / EKEPC2-S Intelligent Charge Controller (Modbus RTU/TCP)
- **Communication Interface**: Modbus TCP via Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Charging power (W), Session energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling (Amps, 6A to 32A).

#### What GEMS Actually Does With This Device
Direct register writes to adjust charge rate based on real-time household power balance.

---

### 3.13 EVBox Elvi / Livo / BusinessLine

- **Template Identifier**: `evbox_charger`
- **Manufacturer / Vendor**: EVBox
- **Supported Hardware Models**: EVBox Elvi, EVBox Livo, EVBox BusinessLine (OCPP 1.6-J)
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (Port: 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Telemetry Data Read by GEMS
Real-time charging power (W), Total delivered energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts), Connector status.

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling via SetChargingProfile (6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Full native OCPP support for EVBox: dynamically throttles charging current in 1A increments to absorb rooftop solar and prevent capacity tariff penalties.

---

### 3.14 Easee Charger

- **Template Identifier**: `easee_charger`
- **Manufacturer / Vendor**: Easee
- **Supported Hardware Models**: Easee Home, Easee Charge (Cloud REST API)
- **Communication Interface**: Easee Cloud REST API (Cloud credentials authentication)

#### Telemetry Data Read by GEMS
Active charging power (W), Total session energy (kWh), Charger status.

#### Controllable Setpoints & Data Written by GEMS
Easee API dynamic circuit/charger current (6–32 A), session `pause_charging` / `resume_charging`, and automatic `phaseMode` 1-Phase / 3-Phase switching.

#### What GEMS Actually Does With This Device
Verified smart charging control for Easee Home, Charge, and Charge Lite/Up: modulates charging amps, pauses/resumes cleanly, and switches between 1-phase and 3-phase solar modes.

---

### 3.15 Enovates SingleWallBox

- **Template Identifier**: `enovates_charger`
- **Manufacturer / Vendor**: Enovates
- **Supported Hardware Models**: Enovates SingleWallBox (Modbus TCP)
- **Communication Interface**: Modbus TCP via LAN (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Charging power (W), Total energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Setpoint (Amps, 6A to 32A).

#### What GEMS Actually Does With This Device
Direct local Modbus control; operates in harmony with external CPO billing platforms while GEMS manages local load balancing and peak shaving.

---

### 3.16 Ensto Chago Wallbox / Pro

- **Template Identifier**: `ensto_charger`
- **Manufacturer / Vendor**: Ensto
- **Supported Hardware Models**: Ensto Chago Wallbox, Ensto One, Ensto Pro Series (Modbus TCP)
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active charging power (W), Total energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Charging Current Throttling (Amps, 6A to 32A).

#### What GEMS Actually Does With This Device
High-reliability Scandinavian commercial/home charger; throttles charge current to respect domestic supply limits and solar surplus.

---

### 3.17 Etrel INCH / sonnenCharger

- **Template Identifier**: `etrel_charger`
- **Manufacturer / Vendor**: Etrel
- **Supported Hardware Models**: Etrel INCH Pro, Etrel INCH Lite, sonnenCharger (Modbus TCP)
- **Communication Interface**: Modbus TCP via Ethernet (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active power (W), Session energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Setpoint (Amps, 6A to 32A).

#### What GEMS Actually Does With This Device
Local Modbus TCP regulation; optimizes charging to match sonnen or third-party battery states and rooftop solar.

---

### 3.18 Fronius Wattpilot (Home / Go)

- **Template Identifier**: `fronius_wattpilot`
- **Manufacturer / Vendor**: Fronius
- **Supported Hardware Models**: Fronius Wattpilot Home (11J/22J), Fronius Wattpilot Go (11J/22J)
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (Port: 8887)

#### Telemetry Data Read by GEMS
Active power (W), Energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling (Amps, 6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Operates Wattpilot in zero-cloud mode directly connected to GEMS; supports dynamic 1-phase / 3-phase switching and solar surplus tracking.

---

### 3.19 GoodWe HCA Series EV Wallbox (Gen 2)

- **Template Identifier**: `goodwe_charger`
- **Manufacturer / Vendor**: GoodWe
- **Supported Hardware Models**: GoodWe HCA Series EV Wallbox (Gen 2 Modbus TCP)
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Charging power (W), Session energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Charging Current Setpoint (Amps, 6A to 32A).

#### What GEMS Actually Does With This Device
Coordinates GoodWe wallboxes with GoodWe hybrid inverters; prioritizes battery charging before routing surplus into the EV.

---

### 3.20 Hager witty (one / plus / pro / park 2)

- **Template Identifier**: `hager_charger`
- **Manufacturer / Vendor**: Hager
- **Supported Hardware Models**: Hager witty, witty one, witty plus, witty pro, witty park 2 (OCPP 1.6-J)
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (Port: 8887)

#### Telemetry Data Read by GEMS
Active power (W), Session energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages.

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling (Amps, 6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Zero-cloud residential management of Hager witty wallboxes; solar excess following and capacity tariff peak shaving.

---

### 3.21 Huawei FusionCharge (SCharger-7KS / 22KT)

- **Template Identifier**: `huawei_scharger`
- **Manufacturer / Vendor**: Huawei
- **Supported Hardware Models**: Huawei FusionCharge AC Wallbox (SCharger-7KS Single-Phase, SCharger-22KT Three-Phase)
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (Port: 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Telemetry Data Read by GEMS
Active charging power (W), Session energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts), Plug state.

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling via SetChargingProfile (6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Direct local control of Huawei FusionCharge without requiring FusionSolar cloud: coordinates perfectly with Huawei SUN2000 inverters and LUNA2000 batteries to ensure the car only charges from 100% pure solar.

---

### 3.22 KEBA KeContact P30/P40

- **Template Identifier**: `keba_charger`
- **Manufacturer / Vendor**: KEBA
- **Supported Hardware Models**: KEBA KeContact P30 (c-series, x-series), KeContact P40 Series (Modbus TCP / UDP)
- **Communication Interface**: Modbus TCP via LAN (Default Port: 502, Unit ID: 255)

#### Telemetry Data Read by GEMS
Active charging power (W, reg 1020), Total energy (kWh, reg 1036).

#### Controllable Setpoints & Data Written by GEMS
KEBA KeContact P30 x/c-series & P40 Charging Current in milliamps (`5004`), Enable (`5014`), and KeContact S10 Phase Switching (`5050=3`, `5052=0/1`).

#### What GEMS Actually Does With This Device
High-precision 1 mA Modbus TCP control and 1P/3P phase switching for KEBA KeContact P30 and P40 installations.

---

### 3.23 Mennekes AMTRON (4You / 4Business / ACU / AMEDIO)

- **Template Identifier**: `mennekes_ocpp`
- **Manufacturer / Vendor**: Mennekes
- **Supported Hardware Models**: Mennekes AMTRON 4You, AMTRON 4Business, AMTRON Professional, AMEDIO (OCPP 1.6-J)
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (Port: 8887)

#### Telemetry Data Read by GEMS
Active power (W), Total energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages.

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling via SetChargingProfile (6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Universal OCPP control for modern Mennekes product lines; enables solar-only charging and Flemish capacity peak prevention.

---

### 3.24 Mennekes AMTRON (Xtra / Premium / HCC3 Modbus)

- **Template Identifier**: `mennekes_modbus`
- **Manufacturer / Vendor**: Mennekes
- **Supported Hardware Models**: Mennekes AMTRON Xtra, AMTRON Premium, HCC3 Controller Series (Modbus TCP)
- **Communication Interface**: Modbus TCP via LAN (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active charging power (W), Cumulative energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Charging Current Throttling (Amps, 6A to 32A).

#### What GEMS Actually Does With This Device
Direct local Modbus control for Mennekes premium hardware; eliminates cloud lag for instant peak shaving.

---

### 3.25 Mercedes-Benz Wallbox

- **Template Identifier**: `mercedes_wallbox`
- **Manufacturer / Vendor**: Mercedes-Benz
- **Supported Hardware Models**: Mercedes-Benz Wallbox (Home AC Charger, up to 22kW)
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (Port: 8887)

#### Telemetry Data Read by GEMS
Active power (W), Energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages.

#### Controllable Setpoints & Data Written by GEMS
Charging Current Throttling (Amps, 6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Autonomous home charging for Mercedes-Benz Wallbox; integrates into GEMS dynamic load balancing.

---

### 3.26 NRGkick (Gen 2)

- **Template Identifier**: `nrgkick_gen2`
- **Manufacturer / Vendor**: NRGkick
- **Supported Hardware Models**: NRGkick Gen 2 Mobile & Wall-Mounted Smart EV Charger (Local Modbus TCP / Wi-Fi)
- **Communication Interface**: Modbus TCP via local Wi-Fi (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-time charging power (W), Energy delivered (kWh).

#### Controllable Setpoints & Data Written by GEMS
Charging Current Throttling (Amps, 6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Local Modbus TCP regulation for mobile/wallbox NRGkick; automatically modulates current setpoints based on solar excess.

---

### 3.27 OCPP Charger

- **Template Identifier**: `ocpp_charger`
- **Manufacturer / Vendor**: Generic
- **Supported Hardware Models**: Universal Generic OCPP 1.6-J Smart EV Charger (Any OCPP 1.6-J compliant hardware)
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (`ws://<EMS-IP>:8887/<ChargePointID>` or `ws://<EMS-IP>:8080/api/ocpp/<ChargePointID>`)

#### Telemetry Data Read by GEMS
Active power (W), Delivered energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts), Plug and transaction status.

#### Controllable Setpoints & Data Written by GEMS
Standardized OCPP 1.6-J SetChargingProfile (Current Setpoints: 0A pause and 6A to 32A).

#### What GEMS Actually Does With This Device
Vendor-agnostic central system: supports hundreds of compliant commercial and residential wallboxes worldwide; coordinates dynamic charging profiles according to GEMS site strategy.

---

### 3.28 Peblar EV Charger (Home / Business / Plus)

- **Template Identifier**: `peblar_charger`
- **Manufacturer / Vendor**: Peblar
- **Supported Hardware Models**: Peblar Home, Peblar Business, Peblar Plus (Modbus TCP Direct)
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-time charging power (W), Cumulative session energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Setpoint (Amps, 6A to 32A in 0.1A steps), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Dutch engineering wallbox: allows GEMS to command sub-second current adjustments over Modbus TCP while Pebble/Peblar cloud handles business split-billing.

---

### 3.29 Phoenix Contact Charx Charger

- **Template Identifier**: `phoenix_charger`
- **Manufacturer / Vendor**: Phoenix Contact
- **Supported Hardware Models**: Phoenix Contact CHARX SEC / EV-CC-AC1-M3 Series (Modbus TCP)
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Charging power (W), Total session energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Phoenix Contact CHARX SEC-3000 / EV-CC Modbus Charging Current Limit and Charge Enable Coil/Register.

#### What GEMS Actually Does With This Device
Industrial-grade local Modbus TCP load balancing and solar surplus charging for Phoenix Contact CHARX controllers.

---

### 3.30 Phoenix Contact EV-CC / CHARX (Modbus TCP)

- **Template Identifier**: `phoenix_contact_evcc`
- **Manufacturer / Vendor**: Phoenix Contact
- **Supported Hardware Models**: Phoenix Contact EV-CC-AC1-M3 / CHARX Control Modular (Modbus TCP)
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active charging power (W), Total energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling (Amps, 6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Direct register writes to adjust charge rates for peak shaving and solar surplus.

---

### 3.31 External CPO Wallbox (OCPP 1.6-J)

- **Template Identifier**: `generic_cpo_ocpp`
- **Manufacturer / Vendor**: Generic OCPP
- **Supported Hardware Models**: AC Wallbox Series compatible with OCPP 1.6-J and External CPO Reimbursement
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (`ws://<EMS-IP>:8080/api/ocpp/<ChargePointID>`)

#### Telemetry Data Read by GEMS
Active power (W), Delivered energy (kWh), 3-Phase currents and voltages.

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling (Amps, 6A to 32A).

#### What GEMS Actually Does With This Device
Local smart charging and straight-through OCPP proxy load arbitration with external CPO billing platforms based on solar excess and fuse limits.

---

### 3.32 Porsche Wallbox / Mobile Charger Connect

- **Template Identifier**: `porsche_wallbox`
- **Manufacturer / Vendor**: Porsche
- **Supported Hardware Models**: Porsche Mobile Charger Connect, Porsche Wallbox (OCPP 1.6-J)
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (Port: 8887)

#### Telemetry Data Read by GEMS
Active charging power (W), Delivered energy (kWh), 3-Phase currents and voltages.

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling (Amps, 6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Connects Porsche chargers directly to GEMS without subscription; enforces Flanders peak limits.

---

### 3.33 RAEDIAN Gemini AC Wallbox

- **Template Identifier**: `raedian_gemini`
- **Manufacturer / Vendor**: RAEDIAN
- **Supported Hardware Models**: RAEDIAN Gemini Dual-Socket AC Commercial & Fleet Wallbox (Up to 2x 22kW, 44kW total)
- **Communication Interface**: Modbus TCP via LAN (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Combined active power (W), Individual Socket 1 & Socket 2 charging power (W), Per-socket energy (kWh), Individual 3-phase currents for Socket 1 (L1, L2, L3) and Socket 2 (L1, L2, L3 in Amps), Per-socket plug status.

#### Controllable Setpoints & Data Written by GEMS
Continuous Dynamic Current Modulation (0A to 64A total range, dynamically split across Socket 1 & Socket 2), Individual Socket Mode (Eco / Fast / Off).

#### What GEMS Actually Does With This Device
Advanced dual-socket load management: balances charging speeds between two vehicles simultaneously; dynamically adjusts combined current from 0A to 64A; protects building electrical service fuses while maximizing solar self-consumption.

---

### 3.34 RAEDIAN NEO / NEX AC Wallbox

- **Template Identifier**: `raedian_charger`
- **Manufacturer / Vendor**: RAEDIAN
- **Supported Hardware Models**: RAEDIAN NEO Series, RAEDIAN NEX Series AC Smart Wallbox (7.4kW, 11kW, 22kW)
- **Communication Interface**: Modbus TCP via LAN or Wi-Fi (Default Port: 502, Slave ID: 1 or 2)

#### Telemetry Data Read by GEMS
Real-time active charging power (W), Session energy (kWh), 3-Phase charging currents (L1, L2, L3 in Amps), 3-Phase charging voltages (L1, L2, L3 in Volts), Socket status & error codes.

#### Controllable Setpoints & Data Written by GEMS
Continuous Dynamic Current Throttling (Amps, 6A to 32A in 0.1A increments), Automated Session Pause & Resume.

#### What GEMS Actually Does With This Device
Preferred Modbus TCP flagship integration: single-read batching polls all 3-phase currents and voltages in a single request; sub-second current throttling responds instantly to solar surplus and Flanders capacity tariff peaks.

---

### 3.35 SMA EV Charger (7.4 / 22 / eCharger)

- **Template Identifier**: `sma_evcharger`
- **Manufacturer / Vendor**: SMA
- **Supported Hardware Models**: SMA EV Charger 7.4, SMA EV Charger 22
- **Communication Interface**: Local HTTP REST API (Default Port: 80 / 443)

#### Telemetry Data Read by GEMS
Active power (W), Cumulative energy (kWh), 3-Phase currents (L1, L2, L3 in Amps).

#### Controllable Setpoints & Data Written by GEMS
Monitor-Only (Read-Only Telemetry — SMA EV Charger requires SEMP/SHM2 for active current control).

#### What GEMS Actually Does With This Device
Monitors SMA EV Charger real-time power draw and session energy for household load accounting.

---

### 3.36 Schneider Electric EVlink (Wallbox / Pro AC)

- **Template Identifier**: `schneider_evlink`
- **Manufacturer / Vendor**: Schneider Electric
- **Supported Hardware Models**: Schneider Electric EVlink Wallbox, EVlink Pro AC, EVlink Smart Wallbox (OCPP 1.6-J)
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (Port: 8887)

#### Telemetry Data Read by GEMS
Active charging power (W), Energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages.

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling via SetChargingProfile (6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Native OCPP setpoint regulation; provides smooth solar surplus charging and capacity peak avoidance.

---

### 3.37 Siemens VersiCharge GEN3 Wallbox

- **Template Identifier**: `siemens_versicharge`
- **Manufacturer / Vendor**: Siemens
- **Supported Hardware Models**: Siemens VersiCharge GEN3 AC Smart Wallbox (Commercial & Residential 7.4kW - 22kW)
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (Port: 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Telemetry Data Read by GEMS
Real-time power (W), Cumulative energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages.

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling (Amps, 6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Connects Siemens VersiCharge GEN3 to GEMS over OCPP; executes Flanders peak shaving and solar surplus matching.

---

### 3.38 Sigenergy SigenStor EVAC / EVDC Charger

- **Template Identifier**: `sigenergy_evac`
- **Manufacturer / Vendor**: Sigenergy
- **Supported Hardware Models**: Sigenergy Sigen EVAC AC Wallbox, Sigen EVDC Bidirectional Fast Charger
- **Communication Interface**: Modbus TCP via Sigen Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Charging power (W), Session energy (kWh), 3-Phase currents and voltages.

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling (Amps, 6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Direct Modbus control over Sigen EV charging; coordinates with SigenStor battery to absorb excess solar.

---

### 3.39 SmartEVSE v2 / v3 (HTTP / Modbus)

- **Template Identifier**: `smartevse_charger`
- **Manufacturer / Vendor**: SmartEVSE
- **Supported Hardware Models**: SmartEVSE v2, SmartEVSE v3 Open-Source EV Charging Controller
- **Communication Interface**: Local HTTP REST API / Modbus TCP (Default Port: 80, REST endpoint: /add)

#### Telemetry Data Read by GEMS
Active power (W), Total energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts), Pilot status.

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling (Amps, 6A to 32A via /add?current=X), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Local REST setpoint modulation; allows open-source charging hardware to run 100% solar surplus charging without cloud accounts.

---

### 3.40 SolarEdge EV Charger

- **Template Identifier**: `solaredge_evse`
- **Manufacturer / Vendor**: SolarEdge
- **Supported Hardware Models**: SolarEdge Home EV Charger (Integrated Inverter-Charger & Standalone AC Wallbox)
- **Communication Interface**: Modbus TCP via SolarEdge inverter or standalone module (Default Port: 502 / 1502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active charging power (W), Cumulative energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Setpoint (Amps, 6A to 32A).

#### What GEMS Actually Does With This Device
Synchronizes charging rate with SolarEdge inverter production; protects household main fuses.

---

### 3.41 Veton / Phoenix CharX

- **Template Identifier**: `veton_charger`
- **Manufacturer / Vendor**: Veton
- **Supported Hardware Models**: Veton One, Veton Two, Veton Wallbox Series (Design Luxury Chargers)
- **Communication Interface**: Modbus TCP via internal Phoenix Contact CHARX controller (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active charging power (W), Session energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Charging Current Throttling (Amps, 6A to 32A).

#### What GEMS Actually Does With This Device
Direct Modbus TCP register writes; provides seamless solar surplus charging and peak shaving for premium architectural Veton chargers.

---

### 3.42 Volkswagen / Elli / Skoda / SEAT (ID. Charger Connect / Pro)

- **Template Identifier**: `elli_charger`
- **Manufacturer / Vendor**: Volkswagen / Elli
- **Supported Hardware Models**: Volkswagen ID. Charger Connect / Pro, Elli Charger, Skoda iV Charger, SEAT Charger
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (Port: 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Telemetry Data Read by GEMS
Active charging power (W), Total session energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts), Plug status.

#### Controllable Setpoints & Data Written by GEMS
Dynamic Current Throttling via SetChargingProfile (6A to 32A), Phase Switching (1P / 3P).

#### What GEMS Actually Does With This Device
Direct native OCPP server integration: allows VW Group ID. Chargers to charge purely on excess solar power and avoid Flanders capacity tariff peaks without requiring expensive manufacturer cloud subscriptions.

---

### 3.43 Wallbox Pulsar/Commander

- **Template Identifier**: `wallbox_charger`
- **Manufacturer / Vendor**: Wallbox
- **Supported Hardware Models**: Wallbox Pulsar Plus, Pulsar Max, Commander 2, Copper SB (Wallbox Cloud REST API)
- **Communication Interface**: Cloud REST API (Wallbox Cloud Credentials Authentication)

#### Telemetry Data Read by GEMS
Active charging power (W), Total energy (kWh), Charger status.

#### Controllable Setpoints & Data Written by GEMS
Wallbox API `PUT /v2/charger/{id}` dynamic amp limit (6–32 A) and `POST /v3/chargers/{id}/remote-action` (`action: 1` Resume / `2` Pause).

#### What GEMS Actually Does With This Device
Verified closed-loop current modulation and automatic session pause/resume for Wallbox Pulsar Plus, Pulsar Max, Copper SB, and Commander 2.

---

### 3.44 Webasto Next Charger

- **Template Identifier**: `webasto_charger`
- **Manufacturer / Vendor**: Webasto
- **Supported Hardware Models**: Webasto Next, Webasto Live, Webasto Unite (Modbus TCP Direct)
- **Communication Interface**: Modbus TCP via LAN or Wi-Fi (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active charging power (W, reg 5000), Delivered session energy (kWh, reg 5002).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Charging Current Throttling (Amps, reg 5004, 6A to 32A).

#### What GEMS Actually Does With This Device
Direct Modbus control: throttles Webasto wallbox within milliseconds to protect main grid fuses and prevent capacity tariff spikes while external backend handles corporate billing.

---

### 3.45 Zaptec Pro/Go

- **Template Identifier**: `zaptec_charger`
- **Manufacturer / Vendor**: Zaptec
- **Supported Hardware Models**: Zaptec Go, Zaptec Pro (Zaptec Cloud REST API)
- **Communication Interface**: Cloud REST API (Zaptec OAuth2 authentication)

#### Telemetry Data Read by GEMS
Active power (W), Cumulative energy (kWh), Session status.

#### Controllable Setpoints & Data Written by GEMS
Zaptec OAuth2 `/api/chargers/{id}/update` (`maxChargeCurrent` 0.1 A, `maxChargePhases` 1/3, Go 2 `threeToOnePhaseSwitchCurrent`), plus `/sendCommand/506` (Pause) & `507` (Resume).

#### What GEMS Actually Does With This Device
Verified precision control for Zaptec Go, Go 2, and Pro installations with OCMF energy decoding, pause/resume, and 1P/3P solar switching.

---

### 3.46 go-e Charger Gemini / HOMEfix / PRO

- **Template Identifier**: `goe_charger`
- **Manufacturer / Vendor**: go-e
- **Supported Hardware Models**: go-e Charger Gemini, Gemini flex, HOMEfix, HOME+ (Local HTTP API v2)
- **Communication Interface**: Local HTTP REST API v2 (Default Port: 80, JSON endpoints: /api/status, /api/set)

#### Telemetry Data Read by GEMS
Charging power (W), Session energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts), Authorization state.

#### Controllable Setpoints & Data Written by GEMS
Volatile RAM Charging Current Throttling (Amps, 6A to 32A via `/api/set?amx=X` + `frc` pause/resume — zero NVS flash wear), Phase Switching (1P / 3P via `/api/set?psm=X`).

#### What GEMS Actually Does With This Device
High-speed local HTTP API: allows GEMS to switch dynamically between 1-phase (from 1.4 kW solar) and 3-phase (up to 22 kW) charging; throttles within milliseconds during domestic power spikes.

---

### 3.47 Generic Local REST EVSE Gateway

- **Template Identifier**: `generic_rest_evse`
- **Manufacturer / Vendor**: Generic REST
- **Supported Hardware Models**: Open Local REST EVSE Controllers and Load Gateways
- **Communication Interface**: Local HTTP REST API (Default Port: 80, REST endpoint: /api/v1)

#### Telemetry Data Read by GEMS
Real-time Charging Power (W), Cumulative Session Energy (kWh), Charging Station State.

#### Controllable Setpoints & Data Written by GEMS
Dynamic Charging Current Throttling (Amps, 6A to 32A).

#### What GEMS Actually Does With This Device
Distributed multi-charger orchestration and dynamic load management, balancing aggregated fleet charging against local grid connection limits.

---

### 3.48 Kempower Fast Charging Infrastructure

- **Template Identifier**: `kempower_charger`
- **Manufacturer / Vendor**: Kempower
- **Supported Hardware Models**: Kempower C-Series and S-Series Fast Charging Satellites & Power Units
- **Communication Interface**: Modbus TCP via Kempower Central Controller (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-time Charging Power (W), Session Energy (kWh), 3-Phase Charging Currents (L1, L2, L3 in Amps).

#### Controllable Setpoints & Data Written by GEMS
Native local OCPP 1.6-J `SetChargingProfile` power/current throttling with automatic Modbus TCP register `200` (`0.1 A`) fallback.

#### What GEMS Actually Does With This Device
Verified commercial fast-charging and fleet load management for Kempower Satellite and Station Chargers.

---

### 3.49 MyEnergi Zappi EV Charger

- **Template Identifier**: `myenergi_zappi`
- **Manufacturer / Vendor**: MyEnergi
- **Supported Hardware Models**: MyEnergi Zappi v2 and v2.1 with Hub / built-in Wi-Fi
- **Communication Interface**: Local HTTP REST / CGI API (Default Port: 80, Endpoint: /cgi-jstatus)

#### Telemetry Data Read by GEMS
Real-time Charging Power (W), Session Added Energy (kWh), Charging Status, Mode (Fast, Eco, Eco+).

#### Controllable Setpoints & Data Written by GEMS
Authenticated HTTP Digest CGI commands (`/cgi-zappi-mode-Z{sno}-{mode}-...`) with ASN redirect tracking, switching dynamically between Stop, Eco+, Eco, and Fast boost modes.

#### What GEMS Actually Does With This Device
Verified local/hub control for myenergi Zappi v2/v2.1 wallboxes with full 3-phase telemetry, phase mode reporting, and active session throttling.

---

### 3.50 SolaX Smart EV Charger

- **Template Identifier**: `solax_evcharger`
- **Manufacturer / Vendor**: SolaX
- **Supported Hardware Models**: SolaX Smart EV Charger X1-EVC / X3-EVC (7.2kW – 22kW)
- **Communication Interface**: Modbus TCP via Wi-Fi/Ethernet (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-time Charging Power (W), Cumulative Session Energy (kWh), Phase Currents (L1, L2, L3 in Amps).

#### Controllable Setpoints & Data Written by GEMS
SolaX X1/X3-EVC Max Current (`0x0628` in `0.01 A` steps), Remote Mode (`0x060D=1`), Stop/Start (`0x0627`), and 1-Phase / 3-Phase Switching (`0xA105`).

#### What GEMS Actually Does With This Device
Verified native Modbus TCP/RTU closed-loop control for SolaX Smart EV Chargers with 10 mA solar tracking and 1P/3P contactor switching.

---

### 3.51 Teltonika TeltoCharge

- **Template Identifier**: `teltonika_teltocharge`
- **Manufacturer / Vendor**: Teltonika Energy
- **Supported Hardware Models**: Teltonika TeltoCharge EVC1 Series (7.4kW – 22kW)
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (Port: 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Telemetry Data Read by GEMS
Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Currents (L1, L2, L3 in Amps), Voltages (V).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Charging Current Throttling (Amps, 6A to 32A via SetChargingProfile).

#### What GEMS Actually Does With This Device
Native OCPP integration for European residential installations; optimizes charging against Flemish capacity peaks and EPEX spot prices.

---

### 3.52 Volt Time Source EV Charger

- **Template Identifier**: `volttime_source`
- **Manufacturer / Vendor**: Volt Time
- **Supported Hardware Models**: Volt Time Source and Source Pro Smart Charging Stations
- **Communication Interface**: Modbus TCP / OCPP 1.6-J (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-time Charging Power (W), Cumulative Session Energy (kWh), Phase Currents (L1, L2, L3 in Amps).

#### Controllable Setpoints & Data Written by GEMS
Volt Time / Plugchoice API v3 dynamic amp limit & pause/resume with local Modbus TCP register `1020` fallback.

#### What GEMS Actually Does With This Device
Verified active load balancing and solar surplus throttling for Volt Time Source and Plugchoice EV wallboxes.

---

### 3.53 Wallbox Pulsar Plus / Commander (OCPP)

- **Template Identifier**: `wallbox_ocpp`
- **Manufacturer / Vendor**: Wallbox
- **Supported Hardware Models**: Wallbox Pulsar Plus, Pulsar Max, Commander 2 / 2s
- **Communication Interface**: Native OCPP 1.6-J WebSocket Server (Port: 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Telemetry Data Read by GEMS
Real-time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Currents (L1, L2, L3 in Amps), Voltages (V).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Charging Current Throttling (Amps, 6A to 32A via SetChargingProfile).

#### What GEMS Actually Does With This Device
Direct zero-cloud local OCPP integration for Wallbox hardware; eliminates cloud dependency and latency for responsive home energy automation.

---

### 3.54 cFos Power Brain Wallbox / Solar

- **Template Identifier**: `cfos_powerbrain`
- **Manufacturer / Vendor**: cFos
- **Supported Hardware Models**: cFos Power Brain Wallbox 11kW / 22kW, cFos Power Brain Solar (1P/3P Relay)
- **Communication Interface**: Modbus TCP (Default Port: 4701, EVSE Unit ID: 1, Holding Registers `8058`–`8094`)

#### Telemetry Data Read by GEMS
Real-Time Charging Power (W), Cumulative Imported Energy (kWh), 3-Phase Charging Currents (0.1 A), Active Phase Relay State.

#### Controllable Setpoints & Data Written by GEMS
0.1 A Charging Current Limit (`8093`), Charge Enable (`8094`), and 1-Phase / 3-Phase Contactor Switching (`8087`).

#### What GEMS Actually Does With This Device
High-precision 0.1 A solar surplus tracking, main breaker protection, and automated 1P/3P solar contactor switching.

---

### 3.55 FoxESS EV Charger A7300 / A011K / A022K

- **Template Identifier**: `foxess_evcharger`
- **Manufacturer / Vendor**: FoxESS
- **Supported Hardware Models**: FoxESS A7300 (7.3 kW), A011K (11 kW), and A022K (22 kW) Smart AC Wallboxes
- **Communication Interface**: Modbus TCP / RTU (Default Port: 502, Unit ID: 1, Holding `0x1003`–`0x1017` & `0x3002`)

#### Telemetry Data Read by GEMS
Charging Power (W), Cumulative Energy (kWh), 3-Phase Currents (A), 3-Phase Voltages (V), Charger Status.

#### Controllable Setpoints & Data Written by GEMS
0.1 kW Stepped Power Limit (`0x3002`: `1.4–4.1 kW` 1-Phase band, `4.2–22.0 kW` 3-Phase band, `0` Pause) & Auto Phase Switch (`0x300A`).

#### What GEMS Actually Does With This Device
Seamless ecosystem companion for FoxESS hybrid inverters with fine-grained solar surplus modulation and 1P/3P switching.

---

### 3.56 Heidelberg Energy Control / Amperfied connect.solar

- **Template Identifier**: `heidelberg_ampere`
- **Manufacturer / Vendor**: Amperfied (Heidelberg)
- **Supported Hardware Models**: Heidelberg Energy Control, Amperfied Wallbox connect.home, connect.solar, connect.business
- **Communication Interface**: Modbus TCP (Port: 502, Unit ID: 255) & Modbus RTU RS485 (19200 8E1, Unit ID: 1)

#### Telemetry Data Read by GEMS
Active Charging Power (W), Total Energy (kWh), 3-Phase Currents (0.1 A), 3-Phase Voltages (V), IEC Vehicle State, Active Phase Count.

#### Controllable Setpoints & Data Written by GEMS
0.1 A Charging Current Limit (Holding `261`), Standby/Lock Management (`258`–`259`), and 1-Phase / 3-Phase Switching (`501` on `connect.solar`).

#### What GEMS Actually Does With This Device
Sub-second 0.1 A current modulation for Flanders capacity peak shaving and seamless 1P/3P solar charging.

---

### 3.57 openWB Pro / openWB series2 (HTTP & Modbus)

- **Template Identifier**: `openwb_pro`
- **Manufacturer / Vendor**: openWB
- **Supported Hardware Models**: openWB Pro, openWB series2 standard+, custom, duo (2.0 Modbus TCP & Pro HTTP)
- **Communication Interface**: Local HTTP JSON/Form API (`/connect.php`) and openWB 2.0 Modbus TCP (Port: 1502, Unit ID: 1)

#### Telemetry Data Read by GEMS
Real-Time Charging Power (W), Imported Energy (kWh), 3-Phase Currents (A), 3-Phase Voltages (V), Plug & Charge State, Active Phases.

#### Controllable Setpoints & Data Written by GEMS
0.1 A / 0.01 A Dynamic Current Limit (`ampere` / Holding `10171`) and Automated 1-Phase / 3-Phase Contactor Switching (`phasetarget` / `10180`).

#### What GEMS Actually Does With This Device
Ultra-fine 10–100 mA solar surplus tracking and hardware 1P/3P phase switching with zero cloud dependency.

---

### 3.58 Sungrow AC011E-01 / AC22E-01 EV Charger

- **Template Identifier**: `sungrow_evcharger`
- **Manufacturer / Vendor**: Sungrow
- **Supported Hardware Models**: Sungrow AC011E-01 (11 kW) and AC22E-01 (22 kW) 3-Phase Smart Wallboxes
- **Communication Interface**: Modbus TCP / RTU (Default Port: 502, Default Unit ID: 248, Input `21269`–`21316` & Holding `21202`–`21211`)

#### Telemetry Data Read by GEMS
Active Charging Power (W), Cumulative Energy (kWh), 3-Phase Currents (0.1 A), 3-Phase Voltages (0.1 V), Phase Switch Status.

#### Controllable Setpoints & Data Written by GEMS
0.1 A Output Current Limit (`21202`), Start/Stop Control (`21211`), and 1-Phase / 3-Phase Switching (`21203`).

#### What GEMS Actually Does With This Device
Direct local Modbus companion for Sungrow SH/SG installations with 0.1 A surplus regulation and 1P/3P switching.

---

### 3.59 Tinkerforge WARP Charger 2 / 3 (Smart & Pro)

- **Template Identifier**: `warp_charger`
- **Manufacturer / Vendor**: Tinkerforge
- **Supported Hardware Models**: Tinkerforge WARP Charger 2 Smart/Pro & WARP Charger 3 Smart/Pro (11 kW / 22 kW)
- **Communication Interface**: Local HTTP REST API (`/evse/state`, `/meter/values`, `/evse/external_current`, `/power_manager/external_control`)

#### Telemetry Data Read by GEMS
Active Charging Power (W), Absolute Energy (kWh), 3-Phase Currents (A), 3-Phase Voltages (V), IEC 61851 State, 1P/3P Contactor State.

#### Controllable Setpoints & Data Written by GEMS
1 mA Resolution External Current Limit (`6000–32000 mA`, `0` Pause) and WARP3 1-Phase / 3-Phase Contactor Switching (`phases_wanted`).

#### What GEMS Actually Does With This Device
Industrial open-interface wallbox integration with 1 mA precision solar tracking and automated 1P/3P contactor control.

---

### 3.60 Vestel EVC04 Home Smart / Mobility

- **Template Identifier**: `vestel_evc04`
- **Manufacturer / Vendor**: Vestel
- **Supported Hardware Models**: Vestel EVC04-AC11 / EVC04-AC22 Home Smart, Mobility, and Compatible OEM Wallboxes
- **Communication Interface**: Modbus TCP (Default Port: 502, Default Unit ID: 255, Lifebit Watchdog `6000=1`)

#### Telemetry Data Read by GEMS
Total Active Power (W), Cumulative Energy (kWh), 3-Phase Currents (mA), 3-Phase Voltages (V), Chargepoint & Cable State.

#### Controllable Setpoints & Data Written by GEMS
Dynamic Charging Current Limit (`5004`, `0` or `6–32 A`), Fail-Safe Watchdog (`6000`), and 1-Phase / 3-Phase Switching (`405`).

#### What GEMS Actually Does With This Device
Reliable local Modbus TCP load balancing, main fuse protection, and 1P/3P solar switching for Vestel EVC04 wallboxes.

---

### 3.61 Hardy Barth cPµ1 / cPµ2 (Salia / eCB1) Wallbox

- **Template Identifier**: `hardy_barth_charger`
- **Manufacturer / Vendor**: Hardy Barth
- **Supported Hardware Models**: Hardy Barth cPµ1 (eCB1), cPµ2 (Salia PLCC), Wallbox cPH1 / cPH2 / cPP2 Series
- **Communication Interface**: Local HTTP REST API (Default Port: 80, `/api/v1/chargecontrols/1` & `/api/secc`)

#### Telemetry Data Read by GEMS
Real-Time Charging Power (W), Cumulative Session Energy (kWh), 3-Phase Charging Currents (`L1, L2, L3` in Amps) & Voltages (`L1, L2, L3` in Volts).

#### Controllable Setpoints & Data Written by GEMS
Dynamic Local REST Current Limit (`PUT /api/v1/chargecontrols/1/mode` with `manualmodeamp=6..32 A` or `mode=stop`; Salia `PUT /api/secc` `grid_current_limit` fallback).

#### What GEMS Actually Does With This Device
100% local zero-cloud current modulation for Hardy Barth Salia and eCB1 wallboxes: matches EV charging speed to rooftop solar surplus and throttles down during main breaker or capacity peaks.

---

### 3.62 Custom Modbus EV Charger (UI Register Profile)

- **Template Identifier**: `custom_modbus_charger`
- **Manufacturer / Vendor**: Custom Modbus
- **Supported Hardware Models**: Any Modbus TCP or RS-485 RTU AC EV Wallbox or Charge Controller configured via the Certified Installer UI Register Profile Builder
- **Communication Interface**: Modbus TCP / RTU (Configurable Port or `/dev/serial/by-id/*` Bus, Unit ID, `FC03`/`FC04` Reads & Optional `FC06`/`FC16` Writes)

#### Telemetry Data Read by GEMS
UI-mapped Charging Power (W), Cumulative Session Energy (kWh), Plug/Session Status, and 3-Phase Currents & Voltages (`int16`/`uint16`/`int32`/`uint32`/`float32` + SunSpec SF).

#### Controllable Setpoints & Data Written by GEMS
Optional UI-mapped Dynamic Charging Current Limit (`ev_max_current_a`, clamped to breaker bounds), Periodic Watchdog Heartbeat, and Safe Fallback Amperage on Shutdown.

#### What GEMS Actually Does With This Device
Brings non-catalog Modbus EV wallboxes into GEMS sub-second dynamic load balancing, solar surplus charging, departure-deadline (`+kWh by HH:MM`) scheduling, and main fuse protection.

---

## 4. Grid Smart Meters & Energy Analyzers (40 Devices)

Grid meters provide the foundational telemetry for the entire EMS closed-loop control cycle. They monitor net household import/export wattage, 3-phase currents (L1, L2, L3 in Amps), line voltages (L1, L2, L3 in Volts), energy registers (kWh), coupled gas meter volume (m³), and the official Flemish 15-minute maximum peak capacity demand register (W). Sub-second boundary metering enables instantaneous reactive load shedding, zero-export enforcement, and main fuse protection.

### 4.1 ABB A43 / A44 / B23 / B24 Meter

- **Template Identifier**: `abb_meter`
- **Manufacturer / Vendor**: ABB
- **Supported Hardware Models**: ABB A43, A44 (3-Phase Direct/CT), B23, B24 (3-Phase Compact) Modbus Meters
- **Communication Interface**: Modbus RTU via RS485-to-Ethernet Gateway or Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active grid import/export power (W), Total active import/export energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts), Frequency (Hz).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid telemetry.

#### What GEMS Actually Does With This Device
High-precision grid boundary metering; feeds continuous 3-phase currents into GEMS phase-load balancing engine to prevent tripping main service fuses; drives Flanders 15-minute capacity peak calculations.

---

### 4.2 Acrel ADW300 Meter

- **Template Identifier**: `acrel_adw300`
- **Manufacturer / Vendor**: Acrel
- **Supported Hardware Models**: Acrel ADW300 Series Wireless / Ethernet 3-Phase Multi-Function Energy Meter
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Total active power (W), Import/export energy (kWh), Per-phase active power (W), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid telemetry.

#### What GEMS Actually Does With This Device
Monitors main grid connection or sub-distribution panels; informs GEMS about exact phase loads to modulate EV charger speeds and safeguard service fuses.

---

### 4.3 B+GE-TECH WS100 / DS100 Meter

- **Template Identifier**: `bgetech_ws100`
- **Manufacturer / Vendor**: B+GE-TECH
- **Supported Hardware Models**: B+GE-TECH WS100, DS100 Series 3-Phase DIN-Rail Modbus Smart Meters
- **Communication Interface**: Modbus TCP / RTU Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-time import/export power (W), Total active energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid telemetry.

#### What GEMS Actually Does With This Device
Direct grid boundary metering; provides real-time wattage for closed-loop EV charging solar surplus tracking and Flanders peak shaving.

---

### 4.4 Carlo Gavazzi EM112 / EM340 / EM540

- **Template Identifier**: `carlogavazzi_em340`
- **Manufacturer / Vendor**: Carlo Gavazzi
- **Supported Hardware Models**: Carlo Gavazzi EM112 (1-Phase), EM340 (3-Phase Direct), EM540 (Ultra-Fast 3-Phase) Meters
- **Communication Interface**: Modbus RTU via RS485 USB/Ethernet Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Net active power (W), Total import/export kWh, 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid telemetry.

#### What GEMS Actually Does With This Device
Fast sub-second boundary meter (especially EM540); crucial for instant reactive throttling of EV chargers during household spikes to protect main fuses.

---

### 4.5 Carlo Gavazzi EM24 (RS485/Ethernet)

- **Template Identifier**: `carlogavazzi_em24`
- **Manufacturer / Vendor**: Carlo Gavazzi
- **Supported Hardware Models**: Carlo Gavazzi EM24 Series 3-Phase Energy Meter (RS485 & Ethernet LAN versions)
- **Communication Interface**: Modbus TCP / Modbus RTU Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Total active power (W, signed: + import, - export), Cumulative energy registers (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid telemetry.

#### What GEMS Actually Does With This Device
Industry-standard utility meter used in premium solar and EVSE installations; provides deterministic 1-second telemetry for GEMS peak shaving and dynamic load balancing.

---

### 4.6 ESPHome DSMR / DLMS Smart Meter

- **Template Identifier**: `esphome_meter`
- **Manufacturer / Vendor**: ESPHome
- **Supported Hardware Models**: ESPHome Smart Meter Gateway (P1 DSMR Reader / DLMS / SML IR Optical Heads on ESP8266/ESP32)
- **Communication Interface**: Local HTTP REST JSON API (Default Port: 80, Endpoint: /sensor/grid_power or /text_sensor/dsmr)

#### Telemetry Data Read by GEMS
Real-time grid power (W), Total import/export energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts), Gas consumption (m³).

#### Controllable Setpoints & Data Written by GEMS
Read-only REST telemetry.

#### What GEMS Actually Does With This Device
Integrates DIY open-hardware P1 readers into GEMS; delivers full digital telegram data over Wi-Fi with zero cloud dependencies.

---

### 4.7 Eastron SDM120 / SDM220 / SDM230 (1-Phase Meter)

- **Template Identifier**: `eastron_sdm120_230`
- **Manufacturer / Vendor**: Eastron
- **Supported Hardware Models**: Eastron SDM120, SDM220, SDM230 Series 1-Phase DIN-Rail Modbus Smart Meters
- **Communication Interface**: Modbus RTU via RS485-to-Ethernet Bridge or USB dongle (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active power (W), Total import/export energy (kWh), Phase current (Amps), Line voltage (Volts), Power factor.

#### Controllable Setpoints & Data Written by GEMS
Read-only telemetry poller.

#### What GEMS Actually Does With This Device
Monitors single-phase grid connections, dedicated heat pump sub-circuits, or single-phase PV inverters; integrates into GEMS load analysis.

---

### 4.8 Eastron SDM630 3-Phase Meter

- **Template Identifier**: `eastron_sdm630`
- **Manufacturer / Vendor**: Eastron
- **Supported Hardware Models**: Eastron SDM630 Modbus V2 / V3 / MCT 3-Phase Multifunction Energy Meter
- **Communication Interface**: Modbus RTU via RS485 Gateway or Modbus TCP (Default Port: 502, Slave ID: 1, Baud: 9600)

#### Telemetry Data Read by GEMS
Net total active power (W, reg 0x0034), Total import/export energy (kWh), Individual phase currents (L1, L2, L3 in Amps, reg 0x0006), Individual phase voltages (L1, L2, L3 in Volts, reg 0x0000).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid telemetry.

#### What GEMS Actually Does With This Device
Widely deployed 3-phase meter; provides foundational telemetry for GEMS Flanders capacity tariff management, phase imbalance tracking, and solar surplus routing.

---

### 4.9 Eastron SDM72D / SMART X96 3-Phase Meter

- **Template Identifier**: `eastron_sdm72_x96`
- **Manufacturer / Vendor**: Eastron
- **Supported Hardware Models**: Eastron SDM72D-M / SDM72D-M-2, SDM72DR, SMART X96-1 / X96-5 Multifunction Meters
- **Communication Interface**: Direct USB-to-RS485 RTU (`/dev/serial/by-id/...`, 9600 8N1) or Modbus TCP via RS485-to-Ethernet Bridge (Default Port: 502, Slave ID: 1 or 2)

#### Telemetry Data Read by GEMS
Total active power (W, signed bidirectional reg `0x0034`), Active import & export energy (`0x0048` / `0x004A` kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid or PV production submeter telemetry.

#### What GEMS Actually Does With This Device
Supports dual measurement roles via **Meter Measurement Role**: (1) **Main Grid Meter (PCC)** to feed live per-phase grid metrics into dynamic load balancing, or (2) **Solar / PV Production Meter** (`pv_production`) wired on the AC output circuit of legacy/non-communicating solar PV inverters—reporting live solar generation (W), per-phase currents, and cumulative solar yield (kWh) with automatic forward/reverse wiring polarity detection and night-time standby draw suppression.

---

### 4.10 Eltako DSZ15DZMOD / DSZ16 Meter

- **Template Identifier**: `eltako_meter`
- **Manufacturer / Vendor**: Eltako
- **Supported Hardware Models**: Eltako DSZ15DZMOD-3x80A, DSZ16 Series 3-Phase Modbus Energy Meters
- **Communication Interface**: Modbus RTU via RS485 Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active power (W), Import/export energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid telemetry.

#### What GEMS Actually Does With This Device
German precision submetering; provides real-time phase currents and grid import/export for GEMS household overload protection.

---

### 4.11 Finder 7M.24 / 7M.38 Meter

- **Template Identifier**: `finder_7m`
- **Manufacturer / Vendor**: Finder
- **Supported Hardware Models**: Finder 7M Series (7M.24 1-Phase, 7M.38 3-Phase Bi-directional Modbus Meters)
- **Communication Interface**: Modbus RTU via RS485 Bridge (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active power (W), Import/export active energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid telemetry.

#### What GEMS Actually Does With This Device
Reliable MID-certified grid metering; feeds live electrical data into GEMS for closed-loop dynamic current regulation.

---

### 4.12 HomeWizard Meter

- **Template Identifier**: `homewizard_meter`
- **Manufacturer / Vendor**: HomeWizard
- **Supported Hardware Models**: HomeWizard Wi-Fi P1 Meter (HWE-P1), HomeWizard Wi-Fi kWh Meter (1-Phase & 3-Phase)
- **Communication Interface**: Local HTTP REST API v1 (Default Port: 80, JSON Endpoint: /api/v1/data)

#### Telemetry Data Read by GEMS
Active grid power (W), Total import/export energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts), Coupled gas meter consumption (m³).

#### Controllable Setpoints & Data Written by GEMS
Read-only local REST API.

#### What GEMS Actually Does With This Device
Plug-and-play Wi-Fi P1 reader: enables GEMS to poll digital meter telegrams every 1-2 seconds with zero cabling; supports full Flemish & Dutch capacity tariff tracking.

---

### 4.13 Homey Energy Dongle (P1)

- **Template Identifier**: `homey_p1`
- **Manufacturer / Vendor**: Homey
- **Supported Hardware Models**: Homey Energy Dongle (P1 Wi-Fi Gateway)
- **Communication Interface**: Local Network UDP Broadcast / HTTP (Default Port: 80)

#### Telemetry Data Read by GEMS
Active grid power (W), Total import/export energy (kWh), 3-Phase currents and voltages.

#### Controllable Setpoints & Data Written by GEMS
Read-only telemetry poller.

#### What GEMS Actually Does With This Device
Captures local network telemetry broadcasts from Homey P1 dongles; streams live household grid flow into GEMS dashboard.

---

### 4.14 Inepro PRO380-MOD / PRO1-MOD Meter

- **Template Identifier**: `inepro_pro380`
- **Manufacturer / Vendor**: Inepro
- **Supported Hardware Models**: Inepro PRO380-MOD, PRO1-MOD Series 3-Phase & 1-Phase DIN-Rail Modbus Meters
- **Communication Interface**: Modbus RTU via RS485 Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Total active power (W), Import/export kWh registers, 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid telemetry.

#### What GEMS Actually Does With This Device
High-accuracy Dutch utility metering; supplies 3-phase currents for GEMS dynamic load balancing and fuse protection.

---

### 4.15 Lovato DMG610 3-Phase Meter

- **Template Identifier**: `lovato_dmg610`
- **Manufacturer / Vendor**: Lovato
- **Supported Hardware Models**: Lovato Electric DMG610, DMG800 Series Digital Multimeters
- **Communication Interface**: Modbus TCP / RTU (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Total active power (W), Import/export energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid telemetry.

#### What GEMS Actually Does With This Device
Industrial-grade grid analyzer; provides rapid electrical metrics to protect main supply lines from transformer or fuse overload.

---

### 4.16 Loxone Miniserver

- **Template Identifier**: `loxone_miniserver`
- **Manufacturer / Vendor**: Loxone
- **Supported Hardware Models**: Loxone Miniserver Gen 1 / Gen 2, Miniserver Compact (HTTP JSON API)
- **Communication Interface**: Local HTTP JSON API (Default Port: 80 / 443, Endpoints: /jdev/sfs/getstatus)

#### Telemetry Data Read by GEMS
Aggregated household power (W), Submeter power values (W), Total energy counters (kWh).

#### Controllable Setpoints & Data Written by GEMS
Read-only REST telemetry poller.

#### What GEMS Actually Does With This Device
Bridges smart home installations running Loxone Miniserver into GEMS; allows GEMS to utilize Loxone smart meter data as the primary grid reference.

---

### 4.17 Niko Home Control (NHC II)

- **Template Identifier**: `niko_nhc`
- **Manufacturer / Vendor**: Niko
- **Supported Hardware Models**: Niko Home Control II (Connected Controller with Energy Module / Electricity Clamps)
- **Communication Interface**: Local Hobby API / REST (Default Port: 8884 or 80, JSON Endpoint: /hobby/v1/devices)

#### Telemetry Data Read by GEMS
Real-time grid import/export power (W), Sub-circuit power consumption (W), Cumulative energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Read-only local API.

#### What GEMS Actually Does With This Device
Seamless integration with popular Belgian Niko Home Control installations; reads electricity clamp measurements to drive GEMS peak shaving.

---

### 4.18 P1 Smart Meter (Network/TCP)

- **Template Identifier**: `p1_network`
- **Manufacturer / Vendor**: Generic
- **Supported Hardware Models**: P1 Smart Meter Network Bridge (TCP/Ethernet P1 Readers, Telnet Bridges, ESP-P1, Ser2Net)
- **Communication Interface**: Raw TCP Socket stream (Default Port: 23, 8088, or 8234, Raw DSMR telegrams)

#### Telemetry Data Read by GEMS
Real-time active power (+ import / - export in Watts, OBIS 1.7.0 & 2.7.0), Cumulative tariff 1 & 2 energy (kWh, OBIS 1.8.1/2 & 2.8.1/2), 3-Phase currents (L1, L2, L3 in Amps, OBIS 31.7.0, 51.7.0, 71.7.0), 3-Phase voltages (L1, L2, L3 in Volts, OBIS 32.7.0, 52.7.0, 72.7.0), Flemish 15-minute peak demand register (W, OBIS 1.6.0), Gas consumption (m³, OBIS 0-1:24.2.1).

#### Controllable Setpoints & Data Written by GEMS
Read-only digital telegram stream.

#### What GEMS Actually Does With This Device
Primary grid interface for remote P1 meters over LAN: decodes official Fluvius (Belgium) and DSMR 4.x/5.x (Netherlands) telegrams; powers GEMS predictive Flanders capacity tariff engine and adaptive peak ceiling.

---

### 4.19 P1 Smart Meter (USB/Serial)

- **Template Identifier**: `p1_serial`
- **Manufacturer / Vendor**: Generic
- **Supported Hardware Models**: P1 Smart Meter Direct Serial Cable (USB-to-RJ12 FTDI / CP2102 Cable on Raspberry Pi USB)
- **Communication Interface**: Direct Serial TTY (/dev/ttyUSB0 or /dev/ttyAMA0, Baud: 115200 for DSMR 4/5, 9600 for DSMR 2/3)

#### Telemetry Data Read by GEMS
Real-time active power (W, OBIS 1.7.0/2.7.0), Tariff 1/2 import/export energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts), Belgian quarterly maximum peak demand (W, OBIS 1.6.0), Gas meter volume (m³).

#### Controllable Setpoints & Data Written by GEMS
Read-only digital telegram stream.

#### What GEMS Actually Does With This Device
Direct zero-latency hardware connection to Belgian/Dutch smart meters; provides 1-second CRC-validated telegrams; core foundation for sub-second EV load balancing and Flanders capacity peak avoidance.

---

### 4.20 SMA Energy Meter 2.0 / Data Manager M (Modbus TCP)

- **Template Identifier**: `sma_energymeter`
- **Manufacturer / Vendor**: SMA
- **Supported Hardware Models**: SMA Energy Meter 2.0, SMA Data Manager M (Modbus TCP Speedwire)
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 2 or 126)

#### Telemetry Data Read by GEMS
Active grid import/export power (W), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Active Power Curtailment Dispatch (commands SMA inverters via Data Manager).

#### What GEMS Actually Does With This Device
Measures grid boundary power and acts as a gateway; informs GEMS about net exchange; executes active solar feed-in curtailment via SMA communications.

---

### 4.21 Schneider Electric Acti9 iEM3000 / PM3200 Series

- **Template Identifier**: `schneider_iem3000`
- **Manufacturer / Vendor**: Schneider Electric
- **Supported Hardware Models**: Schneider Electric Acti9 iEM3150, iEM3155, iEM3255, PowerLogic PM3200 Series
- **Communication Interface**: Modbus RTU via RS485 Gateway or Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Total active power (W), Active energy import/export (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid telemetry.

#### What GEMS Actually Does With This Device
Commercial and residential grade submetering; provides deterministic phase current telemetry to safeguard distribution boards from overloading.

---

### 4.22 Shelly 3EM (Gen 1 3-Phase Meter)

- **Template Identifier**: `shelly_3em`
- **Manufacturer / Vendor**: Shelly
- **Supported Hardware Models**: Shelly 3EM (Gen 1 3-Phase Wi-Fi Energy Meter with 120A CT Clamps)
- **Communication Interface**: Local HTTP REST API (Default Port: 80, JSON Endpoint: /status)

#### Telemetry Data Read by GEMS
Total active power (W), Per-phase power (W), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts), Cumulative returned/consumed energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Built-in 10A Contactor Output (Turn ON / Turn OFF via /relay/0?turn=on).

#### What GEMS Actually Does With This Device
Reads high-speed 3-phase clamp measurements over Wi-Fi; built-in contactor can be automated to trigger external thermal loads or disconnect non-essential appliances during capacity peaks.

---

### 4.23 Shelly Pro 3EM / Gen3 3EM-63T (3-Phase Meter)

- **Template Identifier**: `shelly_pro_3em`
- **Manufacturer / Vendor**: Shelly
- **Supported Hardware Models**: Shelly Pro 3EM, Shelly Pro 3EM-400, Shelly Gen3 3EM-63T (DIN-Rail Ethernet/Wi-Fi)
- **Communication Interface**: Local Gen 2/3 HTTP RPC (Default Port: 80, JSON Endpoint: /rpc/EM.GetStatus)

#### Telemetry Data Read by GEMS
Net active power across phases (W), Per-phase active power (W), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts), 4-Quadrant energy counters (kWh).

#### Controllable Setpoints & Data Written by GEMS
Built-in Auxiliary Relay Output (Turn ON / Turn OFF via /rpc/Switch.Set).

#### What GEMS Actually Does With This Device
High-reliability Ethernet-connected DIN meter: feeds instant phase telemetry into GEMS for sub-second EV current throttling; auxiliary relay output automates heat pump boost or domestic hot water.

---

### 4.24 Siemens SENTRON (PAC2200 / 7KT1665 Meter)

- **Template Identifier**: `siemens_pac2200`
- **Manufacturer / Vendor**: Siemens
- **Supported Hardware Models**: Siemens SENTRON PAC2200, 7KT1665 Series 3-Phase Modbus Smart Meters
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Total active power (W), Cumulative import/export energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid telemetry.

#### What GEMS Actually Does With This Device
Premium industrial grade metering; monitors connection capacity and streams telemetry to GEMS for active load shedding and ROI calculations.

---

### 4.25 Socomec COUNTIS E24/E34/E44 / DIRIS A-40

- **Template Identifier**: `socomec_meter`
- **Manufacturer / Vendor**: Socomec
- **Supported Hardware Models**: Socomec COUNTIS E24, E34, E44 Series, DIRIS A-40 Multifunction Energy Meters
- **Communication Interface**: Modbus RTU via RS485 Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Total active power (W), Active energy import/export (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid telemetry.

#### What GEMS Actually Does With This Device
Accurate 3-phase commercial and domestic metering; informs GEMS about phase load distribution to balance EV charging and avoid tripping supply fuses.

---

### 4.26 WAGO 879 Series (879-3000 / 879-3020 / 879-3040)

- **Template Identifier**: `wago_879`
- **Manufacturer / Vendor**: WAGO
- **Supported Hardware Models**: WAGO 879 Series (879-3000, 879-3020, 879-3040 3-Phase DIN-Rail Energy Meters)
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Active power (W), Total active energy (kWh), 3-Phase currents (L1, L2, L3 in Amps), 3-Phase voltages (L1, L2, L3 in Volts).

#### Controllable Setpoints & Data Written by GEMS
Read-only grid telemetry.

#### What GEMS Actually Does With This Device
Precision DIN-rail meter; streams 3-phase currents and voltages into GEMS for real-time fuse protection, solar surplus calculations, and energy flow visualization.

---

### 4.27 Accuenergy AcuRev / Acuvim Series Meter

- **Template Identifier**: `accuenergy_meter`
- **Manufacturer / Vendor**: Accuenergy
- **Supported Hardware Models**: Accuenergy Acuvim II, AcuRev 1310, AcuRev 2100 Multi-Circuit Submeter
- **Communication Interface**: Modbus TCP / RTU via RS485 Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-Time Net Grid Active Power (W), Total Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only grid telemetry.

#### What GEMS Actually Does With This Device
High-precision 3-phase grid boundary monitoring and phase load balancing for commercial and residential installations.

---

### 4.28 Algodue UPM209 / UPM309 Series Meter

- **Template Identifier**: `algodue_meter`
- **Manufacturer / Vendor**: Algodue
- **Supported Hardware Models**: Algodue UPM209, UPM309 3-Phase Network Analyzers
- **Communication Interface**: Modbus RTU / TCP via RS485 Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-Time Net Grid Active Power (W), Total Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only grid telemetry.

#### What GEMS Actually Does With This Device
Continuous grid exchange measurement, power factor monitoring, and breaker overload protection.

---

### 4.29 Chint DTSU666 / DTSU666-H 3-Phase Meter

- **Template Identifier**: `chint_dtsu666`
- **Manufacturer / Vendor**: Chint
- **Supported Hardware Models**: Chint DTSU666, DTSU666-H 3-Phase Direct & CT Smart Meters
- **Communication Interface**: Modbus RTU via RS485 / Modbus TCP Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-Time Net Grid Active Power (W), Total Import & Export Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only grid telemetry.

#### What GEMS Actually Does With This Device
Standard 3-phase bidirectional grid meter integration; drives solar surplus calculations and EV charger current modulation.

---

### 4.30 Hager ECM / ECR / ECP Energy Meter

- **Template Identifier**: `hager_meter`
- **Manufacturer / Vendor**: Hager
- **Supported Hardware Models**: Hager ECM, ECR, ECP, and SM103E 1-Phase and 3-Phase Energy Meters
- **Communication Interface**: Modbus RTU / TCP via Agardio / IP Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-Time Net Grid Power (W), Total Import Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only grid telemetry.

#### What GEMS Actually Does With This Device
DIN-rail residential distribution board monitoring, feeding sub-second phase telemetry into GEMS overload protection.

---

### 4.31 Janitza UMG Series Power Analyzer

- **Template Identifier**: `janitza_umg`
- **Manufacturer / Vendor**: Janitza
- **Supported Hardware Models**: Janitza UMG 96RM, UMG 604, UMG 509 Power Quality Analyzers
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-Time Net Grid Power (W), Total Import Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Line Voltages (V), Frequency (Hz).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only grid telemetry.

#### What GEMS Actually Does With This Device
High-precision industrial power analyzer integration, capturing high-frequency grid flow and phase imbalance metrics.

---

### 4.32 Kamstrup Energy Meter (Modbus Gateway)

- **Template Identifier**: `kamstrup_meter`
- **Manufacturer / Vendor**: Kamstrup
- **Supported Hardware Models**: Kamstrup OMNIPOWER and MULTICAL Electricity & Thermal Meters
- **Communication Interface**: Modbus RTU / TCP via M-Bus / Modbus Gateway (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-Time Net Grid Power (W), Total Import Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only grid telemetry.

#### What GEMS Actually Does With This Device
Integrates utility electricity and district heating/cooling submeters into the GEMS overall energy overview.

---

### 4.33 Landis+Gyr Industrial Utility Meter

- **Template Identifier**: `landisgyr_meter`
- **Manufacturer / Vendor**: Landis+Gyr
- **Supported Hardware Models**: Landis+Gyr E550, E650, E850 Industrial & Commercial Meters
- **Communication Interface**: Modbus RTU / TCP via Communication Unit (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-Time Net Grid Power (W), Total Import & Export Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only grid telemetry.

#### What GEMS Actually Does With This Device
Monitors large commercial and industrial connection points to ensure dynamic peak shaving compliance.

---

### 4.34 Phoenix Contact EMpro Energy Meter

- **Template Identifier**: `phoenix_empro`
- **Manufacturer / Vendor**: Phoenix Contact
- **Supported Hardware Models**: Phoenix Contact EMpro EEM-MA370, EEM-MB370 Series
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-Time Net Grid Power (W), Total Import Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only grid telemetry.

#### What GEMS Actually Does With This Device
Streams real-time 3-phase grid boundary measurements into GEMS for instantaneous solar tracking.

---

### 4.35 Weidmüller Energy Meter (500 / 600 / 700)

- **Template Identifier**: `weidmuller_meter`
- **Manufacturer / Vendor**: Weidmüller
- **Supported Hardware Models**: Weidmüller Energy Meter 525, 610, 700 Series
- **Communication Interface**: Modbus TCP (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Real-Time Net Grid Power (W), Total Import Energy (kWh), Phase Currents (L1, L2, L3 in Amps), Voltages (V).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only grid telemetry.

#### What GEMS Actually Does With This Device
Industrial grade power monitoring for multi-tenant and facility sub-distribution boards.

---

### 4.36 YouLess LS120 Pulse & P1 Meter

- **Template Identifier**: `youless_ls120`
- **Manufacturer / Vendor**: YouLess
- **Supported Hardware Models**: YouLess LS120 Optical Pulse & P1 Dongle
- **Communication Interface**: Local HTTP REST API (Default Port: 80, Endpoint: /a?f=j)

#### Telemetry Data Read by GEMS
Real-Time Net Grid Power (W), Total Import Energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only grid telemetry.

#### What GEMS Actually Does With This Device
Connects to digital smart meter P1 ports or legacy optical rotating disc meters over local LAN without cloud subscriptions.

---

### 4.37 Fronius Smart Meter IP / Solar API v1

- **Template Identifier**: `fronius_smartmeter_ip`
- **Manufacturer / Vendor**: Fronius
- **Supported Hardware Models**: Fronius Smart Meter IP, TS 65A-3, TS 5kA-3, TS 100A-1 (Direct IP or via Fronius Inverter)
- **Communication Interface**: Local HTTP Fronius Solar API v1 (`GET /solar_api/v1/GetMeterRealtimeData.cgi?Scope=Device&DeviceId=0`)

#### Telemetry Data Read by GEMS
Signed Net Grid Power (W), Total Imported & Exported Energy (kWh), Signed Per-Phase Currents (L1, L2, L3 in Amps), Phase Voltages (V).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only

#### What GEMS Actually Does With This Device
Zero-wiring local HTTP grid boundary metering for Fronius ecosystems, feeding signed per-phase currents into main fuse protection and peak shaving.

---

### 4.38 Huawei EMMA-A02 / DTSU666-H Smart Power Sensor

- **Template Identifier**: `huawei_emma`
- **Manufacturer / Vendor**: Huawei
- **Supported Hardware Models**: Huawei EMMA-A02 Energy Management Assistant, Huawei Smart Power Sensor DTSU666-H / DDSU666-H
- **Communication Interface**: Modbus TCP / RTU (Port: 502, Holding `31633`–`31666` on EMMA-A02 & `2102`–`2175` Float32 on DTSU666-H)

#### Telemetry Data Read by GEMS
Signed Grid Supply-Point Power (W), Total Import & Export Energy (kWh), Signed 3-Phase Currents (A), 3-Phase Voltages (V).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only

#### What GEMS Actually Does With This Device
High-speed grid boundary telemetry for Huawei SUN2000 & LUNA2000 sites with EMMA-A02 or standalone RS485 power sensors.

---

### 4.39 KOSTAL Smart Energy Meter (KSEM G1 / G2)

- **Template Identifier**: `kostal_ksem`
- **Manufacturer / Vendor**: KOSTAL
- **Supported Hardware Models**: KOSTAL Smart Energy Meter G1 & G2 (DIN-Rail Ethernet / RS485 Grid Meter)
- **Communication Interface**: Modbus TCP (Default Port: 502, Default Unit ID: 71, Holding Registers `0`–`143` & `512`–`519`)

#### Telemetry Data Read by GEMS
Active Import & Export Power (0.1 W), Total Import & Export Energy (0.1 Wh -> kWh), Directional Per-Phase Currents (A) & Voltages (V).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only

#### What GEMS Actually Does With This Device
Sub-second Ethernet DIN-rail grid boundary metering with per-phase directional current signing for DLB and capacity peak shaving.

---

### 4.40 Tasmota SML / OBIS Optical IR Reader & EcoTracker

- **Template Identifier**: `tasmota_sml`
- **Manufacturer / Vendor**: Tasmota
- **Supported Hardware Models**: Tasmota SML / OBIS / DLMS Optical IR Heads (Hichi, BitShake) & everHome EcoTracker
- **Communication Interface**: Local HTTP JSON API (`/cm?cmnd=Status%208` StatusSNS & EcoTracker `/v1/json`)

#### Telemetry Data Read by GEMS
Real-Time Net Grid Power (W), Total Import & Export Energy Counters (kWh), Phase Currents (A) & Voltages (V).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only

#### What GEMS Actually Does With This Device
Cloud-free optical IR smart meter reading for modern European digital utility meters lacking RJ12 P1 ports.

---

### 4.41 Custom Modbus Smart Meter (UI Register Profile)

- **Template Identifier**: `custom_modbus_meter`
- **Manufacturer / Vendor**: Custom Modbus
- **Supported Hardware Models**: Any Modbus TCP or RS-485 RTU DIN-Rail Grid Analyzer or PV Production Submeter configured via the Certified Installer UI Register Profile Builder
- **Communication Interface**: Modbus TCP / RTU (Configurable Port or `/dev/serial/by-id/*` Bus, Unit ID, `FC03`/`FC04` Input & Holding Registers)

#### Telemetry Data Read by GEMS
UI-mapped Net Grid or PV Power (W), Import & Export Energy Counters (kWh), Per-Phase Currents (`L1, L2, L3` in A) & Voltages (`L1, L2, L3` in V) across all byte orders (`ABCD`, `CDAB`, `BADC`, `DCBA`).

#### Controllable Setpoints & Data Written by GEMS
Autonomous / Read-Only

#### What GEMS Actually Does With This Device
Provides verified custom register mapping with live one-click register read testing for industrial and regional Modbus energy meters (as either Main Grid Meter or PV Production Submeter).

---

## 5. Smart Relays & Load Actuators (12 Devices)

Smart relays and contactors control heavy thermal appliances—such as Heat Pumps (via potential-free SG-Ready terminals), domestic hot water (DHW) immersion boilers, swimming pool circulation pumps, and electric heating elements. GEMS engages contactors dynamically when solar surplus exceeds configurable wattage thresholds or when electricity prices turn negative, with strict anti-cycling hysteresis to protect mechanical compressors.

### 5.1 Generic HTTP Relay

- **Template Identifier**: `generic_relay`
- **Manufacturer / Vendor**: Generic
- **Supported Hardware Models**: Generic HTTP REST Relay (ESP8266, ESP32, Tasmota, Shelly Gen1, Custom Microcontrollers)
- **Communication Interface**: Local HTTP REST (Default Port: 80 / 8080, Configurable URL endpoints for State and Toggle)

#### Telemetry Data Read by GEMS
Active power consumption of connected appliance (W, optional if meter reported).

#### Controllable Setpoints & Data Written by GEMS
Relay Contactor Output State (Turn ON / Turn OFF).

#### What GEMS Actually Does With This Device
Automated contactor control: engages domestic hot water immersion heaters, pool circulation pumps, or resistive heating when solar export exceeds configurable thresholds (e.g., > 1500W for 2 minutes); enforces minimum run-time and off-time hysteresis.

---

### 5.2 Shelly Plus 1PM / Pro 1PM / Plug S (Relay & Power)

- **Template Identifier**: `shelly_plus_1pm`
- **Manufacturer / Vendor**: Shelly
- **Supported Hardware Models**: Shelly Plus 1PM, Shelly Pro 1PM, Shelly Plug S, Shelly Pro 2PM (Gen 2 / Gen 3 Mongoose OS)
- **Communication Interface**: Local Gen 2/3 HTTP RPC (Default Port: 80, Endpoints: /rpc/Switch.Set, /rpc/Switch.GetStatus)

#### Telemetry Data Read by GEMS
Connected appliance active power (W), Cumulative energy consumption (kWh), Internal device temperature (°C), Supply voltage (V).

#### Controllable Setpoints & Data Written by GEMS
Relay Contactor Output State (Turn ON / Turn OFF via /rpc/Switch.Set).

#### What GEMS Actually Does With This Device
SG-Ready Heat Pump Boost & Appliance Automation: drives Heat Pump SG-Ready Operating State 3 (thermal boost mode) or hot water boilers during solar surplus or negative spot price hours; tracks real-time load wattage in GEMS logger.

---

### 5.3 Modbus Digital I/O Relay Module

- **Template Identifier**: `modbus_relay`
- **Manufacturer / Vendor**: Modbus Relais / I/O
- **Supported Hardware Models**: Waveshare Modbus RTU/TCP Relay, ADAM-4000/6000, Moxa ioLogik, Kincony Modbus Relay
- **Communication Interface**: Modbus TCP / RTU via RS485 (Default Port: 502, Slave ID: 1)

#### Telemetry Data Read by GEMS
Digital Input / Output Coil States (Open / Closed).

#### Controllable Setpoints & Data Written by GEMS
Relay Coil Actuation (Coil 1–8 Turn ON / OFF).

#### What GEMS Actually Does With This Device
Industrial-grade contactor switching for high-current loads, three-phase thermal heaters, and heavy machinery peak shedding.

---

### 5.4 SG-Ready Heat Pump (Daikin/Nibe/Bosch/Vaillant/Panasonic)

- **Template Identifier**: `sgready_heatpump`
- **Manufacturer / Vendor**: SG-Ready (Daikin, Nibe, Bosch/Nefit, Vaillant, Panasonic, Mitsubishi, Stiebel Eltron, Wolf)
- **Supported Hardware Models**: Standard 4-State SG-Ready Heat Pumps via two bound RelayController channels (`sgready_relay1_id` + `sgready_relay2_id`, e.g. Shelly or Modbus relays) or Local HTTP REST gateway
- **Communication Interface**: Dual-Relay 4-State Binding (`[1,0]`, `[0,0]`, `[0,1]`, `[1,1]`) or Local HTTP REST (`/api/sgready`)

#### Telemetry Data Read by GEMS
4-State SG-Ready Operating State (State 1 `[1,0]`: Grid Lockout / State 2 `[0,0]`: Normal / State 3 `[0,1]`: Solar & Cheap Tariff Recommended / State 4 `[1,1]`: Forced Thermal Boost), Combined Relay Power Consumption (W).

#### Controllable Setpoints & Data Written by GEMS
Full 4-State SG-Ready Mode Actuation (`State 1` Peak Shedding Lockout with 2-hour max cap, `State 2` Normal, `State 3` Solar/Pre-Peak Comfort Boost, `State 4` Negative-Price Forced Boost) with 600s compressor anti-short-cycling guard.

#### What GEMS Actually Does With This Device
Full 4-state thermal storage & peak protection: preheats domestic water and thermal buffers during solar surplus or cheap pre-peak slots (`State 3`), maximizes thermal storage on negative prices (`State 4`), and safely sheds compressor peaks (`State 1`) only as a last resort when EVs are paused and battery support is exhausted.

---

### 5.5 Shelly Plus 1 / Pro 1 (Dry Contact Relay)

- **Template Identifier**: `shelly_plus_1`
- **Manufacturer / Vendor**: Shelly
- **Supported Hardware Models**: Shelly Plus 1, Shelly Pro 1 (Gen 2 / Gen 3 potential-free dry contact relays)
- **Communication Interface**: Local HTTP RPC (Default Port: 80, Endpoint: /rpc/Switch.Set)

#### Telemetry Data Read by GEMS
Switch State (On / Off), Device Temperature (°C), Input State.

#### Controllable Setpoints & Data Written by GEMS
Dry Contact Relay Output State (Turn ON / Turn OFF).

#### What GEMS Actually Does With This Device
Potential-free contact closure to trigger SG-Ready heat pump inputs, EV charger external inhibit terminals, or domestic circulation pumps.

---

### 5.6 Shelly Plus 2PM / Pro 2PM (Dual Relay & Meter)

- **Template Identifier**: `shelly_plus_2pm`
- **Manufacturer / Vendor**: Shelly
- **Supported Hardware Models**: Shelly Plus 2PM, Shelly Pro 2PM (Dual-channel relay with independent power metering)
- **Communication Interface**: Local HTTP RPC (Default Port: 80, Endpoints: /rpc/Switch.Set, /rpc/Switch.GetStatus)

#### Telemetry Data Read by GEMS
Channel 1 & Channel 2 Active Power (W), Cumulative Energy per channel (kWh), Supply Voltage (V).

#### Controllable Setpoints & Data Written by GEMS
Dual Relay Output States (Channel 0 & Channel 1 Independent On / Off).

#### What GEMS Actually Does With This Device
Independent dual-circuit automation: controls and measures multiple resistive heating stages or controls dual-coil SG-Ready heat pump configurations (State 1 through State 4).

---

### 5.7 Daikin Altherma 3 & HomeHub (Smart Grid Modbus)

- **Template Identifier**: `daikin_altherma`
- **Manufacturer / Vendor**: Daikin
- **Supported Hardware Models**: Daikin Altherma 3 R / H / M & Daikin HomeHub (`EKRHH`) Heat Pump Systems
- **Communication Interface**: Modbus TCP (Default Port: 502, Unit ID: 1, Input `21`–`50` & Holding `2`, `53`)

#### Telemetry Data Read by GEMS
Instantaneous Heat Pump Electrical Power (W), DHW Tank Temperature (°C), Leaving Water Temperature (°C), Smart Grid Status.

#### Controllable Setpoints & Data Written by GEMS
Smart Grid Operating Mode (`53`: Free Running Normal vs Recommended On PV Surplus Boost) & DHW Temperature Setpoint (`2`).

#### What GEMS Actually Does With This Device
Native Modbus TCP thermal storage automation for Daikin Altherma 3 heat pumps: converts excess PV and negative-price electricity into domestic hot water and space heating.

---

### 5.8 my-PV AC•THOR / AC•THOR 9s / AC ELWA 2 Solar Diverter

- **Template Identifier**: `mypv_acthor`
- **Manufacturer / Vendor**: my-PV
- **Supported Hardware Models**: my-PV AC•THOR (3 kW), AC•THOR 9s (9 kW), AC ELWA 2, AC ELWA-E Linear Photovoltaic Heaters
- **Communication Interface**: Modbus TCP (Default Port: 502, Unit ID: 1, Holding Registers `1000`–`1003`)

#### Telemetry Data Read by GEMS
Actual Immersion Heating Power (W), Domestic Hot Water Tank Temperature (`0.1 °C`), Operating Status.

#### Controllable Setpoints & Data Written by GEMS
Stepless Linear Heating Power Setpoint (`1000`: `0–9000 W`), Relay Boost State, and Max Tank Temperature Setpoint (`1002`).

#### What GEMS Actually Does With This Device
Proportional zero-export thermal storage: diverts exact watt-for-watt PV surplus into hot water buffers before any grid export or curtailment occurs.

---

### 5.9 NIBE S-Series Heat Pump (S1155 / S1255 / S2125 / VVM)

- **Template Identifier**: `nibe_heatpump`
- **Manufacturer / Vendor**: NIBE
- **Supported Hardware Models**: NIBE S1155, S1255, S1156, S1256, S2125, SMO S40, VVM S320 Inverter Heat Pumps
- **Communication Interface**: Modbus TCP (Default Port: 502, Unit ID: 1, Input `8`, `2166`, `2285` & Holding `697`, `707`)

#### Telemetry Data Read by GEMS
Instantaneous Compressor Electrical Power (`2166` W), Cumulative Consumed Electrical Energy (`2285` kWh), DHW Top Temperature (`8` °C).

#### Controllable Setpoints & Data Written by GEMS
SG-Ready / Smart Price Luxury DHW Boost (`697` / `47`) and Comfort Temperature Setpoint (`707` `0.1 °C`).

#### What GEMS Actually Does With This Device
Direct Wi-Fi/Ethernet Modbus TCP integration for NIBE S-Series heat pumps: boosts thermal storage during solar surplus and cheap EPEX hours.

---

### 5.10 Stiebel Eltron / Tecalor ISG Web & Plus (WPM)

- **Template Identifier**: `stiebel_eltron_isg`
- **Manufacturer / Vendor**: Stiebel Eltron
- **Supported Hardware Models**: Stiebel Eltron & Tecalor WPM3, WPM3i, WPMsystem Heat Pumps via ISG web / ISG plus Gateway
- **Communication Interface**: Modbus TCP (Default Port: 502, Unit ID: 1, Input `521`, `2500`, `3506` & Holding `1509`, `4000`–`4002`)

#### Telemetry Data Read by GEMS
DHW Cylinder Temperature (`521` °C), Compressor & DHW Pump Status (`2500`), Cumulative Electrical Energy (kWh).

#### Controllable Setpoints & Data Written by GEMS
SG-Ready Energy Management Enable (`4000=1`), SG-Ready State 2 / State 3 PV Boost (`4001`–`4002`), and Comfort DHW Setpoint (`1509`).

#### What GEMS Actually Does With This Device
Standardized Modbus TCP SG-Ready boost and comfort temperature control for Stiebel Eltron and Tecalor heat pumps.

---

### 5.11 Tasmota Smart Plug / DIN Power Relay

- **Template Identifier**: `tasmota_relay`
- **Manufacturer / Vendor**: Tasmota
- **Supported Hardware Models**: Tasmota Wi-Fi / Ethernet Smart Plugs, Sonoff POW, Nous A1T, and Multi-Channel DIN Contactors
- **Communication Interface**: Local HTTP Command API (`/cm?cmnd=Power%20On|Off` & `/cm?cmnd=Status%208`)

#### Telemetry Data Read by GEMS
Active Load Power (W), Cumulative Energy (kWh), Supply Voltage (V), Load Current (A).

#### Controllable Setpoints & Data Written by GEMS
Relay Channel Output State (`Power{1..8} On` / `Off` with hysteresis protection).

#### What GEMS Actually Does With This Device
100% local cloud-free switching and power metering for resistive water heaters, pool pumps, e-bike chargers, and auxiliary relays.

---

### 5.12 Askoma ASKOHEAT+ Modbus TCP PV Immersion Heater

- **Template Identifier**: `askoheat_diverter`
- **Manufacturer / Vendor**: Askoma
- **Supported Hardware Models**: Askoma ASKOHEAT+ (AHIR-BI-PLUS 1.75 kW – 19.25 kW) 7-Step PV Flange & Screw-In Immersion Heaters
- **Communication Interface**: Modbus TCP (Default Port: 502, Unit ID: 1, Holding Registers `100`, `200`–`202`, `300`–`304`)

#### Telemetry Data Read by GEMS
Actual Immersion Heating Power (`300` W), Boiler Water Temperature (`302` `0.1 °C`), Active Heater Stage Bitmask (`301`), Cumulative Thermal Energy (`304` `0.1 kWh`).

#### Controllable Setpoints & Data Written by GEMS
Stepless Feed-In / Load Power Setpoint (`200`–`201` W), 7-Step Heater Stage Control (`100` Stages 0–7), Legionella Boost, and Maximum Water Temperature Setpoint (`202` `0.1 °C`).

#### What GEMS Actually Does With This Device
Proportional 7-step and stepless solar thermal diversion for Askoma ASKOHEAT+ immersion heaters: converts excess solar generation and negative-price electricity into domestic hot water buffer storage.

---

## Communication Protocols & Network Configuration

### 1. Modbus TCP & RTU Gateway Guidelines (Preferred for Chargers & Inverters)
- **Sub-Second Latency**: Modbus TCP allows GEMS to poll registers and dispatch current setpoints within 200–500 milliseconds. This high speed is required to shave sudden domestic peaks (e.g. electric oven or induction cooktop activation).
- **Shared Multi-Drop RS485 & Single-Socket Gateways**: Multiple Modbus RTU slaves on the same USB-RS485 adapter (or behind a single-socket Ethernet-to-RS485 bridge) automatically share a serialized, thread-safe bus lock with configurable baud rate and parity (`8N1` / `8E1` / `8O1`).
- **Persistent `/dev/serial/by-id/*` USB Binding**: When connecting multiple USB-RS485 and USB-P1 adapters to the Raspberry Pi, GEMS discovers and displays persistent hardware symlinks (`/dev/serial/by-id/usb-FTDI_...`) as one-click pills so serial interfaces never swap port numbers across power cycles.
- **Coexistence with CPO Billing**: For EV chargers connected to third-party billing backends over OCPP, GEMS controls the charge current locally via Modbus TCP. The billing connection remains intact and uninterrupted.
- **Port Configuration**: Standard Modbus TCP uses port `502`. SolarEdge uses port `1502`. SofarSolar/GoodWe/Solis Wi-Fi sticks often use port `8899`.

### 2. Native OCPP 1.6-J WebSocket Server
- **Embedded CSMS Server**: GEMS includes a native OCPP 1.6-J WebSocket server listening on dedicated port `8887` and on port `8080` (`/api/ocpp/<ChargePointID>`).
- **Zero-Cloud Residential & Fleet Operation**: Wallboxes without Modbus TCP (e.g. Huawei FusionCharge, EVBox, VW ID. Charger, Schneider EVlink) point their WebSocket URL to either:
  ```text
  ws://<GEMS-Raspberry-Pi-IP>:8887/<ChargePointID>
  ws://<GEMS-Raspberry-Pi-IP>:8080/api/ocpp/<ChargePointID>
  ```
- **Control Mechanism**: GEMS issues `SetChargingProfile` commands with 0.1-Amp / 1-Amp resolution (including `0.0 A` pause) to regulate charging speeds.

### 3. Smart Meter Interfaces (P1 DSMR & RS485)
- **P1 Serial Cable**: Direct USB RJ12 cable plugged into Raspberry Pi USB port (`/dev/ttyUSB0`). Standard baud rate is `115200` for DSMR 4.x/5.x and Fluvius Belgium; `9600` for legacy DSMR 2.x/3.x. The P1 customer port must be activated via *Mijn Fluvius* (Belgium).
- **P1 Network Bridge**: Remote P1 readers (e.g., HomeWizard Wi-Fi P1, TCP bridges on ports `23`, `8088`, or `8234`) transmit DSMR telegrams over the local network with zero cabling required.

### 4. Local REST & JSON RPC APIs
- Devices like HomeWizard (`/api/v1/data`), Shelly Gen 2/3 (`/rpc/EM.GetStatus`), go-e Charger (`/api/status`), and Enphase Envoy (`/ivp/livedata/status`) are polled directly over local LAN via HTTP GET/POST with zero reliance on manufacturer cloud servers.

### 5. Port Reference Summary

| Port | Protocol | Default Associated Devices |
| :--- | :--- | :--- |
| `502` | Modbus TCP | Huawei, SMA, Fronius, Sungrow, Victron, Deye, ABL, ABB, RAEDIAN, Keba, Eastron, Carlo Gavazzi |
| `1502` | Modbus TCP (SunSpec) | SolarEdge Inverters & Chargers |
| `8899` | Modbus TCP | Solis, SofarSolar, GoodWe Wi-Fi/LAN Dongles |
| `8502` | Modbus TCP | Alpha ESS Storion Series |
| `8887` / `8080` | WebSocket (OCPP 1.6-J) | GEMS Embedded OCPP Server (`:8887/<ID>` or `:8080/api/ocpp/<ID>`) |
| `80` / `443` | Local HTTP REST / JSON | HomeWizard P1, Shelly 3EM / Pro 3EM, go-e Charger, Enphase Envoy, SmartEVSE, sonnenBatterie |
| `8884` | Local JSON API | Niko Home Control II Energy Controller |
| `8088` / `8234` / `23` | Raw TCP DSMR Stream | P1 Network TCP Bridges, Ser2Net, ESP-P1 Gateways |

### 6. Testing & Simulation Engine (Zero-Hardware Demo Templates)

For staging environments, installer pre-commissioning, and automated testing without physical hardware connected, GEMS provides native simulated demo templates across all five device categories:

| Device Template | Identifier | Category | Simulated Telemetry & Dynamics | Interactive Control Setpoints |
| :--- | :--- | :--- | :--- | :--- |
| **Demo Digital Smart Meter (DSMR/P1)** | `demo_meter` | `meter` | Residential baseline demand, diurnal peak curves (morning/evening peaks), asymmetrical 3-phase currents & voltages (230V ±2V), cumulative import/export kWh, gas $m^3$, Flanders 15-minute rolling peaks (`currentQuarterPeakW`). Automatically balances net grid power based on simulated solar, battery, and EV charging. | Read-Only (Synchronized Net Calculation) |
| **Demo Solar Inverter (PV)** | `demo_solar` | `inverter` | Diurnal solar generation bell curve (sunrise to sunset) scaled to rated capacity (e.g. 5.0 kW), with atmospheric cloud passage micro-fluctuations (±3%–10%). 3-phase currents and voltages. | `SetActivePowerLimit(W)`: dynamically clamps active production when Flanders peak shaving or Fluvius IEC 104 curtailment is active. |
| **Demo Battery Energy Storage (BESS)** | `demo_battery` | `battery` | True-to-life State of Charge (SoC) integration ($dE/dt = P \cdot \eta$) with 10% reserve floor and 100% ceiling. Autonomous solar surplus sinking and home deficit coverage. | `ChargeBattery(W)` and `DischargeBattery(W)`: responds to forced spot-price triggers and rule-based arbitrage. |
| **Demo Hybrid Inverter & Storage** | `demo_hybrid_inverter` | `inverter` | Combined solar PV generation and integrated battery storage in a unified unit. | `SetActivePowerLimit(W)`, `ChargeBattery(W)`, `DischargeBattery(W)`. |
| **Demo Smart EV Wallbox** | `demo_charger` | `charger` | Vehicle connected session simulation. Draws power proportional to commanded current ($P \approx \text{phases} \times 230\text{V} \times I$) with realistic electrical jitter and session energy accumulation. | `SetChargeCurrent(A)` (6A–32A), `SetPhaseMode` (1-phase / 3-phase). Fully compatible with EV Fleet Cluster DLB modes. |
| **Demo Smart Relay / Heat Pump** | `demo_relay` | `relay` | Heat pump compressor load (~2.1 kW when ON, ~3 W standby when OFF), room/water temperature tracking. | `SetState(bool)`: switches contact state; responds to automation rules. |

*Quick Provisioning:* Installers can provision or clear a coordinated 4-device Demo Kit (Smart Meter + Solar Inverter + Battery Storage + EV Wallbox) with a single click via the **"🧪 Quick Add Demo Kit"** action in Device Management.

---

*Document maintained automatically by GEMS (Grid Energy Management System). Canonical record of 168 hardware integration profiles (180 total registered device templates including multi-model aliases and 6 simulation templates).*