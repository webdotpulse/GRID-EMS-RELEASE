# Changelog

All notable changes to the GEMS (Grid Energy Management System) project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> [!NOTE]
> **Privacy & Security Notice:** Changelog entries focus exclusively on user-facing features, improvements, and operational changes. Technical credentials, internal server endpoints, sensitive cryptographic keys, and vulnerability reproduction details are strictly excluded to protect user installations.

---

## [Unreleased]

---

## [v9.15.0] - 2026-09-14

### Added
- **Straight-Through OCPP Smart Forwarder (Proxy) for External Billing & Dynamic Load Balancing:** Added a bidirectional straight-through OCPP proxy engine enabling charging stations (such as Raedian and other OCPP 1.6-J / 2.0.1 wallboxes) to connect directly to external CPO billing platforms and employer reimbursement services for driver RFID authorization and transaction accounting. GEMS transparently pipelines all OCPP messages to the upstream server while simultaneously snooping real-time meter values, socket status notifications, and transaction events to execute autonomous 1-second Dynamic Load Balancing (DLB). Safely arbitrates upstream charging profiles by capping external setpoints to local physical fuse limits and solar surplus headroom. Complete outage autonomy—if upstream cloud connectivity drops, local edge load balancing continues uninterrupted to protect site electrical infrastructure. Configurable with upstream WebSocket URL templating (`{chargePointId}`) and optional HTTP authorization headers via both local edge UI and central cloud fleet management.
- **Autonomous EV Fleet Cluster & Dynamic Load Balancing (DLB):** Added complete multi-station fleet management supporting clusters of up to 32 charging bays (expandable to 64 on Raspberry Pi 5) under a shared electrical ceiling. Features autonomous edge computing with a 1-second dynamic load balancing cycle that remains fully operational during cloud or internet outages. Includes three operating strategies (`Equal Share` for balanced charging across all bays, `Priority Queue` with VIP prioritization, and `Solar First` to channel surplus photovoltaic power into designated bays), zero-touch auto-onboarding for OCPP 1.6 / 2.0.1 chargers (with Raedian as primary reference template), individual bay priority and mode controls, and a dedicated multi-bay Fleet Cockpit view with real-time per-phase electrical balance monitoring.
- **Official Supported Hardware & Devices Compatibility Reference Manual (HTML & Vector PDF):** Published an exhaustive, publication-grade 53-page field reference manual (`manuals/gems-supported-hardware-manual.pdf` and `manuals/gems-supported-hardware-manual.html`) covering all 140 native hardware templates supported by GEMS across five core categories (32 Solar & Hybrid Inverters, 13 Dedicated Battery Energy Storage Systems, 53 EV Charging Stations & Wallboxes, 36 Grid Smart Meters & Energy Analyzers, and 6 Smart Relays & Actuators). For every hardware template, the manual details exact communication protocols and connection setup, real-time telemetry read out (instantaneous power, per-phase currents, voltages, battery SoC, cumulative energy, and quarter-hour peak demand registers), controllable setpoints (dynamic current throttling from 6A to 32A, automated 1-phase/3-phase switching, active solar curtailment limits, forced battery charge/discharge setpoints, and relay contact states), and real-world closed-loop automation roles (Eco Mode solar surplus tracking, Flanders capacity tariff peak shaving and dynamic adaptive ceiling, Netherlands zero-export compliance, dynamic day-ahead spot market arbitrage, and main fuse protection). Features Raedian (flagship EVSE) and Enerlution (flagship hybrid inverters/BESS) as primary reference platforms.
- **Comprehensive Beginner-Friendly Installer & User Manuals (HTML & Vector PDF):** Completely overhauled and massively expanded the official GEMS Installer and User manuals (`manuals/gems-installer-manual.pdf` and `manuals/gems-user-manual.pdf`), writing in clear, non-technical language to explain every screen, every metric, every setting, and every trade-off. Features dedicated decision matrices ("When to Choose This Option"), recommended defaults, and common pitfalls for all 140 hardware templates, grid limits, multi-phase systems (Single Phase, 3-Phase 400V, and Belgian 3-Phase 230V Delta), the 5 energy contract wizards, Flanders capacity peak shaving math, Flemish GSC €90–€450 protection, and compressor anti-short-cycling timers.
- **Dedicated Grid Operator Smart Meter & DIY P1 Cable Manual:** Published a comprehensive standalone field manual (`manuals/gems-p1-meter-manual.pdf`, `manuals/p1-meter.html`, and `docs/p1_port_manual.md`) covering smart meter integration (Fluvius, DSMR 5.0.2, and e-MUCS v1.4). Includes complete bill of materials, RJ12 vs RJ11 telephone cable pinouts, electrical signal inversion physics (open-collector logic), hardware transistor inverter schematics (BC547 NPN), software FTDI EEPROM inversion, step-by-step DIY cable assembly, multimeter verification procedures, Fluvius customer portal port activation, and one-click GEMS onboarding.
- **Complete Documentation & UI Screenshot Refresh:** Refreshed all 22 high-resolution screenshots across all views to reflect system release `v9.13.2-release`, active Belgian Elia green energy telemetry (`72.4% Renewable`), clear controller decision constraints, and the expanded 140-template hardware ecosystem. Synchronized all documentation hub pages and sidebar navigation links.
- **Dynamic Spot Price Automation Rules for Smart Relays:** Expanded the Smart Relays automation rule builder to support dynamic spot market price triggers (`Spot Price Below Threshold` and `Negative Spot Price Active`). Homeowners and installers can configure automated load switching for immersion heaters, heat pump booster contacts, or pool heaters to turn on when day-ahead market spot prices turn negative or drop below a custom €/kWh ceiling, taking full advantage of low and negative tariff intervals.
- **Independent Multi-Charger Control & Historical Telemetry:** Enhanced the interactive Power Flow dashboard to support independent management for installations with multiple EV chargers or dual-socket charging stations. Homeowners and installers can select individual wallboxes to inspect dedicated historical power curves, monitor real-time charging wattage, independently toggle operating modes (`Off`, `Eco`, and `Fast`), and apply settings across all chargers simultaneously with one click.
- **Belgian Elia Green Energy Sync Boost:** Introduced an automated charging boost engine driven by the Belgian Transmission System Operator (Elia) Open Data public API. When national Belgian renewable power generation (wind and solar) exceeds a user-configured threshold (e.g. 65%), connected EV chargers and home batteries automatically receive a clean energy charging boost to absorb green national surplus, while strictly respecting domestic main fuse and capacity peak shaving limits. Displays transparent controller decision explanations on the dashboard when active.
- **Fluvius Telecontrole via IEC 60870-5-104 (IEC 104):** Integrated an embedded IEC 60870-5-104 controlled station server for Belgian grid compliance (Synergrid C10/11 and Fluvius telecontrole requirements). The EMS automatically responds to remote curtailment setpoints (kW and percentage limits) and emergency plant disconnect/trip signals, while streaming cyclic telemetry (active power, reactive power, and voltage) back to the distribution grid operator. Includes an installer testing suite in the UI to verify telecontrol compliance during commissioning.
- **Rule-Based Battery Cost Optimization Engine:** Added a dedicated rule-based battery management engine with customizable priority rules. Installers and homeowners can configure targeted charge, discharge, hold, and self-consumption behaviors triggered by dynamic electricity price thresholds, time-of-day schedules, days of the week, and battery state-of-charge (SoC) limits. Includes one-click presets for negative price absorption, evening peak arbitrage, low-tariff night pre-charging, and weekend solar preservation.
- **Clearer Scheduler Explanations & Real-Time Decision Card:** Added a dedicated Controller Decisions & Constraints card to the dashboard that provides clear, plain-language explanations of why specific setpoints and power allocations are applied. Displays active constraints (such as capacity peak ceilings, price-floor triggers, or rule overrides) and setpoint summaries across all device categories (Battery, Solar Inverter, EV Charger, Smart Relays, and Grid).
- **Flexible Energy Contract Wizards & Visual Formula Builder:** Completely redesigned the energy contract configurator with country- and currency-filtered setup wizards and an interactive drag-and-drop formula builder:
  - *Fixed / Variable Wizard:* Easily configure fixed consumption (peak/off-peak) and solar feed-in tariffs across any currency.
  - *Advanced Dynamic Wizard:* Visually build custom dynamic pricing formulas using drag-and-drop tokens (Market Spot Price, Volume Multiplier, Supplier Markup, DNO Taxes, Base Fee, and VAT) with direct linking to day-ahead market spot sources (EPEX Spot BE, NL, DE/LU, and EnergyZero) and support for extra time-of-day and day-of-week rules.
  - *Dynamic-BE Wizard:* Select residential or commercial Belgian dynamic contracts by supplier and closing date, with automatic formula parameter pre-filling.
  - *Flex-BE Wizard:* Configure Belgian flex contracts indexed to the monthly average EPEX price (`EPEX_M`) with separate peak, off-peak, and super-dal time slots and automated overnight battery charging.
  - *Dynamic-NL Wizard:* Configure Dutch dynamic contracts by selecting popular energy suppliers, with automatic calculation of official Dutch *Energiebelasting*, ODE, and solar feed-in deductions (*terugleverkosten*).
- **Hourly Energy Rollup Engine:** Implemented a continuous hourly energy rollup database engine (`hourly_energy_rollups`). Historical energy consumption and generation data older than 90 days is now calculated from hourly rollup records, ensuring 100% accurate energy sums in historical dashboards and exported energy reports without downsampling distortion.
- **Belgian Grid Green Energy Share (Elia Open Data):** Ingested live Belgian national renewable energy share metrics directly from Elia Open Data (solar generation, wind generation, and total national grid load). Displays an interactive Belgian Green Energy Badge and generation breakdown on the dashboard for Belgian installations and streams live national renewable metrics to cloud fleet management.
- **Relay Automation Rule Builder:** Added a dedicated Automation Rules interface to the Smart Relays management tab. Homeowners and installers can configure automated load switching for heat pump SG-Ready contacts, pool pumps, and immersion heaters based on solar surplus or grid import thresholds, complete with compressor short-cycling protection (minimum run time and minimum off time timers).
- **Advanced Battery Arbitrage & Strategy UI Controls:** Added dedicated user interface controls to the Strategy Settings tab for battery grid charging strategies (predictive 24h forecast, spot price threshold, Engie Super-Dal night charging, and hybrid mode), grid charge price ceilings, grid discharge price floors, battery cell wear cost protection (€/kWh), and 24h solar forecast toggle.
- **Smart EV Charging Optimization Controls:** Added a configurable cheapest spot price hours selector (0–8 hours) in the Strategy Settings tab, automatically prioritizing EV charging during the day's lowest electricity tariff intervals.
- **Super-Dal Night Window & Home Baseline Load Controls:** Exposed user configuration controls for Engie Flextime super-off-peak charging (target battery SoC by 07:00 AM) and baseline household load (Watts) for enhanced predictive solar self-consumption simulation.
- **Multi-Channel Alert Webhooks:** Added automatic payload formatting for Discord, Telegram, and Slack webhook destinations to support real-time threshold and system alerts.
- **Remote Cloud Operating Mode & Battery Control:** Added handlers for `SET_BATTERY_MODE` and `SET_OPERATING_MODE` remote commands dispatched from GRID-EMS-SERVER, enabling installers to adjust edge operating modes and battery policies remotely.
- **Hardware Diagnostic Probe & Cloud Superadmin Dispatch:** Added an integrated device diagnostic probing engine directly to the Device Management interface. Installers and homeowners can trigger on-demand live diagnostic probes on any configured inverter, battery, EV charger, smart meter, or relay to test TCP socket reachability, measure network latency, verify active poller cycle execution, inspect live decoded telemetry metrics, and view chronological timestamped diagnostic trace logs.
- **One-Click Diagnostic Submission to GRID-EMS-SERVER:** Introduced a secure, direct diagnostic submission channel from the edge unit to the central cloud platform. If a template encounters register offsets or communication errors, users can package probe findings and observations and dispatch them directly to central engineering for analysis and template correction.
- **Central Cloud Fleet Command Synchronization (`GRID-EMS-SERVER`):** Added native execution support for remote site configuration updates (`UPDATE_SETTINGS`), on-demand subnet hardware discovery (`TRIGGER_NETWORK_SCAN`), immediate telemetry forcing (`FORCE_TELEMETRY`), and capacity peak optimization evaluation triggered from the central management platform. Discovered hardware devices from subnet sweeps are now automatically reported back to the cloud console.
- **Expanded Native Hardware Ecosystem (140 Templates Across All Major European Brands):** Added 39 new out-of-the-box hardware device templates across residential and commercial energy storage, hybrid inverters, smart meters, EV chargers, and SG-Ready heat pumps:
  - *Solar & Hybrid Inverters (8 new models, 32 total):* Added native Modbus SunSpec and Modbus TCP support for ABB / Fimer (`abb_fimer_inverter`), Autarco SX/MX/LX (`autarco_inverter`), Chisage ESS (`chisage_ess`), Delta Electronics (`delta_inverter`), HYXiPOWER (`hyxipower_inverter`), KSTAR BluE (`kstar_inverter`), Solinteg Integ M (`solinteg_inverter`), and Solplanet / AISWEI (`solplanet_inverter`).
  - *Dedicated Battery Energy Storage Systems (10 new models, 13 total):* Added native support for Duracell Energy (`duracell_energy`), Dyness Battery Systems (`dyness_battery`), Elecnova Commercial & Industrial BESS (`elecnova_bess`), Goneo Residential Storage (`goneo_storage`), Mastervolt MLI Ultra & CZone (`mastervolt_storage`), Power Sonic C&I ESS (`powersonic_bess`), Poweroad Storage (`poweroad_storage`), Pylontech US & Force Series (`pylontech_storage`), Socomec SUNSYS BESS (`socomec_bess`), and Sunwoda AtSmart Storage (`sunwoda_energy`).
  - *Electric Vehicle Chargers & Wallboxes (7 new models, 53 total):* Added native OCPP and Modbus TCP integrations for Volt Time Source (`volttime_source`), SolaX Smart EV Charger (`solax_evcharger`), Teltonika TeltoCharge (`teltonika_teltocharge`), Wallbox Pulsar Plus / Commander local OCPP (`wallbox_ocpp`), Kempower C/S-Series fast chargers (`kempower_charger`), MyEnergi Zappi local API (`myenergi_zappi`), and FLEXeCHARGE Open Gateway (`flexecharge_gateway`).
  - *Grid Smart Meters & Energy Analyzers (10 new models, 36 total):* Added native Modbus RTU/TCP and REST integrations for Chint DTSU666 (`chint_dtsu666`), Accuenergy Acuvim/AcuRev (`accuenergy_meter`), Algodue UPM209/309 (`algodue_meter`), Hager ECM/ECR (`hager_meter`), Janitza UMG Power Analyzers (`janitza_umg`), Kamstrup meters (`kamstrup_meter`), Landis+Gyr industrial meters (`landisgyr_meter`), Phoenix Contact EMpro (`phoenix_empro`), Weidmüller Energy Meters (`weidmuller_meter`), and YouLess LS120 P1/pulse meters (`youless_ls120`).
  - *Smart Relays & SG-Ready Actuators (4 new models, 6 total):* Added SG-Ready Heat Pump Boost (`sgready_heatpump`), Shelly Plus 1 / Pro 1 dry contact relay (`shelly_plus_1`), Shelly Plus 2PM / Pro 2PM dual-channel meter/relay (`shelly_plus_2pm`), and Modbus Digital I/O relay module (`modbus_relay`).
- **Comprehensive Hardware Integration Reference (`Supported_devices.md`):** Updated the canonical hardware reference with full documentation and detailed technical specifications for all 140 native templates.

### Changed
- **Brand Guidelines & System Directives Harmonization:** Aligned system guidelines, technical documentation, and user manuals with native brand directives. Enforced vendor-neutral terminology for external charge point operators and employer billing coexistence, established Raedian and Enerlution as primary reference hardware for UI illustrations, and reinforced programmatic edge-to-cloud bidirectional synchronization standards between GRID-EMS and GRID-EMS-SERVER.
- **In-Memory Caching for Control Loop Performance:** Implemented thread-safe in-memory caching for site settings and relay automation rules. Eliminates over 129,000 redundant SQLite queries per day on the Raspberry Pi during the 2-second control loop, significantly reducing CPU wakeups and SD card flash wear.
- **Dynamic Price Cache Invalidation:** Connected site settings updates to immediate strategy pricing and tariff cache invalidation, ensuring changes to tariffs, markups, or thresholds take effect instantly rather than waiting for hourly boundaries.
- **Generic Reference Hardware Specifications:** Updated documentation, deployment manuals, and interactive troubleshooting guides to use vendor-neutral, generic hardware specifications (standard Raspberry Pi 5 platform, standard M.2 NVMe PCIe base, and high-speed NVMe storage) and removed store-specific commercial links, providing open hardware guidance for homeowners and installers.

### Fixed
- **P1 Smart Meter Monthly Peak Telemetry & Adaptive Peak Shaving:** Resolved an issue where running 15-minute average power (OBIS code `1-0:1.4.0`) could be confused with the official Fluvius maximum monthly peak active demand (OBIS code `1-0:1.6.0`). The P1 meter integration now independently decodes the authoritative monthly peak alongside its official fiscal timestamp, preventing false peak threshold adjustments and ensuring the Flanders adaptive ceiling matches utility billing records.
- **Three-Phase EV Charging Power Modulation:** Corrected power modulation scaling for three-phase EV chargers in both peak shaving throttle and solar excess sinking modes. The controller now scales charging setpoints using the charger's active phase mode (690 W/A across three phases vs 230 W/A on single phase), eliminating setpoint overshooting and oscillation during dynamic solar tracking and capacity throttling.
- **Home Battery Power Evaluation & Inverter Register Protection:** Fixed battery charging power polarity evaluation under capacity peak shaving so battery charging is correctly treated as household consumption rather than generating surplus. In addition, battery power setpoints are now constrained to safe physical limits (up to 30 kW), eliminating register value overflow when interfacing with 16-bit Modbus battery storage systems.
- **Solar Forecasting Proportional Capacity Scaling:** Calibrated the solar irradiance forecasting engine to scale projected solar generation according to the system's actual installed PV array peak capacity (kWp), replacing fixed 5 kW nominal calculations with installation-specific generation curves.
- **Elia National Renewable Energy Dataset Aggregation:** Refined public data query parameters for Elia Belgian national wind and solar production datasets to ensure accurate aggregation across national transmission zones and eliminate duplicate generation readings.
- **Multi-Inverter Proportional Solar Curtailment:** Implemented proportional power limit distribution for installations with multiple PV inverters during negative spot price curtailment in the Netherlands mode. Each inverter's export ceiling is now scaled proportionally based on its rated AC capacity relative to total array size, ensuring balanced thermal loading across inverters.
- **Dutch Dynamic Energy Contract Feed-in Calculation:** Corrected dynamic injection tariff calculations for Dutch energy contracts by aligning the formula strictly with wholesale day-ahead spot prices and contract volume multipliers, preventing foreign supplier markup constants from affecting solar feed-in compensation.
- **Multi-Device History Power Aggregation:** Corrected historical power queries across installations with multiple inverters, dual-socket EV chargers, or multiple batteries using a two-stage SQL aggregation query, preventing historical power totals from being averaged or divided by the device count.
- **Non-Blocking Solar Forecast Ingestion:** Added strict 3-second HTTP client timeouts and in-memory forecast caching for Open-Meteo solar forecast requests, preventing network delays from blocking the primary 2-second control loop.
- **EnergyZero Bidding Zone Isolation:** Guarded dynamic tariff fallback ingestion so Dutch EnergyZero spot prices are strictly prevented from contaminating Belgian bidding zone (`BE`) price profiles.
- **EV Charger Category Synchronization in Cloud Engine:** Corrected device category filtering in the cloud management module so all wallbox and EV charging station templates (including RAEDIAN, Alfen, Easee, and Zaptec) respond reliably to remote charging mode commands and accurately aggregate daily charging energy totals.
- **Subnet Discovery Resource Safety:** Hardened the local network sweep to strictly bound IP iteration to a standard local subnet limit and utilize a bounded concurrent worker pool, preventing excessive system resource utilization on complex home networks.
- **Backend Build Compilation & History Query Dependencies:** Resolved missing standard library imports (`strconv` in device state history filtering and `fmt` in automated regression tests), restoring clean native Go compilation and test suite execution.
- **Release Changelog Automation & Synchronization:** Resolved an issue where release entries remained unmigrated in public release documentation by implementing automated version promotion and release notes generation in the release pipeline.

---

## [v9.7.1] - 2026-09-10

### Fixed
- **RAEDIAN Gemini Phase Current Measurement:** Corrected an issue where RAEDIAN Gemini dual-socket phase 3 current aggregation referenced an invalid connector field, restoring accurate combined phase current calculations and build stability.

---

## [v9.7.0] - 2026-09-10

### Changed
- **RAEDIAN Charger Modbus Protocol V0.7 Support:** Updated the RAEDIAN NEO, NEX, and Gemini AC Wallbox templates to match the latest Modbus protocol specification. RAEDIAN Gemini dual chargers now support continuous 0–64A dynamic current modulation for optimal solar self-consumption, replacing stepped presets and automatically balancing current across both sockets.
- **Single-Read Telemetry Batching for RAEDIAN Chargers:** Optimized Modbus communication for RAEDIAN chargers to retrieve all 3-phase currents, voltages, power, energy, session statuses, and error codes in a single request, reducing network latency and bus traffic.

### Fixed
- **RAEDIAN NEO / NEX Charge Session Control:** Corrected the Modbus control registers used for start, stop, and current limiting on RAEDIAN NEO and NEX wallboxes to align with official protocol registers, restoring reliable automated pausing and dynamic solar current adjustments.

---

## [v9.6.1] - 2026-09-10

### Added
- **Release Repository Changelog Synchronization:** Synchronized system changelogs directly to the public release repository and attached them to GitHub release packages, ensuring installers and users can inspect complete version history from the documentation and release hub.

### Fixed
- **Changelog Staging in Release Pipeline:** Resolved an issue where `CHANGELOG.md` was inadvertently omitted during release repository synchronization, ensuring release notes are always published alongside documentation updates.

---

## [v9.6.0] - 2026-09-10

### Added
- **Continuous Automated Releases:** Enabled automated releases on every push to `main` with semantic versioning. Changes are automatically categorized based on update impact (patch for fixes, minor for new features, major for breaking changes), generating ready-to-use Debian packages, Raspberry Pi OS images, and updated manuals.

---

## [v9.5.1] - 2026-09-09

### Changed
- **System Branding:** Updated all system references and user interface components to New Energy Grid branding for consistent visual identity.
- **Documentation Build Reliability:** Enhanced automated PDF manual generation timeout thresholds to ensure complete documentation packaging during release builds.

---

## [v9.5.0] - 2026-09-07

### Added
- **Central Cloud Platform Integration:** Added secure outbound synchronization to the central cloud management platform (`ems.newenergygrid.com`), enabling high-frequency telemetry reporting, remote operating mode adjustments, and fleet management without requiring open inbound router ports.
- **Remote Dispatch Support:** Added real-time remote commands for operating strategy adjustments, battery charge/discharge mode overrides, dynamic EV charger throttling, and smart relay toggling.

### Changed
- **Cloud Infrastructure Endpoints:** Updated the default cloud synchronization service URL to `ems.newenergygrid.com` across the application backend and user interface.
- **Installer & User Documentation:** Comprehensive updates to the Installer, User, and Server Connection manuals covering central cloud management and remote monitoring.

---

## [v9.4.2] - 2026-09-04

### Added
- **Release Synchronization Automation:** Introduced an automated release synchronization pipeline to mirror manuals, documentation, and user guides to the public release repository.

### Changed
- **Prioritized Modbus TCP EV Charging:** Prioritized direct Modbus TCP communication for EV chargers over OCPP where supported. This allows instantaneous sub-second current throttling (6A–32A) for peak shaving while keeping the charger simultaneously connected to commercial split-billing and cloud charge-point operators (CPO) over OCPP.
- **Manual Layouts:** Refreshed visual layouts, hardware connection diagrams, and troubleshooting steps in the downloadable PDF manuals.

---

## [v9.4.1] - 2026-09-03

### Added
- **Automated PDF Manual Generation:** Integrated automated PDF manual generation into build workflows, producing downloadable PDF manuals directly accessible from the documentation hub.
- **Green Certificate Value Protection (GSC):** Added support for Flemish Groenestroomcertificaten (GSC) guaranteed minimum price tiers (€90, €210, €230, €250, €270, €330, €350, €450/MWh) into solar export logic, preventing premature solar inverter curtailment during negative spot pricing hours.

### Changed
- **System User & Service Standardization:** Standardized the local system user and background service name to `gems` and `gems.service` across system configurations, permissions, and service scripts.
- **Maintenance Cleanup:** Cleaned up unused legacy service definitions and development scripts to streamline Raspberry Pi system overhead.

---

## [v9.4.0] - 2026-09-02

### Added
- **Brussels Region Tariff Support:** Added native support for Brussels distribution network operator tariffs (SIBELGA), completing coverage across all three Belgian regions (Flanders, Wallonia, Brussels).
- **Multi-Battery Power Aggregation:** Improved multi-inverter and multi-battery telemetry aggregation to accurately compute combined state-of-charge (SoC) and net charging power.

### Changed
- **Configuration Engine:** Centralized system settings retrieval to reduce backend query overhead and accelerate UI navigation response times.

---

## [v9.3.5] - 2026-08-30

### Changed
- **Mobile-Responsive Dashboard:** Refactored the live interactive PowerFlow dashboard layout to automatically adapt smoothly to smartphones, tablets, and small screen sizes.
- **System Terminology:** Standardized naming conventions and visual references throughout system settings and user guides.

---

## [v9.3.0] - 2026-08-28

### Added
- **24-Hour Dynamic Tariff Visualizer:** Introduced an interactive 24-hour tariff visualizer displaying wholesale EPEX day-ahead spot prices, supplier markups, network tariffs, taxes, 6% VAT, and dynamic injection compensation curves.
- **Flanders Monthly Peak Tracking & Smart Adaptive Ceiling:** Added 15-minute rolling average grid import tracking in SQLite with an adaptive ceiling that automatically aligns with the current month's recorded peak, allowing maximum EV charging speed without increasing capacity tariff bills.
- **Dynamic Energy Contract Presets:** Added pre-configured calculation presets for TotalEnergies Pixel Dynamic, Mega Smart/Cosy Dynamic, and related regional dynamic contracts.

### Changed
- **System Proposals & Architecture:** Updated technical roadmap and architecture documentation to detail market integration models and peak shaving workflows.

---

## [v9.2.0] - 2026-08-28

### Added
- **Public Release Repository Support:** Migrated software updates and OTA delivery lookup to the dedicated public release repository (`GRID-EMS-RELEASE`), facilitating frictionless system updates directly through the UI.

---

## [v9.1.6] - 2026-08-27

### Fixed
- **Debian Package Scripts:** Corrected script interpreter paths in installation packages to ensure clean installation and upgrade execution on Debian and Raspberry Pi OS.

---

## [v9.1.5] - 2026-08-27

### Changed
- **Project Rebranding:** Rebranded the platform to GEMS (Grid Energy Management System) across backend services, frontend user interface, and build configurations.

---

## [v9.1.0] - 2026-08-27

### Added
- **Expanded Hardware Templates:** Expanded native hardware support to over 90 pre-configured templates covering solar inverters (Huawei, SMA, Solis, Enerlution, Sungrow, GoodWe, SolarEdge, Victron), batteries, smart meters (P1 & Modbus), and smart relays.
- **SMA Telemetry Enhancements:** Enhanced telemetry polling for SMA inverters and battery storage systems for more granular power flow diagnostics.

### Changed
- **Runtime Environment:** Upgraded Node.js build dependencies to version 24 LTS for enhanced build performance and security.

---

## [v9.0.1] - 2026-08-26

### Added
- **Diagnostic Log Level Control:** Added user-adjustable system log level control in the Logger UI, allowing users and installers to toggle between standard and debug diagnostics on demand.

---

## [v9.0.0] - 2026-08-24

### Added
- **Raspberry Pi 5 NVMe SSD Support:** Pre-configured PCIe header and NVMe boot support in custom Raspberry Pi OS images for high-speed, durable storage operation.
- **Checksum Verification:** Generated SHA256 checksums automatically for all release packages and OS images to verify download integrity.

### Changed
- **Streamlined User Interface:** Streamlined dashboard layouts, condensed navigation headers, and reduced visual clutter for faster load times and cleaner kiosk display operation.
