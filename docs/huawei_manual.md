# GEMS: Huawei SUN2000, LUNA2000 & FusionSolar Commissioning Manual

> 🌐 **Language / Taal / Langue:** **English** | [Nederlands](nl/huawei_manual.md) | [Français](fr/huawei_manual.md)

This in-depth field and homeowner manual covers every required configuration setting inside the **Huawei FusionSolar App** (and Web Portal) alongside best-practice device, grid, tariff, and battery optimization settings inside **GRID-EMS (GEMS)** for residential and commercial Huawei installations.

> [!TIP]
> **Download Printable Field Manual (PDF):**
> - 📕 **[Huawei SUN2000, LUNA2000 & FusionSolar Manual (PDF)](../manuals/gems-huawei-manual.pdf)**
> - 💻 **[Interactive Huawei Web Guide](../manuals/huawei.html)**
> - 🛠️ **[GEMS Documentation Hub](../manuals/index.html)**

---

## 1. Supported Huawei Ecosystem & Physical Topologies

GEMS communicates locally with Huawei inverters, batteries, and energy sensors over your LAN or RS-485 bus with zero cloud dependency—while allowing normal **FusionSolar** cloud reporting to continue uninterrupted.

### 1.1 Supported Huawei Hardware Matrix

| Component Family | Supported Huawei Models | GEMS Template ID | Supported Features |
| :--- | :--- | :--- | :--- |
| **1-Phase Hybrid Inverters** | `SUN2000-2KTL`–`6KTL-L1`, `SUN2000-8KTL`–`10KTL-LC0` | `huawei_inverter` | PV active power (W), kWh yield, LUNA2000 control, active PV curtailment, phase telemetry |
| **3-Phase Hybrid Inverters** | `SUN2000-3KTL`–`10KTL-M1`, `SUN2000-5KTL`–`12KTL-MAP0`, `SUN2000-12KTL`–`25KTL-MB0` | `huawei_inverter` | 3-phase currents/voltages, bidirectional LUNA2000 dispatch, `0.1%` active PV curtailment |
| **Commercial String Inverters** | `SUN2000-12KTL`–`25KTL-M2/M5`, `SUN2000-30KTL`–`100KTL-M3` | `huawei_inverter` | Solar generation telemetry, 3-phase telemetry, active power curtailment |
| **Home Battery Storage (BESS)** | `LUNA2000-5/10/15-S0` (up to 30 kWh dual tower), `LUNA2000-7/14/21-S1` (up to 20.7 kWh/tower) | `huawei_inverter` (`Battery Connected?`) | Live SOC %, charge/discharge W, live BMS dynamic limits, 10-min hardware deadman timer |
| **Communication Gateways** | `SDongleA-05 (WLAN-FE)`, `EMMA-A02`, `SmartLogger3000` | Modbus TCP `:502` | Single-socket pooled TCP connection with `250 ms` inter-frame pacing |
| **Smart Power Sensors** | `EMMA-A02` built-in meter, `DTSU666-H` (3P), `DDSU666-H` (1P) | `huawei_emma` or via `huawei_inverter` | Signed grid import/export (W), signed L1–L3 currents (A), L1–L3 voltages (V), import/export kWh |
| **EV Wallbox (Optional)** | **Raedian** NEO / NEX / Gemini (Preferred Modbus TCP) or Huawei `SCharger-7KS / 22KT` (OCPP 1.6-J) | `raedian_charger` / `huawei_scharger` | Dynamic 6A–32A load balancing, solar surplus harvesting, 1P/3P phase switching |

### 1.2 Choosing the Right Connection Topology

1. **Topology A — `SDongleA-05 (WLAN-FE)` via Wired Ethernet + `DTSU666-H` + P1 Smart Meter (Recommended Gold Standard)**
   - Unscrew the bottom cap of the `SDongleA-05` and plug a **wired Cat5e/Cat6 Ethernet cable** into its internal RJ45 jack rather than relying on 2.4 GHz Wi-Fi. Wired Ethernet eliminates wireless packet loss, router power-save sleep latency, and Modbus timeout spikes.
   - Connect a Fluvius / DSMR **P1 Smart Meter cable** directly to GEMS USB (`p1_serial`). GEMS automatically uses the utility P1 meter as the billing-grade reference for Flanders 15-minute capacity peaks and main fuse protection, while Huawei's `DTSU666-H` maintains instant hardware fallback if LAN power is ever interrupted.
2. **Topology B — Huawei `EMMA-A02` Energy Management Assistant (Modbus TCP over LAN)**
   - Connect `EMMA-A02` via Ethernet to your LAN. Onboard `huawei_emma` (grid meter, TCP port `502`, Modbus ID `1`) and `huawei_inverter` (TCP port `502`, Modbus ID `1` for Inverter 1, `2` for Inverter 2) pointing to the same EMMA IP address. GEMS automatically shares **one single pooled TCP socket** across all devices on that IP.
3. **Topology C — Direct USB-to-RS485 Serial Fieldbus (Zero-Dongle Installations Only)**
   - **Important:** Only valid when **no** `SDongleA-05` or `EMMA-A02` is plugged into the inverter (an installed dongle claims master control of the internal RS-485 bus).
   - Wire shielded twisted-pair cable (`9600 bps, 8N1`, Slave ID `1`) from a USB-RS485 adapter on GEMS (`persistent /dev/serial/by-id/...`) to the inverter COM connector:
     - **`SUN2000-2KTL–6KTL-L1` (1-Phase):** `Pin 2` = `RS485A+` (`485A1`), `Pin 1` = `RS485B-` (`485B1`). *(Pins 3 & 4 remain reserved for DDSU666-H).*
     - **`SUN2000-3KTL–10KTL-M1` (3-Phase):** `Pin 1` = `RS485A+` (`485A1-1`), `Pin 3` = `RS485B-` (`485B1-1`). *(Pins 7 & 9 remain reserved for DTSU666-H).*
     - **`SUN2000-MAP0 / MB0 / LC0`:** Dedicated `485A1 / 485B1` EMS terminal pair.
4. **Topology D — `SUN2000 + LUNA2000` Without a Huawei Power Sensor (`P1-Meter-Driven Mode`, No EMMA / No `DTSU666-H`)**
   - If your Huawei hybrid inverter has a `LUNA2000` battery **without** an `EMMA-A02` and **without** a physical `DTSU666-H / DDSU666-H` power sensor, onboard your utility P1 Smart Meter in GEMS (`p1_serial`) and leave **`Grid Meter Connected?` unchecked** on the `Huawei Hybrid Inverter`.
   - In FusionSolar Installer Commissioning, ensure **`Charge from AC` = `Enable`**, **`Grid Charge Cutoff SOC` = `100%`**, and **`Max Charge / Discharge Power` = Hardware Rated Max**. If FusionSolar disables or rejects *Maximum Self-Consumption* because no Huawei power sensor is wired, set **Working Mode** to **`Fixed Charge/Discharge`** *(with zero scheduled time slots)* or **`Fully Fed to Grid`**—GEMS actively governs all solar surplus charging, household demand discharging, and grid arbitrage directly from real-time P1 meter telemetry.
5. **Why Built-In Inverter Wi-Fi (`Port 6607 / Unit ID 0`) Is Not Recommended**
   - The internal commissioning Wi-Fi hotspot (`SUN2000-<Serial>`, port `6607`, Unit ID `0`) is engineered for short installer maintenance sessions rather than continuous 24/7 EMS control. Always use `SDongleA-05`, `EMMA-A02`, `SmartLogger3000`, or direct `RS-485`.

---

## 2. Mandatory Firmware & Network Prerequisites

### 2.1 Minimum & Recommended Firmware Versions

| Huawei Hardware | Minimum Firmware | Recommended Firmware | Key Requirement |
| :--- | :--- | :--- | :--- |
| **`SDongleA-05 (WLAN-FE)`** | `V100R001C00SPC126` / `V200R022C10SPC108` | `V200R022C10SPC118` or newer | Unlocks unrestricted Modbus TCP & reliable write handling |
| **`SUN2000-L1` (1-Phase)** | `V200R001C00SPC130` | `V200R001C00SPC142` or newer | Duration-based forcible battery charge/discharge registers |
| **`SUN2000-M1` (3-Phase)** | `V100R001C00SPC153` | `V100R001C00SPC165` or newer | LUNA2000 AC charge & `0.1%` active power derating |
| **`SUN2000-LC0 / MAP0 / MB0`** | `V200R023C10SPC100` | Latest `SPC` release | Full S1 BMS power envelope support |
| **`LUNA2000-S0 / S1`** | `V100R002C00SPC119` (S0) | `V100R002C00SPC624+` (S0) / Latest (S1) | Live dynamic charge/discharge power limit reporting |
| **`EMMA-A02`** | `V100R023C10SPC100` | `V100R023C10SPC120` or newer | Unencrypted port `502` + exact GEMS IPv4 whitelist |

### 2.2 Static IPv4 Reservations & Single-Master Rule

> [!IMPORTANT]
> 1. **One Modbus TCP Client Only:** Both `SDongleA-05` and `EMMA-A02` accept **only one concurrent Modbus TCP client** on port `502`. Shut down any secondary third-party polling scripts, monitoring servers, or direct wallbox Modbus pollers before commissioning GEMS.
> 2. **DHCP Reservations / Static IPs:** Assign permanent DHCP MAC reservations on your router for both the **GEMS controller** (`eth0`) and the **Huawei SDongleA-05 / EMMA-A02**. On `EMMA-A02`, port `502` strictly filters by the GEMS client IPv4 address—if GEMS changes IP after a router reboot, EMMA will block the connection.

---

## 3. Step-by-Step Huawei FusionSolar App Configuration

Homeowner "Plant View" accounts cannot modify Modbus security or inverter grid-control parameters. Connect locally using **Device Commissioning** with **Installer** privileges.

### 3.1 Entering Local Device Commissioning Mode
1. **Turn OFF Mobile Data** on your smartphone (keep Wi-Fi ON so Android/iOS does not route traffic away from the inverter's offline Wi-Fi hotspot).
2. Open the **FusionSolar App** -> tap **Me** (or **Services**) -> select **Device Commissioning**.
3. Scan the QR code on the side of the **SUN2000 inverter** (or on the front of the **EMMA-A02** module).
4. Select **Installer** and sign in with the site's Huawei Installer credentials.

### 3.2 Unlocking Modbus TCP on `SDongleA-05` (Topology A)
1. Navigate to: **`Settings -> Communication Configuration -> Dongle Parameter Settings -> Modbus-TCP`**.
2. Change **Connection** from *Disabled* to **`Enable (unrestricted)`** (or *Enable (restricted)* set to the exact static IPv4 of your GEMS appliance).
3. Tap **Confirm / Save**.
4. Check **`Settings -> Communication Configuration -> RS485_1`**: confirm **Protocol** = `MODBUS`, **Baud Rate** = `9600`, and note the **Communication Address** (default `1`; cascaded slave inverters use `2`, `3`, etc.).
5. *(Remote Desktop Alternative)*: In the **FusionSolar Web Portal** (Installer login), open **Plants -> Device Management -> Select SDongle -> Configuration -> Connection Parameters -> Modbus TCP -> `Enable (unrestricted)`**.

### 3.3 Unlocking Modbus TCP on `EMMA-A02` (Topology B)
1. Connect to the **EMMA-A02** in **Device Commissioning** as **Installer**.
2. Navigate to: **`Settings -> Communication Configuration -> Modbus TCP`**.
3. Set **Connection** = **`Enable`**.
4. Set **TLS Encryption** = **`Disable` (OFF)** *(Mandatory for standard port `502` Modbus TCP communication)*.
5. Set **Client IP Address** = **Exact static IPv4 of your GEMS controller** (e.g., `192.168.1.50`). **Never enter `0.0.0.0`**—EMMA-A02 rejects wildcard addresses with `TCP RST`.
6. Under EMMA's energy mode settings, keep **Working Mode** on **`Maximum Self-Consumption`** and leave EMMA's cloud AI / Time-of-Use scheduling **Disabled** so EMMA never sends conflicting battery commands.

### 3.4 Mandatory LUNA2000 Battery Parameters in FusionSolar

Navigate to **`Settings -> Energy Control`** (or **`Device Monitoring -> ESS (LUNA2000) -> Parameter Settings`**) and configure every parameter below:

| FusionSolar Parameter | Required Setting | Technical Reason |
| :--- | :--- | :--- |
| **Working Mode** | **`Maximum Self-Consumption`** *(With Huawei Meter / EMMA)*; **`Fixed Charge/Discharge` (0 slots)** or **`Fully Fed to Grid`** *(Meterless Topology D if Self-Consumption is unavailable)* | Serves as the clean hardware baseline (never enable internal *Time-of-Use (TOU)* timers, which fight GEMS). On Topology D sites without a Huawei power sensor where FusionSolar blocks *Maximum Self-Consumption*, select `Fixed Charge/Discharge` with an empty schedule so GEMS has unobstructed Modbus dispatch control. |
| **Charge from AC** *(Charge from Grid)* | **`Enable`** | Does *not* cause spontaneous grid charging during normal self-consumption, but unlocks firmware permission so GEMS can command forced AC charging during negative/cheap spot prices and winter low-SOC recovery. |
| **Grid Charge Cutoff SOC** | **`100 %`** | Prevents Huawei firmware from prematurely stopping grid charge at e.g. 80% when GEMS targets 95%–100% during negative spot hours. GEMS enforces exact per-rule Target SOC limits. |
| **Maximum Charge Power** | **Hardware Rated Max** *(e.g. `2500 W`, `5000 W`, `10500 W`)* | Ensures full charge throughput for peak solar capture and negative-price absorption. |
| **Maximum Discharge Power** | **Hardware Rated Max** *(e.g. `2500 W`, `5000 W`, `10500 W`)* | Ensures full instantaneous discharge power is available to shave sudden Flanders 15-minute capacity peaks. |
| **End-of-Charge SOC** | **`100 %`** | Allows periodic 100% LiFePO4 top-balancing so the LUNA2000 BMS SOC estimate stays calibrated. |
| **End-of-Discharge SOC** *(Min SOC)* | **`5 % – 10 %`** *(Grid-tied)* / **`15 % – 20 %`** *(with Backup Box)* | Use `5%` in spring/summer for maximum usable storage, `10%` in deep winter to prevent deep-sleep maintenance charges, or `15%–20%` if a Huawei Backup Box / SmartGuard is installed. |

### 3.5 Active Power Control & Smart Power Sensor Verification
- **Active Power Control Mode** (`Settings -> Power Adjustment -> Active Power Control`): Set to **`Unlimited` (`No limit`)** unless your DSO legally mandates a fixed hardware cap. Static *Zero-Export* inside FusionSolar blinds GEMS during profitable export hours and Flemish Green Certificate (GSC) hours—keep FusionSolar on `Unlimited` and let GEMS dynamically manage export limits and negative-price curtailment!
- **Closed-Loop Controller**: Set to **`Inverter`** on single-inverter setups (fastest hardware loop), or **`SDongle / SmartLogger`** on multi-inverter Master-Slave cascades.
- **CT Clamp Polarity Check (`DTSU666-H` / `DDSU666-H`)**: Verify in FusionSolar's live flow screen that switching on a ~2 kW resistive load increases grid import by +2 kW on the matching phase, and confirm physical CT arrows (`K -> L`) point **from the utility meter toward the house loads**.

---

## 4. Onboarding Huawei Hardware in GEMS

Disconnect your phone from the inverter's commissioning Wi-Fi AP, open GEMS in your browser, go to **Settings**, click the **padlock icon 🔒**, and enter your **Installer Access PIN** to unlock **Certified Installer Mode**.

### 4.1 Step 1 — Onboard Your Primary Grid Meter (`Settings -> Devices -> Smart Meter`)
- **With Fluvius / DSMR Digital Meter (Recommended):** Add **`P1 Serial Meter`** (`p1_serial`) using its persistent `/dev/serial/by-id/...` adapter pill. GEMS automatically prioritizes the standalone P1 utility meter for 15-minute billing peak protection while smoothly coordinating with your Huawei inverter.
- **With Huawei `EMMA-A02` (No P1 Port):** Add **`Huawei EMMA-A02 / DTSU666-H Smart Power Sensor`** (`huawei_emma`) with the EMMA static IP, TCP Port `502`, and Modbus ID `1` (or `/dev/serial/by-id/...` with Modbus ID `11` for standalone RS-485 `DTSU666-H`).

### 4.2 Step 2 — Onboard `Huawei Hybrid Inverter` (`Settings -> Devices -> Inverter / Solar`)

| GEMS Device Field | Recommended Value | Why It Matters |
| :--- | :--- | :--- |
| **Device Name** | `Huawei SUN2000 + LUNA2000` | Clear identifier across Dashboard charts, Logger, and PDF reports. |
| **Device Template** | `Huawei Hybrid Inverter` (`huawei_inverter`) | Enables native `250 ms` SDongle frame pacing, live BMS dynamic limits, and 10-min deadman safety. |
| **IP Address or Serial Port** | Static IP of SDongle / EMMA (e.g. `192.168.1.120`) or `/dev/serial/by-id/...` | Enter the reserved LAN IPv4 address (or persistent serial adapter path for Topology C). |
| **TCP Port** | `502` | Standard Modbus TCP port for `SDongleA-05`, `EMMA-A02`, and `SmartLogger3000`. |
| **Modbus ID** | `1` *(default)*; `2, 3...` *(cascaded slaves)* | Must match FusionSolar `RS485_1 Communication Address` (check if set to `1`, `2`, or `16`). |
| **Rated Power (kW)** | Exact AC Nameplate kW (e.g. `4.6`, `5.0`, `10.0`) | **Required** so GEMS calculates exact `0.1%` percentage derating setpoints during solar curtailment. |
| **Allow Curtailment** | **`Checked (✓)`** | Permits GEMS to throttle SUN2000 active power output during negative export return hours. |
| **Poll Interval (seconds)** | **`10`** *(SDongleA-05)* / **`5`** *(EMMA-A02 or RS-485)* | GEMS auto-selects `10s` for Huawei to protect the SDongleA-05 CPU and preserve FusionSolar cloud sync. |
| **Phase Wiring** | `Three-Phase — L1-L2-L3` *(M1/MAP0/MB0)* or exact `L1 / L2 / L3` *(1P L1)* | On 1-phase `SUN2000-L1` connected to a 3-phase home, mapping the exact phase ensures accurate per-phase fuse protection. |
| **Grid Meter Connected?** | **`Checked (✓)`** if DTSU666-H / EMMA wired; **`Unchecked (☐)`** if NO Huawei meter | Keep checked whenever a Huawei meter is wired to the inverter. Uncheck *only* when relying solely on a P1 meter to drive LUNA2000 self-consumption. |
| **Battery Connected?** | **`Checked (✓)`** if LUNA2000 attached | Activates LUNA2000 SOC & power polling and bidirectional control. |
| **Battery Capacity (kWh)** | Total usable kWh (e.g. `5.0`, `10.0`, `15.0`, `6.9`, `13.8`, `20.7`) | Required for the **Dynamic 24h Forecast** solver and **Winter Fallback** charge duration math. |

---

## 5. Configuring GEMS for the Best Possible Working Conditions

### 5.1 Location, Solar Forecast & Physical Grid Limits (`Settings -> Strategy`)
1. **Geographic Location:** Set `Time Zone` (`Europe/Brussels` or `Europe/Amsterdam`), enter street `Address`, click **Lookup Lat/Lon**, and check **`Enable Open-Meteo Solar Forecast Ingestion`**. This ensures GEMS never wastes money charging LUNA2000 overnight right before a sunny day.
2. **Grid Connection & Limits:** Set `Nominal Current (A)` and `Phase Limit (A)` to your main utility breaker (e.g. `25 A`, `32 A`, `40 A`), choose the exact `Grid System` (`Single Phase 230V`, `Three Phase 400V`, or `Three Phase 230V Delta`), and leave `Meter Offline Fallback Current` at **`0 A — Pause EV Charging`**.

### 5.2 Regional Strategy Profiles

- **Flanders / Belgium (`Flanders Mode — Peak Shaving`):**
  - `Optimization Mode`: **`Flanders Mode (Peak Shaving)`**
  - `Capacity Peak Limit (kW)`: **`2.5 kW`** (statutory minimum floor) or **`3.0–3.5 kW`** for heat-pump + EV homes. GEMS's **Smart Adaptive Ceiling** automatically adapts if an unavoidable higher 15-minute peak occurs during the calendar month.
  - `Peak Shaving Buffer (W)`: **`200 W`** on wired Ethernet / EMMA-A02 (**`250 W`** if SDongleA-05 connects via Wi-Fi).
  - `Ramp-up Hysteresis (W)`: **`500 W`**.
  - `Active Inverter Curtailment`: **`Checked (✓)`**, `Base Export Price Threshold`: **`0.00 €/kWh`**, and **`Green Power Certificates (GSC)`**: set **`€0`** for modern PV, or your exact certificate subsidy (`€250`, `€350`, `€450`) so SUN2000 never curtails while certificates keep export net-profitable!
- **The Netherlands (`Netherlands Mode — Smart Saldering`):**
  - `Optimization Mode`: **`Netherlands Mode (Smart Saldering)`**
  - `Active Inverter Curtailment`: **`Checked (✓)`**, `Base Export Price Threshold`: **`0.00 €/kWh`** (or your supplier's feed-in fee threshold). Surplus solar charges LUNA2000 and EVs first, then smoothly curtails SUN2000 output once storage is full during negative return hours.
- **Fixed / Dual-Tariff (`Eco Mode`):**
  - `Optimization Mode`: **`Eco (Max Self-Consumption)`** — maximizes pure solar self-consumption and fuse protection with zero unnecessary grid cycling.

### 5.3 Optimal LUNA2000 Arbitrage, Wear Protection & Winter Settings
1. Configure your exact supplier preset, DNO fee (`Fluvius`, `ORES`, `RESA`, `SIBELGA`), and VAT (`6%` BE / `21%` NL) under **`Settings -> Energy Contract`**.
2. Under **`Settings -> Strategy -> Battery Grid Charging & Arbitrage`**:
   - **`Charging Strategy Mode`**: **`Dynamic 24h Forecast (Solar & Load modeling)`** (optimal for dynamic Day-Ahead contracts).
   - **`Battery Wear Cost (€/kWh)`**: **`0.04 €/kWh`** (`0.03–0.05 €/kWh`). Accounts for LiFePO4 cell wear and ~12%–15% AC-DC-AC round-trip conversion losses so GEMS never micro-cycles your LUNA2000 on tiny price ripples.
   - **`Grid Charge Ceiling (€/kWh)`**: **`0.08 €/kWh`** (or `0.00 €/kWh` for negative-price-only grid charging).
   - **`Grid Discharge Floor (€/kWh)`**: **`0.35 €/kWh`** (reserves battery capacity for household consumption unless market export rates spike sharply).
   - **`Winter / Low-Solar Grid Charge Fallback`**: **`Checked (✓)`** with `Low SoC Trigger` = **`25%`**, `Fallback Target SoC` = **`65%`**, and `Cheapest Hours` = **`2 hours`** (`3 hours` for ≥15 kWh LUNA2000 towers so recharge wattage stays safely under the 2.5 kW Flanders peak ceiling).

### 5.4 Coordinating EV Chargers (Raedian) Without Draining LUNA2000
- Connect your EV wallbox (e.g. **Raedian NEO / NEX / Gemini**) directly to GEMS via local **Modbus TCP** (`Settings -> Devices -> EV Charger`).
- Use `PV Only (Solar)` or `Eco / Smart` on the Dashboard for daytime solar surplus charging.
- To charge your EV during cheap overnight grid hours **without draining your LUNA2000 home battery into the car**, add a **Battery Cost Optimization Rule** (`Settings -> Strategy -> Rule-Based Battery Cost Optimization`) with **Action** = **`Hold (Idle / No Export)`** matching your night EV charging window (e.g. `01:00 – 05:00`), preserving your LUNA2000 capacity for the expensive morning peak.

---

## 6. Verification Checklist & Troubleshooting

### 6.1 Post-Commissioning Verification
1. Confirm `Huawei Hybrid Inverter` shows **`● Online`** under `Settings -> Connected Devices` and inspect live voltage, SOC %, and wattage via **Debug**.
2. Switch on a ~2 kW household appliance and verify on the **Dashboard** that Home Consumption and Grid Import / Battery Discharge move in the expected positive direction.
3. Check the **Logger** tab for `HuaweiInverterPoller` and verify clean polling with zero timeouts or illegal register errors.
4. Confirm the homeowner **FusionSolar App** continues updating cloud telemetry every 5 minutes.
5. Export a portable JSON backup (`Settings -> System Info -> Export Configuration Backup`) and click the padlock icon 🔒 to re-lock **Certified Installer Mode**.

### 6.2 Quick Troubleshooting Matrix

| Symptom | Root Cause | Solution |
| :--- | :--- | :--- |
| **`Connection refused` / `TCP RST` on `:502`** | Modbus TCP disabled in FusionSolar, or EMMA-A02 TLS ON / wrong client IP | Enable `Modbus-TCP = Enable (unrestricted)` on SDongle; on EMMA-A02 disable TLS and whitelist exact GEMS IPv4 (never `0.0.0.0`). |
| **Frequent `i/o timeout` / `request timed out` / `server device busy`** | Second Modbus client polling `:502`, weak 2.4 GHz Wi-Fi on `SDongleA-05`, or Poll Interval `< 8s` | Stop any secondary polling client, plug wired Ethernet into `SDongleA-05`, and keep GEMS `Poll Interval` at **`10s`**. |
| **TCP connects, but reads fail (`Slave failure`)** | Mismatched `Modbus ID` | Match GEMS `Modbus ID` to FusionSolar `RS485_1 Communication Address` (typically `1`, sometimes `2` or `16`). |
| **LUNA2000 ignores forced grid charge or logs `server device failure`** | `Charge from AC` disabled, low cutoff SOC, meterless Topology D locked in a meter-dependent working mode, or old SDongle/SUN2000 FW | Set `Charge from AC = Enable`, `Grid Charge Cutoff SOC = 100%`, `Max Charge/Discharge Power = Rated Max`, uncheck `Grid Meter Connected?` in GEMS if no Huawei meter is wired (selecting `Fixed Charge/Discharge` with 0 slots if FusionSolar blocks Self-Consumption), and update SDongle FW to `V200R022C10SPC118+`. |
| **Battery charges when house load rises** | Reversed `DTSU666-H` CT clamps or swapped phase voltage taps | Ensure CT arrows (`K -> L`) point **Grid -> House** and `L1/L2/L3` voltage wires match `CT-A/B/C`. |
| **Offline after Huawei firmware update** | Firmware update reset SDongle Modbus TCP to *Disabled* | Re-enable `Modbus-TCP = Enable (unrestricted)` in FusionSolar Installer settings. |
