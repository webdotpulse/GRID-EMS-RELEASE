# Changelog

All notable changes to the GEMS (Grid Energy Management System) project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> [!NOTE]
> **Privacy & Security Notice:** Changelog entries focus exclusively on user-facing features, improvements, and operational changes. Technical credentials, internal server endpoints, sensitive cryptographic keys, and vulnerability reproduction details are strictly excluded to protect user installations.

---

## [Unreleased]

---

## [v9.8.1] - 2026-09-10

### Added
- **Comprehensive Hardware Integration Reference (`Supported_devices.md`):** Published an exhaustive, detailed reference covering all 101 native hardware templates supported across inverters, dedicated battery storage systems, EV chargers, smart meters, and smart relays. Details exact communication protocols (Modbus TCP, OCPP 1.6-J/2.0.1, REST, P1 serial/network), register telemetry read, writable control setpoints, and practical real-world automated actions executed by the GEMS strategy engine (self-consumption optimization, Flanders capacity peak shaving, negative spot price protection, and dynamic load balancing).

### Changed
- **Generic Reference Hardware Specifications:** Updated documentation, deployment manuals, and interactive troubleshooting guides to use vendor-neutral, generic hardware specifications (standard Raspberry Pi 5 platform, standard M.2 NVMe PCIe base, and high-speed NVMe storage) and removed store-specific commercial links, providing open hardware guidance for homeowners and installers.

### Fixed
- **Release Changelog Automation & Synchronization:** Resolved an issue where release entries remained unmigrated in public release documentation by implementing automated version promotion and release notes generation in the release pipeline, guaranteeing that every new tagged release accurately publishes its version history to `GRID-EMS-RELEASE`.

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
