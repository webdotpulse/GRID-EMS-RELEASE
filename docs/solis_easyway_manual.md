# GEMS: Solis Retrofit / Hybrid Inverters & Easyway 5200 (`UNIV5200`) Battery Commissioning & Wiring Manual

> 🌐 **Language / Taal / Langue:** **English** | [Nederlands](nl/solis_easyway_manual.md) | [Français](fr/solis_easyway_manual.md)

This comprehensive electrician and homeowner guide covers **physical DC power, parallel diagonal/busbar balancing, CAN RJ45 pinouts, and `ADD` DIP-switch wiring** between the **Easyway 5200 Energy Storage Battery (`UNIV5200`, 51.2V 102Ah LiFePO4)** and **Solis Low-Voltage Retrofit / Hybrid Inverters**, **Eastron `SDM72D-M` & `SDM630-M` smart meter wiring and configuration**, exact **SolisCloud App** commissioning settings, and best-practice optimization inside **GRID-EMS (GEMS)**.

> [!TIP]
> **Download Printable Field Manual (PDF):**
> - 📕 **[Solis Retrofit / Hybrid & Easyway UNIV5200 Manual (PDF)](../manuals/gems-solis-easyway-manual.pdf)**
> - 💻 **[Interactive Solis & Easyway Web Guide](../manuals/solis.html)**
> - 🛠️ **[GEMS Documentation Hub](../manuals/index.html)**

---

## 1. Voltage Guardrails, Compatible Solis Inverters & Pack Sizing

The **Easyway 5200 (`UNIV5200`)** is a **51.2 V nominal (48V class) Low-Voltage LiFePO4** battery pack (`102 Ah`, `5.22 kWh` total / `~4.70 kWh` usable at 90% DoD, `44.8–57.6 Vdc`, `IP20` indoor passive cooling, expandable up to **16 parallel packs = 83.52 kWh**).

> [!CAUTION]
> **CRITICAL VOLTAGE COMPATIBILITY GUARDRAIL:**
> - **NEVER wire Easyway `UNIV5200` packs in series!** Multi-pack arrays (2 to 16 modules) must be connected **strictly in 51.2 V parallel** (`P+` to `P+`, `P-` to `P-`).
> - **NEVER connect `UNIV5200` batteries to High-Voltage (`-H`) Solis inverters** (such as `S6-EH3P(5-20)K-H` or `RHI-3P-HVES`, which expect `160–600 Vdc`). Always confirm the **`-L`** or **`48ES / 48V`** low-voltage suffix on the Solis rating plate!

### 1.1 Compatible Solis LV Models, Pack Sizing & Breaker Table

Each `UNIV5200` pack recommends **`50 A` continuous charge/discharge (~`2.56 kW` per module)** and up to `100 A` max. Pairing a single `UNIV5200` pack with a 5 kW+ Solis inverter causes the BMS to safely limit continuous charge/discharge around ~2.56 kW. Installing **2+ parallel packs (`10.44 kWh+`, `100 A+`)** unlocks full 5 kW+ continuous peak shaving and spot charging:

| Solis LV Inverter Series | Architecture & GEMS Template | Max Battery Amps | Recommended `UNIV5200` Stack | Main DC Cable & External DC MCCB |
| :--- | :--- | :--- | :--- | :--- |
| **`Solis RAI-3K-48ES-5G`** (3.0 kW 1P) | AC-Coupled Retrofit (`solis_retrofit`) | `60 A` (~3.0 kW) | **1 – 3× `UNIV5200`** (`5.22 – 15.66 kWh`) | `25 mm²` copper • **100 A** DC MCCB |
| **`Solis S6-EA1P(3.6–6)K-L`** (1P) | AC-Coupled Retrofit (`solis_retrofit`) | `75 A – 125 A` | **2 – 4× `UNIV5200`** (`10.44 – 20.88 kWh`) | `35 mm²` copper • **125 A – 160 A** DC MCCB |
| **`Solis S5-EH1P(3–6)K-L`** (1P) | PV + Storage Hybrid (`solis_hybrid`) | `62.5 A – 100 A` | **2 – 4× `UNIV5200`** *(1× caps at ~2.56 kW)* | `25 – 35 mm²` copper • **125 A** DC MCCB |
| **`Solis S6-EH1P(3–8)K-L-PLUS / PRO`** | PV + Storage Hybrid (`solis_hybrid`) | `70 A – 190 A` | **2 – 6× `UNIV5200`** *(≥3× for 8 kW cont.)* | `35 – 50 mm²` copper • **160 A – 250 A** DC MCCB |
| **`Solis S6-EH3P(5–10)K-L` / `NV-YD-L`** | 3-Phase LV Hybrid (`solis_hybrid`) | `120 A – 290 A` | **3 – 8× `UNIV5200`** *(via Copper DC Busbar)* | `50 – 70 mm²` copper • **200 A – 300 A** DC MCCB |

---

## 2. Step-by-Step Wiring Guide: Easyway `UNIV5200` to Solis Inverter

Perform all power, grounding, DIP-switch, and communication wiring with the Solis AC breaker, PV DC isolator, external DC MCCB, and all `UNIV5200` pack switches strictly **OFF**.

### 2.1 DC Power, External DC Breaker & Parallel Balance Rules

1. **External Non-Polarized 2-Pole DC MCCB / Fuse Isolator:**
   - Install a dedicated **non-polarized 2-pole DC MCCB or NH00 `gBat` DC fuse switch-disconnector** (rated `≥ 80 Vdc`, `100 A – 300 A` per Section 1.1) between the battery array and the Solis `BAT+` / `BAT-` lugs. Never use polarized AC circuit breakers on bidirectional battery circuits.
2. **Single Pack (`1× UNIV5200` — 5.22 kWh):**
   - Run equal-length `25 mm²` or `35 mm²` fine-stranded flexible copper cables from `P+` (Red) and `P-` (Black) through the 2-pole DC MCCB to Solis `BAT+` and `BAT-`.
3. **2 to 3 Parallel Packs — Diagonal (Cross-Takeoff) Balancing Method:**
   - Interconnect `P+` to `P+` and `P-` to `P-` across packs using identical-length jumper cables.
   - Connect the main **`BAT+`** lead heading to the Solis inverter onto **Pack 1 (Master) `P+`**, and connect the main **`BAT-`** lead heading to the Solis inverter onto the **LAST Pack's `P-`** (Pack 2 or Pack 3). Diagonal takeoff equalizes loop impedance across every module so Pack 1 does not take disproportionate current or age prematurely.
4. **4 to 16 Parallel Packs — Tin-Plated Copper DC Busbar Method (Mandatory > 3 Packs):**
   - Install rated **Positive and Negative Copper DC Busbars** (`250 A – 400 A`). Run identical-length `25 mm²` fused branch cables from each individual `UNIV5200` (`P+` and `P-`) to the busbars, then run `35 mm² – 70 mm²` main cables through the main DC MCCB into the Solis inverter.
5. **Terminal Engagement & Protective Earth (`⏚ PE`):**
   - Seat **Amphenol SurLok Plus** connectors until the safety latch clicks, or torque `M6 / M8` hydraulic hex lugs to `5–8 Nm` cleanly against metal contact pads.
   - Bond every `UNIV5200` chassis ground terminal (`⏚`) and rack frame to the Solis PE bar using `≥ 6 mm²` green/yellow copper earth wire.

### 2.2 BMS CAN RJ45 Cable Pinout (Master Pack 1 `CAN` ↔ Solis `BMS` Port)

Closed-loop communication between Pack 1 (Master) and the Solis inverter uses **500 kbps CAN bus** over shielded CAT5e/CAT6 cable:

| RJ45 Pin | Standard T568B Color | Solis `BMS / CAN` Port | Easyway `UNIV5200` `CAN` Port | Recommended Wiring |
| :---: | :--- | :--- | :--- | :--- |
| **Pins 1 – 3** | W-Orange / Orange / W-Green | NC / Enable GND / RS485-B | Reserved / Internal Bus | **Leave Open / Disconnected** |
| **Pin 4** | **Solid Blue** | **`CAN-H` (CAN High)** | **`CAN-H` (CAN High)** | **Connect Pin 4 ↔ Pin 4** |
| **Pin 5** | **White / Blue** | **`CAN-L` (CAN Low)** | **`CAN-L` (CAN Low)** | **Connect Pin 5 ↔ Pin 5** |
| **Pins 6 – 8** | Green / W-Brown / Brown | RS485-A / **Pin 7: +12V Enable** | Reserved / Internal Bus | **Leave Open / Disconnected** |

> [!IMPORTANT]
> **Isolate Pins 4 & 5 on Custom CAN Patch Cables:** Solis outputs `+12V Enable` on **Pin 7** and RS-485 signals on **Pins 3 & 6** of its `BMS` socket. Using the supplied inverter CAN lead—or custom-crimping a shielded RJ45 cable with **only Pin 4 (`CAN-H`) and Pin 5 (`CAN-L`)** connected—prevents `+12V` from back-feeding into reserved BMS pins on the battery. *(Always cross-check the enclosed `UNIV5200` hardware sheet for your batch).*

### 2.3 Parallel Inter-Pack Link Wiring & Binary `ADD` DIP Switch Table

- **Inter-Pack Link Cables:** Daisy-chain standard straight-through CAT5e/CAT6 patch cables from **Pack 1 (Master) `RS485-B / Link Out`** → **Pack 2 (Slave 1) `RS485-A / Link In`**, Pack 2 Out → Pack 3 In, and so on. Leave the `CAN` port empty on all Slave packs—**only Pack 1 (Master) connects to the Solis inverter**.
- **Binary `ADD` DIP Switches (Set Strictly While Powered OFF):** Read left-to-right (`SW1`..`SW4`, where `ON = 1`, `OFF = 0`; on 6-pole DIP blocks leave `SW5` & `SW6` `OFF` unless the leaflet specifies end-of-line termination):

| `UNIV5200` Pack Role | SW 1 | SW 2 | SW 3 | SW 4 | Binary Code | Connection Role |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Single Pack or Master (Pack 1)** | `OFF` | `OFF` | `OFF` | `OFF` | **`0000`** | `CAN` to Solis `BMS` + `Link Out` to Pack 2 |
| **Slave 1 (Pack 2 — 10.44 kWh)** | **`ON`** | `OFF` | `OFF` | `OFF` | `1000` | `Link In` from Pack 1, `Link Out` to Pack 3 |
| **Slave 2 (Pack 3 — 15.66 kWh)** | `OFF` | **`ON`** | `OFF` | `OFF` | `0100` | `Link In` from Pack 2, `Link Out` to Pack 4 |
| **Slave 3 (Pack 4 — 20.88 kWh)** | **`ON`** | **`ON`** | `OFF` | `OFF` | `1100` | `Link In` from Pack 3, `Link Out` to Pack 5 |
| **Slave 4 (Pack 5 — 26.10 kWh)** | `OFF` | `OFF` | **`ON`** | `OFF` | `0010` | Parallel via Copper DC Busbar |
| **Slave 5 (Pack 6 — 31.32 kWh)** | **`ON`** | `OFF` | **`ON`** | `OFF` | `1010` | Parallel via Copper DC Busbar |
| **Slaves 6 – 15 (Packs 7 – 16)** | \multicolumn{4}{c}{Continue binary sequence: `0110`, `1110`, `0001` … `1111`} | `0110..1111` | Up to 83.52 kWh total |

### 2.4 Mandatory Soft-Start Power-Up & Shutdown Sequence

1. **Power-Up:**
   - Verify cold DC polarity with a multimeter (all switches OFF).
   - Switch individual `UNIV5200` pack breakers **ON** and close the external **2-pole DC MCCB** while BMS LEDs are still asleep.
   - Hold **Pack 1 (Master) `SW / POWER` button for `2–3 seconds`** so the internal BMS pre-charge resistor gently charges the Solis DC bus capacitors (`RUN` green LED lit, `ALM` red LED off; Slave packs wake automatically).
   - Turn **ON** the Solis PV DC isolator (Hybrid models), then turn **ON** the Solis AC Grid breaker.
2. **Shutdown (Reverse Order):** AC Grid Breaker **OFF** → PV DC Switch **OFF** → Hold Master `SW` button 3s until all packs power down → Open External DC MCCB **OFF**.

---

## 3. Connecting & Configuring an Eastron `SDM72D-M` or `SDM630-M` Smart Meter

Eastron's 4-DIN-module 3-phase bidirectional Modbus RTU meters—**`SDM72D-M`** (and updated **`SDM72D-M-2`**, direct-connected up to `80 A / 100 A`) and **`SDM630-M`** (**`SDM630-Modbus V2/V3`** `80 A / 100 A` direct-connected or **`SDM630MCT`** CT-operated)—share Eastron's IEEE-754 `Float32` register map (`0x0000–0x004A`) and work seamlessly with both Solis inverters and GEMS.

### 3.1 Model Selection & 3-Phase Property Rule

- **`Eastron SDM630-M` (`SDM630-Modbus V2 / V3`):** Direct-connected up to `80 A / 100 A`. Supports **`3P4W` (`3×400V+N`)**, Belgian **`3P3W` (`3×230V` Delta without Neutral)**, and **`1P2W` (`1×230V`)**. Officially mapped in Solis (`Eastron 3P` / `SDM630`) and GEMS (`eastron_sdm630`).
- **`Eastron SDM72D-M-2` (and `SDM72D-M`):** Direct-connected up to `80 A / 100 A`. **`SDM72D-M-2` (V2)** exposes full per-phase `V / I / W` registers identical to `SDM630-M` and supports `3P4W` / `3P3W`. *(Note: Legacy V1 `SDM72D-M` requires Neutral `3P4W` and may omit per-phase V/I registers—prefer `SDM72D-M-2` or `SDM630-M` for Solis `Meter` port connection and 3-phase EV Dynamic Load Balancing).*
- **`Eastron SDM630MCT`:** External CT variant (`100A–600A / 5A` or `mV`) for feeders `> 100 A` or tight retrofit panels where main utility tails cannot be broken.
- **1-Phase Solis on a 3-Phase Supply:** Even with a 1-phase Solis inverter (`RAI-3K-48ES-5G`, `S6-EA1P-L`, `S5-EH1P-L`, `S6-EH1P-L`) in a 3-phase home, always install a **3-phase `SDM630-M` or `SDM72D-M-2`** at the grid entry so net import/export is summed across `L1 + L2 + L3`.

### 3.2 Two Supported RS-485 Topologies (Single-Master Bus Rule!)

> [!CAUTION]
> **NEVER connect two Modbus RTU masters to the same meter simultaneously!** Never wire both the Solis `Meter` port AND a GEMS USB-RS485 adapter onto the same `A+ / B-` terminals of one `SDM72D-M` or `SDM630-M`—bus collisions will trigger `Meter_Comm_FAIL`. Choose **Topology 1** or **Topology 2**:

- **Topology 1 (Recommended Standard — Wired to Solis `Meter` RJ45 Port):** Wire the `SDM72D-M` / `SDM630-M` into the Solis `Meter` port. Solis achieves sub-second hardware `Self-Use` tracking and forwards live grid watts (`33130–33131`) and 3-phase currents/voltages (`33251–33262`) to GEMS when `Grid Meter Connected? = Checked`. *(You can still plug a utility USB P1 cable into GEMS alongside this setup).*
- **Topology 2 (Direct to GEMS — Sites Without a Utility P1 Port):** Wire a dedicated `SDM72D-M` / `SDM630-M` directly to GEMS via **USB-to-RS485** (`/dev/serial/by-id/...`) or an **RS-485 Ethernet Gateway** (`Port 502`) using GEMS template `eastron_sdm72_x96` or `eastron_sdm630`. *(Multi-Drop Option: Daisy-chain the GEMS-bound meter at **Modbus ID `2`** on the same GEMS USB-RS485 cable as Solis Option A at **Modbus ID `1`**, `9600 8N1`).*

### 3.3 How to Connect: Main AC Power, CT & RS-485 Pinouts

1. **Switchboard Placement (Critical for AC-Coupled Retrofit & Hybrid):** Mount the meter **immediately after the DSO utility meter / main RCD**, strictly **upstream** of all house breakers, heat pumps, **Raedian** EV chargers, existing rooftop PV string inverters, and the Solis AC breaker so all solar export flows through the meter.
2. **Direct-Connected Main AC Terminals (`SDM72D-M` / `SDM72D-M-2` & `SDM630-M`, up to 100 A):**
   - **Top Cage Terminals (Grid Supply IN):** `1 = L1 IN`, `2 = L2 IN`, `3 = L3 IN`, `4 = N IN`
   - **Bottom Cage Terminals (House / PV / Solis / EV Load OUT):** `5 = L1 OUT`, `6 = L2 OUT`, `7 = L3 OUT`, `8 = N OUT`
   - *Wiring Notes:* Torque `10–25 mm²` copper ferrules to `2.5–3.0 Nm`. Leave `4 & 8` open on Belgian `3×230V` Delta (`3P3W`) with `SDM630-M` / `SDM72D-M-2`. **Never swap Top (IN) and Bottom (OUT)** or import/export signs will invert!
3. **CT-Connected `SDM630MCT` Terminals:** Protect voltage taps (`0.5A–2A` fuses) to `V1/V2/V3/VN` (`Terminals 4, 3, 2, 1`) and connect `CT1 (20/19 S1/S2)`, `CT2 (18/17)`, `CT3 (16/15)` matching `L1 / L2 / L3` phase-for-phase with CT arrows strictly aligned.
4. **RS-485 Communication Pinout (Shielded Twisted Pair `CAT5e/CAT6` or `LiYCY`):**

| RS-485 Signal | Eastron `SDM72D-M` / `SDM630-M` Terminal | Topology 1: Solis `Meter` RJ45 (T568B) | Topology 2: GEMS USB-RS485 / Gateway |
| :--- | :--- | :--- | :--- |
| **`RS485-A (+)`** | **`A` / `A+` / `485A`** *(Pin `10` on SDM630-V2 Direct; Pin `14` on SDM630MCT; marked `A` on SDM72D-M)* | **RJ45 Pin 1 (`White/Orange`)** *(or `MTR485A`)* | Adapter **`A+` / `D+` / `T/R+`** |
| **`RS485-B (-)`** | **`B` / `B-` / `485B`** *(Pin `9` on SDM630-V2 Direct; Pin `13` on SDM630MCT; marked `B` on SDM72D-M)* | **RJ45 Pin 2 (`Solid Orange`)** *(or `MTR485B`)* | Adapter **`B-` / `D-` / `T/R-`** |
| **Shield / GND** | **`G` / `GND`** *(Ignore `+ / -` SO Pulse terminals!)* | **Leave RJ45 Pins 3 – 8 Open** | Adapter **`GND`** (`120 Ω` if > 30 m) |

### 3.4 How to Configure: Meter LCD Menu, SolisCloud App & GEMS

1. **Step 1 — Configure the `SDM72D-M` / `SDM630-M` Front-Panel LCD (Default Password: `1000`):**
   - **Unlock `SDM630-M`:** Hold **`E`** for `3s` until `PASS` (`0000`) appears → use `U / P` to enter **`1000`** (`E` advances digits, hold `E` 3s to confirm).
   - **Unlock `SDM72D-M` / `SDM72D-M-2`:** Long-press the front button `~3s` until password prompt → short-press to increment digit / long-press to advance to enter **`1000`**, then long-press to enter Setup.
   - **Set Required Parameters:**
     - **Modbus Address (`Addr` / `Add`):** **`001`** *(or `002` ONLY if daisy-chained on a shared GEMS USB-RS485 bus alongside Solis ID `1`)*.
     - **Baud Rate (`bAud` / `baud`):** **`9600`** (`9.6k`).
     - **Parity (`PrtY` / `Par`):** **`nO` / `none`** (`8N1` — verify it is NOT `Even`!).
     - **System Mode (`SYS` on `SDM630-M` / `SDM72D-M-2`):** **`3P4`** (`3×400V+N`), **`3P3`** (Belgian `3×230V` Delta without N), or **`1P2`** (`1×230V`).
     - **CT Ratio (`Ct` on `SDM630MCT` only):** Match installed CTs (`100A/5A = 20`, `200A/5A = 40`).
   - Hold **`E`** (or wait 10s idle on `SDM72D-M`) to return to live `kW` display and verify the **telephone handset (`📞`) icon** appears once RS-485 polling begins!
2. **Step 2 — Configure SolisCloud App (Topology 1 — Wired to Solis `Meter` Port):**
   - Connect via Bluetooth (**Me → More Tools → Local Operation**) as **Installer**, open **`Advanced Settings → Storage Energy Set → Meter Set`**, and set:
     - **Meter Type:** **`Eastron 3P`** (or **`SDM630`** — works for both `SDM630-M` and `SDM72D-M` / `SDM72D-M-2`!).
     - **Meter Placement:** **`Meter in Grid`**.
   - Check **`Information → Meter Info`** to confirm zero `Meter_Comm_FAIL` alarms and proper positive import polarity under a ~2 kW kettle test.
3. **Step 3 — Configure in GEMS (`Settings → Devices`):**
   - **Topology 1 (Wired to Solis `Meter` Port):** Check **`Grid Meter Connected? = Checked`** on your Solis Hybrid or Solis Retrofit device card in GEMS (do *not* add a separate Eastron device card).
   - **Topology 2 (Wired Directly to GEMS):** Add a **Smart Meter** (or run **Auto-Discover Serial / RS-485 Ports**) selecting **`Eastron SDM72D / SMART X96 3-Phase Meter`** (`eastron_sdm72_x96`) or **`Eastron SDM630 3-Phase Meter`** (`eastron_sdm630`), persistent `/dev/serial/by-id/...` (`9600 None`) or TCP `:502`, `Modbus ID = 1` (or `2` on shared bus), `Poll Interval = 2s`, and `Phase Wiring = L1-L2-L3`.

---

## 4. Connecting Solis to GEMS (RS-485 vs. `S2-WL-ST` LAN Stick)

- **Option A (Gold Standard — Direct USB-to-RS485 or Industrial RS-485 Ethernet Gateway):**
  - Connect shielded twisted pair (`9600 bps, 8N1`, Slave ID `1`) to the Solis S6 dedicated internal `RS485 / Modbus` port so your external SolisCloud stick remains undisturbed.
  - On 4-pin circular `COM` ports (`S5` / `RAI` or via RS-485 splitter): **Pin 3 (Yellow) = `RS485A (+)`**, **Pin 4 (Blue) = `RS485B (-)`**, optional **Pin 2 (Black) = `GND`**. **NEVER connect Pin 1 (`+5V` Red)** to a USB-RS485 adapter!
  - Delivers rock-solid `2–3s` local closed-loop control with zero Wi-Fi latency.
- **Option B (`S2-WL-ST` Dual Wi-Fi/LAN Stick or `DLS-L` LAN Stick):**
  - Plug an Ethernet RJ45 cable into the `S2-WL-ST`, reserve a static DHCP IPv4 address on the router, and connect GEMS via Modbus TCP on port `502` (`5s` Poll Interval, single local TCP master).
  - *Note:* Entry-level Wi-Fi-only `S3-WiFi-ST` sticks are strictly outbound cloud loggers and silently drop all local port `502` connections (`i/o timeout` even when visible on router DHCP/ARP). On `S2-WL-ST` sticks running older firmware (`< 100121cf` / `100141dx`), request Solis Support to push the local Modbus TCP datalogger firmware update, or wire Option A (direct RS-485).

---

## 5. Required Settings in the SolisCloud App (Local Bluetooth Commissioning)

Stand near the inverter with phone Bluetooth ON, open **SolisCloud App → Me → More Tools → Local Operation / Local Debugging → Connect with Bluetooth**, sign in with your **Solis Installer** account, and apply:

| SolisCloud Menu Path | Parameter | Required Setting | Technical Reason |
| :--- | :--- | :--- | :--- |
| `Storage Energy Set -> Battery Select` | **Battery Type / Model** | **`Lithium Battery` → Model: `Lithium Battery LV`** *(Do **NOT** use `PYLON LV`!)* | Establishes 500 kbps CAN handshake over Pins 4 & 5. **Important:** Easyway `UNIV5200` does **NOT** work with `PYLON LV`. Confirm `Information -> BMS Info = Normal` with live SOC % and current limits! |
| `Battery Select` | **Overdischarge SOC** | **`10 %`** *(`15–20%` if Backup port used)* | Matches Easyway's 90% DoD rating while preserving cell longevity. |
| `Battery Select` | **Forcecharge SOC** | **`5 %`** *(Keep ≥5% below Overdischarge!)* | **Eliminates nightly grid bounce-charging!** Keeping a 5% gap below `Overdischarge SOC` prevents 1% overnight standby drift from triggering forced AC recharges. |
| `Battery Select` | **Max Charge / Discharge Current** | **`50 A × Pack Count`** *(capped at Inverter Max A)* | Unlocks full continuous stack power (`50 A` = 1 pack, `100 A` = 2 packs, `150 A` = 3 packs). |
| `Storage Mode Select` | **Work Mode** | **`Self-Use = ON`** *(All TOU Slots, Backup Reserve & Feed-in Priority = `OFF`)* | Establishes clean autonomous self-consumption fallback with zero internal timer conflicts against GEMS (GEMS also automatically clears conflicting `TOU`, `Backup Reserve`, and `Feed-in Priority` mode bits once on startup while preserving `Off-Grid EPS` and `Wake-Up`). |
| `Storage Mode Select` | **Allow Grid Charging** | **`Allow / Enable`** | Grants hardware permission for GEMS Day-Ahead spot charging and Winter Low-Solar Fallback without charging spontaneously during normal `Self-Use`. |
| `Meter Set` | **Meter Type & Placement** | **`Eastron 3P` (`SDM630` / `SDM72D-M`) or `Acrel`** • **`Meter in Grid`** | Enables accurate phase and grid exchange tracking (`Addr 001, 9600 8N1`). |
| `Export Power Set (Internal EPM)` | **Backflow Power Limit** | **`OFF (Unlimited)`** *(unless mandated by DSO)* | Allows profitable export and Green Certificates while letting GEMS dynamically curtail PV during negative prices. |
| `Communication` | **Modbus Address & Baud** | **`Address = 1`** • **`9600 bps, 8N1`** | Matches GEMS default Modbus addressing. |

---

## 6. Onboarding Solis Hybrid vs. Solis Retrofit in GEMS

Unlock **Certified Installer Mode** (padlock icon 🔒 in **Settings**):

1. **Onboard Primary Utility / Site Meter:** Add your **P1 Serial Meter** (`p1_serial`) — or your GEMS-wired **Eastron `SDM72D-M` / `SDM630-M`** (`eastron_sdm72_x96` / `eastron_sdm630` per Section 3 Topology 2) — under **Smart Meter**.
2. **Choose the Exact Solis Template (`Settings -> Devices`):**
   - **Solis Hybrid (`S5-EH1P`, `S6-EH1P`, `S6-EH3P-L` with DC PV strings + `UNIV5200`):** Select **Inverter / Solar → `Solis S5/S6 Hybrid Inverter`** (`solis_hybrid`). Reads pure DC PV generation separately from AC output and supports `0.1%` active solar curtailment (`Allow Curtailment = Checked`).
   - **Solis AC-Coupled Retrofit (`RAI-3K-48ES-5G`, `S6-EA1P-L` alongside an existing PV inverter):** Onboard your existing solar PV inverter under **Inverter / Solar** (`Battery Connected? = Unchecked`), then onboard the Solis Retrofit unit under **Battery → `Solis Retrofit Storage System`** (`solis_retrofit_battery`) — or under **Inverter / Solar → `Solis Retrofit Inverter (AC Storage)`** (`solis_retrofit`) — checking **`Grid Meter Connected? = Checked`** whenever an Eastron/Acrel smart meter or CT is wired directly to the Solis `Meter` port with no standalone P1 meter on GEMS.
3. **Key Device Form Parameters:**
   - **Endpoint:** Persistent `/dev/serial/by-id/...` (`9600 8N1`) or reserved `S2-WL-ST` IPv4 on Port `502`, `Modbus ID = 1`.
   - **Rated Power (kW):** Exact AC nameplate rating (`3.0`, `3.6`, `5.0`, `6.0`, `10.0`).
   - **Poll Interval:** `2–3s` (Direct RS-485 / Gateway) or `5s` (`S2-WL-ST`).
   - **Phase Wiring:** Exact breaker phase (`L1`, `L2`, or `L3`) for 1-phase models on 3-phase switchboards, or `L1-L2-L3` for `S6-EH3P-L` (GEMS automatically applies safe `230 V` single-phase main-breaker current scaling if left on `Auto / Default`, while selecting the exact phase prevents unrelated phases from throttling charging).
   - **Grid Meter Connected?:** `Checked` if an Eastron `SDM72D-M`, `SDM630-M`, or Acrel meter is wired to the Solis `Meter` port; `Unchecked` otherwise.
   - **Battery Connected? & Capacity (kWh):** `Checked` + total installed `UNIV5200` kWh (`5.2` for 1×, `10.4` for 2×, `15.7` for 3×, `20.9` for 4×).
4. **Automatic Firmware, Model & BMS Profile Verification:** Once **`● Online`**, GEMS automatically reads and displays the detected **Solis hardware model**, **serial number**, **Inverter** DSP/HMI firmware version (e.g. `4C0050 (DSP 50 / HMI 4C)`), and configured **BMS** battery profile (e.g. `Lithium Battery LV` vs. `PYLON_LV`) directly on the `Settings -> Connected Devices` card, inside **Debug**, and under **Connected Modbus & Network Hardware** in **GRID-EMS-SERVER**—so any misconfigured `PYLON_LV` setting is immediately visible locally and remotely.

---

## 7. Optimal GEMS Strategy & EV Coordination Recipes

1. **Solar Forecast & Grid Fuse Protection (`Settings -> Strategy`):** Enable **Open-Meteo Solar Forecast Ingestion**, set exact main fuse amperage (`25A / 32A / 40A`) and grid system (`1x230V`, `3x400V`, or `3x230V Delta`), and keep `Meter Offline Fallback = 0 A`.
2. **Regional Mode:**
   - **Flanders (`Flanders Mode`):** `Capacity Peak Limit = 2.5 kW`, `Peak Shaving Buffer = 150–200 W`, and enter any **Green Certificate (GSC)** value (`€/MWh`) so legacy certificate-earning PV installations never curtail prematurely.
   - **Netherlands (`Netherlands Mode`):** Enable `Active Inverter Curtailment` (`0.00 €/kWh` threshold) to prioritize Easyway + EV absorption and avoid negative export charges.
3. **UNIV5200 Arbitrage, Flash Protection & Winter Readiness:**
   - `Charging Strategy Mode` = **`Dynamic 24h Forecast`**
   - `Battery Wear Cost` = **`0.04 €/kWh`** *(protects against unprofitable micro-cycling)*
   - `Winter / Low-Solar Grid Charge Fallback` = **`Checked`** (`Trigger 25%` → `Target 65%` over `2–3 cheapest hours`)
   - *EEPROM-Safe Control:* GEMS steers Solis exclusively via volatile RAM Remote Control registers with a 60-second watchdog keepalive—zero non-volatile flash memory wear!
4. **Coordinating with EV Chargers (e.g., Raedian Wallbox) & Peak-Tariff Grid-Charge Protection:** Whenever GEMS manages grid EV charging (`Now` or scheduled/cheapest-tariff `Eco`) on your **Raedian** wallbox—or detects uncommanded inverter grid charging at `≥ 10%` SOC outside allowed off-peak windows—it automatically overrides with P1 load-following discharge or engages an active `0 W` Remote Control hold (`43135=1, 43136=0, 43129=0`, preserving `< 10%` SOC BMS cell-survival protection) so Solis cannot dump battery energy into the EV or pull expensive peak grid power. For unmanaged external loads, you can also add a **`Hold (Idle / No Export)`** rule in **Custom Battery Cost Rules** matching your overnight window (e.g. `01:00 – 05:00`) to preserve 100% of your `UNIV5200` reserve for morning!
