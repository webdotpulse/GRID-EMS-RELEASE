# GEMS: Handleiding Strategie & Energie-optimalisatie

> 🌐 **Taal / Langue / Language:** [English](../strategy_manual.md) | **Nederlands** | [Français](../fr/strategy_manual.md)

Deze handleiding biedt een diepgaande uitleg over het configureren en gebruiken van de strategie-engine binnen GEMS (Grid Energy Management System). De strategie-engine vormt het kloppende hart van uw energie-installatie en coördineert het elektriciteitsnet, zonnepanelen, thuisbatterijen, EV-laadpalen en slimme relais om het verbruik te optimaliseren, zelfverbruik te maximaliseren, hoge capaciteitstarieven te vermijden en rendabele tariefsturing (arbitrage) uit te voeren.

> [!TIP]
> **Download Officiële Veldhandleidingen (PDF):**
> - 📕 **[GEMS Installateurs- & Inbedrijfstellingshandleiding (PDF)](../../manuals/nl/gems-installer-manual-nl.pdf)** (5.7 MB)
> - 📗 **[GEMS Gebruikershandleiding voor Woningeigenaren (PDF)](../../manuals/nl/gems-user-manual-nl.pdf)** (3.5 MB)
> - ☁️ **[GEMS GRID-EMS-SERVER Verbindingshandleiding (PDF)](../../manuals/nl/gems-server-connection-manual-nl.pdf)** (1.1 MB)
> - 💻 **[Interactief Documentatieportaal](../../manuals/nl/index.html)**

---

## 1. Overzicht van de Strategie-engine

De strategie-engine evalueert continu de energiestromen van uw woning of bedrijfspand vanuit één overzichtelijke gebruikersinterface. Er zijn geen YAML- of tekstconfiguratiebestanden nodig.

De centrale regellus wordt elke seconde uitgevoerd:
1. **Leest Live Telemetrie**: Haalt het actieve vermogen op uit slimme meters (P1/Modbus), zonne-omvormers, batterijopslag (BESS) en EV-laadpalen.
2. **Berekent het Voortschrijdend Kwartiergemiddelde**: Werkt het actuele 15-minuten gemiddelde van de netafname bij en registreert maandelijkse piekwaarden in SQLite.
3. **Past Regionale & Locatieregels toe**: Evalueert de actieve strategiemodus (Eco, Vlaanderen, Nederland), drempelwaarden voor batterij-arbitrage en geplande tijdvensters.
4. **Verstuurt Dynamische Stuurcommando's**: Stuurt niet-blokkerende Modbus-, OCPP- of REST-setpoints naar omvormers, EV-laadpalen en slimme relais.

---

## 2. Globale Site-optimalisatie (Strategiemodi)

| Overzicht Tabblad Strategie | Operationele Strategiemodi |
| :---: | :---: |
| ![Tabblad Strategie](../../screenshots/settings_strategy.png) | ![Strategiemodi](../../screenshots/settings_strategy_modes.png) |

### 2.1 Eco-modus (Maximaal Zelfverbruik)
**Doel:** Het directe zelfverbruik van opgewekte zonne-energie maximaliseren en netafname minimaliseren.
- **Werking:** Stuurt overtollige zonne-energie eerst naar het opladen van de thuisbatterij en de EV-laadpaal voordat er naar het net wordt geïnjecteerd. Zodra de zonproductie afneemt, ontlaadt de thuisbatterij automatisch om het basisverbruik van de woning te dekken.
- **Toepassing:** Ideaal voor installaties met een vast of enkel/dubbel tarief of gunstige terugleververgoedingen.

### 2.2 Vlaanderen-modus (Voorspellende Piekbewaking & Adaptief Plafond)
**Doel:** Hoge kosten voor het Vlaamse *Capaciteitstarief* actief voorkomen door kwartierpieken in het gemiddelde afnamevermogen af te vlakken.
- **Mechanisme:**
  - Bewaakt continu de geprojecteerde gemiddelde kwartierafname binnen elk facturatiekwartier.
  - Zodra de voorspelde kwartierpiek het ingestelde piekplafond min de veiligheidsmarge nadert, verlaagt het systeem onmiddellijk de EV-laadstroom en stuurt het de thuisbatterij aan om bij te springen.
- **Slim Adaptief Plafond (*Smart Adaptive Ceiling*):**
  - GEMS bewaart het hoogste maandelijkse kwartierpiekrecord lokaal op de controller.
  - Treedt er tijdens de maand een onvermijdelijke huishoudelijke piek op (bijv. 4,2 kW door oven + inductiekookplaat tegelijk), dan verhoogt GEMS het operationele plafond automatisch tot die reeds bereikte maandpiek voor de rest van de kalendermaand.
  - Zo laadt uw elektrische wagen sneller op en benut u de reeds gefactureerde capaciteitsruimte maximaal zonder extra capaciteitstariefkosten.
- **Belangrijkste Parameters:**
  - `capacity_peak_limit_kw`: Basisdoel voor het 15-minuten piekplafond (bijv. `2.5` kW).
  - `peak_shaving_buffer_w`: Proactieve veiligheidsmarge in watt (bijv. `200` W) onder het plafond om doorschieten te voorkomen.
  - `peak_shaving_rampup_w`: Hysterese-vermogensstap (standaard `500` W) voordat geknepen toestellen weer mogen opschalen.

### 2.3 Nederland-modus (Slim Salderen, Terugleverkosten-schild & 3×25A Hoofdzekeringbewaking)
**Doel:** De optimale energiestrategie bieden voor Nederlandse huishoudens en het MKB — met bescherming van `3×25A` huisaansluitingen tegen dure netverzwaring, vermijden van terugleverkosten, actief terugregelen bij negatieve EPEX NL-prijzen en maximale day-ahead arbitrage voor en na de afbouw van de *salderingsregeling*.
- **Waarom Nederlandse Optimalisatie Verschilt van Vlaanderen:**
  - Anders dan in Vlaanderen (waar Fluvius een rollende 15-minuten kwartierpiek boven `2,50 kW` aanrekent), hanteren Nederlandse netbeheerders (**Liander**, **Enexis**, **Stedin**) een vast jaarlijks *vastrecht aansluitcapaciteit*. Verzwaren van een standaard **`3×25A`** (`17,25 kW`) aansluiting naar **`3×35A`** kost circa **€ 1.000+ per jaar** extra aan vaste netbeheerkosten.
  - Daarom combineert de Nederlandse modus vier pijlers zonder het woningvermogen kunstmatig op een kwartierlimiet van `2,50 kW` af te knijpen:
    1. **Per-fase `3×25A` Dynamic Load Balancing (DLB):** Bewaakt continu de fasestromen `L1`, `L2` en `L3` uit de DSMR P1-meter zodat **Raedian** EV-laadpalen, **Solis** hybride batterijopslag, warmtepompen en inductiekoken veilig samenwerken op een `3×25A` hoofdzekering zonder verzwaring naar `3×35A`.
    2. **Direct Zon-zelfverbruik & Thermische/EV-buffering:** Stuurt elke overtollige watt zonne-energie eerst naar woningverbruik, **Solis** thuisbatterijen, **Raedian** 1F/3F zonneladen en SG-Ready warmtepompen om teruglevervolumes en leveranciers-*terugleverkosten* te minimaliseren.
    3. **Terugregeling bij Negatieve EPEX NL-prijzen (`min_profitable_export_price` & `active_inverter_curtailment`):** Staat teruglevering aan het net alleen toe zolang de netto terugleververgoeding rendabel is, en regelt het omvormervermogen traploos terug tot het eigen huisverbruik zodra alle buffers vol zijn en de netto exportprijs negatief wordt.
    4. **EPEX NL Day-Ahead Arbitrage (`dynamic_forecast`):** Laadt thuisbatterijen en EV's op tijdens de goedkoopste EPEX NL-uren en ontlaadt tijdens dure avondpieken (`17:00–21:00`).

### 2.4 Strikte Land- & Regio-isolatiegarantie
**Doel:** Garanderen dat landspecifieke netregels nooit zichtbaar zijn of ingrijpen op installaties in een ander land.
- **Vlaanderen (`BE` + `flanders`):** Activeert exclusief de 15-minuten *Capaciteitstarief*-piekbewaker (`capacity_peak_limit_kw`, wettelijk minimum `2,50 kW`), het Slim Adaptief Plafond, piekwaarschuwingen en Vlaamse *Groenestroomcertificaten* (GSC).
- **Wallonië (`BE` + `wallonia`):** Activeert exclusief het officiële CWaPE **`Tarif Impact`**-distributietarief (7 dagen/week: `ECO` `01:00–07:00` & `11:00–17:00`; `MEDIUM` `07:00–11:00` & `22:00–01:00`; `PIC` `17:00–22:00`), waardoor `dynamic_forecast` batterijladen en Slim EV-laden automatisch naar `ECO`-vensters verschuiven en tijdens `17:00–22:00` (`PIC`) ontladen.
- **België (`BE` — Vlaanderen, Wallonië, Brussel):** Activeert exclusief de Belgische Elia hernieuwbare energiemix-synchronisatie, Belgische Super-Dal-optimalisatie (`01:00–07:00`), 2027 bijzondere federale accijnspresets (`€ 0,0392/kWh` excl. 6% btw) en DNB IEC 60870-5-104 telecontrole.
- **Nederland (`NL`), Duitsland (`DE`), Luxemburg (`LU`) en Overige Regio's:** Bij keuze van een niet-Vlaamse regio of een Nederlands energiecontract worden Vlaamse *Capaciteitstarief*-piekbewaking en GSC-compensaties automatisch uitgeschakeld en verborgen, worden Belgische Elia/Super-Dal/IEC-104-diensten gedeactiveerd, blijven post-2027 *terugleverkosten* (`fixed_feed_in_cost_kwh`) en de `>= 50%`-minimumvergoeding strikt beperkt tot `NL`, en blijft Duitse `§14a EnWG`-sturing strikt beperkt tot Duitse (`DE`) installaties.

### 2.5 Bescherming van Vlaamse Groenestroomcertificaten (GSC — Enkel Vlaanderen)
**Doel:** Onterecht terugregelen van zonnepanelen voorkomen en certificaatinkomsten beschermen voor bestaande Vlaamse PV-installaties tijdens uren met negatieve Day-Ahead spotprijzen.
- **Probleem:** Veel oudere installaties ontvangen € 90, € 210, € 230, € 250, € 270, € 330, € 350 of € 450 per 1.000 kWh opgewekte zonne-energie. Als de spotprijs voor injectie zakt naar -€ 0,10/kWh, zou een simpele terugregeling de omvormer uitschakelen en € 0,25/kWh aan GSC-opbrengst mislopen — een nettoverlies van € 0,15/kWh!
- **Formule:**
  $$\text{Effectieve Terugregeldrempel} = \text{min\_profitable\_export\_price} - \frac{\text{gsc\_value\_eur\_mwh}}{1000.0}$$
- **Werking:** Met `gsc_value_eur_mwh: 250` en `min_profitable_export_price: 0.00` blijft teruglevering actief en rendabel tot **-250,0 €/MWh (-0,250 €/kWh)**. De omvormer wordt pas teruggeregeld wanneer de negatieve injectieboete groter is dan de certificaatwaarde.

---

## 3. Dynamische Batterij-arbitrage & Tijdschema's

GEMS integreert EPEX Spot Day-Ahead elektriciteitsprijzen (dagelijks opgehaald om 14:00 CET) en Open-Meteo zonnestralingsprognoses om thuisbatterijen slim aan te sturen.

### 3.1 Netlaadstrategieën (`battery_grid_charge_strategy`)
- **`price_only`**: Laadt de batterij geforceerd op vanuit het net zodra de spotprijs onder `force_charge_below_euro` daalt, en ontlaadt naar het net wanneer de prijs boven `force_discharge_above_euro` piekt.
- **`super_dal_only`**: Beperkt netladen uitsluitend tot superdal-vensters van de energieleverancier (bijv. Engie Superdal).
- **`hybrid`**: Combineert prijsgestuurde drempels met de superdal-vensters van het contract.
- **`dynamic_forecast`**: Berekent een kostenoptimaal 24-uurs laad-/ontlaadschema door uurlijkse/kwartier-EPEX-prijzen te combineren met zonneprognoses en afzonderlijke **weekdag- versus weekend-verbruiksprofielen** op basis van de afgelopen 30 dagen (met `home_base_load_w` als terugvalwaarde).

### 3.2 Live BMS Vermogensgrenzen & Multi-batterij SOC-balancering
- **Live BMS-vermogensbegrenzing**: Zowel de realtime batterijsturing als de 24-uurs dynamische prognose gebruiken de live maximale laad- en ontlaadvermogens uit het BMS (op basis van actuele stroomlimieten en batterijspanning). Dit voorkomt geweigerde setpoints wanneer koude cellen of een hoge laadtoestand (>90% SOC) het laadvermogen begrenzen.
- **SOC-gewogen Verdeling bij Meerdere Batterijen**: Op locaties met meerdere hybride omvormers of BESS-eenheden verdeelt GEMS het totale laadvermogen naar rato van de resterende laadruimte ($\text{MaxCap}_i \times (100 - \text{SOC}_i)$) en het ontlaadvermogen naar rato van de bruikbare energie boven de ondergrens ($\text{MaxCap}_i \times (\text{SOC}_i - \text{MinSOC})$), zodat alle batterijbanken gelijkmatig naar dezelfde SOC convergeren.
- **Gedempte Closed-Loop Regeling**: Bij het compenseren van het netto woningverbruik of bij zero-export PV-terugregeling op basis van een externe slimme meter past GEMS closed-loop demping toe om oscillaties tussen meter en omvormer te elimineren.

### 3.3 Aangepaste Laadvensters & Winter / Weinig-Zon Terugvalmodus
- **Aangepaste Laadvensters**: Gebruikers kunnen meerdere vaste laadvensters instellen met exacte start-/eindtijden en doel-SOC-percentages (bijv. 02:00 – 05:00 tot 90% SOC). Deze handmatige tijdvensters krijgen voorrang op algemene arbitrageregels.
- **Winter / Weinig-Zon Terugvalmodus (`winter_fallback_enabled`)**: Wanneer de batterij door aanhoudend bewolkt winterweer op of onder `winter_fallback_trigger_soc` (standaard `25%`) blijft en de 24-uurs zonneprognose (of de PV-opbrengst van de afgelopen 24 uur) onvoldoende is om de batterij te vullen, laadt GEMS de batterij automatisch bij tijdens de `winter_fallback_cheapest_hours` (standaard `2` uur) goedkoopste momenten van de dag tot `winter_fallback_target_soc` (standaard `65%`, zodat er ruimte blijft voor onverwachte middagzon). Zowel de realtime regeling als de 24-uurs prognose respecteren hierbij strikt het Vlaamse kwartierpiekplafond en de hoofdzekering per fase.

---

## 4. Slim EV-laden (Aanbevolen Modbus TCP & Ingebouwde OCPP)

GEMS stuurt slimme EV-laadpalen aan via **Modbus TCP/RTU-veldbus (aanbevolen)** of via de ingebouwde **Native OCPP 1.6-J WebSocket-server** (`ws://<EMS-IP>:8887/<ChargePointID>` en `ws://<EMS-IP>:8080/api/ocpp/<ChargePointID>`):

- **Waarom Modbus TCP de Voorkeur Heeft**: Modbus-registers bieden directe, sub-seconde stroomregeling (6 A tot 32 A). Dit is essentieel voor reactieve Vlaamse piekbewaking en nauwkeurig zonneladen. Bovendien kan de laadpaal tegelijkertijd via OCPP verbonden blijven met een extern CPO-afrekenplatform of werkgeversvergoedingsdienst zonder enige verstoring.
- **Ingebouwde OCPP-server**: Beschikbaar voor laadpalen zonder Modbus TCP of voor volledig zelfstandige thuisinstallaties zonder cloud-CPO.
- **`smart_ev_cheapest_hours`**: Analyseert automatisch de 24-uurs EPEX-tariefcurve en verhoogt het EV-laadvermogen tijdens de $N$ goedkoopste uren van het etmaal.
- **Dynamic Load Balancing**: Balanceert continu de laadstroom ten opzichte van de hoofdzekering (`grid_nominal_current_a`) en individuele fasestromen (`phase_limit_amps`).

---

## 5. 24-uurs Effectieve Tariefcurve, Regionale Contracten & Besparingsberekening

| Configuratie Energiecontract | 24-uurs Tariefcurve-visualisatie |
| :---: | :---: |
| ![Tabblad Energiecontract](../../screenshots/settings_contract.png) | ![Tariefvisualisatie](../../screenshots/settings_contract_tariffs.png) |

### 5.1 Ondersteunde Belgische & Nederlandse Leveranciersprofielen
- **Vattenfall Nederland — FlexPrijs (`vattenfall_dynamic`, NL)**: Kwartier- (`15m`) of klokuurgemiddelde (`60m`) EPEX Spot NL (`1,00×`) doorgifte + `€ 0,0211/kWh` *Inkoopvergoeding*, `€ 95,40/jaar` *Vastrecht*, wettelijke Nederlandse *Energiebelasting* excl. btw (**2026: `€ 0,09161/kWh`** / **2027: `€ 0,08802/kWh`** excl. `21%` btw), `21%` btw en `1,00×` EPEX Spot NL terugleververgoeding (`€ 0,0000/kWh` inhouding).
- **Eneco Dynamisch & Frank Energie Dynamisch (`NL` / `BE`)**: Regionale EPEX NL- of EPEX BE-spotformules met keuze tussen `15m`- en `60m`-spotafrekening, automatische btw (`21%` NL / `6%` BE) en wettelijke heffingen.
- **TotalEnergies Pixel Dynamic**: Factor, opslag (€/kWh), jaarlijkse abonnementskost en injectieformule.
- **Mega Smart / Cosy Dynamic**: Transparante dynamische formule met instelbare factor en leveranciersopslag.
- **Bolt Dynamisch**: 100% lokaal groen dynamisch contract met realtime spotdoorgifte.
- **Engie Dynamic & Flextime**: EPEX-doorgifte en tijdgebonden tariefschijven.
- **Luminus Dynamic, Ecopower, Dats 24, Octa+, Trevion, Aspiravi**.
- **Belgisch Tweevoudig Tarief (Piek/Dal) & Nederlandse Post-2027 Vaste Contracten**: Dag-/nachttarieven met DNB-presets, plus optionele Nederlandse *terugleverkosten* (`fixed_feed_in_cost_kwh`) en controle op de wettelijke `>= 50%`-minimumvergoeding van het kale leveringstarief.

### 5.2 Netbeheerder- & Heffingsprofielen (DNB)
- **Nederland (Liander / Enexis / Stedin)**: Wettelijke Nederlandse *Energiebelasting*-presets excl. btw (**2026: `€ 0,09161/kWh`** / **2027: `€ 0,08802/kWh`**) + `21%` btw (`3×25A` aansluitbewaking via per-fase DLB).
- **Fluvius (Vlaanderen)**: € 0,0204/kWh distributienettarief of gecombineerde 2027 nettarief + federale accijnspreset (`€ 0,0392/kWh` = € 39,20/MWh) + 6% btw.
- **ORES & RESA (Wallonië — Vlak of CWaPE `Tarif Impact`)**: Vlakke nettarieven (€ 0,0950 / € 0,0920/kWh + 2027 federale accijns) of het CWaPE **`Tarif Impact`** 7 dagen/week (`ECO`: `01:00–07:00` & `11:00–17:00`, RESA `€ 0,0252` / ORES `€ 0,0284`; `MEDIUM`: `07:00–11:00` & `22:00–01:00`, RESA `€ 0,0755` / ORES `€ 0,0812`; `PIC`: `17:00–22:00`, RESA `€ 0,1258` / ORES `€ 0,1345` €/kWh excl. 6% btw).
- **SIBELGA (Brussel)**: € 0,0820/kWh nettarief (inclusief 2027 federale accijnspreset) + 6% btw.

### 5.3 Live 24-uurs Tariefcurve-visualisatie
- **Gestapelde Kostenopbouw**: Toont per uur de 4 prijscomponenten: kale EPEX Spot-groothandelsprijs, leveranciersopslag, netbeheer-/energiebelasting en btw (`6%` BE residentieel / `21%` NL).
- **Dynamische Terugleverlijn**: Toont de werkelijke netto terugleververgoeding en markeert uren met negatief rendement met een **Terugregeladvies**.

### 5.4 Op Telemetrie Gebaseerde Financiële Besparingsberekening
GEMS berekent de live **Geschatte GRID-EMS Besparing** (`Dag`, `Maand`, `Jaar` en `Totaal`) rechtstreeks uit gemeten slimme-meter-, omvormer-, batterij- en laadpaaldata gekoppeld aan uw geconfigureerde stroomcontract — zonder hypothetische aannames:
- **Zon-zelfverbruik (`solar_savings_eur`)**: Direct verbruikte of lokaal opgeslagen zonne-energie gewaardeerd tegen het uitgespaarde afnametarief min een eventueel gederfde positieve terugleververgoeding.
- **Batterij & Tariefsturing (`battery_savings_eur`)**: Opgeslagen batterij-energie die tijdens dure uren wordt ontladen, afgezet tegen de werkelijke laadkost van die opgeslagen energie.
- **Slim EV-laden & Terugregeling (`smart_dispatch_savings_eur`)**: Gerealiseerd tariefvoordeel door laden in daluren t.o.v. het daggemiddelde plus vermeden negatieve terugleverkosten dankzij actieve PV-terugregeling en lokale sturing.
- **Capaciteitspiek-besparing (`peak_shaving_savings_eur`, enkel Vlaanderen)**: Vermeden maandelijkse *Capaciteitstarief*-toeslagen doordat batterij- en EV-piekbewaking de kwartierpiek lager houdt dan de ongestuurde belasting (strikt `€ 0,00` en verborgen buiten Vlaanderen).
