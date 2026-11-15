# GEMS: Enerlution Hybrid Inverters & LiFePO4 Battery Storage Commissioning & Wiring Manual

> 🌐 **Language / Taal / Langue:** **English** | [Nederlands](nl/enerlution_manual.md) | [Français](fr/enerlution_manual.md)

This comprehensive electrician and homeowner guide covers **both Enerlution storage architectures**—**51.2 V Low-Voltage Parallel (`LFPWall-5000`, `LFPWall-10K-V2`, `Roller-16K`)** and **150–600 V High-Voltage Stackable (`GroundHV-2500`, `GH02-5324` + PDU/BCU)**—including physical DC power wiring, CAN RJ45 pinouts, multi-pack DIP switch addressing, external RS-485 smart meter terminals (`CHINT DTSU666` / `DDSU666` / `Eastron SDM630`), exact **Enerlution App** commissioning parameters, and optimal **GRID-EMS (GEMS)** configuration.

> [!TIP]
> **Download Printable Field Manual (PDF):**
> - 📕 **[Enerlution Hybrid & Battery Storage Manual (PDF)](../manuals/gems-enerlution-manual.pdf)**
> - 💻 **[Interactive Enerlution Web Guide](../manuals/enerlution.html)**
> - 🛠️ **[GEMS Documentation Hub](../manuals/index.html)**

---

## 1. Enerlution LV vs. HV Ecosystem & Compatibility Matrix

Unlike single-architecture brands, **Enerlution** manufactures two distinct voltage classes. Confirm your battery model matches the exact voltage class of your hybrid inverter before wiring:

> [!CAUTION]
> **CRITICAL VOLTAGE SEPARATION GUARDRAIL — Never Cross-Wire LV (51.2V) & HV (150–600V)!**
> - **Architecture A — 51.2 V Low-Voltage (`LFPWall-5000`, `LFPWall-10K-V2`, `Roller-16K`):** Multi-pack arrays must be wired **strictly in 51.2 V parallel** (`P+` to `P+`, `P-` to `P-`). Connect *only* to 48V/51.2V Low-Voltage hybrid inverters (`Enerlution HY / L3–L6 LV`, or compatible 48V LV inverters such as `Solis -L`). **Never** connect LV wall or roller packs in series!
> - **Architecture B — High-Voltage Stackable (`GroundHV-2500`, `GH02-5324` + PDU/BCU):** Bricks stack **in series underneath a dedicated High-Voltage PDU / BCU Control Head** (`~153 V – 500+ Vdc`). Connect *only* to 3-phase High-Voltage hybrid inverters (`Enerlution HYTH-5K..12K` / `L5–L12 HV`). Keep the HV Manual Service Disconnect (MSD) and PDU breaker **OFF** and wear HV-insulated gloves during assembly!

### 1.1 Battery & Inverter Sizing Matrix

| Enerlution Battery Model | Voltage Class | Nominal Specs & Capacity | Max Charge / Discharge | Matching Inverter & External DC Protection |
| :--- | :--- | :--- | :--- | :--- |
| **`LFPWall-5000`** (Wall LiFePO4) | **51.2V LV Parallel** | `51.2 Vdc` • `102 Ah` • **`5.22 kWh`** | `40 A` Chg / `75 A` Dis | `Enerlution HY / L3–L6 LV` • `25 mm²` • **125 A** 2P DC MCCB |
| **`LFPWall-10K-V2`** (High-Cap Wall) | **51.2V LV Parallel** | `51.2 Vdc` • `204 Ah` • **`10.44 kWh`** | `90 A` Chg / `140 A` Dis | `Enerlution HY / L3–L6 LV` • `35 mm²` • **160–200 A** 2P DC MCCB |
| **`Roller-16K`** (Mobile Floor Pack) | **51.2V LV Parallel** | `51.2 Vdc` • `314 Ah` • **`16.08 kWh`** | `0.5 C` (~`150 A` / 7.6 kW) | `Enerlution HY / L5–L6 LV` • `35–50 mm²` • **200 A** 2P DC MCCB |
| **`GroundHV-2500 + PDU`** (HV Tower) | **HV Series Stack** | `51.2 V / 2.5 kWh` per brick • **`7.5–20+ kWh`** (3–8 bricks) | `~25–50 A` HV DC (`5–12 kW`) | `Enerlution HYTH-5K..12K` (3P HV) • `6–10 mm²` (1000V) via PDU Breaker |
| **`GH02-5324 + BCU`** (Large HV Tower) | **HV Series Stack** | Modular HV Stack • **`15.0–42.0 kWh`** | `~50 A` HV DC (`10–15+ kW`) | `Enerlution HYTH-8K..12K` (3P HV) • `6–10 mm²` (1000V) via BCU Breaker |

---

## 2. Step-by-Step Battery & Smart Meter Wiring Manual

Perform all power, grounding, DIP-switch, CAN, and RS-485 smart meter wiring with the AC Grid breaker, PV DC isolator, external DC MCCB / HV PDU breaker, and all battery power switches strictly **OFF**.

### 2.1 Architecture A — Wiring 51.2V LV Parallel Packs (`LFPWall` & `Roller`)

1. **External Non-Polarized 2-Pole DC MCCB:** Install a non-polarized 2-pole DC MCCB or `gBat` DC fuse disconnector (`≥ 80 Vdc`; `100–125 A` for `LFPWall-5000`, `160–200 A` for `LFPWall-10K-V2` or `Roller-16K`) between the battery bank and the inverter `BAT+ / BAT-` lugs. Never use polarized AC breakers on bidirectional DC battery lines.
2. **2 to 3 Parallel Packs — Diagonal (Cross-Takeoff) Balancing Rule:** Link `P+` to `P+` and `P-` to `P-` across packs with identical-length cables. Connect the main inverter **`BAT+`** lead to **Pack 1 (Master) `P+`**, and connect the main inverter **`BAT-`** lead diagonally to the **LAST Pack's `P-`** so loop impedance is equalized across all packs.
3. **4+ Parallel Packs — Copper DC Busbar Rule:** Run identical-length `25–35 mm²` fused branch leads from each battery to rated `250–400 A` tin-plated copper DC busbars, then run `35–50 mm²` main cables through the DC MCCB to the inverter.
4. **Protective Earth (`⏚ PE`):** Bond every battery chassis `⏚` M6 ground stud to the inverter PE bar using `≥ 6 mm²` green/yellow copper wire.

### 2.2 Architecture B — Wiring High-Voltage Towers (`GroundHV-2500` / `GH02-5324` + PDU/BCU)

1. **Stacking & Anti-Tip Anchoring:** Level the steel base plinth against a load-bearing wall. Stack the HV battery modules vertically (minimum `3–4 × GroundHV-2500` bricks = `~153–204 Vdc` to exceed `HYTH` start voltage), fasten the side locking brackets between every tier, and seat the **PDU / BCU High-Voltage Control Head** on top.
2. **HV DC Plugs & Interlock:** Confirm the PDU HV breaker is **OFF** and any orange **Manual Service Disconnect (MSD)** plug is removed. Route double-insulated `6–10 mm²` (`1000 Vdc`) HV leads from PDU `HV+ / HV-` touch-safe sockets into the `HYTH` inverter `BAT+ / BAT-` terminals until locking collars click, and bond base + PDU `⏚ PE` studs to the inverter earth bar.

### 2.3 BMS CAN RJ45 Pinout & Parallel DIP Switch Addressing

Closed-loop BMS communication (`SOC %`, `SOH %`, pack voltage, cell temperature derating, and dynamic current limits) runs over **CAN bus** from the **Master Battery / PDU `CAN` port** to the Enerlution inverter **`BMS / CAN` port**:

| RJ45 Pin | Standard T568B Color | Enerlution Master / PDU `CAN` Port | Inverter `BMS / CAN` Port | Role |
| :---: | :--- | :--- | :--- | :--- |
| **Pins 1 & 2** | W-Orange / Orange | RS485-B / RS485-A (Optional) | RS485-B / RS485-A | Unused in CAN mode |
| **Pins 3 & 6** | W-Green / Green | Signal `GND` | Signal `GND` | Reference Ground |
| **Pin 4** | **Solid Blue** | **`CAN-H` (CAN High)** | **`CAN-H` (CAN High)** | **Mandatory CAN-H** |
| **Pin 5** | **White / Blue** | **`CAN-L` (CAN Low)** | **`CAN-L` (CAN Low)** | **Mandatory CAN-L** |
| **Pins 7 & 8** | W-Brown / Brown | Reserved / Shield GND | Reserved / Shield GND | Follow factory cable label |

- **Parallel LV Inter-Pack Link & Cold DIP Switches:**
  - Daisy-chain CAT5e/CAT6 link cords from **Master Pack 1 `Link Out / RS485-B`** → **Slave Pack 2 `Link In / RS485-A`** → **Slave Pack 3 `Link In`**. Leave `CAN` disconnected on all Slave packs.
  - Set binary `ADD` DIP switches strictly while powered **OFF**: standalone pack = `0000` (or `Address 1` per enclosed BMS sheet); multi-pack array = **Master Pack 1: `ON OFF OFF OFF` (Addr 1)**, **Slave Pack 2: `OFF ON OFF OFF` (Addr 2)**, **Slave Pack 3: `ON ON OFF OFF` (Addr 3)**, **Slave Pack 4: `OFF OFF ON OFF` (Addr 4)**.
  - *Cross-Brand LV Pairing Note:* If pairing a 51.2V Enerlution `LFPWall` / `Roller` pack with a compatible 48V LV inverter such as **Solis (`-L`)**, verify the BMS CAN protocol is set to `Pylon / Solis CAN` over Pins 4 & 5 and onboard the inverter in GEMS using the Solis template.

### 2.4 External RS-485 Smart Meter Terminals (`9600 bps, 8N1`, Address `1`)

| Smart Meter Model | Meter `RS485-A (+)` | Meter `RS485-B (-)` | Meter Bus Config |
| :--- | :--- | :--- | :--- |
| **`CHINT DTSU666`** (3-Phase) | Terminal **`24`** | Terminal **`25`** | Address `1` • `9600 8N1` |
| **`CHINT DDSU666`** (1-Phase) | Terminal **`5`** | Terminal **`6`** | Address `1` • `9600 8N1` |
| **`Eastron SDM630-Modbus V2`** | Terminal **`A / 485A`** | Terminal **`B / 485B`** | Address `1` • `9600 8N1` |

Clamp all CTs immediately after the utility meter (upstream of all house loads, EV wallboxes, and solar/storage breakers) with arrows pointing **Grid → Home/Load**.

### 2.5 Mandatory Soft-Start Power-Up & Shutdown Sequence

1. **Power-Up:** Verify cold DC polarity with a voltmeter → Close LV 2-pole DC MCCB (or insert HV MSD plug & close PDU HV breaker) while BMS is asleep → Hold Master/PDU **`POWER / SW` button (`2–3s`)** so internal pre-charge resistors gently energize the inverter DC bus (`RUN` green, `ALM` off) → Turn **ON** PV DC isolator → Turn **ON** AC Grid breaker.
2. **Shutdown (Reverse):** AC Grid Breaker **OFF** → PV DC Switch **OFF** → Hold Master/PDU `POWER` 3s to sleep BMS → Open DC MCCB / PDU Breaker **OFF** (wait 5 minutes before touching HV terminals).

---

## 3. Required Commissioning Settings in the Enerlution App

Connect locally via Bluetooth or the Enerlution Wi-Fi/LAN communication stick (temporarily turn Mobile Data OFF if joining the stick's local Wi-Fi AP), sign in as **Installer**, bind the logger to wired Ethernet LAN or 2.4 GHz Wi-Fi with a **router DHCP reservation**, and apply:

| Enerlution App Parameter | Required Setting | Technical Reason |
| :--- | :--- | :--- |
| **Battery Type & Protocol** | **`Lithium-Ion (CAN)`** *(Enerlution / Pylon Profile)* | Enables closed-loop BMS telemetry (`SOC %`, `SOH %`, pack V/I & thermal limits). Verify Battery State reads `1–5` (`Standby / Charging / Discharging`), never `7 Offline`. |
| **EMS Working Mode** | **`Self-Consumption`** | Instructs the inverter to autonomously store excess PV in the battery and discharge seamlessly to cover household loads and evening peaks. |
| **Minimum / Reserve SOC** | **`10 %`** *(`15–20%` with EPS Backup)* | Protects LiFePO4 cell life (90% DoD) while reserving blackout capacity on `EPS / Backup`. Keep **Max Charge SOC = 100%**. |
| **External Smart Meter** | **`Enable` → `CHINT DTSU666` or `SDM630`** | Enables sub-second behind-the-meter tracking (`Address 1`, `9600 8N1`) and exposes live grid meter power (`30110`) to GEMS. |
| **Active Power / Export Control** | **`Disabled / Unlimited (0)`** | **Crucial!** Leaves normal solar export & Green Certificates uncapped while letting GEMS dynamically write **1-Watt precision curtailment limits** (`40400` / `40441`) during negative spot hours! |
| **Modbus TCP & RS-485** | **Port `502` • Slave ID `1` • `9600 8N1`** | Matches GEMS's `enerlution_inverter` driver defaults over wired LAN/Wi-Fi (`:502`) or direct USB-RS485. |

---

## 4. Onboarding & Optimizing Enerlution in GEMS

1. **Onboard Utility P1 Meter First:** Add your digital utility meter (`p1_serial`) under **Settings → Devices** (with **Certified Installer Mode** 🔒 unlocked) for billing-grade 3-phase currents and quarter-hour Flanders capacity tracking.
2. **Auto-Discover or Add `enerlution_inverter`:**
   - GEMS auto-detects Enerlution MAC OUIs (`70:B3:D5` and `E4:5F:01`) and ASCII identification registers (`30010–30033`) in **Scanner → Scan Subnet**, or add manually via **Settings → Devices → + Add Device → Inverter / Solar → `Enerlution Hybrid Inverter`** (`enerlution_inverter`).
   - Configure **Endpoint** (reserved static IPv4 on `Port = 502` or `/dev/serial/by-id/...` at `9600 8N1`), **`Modbus ID = 1`**, exact AC nameplate **`Rated Power (kW)`** (`3.6`..`12.0`), **`Allow Curtailment = Checked`**, **`Poll Interval = 3s`** (LAN/RS-485) or **`5s`** (Wi-Fi), exact **`Phase Wiring`**, **`Grid Meter Connected?`** (`Checked` if DTSU/SDM wired), and **`Battery Connected? = Checked`** with exact total **`Battery Capacity (kWh)`**.
3. **Regional Strategy & Raedian EV Wallbox Coordination (`Settings → Strategy`):**
   - **Flanders (`Flanders Mode`):** Set `Capacity Peak Limit = 2.5 kW` (or historical peak), `Buffer = 200 W`, and configure any **Green Certificate (GSC)** value (`€/MWh`) so solar exports continue down to `-GSC/1000 €/kWh`. Enerlution's `Self-Consumption` loop shaves household peaks with battery discharge while GEMS throttles EV charging before any 15-minute peak limit is exceeded.
   - **Netherlands (`Netherlands Mode`):** Enable `Active Inverter Curtailment` (`0.00 €/kWh`). Daytime PV fills the Enerlution battery first, then feeds **Raedian** EV charging (`6A–32A`) and thermal relays, and once storage reaches 100% during negative spot prices GEMS regulates Enerlution output in **1-Watt steps** so grid export drops cleanly to `0 W`.
   - **Raedian EV Surplus Harmony:** Keep **Raedian NEO / NEX / Gemini** chargers in `PV Only (Solar)` or `Eco`. Because Enerlution absorbs initial solar surplus into the battery behind the meter, GEMS automatically waits until excess export exceeds your EV start threshold before starting EV charging—eliminating battery-to-EV seesawing.

---

## 5. Quick Troubleshooting Matrix

| Symptom | Probable Cause | Field Resolution |
| :--- | :--- | :--- |
| **Battery State reads `Offline (7)` or `Fault (6)`** | CAN cable in `Link/RS485` port, wrong BMS protocol, or DIP switches changed while ON | Power all modules OFF, set binary `ADD` DIP switches, connect RJ45 (`Pin 4 CAN-H`, `Pin 5 CAN-L`) from Master/PDU `CAN` to Inverter `BMS`, and select `Lithium-Ion (CAN)` in the Enerlution App. |
| **HV `HYTH` inverter does not detect `GroundHV-2500`** | Too few series HV blocks, MSD plug open, or PDU HV breaker OFF | Install minimum series HV blocks (`≥ 3–4`), lock orange MSD plug, close PDU HV breaker, then hold PDU `POWER` 2–3s. |
| **PV output capped during positive spot prices** | Static Zero-Export left enabled in Enerlution App or wrong `Rated Power (kW)` in GEMS | Set `Active Power / Export Control = Disabled / Unlimited` in the Enerlution App and verify exact AC nameplate kW on the GEMS device card. |
| **Battery charges from AC when house load turns ON** | `DTSU666` / `SDM630` CTs reversed or phase/RS-485 wires swapped | Point CT arrows **Grid → Home/Load** and verify `DTSU666` Pins `24 (A+)` & `25 (B-)`. |
