# ⚡ GEMS — Grid Energy Management System

<div align="center">

[![Go Version](https://img.shields.io/badge/Go-1.24+-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![Vue 3](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-WAL%20Mode-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Target Platform](https://img.shields.io/badge/Platform-Raspberry%20Pi%205%20%2F%20ARM64-C51A4A?style=for-the-badge&logo=raspberrypi&logoColor=white)](https://www.raspberrypi.com/)
[![OCPP Protocol](https://img.shields.io/badge/OCPP-1.6--J%20%26%202.0.1-FF6F00?style=for-the-badge&logo=socketdotio&logoColor=white)](https://openchargealliance.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**A high-performance, local-first, UI-driven Energy Management System (EMS) engineered for Raspberry Pi 5 & Linux ARM64.**

*Coordinate Solar, Home Batteries, EV Charging, Smart Meters, and Relays with intelligent peak shaving and dynamic tariff arbitrage — 100% offline-capable, zero YAML configuration.*

[🌟 Key Features](#-key-features) • [📸 Visual Showcase](#-user-interface-showcase) • [🔌 Supported Hardware](#-supported-devices--step-by-step-onboarding) • [🛠️ Hardware Requirements](#-hardware-platform) • [🚀 Quick Start](#-deployment--installation) • [📖 Documentation](#-documentation-library)

---

</div>

## 🌟 Key Features

- **Hardware Target**: Deeply optimized for **Raspberry Pi 5** (Debian/Linux ARM64). CPU information is intentionally excluded from the UI to maintain a lightweight system profile. The system uses the release tag (`git describe --tags --always`) as its build number.
- **Monolithic Single-Binary Architecture**: A cohesive monolith featuring a Go backend acting as a unified API and web server, paired with a modern Vue 3 Single Page Application (SPA).
- **Minimal Storage & SD Wear**: Utilizes a highly tuned local SQLite database configured with Write-Ahead Logging (WAL) mode and batched, in-memory transactional writes.
- **Fully UI-Driven**: Zero YAML configuration required. Add, configure, and remove hardware devices entirely through an intuitive frontend UI.
- **90+ Native Hardware Templates**: Native support for 80+ leading manufacturers covering Solar Inverters, Batteries, EV Chargers (OCPP 1.6-J / 2.0.1, Modbus TCP, REST), P1 Smart Meters, and Smart Relays.
- **Dynamic Site Optimization Strategies**:
  - *Eco Mode*: Maximizes self-consumption of solar energy and prioritizes local storage over grid feed-in.
  - *Flanders Mode (Predictive Peak Shaving & Monthly Peak Tracking)*: Continuously tracks 15-minute rolling average grid import in SQLite. Proactively throttles EV chargers and discharges home batteries to keep the projected quarter peak under `capacity_peak_limit_kw`. Features a **Smart Adaptive Ceiling** that dynamically adapts to the month's maximum peak so homeowner charging speed is maximized without increasing capacity tariff costs.
  - *Netherlands Mode (Smart Saldering & Zero-Export)*: Zero-export constraint logic to limit solar feed-in, including `min_profitable_export_price` and negative injection fee protection.
  - *Dynamic Battery Arbitrage*: Integrates EPEX Spot Day-Ahead prices to force charge batteries during cheap/negative hours and discharge during peak market pricing.
- **Belgian Energy Market & Regional Provider Presets**: Native calculation models for TotalEnergies Pixel Dynamic, Mega Smart/Cosy Dynamic, Bolt Dynamisch, Engie Dynamic / Flextime, Luminus Dynamic, Eneco Dynamic, Frank Energie, Ecopower, Dats 24, Octa+, Trevion, Aspiravi, and Belgian Dual-Tariff (Piek/Dal + 6% BTW), with DNO distribution presets for Fluvius, ORES, RESA, and SIBELGA.
- **Live 24-Hour Effective Tariff Curve Visualizer**: Interactive stacked cost breakdown displaying wholesale spot, supplier markup, DNO network tariffs, excise & 6% VAT, dynamic solar injection price, and negative price curtailment warnings.
- **Native OCPP 1.6-J / 2.0.1 Server**: Built-in OCPP WebSocket server (`ws://<ems-ip>:8887/<ChargePointID>`) allows EV chargers to connect directly to the EMS with zero cloud dependencies.
- **Subnet Network Scanner**: Zero-dependency local network scanner leveraging localized MAC OUI maps to instantly discover and identify supported hardware on your network.
- **Interactive Energy Flow Chart**: Hero element on the dashboard showing active power flow between Grid, Solar, Battery, and Chargers. Clicking any node opens dedicated historical charts and detailed metrics.
- **Reporting & Data Exporting**: Export structured technical logs (`.txt`) via Logger UI and visual energy reports (Daily, Weekly, Monthly, Yearly) in PDF format.
- **Manual & OTA Software Updates**: Support for both automated online OTA updates via GitHub releases and manual offline upload of Debian packages (`.deb`) via the System Info UI.
- **Notifications & Webhook Alerts**: Webhook alerting logic for system errors, consecutive polling failures, and capacity thresholds.

---

## 📸 User Interface Showcase

### ⚡ Dashboard & Live Power Flow
| Desktop PowerFlow Dashboard | Mobile Responsive View |
| :---: | :---: |
| ![Dashboard](screenshots/dashboard.png) | ![Mobile Dashboard](screenshots/dashboard_mobile.png) |

### 🔍 Click-to-Reveal Historical Modals
| Solar Production & Curtailment | Battery Telemetry & State-of-Charge |
| :---: | :---: |
| ![Solar Modal](screenshots/dashboard_modal_solar.png) | ![Battery Modal](screenshots/dashboard_modal_battery.png) |

| Grid Import/Export & Capacity Peak | EV Charger History & Setpoint |
| :---: | :---: |
| ![Grid Modal](screenshots/dashboard_modal_grid.png) | ![Charger Modal](screenshots/dashboard_modal_charger.png) |

### ⚙️ Strategy & Dynamic Optimization
| Flanders Peak Shaving & Capacity Limits | Multi-Strategy Operational Modes |
| :---: | :---: |
| ![Strategy Tab](screenshots/settings_strategy.png) | ![Strategy Modes](screenshots/settings_strategy_modes.png) |

### 💶 Dynamic Energy Contract & 24h Tariff Curve
| Supplier Contract & Tax Formulas | 24h Interactive Tariff Breakdown Visualizer |
| :---: | :---: |
| ![Contract Tab](screenshots/settings_contract.png) | ![Tariff Visualizer](screenshots/settings_contract_tariffs.png) |

### 🔌 Device Management & Template Wizards
| Configured Devices Management | Add Device Category Wizard |
| :---: | :---: |
| ![Devices Tab](screenshots/settings_devices.png) | ![Add Device Wizard](screenshots/settings_devices_add_modal.png) |

| Inverter Modbus TCP Configuration | Smart Meter P1 Serial/Network Form |
| :---: | :---: |
| ![Inverter Form](screenshots/settings_devices_inverter_form.png) | ![Meter Form](screenshots/settings_devices_meter_form.png) |

| EV Charger Native OCPP Server Setup | Smart Relays & Automation Rules |
| :---: | :---: |
| ![Charger Form](screenshots/settings_devices_charger_form.png) | ![Relays Rules](screenshots/settings_relays_rules.png) |

### 🛠️ Diagnostics, System Info & Webhook Alerts
| Subnet Hardware Scanner | Real-Time Diagnostics Logger |
| :---: | :---: |
| ![Network Scanner](screenshots/scanner.png) | ![Logger](screenshots/logger.png) |

| Hardware Info & NVMe Wear Diagnostics | Webhook Alerts & Automated Reports |
| :---: | :---: |
| ![System Info Tab](screenshots/settings_system_info.png) | ![Notifications Tab](screenshots/settings_notifications.png) |

---

## 🔌 Supported Devices & Step-by-Step Onboarding

GEMS includes **90 native hardware templates**. Adding a device requires 4 simple steps in the web UI:

1. **Scan Subnet**: Go to **Scanner** in the sidebar to discover your device IP and MAC vendor.
2. **Prepare Hardware**: Enable Modbus TCP in your inverter dongle (e.g. Huawei SDongleA, SMA Speedwire, SolarEdge SetApp), configure your EV charger's OCPP Server URL (`ws://<GEMS-IP>:8887/<ID>`), or toggle *Local API* in your HomeWizard/Shelly app.
3. **Add Device in UI**: Navigate to **Settings &rarr; Devices &rarr; + Add Device**, select the category, choose the template, and enter the IP/serial parameters.
4. **Verify Telemetry**: Verify that the device card displays <span style="color:#10b981; font-weight:bold;">● Online</span> and watch real-time energy flow on the Dashboard.

### Quick Reference Matrix

| Category | Supported Brands & Templates | Primary Protocols | Key Setup Parameters |
| :--- | :--- | :--- | :--- |
| **Solar & Hybrid Inverters** *(24 templates)* | Huawei SUN2000, SMA Sunny Boy/Tripower, Solis Hybrid, Fronius Gen24/Symo, GoodWe, Growatt, SolarEdge, SolaX, SofarSolar, Sungrow, Victron GX, Deye, Sunsynk, FoxESS, SAJ, Senergy, Sigenergy, Enerlution, Alpha ESS, Anker, Afore, Marstek, LG ESS, Enphase | Modbus TCP (Port 502 / 1502), SunSpec, REST | Host IP, Port, Modbus Slave ID (e.g. `1` or `126`), Rated kW |
| **EV Charging Stations** *(38 templates)* | **OCPP 1.6-J / 2.0.1**: Huawei FusionCharge, EVBox Elvi/Livo, Mennekes AMTRON, SMA EV Charger, Schneider EVlink, Siemens VersiCharge, Elli/VW ID. Charger, ABB Terra AC, Alpitronic, Autel, Hager, BMW, Mercedes, Porsche, Plugchoice, Fronius Wattpilot, Easee.<br>**Modbus TCP**: RAEDIAN NEO/NEX/Gemini, KEBA P30/P40, Webasto, Peblar, Phoenix Contact, Veton, GoodWe HCA, Sigenergy, ABL, Enovates, ETEK, Etrel.<br>**REST / Cloud**: go-e Charger Gemini, SmartEVSE, Wallbox Pulsar, Zaptec Go | Native OCPP WebSocket, Modbus TCP, HTTP REST, Cloud API | ChargePoint ID (for OCPP) or Host IP & Port (for Modbus/REST), Charge Mode |
| **Grid & Smart Meters** *(26 templates)* | P1 DSMR USB/Serial, P1 Network TCP Bridge, HomeWizard Wi-Fi P1, Homey Energy Dongle, Shelly 3EM, Shelly Pro 3EM / Gen3 3EM-63T, Eastron (SDM120/230/630/72D/X96), Carlo Gavazzi (EM112/340/540/24), ABB (A43/B23), Schneider Acti9, Siemens PAC2200, SMA Energy Meter 2.0, Socomec, WAGO 879, Eltako, Finder, Inepro, Lovato, Acrel, ESPHome, Loxone, Niko | Serial DSMR, Modbus TCP, Local REST, UDP | Serial Port (`/dev/ttyUSB0`) & Baud (`115200`), or Host IP & Port |
| **Smart Relays & Contactors** *(2 templates)* | Shelly Plus 1PM, Pro 1PM, Plug S, Generic HTTP Relay | Local Gen 2 REST, HTTP JSON | Host IP, Port 80, Excess Solar Threshold (W) |

> 📖 **Full Step-by-Step Manuals for Every Device**: See the interactive [Device Reference Manual](manuals/devices.html) or [docs/user_manual.md](docs/user_manual.md).

---

## 🛠️ Hardware Platform

GEMS is engineered to run smoothly on standard embedded hardware:

| Component | Basic Specification |
| :--- | :--- |
| **Host System** | **Raspberry Pi 5** (ARM64, 4GB RAM or higher recommended) |
| **Storage** | **NVMe SSD** (via M.2 PCIe HAT) or high-endurance **MicroSD Card** |
| **Power Supply** | **27W USB-C PD** (5V / 5A) power adapter |
| **Network** | Gigabit Ethernet (recommended) or 2.4/5GHz Wi-Fi |
| **Peripherals** | RJ12 P1 DSMR cable or USB-to-RS485 adapter (if connecting wired meters/inverters) |

---

## ⚡ NVMe Bootloader Setup (Raspberry Pi 5)

When using a Raspberry Pi 5 with an NVMe PCIe HAT, configure the board's EEPROM to probe PCIe storage and enable fast NVMe booting.

### 🌟 Quick Setup (Using Raspberry Pi Imager)
1. Insert a MicroSD card into your computer.
2. Open **[Raspberry Pi Imager](https://www.raspberrypi.com/software/)** &rarr; Choose Device: **Raspberry Pi 5** &rarr; Choose OS: **Misc utility images** &rarr; **Bootloader** &rarr; **NVMe/PCIe Boot**.
3. Choose your MicroSD card and click **Write**.
4. Insert the MicroSD card into the Raspberry Pi 5 and connect power.
5. In ~5 seconds, the ACT LED flashes rapidly and the HDMI screen turns **solid green**, confirming the EEPROM is updated (`BOOT_ORDER=0xf461`, `PCIE_PROBE=1`).
6. Unplug power, remove the MicroSD card, and flash `gems-os-image.img.xz` directly to your NVMe SSD.
7. Power on—the system boots from NVMe in under 8 seconds.

---

## 🚀 Deployment & Installation

GEMS is primarily deployed via automated GitHub release artifacts: a pre-configured custom Raspberry Pi OS image and a Debian (`.deb`) package.

### Option A: Custom Raspberry Pi OS Image (Recommended)

The easiest way to deploy GEMS is flashing the pre-built custom Raspberry Pi OS Lite (Bookworm ARM64) image onto an SD card or NVMe SSD.

1. Download `gems-os-image.img.xz` from the latest GitHub release tag (`v*`).
2. Flash the `.img.xz` archive directly using [Raspberry Pi Imager](https://www.raspberrypi.com/software/) or [BalenaEtcher](https://etcher.balena.io/).
3. Insert the media into your Raspberry Pi 5 and boot.

**Out-of-the-Box Setup**:
- **Hostname**: `ems` (accessible at `http://ems` or `http://ems.local`).
- **Nginx Reverse Proxy**: Pre-configured with SSL and WebSocket/SSE proxy support routing to GEMS on port 8080.
- **Kiosk Desktop**: Minimal Wayland desktop (`wayfire`) autostarting Chromium in kiosk mode targeting `http://ems.local`.
- **Cockpit Web Terminal**: Web-based terminal and system monitoring available on port `9090` (Login: `admin`, Password: `manufacturer`).
- **Raspberry Pi Connect**: Pre-installed and pre-configured for unattended remote screen sharing with automatic connection acceptance.
- **NVMe Ready**: `dtparam=pciex1` and `dtparam=pciex1_gen=2` pre-configured out-of-the-box.

See [Remote Access Documentation](docs/remote_access.md) for details on Cockpit and Raspberry Pi Connect pairing.

---

### Option B: Install via Debian Package (.deb)

If you have an existing Debian/Ubuntu ARM64 installation on your Raspberry Pi 5:

1. Download the latest `gems_*_arm64.deb` package from the release assets.
2. Install the package:
   ```bash
   sudo dpkg -i gems_*_arm64.deb
   sudo apt-get install -f # resolve any missing runtime dependencies
   ```

The package automatically creates a restricted `gems` system user, installs the server binary and compiled frontend to `/opt/gems`, and enables and starts `gems.service` via systemd.

---

### Building from Source

To build GEMS locally from source code:

#### Prerequisites
- Node.js 22+ (for building the Vue 3 SPA)
- Go 1.24+ (for compiling the backend)
- C cross-compiler for ARM64 (`gcc-aarch64-linux-gnu` and `libc6-dev-arm64-cross`) if compiling on non-ARM64 hosts due to `mattn/go-sqlite3` CGO dependencies.

#### Build Command
```bash
git clone https://github.com/webdotpulse/GRID-EMS.git
cd GRID-EMS
./build.sh
```

*Output artifact*: `build/gems-release-arm64.tar.gz` (contains `gems-server` binary and `dist/` web assets).

---

## 📖 Documentation Library

| Guide | Description |
| :--- | :--- |
| 💻 [Interactive HTML Documentation](manuals/index.html) | Rich web documentation suite with full-text search (open in browser) |
| 🔌 [Device Manuals & Templates](manuals/devices.html) | Complete step-by-step guides for all 90 supported hardware templates |
| 📘 [User Manual](docs/user_manual.md) | End-user operations, PowerFlow diagram, OCPP server setup |
| 📖 [Advanced Operational Manual](docs/advanced_manual.md) | Technical deep-dive on algorithms, formulas, and SG-Ready contactors |
| ⚡ [NVMe Boot & Setup Manual](docs/nvme_boot_guide.md) | Complete setup guide for Raspberry Pi 5 NVMe SSD booting |
| 🛠️ [Hardware Reference](docs/hardware_reference.md) | Basic hardware platform specifications, power requirements, RS485/P1 pinouts |
| 🌐 [Remote Access Guide](docs/remote_access.md) | Cockpit terminal on port 9090 and Raspberry Pi Connect pairing |
| ⚙️ [Settings & Strategy Reference](docs/settings.md) | Full reference of all UI parameters, contract formulas, and tariff curves |

---

## 📂 Project Structure

```
GRID-EMS/
├── .github/workflows/
│   └── release.yml        # Unified CI/CD pipeline for DEB & Raspberry Pi OS image releases
├── backend/
│   ├── main.go            # Entry point, HTTP server, systemd & SQLite setup
│   ├── api.go             # REST API handlers & PDF export routes
│   ├── poller.go          # Hardware poller interface & device loops
│   ├── state.go           # SSE live streaming & SQLite time-series storage
│   ├── strategy.go        # Site optimization & control strategy evaluation loop
│   ├── pricing.go         # EPEX Day-Ahead price integration & dynamic tariffs
│   └── internal/          # Domain models, OCPP server, & 90 device template plugins
├── frontend/
│   ├── src/components/    # Vue 3 UI cards, PowerFlow hero graphic, & device forms
│   └── src/types/         # TypeScript interfaces
├── config/
│   └── wayfire.ini        # Wayfire autostart configuration for Chromium kiosk mode
├── scripts/
│   ├── capture_screenshots.js # Automated Chromium screenshot capture suite
│   └── setup-remote-access.sh # Remote access setup utility script
├── docs/                  # Architecture, User Manual, NVMe Guide, Hardware Reference
├── manuals/               # Interactive HTML documentation suite with search
└── build.sh               # Local build script for ARM64 release bundling
```
