# GEMS P1 Smart Meter Interface & DIY Cable Manual

This manual provides complete technical guidance for connecting **GEMS (Grid Energy Management System)** to digital utility smart meters via the **P1 Port** (DSMR 5.0.2 / Belgian e-MUCS v1.4). It includes electrical specifications, pinouts, open-collector inverted signal physics, a complete Bill of Materials, and step-by-step instructions for assembling your own **USB-to-RJ11 / RJ12 cable** with either a hardware transistor inverter or FTDI software inversion.

---

## 1. Understanding the P1 User Port

Modern digital utility electricity meters in Belgium (**Fluvius, Sibelga, ORES, RESA**), the Netherlands (**Liander, Enexis, Stedin**), and Luxembourg (**Creos**) feature an RJ12 customer interface labeled **P1**.

The P1 port streams authoritative fiscal energy telemetry directly from the utility revenue meter to GEMS at high frequency (1-second intervals on DSMR 5.0 / Fluvius meters).

### Telemetry Acquired by GEMS
| Metric | Frequency | Role in GEMS Optimization |
| :--- | :--- | :--- |
| **Active Grid Import Power (W)** | Every 1s | Triggers Flanders peak shaving, battery discharge, or EV throttle when household loads spike. |
| **Active Grid Export Power (W)** | Every 1s | Sunk into home battery, EV charging (6A–32A), or SG-Ready heat pump thermal boost to maximize solar self-consumption. |
| **Phase Current (A) & Voltage (V)** | Every 1s | Monitored across Phase L1, L2, L3 for phase balancing and domestic fuse protection. |
| **Maximum Monthly Peak Demand (kW)**<br>`OBIS 1-0:1.6.0` | Every telegram | Official maximum 15-minute average demand for the active month, used by GEMS **Smart Adaptive Ceiling**. |
| **Cumulative Import/Export (kWh)** | Every telegram | Fiscal billing registers (Tariff 1 Day / Peak & Tariff 2 Night / Off-Peak) for 100% accurate energy reports. |
| **Digital Gas Meter (m³)** | Every 5 min | Gas consumption forwarded wirelessly via M-Bus from the gas meter to the electricity meter. |

---

## 2. Supported Meters & Transmission Parameters

| Region / Operator | Common Meter Models | Standard | Serial Baud Rate |
| :--- | :--- | :--- | :--- |
| **Fluvius (Flanders, BE)** | Sagemcom T211 (3-phase), S211 (1-phase), Landis+Gyr E360 | e-MUCS v1.4 / DSMR 5.0.2 | **115,200 baud** (8N1) |
| **Sibelga (Brussels, BE)** | Sagemcom T211 / S211 | e-MUCS v1.4 / DSMR 5.0.2 | **115,200 baud** (8N1) |
| **ORES / RESA (Wallonia, BE)** | Sagemcom T211 / Landis+Gyr E360 | e-MUCS v1.4 / DSMR 5.0.2 | **115,200 baud** (8N1) |
| **Netherlands (NL)** | Landis+Gyr E350/E360, Kaifa MA105/MA304, Iskra ME382 | DSMR 5.0.2 / DSMR 4.x | **115,200 baud** (DSMR 5)<br>**9,600 baud** (DSMR 4/3/2) |
| **Creos (Luxembourg)** | Sagemcom T210-D Smarty | e-MUCS / DSMR 5.0 | **115,200 baud** (8N1) |

---

## 3. Physical & Electrical Pinouts (RJ12 vs RJ11)

The P1 receptacle on the smart meter is a **6-position, 6-contact (6P6C)** modular socket (RJ12).

### Can You Use a Standard 4-Wire RJ11 Cable?
**Yes.** Standard telephone plugs are **RJ11 (6P4C)**. They fit into the 6P6C socket and make contact with center **Pins 2, 3, 4, and 5**. Because GEMS connects via USB to the Raspberry Pi, the USB dongle draws its 5V power from the Pi USB port, meaning Pin 1 (+5V from meter) is optional!

### Pinout Comparison
| Pin # | Signal Name | Electrical Function | RJ12 (6P6C) | RJ11 (6P4C) |
| :---: | :--- | :--- | :---: | :---: |
| **Pin 1** | **+5V Power** | +5 VDC output (up to 250 mA on DSMR 5.0). Powers external dongles. | Wire 1 | *Not connected* |
| **Pin 2** | **Data Request (RTS)** | Input. **Must be pulled HIGH (+5V)** to start telegram transmission. | Wire 2 | Wire 1 |
| **Pin 3** | **Data Ground (GND)** | Signal reference ground. | Wire 3 | Wire 2 |
| **Pin 4** | **Reserved (NC)** | Not connected. | Wire 4 | Wire 3 |
| **Pin 5** | **Data Output (TxD)** | Inverted open-collector serial output (0V = Mark / Logic 1). | Wire 5 | Wire 4 |
| **Pin 6** | **Power Ground (GND)** | Ground reference (internally tied to Pin 3 on the meter). | Wire 6 | *Not connected* |

```
   RJ12 (6P6C) Plug Layout                 RJ11 (6P4C) Plug Layout
  ┌─────────────────────────┐             ┌─────────────────────────┐
  │  [1] [2] [3] [4] [5] [6]│             │  [ ] [1] [2] [3] [4] [ ]│
  │   │   │   │   │   │   │ │             │       │   │   │   │     │
  │  +5V RTS GND  NC TXD GND│             │      RTS GND  NC TXD    │
  │                         │             │                         │
  │       Plastic Clip      │             │       Plastic Clip      │
  │       (on backside)     │             │       (on backside)     │
  └───────────┬─┬───────────┘             └───────────┬─┬───────────┘
```

---

## 4. Signal Inversion Explained (Why Direct TTL Fails)

The DSMR / Fluvius specification dictates an **open-collector output with inverted logic**:
- **Idle line:** Pulled to 0V &rarr; Logic 1
- **Active bits:** Pulled to +5V &rarr; Logic 0

Standard TTL UART expects Idle = High (+5V) and Start Bit = Low (0V). Connecting Pin 5 directly to an ordinary UART RX pin results in inverted bits, producing framing errors and unreadable garbage in Linux.

To resolve this, the signal must be inverted. GEMS supports two DIY methods:
1. **Method A (Hardware Transistor Inverter):** An NPN transistor (BC547) and pull-up resistor. Compatible with *all* USB-serial chips (CH340, CP2102, FTDI, PL2303).
2. **Method B (FTDI Software Inversion):** Using an authentic FTDI FT232RL chip configured via EEPROM to invert RX internally, requiring zero extra components!

---

## 5. Bill of Materials (BOM) & Tools

| Item | Component | Recommended Model | Approx. Cost |
| :--- | :--- | :--- | :--- |
| 1 | **USB-to-Serial UART Board** | FTDI FT232RL (or CH340G / CP2102) with 5V logic | €3.50 – €6.00 |
| 2 | **Modular Plug & Cable** | RJ12 (6P6C) or RJ11 (6P4C) plug + 1–2m 4/6-core flat cable | €1.00 |
| 3 | **NPN Transistor** *(Method A)* | BC547, BC548, 2N3904, or 2N2222 | €0.15 |
| 4 | **Resistor R1** *(Method A)* | 1 kΩ 1/4W resistor (Pull-up) | €0.05 |
| 5 | **Resistor R2** *(Method A)* | 10 kΩ 1/4W resistor (Base current limit) | €0.05 |
| 6 | **Heat-shrink Tubing** | 3mm and 6mm polyolefin sleeve | €0.20 |

**Tools Required:** Modular crimping tool, wire stripper, soldering iron, and digital multimeter.

---

## 6. Method A: Hardware Transistor Inverter Assembly

```
  SMART METER P1 PORT                               USB-UART BOARD (CH340 / FTDI)
  ===================                               =============================

  [ Pin 2: RTS ] ─────────────────────────────────────────── [ +5V VCC Pin ]
                                                      (Pulls RTS HIGH to stream)

  [ Pin 3: GND ] ─────────────────────────────────────────── [ GND Pin ]
                                                      (Signal Ground)

                                  +5V (from USB)
                                       │
                                      ┌┴┐
                                      │ │ R1 (1 kΩ Pull-up)
                                      └┬┘
                                       ├──────────── [ RXD Pin ] (Inverted TTL Input)
                                       │
                                     C │
  [ Pin 5: TXD ] ────[ 10 kΩ R2 ]────┤  BC547 (NPN Transistor)
                                     B ╲
                                       │ E
                                       │
  [ Pin 3/6: GND ] ────────────────────┴──────────── [ GND Pin ]
```

### Circuit Operation
1. When P1 Pin 5 is **Low (0V / Idle)**, the transistor is OFF. Resistor R1 pulls the USB adapter's RXD pin to **+5V (High)**, matching UART idle.
2. When P1 Pin 5 pulses **High (+5V / Bit 0)**, current turns the transistor ON, pulling the RXD pin to **0V (Ground)**.
3. Bits are cleanly inverted with sub-microsecond propagation delay.

---

## 7. Method B: Clean 3-Wire FTDI Software Inversion

When using an authentic **FTDI FT232RL** USB adapter, no resistors or transistors are needed.

### 3-Wire Wiring Diagram
```
  SMART METER P1 (RJ11 or RJ12)                     FTDI FT232RL USB ADAPTER
  =============================                     ========================

  [ Pin 2: RTS ] ─────────────────────────────────── [ +5V (VCC) ] (Pulls RTS High)

  [ Pin 3: GND ] ─────────────────────────────────── [ GND ]

  [ Pin 5: TXD ] ─────────────────────────────────── [ RXD ] (Direct connection)
```

### Flashing FTDI Inversion via Linux (60 Seconds)
```bash
# 1. Install ftdi-eeprom
sudo apt-get update && sudo apt-get install -y ftdi-eeprom

# 2. Create configuration file
cat << 'EOF' > ftdi_p1.conf
vendor_id=0x0403
product_id=0x6001
invert_rxd=true
EOF

# 3. Flash to FTDI chip EEPROM
sudo ftdi_eeprom --flash-eeprom ftdi_p1.conf

# 4. Unplug and replug the USB cable
```

*(On Windows, use FTDI's free **FT_Prog** utility: Scan &rarr; Hardware Specific &rarr; Invert RS232 Signals &rarr; Check "Invert RXD" &rarr; Program).*

---

## 8. Step-by-Step Cable Assembly & Multimeter Verification

1. **Strip Cable:** Strip 25 mm of outer jacket and 4 mm of each conductor.
2. **Crimp Connector:** With the plastic clip facing down and contacts facing up:
   - RJ12 (6P6C): Pin 1 (Left, optional 5V) &bull; Pin 2 (RTS) &bull; Pin 3 (GND) &bull; Pin 4 (NC) &bull; Pin 5 (TxD) &bull; Pin 6 (GND).
   - RJ11 (4-wire): Wire 1 &rarr; Pin 2 (RTS) &bull; Wire 2 &rarr; Pin 3 (GND) &bull; Wire 3 &rarr; Pin 4 (NC) &bull; Wire 4 &rarr; Pin 5 (TxD).
3. **Solder USB Adapter:** Connect RTS to +5V, GND to GND, and TxD via Method A or Method B.
4. **Mandatory Multimeter Safety Check:**
   - Set multimeter to **Continuity / Ohms (Ω)**.
   - Probe between **+5V and GND**: Confirm **NO short circuit** (resistance must be infinite / OL).
   - Probe between **TxD and GND**: Confirm no short circuit exists.

---

## 9. Activating the P1 Port with Your Grid Operator

In Belgium, the P1 port is electronically locked at installation for customer privacy.

### Fluvius Activation Steps (Flanders, Belgium)
1. Log in to [Mijn Fluvius](https://www.fluvius.be).
2. Go to **Meters & Aansluitingen** &rarr; Select your electricity meter (EAN code).
3. Find **"Poorten digitaal beheer (P1 en S1)"** &rarr; Click **"Activeer gebruikerspoorten"**.
4. Over-the-air cellular activation completes within 15 minutes to 72 hours.
5. **Meter Display Confirmation:**
   - **LOCKED:** Solid padlock icon (🔒) above "P1".
   - **ACTIVE:** Padlock icon disappears, replaced by a downward triangle (▼) above "P1".

*(In the Netherlands, smart meters under DSMR 4 and DSMR 5 are active by default).*

---

## 10. Linux Serial Verification

Plug the USB cable into your GEMS Raspberry Pi 5:

```bash
# 1. Verify USB detection
dmesg | grep -E "ttyUSB|FTDI|ch341"
# Output: usb 1-1.2: FTDI USB Serial Device converter now attached to ttyUSB0

# 2. Read live telegrams
stty -F /dev/ttyUSB0 115200 cs8 -cstopb -parenb
cat /dev/ttyUSB0
```

You should see clean ASCII telegrams streaming every second:
```
/FLU5\253769484_A

0-0:96.1.4(50217)
0-0:1.0.0(260912224500S)
1-0:1.8.1(004218.412*kWh)
1-0:1.8.2(003189.102*kWh)
1-0:1.7.0(01.850*kW)
1-0:2.7.0(00.000*kW)
1-0:1.6.0(260908183000S)(02.450*kW)
!5F2A
```

---

## 11. Configuring the Smart Meter in GEMS UI

1. Open your browser to `http://ems.local`.
2. Go to **Settings &rarr; Devices &rarr; + Add Device**.
3. Select the **Smart Meter** category card.
4. Choose template: **DSMR P1 RJ12 Serial Dongle (/dev/ttyUSB0)**.
5. Enter configuration parameters:
   - **Device Name:** `Grid Main Smart Meter`
   - **Serial Port:** `/dev/ttyUSB0` (or persistent path `/dev/serial/by-id/...`)
   - **Baud Rate:** `115200` (for Fluvius and DSMR 5) or `9600` (for DSMR 2/3/4)
   - **Poll Interval:** `1` second
6. Click **Add Device**. Telemetry immediately flows into the Dashboard!

---

## 12. Troubleshooting Guide

| Symptom | Probable Cause | Corrective Action |
| :--- | :--- | :--- |
| **Garbled characters or binary noise** | Signal inversion missing or wrong baud rate | Verify transistor inverter circuit or FTDI `invert_rxd=true`. Ensure baud rate is set to 115200. |
| **`cat /dev/ttyUSB0` prints nothing** | RTS Pin 2 is 0V, or P1 port locked | Verify Pin 2 has +5.0V with multimeter. Check meter LCD for padlock icon (request activation on Mijn Fluvius). |
| **"Permission denied" on `/dev/ttyUSB0`** | `gems` user lacks dialout group permissions | Run `sudo usermod -a -G dialout gems && sudo systemctl restart gems`. |
| **Device name shifts to `/dev/ttyUSB1`** | Port enumeration changed after reboot | Use `/dev/serial/by-id/<device-id>` instead of `/dev/ttyUSB0` in GEMS settings. |
