# GEMS: Handleiding Inbedrijfstelling & Bekabeling voor Enerlution Hybride Omvormers & LiFePO4 Batterijopslag

> 🌐 **Taal / Langue / Language:** [English](../enerlution_manual.md) | **Nederlands** | [Français](../fr/enerlution_manual.md)

Deze uitgebreide handleiding voor elektriciens en woningeigenaren behandelt **beide Enerlution-opslagarchitecturen** — **51,2 V Laagspanning Parallel (`LFPWall-5000`, `LFPWall-10K-V2`, `Roller-16K`)** én **150–600 V Hoogspanning Stapelbaar (`GroundHV-2500`, `GH02-5324` + PDU/BCU)** — inclusief fysieke DC-vermogensbekabeling, CAN RJ45-pinbezetting, DIP-switch-adressering bij meerdere pakketten, aansluitklemmen voor externe RS-485 slimme meters (`CHINT DTSU666` / `DDSU666` / `Eastron SDM630`), vereiste inbedrijfstellingsparameters in de **Enerlution App** en de optimale configuratie in **GRID-EMS (GEMS)**.

> [!TIP]
> **Download Afdrukbare Veldhandleiding (PDF):**
> - 📕 **[Enerlution Hybride & Batterijopslag Handleiding (PDF)](../../manuals/nl/gems-enerlution-manual-nl.pdf)**
> - 💻 **[Interactieve Enerlution Webgids](../../manuals/nl/enerlution.html)**
> - 🛠️ **[GEMS Documentatieportaal](../../manuals/nl/index.html)**

---

## 1. Enerlution LV- vs. HV-ecosysteem & Compatibiliteitsmatrix

In tegenstelling tot merken met één vaste batterijspanning produceert **Enerlution** twee strikt gescheiden spanningsklassen. Controleer vóór het bekabelen altijd of het batterijmodel exact overeenkomt met de spanningsklasse van uw hybride omvormer:

> [!CAUTION]
> **KRITIEKE SPANNINGSSCHEIDING — Combineer NOOIT LV (51,2 V) en HV (150–600 V)!**
> - **Architectuur A — 51,2 V Laagspanning (`LFPWall-5000`, `LFPWall-10K-V2`, `Roller-16K`):** Meerdere batterijmodules moeten **uitsluitend in 51,2 V parallel** worden geschakeld (`P+` op `P+`, `P-` op `P-`). Sluit deze *uitsluitend* aan op 48V/51,2V laagspannings-hybride omvormers (`Enerlution HY / L3–L6 LV`, of compatibele 48V LV-omvormers zoals `Solis -L`). Schakel LV-wand- of vloerbatterijen **nooit** in serie!
> - **Architectuur B — Hoogspanning Stapelbaar (`GroundHV-2500`, `GH02-5324` + PDU/BCU):** De modules worden **in serie gestapeld onder een speciale hoogspannings-PDU / BCU Control Head** (`~153 V – 500+ Vdc`). Sluit deze *uitsluitend* aan op 3-fasige hoogspannings-hybride omvormers (`Enerlution HYTH-5K..12K` / `L5–L12 HV`). Houd tijdens montage de HV Manual Service Disconnect (MSD) en PDU-automaat **UIT** en draag HV-isolerende handschoenen!

### 1.1 Dimensioneringsmatrix Batterij & Omvormer

| Enerlution Batterijmodel | Spanningsklasse | Nominale Specificaties & Capaciteit | Max. Laden / Ontladen | Bijpassende Omvormer & Externe DC-beveiliging |
| :--- | :--- | :--- | :--- | :--- |
| **`LFPWall-5000`** (Wand LiFePO4) | **51,2V LV Parallel** | `51,2 Vdc` • `102 Ah` • **`5,22 kWh`** | `40 A` Laden / `75 A` Ontl. | `Enerlution HY / L3–L6 LV` • `25 mm²` • **125 A** 2P DC MCCB |
| **`LFPWall-10K-V2`** (Wand Hoge Cap.) | **51,2V LV Parallel** | `51,2 Vdc` • `204 Ah` • **`10,44 kWh`** | `90 A` Laden / `140 A` Ontl. | `Enerlution HY / L3–L6 LV` • `35 mm²` • **160–200 A** 2P DC MCCB |
| **`Roller-16K`** (Verrijdbare Vloermodule) | **51,2V LV Parallel** | `51,2 Vdc` • `314 Ah` • **`16,08 kWh`** | `0,5 C` (~`150 A` / 7,6 kW) | `Enerlution HY / L5–L6 LV` • `35–50 mm²` • **200 A** 2P DC MCCB |
| **`GroundHV-2500 + PDU`** (HV-toren) | **HV Seriestapel** | `51,2 V / 2,5 kWh` per blok • **`7,5–20+ kWh`** (3–8 blokken) | `~25–50 A` HV DC (`5–12 kW`) | `Enerlution HYTH-5K..12K` (3F HV) • `6–10 mm²` (1000V) via PDU-automaat |
| **`GH02-5324 + BCU`** (Grote HV-toren) | **HV Seriestapel** | Modulaire HV-toren • **`15,0–42,0 kWh`** | `~50 A` HV DC (`10–15+ kW`) | `Enerlution HYTH-8K..12K` (3F HV) • `6–10 mm²` (1000V) via BCU-automaat |

---

## 2. Stapsgewijze Bekabeling van Batterij & Slimme Meter

Voer alle vermogens-, aardings-, DIP-switch-, CAN- en RS-485-meterbekabeling uit terwijl de AC-netautomaat, PV DC-lastscheider, externe DC MCCB / HV PDU-automaat en alle batterijschakelaars strikt **UIT** staan.

### 2.1 Architectuur A — Bekabeling van 51,2V LV Parallelle Pakketten (`LFPWall` & `Roller`)

1. **Externe Niet-gepolariseerde 2-polige DC MCCB:** Plaats een niet-gepolariseerde 2-polige DC-vermogensautomaat (MCCB) of `gBat` DC-zekeringlastscheider (`≥ 80 Vdc`; `100–125 A` voor `LFPWall-5000`, `160–200 A` voor `LFPWall-10K-V2` of `Roller-16K`) tussen de batterijbank en de `BAT+ / BAT-`-aansluitingen van de omvormer. Gebruik nooit gepolariseerde AC-automaten op bidirectionele DC-batterijleidingen.
2. **2 tot 3 Parallelle Pakketten — Diagonale (Kruislingse) Balanceringsregel:** Verbind `P+` met `P+` en `P-` met `P-` tussen de pakketten met exact gelijke kabellengtes. Sluit de hoofdkabel **`BAT+`** naar de omvormer aan op **`P+` van Pakket 1 (Master)** en sluit de hoofdkabel **`BAT-`** diagonaal aan op **`P-` van het LAATSTE pakket**, zodat de lusimpedantie over alle modules gelijk is.
3. **4+ Parallelle Pakketten — Koperen DC-verzamelrail (Busbar):** Trek gezekerde aftakkabels van gelijke lengte (`25–35 mm²`) vanaf elke batterij naar vertinde koperen DC-busbars (`250–400 A`), en verbind deze met `35–50 mm²` hoofdkabels via de DC MCCB met de omvormer.
4. **Beschermingsaarde (`⏚ PE`):** Verbind elk `⏚` M6-aardingspunt op de batterijbehuizing met de PE-aardrail van de omvormer via `≥ 6 mm²` groen/gele koperdraad.

### 2.2 Architectuur B — Bekabeling van Hoogspanningstorens (`GroundHV-2500` / `GH02-5324` + PDU/BCU)

1. **Stapelen & Kantelbeveiliging:** Zet de stalen vloersokkel waterpas tegen een draagmuur. Stapel de HV-batterijmodules verticaal (minimaal `3–4 × GroundHV-2500` blokken = `~153–204 Vdc` om boven de startspanning van de `HYTH` te komen), monteer de zijbeugels tussen elke laag en plaats de **PDU / BCU High-Voltage Control Head** bovenop.
2. **HV DC-stekkers & Interlock:** Controleer dat de PDU HV-automaat **UIT** staat en dat een eventuele oranje **Manual Service Disconnect (MSD)**-stekker verwijderd is. Leid dubbelgeïsoleerde `6–10 mm²` (`1000 Vdc`) HV-kabels van de aanraakveilige PDU `HV+ / HV-`-aansluitingen naar `BAT+ / BAT-` op de `HYTH`-omvormer tot de wartels vastklikken, en aard zowel de sokkel als de PDU (`⏚ PE`) op de aardrail van de omvormer.

### 2.3 BMS CAN RJ45-pinbezetting & Parallelle DIP-switch-adressering

De closed-loop BMS-communicatie (`SOC %`, `SOH %`, pakketspanning, temperatuur-derating en dynamische stroomlimieten) verloopt via **CAN-bus** van de **`CAN`-poort op de Master-batterij / PDU** naar de **`BMS / CAN`-poort op de Enerlution-omvormer**:

| RJ45-pin | Standaard T568B-kleur | Enerlution Master / PDU `CAN`-poort | Omvormer `BMS / CAN`-poort | Functie |
| :---: | :--- | :--- | :--- | :--- |
| **Pin 1 & 2** | Wit-Oranje / Oranje | RS485-B / RS485-A (Optioneel) | RS485-B / RS485-A | Niet gebruikt in CAN-modus |
| **Pin 3 & 6** | Wit-Groen / Groen | Signaal `GND` | Signaal `GND` | Referentiemassa |
| **Pin 4** | **Blauw** | **`CAN-H` (CAN High)** | **`CAN-H` (CAN High)** | **Verplichte CAN-H** |
| **Pin 5** | **Wit / Blauw** | **`CAN-L` (CAN Low)** | **`CAN-L` (CAN Low)** | **Verplichte CAN-L** |
| **Pin 7 & 8** | Wit-Bruin / Bruin | Gereserveerd / Scherm GND | Gereserveerd / Scherm GND | Volg fabriekskabellabel |

- **Parallelle LV Onderlinge Link & Spanningsloze DIP-switches:**
  - Lus CAT5e/CAT6-patchkabels door van **Master Pakket 1 `Link Out / RS485-B`** → **Slave Pakket 2 `Link In / RS485-A`** → **Slave Pakket 3 `Link In`**. Laat de `CAN`-poort op alle Slave-pakketten leeg.
  - Stel de binaire `ADD` DIP-switches uitsluitend spanningsloos (**UIT**) in: enkel pakket = `0000` (of `Adres 1` volgens het meegeleverde BMS-blad); meerdere pakketten = **Master Pakket 1: `ON OFF OFF OFF` (Adr 1)**, **Slave Pakket 2: `OFF ON OFF OFF` (Adr 2)**, **Slave Pakket 3: `ON ON OFF OFF` (Adr 3)**, **Slave Pakket 4: `OFF OFF ON OFF` (Adr 4)**.
  - *Opmerking bij Koppeling met Andere LV-merken:* Combineert u een 51,2V Enerlution `LFPWall` / `Roller` met een compatibele 48V LV-omvormer zoals **Solis (`-L`)**, controleer dan dat het BMS CAN-protocol op `Pylon / Solis CAN` staat via Pin 4 & 5 en voeg de omvormer in GEMS toe met de Solis-hardwaretemplate.

### 2.4 Aansluitklemmen Externe RS-485 Slimme Meter (`9600 bps, 8N1`, Adres `1`)

| Model Slimme Meter | Meter `RS485-A (+)` | Meter `RS485-B (-)` | Busconfiguratie |
| :--- | :--- | :--- | :--- |
| **`CHINT DTSU666`** (3-fasig) | Klem **`24`** | Klem **`25`** | Adres `1` • `9600 8N1` |
| **`CHINT DDSU666`** (1-fasig) | Klem **`5`** | Klem **`6`** | Adres `1` • `9600 8N1` |
| **`Eastron SDM630-Modbus V2`** | Klem **`A / 485A`** | Klem **`B / 485B`** | Adres `1` • `9600 8N1` |

Plaats alle stroomspoelen (CT's) direct achter de officiële netmeter (stroomopwaarts van alle woningkringen, EV-laadpalen en zonne-/batterijautomaten) met de pijlen gericht van **Net → Woning/Verbruik**.

### 2.5 Verplichte Soft-Start Inschakel- & Uitschakelvolgorde

1. **Inschakelen:** Controleer spanningsloos de DC-polariteit met een multimeter → Sluit de LV 2-polige DC MCCB (of plaats de HV MSD-stekker en sluit de PDU HV-automaat) terwijl het BMS nog slaapt → Houd de **`POWER / SW`-knop (`2–3s`)** op de Master/PDU ingedrukt zodat de voorlaadweerstanden de DC-bus van de omvormer rustig opladen (`RUN` groen, `ALM` uit) → Schakel de PV DC-lastscheider **AAN** → Schakel de AC-netautomaat **AAN**.
2. **Uitschakelen (Omgekeerde volgorde):** AC-netautomaat **UIT** → PV DC-schakelaar **UIT** → Houd `POWER` op Master/PDU 3s ingedrukt om het BMS in slaapstand te zetten → Open de DC MCCB / PDU-automaat **UIT** (wacht 5 minuten alvorens HV-klemmen aan te raken).

---

## 3. Vereiste Inbedrijfstellingsparameters in de Enerlution App

Maak lokaal verbinding via Bluetooth of de Enerlution Wi-Fi/LAN-communicatiestick (zet mobiele data tijdelijk UIT wanneer u verbindt met het lokale Wi-Fi-accesspoint van de stick), log in als **Installer**, koppel de datalogger aan bekabeld Ethernet-LAN of 2,4 GHz Wi-Fi met een **vaste DHCP-reservering in de router**, en stel in:

| Parameter in Enerlution App | Vereiste Instelling | Technische Reden |
| :--- | :--- | :--- |
| **Battery Type & Protocol** | **`Lithium-Ion (CAN)`** *(Enerlution / Pylon-profiel)* | Activeert closed-loop BMS-telemetrie (`SOC %`, `SOH %`, spanning/stroom & thermische limieten). Controleer dat Battery State `1–5` (`Standby / Charging / Discharging`) toont en nooit `7 Offline`. |
| **EMS Working Mode** | **`Self-Consumption`** | Laat de omvormer autonoom zonne-overschot opslaan in de batterij en ontladen om woningverbruik en avondpieken op te vangen. |
| **Minimum / Reserve SOC** | **`10 %`** *(`15–20%` bij EPS-noodstroom)* | Beschermt de levensduur van de LiFePO4-cellen (90% DoD) en behoudt noodstroomreserve op `EPS / Backup`. Houd **Max Charge SOC = 100%**. |
| **External Smart Meter** | **`Enable` → `CHINT DTSU666` of `SDM630`** | Activeert sub-seconde meting achter de meter (`Address 1`, `9600 8N1`) en stelt het live netvermogen (`30110`) beschikbaar aan GEMS. |
| **Active Power / Export Control** | **`Disabled / Unlimited (0)`** | **Cruciaal!** Laat reguliere teruglevering en Groenestroomcertificaten onbegrensd, terwijl GEMS tijdens uren met negatieve spotprijzen dynamisch op **1-Watt nauwkeurig** kan terugregelen (`40400` / `40441`)! |
| **Modbus TCP & RS-485** | **Poort `502` • Slave ID `1` • `9600 8N1`** | Komt overeen met de standaardwaarden van de `enerlution_inverter`-driver in GEMS via LAN/Wi-Fi (`:502`) of directe USB-RS485. |

---

## 4. Enerlution Toevoegen & Optimaliseren in GEMS

1. **Voeg Eerst de Digitale P1-meter toe:** Configureer uw digitale nutsmeter (`p1_serial`) onder **Instellingen → Toestellen** (met de **Gecertificeerde installateursmodus** 🔒 ontgrendeld) voor facturatienauwkeurige 3-fasestromen en Vlaamse kwartierpiekbewaking.
2. **Automatisch Detecteren of Handmatig Toevoegen van `enerlution_inverter`:**
   - GEMS herkent automatisch Enerlution MAC OUI's (`70:B3:D5` en `E4:5F:01`) en ASCII-identificatieregisters (`30010–30033`) via **Scanner → Subnet scannen**, of voeg het toestel handmatig toe via **Instellingen → Toestellen → Nieuw energietoestel toevoegen → Omvormer / Zon → `Enerlution Hybrid Inverter`** (`enerlution_inverter`).
   - Stel het **Endpoint** in (gereserveerd vast IPv4-adres op `Poort = 502` of `/dev/serial/by-id/...` op `9600 8N1`), **`Modbus ID = 1`**, exact AC-typeplaatvermogen **`Rated Power (kW)`** (`3.6`..`12.0`), **`Allow Curtailment = Aangevinkt`**, **`Poll Interval = 3s`** (LAN/RS-485) of **`5s`** (Wi-Fi), exacte **`Phase Wiring`**, **`Grid Meter Connected?`** (`Aangevinkt` als een DTSU/SDM is bekabeld) en **`Battery Connected? = Aangevinkt`** met de totale **`Battery Capacity (kWh)`**.
3. **Regionale Strategie & Samenwerking met Raedian EV-laadpalen (`Instellingen → Strategie`):**
   - **Vlaanderen (`Flanders Mode`):** Stel `Capacity Peak Limit = 2,5 kW` (of actuele maandpiek) en `Buffer = 200 W` in, en vul eventuele **Groenestroomcertificaten (GSC)** (`€/MWh`) in zodat teruglevering doorgaat tot `-GSC/1000 €/kWh`. De `Self-Consumption`-regeling van Enerlution vlakt huishoudelijke pieken af met batterij-ontlading, terwijl GEMS de EV-laadstroom knijpt voordat een kwartierpiek wordt overschreden.
   - **Nederland (`Netherlands Mode`):** Schakel `Active Inverter Curtailment` (`0,00 €/kWh`) in. Overdag laadt PV eerst de Enerlution-batterij op, voedt daarna **Raedian** EV-laadpalen (`6A–32A`) en thermische relais, en zodra de batterij tijdens negatieve spotprijzen 100% bereikt, regelt GEMS het Enerlution-vermogen in **stappen van 1 Watt** terug zodat de netinjectie naar `0 W` zakt.
   - **Harmonie met Raedian Zonneladen:** Zet **Raedian NEO / NEX / Gemini**-laadpalen op `PV Only (Zon)` of `Eco`. Omdat Enerlution het eerste zonne-overschot achter de meter in de thuisbatterij opneemt, wacht GEMS automatisch met EV-laden tot het resterende injectie-overschot uw EV-startdrempel overschrijdt — zo pendelt er nooit stroom van de thuisbatterij naar de wagen.

---

## 5. Snelle Probleemoplossingsmatrix

| Symptoom | Waarschijnlijke Oorzaak | Oplossing op Locatie |
| :--- | :--- | :--- |
| **Batterijstatus toont `Offline (7)` of `Fault (6)`** | CAN-kabel in `Link/RS485`-poort, fout BMS-protocol of DIP-switches verzet terwijl ingeschakeld | Schakel alle modules volledig UIT, stel de binaire `ADD` DIP-switches in, verbind RJ45 (`Pin 4 CAN-H`, `Pin 5 CAN-L`) van Master/PDU `CAN` naar Omvormer `BMS` en selecteer `Lithium-Ion (CAN)` in de Enerlution App. |
| **HV `HYTH`-omvormer detecteert `GroundHV-2500` niet** | Te weinig HV-blokken in serie, MSD-stekker open of PDU HV-automaat UIT | Plaats het minimumaantal HV-blokken in serie (`≥ 3–4`), vergrendel de oranje MSD-stekker, sluit de PDU HV-automaat en houd PDU `POWER` 2–3s ingedrukt. |
| **PV-vermogen begrensd bij positieve spotprijzen** | Statische Zero-Export nog actief in Enerlution App of onjuiste `Rated Power (kW)` in GEMS | Zet `Active Power / Export Control = Disabled / Unlimited` in de Enerlution App en controleer het exacte AC-vermogen (kW) op de toestelkaart in GEMS. |
| **Batterij laadt uit het net zodra verbruik in huis inschakelt** | `DTSU666` / `SDM630` stroomspoelen (CT's) omgekeerd of fase-/RS-485-draden verwisseld | Richt de CT-pijlen van **Net → Woning/Verbruik** en controleer klem `24 (A+)` & `25 (B-)` op de `DTSU666`. |
