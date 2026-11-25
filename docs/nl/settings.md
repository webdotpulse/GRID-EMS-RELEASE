# GEMS: Documentatie Instellingen

> 🌐 **Taal / Langue / Language:** [English](../settings.md) | **Nederlands** | [Français](../fr/settings.md)

Dit document geeft een compleet en gedetailleerd overzicht van alle configuratieparameters binnen GEMS (Grid Energy Management System). Deze instellingen bepalen hoe GEMS uw residentiële of commerciële energie-installatie beheert, optimaliseert en beveiligt.

---

## 1. Site-optimalisatie & Algemene Strategie

Deze groep instellingen bepaalt het kerngedrag van het EMS: hoe het samenwerkt met het elektriciteitsnet, afname en injectie begrenst, en prioriteiten stelt tussen gekoppelde energietoestellen.

| Overzicht Tabblad Strategie | Operationele Strategiemodi |
| :---: | :---: |
| ![Tabblad Strategie](../../screenshots/settings_strategy.png) | ![Strategiemodi](../../screenshots/settings_strategy_modes.png) |

* **`country`** & **`region`**
  * **Beschrijving:** Geografisch rechtsgebied (`BE`, `NL`, `DE`, `LU`, `FR`, `AT`, `CH`, `UK`, `ES`, `IT`, `SE`, `DK`) en deelregio (`flanders`, `wallonia`, `brussels`). Dwingt strikte landisolatie af in zowel de gebruikersinterface als de backend-engine: Vlaamse 15-minuten *Capaciteitstarief*-piekbewaking (`capacity_peak_limit_kw`) en *Groenestroomcertificaten* (`gsc_value_eur_mwh`) draaien uitsluitend op `BE` + `flanders`; Belgische Elia hernieuwbare energiemix-synchronisatie, Super-Dal (`01:00–07:00`) en DNB IEC 60870-5-104 telecontrole draaien uitsluitend op `BE`; de Nederlandse modus `netherlands` draait uitsluitend op `NL`; en Duitse `§14a EnWG`-vermogensdimming voor stuurbare verbruikers draait uitsluitend op `DE`.
* **`strategy_mode`**
  * **Beschrijving:** De primaire operationele optimalisatiemodus van het systeem (wordt automatisch gevalideerd tegen het ingestelde `country`/`region`).
  * **Waarden:**
    * `eco`: Geeft maximale voorrang aan eigen zonne-energieverbruik en beperkt netafname (universeel beschikbaar in alle landen).
    * `flanders`: *(Enkel Vlaanderen `BE`)* Activeert voorspellende piekbewaking op basis van het Vlaamse 15-minuten *Capaciteitstarief*, inclusief het Slim Adaptief Plafond.
    * `netherlands`: *(Enkel Nederland `NL`)* Richt zich op per-fase DLB-bewaking voor `3×25A` hoofdzekeringen, vermijden van *terugleverkosten*, minimale rendabele terugleverprijs, actieve omvormer-terugregeling bij negatieve prijzen en EPEX NL dynamische arbitrage.
* **`capacity_peak_limit_kw`**
  * **Beschrijving:** *(Enkel Vlaanderen `BE`)* Het basisdoel voor het gemiddelde 15-minuten netafnameplafond (bijv. `2.5` kW). Wordt buiten Vlaanderen automatisch uitgeschakeld (`0.0` kW) en verborgen zodat niet-Vlaamse installaties nooit onnodig op een kwartierpiek worden geknepen.
* **`peak_shaving_buffer_w`**
  * **Beschrijving:** Veiligheidsmarge in watt (bijv. 200 W) die van het piekplafond wordt afgetrokken om tijdig te beginnen met terugregelen voordat het kwartierplafond wordt bereikt.
* **`peak_shaving_rampup_w`**
  * **Beschrijving:** Vermogenshysterese in watt (standaard `500` W) die beschikbaar moet komen voordat geknepen EV-laadpalen weer opschalen of de batterij-ontlading afneemt.
* **`active_inverter_curtailment`**
  * **Beschrijving:** Geeft het EMS toestemming om het actieve uitgangsvermogen van zonne-omvormers via Modbus-registers terug te regelen tot het eigen woningverbruik wanneer de netto terugleververgoeding negatief en onrendabel is. Beschikbaar in alle strategiemodi.
* **`min_profitable_export_price`**
  * **Beschrijving:** Basisdrempel voor rendabele teruglevering (€/kWh). Injectie naar het net is toegestaan zolang de realtime vergoeding groter of gelijk is aan deze drempel min eventuele GSC-compensatie. Daaronder wordt overschot opgeslagen in batterij/EV, en worden omvormers teruggeregeld zodra de opslag vol is. Op Nederlandse (`NL`) installaties dwingt `min_profitable_export_price >= 99` (bijv. `999` via het profiel **Nederland Nul-Teruglevering**) met `active_inverter_curtailment: true` strikte `0 W` netto teruglevering af bij zowel vaste/variabele als dynamische contracten.
* **`gsc_value_eur_mwh`**
  * **Beschrijving:** Gegarandeerde waarde van Vlaamse/Belgische Groenestroomcertificaten (GSC) in € per certificaat of €/MWh (bijv. 250, 350, 450). Zonneproductie en injectie blijven rendabel bij negatieve spotprijzen zolang de negatieve prijs niet groter is dan de GSC-waarde. Terugregeling treedt pas op onder `min_profitable_export_price - (gsc_value_eur_mwh / 1000.0)` (bijv. pas bij -251 €/MWh bij een GSC van 250 €/MWh).
* **`battery_grid_charge_strategy`**
  * **Beschrijving:** Bepaalt hoe de thuisbatterij stroom uit het net gebruikt voor opladen en tariefsturing.
  * **Waarden:**
    * `price_only`: Laadt/ontlaadt strikt op basis van EPEX-spotprijsdrempels (`force_charge_below_euro` / `force_discharge_above_euro`).
    * `price_and_solar`: Combineert Open-Meteo zonneprognose-ruimte met strikt laden onder de ingestelde prijsgrens (`force_charge_below_euro`).
    * `super_dal_only`: Beperkt netladen tot superdal-uren van het leverancierscontract (bijv. Engie Superdal).
    * `hybrid`: Combineert prijsdrempels met superdal-vensters van de leverancier.
    * `dynamic_forecast`: Berekent een kostenoptimale 24-uurs laad-/ontlaadcurve op basis van Open-Meteo zonneprognoses en het adaptieve woningverbruik, waarbij capaciteit wordt gereserveerd voor piektarieven en enkel het eigen verbruik wordt gedekt zonder geforceerde teruglevering.
* **`force_charge_below_euro`**
  * **Beschrijving:** Effectieve prijsdrempel (€/kWh, standaard `0.0`) waaronder de batterij geforceerd vanuit het net wordt opgeladen.
* **`force_discharge_above_euro`**
  * **Beschrijving:** Expliciete prijspiekdrempel (€/kWh, standaard `999.0` = uitgeschakeld) waarboven de batterij actief naar het net injecteert. Wanneer uitgeschakeld (`999.0`), dekt de batterij uitsluitend het lokale verbruik.
* **`min_battery_soc`**
  * **Beschrijving:** Minimale batterijreserve-laadtoestand (`0`–`80%`, standaard `10%`, strikt lager dan `max_battery_soc`). Het ontladen stopt zodra deze ondergrens is bereikt om reservestroom en levensduur te beschermen.
* **`max_battery_soc`**
  * **Beschrijving:** Maximaal batterijlaadplafond (`50`–`100%`, standaard `100%`, strikt hoger dan `min_battery_soc`) om celbelasting aan de bovenkant te beperken wanneer niet dagelijks tot 100% geladen hoeft te worden.
* **`solar_forecast_enabled`**
  * **Beschrijving:** Schakelt de 24-uurs Open-Meteo zonneprognose (`true` standaard) in of uit voor dynamische batterijplanning en ochtend-zonneruimte (`solar_hold`) bij negatieve middagprijzen.
* **`smart_ev_cheapest_hours`**
  * **Beschrijving:** Selecteert automatisch het opgegeven aantal goedkoopste uren van de dag (bijv. 3) om uw elektrische wagen op te laden.
* **`grid_nominal_current_a`**
  * **Beschrijving:** De nominale stroomsterkte van uw hoofdzekering in ampère (bijv. 25, 32, 40). GEMS knijpt laadpalen dynamisch om het uitvallen van de hoofdzekering te voorkomen.
* **`phase_limit_amps`**
  * **Beschrijving:** De maximaal toegestane stroom per individuele fase ($L_1, L_2, L_3$) voor fasebewuste load balancing.
* **`grid_system`**
  * **Beschrijving:** Fysieke elektrische netaansluiting van het pand.
  * **Waarden:** `single_phase_230v`, `three_phase_400v` (3×400V + N), of `three_phase_230v_delta` (Belgisch 3×230V zonder nulgeleider).
* **`allowed_grid_import_kw`**
  * **Beschrijving:** Continue harde bovengrens op het afnamevermogen uit het net in kW.
* **`allowed_grid_export_kw`**
  * **Beschrijving:** Continue harde bovengrens op teruglevering aan het net in kW (stel in op `0.0` voor strikte zero-export).

---

## 2. Systeeminformatie en Locatie

Instellingen voor de fysieke locatie, tijdsynchronisatie en algemene systeemdiagnose.

![Tabblad Systeeminformatie](../../screenshots/settings_system_info.png)

* **`timezone`**
  * **Beschrijving:** Tijdzone van de installatie (bijv. `Europe/Brussels`, `Europe/Amsterdam`), essentieel voor exacte synchronisatie van day-ahead prijzen en kwartiergrenzen.
* **`address`**
  * **Beschrijving:** Straatadres van de installatie.
* **`latitude`** & **`longitude`**
  * **Beschrijving:** GPS-coördinaten automatisch bepaald via OpenStreetMap Nominatim-geocodering, gebruikt voor Open-Meteo zonnestralingsprognoses.
* **`log_level`**
  * **Beschrijving:** Bepaalt het detailniveau van diagnostische systeemlogboeken (`INFO`, `DEBUG`, `WARN`, `ERROR`).
* **`language`**
  * **Beschrijving:** Taal van de gebruikersinterface (`nl`, `fr`, `en`).
* **`commissioning_completed`**
  * **Beschrijving:** Houdt bij of de begeleide 5-staps **Inbedrijfstellingswizard** is afgerond. Installateurs kunnen de wizard op elk moment opnieuw openen via **Instellingen &rarr; Systeeminformatie**.
* **Installateurs-toegangscode & Overzichtelijke Gebruikersmodus (`Instellingen -> Systeeminformatie`)**
  * **Beschrijving:** In de dagelijkse **Normale Modus** (vergrendeld) toont **Instellingen** een overzichtelijk scherm met **Verbonden Toestellen** (inclusief live **Debug**-diagnose en verzending van templaterapporten met één klik naar **GRID-EMS-SERVER**) en **Systeeminformatie** (inclusief **Systeem herstarten** en cryptografisch geverifieerde **Software-update**), naast het live **Dashboard**, de keuzeknop voor de **EV-laadmodus** en het alleen-lezen **Logboek**. Technische en beheerdersfuncties — zoals de Netwerkscanner, de snelkoppeling naar de Cockpit Terminal (`:9090`), de tabbladen Strategie/Energiecontract/Relais & Schakelaars/Netwerk/Meldingen/Cloudserver, het toevoegen/bewerken/verwijderen van toestellen, beheer van Lokale CA & SSL-certificaat, configuratieback-ups en fabrieksinstellingen — blijven afgeschermd tot op het hangsloticoon in de kopbalk van **Instellingen** wordt geklikt en de lokale **Installateurs-PIN/wachtwoord** wordt ingevoerd (ingesteld tijdens Stap 1 van de Inbedrijfstellingswizard en wijzigbaar onder **Instellingen &rarr; Systeeminformatie &rarr; Installateurs-toegangscode**). Hiermee ontgrendelt u de volledige 8-tabbladen tellende **Gecertificeerde installateursmodus** (beveiligd tegen brute-force na 5 foutieve pogingen).
* **Configuratie Back-up, Herstel & Fabrieksinstellingen (Installateursmodus)**
  * **Beschrijving:** Zodra de **Installateursmodus** via het hangsloticoon is ontgrendeld, kunt u een draagbare JSON-back-up exporteren (locatieparameters, toestellen, relaisregels en batterijregels), een back-up atomair terugzetten op vervangende hardware, of een bevestigde reset naar **Fabrieksinstellingen** uitvoeren waarmee lokale telemetrie, toegangsgegevens en toestellen schoon worden gewist.

---

## 2.1 Netwerkconfiguratie van de Controller (`Instellingen -> Netwerk`)

![Tabblad Netwerkinstellingen](../../screenshots/settings_network.png)

* **Bekabeld Ethernetbeheer:** Schakel bekabelde Ethernet-interfaces (`eth0`) rechtstreeks vanuit de browser zonder SSH tussen **Automatisch (DHCP)** en **Statisch IPv4 (Handmatig)** (`IPv4/CIDR`, `Gateway`, `DNS`). Draadloze (`wlan*`) interfaces zijn uitgesloten om deterministische industriële LAN-betrouwbaarheid te garanderen.
* **Automatische 60-seconden Terugvalbeveiliging:** Bij het toepassen van nieuwe netwerkinstellingen start een veiligheidstimer van 60 seconden. Als u niet binnen de afteltijd op **Bevestigen & behouden** klikt in de browser, zet GEMS NetworkManager automatisch terug naar het vorige werkende IP-profiel om buitensluiting op locatie te voorkomen.
* **Automatisch LAN-IP Zelfherstel voor Toestellen & Cloud-eindpuntherstel:** Hoewel vaste DHCP-reserveringen in de router aanbevolen blijven voor lokale omvormers, meters en laadpalen, registreert GEMS automatisch het MAC-adres en serienummer van elk online LAN-toestel en werkt het lokale IPv4-adres automatisch bij (zonder actieve Modbus TCP-dongles te verstoren) wanneer een routerherstart een nieuw DHCP-adres toewijst — terwijl ook het eigen lokale IP-adres van GEMS direct in **GRID-EMS-SERVER** wordt ververst zodra de controller een nieuw LAN-IP ontvangt.

---

## 3. Energiecontract & Regionale Dynamische Tarieven

Configureert uw leveranciersformule om realtime netto afnamekosten en terugleververgoedingen te berekenen.

| Configuratie Energiecontract | 24-uurs Tariefcurve-visualisatie |
| :---: | :---: |
| ![Tabblad Energiecontract](../../screenshots/settings_contract.png) | ![Tariefvisualisatie](../../screenshots/settings_contract_tariffs.png) |

### 3.1 Contracttypes (`contract_type`)
* `vattenfall_dynamic`: **Vattenfall Nederland — FlexPrijs** (Nederland EPEX Spot NL `1,00×` doorgifte + `€ 0,0211/kWh` inkoopvergoeding, `€ 95,40/jr` vastrecht, wettelijke Nederlandse *Energiebelasting* excl. btw voor **2026 (`€ 0,09161/kWh` excl. 21% btw)** en **2027 (`€ 0,08802/kWh` excl. 21% btw)**, `21%` btw en `1,00×` EPEX Spot NL terugleververgoeding).
* `eneco_dynamic`: Eneco Dynamisch (Nederland / België).
* `frank_energie_dynamic`: Frank Energie Dynamisch (NL / BE).
* `totalenergies_dynamic`: TotalEnergies Pixel Dynamic (België EPEX Spot BE doorgifte).
* `mega_dynamic`: Mega Smart / Cosy Dynamic (België).
* `bolt_dynamic`: Bolt Dynamisch (België 100% lokaal groene doorgifte).
* `engie_dynamic`: Engie Dynamic Day-Ahead (België).
* `engie_flextime`: Engie Flextime Time-of-Use tariefstructuur (België).
* `luminus_dynamic`: Luminus Dynamic (België).
* `ecopower_dynamic`: Ecopower Dynamisch (België).
* `dats24_dynamic`: Dats 24 Dynamisch (België).
* `octa_dynamic`: Octa+ Dynamic (België).
* `trevion_dynamic`: Trevion Dynamisch (België).
* `aspiravi_dynamic`: Aspiravi Dynamisch (België).
* `belgium_dual_tariff`: Belgisch Vast Tweevoudig Uurtarief (Piek/Dal + 6% btw).
* `fixed`: Vast / Variabel Tarief (inclusief optionele Nederlandse post-2027 *terugleverkosten* `fixed_feed_in_cost_kwh` en controle op de wettelijke minimumvergoeding `>= 50%` van het kale leveringstarief op `NL`-installaties).
* `dynamic`: Generiek EPEX Dynamisch Tarief.
* `enovos_dynamic`: Enovos Dynamic (Luxemburg).

### 3.2 Dynamische Tariefformule, Afrekenschaal & Regionale Nettarieven
Voor Belgische en Nederlandse dynamische contracten wordt de effectieve afnameprijs berekend als:
$$\text{Prijs}_{\text{afname}} = \left( (\text{EPEX} \times \text{Multiplier}) + \text{Markup} + \frac{\text{BaseFee}}{8760} + \text{DNO}_{\text{tax}} \right) \times (1 + \text{VAT})$$

En de dynamische terugleververgoeding voor zonne-energie:
$$\text{Prijs}_{\text{injectie}} = (\text{EPEX} \times \text{InjectMultiplier}) - \text{InjectMarkup}$$

* **`spot_settlement_granularity`**: Kiest tussen `"15m"` (native 15-minuten EPEX SDAC kwartierafrekening, standaard) en `"60m"` (berekent per klokuur het rekenkundig gemiddelde van de vier kwartierprijzen voor leveranciers met uurafrekening). In Nederland haalt `EnergyZeroProvider` standaard kwartiercurves op met automatische terugval op uurcurves.
* **`tax_kwh`**: Distributienettarieven en wettelijke energieheffingen excl. btw per verbruikte kWh — met selecteerbare Nederlandse *Energiebelasting*-presets voor **2026 (`0.09161` €/kWh)** en **2027 (`0.08802` €/kWh)** excl. 21% btw, **Belgische bijzondere federale accijns 2027 (`0.0392` €/kWh = € 39,20/MWh excl. 6% btw)** en DNB-presets voor Fluvius Vlaanderen, ORES/RESA Wallonië en SIBELGA Brussel. Eerder opgeslagen maatwerkwaarden blijven bij een update ongewijzigd behouden.
* **`fixed_feed_in_cost_kwh`** *(Enkel Nederland `NL` Vast/Variabel)*: Optionele *terugleverkosten* per geïnjecteerde kWh die worden afgetrokken van `fixed_inject_price_kwh` bij het berekenen van het netto terugleverrendement en `min_profitable_export_price`-terugregeling na het einde van de *salderingsregeling* op 1 januari 2027, inclusief live controle op de wettelijke ondergrens 2027–2029 (`>= 50%` van het kale leveringstarief excl. belasting en btw).
* **`dno_tariff_mode`, `dno_impact_eco_kwh`, `dno_impact_medium_kwh`, `dno_impact_pic_kwh`** *(Enkel België `BE` + `wallonia`)*: Configureert het officiële CWaPE **`Tarif Impact`**-distributietarief (`"flat"` standaard | `"wallonia_impact"`, 7 dagen/week): **`ECO`** (`01:00–07:00` & `11:00–17:00`, bijv. RESA `0.0252` / ORES `0.0284` €/kWh), **`MEDIUM`** (`07:00–11:00` & `22:00–01:00`, bijv. RESA `0.0755` / ORES `0.0812` €/kWh) en **`PIC`** (`17:00–22:00`, bijv. RESA `0.1258` / ORES `0.1345` €/kWh).
* **`vat_rate`**: Btw-tarief ingevoerd als decimaal getal (bijv. `0.21` voor 21% btw in Nederland, `0.06` voor 6% residentiële btw in België).
* **Leveranciersfactoren & Opslagen**: Specifieke parameters per energieleverancier (bijv. `vattenfall_multiplier`, `vattenfall_markup`, `vattenfall_base_fee`, `vattenfall_inject_multiplier`, `vattenfall_inject_markup`, `totalenergies_multiplier`, `totalenergies_markup`, `totalenergies_base_fee`, `totalenergies_inject_multiplier`, `totalenergies_inject_markup`).

---

## 4. Aangepaste Tijdschema's & Optimalisatie

Handmatige tijdvensters en geplande laadmogelijkheden.

* **`custom_charge_schedule`**
  * **Beschrijving:** Een JSON-reeks met geforceerde batterijlaadvensters inclusief starttijd, eindtijd en gewenste laadtoestand (SOC), bijv. `[{"start":"02:00","end":"05:00","target_soc":90}]`.
* **`superdal_optimization_enabled`**
  * **Beschrijving:** Schakelt doel-SOC-optimalisatie tijdens superdal-uren van de leverancier in (zoals Engie Superdal).
* **`superdal_target_soc`**
  * **Beschrijving:** Gewenste laadtoestand (SOC %) aan het einde van het superdal-venster.
* **`home_base_load_w`**
  * **Beschrijving:** Gemiddeld sluimer-/basisverbruik van de woning (watt), gebruikt door de dynamische prognose-oplosser om de ontlaadsnelheid te voorspellen.

---

## 5. Software-update & Diagnose op Afstand

Configuratie voor geautomatiseerde OTA-updates, cryptografisch geverifieerde `.deb`-pakketuploads en versiebeheer.

* **Ondertekende Software-updates (Cloud-geproxiede OTA & Handmatige `.deb`-upload)**
  * **Beschrijving:** Rechtstreeks beschikbaar onder **Instellingen &rarr; Systeeminformatie** in zowel de **Normale Modus** als de **Gecertificeerde installateursmodus** (evenals op afstand via **GRID-EMS-SERVER** `OTA_UPDATE`), halen met de cloud gekoppelde controllers firmware-updates automatisch op via **GRID-EMS-SERVER**—zodat de `GRID-EMS-RELEASE`-repository privé kan blijven zonder GitHub-tokens lokaal op locatie op te slaan (met automatische directe GitHub-terugval). Zowel OTA-updates als handmatige `.deb`-browseruploads verifiëren vóór installatie de semantische versievolgorde evenals de ingebouwde Ed25519 cryptografische handtekening en SHA-256 pakket-hash van New Energy Grid via de door `systemd` beheerde achtergrondservice (`gems-updater.path` / `gems-updater.service`). *(Opmerking: Controllers op versie `v9.35.1`–`v9.36.2` vereisen een eenmalige `.deb`-upgrade via SSH of de Cockpit Webterminal op poort `9090` om de bijgewerkte servicerechten te activeren.)*
* **Systeem Herstarten & Live Toestel-/Templatediagnose**
  * **Beschrijving:** Woningeigenaren en installateurs kunnen de controller veilig herstarten (**Systeem herstarten**) via **Instellingen &rarr; Systeeminformatie** en live **Debug**-tests uitvoeren op geconfigureerde toestellen onder **Instellingen &rarr; Verbonden Toestellen** om meetwaarden te controleren en diagnostische templaterapporten rechtstreeks naar **GRID-EMS-SERVER** te sturen zonder de installateursmodus te hoeven ontgrendelen.
* **`github_token`**
  * **Beschrijving:** Optioneel GitHub Personal Access Token voor standalone (niet-gekoppelde) controllers bij gebruik van privé of gelimiteerde GitHub Releases API-assets; met **GRID-EMS-SERVER** gekoppelde controllers ontvangen firmware-updates rechtstreeks via de cloud zonder lokaal GitHub-token.
* **EU Cyber Resilience Act (CRA) Beveiligingsbeleid & Kwetsbaarheidsmelding (`/.well-known/security.txt`)**
  * **Beschrijving:** **Instellingen &rarr; Systeeminformatie** toont het New Energy Grid **Beveiligings- & Firmware-ondersteuningsbeleid** (Ed25519-ondertekende firmwareverificatie, CycloneDX 1.5 SBOM-herkomst en gecoördineerde kwetsbaarheidsmelding via `/.well-known/security.txt`), zonder CPU-belasting, RAM- of hardwaretelemetrie te tonen en met dynamische versienummering op basis van `git describe --tags --always`.

---

## 6. Meldingen & Webhook-waarschuwingen

Configuratie voor externe webhook-meldingen en piekwaarschuwingen.

![Tabblad Meldingen](../../screenshots/settings_notifications.png)

* **`alert_webhook_url`**
  * **Beschrijving:** HTTP(S) Webhook-URL (bijv. Discord, Slack of eigen automatiserings-endpoints) waarnaar GEMS directe meldingen stuurt bij offline toestellen, opeenvolgende uitleesfouten of wanneer de 15-minuten capaciteitspiek 90% van het plafond nadert.
* **`weekly_report_enabled`**
  * **Beschrijving:** Schakelt het automatisch genereren en e-mailen van wekelijkse PDF-energierapporten in of uit.
* **`report_email`**
  * **Beschrijving:** Bestemmingsadres voor geautomatiseerde e-mailrapporten.
* **SMTP-instellingen (`smtp_host`, `smtp_port`, `smtp_username`, `smtp_password`, `smtp_sender`)**
  * **Beschrijving:** Uitgaande mailservergegevens voor het verzenden van energierapporten.

---

## 7. Relais & Schakelaars

Configuratie voor contactoren, SG-Ready warmtepompen en elektrische boilers.

| Beheer Relais & Schakelaars | Relais-automatiseringsregels |
| :---: | :---: |
| ![Tabblad Relais](../../screenshots/settings_relays.png) | ![Relaisregels](../../screenshots/settings_relays_rules.png) |

* **Relais-automatiseringsengine**: Instelbare triggercondities (`excess_solar`, `negative_spot_price`, `time_schedule`), drempelwaarden, minimale in-/uitschakeltijden (`min_run_time`, `min_off_time`) en automatische schakelacties (`turn_on`, `turn_off`).

---

## 9. Opleveringstest & Hardware-aansturingscontrole

Beschikbaar in de **Gecertificeerde installateursmodus** (`Instellingen -> Opleveringstest`) én op afstand via **GRID-EMS-SERVER** (`/installer/device/{id}`), valideert deze interactieve testsuite de volledige communicatie en closed-loop aansturing van **Omvormer**, **Thuisbatterij** en **Laadpaal**:

![Installateur Opleverings- & Aansturingstest](../../screenshots/settings_commissioning_test.png)

* **5-Stappen Verificatie per Toestel**: Controleert (1) Configuratie- & Aansturingsgereedheid, (2) Transport- & Busbereikbaarheid (Modbus TCP, RS-485 Serieel, OCPP 1.6-J of Lokale REST), (3) Live Telemetrie & Elektrische Plausibiliteit, (4) Actieve Stuuropdracht & Terugmelding (80% terugregelpuls op omvormer, 2 minuten actief laden en 2 minuten actief ontladen op de thuisbatterij met live BMS-terugmelding en 6,0 A stroomsetpoint op EV-laadpaal) en (5) Veilig Herstel naar Autonome Werking.
* **Begeleid Herstel van Aandachtspunten**: Detecteert configuratiefouten of busproblemen (zoals uitgeschakelde omvormer-terugregeling, ontbrekende batterijcapaciteit, laadpaal vergrendeld in `Off`-modus of uitgeschakelde communicatie-automaten) en biedt een directe **Herstellen & Opnieuw Testen**-knop zowel lokaal als vanuit het cloudportaal.
* **Officieel Opleveringscertificaat**: Genereert een downloadbaar A4 PDF-opleveringsrapport (**PDF-Rapport Downloaden**) en een machineleesbaar JSON-verificatiearchief, terwijl de live voortgang stap voor stap naar **GRID-EMS-SERVER** wordt gestreamd.

---

## 10. Dakgeometrie, EV-vertrekdoel, Aangepaste Modbus & Lokale Alleen-lezen Integratie

* **Dubbele PV-dakoriëntatie (`Instellingen -> Toestellen -> Omvormer`)**: Stel het primaire MPPT 1 DC-piekvermogen (`pv_string1_kwp`, `0` = gelijk aan AC-omvormervermogen `kW`, of vul het werkelijke DC-paneelvermogen onafhankelijk van het omvormervermogen in), de dakhelling (`pv_tilt_deg`, standaard `35°`) en oriëntatie/azimut (`pv_azimuth_deg`, `0°` Zuid, `-90°` Oost, `+90°` West) plus een optionele tweede MPPT-string (`pv_string2_*`) in op omvormers zoals **Solis** voor nauwkeurige zonnevoorspellingen met automatische schaduwkalibratie.
* **Laadpaal-gestuurd EV-vertrekdoel (`Instellingen -> Toestellen -> EV-laadpaal` & Dashboard)**: Configureer optioneel een sessiedoel (`target_session_energy_kwh`, bijv. `+20 kWh`) en vertrektijd (`departure_time`, bijv. `07:00`) op laadpalen zoals **RAEDIAN** — volledig gemeten via de eigen meter van de laadpaal zonder voertuig-API's.
* **EV-Vloot Prioriteitsniveaus (`Instellingen -> Toestellen -> EV-laadpaal` & `Vloot`):** Wijs aan elk laadpunt een prioriteitsniveau toe voor de DLB-modus `Priority Queue`: **`vip`** (`VIP`), **`high`** (`Hoog`), **`normal`** (`Normaal`), **`low`** (`Laag`) of **`solar_only`** (`Enkel Zon`) — strikt geordend als `VIP > Hoog > Normaal > Laag > Enkel Zon`. Laadpunten op `Laag` mogen nog vanuit het net of in daluren laden nadat `Normaal` is bediend, terwijl `Enkel Zon` pauzeert zonder zonne-overschot.
* **4-Standen Dubbel-Relais SG-Ready & Weersafhankelijke Thermische Voorverwarming (`Instellingen -> Relais` & `Instellingen -> Strategie`)**: Koppel twee relaiskanalen (`sgready_relay1_id` + `sgready_relay2_id`) tot een 4-standen SG-Ready warmtepompregeling (`Stand 1` Blokkering, `Stand 2` Normaal, `Stand 3` Zon/Dal Aanbevolen, `Stand 4` Negatieve-prijs Boost), stel thermische voorverwarming in (`thermal_preheat_enabled`, `thermal_preheat_offset_c`) en activeer Open-Meteo `temperature_2m` weersafhankelijke voorverwarming vóór voorspelde koudegolven (`thermal_weather_aware_enabled`, `thermal_cold_snap_threshold_c`, standaard `3,0°C`).
* **Aangepaste Modbus-profielbouwer (`Instellingen -> Toestellen`, Gecertificeerde installateursmodus)**: Koppel niet-standaard Modbus TCP/RTU meters, omvormers, batterijen en laadpalen via UI-gekoppelde `FC03`/`FC04`-registers, optionele `FC06`/`FC16`-setpoints met watchdog- en terugvalbeveiliging, een live **Register Testen**-knop en JSON-import/export.
* **Alleen-lezen Lokale Integratie (`Instellingen -> Netwerk`)**: Schakel uitgaande MQTT v3.1.1-telemetrie in (`mqtt_enabled`, optionele TLS en één-klik Home Assistant MQTT Auto-Discovery) en/of de opt-in LAN-only alleen-lezen Modbus TCP-server (`local_modbus_tcp_enabled`, standaardpoort `1502`, enkel `FC03`/`FC04`, schrijfacties geblokkeerd).
* **Externe Aggregator / VPP Flexibiliteits-enveloppe (`Instellingen -> Strategie`)**: Optionele beveiligde interface (`vpp_dispatch_enabled`, `vpp_api_token`, `vpp_max_power_kw`, `vpp_reserve_soc_pct`, `vpp_max_soc_pct` en Vlaanderen-geïsoleerde `vpp_allow_peak_override`) voor tijdsgebonden (`15–900s` deadman-lease) `±kW`-setpoints van erkende externe BRP/BSP-aggregatoren, strikt begrensd binnen lokale GEMS-veiligheidsrails.
* **Cloud Multi-Site Fysiek Energiedelen (`Instellingen -> Cloud`)**: Synchroniseert clusterdeelname en voert tijdsgebonden zonne-overschotopdrachten uit (`CLUSTER_BOOST_EV`, `CLUSTER_CHARGE_BATTERY`, `CLUSTER_DISCHARGE_BATTERY`, `CLUSTER_REVERT_LOCAL`) vanuit **GRID-EMS-SERVER** met 30-seconden deadman-terugval en absolute voorrang voor lokale zekeringen en capaciteitspieken.
