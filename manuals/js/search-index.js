/**
 * GEMS (The New Energy Grid) Documentation Search Index
 * Provides instant client-side full-text search across all documentation pages.
 */
window.DOCS_SEARCH_INDEX = [
  // --- Overview & Hub ---
  {
    title: "Documentation Overview & Architecture",
    category: "Overview",
    url: "index.html",
    snippet: "High-level architecture of GEMS (The New Energy Grid), monolith Go backend, Vue 3 SPA, SQLite WAL storage, and system overview.",
    keywords: ["overview", "architecture", "monolith", "golang", "vue3", "sqlite", "wal", "raspberry pi", "introduction"]
  },
  {
    title: "System Hardware Requirements",
    category: "Overview",
    url: "index.html#requirements",
    snippet: "Hardware compatibility matrix for Raspberry Pi 3B+, 4B, 5, Zero 2W, SD card wear optimization, and memory footprint.",
    keywords: ["hardware", "raspberry pi", "sd card", "ram", "arm64", "debian", "bookworm", "specifications"]
  },
  {
    title: "5-Minute Quickstart",
    category: "Overview",
    url: "index.html#quickstart",
    snippet: "Fast setup guide to flash the OS image, boot the Raspberry Pi, and access the web UI at ems.local.",
    keywords: ["quickstart", "getting started", "first boot", "ems.local", "fast setup"]
  },

  // --- Installation Manual ---
  {
    title: "Official Tested Reference Hardware BOM",
    category: "Installation",
    url: "installation.html#hardware-reference",
    snippet: "BOM for db-tronic Raspberry Pi 5 4GB NVMe Kit, Patriot P300 128GB M.2 NVMe SSD, official 27W USB-C PD power supply, and RS485/P1 pinouts.",
    keywords: ["hardware", "db-tronic", "patriot p300", "nvme ssd", "27w power supply", "bom", "reference kit", "m.2 2280", "rpi 5 kit"]
  },
  {
    title: "NVMe M.2 SSD Setup & EEPROM Bootloader Configuration",
    category: "Installation",
    url: "installation.html#nvme-setup",
    snippet: "Fixing Raspberry Pi 5 Patriot P300 NVMe SSD detection, BOOT_ORDER=0xf461, PCIE_PROBE=1, dtparam=pciex1, Raspberry Pi Imager EEPROM utility, and dd flashing.",
    keywords: ["nvme setup", "patriot p300", "eeprom", "boot order", "pcie_probe", "dtparam=pciex1", "pciex1_gen", "imager bootloader", "ssd not detected", "m.2 boot"]
  },
  {
    title: "Custom Raspberry Pi OS Image (Recommended)",
    category: "Installation",
    url: "installation.html#custom-os-image",
    snippet: "Flashing the pre-configured Bookworm ARM64 OS image with BalenaEtcher or Raspberry Pi Imager. Out-of-the-box kiosk mode and Cockpit.",
    keywords: ["custom image", "os image", "balenaetcher", "raspberry pi imager", "flash sd card", "bookworm", "img.xz"]
  },
  {
    title: "Debian Package (.deb) Installation",
    category: "Installation",
    url: "installation.html#deb-package",
    snippet: "Installing NEMS on existing Debian or Ubuntu ARM64 distributions via dpkg -i nems_*_arm64.deb and managing nems.service.",
    keywords: ["deb", "debian", "dpkg", "apt", "package", "systemd", "nems.service", "ubuntu"]
  },
  {
    title: "Building from Source",
    category: "Installation",
    url: "installation.html#building-from-source",
    snippet: "Compiling Go 1.24+ backend and Vue 3 frontend with build.sh, CGO cross-compilation for ARM64.",
    keywords: ["build", "source code", "compile", "golang", "node", "npm", "gcc-aarch64-linux-gnu", "build.sh"]
  },
  {
    title: "Cockpit Web Terminal & System Management",
    category: "Installation",
    url: "installation.html#cockpit",
    snippet: "Accessing Cockpit web interface on port 9090 (admin / manufacturer) for terminal access, service restarts, and hardware monitoring.",
    keywords: ["cockpit", "port 9090", "terminal", "admin", "manufacturer", "ssh", "systemctl", "logs"]
  },
  {
    title: "Raspberry Pi Connect Unattended Remote Access",
    category: "Installation",
    url: "installation.html#rpi-connect",
    snippet: "Pairing Raspberry Pi Connect (rpi-connect signin) for secure cloud remote desktop access without VPN or port forwarding.",
    keywords: ["raspberry pi connect", "rpi-connect", "remote access", "vnc", "screen sharing", "wayvnc", "wayfire"]
  },
  {
    title: "RS485 & Modbus Physical Wiring Guide",
    category: "Installation",
    url: "installation.html#rs485-wiring",
    snippet: "USB-to-RS485 wiring, A/B line polarity, 120 Ohm termination resistors, cable shielding, and bus topologies.",
    keywords: ["rs485", "modbus wiring", "termination resistor", "polarity", "shielding", "twisted pair", "usb to rs485"]
  },
  {
    title: "P1 DSMR Smart Meter RJ12 Pinout",
    category: "Installation",
    url: "installation.html#p1-wiring",
    snippet: "RJ12 pinout connections (GND, RTS, RxD, VCC) for digital smart meters in Belgium (Fluvius) and the Netherlands.",
    keywords: ["p1 meter", "rj12", "pinout", "fluvius", "dsmr", "smart meter cable", "rts", "gnd"]
  },

  // --- Configuration Manual ---
  {
    title: "Site Optimization Strategies Overview",
    category: "Configuration",
    url: "configuration.html#strategy-modes",
    snippet: "Configuring strategy_mode: Eco Mode, Flanders Peak Shaving, and Netherlands Zero-Export.",
    keywords: ["strategy_mode", "eco", "flanders", "netherlands", "site optimization", "control loop"]
  },
  {
    title: "Eco Strategy (Self-Consumption Maximization)",
    category: "Configuration",
    url: "configuration.html#eco-strategy",
    snippet: "Prioritizing solar excess for home battery charging, EV charging, and domestic hot water heating.",
    keywords: ["eco mode", "self consumption", "solar excess", "green charging", "surplus"]
  },
  {
    title: "Flanders Peak Shaving (Capaciteitstarief)",
    category: "Configuration",
    url: "configuration.html#flanders-peak-shaving",
    snippet: "15-minute rolling average capacity tariff peak shaving, capacity_peak_limit_kw, peak_shaving_buffer_w, and EV throttling.",
    keywords: ["flanders", "peak shaving", "capaciteitstarief", "capacity_peak_limit_kw", "15-minute peak", "obis 1.6.0", "throttling"]
  },
  {
    title: "Netherlands Zero-Export & Smart Saldering",
    category: "Configuration",
    url: "configuration.html#netherlands-zero-export",
    snippet: "Preventing grid feed-in penalties, active_inverter_curtailment, and min_profitable_export_price dynamic spot thresholding.",
    keywords: ["netherlands", "zero export", "smart saldering", "curtailment", "min_profitable_export_price", "negative prices"]
  },
  {
    title: "Day-Ahead EPEX Spot Price Arbitrage",
    category: "Configuration",
    url: "configuration.html#battery-arbitrage",
    snippet: "Dynamic battery charging based on spot prices, force_charge_below_euro, force_discharge_above_euro, and degradation wear modeling.",
    keywords: ["epex", "day-ahead", "spot prices", "arbitrage", "battery degradation", "wear cost", "force_charge_below_euro"]
  },
  {
    title: "Energy Contracts & Provider Formulas",
    category: "Configuration",
    url: "configuration.html#energy-contracts",
    snippet: "Formulas and settings for Engie Flextime, Luminus, Eneco, Frank Energie, Ecopower, EnergyZero, and Enovos.",
    keywords: ["energy contract", "engie", "luminus", "eneco", "frank energie", "ecopower", "energyzero", "enovos", "tariffs", "markup"]
  },
  {
    title: "3-Phase Phase-Aware Load Balancing & Fuse Protection",
    category: "Configuration",
    url: "configuration.html#phase-balancing",
    snippet: "Main connection protection with grid_nominal_current_a and phase_limit_amps per L1, L2, L3 phase.",
    keywords: ["phase balancing", "phase_limit_amps", "grid_nominal_current_a", "fuse protection", "3-phase", "unbalance"]
  },
  {
    title: "Smart Relays & SG-Ready Heat Pump Automation",
    category: "Configuration",
    url: "configuration.html#relay-automation",
    snippet: "Automation rules for boilers, SG-Ready heat pump modes (EVU lock, normal, boost, storage), and anti-short-cycle timers.",
    keywords: ["smart relay", "sg-ready", "heat pump", "boiler", "automation rules", "anti-short-cycle", "min_run_time_seconds"]
  },
  {
    title: "Webhook Alerts & SMTP Email Reporting",
    category: "Configuration",
    url: "configuration.html#alerts-reporting",
    snippet: "Configuring alert_webhook_url for 90% peak warnings and polling failures, and SMTP credentials for weekly PDF reports.",
    keywords: ["webhook", "alert_webhook_url", "smtp", "email reports", "pdf reports", "notifications", "capacity warning"]
  },

  // --- User Manual ---
  {
    title: "Dashboard & Hero PowerFlow Diagram",
    category: "User Guide",
    url: "user-manual.html#dashboard-powerflow",
    snippet: "Live power flow hero visualization, dynamic active node rendering, and animated energy flow vectors.",
    keywords: ["dashboard", "powerflow", "hero graphic", "real-time flow", "live power", "grid", "solar", "battery", "charger"]
  },
  {
    title: "Click-to-Reveal Historical Charts & Overlays",
    category: "User Guide",
    url: "user-manual.html#historical-charts",
    snippet: "Opening high-resolution time-series modals by clicking any PowerFlow node, resolution filters (1h, 24h, 7d, 30d), and grid overlay comparisons.",
    keywords: ["historical charts", "click to reveal", "time series", "compare grid", "zoom", "metrics", "chart modal"]
  },
  {
    title: "Flanders Quarter-Hour Capacity Peak Gauge",
    category: "User Guide",
    url: "user-manual.html#flanders-gauge",
    snippet: "Real-time 15-minute projected quarter peak gauge, OBIS 1.6.0 tracking, and status badges (Normal, Warning, Throttled).",
    keywords: ["flanders gauge", "projected peak", "quarter hour", "status badge", "throttled", "warning", "capaciteitstarief"]
  },
  {
    title: "Adding & Managing Devices",
    category: "User Guide",
    url: "user-manual.html#device-management",
    snippet: "Using the Add Device wizard, configuring Modbus Host, Port, Slave ID, and poll intervals.",
    keywords: ["device management", "add device", "templates", "modbus id", "poll interval", "edit device"]
  },
  {
    title: "Zero-Dependency Network Scanner & OUI Discovery",
    category: "User Guide",
    url: "user-manual.html#network-scanner",
    snippet: "Discovering local inverters, smart meters, and chargers using ARP scanning and MAC OUI matching.",
    keywords: ["network scanner", "discovery", "oui", "mac address", "subnet scan", "device discovery"]
  },
  {
    title: "Modbus TCP Reachability Probe (Test Connection)",
    category: "User Guide",
    url: "user-manual.html#modbus-probe",
    snippet: "One-click connection test to verify Modbus TCP reachability and response latency (ms) before saving settings.",
    keywords: ["test connection", "modbus probe", "latency", "reachability", "tcp test"]
  },
  {
    title: "Native OCPP 1.6 / 2.0.1 EV Charging Server",
    category: "User Guide",
    url: "user-manual.html#ocpp-server",
    snippet: "Embedded OCPP WebSocket server at ws://<pi-ip>:8080/api/ocpp/<ID>, charger configuration, and cloudless local control.",
    keywords: ["ocpp", "ocpp 1.6", "ocpp 2.0.1", "websocket", "charger connection", "csms", "charge point id", "local control"]
  },
  {
    title: "System Logs & One-Click Over-The-Air Updates",
    category: "User Guide",
    url: "user-manual.html#logs-updates",
    snippet: "Viewing real-time logs, journalctl export, and executing transparent .deb updates via the UI.",
    keywords: ["logger", "journalctl", "ota updates", "github token", "install update", "system info", "release tag"]
  },

  // --- Devices Reference ---
  {
    title: "Universal 4-Step Device Onboarding Workflow",
    category: "Devices",
    url: "devices.html#onboarding-workflow",
    snippet: "Universal 4-step workflow to physically connect, prepare vendor hardware, add via GEMS UI, and verify real-time polling health.",
    keywords: ["onboarding", "add device", "workflow", "scanner", "discovery", "save device", "online status", "health check"]
  },
  {
    title: "Solar & Hybrid Inverters (24 Brands & Templates)",
    category: "Devices",
    url: "devices.html#inverters",
    snippet: "Step-by-step setup for Huawei SUN2000 (LUNA2000), SMA Sunny Boy/Tripower, Solis Hybrid, Fronius Gen24/Symo, GoodWe, Growatt, SolarEdge (SetApp), SolaX, SofarSolar, Sungrow, Victron GX, Deye/Sunsynk, FoxESS, SAJ, Senergy, Sigenergy SigenStor, Enerlution, Alpha ESS, Anker SOLIX X1, Afore, Marstek, LG ESS, Enphase IQ Gateway.",
    keywords: ["huawei", "sun2000", "luna2000", "sma", "sunny boy", "tripower", "solis", "fronius", "gen24", "goodwe", "growatt", "solaredge", "solax", "sofarsolar", "sungrow", "victron", "cerbo gx", "deye", "sunsynk", "foxess", "saj", "senergy", "sigenergy", "sigenstor", "enerlution", "alpha ess", "anker", "solix", "afore", "marstek", "lg ess", "enphase", "inverter", "battery", "curtailment", "sunspec"]
  },
  {
    title: "EV Chargers & Wallboxes (38 Templates)",
    category: "Devices",
    url: "devices.html#ev-chargers",
    snippet: "Universal Native OCPP 1.6-J/2.0.1 (Huawei FusionCharge, EVBox, Mennekes AMTRON, SMA, Schneider EVlink, Siemens VersiCharge, Elli/VW, ABB Terra AC, Alpitronic, Autel, Hager, BMW, Mercedes, Porsche, Plugchoice, Fronius Wattpilot, Easee), Modbus TCP (RAEDIAN NEO/NEX/Gemini, KEBA P30/P40, Webasto, Peblar, Phoenix Contact, Veton, GoodWe HCA, Sigenergy, ABL eM4, Enovates, ETEK, Etrel, NRGkick, B+GE-TECH), and REST/Cloud (go-e Charger Gemini, SmartEVSE, Wallbox Pulsar, Zaptec Go).",
    keywords: ["raedian", "neo", "gemini", "ocpp", "huawei fusioncharge", "evbox", "elvi", "livo", "mennekes", "amtron", "sma ev charger", "schneider", "evlink", "siemens", "versicharge", "elli", "id charger", "abb", "terra ac", "alpitronic", "autel", "maxicharger", "hager", "witty", "bmw", "mercedes", "porsche", "plugchoice", "wattpilot", "easee", "keba", "p30", "p40", "webasto", "peblar", "phoenix contact", "charx", "veton", "goodwe hca", "sigenergy", "abl", "em4", "enovates", "etek", "etrel", "nrgkick", "bgetech", "go-e", "smartevse", "wallbox", "pulsar", "zaptec", "ev charger", "wallbox", "charging"]
  },
  {
    title: "Grid & Smart Meters (26 Templates)",
    category: "Devices",
    url: "devices.html#smart-meters",
    snippet: "Step-by-step setup for P1 DSMR Serial (/dev/ttyUSB0), P1 Network TCP Bridge, HomeWizard Wi-Fi P1, Homey Energy Dongle, Shelly 3EM, Shelly Pro 3EM / Gen3 3EM-63T, Eastron (SDM120, SDM220, SDM230, SDM630, SDM72D, SMART X96), Carlo Gavazzi (EM112, EM340, EM540, EM24), ABB (A43, A44, B23, B24), Schneider Acti9 iEM3000/PM3200, Siemens SENTRON PAC2200, SMA Energy Meter 2.0, Socomec COUNTIS/DIRIS, WAGO 879, Eltako, Finder 7M, Inepro, Lovato DMG610, Acrel ADW300, ESPHome, Loxone Miniserver, Niko Home Control.",
    keywords: ["p1 serial", "p1 network", "dsmr", "fluvius", "homewizard", "homey", "shelly 3em", "shelly pro 3em", "eastron", "sdm630", "sdm230", "sdm120", "sdm72d", "smart x96", "carlo gavazzi", "em340", "em540", "em112", "em24", "abb", "a43", "a44", "b23", "b24", "schneider", "acti9", "iem3000", "pm3200", "siemens", "pac2200", "sma energy meter", "socomec", "countis", "diris", "wago", "879", "eltako", "finder", "7m", "inepro", "lovato", "dmg610", "acrel", "adw300", "esphome", "loxone", "niko", "smart meter", "grid meter", "submeter"]
  },
  {
    title: "Smart Relays & SG-Ready Contactors (2 Templates)",
    category: "Devices",
    url: "devices.html#smart-relays",
    snippet: "Configuring Shelly Plus 1PM, Pro 1PM, Plug S, and Generic HTTP Relay for SG-Ready heat pumps, boilers, and thermal loads based on solar excess and spot prices.",
    keywords: ["shelly plus 1pm", "shelly pro 1pm", "plug s", "generic relay", "heat pump", "sg-ready", "contactor", "boiler", "thermal load", "solar excess"]
  },
  {
    title: "Live Diagnostics & Health Verification",
    category: "Devices",
    url: "devices.html#diagnostics",
    snippet: "Interpreting status badges (Online, Error, Offline), real-time register monitoring in Logger, and resolving communication errors.",
    keywords: ["diagnostics", "status badges", "online", "error", "offline", "logger", "registers", "health check"]
  },
  {
    title: "Plugin Architecture & Adding Custom Go Templates",
    category: "Devices",
    url: "devices.html#adding-template",
    snippet: "Extending GEMS with custom DevicePoller Go plugins in backend/internal/templates/.",
    keywords: ["plugin architecture", "custom template", "devicepoller", "golang", "contributing", "modbus template"]
  },

  // --- Troubleshooting ---
  {
    title: "Modbus TCP & RTU Troubleshooting",
    category: "Troubleshooting",
    url: "troubleshooting.html#modbus-troubleshooting",
    snippet: "Resolving connection refused, timeout, slave address mismatch, RS485 termination, and communication errors.",
    keywords: ["modbus error", "connection refused", "timeout", "slave id mismatch", "rs485 error", "bus error"]
  },
  {
    title: "P1 Smart Meter Communication Issues",
    category: "Troubleshooting",
    url: "troubleshooting.html#p1-troubleshooting",
    snippet: "Diagnosing DSMR baud rates (9600 vs 115200), parity settings, inverted signal cables, and Fluvius port activation.",
    keywords: ["p1 error", "dsmr baud rate", "fluvius activation", "p1 telegram", "no data received", "baud 115200"]
  },
  {
    title: "OCPP EV Charger Connection Diagnostics",
    category: "Troubleshooting",
    url: "troubleshooting.html#ocpp-troubleshooting",
    snippet: "Fixing WebSocket handshake rejections, mismatched ChargePoint IDs, port 8080 firewall blocks, and offline fallback mode.",
    keywords: ["ocpp error", "websocket error", "chargepoint id", "offline charger", "handshake rejected", "port 8080"]
  },
  {
    title: "NVMe SSD Not Detected & Bootloader Diagnostics",
    category: "Troubleshooting",
    url: "troubleshooting.html#nvme-troubleshooting",
    snippet: "Troubleshooting Patriot P300 SSD detection on Raspberry Pi 5, PCIe ribbon cable seating, 27W PSU brownouts, lspci, and EEPROM settings.",
    keywords: ["nvme error", "ssd not detected", "pcieport link down", "patriot p300", "pi 5 nvme", "blank screen", "bootloader", "lspci", "lsblk", "rpi-eeprom-config"]
  },
  {
    title: "SQLite & Storage Health Diagnostics",
    category: "Troubleshooting",
    url: "troubleshooting.html#sd-card-sqlite",
    snippet: "Verifying SQLite WAL mode, checking SD card and NVMe write endurance, batch write health, and database integrity.",
    keywords: ["sqlite wal", "sd card wear", "database corrupted", "batch write", "disk space", "retention worker", "nvme health"]
  },
  {
    title: "Frequently Asked Questions (FAQ)",
    category: "Troubleshooting",
    url: "troubleshooting.html#faq",
    snippet: "Answers to common questions regarding car API omission, zero-export response time, pricing update intervals, and Cockpit access.",
    keywords: ["faq", "frequently asked questions", "why no car api", "offline mode", "cockpit password", "update failed"]
  }
];
