# Manuel d'Interface Compteur Communicant P1 & Câble DIY GEMS

> 🌐 **Langue / Taal / Language:** [English](../p1_port_manual.md) | [Nederlands](../nl/p1_port_manual.md) | **Français**

Ce manuel fournit toutes les instructions techniques nécessaires pour raccorder **GEMS (Grid Energy Management System)** aux compteurs électriques numériques communicants via le **port P1** (DSMR 5.0.2 / e-MUCS belge v1.4). Il détaille les spécifications électriques, le brochage, le principe du signal collecteur ouvert inversé, la liste complète des composants (BOM) et l'assemblage pas à pas d'un **câble USB vers RJ11 / RJ12** avec inverseur matériel à transistor ou inversion logicielle FTDI.

---

## 1. Comprendre le Port Utilisateur P1

Les compteurs électriques communicants modernes déployés en Belgique (**Fluvius, Sibelga, ORES, RESA**), aux Pays-Bas (**Liander, Enexis, Stedin**) et au Luxembourg (**Creos**) intègrent une prise client RJ12 identifiée **P1**.

Le port P1 transmet directement à GEMS les données métrologiques officielles du compteur de facturation à haute fréquence (toutes les secondes sur les compteurs DSMR 5.0 / Fluvius / ORES / RESA).

### Mesures Acquises par GEMS
| Mesure | Fréquence | Rôle dans l'Optimisation GEMS |
| :--- | :--- | :--- |
| **Puissance Active Prélevée (W)** | Toutes les 1 s | Déclenche l'écrêtage capacitaire flamand, la décharge batterie ou le bridage VE lors des appels de charge domestiques. |
| **Puissance Active Injectée (W)** | Toutes les 1 s | Routée vers la batterie domestique, la charge VE (6A–32A) ou le boost thermique SG-Ready pour maximiser l'autoconsommation solaire. |
| **Courant (A) & Tension (V) par Phase** | Toutes les 1 s | Surveillés sur les phases L1, L2 et L3 pour l'équilibrage de phase et la protection du disjoncteur principal. |
| **Pointe Quart-Horaire Mensuelle Max. (kW)**<br>`OBIS 1-0:1.6.0` | Chaque télégramme | Puissance moyenne maximale officielle sur 15 minutes du mois en cours, exploitée par le **Plafond Adaptatif Intelligent** de GEMS. |
| **Index Cumulés Import/Export (kWh)** | Chaque télégramme | Index fiscaux (Tarif 1 Jour / Plein & Tarif 2 Nuit / Creux) pour des rapports énergétiques 100 % exacts. |
| **Compteur Gaz Communicant (m³)**<br>`0-n:24.1.0(003)` + `24.2.1` / `24.2.3` | Toutes les 5–60 min | Consommation de gaz naturel relayée sans fil en M-Bus du compteur gaz vers le compteur électrique (y compris le volume compensé en température belge `24.2.3`). |
| **Compteur d'Eau Communicant (m³ / L)**<br>`0-n:24.1.0(007)` + `24.2.1` | Toutes les 5–60 min | Consommation d'eau potable transmise en M-Bus lorsque le distributeur d'eau est jumelé au compteur électrique (ex. Flandre : **Pidpa**, **De Watergroep**, **Farys**, **Water-link** via Fluvius ; capteurs d'eau autonomes HomeWizard, YouLess et ESPHome également pris en charge). |

---

## 2. Compteurs Compatibles & Paramètres de Transmission

| Région / Gestionnaire (GRD) | Modèles de Compteurs Courants | Norme | Débit Série |
| :--- | :--- | :--- | :--- |
| **Fluvius (Flandre, BE)** | Sagemcom T211 (triphasé), S211 (monophasé), Landis+Gyr E360 | e-MUCS v1.4 / DSMR 5.0.2 | **115 200 bauds** (8N1) |
| **Sibelga (Bruxelles, BE)** | Sagemcom T211 / S211 | e-MUCS v1.4 / DSMR 5.0.2 | **115 200 bauds** (8N1) |
| **ORES / RESA (Wallonie, BE)** | Sagemcom T211 / Landis+Gyr E360 | e-MUCS v1.4 / DSMR 5.0.2 | **115 200 bauds** (8N1) |
| **Pays-Bas (NL)** | Landis+Gyr E350/E360, Kaifa MA105/MA304, Iskra ME382 | DSMR 5.0.2 / DSMR 4.x | **115 200 bauds** (DSMR 5)<br>**9 600 bauds** (DSMR 4/3/2) |
| **Creos (Luxembourg)** | Sagemcom T210-D Smarty | e-MUCS / DSMR 5.0 | **115 200 bauds** (8N1) |

---

## 3. Brochage Physique & Électrique (RJ12 vs RJ11)

L'embase P1 du compteur communicant est une prise modulaire **6 positions, 6 contacts (6P6C)** de type RJ12.

### Peut-on Utiliser un Câble Téléphonique Standard RJ11 à 4 Fils ?
**Oui.** Les fiches téléphoniques standard sont au format **RJ11 (6P4C)**. Elles s'insèrent parfaitement au centre de la prise 6P6C et établissent le contact avec les **broches centrales 2, 3, 4 et 5**. Comme l'adaptateur USB est alimenté en 5 V directement par le port USB du Raspberry Pi, la broche 1 (+5 V fournie par le compteur) est facultative !

### Comparaison du Brochage
| Broche | Nom du Signal | Fonction Électrique | RJ12 (6P6C) | RJ11 (6P4C) |
| :---: | :--- | :--- | :---: | :---: |
| **Broche 1** | **Alimentation +5V** | Sortie +5 VDC (jusqu'à 250 mA en DSMR 5.0) pour dongles autonomes. | Fil 1 | *Non connecté* |
| **Broche 2** | **Demande de données (RTS)** | Entrée. **Doit être maintenue à l'état HAUT (+5V)** pour activer l'envoi des télégrammes. | Fil 2 | Fil 1 |
| **Broche 3** | **Masse Données (GND)** | Masse de référence du signal. | Fil 3 | Fil 2 |
| **Broche 4** | **Réservé (NC)** | Non connecté. | Fil 4 | Fil 3 |
| **Broche 5** | **Sortie Données (TxD)** | Sortie série à collecteur ouvert inversé (0V = Repos / 1 logique). | Fil 5 | Fil 4 |
| **Broche 6** | **Masse Alimentation (GND)** | Masse de référence (reliée en interne à la broche 3 dans le compteur). | Fil 6 | *Non connecté* |

```
    Connecteur RJ12 (6P6C)                      Connecteur RJ11 (6P4C)
   ┌─────────────────────────┐                 ┌─────────────────────────┐
   │  [1] [2] [3] [4] [5] [6]│                 │  [ ] [1] [2] [3] [4] [ ]│
   │   │   │   │   │   │   │ │                 │       │   │   │   │     │
   │  +5V RTS GND  NC TXD GND│                 │      RTS GND  NC TXD    │
   │                         │                 │                         │
   │     Ergot plastique     │                 │     Ergot plastique     │
   │      (face arrière)     │                 │      (face arrière)     │
   └───────────┬─┬───────────┘                 └───────────┬─┬───────────┘
```

---

## 4. Pourquoi l'Inversion du Signal est Indispensable

La norme DSMR / e-MUCS impose une **sortie à collecteur ouvert en logique inversée** :
- **Ligne au repos (Idle) :** Tirée à 0 V &rarr; 1 logique
- **Bits actifs :** Tirés à +5 V &rarr; 0 logique

Or un contrôleur UART TTL standard attend un état de repos HAUT (+5 V) et un bit de start BAS (0 V). Relier directement la broche 5 à une entrée RX UART classique produit des bits inversés, provoquant des erreurs de trame et des caractères illisibles sous Linux.

Pour inverser proprement ce signal, GEMS prend en charge deux méthodes DIY :
1. **Méthode A (Inverseur Matériel à Transistor) :** Un transistor NPN (BC547) et une résistance de rappel (*pull-up*). Compatible avec *toutes* les puces USB-série (CH340, CP2102, FTDI, PL2303).
2. **Méthode B (Inversion Logicielle FTDI) :** Une puce authentique FTDI FT232RL configurée par EEPROM pour inverser l'entrée RX en interne — sans aucun composant électronique externe !

---

## 5. Liste du Matériel (BOM) & Outillage

| Réf. | Composant | Modèle Recommandé | Coût indicatif |
| :--- | :--- | :--- | :--- |
| 1 | **Module USB vers UART Série** | FTDI FT232RL (ou CH340G / CP2102) en logique 5 V | 3,50 € – 6,00 € |
| 2 | **Fiche Modulaire & Câble** | Fiche RJ12 (6P6C) ou RJ11 (6P4C) + 1–2 m de câble plat 4/6 fils | 1,00 € |
| 3 | **Transistor NPN** *(Méthode A)* | BC547, BC548, 2N3904 ou 2N2222 | 0,15 € |
| 4 | **Résistance R1** *(Méthode A)* | Résistance 1 kΩ 1/4 W (*Pull-up*) | 0,05 € |
| 5 | **Résistance R2** *(Méthode A)* | Résistance 10 kΩ 1/4 W (limitation courant de base) | 0,05 € |
| 6 | **Gaine Thermorétractable** | Manchons polyoléfines 3 mm et 6 mm | 0,20 € |

**Outils requis :** Pince à sertir RJ11/RJ12, pince à dénuder, fer à souder et multimètre numérique.

---

## 6. Méthode A : Assemblage avec Inverseur Matériel à Transistor

```
  PORT P1 DU COMPTEUR COMMUNICANT                   CARTE USB-UART (CH340 / FTDI)
  ===============================                   =============================

  [ Broche 2: RTS ] ──────────────────────────────────────── [ Broche +5V VCC ]
                                                      (Maintient RTS HAUT pour émettre)

  [ Broche 3: GND ] ──────────────────────────────────────── [ Broche GND ]
                                                      (Masse de signal)

                                  +5V (depuis USB)
                                       │
                                      ┌┴┐
                                      │ │ R1 (1 kΩ Pull-up)
                                      └┬┘
                                       ├──────────── [ Broche RXD ] (Entrée TTL inversée)
                                       │
                                     C │
  [ Broche 5: TXD ] ──[ 10 kΩ R2 ]────┤  BC547 (Transistor NPN)
                                     B ╲
                                       │ E
                                       │
  [ Broche 3/6: GND ] ─────────────────┴──────────── [ Broche GND ]
```

### Fonctionnement du Montage
1. Lorsque la broche 5 P1 est **Basse (0 V / Repos)**, le transistor est bloqué. La résistance R1 ramène l'entrée RXD de l'adaptateur USB à **+5 V (Haut)**, ce qui correspond au repos UART.
2. Lorsque la broche 5 P1 passe à **+5 V (Bit 0)**, le transistor sature et tire la broche RXD à **0 V (Masse)**.
3. Les bits sont inversés proprement avec un temps de propagation inférieur à la microseconde.

---

## 7. Méthode B : Câblage Direct 3 Fils avec Inversion EEPROM FTDI

Avec un adaptateur USB authentique **FTDI FT232RL**, aucune résistance ni transistor ne sont nécessaires.

### Schéma de Câblage 3 Fils
```
  COMPTEUR COMMUNICANT P1 (RJ11 ou RJ12)            ADAPTATEUR USB FTDI FT232RL
  ======================================            ===========================

  [ Broche 2: RTS ] ──────────────────────────────── [ +5V (VCC) ] (Tire RTS à +5V)

  [ Broche 3: GND ] ──────────────────────────────── [ GND ]

  [ Broche 5: TXD ] ──────────────────────────────── [ RXD ] (Liaison directe)
```

### Flasher l'Inversion FTDI sous Linux (en 60 Secondes)
```bash
# 1. Installer ftdi-eeprom
sudo apt-get update && sudo apt-get install -y ftdi-eeprom

# 2. Créer le fichier de configuration
cat << 'EOF' > ftdi_p1.conf
vendor_id=0x0403
product_id=0x6001
invert_rxd=true
EOF

# 3. Flasher l'EEPROM de la puce FTDI
sudo ftdi_eeprom --flash-eeprom ftdi_p1.conf

# 4. Débrancher puis rebrancher le câble USB
```

*(Sous Windows, utilisez l'outil gratuit **FT_Prog** de FTDI : Scan &rarr; Hardware Specific &rarr; Invert RS232 Signals &rarr; Cochez « Invert RXD » &rarr; Program).*

---

## 8. Montage du Câble & Vérification au Multimètre

1. **Dénudage :** Retirez 25 mm de gaine extérieure et dénudez chaque conducteur sur 4 mm.
2. **Sertissage de la fiche :** Ergot plastique orienté vers le bas, contacts dorés vers le haut :
   - RJ12 (6P6C) : Broche 1 (gauche, +5V optionnel) &bull; Broche 2 (RTS) &bull; Broche 3 (GND) &bull; Broche 4 (NC) &bull; Broche 5 (TxD) &bull; Broche 6 (GND).
   - RJ11 (4 fils) : Fil 1 &rarr; Broche 2 (RTS) &bull; Fil 2 &rarr; Broche 3 (GND) &bull; Fil 3 &rarr; Broche 4 (NC) &bull; Fil 4 &rarr; Broche 5 (TxD).
3. **Soudure sur l'adaptateur USB :** Reliez RTS au +5V, GND au GND et TxD selon la Méthode A ou la Méthode B.
4. **Contrôle de Sécurité Obligatoire au Multimètre :**
   - Réglez le multimètre en mode **Continuité / Ohmmètre (Ω)**.
   - Testez entre **+5V et GND** : vérifiez l'**absence totale de court-circuit** (résistance infinie / OL).
   - Testez entre **TxD et GND** : vérifiez l'absence de court-circuit.

---

## 9. Activer le Port P1 auprès de Votre Gestionnaire de Réseau

En Belgique (Fluvius, ORES, RESA, Sibelga), le port P1 est verrouillé électroniquement par défaut afin de protéger la vie privée de l'usager.

### Activation chez Fluvius (Flandre, Belgique)
1. Connectez-vous sur [Mijn Fluvius](https://www.fluvius.be).
2. Ouvrez **Meters & Aansluitingen** &rarr; Sélectionnez votre compteur électrique (code EAN).
3. Repérez **« Poorten digitaal beheer (P1 en S1) »** &rarr; Cliquez sur **« Activeer gebruikerspoorten »**.
4. L'activation à distance par réseau mobile prend entre 15 minutes et 72 heures.
5. **Confirmation sur l'Écran du Compteur :**
   - **VERROUILLÉ :** Icône cadenas plein (🔒) au-dessus de « P1 ».
   - **ACTIF :** Le cadenas disparaît et est remplacé par un triangle pointant vers le bas (▼) au-dessus de « P1 ».

*(En Wallonie et à Bruxelles, l'ouverture du port P1 s'effectue gratuitement via le portail client ORES, RESA ou Sibelga. Aux Pays-Bas, les compteurs DSMR 4 et DSMR 5 sont actifs par défaut).*

---

## 10. Vérification Série sous Linux

Branchez le câble USB sur votre Raspberry Pi 5 GEMS :

```bash
# 1. Vérifier la détection USB
dmesg | grep -E "ttyUSB|FTDI|ch341"
# Résultat : usb 1-1.2: FTDI USB Serial Device converter now attached to ttyUSB0

# 2. Lire les télégrammes en direct
stty -F /dev/ttyUSB0 115200 cs8 -cstopb -parenb
cat /dev/ttyUSB0
```

Des télégrammes ASCII parfaitement lisibles doivent défiler chaque seconde :
```
/FLU5\253769484_A

0-0:96.1.4(50217)
0-0:1.0.0(260912224500S)
1-0:1.8.1(004218.412*kWh)
1-0:1.8.2(003189.102*kWh)
1-0:1.7.0(01.850*kW)
1-0:2.7.0(00.000*kW)
1-0:1.6.0(260908183000S)(02.450*kW)
!5F2A
```

---

## 11. Configurer le Compteur Communicant dans l'Interface GEMS

1. Ouvrez votre navigateur à l'adresse `http://ems.local`.
2. Rendez-vous dans **Paramètres &rarr; Appareils** (en déverrouillant le **Mode installateur certifié** via l'icône cadenas).
3. **Détection Automatique en Un Clic (Recommandée) :** Cliquez sur **Détecter les appareils série** dans l'en-tête d'ajout d'appareil (ou passez par **Scanner &rarr; Analyser les ports série &rarr; Configurer**). GEMS identifie automatiquement votre compteur DSMR / e-MUCS P1, le chemin persistant `/dev/serial/by-id/*` et le débit (`115200` ou `9600`), puis pré-remplit le formulaire.
4. **Sélection Manuelle :** Vous pouvez également choisir la catégorie **Compteur intelligent**, sélectionner le modèle matériel **DSMR P1 RJ12 Serial Dongle (/dev/serial/by-id)** et vérifier :
   - **Nom de l'appareil :** `Grid Main Smart Meter` (ou `Compteur Principal P1`)
   - **Port série :** Chemin persistant `/dev/serial/by-id/...` (ou cliquez sur **Détection auto** à côté du champ)
   - **Débit (Baud Rate) :** `115200` (pour Fluvius/ORES/RESA et DSMR 5) ou `9600` (pour DSMR 2/3/4)
   - **Intervalle d'interrogation :** `1` seconde
5. Cliquez sur **Enregistrer / Ajouter l'appareil**. La télémétrie remonte instantanément sur le **Tableau de bord** !

---

## 12. Guide de Dépannage

| Symptôme | Cause Probable | Action Corrective |
| :--- | :--- | :--- |
| **Caractères illisibles ou bruit binaire** | Inversion du signal absente ou mauvais débit en bauds | Vérifiez le montage inverseur à transistor ou FTDI `invert_rxd=true`. Réglez le débit sur 115200. |
| **`cat /dev/ttyUSB0` n'affiche rien** | Broche RTS 2 à 0 V ou port P1 verrouillé | Vérifiez la présence de +5,0 V sur la broche 2 au multimètre. Vérifiez l'absence du cadenas sur l'écran LCD du compteur (demandez l'activation sur le portail GRD). |
| **« Permission denied » sur `/dev/ttyUSB0`** | L'utilisateur `gems` n'appartient pas au groupe `dialout` | Exécutez `sudo usermod -a -G dialout gems && sudo systemctl restart gems`. |
| **Le port bascule vers `/dev/ttyUSB1`** | Réattribution USB après redémarrage | Utilisez systématiquement `/dev/serial/by-id/<device-id>` au lieu de `/dev/ttyUSB0` dans GEMS. |
| **Avertissements intermittents `DSMR CRC mismatch`** | Couplage CEM sur cordon RJ12 non blindé ou doubleur P1 passif | GEMS draine automatiquement le flux 1 Hz et relit immédiatement la trame suivante ; éloignez le cordon RJ12 des câbles AC de puissance et utilisez un répartiteur P1 actif. |
