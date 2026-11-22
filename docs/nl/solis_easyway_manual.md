# GEMS: Solis Retrofit / Hybride Omvormers & Easyway 5200 (`UNIV5200`) Inbedrijfstellings- & Bekabelingshandleiding

> 🌐 **Taal / Langue / Language:** [English](../solis_easyway_manual.md) | **Nederlands** | [Français](../fr/solis_easyway_manual.md)

Deze uitgebreide handleiding voor elektriciens en woningeigenaren behandelt de **fysieke DC-vermogensbekabeling, diagonale/busbar-balancering bij parallelschakeling, CAN RJ45-pinbezetting en binaire `ADD` DIP-switches** tussen de **Easyway 5200 thuisbatterij (`UNIV5200`, 51,2V 102Ah LiFePO4)** en **Solis laagspannings-retrofit- en hybride omvormers**, de aansluiting en instelling van **Eastron `SDM72D-M` & `SDM630-M` slimme energiemeters**, alle verplichte instellingen in de **SolisCloud App** en optimale sturing binnen **GRID-EMS (GEMS)**.

> [!TIP]
> **Download Afdrukbare Veldhandleiding (PDF):**
> - 📕 **[Solis Retrofit / Hybride & Easyway UNIV5200 Handleiding (PDF)](../../manuals/nl/gems-solis-easyway-manual-nl.pdf)**
> - 💻 **[Interactieve Solis & Easyway Webgids](../../manuals/nl/solis.html)**
> - 🛠️ **[GEMS Documentatieportaal](../../manuals/nl/index.html)**

---

## 1. Spanningsvoorschriften, Compatibele Solis-omvormers & Dimensionering

De **Easyway 5200 (`UNIV5200`)** is een **51,2 V nominale (48V-klasse) laagspannings-LiFePO4** batterijmodule (`102 Ah`, `5,22 kWh` bruto / `~4,70 kWh` bruikbaar bij 90% DoD, `44,8–57,6 Vdc`, `IP20` passieve binnenkoeling, uitbreidbaar tot **16 pakketten parallel = 83,52 kWh**).

> [!CAUTION]
> **KRITIEKE SPANNINGSWAARSCHUWING:**
> - **Schakel Easyway `UNIV5200`-modules NOOIT in serie!** Opstellingen met meerdere modules (2 tot 16 pakketten) moeten **strikt in 51,2 V parallel** worden aangesloten (`P+` op `P+`, `P-` op `P-`).
> - **Sluit `UNIV5200`-batterijen NOOIT aan op hoogspannings- (`-H`) Solis-omvormers** (zoals `S6-EH3P(5-20)K-H` of `RHI-3P-HVES`, die `160–600 Vdc` verwachten). Controleer altijd het **`-L`**- of **`48ES / 48V`**-laagspanningssuffix op het typeplaatje van de Solis-omvormer!

### 1.1 Compatibele Solis LV-modellen, Aantal Pakketten & DC-beveiliging

Elke `UNIV5200`-module heeft een aanbevolen continue laad-/ontlaadstroom van **`50 A` (~`2,56 kW` per module)** en maximaal `100 A` piek. Koppelt u één enkele `UNIV5200` aan een 5 kW+ Solis-omvormer, dan begrenst het BMS het continue vermogen veilig rond ~2,56 kW. Door **2 of meer parallelle pakketten (`10,44 kWh+`, `100 A+`)** te plaatsen, benut u het volledige continue 5 kW+ vermogen voor piekbewaking en spotladen:

| Solis LV-omvormerserie | Architectuur & GEMS-template | Max. Batterijstroom | Aanbevolen `UNIV5200`-opstelling | Hoofd-DC-kabel & Externe DC MCCB |
| :--- | :--- | :--- | :--- | :--- |
| **`Solis RAI-3K-48ES-5G`** (3,0 kW 1F) | AC-gekoppelde Retrofit (`solis_retrofit`) | `60 A` (~3,0 kW) | **1 – 3× `UNIV5200`** (`5,22 – 15,66 kWh`) | `25 mm²` koper • **100 A** DC MCCB |
| **`Solis S6-EA1P(3.6–6)K-L`** (1F) | AC-gekoppelde Retrofit (`solis_retrofit`) | `75 A – 125 A` | **2 – 4× `UNIV5200`** (`10,44 – 20,88 kWh`) | `35 mm²` koper • **125 A – 160 A** DC MCCB |
| **`Solis S5-EH1P(3–6)K-L`** (1F) | PV + Opslag Hybride (`solis_hybrid`) | `62,5 A – 100 A` | **2 – 4× `UNIV5200`** *(1× begrensd op ~2,56 kW)* | `25 – 35 mm²` koper • **125 A** DC MCCB |
| **`Solis S6-EH1P(3–8)K-L-PLUS / PRO`** | PV + Opslag Hybride (`solis_hybrid`) | `70 A – 190 A` | **2 – 6× `UNIV5200`** *(≥3× voor 8 kW cont.)* | `35 – 50 mm²` koper • **160 A – 250 A** DC MCCB |
| **`Solis S6-EH3P(5–10)K-L` / `NV-YD-L`** | 3-Fase LV Hybride (`solis_hybrid`) | `120 A – 290 A` | **3 – 8× `UNIV5200`** *(via koperen DC-busbar)* | `50 – 70 mm²` koper • **200 A – 300 A** DC MCCB |

---

## 2. Stapsgewijze Bekabelingsgids: Easyway `UNIV5200` naar Solis-omvormer

Voer alle vermogens-, aardings-, DIP-switch- en communicatiebekabeling uit terwijl de Solis AC-automaat, PV DC-lastscheider, externe DC MCCB en alle schakelaars op de `UNIV5200`-pakketten strikt **UIT** staan.

### 2.1 DC-vermogen, Externe DC-automaat & Parallelle Balancering

1. **Externe Niet-gepolariseerde 2-polige DC MCCB / Zekeringlastscheider:**
   - Monteer een **niet-gepolariseerde 2-polige DC MCCB of NH00 `gBat` DC-zekeringlastscheider** (`≥ 80 Vdc`, `100 A – 300 A` volgens Sectie 1.1) tussen de batterijbank en de `BAT+` / `BAT-`-klemmen van de Solis. Gebruik nooit gepolariseerde AC-automaten op bidirectionele batterijkringen.
2. **Enkel Pakket (`1× UNIV5200` — 5,22 kWh):**
   - Trek even lange `25 mm²` of `35 mm²` soepele fijnaderige koperkabels vanaf `P+` (Rood) en `P-` (Zwart) via de 2-polige DC MCCB naar `BAT+` en `BAT-` op de Solis.
3. **2 tot 3 Parallelle Pakketten — Diagonale (Kruislingse) Aftakmethode:**
   - Verbind `P+` met `P+` en `P-` met `P-` tussen de modules met exact even lange verbindingskabels.
   - Sluit de hoofdkabel **`BAT+`** naar de Solis-omvormer aan op **`P+` van Pakket 1 (Master)** en sluit de hoofdkabel **`BAT-`** naar de Solis-omvormer aan op **`P-` van het LAATSTE pakket** (Pakket 2 of Pakket 3). Diagonale aftakking houdt de lusimpedantie gelijk over alle modules zodat Pakket 1 niet zwaarder wordt belast of sneller veroudert.
4. **4 tot 16 Parallelle Pakketten — Vertinde Koperen DC-verzamelrail (Verplicht bij > 3 Pakketten):**
   - Plaats gecertificeerde **positieve en negatieve koperen DC-busbars** (`250 A – 400 A`). Trek gezekerde `25 mm²`-aftakkabels van exact gelijke lengte vanaf elke individuele `UNIV5200` (`P+` en `P-`) naar de busbars, en ga van daaruit met `35 mm² – 70 mm²` hoofdkabels via de hoofd-DC MCCB naar de Solis-omvormer.
5. **Kabelverbindingen & Beschermingsaarde (`⏚ PE`):**
   - Druk **Amphenol SurLok Plus**-stekkers aan tot de vergrendeling hoorbaar klikt, of draai geperste `M6 / M8`-kabelogen met `5–8 Nm` vast op het blanke contactvlak.
   - Verbind de aardingsklem (`⏚`) van elke `UNIV5200`-behuizing en het batterijrek met `≥ 6 mm²` groen/gele aarddraad met de PE-rail van de Solis.

### 2.2 BMS CAN RJ45-pinbezetting (Master Pakket 1 `CAN` ↔ Solis `BMS`-poort)

De closed-loop communicatie tussen Pakket 1 (Master) en de Solis-omvormer werkt op **500 kbps CAN-bus** via een afgeschermde CAT5e/CAT6-kabel:

| RJ45-pin | Standaard T568B-kleur | Solis `BMS / CAN`-poort | Easyway `UNIV5200` `CAN`-poort | Aanbevolen Aansluiting |
| :---: | :--- | :--- | :--- | :--- |
| **Pin 1 – 3** | Wit-Oranje / Oranje / Wit-Groen | NC / Enable GND / RS485-B | Gereserveerd / Interne bus | **Open / Niet aansluiten** |
| **Pin 4** | **Blauw** | **`CAN-H` (CAN High)** | **`CAN-H` (CAN High)** | **Verbind Pin 4 ↔ Pin 4** |
| **Pin 5** | **Wit / Blauw** | **`CAN-L` (CAN Low)** | **`CAN-L` (CAN Low)** | **Verbind Pin 5 ↔ Pin 5** |
| **Pin 6 – 8** | Groen / Wit-Bruin / Bruin | RS485-A / **Pin 7: +12V Enable** | Gereserveerd / Interne bus | **Open / Niet aansluiten** |

> [!IMPORTANT]
> **Isoleer Pin 4 & 5 bij Zelfgemaakte CAN-patchkabels:** Solis zet `+12V Enable` op **Pin 7** en RS-485-signalen op **Pin 3 & 6** van zijn `BMS`-poort. Gebruik de meegeleverde CAN-kabel van de omvormer — of krimp een afgeschermde RJ45-kabel waarbij **uitsluitend Pin 4 (`CAN-H`) en Pin 5 (`CAN-L`)** zijn doorverbonden — zodat er nooit `+12V` teruggevoerd wordt naar gereserveerde BMS-pinnen op de batterij. *(Controleer altijd het meegeleverde `UNIV5200`-aansluitblad van uw leveringsbatch).*

### 2.3 Onderlinge Linkbekabeling & Binaire `ADD` DIP-switch-tabel

- **Onderlinge Linkkabels:** Lus standaard rechte CAT5e/CAT6-patchkabels door van **Pakket 1 (Master) `RS485-B / Link Out`** → **Pakket 2 (Slave 1) `RS485-A / Link In`**, Pakket 2 Out → Pakket 3 In, enzovoort. Laat de `CAN`-poort leeg op alle Slave-modules — **enkel Pakket 1 (Master) wordt op de Solis-omvormer aangesloten**.
- **Binaire `ADD` DIP-switches (Uitsluitend Spanningsloos UIT Instellen):** Lees van links naar rechts (`SW1`..`SW4`, waarbij `ON = 1`, `OFF = 0`; laat bij 6-polige blokjes `SW5` & `SW6` op `OFF` staan tenzij de handleiding anders vermeldt):

| `UNIV5200` Pakketrol | SW 1 | SW 2 | SW 3 | SW 4 | Binaire Code | Aansluitrol |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Enkel Pakket of Master (Pakket 1)** | `OFF` | `OFF` | `OFF` | `OFF` | **`0000`** | `CAN` naar Solis `BMS` + `Link Out` naar Pakket 2 |
| **Slave 1 (Pakket 2 — 10,44 kWh)** | **`ON`** | `OFF` | `OFF` | `OFF` | `1000` | `Link In` van Pakket 1, `Link Out` naar Pakket 3 |
| **Slave 2 (Pakket 3 — 15,66 kWh)** | `OFF` | **`ON`** | `OFF` | `OFF` | `0100` | `Link In` van Pakket 2, `Link Out` naar Pakket 4 |
| **Slave 3 (Pakket 4 — 20,88 kWh)** | **`ON`** | **`ON`** | `OFF` | `OFF` | `1100` | `Link In` van Pakket 3, `Link Out` naar Pakket 5 |
| **Slave 4 (Pakket 5 — 26,10 kWh)** | `OFF` | `OFF` | **`ON`** | `OFF` | `0010` | Parallel via koperen DC-busbar |
| **Slave 5 (Pakket 6 — 31,32 kWh)** | **`ON`** | `OFF` | **`ON`** | `OFF` | `1010` | Parallel via koperen DC-busbar |
| **Slaves 6 – 15 (Pakketten 7 – 16)** | `0/1` | `0/1` | `0/1` | `0/1` | `0110..1111` | Vervolg binaire reeks (`0110`, `1110`, `0001` … `1111`) tot 83,52 kWh totaal |

### 2.4 Verplichte Soft-Start Inschakel- & Uitschakelvolgorde

1. **Inschakelen:**
   - Controleer spanningsloos de DC-polariteit met een multimeter (alle schakelaars UIT).
   - Zet de individuele automaten op de `UNIV5200`-modules **AAN** en sluit de externe **2-polige DC MCCB** terwijl de BMS-leds nog uit zijn.
   - Houd op **Pakket 1 (Master) de `SW / POWER`-knop `2–3 seconden` ingedrukt** zodat de interne voorlaadweerstand de DC-condensatoren van de Solis rustig oplaadt (`RUN` groen aan, `ALM` rood uit; Slave-pakketten ontwaken automatisch mee).
   - Zet de Solis PV DC-lastscheider **AAN** (bij hybride modellen) en schakel tot slot de Solis AC-netautomaat **AAN**.
2. **Uitschakelen (Omgekeerde volgorde):** AC-netautomaat **UIT** → PV DC-schakelaar **UIT** → Houd Master `SW`-knop 3s ingedrukt tot alle pakketten uitschakelen → Open de externe DC MCCB **UIT**.

---

## 3. Aansluiten & Instellen van een Eastron `SDM72D-M` of `SDM630-M` Slimme Meter

De 4-DIN-module brede 3-fasige bidirectionele Modbus RTU-meters van Eastron — **`SDM72D-M`** (en de vernieuwde **`SDM72D-M-2`**, direct gemeten tot `80 A / 100 A`) en **`SDM630-M`** (**`SDM630-Modbus V2/V3`** direct tot `80 A / 100 A` of **`SDM630MCT`** met stroomspoelen) — delen dezelfde IEEE-754 `Float32` registermap (`0x0000–0x004A`) en werken naadloos samen met zowel Solis-omvormers als GEMS.

### 3.1 Modelkeuze & 3-Faseregel

- **`Eastron SDM630-M` (`SDM630-Modbus V2 / V3`):** Directe meting tot `80 A / 100 A`. Ondersteunt **`3P4W` (`3×400V+N`)**, Belgisch **`3P3W` (`3×230V` driehoek zonder nulgeleider)** en **`1P2W` (`1×230V`)**. Officieel ondersteund door Solis (`Eastron 3P` / `SDM630`) en GEMS (`eastron_sdm630`).
- **`Eastron SDM72D-M-2` (en `SDM72D-M`):** Directe meting tot `80 A / 100 A`. De **`SDM72D-M-2` (V2)** biedt volledige per-fase `V / I / W`-registers identiek aan de `SDM630-M` en ondersteunt `3P4W` / `3P3W`. *(Opmerking: De oudere V1 `SDM72D-M` vereist een nulgeleider `3P4W` en mist soms per-fase V/I-registers — gebruik bij voorkeur de `SDM72D-M-2` of `SDM630-M` voor de Solis `Meter`-poort en 3-fasige EV Dynamic Load Balancing).*
- **`Eastron SDM630MCT`:** Uitvoering met externe stroomspoelen (`100A–600A / 5A` of `mV`) voor aansluitingen `> 100 A` of bestaande verdeelborden waar de hoofdleiding niet losgekoppeld kan worden.
- **1-Fase Solis op een 3-Fasenaansluiting:** Plaats zelfs bij een 1-fasige Solis-omvormer (`RAI-3K-48ES-5G`, `S6-EA1P-L`, `S5-EH1P-L`, `S6-EH1P-L`) in een 3-fasenwoning altijd een **3-fasige `SDM630-M` of `SDM72D-M-2`** direct na de hoofdmeter zodat afname en injectie over `L1 + L2 + L3` salderen.

### 3.2 Twee Ondersteunde RS-485-topologieën (Eén-Master-busregel!)

> [!CAUTION]
> **Sluit NOOIT twee Modbus RTU-masters tegelijk op dezelfde meter aan!** Verbind nooit zowel de Solis `Meter`-poort ALS een GEMS USB-RS485-adapter op dezelfde `A+ / B-`-klemmen van één `SDM72D-M` of `SDM630-M` — busbotsingen veroorzaken direct `Meter_Comm_FAIL`. Kies **Topologie 1** of **Topologie 2**:

- **Topologie 1 (Aanbevolen Standaard — Bekabeld naar Solis `Meter` RJ45-poort):** Sluit de `SDM72D-M` / `SDM630-M` aan op de `Meter`-poort van de Solis. Solis regelt hiermee sub-seconde het eigen `Self-Use`-evenwicht en geeft het live netvermogen (`33130–33131`) en de 3-fasestromen/-spanningen (`33251–33262`) door aan GEMS zodra `Grid Meter Connected? = Aangevinkt` staat. *(U kunt daarnaast gewoon een digitale USB P1-kabel op GEMS aansluiten).*
- **Topologie 2 (Rechtstreeks op GEMS — Locaties Zonder Digitale P1-poort):** Verbind een aparte `SDM72D-M` / `SDM630-M` rechtstreeks met GEMS via **USB-naar-RS485** (`/dev/serial/by-id/...`) of een **RS-485 Ethernet-gateway** (`Poort 502`) met GEMS-template `eastron_sdm72_x96` of `eastron_sdm630`. *(Multi-drop optie: lus de GEMS-meter op **Modbus ID `2`** door op dezelfde GEMS USB-RS485-bus als Solis Optie A op **Modbus ID `1`**, `9600 8N1`).*

### 3.3 Aansluiting: Hoofdstroom, CT's & RS-485-pinbezetting

1. **Plaatsing in het Verdeelbord (Cruciaal bij Retrofit & Hybride):** Monteer de meter **onmiddellijk na de nutsmeter / hoofddifferentieel**, strikt **stroomopwaarts** van alle woningkringen, warmtepompen, **Raedian** EV-laadpalen, bestaande PV-stringomvormers en de AC-automaat van de Solis zodat alle zonnestroom door de meter loopt.
2. **Direct Aangesloten AC-hoofdklemmen (`SDM72D-M` / `SDM72D-M-2` & `SDM630-M`, tot 100 A):**
   - **Bovenste kooiklemmen ( Voeding vanuit Net IN):** `1 = L1 IN`, `2 = L2 IN`, `3 = L3 IN`, `4 = N IN`
   - **Onderste kooiklemmen (Woning / PV / Solis / EV UIT):** `5 = L1 OUT`, `6 = L2 OUT`, `7 = L3 OUT`, `8 = N OUT`
   - *Aandachtspunten:* Draai `10–25 mm²` adereindhulzen vast op `2,5–3,0 Nm`. Laat klem `4 & 8` open op Belgische `3×230V` driehoeknetten (`3P3W`) met `SDM630-M` / `SDM72D-M-2`. **Verwissel nooit Boven (IN) en Onder (OUT)**, anders keren alle afname-/injectietekens om!
3. **CT-aangesloten `SDM630MCT`-klemmen:** Beveilig de spanningsaftakkingen (`0,5A–2A` zekeringen) naar `V1/V2/V3/VN` (`Klem 4, 3, 2, 1`) en sluit `CT1 (20/19 S1/S2)`, `CT2 (18/17)`, `CT3 (16/15)` fase-voor-fase gelijk aan op `L1 / L2 / L3` met correct gerichte CT-pijlen.
4. **RS-485 Communicatie-pinbezetting (Afgeschermd Twisted Pair `CAT5e/CAT6` of `LiYCY`):**

| RS-485-signaal | Klem op Eastron `SDM72D-M` / `SDM630-M` | Topologie 1: Solis `Meter` RJ45 (T568B) | Topologie 2: GEMS USB-RS485 / Gateway |
| :--- | :--- | :--- | :--- |
| **`RS485-A (+)`** | **`A` / `A+` / `485A`** *(Pin `10` op SDM630-V2 Direct; Pin `14` op SDM630MCT; gemarkeerd `A` op SDM72D-M)* | **RJ45 Pin 1 (`Wit/Oranje`)** *(of `MTR485A`)* | Adapter **`A+` / `D+` / `T/R+`** |
| **`RS485-B (-)`** | **`B` / `B-` / `485B`** *(Pin `9` op SDM630-V2 Direct; Pin `13` op SDM630MCT; gemarkeerd `B` op SDM72D-M)* | **RJ45 Pin 2 (`Oranje`)** *(of `MTR485B`)* | Adapter **`B-` / `D-` / `T/R-`** |
| **Scherm / GND** | **`G` / `GND`** *(Negeer de `+ / -` SO-pulsklemmen!)* | **Laat RJ45 Pin 3 – 8 Open** | Adapter **`GND`** (`120 Ω` bij > 30 m) |

### 3.4 Configuratie: LCD-menu van de Meter, SolisCloud App & GEMS

1. **Stap 1 — Stel het LCD-menu van de `SDM72D-M` / `SDM630-M` in (Standaardwachtwoord: `1000`):**
   - **Ontgrendel `SDM630-M`:** Houd **`E`** `3s` ingedrukt tot `PASS` (`0000`) verschijnt → voer met `U / P` **`1000`** in (`E` gaat naar het volgende cijfer, houd `E` 3s ingedrukt om te bevestigen).
   - **Ontgrendel `SDM72D-M` / `SDM72D-M-2`:** Houd de voorste knop `~3s` ingedrukt tot het wachtwoordscherm verschijnt → kort drukken verhoogt het cijfer / lang drukken verschuift naar het volgende cijfer om **`1000`** in te voeren en het instelmenu te openen.
   - **Stel de vereiste parameters in:**
     - **Modbus-adres (`Addr` / `Add`):** **`001`** *(of `002` ENKEL wanneer doorgelust op dezelfde GEMS USB-RS485-bus naast Solis op ID `1`)*.
     - **Baudrate (`bAud` / `baud`):** **`9600`** (`9.6k`).
     - **Pariteit (`PrtY` / `Par`):** **`nO` / `none`** (`8N1` — controleer dat deze NIET op `Even` staat!).
     - **Netsysteem (`SYS` op `SDM630-M` / `SDM72D-M-2`):** **`3P4`** (`3×400V+N`), **`3P3`** (Belgisch `3×230V` driehoek zonder N) of **`1P2`** (`1×230V`).
     - **CT-verhouding (`Ct` enkel op `SDM630MCT`):** Stem af op de geplaatste spoelen (`100A/5A = 20`, `200A/5A = 40`).
   - Houd **`E`** ingedrukt (of wacht 10s bij `SDM72D-M`) om terug te keren naar het live `kW`-scherm en controleer dat het **telefoonhoorntje (`📞`)** verschijnt zodra de RS-485-communicatie loopt!
2. **Stap 2 — Stel de SolisCloud App in (Topologie 1 — Bekabeld naar Solis `Meter`-poort):**
   - Verbind via Bluetooth (**Me → More Tools → Local Operation**) als **Installer**, open **`Advanced Settings → Storage Energy Set → Meter Set`** en stel in:
     - **Meter Type:** **`Eastron 3P`** (of **`SDM630`** — werkt zowel voor `SDM630-M` als `SDM72D-M` / `SDM72D-M-2`!).
     - **Meter Placement:** **`Meter in Grid`**.
   - Controleer onder **`Information → Meter Info`** dat er geen `Meter_Comm_FAIL`-alarm actief is en dat een waterkokertest van ~2 kW een positieve netafname laat zien.
3. **Stap 3 — Configureer in GEMS (`Instellingen → Toestellen`):**
   - **Topologie 1 (Aan Solis `Meter`-poort):** Vink **`Grid Meter Connected? = Aangevinkt`** aan op de Solis Hybrid- of Solis Retrofit-kaart in GEMS (voeg *geen* apart Eastron-toestel toe).
   - **Topologie 2 (Rechtstreeks op GEMS):** Voeg een **Slimme Meter** toe (of gebruik **Seriële toestellen detecteren**) met template **`Eastron SDM72D / SMART X96 3-Phase Meter`** (`eastron_sdm72_x96`) of **`Eastron SDM630 3-Phase Meter`** (`eastron_sdm630`), vast pad `/dev/serial/by-id/...` (`9600 None`) of TCP `:502`, `Modbus ID = 1` (of `2` op gedeelde bus), `Poll Interval = 2s` en `Phase Wiring = L1-L2-L3`.

---

## 4. Solis Verbinden met GEMS (RS-485 vs. `S2-WL-ST` LAN-stick)

- **Optie A (Gouden Standaard — Directe USB-naar-RS485 of Industriële RS-485 Ethernet-gateway):**
  - Sluit een afgeschermde twisted-pair-kabel (`9600 bps, 8N1`, Slave ID `1`) aan op de aparte interne `RS485 / Modbus`-poort van de Solis S6, zodat de externe SolisCloud-stick ongemoeid blijft.
  - Op ronde 4-polige `COM`-stekkers (`S5` / `RAI` of via RS-485-splitter): **Pin 3 (Geel) = `RS485A (+)`**, **Pin 4 (Blauw) = `RS485B (-)`**, optioneel **Pin 2 (Zwart) = `GND`**. **Sluit Pin 1 (`+5V` Rood) NOOIT aan** op een USB-RS485-adapter!
  - Biedt uiterst stabiele `2–3s` lokale closed-loop sturing zonder wifi-vertraging.
- **Optie B (`S2-WL-ST` Dual Wi-Fi/LAN-stick of `DLS-L` LAN-stick):**
  - Steek een Ethernet RJ45-kabel in de `S2-WL-ST`, maak een vaste DHCP-reservering in de router en verbind GEMS via Modbus TCP op poort `502` (`5s` Poll Interval, maximaal één lokale TCP-master).
  - *Let op:* Eenvoudige Wi-Fi-only `S3-WiFi-ST`-sticks sturen uitsluitend data uit naar de cloud en negeren alle lokale verbindingen op poort `502` (`i/o timeout`, zelfs al is de stick zichtbaar in de router). Heeft een `S2-WL-ST` oudere firmware (`< 100121cf` / `100141dx`), vraag dan bij Solis Support de lokale Modbus TCP-firmware-update aan of bekabel via Optie A (directe RS-485).

---

## 5. Verplichte Instellingen in de SolisCloud App (Lokale Bluetooth-inbedrijfstelling)

Ga met ingeschakelde Bluetooth naast de omvormer staan, open **SolisCloud App → Me → More Tools → Local Operation / Local Debugging → Connect with Bluetooth**, log in met uw **Solis Installer**-account en stel in:

| Menu in SolisCloud | Parameter | Vereiste Instelling | Technische Reden |
| :--- | :--- | :--- | :--- |
| `Storage Energy Set -> Battery Select` | **Battery Type / Model** | **`Lithium Battery` → Model: `Lithium Battery LV`** *(Kies **NIET** `PYLON LV`!)* | Bouwt de 500 kbps CAN-verbinding op via Pin 4 & 5. **Belangrijk:** De Easyway `UNIV5200` werkt **NIET** met `PYLON LV`. Controleer dat `Information -> BMS Info = Normal` live SOC % en stroomgrenzen toont! |
| `Battery Select` | **Overdischarge SOC** | **`10 %`** *(`15–20%` bij gebruik Backup-poort)* | Komt overeen met 90% DoD van Easyway voor optimale cellevensduur. |
| `Battery Select` | **Forcecharge SOC** | **`5 %`** *(Houd ≥5% onder Overdischarge!)* | **Voorkomt nachtelijk jojo-bijladen uit het net!** Een marge van 5% onder `Overdischarge SOC` voorkomt dat 1% sluimerdaling een geforceerde AC-lading triggert. |
| `Battery Select` | **Max Charge / Discharge Current** | **`50 A × Aantal Pakketten`** *(begrensd op max. omvormerstroom)* | Ontgrendelt het volledige continue vermogen (`50 A` = 1 pakket, `100 A` = 2 pakketten, `150 A` = 3 pakketten). |
| `Storage Mode Select` | **Work Mode** | **`Self-Use = ON`** *(Alle TOU-tijdsloten, Backup Reserve & Feed-in Priority = `OFF`)* | Vormt een schone autonome terugvalbasis zonder interne timerconflicten met GEMS (GEMS wist bij het verbinden eenmalig ook automatisch conflicterende `TOU`-, `Backup Reserve`- en `Feed-in Priority`-bits met behoud van `Off-Grid EPS` en `Wake-Up`). |
| `Storage Mode Select` | **Allow Grid Charging** | **`Allow / Enable`** | Geeft hardwaretoestemming voor GEMS Day-Ahead spotladen en winterbijladen zonder spontaan netladen tijdens reguliere `Self-Use`. |
| `Meter Set` | **Meter Type & Placement** | **`Eastron 3P` (`SDM630` / `SDM72D-M`) of `Acrel`** • **`Meter in Grid`** | Zorgt voor exacte fase- en netmeting (`Addr 001, 9600 8N1`). |
| `Export Power Set (Internal EPM)` | **Backflow Power Limit** | **`OFF (Unlimited)`** *(tenzij verplicht door netbeheerder)* | Laat rendabele export en Groenestroomcertificaten vrij terwijl GEMS bij negatieve prijzen dynamisch terugregelt. |
| `Communication` | **Modbus Address & Baud** | **`Address = 1`** • **`9600 bps, 8N1`** | Sluit naadloos aan op de standaardinstellingen in GEMS. |

---

## 6. Solis Hybride vs. Solis Retrofit Toevoegen in GEMS

Ontgrendel de **Gecertificeerde installateursmodus** (hangsloticoon 🔒 in **Instellingen**):

1. **Voeg de Hoofdmeter toe:** Voeg uw **P1 Serial Meter** (`p1_serial`) — of uw rechtstreeks op GEMS aangesloten **Eastron `SDM72D-M` / `SDM630-M`** (`eastron_sdm72_x96` / `eastron_sdm630` volgens Sectie 3 Topologie 2) — toe onder **Slimme Meter**.
2. **Kies de Juiste Solis-hardwaretemplate (`Instellingen -> Toestellen`):**
   - **Solis Hybride (`S5-EH1P`, `S6-EH1P`, `S6-EH3P-L` met DC-zonnepanelen + `UNIV5200`):** Kies **Omvormer / Zon → `Solis S5/S6 Hybrid Inverter`** (`solis_hybrid`). Leest pure DC-zonneproductie los van het AC-vermogen uit en ondersteunt `0,1%` actieve PV-terugregeling (`Allow Curtailment = Aangevinkt`).
   - **Solis AC-gekoppelde Retrofit (`RAI-3K-48ES-5G`, `S6-EA1P-L` naast een bestaande zonne-omvormer):** Voeg uw bestaande zonne-omvormer toe onder **Omvormer / Zon** (`Battery Connected? = Uitgevinkt`) en voeg de Solis Retrofit toe onder **Batterij → `Solis Retrofit Storage System`** (`solis_retrofit_battery`) — of onder **Omvormer / Zon → `Solis Retrofit Inverter (AC Storage)`** (`solis_retrofit`) — met **`Grid Meter Connected? = Aangevinkt`** wanneer een Eastron/Acrel-meter of CT op de Solis `Meter`-poort zit zonder aparte P1-meter op GEMS.
3. **Belangrijkste Formuliervelden:**
   - **Endpoint:** Vast pad `/dev/serial/by-id/...` (`9600 8N1`) of gereserveerd `S2-WL-ST` IPv4-adres op poort `502`, `Modbus ID = 1`.
   - **Rated Power (kW):** Exact AC-typeplaatvermogen (`3.0`, `3.6`, `5.0`, `6.0`, `10.0`).
   - **Poll Interval:** `2–3s` (Directe RS-485 / Gateway) of `5s` (`S2-WL-ST`).
   - **Phase Wiring:** Exacte fase van de automaat (`L1`, `L2` of `L3`) voor 1-fasemodellen op een 3-fasenbord, of `L1-L2-L3` voor de `S6-EH3P-L` (GEMS past op `Auto / Default` automatisch veilige 1-fasige `230 V`-zekeringsbewaking toe; het kiezen van de exacte fase voorkomt afremmen door belasting op andere fasen).
   - **Grid Meter Connected?:** `Aangevinkt` als er een Eastron `SDM72D-M`, `SDM630-M` of Acrel-meter op de Solis `Meter`-poort is aangesloten; anders `Uitgevinkt`.
   - **Battery Connected? & Capacity (kWh):** `Aangevinkt` + totaal geïnstalleerde `UNIV5200`-capaciteit (`5.2` voor 1×, `10.4` voor 2×, `15.7` voor 3×, `20.9` voor 4×).
4. **Automatische Controle van Firmware, Model & BMS-profiel:** Zodra het toestel **`● Online`** is, leest en toont GEMS automatisch het gedetecteerde **Solis-hardwaremodel**, **serienummer**, de **Omvormer** DSP/HMI-firmwareversie (bijv. `4C0050 (DSP 50 / HMI 4C)`) en het ingestelde **BMS**-batterijprofiel (bijv. `Lithium Battery LV` t.o.v. `PYLON_LV`) rechtstreeks op de toestelkaart onder `Instellingen -> Verbonden Toestellen`, in **Debug** en onder **Verbonden Modbus- & Netwerkhardware** in **GRID-EMS-SERVER** — zodat een foutief gekozen `PYLON_LV`-profiel lokaal én op afstand meteen zichtbaar is.

---

## 7. Optimale GEMS-strategie & Samenwerking met EV-laadpalen

1. **Zonneprognose & Hoofdzekeringsbewaking (`Instellingen -> Strategie`):** Schakel **Open-Meteo Solar Forecast Ingestion** in, vul de exacte hoofdzekering (`25A / 32A / 40A`) en het netsysteem (`1x230V`, `3x400V` of `3x230V Delta`) in, en houd `Meter Offline Fallback = 0 A`.
2. **Regionale Strategiemodus:**
   - **Vlaanderen (`Flanders Mode`):** `Capacity Peak Limit = 2,5 kW`, `Peak Shaving Buffer = 150–200 W` en vul eventuele **Groenestroomcertificaten (GSC)** (`€/MWh`) in zodat certificaatgerechtigde installaties nooit voortijdig worden teruggeregeld.
   - **Nederland (`Netherlands Mode`):** Schakel `Active Inverter Curtailment` (`0,00 €/kWh` drempel) in om absorptie in Easyway + EV voorrang te geven en negatieve terugleverkosten te vermijden.
3. **UNIV5200-arbitrage, Flashbescherming & Wintergereedheid:**
   - `Charging Strategy Mode` = **`Dynamic 24h Forecast`**
   - `Battery Wear Cost` = **`0,04 €/kWh`** *(beschermt tegen onrendabele microcycli)*
   - `Winter / Low-Solar Grid Charge Fallback` = **`Aangevinkt`** (`Trigger 25%` → `Doel 65%` verspreid over de `2–3 goedkoopste uren`)
   - *EEPROM-veilige aansturing:* GEMS stuurt Solis uitsluitend aan via vluchtige RAM Remote Control-registers met een 60-seconden watchdog-keepalive — nul slijtage van het niet-vluchtige flashgeheugen!
4. **Samenwerking met EV-laadpalen (bijv. Raedian Wallbox) & Piek-netlaadbeveiliging:** Zodra GEMS het laden uit het net aanstuurt (`Now` of gepland/goedkoopste-uren `Eco`) op uw **Raedian**-laadpaal — of ongecommandeerd netladen van de omvormer vanaf `≥ 10%` SOC buiten toegestane daluren detecteert — grijpt GEMS automatisch in met P1-zelfverbruiksontlading of een actieve `0 W` Remote Control-blokkering (`43135=1, 43136=0, 43129=0`, met behoud van `< 10%` SOC BMS-celbescherming) zodat Solis de batterij niet in de wagen ontlaadt en geen dure piekstroom trekt. Voor niet-gekoppelde verbruikers kunt u onder **Regelgebaseerde Batterij-kostenoptimalisatie** eveneens een **`Hold (Vasthouden / Niet ontladen)`**-regel toevoegen (bijv. `01:00 – 05:00`) om 100% van uw `UNIV5200`-reserve voor de ochtend te bewaren!
