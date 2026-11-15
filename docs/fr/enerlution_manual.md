# GEMS : Manuel de Câblage & de Mise en Service des Onduleurs Hybrides Enerlution & Batteries LiFePO4

> 🌐 **Langue / Taal / Language:** [English](../enerlution_manual.md) | [Nederlands](../nl/enerlution_manual.md) | **Français**

Ce guide complet destiné aux électriciens et aux propriétaires couvre **les deux architectures de stockage Enerlution** — **Basse Tension 51,2 V en Parallèle (`LFPWall-5000`, `LFPWall-10K-V2`, `Roller-16K`)** et **Haute Tension Empilable 150–600 V (`GroundHV-2500`, `GH02-5324` + PDU/BCU)** — incluant le câblage de puissance DC, le brochage RJ45 CAN, l'adressage DIP multi-batteries, le raccordement des compteurs externes RS-485 (`CHINT DTSU666` / `DDSU666` / `Eastron SDM630`), les paramètres requis dans l'**application Enerlution** et l'optimisation dans **GRID-EMS (GEMS)**.

> [!TIP]
> **Télécharger le Manuel de Terrain Imprimable (PDF) :**
> - 📕 **[Manuel Onduleurs Hybrides & Stockage Enerlution (PDF)](../../manuals/fr/gems-enerlution-manual-fr.pdf)**
> - 💻 **[Guide Web Interactif Enerlution](../../manuals/fr/enerlution.html)**
> - 🛠️ **[Portail de Documentation GEMS](../../manuals/fr/index.html)**

---

## 1. Écosystème Enerlution BT vs HT & Matrice de Compatibilité

Contrairement aux marques mono-tension, **Enerlution** fabrique deux classes de tension distinctes. Vérifiez impérativement que votre modèle de batterie correspond à la classe de tension exacte de votre onduleur hybride avant tout câblage :

> [!CAUTION]
> **SÉPARATION CRITIQUE DES TENSIONS — Ne jamais mélanger BT (51,2 V) et HT (150–600 V) !**
> - **Architecture A — Basse Tension 51,2 V (`LFPWall-5000`, `LFPWall-10K-V2`, `Roller-16K`) :** Les bancs multi-modules doivent être câblés **strictement en parallèle 51,2 V** (`P+` sur `P+`, `P-` sur `P-`). Raccordez-les *exclusivement* aux onduleurs hybrides basse tension 48V/51,2V (`Enerlution HY / L3–L6 LV` ou onduleurs 48V compatibles tels que `Solis -L`). Ne branchez **jamais** des packs muraux ou mobiles BT en série !
> - **Architecture B — Haute Tension Empilable (`GroundHV-2500`, `GH02-5324` + PDU/BCU) :** Les modules s'empilent **en série sous une tête de contrôle Haute Tension dédiée PDU / BCU** (`~153 V – 500+ Vdc`). Raccordez-les *exclusivement* aux onduleurs hybrides triphasés Haute Tension (`Enerlution HYTH-5K..12K` / `L5–L12 HV`). Maintenez le sectionneur manuel HT (MSD) et le disjoncteur PDU sur **OFF** et portez des gants isolants HT durant le montage !

### 1.1 Matrice de Dimensionnement Batteries & Onduleurs

| Modèle de Batterie Enerlution | Classe de Tension | Caractéristiques & Capacité Nominale | Charge / Décharge Max. | Onduleur Associé & Protection DC Externe |
| :--- | :--- | :--- | :--- | :--- |
| **`LFPWall-5000`** (Murale LiFePO4) | **51,2V BT Parallèle** | `51,2 Vdc` • `102 Ah` • **`5,22 kWh`** | `40 A` Chg / `75 A` Déch | `Enerlution HY / L3–L6 LV` • `25 mm²` • MCCB DC 2P **125 A** |
| **`LFPWall-10K-V2`** (Murale Haute Cap.) | **51,2V BT Parallèle** | `51,2 Vdc` • `204 Ah` • **`10,44 kWh`** | `90 A` Chg / `140 A` Déch | `Enerlution HY / L3–L6 LV` • `35 mm²` • MCCB DC 2P **160–200 A** |
| **`Roller-16K`** (Module Sol Mobile) | **51,2V BT Parallèle** | `51,2 Vdc` • `314 Ah` • **`16,08 kWh`** | `0,5 C` (~`150 A` / 7,6 kW) | `Enerlution HY / L5–L6 LV` • `35–50 mm²` • MCCB DC 2P **200 A** |
| **`GroundHV-2500 + PDU`** (Tour HT) | ** Tour Série HT** | `51,2 V / 2,5 kWh` par bloc • **`7,5–20+ kWh`** (3–8 blocs) | `~25–50 A` DC HT (`5–12 kW`) | `Enerlution HYTH-5K..12K` (3P HT) • `6–10 mm²` (1000V) via disjoncteur PDU |
| **`GH02-5324 + BCU`** (Grande Tour HT) | **Tour Série HT** | Tour HT modulaire • **`15,0–42,0 kWh`** | `~50 A` DC HT (`10–15+ kW`) | `Enerlution HYTH-8K..12K` (3P HT) • `6–10 mm²` (1000V) via disjoncteur BCU |

---

## 2. Câblage Pas à Pas de la Batterie & du Compteur Intelligent

Réalisez l'intégralité du câblage de puissance, de mise à la terre, des commutateurs DIP, du bus CAN et du compteur RS-485 avec le disjoncteur AC réseau, l'interrupteur-sectionneur DC PV, le MCCB DC externe / disjoncteur PDU HT et tous les interrupteurs batterie strictement sur **OFF**.

### 2.1 Architecture A — Câblage des Packs Parallèles BT 51,2 V (`LFPWall` & `Roller`)

1. **Disjoncteur MCCB DC Bipolaire Non Polarisé Externe :** Installez un disjoncteur DC bipolaire non polarisé (MCCB) ou un sectionneur à fusibles `gBat` (`≥ 80 Vdc` ; `100–125 A` pour `LFPWall-5000`, `160–200 A` pour `LFPWall-10K-V2` ou `Roller-16K`) entre le parc batterie et les bornes `BAT+ / BAT-` de l'onduleur. N'utilisez jamais de disjoncteurs AC polarisés sur un circuit batterie DC bidirectionnel.
2. **2 à 3 Packs en Parallèle — Règle d'Équilibrage Diagonal (Prise Croisée) :** Reliez `P+` à `P+` et `P-` à `P-` entre les modules avec des câbles de longueur strictement identique. Raccordez le câble principal **`BAT+`** de l'onduleur sur le **`P+` du Pack 1 (Maître)** et le câble principal **`BAT-`** en diagonale sur le **`P-` du DERNIER Pack**, afin d'égaliser l'impédance de boucle sur tous les modules.
3. **4 Packs et Plus — Jeu de Barres DC en Cuivre (Busbar) :** Raccordez chaque batterie par des liaisons protégées de longueur identique (`25–35 mm²`) vers des jeux de barres DC en cuivre étamé (`250–400 A`), puis tirez les câbles principaux (`35–50 mm²`) via le MCCB DC jusqu'à l'onduleur.
4. **Terre de Protection (`⏚ PE`) :** Reliez chaque goujon de masse M6 (`⏚`) des châssis batterie au bornier PE de l'onduleur en cuivre vert/jaune `≥ 6 mm²`.

### 2.2 Architecture B — Câblage des Tours Haute Tension (`GroundHV-2500` / `GH02-5324` + PDU/BCU)

1. **Empilement & Ancrage Anti-Basculement :** Mettez de niveau le socle en acier contre un mur porteur. Empilez verticalement les modules HT (minimum `3–4 × GroundHV-2500` = `~153–204 Vdc` pour dépasser la tension d'amorçage du `HYTH`), fixez les brides latérales entre chaque étage et posez la **tête de contrôle Haute Tension PDU / BCU** au sommet.
2. **Connecteurs DC HT & Verrouillage :** Vérifiez que le disjoncteur HT du PDU est sur **OFF** et que la fiche orange **Manual Service Disconnect (MSD)** est retirée. Acheminez des câbles HT double isolation `6–10 mm²` (`1000 Vdc`) depuis les prises sécurisées `HV+ / HV-` du PDU jusqu'aux bornes `BAT+ / BAT-` de l'onduleur `HYTH` jusqu'au déclic de verrouillage, puis reliez les bornes `⏚ PE` du socle et du PDU à la terre de l'onduleur.

### 2.3 Brochage RJ45 CAN du BMS & Adressage DIP Parallèle

La communication BMS en boucle fermée (`SOC %`, `SOH %`, tension pack, limitation thermique et courants dynamiques) transite sur **bus CAN** entre le **port `CAN` de la Batterie Maître / PDU** et le **port `BMS / CAN` de l'onduleur Enerlution** :

| Broche RJ45 | Couleur Standard T568B | Port `CAN` Enerlution Maître / PDU | Port `BMS / CAN` Onduleur | Rôle |
| :---: | :--- | :--- | :--- | :--- |
| **Broches 1 & 2** | Blanc-Orange / Orange | RS485-B / RS485-A (Optionnel) | RS485-B / RS485-A | Inutilisé en mode CAN |
| **Broches 3 & 6** | Blanc-Vert / Vert | Masse signal `GND` | Masse signal `GND` | Masse de référence |
| **Broche 4** | **Bleu** | **`CAN-H` (CAN High)** | **`CAN-H` (CAN High)** | **CAN-H Obligatoire** |
| **Broche 5** | **Blanc / Bleu** | **`CAN-L` (CAN Low)** | **`CAN-L` (CAN Low)** | **CAN-L Obligatoire** |
| **Broches 7 & 8** | Blanc-Marron / Marron | Réservé / Blindage GND | Réservé / Blindage GND | Suivre l'étiquette du câble d'origine |

- **Chaînage Inter-Packs BT & Réglage à Froid des Commutateurs DIP :**
  - Chaînez des cordons CAT5e/CAT6 depuis **Pack Maître 1 `Link Out / RS485-B`** → **Pack Esclave 2 `Link In / RS485-A`** → **Pack Esclave 3 `Link In`**. Laissez le port `CAN` libre sur tous les packs esclaves.
  - Réglez les commutateurs DIP binaires `ADD` strictement hors tension (**OFF**) : pack unique = `0000` (ou `Adresse 1` selon la fiche BMS fournie) ; banc multi-packs = **Pack Maître 1 : `ON OFF OFF OFF` (Adr 1)**, **Pack Esclave 2 : `OFF ON OFF OFF` (Adr 2)**, **Pack Esclave 3 : `ON ON OFF OFF` (Adr 3)**, **Pack Esclave 4 : `OFF OFF ON OFF` (Adr 4)**.
  - *Note de Couplage BT Inter-Marques :* En cas d'association d'une batterie Enerlution 51,2 V `LFPWall` / `Roller` avec un onduleur 48 V BT compatible tel que **Solis (`-L`)**, vérifiez que le protocole CAN du BMS est réglé sur `Pylon / Solis CAN` sur les broches 4 & 5 et ajoutez l'onduleur dans GEMS avec le modèle matériel Solis.

### 2.4 Bornes du Compteur Externe RS-485 (`9600 bps, 8N1`, Adresse `1`)

| Modèle de Compteur | Borne `RS485-A (+)` | Borne `RS485-B (-)` | Configuration Bus |
| :--- | :--- | :--- | :--- |
| **`CHINT DTSU666`** (Triphasé) | Borne **`24`** | Borne **`25`** | Adresse `1` • `9600 8N1` |
| **`CHINT DDSU666`** (Monophasé) | Borne **`5`** | Borne **`6`** | Adresse `1` • `9600 8N1` |
| **`Eastron SDM630-Modbus V2`** | Borne **`A / 485A`** | Borne **`B / 485B`** | Adresse `1` • `9600 8N1` |

Placez tous les tores de courant (CT) immédiatement en aval du compteur du gestionnaire de réseau (en amont de tous les départs maison, bornes VE et disjoncteurs PV/batterie) avec les flèches orientées **Réseau → Maison/Charges**.

### 2.5 Séquence Obligatoire de Démarrage Progressif (Soft-Start) & d'Arrêt

1. **Mise sous tension :** Vérifiez la polarité DC à froid au voltmètre → Fermez le MCCB DC 2P BT (ou insérez la fiche MSD HT et fermez le disjoncteur HT du PDU) pendant que le BMS est en veille → Maintenez le bouton **`POWER / SW` (`2–3 s`)** du Maître/PDU afin que les résistances de précharge alimentent progressivement le bus DC de l'onduleur (`RUN` vert allumé, `ALM` éteint) → Basculez le sectionneur DC PV sur **ON** → Enclenchez le disjoncteur AC réseau sur **ON**.
2. **Arrêt (Ordre inverse) :** Disjoncteur AC réseau **OFF** → Sectionneur DC PV **OFF** → Maintenez `POWER` sur le Maître/PDU pendant 3 s pour mettre le BMS en veille → Ouvrez le MCCB DC / disjoncteur PDU sur **OFF** (patientez 5 minutes avant toute intervention sur les bornes HT).

---

## 3. Paramètres de Mise en Service Requis dans l'Application Enerlution

Connectez-vous localement en Bluetooth ou via la clé de communication Wi-Fi/LAN Enerlution (désactivez temporairement les données mobiles si vous rejoignez le point d'accès Wi-Fi local de la clé), connectez-vous en tant qu'**Installateur (`Installer`)**, raccordez le datalogger en Ethernet filaire ou Wi-Fi 2,4 GHz avec **réservation DHCP fixe sur le routeur**, puis appliquez :

| Paramètre App Enerlution | Réglage Requis | Justification Technique |
| :--- | :--- | :--- |
| **Battery Type & Protocol** | **`Lithium-Ion (CAN)`** *(Profil Enerlution / Pylon)* | Active la télémétrie BMS en boucle fermée (`SOC %`, `SOH %`, V/I pack & limites thermiques). Vérifiez que l'état batterie indique `1–5` (`Standby / Charging / Discharging`), jamais `7 Offline`. |
| **EMS Working Mode** | **`Self-Consumption`** | Ordonne à l'onduleur de stocker de façon autonome le surplus PV et de décharger pour couvrir les charges domestiques et les pointes du soir. |
| **Minimum / Reserve SOC** | **`10 %`** *(`15–20 %` avec secours EPS)* | Préserve la durée de vie LiFePO4 (90 % DoD) tout en conservant une réserve de secours sur `EPS / Backup`. Gardez **Max Charge SOC = 100 %**. |
| **External Smart Meter** | **`Enable` → `CHINT DTSU666` ou `SDM630`** | Active la régulation sous la seconde derrière le compteur (`Address 1`, `9600 8N1`) et expose la puissance réseau (`30110`) à GEMS. |
| **Active Power / Export Control** | **`Disabled / Unlimited (0)`** | **Crucial !** Laisse l'injection normale et les Certificats Verts sans plafond tout en permettant à GEMS d'appliquer dynamiquement un **écrêtement au Watt près** (`40400` / `40441`) lors des prix spot négatifs ! |
| **Modbus TCP & RS-485** | **Port `502` • Slave ID `1` • `9600 8N1`** | Correspond aux valeurs par défaut du pilote `enerlution_inverter` dans GEMS via LAN/Wi-Fi (`:502`) ou adaptateur USB-RS485 direct. |

---

## 4. Intégration & Optimisation d'Enerlution dans GEMS

1. **Intégrer d'abord le Compteur P1 Communicant :** Ajoutez votre compteur communicant (`p1_serial`) dans **Paramètres → Appareils** (avec le **Mode installateur certifié** 🔒 déverrouillé) pour obtenir les courants triphasés de facturation et le suivi quart-horaire flamand.
2. **Découverte Automatique ou Ajout Manuel de `enerlution_inverter` :**
   - GEMS détecte automatiquement les préfixes MAC Enerlution (`70:B3:D5` et `E4:5F:01`) ainsi que les registres d'identification ASCII (`30010–30033`) via **Scanner → Analyser le sous-réseau**, ou par ajout manuel dans **Paramètres → Appareils → Ajouter un appareil énergétique → Onduleur / Solaire → `Enerlution Hybrid Inverter`** (`enerlution_inverter`).
   - Renseignez le **Point de terminaison** (IPv4 statique réservée sur `Port = 502` ou `/dev/serial/by-id/...` à `9600 8N1`), **`Modbus ID = 1`**, la puissance nominale AC exacte **`Rated Power (kW)`** (`3.6`..`12.0`), **`Allow Curtailment = Coché`**, **`Poll Interval = 3s`** (LAN/RS-485) ou **`5s`** (Wi-Fi), le câblage de phase exact **`Phase Wiring`**, **`Grid Meter Connected?`** (`Coché` si un compteur DTSU/SDM est câblé) et **`Battery Connected? = Coché`** avec la capacité totale exacte **`Battery Capacity (kWh)`**.
3. **Stratégie Régionale & Coordination avec Borne VE Raedian (`Paramètres → Stratégie`) :**
   - **Flandre (`Flanders Mode`) :** Réglez `Capacity Peak Limit = 2,5 kW` (ou votre pointe mensuelle), `Buffer = 200 W`, et saisissez la valeur éventuelle des **Certificats Verts (GSC)** (`€/MWh`) pour maintenir l'export jusqu'à `-GSC/1000 €/kWh`. La boucle `Self-Consumption` d'Enerlution écrête les pointes domestiques par décharge batterie tandis que GEMS module la charge VE avant tout dépassement quart-horaire.
   - **Pays-Bas (`Netherlands Mode`) :** Activez `Active Inverter Curtailment` (`0,00 €/kWh`). En journée, le PV charge d'abord la batterie Enerlution, alimente ensuite les bornes **Raedian** (`6A–32A`) et les relais thermiques, puis, une fois le stockage à 100 % lors des prix spot négatifs, GEMS régule la sortie Enerlution par **pas de 1 Watt** pour ramener l'injection réseau à `0 W`.
   - **Harmonie Surplus Solaire Raedian :** Conservez les bornes **Raedian NEO / NEX / Gemini** en mode `PV Only (Solaire)` ou `Éco`. Comme Enerlution absorbe prioritairement le premier surplus derrière le compteur, GEMS attend automatiquement que l'excédent net dépasse le seuil de démarrage VE — évitant tout pompage involontaire de la batterie domestique vers la voiture.

---

## 5. Matrice de Dépannage Rapide

| Symptôme | Cause Probable | Résolution sur le Terrain |
| :--- | :--- | :--- |
| **L'état batterie affiche `Offline (7)` ou `Fault (6)`** | Câble CAN branché sur `Link/RS485`, mauvais protocole BMS ou DIP modifiés sous tension | Éteignez tous les modules, réglez les DIP binaires `ADD`, reliez le câble RJ45 (`Broche 4 CAN-H`, `Broche 5 CAN-L`) du port `CAN` Maître/PDU au port `BMS` de l'onduleur, et sélectionnez `Lithium-Ion (CAN)` dans l'application Enerlution. |
| **L'onduleur HT `HYTH` ne détecte pas `GroundHV-2500`** | Nombre insuffisant de blocs HT en série, fiche MSD ouverte ou disjoncteur HT PDU sur OFF | Installez le minimum requis de blocs HT en série (`≥ 3–4`), verrouillez la fiche orange MSD, fermez le disjoncteur HT du PDU, puis maintenez `POWER` du PDU 2–3 s. |
| **Production PV bridée alors que les prix spot sont positifs** | Zéro-Export statique resté actif dans l'app Enerlution ou `Rated Power (kW)` erroné dans GEMS | Réglez `Active Power / Export Control = Disabled / Unlimited` dans l'app Enerlution et vérifiez la puissance nominale AC exacte (kW) sur la fiche appareil GEMS. |
| **La batterie se recharge depuis le réseau dès qu'un appareil s'allume** | Tores CT du `DTSU666` / `SDM630` inversés ou fils de phase / RS-485 croisés | Orientez les flèches CT **Réseau → Maison/Charges** et vérifiez les bornes `24 (A+)` et `25 (B-)` du `DTSU666`. |
