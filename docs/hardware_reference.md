# Hardware Reference Specification

This document provides the official reference hardware Bill of Materials (BOM), specifications, wiring requirements, and hardware considerations for deploying **GEMS (New Energy Grid)**.

---

## 🛠️ Official Tested Reference Hardware

The following hardware combination is the officially tested and verified reference platform for GEMS:

| Component | Product / Model | Key Specifications | Reference Link |
| :--- | :--- | :--- | :--- |
| **Complete System Kit** | **db-tronic Raspberry Pi 5 4GB NVMe Kit** | • Raspberry Pi 5 (4GB RAM, Quad-Core ARM Cortex-A76 @ 2.4GHz)<br>• Official Raspberry Pi 27W USB-C PD Power Supply<br>• Custom Aluminum Metal Enclosure with passive/active cooling<br>• Official Raspberry Pi 5 Active Cooler<br>• M.2 NVMe PCIe HAT / Base with 16-pin FPC ribbon cable<br>• 64GB MicroSD Card + 4K Micro-HDMI cable | [Amazon BE: db-tronic RPi 5 Kit](https://www.amazon.com.be/-/en/dp/B0GZ65XG3G?ref=ppx_yo2ov_dt_b_fed_asin_title&th=1) |
| **Internal Storage (NVMe)** | **Patriot P300 128GB M.2 NVMe SSD**<br>`P300P128GM28` | • Form Factor: M.2 2280 M-Key<br>• Interface: PCIe Gen 3.0 x4 (NVMe 1.3)<br>• Controller: Silicon Motion SM2263XT / Phison PS5013-E13T<br>• Max Read: 1,600 MB/s / Max Write: 600 MB/s<br>• Low power consumption (ideal for 24/7 Raspberry Pi EMS) | [Amazon BE: Patriot P300 128GB](https://www.amazon.com.be/-/en/dp/B0822Y6N1C?ref=ppx_yo2ov_dt_b_fed_asin_title&th=1) |

---

## ⚡ Power Supply & Electrical Requirements

### 1. Power Supply Requirement (27W USB-C PD)
* When connecting an M.2 NVMe SSD via the Raspberry Pi 5 PCIe header, the system requires a **5V / 5A (27W)** Power Delivery (PD) power supply (included in the db-tronic kit).
* Standard 15W (5V / 3A) chargers will trigger under-voltage warnings (`dmesg: Under-voltage detected!`) during high NVMe burst write operations and may cause the PCIe link to drop.
* When powered by the official 27W supply, the Pi 5 enables full 1.6A current delivery across USB and PCIe ports.

### 2. Form Factor & Physical Mounting
* **SSD Size:** The db-tronic NVMe HAT supports standard **M.2 2280** (and 2230/2242) form factors.
* **Ribbon Cable (16-pin 0.5mm pitch FPC):**
  * Gold contact pins on the Pi 5 mainboard must face **inward towards the USB/Ethernet ports**.
  * Gold contact pins on the NVMe HAT must face the board contacts according to the HAT connector orientation.
  * Ensure the black locking tabs are lifted gently, the ribbon is inserted 100% straight, and the tab is pressed down firmly.

---

## 🔌 Communication Hardware Accessories

For connecting to physical inverters, batteries, and smart meters:

### 1. RS485 / Modbus RTU Interfaces (USB to RS485)
* **Chipset:** FTDI FT232RL or Silicon Labs CP2102 or CH340 / MAX485 with transient voltage suppression (TVS).
* **Connection:**
  * **A (D+)**: Connect to Inverter Pin A
  * **B (D-)**: Connect to Inverter Pin B
  * **GND / COM**: Connect to common signal ground
  * **Termination**: 120Ω resistor at bus extremities (for runs > 10m).

### 2. P1 Smart Meter RJ12 Cable
* **Connector:** RJ12 (6P6C).
* **Baud Rate:** 115200 baud (DSMR 5.0 in Belgium/Netherlands) or 9600 baud (DSMR 2/3).
* **Signal Inversion:** Requires active signal inverter (P1 serial signals from Dutch/Belgian smart meters are logically inverted).

---

## 📖 Related Documentation
* [NVMe Boot & Troubleshooting Guide](nvme_boot_guide.md) — Step-by-step setup to enable NVMe boot on the Patriot P300 SSD.
* [Installation Manual](user_manual.md) — Complete software setup guide.
* [Remote Access Manual](remote_access.md) — Cockpit and Raspberry Pi Connect configuration.
