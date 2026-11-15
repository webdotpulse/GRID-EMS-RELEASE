# GEMS : Manuel de Câblage & de Mise en Service des Onduleurs Solis Retrofit / Hybrides & Batteries Easyway 5200 (`UNIV5200`)

> 🌐 **Langue / Taal / Language:** [English](../solis_easyway_manual.md) | [Nederlands](../nl/solis_easyway_manual.md) | **Français**

Ce guide complet destiné aux électriciens et aux particuliers détaille **le câblage de puissance DC, l'équilibrage parallèle diagonal ou sur jeu de barres, le brochage RJ45 CAN et les commutateurs DIP `ADD`** entre la **batterie Easyway 5200 (`UNIV5200`, 51,2V 102Ah LiFePO4)** et les **onduleurs basse tension Solis Retrofit / Hybrides**, le raccordement et la configuration des compteurs **Eastron `SDM72D-M` & `SDM630-M`**, les réglages requis dans l'**application SolisCloud** et l'optimisation dans **GRID-EMS (GEMS)**.

> [!TIP]
> **Télécharger le Manuel de Terrain Imprimable (PDF) :**
> - 📕 **[Manuel Solis Retrofit / Hybride & Easyway UNIV5200 (PDF)](../../manuals/fr/gems-solis-easyway-manual-fr.pdf)**
> - 💻 **[Guide Web Interactif Solis & Easyway](../../manuals/fr/solis.html)**
> - 🛠️ **[Portail de Documentation GEMS](../../manuals/fr/index.html)**

---

## 1. Garde-Fous de Tension, Onduleurs Solis Compatibles & Dimensionnement

L'**Easyway 5200 (`UNIV5200`)** est un module batterie **LiFePO4 Basse Tension de 51,2 V nominal (classe 48 V)** (`102 Ah`, `5,22 kWh` bruts / `~4,70 kWh` utiles à 90 % DoD, `44,8–57,6 Vdc`, refroidissement passif intérieur `IP20`, extensible jusqu'à **16 modules en parallèle = 83,52 kWh**).

> [!CAUTION]
> **GARDE-FOU CRITIQUE DE COMPATIBILITÉ EN TENSION :**
> - **Ne câblez JAMAIS des packs Easyway `UNIV5200` en série !** Les bancs multi-batteries (2 à 16 modules) doivent être raccordés **strictement en parallèle 51,2 V** (`P+` sur `P+`, `P-` sur `P-`).
> - **Ne raccordez JAMAIS des batteries `UNIV5200` sur des onduleurs Solis Haute Tension (`-H`)** (tels que `S6-EH3P(5-20)K-H` ou `RHI-3P-HVES`, conçus pour `160–600 Vdc`). Vérifiez systématiquement le suffixe basse tension **`-L`** ou **`48ES / 48V`** sur la plaque signalétique Solis !

### 1.1 Modèles Solis BT Compatibles, Nombre de Modules & Disjoncteurs DC

Chaque module `UNIV5200` recommande **`50 A` continus en charge/décharge (~`2,56 kW` par pack)** et jusqu'à `100 A` crête. Associer un seul pack `UNIV5200` à un onduleur Solis de 5 kW+ conduit le BMS à plafonner en sécurité la puissance continue autour de ~2,56 kW. Installer **2 modules ou plus en parallèle (`10,44 kWh+`, `100 A+`)** débloque la pleine puissance continue de 5 kW+ pour l'écrêtage de pointe et la charge spot :

| Série d'Onduleurs Solis BT | Architecture & Modèle GEMS | Courant Batt. Max. | Empilement `UNIV5200` Recommandé | Section DC Principale & MCCB DC Externe |
| :--- | :--- | :--- | :--- | :--- |
| **`Solis RAI-3K-48ES-5G`** (3,0 kW 1P) | Retrofit Couplé AC (`solis_retrofit`) | `60 A` (~3,0 kW) | **1 – 3× `UNIV5200`** (`5,22 – 15,66 kWh`) | Cuivre `25 mm²` • MCCB DC **100 A** |
| **`Solis S6-EA1P(3.6–6)K-L`** (1P) | Retrofit Couplé AC (`solis_retrofit`) | `75 A – 125 A` | **2 – 4× `UNIV5200`** (`10,44 – 20,88 kWh`) | Cuivre `35 mm²` • MCCB DC **125 A – 160 A** |
| **`Solis S5-EH1P(3–6)K-L`** (1P) | Hybride PV + Stockage (`solis_hybrid`) | `62,5 A – 100 A` | **2 – 4× `UNIV5200`** *(1× limité à ~2,56 kW)* | Cuivre `25 – 35 mm²` • MCCB DC **125 A** |
| **`Solis S6-EH1P(3–8)K-L-PLUS / PRO`** | Hybride PV + Stockage (`solis_hybrid`) | `70 A – 190 A` | **2 – 6× `UNIV5200`** *(≥3× pour 8 kW cont.)* | Cuivre `35 – 50 mm²` • MCCB DC **160 A – 250 A** |
| **`Solis S6-EH3P(5–10)K-L` / `NV-YD-L`** | Hybride BT Triphasé (`solis_hybrid`) | `120 A – 290 A` | **3 – 8× `UNIV5200`** *(via jeu de barres DC)* | Cuivre `50 – 70 mm²` • MCCB DC **200 A – 300 A** |

---

## 2. Guide de Câblage Pas à Pas : Easyway `UNIV5200` vers Onduleur Solis

Exécutez tout le câblage de puissance, de terre, des commutateurs DIP et de communication avec le disjoncteur AC Solis, le sectionneur DC PV, le MCCB DC externe et tous les interrupteurs des modules `UNIV5200` strictement sur **OFF**.

### 2.1 Puissance DC, Protection Externe & Équilibrage Parallèle

1. **Disjoncteur MCCB DC Bipolaire Non Polarisé / Sectionneur à Fusibles :**
   - Installez un **MCCB DC bipolaire non polarisé dédié ou un interrupteur-sectionneur à fusibles NH00 `gBat`** (`≥ 80 Vdc`, `100 A – 300 A` selon la Section 1.1) entre le parc batterie et les bornes `BAT+` / `BAT-` du Solis. N'utilisez jamais de disjoncteurs AC polarisés sur un circuit batterie bidirectionnel.
2. **Module Unique (`1× UNIV5200` — 5,22 kWh) :**
   - Tirez deux câbles souples en cuivre multibrins de longueur égale (`25 mm²` ou `35 mm²`) depuis `P+` (Rouge) et `P-` (Noir) à travers le MCCB DC 2P jusqu'aux bornes `BAT+` et `BAT-` du Solis.
3. **2 à 3 Modules en Parallèle — Méthode d'Équilibrage Diagonal (Prise Croisée) :**
   - Reliez `P+` à `P+` et `P-` à `P-` entre les modules avec des ponts de longueur strictement identique.
   - Raccordez le câble principal **`BAT+`** allant vers l'onduleur Solis sur le **`P+` du Pack 1 (Maître)** et raccordez le câble principal **`BAT-`** allant vers l'onduleur Solis sur le **`P-` du DERNIER Pack** (Pack 2 ou Pack 3). Cette prise croisée égalise l'impédance de boucle afin que le Pack 1 ne subisse ni surintensité ni vieillissement prématuré.
4. **4 à 16 Modules en Parallèle — Jeu de Barres DC en Cuivre Étamé (Obligatoire > 3 Packs) :**
   - Montez des **jeux de barres DC Positif et Négatif en cuivre étamé** (`250 A – 400 A`). Raccordez chaque `UNIV5200` (`P+` et `P-`) aux barres par des liaisons protégées de longueur identique (`25 mm²`), puis rejoignez l'onduleur Solis en `35 mm² – 70 mm²` via le MCCB DC général.
5. **Serrage des Cosses & Terre de Protection (`⏚ PE`) :**
   - Encliquetez à fond les connecteurs **Amphenol SurLok Plus** jusqu'au verrouillage mécanique, ou serrez au couple de `5–8 Nm` les cosses tubulaires `M6 / M8`.
   - Reliez la borne de masse châssis (`⏚`) de chaque `UNIV5200` et du bâti à la barre PE du Solis en fil de terre vert/jaune `≥ 6 mm²`.

### 2.2 Brochage du Câble RJ45 CAN BMS (Port `CAN` Maître Pack 1 ↔ Port `BMS` Solis)

La communication en boucle fermée entre le Pack 1 (Maître) et l'onduleur Solis s'effectue sur **bus CAN 500 kbps** via câble blindé CAT5e/CAT6 :

| Broche RJ45 | Couleur Standard T568B | Port `BMS / CAN` Solis | Port `CAN` Easyway `UNIV5200` | Câblage Recommandé |
| :---: | :--- | :--- | :--- | :--- |
| **Broches 1 – 3** | Blanc-Orange / Orange / Blanc-Vert | NC / Enable GND / RS485-B | Réservé / Bus interne | **Laisser Ouvert / Non connecté** |
| **Broche 4** | **Bleu** | **`CAN-H` (CAN High)** | **`CAN-H` (CAN High)** | **Relier Broche 4 ↔ Broche 4** |
| **Broche 5** | **Blanc / Bleu** | **`CAN-L` (CAN Low)** | **`CAN-L` (CAN Low)** | **Relier Broche 5 ↔ Broche 5** |
| **Broches 6 – 8** | Vert / Blanc-Marron / Marron | RS485-A / **Broche 7 : +12V Enable** | Réservé / Bus interne | **Laisser Ouvert / Non connecté** |

> [!IMPORTANT]
> **Isoler les Broches 4 & 5 sur les Cordons CAN Sertis sur Mesure :** Le port `BMS` Solis délivre un `+12V Enable` sur la **broche 7** et des signaux RS-485 sur les **broches 3 & 6**. Utiliser le cordon CAN fourni avec l'onduleur — ou sertir un câble RJ45 blindé ne reliant **que la broche 4 (`CAN-H`) et la broche 5 (`CAN-L`)** — évite toute réinjection de `+12V` vers les broches internes du BMS batterie. *(Vérifiez toujours la fiche technique fournie avec votre lot `UNIV5200`).*

### 2.3 Chaînage Inter-Modules & Tableau Binaire des Commutateurs DIP `ADD`

- **Cordons de Liaison Inter-Packs :** Chaînez des cordons droits standard CAT5e/CAT6 depuis **Pack 1 (Maître) `RS485-B / Link Out`** → **Pack 2 (Esclave 1) `RS485-A / Link In`**, Pack 2 Out → Pack 3 In, etc. Laissez le port `CAN` vide sur tous les modules esclaves — **seul le Pack 1 (Maître) est relié à l'onduleur Solis**.
- **Commutateurs DIP Binaires `ADD` (Réglage Strictement Hors Tension OFF) :** Lecture de gauche à droite (`SW1`..`SW4`, où `ON = 1`, `OFF = 0` ; sur les blocs à 6 pôles laissez `SW5` & `SW6` sur `OFF` sauf mention contraire de la notice) :

| Rôle du Module `UNIV5200` | SW 1 | SW 2 | SW 3 | SW 4 | Code Binaire | Rôle de Connexion |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Pack Unique ou Maître (Pack 1)** | `OFF` | `OFF` | `OFF` | `OFF` | **`0000`** | `CAN` vers Solis `BMS` + `Link Out` vers Pack 2 |
| **Esclave 1 (Pack 2 — 10,44 kWh)** | **`ON`** | `OFF` | `OFF` | `OFF` | `1000` | `Link In` du Pack 1, `Link Out` vers Pack 3 |
| **Esclave 2 (Pack 3 — 15,66 kWh)** | `OFF` | **`ON`** | `OFF` | `OFF` | `0100` | `Link In` du Pack 2, `Link Out` vers Pack 4 |
| **Esclave 3 (Pack 4 — 20,88 kWh)** | **`ON`** | **`ON`** | `OFF` | `OFF` | `1100` | `Link In` du Pack 3, `Link Out` vers Pack 5 |
| **Esclave 4 (Pack 5 — 26,10 kWh)** | `OFF` | `OFF` | **`ON`** | `OFF` | `0010` | Parallèle sur jeu de barres DC cuivre |
| **Esclave 5 (Pack 6 — 31,32 kWh)** | **`ON`** | `OFF` | **`ON`** | `OFF` | `1010` | Parallèle sur jeu de barres DC cuivre |
| **Esclaves 6 – 15 (Packs 7 – 16)** | `0/1` | `0/1` | `0/1` | `0/1` | `0110..1111` | Suite binaire (`0110`, `1110`, `0001` … `1111`) jusqu'à 83,52 kWh |

### 2.4 Séquence Obligatoire de Démarrage Progressif (Soft-Start) & d'Arrêt

1. **Mise sous tension :**
   - Contrôlez la polarité DC à froid au multimètre (tous les interrupteurs sur OFF).
   - Enclenchez les disjoncteurs individuels des packs `UNIV5200` sur **ON** et fermez le **MCCB DC bipolaire externe** alors que les LED du BMS sont encore éteintes.
   - Maintenez enfoncé le **bouton `SW / POWER` du Pack 1 (Maître) pendant `2 à 3 secondes`** afin que la résistance interne de précharge charge en douceur les condensateurs du bus DC Solis (LED verte `RUN` allumée, LED rouge `ALM` éteinte ; les packs esclaves se réveillent automatiquement).
   - Enclenchez le sectionneur DC PV Solis sur **ON** (modèles hybrides), puis fermez le disjoncteur AC réseau Solis sur **ON**.
2. **Mise hors tension (Ordre inverse) :** Disjoncteur AC réseau **OFF** → Sectionneur DC PV **OFF** → Maintenez le bouton `SW` Maître 3 s jusqu'à extinction de tous les modules → Ouvrez le MCCB DC externe sur **OFF**.

---

## 3. Raccorder & Configurer un Compteur Intelligent Eastron `SDM72D-M` ou `SDM630-M`

Les compteurs triphasés bidirectionnels Modbus RTU 4 modules DIN d'Eastron — **`SDM72D-M`** (ainsi que le **`SDM72D-M-2`** à mesure directe jusqu'à `80 A / 100 A`) et **`SDM630-M`** (**`SDM630-Modbus V2/V3`** direct `80 A / 100 A` ou **`SDM630MCT`** sur tores CT) — partagent la même table de registres IEEE-754 `Float32` (`0x0000–0x004A`) et s'intègrent nativement aux onduleurs Solis comme à GEMS.

### 3.1 Choix du Modèle & Règle Triphasée

- **`Eastron SDM630-M` (`SDM630-Modbus V2 / V3`) :** Raccordement direct jusqu'à `80 A / 100 A`. Compatible **`3P4W` (`3×400V+N`)**, réseau belge **`3P3W` (`3×230V` Triangle sans neutre)** et **`1P2W` (`1×230V`)**. Pris en charge nativement par Solis (`Eastron 3P` / `SDM630`) et GEMS (`eastron_sdm630`).
- **`Eastron SDM72D-M-2` (et `SDM72D-M`) :** Raccordement direct jusqu'à `80 A / 100 A`. Le **`SDM72D-M-2` (V2)** expose l'ensemble des registres `V / I / W` par phase à l'identique du `SDM630-M` et gère le `3P4W` / `3P3W`. *(Remarque : L'ancienne version V1 `SDM72D-M` exige un neutre `3P4W` et n'expose pas toujours les tensions/courants par phase — privilégiez le `SDM72D-M-2` ou le `SDM630-M` sur le port `Meter` Solis et pour le DLB VE triphasé).*
- **`Eastron SDM630MCT` :** Variante à tores ouvrants externes (`100A–600A / 5A` ou `mV`) destinée aux arrivées `> 100 A` ou aux tableaux existants où l'arrivée principale ne peut être décâblée.
- **Onduleur Solis Monophasé sur Réseau Triphasé :** Même avec un onduleur Solis monophasé (`RAI-3K-48ES-5G`, `S6-EA1P-L`, `S5-EH1P-L`, `S6-EH1P-L`) dans une habitation triphasée, installez toujours un **compteur triphasé `SDM630-M` ou `SDM72D-M-2`** en tête d'installation afin de sommer le bilan net sur `L1 + L2 + L3`.

### 3.2 Deux Topologies RS-485 Compatibles (Règle du Maître Unique !)

> [!CAUTION]
> **Ne raccordez JAMAIS deux maîtres Modbus RTU simultanément sur le même compteur !** Ne branchez jamais à la fois le port `Meter` Solis ET un adaptateur USB-RS485 GEMS sur les mêmes bornes `A+ / B-` d'un `SDM72D-M` ou `SDM630-M` — les collisions de trames provoquent immédiatement l'alarme `Meter_Comm_FAIL`. Choisissez la **Topologie 1** ou la **Topologie 2** :

- **Topologie 1 (Standard Recommandé — Câblé sur le Port RJ45 `Meter` Solis) :** Reliez le `SDM72D-M` / `SDM630-M` au port `Meter` de l'onduleur Solis. Solis assure sa boucle matérielle `Self-Use` sous la seconde et transmet la puissance réseau (`33130–33131`) ainsi que les tensions/courants triphasés (`33251–33262`) à GEMS lorsque `Grid Meter Connected? = Coché`. *(Vous pouvez en parallèle brancher un câble P1 USB sur GEMS).*
- **Topologie 2 (Directement sur GEMS — Sites Dépourvus de Port P1) :** Câblez un `SDM72D-M` / `SDM630-M` dédié directement sur GEMS via **USB-RS485** (`/dev/serial/by-id/...`) ou une **passerelle Ethernet RS-485** (`Port 502`) avec le modèle GEMS `eastron_sdm72_x96` ou `eastron_sdm630`. *(Option Multi-Drop : chaînez le compteur dédié à GEMS en **Modbus ID `2`** sur le même bus USB-RS485 que l'onduleur Solis Option A en **Modbus ID `1`**, `9600 8N1`).*

### 3.3 Raccordement : Puissance AC, Tores CT & Brochage RS-485

1. **Positionnement dans le Tableau Électrique (Critique en Retrofit & Hybride) :** Installez le compteur **immédiatement en aval du compteur GRD / différentiel général**, strictement **en amont** de tous les départs domestiques, pompes à chaleur, bornes **Raedian**, onduleurs PV existants et du disjoncteur AC Solis afin de mesurer l'intégralité des flux.
2. **Bornes AC à Raccordement Direct (`SDM72D-M` / `SDM72D-M-2` & `SDM630-M`, jusqu'à 100 A) :**
   - **Bornes Supérieures (Arrivée Réseau IN) :** `1 = L1 IN`, `2 = L2 IN`, `3 = L3 IN`, `4 = N IN`
   - **Bornes Inférieures (Départ Maison / PV / Solis / VE OUT) :** `5 = L1 OUT`, `6 = L2 OUT`, `7 = L3 OUT`, `8 = N OUT`
   - *Consignes de serrage :* Serrez les embouts cuivre `10–25 mm²` entre `2,5 et 3,0 Nm`. Laissez les bornes `4 & 8` libres en réseau belge `3×230V` Triangle (`3P3W`) sur `SDM630-M` / `SDM72D-M-2`. **N'inversez jamais Haut (IN) et Bas (OUT)** sous peine d'inverser les signes import/export !
3. **Bornes sur Tores `SDM630MCT` :** Protégez les prises de tension (`fusibles 0,5A–2A`) vers `V1/V2/V3/VN` (`Bornes 4, 3, 2, 1`) et raccordez `CT1 (20/19 S1/S2)`, `CT2 (18/17)`, `CT3 (16/15)` en stricte correspondance de phase `L1 / L2 / L3` et de sens des flèches CT.
4. **Brochage Communication RS-485 (Paire Torsadée Blindée `CAT5e/CAT6` ou `LiYCY`) :**

| Signal RS-485 | Borne Eastron `SDM72D-M` / `SDM630-M` | Topologie 1 : RJ45 `Meter` Solis (T568B) | Topologie 2 : USB-RS485 / Passerelle GEMS |
| :--- | :--- | :--- | :--- |
| **`RS485-A (+)`** | **`A` / `A+` / `485A`** *(Broche `10` SDM630-V2 Direct ; Broche `14` SDM630MCT ; repère `A` SDM72D-M)* | **Broche RJ45 1 (`Blanc/Orange`)** *(ou `MTR485A`)* | Adaptateur **`A+` / `D+` / `T/R+`** |
| **`RS485-B (-)`** | **`B` / `B-` / `485B`** *(Broche `9` SDM630-V2 Direct ; Broche `13` SDM630MCT ; repère `B` SDM72D-M)* | **Broche RJ45 2 (`Orange`)** *(ou `MTR485B`)* | Adaptateur **`B-` / `D-` / `T/R-`** |
| **Blindage / GND** | **`G` / `GND`** *(Ignorer les bornes d'impulsion SO `+ / -` !)* | **Laisser les Broches RJ45 3 – 8 Ouvertes** | Adaptateur **`GND`** (`120 Ω` si > 30 m) |

### 3.4 Configuration : Menu LCD du Compteur, Application SolisCloud & GEMS

1. **Étape 1 — Configurer le Menu LCD en Façade du `SDM72D-M` / `SDM630-M` (Mot de passe par défaut : `1000`) :**
   - **Déverrouiller le `SDM630-M` :** Maintenez **`E`** pendant `3 s` jusqu'à `PASS` (`0000`) → utilisez `U / P` pour saisir **`1000`** (`E` décale le chiffre, maintenez `E` 3 s pour valider).
   - **Déverrouiller le `SDM72D-M` / `SDM72D-M-2` :** Appui long `~3 s` sur le bouton en façade jusqu'à l'invite mot de passe → appui court pour incrémenter / appui long pour avancer et saisir **`1000`**, puis appui long pour entrer dans le menu Setup.
   - **Régler les Paramètres Requis :**
     - **Adresse Modbus (`Addr` / `Add`) :** **`001`** *(ou `002` UNIQUEMENT en cas de chaînage sur un bus USB-RS485 GEMS partagé avec Solis en ID `1`)*.
     - **Débit (`bAud` / `baud`) :** **`9600`** (`9.6k`).
     - **Parité (`PrtY` / `Par`) :** **`nO` / `none`** (`8N1` — vérifiez qu'elle n'est PAS sur `Even` !).
     - **Régime Réseau (`SYS` sur `SDM630-M` / `SDM72D-M-2`) :** **`3P4`** (`3×400V+N`), **`3P3`** (Triangle belge `3×230V` sans N) ou **`1P2`** (`1×230V`).
     - **Rapport CT (`Ct` sur `SDM630MCT` uniquement) :** Selon les tores installés (`100A/5A = 20`, `200A/5A = 40`).
   - Maintenez **`E`** (ou patientez 10 s sur `SDM72D-M`) pour revenir à l'affichage `kW` et vérifiez l'apparition de l'**icône combiné téléphonique (`📞`)** dès que l'interrogation RS-485 démarre !
2. **Étape 2 — Configurer l'Application SolisCloud (Topologie 1 — Câblé sur le Port `Meter` Solis) :**
   - Connectez-vous en Bluetooth (**Me → More Tools → Local Operation**) en tant qu'**Installer**, ouvrez **`Advanced Settings → Storage Energy Set → Meter Set`** et réglez :
     - **Meter Type :** **`Eastron 3P`** (ou **`SDM630`** — compatible aussi bien avec `SDM630-M` qu'avec `SDM72D-M` / `SDM72D-M-2` !).
     - **Meter Placement :** **`Meter in Grid`**.
   - Contrôlez dans **`Information → Meter Info`** l'absence d'alarme `Meter_Comm_FAIL` et le signe positif d'importation lors d'un essai avec une bouilloire de ~2 kW.
3. **Étape 3 — Configurer dans GEMS (`Paramètres → Appareils`) :**
   - **Topologie 1 (Sur Port `Meter` Solis) :** Cochez **`Grid Meter Connected? = Coché`** sur la fiche Solis Hybrid ou Solis Retrofit dans GEMS (*n'ajoutez pas* de fiche Eastron séparée).
   - **Topologie 2 (Directement sur GEMS) :** Ajoutez un **Compteur intelligent** (ou lancez **Détecter les appareils série**) en sélectionnant **`Eastron SDM72D / SMART X96 3-Phase Meter`** (`eastron_sdm72_x96`) ou **`Eastron SDM630 3-Phase Meter`** (`eastron_sdm630`), chemin `/dev/serial/by-id/...` (`9600 None`) ou TCP `:502`, `Modbus ID = 1` (ou `2` sur bus partagé), `Poll Interval = 2s` et `Phase Wiring = L1-L2-L3`.

---

## 4. Raccorder l'Onduleur Solis à GEMS (RS-485 vs Clé LAN `S2-WL-ST`)

- **Option A (Standard de Référence — Liaison USB-RS485 Directe ou Passerelle Ethernet RS-485 Industrielle) :**
  - Raccordez une paire torsadée blindée (`9600 bps, 8N1`, Slave ID `1`) sur le port interne dédié `RS485 / Modbus` des Solis S6 afin de laisser la clé externe SolisCloud totalement indépendante.
  - Sur les connecteurs circulaires `COM` à 4 broches (`S5` / `RAI` ou via répartiteur RS-485) : **Broche 3 (Jaune) = `RS485A (+)`**, **Broche 4 (Bleu) = `RS485B (-)`**, optionnel **Broche 2 (Noir) = `GND`**. **Ne raccordez JAMAIS la broche 1 (`+5V` Rouge)** à un adaptateur USB-RS485 !
  - Assure un pilotage local en boucle fermée ultra-stable à `2–3 s` sans aucune latence Wi-Fi.
- **Option B (Clé Mixte Wi-Fi/LAN `S2-WL-ST` ou Clé LAN `DLS-L`) :**
  - Branchez un câble Ethernet RJ45 sur la clé `S2-WL-ST`, fixez une réservation DHCP sur le routeur et connectez GEMS en Modbus TCP sur le port `502` (`5 s` d'intervalle, un seul maître TCP local).
  - *Remarque :* Les clés d'entrée de gamme Wi-Fi seul `S3-WiFi-ST` n'émettent que vers le cloud et ignorent toute connexion locale sur le port `502` (`i/o timeout`). Sur les clés `S2-WL-ST` dotées d'un firmware ancien (`< 100121cf` / `100141dx`), demandez au support Solis la mise à jour activant le Modbus TCP local ou câblez l'Option A (RS-485 direct).

---

## 5. Réglages Obligatoires dans l'Application SolisCloud (Bluetooth Local)

Placez-vous près de l'onduleur avec le Bluetooth activé, ouvrez **SolisCloud App → Me → More Tools → Local Operation / Local Debugging → Connect with Bluetooth**, connectez-vous avec votre compte **Solis Installer** et appliquez :

| Chemin Menu SolisCloud | Paramètre | Réglage Requis | Justification Technique |
| :--- | :--- | :--- | :--- |
| `Storage Energy Set -> Battery Select` | **Battery Type / Brand** | **`Lithium Battery` → `PYLON LV`** *(ou `Lithium Battery LV` / `AoBo`)* | Établit le dialogue CAN 500 kbps sur les broches 4 & 5. Vérifiez que `Information -> BMS Info = Normal` affiche le SOC % et les limites ! |
| `Battery Select` | **Overdischarge SOC** | **`10 %`** *(`15–20 %` si port Backup utilisé)* | Correspond au DoD 90 % d'Easyway pour préserver la longévité des cellules. |
| `Battery Select` | **Forcecharge SOC** | **`5 %`** *(Garder ≥5 % sous Overdischarge !)* | **Supprime les micro-recharges nocturnes sur le réseau !** Cet écart de 5 % évite qu'une dérive de veille de 1 % ne déclenche une recharge AC forcée. |
| `Battery Select` | **Max Charge / Discharge Current** | **`50 A × Nombre de Packs`** *(plafonné au courant max onduleur)* | Débloque la pleine puissance continue du banc (`50 A` = 1 pack, `100 A` = 2 packs, `150 A` = 3 packs). |
| `Storage Mode Select` | **Work Mode** | **`Self-Use = ON`** *(Tous les créneaux TOU & Feed-in Priority = `OFF`)* | Fournit un mode autonome propre sans conflit d'horloges internes avec GEMS. |
| `Storage Mode Select` | **Allow Grid Charging** | **`Allow / Enable`** | Autorise matériellement la charge spot Day-Ahead GEMS et le secours hivernal sans charger spontanément en mode `Self-Use`. |
| `Meter Set` | **Meter Type & Placement** | **`Eastron 3P` (`SDM630` / `SDM72D-M`) ou `Acrel`** • **`Meter in Grid`** | Assure le comptage précis au point de livraison (`Addr 001, 9600 8N1`). |
| `Export Power Set (Internal EPM)` | **Backflow Power Limit** | **`OFF (Unlimited)`** *(sauf obligation GRD)* | Autorise l'injection rentable et les Certificats Verts tout en laissant GEMS écrêter dynamiquement à prix négatif. |
| `Communication` | **Modbus Address & Baud** | **`Address = 1`** • **`9600 bps, 8N1`** | Correspond aux paramètres Modbus par défaut de GEMS. |

---

## 6. Intégrer un Solis Hybride vs un Solis Retrofit dans GEMS

Déverrouillez le **Mode installateur certifié** (icône cadenas 🔒 dans **Paramètres**) :

1. **Ajouter le Compteur Principal du Site :** Ajoutez votre **P1 Serial Meter** (`p1_serial`) — ou votre compteur **Eastron `SDM72D-M` / `SDM630-M`** câblé directement sur GEMS (`eastron_sdm72_x96` / `eastron_sdm630` selon la Section 3 Topologie 2) — dans la catégorie **Compteur intelligent**.
2. **Sélectionner le Modèle Matériel Solis Exact (`Paramètres -> Appareils`) :**
   - **Solis Hybride (`S5-EH1P`, `S6-EH1P`, `S6-EH3P-L` avec chaînes PV DC + `UNIV5200`) :** Sélectionnez **Onduleur / Solaire → `Solis S5/S6 Hybrid Inverter`** (`solis_hybrid`). Lit séparément la production PV DC et la sortie AC, et gère l'écrêtement solaire fin à `0,1 %` (`Allow Curtailment = Coché`).
   - **Solis Retrofit Couplé AC (`RAI-3K-48ES-5G`, `S6-EA1P-L` en complément d'un onduleur PV existant) :** Ajoutez d'abord votre onduleur PV existant sous **Onduleur / Solaire** (`Battery Connected? = Décoché`), puis ajoutez le Solis Retrofit sous **Batterie → `Solis Retrofit Storage System`** (`solis_retrofit_battery`) — ou sous **Onduleur / Solaire → `Solis Retrofit Inverter (AC Storage)`** (`solis_retrofit`) — en cochant **`Grid Meter Connected? = Coché`** lorsqu'un compteur Eastron/Acrel ou tore CT est relié au port `Meter` du Solis sans compteur P1 sur GEMS.
3. **Paramètres Clés de la Fiche Appareil :**
   - **Point de terminaison :** Chemin `/dev/serial/by-id/...` (`9600 8N1`) ou IPv4 réservée de la clé `S2-WL-ST` sur le port `502`, `Modbus ID = 1`.
   - **Rated Power (kW) :** Puissance nominale AC exacte (`3.0`, `3.6`, `5.0`, `6.0`, `10.0`).
   - **Poll Interval :** `2–3 s` (RS-485 direct / passerelle) ou `5 s` (`S2-WL-ST`).
   - **Phase Wiring :** Phase exacte du disjoncteur (`L1`, `L2` ou `L3`) pour un modèle monophasé sur tableau triphasé, ou `L1-L2-L3` pour un `S6-EH3P-L`.
   - **Grid Meter Connected? :** `Coché` si un compteur Eastron `SDM72D-M`, `SDM630-M` ou Acrel est raccordé au port `Meter` Solis ; `Décoché` sinon.
   - **Battery Connected? & Capacity (kWh) :** `Coché` + capacité totale installée `UNIV5200` (`5.2` pour 1×, `10.4` pour 2×, `15.7` pour 3×, `20.9` pour 4×).

---

## 7. Stratégie GEMS Optimale & Coordination avec Bornes VE

1. **Prévisions Solaires & Protection Disjoncteur (`Paramètres -> Stratégie`) :** Activez **Open-Meteo Solar Forecast Ingestion**, renseignez le calibre exact du disjoncteur principal (`25A / 32A / 40A`) et le régime réseau (`1x230V`, `3x400V` ou `3x230V Delta`), et conservez `Meter Offline Fallback = 0 A`.
2. **Mode Régional :**
   - **Flandre (`Flanders Mode`) :** `Capacity Peak Limit = 2,5 kW`, `Peak Shaving Buffer = 150–200 W`, et renseignez toute prime **Certificats Verts (GSC)** (`€/MWh`) afin de ne jamais brider prématurément une installation subventionnée.
   - **Pays-Bas (`Netherlands Mode`) :** Activez `Active Inverter Curtailment` (seuil `0,00 €/kWh`) pour absorber le surplus dans l'Easyway et le VE et éviter les frais d'injection négatifs.
3. **Arbitrage UNIV5200, Protection Mémoire Flash & Mode Hiver :**
   - `Charging Strategy Mode` = **`Dynamic 24h Forecast`**
   - `Battery Wear Cost` = **`0,04 €/kWh`** *(protège contre le micro-cyclage non rentable)*
   - `Winter / Low-Solar Grid Charge Fallback` = **`Coché`** (`Seuil 25 %` → `Cible 65 %` sur les `2–3 heures les moins chères`)
   - *Pilotage sans usure EEPROM :* GEMS pilote exclusivement les onduleurs Solis via des registres RAM volatils de télécommande avec maintien de vie toutes les 60 secondes — zéro usure de la mémoire flash non volatile !
4. **Coordination avec une Borne VE (par ex. Raedian) :** Ajoutez une règle **`Hold (Maintien / Sans décharge)`** dans **Optimisation Batterie par Règles Tarifaires** couvrant votre créneau nocturne de charge VE (par ex. `01:00 – 05:00`) afin que votre borne **Raedian** puise exclusivement l'électricité réseau à bas prix sans vider votre batterie `UNIV5200` avant le matin !
