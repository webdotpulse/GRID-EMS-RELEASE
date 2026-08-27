# ⚡ GEMS — Grid Energy Management System

<div align="center">

[![Go Version](https://img.shields.io/badge/Go-1.24+-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![Vue 3](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-WAL%20Mode-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Target Platform](https://img.shields.io/badge/Platform-Raspberry%20Pi%205%20%2F%20ARM64-C51A4A?style=for-the-badge&logo=raspberrypi&logoColor=white)](https://www.raspberrypi.com/)
[![OCPP Protocol](https://img.shields.io/badge/OCPP-1.6--J%20%26%202.0.1-FF6F00?style=for-the-badge&logo=socketdotio&logoColor=white)](https://openchargealliance.org/)
[![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)](LICENSE)

**A high-performance, local-first, UI-driven Energy Management System (EMS) engineered for Raspberry Pi & Linux ARM64.**

*Coordinate Solar, Home Batteries, EV Charging, Smart Meters, and Relays with intelligent peak shaving and dynamic tariff arbitrage — 100% offline-capable, zero YAML configuration.*

[🌟 Key Features](#-key-features) • [📸 Visual Showcase](#-visual-showcase) • [🧠 Optimization Strategies](#-energy-optimization-strategies) • [🔌 Supported Hardware](#-supported-hardware-ecosystem) • [🚀 Quick Start](#-deployment--installation) • [📖 Documentation](#-documentation-library)

---

</div>

<div align="center">
  <img src="screenshots/dashboard.png" alt="GEMS Interactive PowerFlow Dashboard" width="95%" style="border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);" />
  <p><em>Real-time interactive PowerFlow hero visualization showing live energy distribution across Grid, Solar PV, Home Battery, and EV Chargers.</em></p>
</div>

---

## 🌟 Key Features

- **🚀 Monolithic Single-Binary Architecture**: Built as a cohesive, ultra-fast Go backend providing an embedded HTTP/WebSocket/SSE server and SQLite engine, serving a modern Vue 3 Single Page Application (SPA).
- **🔒 100% Local & Cloud-Independent**: Zero external cloud dependency. All telemetry polling, control loops, strategy decisions, and historical logging run on-premises on your hardware.
- **✨ Zero YAML Configuration**: 100% UI-driven device onboarding, network discovery, contract configuration, and strategy parameter tuning.
- **💾 SD Card & NVMe Flash Preservation**: Specifically engineered for embedded storage. Employs SQLite in **Write-Ahead Logging (WAL)** mode with memory-buffered transactional batch writes to eliminate continuous flash wear.
- **⚡ Native Embedded OCPP 1.6-J / 2.0.1 Server**: Built-in OCPP WebSocket server (`ws://<ems-ip>:8887/<ChargePointID>`) allows EV chargers to connect directly with zero intermediary cloud accounts.
- **🔍 Zero-Dependency Subnet Hardware Scanner**: Integrated local ARP and OUI hardware discovery tool that scans your local subnet to automatically identify inverters, meters, and chargers in seconds.
- **🧠 Advanced Grid & Dynamic Price Algorithms**:
  - **Flanders Peak Shaving**: Synchronized 15-minute sliding-window algorithm designed to minimize the Flemish *Capaciteitstarief*.
  - **Dynamic EPEX Spot Price Arbitrage**: Automatically synchronizes Day-Ahead hourly electricity prices to charge storage on cheap/negative price windows and discharge during high tariffs.
  - **Self-Consumption Eco Mode**: Solar excess tracking with milliwatt-accurate setpoint throttling.
  - **Zero-Export (Netherlands Mode)**: Dynamic inverter power curtailment to prevent negative grid feed-in penalties.
- **📊 Granular Analytics & Automated PDF Reporting**: Live telemetry charting, diagnostic log streaming, and downloadable Daily, Weekly, Monthly, and Annual PDF energy reports.

---

## 📸 Visual Showcase

### ⚡ Real-Time PowerFlow & Node Telemetry

Clicking any node on the live dashboard opens comprehensive telemetry breakdowns, historical performance charts, and instant setpoint overrides.

| Interactive Desktop Dashboard | Mobile Responsive View |
| :---: | :---: |
| ![Desktop Dashboard](screenshots/dashboard.png) | ![Mobile Dashboard](screenshots/dashboard_mobile.png) |
| *Desktop dashboard with live animated energy paths* | *Touch-optimized responsive mobile layout* |

| Battery Telemetry & Mode Override | Solar PV Yield & Curtailment |
| :---: | :---: |
| ![Battery Telemetry Modal](screenshots/dashboard_modal_battery.png) | ![Solar Telemetry Modal](screenshots/dashboard_modal_solar.png) |
| *Real-time SoC, charge/discharge rates, and manual mode overrides* | *String-level PV production metrics and dynamic inverter throttle* |

| EV Charging Setpoints & Mode | Grid Import / Export & Quotas |
| :---: | :---: |
| ![EV Charger Modal](screenshots/dashboard_modal_charger.png) | ![Grid Telemetry Modal](screenshots/dashboard_modal_grid.png) |
| *Phase currents, active power, and Eco/Fast/Scheduled charging* | *15-minute peak monitoring, energy meter readouts, and tariffs* |

---

### ⚙️ Hardware Discovery & Device Management

| Zero-Config Subnet Scanner | 90+ Pre-Configured Templates |
| :---: | :---: |
| ![Subnet Scanner](screenshots/scanner.png) | ![Add Device Modal](screenshots/settings_devices_add_modal.png) |
| *Instant local subnet discovery with MAC vendor lookup* | *Pre-configured drop-down templates for all major brands* |

| Active Devices & Polling Status | Smart Relays & Contactors |
| :---: | :---: |
| ![Active Devices](screenshots/settings_devices.png) | ![Smart Relays](screenshots/settings_relays.png) |
| *Live connection status, polling intervals, and device metrics* | *Automated contactor triggers for heat pumps and boilers* |

---

### 🧠 Energy Strategies & System Observability

| Flanders Peak Shaving & Strategy Tuning | Energy Contracts & EPEX Tariffs |
| :---: | :---: |
| ![Strategy Tab](screenshots/settings_strategy.png) | ![Energy Contract Settings](screenshots/settings_contract.png) |
| *Quarter-hour sliding-window limits and battery rules* | *Dynamic day-ahead spot pricing and fixed/dual tariff models* |

| Real-Time Diagnostics Logger | System Info, OTA Updates & Webhooks |
| :---: | :---: |
| ![Diagnostics Logger](screenshots/logger.png) | ![System Info & Updates](screenshots/settings_system_info.png) |
| *Live server events, Modbus raw frames, and log export* | *One-click OTA updates, debian uploads, and notification webhooks* |

---

## 🧠 Energy Optimization Strategies

GEMS comes with four specialized control strategies that can be combined or scheduled:

```
                      ┌───────────────────────────────────────────────┐
                      │             Site Strategy Engine              │
                      └───────────────────────┬───────────────────────┘
                                              │
         ┌───────────────────┬────────────────┴───────────────────┬───────────────────┐
         ▼                   ▼                                    ▼                   ▼
 ┌───────────────┐   ┌───────────────┐                    ┌───────────────┐   ┌───────────────┐
 │   Eco Mode    │   │Peak Shaving   │                    │Price Arbitrage│   │  Zero Export  │
 │(Self-Consump.)│   │(Flanders Peak)│                    │(EPEX Spot Day)│   │ (Curtailment) │
 └───────┬───────┘   └───────┬───────┘                    └───────┬───────┘   └───────┬───────┘
         │                   │                                    │                   │
         ▼                   ▼                                    ▼                   ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────────┐
 │ Dynamic Device Dispatcher: Inverters (Modbus) • EVSE (OCPP/Modbus) • Relays (Shelly/HTTP) │
 └────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1. 🌿 Eco Mode (Solar Self-Consumption)
- Continuously polls grid import/export at sub-second intervals.
- Dynamically allocates excess solar generation first to the home battery, then modulates EV charging current (6A–32A, 1-phase or 3-phase), and lastly triggers secondary loads (heat pumps, water heaters) via smart relays.

### 2. 🇧🇪 Flanders Mode (Predictive 15-Minute Peak Shaving)
Designed specifically for the Flemish capacity tariff (*Capaciteitstarief*):
- Tracks elapsed time $t$ (seconds) and energy imported $E_{\text{import}}(t)$ within each synchronized 15-minute grid billing window ($T = 900\,\text{s}$).
- Calculates the maximum permissible instantaneous power limit:
  $$P_{\text{limit}}(t) = \frac{P_{\text{target}} \cdot T - E_{\text{import}}(t)}{T - t}$$
- Dynamically throttles EV charging current and injects home battery power when household loads spike, preventing new monthly peak records.

### 3. 💶 Dynamic EPEX Spot Price Arbitrage
- Integrates Day-Ahead hourly electricity spot market prices.
- When electricity prices dip below a user-defined threshold (or drop negative), GEMS force-charges the home storage and EV from the grid.
- When market prices peak, GEMS prevents grid import and covers household baseload entirely from the battery.

### 4. 🚫 Zero-Export Mode (Netherlands Inverter Curtailment)
- Ensures solar production never feeds back into the public grid.
- Employs dynamic Modbus power throttling on supported inverters (Huawei, SMA, Fronius, Solis, etc.) when batteries are full and local household demand drops.

---

## 🔌 Supported Hardware Ecosystem

GEMS includes **90 native hardware templates** across all essential residential energy domains:

```
  ┌───────────────────────────────────────────────────────────────────────────────────┐
  │                               90+ HARDWARE TEMPLATES                              │
  ├───────────────────┬───────────────────┬───────────────────┬───────────────────────┤
  │   Solar Inverters │    EV Chargers    │   Smart Meters    │ Smart Relays & IO     │
  │    (24 Templates) │   (38 Templates)  │   (26 Templates)  │ (2 Templates)         │
  └───────────────────┴───────────────────┴───────────────────┴───────────────────────┘
```

### Quick Reference Matrix

| Category | Supported Brands & Templates | Protocols | Key Configuration Parameters |
| :--- | :--- | :--- | :--- |
| **☀️ Solar & Hybrid Inverters** *(24 templates)* | **Huawei** SUN2000 (3KTL–100KTL), **SMA** Sunny Boy / Tripower / Core, **Solis** Hybrid (RHI/S5/S6), **Fronius** Symo / Primo / Gen24, **Victron** GX / Venus OS, **GoodWe** ET/EH/BH, **Growatt** SPH/MIN/MOD, **SolarEdge** (SetApp SunSpec), **SolaX** Power, **SofarSolar** HYD, **Sungrow** SH/SG, **Deye** / **Sunsynk**, **FoxESS**, **SAJ**, **Senergy**, **Sigenergy**, **Alpha ESS**, **Anker** SOLIX, **Afore**, **Marstek**, **LG ESS**, **Enphase** Envoy | Modbus TCP (Port 502 / 1502 / 5040), SunSpec, REST JSON | Host IP, Port, Modbus Slave ID (`1` to `247`), Rated Inverter Capacity (kW) |
| **🚗 EV Charging Stations** *(38 templates)* | **Native OCPP 1.6-J / 2.0.1**: Huawei FusionCharge, EVBox Elvi / Livo / BusinessLine, Mennekes AMTRON, SMA EV Charger, Schneider EVlink, Siemens VersiCharge, Elli / VW ID. Charger, ABB Terra AC, Alpitronic, Autel MaxiCharger, Hager witty, BMW Wallbox, Mercedes-Benz, Porsche Mobile, Plugchoice, Fronius Wattpilot, Easee Home/Charge.<br><br>**Modbus TCP / REST**: RAEDIAN NEO / NEX / Gemini, KEBA KeContact P30 / P40, Webasto Next/Unite, Peblar, Phoenix Contact EM-CP, Veton One/Two, GoodWe HCA, Sigenergy Sigen EV, ABL eM4, Enovates, ETEK, Etrel INCH, go-e Charger Gemini, SmartEVSE, Wallbox Pulsar Plus, Zaptec Go | Native OCPP WebSocket, Modbus TCP, HTTP REST, Local UDP | ChargePoint ID (OCPP) or Host IP & Modbus Port, Minimum & Maximum Phase Currents (6A–32A) |
| **⚡ Smart & Grid Meters** *(26 templates)* | **P1 DSMR USB/Serial** (P1 Dutch/Belgian Standard v5.02 / e-muv), **P1 Network TCP Bridge**, **HomeWizard** Wi-Fi P1 Meter, **Homey** Energy Dongle, **Shelly** 3EM / Pro 3EM / Gen3 3EM-63T, **Eastron** (SDM120 / SDM230 / SDM630 / SDM72D / SDMX96), **Carlo Gavazzi** (EM112 / EM340 / EM540 / ET112 / EM24), **ABB** (A43 / B23), **Schneider** Acti9 iEM3xxx, **Siemens** PAC2200 / PAC3100, **SMA** Energy Meter 2.0 / Sunny Home Manager, **Socomec** Diris, **WAGO** 879, **Eltako**, **Finder**, **Inepro**, **Lovato**, **Acrel**, **ESPHome**, **Loxone**, **Niko** Home Control | Serial DSMR (`/dev/ttyUSB0`), Modbus TCP, Local REST, Multicast UDP | Serial Device Port & Baud Rate (`115200`), or Target IP & Port |
| **🔌 Smart Relays & Contactors** *(2 templates)* | **Shelly** Plus 1PM, Pro 1PM, Plug S, Pro 4PM, Mini 1PM, **Generic HTTP Relay / Contactors** | Local Gen 2 REST, HTTP JSON | Host IP, Port 80, Excess Solar Activation Threshold (W), Minimum On-Time |

> 📖 **Comprehensive Step-by-Step Guides for Every Device**: View the interactive [Device Reference Manual](manuals/devices.html) or [docs/user_manual.md](docs/user_manual.md).

---

## 🛠️ Reference Hardware BOM

GEMS is optimized, benchmarked, and validated on the following hardware platform:

| Component | Hardware Specification | Purchase Reference |
| :--- | :--- | :--- |
| **Complete System Kit** | **db-tronic Raspberry Pi 5 4GB NVMe Kit**<br>• Raspberry Pi 5 (4GB RAM)<br>• Official 27W USB-C PD Power Supply<br>• Metal Enclosure with PWM Active Cooler<br>• M.2 NVMe PCIe HAT & 16-pin FPC cable<br>• 64GB MicroSD Card + 4K Micro-HDMI cable | [Amazon: db-tronic RPi 5 Kit](https://www.amazon.com.be/-/en/dp/B0GZ65XG3G?ref=ppx_yo2ov_dt_b_fed_asin_title&th=1) |
| **Internal High-Speed Storage** | **Patriot P300 128GB M.2 PCIe Gen 3 x4 NVMe SSD**<br>• Model: `P300P128GM28`<br>• Low thermal profile, high endurance (WAL-friendly)<br>• Read: up to 1600 MB/s / Write: up to 600 MB/s | [Amazon: Patriot P300 128GB SSD](https://www.amazon.com.be/-/en/dp/B0822Y6N1C?ref=ppx_yo2ov_dt_b_fed_asin_title&th=1) |
| **P1 Smart Meter Interface** | **USB to P1 RJ12 FTDI Serial Cable** (with RTS pull-up resistor for DSMR 5.0) | Standard DSMR P1 FTDI Cable |
| **Modbus RS485 Interface** | **Industrial USB to RS485 FTDI Converter** (Isolated, 600W TVS surge protection) | Waveshare / FTDI USB-RS485 |

> 📖 **Full Hardware Specifications & Pinouts**: See [docs/hardware_reference.md](docs/hardware_reference.md).

---

## ⚡ NVMe SSD Bootloader Setup (Patriot P300 SSD)

When setting up a fresh Raspberry Pi 5 with an NVMe HAT and the Patriot P300 SSD, the factory board EEPROM is configured to boot only from SD card (`BOOT_ORDER=0xf41`).

### 🌟 3-Minute Quick Fix (Using Raspberry Pi Imager)
1. Insert a MicroSD card into your PC.
2. Open **[Raspberry Pi Imager](https://www.raspberrypi.com/software/)** &rarr; Choose Device: **Raspberry Pi 5** &rarr; Choose OS: **Misc utility images** &rarr; **Bootloader** &rarr; **NVMe/PCIe Boot**.
3. Select your MicroSD card and click **Write**.
4. Install the Patriot P300 SSD onto the NVMe HAT, insert the MicroSD card into the Pi 5, and connect power.
5. In ~5 seconds, the green ACT LED will flash rapidly and the HDMI output turns **solid green**, confirming EEPROM is updated (`BOOT_ORDER=0xf461`, `PCIE_PROBE=1`).
6. Unplug power, remove the SD card, and flash `gems-os-image.img.xz` to the SSD.
7. Power on—the system boots from the NVMe SSD in under 8 seconds!

> 📖 **Detailed Diagnostics & Terminal Flashing Guide**: See [docs/nvme_boot_guide.md](docs/nvme_boot_guide.md).

---

## 🚀 Deployment & Installation

### Option A: Custom Turnkey Raspberry Pi OS Image (Recommended)

Pre-built custom **Raspberry Pi OS Lite (Bookworm ARM64)** image with all services pre-configured:

1. Download `gems-os-image.img.xz` from the [Latest GitHub Release](https://github.com/webdotpulse/GRID-EMS/releases).
2. Flash directly to your NVMe SSD or SD card using [Raspberry Pi Imager](https://www.raspberrypi.com/software/) or [BalenaEtcher](https://etcher.balena.io/).
3. Insert media into your Raspberry Pi and boot.

**Out-of-the-Box System Environment**:
- **Web UI**: Accessible at `http://ems.local` or `http://<ip-address>`.
- **Nginx Reverse Proxy**: Pre-configured with SSL termination and WebSocket/SSE proxy routing to GEMS on port `8080`.
- **Kiosk Desktop**: Lightweight Wayland environment (`wayfire`) autostarting Chromium in full-screen kiosk mode.
- **Cockpit Web Terminal**: Web-based administration terminal on port `9090` (User: `admin`, Password: `manufacturer`).
- **Raspberry Pi Connect**: Pre-installed for secure remote access without port forwarding.

---

### Option B: Install via Debian Package (.deb)

For existing Debian / Ubuntu ARM64 installations:

```bash
# 1. Download the latest DEB release
curl -LO https://github.com/webdotpulse/GRID-EMS/releases/latest/download/gems_latest_arm64.deb

# 2. Install package
sudo dpkg -i gems_latest_arm64.deb
sudo apt-get install -f  # resolve dependencies if required

# 3. Verify service status
sudo systemctl status gems.service
```

The installer creates a dedicated system user, configures `/opt/gems`, and registers `gems.service` with systemd.

---

### Option C: Building from Source

#### Prerequisites
- **Node.js 22+** (Vue 3 SPA build)
- **Go 1.24+** (Backend compilation)
- **ARM64 Cross-Compiler** (if compiling on x86_64 host): `sudo apt-get install -y gcc-aarch64-linux-gnu libc6-dev-arm64-cross`

#### Build Command
```bash
git clone https://github.com/webdotpulse/GRID-EMS.git
cd GRID-EMS
chmod +x build.sh
./build.sh
```

The output artifact is generated in `build/gems-release-arm64.tar.gz`.

---

## 📖 Documentation Library

| Document | Format | Description |
| :--- | :---: | :--- |
| 💻 **[Interactive Web Manuals](manuals/index.html)** | HTML | Complete interactive documentation suite with instant full-text search. |
| 🔌 **[Device Templates & Manuals](manuals/devices.html)** | HTML | Step-by-step connection guides for all 90 supported hardware templates. |
| 📘 **[User Operations Manual](docs/user_manual.md)** | Markdown | Daily operational workflows, dashboard navigation, and OCPP setup. |
| 🔬 **[Advanced Technical Manual](docs/advanced_manual.md)** | Markdown | Mathematical formulations for peak shaving, state machines, and contactor controls. |
| ⚡ **[NVMe Bootloader Setup Guide](docs/nvme_boot_guide.md)** | Markdown | Raspberry Pi 5 EEPROM configuration and Patriot P300 SSD flashing. |
| 🛠️ **[Hardware Reference & BOM](docs/hardware_reference.md)** | Markdown | Validated parts list, power budget, and RS485/P1 wiring pinouts. |
| 🌐 **[Remote Access Guide](docs/remote_access.md)** | Markdown | Cockpit terminal configuration (port 9090) and Raspberry Pi Connect pairing. |
| ⚙️ **[Settings & Formulas Reference](docs/settings.md)** | Markdown | Complete parameter dictionary for grid contracts, feed-in tariffs, and polling loops. |

---

## 📂 Project Structure

```
GRID-EMS/
├── .github/workflows/
│   └── release.yml            # CI/CD pipeline building DEB packages & OS images
├── backend/
│   ├── main.go                # Server entry point, cmux routing, systemd integration
│   ├── api.go                 # REST endpoints, OTA update handler & PDF exports
│   ├── poller.go              # Async hardware polling loops & Modbus client engine
│   ├── state.go               # Server-Sent Events (SSE) & SQLite WAL time-series store
│   ├── strategy.go            # Flanders peak shaving, Eco mode, & battery dispatch engine
│   ├── pricing.go             # Dynamic EPEX Day-Ahead spot price synchronizer
│   └── internal/              # Domain models, embedded OCPP server & 90 device templates
├── frontend/
│   ├── src/components/        # Vue 3 UI cards, PowerFlow hero graphic & modal forms
│   └── src/types/             # TypeScript type definitions & contract schemas
├── config/
│   └── wayfire.ini            # Wayland kiosk configuration for local HDMI touchscreens
├── docs/                      # Technical manuals, hardware BOM & strategy deep-dives
├── manuals/                   # Interactive searchable HTML documentation suite
├── screenshots/               # High-resolution UI showcase images
└── build.sh                   # Unified cross-compilation release script
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Developed with ❤️ by <a href="https://github.com/webdotpulse">The New Energy Grid</a>. Built for an open, sovereign, and sustainable energy future.</sub>
</div>
