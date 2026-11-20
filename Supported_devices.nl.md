# Ondersteunde Toestellen & Hardware-integratiegids

> 🌐 **Taal**: [🇬🇧 English (`Supported_devices.md`)](Supported_devices.md) | **🇳🇱 Nederlands** | [🇫🇷 Français (`Supported_devices.fr.md`)](Supported_devices.fr.md)

> **GEMS (Grid Energy Management System)** — Volledig overzicht van hardwarecompatibiliteit, registertelemetrie, stuurbare setpoints en praktische automatiseringsmogelijkheden voor alle 172 hardwareprofielen (184 geregistreerde templates).

---

## Inhoudsopgave

1. [Overzicht & Systeemarchitectuur](#overzicht-systeemarchitectuur)
2. [Wat GEMS Concreet met Toestellen Doet](#wat-gems-concreet-met-toestellen-doet)
3. [Overzichtsmatrix per Categorie](#overzichtsmatrix-per-categorie)
   - [Zonne- & Hybride Omvormers (37 Toestellen)](#overzichtstabel-zonne--hybride-omvormers-37-toestellen)
   - [Toegewijde Batterijopslagsystemen (18 Toestellen)](#overzichtstabel-toegewijde-batterij-energieopslagsystemen-bess-18-toestellen)
   - [EV-laadpalen & Wallboxen (61 Toestellen)](#overzichtstabel-elektrische-voertuig-ev-laadpalen-wallboxen-61-toestellen)
   - [Slimme Netmeters & Energie-analyzers (40 Toestellen)](#overzichtstabel-slimme-netmeters-energie-analyzers-40-toestellen)
   - [Slimme Relais & Thermische Actuatoren (12 Toestellen)](#overzichtstabel-slimme-relais-thermische-actuatoren-12-toestellen)
4. [Gedetailleerde Specificaties per Toestel](#gedetailleerde-specificaties-per-toestel)
   - [1. Zonne- & Hybride Omvormers (37 Toestellen)](#1-zonne--hybride-omvormers-37-toestellen)
   - [2. Toegewijde Batterijopslagsystemen (18 Toestellen)](#2-toegewijde-batterij-energieopslagsystemen-bess-18-toestellen)
   - [3. EV-laadpalen & Wallboxen (61 Toestellen)](#3-elektrische-voertuig-ev-laadpalen-wallboxen-61-toestellen)
   - [4. Slimme Netmeters & Energie-analyzers (40 Toestellen)](#4-slimme-netmeters-energie-analyzers-40-toestellen)
   - [5. Slimme Relais & Thermische Actuatoren (12 Toestellen)](#5-slimme-relais-thermische-actuatoren-12-toestellen)
5. [Communicatieprotocollen & Netwerkconfiguratie](#communicatieprotocollen-netwerkconfiguratie)

---

## Overzicht & Systeemarchitectuur

GEMS is een lichtgewicht, uiterst responsief en volledig UI-gestuurd Energiebeheersysteem (EMS), geoptimaliseerd voor edge-uitrol op Raspberry Pi-hardware (Debian/Linux). Het volledige systeem werkt **local-first** en voert elke seconde een regelcyclus in gesloten lus uit. Er zijn geen YAML-bestanden of configuratiescripts nodig: alle toesteldetectie, configuratie, kalibratie en aansturing verlopen volledig via de webinterface.

### Commerciële Ondersteuningsniveaus & Badges
Elke ingebouwde hardwaredriver in GEMS is ingedeeld in een duidelijk commercieel ondersteuningsniveau en functieprofiel:
- **Geverifieerd (`verified`)**: In het veld gevalideerde Tier-1 commerciële drivers (waaronder de referentieplatformen **Solis** en **RAEDIAN**, standaard SunSpec-omvormers, DSMR/P1-meters, Eastron/Carlo Gavazzi/Chint/Siemens Modbus-meters, OCPP 1.6-J laadpalen en Shelly/SG-Ready relais). Standaard zichtbaar tijdens ingebruikname.
- **Experimenteel (`experimental`)**: Secundaire regionale hardware en cloud-gekoppelde drivers, beschikbaar via de schakelaar **Experimentele drivers tonen** onder **Instellingen &rarr; Toestellen** (wanneer de **Installateursmodus** ontgrendeld is).
- **Enkel uitlezing (`monitor_only`)**: Alleen-lezen telemetriedrivers voor hardware met gesloten stuurregisters. GEMS neemt live vermogen, energie en fasestromen mee in de energiebalans van de site zonder onveilige schrijfacties uit te voeren.

### Gestandaardiseerde Hardware-functieprofielen
Elke hardware-integratie in GEMS ontsluit een gestandaardiseerde set telemetrie- en sturingsmogelijkheden:

- **Universele Telemetrie-inname**: Ondersteund op alle 168 hardwareprofielen (180 geregistreerde templates), met uniforme verbindingsbewaking, realtime actief vermogen (W), batterijvermogen (W), netuitwisseling (W), cumulatieve energie (kWh) en batterij-SOC (%).
- **Dynamische EV-stroom- & Fasesturing**: Geïmplementeerd door slimme EV-laadpalen voor realtime stroommodulatie (6A–32A) en geautomatiseerde 1-fase / 3-fasen contactoromschakeling.
- **Bidirectionele Batterijsturing & Live BMS-limieten**: Geïmplementeerd door hybride omvormers en BESS-platformen voor geforceerd laden/ontladen met strikte inachtneming van live BMS-temperatuur- en stroomlimieten.
- **Actieve Zonne-curtailment**: Geïmplementeerd door zonne-omvormers voor proportionele terugregeling tijdens uren met negatieve spotprijzen, netbeheerder-telecontrole en Nederlandse zero-export toepassingen.
- **Slimme Relais- & SG-Ready Sturing**: Geïmplementeerd door slimme contactoren, warmtepompinterfaces en lineaire PV-diverters voor thermische buffering van sanitair warm water en ruimteverwarming.
- **Richtingsgevoelige Fasestroom- & Spanningsmeting**: Geïmplementeerd door slimme meters en geavanceerde laadpalen voor rapportage van fasestromen ($I_{L1}, I_{L2}, I_{L3}$) en fasespanningen ($V_{L1}, V_{L2}, V_{L3}$) ten behoeve van hoofdzekeringbeveiliging.
- **Uitgebreide Nuts- & Kwartierpiekbemetering**: Geïmplementeerd door DSMR/P1- en nutsmeters voor opvolging van injectietellers, gekoppeld gasverbruik ($m^3$) en de officiële voortschrijdende 15-minutenpiek voor het capaciteitstarief (W).
- **Multi-connector EVSE-coördinatie**: Geïmplementeerd door dubbele laadstations (zoals RAEDIAN Gemini) voor onafhankelijke bemetering en gecoördineerde stroomverdeling over meerdere laadaansluitingen.

---

## Wat GEMS Concreet met Toestellen Doet

GEMS brengt alle gekoppelde toestellen samen in één intelligent energie-ecosysteem. Hieronder staan de concrete automatische acties die de GEMS-strategie-engine in de praktijk uitvoert:

### 1. 🌞 Eco-modus (100% Zelfverbruik van Zonne-energie)
- **Gedrag**: De engine bewaakt continu het ogenblikkelijke zonne-overschot achter de meter.
- **Actie**: Overtollig zonnevermogen wordt in strikte prioriteitsvolgorde verdeeld:
  1. Eerst wordt de thuisbatterij (BESS) opgeladen tot het ingestelde doelpercentage.
  2. Vervolgens moduleert GEMS de EV-laadstroom traploos van 6A tot 32A (of schakelt van 1-fase naar 3-fasen) om het resterende overschot op te nemen.
  3. Tot slot activeert GEMS slimme relais voor SWW-boilers, PV-diverters of SG-Ready warmtepompen.
- **Resultaat**: Voorkomt teruglevering tegen lage terugleververgoedingen of terugleverkosten en maximaliseert het directe verbruik van eigen groene stroom.

### 2. 🇧🇪 Vlaams Capaciteitstarief Piekafvlakking & Dynamisch Adaptief Plafond
- **Gedrag**: Voorkomt hoge maandelijkse kosten voor het Vlaams *Capaciteitstarief* door het gemiddelde netverbruik tijdens elk gesynchroniseerd kwartierblok (15 minuten) realtime te voorspellen.
- **Actie**: Zodra de geprojecteerde kwartierpiek het ingestelde plafond min veiligheidsmarge nadert:
  1. Regelt GEMS EV-laadpalen onmiddellijk terug naar 6A of pauzeert de laadsessie (0A).
  2. Stuurt GEMS de hybride thuisbatterij aan om vermogen in de woning te ontladen en de piek op te vangen.
  3. Schakelt GEMS niet-kritische slimme relais tijdelijk uit.
- **Dynamisch Adaptief Plafond**: Ontstaat er tijdens de maand toch een onvermijdelijke huishoudelijke piek (bijv. 4,8 kW door gelijktijdig koken en bakken), dan verhoogt GEMS het operationele plafond automatisch tot deze reeds geregistreerde maandpiek voor de rest van de kalendermaand. Zo laadt de wagen sneller op zonder één euro extra capaciteitstarief te veroorzaken.

### 3. 🇳🇱 Nederland Zero-Export & Zonne-curtailment
- **Gedrag**: Beschermt Nederlandse huishoudens en bedrijven tegen terugleverkosten en netcongestie na afbouw van de salderingsregeling.
- **Actie**: Geeft voorrang aan lokaal batterijladen en EV-absorptie. Wanneer de opslag vol is en de netinjectie de ingestelde aansluitlimiet overschrijdt, schrijft GEMS rechtstreeks begrenzingssetpoints (`SetActivePowerLimit`) naar de zonne-omvormers om teruglevering exact te beperken of naar nul te brengen.

### 4. 💶 Bescherming tegen Negatieve Spotprijzen & Vlaams GSC-subsidieschild
- **Gedrag**: Beschermt gebruikers met dynamische energiecontracten (EPEX Spot Day-Ahead) tegen het betalen van negatieve terugleverprijzen op zonnige uren met lage marktvraag.
- **Actie**: Regelt zonne-omvormers automatisch terug zodra de dynamische injectieprijs onder `min_profitable_export_price` zakt.
- **Groenestroomcertificaten (GSC) Subsidieschild**: Voor bestaande Vlaamse PV-installaties met groenestroomcertificaten (bijv. €250/MWh of €0,25/kWh) zou blind uitschakelen bij licht negatieve prijzen tot verlies van waardevolle GSC-inkomsten leiden. GEMS berekent daarom automatisch de effectieve drempel:
  $$\text{Effectieve Curtailmentdrempel} = \text{min\_profitable\_export\_price} - \frac{\text{gsc\_value\_eur\_mwh}}{1000.0}$$
  Met een certificaatwaarde van €250/MWh houdt GEMS de zonne-injectie actief tot **-€0,250/kWh** en grijpt pas in wanneer de negatieve marktprijs groter wordt dan de subsidieopbrengst.

### 5. 🔋 EPEX Day-Ahead Dynamische Batterij-arbitrage
- **Gedrag**: Combineert Day-Ahead elektriciteitsprijzen (dagelijks opgehaald om 14:00 CET) met 24-uurs Open-Meteo instralingsvoorspellingen.
- **Actie**:
  - **Geforceerd Netladen**: Laadt de thuisbatterij op vanuit het net tijdens de goedkoopste of negatieve uren van de dag (bijv. 02:00–05:00 of negatieve middaguren) of tijdens dalvensters van de energieleverancier.
  - **Piekontlading**: Bewaart of ontlaadt batterij-energie tijdens dure avondpiekuren (18:00–21:00) zodat de woning geen dure netstroom hoeft af te nemen.

### 6. 🚗 Slim EV-laden (Goedkoopste Uren Boost)
- **Gedrag**: Analyseert automatisch de 24-uurs EPEX-prijscurve om de $N$ goedkoopste uren van het etmaal te selecteren (`smart_ev_cheapest_hours`).
- **Actie**: Verhoogt het EV-laadvermogen naar maximaal vermogen (16A of 32A) tijdens deze voordeligste uren en pauzeert (0A) tijdens dure uren, tenzij een actief laadschema voorrang krijgt.

### 7. ⚡ Dynamische Fasebalancering (DLB) & Hoofdzekeringbeveiliging
- **Gedrag**: Bewaakt continu de individuele fasestromen ($I_{L1}, I_{L2}, I_{L3}$) op de slimme meter ten opzichte van de nominale hoofdzekering van de aansluiting (`grid_nominal_current_a`, bijv. 25A, 32A, 40A of 63A).
- **Actie**: Zodra één van de fasen boven 90% van de zekeringwaarde uitkomt, regelt GEMS de laadpaal binnen milliseconden terug om het uitvallen van de hoofdautomaat te voorkomen.

### 8. 🔌 Dynamische Faseomschakeling (1-Fase / 3-Fasen)
- **Gedrag**: De IEC 61851-norm vereist minimaal 6A laadstroom. Op een 3-fasenaansluiting betekent 3×6A = 18A (~4,1 kW), waardoor kleiner zonne-overschot onder 4,1 kW zonder faseomschakeling netafname zou veroorzaken.
- **Actie**: Op ondersteunde laadpalen (zoals go-e, RAEDIAN, Alfen, Mennekes, Peblar, Huawei, cFos, openWB, Tinkerforge) schakelt GEMS automatisch naar 1-fasemodus (1,4 kW tot 7,4 kW) bij matig zonne-overschot en schakelt door naar 3-fasenmodus (4,1 kW tot 22 kW) zodra het overschot boven 4,2 kW stijgt.

### 9. 🚰 Thermische Buffering & Slimme Relaisautomatisering
- **Gedrag**: Stuurt verwarmingstoestellen aan via potentiaalvrije relaiscontacten, slimme stekkers of directe Modbus-registers.
- **Actie**: Schakelt contactoren voor SWW-boilers of zwembadpompen in, of activeert **SG-Ready Bedrijfsstatus 3 (Boost-modus)** op warmtepompen zodra het zonne-overschot de ingestelde drempel overschrijdt (bijv. > 1500 W gedurende 2 minuten). Strikte minimale draai- en rusttijden beschermen compressoren tegen pendelen.

---

## Overzichtsmatrix per Categorie

### Overzichtstabel: Zonne- & Hybride Omvormers (37 Toestellen)

| Toestelnaam | Template-ID | Merk | Protocol | Standaardpoort / Bus | Uitgelezen Data | Aangestuurde Setpoints | Praktische GEMS-rol |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Afore Hybride Omvormer** | `afore_inverter` | Afore | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime PV-zonneproductie (W), Batterij laad-/ontlaadvermogen (W), Netafname-/injectievermogen (W), Cumulatieve zonneproductie (kWh), Batterij-laadtoestand (SOC %), 3-fasen omvormer-uitgangsstromen (L1, L2, L3 in Ampère). | EMS-energiemodus & geforceerde laad-/ontlaadvermogenssetpoints (Holding `3000`/`3002`), plus Actieve vermogensbegrenzing (`0–100%`). | Closed-loop hybride aansturing voor Afore AF-S en AF-T omvormers: laadt en ontlaadt de batterij dynamisch voor Vlaamse capaciteitspiekbewaking en EPEX-spotarbitrage, en regelt PV-teruglevering actief terug bij negatieve uurprijzen. |
| **Alpha ESS Storion SMILE** | `alpha_ess_inverter` | Alpha ESS | `MODBUS` | Standaardpoort: 502 of 8502, Slave-ID: 85 | Actief PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Netto netafname/-injectie (W), Cumulatieve energie (kWh), Batterij-SOC (%), 3-fasenstromen (L1, L2, L3 in Ampère). | Dispatch-modussturing (`0x084F`), actief vermogensoffset-setpoint (`0x0850`–`0x0851` met 32000 W-offset), Dispatch SOC-doelwaarde en netinjectievermogenslimiet. | Volledige closed-loop aansturing voor Alpha ESS Storion SMILE: stuurt exacte laad- en ontlaadvermogens (W) voor EPEX Day-Ahead arbitrage en bescherming van het Vlaamse capaciteitsplafond, inclusief actieve zonneterugregeling. |
| **Anker SOLIX X1 Hybride Omvormer** | `anker_inverter` | Anker | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | PV-zonnevermogen (W), Batterijstroom (W), Uitwisselingsvermogen met het net (W), Totale levensduurenergie (kWh), Batterij-SOC (%), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Anker SOLIX X1 EMS-bedrijfsmodus en geforceerde laad-/ontlaadvermogenssetpoints (W), plus actieve injectiebegrenzing (curtailment). | Closed-loop residentiële driefasige hybride sturing voor Anker SOLIX X1: voert geautomatiseerde batterij-piekbewaking, daluurladen op spotprijzen en terugregeling bij negatieve stroomprijzen uit. |
| **Deye / Sunsynk Hybride Omvormer** | `deye_inverter` | Deye | `MODBUS` | Standaardpoort: 502 of 8899, Slave-ID: 1 | PV-zonneproductie (W), Batterij laad-/ontlaadvermogen (W), Netmetervermogen (W), Totale energie (kWh), Batterij-SOC (%), 3-fasen omvormerstromen (L1, L2, L3 in Ampère). | Time-of-Use netlaad- & ontlaadvermogenssetpoints, minimale/doel-SOC-vensters en dynamische max. PV-injectielimiet (Holding `143` / `340`, automatische LV- & HV-schaling). | Volledige closed-loop sturing voor Deye en Sunsynk LV/HV hybride omvormers: voert sub-seconde Vlaamse capaciteitspiekbewaking, Day-Ahead EPEX-batterijarbitrage en zero-export / negatieve-prijsterugregeling uit. |
| **Enerlution Hybride Omvormer** | `enerlution_inverter` | Enerlution | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | PV-zonnevermogen (W), Batterijvermogen (W), Netvermogen (W), Cumulatieve energie (kWh), Batterij-SOC (%), 3-fasenstromen (L1, L2, L3 in Ampère). | Actieve vermogensbegrenzing (curtailment) (W of % via Modbus registers 40400/40441). | Volledige actieve terugregelintegratie: verlaagt automatisch het omvormervermogen tijdens uren met negatieve EPEX Day-Ahead spotprijzen (Nederland-modus / Zero-Export) met behoud van Vlaamse GSC-subsidiedrempels; stuurt zonne-overschot naar thuisbatterij en laadpaal. |
| **Enphase IQ Gateway / Envoy** | `enphase_envoy` | Enphase | `REST` | Standaardpoort: 80 / 443, Endpoints: /api/v1/production, /ivp/livedata/status | Geaggregeerde PV-opwekking van micro-omvormers (W), IQ Battery laad-/ontlaadvermogen (W), Netto netafname/-injectie (W), Totale levensduuropbrengst (kWh), Batterij-SOC (%), Stromen en spanningen per fase. | Lokale Enphase IQ Gateway HTTPS Bearer-JWT dynamische injectiebegrenzing en IQ Battery-opslagmodussturing. | Local-first integratie met Enphase IQ Gateway Metered en IQ Batteries: leest productie-, verbruiks- en opslagmetingen lokaal uit en coördineert injectiebegrenzing bij negatieve stroomprijzen zonder cloudafhankelijkheid. |
| **FoxESS H1 / H3 / H3-Pro Hybride Omvormer** | `foxess_inverter` | FoxESS | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 of 247 | PV-zonneproductie (W), Batterijvermogen (W), Actief netvermogen (W), Totale energie (kWh), Batterij-SOC (%), 3-fasenstromen (L1, L2, L3 in Ampère). | FoxESS-werkmodus (`41000` / `44000`), externe EMS-vermogenssetpoints (W), minimale SOC-ondergrens en actieve injectielimiet. | Volledige closed-loop aansturing voor de FoxESS H1-, H3- en H3-Pro hybride reeksen: stuurt geforceerd laden en ontladen voor spotarbitrage en capaciteitspiekbewaking, gecombineerd met actieve PV-terugregeling. |
| **Fronius Gen24 Omvormer** | `fronius_inverter` | Fronius | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | PV-zonneproductie (W), Batterij laad-/ontlaadvermogen (W), Netvermogensstroom (W), Cumulatieve energie (kWh), BYD / Fronius Batterij-SOC (%). | SunSpec Model 123 actieve vermogenslimiet (`WMaxLimPct` enkelregister FC06) en SunSpec Model 124 opslag laad-/ontlaadsturing (`StorCtl_Mod`, `OutWRte`, `InWRte`). | Volledige closed-loop aansturing voor Fronius Symo / Primo / Gen24 Plus: regelt laad- en ontlaadvermogens van BYD Battery-Box HVS/HVM voor spotarbitrage en piekbewaking, en begrenst PV-opwekking tijdens negatieve marktprijzen. |
| **GoodWe Omvormer** | `goodwe_inverter` | GoodWe | `MODBUS` | Standaardpoort: 502 of 8899, Slave-ID: 247 | PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Netto netstroom (W), Totale energie (kWh), Batterij-SOC (%). | GoodWe ET/EH/BT/BH EMS-vermogensmodus (`47511` modi `1`/`2`/`8`/`9`), EMS-vermogenssetpoint (`47512` W) en activatie & waarde netinjectielimiet (`47509`–`47510`). | Geverifieerde closed-loop hybride sturing voor GoodWe ET/EH/BT/BH-omvormers: voert geautomatiseerde batterij-piekbewaking, Day-Ahead spotarbitrage en dynamische PV-injectiebegrenzing uit. |
| **Growatt Omvormer** | `growatt_inverter` | Growatt | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief PV-zonnevermogen (W), Batterijvermogen (W), Netinjectie/-afname (W), Cumulatieve kWh, Batterij-SOC (%). | Growatt SPH / MOD TL3-XH prioriteitsmodus (`1044` / `3049`), laad-/ontlaadsnelheid & stop-SOC (`1070`–`1092`) en actief vermogenspercentage / injectielimiet (`3`, `122`–`123`). | Geverifieerde closed-loop aansturing voor Growatt SPH en MOD hybride- en stringomvormers: beheert geforceerd batterijladen, piekontlading en PV-terugregeling bij negatieve spotprijzen. |
| **Huawei Hybride Omvormer** | `huawei_inverter` | Huawei | `MODBUS` | Ethernet/WLAN | Actieve PV-zonneproductie (W, reg 32080), LUNA2000-batterij laad-/ontlaadvermogen (W, reg 37001), Netafname-/injectievermogen via DTSU666-H (W, reg 37113), Cumulatieve opwekking (kWh, reg 32106), Batterij-SOC (%, reg 37004). | Geforceerd batterij laad-/ontlaadsetpoint (W, reg 40118/40120), Actieve vermogensbegrenzing (curtailment) (W of % van nominaal vermogen, reg 40118/40125). | Volledige bidirectionele batterij- en terugregelsturing: laat de LUNA2000 ontladen bij huishoudelijke verbruikspieken (Vlaamse capaciteitspiekbewaking), laadt geforceerd vanuit het net tijdens goedkope/negatieve EPEX-uren en regelt actief PV-vermogen terug bij negatieve injectieprijzen of zero-export. |
| **LG ESS Home (8 / 10 / 15)** | `lg_ess` | LG | `REST` | Standaardpoort: 80 / 443, JSON endpoints: /v1/user/setting/network | PV-zonneproductie (W), Batterijvermogensstroom (W), Netafname/-injectie (W), Cumulatieve energie (kWh), Batterij-SOC (%). | Lokale LG ESS Home `/v1/user/setting/batt` geforceerd-laden / zelfverbruiksturing en PCS-vermogensbegrenzing. | Lokale cloudvrije HTTPS-integratie voor LG ESS Home 8 / 10 / 15-systemen met geautomatiseerd daluurladen van de batterij en netstroombalancering. |
| **Marstek Venus / Jupiter Storage** | `marstek_storage` | Marstek | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Uitwisselingsvermogen met het net (W), Totale energie (kWh), Batterij-SOC (%). | Marstek Venus C / E / Jupiter passieve modus inschakelen (`42000 = 0x55AA`), richtingssturing (`42010`) en exacte laad-/ontlaadsetpoints in Watt (`42020`–`42021`). | Volledige closed-loop AC-gekoppelde batterijsturing voor Marstek Venus C/E en Jupiter: slaat overtollige zonne-energie op, vlakt huishoudelijke capaciteitspieken af en voert Day-Ahead spotarbitrage uit. |
| **SAJ eSolar (H1 / H2 / R5 / R6 Hybride Omvormer)** | `saj_hybrid` | SAJ | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | PV-zonneproductie (W), Batterijvermogen (W), Actief netvermogen (W), Totale energie (kWh), Batterij-SOC (%), 3-fasenstromen (L1, L2, L3 in Ampère). | SAJ H1 / H2 / R5 / R6 AppMode / passieve laad- & ontlaadsetpoints (W) en actieve vermogensbegrenzing (`0.1%`). | Closed-loop hybride beheer voor SAJ H1/H2-systemen: coördineert driefasige PV-terugregeling, geforceerd batterijladen in daluren en het afvlakken van verbruikspieken. |
| **SMA Sunny Boy / Tripower / Opslagomvormer** | `sma_inverter` | SMA | `MODBUS` | Standaardpoort: 502, Slave-ID: 126 of 3 | PV-zonneproductie (W, reg 30775), Batterij laad-/ontlaadvermogen (W, reg 31393), Actief netvermogen (W, reg 30865), Totale energie (kWh, reg 30513), Batterij-SOC (%, reg 30845), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | SMA actieve vermogenslimiet (`WModCfg` / `WMaxLimPct`) en bidirectionele batterijsturing voor zowel Sunny Island / Sunny Boy Storage (`40151=802`, `40149`) als Sunny Tripower Smart Energy (`40236`, `40793`–`40801`). | Volledige closed-loop zonneterugregeling en batterijarbitrage voor SMA Sunny Boy, Sunny Tripower, Sunny Tripower Smart Energy (STP-SE) en Sunny Boy Storage. |
| **Senergy (SE Series / Hybride Omvormer)** | `senergy_inverter` | Senergy | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Netuitwisseling (W), Cumulatieve energie (kWh), Batterij-SOC (%). | Senergy SE Hybrid passieve modus laad-/ontlaadsetpoints (W) en actieve uitgangsvermogenslimiet (%). | Closed-loop aansturing voor Senergy hybride omvormers: automatiseert batterij-piekbewaking, daluurladen en PV-terugregeling bij negatieve prijzen. |
| **Sigenergy SigenStor (Hybride Omvormer & Opslag)** | `sigenergy_hybrid` | Sigenergy | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | PV-zonnevermogen (W), Sigen-batterijvermogen (W), Uitwisselingsvermogen met het net (W), Totale energie (kWh), Sigen Batterij-SOC (%), 3-fasenstromen (L1, L2, L3 in Ampère). | SigenStor Remote EMS inschakelen (`40029`), bedrijfsmodus (`40031`), max. laad-/ontlaadsetpoints (`40032`–`40034` U32 W) en PV-curtailmentlimiet (`40038`). | Uiterst nauwkeurige closed-loop EMS-sturing voor Sigenergy SigenStor 5-in-1 energiesystemen: voert sub-seconde capaciteitspiekbewaking, EPEX-spotarbitrage en PV-injectiebegrenzing uit. |
| **SofarSolar (HYD / G3 / AMASS Hybride Omvormer)** | `sofarsolar_hybrid` | SofarSolar | `MODBUS` | Standaardpoort: 8899 of 502, Slave-ID: 1 | PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Netvermogensstroom (W), Totale energie (kWh), Batterij-SOC (%), 3-fasenstromen (L1, L2, L3 in Ampère). | SofarSolar HYD 5K–20KTL-3PH passieve opslagsetpoints (`0x1187` modus, `0x1189`–`0x118D` signed S32 W) en actief vermogen / anti-reflux injectielimiet. | Geverifieerde closed-loop aansturing voor SofarSolar HYD 3PH G3 en ME3000SP hybride systemen: regelt nauwkeurig het laad-/ontlaadvermogen van de batterij en zonneterugregeling. |
| **SolaX Omvormer** | `solax_inverter` | SolaX | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief PV-zonnevermogen (W), Batterijvermogen (W), Actief netvermogen (W), Totale energie (kWh), Batterij-SOC (%). | SolaX X1/X3-Hybrid G4 Remote Control vermogensmodus (`0x007C`–`0x0080`, exact actief doelvermogen W + watchdog) met `0x001F` handmatige modus-terugval, plus gebruikerslimiet injectieregeling (`0x0042`). | Geverifieerde sub-seconde closed-loop sturing voor SolaX X1/X3-Hybrid en Fit-systemen: voert dynamisch zonnezelfverbruik, spotprijsarbitrage en PV-terugregeling uit. |
| **SolarEdge 3-Fasen Omvormer** | `solaredge_3phase` | SolarEdge | `MODBUS` | Standaardpoort: 1502 of 502, Slave-ID: 1 | PV-zonneproductie (W), Batterij laad-/ontlaadvermogen (W), Netmetervermogen (W), Totale energie (kWh), SOC gekoppelde Energy Bank (%). | SolarEdge StorEdge besturingsmodus `4` (Remote), laad-/ontlaadlimiet (`0xE00E`/`0xE010` float32 W), moduscommando (`0xE00D`) en Advanced Power Control (`0xF001` / SunSpec M123). | Volledige closed-loop driefasige SolarEdge Home Hub & StorEdge-aansturing: moduleert het laad-/ontlaadvermogen van de thuisbatterij en regelt PV-productie terug tijdens negatieve spotprijzen. |
| **SolarEdge Omvormer** | `solaredge_inverter` | SolarEdge | `MODBUS` | Standaardpoort: 1502 of 502, Slave-ID: 1 | PV-zonneproductie (W), Batterij laad-/ontlaadvermogen (W), Actief netvermogen (W), Totale energie (kWh), Batterij-SOC (%). | SolarEdge StorEdge besturingsmodus `4` (Remote), laad-/ontlaadlimiet (`0xE00E`/`0xE010` float32 W), moduscommando (`0xE00D`) en Advanced Power Control (`0xF001` / SunSpec M123). | Volledige closed-loop monofasige SolarEdge HD-Wave & Home Hub-aansturing: stuurt laad- en ontlaadsetpoints van StorEdge / Home Battery en begrenst de zonneproductie indien vereist. |
| **Solis Hybride & Retrofit Omvormers (Primaire Referentie)** | `solis_hybrid` | Solis | `MODBUS` | Standaardpoort: 502 of 8899, Slave-ID: 1 | Actief PV-opwekkingsvermogen (W, reg 33079), Batterij laad-/ontlaadvermogen (W, reg 33149), Batterij-SOC (%, reg 33139), Actief netmetervermogen (W, reg 33130), Totale cumulatieve energieopbrengst (kWh, reg 33029), 3-fasen AC-stromen (0.1A, regs 33073-33075), 3-fasenspanningen (0.1V, regs 33076-33078). | Actieve vermogensbegrenzingsmodus en -limiet (W / % via holding-registers 43052/43070 op Hybride en 3051/3052 op String), geforceerd batterij laad- & ontlaadsetpoint (W via registers 43110/43129/43135/43136). | Aangewezen primair referentieplatform voor hybride zonne-omvormers en batterijopslag. Voert sub-seconde closed-loop vermogensbegrenzing uit tijdens uren met negatieve spotprijzen (Nederland-modus / Zero-Export), slaat automatisch zonne-overschotten op in de batterij, regelt laadvermogen dynamisch bij voor Vlaamse capaciteitspiekbewaking en orkestreert spotmarktarbitrage (geforceerd laden bij lage EPEX Day-Ahead prijzen en ontladen tijdens avondpieken). Solis Retrofit-modellen werken naadloos als AC-gekoppelde batterij-omvormers zonder afhankelijkheid van PV-strings. |
| **Sungrow Omvormer** | `sungrow_inverter` | Sungrow | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | PV-zonneproductie (W, reg 5016), Batterij laad-/ontlaadvermogen (W, reg 13021), Uitwisselingsvermogen met het net (W, reg 13009), Cumulatieve opwekking (kWh, reg 5003), SBR Batterij-SOC (%, reg 13022). | Sungrow SH-RS / SH-RT / SH-T EMS-modusselectie (`13049`), laad-/ontlaadcommando (`13050` `0xAA`/`0xBB`/`0xCC`), vermogenssetpoint (`13051` W) en actieve vermogensbegrenzing (`5006`–`5007`). | Geverifieerde supersnelle closed-loop aansturing voor Sungrow SH hybride en SG stringomvormers: voert sub-seconde piekbewaking, EPEX-batterijarbitrage en PV-terugregeling uit. |
| **Victron Omvormer/GX** | `victron_inverter` | Victron | `MODBUS` | Standaardpoort: 502, Unit-ID: 100 voor System Calc / 228 voor Omvormer | DC/AC PV-zonnevermogen (W, reg 811), Batterij laad-/ontlaadvermogen (W, reg 842), Netto AC-netafname/-injectie (W, reg 820), Totale energie (kWh), Batterij-SOC (%, reg 843). | Victron Venus OS / Cerbo GX ESS-netvermogenssetpoint (`2700` S16 / `2703` S32 W), ESS-ontlading uitschakelen en max. PV-terugleveringslimiet (`2706` in stappen van 100 W). | Diepgaande closed-loop integratie met Victron MultiPlus-II / Quattro GX ESS-installaties: stuurt het AC-netsetpoint aan voor batterijarbitrage en piekbewaking en begrenst overtollige teruglevering. |
| **ABB / Fimer Zonne- & Hybride Omvormer** | `abb_fimer_inverter` | ABB / Fimer | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief PV-zonnevermogen (W, SunSpec-standaardregister 40083), Batterij-laadtoestand (SOC %), Batterij laad-/ontlaadvermogen (W), Netinjectievermogen (W), Cumulatieve opwekkingsenergie (kWh). | SunSpec Model 123 Actieve vermogensbegrenzing (curtailment) (`WMaxLimPct`, `WMaxLim_Ena`) en SunSpec Model 124 opslag laad-/ontlaadsnelheidsregeling (`StorCtl_Mod`, `OutWRte`, `InWRte`). | Volledige closed-loop SunSpec-aansturing voor ABB / Fimer PV- en REACT 2 hybride installaties: voert zonneterugregeling bij negatieve spotprijzen, zero-exportbegrenzing, geautomatiseerde batterij-piekbewaking en Day-Ahead arbitrage uit. |
| **Autarco Zonne-omvormer** | `autarco_inverter` | Autarco | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief PV-zonnevermogen (W), Totale dag- & levensduuropbrengst (kWh), AC-netspanning (V), AC-frequentie (Hz). | Externe sturing batterij laad-/ontlaadvermogenssetpoints (`43129` / `43135`–`43136`) en Actieve vermogensbegrenzing (curtailment) (`43052` / `0–100%`). | Volledige closed-loop hybride omvormer- en PV-terugregelsturing voor Autarco S2.x / MH / LX-systemen: coördineert zonnezelfverbruik, batterijarbitrage op spotprijzen en Vlaamse capaciteitspiekbewaking. |
| **Chisage ESS Hybride Omvormer** | `chisage_ess` | Chisage ESS | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Netafname-/injectievermogen (W), Cumulatieve omvormerenergie (kWh). | Enkel uitlezing (Alleen-lezen telemetrie — gesloten registerkaart). | Integreert commerciële, industriële en residentiële Chisage ESS hybride zonne- en batterijtelemetrie in de lokale GEMS-vermogensbalancering. |
| **Delta Electronics Zonne-omvormer** | `delta_inverter` | Delta Electronics | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | PV-opwekkingsvermogen (W), DC-stringspanningen en -stromen, Cumulatieve opwekking (kWh), AC-netvermogen (W). | SunSpec Model 123 Actieve vermogensbegrenzing (curtailment) (`WMaxLimPct`, `WMaxLim_Ena`) en SunSpec Model 124 basis-opslagsturing. | Gestandaardiseerde SunSpec closed-loop telemetrie en actieve vermogensbegrenzing voor residentiële en commerciële Delta zonne- en hybride omvormers. |
| **HYXiPOWER Hybride Omvormer** | `hyxipower_inverter` | HYXiPOWER | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | PV-zonneproductie (W), Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Netuitwisseling (W), Cumulatieve energie (kWh). | Autonoom / Alleen-lezen telemetrie-uitlezing. | Stroomt realtime PV-productie en batterijopslagmetingen door naar het GEMS PowerFlow-diagram en de telemetrieverwerking. |
| **KSTAR BluE Hybride Omvormer** | `kstar_inverter` | KSTAR | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Netvermogensstroom (W), Fasestromen (L1, L2, L3 in Ampère). | Autonoom / Alleen-lezen telemetrie-uitlezing. | Voedt hybride zonne- en batterijmeetwaarden aan de GEMS load balancer en de dynamische tariefoptimalisatie-engine. |
| **Solinteg Integ M Hybride Omvormer** | `solinteg_inverter` | Solinteg | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Netto uitwisselingsvermogen met het net (W), Cumulatieve opwekking (kWh). | Solinteg Integ M-serie externe EMS-modus, laad-/ontlaadvermogenssetpoints en actieve vermogenslimiet. | Geverifieerde closed-loop driefasige hoogspannings-hybride aansturing voor commerciële en residentiële Solinteg Integ M (4–50 kW) omvormers. |
| **Solplanet / AISWEI Omvormer** | `solplanet_inverter` | Solplanet (AISWEI) | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief PV-zonnevermogen (W), Totale energieopbrengst (kWh), AC-spanning en -stroom per fase, netafname/-injectie (W). | AISWEI / Solplanet batterijwerkmodus (`1103` bus / `41104` doc), richtingsgevoelig laad-/ontlaadsetpoint (`1152` S16 W) en actieve vermogenssturing (`4000` / `5402` `0,01%`). | Geverifieerde closed-loop aansturing voor Solplanet ASW H-T2/T3 en KACO blueplanet hybrid NH3-omvormers: verstuurt exacte batterijsetpoints in Watt en dynamische PV-terugregeling. |
| **APsystems EZ1-M / EZ1-D Lokale Micro-omvormer** | `apsystems_ez1` | APsystems | `REST` | Standaardpoort: 8050, Endpoints: `/getOutputData`, `/setMaxPower` | Kanaal 1 & Kanaal 2 actief PV-vermogen (W), Totale cumulatieve opwekkingsenergie (kWh). | Direct lokaal setpoint voor max. AC-uitgangsvermogen (`/setMaxPower?p=30..800` W). | 100% cloudvrije lokale micro-omvormertelemetrie en traploze actieve vermogensbegrenzing tijdens negatieve EPEX-spotprijzen of zero-exportwerking. |
| **FENECON Home / OpenEMS Edge (FEMS)** | `fenecon_fems` | FENECON | `REST` | Standaardpoort: 8084, `/rest/channel/_sum/*` & `/rest/channel/ess0/*` | PV-productievermogen (W), Cumulatieve PV-energie (kWh), Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Actief netvermogen (W). | Exact ESS actief laad-/ontlaadsetpoint (`ess0/SetActivePowerEquals` W) en PV actieve vermogensbegrenzing (curtailment) (`pvInverter0/SetActivePowerLimit` W). | Volledige lokale closed-loop integratie voor FENECON Home & OpenEMS-systemen: coördineert EPEX Day-Ahead batterijarbitrage, Vlaamse capaciteitspiekbewaking en terugregeling bij negatieve prijzen. |
| **Hoymiles DTU-Pro / OpenDTU Micro-omvormer** | `hoymiles_dtu` | Hoymiles | `MODBUS` | Standaardpoort: 502, Unit-ID: 1 | Geaggregeerd & per-poort actief PV-vermogen (W), Cumulatieve zonne-opbrengst (kWh). | Actieve uitgangsvermogenslimiet (`0xC006` % op DTU-Pro Modbus; vluchtig RAM `limit_type=1` % op OpenDTU zonder EEPROM-slijtage). | Cloudvrije monitoring van micro-omvormers en dynamische PV-terugregeling tijdens uren met negatieve spotmarktprijzen. |
| **KOSTAL Plenticore Plus / G2 / G3 Hybrid** | `kostal_plenticore` | KOSTAL | `MODBUS` | Standaardpoort: 1502, Unit-ID: 71, Automatisch gedetecteerde CDAB/ABCD IEEE-754 Float32 | Totaal DC PV-vermogen (W), Cumulatieve opbrengst (kWh), Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Netsensorvermogen (W), 3-fasenspanningen & -stromen. | Extern batterijbeheer richtingsgevoelig vermogenssetpoint (Holding `1034` Float32 W) en SunSpec Model 123 Actieve vermogensbegrenzing (curtailment) (`WMaxLimPct`). | Volledige closed-loop aansturing voor KOSTAL Plenticore hybride installaties: voert batterij-piekbewaking, Day-Ahead spotarbitrage en zonneterugregeling bij negatieve prijzen uit. |
| **KACO blueplanet hybrid NH3 / gridsave TL3** | `kaco_inverter` | KACO | `MODBUS` | Standaardpoort: 502, Unit-ID: 1, SunSpec Models 103/123/124 & NH3 Storage Block `40200`–`40203` | Actief PV-zonnevermogen (W), Cumulatieve energie (kWh), Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Live BMS laad-/ontlaadvermogenslimieten (`40202`–`40203` W), 3-fasenstromen & -spanningen. | SunSpec Model 123 Actieve vermogensbegrenzing (curtailment) (`WMaxLimPct`, `WMaxLim_Ena`) en Model 124 opslagsturing (`WChaMax`, `WChaGra`, `WDisChaGra`, `StorCtl_Mod`, `WChaMaxRvrtTms=300s` Watchdog) plus NH3 EMS-terugvalmodus (`40210`–`40212`). | Volledige closed-loop aansturing voor KACO blueplanet hybrid NH3 en commerciële gridsave TL3-installaties: voert batterij-piekbewaking, EPEX Day-Ahead spotarbitrage en zonneterugregeling bij negatieve prijzen uit. |

### Overzichtstabel: Toegewijde Batterij-energieopslagsystemen (BESS) (18 Toestellen)

| Toestelnaam | Template-ID | Merk | Protocol | Standaardpoort / Bus | Uitgelezen Data | Aangestuurde Setpoints | Praktische GEMS-rol |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Siemens Junelight Slimme Batterij** | `siemens_junelight` | Siemens | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Batterij laad-/ontlaadvermogen (W), Batterij-laadtoestand (SOC %), Netto netvermogensstroom (W), Interne batterijstatus. | Siemens Junelight Slimme Batterij EMS-bedrijfsmodus en geforceerde laad-/ontlaadvermogenssetpoints (W). | Geverifieerde integratie met residentiële Siemens Junelight-batterijopslag voor zonnezelfverbruik, piekbewaking en opladen tijdens daluren. |
| **Solarwatt (EnergyManager / MyReserve Matrix)** | `solarwatt_storage` | Solarwatt | `REST` | Standaardpoort: 80, JSON endpoint: /rest/kiwigrid/private/items | Batterijvermogensstroom (W), Batterij-SOC (%), Zonneproductie (W), Netuitwisseling (W), Cumulatieve energie (kWh). | Solarwatt EnergyManager / Reserve lokale `/rest/items` batterij laad-/ontlaadsturing en telemetrie-uitlezing. | Geverifieerde cloudvrije lokale LAN-integratie voor Solarwatt EnergyManager Pro en MyReserve / Battery flex-opslagsystemen. |
| **sonnenBatterie (eco 6 / 8 / 10 / hybrid)** | `sonnen_batterie` | Sonnen | `REST` | Standaardpoort: 80, JSON endpoint: /api/v2/status | Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), PV-zonneproductie (W), Netinjectie / -afname (W). | sonnenBatterie lokale API v2 `PUT /api/v2/configurations` (`EM_OperatingMode=1` Handmatig / `2` Zelfverbruik) en `POST /api/v2/setpoint/charge\|discharge/{W}`. | Volledige closed-loop aansturing voor sonnenBatterie eco 8 / 10 / performance: schakelt naadloos naar handmatige API-modus tijdens geforceerde arbitrage of piekbewaking en herstelt daarna autonoom zelfverbruik. |
| **Duracell Energy Residentiële Opslag** | `duracell_energy` | Duracell Energy | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Batterij laad-/ontlaadvermogen (W), Batterij-laadtoestand (SOC %), Netvermogensstroom (W), AC-vermogen omvormer (W). | Enkel uitlezing (Alleen-lezen telemetrie). | Bewaakt de laadtoestand (SOC) en vermogensuitwisseling van residentiële Duracell-batterijen voor lokale load balancing en EV-zonne-overschotsturing. |
| **Dyness Batterijopslagsysteem** | `dyness_battery` | Dyness | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Batterij laad-/ontlaadvermogen (W), Batterij-laadtoestand (SOC %), Totale pakketspanning (V), Stroom (A), Celtemperaturen (°C). | Dyness Tower / Powerbox / Junior Box Modbus EMS-bedrijfsmodus en laad-/ontlaadvermogenslimieten (W). | Geverifieerde BMS- & PCS-opslagintegratie voor Dyness HV/LV-batterijmodules met closed-loop laad- en ontlaadsturing. |
| **Elecnova Commerciële & Industriële BESS** | `elecnova_bess` | Elecnova | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief batterijvermogen (W), Batterij-laadtoestand (SOC %), Uitwisselingsvermogen met het net (W), Cumulatieve in-/uitgaande energie (kWh). | Enkel uitlezing (Alleen-lezen telemetrie). | Monitort vermogensstroom, laadtoestand (SOC) en cumulatieve energie van commerciële BESS-installaties op het live dashboard. |
| **Goneo Residentieel Opslagsysteem** | `goneo_storage` | Goneo | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Netvermogensstroom (W), Totale energie (kWh). | Enkel uitlezing (Alleen-lezen telemetrie). | Monitort de SOC en vermogensuitwisseling van residentiële batterijopslag voor gecoördineerde aansturing van laadpalen en slimme relais. |
| **Mastervolt MLI Ultra / Combi CZone** | `mastervolt_storage` | Mastervolt | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Batterijvermogen (W), Batterij-SOC (%), AC-uitgangsvermogen omvormer (W), DC-busspanning (V), batterijstroom (A). | Enkel uitlezing (Alleen-lezen telemetrie). | Biedt telemetriemonitoring voor off-grid, maritieme en residentiële Mastervolt / CZone-batterijsystemen. |
| **Power Sonic C&I-energieopslag** | `powersonic_bess` | Power Sonic | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief batterijvermogen (W), Batterij-laadtoestand (SOC %), Netvermogensstroom (W), Foutstatusregisters. | Enkel uitlezing (Alleen-lezen telemetrie). | Monitort vermogensstromen en laadtoestand (SOC) van commerciële BESS-systemen op het live GEMS-dashboard. |
| **Poweroad Residentiële & C&I-opslag** | `poweroad_storage` | Poweroad | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Batterijvermogen (W), Batterij-laadtoestand (SOC %), Netstroom (W), Cumulatieve in-/uitgaande energie (kWh). | Enkel uitlezing (Alleen-lezen telemetrie). | Monitort telemetrie van residentiële en kleinzakelijke Poweroad-batterijopslagsystemen. |
| **Pylontech Batterijopslag (US / Force)** | `pylontech_storage` | Pylontech | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Batterij laad-/ontlaadvermogen (W), Laadtoestand (SOC %), Pakketspanning (V), Pakketstroom (A), SOH (%). | Pylontech US2000/US3000/US5000 & Force-H1/H2 BMS/EMS laad- en ontlaadvermogenssetpoints via Modbus TCP/RTU. | Geverifieerde closed-loop telemetrie en vermogenssturing voor laag- en hoogspannings Pylontech-batterijracks. |
| **Socomec SUNSYS C-System / HES BESS** | `socomec_bess` | Socomec | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief batterijvermogen (W), Batterij-SOC (%), Live BMS max. laad-/ontlaadlimieten (`0xC008`–`0xC009` W), Actieve netvermogensstroom (W), Cumulatieve energie (kWh). | Socomec SUNSYS PCS externe actieve vermogenssturing (`0xC100` Modus, `0xC101`–`0xC102` S32 0,1 kW setpoint, `0xC103=300s` hardware-watchdog) met SunSpec Model 124 opslagsturing als terugval. | Geverifieerde closed-loop C&I-batterijsturing voor Socomec SUNSYS HES L/XL en PCS+: voert industriële piekbewaking, bescherming van het capaciteitsplafond en EPEX-spotarbitrage uit. |
| **Sunwoda AtSmart Energieopslag** | `sunwoda_energy` | Sunwoda Energy | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Batterij laad-/ontlaadvermogen (W), Batterij-laadtoestand (SOC %), Netvermogensstroom (W), Temperatuur (°C). | Enkel uitlezing (Alleen-lezen telemetrie). | Monitort de laadtoestand en vermogensuitwisseling van Sunwoda-batterijsystemen op het live GEMS-dashboard. |
| **Sessy Slimme Batterij (AC-thuisbatterij)** | `sessy_battery` | Sessy | `REST` | `/api/v1/power/status`, `/api/v1/power/active_strategy`, `/api/v1/power/setpoint` | Batterij laad-/ontlaadvermogen (W), Laadtoestand (SOC %), Geïnjecteerde energie (kWh), RMS-spanningen (V) & stromen (A) per fase. | Dynamische strategieselectie (`POWER_STRATEGY_API` vs. `POWER_STRATEGY_NOM`) en richtingsgevoelig Watt-setpoint (`-W` Laden / `+W` Ontladen). | Cloudvrije lokale aansturing van Nederlandse Sessy retrofit-thuisbatterijen voor zonnezelfverbruik, Vlaamse capaciteitspiekbewaking en EPEX-spotarbitrage. |
| **Tesla Powerwall 2 / 3 & Backup Gateway (Lokale HTTPS)** | `tesla_powerwall` | Tesla Energy | `REST` | `POST /api/login/Basic`, `GET /api/meters/aggregates`, `GET /api/system_status/soe` | Batterijvermogen (W), Bruikbare laadtoestand (SOC %), Netvermogen van de site (W), Zonnevermogen (W), Cumulatieve energie (kWh), 3-fasen sitestromen & spanning. | Enkel uitlezing (Lokale Gateway v23+ firmware laat lokaal enkel uitlezing toe). | Snelle lokale HTTPS-uitlezing van stationaire Powerwall net-, zonne- en batterijstromen ter aansturing van EV-zonne-overschotladen en capaciteitspiekbewaking. |
| **VARTA pulse / neo / element Thuisopslag** | `varta_storage` | VARTA | `MODBUS` | Standaardpoort: 502, Unit-ID: 255, Holding-registers `1066`–`1102` & `2065`–`2066` | Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Cumulatieve geladen energie (kWh), Netsensorvermogen (W), Vermogen gekoppelde PV-sensor (W). | VARTA EMS actieve vermogenssturing (`2065` Commando: Laden/Ontladen/Auto, `2066` Vermogen W; terugvalregister `1074`). | Closed-loop lokale Modbus TCP-aansturing voor AC-gekoppelde VARTA-opslagsystemen: automatiseert opladen tijdens goedkope spoturen en huishoudelijke piekbewaking. |
| **Zendure SolarFlow AC / Hyper 2000** | `zendure_solarflow` | Zendure | `REST` | `GET /properties/report`, `POST /properties/write` | PV-ingangsvermogen (W), Batterijpakket laad- & ontlaadvermogen (W), Laadtoestand (`electricLevel` %). | Slimme AC-modus (`acMode` Laden/Ontladen) en traploze `inputLimit` / `outputLimit` Watt-setpoints (`0–2400 W`). | 100% lokale cloudvrije aansturing voor plug-in en AC-gekoppelde Zendure-opslag: absorbeert overtollige PV-stroom en ontlaadt om huishoudelijke avondpieken op te vangen. |
| **Sinexcel PWS Bidirectionele PCS / Commerciële BESS** | `sinexcel_bess` | Sinexcel | `MODBUS` | Standaardpoort: 502, Unit-ID: 1, Holding `100`–`113` & `600`–`610` | Actief batterijvermogen (`106` 0.1 kW), Batterij-SOC (`109` 0.1%), Cumulatieve ontladen energie (`110`–`111` 0.1 kWh), Live BMS max. laad-/ontlaadvermogenslimieten (`112`–`113` 0.1 kW), 3-fasenspanningen & -stromen. | Externe PCS Start/Stand-by (`600`), constant-vermogen PQ-modus (`601`), richtingsgevoelig actief vermogenssetpoint (`602` S16 0,1 kW) en 60-seconden fail-safe watchdog (`610`). | Closed-loop industriële en C&I-batterijsturing voor Sinexcel PWS-opslagomvormers: automatiseert hoogvermogen piekbewaking, transformatorbeveiliging en Day-Ahead spotarbitrage. |

### Overzichtstabel: Elektrische Voertuig (EV) Laadpalen & Wallboxen (61 Toestellen)

| Toestelnaam | Template-ID | Merk | Protocol | Standaardpoort / Bus | Uitgelezen Data | Aangestuurde Setpoints | Praktische GEMS-rol |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ABB Charger** | `abb_charger` | ABB | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief laadvermogen (W, reg 0x401C), Cumulatieve sessie-energie (kWh, reg 0x401E). | Dynamische laadstroomregeling (Ampère, reg 0x4100, 6A tot 32A in stappen van 1mA). | Sub-seconde stroomregeling via Modbus TCP: moduleert dynamisch de laadstroom op basis van zonne-overschot (Eco-modus) en knijpt onmiddellijk terug bij capaciteitspieken (Vlaanderen-modus); werkt naadloos samen met externe verreken- en vergoedingsplatformen. |
| **ABL eM4 Single/Twin (SBCx)** | `abl_em4_charger` | ABL | `MODBUS` | Standaardpoort: 502, Unit-ID: 255 of 1 | Actief laadvermogen (W, reg 0x300D), Totale energie (kWh, reg 0x300F). | Dynamische laadstroomregeling (Ampère, reg 0x3001, 6A tot 32A). | Directe Modbus-aansturing: regelt enkele of dubbele laadaansluitingen om zonne-overschot op het dak te volgen en Vlaamse capaciteitslimieten te respecteren zonder zakelijke verrekening te onderbreken. |
| **ABL eMH1 / eMH2 / eMH3** | `abl_emh_charger` | ABL | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime laadvermogen (W), Sessie-energie (kWh). | Laadstroomregeling (Ampère, 6A tot 32A). | Integreert zowel bestaande als moderne ABL eMH-laadpalen en biedt geautomatiseerd zonvolgend laden en piekbewaking. |
| **AUTEL AC MaxiCharger** | `autel_charger` | AUTEL | `OCPP` | Poort: 8887, ws://<EMS-IP>:8887/<ChargePointID> | Realtime laadvermogen (W), Sessie-energie (kWh), Voertuigverbindingsstatus, 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Dynamische stroomregeling via SetChargingProfile (6A tot 32A), Faseomschakeling (1F / 3F). | Autonoom residentieel slim laden via ingebouwde OCPP: past de laadsnelheid aan op zonne-overschot en pauzeert het laden tijdens piektariefperiodes. |
| **Alfen Charger** | `alfen_charger` | Alfen | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief laadvermogen (W), Totale energie (kWh), Laadstromen per fase (Ampère). | Modbus Slave max. laadstroom (`1210` IEEE-754 Float32 Ampère met station-watchdog) en contactor-faseomschakeling (`1215`: `1` = 1-Fase, `3` = 3-Fasen). | Aanbevolen Benelux Modbus TCP-integratie voor Alfen Eve Single & Double Pro-line: sub-seconde zonne-overschotvolging, hoofdzekeringbeveiliging en automatische 1F/3F-omschakeling. |
| **Alpitronic Hypercharger** | `alpitronic_charger` | Alpitronic | `MODBUS` | Standaardpoort: 502 of 8887, Unit-ID: 1 | Actief DC-laadvermogen (kW/W), Cumulatieve geleverde energie (kWh), Connectorstatus. | Dynamische laadvermogenslimiet (kW / Ampère setpoints). | Begrenst dynamisch het DC-snellaadvermogen om tijdens piekbelasting strikt onder de netaansluitcapaciteit en Vlaamse pieklimieten te blijven. |
| **BMW i Wallbox (Connect/Pro)** | `bmw_charger` | BMW | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Laadvermogen (W), Sessie-energie (kWh). | Dynamisch stroomsetpoint (Ampère, 6A tot 32A). | Lokale LAN-stroomregeling; stemt het laden af op beschikbare zonne-energie en goedkope EPEX-daluren. |
| **Bender Charger** | `bender_charger` | Bender | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief laadvermogen (W), Sessie-energie (kWh), Pilotstatus. | Bender CC612 / CC613 HEMSw-stroomlimiet (`1001` 0,1 A vanaf FW >= 4.70, terugval `1000` 1 A) en dynamische 1-fase / 3-fasen omschakeling (`1002`). | Directe lokale Modbus TCP-sturing voor Bender CC612/CC613-laadcontrollers (EBEE, Compleo, Mennekes OEM's) met sub-ampère regeling en 1F/3F-zonneschakeling. |
| **Blitzpower / Phoenix CharX** | `blitzpower_charger` | Blitzpower | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Laadvermogen (W), Cumulatieve energie (kWh). | Laadstroomregeling (Ampère, 6A tot 32A). | Snelle Modbus-registersturing: moduleert stroomsetpoints voor laden op zonne-overschot en actieve piekbewaking. |
| **Delta AC MAX / SLIM / Ultrasnelle Lader** | `delta_charger` | Delta | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief laadvermogen (W), Totale energie (kWh). | Laadstroomsetpoint (Ampère, 6A tot 32A). | Moduleert het stroomsetpoint van de Delta-wallbox via Modbus TCP; optimaliseert de laadsnelheid om zonneproductie te benutten zonder dure netafname. |
| **EN+ AC EV-laadpaal** | `enplus_charger` | EN+ | `OCPP` | Poort: 8887 | Laadvermogen (W), Energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen. | Laadstroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F). | Autonome zonne-overschotvolging en piekbewaking via lokale OCPP SetChargingProfile-commando's. |
| **ETEK EKEPC2-C/S Laadcontroller** | `etek_charger` | ETEK | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Laadvermogen (W), Sessie-energie (kWh). | Dynamische stroomregeling (Ampère, 6A tot 32A). | Directe Modbus-registeraansturing om de laadsnelheid realtime af te stemmen op de vermogensbalans van de woning. |
| **EVBox Elvi / Livo / BusinessLine** | `evbox_charger` | EVBox | `OCPP` | Poort: 8887, ws://<EMS-IP>:8887/<ChargePointID> | Realtime laadvermogen (W), Totale geleverde energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Connectorstatus. | Dynamische stroomregeling via SetChargingProfile (6A tot 32A), Faseomschakeling (1F / 3F). | Volledige lokale OCPP-ondersteuning voor EVBox: regelt de laadstroom dynamisch in stappen van 1A om zonne-energie van het dak te benutten en hoge capaciteitstarieven te vermijden. |
| **Easee Charger** | `easee_charger` | Easee | `CLOUD` | Authenticatie met cloudinloggegevens | Actief laadvermogen (W), Totale sessie-energie (kWh), Laderstatus. | Easee-API dynamische kring-/laadstroom (6–32 A), sessie `pause_charging` / `resume_charging` en automatische `phaseMode` 1-fase / 3-fasen omschakeling. | Geverifieerde slimme laadsturing voor Easee Home, Charge en Charge Lite/Up: moduleert laadstroom, pauzeert/hervat sessies netjes en schakelt automatisch tussen 1-fase en 3-fasen zonnemodus. |
| **Enovates SingleWallBox** | `enovates_charger` | Enovates | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Laadvermogen (W), Totale energie (kWh). | Dynamisch stroomsetpoint (Ampère, 6A tot 32A). | Directe lokale Modbus-aansturing; werkt naadloos samen met externe CPO-verrekenplatformen terwijl GEMS lokaal de load balancing en piekbewaking uitvoert. |
| **Ensto Chago Wallbox / Pro** | `ensto_charger` | Ensto | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief laadvermogen (W), Totale energie (kWh). | Laadstroomregeling (Ampère, 6A tot 32A). | Uiterst betrouwbare Scandinavische zakelijke en residentiële lader; knijpt de laadstroom bij om de huisaansluiting te respecteren en zonne-overschot te benutten. |
| **Etrel INCH / sonnenCharger** | `etrel_charger` | Etrel | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief vermogen (W), Sessie-energie (kWh). | Dynamisch stroomsetpoint (Ampère, 6A tot 32A). | Lokale Modbus TCP-regeling; optimaliseert het laden in samenspel met sonnen- of andere thuisbatterijen en zonnepanelen. |
| **Fronius Wattpilot (Home / Go)** | `fronius_wattpilot` | Fronius | `OCPP` | Poort: 8887 | Actief vermogen (W), Energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Dynamische stroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F). | Stuurt de Wattpilot volledig cloudvrij rechtstreeks vanuit GEMS aan; ondersteunt dynamische 1-fase / 3-fasen omschakeling en zonne-overschotladen. |
| **GoodWe HCA Series EV Wallbox (Gen 2)** | `goodwe_charger` | GoodWe | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Laadvermogen (W), Sessie-energie (kWh). | Laadstroomsetpoint (Ampère, 6A tot 32A). | Stem GoodWe-wallboxen naadloos af op GoodWe hybride omvormers; geeft voorrang aan de thuisbatterij alvorens resterend overschot naar de wagen te sturen. |
| **Hager witty (one / plus / pro / park 2)** | `hager_charger` | Hager | `OCPP` | Poort: 8887 | Actief vermogen (W), Sessie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen. | Dynamische stroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F). | Cloudvrij residentieel beheer van Hager witty-laadpalen met automatische zonne-overschotvolging en Vlaamse capaciteitspiekbewaking. |
| **Huawei FusionCharge (SCharger-7KS / 22KT)** | `huawei_scharger` | Huawei | `OCPP` | Poort: 8887, ws://<EMS-IP>:8887/<ChargePointID> | Actief laadvermogen (W), Sessie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Stekkerstatus. | Dynamische stroomregeling via SetChargingProfile (6A tot 32A), Faseomschakeling (1F / 3F). | Directe lokale aansturing van Huawei FusionCharge zonder afhankelijkheid van de FusionSolar-cloud: werkt naadloos samen met Huawei SUN2000-omvormers en LUNA2000-batterijen voor 100% zonneladen. |
| **KEBA KeContact P30/P40** | `keba_charger` | KEBA | `MODBUS` | Standaardpoort: 502, Unit-ID: 255 | Actief laadvermogen (W, reg 1020), Totale energie (kWh, reg 1036). | KEBA KeContact P30 x/c-serie & P40 laadstroom in milliampère (`5004`), vrijgave (`5014`) en KeContact S10 faseomschakeling (`5050=3`, `5052=0/1`). | Nauwkeurige 1 mA Modbus TCP-aansturing en automatische 1F/3F-faseomschakeling voor KEBA KeContact P30 en P40-installaties. |
| **Mennekes AMTRON (4You / 4Business / ACU / AMEDIO)** | `mennekes_ocpp` | Mennekes | `OCPP` | Poort: 8887 | Actief vermogen (W), Totale energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen. | Dynamische stroomregeling via SetChargingProfile (6A tot 32A), Faseomschakeling (1F / 3F). | Universele lokale OCPP-aansturing voor moderne Mennekes-productlijnen; maakt puur zonneladen en Vlaamse capaciteitspiekpreventie mogelijk. |
| **Mennekes AMTRON (Xtra / Premium / HCC3 Modbus)** | `mennekes_modbus` | Mennekes | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief laadvermogen (W), Cumulatieve energie (kWh). | Dynamische laadstroomregeling (Ampère, 6A tot 32A). | Directe lokale Modbus-aansturing voor Mennekes premium wallboxen; elimineert cloudvertraging voor onmiddellijke piekbewaking. |
| **Mercedes-Benz Wallbox** | `mercedes_wallbox` | Mercedes-Benz | `OCPP` | Poort: 8887 | Actief vermogen (W), Energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen. | Laadstroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F). | Autonoom thuisladen voor de Mercedes-Benz Wallbox; volledig geïntegreerd in de dynamische load balancing van GEMS. |
| **NRGkick (Gen 2)** | `nrgkick_gen2` | NRGkick | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime laadvermogen (W), Geleverde energie (kWh). | Laadstroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F). | Lokale Modbus TCP-regeling voor mobiele en wandgemonteerde NRGkick-laders; past stroomsetpoints automatisch aan op het zonne-overschot. |
| **OCPP Charger** | `ocpp_charger` | Generiek | `OCPP` | `ws://<EMS-IP>:8887/<ChargePointID>` of `ws://<EMS-IP>:8080/api/ocpp/<ChargePointID>` | Actief vermogen (W), Geleverde energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Stekker- en transactiestatus. | Gestandaardiseerd OCPP 1.6-J SetChargingProfile (stroomsetpoints: 0A pauze en 6A tot 32A). | Merkuafhankelijk centraal laadsysteem: ondersteunt honderden OCPP 1.6-J-compatibele zakelijke en residentiële laadpalen wereldwijd en stuurt dynamische laadprofielen op basis van de gekozen GEMS-strategie. |
| **Peblar EV-laadpaal (Home / Business / Plus)** | `peblar_charger` | Peblar | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime laadvermogen (W), Cumulatieve sessie-energie (kWh). | Dynamisch stroomsetpoint (Ampère, 6A tot 32A in stappen van 0,1A), Faseomschakeling (1F / 3F). | Nederlandse slimme wallbox: laat GEMS sub-seconde stroomaanpassingen sturen via Modbus TCP terwijl zakelijke split-billing gelijktijdig actief blijft. |
| **Phoenix Contact Charx Charger** | `phoenix_charger` | Phoenix Contact | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Laadvermogen (W), Totale sessie-energie (kWh). | Phoenix Contact CHARX SEC-3000 / EV-CC Modbus-laadstroomlimiet en laadvrijgave-coil/register. | Industriële lokale Modbus TCP load balancing en zonne-overschotladen voor Phoenix Contact CHARX-laadcontrollers. |
| **Phoenix Contact EV-CC / CHARX (Modbus TCP)** | `phoenix_contact_evcc` | Phoenix Contact | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief laadvermogen (W), Totale energie (kWh). | Dynamische stroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F). | Directe Modbus-registeraansturing om laadsnelheden continu bij te regelen voor piekbewaking en zonne-overschot. |
| **Externe CPO-wallbox (OCPP 1.6-J)** | `generic_cpo_ocpp` | Generiek OCPP | `OCPP` | `ws://<EMS-IP>:8080/api/ocpp/<ChargePointID>` | Actief vermogen (W), Geleverde energie (kWh), 3-fasenstromen en -spanningen. | Dynamische stroomregeling (Ampère, 6A tot 32A). | Lokaal slim laden en straight-through OCPP-proxy load balancing met externe CPO-verrekenplatformen op basis van zonne-overschot en hoofdzekeringslimieten. |
| **Porsche Wallbox / Mobile Charger Connect** | `porsche_wallbox` | Porsche | `OCPP` | Poort: 8887 | Actief laadvermogen (W), Geleverde energie (kWh), 3-fasenstromen en -spanningen. | Dynamische stroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F). | Verbindt Porsche-laadpalen rechtstreeks met GEMS zonder abonnement en bewaakt strikt de Vlaamse capaciteitspieklimieten. |
| **RAEDIAN Gemini AC Wallbox** | `raedian_gemini` | RAEDIAN | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Gecombineerd actief vermogen (W), Afzonderlijk laadvermogen Socket 1 & Socket 2 (W), Energie per laadaansluiting (kWh), Afzonderlijke 3-fasenstromen voor Socket 1 (L1, L2, L3) en Socket 2 (L1, L2, L3 in Ampère), stekkerstatus per laadaansluiting. | Continue dynamische stroommodulatie (0A tot 64A totaalbereik, dynamisch verdeeld over Socket 1 & Socket 2), Modus per laadaansluiting (Eco / Snel / Uit). | Geavanceerde load balancing voor dubbele laadaansluitingen: verdeelt het laadvermogen gelijktijdig over twee voertuigen, regelt de gecombineerde stroom dynamisch van 0A tot 64A en beschermt de hoofdzekering met maximaal zonnezelfverbruik. |
| **RAEDIAN NEO / NEX AC Wallbox** *(Primaire Referentie)* | `raedian_charger` | RAEDIAN | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 of 2 | Realtime actief laadvermogen (W), Sessie-energie (kWh), 3-fasen laadstromen (L1, L2, L3 in Ampère), 3-fasen laadspanningen (L1, L2, L3 in Volt), Socketstatus & foutcodes. | Continue dynamische stroomregeling (Ampère, 6A tot 32A in stappen van 0,1A), Automatisch pauzeren & hervatten van sessies. | Aanbevolen Modbus TCP-referentie-integratie: leest alle driefasige stromen en spanningen in één gebundeld verzoek uit; sub-seconde stroomregeling reageert onmiddellijk op zonne-overschotten en Vlaamse capaciteitspieken. |
| **SMA EV-laadpaal (7.4 / 22 / eCharger)** | `sma_evcharger` | SMA | `REST` | Standaardpoort: 80 / 443 | Actief vermogen (W), Cumulatieve energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère). | Enkel uitlezing (Alleen-lezen telemetrie — SMA EV-laadpaal vereist SEMP/SHM2 voor actieve stroomsturing). | Monitort het realtime laadvermogen en de sessie-energie van de SMA EV Charger voor nauwkeurige verwerking in het huishoudelijke energieoverzicht. |
| **Schneider Electric EVlink (Wallbox / Pro AC)** | `schneider_evlink` | Schneider Electric | `OCPP` | Poort: 8887 | Actief laadvermogen (W), Energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen. | Dynamische stroomregeling via SetChargingProfile (6A tot 32A), Faseomschakeling (1F / 3F). | Ingebouwde OCPP-setpointregeling voor vloeiend laden op zonne-overschot en het vermijden van capaciteitspieken. |
| **Siemens VersiCharge GEN3 Wallbox** | `siemens_versicharge` | Siemens | `OCPP` | Poort: 8887, ws://<EMS-IP>:8887/<ChargePointID> | Realtime vermogen (W), Cumulatieve energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen. | Dynamische stroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F). | Koppelt de Siemens VersiCharge GEN3 via OCPP aan GEMS en voert Vlaamse piekbewaking en zonne-overschotsturing uit. |
| **Sigenergy SigenStor EVAC / EVDC Charger** | `sigenergy_evac` | Sigenergy | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Laadvermogen (W), Sessie-energie (kWh), 3-fasenstromen en -spanningen. | Dynamische stroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F). | Directe Modbus-aansturing van Sigen EV-laadmodules in nauwe samenwerking met de SigenStor-batterij om overtollige zonne-energie optimaal te benutten. |
| **SmartEVSE v2 / v3 (HTTP / Modbus)** | `smartevse_charger` | SmartEVSE | `MODBUS` | Standaardpoort: 80, REST endpoint: /add | Actief vermogen (W), Totale energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Pilotstatus. | Dynamische stroomregeling (Ampère, 6A tot 32A via /add?current=X), Faseomschakeling (1F / 3F). | Lokale REST-setpointmodulatie waarmee open-source laadcontrollers 100% op zonne-overschot laden zonder cloudaccounts. |
| **SolarEdge EV-laadpaal** | `solaredge_evse` | SolarEdge | `MODBUS` | Standaardpoort: 502 / 1502, Slave-ID: 1 | Actief laadvermogen (W), Cumulatieve energie (kWh). | Dynamisch stroomsetpoint (Ampère, 6A tot 32A). | Synchroniseert de laadsnelheid met de opwekking van de SolarEdge-omvormer en beschermt de hoofdzekeringen van de woning. |
| **Veton / Phoenix CharX** | `veton_charger` | Veton | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief laadvermogen (W), Sessie-energie (kWh). | Dynamische laadstroomregeling (Ampère, 6A tot 32A). | Directe Modbus TCP-registeraansturing voor naadloos zonne-overschotladen en piekbewaking op architecturale Veton-designlaadpalen. |
| **Volkswagen / Elli / Skoda / SEAT (ID. Charger Connect / Pro)** | `elli_charger` | Volkswagen / Elli | `OCPP` | Poort: 8887, ws://<EMS-IP>:8887/<ChargePointID> | Actief laadvermogen (W), Totale sessie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Stekkerstatus. | Dynamische stroomregeling via SetChargingProfile (6A tot 32A), Faseomschakeling (1F / 3F). | Directe lokale OCPP-serverintegratie: laat ID. Chargers van de VW-groep puur op zonne-overschot laden en Vlaamse capaciteitspieken vermijden zonder dure cloudabonnementen. |
| **Wallbox Pulsar/Commander** | `wallbox_charger` | Wallbox | `CLOUD` | Authenticatie met Wallbox-cloudgegevens | Actief laadvermogen (W), Totale energie (kWh), Laderstatus. | Wallbox-API `PUT /v2/charger/{id}` dynamische stroomlimiet (6–32 A) en `POST /v3/chargers/{id}/remote-action` (`action: 1` Hervatten / `2` Pauzeren). | Geverifieerde closed-loop stroommodulatie en automatisch pauzeren/hervatten van laadsessies voor Wallbox Pulsar Plus, Pulsar Max, Copper SB en Commander 2. |
| **Webasto Next Charger** | `webasto_charger` | Webasto | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief laadvermogen (W, reg 5000), Geleverde sessie-energie (kWh, reg 5002). | Dynamische laadstroomregeling (Ampère, reg 5004, 6A tot 32A). | Directe Modbus-sturing: knijpt de Webasto-wallbox binnen milliseconden terug om hoofdzekeringen te beschermen en capaciteitspieken te vermijden terwijl zakelijke verrekening actief blijft. |
| **Zaptec Pro/Go** | `zaptec_charger` | Zaptec | `CLOUD` | Zaptec OAuth2-authenticatie | Actief vermogen (W), Cumulatieve energie (kWh), Sessiestatus. | Zaptec OAuth2 `/api/chargers/{id}/update` (`maxChargeCurrent` 0,1 A, `maxChargePhases` 1/3, Go 2 `threeToOnePhaseSwitchCurrent`), plus `/sendCommand/506` (Pauzeren) & `507` (Hervatten). | Geverifieerde precisiesturing voor Zaptec Go, Go 2 en Pro-installaties met OCMF-energiedecodering, pauzeren/hervatten en 1F/3F-zonneschakeling. |
| **go-e Charger Gemini / HOMEfix / PRO** | `goe_charger` | go-e | `REST` | Standaardpoort: 80, JSON endpoints: /api/status, /api/set | Laadvermogen (W), Sessie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Autorisatiestatus. | Vluchtige RAM-laadstroomregeling (Ampère, 6A tot 32A via `/api/set?amx=X` + `frc` pauze/hervatten — geen NVS-flashslijtage), faseomschakeling (1F / 3F via `/api/set?psm=X`). | Supersnelle lokale HTTP-API: laat GEMS dynamisch schakelen tussen 1-fase (vanaf 1,4 kW zon) en 3-fasen (tot 22 kW) en regelt binnen milliseconden terug bij huishoudelijke pieken. |
| **Generieke Lokale REST EVSE-gateway** | `generic_rest_evse` | Generiek REST | `REST` | Standaardpoort: 80, REST endpoint: /api/v1 | Realtime laadvermogen (W), Cumulatieve sessie-energie (kWh), Status laadstation. | Dynamische laadstroomregeling (Ampère, 6A tot 32A). | Gedistribueerde aansturing van meerdere laadpalen en dynamisch lastbeheer om het gezamenlijke vlootvermogen binnen de lokale netaansluiting te houden. |
| **Kempower Snellaadinfrastructuur** | `kempower_charger` | Kempower | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime laadvermogen (W), Sessie-energie (kWh), 3-fasen laadstromen (L1, L2, L3 in Ampère). | Lokale OCPP 1.6-J `SetChargingProfile` vermogens-/stroomregeling met automatische terugval op Modbus TCP-register `200` (`0,1 A`). | Geverifieerd commercieel snellaad- en vlootlastbeheer voor Kempower Satellite- en Station-snelladers. |
| **MyEnergi Zappi EV-laadpaal** | `myenergi_zappi` | MyEnergi | `REST` | Standaardpoort: 80, Endpoint: /cgi-jstatus | Realtime laadvermogen (W), Toegevoegde sessie-energie (kWh), Laadstatus, modus (Fast, Eco, Eco+). | Geauthenticeerde HTTP Digest CGI-commando's (`/cgi-zappi-mode-Z{sno}-{mode}-...`) met ASN-redirectvolging voor dynamisch schakelen tussen Stop-, Eco+-, Eco- en Fast-modi. | Geverifieerde lokale/hub-aansturing voor myenergi Zappi v2/v2.1-wallboxen met volledige driefasige telemetrie, fasemodusrapportage en actieve sessieregeling. |
| **SolaX Slimme EV-laadpaal** | `solax_evcharger` | SolaX | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime laadvermogen (W), Cumulatieve sessie-energie (kWh), Fasestromen (L1, L2, L3 in Ampère). | SolaX X1/X3-EVC max. laadstroom (`0x0628` in stappen van `0,01 A`), externe modus (`0x060D=1`), Stop/Start (`0x0627`) en 1-fase / 3-fasen omschakeling (`0xA105`). | Geverifieerde lokale Modbus TCP/RTU closed-loop sturing voor SolaX Smart EV Chargers met zonnevolging op 10 mA nauwkeurig en 1F/3F-contactorschakeling. |
| **Teltonika TeltoCharge** | `teltonika_teltocharge` | Teltonika Energy | `OCPP` | Poort: 8887, ws://<EMS-IP>:8887/<ChargePointID> | Realtime laadvermogen (W), Cumulatieve sessie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), Spanningen (V). | Dynamische laadstroomregeling (Ampère, 6A tot 32A via SetChargingProfile). | Ingebouwde OCPP-integratie voor Europese residentiële installaties; optimaliseert laadsessies op basis van Vlaamse capaciteitspieken en EPEX-spotprijzen. |
| **Volt Time Source EV-laadpaal** | `volttime_source` | Volt Time | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime laadvermogen (W), Cumulatieve sessie-energie (kWh), Fasestromen (L1, L2, L3 in Ampère). | Volt Time / Plugchoice API v3 dynamische stroomlimiet & pauze/hervatten met lokale Modbus TCP-register `1020` terugval. | Geverifieerde actieve load balancing en zonne-overschotsturing voor Volt Time Source en Plugchoice EV-wallboxen. |
| **Wallbox Pulsar Plus / Commander (OCPP)** | `wallbox_ocpp` | Wallbox | `OCPP` | Poort: 8887, ws://<EMS-IP>:8887/<ChargePointID> | Realtime laadvermogen (W), Cumulatieve sessie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), Spanningen (V). | Dynamische laadstroomregeling (Ampère, 6A tot 32A via SetChargingProfile). | Directe cloudvrije lokale OCPP-integratie voor Wallbox-laadpalen; elimineert cloudafhankelijkheid en vertraging voor directe energie-automatisering. |
| **cFos Power Brain Wallbox / Solar** | `cfos_powerbrain` | cFos | `MODBUS` | Standaardpoort: 4701, EVSE Unit-ID: 1, Holding-registers `8058`–`8094` | Realtime laadvermogen (W), Cumulatieve afgenomen energie (kWh), 3-fasen laadstromen (0.1 A), Status actief faserelais. | 0,1 A laadstroomlimiet (`8093`), laadvrijgave (`8094`) en 1-fase / 3-fasen contactorschakeling (`8087`). | Nauwkeurige 0,1 A zonne-overschotvolging, hoofdzekeringbeveiliging en geautomatiseerde 1F/3F-contactorschakeling. |
| **FoxESS EV-laadpaal A7300 / A011K / A022K** | `foxess_evcharger` | FoxESS | `MODBUS` | Standaardpoort: 502, Unit-ID: 1, Holding `0x1003`–`0x1017` & `0x3002` | Laadvermogen (W), Cumulatieve energie (kWh), 3-fasenstromen (A), 3-Fasespanningen (V), Laderstatus. | 0,1 kW getrapte vermogenslimiet (`0x3002`: `1,4–4,1 kW` 1-fasebereik, `4,2–22,0 kW` 3-fasenbereik, `0` Pauze) & automatische faseomschakeling (`0x300A`). | Naadloze ecosysteempartner voor FoxESS hybride omvormers met fijnmazige zonne-overschotmodulatie en automatische 1F/3F-omschakeling. |
| **Heidelberg Energy Control / Amperfied connect.solar** | `heidelberg_ampere` | Amperfied (Heidelberg) | `MODBUS` | Poort: 502, Unit-ID: 255 | Actief laadvermogen (W), Totale energie (kWh), 3-fasenstromen (0.1 A), 3-Fasespanningen (V), IEC-voertuigstatus, aantal actieve fasen. | 0,1 A laadstroomlimiet (Holding `261`), stand-by-/vergrendelingsbeheer (`258`–`259`) en 1-fase / 3-fasen omschakeling (`501` op `connect.solar`). | Sub-seconde 0,1 A stroommodulatie voor Vlaamse capaciteitspiekbewaking en naadloos 1F/3F-zonneladen. |
| **openWB Pro / openWB series2 (HTTP & Modbus)** | `openwb_pro` | openWB | `MODBUS` | `/connect.php` | Realtime laadvermogen (W), Afgenomen energie (kWh), 3-fasenstromen (A), 3-Fasespanningen (V), Stekker- & laadstatus, actieve fasen. | 0,1 A / 0,01 A dynamische stroomlimiet (`ampere` / Holding `10171`) en geautomatiseerde 1-fase / 3-fasen contactorschakeling (`phasetarget` / `10180`). | Ultrafijne 10–100 mA zonne-overschotvolging en hardwarematige 1F/3F-faseomschakeling zonder enige cloudafhankelijkheid. |
| **Sungrow AC011E-01 / AC22E-01 EV-laadpaal** | `sungrow_evcharger` | Sungrow | `MODBUS` | Standaardpoort: 502, Standaard Unit-ID: 248, Input `21269`–`21316` & Holding `21202`–`21211` | Actief laadvermogen (W), Cumulatieve energie (kWh), 3-fasenstromen (0.1 A), 3-fasenspanningen (0.1 V), Status faseomschakeling. | 0,1 A uitgangsstroomlimiet (`21202`), Start/Stop-sturing (`21211`) en 1-fase / 3-fasen omschakeling (`21203`). | Directe lokale Modbus-partner voor Sungrow SH/SG-installaties met 0,1 A overschotregeling en 1F/3F-omschakeling. |
| **Tinkerforge WARP Charger 2 / 3 (Smart & Pro)** | `warp_charger` | Tinkerforge | `REST` | `/evse/state`, `/meter/values`, `/evse/external_current`, `/power_manager/external_control` | Actief laadvermogen (W), Absolute energieteller (kWh), 3-fasenstromen (A), 3-Fasespanningen (V), IEC 61851-status, 1F/3F-contactorstatus. | Externe stroomlimiet met 1 mA resolutie (`6000–32000 mA`, `0` Pauze) en WARP3 1-fase / 3-fasen contactorschakeling (`phases_wanted`). | Industriële open-interface wallboxintegratie met 1 mA nauwkeurige zonnevolging en geautomatiseerde 1F/3F-contactorsturing. |
| **Vestel EVC04 Home Smart / Mobility** | `vestel_evc04` | Vestel | `MODBUS` | Standaardpoort: 502, Standaard Unit-ID: 255, Lifebit Watchdog `6000=1` | Totaal actief vermogen (W), Cumulatieve energie (kWh), 3-fasenstromen (mA), 3-Fasespanningen (V), Laadpunt- & kabelstatus. | Dynamische laadstroomlimiet (`5004`, `0` of `6–32 A`), fail-safe watchdog (`6000`) en 1-fase / 3-fasen omschakeling (`405`). | Betrouwbare lokale Modbus TCP load balancing, hoofdzekeringbeveiliging en 1F/3F-zonneschakeling voor Vestel EVC04-laadpalen. |
| **Hardy Barth cPµ1 / cPµ2 (Salia / eCB1) Wallbox** | `hardy_barth_charger` | Hardy Barth | `REST` | Standaardpoort: 80, `/api/v1/chargecontrols/1` & `/api/secc` | Realtime laadvermogen (W), Cumulatieve sessie-energie (kWh), 3-fasen laadstromen (`L1, L2, L3` in Ampère) & Voltages (`L1, L2, L3` in Volt). | Dynamische lokale REST-stroomlimiet (`PUT /api/v1/chargecontrols/1/mode` met `manualmodeamp=6..32 A` of `mode=stop`; Salia `PUT /api/secc` `grid_current_limit` terugval). | 100% lokale cloudvrije stroommodulatie voor Hardy Barth Salia en eCB1-wallboxen: stemt de EV-laadsnelheid af op het zonne-overschot en regelt terug bij zekering- of capaciteitspieken. |

### Overzichtstabel: Slimme Netmeters & Energie-analyzers (40 Toestellen)

| Toestelnaam | Template-ID | Merk | Protocol | Standaardpoort / Bus | Uitgelezen Data | Aangestuurde Setpoints | Praktische GEMS-rol |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ABB A43 / A44 / B23 / B24 Meter** | `abb_meter` | ABB | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief netafname-/injectievermogen (W), Totale actieve afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Frequentie (Hz). | Alleen-lezen nettelemetrie. | Uiterst nauwkeurige netaansluitingsmeting; levert continue driefasige stromen aan de GEMS fase-loadbalancer om het uitvallen van hoofdzekeringen te voorkomen en stuurt de Vlaamse kwartierpiekberekening aan. |
| **Acrel ADW300 Meter** | `acrel_adw300` | Acrel | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Totaal actief vermogen (W), Afname-/injectie-energie (kWh), Actief vermogen per fase (W), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Alleen-lezen nettelemetrie. | Bewaakt de hoofdaansluiting of onderverdeelborden; informeert GEMS over exacte fasebelastingen om laadsnelheden te moduleren en zekeringen te beschermen. |
| **B+GE-TECH WS100 / DS100 Meter** | `bgetech_ws100` | B+GE-TECH | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime afname-/injectievermogen (W), Totale actieve energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Alleen-lezen nettelemetrie. | Directe netgrensmeting; levert realtime vermogen voor closed-loop EV-laden op zonne-overschot en Vlaamse piekbewaking. |
| **Carlo Gavazzi EM112 / EM340 / EM540** | `carlogavazzi_em340` | Carlo Gavazzi | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Netto actief vermogen (W), Totale afname-/injectie-kWh, 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Alleen-lezen nettelemetrie. | Snelle sub-seconde netmeter (met name de EM540); essentieel voor onmiddellijke reactieve terugregeling van EV-laadpalen bij verbruikspieken om de hoofdzekeringen te beschermen. |
| **Carlo Gavazzi EM24 (RS485/Ethernet)** | `carlogavazzi_em24` | Carlo Gavazzi | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Totaal actief vermogen (W, richtingsgevoelig: + afname, - injectie), Cumulatieve energieregisters (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Alleen-lezen nettelemetrie. | Industriestandaard energiemeter in hoogwaardige zonne- en laadinstallaties; levert deterministische 1-seconde telemetrie voor GEMS piekbewaking en dynamic load balancing. |
| **ESPHome DSMR / DLMS Slimme Meter** | `esphome_meter` | ESPHome | `REST` | Standaardpoort: 80, Endpoint: /sensor/grid_power of /text_sensor/dsmr | Realtime netvermogen (W), Totale afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Gasverbruik (m³). | Alleen-lezen REST-telemetrie. | Integreert open-hardware P1-lezers in GEMS en levert volledige digitale metertelegrammen via Wi-Fi zonder cloudafhankelijkheid. |
| **Eastron SDM120 / SDM220 / SDM230 (1-Fase Meter)** | `eastron_sdm120_230` | Eastron | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief vermogen (W), Totale afname-/injectie-energie (kWh), Fasestroom (Ampère), Lijnspanning (Volt), Arbeidsfactor (cos φ). | Alleen-lezen telemetrie. | Bewaakt monofasige netaansluitingen, afzonderlijke warmtepompkringen of monofasige PV-omvormers en integreert deze in de GEMS-belastingsanalyse. |
| **Eastron SDM630 3-Fasen Meter** | `eastron_sdm630` | Eastron | `MODBUS` | Standaardpoort: 502, Slave-ID: 1, Baudrate: 9600 | Netto totaal actief vermogen (W, reg 0x0034), Totale afname-/injectie-energie (kWh), Individuele fasestromen (L1, L2, L3 in Ampère, reg 0x0006), Individuele fasespanningen (L1, L2, L3 in Volt, reg 0x0000). | Alleen-lezen nettelemetrie. | Breed toegepaste driefasige meter; levert de basistelemetrie voor Vlaams capaciteitstariefbeheer, fase-onbalansbewaking en sturing van zonne-overschotten. |
| **Eastron SDM72D / SMART X96 3-Fasen Meter** | `eastron_sdm72_x96` | Eastron | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Totaal actief vermogen (W), Actieve afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Alleen-lezen nettelemetrie. | Compacte DIN-rail energiemeting; voedt live netwaarden aan de GEMS-regelcyclus om laadpalen bij te sturen en energierapporten op te bouwen. |
| **Eltako DSZ15DZMOD / DSZ16 Meter** | `eltako_meter` | Eltako | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief vermogen (W), Afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Alleen-lezen nettelemetrie. | Nauwkeurige Duitse tussen- en hoofdmeting; levert realtime fasestromen en netafname/injectie voor de huishoudelijke overbelastingsbeveiliging van GEMS. |
| **Finder 7M.24 / 7M.38 Meter** | `finder_7m` | Finder | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief vermogen (W), Actieve afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Alleen-lezen nettelemetrie. | Betrouwbare MID-gekeurde energiemeting; voedt live elektrische meetwaarden aan GEMS voor closed-loop dynamische stroomregeling. |
| **HomeWizard Meter** | `homewizard_meter` | HomeWizard | `REST` | Standaardpoort: 80, JSON Endpoint: /api/v1/data | Actief netvermogen (W), Totale afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Verbruik gekoppelde gasmeter (m³). | Alleen-lezen lokale REST-API. | Plug-and-play Wi-Fi P1-meter: stelt GEMS in staat elke 1–2 seconden digitale metertelegrammen uit te lezen zonder bekabeling, met volledige ondersteuning voor Vlaamse en Nederlandse piekopvolging. |
| **Homey Energy Dongle (P1)** | `homey_p1` | Homey | `NETWORK` | Standaardpoort: 80 | Actief netvermogen (W), Totale afname-/injectie-energie (kWh), 3-fasenstromen en -spanningen. | Alleen-lezen telemetrie. | Vangt lokale netwerktelemetrie op van Homey P1-dongles en toont live huishoudelijke netstromen op het GEMS-dashboard. |
| **Inepro PRO380-MOD / PRO1-MOD Meter** | `inepro_pro380` | Inepro | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Totaal actief vermogen (W), Afname-/injectie-kWh-registers, 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Alleen-lezen nettelemetrie. | Hoognauwkeurige Nederlandse DIN-rail energiemeter; levert driefasige stromen voor GEMS dynamic load balancing en hoofdzekeringbeveiliging. |
| **Lovato DMG610 3-Fasen Meter** | `lovato_dmg610` | Lovato | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Totaal actief vermogen (W), Afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Alleen-lezen nettelemetrie. | Industriële netanalysemeter; levert snelle elektrische meetwaarden om hoofdleidingen te beschermen tegen transformator- of zekeringoverbelasting. |
| **Loxone Miniserver** | `loxone_miniserver` | Loxone | `REST` | Standaardpoort: 80 / 443, Endpoints: /jdev/sfs/getstatus | Geaggregeerd huishoudelijk vermogen (W), tussenmetervermogens (W), Totale energietellers (kWh). | Alleen-lezen REST-telemetrie. | Koppelt woningen met een Loxone Miniserver aan GEMS, zodat GEMS de slimme meterdata uit Loxone kan gebruiken als primaire netreferentie. |
| **Niko Home Control (NHC II)** | `niko_nhc` | Niko | `REST` | Standaardpoort: 8884 of 80, JSON Endpoint: /hobby/v1/devices | Realtime netafname-/injectievermogen (W), Vermogensverbruik deelkringen (W), Cumulatieve energie (kWh). | Alleen-lezen lokale API. | Naadloze integratie met Belgische Niko Home Control II-installaties; leest stroomklemmetingen lokaal uit om GEMS-piekbewaking aan te sturen. |
| **P1 Slimme Meter (Network/TCP)** | `p1_network` | Generiek | `NETWORK` | Standaardpoort: 23, 8088, of 8234, Ruwe DSMR-telegrammen | Realtime actief vermogen (+ afname / - injectie in Watt, OBIS 1.7.0 & 2.7.0), cumulatieve energie tarief 1 & 2 (kWh, OBIS 1.8.1/2 & 2.8.1/2), 3-fasenstromen (L1, L2, L3 in Ampère, OBIS 31.7.0, 51.7.0, 71.7.0), 3-fasenspanningen (L1, L2, L3 in Volt, OBIS 32.7.0, 52.7.0, 72.7.0), Vlaams kwartierpiekregister (15-minutenpiek) (W, OBIS 1.6.0), Gasverbruik (m³, OBIS 0-1:24.2.1). | Alleen-lezen digitale telegramstroom. | Primaire netinterface voor P1-meters via LAN: decodeert officiële Fluvius- (België) en DSMR 4.x/5.x-telegrammen (Nederland) en stuurt de voorspellende Vlaamse capaciteitstarief-engine en het adaptieve piekplafond aan. |
| **P1 Slimme Meter (USB/Serial)** | `p1_serial` | Generiek | `SERIAL` | /dev/ttyUSB0 of /dev/ttyAMA0, Baudrate: 115200 voor DSMR 4/5, 9600 voor DSMR 2/3 | Realtime actief vermogen (W, OBIS 1.7.0/2.7.0), afname-/injectie-energie tarief 1/2 (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Belgische maximale kwartierpiek (W, OBIS 1.6.0), Gasmetervolume (m³). | Alleen-lezen digitale telegramstroom. | Directe vertragingsvrije hardwareverbinding met Belgische en Nederlandse digitale meters; levert elke seconde CRC-gevalideerde telegrammen als fundament voor sub-seconde EV load balancing en Vlaamse kwartierpiekbewaking. |
| **SMA Energiemeter 2.0 / Data Manager M (Modbus TCP)** | `sma_energymeter` | SMA | `MODBUS` | Standaardpoort: 502, Slave-ID: 2 of 126 | Actief netafname-/injectievermogen (W), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Actieve vermogensbegrenzing (stuurt SMA-omvormers aan via Data Manager). | Meet het vermogen op het netaansluitpunt en fungeert als gateway; informeert GEMS over de netto uitwisseling en stuurt actieve PV-terugregeling aan richting SMA-omvormers. |
| **Schneider Electric Acti9 iEM3000 / PM3200 Series** | `schneider_iem3000` | Schneider Electric | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Totaal actief vermogen (W), Actieve afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Alleen-lezen nettelemetrie. | Commerciële en residentiële tussen- en hoofdmeting; levert deterministische fasestroomtelemetrie om verdeelborden tegen overbelasting te beveiligen. |
| **Shelly 3EM (Gen 1 3-Fasen Meter)** | `shelly_3em` | Shelly | `REST` | Standaardpoort: 80, JSON Endpoint: /status | Totaal actief vermogen (W), Vermogen per fase (W), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Cumulatieve geïnjecteerde/verbruikte energie (kWh). | Ingebouwde 10A-contactoruitgang (Inschakelen / Uitschakelen via /relay/0?turn=on). | Leest snelle driefasige stroomklemmetingen uit via Wi-Fi; het ingebouwde relaiscontact kan automatisch thermische verbruikers inschakelen of niet-essentiële verbruikers afschakelen tijdens capaciteitspieken. |
| **Shelly Pro 3EM / Gen3 3EM-63T (3-Fasen Meter)** | `shelly_pro_3em` | Shelly | `REST` | Standaardpoort: 80, JSON Endpoint: /rpc/EM.GetStatus | Netto actief vermogen over alle fasen (W), Actief vermogen per fase (W), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), 4-kwadrant energietellers (kWh). | Ingebouwde hulprelaisuitgang (Inschakelen / Uitschakelen via /rpc/Switch.Set). | Uiterst betrouwbare Ethernet DIN-rail meter: levert directe fasetelemetrie aan GEMS voor sub-seconde EV-stroomregeling, terwijl de ingebouwde relaisuitgang warmtepomp-boost of warmwaterboilers aanstuurt. |
| **Siemens SENTRON (PAC2200 / 7KT1665 Meter)** | `siemens_pac2200` | Siemens | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Totaal actief vermogen (W), Cumulatieve afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Alleen-lezen nettelemetrie. | Hoogwaardige industriële energiemeting; bewaakt de aansluitcapaciteit en stroomt telemetrie naar GEMS voor actieve lastafschakeling en besparingsberekeningen. |
| **Socomec COUNTIS E24/E34/E44 / DIRIS A-40** | `socomec_meter` | Socomec | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Totaal actief vermogen (W), Actieve afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Alleen-lezen nettelemetrie. | Nauwkeurige driefasige zakelijke en residentiële energiemeting; informeert GEMS over de faseverdeling om EV-laden in balans te houden en zekeringuitval te voorkomen. |
| **WAGO 879 Series (879-3000 / 879-3020 / 879-3040)** | `wago_879` | WAGO | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Actief vermogen (W), Totale actieve energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt). | Alleen-lezen nettelemetrie. | Precisie DIN-rail energiemeter; stroomt driefasige stromen en spanningen naar GEMS voor realtime zekeringbeveiliging, berekening van zonne-overschot en energiestroomvisualisatie. |
| **Accuenergy AcuRev / Acuvim Series Meter** | `accuenergy_meter` | Accuenergy | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime netto actief netvermogen (W), Totale energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V). | Autonoom / Alleen-lezen nettelemetrie. | Uiterst nauwkeurige driefasige netgrensbewaking en fase-loadbalancing voor commerciële en residentiële installaties. |
| **Algodue UPM209 / UPM309 Series Meter** | `algodue_meter` | Algodue | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime netto actief netvermogen (W), Totale energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V). | Autonoom / Alleen-lezen nettelemetrie. | Continue meting van netuitwisseling, arbeidsfactorbewaking en overbelastingsbeveiliging van de hoofdzekering. |
| **Chint DTSU666 / DTSU666-H 3-Fasen Meter** | `chint_dtsu666` | Chint | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime netto actief netvermogen (W), Totale afname- & injectie-energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V). | Autonoom / Alleen-lezen nettelemetrie. | Standaard driefasige bidirectionele netmeterintegratie; stuurt de berekening van zonne-overschotten en de stroommodulatie van EV-laadpalen aan. |
| **Hager ECM / ECR / ECP Energiemeter** | `hager_meter` | Hager | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime netto netvermogen (W), Totale afname-energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V). | Autonoom / Alleen-lezen nettelemetrie. | DIN-rail bewaking in het residentiële verdeelbord die sub-seconde fasetelemetrie aanlevert aan de overbelastingsbeveiliging van GEMS. |
| **Janitza UMG Series Netanalyzer** | `janitza_umg` | Janitza | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime netto netvermogen (W), Totale afname-energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Lijnspanningen (V), Frequentie (Hz). | Autonoom / Alleen-lezen nettelemetrie. | Hoognauwkeurige industriële netanalyse-integratie die hoogfrequente netstromen en fase-onbalans registreert. |
| **Kamstrup Energiemeter (Modbus Gateway)** | `kamstrup_meter` | Kamstrup | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime netto netvermogen (W), Totale afname-energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V). | Autonoom / Alleen-lezen nettelemetrie. | Integreert elektriciteits- en thermische stadsverwarmingsmeters in het centrale energieoverzicht van GEMS. |
| **Landis+Gyr Industriële Nutsmeter** | `landisgyr_meter` | Landis+Gyr | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime netto netvermogen (W), Totale afname- & injectie-energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V). | Autonoom / Alleen-lezen nettelemetrie. | Bewaakt grote commerciële en industriële aansluitpunten om naleving van dynamische piekbewakingslimieten te garanderen. |
| **Phoenix Contact EMpro Energiemeter** | `phoenix_empro` | Phoenix Contact | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime netto netvermogen (W), Totale afname-energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V). | Autonoom / Alleen-lezen nettelemetrie. | Stroomt realtime driefasige netgrensmetingen naar GEMS voor directe zonne-overschotsturing. |
| **Weidmüller Energiemeter (500 / 600 / 700)** | `weidmuller_meter` | Weidmüller | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Realtime netto netvermogen (W), Totale afname-energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V). | Autonoom / Alleen-lezen nettelemetrie. | Industriële vermogensbewaking voor bedrijfsgebouwen en onderverdeelborden met meerdere verbruikersgroepen. |
| **YouLess LS120 Puls- & P1-meter** | `youless_ls120` | YouLess | `REST` | Standaardpoort: 80, Endpoint: /a?f=j | Realtime netto netvermogen (W), Totale afname-energie (kWh). | Autonoom / Alleen-lezen nettelemetrie. | Verbindt via het lokale netwerk met P1-poorten van digitale meters of optische draaischijfmeters zonder enig cloudabonnement. |
| **Fronius Slimme Meter IP / Solar API v1** | `fronius_smartmeter_ip` | Fronius | `HTTP` | `GET /solar_api/v1/GetMeterRealtimeData.cgi?Scope=Device&DeviceId=0` | Richtingsgevoelig netto netvermogen (W), Totale afgenomen & geïnjecteerde energie (kWh), Richtingsgevoelige fasestromen (L1, L2, L3 in Ampère), Fasespanningen (V). | Autonoom / Enkel uitlezing | Bekabelingsvrije lokale HTTP-netgrensmeting voor Fronius-ecosystemen die richtingsgevoelige fasestromen aanlevert voor hoofdzekeringbeveiliging en piekbewaking. |
| **Huawei EMMA-A02 / DTSU666-H Slimme Vermogenssensor** | `huawei_emma` | Huawei | `MODBUS` | Poort: 502, Holding `31633`–`31666` op EMMA-A02 & `2102`–`2175` Float32 op DTSU666-H | Richtingsgevoelig vermogen op netaansluitpunt (W), Totale afname- & injectie-energie (kWh), Richtingsgevoelige 3-fasenstromen (A), 3-Fasespanningen (V). | Autonoom / Enkel uitlezing | Supersnelle netgrenstelemetrie voor Huawei SUN2000 & LUNA2000-installaties met EMMA-A02 of losse RS485-vermogenssensoren. |
| **KOSTAL Slimme Energiemeter (KSEM G1 / G2)** | `kostal_ksem` | KOSTAL | `MODBUS` | Standaardpoort: 502, Standaard Unit-ID: 71, Holding-registers `0`–`143` & `512`–`519` | Actief afname- & injectievermogen (0.1 W), Totale afname- & injectie-energie (0.1 Wh -> kWh), Richtingsgevoelige fasestromen (A) & spanningen (V). | Autonoom / Enkel uitlezing | Sub-seconde Ethernet DIN-rail netgrensmeting met richtingsgevoelige fasestromen voor DLB en capaciteitspiekbewaking. |
| **Tasmota SML / OBIS Optische IR-lezer & EcoTracker** | `tasmota_sml` | Tasmota | `REST` | `/cm?cmnd=Status%208` StatusSNS & EcoTracker `/v1/json` | Realtime netto netvermogen (W), Totale afname- & injectietellers (kWh), Fasestromen (A) & Spanningen (V). | Autonoom / Enkel uitlezing | Cloudvrije optische IR-uitlezing voor moderne Europese digitale nutsmeters zonder fysieke RJ12 P1-poort. |

### Overzichtstabel: Slimme Relais & Thermische Actuatoren (12 Toestellen)

| Toestelnaam | Template-ID | Merk | Protocol | Standaardpoort / Bus | Uitgelezen Data | Aangestuurde Setpoints | Praktische GEMS-rol |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Generiek HTTP-relais** | `generic_relay` | Generiek | `REST` | Standaardpoort: 80 / 8080, Configureerbare URL-endpoints voor status en schakelen | Actief vermogensverbruik van aangesloten toestel (W, optioneel indien bemeterd). | Relais-/contactoruitgangsstatus (Inschakelen / Uitschakelen). | Geautomatiseerde contactorsturing: schakelt elektrische warmwaterboilers, zwembadpompen of weerstandsverwarming in zodra de zonne-injectie instelbare drempels overschrijdt (bijv. > 1500W gedurende 2 minuten), met strikte minimale in- en uitschakelhysterese. |
| **Shelly Plus 1PM / Pro 1PM / Plug S (Relais & Vermogensmeting)** | `shelly_plus_1pm` | Shelly | `REST` | Standaardpoort: 80, Endpoints: /rpc/Switch.Set, /rpc/Switch.GetStatus | Actief vermogen aangesloten toestel (W), Cumulatief energieverbruik (kWh), Interne toesteltemperatuur (°C), Voedingsspanning (V). | Relais-/contactoruitgangsstatus (Inschakelen / Uitschakelen via /rpc/Switch.Set). | SG-Ready Warmtepomp Boost & Toestelautomatisering: activeert SG-Ready Bedrijfsstatus 3 (thermische boostmodus) van warmtepompen of warmwaterboilers tijdens zonne-overschot of negatieve spotprijzen en registreert het actuele verbruik in het GEMS-logboek. |
| **Modbus Digitale I/O-relaismodule** | `modbus_relay` | Modbus Relais / I/O | `MODBUS` | Standaardpoort: 502, Slave-ID: 1 | Digitale in- / uitgangsstatus van coils (Open / Gesloten). | Relais-coil aansturing (Coil 1–8 In- / Uitschakelen). | Industriële contactorschakeling voor zware verbruikers, driefasige verwarmingsbatterijen en lastafschakeling bij piekbelasting. |
| **SG-Ready Warmtepomp (Daikin/Nibe/Bosch/Vaillant/Panasonic)** | `sgready_heatpump` | SG-Ready (Daikin, Nibe, Bosch/Nefit, Vaillant, Panasonic, Mitsubishi, Stiebel Eltron, Wolf) | `REST` | Standaardpoort: 80, REST Endpoint: /api/sgready | SG-Ready bedrijfsstatus (Status 1: Blokkering / Status 2: Normaal / Status 3: Boost / Status 4: Maximaal), elektrisch verbruik (W). | SG-Ready bedrijfsmodus (Status 2 Normaal vs. Status 3 Thermische Boost). | Geautomatiseerde thermische opslag met warmtepompen: activeert Status 3 (verhoogd thermisch setpoint) tijdens zonne-overschot of negatieve dynamische uurprijzen om sanitair warm water en buffervaten voor te verwarmen, en keert terug naar Status 2 tijdens netpieken. |
| **Shelly Plus 1 / Pro 1 (Potentiaalvrij Droog-contactrelais)** | `shelly_plus_1` | Shelly | `REST` | Standaardpoort: 80, Endpoint: /rpc/Switch.Set | Schakelstatus (Aan / Uit), toesteltemperatuur (°C), ingangsstatus. | Uitgangsstatus droog-contactrelais (Inschakelen / Uitschakelen). | Potentiaalvrij droog contact voor het aansturen van SG-Ready warmtepompingangen, externe vrijgaveklemmen van EV-laadpalen of circulatiepompen. |
| **Shelly Plus 2PM / Pro 2PM (Dubbel Relais & Vermogensmeter)** | `shelly_plus_2pm` | Shelly | `REST` | Standaardpoort: 80, Endpoints: /rpc/Switch.Set, /rpc/Switch.GetStatus | Actief vermogen Kanaal 1 & Kanaal 2 (W), cumulatieve energie per kanaal (kWh), Voedingsspanning (V). | Dubbele relaisuitgangsstatus (Kanaal 0 & Kanaal 1 onafhankelijk Aan / Uit). | Onafhankelijke tweekanaals automatisering: schakelt en meet meerdere verwarmingstrappen of stuurt tweekanaals SG-Ready warmtepompconfiguraties aan (Status 1 t/m Status 4). |
| **Daikin Altherma 3 & HomeHub (Smart Grid Modbus)** | `daikin_altherma` | Daikin | `MODBUS` | Standaardpoort: 502, Unit-ID: 1, Input `21`–`50` & Holding `2`, `53` | Ogenblikkelijk elektrisch warmtepompverbruik (W), SWW-boilertemperatuur (°C), aanvoerwatertemperatuur (°C), Smart Grid-status. | Smart Grid-bedrijfsmodus (`53`: Vrijloop Normaal vs. Aanbevolen Aan PV-overschot Boost) & SWW-temperatuursetpoint (`2`). | Rechtstreekse Modbus TCP thermische opslagautomatisering voor Daikin Altherma 3-warmtepompen: zet overtollige zonne-energie en negatief geprijsde stroom om in sanitair warm water en ruimteverwarming. |
| **my-PV AC•THOR / AC•THOR 9s / AC ELWA 2 Zonnestroomverdeler (PV-diverter)** | `mypv_acthor` | my-PV | `MODBUS` | Standaardpoort: 502, Unit-ID: 1, Holding-registers `1000`–`1003` | Werkelijk verwarmingsvermogen dompelweerstand (W), sanitair-warmwatertemperatuur (`0,1 °C`), bedrijfsstatus. | Traploos lineair verwarmingsvermogenssetpoint (`1000`: `0–9000 W`), relais-booststatus en max. boilertemperatuursetpoint (`1002`). | Proportionele zero-export thermische opslag: stuurt elk beschikbaar watt aan PV-overschot traploos naar warmwaterbuffers voordat er netinjectie of terugregeling plaatsvindt. |
| **NIBE S-Series Warmtepomp (S1155 / S1255 / S2125 / VVM)** | `nibe_heatpump` | NIBE | `MODBUS` | Standaardpoort: 502, Unit-ID: 1, Input `8`, `2166`, `2285` & Holding `697`, `707` | Ogenblikkelijk elektrisch compressorvermogen (`2166` W), Cumulatief verbruikte elektrische energie (`2285` kWh), SWW-boventemperatuur boiler (`8` °C). | SG-Ready / Smart Price Luxury SWW-boost (`697` / `47`) en comforttemperatuursetpoint (`707` `0,1 °C`). | Directe Wi-Fi/Ethernet Modbus TCP-integratie voor NIBE S-serie warmtepompen: verhoogt de thermische buffer tijdens zonne-overschot en goedkope EPEX-uren. |
| **Stiebel Eltron / Tecalor ISG Web & Plus (WPM)** | `stiebel_eltron_isg` | Stiebel Eltron | `MODBUS` | Standaardpoort: 502, Unit-ID: 1, Input `521`, `2500`, `3506` & Holding `1509`, `4000`–`4002` | SWW-boilertemperatuur (`521` °C), compressor- & SWW-pompstatus (`2500`), Cumulatieve elektrische energie (kWh). | SG-Ready energiebeheer inschakelen (`4000=1`), SG-Ready Status 2 / Status 3 PV-boost (`4001`–`4002`) en comfort SWW-setpoint (`1509`). | Gestandaardiseerde Modbus TCP SG-Ready boost- en comforttemperatuursturing voor Stiebel Eltron en Tecalor warmtepompen. |
| **Tasmota Slimme Stekker / DIN-vermogensrelais** | `tasmota_relay` | Tasmota | `REST` | `/cm?cmnd=Power%20On\|Off` & `/cm?cmnd=Status%208` | Actief verbruiksvermogen (W), Cumulatieve energie (kWh), Voedingsspanning (V), Belastingsstroom (A). | Uitgangsstatus relaiskanaal (`Power{1..8} On` / `Off` met hysteresebeveiliging). | 100% lokale cloudvrije schakeling en vermogensmeting voor elektrische boilers, zwembadpompen, e-bikeladers en hulprelais. |
| **Askoma ASKOHEAT+ Modbus TCP PV-boilerweerstand** | `askoheat_diverter` | Askoma | `MODBUS` | Standaardpoort: 502, Unit-ID: 1, Holding-registers `100`, `200`–`202`, `300`–`304` | Werkelijk verwarmingsvermogen boilerweerstand (`300` W), boilerwatertemperatuur (`302` `0,1 °C`), bitmasker actieve verwarmingstrappen (`301`), Cumulatieve thermische energie (`304` `0.1 kWh`). | Traploos overschot-/vermogenssetpoint (`200`–`201` W), 7-traps verwarmingssturing (`100` trappen 0–7), antilegionella-boost en max. watertemperatuursetpoint (`202` `0,1 °C`). | Proportionele 7-traps en traploze zonthermische sturing voor Askoma ASKOHEAT+ dompelweerstanden: zet overtollige zonneproductie en negatief geprijsde stroom rechtstreeks om in warmwaterbuffers. |

---

## Gedetailleerde Specificaties per Toestel

Hieronder volgt de volledige technische specificatie voor alle 168 hardwareprofielen die standaard in GEMS worden ondersteund.

## 1. Zonne- & Hybride Omvormers (37 Toestellen)

Omvormertemplates communiceren rechtstreeks via Modbus TCP (Ethernet- / Wi-Fi-dongles), industriële SunSpec-standaarden of lokale HTTP REST-API's. Ze bewaken realtime fotovoltaïsche (PV) zonneproductie, de laadtoestand van hybride batterijen (SOC %), laad-/ontlaadvermogen en uitwisseling met het elektriciteitsnet. Geavanceerde templates ondersteunen actieve vermogensbegrenzing (curtailment) bij negatieve dynamische stroomprijzen en geforceerde batterijsetpoints voor energie-arbitrage.

### 1.1 Afore Hybride Omvormer

- **Template-ID**: `afore_inverter`
- **Fabrikant / Merk**: Afore
- **Ondersteunde Hardwaremodellen**: Afore AF-T (3-Fasen) & AF-S (1-Fase) Series Hybride Omvormers (1kW – 30kW)
- **Communicatie-interface**: Modbus TCP via Ethernet- / Wi-Fi-dongle (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime PV-zonneproductie (W), Batterij laad-/ontlaadvermogen (W), Netafname-/injectievermogen (W), Cumulatieve zonneproductie (kWh), Batterij-laadtoestand (SOC %), 3-fasen omvormer-uitgangsstromen (L1, L2, L3 in Ampère).

#### Stuurbare Setpoints & Geschreven Data door GEMS
EMS-energiemodus & geforceerde laad-/ontlaadvermogenssetpoints (Holding `3000`/`3002`), plus Actieve vermogensbegrenzing (`0–100%`).

#### Wat GEMS Concreet met dit Toestel Doet
Closed-loop hybride aansturing voor Afore AF-S en AF-T omvormers: laadt en ontlaadt de batterij dynamisch voor Vlaamse capaciteitspiekbewaking en EPEX-spotarbitrage, en regelt PV-teruglevering actief terug bij negatieve uurprijzen.

---

### 1.2 Alpha ESS Storion SMILE

- **Template-ID**: `alpha_ess_inverter`
- **Fabrikant / Merk**: Alpha ESS
- **Ondersteunde Hardwaremodellen**: Alpha ESS Storion SMILE5, SMILE-T10, SMILE-G3 Hybride Omvormer- & Opslagsystemen
- **Communicatie-interface**: Modbus TCP via lokale netwerkdongle (Standaardpoort: 502 of 8502, Slave-ID: 85)

#### Uitgelezen Telemetrie door GEMS
Actief PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Netto netafname/-injectie (W), Cumulatieve energie (kWh), Batterij-SOC (%), 3-fasenstromen (L1, L2, L3 in Ampère).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dispatch-modussturing (`0x084F`), actief vermogensoffset-setpoint (`0x0850`–`0x0851` met 32000 W-offset), Dispatch SOC-doelwaarde en netinjectievermogenslimiet.

#### Wat GEMS Concreet met dit Toestel Doet
Volledige closed-loop aansturing voor Alpha ESS Storion SMILE: stuurt exacte laad- en ontlaadvermogens (W) voor EPEX Day-Ahead arbitrage en bescherming van het Vlaamse capaciteitsplafond, inclusief actieve zonneterugregeling.

---

### 1.3 Anker SOLIX X1 Hybride Omvormer

- **Template-ID**: `anker_inverter`
- **Fabrikant / Merk**: Anker
- **Ondersteunde Hardwaremodellen**: Anker SOLIX X1 Hybride Energieopslagsysteem (Monofasig & Driefasig)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
PV-zonnevermogen (W), Batterijstroom (W), Uitwisselingsvermogen met het net (W), Totale levensduurenergie (kWh), Batterij-SOC (%), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Anker SOLIX X1 EMS-bedrijfsmodus en geforceerde laad-/ontlaadvermogenssetpoints (W), plus actieve injectiebegrenzing (curtailment).

#### Wat GEMS Concreet met dit Toestel Doet
Closed-loop residentiële driefasige hybride sturing voor Anker SOLIX X1: voert geautomatiseerde batterij-piekbewaking, daluurladen op spotprijzen en terugregeling bij negatieve stroomprijzen uit.

---

### 1.4 Deye / Sunsynk Hybride Omvormer

- **Template-ID**: `deye_inverter`
- **Fabrikant / Merk**: Deye
- **Ondersteunde Hardwaremodellen**: Deye SUN-(3-12)K-SG04LP3 / SUN-(5-16)K-SG01LP1, Sunsynk Hybride Omvormers
- **Communicatie-interface**: Modbus TCP via Ethernet LAN of Solarman/Deye Wi-Fi logger (Standaardpoort: 502 of 8899, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
PV-zonneproductie (W), Batterij laad-/ontlaadvermogen (W), Netmetervermogen (W), Totale energie (kWh), Batterij-SOC (%), 3-fasen omvormerstromen (L1, L2, L3 in Ampère).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Time-of-Use netlaad- & ontlaadvermogenssetpoints, minimale/doel-SOC-vensters en dynamische max. PV-injectielimiet (Holding `143` / `340`, automatische LV- & HV-schaling).

#### Wat GEMS Concreet met dit Toestel Doet
Volledige closed-loop sturing voor Deye en Sunsynk LV/HV hybride omvormers: voert sub-seconde Vlaamse capaciteitspiekbewaking, Day-Ahead EPEX-batterijarbitrage en zero-export / negatieve-prijsterugregeling uit.

---

### 1.5 Enerlution Hybride Omvormer

- **Template-ID**: `enerlution_inverter`
- **Fabrikant / Merk**: Enerlution
- **Ondersteunde Hardwaremodellen**: Enerlution Hybride Batterijomvormers (L3-L12 Series)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
PV-zonnevermogen (W), Batterijvermogen (W), Netvermogen (W), Cumulatieve energie (kWh), Batterij-SOC (%), 3-fasenstromen (L1, L2, L3 in Ampère).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Actieve vermogensbegrenzing (curtailment) (W of % via Modbus registers 40400/40441).

#### Wat GEMS Concreet met dit Toestel Doet
Volledige actieve terugregelintegratie: verlaagt automatisch het omvormervermogen tijdens uren met negatieve EPEX Day-Ahead spotprijzen (Nederland-modus / Zero-Export) met behoud van Vlaamse GSC-subsidiedrempels; stuurt zonne-overschot naar thuisbatterij en laadpaal.

---

### 1.6 Enphase IQ Gateway / Envoy

- **Template-ID**: `enphase_envoy`
- **Fabrikant / Merk**: Enphase
- **Ondersteunde Hardwaremodellen**: Enphase IQ Gateway, Envoy-S Standard / Metered, IQ System Controller (IQ Battery 3T/10T)
- **Communicatie-interface**: Lokale HTTP REST-API met token-/digest-authenticatie (Standaardpoort: 80 / 443, Endpoints: /api/v1/production, /ivp/livedata/status)

#### Uitgelezen Telemetrie door GEMS
Geaggregeerde PV-opwekking van micro-omvormers (W), IQ Battery laad-/ontlaadvermogen (W), Netto netafname/-injectie (W), Totale levensduuropbrengst (kWh), Batterij-SOC (%), Stromen en spanningen per fase.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Lokale Enphase IQ Gateway HTTPS Bearer-JWT dynamische injectiebegrenzing en IQ Battery-opslagmodussturing.

#### Wat GEMS Concreet met dit Toestel Doet
Local-first integratie met Enphase IQ Gateway Metered en IQ Batteries: leest productie-, verbruiks- en opslagmetingen lokaal uit en coördineert injectiebegrenzing bij negatieve stroomprijzen zonder cloudafhankelijkheid.

---

### 1.7 FoxESS H1 / H3 / H3-Pro Hybride Omvormer

- **Template-ID**: `foxess_inverter`
- **Fabrikant / Merk**: FoxESS
- **Ondersteunde Hardwaremodellen**: FoxESS H1, AC1, H3, H3-Pro, AIO Series Hybride Opslagomvormers
- **Communicatie-interface**: Modbus TCP via LAN of RS485 Ethernet converter (Standaardpoort: 502, Slave-ID: 1 of 247)

#### Uitgelezen Telemetrie door GEMS
PV-zonneproductie (W), Batterijvermogen (W), Actief netvermogen (W), Totale energie (kWh), Batterij-SOC (%), 3-fasenstromen (L1, L2, L3 in Ampère).

#### Stuurbare Setpoints & Geschreven Data door GEMS
FoxESS-werkmodus (`41000` / `44000`), externe EMS-vermogenssetpoints (W), minimale SOC-ondergrens en actieve injectielimiet.

#### Wat GEMS Concreet met dit Toestel Doet
Volledige closed-loop aansturing voor de FoxESS H1-, H3- en H3-Pro hybride reeksen: stuurt geforceerd laden en ontladen voor spotarbitrage en capaciteitspiekbewaking, gecombineerd met actieve PV-terugregeling.

---

### 1.8 Fronius Gen24 Omvormer

- **Template-ID**: `fronius_inverter`
- **Fabrikant / Merk**: Fronius
- **Ondersteunde Hardwaremodellen**: Fronius Primo Gen24, Symo Gen24 Plus, Symo Hybrid, Tauro (SunSpec Modbus)
- **Communicatie-interface**: Modbus TCP via SunSpec-protocol (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
PV-zonneproductie (W), Batterij laad-/ontlaadvermogen (W), Netvermogensstroom (W), Cumulatieve energie (kWh), BYD / Fronius Batterij-SOC (%).

#### Stuurbare Setpoints & Geschreven Data door GEMS
SunSpec Model 123 actieve vermogenslimiet (`WMaxLimPct` enkelregister FC06) en SunSpec Model 124 opslag laad-/ontlaadsturing (`StorCtl_Mod`, `OutWRte`, `InWRte`).

#### Wat GEMS Concreet met dit Toestel Doet
Volledige closed-loop aansturing voor Fronius Symo / Primo / Gen24 Plus: regelt laad- en ontlaadvermogens van BYD Battery-Box HVS/HVM voor spotarbitrage en piekbewaking, en begrenst PV-opwekking tijdens negatieve marktprijzen.

---

### 1.9 GoodWe Omvormer

- **Template-ID**: `goodwe_inverter`
- **Fabrikant / Merk**: GoodWe
- **Ondersteunde Hardwaremodellen**: GoodWe ET, EH, ES, EM, Lynx Home F Series Hybride Omvormers (ARM/DSP)
- **Communicatie-interface**: Modbus TCP / UDP via LAN of Wi-Fi+LAN kit (Standaardpoort: 502 of 8899, Slave-ID: 247)

#### Uitgelezen Telemetrie door GEMS
PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Netto netstroom (W), Totale energie (kWh), Batterij-SOC (%).

#### Stuurbare Setpoints & Geschreven Data door GEMS
GoodWe ET/EH/BT/BH EMS-vermogensmodus (`47511` modi `1`/`2`/`8`/`9`), EMS-vermogenssetpoint (`47512` W) en activatie & waarde netinjectielimiet (`47509`–`47510`).

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde closed-loop hybride sturing voor GoodWe ET/EH/BT/BH-omvormers: voert geautomatiseerde batterij-piekbewaking, Day-Ahead spotarbitrage en dynamische PV-injectiebegrenzing uit.

---

### 1.10 Growatt Omvormer

- **Template-ID**: `growatt_inverter`
- **Fabrikant / Merk**: Growatt
- **Ondersteunde Hardwaremodellen**: Growatt SPH, MIN, MOD, MID Series Hybride en Netgekoppelde Omvormers (ShineLAN-X)
- **Communicatie-interface**: Modbus TCP via ShineLAN-X Ethernet dongle (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief PV-zonnevermogen (W), Batterijvermogen (W), Netinjectie/-afname (W), Cumulatieve kWh, Batterij-SOC (%).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Growatt SPH / MOD TL3-XH prioriteitsmodus (`1044` / `3049`), laad-/ontlaadsnelheid & stop-SOC (`1070`–`1092`) en actief vermogenspercentage / injectielimiet (`3`, `122`–`123`).

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde closed-loop aansturing voor Growatt SPH en MOD hybride- en stringomvormers: beheert geforceerd batterijladen, piekontlading en PV-terugregeling bij negatieve spotprijzen.

---

### 1.11 Huawei Hybride Omvormer

- **Template-ID**: `huawei_inverter`
- **Fabrikant / Merk**: Huawei
- **Ondersteunde Hardwaremodellen**: Huawei SUN2000 Series (2KTL-6KTL-L1, 3KTL-10KTL-M1, 12KTL-25KTL-M2/M5, 30KTL-100KTL-M3, MAP0, MB0) met LUNA2000 Battery (5kWh-30kWh)
- **Communicatie-interface**: Modbus TCP via SDongleA-05 (Ethernet/WLAN) of SmartLogger3000 (Standaardpoort: 502, Slave-ID: 1 of 2)

#### Uitgelezen Telemetrie door GEMS
Actieve PV-zonneproductie (W, reg 32080), LUNA2000-batterij laad-/ontlaadvermogen (W, reg 37001), Netafname-/injectievermogen via DTSU666-H (W, reg 37113), Cumulatieve opwekking (kWh, reg 32106), Batterij-SOC (%, reg 37004).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Geforceerd batterij laad-/ontlaadsetpoint (W, reg 40118/40120), Actieve vermogensbegrenzing (curtailment) (W of % van nominaal vermogen, reg 40118/40125).

#### Wat GEMS Concreet met dit Toestel Doet
Volledige bidirectionele batterij- en terugregelsturing: laat de LUNA2000 ontladen bij huishoudelijke verbruikspieken (Vlaamse capaciteitspiekbewaking), laadt geforceerd vanuit het net tijdens goedkope/negatieve EPEX-uren en regelt actief PV-vermogen terug bij negatieve injectieprijzen of zero-export.

---

### 1.12 LG ESS Home (8 / 10 / 15)

- **Template-ID**: `lg_ess`
- **Fabrikant / Merk**: LG
- **Ondersteunde Hardwaremodellen**: LG ESS Home 8, Home 10, Home 15 Hybride Energieopslagsystemen
- **Communicatie-interface**: Lokale HTTP REST-API (Standaardpoort: 80 / 443, JSON endpoints: /v1/user/setting/network)

#### Uitgelezen Telemetrie door GEMS
PV-zonneproductie (W), Batterijvermogensstroom (W), Netafname/-injectie (W), Cumulatieve energie (kWh), Batterij-SOC (%).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Lokale LG ESS Home `/v1/user/setting/batt` geforceerd-laden / zelfverbruiksturing en PCS-vermogensbegrenzing.

#### Wat GEMS Concreet met dit Toestel Doet
Lokale cloudvrije HTTPS-integratie voor LG ESS Home 8 / 10 / 15-systemen met geautomatiseerd daluurladen van de batterij en netstroombalancering.

---

### 1.13 Marstek Venus / Jupiter Storage

- **Template-ID**: `marstek_storage`
- **Fabrikant / Merk**: Marstek
- **Ondersteunde Hardwaremodellen**: Marstek Venus Series, Jupiter Hybrid All-in-One Batterij-energieopslag
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Uitwisselingsvermogen met het net (W), Totale energie (kWh), Batterij-SOC (%).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Marstek Venus C / E / Jupiter passieve modus inschakelen (`42000 = 0x55AA`), richtingssturing (`42010`) en exacte laad-/ontlaadsetpoints in Watt (`42020`–`42021`).

#### Wat GEMS Concreet met dit Toestel Doet
Volledige closed-loop AC-gekoppelde batterijsturing voor Marstek Venus C/E en Jupiter: slaat overtollige zonne-energie op, vlakt huishoudelijke capaciteitspieken af en voert Day-Ahead spotarbitrage uit.

---

### 1.14 SAJ eSolar (H1 / H2 / R5 / R6 Hybride Omvormer)

- **Template-ID**: `saj_hybrid`
- **Fabrikant / Merk**: SAJ
- **Ondersteunde Hardwaremodellen**: SAJ eSolar H1, H2, R5, R6 Series Hybride & Opslagomvormers (B1/B2 Batterijen)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
PV-zonneproductie (W), Batterijvermogen (W), Actief netvermogen (W), Totale energie (kWh), Batterij-SOC (%), 3-fasenstromen (L1, L2, L3 in Ampère).

#### Stuurbare Setpoints & Geschreven Data door GEMS
SAJ H1 / H2 / R5 / R6 AppMode / passieve laad- & ontlaadsetpoints (W) en actieve vermogensbegrenzing (`0.1%`).

#### Wat GEMS Concreet met dit Toestel Doet
Closed-loop hybride beheer voor SAJ H1/H2-systemen: coördineert driefasige PV-terugregeling, geforceerd batterijladen in daluren en het afvlakken van verbruikspieken.

---

### 1.15 SMA Sunny Boy / Tripower / Opslagomvormer

- **Template-ID**: `sma_inverter`
- **Fabrikant / Merk**: SMA
- **Ondersteunde Hardwaremodellen**: SMA Sunny Boy (1.5-6.0), Sunny Tripower (3.0-10.0, X, Smart Energy), Sunny Island, Sunny Boy Storage
- **Communicatie-interface**: Modbus TCP via Speedwire / SunSpec (Standaardpoort: 502, Slave-ID: 126 of 3)

#### Uitgelezen Telemetrie door GEMS
PV-zonneproductie (W, reg 30775), Batterij laad-/ontlaadvermogen (W, reg 31393), Actief netvermogen (W, reg 30865), Totale energie (kWh, reg 30513), Batterij-SOC (%, reg 30845), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
SMA actieve vermogenslimiet (`WModCfg` / `WMaxLimPct`) en bidirectionele batterijsturing voor zowel Sunny Island / Sunny Boy Storage (`40151=802`, `40149`) als Sunny Tripower Smart Energy (`40236`, `40793`–`40801`).

#### Wat GEMS Concreet met dit Toestel Doet
Volledige closed-loop zonneterugregeling en batterijarbitrage voor SMA Sunny Boy, Sunny Tripower, Sunny Tripower Smart Energy (STP-SE) en Sunny Boy Storage.

---

### 1.16 Senergy (SE Series / Hybride Omvormer)

- **Template-ID**: `senergy_inverter`
- **Fabrikant / Merk**: Senergy
- **Ondersteunde Hardwaremodellen**: Senergy SE Series Hybride & Opslagomvormers (3kW – 15kW)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Netuitwisseling (W), Cumulatieve energie (kWh), Batterij-SOC (%).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Senergy SE Hybrid passieve modus laad-/ontlaadsetpoints (W) en actieve uitgangsvermogenslimiet (%).

#### Wat GEMS Concreet met dit Toestel Doet
Closed-loop aansturing voor Senergy hybride omvormers: automatiseert batterij-piekbewaking, daluurladen en PV-terugregeling bij negatieve prijzen.

---

### 1.17 Sigenergy SigenStor (Hybride Omvormer & Opslag)

- **Template-ID**: `sigenergy_hybrid`
- **Fabrikant / Merk**: Sigenergy
- **Ondersteunde Hardwaremodellen**: Sigenergy SigenStor 5-in-1 Energieopslagsysteem (Omvormer, Batterij, EVDC/EVAC)
- **Communicatie-interface**: Modbus TCP via Sigen Gateway / Omvormer (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
PV-zonnevermogen (W), Sigen-batterijvermogen (W), Uitwisselingsvermogen met het net (W), Totale energie (kWh), Sigen Batterij-SOC (%), 3-fasenstromen (L1, L2, L3 in Ampère).

#### Stuurbare Setpoints & Geschreven Data door GEMS
SigenStor Remote EMS inschakelen (`40029`), bedrijfsmodus (`40031`), max. laad-/ontlaadsetpoints (`40032`–`40034` U32 W) en PV-curtailmentlimiet (`40038`).

#### Wat GEMS Concreet met dit Toestel Doet
Uiterst nauwkeurige closed-loop EMS-sturing voor Sigenergy SigenStor 5-in-1 energiesystemen: voert sub-seconde capaciteitspiekbewaking, EPEX-spotarbitrage en PV-injectiebegrenzing uit.

---

### 1.18 SofarSolar (HYD / G3 / AMASS Hybride Omvormer)

- **Template-ID**: `sofarsolar_hybrid`
- **Fabrikant / Merk**: SofarSolar
- **Ondersteunde Hardwaremodellen**: SofarSolar HYD 3000-6000-ES, HYD 5K-20KTL-3PH, G3 Series, AMASS StoreEdge Batterijen
- **Communicatie-interface**: Modbus TCP via Ethernet-/Wi-Fi-stick (Standaardpoort: 8899 of 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Netvermogensstroom (W), Totale energie (kWh), Batterij-SOC (%), 3-fasenstromen (L1, L2, L3 in Ampère).

#### Stuurbare Setpoints & Geschreven Data door GEMS
SofarSolar HYD 5K–20KTL-3PH passieve opslagsetpoints (`0x1187` modus, `0x1189`–`0x118D` signed S32 W) en actief vermogen / anti-reflux injectielimiet.

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde closed-loop aansturing voor SofarSolar HYD 3PH G3 en ME3000SP hybride systemen: regelt nauwkeurig het laad-/ontlaadvermogen van de batterij en zonneterugregeling.

---

### 1.19 SolaX Omvormer

- **Template-ID**: `solax_inverter`
- **Fabrikant / Merk**: SolaX
- **Ondersteunde Hardwaremodellen**: SolaX Power X1-Hybrid, X3-Hybrid Gen 2/3/4, X1/X3-Fit, Triple Power Batterijen
- **Communicatie-interface**: Modbus TCP via Pocket LAN of Pocket Wi-Fi (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief PV-zonnevermogen (W), Batterijvermogen (W), Actief netvermogen (W), Totale energie (kWh), Batterij-SOC (%).

#### Stuurbare Setpoints & Geschreven Data door GEMS
SolaX X1/X3-Hybrid G4 Remote Control vermogensmodus (`0x007C`–`0x0080`, exact actief doelvermogen W + watchdog) met `0x001F` handmatige modus-terugval, plus gebruikerslimiet injectieregeling (`0x0042`).

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde sub-seconde closed-loop sturing voor SolaX X1/X3-Hybrid en Fit-systemen: voert dynamisch zonnezelfverbruik, spotprijsarbitrage en PV-terugregeling uit.

---

### 1.20 SolarEdge 3-Fasen Omvormer

- **Template-ID**: `solaredge_3phase`
- **Fabrikant / Merk**: SolarEdge
- **Ondersteunde Hardwaremodellen**: SolarEdge 3-Fasen Omvormers (SE3K – SE33.3K, StorEdge 3-Fasen met SetApp)
- **Communicatie-interface**: Modbus TCP via SunSpec-protocol (Standaardpoort: 1502 of 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
PV-zonneproductie (W), Batterij laad-/ontlaadvermogen (W), Netmetervermogen (W), Totale energie (kWh), SOC gekoppelde Energy Bank (%).

#### Stuurbare Setpoints & Geschreven Data door GEMS
SolarEdge StorEdge besturingsmodus `4` (Remote), laad-/ontlaadlimiet (`0xE00E`/`0xE010` float32 W), moduscommando (`0xE00D`) en Advanced Power Control (`0xF001` / SunSpec M123).

#### Wat GEMS Concreet met dit Toestel Doet
Volledige closed-loop driefasige SolarEdge Home Hub & StorEdge-aansturing: moduleert het laad-/ontlaadvermogen van de thuisbatterij en regelt PV-productie terug tijdens negatieve spotprijzen.

---

### 1.21 SolarEdge Omvormer

- **Template-ID**: `solaredge_inverter`
- **Fabrikant / Merk**: SolarEdge
- **Ondersteunde Hardwaremodellen**: SolarEdge 1-Fase HD-Wave Omvormers (SE2200H – SE6000H, StorEdge 1-Fase)
- **Communicatie-interface**: Modbus TCP via SunSpec-protocol (Standaardpoort: 1502 of 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
PV-zonneproductie (W), Batterij laad-/ontlaadvermogen (W), Actief netvermogen (W), Totale energie (kWh), Batterij-SOC (%).

#### Stuurbare Setpoints & Geschreven Data door GEMS
SolarEdge StorEdge besturingsmodus `4` (Remote), laad-/ontlaadlimiet (`0xE00E`/`0xE010` float32 W), moduscommando (`0xE00D`) en Advanced Power Control (`0xF001` / SunSpec M123).

#### Wat GEMS Concreet met dit Toestel Doet
Volledige closed-loop monofasige SolarEdge HD-Wave & Home Hub-aansturing: stuurt laad- en ontlaadsetpoints van StorEdge / Home Battery en begrenst de zonneproductie indien vereist.

---

### 1.22 Solis Hybride & Retrofit Omvormers (Primaire Referentie)

- **Template-ID**: `solis_hybrid`
- **Fabrikant / Merk**: Solis
- **Ondersteunde Hardwaremodellen**: Solis S5-EH1P, S6-EH1P Series (Monofasig Hybride), S6-EH3P Series (Driefasig Hybride 5kW-20kW), Solis RAI-3K-48V-5G, S6-EA1P3.6K-L, S6-EA1P5K-L Series (AC-gekoppelde Opslag Retrofit)
- **Communicatie-interface**: Modbus TCP via directe interne Ethernet-poort / Ginlong Wi-Fi/LAN stick (Standaardpoort: 502 of 8899, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief PV-opwekkingsvermogen (W, reg 33079), Batterij laad-/ontlaadvermogen (W, reg 33149), Batterij-SOC (%, reg 33139), Actief netmetervermogen (W, reg 33130), Totale cumulatieve energieopbrengst (kWh, reg 33029), 3-fasen AC-stromen (0.1A, regs 33073-33075), 3-fasenspanningen (0.1V, regs 33076-33078).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Actieve vermogensbegrenzingsmodus en -limiet (W / % via holding-registers 43052/43070 op Hybride en 3051/3052 op String), geforceerd batterij laad- & ontlaadsetpoint (W via registers 43110/43129/43135/43136).

#### Wat GEMS Concreet met dit Toestel Doet
Aangewezen primair referentieplatform voor hybride zonne-omvormers en batterijopslag. Voert sub-seconde closed-loop vermogensbegrenzing uit tijdens uren met negatieve spotprijzen (Nederland-modus / Zero-Export), slaat automatisch zonne-overschotten op in de batterij, regelt laadvermogen dynamisch bij voor Vlaamse capaciteitspiekbewaking en orkestreert spotmarktarbitrage (geforceerd laden bij lage EPEX Day-Ahead prijzen en ontladen tijdens avondpieken). Solis Retrofit-modellen werken naadloos als AC-gekoppelde batterij-omvormers zonder afhankelijkheid van PV-strings.

---

### 1.23 Sungrow Omvormer

- **Template-ID**: `sungrow_inverter`
- **Fabrikant / Merk**: Sungrow
- **Ondersteunde Hardwaremodellen**: Sungrow SH5.0RT, SH6.0RT, SH8.0RT, SH10RT, SH15T, SH20T Hybride Omvormers (SBR096-SBR256)
- **Communicatie-interface**: Modbus TCP via directe interne LAN RJ45-poort (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
PV-zonneproductie (W, reg 5016), Batterij laad-/ontlaadvermogen (W, reg 13021), Uitwisselingsvermogen met het net (W, reg 13009), Cumulatieve opwekking (kWh, reg 5003), SBR Batterij-SOC (%, reg 13022).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Sungrow SH-RS / SH-RT / SH-T EMS-modusselectie (`13049`), laad-/ontlaadcommando (`13050` `0xAA`/`0xBB`/`0xCC`), vermogenssetpoint (`13051` W) en actieve vermogensbegrenzing (`5006`–`5007`).

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde supersnelle closed-loop aansturing voor Sungrow SH hybride en SG stringomvormers: voert sub-seconde piekbewaking, EPEX-batterijarbitrage en PV-terugregeling uit.

---

### 1.24 Victron Omvormer/GX

- **Template-ID**: `victron_inverter`
- **Fabrikant / Merk**: Victron
- **Ondersteunde Hardwaremodellen**: Victron Energy MultiPlus-II, Quattro, Cerbo GX, Ekrano GX, Color Control GX (Venus OS)
- **Communicatie-interface**: Modbus TCP via Venus OS (Standaardpoort: 502, Unit-ID: 100 voor System Calc / 228 voor Omvormer)

#### Uitgelezen Telemetrie door GEMS
DC/AC PV-zonnevermogen (W, reg 811), Batterij laad-/ontlaadvermogen (W, reg 842), Netto AC-netafname/-injectie (W, reg 820), Totale energie (kWh), Batterij-SOC (%, reg 843).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Victron Venus OS / Cerbo GX ESS-netvermogenssetpoint (`2700` S16 / `2703` S32 W), ESS-ontlading uitschakelen en max. PV-terugleveringslimiet (`2706` in stappen van 100 W).

#### Wat GEMS Concreet met dit Toestel Doet
Diepgaande closed-loop integratie met Victron MultiPlus-II / Quattro GX ESS-installaties: stuurt het AC-netsetpoint aan voor batterijarbitrage en piekbewaking en begrenst overtollige teruglevering.

---

### 1.25 ABB / Fimer Zonne- & Hybride Omvormer

- **Template-ID**: `abb_fimer_inverter`
- **Fabrikant / Merk**: ABB / Fimer
- **Ondersteunde Hardwaremodellen**: ABB UNO-DM-PLUS, REACT 2, TRIO, PVI, en Fimer string-/hybride omvormers
- **Communicatie-interface**: Modbus SunSpec over TCP/RTU (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief PV-zonnevermogen (W, SunSpec-standaardregister 40083), Batterij-laadtoestand (SOC %), Batterij laad-/ontlaadvermogen (W), Netinjectievermogen (W), Cumulatieve opwekkingsenergie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
SunSpec Model 123 Actieve vermogensbegrenzing (curtailment) (`WMaxLimPct`, `WMaxLim_Ena`) en SunSpec Model 124 opslag laad-/ontlaadsnelheidsregeling (`StorCtl_Mod`, `OutWRte`, `InWRte`).

#### Wat GEMS Concreet met dit Toestel Doet
Volledige closed-loop SunSpec-aansturing voor ABB / Fimer PV- en REACT 2 hybride installaties: voert zonneterugregeling bij negatieve spotprijzen, zero-exportbegrenzing, geautomatiseerde batterij-piekbewaking en Day-Ahead arbitrage uit.

---

### 1.26 Autarco Zonne-omvormer

- **Template-ID**: `autarco_inverter`
- **Fabrikant / Merk**: Autarco
- **Ondersteunde Hardwaremodellen**: Autarco SX, MX, en LX series monofasige en driefasige zonne-omvormers
- **Communicatie-interface**: Modbus TCP via lokale netwerkdongle/gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief PV-zonnevermogen (W), Totale dag- & levensduuropbrengst (kWh), AC-netspanning (V), AC-frequentie (Hz).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Externe sturing batterij laad-/ontlaadvermogenssetpoints (`43129` / `43135`–`43136`) en Actieve vermogensbegrenzing (curtailment) (`43052` / `0–100%`).

#### Wat GEMS Concreet met dit Toestel Doet
Volledige closed-loop hybride omvormer- en PV-terugregelsturing voor Autarco S2.x / MH / LX-systemen: coördineert zonnezelfverbruik, batterijarbitrage op spotprijzen en Vlaamse capaciteitspiekbewaking.

---

### 1.27 Chisage ESS Hybride Omvormer

- **Template-ID**: `chisage_ess`
- **Fabrikant / Merk**: Chisage ESS
- **Ondersteunde Hardwaremodellen**: Chisage ESS Commerciële, Industriële & Residentiële Hybride Omvormers (3kW – 50kW)
- **Communicatie-interface**: Modbus TCP / RTU via RS485-Ethernet-gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Netafname-/injectievermogen (W), Cumulatieve omvormerenergie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Enkel uitlezing (Alleen-lezen telemetrie — gesloten registerkaart).

#### Wat GEMS Concreet met dit Toestel Doet
Integreert commerciële, industriële en residentiële Chisage ESS hybride zonne- en batterijtelemetrie in de lokale GEMS-vermogensbalancering.

---

### 1.28 Delta Electronics Zonne-omvormer

- **Template-ID**: `delta_inverter`
- **Fabrikant / Merk**: Delta Electronics
- **Ondersteunde Hardwaremodellen**: Delta M6A, M8A, M10A, M15A, M50A, en RPI commerciële/residentiële reeks
- **Communicatie-interface**: Modbus SunSpec over TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
PV-opwekkingsvermogen (W), DC-stringspanningen en -stromen, Cumulatieve opwekking (kWh), AC-netvermogen (W).

#### Stuurbare Setpoints & Geschreven Data door GEMS
SunSpec Model 123 Actieve vermogensbegrenzing (curtailment) (`WMaxLimPct`, `WMaxLim_Ena`) en SunSpec Model 124 basis-opslagsturing.

#### Wat GEMS Concreet met dit Toestel Doet
Gestandaardiseerde SunSpec closed-loop telemetrie en actieve vermogensbegrenzing voor residentiële en commerciële Delta zonne- en hybride omvormers.

---

### 1.29 HYXiPOWER Hybride Omvormer

- **Template-ID**: `hyxipower_inverter`
- **Fabrikant / Merk**: HYXiPOWER
- **Ondersteunde Hardwaremodellen**: HYXiPOWER 1-Fase & 3-Fasen Residentiële & Commerciële Hybride Omvormers
- **Communicatie-interface**: Modbus TCP via Wi-Fi-/Ethernet-dongle (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
PV-zonneproductie (W), Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Netuitwisseling (W), Cumulatieve energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Alleen-lezen telemetrie-uitlezing.

#### Wat GEMS Concreet met dit Toestel Doet
Stroomt realtime PV-productie en batterijopslagmetingen door naar het GEMS PowerFlow-diagram en de telemetrieverwerking.

---

### 1.30 KSTAR BluE Hybride Omvormer

- **Template-ID**: `kstar_inverter`
- **Fabrikant / Merk**: KSTAR
- **Ondersteunde Hardwaremodellen**: KSTAR BluE-S, BluE-H3, en BluE-G residentiële en C&I hybride systemen
- **Communicatie-interface**: Modbus RTU / TCP via RS485-Ethernet-omvormer (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Netvermogensstroom (W), Fasestromen (L1, L2, L3 in Ampère).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Alleen-lezen telemetrie-uitlezing.

#### Wat GEMS Concreet met dit Toestel Doet
Voedt hybride zonne- en batterijmeetwaarden aan de GEMS load balancer en de dynamische tariefoptimalisatie-engine.

---

### 1.31 Solinteg Integ M Hybride Omvormer

- **Template-ID**: `solinteg_inverter`
- **Fabrikant / Merk**: Solinteg
- **Ondersteunde Hardwaremodellen**: Solinteg Integ M OHT/OMT Series (3kW – 50kW) 3-Fasen Hybride Omvormers
- **Communicatie-interface**: Modbus RTU / TCP via LAN-/Wi-Fi-stick (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief PV-zonnevermogen (W), Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Netto uitwisselingsvermogen met het net (W), Cumulatieve opwekking (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Solinteg Integ M-serie externe EMS-modus, laad-/ontlaadvermogenssetpoints en actieve vermogenslimiet.

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde closed-loop driefasige hoogspannings-hybride aansturing voor commerciële en residentiële Solinteg Integ M (4–50 kW) omvormers.

---

### 1.32 Solplanet / AISWEI Omvormer

- **Template-ID**: `solplanet_inverter`
- **Fabrikant / Merk**: Solplanet (AISWEI)
- **Ondersteunde Hardwaremodellen**: Solplanet ASW H-S2, ASW H-T2, ASW-LT-G2/G3 1-Fase en 3-Fasen Omvormers
- **Communicatie-interface**: Modbus RTU / TCP via Ethernet/Wi-Fi Ai-Dongle (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief PV-zonnevermogen (W), Totale energieopbrengst (kWh), AC-spanning en -stroom per fase, netafname/-injectie (W).

#### Stuurbare Setpoints & Geschreven Data door GEMS
AISWEI / Solplanet batterijwerkmodus (`1103` bus / `41104` doc), richtingsgevoelig laad-/ontlaadsetpoint (`1152` S16 W) en actieve vermogenssturing (`4000` / `5402` `0,01%`).

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde closed-loop aansturing voor Solplanet ASW H-T2/T3 en KACO blueplanet hybrid NH3-omvormers: verstuurt exacte batterijsetpoints in Watt en dynamische PV-terugregeling.

---

### 1.33 APsystems EZ1-M / EZ1-D Lokale Micro-omvormer

- **Template-ID**: `apsystems_ez1`
- **Fabrikant / Merk**: APsystems
- **Ondersteunde Hardwaremodellen**: APsystems EZ1-M, EZ1-D Wi-Fi Balkon- & Dak-micro-omvormers (Lokale Modus)
- **Communicatie-interface**: Lokale HTTP JSON-API (Standaardpoort: 8050, Endpoints: `/getOutputData`, `/setMaxPower`)

#### Uitgelezen Telemetrie door GEMS
Kanaal 1 & Kanaal 2 actief PV-vermogen (W), Totale cumulatieve opwekkingsenergie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Direct lokaal setpoint voor max. AC-uitgangsvermogen (`/setMaxPower?p=30..800` W).

#### Wat GEMS Concreet met dit Toestel Doet
100% cloudvrije lokale micro-omvormertelemetrie en traploze actieve vermogensbegrenzing tijdens negatieve EPEX-spotprijzen of zero-exportwerking.

---

### 1.34 FENECON Home / OpenEMS Edge (FEMS)

- **Template-ID**: `fenecon_fems`
- **Fabrikant / Merk**: FENECON
- **Ondersteunde Hardwaremodellen**: FENECON Home 6, Home 10, Home 15, Home 20, Home 30 & OpenEMS Edge Controllers
- **Communicatie-interface**: Lokale HTTP REST-API (Standaardpoort: 8084, `/rest/channel/_sum/*` & `/rest/channel/ess0/*`)

#### Uitgelezen Telemetrie door GEMS
PV-productievermogen (W), Cumulatieve PV-energie (kWh), Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Actief netvermogen (W).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Exact ESS actief laad-/ontlaadsetpoint (`ess0/SetActivePowerEquals` W) en PV actieve vermogensbegrenzing (curtailment) (`pvInverter0/SetActivePowerLimit` W).

#### Wat GEMS Concreet met dit Toestel Doet
Volledige lokale closed-loop integratie voor FENECON Home & OpenEMS-systemen: coördineert EPEX Day-Ahead batterijarbitrage, Vlaamse capaciteitspiekbewaking en terugregeling bij negatieve prijzen.

---

### 1.35 Hoymiles DTU-Pro / OpenDTU Micro-omvormer

- **Template-ID**: `hoymiles_dtu`
- **Fabrikant / Merk**: Hoymiles
- **Ondersteunde Hardwaremodellen**: Hoymiles HM / HMS / HMT Series Micro-omvormers via DTU-Pro, DTU-Pro-S, OpenDTU, of AhoyDTU
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Unit-ID: 1) of Lokale OpenDTU HTTP REST (`/api/livedata/status`, `/api/limit/config`)

#### Uitgelezen Telemetrie door GEMS
Geaggregeerd & per-poort actief PV-vermogen (W), Cumulatieve zonne-opbrengst (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Actieve uitgangsvermogenslimiet (`0xC006` % op DTU-Pro Modbus; vluchtig RAM `limit_type=1` % op OpenDTU zonder EEPROM-slijtage).

#### Wat GEMS Concreet met dit Toestel Doet
Cloudvrije monitoring van micro-omvormers en dynamische PV-terugregeling tijdens uren met negatieve spotmarktprijzen.

---

### 1.36 KOSTAL Plenticore Plus / G2 / G3 Hybrid

- **Template-ID**: `kostal_plenticore`
- **Fabrikant / Merk**: KOSTAL
- **Ondersteunde Hardwaremodellen**: KOSTAL Plenticore Plus, Plenticore BI, Plenticore G2, en Plenticore G3 Hybride Omvormers
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 1502, Unit-ID: 71, Automatisch gedetecteerde CDAB/ABCD IEEE-754 Float32)

#### Uitgelezen Telemetrie door GEMS
Totaal DC PV-vermogen (W), Cumulatieve opbrengst (kWh), Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Netsensorvermogen (W), 3-fasenspanningen & -stromen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Extern batterijbeheer richtingsgevoelig vermogenssetpoint (Holding `1034` Float32 W) en SunSpec Model 123 Actieve vermogensbegrenzing (curtailment) (`WMaxLimPct`).

#### Wat GEMS Concreet met dit Toestel Doet
Volledige closed-loop aansturing voor KOSTAL Plenticore hybride installaties: voert batterij-piekbewaking, Day-Ahead spotarbitrage en zonneterugregeling bij negatieve prijzen uit.

---

### 1.37 KACO blueplanet hybrid NH3 / gridsave TL3

- **Template-ID**: `kaco_inverter`
- **Fabrikant / Merk**: KACO
- **Ondersteunde Hardwaremodellen**: KACO blueplanet hybrid 6.0 / 8.0 / 10.0 / 12.0 NH3, blueplanet TL3, en gridsave 50.0 / 92.0 TL3-S Commerciële Opslagomvormers
- **Communicatie-interface**: Modbus TCP / RTU (Standaardpoort: 502, Unit-ID: 1, SunSpec Models 103/123/124 & NH3 Storage Block `40200`–`40203`)

#### Uitgelezen Telemetrie door GEMS
Actief PV-zonnevermogen (W), Cumulatieve energie (kWh), Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Live BMS laad-/ontlaadvermogenslimieten (`40202`–`40203` W), 3-fasenstromen & -spanningen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
SunSpec Model 123 Actieve vermogensbegrenzing (curtailment) (`WMaxLimPct`, `WMaxLim_Ena`) en Model 124 opslagsturing (`WChaMax`, `WChaGra`, `WDisChaGra`, `StorCtl_Mod`, `WChaMaxRvrtTms=300s` Watchdog) plus NH3 EMS-terugvalmodus (`40210`–`40212`).

#### Wat GEMS Concreet met dit Toestel Doet
Volledige closed-loop aansturing voor KACO blueplanet hybrid NH3 en commerciële gridsave TL3-installaties: voert batterij-piekbewaking, EPEX Day-Ahead spotarbitrage en zonneterugregeling bij negatieve prijzen uit.

---

### 1.38 Aangepaste Modbus-omvormer (UI Registerprofiel)

- **Template-ID**: `custom_modbus_inverter`
- **Fabrikant / Merk**: Custom Modbus
- **Ondersteunde Hardwaremodellen**: Elke Modbus TCP- of RS-485 RTU string-, micro- of hybride omvormer geconfigureerd via de gecertificeerde UI Registerprofielbouwer
- **Communicatie-interface**: Modbus TCP / RTU (Configureerbare poort of `/dev/serial/by-id/*` bus, Unit-ID, `FC03`/`FC04` uitlezing & optionele `FC06`/`FC16` setpoints)

#### Uitgelezen Telemetrie door GEMS
Via UI gekoppeld PV-zonnevermogen (W), Batterijvermogen (W), Batterij-SOC (%), Netto netvermogen (W), Cumulatieve energie (kWh), 3-fasenspanningen & -stromen (`int16`, `uint16`, `int32`, `uint32`, `float32` of SunSpec-schaalfactor `ABCD`/`CDAB`/`BADC`/`DCBA`).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Optionele via UI gekoppelde actieve vermogensbegrenzing (`curtailment_limit_w` / `curtailment_limit_pct`), Batterij laad-/ontlaadvermogen (`battery_power_w`), periodieke hardware-watchdog heartbeat en veilige afsluit-terugvalwaarde.

#### Wat GEMS Concreet met dit Toestel Doet
Stelt gecertificeerde installateurs in staat om niet-standaard zonne- en hybride omvormers rechtstreeks vanuit de webinterface te koppelen met live registertests, JSON-profielimport/-export en veilige fail-safe terugval.

---

## 2. Toegewijde Batterij-energieopslagsystemen (BESS) (18 Toestellen)

Toegewijde BESS-opslagsystemen communiceren via Modbus TCP/RTU of lokale HTTP REST-API's om stationaire thuis- en bedrijfsbatterijen onafhankelijk van PV-omvormers aan te sturen of te monitoren. Ze leveren realtime laadtoestand (SOC %), laad-/ontlaadvermogen en live BMS-limieten voor GEMS-arbitrage, maximalisatie van zelfverbruik en piekafvlakking.

### 2.1 Siemens Junelight Slimme Batterij

- **Template-ID**: `siemens_junelight`
- **Fabrikant / Merk**: Siemens
- **Ondersteunde Hardwaremodellen**: Siemens Junelight Slim Batterij-energieopslagsysteem (3.3kWh – 19.8kWh)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Batterij laad-/ontlaadvermogen (W), Batterij-laadtoestand (SOC %), Netto netvermogensstroom (W), Interne batterijstatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Siemens Junelight Slimme Batterij EMS-bedrijfsmodus en geforceerde laad-/ontlaadvermogenssetpoints (W).

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde integratie met residentiële Siemens Junelight-batterijopslag voor zonnezelfverbruik, piekbewaking en opladen tijdens daluren.

---

### 2.2 Solarwatt (EnergyManager / MyReserve Matrix)

- **Template-ID**: `solarwatt_storage`
- **Fabrikant / Merk**: Solarwatt
- **Ondersteunde Hardwaremodellen**: Solarwatt EnergyManager Pro, MyReserve Matrix Batterijopslagsysteem
- **Communicatie-interface**: Lokale HTTP REST-API (Standaardpoort: 80, JSON endpoint: /rest/kiwigrid/private/items)

#### Uitgelezen Telemetrie door GEMS
Batterijvermogensstroom (W), Batterij-SOC (%), Zonneproductie (W), Netuitwisseling (W), Cumulatieve energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Solarwatt EnergyManager / Reserve lokale `/rest/items` batterij laad-/ontlaadsturing en telemetrie-uitlezing.

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde cloudvrije lokale LAN-integratie voor Solarwatt EnergyManager Pro en MyReserve / Battery flex-opslagsystemen.

---

### 2.3 sonnenBatterie (eco 6 / 8 / 10 / hybrid)

- **Template-ID**: `sonnen_batterie`
- **Fabrikant / Merk**: Sonnen
- **Ondersteunde Hardwaremodellen**: sonnenBatterie eco 6, eco 8, eco 8.2, eco 10, sonnenBatterie hybrid 9.53
- **Communicatie-interface**: Lokale HTTP REST-API v1/v2 (Standaardpoort: 80, JSON endpoint: /api/v2/status)

#### Uitgelezen Telemetrie door GEMS
Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), PV-zonneproductie (W), Netinjectie / -afname (W).

#### Stuurbare Setpoints & Geschreven Data door GEMS
sonnenBatterie lokale API v2 `PUT /api/v2/configurations` (`EM_OperatingMode=1` Handmatig / `2` Zelfverbruik) en `POST /api/v2/setpoint/charge|discharge/{W}`.

#### Wat GEMS Concreet met dit Toestel Doet
Volledige closed-loop aansturing voor sonnenBatterie eco 8 / 10 / performance: schakelt naadloos naar handmatige API-modus tijdens geforceerde arbitrage of piekbewaking en herstelt daarna autonoom zelfverbruik.

---

### 2.4 Duracell Energy Residentiële Opslag

- **Template-ID**: `duracell_energy`
- **Fabrikant / Merk**: Duracell Energy
- **Ondersteunde Hardwaremodellen**: Duracell Energy Dura5, DuraCharge, en Durai opslagsystemen
- **Communicatie-interface**: Modbus RTU / TCP via gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Batterij laad-/ontlaadvermogen (W), Batterij-laadtoestand (SOC %), Netvermogensstroom (W), AC-vermogen omvormer (W).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Enkel uitlezing (Alleen-lezen telemetrie).

#### Wat GEMS Concreet met dit Toestel Doet
Bewaakt de laadtoestand (SOC) en vermogensuitwisseling van residentiële Duracell-batterijen voor lokale load balancing en EV-zonne-overschotsturing.

---

### 2.5 Dyness Batterijopslagsysteem

- **Template-ID**: `dyness_battery`
- **Fabrikant / Merk**: Dyness
- **Ondersteunde Hardwaremodellen**: Dyness Tower, Powerbox F, DL5.0C, en A48100 residentiële lithiumbatterijen
- **Communicatie-interface**: Modbus RTU / TCP via gateway / Omvormer BMS Port (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Batterij laad-/ontlaadvermogen (W), Batterij-laadtoestand (SOC %), Totale pakketspanning (V), Stroom (A), Celtemperaturen (°C).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dyness Tower / Powerbox / Junior Box Modbus EMS-bedrijfsmodus en laad-/ontlaadvermogenslimieten (W).

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde BMS- & PCS-opslagintegratie voor Dyness HV/LV-batterijmodules met closed-loop laad- en ontlaadsturing.

---

### 2.6 Elecnova Commerciële & Industriële BESS

- **Template-ID**: `elecnova_bess`
- **Fabrikant / Merk**: Elecnova
- **Ondersteunde Hardwaremodellen**: Elecnova ECO Series Commerciële & Industriële Buitenopstelling BESS (50kW – 500kW)
- **Communicatie-interface**: Modbus TCP via industriële gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief batterijvermogen (W), Batterij-laadtoestand (SOC %), Uitwisselingsvermogen met het net (W), Cumulatieve in-/uitgaande energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Enkel uitlezing (Alleen-lezen telemetrie).

#### Wat GEMS Concreet met dit Toestel Doet
Monitort vermogensstroom, laadtoestand (SOC) en cumulatieve energie van commerciële BESS-installaties op het live dashboard.

---

### 2.7 Goneo Residentieel Opslagsysteem

- **Template-ID**: `goneo_storage`
- **Fabrikant / Merk**: Goneo
- **Ondersteunde Hardwaremodellen**: Goneo Residentiële All-in-One Energieopslagsystemen
- **Communicatie-interface**: Modbus TCP / RTU via Wi-Fi/Ethernet Module (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Netvermogensstroom (W), Totale energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Enkel uitlezing (Alleen-lezen telemetrie).

#### Wat GEMS Concreet met dit Toestel Doet
Monitort de SOC en vermogensuitwisseling van residentiële batterijopslag voor gecoördineerde aansturing van laadpalen en slimme relais.

---

### 2.8 Mastervolt MLI Ultra / Combi CZone

- **Template-ID**: `mastervolt_storage`
- **Fabrikant / Merk**: Mastervolt
- **Ondersteunde Hardwaremodellen**: Mastervolt MLI Ultra Lithium-ion series, Mass Combi Ultra, CZone Modbus Bridge
- **Communicatie-interface**: Modbus RTU / TCP via CZone Bridge / MasterBus gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Batterijvermogen (W), Batterij-SOC (%), AC-uitgangsvermogen omvormer (W), DC-busspanning (V), batterijstroom (A).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Enkel uitlezing (Alleen-lezen telemetrie).

#### Wat GEMS Concreet met dit Toestel Doet
Biedt telemetriemonitoring voor off-grid, maritieme en residentiële Mastervolt / CZone-batterijsystemen.

---

### 2.9 Power Sonic C&I-energieopslag

- **Template-ID**: `powersonic_bess`
- **Fabrikant / Merk**: Power Sonic
- **Ondersteunde Hardwaremodellen**: Power Sonic PS-C&I en PowerBlock Commerciële & Industriële BESS
- **Communicatie-interface**: Modbus TCP via BMS/PCS Controller (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief batterijvermogen (W), Batterij-laadtoestand (SOC %), Netvermogensstroom (W), Foutstatusregisters.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Enkel uitlezing (Alleen-lezen telemetrie).

#### Wat GEMS Concreet met dit Toestel Doet
Monitort vermogensstromen en laadtoestand (SOC) van commerciële BESS-systemen op het live GEMS-dashboard.

---

### 2.10 Poweroad Residentiële & C&I-opslag

- **Template-ID**: `poweroad_storage`
- **Fabrikant / Merk**: Poweroad
- **Ondersteunde Hardwaremodellen**: Poweroad ERA, Centauri, en H-ES residentiële & commerciële energieopslagsystemen
- **Communicatie-interface**: Modbus RTU / TCP via gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Batterijvermogen (W), Batterij-laadtoestand (SOC %), Netstroom (W), Cumulatieve in-/uitgaande energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Enkel uitlezing (Alleen-lezen telemetrie).

#### Wat GEMS Concreet met dit Toestel Doet
Monitort telemetrie van residentiële en kleinzakelijke Poweroad-batterijopslagsystemen.

---

### 2.11 Pylontech Batterijopslag (US / Force)

- **Template-ID**: `pylontech_storage`
- **Fabrikant / Merk**: Pylontech
- **Ondersteunde Hardwaremodellen**: Pylontech US2000, US3000, US5000, Force-H1, Force-H2, en Pelio series
- **Communicatie-interface**: Modbus RTU / TCP via Omvormer Gateway of SC0500/SC1000 controller (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Batterij laad-/ontlaadvermogen (W), Laadtoestand (SOC %), Pakketspanning (V), Pakketstroom (A), SOH (%).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Pylontech US2000/US3000/US5000 & Force-H1/H2 BMS/EMS laad- en ontlaadvermogenssetpoints via Modbus TCP/RTU.

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde closed-loop telemetrie en vermogenssturing voor laag- en hoogspannings Pylontech-batterijracks.

---

### 2.12 Socomec SUNSYS C-System / HES BESS

- **Template-ID**: `socomec_bess`
- **Fabrikant / Merk**: Socomec
- **Ondersteunde Hardwaremodellen**: Socomec SUNSYS C-System en SUNSYS HES L / XL Industriële Energieopslagsystemen
- **Communicatie-interface**: Modbus TCP via Diris Digiware / BESS Controller (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief batterijvermogen (W), Batterij-SOC (%), Live BMS max. laad-/ontlaadlimieten (`0xC008`–`0xC009` W), Actieve netvermogensstroom (W), Cumulatieve energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Socomec SUNSYS PCS externe actieve vermogenssturing (`0xC100` Modus, `0xC101`–`0xC102` S32 0,1 kW setpoint, `0xC103=300s` hardware-watchdog) met SunSpec Model 124 opslagsturing als terugval.

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde closed-loop C&I-batterijsturing voor Socomec SUNSYS HES L/XL en PCS+: voert industriële piekbewaking, bescherming van het capaciteitsplafond en EPEX-spotarbitrage uit.

---

### 2.13 Sunwoda AtSmart Energieopslag

- **Template-ID**: `sunwoda_energy`
- **Fabrikant / Merk**: Sunwoda Energy
- **Ondersteunde Hardwaremodellen**: Sunwoda AtSmart Residentieel Batterijsysteem en Noah C&I BESS
- **Communicatie-interface**: Modbus TCP via BMS Communication Hub (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Batterij laad-/ontlaadvermogen (W), Batterij-laadtoestand (SOC %), Netvermogensstroom (W), Temperatuur (°C).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Enkel uitlezing (Alleen-lezen telemetrie).

#### Wat GEMS Concreet met dit Toestel Doet
Monitort de laadtoestand en vermogensuitwisseling van Sunwoda-batterijsystemen op het live GEMS-dashboard.

---

### 2.14 Sessy Slimme Batterij (AC-thuisbatterij)

- **Template-ID**: `sessy_battery`
- **Fabrikant / Merk**: Sessy
- **Ondersteunde Hardwaremodellen**: Sessy 5 kWh Modulaire AC-gekoppelde Retrofit Thuisbatterij
- **Communicatie-interface**: Lokale HTTP REST-API met Basic-authenticatie (`/api/v1/power/status`, `/api/v1/power/active_strategy`, `/api/v1/power/setpoint`)

#### Uitgelezen Telemetrie door GEMS
Batterij laad-/ontlaadvermogen (W), Laadtoestand (SOC %), Geïnjecteerde energie (kWh), RMS-spanningen (V) & stromen (A) per fase.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische strategieselectie (`POWER_STRATEGY_API` vs. `POWER_STRATEGY_NOM`) en richtingsgevoelig Watt-setpoint (`-W` Laden / `+W` Ontladen).

#### Wat GEMS Concreet met dit Toestel Doet
Cloudvrije lokale aansturing van Nederlandse Sessy retrofit-thuisbatterijen voor zonnezelfverbruik, Vlaamse capaciteitspiekbewaking en EPEX-spotarbitrage.

---

### 2.15 Tesla Powerwall 2 / 3 & Backup Gateway (Lokale HTTPS)

- **Template-ID**: `tesla_powerwall`
- **Fabrikant / Merk**: Tesla Energy
- **Ondersteunde Hardwaremodellen**: Tesla Powerwall 2, Powerwall+, Powerwall 3 & Backup Gateway 2 (Stationaire Thuisopslag)
- **Communicatie-interface**: Lokale HTTPS Gateway-API (`POST /api/login/Basic`, `GET /api/meters/aggregates`, `GET /api/system_status/soe`)

#### Uitgelezen Telemetrie door GEMS
Batterijvermogen (W), Bruikbare laadtoestand (SOC %), Netvermogen van de site (W), Zonnevermogen (W), Cumulatieve energie (kWh), 3-fasen sitestromen & spanning.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Enkel uitlezing (Lokale Gateway v23+ firmware laat lokaal enkel uitlezing toe).

#### Wat GEMS Concreet met dit Toestel Doet
Snelle lokale HTTPS-uitlezing van stationaire Powerwall net-, zonne- en batterijstromen ter aansturing van EV-zonne-overschotladen en capaciteitspiekbewaking.

---

### 2.16 VARTA pulse / neo / element Thuisopslag

- **Template-ID**: `varta_storage`
- **Fabrikant / Merk**: VARTA
- **Ondersteunde Hardwaremodellen**: VARTA pulse, VARTA pulse neo, VARTA element, VARTA element backup, VARTA link
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Unit-ID: 255, Holding-registers `1066`–`1102` & `2065`–`2066`)

#### Uitgelezen Telemetrie door GEMS
Batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Cumulatieve geladen energie (kWh), Netsensorvermogen (W), Vermogen gekoppelde PV-sensor (W).

#### Stuurbare Setpoints & Geschreven Data door GEMS
VARTA EMS actieve vermogenssturing (`2065` Commando: Laden/Ontladen/Auto, `2066` Vermogen W; terugvalregister `1074`).

#### Wat GEMS Concreet met dit Toestel Doet
Closed-loop lokale Modbus TCP-aansturing voor AC-gekoppelde VARTA-opslagsystemen: automatiseert opladen tijdens goedkope spoturen en huishoudelijke piekbewaking.

---

### 2.17 Zendure SolarFlow AC / Hyper 2000

- **Template-ID**: `zendure_solarflow`
- **Fabrikant / Merk**: Zendure
- **Ondersteunde Hardwaremodellen**: Zendure Hyper 2000, SolarFlow 800, SolarFlow AB1000/AB2000, SolarFlow 2400 AC
- **Communicatie-interface**: Lokale HTTP JSON-API (`GET /properties/report`, `POST /properties/write`)

#### Uitgelezen Telemetrie door GEMS
PV-ingangsvermogen (W), Batterijpakket laad- & ontlaadvermogen (W), Laadtoestand (`electricLevel` %).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Slimme AC-modus (`acMode` Laden/Ontladen) en traploze `inputLimit` / `outputLimit` Watt-setpoints (`0–2400 W`).

#### Wat GEMS Concreet met dit Toestel Doet
100% lokale cloudvrije aansturing voor plug-in en AC-gekoppelde Zendure-opslag: absorbeert overtollige PV-stroom en ontlaadt om huishoudelijke avondpieken op te vangen.

---

### 2.18 Sinexcel PWS Bidirectionele PCS / Commerciële BESS

- **Template-ID**: `sinexcel_bess`
- **Fabrikant / Merk**: Sinexcel
- **Ondersteunde Hardwaremodellen**: Sinexcel PWS1-30K / 50K / 100K / 250K / 500K / 630K Bidirectionele PCS & Commerciële BESS-racks
- **Communicatie-interface**: Modbus TCP / RTU (Standaardpoort: 502, Unit-ID: 1, Holding `100`–`113` & `600`–`610`)

#### Uitgelezen Telemetrie door GEMS
Actief batterijvermogen (`106` 0.1 kW), Batterij-SOC (`109` 0.1%), Cumulatieve ontladen energie (`110`–`111` 0.1 kWh), Live BMS max. laad-/ontlaadvermogenslimieten (`112`–`113` 0.1 kW), 3-fasenspanningen & -stromen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Externe PCS Start/Stand-by (`600`), constant-vermogen PQ-modus (`601`), richtingsgevoelig actief vermogenssetpoint (`602` S16 0,1 kW) en 60-seconden fail-safe watchdog (`610`).

#### Wat GEMS Concreet met dit Toestel Doet
Closed-loop industriële en C&I-batterijsturing voor Sinexcel PWS-opslagomvormers: automatiseert hoogvermogen piekbewaking, transformatorbeveiliging en Day-Ahead spotarbitrage.

---

### 2.19 Aangepaste Modbus-batterijopslag (UI Registerprofiel)

- **Template-ID**: `custom_modbus_battery`
- **Fabrikant / Merk**: Custom Modbus
- **Ondersteunde Hardwaremodellen**: Elke Modbus TCP- of RS-485 RTU stationaire thuisbatterij, PCS of BMS-gateway geconfigureerd via de gecertificeerde UI Registerprofielbouwer
- **Communicatie-interface**: Modbus TCP / RTU (Configureerbare poort of `/dev/serial/by-id/*` bus, Unit-ID, `FC03`/`FC04` uitlezing & optionele `FC06`/`FC16` setpoints)

#### Uitgelezen Telemetrie door GEMS
Via UI gekoppeld batterij laad-/ontlaadvermogen (W), Batterij-SOC (%), Live BMS max. laad-/ontlaadlimieten (W), Cumulatieve energie (kWh) en 3-fasenspanningen & -stromen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Optionele via UI gekoppelde richtingsgevoelige of gescheiden batterijvermogenssetpoints (`battery_power_w`, `battery_charge_w`, `battery_discharge_w`), begrensde min/max veiligheidsgrenzen, watchdog heartbeat en veilige zelfverbruik-terugval.

#### Wat GEMS Concreet met dit Toestel Doet
Integreert aangepaste residentiële en commerciële Modbus-batterijsystemen in GEMS 24-uurs dynamische arbitrage, Vlaamse capaciteitspiekbewaking en negatieve-prijs zonne-absorptie zonder maatwerkcode.

---

## 3. Elektrische Voertuig (EV) Laadpalen & Wallboxen (61 Toestellen)

EV-laadpalen communiceren via **Modbus TCP/RTU-veldbus (aanbevolen voorkeursintegratie)**, de **ingebouwde OCPP 1.6-J WebSocket-server**, of **lokale HTTP REST-API's**. Laadpalen ondersteunen dynamische sub-seconde stroommodulatie (6A tot 32A in stappen van 0,1A of 1A), optionele 1-fase / 3-fasen omschakeling (1,4 kW tot 22 kW op ondersteunde hardware), zonnestroomvolging (Eco-modus), afvlakking van het Vlaams capaciteitstarief en hoofdzekeringbeveiliging. Cruciaal voordeel: via lokale Modbus TCP regelt GEMS de laadsnelheid zonder externe CPO-facturatie of werkgeversverrekening via OCPP te onderbreken.

### 3.1 ABB Charger

- **Template-ID**: `abb_charger`
- **Fabrikant / Merk**: ABB
- **Ondersteunde Hardwaremodellen**: ABB Terra AC Wallbox (TAC-W7, TAC-W11, TAC-W22 Series)
- **Communicatie-interface**: Modbus TCP via Ethernet / Wi-Fi (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W, reg 0x401C), Cumulatieve sessie-energie (kWh, reg 0x401E).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische laadstroomregeling (Ampère, reg 0x4100, 6A tot 32A in stappen van 1mA).

#### Wat GEMS Concreet met dit Toestel Doet
Sub-seconde stroomregeling via Modbus TCP: moduleert dynamisch de laadstroom op basis van zonne-overschot (Eco-modus) en knijpt onmiddellijk terug bij capaciteitspieken (Vlaanderen-modus); werkt naadloos samen met externe verreken- en vergoedingsplatformen.

---

### 3.2 ABL eM4 Single/Twin (SBCx)

- **Template-ID**: `abl_em4_charger`
- **Fabrikant / Merk**: ABL
- **Ondersteunde Hardwaremodellen**: ABL Wallbox eM4 Single & eM4 Twin (met interne SBCx-controller)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Unit-ID: 255 of 1)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W, reg 0x300D), Totale energie (kWh, reg 0x300F).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische laadstroomregeling (Ampère, reg 0x3001, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Directe Modbus-aansturing: regelt enkele of dubbele laadaansluitingen om zonne-overschot op het dak te volgen en Vlaamse capaciteitslimieten te respecteren zonder zakelijke verrekening te onderbreken.

---

### 3.3 ABL eMH1 / eMH2 / eMH3

- **Template-ID**: `abl_emh_charger`
- **Fabrikant / Merk**: ABL
- **Ondersteunde Hardwaremodellen**: ABL Wallbox eMH1, eMH2, eMH3 Series (met RS485-to-Ethernet Bridge)
- **Communicatie-interface**: Modbus RTU-over-TCP-bridge (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Sessie-energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Laadstroomregeling (Ampère, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Integreert zowel bestaande als moderne ABL eMH-laadpalen en biedt geautomatiseerd zonvolgend laden en piekbewaking.

---

### 3.4 AUTEL AC MaxiCharger

- **Template-ID**: `autel_charger`
- **Fabrikant / Merk**: AUTEL
- **Ondersteunde Hardwaremodellen**: Autel MaxiCharger AC Compact / MaxiCharger AC Wallbox (7.4kW, 11kW, 22kW)
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (Poort: 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Sessie-energie (kWh), Voertuigverbindingsstatus, 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling via SetChargingProfile (6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Autonoom residentieel slim laden via ingebouwde OCPP: past de laadsnelheid aan op zonne-overschot en pauzeert het laden tijdens piektariefperiodes.

---

### 3.5 Alfen Charger

- **Template-ID**: `alfen_charger`
- **Fabrikant / Merk**: Alfen
- **Ondersteunde Hardwaremodellen**: Alfen Eve Single Pro-line, Eve Single S-line, Eve Double Pro-line (Direct Modbus TCP)
- **Communicatie-interface**: Modbus TCP / Active Load Balancing-licentie (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Totale energie (kWh), Laadstromen per fase (Ampère).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Modbus Slave max. laadstroom (`1210` IEEE-754 Float32 Ampère met station-watchdog) en contactor-faseomschakeling (`1215`: `1` = 1-Fase, `3` = 3-Fasen).

#### Wat GEMS Concreet met dit Toestel Doet
Aanbevolen Benelux Modbus TCP-integratie voor Alfen Eve Single & Double Pro-line: sub-seconde zonne-overschotvolging, hoofdzekeringbeveiliging en automatische 1F/3F-omschakeling.

---

### 3.6 Alpitronic Hypercharger

- **Template-ID**: `alpitronic_charger`
- **Fabrikant / Merk**: Alpitronic
- **Ondersteunde Hardwaremodellen**: Alpitronic Hypercharger HYC50, HYC150, HYC300, HYC400 DC-snelladers
- **Communicatie-interface**: Modbus TCP / OCPP 1.6-J (Standaardpoort: 502 of 8887, Unit-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief DC-laadvermogen (kW/W), Cumulatieve geleverde energie (kWh), Connectorstatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische laadvermogenslimiet (kW / Ampère setpoints).

#### Wat GEMS Concreet met dit Toestel Doet
Begrenst dynamisch het DC-snellaadvermogen om tijdens piekbelasting strikt onder de netaansluitcapaciteit en Vlaamse pieklimieten te blijven.

---

### 3.7 BMW i Wallbox (Connect/Pro)

- **Template-ID**: `bmw_charger`
- **Fabrikant / Merk**: BMW
- **Ondersteunde Hardwaremodellen**: BMW i Wallbox Connect, BMW i Wallbox Pro (Modbus TCP / UDP)
- **Communicatie-interface**: Modbus TCP via LAN (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Laadvermogen (W), Sessie-energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamisch stroomsetpoint (Ampère, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Lokale LAN-stroomregeling; stemt het laden af op beschikbare zonne-energie en goedkope EPEX-daluren.

---

### 3.8 Bender Charger

- **Template-ID**: `bender_charger`
- **Fabrikant / Merk**: Bender
- **Ondersteunde Hardwaremodellen**: Bender CC612, CC613 Laadcontrollers (ingebouwd in diverse OEM-wallboxen)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Sessie-energie (kWh), Pilotstatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Bender CC612 / CC613 HEMSw-stroomlimiet (`1001` 0,1 A vanaf FW >= 4.70, terugval `1000` 1 A) en dynamische 1-fase / 3-fasen omschakeling (`1002`).

#### Wat GEMS Concreet met dit Toestel Doet
Directe lokale Modbus TCP-sturing voor Bender CC612/CC613-laadcontrollers (EBEE, Compleo, Mennekes OEM's) met sub-ampère regeling en 1F/3F-zonneschakeling.

---

### 3.9 Blitzpower / Phoenix CharX

- **Template-ID**: `blitzpower_charger`
- **Fabrikant / Merk**: Blitzpower
- **Ondersteunde Hardwaremodellen**: Blitzpower AC Wallbox Series (Phoenix Contact CHARX architecture)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Laadvermogen (W), Cumulatieve energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Laadstroomregeling (Ampère, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Snelle Modbus-registersturing: moduleert stroomsetpoints voor laden op zonne-overschot en actieve piekbewaking.

---

### 3.10 Delta AC MAX / SLIM / Ultrasnelle Lader

- **Template-ID**: `delta_charger`
- **Fabrikant / Merk**: Delta
- **Ondersteunde Hardwaremodellen**: Delta AC MAX Basic/Smart (7.4kW/11kW/22kW), Delta SLIM, Ultrasnelle EV-laders
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Totale energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Laadstroomsetpoint (Ampère, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Moduleert het stroomsetpoint van de Delta-wallbox via Modbus TCP; optimaliseert de laadsnelheid om zonneproductie te benutten zonder dure netafname.

---

### 3.11 EN+ AC EV-laadpaal

- **Template-ID**: `enplus_charger`
- **Fabrikant / Merk**: EN+
- **Ondersteunde Hardwaremodellen**: EN+ AC EV-laadpaal Series (Home / Commercial Series)
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (Poort: 8887)

#### Uitgelezen Telemetrie door GEMS
Laadvermogen (W), Energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Laadstroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Autonome zonne-overschotvolging en piekbewaking via lokale OCPP SetChargingProfile-commando's.

---

### 3.12 ETEK EKEPC2-C/S Laadcontroller

- **Template-ID**: `etek_charger`
- **Fabrikant / Merk**: ETEK
- **Ondersteunde Hardwaremodellen**: ETEK EKEPC2-C / EKEPC2-S Intelligente Laadcontroller (Modbus RTU/TCP)
- **Communicatie-interface**: Modbus TCP via gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Laadvermogen (W), Sessie-energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling (Ampère, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Directe Modbus-registeraansturing om de laadsnelheid realtime af te stemmen op de vermogensbalans van de woning.

---

### 3.13 EVBox Elvi / Livo / BusinessLine

- **Template-ID**: `evbox_charger`
- **Fabrikant / Merk**: EVBox
- **Ondersteunde Hardwaremodellen**: EVBox Elvi, EVBox Livo, EVBox BusinessLine (OCPP 1.6-J)
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (Poort: 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Totale geleverde energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Connectorstatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling via SetChargingProfile (6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Volledige lokale OCPP-ondersteuning voor EVBox: regelt de laadstroom dynamisch in stappen van 1A om zonne-energie van het dak te benutten en hoge capaciteitstarieven te vermijden.

---

### 3.14 Easee Charger

- **Template-ID**: `easee_charger`
- **Fabrikant / Merk**: Easee
- **Ondersteunde Hardwaremodellen**: Easee Home, Easee Charge (Cloud REST API)
- **Communicatie-interface**: Easee Cloud REST API (Authenticatie met cloudinloggegevens)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Totale sessie-energie (kWh), Laderstatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Easee-API dynamische kring-/laadstroom (6–32 A), sessie `pause_charging` / `resume_charging` en automatische `phaseMode` 1-fase / 3-fasen omschakeling.

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde slimme laadsturing voor Easee Home, Charge en Charge Lite/Up: moduleert laadstroom, pauzeert/hervat sessies netjes en schakelt automatisch tussen 1-fase en 3-fasen zonnemodus.

---

### 3.15 Enovates SingleWallBox

- **Template-ID**: `enovates_charger`
- **Fabrikant / Merk**: Enovates
- **Ondersteunde Hardwaremodellen**: Enovates SingleWallBox (Modbus TCP)
- **Communicatie-interface**: Modbus TCP via LAN (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Laadvermogen (W), Totale energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamisch stroomsetpoint (Ampère, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Directe lokale Modbus-aansturing; werkt naadloos samen met externe CPO-verrekenplatformen terwijl GEMS lokaal de load balancing en piekbewaking uitvoert.

---

### 3.16 Ensto Chago Wallbox / Pro

- **Template-ID**: `ensto_charger`
- **Fabrikant / Merk**: Ensto
- **Ondersteunde Hardwaremodellen**: Ensto Chago Wallbox, Ensto One, Ensto Pro Series (Modbus TCP)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Totale energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Laadstroomregeling (Ampère, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Uiterst betrouwbare Scandinavische zakelijke en residentiële lader; knijpt de laadstroom bij om de huisaansluiting te respecteren en zonne-overschot te benutten.

---

### 3.17 Etrel INCH / sonnenCharger

- **Template-ID**: `etrel_charger`
- **Fabrikant / Merk**: Etrel
- **Ondersteunde Hardwaremodellen**: Etrel INCH Pro, Etrel INCH Lite, sonnenCharger (Modbus TCP)
- **Communicatie-interface**: Modbus TCP via Ethernet (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen (W), Sessie-energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamisch stroomsetpoint (Ampère, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Lokale Modbus TCP-regeling; optimaliseert het laden in samenspel met sonnen- of andere thuisbatterijen en zonnepanelen.

---

### 3.18 Fronius Wattpilot (Home / Go)

- **Template-ID**: `fronius_wattpilot`
- **Fabrikant / Merk**: Fronius
- **Ondersteunde Hardwaremodellen**: Fronius Wattpilot Home (11J/22J), Fronius Wattpilot Go (11J/22J)
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (Poort: 8887)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen (W), Energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Stuurt de Wattpilot volledig cloudvrij rechtstreeks vanuit GEMS aan; ondersteunt dynamische 1-fase / 3-fasen omschakeling en zonne-overschotladen.

---

### 3.19 GoodWe HCA Series EV Wallbox (Gen 2)

- **Template-ID**: `goodwe_charger`
- **Fabrikant / Merk**: GoodWe
- **Ondersteunde Hardwaremodellen**: GoodWe HCA Series EV Wallbox (Gen 2 Modbus TCP)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Laadvermogen (W), Sessie-energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Laadstroomsetpoint (Ampère, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Stem GoodWe-wallboxen naadloos af op GoodWe hybride omvormers; geeft voorrang aan de thuisbatterij alvorens resterend overschot naar de wagen te sturen.

---

### 3.20 Hager witty (one / plus / pro / park 2)

- **Template-ID**: `hager_charger`
- **Fabrikant / Merk**: Hager
- **Ondersteunde Hardwaremodellen**: Hager witty, witty one, witty plus, witty pro, witty park 2 (OCPP 1.6-J)
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (Poort: 8887)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen (W), Sessie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Cloudvrij residentieel beheer van Hager witty-laadpalen met automatische zonne-overschotvolging en Vlaamse capaciteitspiekbewaking.

---

### 3.21 Huawei FusionCharge (SCharger-7KS / 22KT)

- **Template-ID**: `huawei_scharger`
- **Fabrikant / Merk**: Huawei
- **Ondersteunde Hardwaremodellen**: Huawei FusionCharge AC Wallbox (SCharger-7KS Monofasig, SCharger-22KT Driefasig)
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (Poort: 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Sessie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Stekkerstatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling via SetChargingProfile (6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Directe lokale aansturing van Huawei FusionCharge zonder afhankelijkheid van de FusionSolar-cloud: werkt naadloos samen met Huawei SUN2000-omvormers en LUNA2000-batterijen voor 100% zonneladen.

---

### 3.22 KEBA KeContact P30/P40

- **Template-ID**: `keba_charger`
- **Fabrikant / Merk**: KEBA
- **Ondersteunde Hardwaremodellen**: KEBA KeContact P30 (c-series, x-series), KeContact P40 Series (Modbus TCP / UDP)
- **Communicatie-interface**: Modbus TCP via LAN (Standaardpoort: 502, Unit-ID: 255)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W, reg 1020), Totale energie (kWh, reg 1036).

#### Stuurbare Setpoints & Geschreven Data door GEMS
KEBA KeContact P30 x/c-serie & P40 laadstroom in milliampère (`5004`), vrijgave (`5014`) en KeContact S10 faseomschakeling (`5050=3`, `5052=0/1`).

#### Wat GEMS Concreet met dit Toestel Doet
Nauwkeurige 1 mA Modbus TCP-aansturing en automatische 1F/3F-faseomschakeling voor KEBA KeContact P30 en P40-installaties.

---

### 3.23 Mennekes AMTRON (4You / 4Business / ACU / AMEDIO)

- **Template-ID**: `mennekes_ocpp`
- **Fabrikant / Merk**: Mennekes
- **Ondersteunde Hardwaremodellen**: Mennekes AMTRON 4You, AMTRON 4Business, AMTRON Professional, AMEDIO (OCPP 1.6-J)
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (Poort: 8887)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen (W), Totale energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling via SetChargingProfile (6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Universele lokale OCPP-aansturing voor moderne Mennekes-productlijnen; maakt puur zonneladen en Vlaamse capaciteitspiekpreventie mogelijk.

---

### 3.24 Mennekes AMTRON (Xtra / Premium / HCC3 Modbus)

- **Template-ID**: `mennekes_modbus`
- **Fabrikant / Merk**: Mennekes
- **Ondersteunde Hardwaremodellen**: Mennekes AMTRON Xtra, AMTRON Premium, HCC3 Controller Series (Modbus TCP)
- **Communicatie-interface**: Modbus TCP via LAN (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Cumulatieve energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische laadstroomregeling (Ampère, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Directe lokale Modbus-aansturing voor Mennekes premium wallboxen; elimineert cloudvertraging voor onmiddellijke piekbewaking.

---

### 3.25 Mercedes-Benz Wallbox

- **Template-ID**: `mercedes_wallbox`
- **Fabrikant / Merk**: Mercedes-Benz
- **Ondersteunde Hardwaremodellen**: Mercedes-Benz Wallbox (Home AC Charger, tot 22kW)
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (Poort: 8887)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen (W), Energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Laadstroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Autonoom thuisladen voor de Mercedes-Benz Wallbox; volledig geïntegreerd in de dynamische load balancing van GEMS.

---

### 3.26 NRGkick (Gen 2)

- **Template-ID**: `nrgkick_gen2`
- **Fabrikant / Merk**: NRGkick
- **Ondersteunde Hardwaremodellen**: NRGkick Gen 2 Mobiele & Wandgemonteerde Slimme EV-lader (Local Modbus TCP / Wi-Fi)
- **Communicatie-interface**: Modbus TCP via lokaal Wi-Fi (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Geleverde energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Laadstroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Lokale Modbus TCP-regeling voor mobiele en wandgemonteerde NRGkick-laders; past stroomsetpoints automatisch aan op het zonne-overschot.

---

### 3.27 OCPP Charger

- **Template-ID**: `ocpp_charger`
- **Fabrikant / Merk**: Generiek
- **Ondersteunde Hardwaremodellen**: Universele Generieke OCPP 1.6-J Slimme EV-laadpaal (Elke OCPP 1.6-J-compatibele laadpaal)
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (`ws://<EMS-IP>:8887/<ChargePointID>` of `ws://<EMS-IP>:8080/api/ocpp/<ChargePointID>`)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen (W), Geleverde energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Stekker- en transactiestatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Gestandaardiseerd OCPP 1.6-J SetChargingProfile (stroomsetpoints: 0A pauze en 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Merkuafhankelijk centraal laadsysteem: ondersteunt honderden OCPP 1.6-J-compatibele zakelijke en residentiële laadpalen wereldwijd en stuurt dynamische laadprofielen op basis van de gekozen GEMS-strategie.

---

### 3.28 Peblar EV-laadpaal (Home / Business / Plus)

- **Template-ID**: `peblar_charger`
- **Fabrikant / Merk**: Peblar
- **Ondersteunde Hardwaremodellen**: Peblar Home, Peblar Business, Peblar Plus (Modbus TCP Direct)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Cumulatieve sessie-energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamisch stroomsetpoint (Ampère, 6A tot 32A in stappen van 0,1A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Nederlandse slimme wallbox: laat GEMS sub-seconde stroomaanpassingen sturen via Modbus TCP terwijl zakelijke split-billing gelijktijdig actief blijft.

---

### 3.29 Phoenix Contact Charx Charger

- **Template-ID**: `phoenix_charger`
- **Fabrikant / Merk**: Phoenix Contact
- **Ondersteunde Hardwaremodellen**: Phoenix Contact CHARX SEC / EV-CC-AC1-M3 Series (Modbus TCP)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Laadvermogen (W), Totale sessie-energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Phoenix Contact CHARX SEC-3000 / EV-CC Modbus-laadstroomlimiet en laadvrijgave-coil/register.

#### Wat GEMS Concreet met dit Toestel Doet
Industriële lokale Modbus TCP load balancing en zonne-overschotladen voor Phoenix Contact CHARX-laadcontrollers.

---

### 3.30 Phoenix Contact EV-CC / CHARX (Modbus TCP)

- **Template-ID**: `phoenix_contact_evcc`
- **Fabrikant / Merk**: Phoenix Contact
- **Ondersteunde Hardwaremodellen**: Phoenix Contact EV-CC-AC1-M3 / CHARX Control Modular (Modbus TCP)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Totale energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Directe Modbus-registeraansturing om laadsnelheden continu bij te regelen voor piekbewaking en zonne-overschot.

---

### 3.31 Externe CPO-wallbox (OCPP 1.6-J)

- **Template-ID**: `generic_cpo_ocpp`
- **Fabrikant / Merk**: Generiek OCPP
- **Ondersteunde Hardwaremodellen**: AC Wallbox Series compatibel met OCPP 1.6-J en externe CPO-verrekening
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (`ws://<EMS-IP>:8080/api/ocpp/<ChargePointID>`)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen (W), Geleverde energie (kWh), 3-fasenstromen en -spanningen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling (Ampère, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Lokaal slim laden en straight-through OCPP-proxy load balancing met externe CPO-verrekenplatformen op basis van zonne-overschot en hoofdzekeringslimieten.

---

### 3.32 Porsche Wallbox / Mobile Charger Connect

- **Template-ID**: `porsche_wallbox`
- **Fabrikant / Merk**: Porsche
- **Ondersteunde Hardwaremodellen**: Porsche Mobile Charger Connect, Porsche Wallbox (OCPP 1.6-J)
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (Poort: 8887)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Geleverde energie (kWh), 3-fasenstromen en -spanningen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Verbindt Porsche-laadpalen rechtstreeks met GEMS zonder abonnement en bewaakt strikt de Vlaamse capaciteitspieklimieten.

---

### 3.33 RAEDIAN Gemini AC Wallbox

- **Template-ID**: `raedian_gemini`
- **Fabrikant / Merk**: RAEDIAN
- **Ondersteunde Hardwaremodellen**: RAEDIAN Gemini Dubbele AC Zakelijke & Vloot-wallbox (Tot 2x 22kW, 44kW total)
- **Communicatie-interface**: Modbus TCP via LAN (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Gecombineerd actief vermogen (W), Afzonderlijk laadvermogen Socket 1 & Socket 2 (W), Energie per laadaansluiting (kWh), Afzonderlijke 3-fasenstromen voor Socket 1 (L1, L2, L3) en Socket 2 (L1, L2, L3 in Ampère), stekkerstatus per laadaansluiting.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Continue dynamische stroommodulatie (0A tot 64A totaalbereik, dynamisch verdeeld over Socket 1 & Socket 2), Modus per laadaansluiting (Eco / Snel / Uit).

#### Wat GEMS Concreet met dit Toestel Doet
Geavanceerde load balancing voor dubbele laadaansluitingen: verdeelt het laadvermogen gelijktijdig over twee voertuigen, regelt de gecombineerde stroom dynamisch van 0A tot 64A en beschermt de hoofdzekering met maximaal zonnezelfverbruik.

---

### 3.34 RAEDIAN NEO / NEX AC Wallbox

- **Template-ID**: `raedian_charger`
- **Fabrikant / Merk**: RAEDIAN
- **Ondersteunde Hardwaremodellen**: RAEDIAN NEO Series, RAEDIAN NEX Series AC Smart Wallbox (7.4kW, 11kW, 22kW)
- **Communicatie-interface**: Modbus TCP via LAN of Wi-Fi (Standaardpoort: 502, Slave-ID: 1 of 2)

#### Uitgelezen Telemetrie door GEMS
Realtime actief laadvermogen (W), Sessie-energie (kWh), 3-fasen laadstromen (L1, L2, L3 in Ampère), 3-fasen laadspanningen (L1, L2, L3 in Volt), Socketstatus & foutcodes.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Continue dynamische stroomregeling (Ampère, 6A tot 32A in stappen van 0,1A), Automatisch pauzeren & hervatten van sessies.

#### Wat GEMS Concreet met dit Toestel Doet
Aanbevolen Modbus TCP-referentie-integratie: leest alle driefasige stromen en spanningen in één gebundeld verzoek uit; sub-seconde stroomregeling reageert onmiddellijk op zonne-overschotten en Vlaamse capaciteitspieken.

---

### 3.35 SMA EV-laadpaal (7.4 / 22 / eCharger)

- **Template-ID**: `sma_evcharger`
- **Fabrikant / Merk**: SMA
- **Ondersteunde Hardwaremodellen**: SMA EV-laadpaal 7.4, SMA EV-laadpaal 22
- **Communicatie-interface**: Lokale HTTP REST-API (Standaardpoort: 80 / 443)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen (W), Cumulatieve energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Enkel uitlezing (Alleen-lezen telemetrie — SMA EV-laadpaal vereist SEMP/SHM2 voor actieve stroomsturing).

#### Wat GEMS Concreet met dit Toestel Doet
Monitort het realtime laadvermogen en de sessie-energie van de SMA EV Charger voor nauwkeurige verwerking in het huishoudelijke energieoverzicht.

---

### 3.36 Schneider Electric EVlink (Wallbox / Pro AC)

- **Template-ID**: `schneider_evlink`
- **Fabrikant / Merk**: Schneider Electric
- **Ondersteunde Hardwaremodellen**: Schneider Electric EVlink Wallbox, EVlink Pro AC, EVlink Smart Wallbox (OCPP 1.6-J)
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (Poort: 8887)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling via SetChargingProfile (6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Ingebouwde OCPP-setpointregeling voor vloeiend laden op zonne-overschot en het vermijden van capaciteitspieken.

---

### 3.37 Siemens VersiCharge GEN3 Wallbox

- **Template-ID**: `siemens_versicharge`
- **Fabrikant / Merk**: Siemens
- **Ondersteunde Hardwaremodellen**: Siemens VersiCharge GEN3 AC Smart Wallbox (Commercial & Residential 7.4kW - 22kW)
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (Poort: 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Uitgelezen Telemetrie door GEMS
Realtime vermogen (W), Cumulatieve energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Koppelt de Siemens VersiCharge GEN3 via OCPP aan GEMS en voert Vlaamse piekbewaking en zonne-overschotsturing uit.

---

### 3.38 Sigenergy SigenStor EVAC / EVDC Charger

- **Template-ID**: `sigenergy_evac`
- **Fabrikant / Merk**: Sigenergy
- **Ondersteunde Hardwaremodellen**: Sigenergy Sigen EVAC AC Wallbox, Sigen EVDC Bidirectionele Snellader
- **Communicatie-interface**: Modbus TCP via Sigen Gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Laadvermogen (W), Sessie-energie (kWh), 3-fasenstromen en -spanningen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling (Ampère, 6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Directe Modbus-aansturing van Sigen EV-laadmodules in nauwe samenwerking met de SigenStor-batterij om overtollige zonne-energie optimaal te benutten.

---

### 3.39 SmartEVSE v2 / v3 (HTTP / Modbus)

- **Template-ID**: `smartevse_charger`
- **Fabrikant / Merk**: SmartEVSE
- **Ondersteunde Hardwaremodellen**: SmartEVSE v2, SmartEVSE v3 Open-source EV-laadcontroller
- **Communicatie-interface**: Lokale HTTP REST-API / Modbus TCP (Standaardpoort: 80, REST endpoint: /add)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen (W), Totale energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Pilotstatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling (Ampère, 6A tot 32A via /add?current=X), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Lokale REST-setpointmodulatie waarmee open-source laadcontrollers 100% op zonne-overschot laden zonder cloudaccounts.

---

### 3.40 SolarEdge EV-laadpaal

- **Template-ID**: `solaredge_evse`
- **Fabrikant / Merk**: SolarEdge
- **Ondersteunde Hardwaremodellen**: SolarEdge Home EV-laadpaal (Geïntegreerde omvormer-lader & standalone AC-wallbox)
- **Communicatie-interface**: Modbus TCP via SolarEdge-omvormer of standalone module (Standaardpoort: 502 / 1502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Cumulatieve energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamisch stroomsetpoint (Ampère, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Synchroniseert de laadsnelheid met de opwekking van de SolarEdge-omvormer en beschermt de hoofdzekeringen van de woning.

---

### 3.41 Veton / Phoenix CharX

- **Template-ID**: `veton_charger`
- **Fabrikant / Merk**: Veton
- **Ondersteunde Hardwaremodellen**: Veton One, Veton Two, Veton Wallbox Series (Design-laadpalen)
- **Communicatie-interface**: Modbus TCP via interne Phoenix Contact CHARX-controller (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Sessie-energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische laadstroomregeling (Ampère, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Directe Modbus TCP-registeraansturing voor naadloos zonne-overschotladen en piekbewaking op architecturale Veton-designlaadpalen.

---

### 3.42 Volkswagen / Elli / Skoda / SEAT (ID. Charger Connect / Pro)

- **Template-ID**: `elli_charger`
- **Fabrikant / Merk**: Volkswagen / Elli
- **Ondersteunde Hardwaremodellen**: Volkswagen ID. Charger Connect / Pro, Elli Charger, Skoda iV Charger, SEAT Charger
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (Poort: 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Totale sessie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Stekkerstatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische stroomregeling via SetChargingProfile (6A tot 32A), Faseomschakeling (1F / 3F).

#### Wat GEMS Concreet met dit Toestel Doet
Directe lokale OCPP-serverintegratie: laat ID. Chargers van de VW-groep puur op zonne-overschot laden en Vlaamse capaciteitspieken vermijden zonder dure cloudabonnementen.

---

### 3.43 Wallbox Pulsar/Commander

- **Template-ID**: `wallbox_charger`
- **Fabrikant / Merk**: Wallbox
- **Ondersteunde Hardwaremodellen**: Wallbox Pulsar Plus, Pulsar Max, Commander 2, Copper SB (Wallbox Cloud REST API)
- **Communicatie-interface**: Cloud REST API (Authenticatie met Wallbox-cloudgegevens)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Totale energie (kWh), Laderstatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Wallbox-API `PUT /v2/charger/{id}` dynamische stroomlimiet (6–32 A) en `POST /v3/chargers/{id}/remote-action` (`action: 1` Hervatten / `2` Pauzeren).

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde closed-loop stroommodulatie en automatisch pauzeren/hervatten van laadsessies voor Wallbox Pulsar Plus, Pulsar Max, Copper SB en Commander 2.

---

### 3.44 Webasto Next Charger

- **Template-ID**: `webasto_charger`
- **Fabrikant / Merk**: Webasto
- **Ondersteunde Hardwaremodellen**: Webasto Next, Webasto Live, Webasto Unite (Modbus TCP Direct)
- **Communicatie-interface**: Modbus TCP via LAN of Wi-Fi (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W, reg 5000), Geleverde sessie-energie (kWh, reg 5002).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische laadstroomregeling (Ampère, reg 5004, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Directe Modbus-sturing: knijpt de Webasto-wallbox binnen milliseconden terug om hoofdzekeringen te beschermen en capaciteitspieken te vermijden terwijl zakelijke verrekening actief blijft.

---

### 3.45 Zaptec Pro/Go

- **Template-ID**: `zaptec_charger`
- **Fabrikant / Merk**: Zaptec
- **Ondersteunde Hardwaremodellen**: Zaptec Go, Zaptec Pro (Zaptec Cloud REST API)
- **Communicatie-interface**: Cloud REST API (Zaptec OAuth2-authenticatie)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen (W), Cumulatieve energie (kWh), Sessiestatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Zaptec OAuth2 `/api/chargers/{id}/update` (`maxChargeCurrent` 0,1 A, `maxChargePhases` 1/3, Go 2 `threeToOnePhaseSwitchCurrent`), plus `/sendCommand/506` (Pauzeren) & `507` (Hervatten).

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde precisiesturing voor Zaptec Go, Go 2 en Pro-installaties met OCMF-energiedecodering, pauzeren/hervatten en 1F/3F-zonneschakeling.

---

### 3.46 go-e Charger Gemini / HOMEfix / PRO

- **Template-ID**: `goe_charger`
- **Fabrikant / Merk**: go-e
- **Ondersteunde Hardwaremodellen**: go-e Charger Gemini, Gemini flex, HOMEfix, HOME+ (Local HTTP API v2)
- **Communicatie-interface**: Lokale HTTP REST-API v2 (Standaardpoort: 80, JSON endpoints: /api/status, /api/set)

#### Uitgelezen Telemetrie door GEMS
Laadvermogen (W), Sessie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Autorisatiestatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Vluchtige RAM-laadstroomregeling (Ampère, 6A tot 32A via `/api/set?amx=X` + `frc` pauze/hervatten — geen NVS-flashslijtage), faseomschakeling (1F / 3F via `/api/set?psm=X`).

#### Wat GEMS Concreet met dit Toestel Doet
Supersnelle lokale HTTP-API: laat GEMS dynamisch schakelen tussen 1-fase (vanaf 1,4 kW zon) en 3-fasen (tot 22 kW) en regelt binnen milliseconden terug bij huishoudelijke pieken.

---

### 3.47 Generieke Lokale REST EVSE-gateway

- **Template-ID**: `generic_rest_evse`
- **Fabrikant / Merk**: Generiek REST
- **Ondersteunde Hardwaremodellen**: Open Lokale REST EVSE-controllers en Lastgateways
- **Communicatie-interface**: Lokale HTTP REST-API (Standaardpoort: 80, REST endpoint: /api/v1)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Cumulatieve sessie-energie (kWh), Status laadstation.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische laadstroomregeling (Ampère, 6A tot 32A).

#### Wat GEMS Concreet met dit Toestel Doet
Gedistribueerde aansturing van meerdere laadpalen en dynamisch lastbeheer om het gezamenlijke vlootvermogen binnen de lokale netaansluiting te houden.

---

### 3.48 Kempower Snellaadinfrastructuur

- **Template-ID**: `kempower_charger`
- **Fabrikant / Merk**: Kempower
- **Ondersteunde Hardwaremodellen**: Kempower C-Series en S-Series Snellaadsatellieten & Vermogenseenheden
- **Communicatie-interface**: Modbus TCP via Kempower Central Controller (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Sessie-energie (kWh), 3-fasen laadstromen (L1, L2, L3 in Ampère).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Lokale OCPP 1.6-J `SetChargingProfile` vermogens-/stroomregeling met automatische terugval op Modbus TCP-register `200` (`0,1 A`).

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerd commercieel snellaad- en vlootlastbeheer voor Kempower Satellite- en Station-snelladers.

---

### 3.49 MyEnergi Zappi EV-laadpaal

- **Template-ID**: `myenergi_zappi`
- **Fabrikant / Merk**: MyEnergi
- **Ondersteunde Hardwaremodellen**: MyEnergi Zappi v2 en v2.1 met Hub / built-in Wi-Fi
- **Communicatie-interface**: Lokale HTTP REST- / CGI-API (Standaardpoort: 80, Endpoint: /cgi-jstatus)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Toegevoegde sessie-energie (kWh), Laadstatus, modus (Fast, Eco, Eco+).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Geauthenticeerde HTTP Digest CGI-commando's (`/cgi-zappi-mode-Z{sno}-{mode}-...`) met ASN-redirectvolging voor dynamisch schakelen tussen Stop-, Eco+-, Eco- en Fast-modi.

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde lokale/hub-aansturing voor myenergi Zappi v2/v2.1-wallboxen met volledige driefasige telemetrie, fasemodusrapportage en actieve sessieregeling.

---

### 3.50 SolaX Slimme EV-laadpaal

- **Template-ID**: `solax_evcharger`
- **Fabrikant / Merk**: SolaX
- **Ondersteunde Hardwaremodellen**: SolaX Slimme EV-laadpaal X1-EVC / X3-EVC (7.2kW – 22kW)
- **Communicatie-interface**: Modbus TCP via Wi-Fi/Ethernet (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Cumulatieve sessie-energie (kWh), Fasestromen (L1, L2, L3 in Ampère).

#### Stuurbare Setpoints & Geschreven Data door GEMS
SolaX X1/X3-EVC max. laadstroom (`0x0628` in stappen van `0,01 A`), externe modus (`0x060D=1`), Stop/Start (`0x0627`) en 1-fase / 3-fasen omschakeling (`0xA105`).

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde lokale Modbus TCP/RTU closed-loop sturing voor SolaX Smart EV Chargers met zonnevolging op 10 mA nauwkeurig en 1F/3F-contactorschakeling.

---

### 3.51 Teltonika TeltoCharge

- **Template-ID**: `teltonika_teltocharge`
- **Fabrikant / Merk**: Teltonika Energy
- **Ondersteunde Hardwaremodellen**: Teltonika TeltoCharge EVC1 Series (7.4kW – 22kW)
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (Poort: 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Cumulatieve sessie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), Spanningen (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische laadstroomregeling (Ampère, 6A tot 32A via SetChargingProfile).

#### Wat GEMS Concreet met dit Toestel Doet
Ingebouwde OCPP-integratie voor Europese residentiële installaties; optimaliseert laadsessies op basis van Vlaamse capaciteitspieken en EPEX-spotprijzen.

---

### 3.52 Volt Time Source EV-laadpaal

- **Template-ID**: `volttime_source`
- **Fabrikant / Merk**: Volt Time
- **Ondersteunde Hardwaremodellen**: Volt Time Source en Source Pro Slimme Laadstations
- **Communicatie-interface**: Modbus TCP / OCPP 1.6-J (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Cumulatieve sessie-energie (kWh), Fasestromen (L1, L2, L3 in Ampère).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Volt Time / Plugchoice API v3 dynamische stroomlimiet & pauze/hervatten met lokale Modbus TCP-register `1020` terugval.

#### Wat GEMS Concreet met dit Toestel Doet
Geverifieerde actieve load balancing en zonne-overschotsturing voor Volt Time Source en Plugchoice EV-wallboxen.

---

### 3.53 Wallbox Pulsar Plus / Commander (OCPP)

- **Template-ID**: `wallbox_ocpp`
- **Fabrikant / Merk**: Wallbox
- **Ondersteunde Hardwaremodellen**: Wallbox Pulsar Plus, Pulsar Max, Commander 2 / 2s
- **Communicatie-interface**: Ingebouwde OCPP 1.6-J WebSocket-server (Poort: 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Cumulatieve sessie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), Spanningen (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische laadstroomregeling (Ampère, 6A tot 32A via SetChargingProfile).

#### Wat GEMS Concreet met dit Toestel Doet
Directe cloudvrije lokale OCPP-integratie voor Wallbox-laadpalen; elimineert cloudafhankelijkheid en vertraging voor directe energie-automatisering.

---

### 3.54 cFos Power Brain Wallbox / Solar

- **Template-ID**: `cfos_powerbrain`
- **Fabrikant / Merk**: cFos
- **Ondersteunde Hardwaremodellen**: cFos Power Brain Wallbox 11kW / 22kW, cFos Power Brain Solar (1P/3P Relay)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 4701, EVSE Unit-ID: 1, Holding-registers `8058`–`8094`)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Cumulatieve afgenomen energie (kWh), 3-fasen laadstromen (0.1 A), Status actief faserelais.

#### Stuurbare Setpoints & Geschreven Data door GEMS
0,1 A laadstroomlimiet (`8093`), laadvrijgave (`8094`) en 1-fase / 3-fasen contactorschakeling (`8087`).

#### Wat GEMS Concreet met dit Toestel Doet
Nauwkeurige 0,1 A zonne-overschotvolging, hoofdzekeringbeveiliging en geautomatiseerde 1F/3F-contactorschakeling.

---

### 3.55 FoxESS EV-laadpaal A7300 / A011K / A022K

- **Template-ID**: `foxess_evcharger`
- **Fabrikant / Merk**: FoxESS
- **Ondersteunde Hardwaremodellen**: FoxESS A7300 (7.3 kW), A011K (11 kW), en A022K (22 kW) Slimme AC-wallboxen
- **Communicatie-interface**: Modbus TCP / RTU (Standaardpoort: 502, Unit-ID: 1, Holding `0x1003`–`0x1017` & `0x3002`)

#### Uitgelezen Telemetrie door GEMS
Laadvermogen (W), Cumulatieve energie (kWh), 3-fasenstromen (A), 3-Fasespanningen (V), Laderstatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
0,1 kW getrapte vermogenslimiet (`0x3002`: `1,4–4,1 kW` 1-fasebereik, `4,2–22,0 kW` 3-fasenbereik, `0` Pauze) & automatische faseomschakeling (`0x300A`).

#### Wat GEMS Concreet met dit Toestel Doet
Naadloze ecosysteempartner voor FoxESS hybride omvormers met fijnmazige zonne-overschotmodulatie en automatische 1F/3F-omschakeling.

---

### 3.56 Heidelberg Energy Control / Amperfied connect.solar

- **Template-ID**: `heidelberg_ampere`
- **Fabrikant / Merk**: Amperfied (Heidelberg)
- **Ondersteunde Hardwaremodellen**: Heidelberg Energy Control, Amperfied Wallbox connect.home, connect.solar, connect.business
- **Communicatie-interface**: Modbus TCP (Poort: 502, Unit-ID: 255) & Modbus RTU RS485 (19200 8E1, Unit-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Totale energie (kWh), 3-fasenstromen (0.1 A), 3-Fasespanningen (V), IEC-voertuigstatus, aantal actieve fasen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
0,1 A laadstroomlimiet (Holding `261`), stand-by-/vergrendelingsbeheer (`258`–`259`) en 1-fase / 3-fasen omschakeling (`501` op `connect.solar`).

#### Wat GEMS Concreet met dit Toestel Doet
Sub-seconde 0,1 A stroommodulatie voor Vlaamse capaciteitspiekbewaking en naadloos 1F/3F-zonneladen.

---

### 3.57 openWB Pro / openWB series2 (HTTP & Modbus)

- **Template-ID**: `openwb_pro`
- **Fabrikant / Merk**: openWB
- **Ondersteunde Hardwaremodellen**: openWB Pro, openWB series2 standard+, custom, duo (2.0 Modbus TCP & Pro HTTP)
- **Communicatie-interface**: Lokale HTTP JSON-/Form-API (`/connect.php`) en openWB 2.0 Modbus TCP (Poort: 1502, Unit-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Afgenomen energie (kWh), 3-fasenstromen (A), 3-Fasespanningen (V), Stekker- & laadstatus, actieve fasen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
0,1 A / 0,01 A dynamische stroomlimiet (`ampere` / Holding `10171`) en geautomatiseerde 1-fase / 3-fasen contactorschakeling (`phasetarget` / `10180`).

#### Wat GEMS Concreet met dit Toestel Doet
Ultrafijne 10–100 mA zonne-overschotvolging en hardwarematige 1F/3F-faseomschakeling zonder enige cloudafhankelijkheid.

---

### 3.58 Sungrow AC011E-01 / AC22E-01 EV-laadpaal

- **Template-ID**: `sungrow_evcharger`
- **Fabrikant / Merk**: Sungrow
- **Ondersteunde Hardwaremodellen**: Sungrow AC011E-01 (11 kW) en AC22E-01 (22 kW) 3-Fasen Slimme Wallboxen
- **Communicatie-interface**: Modbus TCP / RTU (Standaardpoort: 502, Standaard Unit-ID: 248, Input `21269`–`21316` & Holding `21202`–`21211`)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Cumulatieve energie (kWh), 3-fasenstromen (0.1 A), 3-fasenspanningen (0.1 V), Status faseomschakeling.

#### Stuurbare Setpoints & Geschreven Data door GEMS
0,1 A uitgangsstroomlimiet (`21202`), Start/Stop-sturing (`21211`) en 1-fase / 3-fasen omschakeling (`21203`).

#### Wat GEMS Concreet met dit Toestel Doet
Directe lokale Modbus-partner voor Sungrow SH/SG-installaties met 0,1 A overschotregeling en 1F/3F-omschakeling.

---

### 3.59 Tinkerforge WARP Charger 2 / 3 (Smart & Pro)

- **Template-ID**: `warp_charger`
- **Fabrikant / Merk**: Tinkerforge
- **Ondersteunde Hardwaremodellen**: Tinkerforge WARP Charger 2 Smart/Pro & WARP Charger 3 Smart/Pro (11 kW / 22 kW)
- **Communicatie-interface**: Lokale HTTP REST-API (`/evse/state`, `/meter/values`, `/evse/external_current`, `/power_manager/external_control`)

#### Uitgelezen Telemetrie door GEMS
Actief laadvermogen (W), Absolute energieteller (kWh), 3-fasenstromen (A), 3-Fasespanningen (V), IEC 61851-status, 1F/3F-contactorstatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Externe stroomlimiet met 1 mA resolutie (`6000–32000 mA`, `0` Pauze) en WARP3 1-fase / 3-fasen contactorschakeling (`phases_wanted`).

#### Wat GEMS Concreet met dit Toestel Doet
Industriële open-interface wallboxintegratie met 1 mA nauwkeurige zonnevolging en geautomatiseerde 1F/3F-contactorsturing.

---

### 3.60 Vestel EVC04 Home Smart / Mobility

- **Template-ID**: `vestel_evc04`
- **Fabrikant / Merk**: Vestel
- **Ondersteunde Hardwaremodellen**: Vestel EVC04-AC11 / EVC04-AC22 Home Smart, Mobility, en Compatibele OEM-wallboxen
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Standaard Unit-ID: 255, Lifebit Watchdog `6000=1`)

#### Uitgelezen Telemetrie door GEMS
Totaal actief vermogen (W), Cumulatieve energie (kWh), 3-fasenstromen (mA), 3-Fasespanningen (V), Laadpunt- & kabelstatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische laadstroomlimiet (`5004`, `0` of `6–32 A`), fail-safe watchdog (`6000`) en 1-fase / 3-fasen omschakeling (`405`).

#### Wat GEMS Concreet met dit Toestel Doet
Betrouwbare lokale Modbus TCP load balancing, hoofdzekeringbeveiliging en 1F/3F-zonneschakeling voor Vestel EVC04-laadpalen.

---

### 3.61 Hardy Barth cPµ1 / cPµ2 (Salia / eCB1) Wallbox

- **Template-ID**: `hardy_barth_charger`
- **Fabrikant / Merk**: Hardy Barth
- **Ondersteunde Hardwaremodellen**: Hardy Barth cPµ1 (eCB1), cPµ2 (Salia PLCC), Wallbox cPH1 / cPH2 / cPP2 Series
- **Communicatie-interface**: Lokale HTTP REST-API (Standaardpoort: 80, `/api/v1/chargecontrols/1` & `/api/secc`)

#### Uitgelezen Telemetrie door GEMS
Realtime laadvermogen (W), Cumulatieve sessie-energie (kWh), 3-fasen laadstromen (`L1, L2, L3` in Ampère) & Voltages (`L1, L2, L3` in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dynamische lokale REST-stroomlimiet (`PUT /api/v1/chargecontrols/1/mode` met `manualmodeamp=6..32 A` of `mode=stop`; Salia `PUT /api/secc` `grid_current_limit` terugval).

#### Wat GEMS Concreet met dit Toestel Doet
100% lokale cloudvrije stroommodulatie voor Hardy Barth Salia en eCB1-wallboxen: stemt de EV-laadsnelheid af op het zonne-overschot en regelt terug bij zekering- of capaciteitspieken.

---

### 3.62 Aangepaste Modbus EV-laadpaal (UI Registerprofiel)

- **Template-ID**: `custom_modbus_charger`
- **Fabrikant / Merk**: Custom Modbus
- **Ondersteunde Hardwaremodellen**: Elke Modbus TCP- of RS-485 RTU AC EV-wallbox of laadcontroller geconfigureerd via de gecertificeerde UI Registerprofielbouwer
- **Communicatie-interface**: Modbus TCP / RTU (Configureerbare poort of `/dev/serial/by-id/*` bus, Unit-ID, `FC03`/`FC04` uitlezing & optionele `FC06`/`FC16` setpoints)

#### Uitgelezen Telemetrie door GEMS
Via UI gekoppeld laadvermogen (W), Cumulatieve sessie-energie (kWh), Stekker-/sessiestatus en 3-fasenstromen & -spanningen (`int16`/`uint16`/`int32`/`uint32`/`float32` + SunSpec SF).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Optionele via UI gekoppelde dynamische laadstroomlimiet (`ev_max_current_a`, begrensd op zekeringlimieten), periodieke watchdog heartbeat en veilige terugvalstroom bij afsluiten.

#### Wat GEMS Concreet met dit Toestel Doet
Koppelt niet-standaard Modbus EV-laadpalen aan GEMS sub-seconde dynamic load balancing, zonneladen, vertrekdoelplanning (`+kWh tegen UU:MM`) en hoofdzekeringbeveiliging.

---

## 4. Slimme Netmeters & Energie-analyzers (40 Toestellen)

Slimme netmeters vormen het fundament van de volledige GEMS-regelcyclus in gesloten lus. Ze meten het netto afname-/injectievermogen op het netaansluitpunt, de individuele fasestromen (L1, L2, L3 in Ampère), lijnspanningen (L1, L2, L3 in Volt), energietellers (kWh), gekoppeld gasverbruik (m³) en de officiële Vlaamse kwartierpiek (W). Sub-seconde meting maakt onmiddellijke afschakeling bij overbelasting, zero-export handhaving en hoofdzekeringbeveiliging mogelijk.

### 4.1 ABB A43 / A44 / B23 / B24 Meter

- **Template-ID**: `abb_meter`
- **Fabrikant / Merk**: ABB
- **Ondersteunde Hardwaremodellen**: ABB A43, A44 (3-Fasen Direct/CT), B23, B24 (3-Fasen Compact) Modbus Meters
- **Communicatie-interface**: Modbus RTU via RS485-naar-Ethernet-gateway of Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief netafname-/injectievermogen (W), Totale actieve afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Frequentie (Hz).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Uiterst nauwkeurige netaansluitingsmeting; levert continue driefasige stromen aan de GEMS fase-loadbalancer om het uitvallen van hoofdzekeringen te voorkomen en stuurt de Vlaamse kwartierpiekberekening aan.

---

### 4.2 Acrel ADW300 Meter

- **Template-ID**: `acrel_adw300`
- **Fabrikant / Merk**: Acrel
- **Ondersteunde Hardwaremodellen**: Acrel ADW300 Series Wireless / Ethernet 3-Fasen Multifunctionele Energiemeter
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Totaal actief vermogen (W), Afname-/injectie-energie (kWh), Actief vermogen per fase (W), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Bewaakt de hoofdaansluiting of onderverdeelborden; informeert GEMS over exacte fasebelastingen om laadsnelheden te moduleren en zekeringen te beschermen.

---

### 4.3 B+GE-TECH WS100 / DS100 Meter

- **Template-ID**: `bgetech_ws100`
- **Fabrikant / Merk**: B+GE-TECH
- **Ondersteunde Hardwaremodellen**: B+GE-TECH WS100, DS100 Series 3-Fasen DIN-Rail Modbus Slimme Meters
- **Communicatie-interface**: Modbus TCP / RTU Gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime afname-/injectievermogen (W), Totale actieve energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Directe netgrensmeting; levert realtime vermogen voor closed-loop EV-laden op zonne-overschot en Vlaamse piekbewaking.

---

### 4.4 Carlo Gavazzi EM112 / EM340 / EM540

- **Template-ID**: `carlogavazzi_em340`
- **Fabrikant / Merk**: Carlo Gavazzi
- **Ondersteunde Hardwaremodellen**: Carlo Gavazzi EM112 (1-Fase), EM340 (3-Fasen Direct), EM540 (Ultra-Fast 3-Fasen) Meters
- **Communicatie-interface**: Modbus RTU via RS485 USB-/Ethernet-gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Netto actief vermogen (W), Totale afname-/injectie-kWh, 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Snelle sub-seconde netmeter (met name de EM540); essentieel voor onmiddellijke reactieve terugregeling van EV-laadpalen bij verbruikspieken om de hoofdzekeringen te beschermen.

---

### 4.5 Carlo Gavazzi EM24 (RS485/Ethernet)

- **Template-ID**: `carlogavazzi_em24`
- **Fabrikant / Merk**: Carlo Gavazzi
- **Ondersteunde Hardwaremodellen**: Carlo Gavazzi EM24 Series 3-Fasen Energiemeter (RS485 & Ethernet LAN versies)
- **Communicatie-interface**: Modbus TCP / Modbus RTU Gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Totaal actief vermogen (W, richtingsgevoelig: + afname, - injectie), Cumulatieve energieregisters (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Industriestandaard energiemeter in hoogwaardige zonne- en laadinstallaties; levert deterministische 1-seconde telemetrie voor GEMS piekbewaking en dynamic load balancing.

---

### 4.6 ESPHome DSMR / DLMS Slimme Meter

- **Template-ID**: `esphome_meter`
- **Fabrikant / Merk**: ESPHome
- **Ondersteunde Hardwaremodellen**: ESPHome Slimme Meter Gateway (P1 DSMR Reader / DLMS / SML IR Optical Heads on ESP8266/ESP32)
- **Communicatie-interface**: Lokale HTTP REST JSON-API (Standaardpoort: 80, Endpoint: /sensor/grid_power of /text_sensor/dsmr)

#### Uitgelezen Telemetrie door GEMS
Realtime netvermogen (W), Totale afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Gasverbruik (m³).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen REST-telemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Integreert open-hardware P1-lezers in GEMS en levert volledige digitale metertelegrammen via Wi-Fi zonder cloudafhankelijkheid.

---

### 4.7 Eastron SDM120 / SDM220 / SDM230 (1-Fase Meter)

- **Template-ID**: `eastron_sdm120_230`
- **Fabrikant / Merk**: Eastron
- **Ondersteunde Hardwaremodellen**: Eastron SDM120, SDM220, SDM230 Series 1-Fase DIN-Rail Modbus Slimme Meters
- **Communicatie-interface**: Modbus RTU via RS485-naar-Ethernet-bridge of USB dongle (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen (W), Totale afname-/injectie-energie (kWh), Fasestroom (Ampère), Lijnspanning (Volt), Arbeidsfactor (cos φ).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen telemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Bewaakt monofasige netaansluitingen, afzonderlijke warmtepompkringen of monofasige PV-omvormers en integreert deze in de GEMS-belastingsanalyse.

---

### 4.8 Eastron SDM630 3-Fasen Meter

- **Template-ID**: `eastron_sdm630`
- **Fabrikant / Merk**: Eastron
- **Ondersteunde Hardwaremodellen**: Eastron SDM630 Modbus V2 / V3 / MCT 3-Fasen Multifunctionele Energiemeter
- **Communicatie-interface**: Modbus RTU via RS485-gateway of Modbus TCP (Standaardpoort: 502, Slave-ID: 1, Baudrate: 9600)

#### Uitgelezen Telemetrie door GEMS
Netto totaal actief vermogen (W, reg 0x0034), Totale afname-/injectie-energie (kWh), Individuele fasestromen (L1, L2, L3 in Ampère, reg 0x0006), Individuele fasespanningen (L1, L2, L3 in Volt, reg 0x0000).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Breed toegepaste driefasige meter; levert de basistelemetrie voor Vlaams capaciteitstariefbeheer, fase-onbalansbewaking en sturing van zonne-overschotten.

---

### 4.9 Eastron SDM72D / SMART X96 3-Fasen Meter

- **Template-ID**: `eastron_sdm72_x96`
- **Fabrikant / Merk**: Eastron
- **Ondersteunde Hardwaremodellen**: Eastron SDM72D-M / SDM72D-M-2, SDM72DR, SMART X96-1 / X96-5 Multifunctionele Meters
- **Communicatie-interface**: Directe USB-naar-RS485 RTU (`/dev/serial/by-id/...`, 9600 8N1) of Modbus TCP via RS485-naar-Ethernet-bridge (Standaardpoort: 502, Slave-ID: 1 of 2)

#### Uitgelezen Telemetrie door GEMS
Totaal actief vermogen (W, bidirectioneel reg `0x0034`), Actieve afname- en injectie-energie (`0x0048` / `0x004A` kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen net- of PV-submetertelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Ondersteunt twee meetrollen via **Meetrol van Energiemeter**: (1) **Hoofdnetmeter (PCC)** voor live driefasige netbewaking en laadpaalsturing, of (2) **Zonne- / PV-productiemeter** (`pv_production`) op de AC-uitgangskring van bestaande zonne-omvormers zonder eigen Modbus- of API-communicatie — registreert live zonneproductie (W), fasestromen en cumulatieve zonne-opbrengst (kWh) met automatische polariteitsdetectie en onderdrukking van nachtelijk sluipverbruik.

---

### 4.10 Eltako DSZ15DZMOD / DSZ16 Meter

- **Template-ID**: `eltako_meter`
- **Fabrikant / Merk**: Eltako
- **Ondersteunde Hardwaremodellen**: Eltako DSZ15DZMOD-3x80A, DSZ16 Series 3-Fasen Modbus Energiemeters
- **Communicatie-interface**: Modbus RTU via RS485-gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen (W), Afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Nauwkeurige Duitse tussen- en hoofdmeting; levert realtime fasestromen en netafname/injectie voor de huishoudelijke overbelastingsbeveiliging van GEMS.

---

### 4.11 Finder 7M.24 / 7M.38 Meter

- **Template-ID**: `finder_7m`
- **Fabrikant / Merk**: Finder
- **Ondersteunde Hardwaremodellen**: Finder 7M Series (7M.24 1-Fase, 7M.38 3-Fasen Bidirectionele Modbus-meters)
- **Communicatie-interface**: Modbus RTU via RS485-bridge (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen (W), Actieve afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Betrouwbare MID-gekeurde energiemeting; voedt live elektrische meetwaarden aan GEMS voor closed-loop dynamische stroomregeling.

---

### 4.12 HomeWizard Meter

- **Template-ID**: `homewizard_meter`
- **Fabrikant / Merk**: HomeWizard
- **Ondersteunde Hardwaremodellen**: HomeWizard Wi-Fi P1 Meter (HWE-P1), HomeWizard Wi-Fi kWh Meter (1-Fase & 3-Fasen)
- **Communicatie-interface**: Lokale HTTP REST-API v1 (Standaardpoort: 80, JSON Endpoint: /api/v1/data)

#### Uitgelezen Telemetrie door GEMS
Actief netvermogen (W), Totale afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Verbruik gekoppelde gasmeter (m³).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen lokale REST-API.

#### Wat GEMS Concreet met dit Toestel Doet
Plug-and-play Wi-Fi P1-meter: stelt GEMS in staat elke 1–2 seconden digitale metertelegrammen uit te lezen zonder bekabeling, met volledige ondersteuning voor Vlaamse en Nederlandse piekopvolging.

---

### 4.13 Homey Energy Dongle (P1)

- **Template-ID**: `homey_p1`
- **Fabrikant / Merk**: Homey
- **Ondersteunde Hardwaremodellen**: Homey Energy Dongle (P1 Wi-Fi Gateway)
- **Communicatie-interface**: Lokale Netwerk UDP-broadcast / HTTP (Standaardpoort: 80)

#### Uitgelezen Telemetrie door GEMS
Actief netvermogen (W), Totale afname-/injectie-energie (kWh), 3-fasenstromen en -spanningen.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen telemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Vangt lokale netwerktelemetrie op van Homey P1-dongles en toont live huishoudelijke netstromen op het GEMS-dashboard.

---

### 4.14 Inepro PRO380-MOD / PRO1-MOD Meter

- **Template-ID**: `inepro_pro380`
- **Fabrikant / Merk**: Inepro
- **Ondersteunde Hardwaremodellen**: Inepro PRO380-MOD, PRO1-MOD Series 3-Fasen & 1-Fase DIN-Rail Modbus Meters
- **Communicatie-interface**: Modbus RTU via RS485-gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Totaal actief vermogen (W), Afname-/injectie-kWh-registers, 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Hoognauwkeurige Nederlandse DIN-rail energiemeter; levert driefasige stromen voor GEMS dynamic load balancing en hoofdzekeringbeveiliging.

---

### 4.15 Lovato DMG610 3-Fasen Meter

- **Template-ID**: `lovato_dmg610`
- **Fabrikant / Merk**: Lovato
- **Ondersteunde Hardwaremodellen**: Lovato Electric DMG610, DMG800 Series Digitale Multimeters
- **Communicatie-interface**: Modbus TCP / RTU (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Totaal actief vermogen (W), Afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Industriële netanalysemeter; levert snelle elektrische meetwaarden om hoofdleidingen te beschermen tegen transformator- of zekeringoverbelasting.

---

### 4.16 Loxone Miniserver

- **Template-ID**: `loxone_miniserver`
- **Fabrikant / Merk**: Loxone
- **Ondersteunde Hardwaremodellen**: Loxone Miniserver Gen 1 / Gen 2, Miniserver Compact (HTTP JSON API)
- **Communicatie-interface**: Lokale HTTP JSON-API (Standaardpoort: 80 / 443, Endpoints: /jdev/sfs/getstatus)

#### Uitgelezen Telemetrie door GEMS
Geaggregeerd huishoudelijk vermogen (W), tussenmetervermogens (W), Totale energietellers (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen REST-telemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Koppelt woningen met een Loxone Miniserver aan GEMS, zodat GEMS de slimme meterdata uit Loxone kan gebruiken als primaire netreferentie.

---

### 4.17 Niko Home Control (NHC II)

- **Template-ID**: `niko_nhc`
- **Fabrikant / Merk**: Niko
- **Ondersteunde Hardwaremodellen**: Niko Home Control II (Connected Controller met Energy Module / Electricity Clamps)
- **Communicatie-interface**: Lokale Hobby-API / REST (Standaardpoort: 8884 of 80, JSON Endpoint: /hobby/v1/devices)

#### Uitgelezen Telemetrie door GEMS
Realtime netafname-/injectievermogen (W), Vermogensverbruik deelkringen (W), Cumulatieve energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen lokale API.

#### Wat GEMS Concreet met dit Toestel Doet
Naadloze integratie met Belgische Niko Home Control II-installaties; leest stroomklemmetingen lokaal uit om GEMS-piekbewaking aan te sturen.

---

### 4.18 P1 Slimme Meter (Network/TCP)

- **Template-ID**: `p1_network`
- **Fabrikant / Merk**: Generiek
- **Ondersteunde Hardwaremodellen**: P1 Slimme Meter Network Bridge (TCP/Ethernet P1 Readers, Telnet Bridges, ESP-P1, Ser2Net)
- **Communicatie-interface**: Ruwe TCP-socketstroom (Standaardpoort: 23, 8088, of 8234, Ruwe DSMR-telegrammen)

#### Uitgelezen Telemetrie door GEMS
Realtime actief vermogen (+ afname / - injectie in Watt, OBIS 1.7.0 & 2.7.0), cumulatieve energie tarief 1 & 2 (kWh, OBIS 1.8.1/2 & 2.8.1/2), 3-fasenstromen (L1, L2, L3 in Ampère, OBIS 31.7.0, 51.7.0, 71.7.0), 3-fasenspanningen (L1, L2, L3 in Volt, OBIS 32.7.0, 52.7.0, 72.7.0), Vlaams kwartierpiekregister (15-minutenpiek) (W, OBIS 1.6.0), Gasverbruik (m³, OBIS 0-1:24.2.1).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen digitale telegramstroom.

#### Wat GEMS Concreet met dit Toestel Doet
Primaire netinterface voor P1-meters via LAN: decodeert officiële Fluvius- (België) en DSMR 4.x/5.x-telegrammen (Nederland) en stuurt de voorspellende Vlaamse capaciteitstarief-engine en het adaptieve piekplafond aan.

---

### 4.19 P1 Slimme Meter (USB/Serial)

- **Template-ID**: `p1_serial`
- **Fabrikant / Merk**: Generiek
- **Ondersteunde Hardwaremodellen**: P1 Slimme Meter Directe Seriële Kabel (USB-to-RJ12 FTDI / CP2102 Cable on Raspberry Pi USB)
- **Communicatie-interface**: Directe Seriële TTY (/dev/ttyUSB0 of /dev/ttyAMA0, Baudrate: 115200 voor DSMR 4/5, 9600 voor DSMR 2/3)

#### Uitgelezen Telemetrie door GEMS
Realtime actief vermogen (W, OBIS 1.7.0/2.7.0), afname-/injectie-energie tarief 1/2 (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Belgische maximale kwartierpiek (W, OBIS 1.6.0), Gasmetervolume (m³).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen digitale telegramstroom.

#### Wat GEMS Concreet met dit Toestel Doet
Directe vertragingsvrije hardwareverbinding met Belgische en Nederlandse digitale meters; levert elke seconde CRC-gevalideerde telegrammen als fundament voor sub-seconde EV load balancing en Vlaamse kwartierpiekbewaking.

---

### 4.20 SMA Energiemeter 2.0 / Data Manager M (Modbus TCP)

- **Template-ID**: `sma_energymeter`
- **Fabrikant / Merk**: SMA
- **Ondersteunde Hardwaremodellen**: SMA Energiemeter 2.0, SMA Data Manager M (Modbus TCP Speedwire)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 2 of 126)

#### Uitgelezen Telemetrie door GEMS
Actief netafname-/injectievermogen (W), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Actieve vermogensbegrenzing (stuurt SMA-omvormers aan via Data Manager).

#### Wat GEMS Concreet met dit Toestel Doet
Meet het vermogen op het netaansluitpunt en fungeert als gateway; informeert GEMS over de netto uitwisseling en stuurt actieve PV-terugregeling aan richting SMA-omvormers.

---

### 4.21 Schneider Electric Acti9 iEM3000 / PM3200 Series

- **Template-ID**: `schneider_iem3000`
- **Fabrikant / Merk**: Schneider Electric
- **Ondersteunde Hardwaremodellen**: Schneider Electric Acti9 iEM3150, iEM3155, iEM3255, PowerLogic PM3200 Series
- **Communicatie-interface**: Modbus RTU via RS485-gateway of Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Totaal actief vermogen (W), Actieve afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Commerciële en residentiële tussen- en hoofdmeting; levert deterministische fasestroomtelemetrie om verdeelborden tegen overbelasting te beveiligen.

---

### 4.22 Shelly 3EM (Gen 1 3-Fasen Meter)

- **Template-ID**: `shelly_3em`
- **Fabrikant / Merk**: Shelly
- **Ondersteunde Hardwaremodellen**: Shelly 3EM (Gen 1 3-Fasen Wi-Fi Energiemeter met 120A CT Clamps)
- **Communicatie-interface**: Lokale HTTP REST-API (Standaardpoort: 80, JSON Endpoint: /status)

#### Uitgelezen Telemetrie door GEMS
Totaal actief vermogen (W), Vermogen per fase (W), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), Cumulatieve geïnjecteerde/verbruikte energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Ingebouwde 10A-contactoruitgang (Inschakelen / Uitschakelen via /relay/0?turn=on).

#### Wat GEMS Concreet met dit Toestel Doet
Leest snelle driefasige stroomklemmetingen uit via Wi-Fi; het ingebouwde relaiscontact kan automatisch thermische verbruikers inschakelen of niet-essentiële verbruikers afschakelen tijdens capaciteitspieken.

---

### 4.23 Shelly Pro 3EM / Gen3 3EM-63T (3-Fasen Meter)

- **Template-ID**: `shelly_pro_3em`
- **Fabrikant / Merk**: Shelly
- **Ondersteunde Hardwaremodellen**: Shelly Pro 3EM, Shelly Pro 3EM-400, Shelly Gen3 3EM-63T (DIN-Rail Ethernet/Wi-Fi)
- **Communicatie-interface**: Lokale Gen 2/3 HTTP RPC (Standaardpoort: 80, JSON Endpoint: /rpc/EM.GetStatus)

#### Uitgelezen Telemetrie door GEMS
Netto actief vermogen over alle fasen (W), Actief vermogen per fase (W), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt), 4-kwadrant energietellers (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Ingebouwde hulprelaisuitgang (Inschakelen / Uitschakelen via /rpc/Switch.Set).

#### Wat GEMS Concreet met dit Toestel Doet
Uiterst betrouwbare Ethernet DIN-rail meter: levert directe fasetelemetrie aan GEMS voor sub-seconde EV-stroomregeling, terwijl de ingebouwde relaisuitgang warmtepomp-boost of warmwaterboilers aanstuurt.

---

### 4.24 Siemens SENTRON (PAC2200 / 7KT1665 Meter)

- **Template-ID**: `siemens_pac2200`
- **Fabrikant / Merk**: Siemens
- **Ondersteunde Hardwaremodellen**: Siemens SENTRON PAC2200, 7KT1665 Series 3-Fasen Modbus Slimme Meters
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Totaal actief vermogen (W), Cumulatieve afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Hoogwaardige industriële energiemeting; bewaakt de aansluitcapaciteit en stroomt telemetrie naar GEMS voor actieve lastafschakeling en besparingsberekeningen.

---

### 4.25 Socomec COUNTIS E24/E34/E44 / DIRIS A-40

- **Template-ID**: `socomec_meter`
- **Fabrikant / Merk**: Socomec
- **Ondersteunde Hardwaremodellen**: Socomec COUNTIS E24, E34, E44 Series, DIRIS A-40 Multifunctionele Energiemeters
- **Communicatie-interface**: Modbus RTU via RS485-gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Totaal actief vermogen (W), Actieve afname-/injectie-energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Nauwkeurige driefasige zakelijke en residentiële energiemeting; informeert GEMS over de faseverdeling om EV-laden in balans te houden en zekeringuitval te voorkomen.

---

### 4.26 WAGO 879 Series (879-3000 / 879-3020 / 879-3040)

- **Template-ID**: `wago_879`
- **Fabrikant / Merk**: WAGO
- **Ondersteunde Hardwaremodellen**: WAGO 879 Series (879-3000, 879-3020, 879-3040 3-Fasen DIN-Rail Energiemeters)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen (W), Totale actieve energie (kWh), 3-fasenstromen (L1, L2, L3 in Ampère), 3-fasenspanningen (L1, L2, L3 in Volt).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Precisie DIN-rail energiemeter; stroomt driefasige stromen en spanningen naar GEMS voor realtime zekeringbeveiliging, berekening van zonne-overschot en energiestroomvisualisatie.

---

### 4.27 Accuenergy AcuRev / Acuvim Series Meter

- **Template-ID**: `accuenergy_meter`
- **Fabrikant / Merk**: Accuenergy
- **Ondersteunde Hardwaremodellen**: Accuenergy Acuvim II, AcuRev 1310, AcuRev 2100 Meerkanaals Tussenmeter
- **Communicatie-interface**: Modbus TCP / RTU via RS485-gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime netto actief netvermogen (W), Totale energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Uiterst nauwkeurige driefasige netgrensbewaking en fase-loadbalancing voor commerciële en residentiële installaties.

---

### 4.28 Algodue UPM209 / UPM309 Series Meter

- **Template-ID**: `algodue_meter`
- **Fabrikant / Merk**: Algodue
- **Ondersteunde Hardwaremodellen**: Algodue UPM209, UPM309 3-Fasen Netwerkanalyzers
- **Communicatie-interface**: Modbus RTU / TCP via RS485-gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime netto actief netvermogen (W), Totale energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Continue meting van netuitwisseling, arbeidsfactorbewaking en overbelastingsbeveiliging van de hoofdzekering.

---

### 4.29 Chint DTSU666 / DTSU666-H 3-Fasen Meter

- **Template-ID**: `chint_dtsu666`
- **Fabrikant / Merk**: Chint
- **Ondersteunde Hardwaremodellen**: Chint DTSU666, DTSU666-H 3-Fasen Direct & CT Slimme Meters
- **Communicatie-interface**: Modbus RTU via RS485 / Modbus TCP Gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime netto actief netvermogen (W), Totale afname- & injectie-energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Standaard driefasige bidirectionele netmeterintegratie; stuurt de berekening van zonne-overschotten en de stroommodulatie van EV-laadpalen aan.

---

### 4.30 Hager ECM / ECR / ECP Energiemeter

- **Template-ID**: `hager_meter`
- **Fabrikant / Merk**: Hager
- **Ondersteunde Hardwaremodellen**: Hager ECM, ECR, ECP, en SM103E 1-Fase en 3-Fasen Energiemeters
- **Communicatie-interface**: Modbus RTU / TCP via Agardio / IP Gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime netto netvermogen (W), Totale afname-energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
DIN-rail bewaking in het residentiële verdeelbord die sub-seconde fasetelemetrie aanlevert aan de overbelastingsbeveiliging van GEMS.

---

### 4.31 Janitza UMG Series Netanalyzer

- **Template-ID**: `janitza_umg`
- **Fabrikant / Merk**: Janitza
- **Ondersteunde Hardwaremodellen**: Janitza UMG 96RM, UMG 604, UMG 509 Spanningskwaliteitsanalyzers
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime netto netvermogen (W), Totale afname-energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Lijnspanningen (V), Frequentie (Hz).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Hoognauwkeurige industriële netanalyse-integratie die hoogfrequente netstromen en fase-onbalans registreert.

---

### 4.32 Kamstrup Energiemeter (Modbus Gateway)

- **Template-ID**: `kamstrup_meter`
- **Fabrikant / Merk**: Kamstrup
- **Ondersteunde Hardwaremodellen**: Kamstrup OMNIPOWER en MULTICAL Elektriciteits- & Warmtemeters
- **Communicatie-interface**: Modbus RTU / TCP via M-Bus / Modbus Gateway (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime netto netvermogen (W), Totale afname-energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Integreert elektriciteits- en thermische stadsverwarmingsmeters in het centrale energieoverzicht van GEMS.

---

### 4.33 Landis+Gyr Industriële Nutsmeter

- **Template-ID**: `landisgyr_meter`
- **Fabrikant / Merk**: Landis+Gyr
- **Ondersteunde Hardwaremodellen**: Landis+Gyr E550, E650, E850 Industriële & Commerciële Meters
- **Communicatie-interface**: Modbus RTU / TCP via Communication Unit (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime netto netvermogen (W), Totale afname- & injectie-energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Bewaakt grote commerciële en industriële aansluitpunten om naleving van dynamische piekbewakingslimieten te garanderen.

---

### 4.34 Phoenix Contact EMpro Energiemeter

- **Template-ID**: `phoenix_empro`
- **Fabrikant / Merk**: Phoenix Contact
- **Ondersteunde Hardwaremodellen**: Phoenix Contact EMpro EEM-MA370, EEM-MB370 Series
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime netto netvermogen (W), Totale afname-energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Stroomt realtime driefasige netgrensmetingen naar GEMS voor directe zonne-overschotsturing.

---

### 4.35 Weidmüller Energiemeter (500 / 600 / 700)

- **Template-ID**: `weidmuller_meter`
- **Fabrikant / Merk**: Weidmüller
- **Ondersteunde Hardwaremodellen**: Weidmüller Energiemeter 525, 610, 700 Series
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Realtime netto netvermogen (W), Totale afname-energie (kWh), Fasestromen (L1, L2, L3 in Ampère), Spanningen (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Industriële vermogensbewaking voor bedrijfsgebouwen en onderverdeelborden met meerdere verbruikersgroepen.

---

### 4.36 YouLess LS120 Puls- & P1-meter

- **Template-ID**: `youless_ls120`
- **Fabrikant / Merk**: YouLess
- **Ondersteunde Hardwaremodellen**: YouLess LS120 Optische Puls- & P1-dongle
- **Communicatie-interface**: Lokale HTTP REST-API (Standaardpoort: 80, Endpoint: /a?f=j)

#### Uitgelezen Telemetrie door GEMS
Realtime netto netvermogen (W), Totale afname-energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Alleen-lezen nettelemetrie.

#### Wat GEMS Concreet met dit Toestel Doet
Verbindt via het lokale netwerk met P1-poorten van digitale meters of optische draaischijfmeters zonder enig cloudabonnement.

---

### 4.37 Fronius Slimme Meter IP / Solar API v1

- **Template-ID**: `fronius_smartmeter_ip`
- **Fabrikant / Merk**: Fronius
- **Ondersteunde Hardwaremodellen**: Fronius Slimme Meter IP, TS 65A-3, TS 5kA-3, TS 100A-1 (Direct IP of via Fronius-omvormer)
- **Communicatie-interface**: Lokale HTTP Fronius Solar API v1 (`GET /solar_api/v1/GetMeterRealtimeData.cgi?Scope=Device&DeviceId=0`)

#### Uitgelezen Telemetrie door GEMS
Richtingsgevoelig netto netvermogen (W), Totale afgenomen & geïnjecteerde energie (kWh), Richtingsgevoelige fasestromen (L1, L2, L3 in Ampère), Fasespanningen (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Enkel uitlezing

#### Wat GEMS Concreet met dit Toestel Doet
Bekabelingsvrije lokale HTTP-netgrensmeting voor Fronius-ecosystemen die richtingsgevoelige fasestromen aanlevert voor hoofdzekeringbeveiliging en piekbewaking.

---

### 4.38 Huawei EMMA-A02 / DTSU666-H Slimme Vermogenssensor

- **Template-ID**: `huawei_emma`
- **Fabrikant / Merk**: Huawei
- **Ondersteunde Hardwaremodellen**: Huawei EMMA-A02 Energy Management Assistant, Huawei Slimme Vermogenssensor DTSU666-H / DDSU666-H
- **Communicatie-interface**: Modbus TCP / RTU (Poort: 502, Holding `31633`–`31666` op EMMA-A02 & `2102`–`2175` Float32 op DTSU666-H)

#### Uitgelezen Telemetrie door GEMS
Richtingsgevoelig vermogen op netaansluitpunt (W), Totale afname- & injectie-energie (kWh), Richtingsgevoelige 3-fasenstromen (A), 3-Fasespanningen (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Enkel uitlezing

#### Wat GEMS Concreet met dit Toestel Doet
Supersnelle netgrenstelemetrie voor Huawei SUN2000 & LUNA2000-installaties met EMMA-A02 of losse RS485-vermogenssensoren.

---

### 4.39 KOSTAL Slimme Energiemeter (KSEM G1 / G2)

- **Template-ID**: `kostal_ksem`
- **Fabrikant / Merk**: KOSTAL
- **Ondersteunde Hardwaremodellen**: KOSTAL Slimme Energiemeter G1 & G2 (DIN-Rail Ethernet / RS485 Netmeter)
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Standaard Unit-ID: 71, Holding-registers `0`–`143` & `512`–`519`)

#### Uitgelezen Telemetrie door GEMS
Actief afname- & injectievermogen (0.1 W), Totale afname- & injectie-energie (0.1 Wh -> kWh), Richtingsgevoelige fasestromen (A) & spanningen (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Enkel uitlezing

#### Wat GEMS Concreet met dit Toestel Doet
Sub-seconde Ethernet DIN-rail netgrensmeting met richtingsgevoelige fasestromen voor DLB en capaciteitspiekbewaking.

---

### 4.40 Tasmota SML / OBIS Optische IR-lezer & EcoTracker

- **Template-ID**: `tasmota_sml`
- **Fabrikant / Merk**: Tasmota
- **Ondersteunde Hardwaremodellen**: Tasmota SML / OBIS / DLMS Optische IR-leeskoppen (Hichi, BitShake) & everHome EcoTracker
- **Communicatie-interface**: Lokale HTTP JSON-API (`/cm?cmnd=Status%208` StatusSNS & EcoTracker `/v1/json`)

#### Uitgelezen Telemetrie door GEMS
Realtime netto netvermogen (W), Totale afname- & injectietellers (kWh), Fasestromen (A) & Spanningen (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Enkel uitlezing

#### Wat GEMS Concreet met dit Toestel Doet
Cloudvrije optische IR-uitlezing voor moderne Europese digitale nutsmeters zonder fysieke RJ12 P1-poort.

---

### 4.41 Aangepaste Modbus Slimme Meter (UI Registerprofiel)

- **Template-ID**: `custom_modbus_meter`
- **Fabrikant / Merk**: Custom Modbus
- **Ondersteunde Hardwaremodellen**: Elke Modbus TCP- of RS-485 RTU DIN-rail netmeter of PV-productietussenmeter geconfigureerd via de gecertificeerde UI Registerprofielbouwer
- **Communicatie-interface**: Modbus TCP / RTU (Configureerbare poort of `/dev/serial/by-id/*` bus, Unit-ID, `FC03`/`FC04` Input- & Holding-registers)

#### Uitgelezen Telemetrie door GEMS
Via UI gekoppeld netto net- of PV-vermogen (W), Afname- & injectietellers (kWh), Fasestromen (`L1, L2, L3` in A) & Spanningen (`L1, L2, L3` in V) over alle bytevolgordes (`ABCD`, `CDAB`, `BADC`, `DCBA`).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Autonoom / Enkel uitlezing

#### Wat GEMS Concreet met dit Toestel Doet
Biedt geverifieerde aangepaste registerkoppeling met live één-klik registertest voor industriële en regionale Modbus-energiemeters (zowel als hoofdnetmeter als PV-productiemeter).

---

## 5. Slimme Relais & Thermische Actuatoren (12 Toestellen)

Slimme relais, PV-diverters en contactoren sturen grote thermische verbruikers aan — zoals warmtepompen (via potentiaalvrije SG-Ready contacten of directe Modbus TCP), elektrische SWW-boilers, zwembadpompen en verwarmingsweerstanden. GEMS schakelt deze verbruikers dynamisch in bij PV-overschot of negatieve EPEX-prijzen, met strikte in- en uitschakelhysterese om pendelen van compressoren te voorkomen.

### 5.1 Generiek HTTP-relais

- **Template-ID**: `generic_relay`
- **Fabrikant / Merk**: Generiek
- **Ondersteunde Hardwaremodellen**: Generiek HTTP REST-relais (ESP8266, ESP32, Tasmota, Shelly Gen1, Custom Microcontrollers)
- **Communicatie-interface**: Lokale HTTP REST (Standaardpoort: 80 / 8080, Configureerbare URL-endpoints voor status en schakelen)

#### Uitgelezen Telemetrie door GEMS
Actief vermogensverbruik van aangesloten toestel (W, optioneel indien bemeterd).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Relais-/contactoruitgangsstatus (Inschakelen / Uitschakelen).

#### Wat GEMS Concreet met dit Toestel Doet
Geautomatiseerde contactorsturing: schakelt elektrische warmwaterboilers, zwembadpompen of weerstandsverwarming in zodra de zonne-injectie instelbare drempels overschrijdt (bijv. > 1500W gedurende 2 minuten), met strikte minimale in- en uitschakelhysterese.

---

### 5.2 Shelly Plus 1PM / Pro 1PM / Plug S (Relais & Vermogensmeting)

- **Template-ID**: `shelly_plus_1pm`
- **Fabrikant / Merk**: Shelly
- **Ondersteunde Hardwaremodellen**: Shelly Plus 1PM, Shelly Pro 1PM, Shelly Plug S, Shelly Pro 2PM (Gen 2 / Gen 3 Mongoose OS)
- **Communicatie-interface**: Lokale Gen 2/3 HTTP RPC (Standaardpoort: 80, Endpoints: /rpc/Switch.Set, /rpc/Switch.GetStatus)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen aangesloten toestel (W), Cumulatief energieverbruik (kWh), Interne toesteltemperatuur (°C), Voedingsspanning (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Relais-/contactoruitgangsstatus (Inschakelen / Uitschakelen via /rpc/Switch.Set).

#### Wat GEMS Concreet met dit Toestel Doet
SG-Ready Warmtepomp Boost & Toestelautomatisering: activeert SG-Ready Bedrijfsstatus 3 (thermische boostmodus) van warmtepompen of warmwaterboilers tijdens zonne-overschot of negatieve spotprijzen en registreert het actuele verbruik in het GEMS-logboek.

---

### 5.3 Modbus Digitale I/O-relaismodule

- **Template-ID**: `modbus_relay`
- **Fabrikant / Merk**: Modbus Relais / I/O
- **Ondersteunde Hardwaremodellen**: Waveshare Modbus RTU/TCP Relay, ADAM-4000/6000, Moxa ioLogik, Kincony Modbus Relay
- **Communicatie-interface**: Modbus TCP / RTU via RS485 (Standaardpoort: 502, Slave-ID: 1)

#### Uitgelezen Telemetrie door GEMS
Digitale in- / uitgangsstatus van coils (Open / Gesloten).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Relais-coil aansturing (Coil 1–8 In- / Uitschakelen).

#### Wat GEMS Concreet met dit Toestel Doet
Industriële contactorschakeling voor zware verbruikers, driefasige verwarmingsbatterijen en lastafschakeling bij piekbelasting.

---

### 5.4 SG-Ready Warmtepomp (Daikin/Nibe/Bosch/Vaillant/Panasonic)

- **Template-ID**: `sgready_heatpump`
- **Fabrikant / Merk**: SG-Ready (Daikin, Nibe, Bosch/Nefit, Vaillant, Panasonic, Mitsubishi, Stiebel Eltron, Wolf)
- **Ondersteunde Hardwaremodellen**: Standaard 4-standen SG-Ready warmtepompen via twee gekoppelde RelayController-kanalen (`sgready_relay1_id` + `sgready_relay2_id`, bijv. Shelly- of Modbus-relais) of lokale HTTP REST-gateway
- **Communicatie-interface**: Dubbel-relais 4-standen koppeling (`[1,0]`, `[0,0]`, `[0,1]`, `[1,1]`) of lokale HTTP REST (`/api/sgready`)

#### Uitgelezen Telemetrie door GEMS
4-standen SG-Ready bedrijfsstatus (Stand 1 `[1,0]`: Netblokkering / Stand 2 `[0,0]`: Normaal / Stand 3 `[0,1]`: Zonne- & daltariefaanbeveling / Stand 4 `[1,1]`: Geforceerde thermische boost), gecombineerd elektrisch verbruik (W).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Volledige 4-standen SG-Ready aansturing (`Stand 1` piekafschakeling met max. 2 uur limiet, `Stand 2` Normaal, `Stand 3` zonne-/pre-piek comfortboost, `Stand 4` negatieve-prijs geforceerde boost) met 600s compressor anti-pendelbeveiliging.

#### Wat GEMS Concreet met dit Toestel Doet
Volledige 4-standen thermische opslag & piekbewaking: verwarmt sanitair warm water en buffervaten voor tijdens zonne-overschot of goedkope uren vóór avondpieken (`Stand 3`), maximaliseert thermische opslag bij negatieve prijzen (`Stand 4`) en schakelt enkel als laatste redmiddel (`Stand 1`) af wanneer EV-laders gepauzeerd zijn en batterijsteun uitgeput is.

---

### 5.5 Shelly Plus 1 / Pro 1 (Potentiaalvrij Droog-contactrelais)

- **Template-ID**: `shelly_plus_1`
- **Fabrikant / Merk**: Shelly
- **Ondersteunde Hardwaremodellen**: Shelly Plus 1, Shelly Pro 1 (Gen 2 / Gen 3 potentiaalvrije droog-contactrelais)
- **Communicatie-interface**: Lokale HTTP RPC (Standaardpoort: 80, Endpoint: /rpc/Switch.Set)

#### Uitgelezen Telemetrie door GEMS
Schakelstatus (Aan / Uit), toesteltemperatuur (°C), ingangsstatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Uitgangsstatus droog-contactrelais (Inschakelen / Uitschakelen).

#### Wat GEMS Concreet met dit Toestel Doet
Potentiaalvrij droog contact voor het aansturen van SG-Ready warmtepompingangen, externe vrijgaveklemmen van EV-laadpalen of circulatiepompen.

---

### 5.6 Shelly Plus 2PM / Pro 2PM (Dubbel Relais & Vermogensmeter)

- **Template-ID**: `shelly_plus_2pm`
- **Fabrikant / Merk**: Shelly
- **Ondersteunde Hardwaremodellen**: Shelly Plus 2PM, Shelly Pro 2PM (Tweekanaals relais met onafhankelijke vermogensmeting)
- **Communicatie-interface**: Lokale HTTP RPC (Standaardpoort: 80, Endpoints: /rpc/Switch.Set, /rpc/Switch.GetStatus)

#### Uitgelezen Telemetrie door GEMS
Actief vermogen Kanaal 1 & Kanaal 2 (W), cumulatieve energie per kanaal (kWh), Voedingsspanning (V).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Dubbele relaisuitgangsstatus (Kanaal 0 & Kanaal 1 onafhankelijk Aan / Uit).

#### Wat GEMS Concreet met dit Toestel Doet
Onafhankelijke tweekanaals automatisering: schakelt en meet meerdere verwarmingstrappen of stuurt tweekanaals SG-Ready warmtepompconfiguraties aan (Status 1 t/m Status 4).

---

### 5.7 Daikin Altherma 3 & HomeHub (Smart Grid Modbus)

- **Template-ID**: `daikin_altherma`
- **Fabrikant / Merk**: Daikin
- **Ondersteunde Hardwaremodellen**: Daikin Altherma 3 R / H / M & Daikin HomeHub (`EKRHH`) Warmtepompsystemen
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Unit-ID: 1, Input `21`–`50` & Holding `2`, `53`)

#### Uitgelezen Telemetrie door GEMS
Ogenblikkelijk elektrisch warmtepompverbruik (W), SWW-boilertemperatuur (°C), aanvoerwatertemperatuur (°C), Smart Grid-status.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Smart Grid-bedrijfsmodus (`53`: Vrijloop Normaal vs. Aanbevolen Aan PV-overschot Boost) & SWW-temperatuursetpoint (`2`).

#### Wat GEMS Concreet met dit Toestel Doet
Rechtstreekse Modbus TCP thermische opslagautomatisering voor Daikin Altherma 3-warmtepompen: zet overtollige zonne-energie en negatief geprijsde stroom om in sanitair warm water en ruimteverwarming.

---

### 5.8 my-PV AC•THOR / AC•THOR 9s / AC ELWA 2 Zonnestroomverdeler (PV-diverter)

- **Template-ID**: `mypv_acthor`
- **Fabrikant / Merk**: my-PV
- **Ondersteunde Hardwaremodellen**: my-PV AC•THOR (3 kW), AC•THOR 9s (9 kW), AC ELWA 2, AC ELWA-E Lineaire Fotovoltaïsche Verwarmingsregelaars
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Unit-ID: 1, Holding-registers `1000`–`1003`)

#### Uitgelezen Telemetrie door GEMS
Werkelijk verwarmingsvermogen dompelweerstand (W), sanitair-warmwatertemperatuur (`0,1 °C`), bedrijfsstatus.

#### Stuurbare Setpoints & Geschreven Data door GEMS
Traploos lineair verwarmingsvermogenssetpoint (`1000`: `0–9000 W`), relais-booststatus en max. boilertemperatuursetpoint (`1002`).

#### Wat GEMS Concreet met dit Toestel Doet
Proportionele zero-export thermische opslag: stuurt elk beschikbaar watt aan PV-overschot traploos naar warmwaterbuffers voordat er netinjectie of terugregeling plaatsvindt.

---

### 5.9 NIBE S-Series Warmtepomp (S1155 / S1255 / S2125 / VVM)

- **Template-ID**: `nibe_heatpump`
- **Fabrikant / Merk**: NIBE
- **Ondersteunde Hardwaremodellen**: NIBE S1155, S1255, S1156, S1256, S2125, SMO S40, VVM S320 Omvormer-warmtepompen
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Unit-ID: 1, Input `8`, `2166`, `2285` & Holding `697`, `707`)

#### Uitgelezen Telemetrie door GEMS
Ogenblikkelijk elektrisch compressorvermogen (`2166` W), Cumulatief verbruikte elektrische energie (`2285` kWh), SWW-boventemperatuur boiler (`8` °C).

#### Stuurbare Setpoints & Geschreven Data door GEMS
SG-Ready / Smart Price Luxury SWW-boost (`697` / `47`) en comforttemperatuursetpoint (`707` `0,1 °C`).

#### Wat GEMS Concreet met dit Toestel Doet
Directe Wi-Fi/Ethernet Modbus TCP-integratie voor NIBE S-serie warmtepompen: verhoogt de thermische buffer tijdens zonne-overschot en goedkope EPEX-uren.

---

### 5.10 Stiebel Eltron / Tecalor ISG Web & Plus (WPM)

- **Template-ID**: `stiebel_eltron_isg`
- **Fabrikant / Merk**: Stiebel Eltron
- **Ondersteunde Hardwaremodellen**: Stiebel Eltron & Tecalor WPM3, WPM3i, WPMsystem Warmtepompen via ISG web / ISG plus Gateway
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Unit-ID: 1, Input `521`, `2500`, `3506` & Holding `1509`, `4000`–`4002`)

#### Uitgelezen Telemetrie door GEMS
SWW-boilertemperatuur (`521` °C), compressor- & SWW-pompstatus (`2500`), Cumulatieve elektrische energie (kWh).

#### Stuurbare Setpoints & Geschreven Data door GEMS
SG-Ready energiebeheer inschakelen (`4000=1`), SG-Ready Status 2 / Status 3 PV-boost (`4001`–`4002`) en comfort SWW-setpoint (`1509`).

#### Wat GEMS Concreet met dit Toestel Doet
Gestandaardiseerde Modbus TCP SG-Ready boost- en comforttemperatuursturing voor Stiebel Eltron en Tecalor warmtepompen.

---

### 5.11 Tasmota Slimme Stekker / DIN-vermogensrelais

- **Template-ID**: `tasmota_relay`
- **Fabrikant / Merk**: Tasmota
- **Ondersteunde Hardwaremodellen**: Tasmota Wi-Fi / Ethernet Slimme Stekkers, Sonoff POW, Nous A1T, en Meerkanaals DIN-contactoren
- **Communicatie-interface**: Lokale HTTP Commando-API (`/cm?cmnd=Power%20On|Off` & `/cm?cmnd=Status%208`)

#### Uitgelezen Telemetrie door GEMS
Actief verbruiksvermogen (W), Cumulatieve energie (kWh), Voedingsspanning (V), Belastingsstroom (A).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Uitgangsstatus relaiskanaal (`Power{1..8} On` / `Off` met hysteresebeveiliging).

#### Wat GEMS Concreet met dit Toestel Doet
100% lokale cloudvrije schakeling en vermogensmeting voor elektrische boilers, zwembadpompen, e-bikeladers en hulprelais.

---

### 5.12 Askoma ASKOHEAT+ Modbus TCP PV-boilerweerstand

- **Template-ID**: `askoheat_diverter`
- **Fabrikant / Merk**: Askoma
- **Ondersteunde Hardwaremodellen**: Askoma ASKOHEAT+ (AHIR-BI-PLUS 1.75 kW – 19.25 kW) 7-traps PV-flens- & Inschroef-dompelweerstanden
- **Communicatie-interface**: Modbus TCP (Standaardpoort: 502, Unit-ID: 1, Holding-registers `100`, `200`–`202`, `300`–`304`)

#### Uitgelezen Telemetrie door GEMS
Werkelijk verwarmingsvermogen boilerweerstand (`300` W), boilerwatertemperatuur (`302` `0,1 °C`), bitmasker actieve verwarmingstrappen (`301`), Cumulatieve thermische energie (`304` `0.1 kWh`).

#### Stuurbare Setpoints & Geschreven Data door GEMS
Traploos overschot-/vermogenssetpoint (`200`–`201` W), 7-traps verwarmingssturing (`100` trappen 0–7), antilegionella-boost en max. watertemperatuursetpoint (`202` `0,1 °C`).

#### Wat GEMS Concreet met dit Toestel Doet
Proportionele 7-traps en traploze zonthermische sturing voor Askoma ASKOHEAT+ dompelweerstanden: zet overtollige zonneproductie en negatief geprijsde stroom rechtstreeks om in warmwaterbuffers.

---

## Communicatieprotocollen & Netwerkconfiguratie

### 1. Richtlijnen voor Modbus TCP & RTU Gateways (Aanbevolen voor Laadpalen & Omvormers)
- **Sub-seconde Reactietijd**: Met Modbus TCP leest GEMS registers uit en verstuurt stroomsetpoints binnen 200–500 milliseconden. Deze hoge snelheid is essentieel om plotselinge huishoudelijke pieken (zoals een oven of inductiekookplaat) direct op te vangen.
- **Gedeelde Multi-drop RS485 & Single-socket Gateways**: Meerdere Modbus RTU-slaves op dezelfde USB-RS485-adapter (of achter een single-socket Ethernet-naar-RS485-bridge) delen automatisch een thread-veilige busvergrendeling met instelbare baudrate en pariteit (`8N1` / `8E1` / `8O1`).
- **Persistente `/dev/serial/by-id/*` USB-koppeling**: Wanneer meerdere USB-RS485- en USB-P1-kabels op de Raspberry Pi zijn aangesloten, toont GEMS persistente hardware-symlinks (`/dev/serial/by-id/usb-FTDI_...`) als aanklikbare knoppen zodat seriële poorten nooit verwisselen na een herstart.
- **Co-existentie met Externe CPO-verrekening**: Bij bedrijfswagens waarbij de laadpaal via OCPP verbonden blijft met een extern CPO-verrekensysteem of werkgeversplatform, regelt GEMS de laadstroom lokaal via Modbus TCP zonder de externe facturatieverbinding te verstoren.
- **Poortconfiguratie**: Standaard Modbus TCP gebruikt poort `502`. SolarEdge en KOSTAL gebruiken vaak poort `1502`. Wi-Fi-/LAN-sticks van Solis, SofarSolar en GoodWe gebruiken veelal poort `8899`.

### 2. Ingebouwde OCPP 1.6-J WebSocket-server
- **Embedded CSMS-server**: GEMS bevat een ingebouwde OCPP 1.6-J WebSocket-server op poort `8887` én op poort `8080` (`/api/ocpp/<ChargePointID>`).
- **100% Lokale Werking voor Woning & Laadplein**: Wallboxen zonder open Modbus TCP (zoals Huawei FusionCharge, EVBox, VW ID. Charger, Schneider EVlink) verwijzen hun OCPP WebSocket-URL rechtstreeks naar:
  ```text
  ws://<GEMS-Raspberry-Pi-IP>:8887/<ChargePointID>
  ws://<GEMS-Raspberry-Pi-IP>:8080/api/ocpp/<ChargePointID>
  ```
- **Sturingsmechanisme**: GEMS verstuurt `SetChargingProfile`-commando's met een resolutie van 0,1 A / 1 A (inclusief `0,0 A` pauze) om het laadvermogen nauwkeurig te regelen.

### 3. Slimme Meterinterfaces (P1 DSMR & RS485)
- **P1 Seriële USB-kabel**: Rechtstreekse USB-naar-RJ12-kabel op een USB-poort van de Raspberry Pi (`/dev/ttyUSB0`). Standaard baudrate is `115200` voor DSMR 4.x/5.x en Fluvius België; `9600` voor oudere DSMR 2.x/3.x meters. De P1-gebruikerspoort moet geactiveerd zijn via *Mijn Fluvius* (België).
- **P1 Netwerkbridge**: Draadloze of bekabelde P1-lezers (zoals HomeWizard Wi-Fi P1 of TCP-bridges op poort `23`, `8088` of `8234`) sturen DSMR-telegrammen via het lokale netwerk door zonder bekabeling naar de Raspberry Pi.

### 4. Lokale REST- & JSON-RPC API's
- Toestellen zoals HomeWizard (`/api/v1/data`), Shelly Gen 2/3 (`/rpc/EM.GetStatus`), go-e Charger (`/api/status`), APsystems EZ1 (`:8050/getOutputData`) en Enphase Envoy (`/ivp/livedata/status`) worden rechtstreeks via het lokale LAN uitgelezen en aangestuurd zonder afhankelijkheid van fabrikantclouds.

### 5. Overzicht van Netwerkpoorten

| Poort | Protocol | Standaard Gekoppelde Toestellen |
| :--- | :--- | :--- |
| `502` | Modbus TCP | Huawei, SMA, Fronius, Sungrow, Victron, Deye, ABL, ABB, RAEDIAN, KEBA, Eastron, Carlo Gavazzi |
| `1502` | Modbus TCP (SunSpec) | SolarEdge Omvormers & Laadpalen, KOSTAL Plenticore, openWB 2.0 |
| `8899` | Modbus TCP | Solis, SofarSolar, GoodWe Wi-Fi-/LAN-dongles |
| `8502` | Modbus TCP | Alpha ESS Storion-serie |
| `8887` / `8080` | WebSocket (OCPP 1.6-J) | GEMS Ingebouwde OCPP-server (`:8887/<ID>` of `:8080/api/ocpp/<ID>`) |
| `80` / `443` | Lokale HTTP REST / JSON | HomeWizard P1, Shelly 3EM / Pro 3EM, go-e Charger, Enphase Envoy, SmartEVSE, sonnenBatterie, Sessy |
| `8884` | Lokale JSON-API | Niko Home Control II Connected Controller |
| `8088` / `8234` / `23` | Ruwe TCP DSMR-stroom | P1 Netwerk TCP-bridges, Ser2Net, ESP-P1 Gateways |

### 6. Test- & Simulatie-engine (Zero-Hardware Demotemplates)

Voor testomgevingen, pre-commissioning door installateurs en demonstraties zonder fysieke hardware biedt GEMS zes ingebouwde simulatietemplates over alle vijf toestelcategorieën:

| Toesteltemplate | Template-ID | Categorie | Gesimuleerde Telemetrie & Dynamiek | Interactieve Stuursetpoints |
| :--- | :--- | :--- | :--- | :--- |
| **Demo Digitale Slimme Meter (DSMR/P1)** | `demo_meter` | `meter` | Huishoudelijk basisverbruik, dagprofiel met ochtend-/avondpieken, asymmetrische 3-fasenstromen & spanningen (230V ±2V), cumulatieve afname/injectie kWh, gas $m^3$, Vlaamse 15-minuten kwartierpiek (`currentQuarterPeakW`). Balanceert automatisch het netto netvermogen op basis van gesimuleerde PV, batterij en EV-laadpaal. | Enkel uitlezing (Gesynchroniseerde nettobalans) |
| **Demo Zonne-omvormer (PV)** | `demo_solar` | `inverter` | Dagelijkse zonnecurve (zonsopgang tot zonsondergang) geschaald naar nominaal vermogen (bijv. 5,0 kW) met realistische wolkfluctuaties (±3%–10%) en 3-fasenstromen/-spanningen. | `SetActivePowerLimit(W)`: begrenst dynamisch de actieve opwekking tijdens negatieve prijzen of zero-export sturing. |
| **Demo Batterij-energieopslag (BESS)** | `demo_battery` | `battery` | Realistische State of Charge (SOC) integratie ($dE/dt = P \cdot \eta$) tussen 10% ondergrens en 100% bovengrens, met autonome opname van zonne-overschot en dekking van woningverbruik. | `ChargeBattery(W)` en `DischargeBattery(W)`: reageert op geforceerde EPEX-laadvensters en piekafvlakking. |
| **Demo Hybride Omvormer & Opslag** | `demo_hybrid_inverter` | `inverter` | Gecombineerde PV-opwekking en geïntegreerde thuisbatterij in één hybride eenheid. | `SetActivePowerLimit(W)`, `ChargeBattery(W)`, `DischargeBattery(W)`. |
| **Demo Slimme EV-wallbox** | `demo_charger` | `charger` | Simulatie van aangesloten laadsessies met vermogensopname evenredig aan het stuurcommando ($P \approx \text{fasen} \times 230\text{V} \times I$), realistische meetvariatie en sessie-kWh-opbouw. | `SetChargeCurrent(A)` (6A–32A), `SetPhaseMode` (1-fase / 3-fasen). Volledig compatibel met EV-Laadcluster DLB-modi. |
| **Demo Slim Relais / Warmtepomp** | `demo_relay` | `relay` | Simulatie van warmtepompcompressor (~2,1 kW ingeschakeld, ~3 W stand-by) met water-/ruimtetemperatuurverloop. | `SetState(bool)`: schakelt het relaiscontact op basis van automatiseringsregels. |

*Snelle Ingebruikname:* Installateurs kunnen met één klik een gecoördineerde 4-delige Demo Kit (Slimme Meter + Zonne-omvormer + Thuisbatterij + EV-wallbox) aanmaken of wissen via de knop **"🧪 Demo Kit Snel Toevoegen"** onder **Instellingen &rarr; Toestellen**.

---

*Document automatisch beheerd door GEMS (Grid Energy Management System). Canoniek referentieoverzicht van 168 hardware-integratieprofielen (180 geregistreerde toesteltemplates inclusief multimodel-aliassen en 6 simulatietemplates).*
