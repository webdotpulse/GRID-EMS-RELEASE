# GEMS: Huawei SUN2000, LUNA2000 & FusionSolar Inbedrijfstellingshandleiding

> 🌐 **Taal / Langue / Language:** [English](../huawei_manual.md) | **Nederlands** | [Français](../fr/huawei_manual.md)

Deze diepgaande veld- en gebruikershandleiding behandelt elke vereiste instelling binnen de **Huawei FusionSolar App** (en het Webportaal) samen met de aanbevolen toestel-, net-, tarief- en batterij-optimalisatieparameters in **GRID-EMS (GEMS)** voor residentiële en commerciële Huawei-installaties.

> [!TIP]
> **Download Afdrukbare Veldhandleiding (PDF):**
> - 📕 **[Huawei SUN2000, LUNA2000 & FusionSolar Handleiding (PDF)](../../manuals/nl/gems-huawei-manual-nl.pdf)**
> - 💻 **[Interactieve Huawei Webgids](../../manuals/nl/huawei.html)**
> - 🛠️ **[GEMS Documentatieportaal](../../manuals/nl/index.html)**

---

## 1. Ondersteund Huawei-ecosysteem & Fysieke Topologieën

GEMS communiceert rechtstreeks lokaal met Huawei-omvormers, thuisbatterijen en energiesensoren via uw LAN of RS-485-bus zonder cloudafhankelijkheid — terwijl de normale rapportage naar de **FusionSolar**-cloud ononderbroken doorloopt.

### 1.1 Overzicht Ondersteunde Huawei-hardware

| Productfamilie | Ondersteunde Huawei-modellen | GEMS Template-ID | Ondersteunde Mogelijkheden |
| :--- | :--- | :--- | :--- |
| **1-Fase Hybride Omvormers** | `SUN2000-2KTL`–`6KTL-L1`, `SUN2000-8KTL`–`10KTL-LC0` | `huawei_inverter` | Actief PV-vermogen (W), kWh-opbrengst, LUNA2000-sturing, actieve PV-terugregeling, fasetelemetrie |
| **3-Fase Hybride Omvormers** | `SUN2000-3KTL`–`10KTL-M1`, `SUN2000-5KTL`–`12KTL-MAP0`, `SUN2000-12KTL`–`25KTL-MB0` | `huawei_inverter` | 3-fasestromen/-spanningen, bidirectionele LUNA2000-sturing, `0,1%` actieve PV-terugregeling |
| **Commerciële Stringomvormers** | `SUN2000-12KTL`–`25KTL-M2/M5`, `SUN2000-30KTL`–`100KTL-M3` | `huawei_inverter` | Zonneproductietelemetrie, 3-fasetelemetrie, actieve vermogensterugregeling |
| **Thuisbatterijopslag (BESS)** | `LUNA2000-5/10/15-S0` (tot 30 kWh dubbele toren), `LUNA2000-7/14/21-S1` (tot 20,7 kWh/toren) | `huawei_inverter` (`Battery Connected?`) | Live SOC %, laad-/ontlaadvermogen W, live BMS dynamische limieten, 10-min hardware deadman-timer |
| **Communicatiegateways** | `SDongleA-05 (WLAN-FE)`, `EMMA-A02`, `SmartLogger3000` | Modbus TCP `:502` | Gedeelde single-socket TCP-verbinding met `250 ms` frame-pacing |
| **Slimme Vermogensmeters** | Ingebouwde meter `EMMA-A02`, `DTSU666-H` (3F), `DDSU666-H` (1F) | `huawei_emma` of via `huawei_inverter` | Netto netafname/-injectie (W), gerichte L1–L3 stromen (A), L1–L3 spanningen (V), afname/injectie kWh |
| **EV-laadpaal (Optioneel)** | **Raedian** NEO / NEX / Gemini (Aanbevolen via Modbus TCP) of Huawei `SCharger-7KS / 22KT` (OCPP 1.6-J) | `raedian_charger` / `huawei_scharger` | Dynamische 6A–32A load balancing, laden op zonne-overschot, 1F/3F fase-omschakeling |

### 1.2 De Juiste Aansluittopologie Kiezen

1. **Topologie A — `SDongleA-05 (WLAN-FE)` via Bekabeld Ethernet + `DTSU666-H` + P1 Slimme Meter (Aanbevolen Gouden Standaard)**
   - Schroef de onderste dop van de `SDongleA-05` los en sluit een **bekabelde Cat5e/Cat6 Ethernet-kabel** aan op de interne RJ45-aansluiting in plaats van 2,4 GHz Wi-Fi. Bekabeld Ethernet voorkomt pakketverlies, slaapstandvertraging van wifi-routers en Modbus-time-outs.
   - Sluit een Fluvius / DSMR **P1-slimme-meterkabel** rechtstreeks aan op een USB-poort van GEMS (`p1_serial`). GEMS gebruikt de P1-meter als facturatienauwkeurige referentie voor het Vlaamse 15-minuten capaciteitstarief en hoofdzekeringsbewaking, terwijl Huawei's eigen `DTSU666-H` direct als autonome hardwareterugval beschikbaar blijft.
2. **Topologie B — Huawei `EMMA-A02` Energy Management Assistant (Modbus TCP via LAN)**
   - Sluit de `EMMA-A02` via Ethernet aan op uw lokale netwerk. Voeg zowel `huawei_emma` (netmeter, TCP-poort `502`, Modbus ID `1`) als `huawei_inverter` (TCP-poort `502`, Modbus ID `1` voor Omvormer 1, `2` voor Omvormer 2) toe met hetzelfde IP-adres van de EMMA. GEMS deelt automatisch **één gepoolde TCP-socket** voor alle toestellen op dat IP-adres.
3. **Topologie C — Directe USB-naar-RS485 Seriële Veldbus (Uitsluitend Zonder Dongle)**
   - **Belangrijk:** Alleen mogelijk wanneer er **geen** `SDongleA-05` of `EMMA-A02` op de omvormer is aangesloten (een geplaatste dongle eist het master-beheer over de interne RS-485-bus op).
   - Verbind een afgeschermde twisted-pair-kabel (`9600 bps, 8N1`, Slave ID `1`) vanaf een USB-RS485-adapter op GEMS (vast pad `/dev/serial/by-id/...`) naar de COM-connector van de omvormer:
     - **`SUN2000-2KTL–6KTL-L1` (1-fasig):** `Pin 2` = `RS485A+` (`485A1`), `Pin 1` = `RS485B-` (`485B1`). *(Pin 3 & 4 blijven gereserveerd voor de DDSU666-H).*
     - **`SUN2000-3KTL–10KTL-M1` (3-fasig):** `Pin 1` = `RS485A+` (`485A1-1`), `Pin 3` = `RS485B-` (`485B1-1`). *(Pin 7 & 9 blijven gereserveerd voor de DTSU666-H).*
     - **`SUN2000-MAP0 / MB0 / LC0`:** Speciaal `485A1 / 485B1` EMS-klemmenpaar.
4. **Topologie D — `SUN2000 + LUNA2000` Zonder Huawei Power Sensor (`P1-Meter-gestuurde Modus`, Zonder EMMA / Zonder `DTSU666-H`)**
   - Heeft uw Huawei hybride omvormer een `LUNA2000`-batterij **zonder** `EMMA-A02` en **zonder** fysieke `DTSU666-H / DDSU666-H`-meter? Voeg dan uw digitale P1-meter toe in GEMS (`p1_serial`) en laat **`Grid Meter Connected?` uitgevinkt** op de `Huawei Hybrid Inverter`.
   - Zet in FusionSolar Installer Commissioning **`Charge from AC` = `Enable`**, **`Grid Charge Cutoff SOC` = `100%`** en **`Max Charge / Discharge Power` = Maximaal hardwarevermogen**. Als FusionSolar *Maximum Self-Consumption* blokkeert omdat er geen Huawei-meter aanwezig is, zet **Working Mode** dan op **`Fixed Charge/Discharge`** *(met nul geplande tijdsloten)* of **`Fully Fed to Grid`** — GEMS stuurt vervolgens al het laden op zonne-overschot, ontladen voor huisverbruik en tariefarbitrage rechtstreeks aan vanuit de realtime P1-meting (waarbij snelle `1s` P1-metingen automatisch worden gesynchroniseerd met de `10s` `SDongleA-05` Modbus-cyclus om pendelen te vermijden en direct terug te regelen bij netinjectie).
5. **Waarom de Ingebouwde Omvormer-Wi-Fi (`Poort 6607 / Unit ID 0`) Wordt Afgeraden**
   - Het interne inbedrijfstellings-accesspoint (`SUN2000-<Serienummer>`, poort `6607`, Unit ID `0`) is bedoeld voor korte installateursessies en niet voor continue 24/7 EMS-aansturing. Gebruik altijd een `SDongleA-05`, `EMMA-A02`, `SmartLogger3000` of directe `RS-485`-bekabeling.

---

## 2. Verplichte Firmware- & Netwerkvereisten

### 2.1 Minimale & Aanbevolen Firmwareversies

| Huawei-hardware | Minimale Firmware | Aanbevolen Firmware | Belangrijkste Vereiste |
| :--- | :--- | :--- | :--- |
| **`SDongleA-05 (WLAN-FE)`** | `V100R001C00SPC126` / `V200R022C10SPC108` | `V200R022C10SPC118` of nieuwer | Ontgrendelt onbeperkt Modbus TCP & betrouwbare register-writes |
| **`SUN2000-L1` (1-fasig)** | `V200R001C00SPC130` | `V200R001C00SPC142` of nieuwer | Tijdsduur-gebaseerde geforceerde laad-/ontlaadregisters |
| **`SUN2000-M1` (3-fasig)** | `V100R001C00SPC153` | `V100R001C00SPC165` of nieuwer | LUNA2000 AC-laden & `0,1%` actieve vermogensterugregeling |
| **`SUN2000-LC0 / MAP0 / MB0`** | `V200R023C10SPC100` | Nieuwste `SPC`-release | Volledige ondersteuning van S1 BMS-vermogensgrenzen |
| **`LUNA2000-S0 / S1`** | `V100R002C00SPC119` (S0) | `V100R002C00SPC624+` (S0) / Nieuwste (S1) | Live rapportage van dynamische laad-/ontlaadlimieten |
| **`EMMA-A02`** | `V100R023C10SPC100` | `V100R023C10SPC120` of nieuwer | Onversleutelde poort `502` + exacte GEMS IPv4-whitelist |

### 2.2 Vaste IPv4-reserveringen & Eén-Master-regel

> [!IMPORTANT]
> 1. **Slechts Één Modbus TCP-client Tegelijk:** Zowel de `SDongleA-05` als de `EMMA-A02` accepteren **slechts één gelijktijdige Modbus TCP-client** op poort `502`. Schakel eventuele tweede uitleesscripts, domoticapoller-integraties of directe laadpaal-Modbus-pollers uit voordat u GEMS in bedrijf stelt.
> 2. **DHCP-reserveringen / Vaste IP-adressen:** Stel in uw router vaste DHCP MAC-reserveringen in voor zowel de **GEMS-controller** (`eth0`) als de **Huawei SDongleA-05 / EMMA-A02**. Op de `EMMA-A02` filtert poort `502` strikt op het IPv4-adres van de GEMS-client — wijzigt het IP-adres van GEMS na een routerherstart, dan weigert EMMA de verbinding.

---

## 3. Stapsgewijze Configuratie in de Huawei FusionSolar App

Klantaccounts ("Eigenaarsweergave") kunnen geen Modbus-beveiliging of netstuurparameters wijzigen. Maak lokaal verbinding via **Device Commissioning** met **Installer**-rechten.

### 3.1 Lokale Device Commissioning Openen
1. **Schakel Mobiele Data UIT** op uw smartphone (houd Wi-Fi AAN zodat Android/iOS het verkeer niet wegleidt van de lokale hotspot van de omvormer).
2. Open de **FusionSolar App** -> tik op **Ik (Me)** of **Services** -> kies **Inbedrijfstelling apparaat (Device Commissioning)**.
3. Scan de QR-code op de zijkant van de **SUN2000-omvormer** (of op de voorzijde van de **EMMA-A02**).
4. Kies **Installateur (Installer)** en log in met de Huawei-installateursgegevens van de installatie.

### 3.2 Modbus TCP Ontgrendelen op `SDongleA-05` (Topologie A)
1. Navigeer naar: **`Settings -> Communication Configuration -> Dongle Parameter Settings -> Modbus-TCP`**.
2. Wijzig **Connection** van *Disabled* naar **`Enable (unrestricted)`** (of *Enable (restricted)* ingesteld op het exacte vaste IPv4-adres van uw GEMS-controller).
3. Tik op **Confirm / Save**.
4. Controleer onder **`Settings -> Communication Configuration -> RS485_1`**: bevestig **Protocol** = `MODBUS`, **Baud Rate** = `9600` en noteer het **Communication Address** (standaard `1`; gekoppelde slave-omvormers gebruiken `2`, `3`, enz.).
5. *(Alternatief op afstand via pc)*: Open in het **FusionSolar Webportaal** (Installateurslogin) **Plants -> Device Management -> Selecteer SDongle -> Configuration -> Connection Parameters -> Modbus TCP -> `Enable (unrestricted)`**.

### 3.3 Modbus TCP Ontgrendelen op `EMMA-A02` (Topologie B)
1. Maak in **Device Commissioning** als **Installer** verbinding met de **EMMA-A02**.
2. Navigeer naar: **`Settings -> Communication Configuration -> Modbus TCP`**.
3. Zet **Connection** = **`Enable`**.
4. Zet **TLS Encryption** = **`Disable` (UIT)** *(Verplicht voor standaard Modbus TCP op poort `502`)*.
5. Stel **Client IP Address** in op het **exacte vaste IPv4-adres van uw GEMS-controller** (bijv. `192.168.1.50`). **Vul nooit `0.0.0.0` in** — de EMMA-A02 wijst wildcard-adressen direct af met `TCP RST`.
6. Laat onder de energiemodus van EMMA de **Working Mode** op **`Maximum Self-Consumption`** staan en schakel EMMA's eigen cloud-AI / Time-of-Use-schema's **Uit (Disabled)** zodat EMMA nooit tegenstrijdige batterijcommando's verstuurt.

### 3.4 Verplichte LUNA2000-batterijparameters in FusionSolar

Ga naar **`Settings -> Energy Control`** (of **`Device Monitoring -> ESS (LUNA2000) -> Parameter Settings`**) en stel alle onderstaande parameters in:

| FusionSolar-parameter | Vereiste Instelling | Technische Reden |
| :--- | :--- | :--- |
| **Working Mode** | **`Maximum Self-Consumption`** *(Met Huawei-meter / EMMA)*; **`Fixed Charge/Discharge` (0 tijdsloten)** of **`Fully Fed to Grid`** *(Meterloze Topologie D indien Self-Consumption geblokkeerd is)* | Vormt de schone hardwarebasis (activeer nooit interne *Time-of-Use (TOU)*-timers, deze werken GEMS tegen). Kies op Topologie D zonder Huawei-meter `Fixed Charge/Discharge` met een leeg tijdschema zodat GEMS volledige Modbus-sturing heeft. |
| **Charge from AC** *(Laden uit net)* | **`Enable`** | Veroorzaakt *geen* spontaan netladen tijdens normaal zelfverbruik, maar geeft firmwaretoestemming zodat GEMS geforceerd kan bijladen tijdens negatieve/goedkope spoturen en in de winter. |
| **Grid Charge Cutoff SOC** | **`100 %`** | Voorkomt dat de Huawei-firmware het netladen voortijdig afbreekt op bijv. 80% wanneer GEMS tijdens negatieve prijzen op 95%–100% mikt. GEMS bewaakt per regel zelf de exacte doel-SOC. |
| **Maximum Charge Power** | **Maximaal hardwarevermogen** *(bijv. `2500 W`, `5000 W`, `10500 W`)* | Garandeert volledige laadsnelheid voor zonnepieken en negatieve stroomprijzen. |
| **Maximum Discharge Power** | **Maximaal hardwarevermogen** *(bijv. `2500 W`, `5000 W`, `10500 W`)* | Garandeert maximaal ontlaadvermogen om plotselinge Vlaamse kwartierpieken direct op te vangen. |
| **End-of-Charge SOC** | **`100 %`** | Maakt periodieke 100% LiFePO4 celbalancering mogelijk zodat de SOC-berekening van het BMS nauwkeurig blijft. |
| **End-of-Discharge SOC** *(Min SOC)* | **`5 % – 10 %`** *(Netgekoppeld)* / **`15 % – 20 %`** *(met Backup Box)* | Gebruik `5%` in lente/zomer voor maximale bruikbare opslag, `10%` in de winter om diepe slaapstand te vermijden, of `15%–20%` wanneer een Huawei Backup Box / SmartGuard is geplaatst. |

### 3.5 Actieve Vermogensregeling & Controle van Stroomspoelen (CT's)
- **Active Power Control Mode** (`Settings -> Power Adjustment -> Active Power Control`): Zet op **`Unlimited` (`No limit`)**, tenzij de netbeheerder wettelijk een vaste injectielimiet oplegt. Statische *Zero-Export* in FusionSolar blokkeert rendabele terugleveruren en Vlaamse Groenestroomcertificaten (GSC) — laat FusionSolar op `Unlimited` staan en laat GEMS dynamisch terugregelen bij negatieve prijzen!
- **Closed-Loop Controller**: Zet op **`Inverter`** bij opstellingen met één omvormer (snelste regellus) of op **`SDongle / SmartLogger`** bij Master-Slave cascades met meerdere omvormers.
- **Polariteitscontrole Stroomspoelen (`DTSU666-H` / `DDSU666-H`)**: Schakel ter controle een weerstandsbelasting van ~2 kW (bijv. waterkoker) in en controleer in het live stroomschema van FusionSolar dat de netafname op de betreffende fase met +2 kW stijgt en dat de fysieke CT-pijlen (`K -> L`) **van de netmeter richting de woningverbruikers** wijzen.

---

## 4. Huawei-hardware Toevoegen in GEMS

Verbreek de verbinding van uw smartphone met de tijdelijke wifi-hotspot van de omvormer, open GEMS in uw webbrowser, ga naar **Instellingen**, klik op het **hangsloticoon 🔒** en voer uw **Installateurs-PIN** in om de **Gecertificeerde installateursmodus** te ontgrendelen.

### 4.1 Stap 1 — Voeg Uw Primaire Netmeter toe (`Instellingen -> Toestellen -> Slimme Meter`)
- **Met Fluvius / DSMR Digitale Meter (Aanbevolen):** Voeg **`P1 Smart Meter (USB/Serial)`** (`p1_serial`) toe via de gedetecteerde vaste `/dev/serial/by-id/...`-knop. GEMS gebruikt automatisch de P1-meter als hoofdbron voor kwartierpiekbewaking in perfecte afstemming met uw Huawei-omvormer.
- **Met Huawei `EMMA-A02` (Zonder P1-poort):** Voeg **`Huawei EMMA-A02 / DTSU666-H Smart Power Sensor`** (`huawei_emma`) toe met het vaste IP-adres van de EMMA, TCP-poort `502` en Modbus ID `1` (of `/dev/serial/by-id/...` met Modbus ID `11` voor een losse RS-485 `DTSU666-H`).

### 4.2 Stap 2 — Voeg `Huawei Hybrid Inverter` toe (`Instellingen -> Toestellen -> Omvormer / Zon`)

| Veld in GEMS | Aanbevolen Waarde | Belang |
| :--- | :--- | :--- |
| **Toestelnaam** | `Huawei SUN2000 + LUNA2000` | Duidelijke naam in grafieken op het Dashboard, in het Logboek en in PDF-rapporten. |
| **Hardwaretemplate** | `Huawei Hybrid Inverter` (`huawei_inverter`) | Activeert `250 ms` SDongle frame-pacing, live dynamische BMS-limieten en de 10-min deadman-veiligheidstimer. |
| **IP-adres of Seriële poort** | Vast IP van SDongle / EMMA (bijv. `192.168.1.120`) of `/dev/serial/by-id/...` | Voer het gereserveerde LAN IPv4-adres in (of het vaste seriële pad voor Topologie C). |
| **TCP-poort** | `502` | Standaard Modbus TCP-poort voor `SDongleA-05`, `EMMA-A02` en `SmartLogger3000`. |
| **Modbus ID** | `1` *(standaard)*; `2, 3...` *(gecascadeerde slaves)* | Moet exact overeenkomen met het `RS485_1 Communication Address` in FusionSolar (`1`, `2` of `16`). |
| **Rated Power (kW)** | Exact AC-typeplaatvermogen in kW (bijv. `4.6`, `5.0`, `10.0`) | **Verplicht** zodat GEMS bij terugregeling exacte setpoints met `0,1%` resolutie berekent. |
| **Allow Curtailment** | **`Aangevinkt (✓)`** | Staat GEMS toe het uitgangsvermogen van de SUN2000 terug te regelen bij negatieve terugleverprijzen. |
| **Poll Interval (seconden)** | **`10`** *(SDongleA-05)* / **`5`** *(EMMA-A02 of RS-485)* | GEMS kiest automatisch `10s` bij Huawei om de processor van de SDongleA-05 te ontzien en FusionSolar-cloudsync soepel te houden. |
| **Phase Wiring** | `Three-Phase — L1-L2-L3` *(M1/MAP0/MB0)* of exacte fase `L1 / L2 / L3` *(1F L1)* | Bij een 1-fasige `SUN2000-L1` op een 3-fasenaansluiting garandeert de juiste fasetoewijzing exacte hoofdzekeringsbewaking per fase. |
| **Grid Meter Connected?** | **`Aangevinkt (✓)`** indien DTSU666-H / EMMA aanwezig; **`Uitgevinkt (☐)`** zonder Huawei-meter | Aanvinken zodra een Huawei-meter aan de omvormer hangt. Enkel uitvinken wanneer uitsluitend een P1-meter het zelfverbruik van de LUNA2000 aanstuurt. |
| **Battery Connected?** | **`Aangevinkt (✓)`** indien LUNA2000 aangesloten | Activeert SOC- & vermogensuitlezing én bidirectionele sturing van de LUNA2000. |
| **Battery Capacity (kWh)** | Totaal bruikbare capaciteit in kWh (bijv. `5.0`, `10.0`, `15.0`, `6.9`, `13.8`, `20.7`) | Nodig voor de **Dynamic 24h Forecast**-oplosser en de berekening van de winter-bijlaadduur. |

---

## 5. GEMS Instellen voor Optimale Werkingscondities

### 5.1 Locatie, Zonneprognose & Fysieke Netlimieten (`Instellingen -> Strategie`)
1. **Geografische Locatie:** Stel de `Time Zone` (`Europe/Brussels` of `Europe/Amsterdam`) in, vul het straatadres in, klik op **Lookup Lat/Lon** en vink **`Enable Open-Meteo Solar Forecast Ingestion`** aan. Zo laadt GEMS de LUNA2000 's nachts nooit onnodig uit het net vlak voor een zonnige dag.
2. **Netaansluiting & Limieten:** Stel de nominale hoofdzekering en faselimiet in op uw automaat (bijv. `25 A`, `32 A`, `40 A`), kies het exacte netsysteem (`Single Phase 230V`, `Three Phase 400V` of `Three Phase 230V Delta`) en laat de terugvalstroom bij meteruitval staan op **`0 A — Pause EV Charging`**.

### 5.2 Regionale Strategieprofielen

- **Vlaanderen / België (`Flanders Mode — Peak Shaving`):**
  - `Optimization Mode`: **`Flanders Mode (Peak Shaving)`**
  - `Capacity Peak Limit (kW)`: **`2,5 kW`** (wettelijk minimum) of **`3,0–3,5 kW`** voor woningen met warmtepomp + EV. Het **Slim Adaptief Plafond** verhoogt automatisch mee als er tijdens de kalendermaand toch een hogere 15-minuten piek optreedt.
  - `Peak Shaving Buffer (W)`: **`200 W`** bij bekabeld Ethernet / EMMA-A02 (**`250 W`** als de SDongleA-05 via Wi-Fi verbonden is).
  - `Ramp-up Hysteresis (W)`: **`500 W`**.
  - `Active Inverter Curtailment`: **`Aangevinkt (✓)`**, `Base Export Price Threshold`: **`0,00 €/kWh`**, en **`Green Power Certificates (GSC)`**: zet op **`€ 0`** voor nieuwe PV-installaties, of op uw exacte certificaatwaarde (`€ 250`, `€ 350`, `€ 450`) zodat de SUN2000 nooit terugregelt zolang groenestroomcertificaten de export winstgevend houden!
- **Nederland (`Netherlands Mode — Smart Saldering`):**
  - `Optimization Mode`: **`Netherlands Mode (Smart Saldering)`**
  - `Active Inverter Curtailment`: **`Aangevinkt (✓)`**, `Base Export Price Threshold`: **`0,00 €/kWh`** (of uw drempel voor terugleverkosten). Zonne-overschot vult eerst de LUNA2000 en EV-laadpalen en regelt de SUN2000 daarna vloeiend terug bij negatieve vergoedingen.
- **Vast of Dubbel Tarief (`Eco Mode`):**
  - `Optimization Mode`: **`Eco (Max Self-Consumption)`** — maximaliseert direct zon-zelfverbruik en hoofdzekeringsbewaking zonder onnodige netcycli.

### 5.3 Optimale LUNA2000-arbitrage, Slijtagebescherming & Winterinstellingen
1. Stel onder **`Instellingen -> Energiecontract`** uw exacte energieleverancier, netbeheerder (`Fluvius`, `ORES`, `RESA`, `SIBELGA` of NL) en btw (`6%` BE / `21%` NL) in.
2. Stel onder **`Instellingen -> Strategie -> Battery Grid Charging & Arbitrage`** in:
   - **`Charging Strategy Mode`**: **`Dynamic 24h Forecast (Solar & Load modeling)`** (optimaal voor dynamische Day-Ahead contracten).
   - **`Battery Wear Cost (€/kWh)`**: **`0,04 €/kWh`** (`0,03–0,05 €/kWh`). Verrekent LiFePO4-celslijtage en ~12%–15% AC-DC-AC omzettingsverliezen zodat GEMS uw LUNA2000 nooit onnodig belast voor minimale prijsverschillen.
   - **`Grid Charge Ceiling (€/kWh)`**: **`0,08 €/kWh`** (of `0,00 €/kWh` indien u enkel bij negatieve stroomprijzen uit het net wilt laden).
   - **`Grid Discharge Floor (€/kWh)`**: **`0,35 €/kWh`** (bewaart batterijcapaciteit voor eigen woningverbruik, tenzij de terugleverprijs extreem hoog piekt).
   - **`Winter / Low-Solar Grid Charge Fallback`**: **`Aangevinkt (✓)`** met `Low SoC Trigger` = **`25%`**, `Fallback Target SoC` = **`65%`** en `Cheapest Hours` = **`2 uur`** (`3 uur` bij LUNA2000-torens ≥15 kWh zodat het laadvermogen ruim onder het Vlaamse piekplafond van 2,5 kW blijft).

### 5.4 Samenwerking met EV-laadpalen (Raedian) Zonder de LUNA2000 Leeg te Trekken
- Verbind uw EV-laadpaal (bijv. **Raedian NEO / NEX / Gemini**) via lokaal **Modbus TCP** met GEMS (`Instellingen -> Toestellen -> EV-laadpaal`).
- Gebruik overdag `PV Only (Zon)` of `Eco / Slim` op het Dashboard voor laden op zonne-overschot.
- Wilt u 's nachts tijdens goedkope daluren uw wagen opladen **zonder dat de LUNA2000-thuisbatterij in de auto leegloopt**? Voeg dan onder **`Instellingen -> Strategie -> Regelgebaseerde Batterij-kostenoptimalisatie`** een regel toe met actie **`Hold (Vasthouden / Niet ontladen)`** voor uw nachtelijke EV-laadvenster (bijv. `01:00 – 05:00`), zodat uw LUNA2000 vol blijft voor de dure ochtendpiek.

---

## 6. Controlelijst na Oplevering & Probleemoplossing

### 6.1 Verificatie na Inbedrijfstelling
1. Controleer dat `Huawei Hybrid Inverter` op **`● Online`** staat onder `Instellingen -> Verbonden Toestellen` en bekijk live spanning, SOC %, vermogen en gedetecteerde **Dongle- / EMMA- / Omvormer- / Batterij-firmwareversies** rechtstreeks op de toestelkaart en via **Debug** (ook automatisch zichtbaar onder **Verbonden Modbus- & Netwerkhardware** in **GRID-EMS-SERVER**).
2. Schakel een huishoudtoestel van ~2 kW in en controleer op het **Dashboard** dat het Woningverbruik en de Netafname / Batterij-ontlading correct meebewegen.
3. Controleer het **Logboek** op `HuaweiInverterPoller` en verifieer dat de uitlezing foutloos verloopt zonder time-outs of ongeldige registermeldingen.
4. Controleer dat de **FusionSolar App** van de klant elke 5 minuten telemetrie blijft bijwerken.
5. Exporteer een JSON-configuratieback-up (`Instellingen -> Systeeminformatie -> Configuratie exporteren (.json)`) en klik op het hangsloticoon 🔒 om de **Gecertificeerde installateursmodus** weer te vergrendelen.

### 6.2 Snelle Probleemoplossingsmatrix

| Symptoom | Oorzaak | Oplossing |
| :--- | :--- | :--- |
| **`Connection refused` / `TCP RST` op `:502`** | Modbus TCP uitgeschakeld in FusionSolar, of EMMA-A02 TLS AAN / verkeerd client-IP | Zet `Modbus-TCP = Enable (unrestricted)` op de SDongle; schakel op de EMMA-A02 TLS uit en whitelist het exacte IPv4-adres van GEMS (nooit `0.0.0.0`). |
| **Regelmatige `i/o timeout` / `request timed out` / `server device busy`** | Tweede Modbus-client op `:502`, zwak 2,4 GHz Wi-Fi-signaal op `SDongleA-05` of Poll Interval `< 8s` | Stop elke tweede Modbus-client, sluit een netwerkkabel aan op de `SDongleA-05` en houd het `Poll Interval` in GEMS op **`10s`**. |
| **TCP verbindt, maar uitlezen faalt (`Slave failure`)** | Afwijkend `Modbus ID` | Stem het `Modbus ID` in GEMS af op het `RS485_1 Communication Address` in FusionSolar (meestal `1`, soms `2` of `16`). |
| **LUNA2000 negeert geforceerd netladen of meldt `server device failure`** | `Charge from AC` staat uit, lage cutoff SOC, meterloze Topologie D staat in een meterafhankelijke modus of verouderde SDongle/SUN2000-firmware | Zet `Charge from AC = Enable`, `Grid Charge Cutoff SOC = 100%`, `Max Charge/Discharge Power = Rated Max`, vink `Grid Meter Connected?` uit in GEMS als er geen Huawei-meter is aangesloten (kies `Fixed Charge/Discharge` met 0 tijdsloten indien nodig) en update de SDongle naar `V200R022C10SPC118+`. |
| **Batterij laadt op zodra verbruik in huis stijgt** | Stroomspoelen (`DTSU666-H`) omgekeerd of fasespanningsdraden verwisseld | Controleer dat de CT-pijlen (`K -> L`) van **Net -> Woning** wijzen en dat de spanningsdraden `L1/L2/L3` exact overeenkomen met `CT-A/B/C`. |
| **Offline na een Huawei-firmware-update** | Firmware-update heeft Modbus TCP op de SDongle teruggezet naar *Disabled* | Schakel `Modbus-TCP = Enable (unrestricted)` opnieuw in via de FusionSolar-installateursinstellingen. |
