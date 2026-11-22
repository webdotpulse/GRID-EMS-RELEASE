# GEMS : Manuel de Mise en Service Huawei SUN2000, LUNA2000 & FusionSolar

> 🌐 **Langue / Taal / Language:** [English](../huawei_manual.md) | [Nederlands](../nl/huawei_manual.md) | **Français**

Ce manuel approfondi destiné aux installateurs et aux propriétaires détaille chaque paramètre requis dans l'**application Huawei FusionSolar** (et le portail Web) ainsi que les meilleures pratiques de configuration des équipements, du réseau, des tarifs et de l'optimisation batterie dans **GRID-EMS (GEMS)** pour les installations Huawei résidentielles et tertiaires.

> [!TIP]
> **Télécharger le Manuel de Terrain Imprimable (PDF) :**
> - 📕 **[Manuel Huawei SUN2000, LUNA2000 & FusionSolar (PDF)](../../manuals/fr/gems-huawei-manual-fr.pdf)**
> - 💻 **[Guide Web Interactif Huawei](../../manuals/fr/huawei.html)**
> - 🛠️ **[Portail de Documentation GEMS](../../manuals/fr/index.html)**

---

## 1. Écosystème Huawei Pris en Charge & Topologies Physiques

GEMS communique localement avec les onduleurs, batteries et capteurs d'énergie Huawei sur votre réseau LAN ou bus RS-485 sans aucune dépendance au cloud — tout en laissant la remontée cloud **FusionSolar** habituelle fonctionner sans interruption.

### 1.1 Matrice du Matériel Huawei Compatible

| Famille d'Équipements | Modèles Huawei Pris en Charge | ID Modèle GEMS | Fonctionnalités Prises en Charge |
| :--- | :--- | :--- | :--- |
| **Onduleurs Hybrides Monophasés** | `SUN2000-2KTL`–`6KTL-L1`, `SUN2000-8KTL`–`10KTL-LC0` | `huawei_inverter` | Puissance active PV (W), rendement kWh, pilotage LUNA2000, écrêtement PV actif, télémétrie de phase |
| **Onduleurs Hybrides Triphasés** | `SUN2000-3KTL`–`10KTL-M1`, `SUN2000-5KTL`–`12KTL-MAP0`, `SUN2000-12KTL`–`25KTL-MB0` | `huawei_inverter` | Courants/tensions triphasés, pilotage bidirectionnel LUNA2000, écrêtement PV fin à `0,1 %` |
| **Onduleurs String Tertiaires** | `SUN2000-12KTL`–`25KTL-M2/M5`, `SUN2000-30KTL`–`100KTL-M3` | `huawei_inverter` | Télémétrie de production solaire, mesures triphasées, limitation active de puissance |
| **Batteries Domestiques (BESS)** | `LUNA2000-5/10/15-S0` (jusqu'à 30 kWh en double tour), `LUNA2000-7/14/21-S1` (jusqu'à 20,7 kWh/tour) | `huawei_inverter` (`Battery Connected?`) | SOC % en direct, charge/décharge W, limites dynamiques BMS en direct, chien de garde matériel 10 min |
| **Passerelles de Communication** | `SDongleA-05 (WLAN-FE)`, `EMMA-A02`, `SmartLogger3000` | Modbus TCP `:502` | Connexion TCP mutualisée mono-socket avec cadencement inter-trames de `250 ms` |
| **Capteurs de Puissance** | Compteur intégré `EMMA-A02`, `DTSU666-H` (3P), `DDSU666-H` (1P) | `huawei_emma` ou via `huawei_inverter` | Prélèvement/injection signés (W), courants signés L1–L3 (A), tensions L1–L3 (V), kWh import/export |
| **Borne VE (Optionnelle)** | **Raedian** NEO / NEX / Gemini (Modbus TCP recommandé) ou Huawei `SCharger-7KS / 22KT` (OCPP 1.6-J) | `raedian_charger` / `huawei_scharger` | Équilibrage dynamique 6A–32A, surplus solaire, commutation de phases 1P/3P |

### 1.2 Choisir la Topologie de Raccordement Adaptée

1. **Topologie A — `SDongleA-05 (WLAN-FE)` en Ethernet Filaire + `DTSU666-H` + Compteur P1 (Standard de Référence Recommandé)**
   - Dévissez le capuchon inférieur du `SDongleA-05` et branchez un **câble Ethernet Cat5e/Cat6 filaire** dans sa prise RJ45 interne plutôt que d'utiliser le Wi-Fi 2,4 GHz. L'Ethernet filaire élimine les pertes de paquets radio, les mises en veille Wi-Fi des routeurs et les expirations Modbus.
   - Raccordez un **câble compteur communicant P1** Fluvius / ORES / RESA / DSMR directement en USB sur GEMS (`p1_serial`). GEMS utilise le compteur P1 fiscal pour le suivi quart-horaire flamand et la protection du disjoncteur principal, tandis que le `DTSU666-H` Huawei assure un repli matériel instantané.
2. **Topologie B — Huawei `EMMA-A02` Energy Management Assistant (Modbus TCP sur LAN)**
   - Raccordez l'`EMMA-A02` en Ethernet à votre réseau local. Ajoutez `huawei_emma` (compteur réseau, port TCP `502`, Modbus ID `1`) ainsi que `huawei_inverter` (port TCP `502`, Modbus ID `1` pour l'onduleur 1, `2` pour l'onduleur 2) en pointant vers la même adresse IP EMMA. GEMS mutualise automatiquement **une seule connexion TCP partagée** pour tous les appareils de cette IP.
3. **Topologie C — Bus Série RS-485 Direct via USB (Installations Sans Dongle Uniquement)**
   - **Important :** Valide uniquement lorsqu'**aucun** `SDongleA-05` ni `EMMA-A02` n'est branché sur l'onduleur (un dongle connecté prend le rôle de maître exclusif sur le bus RS-485 interne).
   - Câblez une paire torsadée blindée (`9600 bps, 8N1`, Slave ID `1`) entre un adaptateur USB-RS485 sur GEMS (`/dev/serial/by-id/...`) et le connecteur COM de l'onduleur :
     - **`SUN2000-2KTL–6KTL-L1` (Monophasé) :** `Broche 2` = `RS485A+` (`485A1`), `Broche 1` = `RS485B-` (`485B1`). *(Les broches 3 & 4 restent réservées au DDSU666-H).*
     - **`SUN2000-3KTL–10KTL-M1` (Triphasé) :** `Broche 1` = `RS485A+` (`485A1-1`), `Broche 3` = `RS485B-` (`485B1-1`). *(Les broches 7 & 9 restent réservées au DTSU666-H).*
     - **`SUN2000-MAP0 / MB0 / LC0` :** Bornier EMS dédié `485A1 / 485B1`.
4. **Topologie D — `SUN2000 + LUNA2000` Sans Capteur de Puissance Huawei (`Mode Piloté par Compteur P1`, Sans EMMA / Sans `DTSU666-H`)**
   - Si votre onduleur hybride Huawei dispose d'une batterie `LUNA2000` **sans** `EMMA-A02` et **sans** capteur `DTSU666-H / DDSU666-H`, intégrez votre compteur communicant P1 dans GEMS (`p1_serial`) et laissez **`Grid Meter Connected?` décoché** sur la fiche `Huawei Hybrid Inverter`.
   - Dans FusionSolar (session Installateur), réglez **`Charge from AC` = `Enable`**, **`Grid Charge Cutoff SOC` = `100 %`** et **`Max Charge / Discharge Power` = Puissance nominale max**. Si FusionSolar refuse *Maximum Self-Consumption* en l'absence de compteur Huawei, sélectionnez **`Fixed Charge/Discharge`** *(avec zéro plage horaire programmée)* ou **`Fully Fed to Grid`** — GEMS pilote alors intégralement la charge sur surplus solaire, la décharge domestique et l'arbitrage à partir des télégrammes P1 en temps réel (en synchronisant automatiquement le cycle P1 `1s` avec le cycle Modbus `10s` du `SDongleA-05` pour éviter tout pompage tout en réduisant instantanément la décharge en cas d'injection réseau).
5. **Pourquoi le Wi-Fi Interne de l'Onduleur (`Port 6607 / Unit ID 0`) est Déconseillé**
   - Le point d'accès Wi-Fi interne de mise en service (`SUN2000-<Série>`, port `6607`, Unit ID `0`) est conçu pour de courtes interventions installateur et non pour un pilotage EMS continu 24h/24. Utilisez systématiquement un `SDongleA-05`, un `EMMA-A02`, un `SmartLogger3000` ou le bus `RS-485` direct.

---

## 2. Prérequis Micrologiciels (Firmware) & Réseau

### 2.1 Versions Minimales & Recommandées de Firmware

| Matériel Huawei | Firmware Minimal | Firmware Recommandé | Exigence Clé |
| :--- | :--- | :--- | :--- |
| **`SDongleA-05 (WLAN-FE)`** | `V100R001C00SPC126` / `V200R022C10SPC108` | `V200R022C10SPC118` ou plus récent | Déverrouille le Modbus TCP non restreint et fiabilise les écritures |
| **`SUN2000-L1` (Monophasé)** | `V200R001C00SPC130` | `V200R001C00SPC142` ou plus récent | Registres de charge/décharge forcées temporisées |
| **`SUN2000-M1` (Triphasé)** | `V100R001C00SPC153` | `V100R001C00SPC165` ou plus récent | Charge AC LUNA2000 & bridage actif précis à `0,1 %` |
| **`SUN2000-LC0 / MAP0 / MB0`** | `V200R023C10SPC100` | Dernière version `SPC` | Prise en charge complète des enveloppes BMS S1 |
| **`LUNA2000-S0 / S1`** | `V100R002C00SPC119` (S0) | `V100R002C00SPC624+` (S0) / Dernière (S1) | Remontée dynamique des limites de puissance charge/décharge |
| **`EMMA-A02`** | `V100R023C10SPC100` | `V100R023C10SPC120` ou plus récent | Port `502` non chiffré + liste blanche IPv4 exacte de GEMS |

### 2.2 Réservations IPv4 Fixes & Règle du Client Unique

> [!IMPORTANT]
> 1. **Un Seul Client Modbus TCP à la Fois :** Tant le `SDongleA-05` que l'`EMMA-A02` n'acceptent **qu'un seul client Modbus TCP simultané** sur le port `502`. Arrêtez tout script tiers de supervision, serveur domotique ou interrogation Modbus directe par une borne avant de mettre GEMS en service.
> 2. **Baux DHCP Statiques / IP Fixes :** Configurez sur votre routeur une réservation DHCP MAC permanente pour l'**unité GEMS** (`eth0`) ainsi que pour le **Huawei SDongleA-05 / EMMA-A02**. Sur l'`EMMA-A02`, le port `502` filtre strictement l'adresse IPv4 du client GEMS — si l'IP de GEMS change après un redémarrage routeur, EMMA refusera la connexion.

---

## 3. Configuration Pas à Pas dans l'Application Huawei FusionSolar

Les comptes propriétaires (« Vue centrale ») ne permettent pas de modifier la sécurité Modbus ni les paramètres réseau de l'onduleur. Connectez-vous localement via **Mise en service de l'appareil (`Device Commissioning`)** avec des droits **Installateur (`Installer`)**.

### 3.1 Accéder au Mode Local de Mise en Service
1. **Coupez les Données Mobiles (4G/5G)** de votre smartphone (en laissant le Wi-Fi activé afin qu'Android/iOS ne détourne pas le trafic hors du hotspot local sans Internet de l'onduleur).
2. Ouvrez l'**application FusionSolar** -> touchez **Moi (`Me`)** ou **Services** -> sélectionnez **Mise en service de l'appareil (`Device Commissioning`)**.
3. Scannez le QR code situé sur le flanc de l'**onduleur SUN2000** (ou en façade du module **EMMA-A02**).
4. Choisissez **Installateur (`Installer`)** et connectez-vous avec les identifiants installateur Huawei du site.

### 3.2 Activer Modbus TCP sur `SDongleA-05` (Topologie A)
1. Naviguez vers : **`Settings -> Communication Configuration -> Dongle Parameter Settings -> Modbus-TCP`**.
2. Passez **Connection** de *Disabled* à **`Enable (unrestricted)`** (ou *Enable (restricted)* en renseignant l'IPv4 statique exacte de votre contrôleur GEMS).
3. Touchez **Confirm / Save**.
4. Vérifiez **`Settings -> Communication Configuration -> RS485_1`** : confirmez **Protocol** = `MODBUS`, **Baud Rate** = `9600` et notez la valeur **Communication Address** (`1` par défaut ; `2`, `3`, etc. pour les onduleurs esclaves en cascade).
5. *(Alternative à distance sur PC)* : Sur le **Portail Web FusionSolar** (compte Installateur), ouvrez **Plants -> Device Management -> Sélectionnez le SDongle -> Configuration -> Connection Parameters -> Modbus TCP -> `Enable (unrestricted)`**.

### 3.3 Activer Modbus TCP sur `EMMA-A02` (Topologie B)
1. Connectez-vous à l'**EMMA-A02** via **Device Commissioning** en tant qu'**Installateur**.
2. Naviguez vers : **`Settings -> Communication Configuration -> Modbus TCP`**.
3. Réglez **Connection** = **`Enable`**.
4. Réglez **TLS Encryption** = **`Disable` (OFF)** *(Obligatoire pour le protocole Modbus TCP standard sur le port `502`)*.
5. Réglez **Client IP Address** = **Adresse IPv4 statique exacte de votre unité GEMS** (par ex. `192.168.1.50`). **Ne saisissez jamais `0.0.0.0`** — l'EMMA-A02 rejette les adresses génériques par un `TCP RST`.
6. Dans les réglages énergétiques de l'EMMA, laissez **Working Mode** sur **`Maximum Self-Consumption`** et désactivez la planification IA cloud / Time-of-Use de l'EMMA afin d'éviter tout conflit d'ordres avec GEMS.

### 3.4 Paramètres Obligatoires de la Batterie LUNA2000 dans FusionSolar

Accédez à **`Settings -> Energy Control`** (ou **`Device Monitoring -> ESS (LUNA2000) -> Parameter Settings`**) et appliquez chaque réglage ci-dessous :

| Paramètre FusionSolar | Réglage Requis | Justification Technique |
| :--- | :--- | :--- |
| **Working Mode** | **`Maximum Self-Consumption`** *(Avec compteur Huawei / EMMA)* ; **`Fixed Charge/Discharge` (0 créneau)** ou **`Fully Fed to Grid`** *(Topologie D sans compteur Huawei si Self-Consumption est grisé)* | Assure un comportement autonome sain (n'activez jamais de plages internes *Time-of-Use (TOU)* qui entreraient en conflit avec GEMS). En Topologie D sans capteur Huawei, `Fixed Charge/Discharge` sans créneau laisse à GEMS un contrôle Modbus total. |
| **Charge from AC** *(Charge réseau)* | **`Enable`** | Ne provoque *aucune* charge réseau spontanée en autoconsommation normale, mais autorise le firmware à exécuter les ordres GEMS de charge forcée lors des prix spot négatifs/creux et du secours hivernal. |
| **Grid Charge Cutoff SOC** | **`100 %`** | Empêche le firmware Huawei d'interrompre prématurément la charge réseau à 80 % lorsque GEMS vise 95 %–100 % pendant les prix négatifs. GEMS applique ses propres seuils SOC par règle. |
| **Maximum Charge Power** | **Maximum nominal matériel** *(ex. `2500 W`, `5000 W`, `10500 W`)* | Garantit la pleine puissance de charge pour capter les pointes solaires et les heures à prix négatifs. |
| **Maximum Discharge Power** | **Maximum nominal matériel** *(ex. `2500 W`, `5000 W`, `10500 W`)* | Garantit la pleine puissance instantanée de décharge pour écrêter les pointes quart-horaires flamandes. |
| **End-of-Charge SOC** | **`100 %`** | Permet l'équilibrage haut périodique à 100 % des cellules LiFePO4 afin de maintenir la précision du SOC BMS. |
| **End-of-Discharge SOC** *(SOC min.)* | **`5 % – 10 %`** *(Raccordé réseau)* / **`15 % – 20 %`** *(avec Backup Box)* | Réglez `5 %` au printemps/été pour maximiser la capacité utile, `10 %` en hiver pour éviter les recharges de maintien, ou `15 %–20 %` en présence d'une Backup Box / SmartGuard. |

### 3.5 Contrôle de Puissance Active & Vérification du Capteur de Courant
- **Active Power Control Mode** (`Settings -> Power Adjustment -> Active Power Control`) : Réglez sur **`Unlimited` (`No limit`)**, sauf plafond fixe imposé par le GRD. Un *Zéro-Export* statique dans FusionSolar bloque les heures d'injection rentables et les Certificats Verts flamands (GSC) — laissez FusionSolar sur `Unlimited` et confiez l'écrêtement dynamique à GEMS !
- **Closed-Loop Controller** : Réglez sur **`Inverter`** pour un onduleur seul (boucle matérielle la plus rapide), ou sur **`SDongle / SmartLogger`** pour plusieurs onduleurs en cascade Maître-Esclave.
- **Contrôle de Polarité des Tores CT (`DTSU666-H` / `DDSU666-H`)** : Allumez une charge résistive d'environ 2 kW et vérifiez dans le synoptique FusionSolar que le prélèvement réseau augmente bien de +2 kW sur la phase correspondante, et que les flèches physiques des tores (`K -> L`) pointent **du compteur réseau vers les charges de la maison**.

---

## 4. Intégration du Matériel Huawei dans GEMS

Déconnectez votre téléphone du Wi-Fi local de l'onduleur, ouvrez GEMS dans votre navigateur, accédez à **Paramètres**, cliquez sur l'**icône cadenas 🔒** et saisissez votre **Code PIN installateur** pour déverrouiller le **Mode installateur certifié**.

### 4.1 Étape 1 — Ajouter le Compteur Réseau Principal (`Paramètres -> Appareils -> Compteur intelligent`)
- **Avec Compteur Communicant P1 Fluvius / ORES / RESA / DSMR (Recommandé) :** Ajoutez **`P1 Smart Meter (USB/Serial)`** (`p1_serial`) via son chemin persistant `/dev/serial/by-id/...`. GEMS priorise automatiquement le compteur fiscal P1 pour la protection quart-horaire et disjoncteur tout en se coordonnant avec l'onduleur Huawei.
- **Avec Huawei `EMMA-A02` (Sans port P1) :** Ajoutez **`Huawei EMMA-A02 / DTSU666-H Smart Power Sensor`** (`huawei_emma`) avec l'adresse IP fixe de l'EMMA, le port TCP `502` et `Modbus ID = 1` (ou `/dev/serial/by-id/...` avec `Modbus ID = 11` pour un `DTSU666-H` RS-485 autonome).

### 4.2 Étape 2 — Ajouter `Huawei Hybrid Inverter` (`Paramètres -> Appareils -> Onduleur / Solaire`)

| Champ Appareil GEMS | Valeur Recommandée | Importance |
| :--- | :--- | :--- |
| **Nom de l'appareil** | `Huawei SUN2000 + LUNA2000` | Identification claire sur le Tableau de bord, le Journal et les rapports PDF. |
| **Modèle matériel** | `Huawei Hybrid Inverter` (`huawei_inverter`) | Active le cadencement SDongle `250 ms`, les limites BMS dynamiques et le chien de garde de 10 min. |
| **Adresse IP ou Port série** | IP fixe du SDongle / EMMA (ex. `192.168.1.120`) ou `/dev/serial/by-id/...` | Saisissez l'IPv4 LAN réservée (ou le chemin série persistant en Topologie C). |
| **Port TCP** | `502` | Port Modbus TCP standard pour `SDongleA-05`, `EMMA-A02` et `SmartLogger3000`. |
| **Modbus ID** | `1` *(défaut)* ; `2, 3...` *(esclaves en cascade)* | Doit correspondre à `RS485_1 Communication Address` dans FusionSolar (`1`, `2` ou `16`). |
| **Rated Power (kW)** | Puissance AC nominale exacte en kW (ex. `4.6`, `5.0`, `10.0`) | **Obligatoire** pour calculer avec précision les consignes d'écrêtement au pas de `0,1 %`. |
| **Allow Curtailment** | **`Coché (✓)`** | Autorise GEMS à réduire la puissance du SUN2000 lors des heures d'injection à prix négatif. |
| **Poll Interval (secondes)** | **`10`** *(SDongleA-05)* / **`5`** *(EMMA-A02 ou RS-485)* | GEMS sélectionne `10 s` par défaut afin de préserver le processeur du SDongleA-05 et la synchro cloud FusionSolar. |
| **Phase Wiring** | `Three-Phase — L1-L2-L3` *(M1/MAP0/MB0)* ou phase exacte `L1 / L2 / L3` *(1P L1)* | Sur un `SUN2000-L1` monophasé raccordé à un tableau triphasé, l'affectation exacte assure une protection précise par phase. |
| **Grid Meter Connected?** | **`Coché (✓)`** si DTSU666-H / EMMA câblé ; **`Décoché (☐)`** si AUCUN compteur Huawei | Laisser coché dès qu'un capteur Huawei est raccordé à l'onduleur. Ne décocher *que* lorsque seul un compteur P1 pilote la LUNA2000. |
| **Battery Connected?** | **`Coché (✓)`** si LUNA2000 présente | Active la lecture SOC/puissance et le pilotage bidirectionnel de la batterie LUNA2000. |
| **Battery Capacity (kWh)** | Capacité utile totale en kWh (ex. `5.0`, `10.0`, `15.0`, `6.9`, `13.8`, `20.7`) | Indispensable pour le solveur **Dynamic 24h Forecast** et le calcul de recharge hivernale. |

---

## 5. Configurer GEMS pour des Performances Optimales

### 5.1 Localisation, Prévisions Solaires & Limites Électriques (`Paramètres -> Stratégie`)
1. **Localisation Géographique :** Sélectionnez le fuseau horaire (`Europe/Brussels` ou `Europe/Amsterdam`), renseignez l'adresse postale, cliquez sur **Lookup Lat/Lon** et cochez **`Enable Open-Meteo Solar Forecast Ingestion`**. GEMS évite ainsi toute recharge nocturne coûteuse de la LUNA2000 à la veille d'une journée ensoleillée.
2. **Raccordement Réseau & Limites :** Réglez le courant nominal et la limite par phase selon votre disjoncteur principal (`25 A`, `32 A`, `40 A`), sélectionnez la topologie réseau exacte (`Single Phase 230V`, `Three Phase 400V` ou `Three Phase 230V Delta`) et conservez le courant de repli hors ligne sur **`0 A — Pause EV Charging`**.

### 5.2 Profils de Stratégie Régionaux

- **Flandre / Belgique (`Flanders Mode — Peak Shaving`) :**
  - `Optimization Mode` : **`Flanders Mode (Peak Shaving)`**
  - `Capacity Peak Limit (kW)` : **`2,5 kW`** (plancher légal) ou **`3,0–3,5 kW`** pour les foyers équipés d'une pompe à chaleur et d'un VE. Le **Plafond Adaptatif Intelligent** s'ajuste automatiquement si une pointe quart-horaire plus élevée survient durant le mois.
  - `Peak Shaving Buffer (W)` : **`200 W`** en Ethernet filaire / EMMA-A02 (**`250 W`** si le SDongleA-05 est en Wi-Fi).
  - `Ramp-up Hysteresis (W)` : **`500 W`**.
  - `Active Inverter Curtailment` : **`Coché (✓)`**, `Base Export Price Threshold` : **`0,00 €/kWh`**, et **`Green Power Certificates (GSC)`** : réglez **`0 €`** pour une installation récente, ou votre prime exacte (`250 €`, `350 €`, `450 €`) afin que le SUN2000 ne bride jamais sa production tant que les certificats verts rendent l'injection rentable !
- **Pays-Bas (`Netherlands Mode — Smart Saldering`) :**
  - `Optimization Mode` : **`Netherlands Mode (Smart Saldering)`**
  - `Active Inverter Curtailment` : **`Coché (✓)`**, `Base Export Price Threshold` : **`0,00 €/kWh`** (ou le seuil de frais d'injection de votre contrat). Le surplus solaire charge d'abord la LUNA2000 et le VE, puis module le SUN2000 lors des prix négatifs.
- **Tarif Fixe ou Bi-Horaire (`Eco Mode`) :**
  - `Optimization Mode` : **`Eco (Max Self-Consumption)`** — maximise l'autoconsommation solaire pure et la protection disjoncteur sans cyclage réseau superflu.

### 5.3 Réglages Optimaux d'Arbitrage, d'Usure & d'Hiver pour LUNA2000
1. Configurez le profil exact de votre fournisseur, votre GRD (`Fluvius`, `ORES`, `RESA`, `SIBELGA`) et la TVA (`6 %` BE / `21 %` NL) dans **`Paramètres -> Contrat d'énergie`**.
2. Dans **`Paramètres -> Stratégie -> Battery Grid Charging & Arbitrage`** :
   - **`Charging Strategy Mode`** : **`Dynamic 24h Forecast (Solar & Load modeling)`** (optimal pour les contrats dynamiques Day-Ahead).
   - **`Battery Wear Cost (€/kWh)`** : **`0,04 €/kWh`** (`0,03–0,05 €/kWh`). Intègre l'usure LiFePO4 et les ~12 %–15 % de pertes de conversion AC-DC-AC afin d'éviter tout micro-cyclage non rentable.
   - **`Grid Charge Ceiling (€/kWh)`** : **`0,08 €/kWh`** (ou `0,00 €/kWh` pour ne charger depuis le réseau qu'à prix négatif).
   - **`Grid Discharge Floor (€/kWh)`** : **`0,35 €/kWh`** (réserve l'énergie batterie à la maison sauf flambée exceptionnelle des prix d'export).
   - **`Winter / Low-Solar Grid Charge Fallback`** : **`Coché (✓)`** avec `Low SoC Trigger` = **`25 %`**, `Fallback Target SoC` = **`65 %`** et `Cheapest Hours` = **`2 heures`** (`3 heures` pour les tours LUNA2000 ≥15 kWh afin de maintenir la puissance de charge sous le plafond flamand de 2,5 kW).

### 5.4 Coordonner une Borne VE (Raedian) Sans Vider la LUNA2000
- Connectez votre borne VE (par ex. **Raedian NEO / NEX / Gemini**) directement à GEMS en **Modbus TCP** local (`Paramètres -> Appareils -> Borne VE`).
- Utilisez `PV Only (Solaire)` ou `Éco / Smart` sur le Tableau de bord pour charger au surplus solaire en journée.
- Pour recharger votre voiture la nuit aux heures creuses **sans vider votre batterie domestique LUNA2000 dans le véhicule**, ajoutez une règle dans **`Paramètres -> Stratégie -> Optimisation Batterie par Règles Tarifaires`** avec l'action **`Hold (Maintien / Sans décharge)`** calée sur votre créneau de charge VE nocturne (par ex. `01:00 – 05:00`), préservant ainsi la LUNA2000 pour la pointe coûteuse du matin.

---

## 6. Liste de Vérification & Dépannage

### 6.1 Contrôles Après Mise en Service
1. Vérifiez que `Huawei Hybrid Inverter` affiche **`● En ligne`** dans `Paramètres -> Appareils connectés` et inspectez la tension, le SOC %, la puissance et les **versions firmware Dongle / EMMA / Onduleur / Batterie** directement sur la carte appareil et via **Debug** (également affichées automatiquement sous **Matériel Modbus & Réseau Connecté** dans **GRID-EMS-SERVER**).
2. Allumez un appareil domestique d'environ 2 kW et vérifiez sur le **Tableau de bord** que la consommation maison et l'import réseau / la décharge batterie évoluent dans le bon sens.
3. Ouvrez l'onglet **Journal**, filtrez sur `HuaweiInverterPoller` et vérifiez l'absence d'expirations (*timeouts*) ou d'erreurs de registres.
4. Vérifiez que l'**application FusionSolar** du client continue de se mettre à jour toutes les 5 minutes.
5. Exportez une sauvegarde JSON (`Paramètres -> Infos système -> Exporter la configuration (.json)`) puis cliquez sur le cadenas 🔒 pour reverrouiller le **Mode installateur certifié**.

### 6.2 Matrice de Dépannage Rapide

| Symptôme | Cause Probable | Solution |
| :--- | :--- | :--- |
| **`Connection refused` / `TCP RST` sur `:502`** | Modbus TCP désactivé dans FusionSolar, ou TLS actif / mauvaise IP cliente sur EMMA-A02 | Activez `Modbus-TCP = Enable (unrestricted)` sur le SDongle ; sur EMMA-A02 désactivez TLS et autorisez l'IPv4 exacte de GEMS (jamais `0.0.0.0`). |
| **Coupures fréquentes `i/o timeout` / `request timed out` / `server device busy`** | Second client Modbus interrogeant `:502`, Wi-Fi 2,4 GHz faible sur `SDongleA-05` ou intervalle `< 8 s` | Arrêtez tout client Modbus secondaire, branchez le `SDongleA-05` en Ethernet filaire et maintenez `Poll Interval` à **`10 s`**. |
| **Connexion TCP établie mais lecture en échec (`Slave failure`)** | Mauvais `Modbus ID` | Faites correspondre le `Modbus ID` GEMS avec `RS485_1 Communication Address` dans FusionSolar (`1` en général, parfois `2` ou `16`). |
| **La LUNA2000 ignore la charge forcée ou journalise `server device failure`** | `Charge from AC` désactivé, SOC d'arrêt bas, Topologie D sans compteur bloquée dans un mode exigeant un capteur, ou ancien firmware | Activez `Charge from AC = Enable`, `Grid Charge Cutoff SOC = 100 %`, `Max Charge/Discharge Power = Max nominal`, décochez `Grid Meter Connected?` dans GEMS sans capteur Huawei (mode `Fixed Charge/Discharge` à 0 créneau si requis) et mettez à jour le SDongle en `V200R022C10SPC118+`. |
| **La batterie se charge quand la maison consomme** | Tores CT du `DTSU666-H` montés à l'envers ou fils de tension de phase croisés | Orientez les flèches CT (`K -> L`) du **Réseau vers la Maison** et alignez les tensions `L1/L2/L3` avec `CT-A/B/C`. |
| **Hors ligne après une mise à jour firmware Huawei** | La mise à jour a réinitialisé Modbus TCP sur *Disabled* | Réactivez `Modbus-TCP = Enable (unrestricted)` dans les paramètres Installateur FusionSolar. |
