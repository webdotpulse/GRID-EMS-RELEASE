# Appareils Compatibles & Référence d'Intégration Matérielle

> 🌐 **Langue** : [🇬🇧 English (`Supported_devices.md`)](Supported_devices.md) | [🇳🇱 Nederlands (`Supported_devices.nl.md`)](Supported_devices.nl.md) | **🇫🇷 Français**

> **GEMS (Grid Energy Management System)** — Référentiel complet de compatibilité matérielle, registres de télémétrie, consignes pilotables et automatisations concrètes pour l'ensemble des 172 profils matériels (184 modèles enregistrés).

---

## Table des Matières

1. [Vue d'Ensemble & Architecture Système](#vue-densemble-architecture-système)
2. [Rôle Concret de GEMS avec Vos Appareils](#rôle-concret-de-gems-avec-vos-appareils)
3. [Matrice Récapitulative par Catégorie](#matrice-récapitulative-par-catégorie)
   - [Onduleurs Solaires & Hybrides (37 Appareils)](#tableau-récapitulatif-onduleurs-solaires-hybrides-37-appareils)
   - [Systèmes Dédiés de Stockage par Batterie (18 Appareils)](#tableau-récapitulatif-systèmes-dédiés-de-stockage-dénergie-par-batterie-bess-18-appareils)
   - [Bornes de Recharge VE & Wallbox (61 Appareils)](#tableau-récapitulatif-bornes-de-recharge-pour-véhicules-électriques-ve-wallbox-61-appareils)
   - [Compteurs Intelligents & Analyseurs de Réseau (40 Appareils)](#tableau-récapitulatif-compteurs-intelligents-analyseurs-de-réseau-40-appareils)
   - [Relais Intelligents & Actionneurs Thermiques (12 Appareils)](#tableau-récapitulatif-relais-intelligents-actionneurs-thermiques-12-appareils)
4. [Spécifications Détaillées par Appareil](#spécifications-détaillées-par-appareil)
   - [1. Onduleurs Solaires & Hybrides (37 Appareils)](#1-onduleurs-solaires-hybrides-37-appareils)
   - [2. Systèmes Dédiés de Stockage par Batterie (18 Appareils)](#2-systèmes-dédiés-de-stockage-dénergie-par-batterie-bess-18-appareils)
   - [3. Bornes de Recharge VE & Wallbox (61 Appareils)](#3-bornes-de-recharge-pour-véhicules-électriques-ve-wallbox-61-appareils)
   - [4. Compteurs Intelligents & Analyseurs de Réseau (40 Appareils)](#4-compteurs-intelligents-analyseurs-de-réseau-40-appareils)
   - [5. Relais Intelligents & Actionneurs Thermiques (12 Appareils)](#5-relais-intelligents-actionneurs-thermiques-12-appareils)
5. [Protocoles de Communication & Configuration Réseau](#protocoles-de-communication-configuration-réseau)

---

## Vue d'Ensemble & Architecture Système

GEMS est un système de gestion de l'énergie (EMS) léger, à très faible latence et intégralement piloté par interface graphique, conçu pour fonctionner en périphérie (edge) sur Raspberry Pi (Debian/Linux). L'ensemble du système fonctionne en **priorité locale (local-first)** et exécute chaque seconde une boucle de régulation fermée. Aucun fichier YAML ni script manuel n'est requis : la découverte, la configuration, l'étalonnage et le pilotage des équipements s'effectuent entièrement depuis l'interface web.

### Niveaux de Support Commercial & Badges de Capacité
Chaque pilote matériel natif dans GEMS est classé selon un niveau de validation commerciale explicite :
- **Vérifié (`verified`)** : Pilotes commerciaux de rang 1 validés sur le terrain (incluant les plateformes de référence **Solis** et **RAEDIAN**, les onduleurs SunSpec standards, les compteurs DSMR/P1, les compteurs Modbus Eastron/Carlo Gavazzi/Chint/Siemens, les bornes OCPP 1.6-J et les relais Shelly/SG-Ready). Affichés par défaut lors de la mise en service.
- **Expérimental (`experimental`)** : Équipements régionaux secondaires et passerelles cloud accessibles via l'option **Afficher les pilotes expérimentaux** dans **Paramètres &rarr; Appareils** (avec le **Mode Installateur** déverrouillé).
- **Lecture seule (`monitor_only`)** : Pilotes d'acquisition télémétrique en lecture seule pour matériels à registres de commande fermés. GEMS intègre leurs flux de puissance, d'énergie et de courants de phase dans l'équilibrage global du site sans émettre d'écritures non vérifiées.

### Profils Fonctionnels Matériels Standardisés
Chaque intégration matérielle dans GEMS expose un socle normalisé de télémétrie et de contrôle actif :

- **Acquisition Télémétrique Universelle** : Prise en charge sur les 168 profils matériels (180 modèles enregistrés), normalisant la supervision de connectivité, la puissance active en temps réel (W), le flux batterie (W), l'échange réseau (W), l'énergie cumulée (kWh) et l'état de charge batterie (%).
- **Modulation Dynamique du Courant VE & Commutation de Phases** : Implémentée par les bornes VE intelligentes pour moduler l'intensité en temps réel (6 A–32 A) et basculer automatiquement le contacteur entre monophasé et triphasé.
- **Pilotage Bidirectionnel de Stockage & Limites BMS Dynamiques** : Implémenté par les onduleurs hybrides et systèmes BESS pour forcer la charge ou la décharge tout en respectant en direct les limites thermiques et d'intensité du BMS.
- **Bridage Solaire Actif (Écrêtement)** : Implémenté par les onduleurs photovoltaïques pour réduire proportionnellement la production lors des prix spot négatifs, des ordres de téléconduite gestionnaire de réseau ou des contraintes zéro-injection.
- **Pilotage de Relais Intelligents & SG-Ready** : Implémenté par les contacteurs connectés, interfaces de pompes à chaleur et routeurs solaires linéaires pour valoriser les excédents en eau chaude sanitaire et chauffage.
- **Mesure Directionnelle des Courants & Tensions par Phase** : Implémentée par les compteurs intelligents et bornes avancées pour remonter les courants ($I_{L1}, I_{L2}, I_{L3}$) et tensions ($V_{L1}, V_{L2}, V_{L3}$) nécessaires à la protection du disjoncteur général.
- **Comptage Fiscal & Pointe Quart-Horaire** : Implémenté par les compteurs numériques DSMR/P1 et compteurs d'énergie pour suivre les index d'injection, le gaz ($m^3$) et la pointe moyenne glissante sur 15 minutes du tarif capacitaire (W).
- **Coordination Multi-Connecteurs EVSE** : Implémentée par les bornes doubles (telles que RAEDIAN Gemini) afin de gérer indépendamment la télémétrie et le partage dynamique de courant sur plusieurs prises.

---

## Rôle Concret de GEMS avec Vos Appareils

GEMS orchestre l'ensemble des appareils raccordés au sein d'un écosystème énergétique unifié. Voici les actions automatisées concrètes exécutées en temps réel par le moteur stratégique GEMS :

### 1. 🌞 Mode Eco (100 % Autoconsommation Solaire)
- **Fonctionnement** : Le moteur surveille en permanence l'excédent photovoltaïque instantané disponible derrière le compteur.
- **Action** : Le surplus solaire est orienté selon une cascade de priorités :
  1. Charge prioritaire de la batterie domestique (BESS) jusqu'à sa consigne cible.
  2. Modulation fine du courant de charge VE de 6 A à 32 A (ou bascule de monophasé vers triphasé) pour absorber le surplus restant.
  3. Enclenchement des relais intelligents pour alimenter les ballons ECS, routeurs solaires ou pompes à chaleur SG-Ready.
- **Résultat** : Évite l'injection sur le réseau à faible valorisation et maximise l'autoconsommation directe d'énergie verte gratuite.

### 2. 🇧🇪 Écrêtement du Tarif Capacitaire Flamand & Plafond Adaptatif Dynamique
- **Fonctionnement** : Prévient les surcoûts mensuels liés au tarif capacitaire flamand (*Capaciteitstarief*) en surveillant la demande moyenne sur chaque fenêtre réglementaire synchronisée de 15 minutes.
- **Action** : Dès que la puissance quart-horaire projetée approche le plafond configuré diminué de la marge de sécurité :
  1. Réduit immédiatement la charge VE jusqu'à 6 A ou met la session en pause (0 A).
  2. Commande la décharge de la batterie hybride vers l'habitation pour raboter la pointe.
  3. Coupe temporairement les relais thermiques non prioritaires.
- **Plafond Adaptatif Dynamique** : Si une pointe domestique inévitable survient au cours du mois (p. ex. 4,8 kW liés au four et aux plaques à induction), GEMS relève automatiquement son plafond opérationnel à ce pic déjà enregistré jusqu'à la fin du mois civil. Le véhicule peut ainsi recharger plus rapidement sans ajouter le moindre euro à la facture capacitaire mensuelle.

### 3. 🇳🇱 Zéro-Injection Pays-Bas & Bridage Solaire
- **Fonctionnement** : Protège les installations néerlandaises contre les frais d'injection réseau et la fin progressive du mécanisme de compensation (*salderingsregeling*).
- **Action** : Priorise le stockage local et la charge VE. Lorsque la batterie est pleine et que l'injection dépasse le seuil autorisé, GEMS écrit en Modbus des consignes de limitation (`SetActivePowerLimit`) dans les onduleurs solaires afin de brider ou stopper l'exportation.

### 4. 💶 Protection contre les Prix Spot Négatifs & Bouclier Certificats Verts (GSC)
- **Fonctionnement** : Protège les titulaires de contrats dynamiques (EPEX Spot Day-Ahead) contre les pénalités financières d'injection lors des heures à prix négatifs (week-ends ensoleillés à faible demande industrielle).
- **Action** : Bride automatiquement les onduleurs photovoltaïques dès que le prix spot d'exportation descend sous `min_profitable_export_price`.
- **Bouclier Subventions Certificats Verts (GSC)** : Pour les installations belges bénéficiant encore de certificats verts (p. ex. 250 €/MWh soit 0,25 €/kWh), un bridage dès 0,00 €/kWh ferait perdre d'importants revenus de certificats. GEMS applique automatiquement la formule :
  $$\text{Seuil Effectif de Bridage} = \text{min\_profitable\_export\_price} - \frac{\text{gsc\_value\_eur\_mwh}}{1000.0}$$
  Avec une aide de 250 €/MWh, GEMS maintient la production solaire active jusqu'à **-0,250 €/kWh** et ne bride l'onduleur que si la pénalité négative dépasse la valeur du certificat.

### 5. 🔋 Arbitrage Batterie Dynamique EPEX Day-Ahead
- **Fonctionnement** : Croise les tarifs horaires Day-Ahead du marché spot (récupérés chaque jour à 14h00 CET) avec les prévisions d'ensoleillement Open-Meteo sur 24 heures.
- **Action** :
  - **Charge Forcée sur Réseau** : Commande la recharge de la batterie depuis le réseau pendant les heures les moins chères ou négatives (p. ex. 02h00–05h00 ou creux méridiens) ainsi que durant les plages super-creuses du fournisseur.
  - **Décharge en Pointe** : Préserve ou décharge l'énergie stockée lors des pointes tarifaires du soir (18h00–21h00) pour couvrir les besoins du foyer sans soutirer d'électricité coûteuse.

### 6. 🚗 Recharge VE Intelligente (Boost Heures les Moins Chères)
- **Fonctionnement** : Analyse automatiquement la courbe EPEX sur 24 heures afin d'identifier les $N$ heures les plus économiques de la journée (`smart_ev_cheapest_hours`).
- **Action** : Accélère la charge VE à pleine puissance disponible (16 A ou 32 A) durant ces créneaux optimaux et met la charge en veille (0 A) pendant les heures chères, sauf dérogation d'un planning utilisateur.

### 7. ⚡ Équilibrage Dynamique par Phase (DLB) & Protection Fusible Principal
- **Fonctionnement** : Contrôle en continu le courant individuel de chaque phase ($I_{L1}, I_{L2}, I_{L3}$) au compteur de tête par rapport au calibre du disjoncteur général (`grid_nominal_current_a`, p. ex. 25 A, 32 A, 40 A ou 63 A).
- **Action** : Si l'une des phases dépasse 90 % du calibre nominal, GEMS réduit la consigne de la borne VE en quelques millisecondes afin d'éviter toute disjonction générale.

### 8. 🔌 Commutation Dynamique de Phases (Monophasé / Triphasé)
- **Fonctionnement** : La norme CEI 61851 impose un courant minimal de charge de 6 A. En triphasé, 3 × 6 A = 18 A (~4,1 kW), ce qui empêche d'exploiter un petit surplus solaire inférieur à 4,1 kW sans tirer sur le réseau.
- **Action** : Sur les bornes compatibles (go-e, RAEDIAN, Alfen, Mennekes, Peblar, Huawei, cFos, openWB, Tinkerforge), GEMS enclenche le mode monophasé (1,4 kW à 7,4 kW) dès les premiers excédents solaires, puis bascule automatiquement en triphasé (4,1 kW à 22 kW) lorsque le surplus dépasse 4,2 kW.

### 9. 🚰 Stockage Thermique & Automatisation par Relais Intelligents
- **Fonctionnement** : Pilote les équipements thermiques via contacts secs libres de potentiel, prises connectées ou registres Modbus directs.
- **Action** : Ferme les contacteurs des chauffe-eau ECS ou pompes de piscine, ou active **l'État de fonctionnement SG-Ready 3 (mode Boost)** des pompes à chaleur lorsque l'exportation solaire dépasse un seuil configurable (p. ex. > 1 500 W pendant 2 minutes), tout en imposant des temps minimaux de marche et d'arrêt pour préserver les compresseurs.

---

## Matrice Récapitulative par Catégorie

### Tableau Récapitulatif : Onduleurs Solaires & Hybrides (37 Appareils)

| Nom de l'Appareil | Identifiant | Marque | Protocole | Port / Bus par Défaut | Données Lues | Consignes Pilotées | Rôle d'Automatisation GEMS |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Afore Onduleur Hybride** | `afore_inverter` | Afore | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Production solaire PV en temps réel (W), Puissance de charge/décharge batterie (W), Puissance réseau prélevée/injectée (W), Production solaire cumulée (kWh), État de charge de la batterie (SOC %), Courants de sortie triphasés de l'onduleur (L1, L2, L3 en A). | Mode énergétique EMS & consignes de charge/décharge forcée (Holding `3000`/`3002`), plus Limite de réduction de puissance active (`0–100%`). | Pilotage hybride en boucle fermée pour onduleurs Afore AF-S et AF-T : charge et décharge dynamiquement la batterie pour l'écrêtage capacitaire flamand et l'arbitrage spot EPEX, tout en bridant l'injection PV lors des heures à prix négatifs. |
| **Alpha ESS Storion SMILE** | `alpha_ess_inverter` | Alpha ESS | `MODBUS` | Port par défaut : 502 ou 8502, ID esclave : 85 | Puissance solaire PV active (W), Puissance de charge/décharge batterie (W), Prélèvement/injection réseau net (W), Énergie cumulée (kWh), SOC batterie (%), Courants triphasés (L1, L2, L3 en A). | Pilotage du mode Dispatch (`0x084F`), consigne d'offset de puissance active (`0x0850`–`0x0851` avec biais de 32 000 W), cible SOC et limite d'injection réseau. | Pilotage complet en boucle fermée pour Alpha ESS Storion SMILE : envoie des consignes précises de charge/décharge en watts pour l'arbitrage EPEX Day-Ahead et la protection du plafond capacitaire flamand, avec écrêtement solaire actif. |
| **Anker SOLIX X1 Onduleur Hybride** | `anker_inverter` | Anker | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance solaire PV (W), Flux batterie (W), Puissance d'échange réseau (W), Énergie totale cumulée (kWh), SOC batterie (%), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Mode de fonctionnement EMS Anker SOLIX X1 et consignes de charge/décharge forcée (W), ainsi que bridage actif d'injection. | Régulation hybride résidentielle triphasée en boucle fermée pour Anker SOLIX X1 : exécute automatiquement l'écrêtage des pointes par batterie, la charge spot en heures creuses et le bridage solaire à prix négatifs. |
| **Deye / Sunsynk Onduleur Hybride** | `deye_inverter` | Deye | `MODBUS` | Port par défaut : 502 ou 8899, ID esclave : 1 | Production solaire PV (W), Puissance de charge/décharge batterie (W), Puissance du compteur réseau (W), Énergie totale cumulée (kWh), SOC batterie (%), Courants triphasés de l'onduleur (L1, L2, L3 en A). | Consignes Time-of-Use de charge et décharge réseau, plages SOC min./cible et limite dynamique max. de revente solaire (Holding `143` / `340`, mise à l'échelle auto BT & HT). | Pilotage intégral en boucle fermée des onduleurs hybrides BT/HT Deye et Sunsynk : assure l'écrêtage capacitaire flamand sous la seconde, l'arbitrage batterie EPEX Day-Ahead et le bridage zéro-injection ou à prix négatifs. |
| **Enerlution Onduleur Hybride** | `enerlution_inverter` | Enerlution | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance solaire PV (W), Puissance batterie (W), Puissance réseau (W), Énergie cumulée (kWh), SOC batterie (%), Courants triphasés (L1, L2, L3 en A). | Limite de bridage de puissance active (W ou % via Modbus registers 40400/40441). | Intégration complète de bridage actif : réduit automatiquement la puissance de l'onduleur durant les heures spot EPEX Day-Ahead négatives (Mode Pays-Bas / Zéro-Injection) tout en respectant la valeur des certificats verts flamands (GSC), et route le surplus solaire vers la batterie et le VE. |
| **Enphase IQ Gateway / Envoy** | `enphase_envoy` | Enphase | `REST` | Port par défaut : 80 / 443, Endpoints: /api/v1/production, /ivp/livedata/status | Production solaire PV agrégée des micro-onduleurs (W), Puissance de charge/décharge IQ Battery (W), Prélèvement/injection réseau net (W), Production totale cumulée (kWh), SOC batterie (%), Courants et tensions par phase. | Limitation dynamique d'injection HTTPS locale (jeton Bearer JWT) sur Enphase IQ Gateway et pilotage des modes de stockage IQ Battery. | Intégration locale prioritaire avec Enphase IQ Gateway Metered et IQ Battery : collecte localement les flux de production, consommation et stockage et coordonne la limitation d'injection lors des prix négatifs sans dépendance au cloud. |
| **FoxESS H1 / H3 / H3-Pro Onduleur Hybride** | `foxess_inverter` | FoxESS | `MODBUS` | Port par défaut : 502, ID esclave : 1 ou 247 | Production solaire PV (W), Puissance batterie (W), Puissance active réseau (W), Énergie totale (kWh), SOC batterie (%), Courants triphasés (L1, L2, L3 en A). | Mode de travail FoxESS (`41000` / `44000`), consignes de puissance EMS à distance (W), seuil SOC minimal et limite active d'injection. | Pilotage complet en boucle fermée des gammes hybrides FoxESS H1, H3 et H3-Pro : commande la charge/décharge forcée pour l'arbitrage spot et l'écrêtage des pointes ainsi que la limitation active d'injection PV. |
| **Fronius Gen24 Onduleur** | `fronius_inverter` | Fronius | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Production solaire PV (W), Puissance de charge/décharge batterie (W), Flux de puissance réseau (W), Énergie cumulée (kWh), BYD / Fronius SOC batterie (%). | Limite de puissance active SunSpec Modèle 123 (`WMaxLimPct` registre simple FC06) et pilotage charge/décharge SunSpec Modèle 124 (`StorCtl_Mod`, `OutWRte`, `InWRte`). | Contrôle complet en boucle fermée pour Fronius Symo / Primo / Gen24 Plus : régule la puissance de charge/décharge des batteries BYD Battery-Box HVS/HVM pour l'arbitrage spot et l'écrêtage, et bride la production PV lors des prix négatifs. |
| **GoodWe Onduleur** | `goodwe_inverter` | GoodWe | `MODBUS` | Port par défaut : 502 ou 8899, ID esclave : 247 | Puissance solaire PV (W), Puissance de charge/décharge batterie (W), Flux réseau net (W), Énergie totale cumulée (kWh), SOC batterie (%). | Mode de puissance EMS GoodWe ET/EH/BT/BH (`47511` modes `1`/`2`/`8`/`9`), consigne EMS (`47512` W) et activation/valeur de limite d'injection réseau (`47509`–`47510`). | Pilotage hybride vérifié en boucle fermée pour onduleurs GoodWe ET/EH/BT/BH : automatise l'écrêtage des pointes par batterie, l'arbitrage spot Day-Ahead et la limitation dynamique d'exportation PV. |
| **Growatt Onduleur** | `growatt_inverter` | Growatt | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance solaire PV active (W), Puissance batterie (W), Injection/consommation réseau (W), kWh cumulés, SOC batterie (%). | Mode de priorité Growatt SPH / MOD TL3-XH (`1044` / `3049`), taux de charge/décharge & SOC d'arrêt (`1070`–`1092`) et taux de puissance active / limite d'injection (`3`, `122`–`123`). | Contrôle vérifié en boucle fermée pour onduleurs hybrides et string Growatt SPH et MOD : gère la charge forcée batterie, la décharge en pointe et l'écrêtement PV à prix spot négatifs. |
| **Huawei Onduleur Hybride** | `huawei_inverter` | Huawei | `MODBUS` | Ethernet/WLAN | Production solaire PV active (W, reg 32080), Puissance de charge/décharge batterie LUNA2000 (W, reg 37001), Puissance réseau prélevée/injectée via DTSU666-H (W, reg 37113), Production cumulée (kWh, reg 32106), SOC batterie (%, reg 37004). | Consigne de charge / décharge forcée batterie (W, reg 40118/40120), Limite de bridage de puissance active (W ou % de la puissance nominale, reg 40118/40125). | Pilotage bidirectionnel complet de la batterie et de l'écrêtement : commande la décharge de la LUNA2000 lors des pointes domestiques (tarif capacitaire flamand), force la charge réseau durant les heures EPEX creuses/négatives et bride la puissance PV lors des prix d'injection négatifs ou en mode zéro-injection. |
| **LG ESS Home (8 / 10 / 15)** | `lg_ess` | LG | `REST` | Port par défaut : 80 / 443, JSON endpoints: /v1/user/setting/network | Production solaire PV (W), Flux de puissance batterie (W), Prélèvement/injection réseau (W), Énergie cumulée (kWh), SOC batterie (%). | Pilotage local LG ESS Home `/v1/user/setting/batt` (charge forcée / autoconsommation) et bridage de puissance PCS. | Intégration HTTPS locale sans cloud pour systèmes LG ESS Home 8 / 10 / 15 avec charge batterie automatisée en heures creuses et équilibrage des flux réseau. |
| **Marstek Venus / Jupiter Storage** | `marstek_storage` | Marstek | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance solaire PV (W), Puissance de charge/décharge batterie (W), Puissance d'échange réseau (W), Énergie totale (kWh), SOC batterie (%). | Activation du mode passif Marstek Venus C / E / Jupiter (`42000 = 0x55AA`), contrôle de direction (`42010`) et consignes exactes de charge/décharge en Watts (`42020`–`42021`). | Régulation complète en boucle fermée du stockage couplé AC Marstek Venus C/E et Jupiter : absorbe le surplus solaire, écrête les pointes capacitaires domestiques et exécute l'arbitrage spot Day-Ahead. |
| **SAJ eSolar (H1 / H2 / R5 / R6 Onduleur Hybride)** | `saj_hybrid` | SAJ | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Production solaire PV (W), Puissance batterie (W), Puissance active réseau (W), Énergie totale (kWh), SOC batterie (%), Courants triphasés (L1, L2, L3 en A). | Consignes passives de charge et décharge (W) SAJ H1 / H2 / R5 / R6 AppMode et limite de réduction de puissance active (`0.1%`). | Gestion hybride en boucle fermée des systèmes SAJ H1/H2 : coordonne le bridage PV triphasé, la charge forcée en heures creuses et l'écrêtage des pointes de demande. |
| **SMA Sunny Boy / Tripower / Onduleur de Stockage** | `sma_inverter` | SMA | `MODBUS` | Port par défaut : 502, ID esclave : 126 ou 3 | Production solaire PV (W, reg 30775), Puissance de charge/décharge batterie (W, reg 31393), Puissance active réseau (W, reg 30865), Énergie totale (kWh, reg 30513), SOC batterie (%, reg 30845), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Limite de puissance active SMA (`WModCfg` / `WMaxLimPct`) et pilotage bidirectionnel de batterie pour Sunny Island / Sunny Boy Storage (`40151=802`, `40149`) et Sunny Tripower Smart Energy (`40236`, `40793`–`40801`). | Bridage solaire complet en boucle fermée et arbitrage batterie sur toute la gamme SMA Sunny Boy, Sunny Tripower, Sunny Tripower Smart Energy (STP-SE) et Sunny Boy Storage. |
| **Senergy (SE Series / Onduleur Hybride)** | `senergy_inverter` | Senergy | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance solaire PV active (W), Puissance de charge/décharge batterie (W), Échange réseau (W), Énergie cumulée (kWh), SOC batterie (%). | Consignes passives de puissance de charge/décharge (W) Senergy SE Hybrid et limite de puissance active de sortie (%). | Contrôle en boucle fermée des onduleurs hybrides Senergy : automatise l'écrêtage des pointes par batterie, la charge en heures creuses et le bridage PV à prix négatifs. |
| **Sigenergy SigenStor (Onduleur Hybride & Stockage)** | `sigenergy_hybrid` | Sigenergy | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance solaire PV (W), Flux batterie Sigen (W), Puissance d'échange réseau (W), Énergie totale (kWh), Sigen SOC batterie (%), Courants triphasés (L1, L2, L3 en A). | Activation Remote EMS SigenStor (`40029`), mode de fonctionnement (`40031`), consignes max. de charge/décharge (`40032`–`40034` U32 W) et limite de bridage PV (`40038`). | Pilotage EMS haute précision en boucle fermée pour systèmes 5-en-1 Sigenergy SigenStor : assure l'écrêtage capacitaire sous la seconde, l'arbitrage spot EPEX et la limitation d'injection PV. |
| **SofarSolar (HYD / G3 / AMASS Onduleur Hybride)** | `sofarsolar_hybrid` | SofarSolar | `MODBUS` | Port par défaut : 8899 ou 502, ID esclave : 1 | Puissance solaire PV (W), Puissance de charge/décharge batterie (W), Flux de puissance réseau (W), Énergie totale cumulée (kWh), SOC batterie (%), Courants triphasés (L1, L2, L3 en A). | Consignes de stockage passif SofarSolar HYD 5K–20KTL-3PH (`0x1187` mode, `0x1189`–`0x118D` S32 signé W) et limite de puissance active / anti-reflux. | Pilotage vérifié en boucle fermée pour systèmes hybrides SofarSolar HYD 3PH G3 et ME3000SP : régule la puissance de charge/décharge batterie et le bridage solaire. |
| **SolaX Onduleur** | `solax_inverter` | SolaX | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance solaire PV active (W), Puissance batterie (W), Puissance active réseau (W), Énergie totale (kWh), SOC batterie (%). | Mode Remote Control SolaX X1/X3-Hybrid G4 (`0x007C`–`0x0080`, cible exacte de puissance active W + chien de garde) avec repli sur mode manuel `0x001F` et limite utilisateur d'injection (`0x0042`). | Pilotage vérifié sous la seconde en boucle fermée pour systèmes SolaX X1/X3-Hybrid et Fit : optimise l'autoconsommation solaire, l'arbitrage tarifaire spot et l'écrêtement PV. |
| **SolarEdge Triphasé Onduleur** | `solaredge_3phase` | SolarEdge | `MODBUS` | Port par défaut : 1502 ou 502, ID esclave : 1 | Production solaire PV (W), Puissance de charge/décharge batterie (W), Puissance du compteur réseau (W), Énergie totale (kWh), SOC de la batterie Energy Bank connectée (%). | Mode de contrôle StorEdge `4` (Remote) SolarEdge, limite de charge/décharge (`0xE00E`/`0xE010` float32 W), commande de mode (`0xE00D`) et Advanced Power Control (`0xF001` / SunSpec M123). | Contrôle triphasé complet en boucle fermée SolarEdge Home Hub & StorEdge : module la puissance de charge/décharge batterie et bride la production PV lors des prix spot négatifs. |
| **SolarEdge Onduleur** | `solaredge_inverter` | SolarEdge | `MODBUS` | Port par défaut : 1502 ou 502, ID esclave : 1 | Production solaire PV (W), Puissance de charge/décharge batterie (W), Puissance active réseau (W), Énergie totale (kWh), SOC batterie (%). | Mode de contrôle StorEdge `4` (Remote) SolarEdge, limite de charge/décharge (`0xE00E`/`0xE010` float32 W), commande de mode (`0xE00D`) et Advanced Power Control (`0xF001` / SunSpec M123). | Contrôle monophasé complet en boucle fermée SolarEdge HD-Wave & Home Hub : pilote les consignes de charge/décharge StorEdge / Home Battery et limite la production solaire si nécessaire. |
| **Solis Onduleurs Hybrides & Retrofit (Référence Principale)** | `solis_hybrid` | Solis | `MODBUS` | Port par défaut : 502 ou 8899, ID esclave : 1 | Puissance active de production PV (W, reg 33079), Puissance de charge/décharge batterie (W, reg 33149), SOC batterie (%, reg 33139), Puissance active du compteur réseau (W, reg 33130), Production énergétique cumulée totale (kWh, reg 33029), Courants AC triphasés (0.1A, regs 33073-33075), Tensions triphasées (0.1V, regs 33076-33078). | Mode et limite de bridage de puissance active (W / % via registres Holding 43052/43070 sur Hybride et 3051/3052 sur String), consigne de charge et décharge forcée batterie (W via registres 43110/43129/43135/43136). | Plateforme de référence principale désignée pour les onduleurs solaires hybrides et le stockage par batterie. Exécute un bridage actif en boucle fermée sous la seconde durant les heures spot négatives (Mode Pays-Bas / Zéro-Injection), stocke automatiquement le surplus photovoltaïque, ajuste la puissance lors de l'écrêtage capacitaire flamand et orchestre l'arbitrage EPEX Day-Ahead (charge forcée en heures creuses et décharge en pointe). Les modèles Solis Retrofit fonctionnent de manière transparente en stockage couplé AC indépendant de toute chaîne PV. |
| **Sungrow Onduleur** | `sungrow_inverter` | Sungrow | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Production solaire PV (W, reg 5016), Puissance de charge/décharge batterie (W, reg 13021), Puissance d'échange réseau (W, reg 13009), Production cumulée (kWh, reg 5003), SBR SOC batterie (%, reg 13022). | Sélection du mode EMS Sungrow SH-RS / SH-RT / SH-T (`13049`), commande charge/décharge (`13050` `0xAA`/`0xBB`/`0xCC`), consigne de puissance (`13051` W) et limitation de puissance active (`5006`–`5007`). | Pilotage haute vitesse vérifié en boucle fermée pour onduleurs hybrides Sungrow SH et string SG : assure l'écrêtage sous la seconde, l'arbitrage batterie EPEX et le bridage PV. |
| **Victron Onduleur/GX** | `victron_inverter` | Victron | `MODBUS` | Port par défaut : 502, ID d'unité : 100 pour System Calc / 228 pour l'onduleur | Puissance solaire PV DC/AC (W, reg 811), Puissance de charge/décharge batterie (W, reg 842), Prélèvement/injection réseau AC net (W, reg 820), Énergie totale (kWh), SOC batterie (%, reg 843). | Consigne réseau ESS Victron Venus OS / Cerbo GX (`2700` S16 / `2703` S32 W), désactivation de décharge ESS et limite signée max. d'injection PV (`2706` par pas de 100 W). | Intégration approfondie en boucle fermée avec les systèmes Victron MultiPlus-II / Quattro GX ESS : pilote la consigne réseau AC pour l'arbitrage batterie et l'écrêtage, et limite l'injection excédentaire. |
| **ABB / Fimer Onduleur Solaire & Hybride** | `abb_fimer_inverter` | ABB / Fimer | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance solaire PV active (W, registre standard SunSpec 40083), État de charge de la batterie (SOC %), Puissance de charge / décharge batterie (W), Puissance injectée sur le réseau (W), Énergie produite cumulée (kWh). | SunSpec Model 123 Bridage de puissance active (écrêtement) (`WMaxLimPct`, `WMaxLim_Ena`) et Pilotage du taux de charge/décharge SunSpec Modèle 124 (`StorCtl_Mod`, `OutWRte`, `InWRte`). | Contrôle SunSpec complet en boucle fermée pour installations PV et hybrides ABB / Fimer REACT 2 : exécute le bridage solaire à prix spot négatifs, la limitation zéro-injection, l'écrêtage des pointes et l'arbitrage Day-Ahead. |
| **Autarco Onduleur Solaire** | `autarco_inverter` | Autarco | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance solaire PV active (W), Production journalière et totale cumulée (kWh), Tension AC réseau (V), Fréquence AC (Hz). | Consignes à distance de puissance de charge/décharge batterie (`43129` / `43135`–`43136`) et Limite de bridage de puissance active (`43052` / `0–100%`). | Pilotage complet en boucle fermée de l'onduleur hybride et du bridage PV pour systèmes Autarco S2.x / MH / LX : coordonne l'autoconsommation solaire, l'arbitrage spot batterie et l'écrêtage capacitaire flamand. |
| **Chisage ESS Onduleur Hybride** | `chisage_ess` | Chisage ESS | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance solaire PV active (W), Puissance de charge / décharge batterie (W), SOC batterie (%), Puissance réseau prélevée / injectée (W), Énergie cumulée de l'onduleur (kWh). | Lecture seule (Télémétrie uniquement — table de pilotage propriétaire fermée). | Intègre la télémétrie solaire et batterie hybride résidentielle, tertiaire et industrielle Chisage ESS dans l'équilibrage énergétique local GEMS. |
| **Delta Electronics Onduleur Solaire** | `delta_inverter` | Delta Electronics | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance générée solaire PV (W), Tensions et courants des chaînes DC, Production cumulée (kWh), Puissance AC réseau (W). | SunSpec Model 123 Bridage de puissance active (écrêtement) (`WMaxLimPct`, `WMaxLim_Ena`) et Pilotage de stockage SunSpec Modèle 124. | Télémétrie normalisée SunSpec en boucle fermée et bridage actif de puissance pour onduleurs solaires et hybrides résidentiels et tertiaires Delta. |
| **HYXiPOWER Onduleur Hybride** | `hyxipower_inverter` | HYXiPOWER | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Production solaire PV (W), Puissance de charge / décharge batterie (W), SOC batterie (%), Échange réseau (W), Énergie cumulée (kWh). | Autonome / Acquisition télémétrique en lecture seule. | Transmet en continu les mesures de production PV et de stockage batterie vers le schéma PowerFlow et le moteur de télémétrie GEMS. |
| **KSTAR BluE Onduleur Hybride** | `kstar_inverter` | KSTAR | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance solaire PV active (W), Puissance de charge / décharge batterie (W), SOC batterie (%), Flux de puissance réseau (W), Courants de phase (L1, L2, L3 en A). | Autonome / Acquisition télémétrique en lecture seule. | Alimente l'équilibreur de charge et le moteur d'optimisation multi-tarifs GEMS avec les mesures hybrides solaires et batterie. |
| **Solinteg Integ M Onduleur Hybride** | `solinteg_inverter` | Solinteg | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance solaire PV active (W), Puissance de charge / décharge batterie (W), SOC batterie (%), Puissance nette d'échange réseau (W), Production cumulée (kWh). | Mode EMS à distance Solinteg série Integ M, consignes de puissance charge/décharge et limite de puissance active. | Pilotage hybride haute tension triphasé vérifié en boucle fermée pour onduleurs résidentiels et tertiaires Solinteg Integ M (4–50 kW). |
| **Solplanet / AISWEI Onduleur** | `solplanet_inverter` | Solplanet (AISWEI) | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance solaire PV active (W), Production énergétique totale (kWh), Tension et courant AC par phase, prélèvement/injection réseau (W). | Mode batterie AISWEI / Solplanet (`1103` bus / `41104` doc), consigne signée de charge/décharge (`1152` S16 W) et contrôle de puissance active (`4000` / `5402` `0,01 %`). | Pilotage vérifié en boucle fermée pour onduleurs Solplanet ASW H-T2/T3 et KACO blueplanet hybrid NH3 : applique des consignes batterie exactes en watts et un bridage PV dynamique. |
| **APsystems EZ1-M / EZ1-D Micro-onduleur Local** | `apsystems_ez1` | APsystems | `REST` | Port par défaut : 8050, Endpoints: `/getOutputData`, `/setMaxPower` | Puissance active PV Canal 1 & Canal 2 (W), Énergie totale produite cumulée (kWh). | Consigne locale directe de puissance AC maximale (`/setMaxPower?p=30..800` W). | Télémétrie locale de micro-onduleur 100 % sans cloud et limitation continue de puissance active lors des prix spot EPEX négatifs ou en mode zéro-injection. |
| **FENECON Home / OpenEMS Edge (FEMS)** | `fenecon_fems` | FENECON | `REST` | Port par défaut : 8084, `/rest/channel/_sum/*` & `/rest/channel/ess0/*` | Puissance de production solaire PV (W), Énergie PV cumulée (kWh), Puissance de charge/décharge batterie (W), SOC batterie (%), Puissance active réseau (W). | Consigne exacte de puissance active charge / décharge ESS (`ess0/SetActivePowerEquals` W) et Bridage de puissance active PV (`pvInverter0/SetActivePowerLimit` W). | Intégration locale complète en boucle fermée pour systèmes FENECON Home & OpenEMS : coordonne l'arbitrage batterie EPEX Day-Ahead, l'écrêtage capacitaire flamand et le bridage à prix négatifs. |
| **Hoymiles DTU-Pro / OpenDTU Micro-onduleur** | `hoymiles_dtu` | Hoymiles | `MODBUS` | Port par défaut : 502, ID d'unité : 1 | Puissance active PV agrégée et par entrée (W), Rendement solaire cumulé (kWh). | Limite de puissance active de sortie (`0xC006` % sur DTU-Pro Modbus ; RAM volatile `limit_type=1` % sur OpenDTU sans usure EEPROM). | Supervision sans cloud des micro-onduleurs et bridage dynamique de la production PV durant les heures de marché spot à prix négatifs. |
| **KOSTAL Plenticore Plus / G2 / G3 Hybrid** | `kostal_plenticore` | KOSTAL | `MODBUS` | Port par défaut : 1502, ID d'unité : 71, Détection automatique CDAB/ABCD IEEE-754 Float32 | Puissance DC PV totale (W), Rendement cumulé (kWh), Puissance de charge/décharge batterie (W), SOC batterie (%), Puissance du capteur réseau (W), Tensions & courants triphasés. | Consigne signée de gestion externe de batterie (Holding `1034` Float32 W) et SunSpec Model 123 Bridage de puissance active (écrêtement) (`WMaxLimPct`). | Pilotage complet en boucle fermée des installations hybrides KOSTAL Plenticore : exécute l'écrêtage des pointes par batterie, l'arbitrage spot Day-Ahead et le bridage solaire à prix négatifs. |
| **KACO blueplanet hybrid NH3 / gridsave TL3** | `kaco_inverter` | KACO | `MODBUS` | Port par défaut : 502, ID d'unité : 1, SunSpec Models 103/123/124 & NH3 Storage Block `40200`–`40203` | Puissance solaire PV active (W), Énergie cumulée (kWh), Puissance de charge/décharge batterie (W), SOC batterie (%), Limites de puissance charge/décharge BMS en direct (`40202`–`40203` W), Courants & tensions triphasés. | SunSpec Model 123 Bridage de puissance active (écrêtement) (`WMaxLimPct`, `WMaxLim_Ena`) et Pilotage de stockage Modèle 124 (`WChaMax`, `WChaGra`, `WDisChaGra`, `StorCtl_Mod`, `WChaMaxRvrtTms=300s` Watchdog) plus repli EMS NH3 (`40210`–`40212`). | Pilotage complet en boucle fermée pour installations KACO blueplanet hybrid NH3 et tertiaires gridsave TL3 : assure l'écrêtage par batterie, l'arbitrage spot EPEX Day-Ahead et le bridage solaire à prix négatifs. |

### Tableau Récapitulatif : Systèmes Dédiés de Stockage d'Énergie par Batterie (BESS) (18 Appareils)

| Nom de l'Appareil | Identifiant | Marque | Protocole | Port / Bus par Défaut | Données Lues | Consignes Pilotées | Rôle d'Automatisation GEMS |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Siemens Junelight Batterie Intelligente** | `siemens_junelight` | Siemens | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge/décharge batterie (W), État de charge de la batterie (SOC %), Flux net de puissance réseau (W), État interne de la batterie. | Mode de fonctionnement EMS Siemens Junelight Batterie Intelligente et consignes de charge/décharge forcée (W). | Intégration vérifiée avec le stockage résidentiel Siemens Junelight pour l'autoconsommation solaire, l'écrêtage des pointes et la charge en heures creuses. |
| **Solarwatt (EnergyManager / MyReserve Matrix)** | `solarwatt_storage` | Solarwatt | `REST` | Port par défaut : 80, JSON endpoint: /rest/kiwigrid/private/items | Flux de puissance batterie (W), SOC batterie (%), Production solaire (W), Échange réseau (W), Énergie cumulée (kWh). | Pilotage local charge/décharge `/rest/items` et acquisition télémétrique Solarwatt EnergyManager / Reserve. | Intégration LAN locale vérifiée sans cloud pour systèmes de stockage Solarwatt EnergyManager Pro et MyReserve / Battery flex. |
| **sonnenBatterie (eco 6 / 8 / 10 / hybrid)** | `sonnen_batterie` | Sonnen | `REST` | Port par défaut : 80, JSON endpoint: /api/v2/status | Puissance de charge/décharge batterie (W), SOC batterie (%), Production solaire PV (W), Injection / consommation réseau (W). | API locale v2 sonnenBatterie `PUT /api/v2/configurations` (`EM_OperatingMode=1` Manuel / `2` Autoconsommation) et `POST /api/v2/setpoint/charge\|discharge/{W}`. | Contrôle complet en boucle fermée pour sonnenBatterie eco 8 / 10 / performance : bascule proprement en mode API manuel lors de l'arbitrage forcé ou de l'écrêtage, puis rétablit l'autoconsommation autonome. |
| **Duracell Energy Stockage Résidentiel** | `duracell_energy` | Duracell Energy | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge / décharge batterie (W), État de charge de la batterie (SOC %), Flux de puissance réseau (W), Puissance AC onduleur (W). | Lecture seule (Télémétrie uniquement). | Supervise l'état de charge (SOC) et les échanges de puissance des batteries résidentielles Duracell pour l'équilibrage du site et le routage du surplus solaire vers le VE. |
| **Dyness Système de Stockage par Batterie** | `dyness_battery` | Dyness | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge / décharge batterie (W), État de charge de la batterie (SOC %), Tension totale du pack (V), Courant (A), Températures des cellules (°C). | Mode EMS Modbus Dyness Tower / Powerbox / Junior Box et limites de puissance de charge/décharge (W). | Intégration vérifiée BMS & PCS pour batteries Dyness HT/BT avec pilotage de charge et décharge en boucle fermée. |
| **Elecnova Système BESS Tertiaire & Industriel** | `elecnova_bess` | Elecnova | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active batterie (W), État de charge de la batterie (SOC %), Puissance d'échange réseau (W), Énergie entrante / sortante cumulée (kWh). | Lecture seule (Télémétrie uniquement). | Supervise les flux de puissance, l'état de charge (SOC) et l'énergie cumulée des systèmes BESS tertiaires et industriels sur le tableau de bord en direct. |
| **Goneo Système de Stockage Résidentiel** | `goneo_storage` | Goneo | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge / décharge batterie (W), SOC batterie (%), Flux de puissance réseau (W), Énergie totale (kWh). | Lecture seule (Télémétrie uniquement). | Suit l'état de charge (SOC) et les flux de puissance du stockage résidentiel pour coordonner l'équilibrage des bornes VE et des relais. |
| **Mastervolt MLI Ultra / Combi CZone** | `mastervolt_storage` | Mastervolt | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance batterie (W), SOC batterie (%), Puissance de sortie AC onduleur (W), tension du bus DC (V), courant batterie (A). | Lecture seule (Télémétrie uniquement). | Assure le suivi télémétrique des systèmes batteries Mastervolt / CZone résidentiels, marins et sites isolés. |
| **Power Sonic Stockage d'Énergie C&I** | `powersonic_bess` | Power Sonic | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active batterie (W), État de charge de la batterie (SOC %), Flux de puissance réseau (W), Registres d'état de défaut. | Lecture seule (Télémétrie uniquement). | Supervise les flux de puissance et l'état de charge (SOC) des systèmes BESS commerciaux sur le tableau de bord GEMS en direct. |
| **Poweroad Stockage Résidentiel & C&I** | `poweroad_storage` | Poweroad | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance batterie (W), État de charge de la batterie (SOC %), Flux réseau (W), Énergie entrante / sortante cumulée (kWh). | Lecture seule (Télémétrie uniquement). | Assure la supervision télémétrique des systèmes de stockage batterie résidentiels et tertiaires Poweroad. |
| **Pylontech Stockage Batterie (US / Force)** | `pylontech_storage` | Pylontech | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge / décharge batterie (W), État de charge (SOC %), Tension du pack (V), Courant du pack (A), SOH (%). | Consignes BMS/EMS de puissance de charge et décharge Pylontech US2000/US3000/US5000 & Force-H1/H2 via Modbus TCP/RTU. | Télémétrie et pilotage de puissance vérifiés en boucle fermée pour baies de stockage stationnaires basse et haute tension Pylontech. |
| **Socomec SUNSYS C-System / HES BESS** | `socomec_bess` | Socomec | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active batterie (W), SOC batterie (%), Limites max. de charge/décharge BMS en direct (`0xC008`–`0xC009` W), Flux de puissance active réseau (W), Énergie cumulée (kWh). | Pilotage distant de puissance active PCS Socomec SUNSYS (`0xC100` Mode, `0xC101`–`0xC102` consigne S32 0,1 kW, chien de garde matériel `0xC103=300s`) avec repli SunSpec Modèle 124. | Pilotage batterie C&I vérifié en boucle fermée pour Socomec SUNSYS HES L/XL et PCS+ : exécute l'écrêtage industriel des pointes, la protection capacitaire et l'arbitrage spot EPEX. |
| **Sunwoda AtSmart Stockage d'Énergie** | `sunwoda_energy` | Sunwoda Energy | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge / décharge batterie (W), État de charge de la batterie (SOC %), Flux de puissance réseau (W), Température (°C). | Lecture seule (Télémétrie uniquement). | Supervise l'état de charge et les échanges de puissance des batteries Sunwoda sur le tableau de bord GEMS en direct. |
| **Sessy Batterie Intelligente (Stockage Domestique AC)** | `sessy_battery` | Sessy | `REST` | `/api/v1/power/status`, `/api/v1/power/active_strategy`, `/api/v1/power/setpoint` | Puissance de charge/décharge batterie (W), État de charge (SOC %), Énergie injectée (kWh), Tensions (V) & courants (A) efficaces par phase. | Sélection dynamique de stratégie (`POWER_STRATEGY_API` vs `POWER_STRATEGY_NOM`) et consigne signée en Watts (`-W` Charge / `+W` Décharge). | Pilotage local sans cloud des batteries domestiques retrofit Sessy pour l'autoconsommation solaire, l'écrêtage capacitaire flamand et l'arbitrage spot EPEX. |
| **Tesla Powerwall 2 / 3 & Backup Gateway (HTTPS local)** | `tesla_powerwall` | Tesla Energy | `REST` | `POST /api/login/Basic`, `GET /api/meters/aggregates`, `GET /api/system_status/soe` | Puissance batterie (W), État d'énergie utile (SOC %), Puissance réseau du site (W), Puissance solaire (W), Énergie cumulée (kWh), Courants & tensions triphasés du site. | Lecture seule (Le micrologiciel local Gateway v23+ impose une télémétrie en lecture seule). | Acquisition HTTPS locale haute vitesse des flux réseau, solaires et batterie Powerwall pour piloter la charge VE au surplus et la protection contre les pointes capacitaires. |
| **VARTA pulse / neo / element Stockage Domestique** | `varta_storage` | VARTA | `MODBUS` | Port par défaut : 502, ID d'unité : 255, Registres Holding `1066`–`1102` & `2065`–`2066` | Puissance de charge/décharge batterie (W), SOC batterie (%), Énergie chargée cumulée (kWh), Puissance du capteur réseau (W), Puissance du capteur PV raccordé (W). | Pilotage de puissance active EMS VARTA (`2065` Commande : Charge/Décharge/Auto, `2066` Puissance W ; registre de repli `1074`). | Contrôle Modbus TCP local en boucle fermée pour systèmes de stockage couplés AC VARTA : automatise la charge spot en heures creuses et l'écrêtage des pointes domestiques. |
| **Zendure SolarFlow AC / Hyper 2000** | `zendure_solarflow` | Zendure | `REST` | `GET /properties/report`, `POST /properties/write` | Puissance d'entrée solaire (W), Puissance de charge et décharge du pack batterie (W), État de charge (`electricLevel` %). | Mode Smart AC (`acMode` Charge/Décharge) et consignes progressives `inputLimit` / `outputLimit` en Watts (`0–2400 W`). | Pilotage local 100 % sans cloud pour systèmes Zendure plug-in et couplés AC : absorbe le surplus photovoltaïque et décharge pour couvrir les pointes résidentielles du soir. |
| **Sinexcel PWS PCS Bidirectionnel / BESS Tertiaire** | `sinexcel_bess` | Sinexcel | `MODBUS` | Port par défaut : 502, ID d'unité : 1, Holding `100`–`113` & `600`–`610` | Puissance active batterie (`106` 0.1 kW), SOC batterie (`109` 0.1%), Énergie déchargée cumulée (`110`–`111` 0.1 kWh), Limites max. de puissance charge/décharge BMS en direct (`112`–`113` 0.1 kW), Tensions & courants triphasés. | Marche/Veille PCS à distance (`600`), mode PQ à puissance constante (`601`), consigne signée de puissance active (`602` S16 0,1 kW) et chien de garde fail-safe de 60 s (`610`). | Contrôle batterie industriel et C&I en boucle fermée pour convertisseurs de stockage Sinexcel PWS : automatise l'écrêtage haute puissance, la protection du transformateur réseau et l'arbitrage spot Day-Ahead. |

### Tableau Récapitulatif : Bornes de Recharge pour Véhicules Électriques (VE) & Wallbox (61 Appareils)

| Nom de l'Appareil | Identifiant | Marque | Protocole | Port / Bus par Défaut | Données Lues | Consignes Pilotées | Rôle d'Automatisation GEMS |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ABB Charger** | `abb_charger` | ABB | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active de charge (W, reg 0x401C), Énergie de session cumulée (kWh, reg 0x401E). | Modulation dynamique du courant de charge (A, reg 0x4100, 6 A à 32 A par pas de 1 mA). | Modulation de courant sous la seconde via Modbus TCP : ajuste dynamiquement la charge selon le surplus solaire (mode Éco) et réduit instantanément lors des pointes capacitaires (mode Flandre), en parfaite coexistence avec les plateformes externes de facturation et remboursement. |
| **ABL eM4 Single/Twin (SBCx)** | `abl_em4_charger` | ABL | `MODBUS` | Port par défaut : 502, ID d'unité : 255 ou 1 | Puissance active de charge (W, reg 0x300D), Énergie totale (kWh, reg 0x300F). | Modulation dynamique du courant de charge (A, reg 0x3001, 6 A à 32 A). | Contrôle Modbus direct : module le courant sur borne simple ou double prise pour suivre le surplus solaire et respecter les limites capacitaires flamandes sans interrompre la facturation professionnelle. |
| **ABL eMH1 / eMH2 / eMH3** | `abl_emh_charger` | ABL | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge en temps réel (W), Énergie de session (kWh). | Modulation du courant de charge (A, 6 A à 32 A). | Intègre les bornes ABL eMH existantes et récentes pour offrir une charge asservie au surplus solaire et un écrêtage automatisé des pointes. |
| **AUTEL AC MaxiCharger** | `autel_charger` | AUTEL | `OCPP` | Port : 8887, ws://<EMS-IP>:8887/<ChargePointID> | Puissance de charge en temps réel (W), Énergie de session (kWh), État de connexion du véhicule, Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Modulation dynamique du courant via SetChargingProfile (6 A à 32 A), Commutation de phases (1P / 3P). | Charge résidentielle autonome via OCPP natif : adapte la vitesse de charge à l'excédent solaire et suspend la session durant les périodes de pointe tarifaire. |
| **Alfen Charger** | `alfen_charger` | Alfen | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active de charge (W), Énergie totale (kWh), Courants de charge par phase (A). | Courant max. esclave Modbus (`1210` Float32 IEEE-754 en A avec chien de garde) et commutation de phases par contacteur (`1215`: `1` = Monophasé, `3` = Triphasé). | Intégration Modbus TCP privilégiée au Benelux pour Alfen Eve Single & Double Pro-line : suivi du surplus solaire sous la seconde, protection du disjoncteur principal et commutation automatique 1P/3P. |
| **Alpitronic Hypercharger** | `alpitronic_charger` | Alpitronic | `MODBUS` | Port par défaut : 502 ou 8887, ID d'unité : 1 | Puissance active de charge DC (kW/W), Énergie délivrée cumulée (kWh), État du connecteur. | Limite dynamique de puissance de charge (kW / A consignes). | Limite dynamiquement la puissance de charge rapide DC afin de rester strictement sous la capacité de raccordement du site et les plafonds capacitaires flamands. |
| **BMW i Wallbox (Connect/Pro)** | `bmw_charger` | BMW | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge (W), Énergie de session (kWh). | Consigne dynamique de courant (A, 6 A à 32 A). | Régulation locale du courant sur réseau LAN ; coordonne la charge avec la production solaire domestique et les heures creuses EPEX. |
| **Bender Charger** | `bender_charger` | Bender | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active de charge (W), Énergie de session (kWh), État du signal pilote. | Limite HEMSw Bender CC612 / CC613 (`1001` 0,1 A sur FW >= 4.70, repli `1000` 1 A) et commutation dynamique monophasé / triphasé (`1002`). | Pilotage Modbus TCP local direct des contrôleurs de charge Bender CC612/CC613 (OEM EBEE, Compleo, Mennekes) avec modulation au dixième d'ampère et commutation solaire 1P/3P. |
| **Blitzpower / Phoenix CharX** | `blitzpower_charger` | Blitzpower | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge (W), Énergie cumulée (kWh). | Modulation du courant de charge (A, 6 A à 32 A). | Régulation rapide par registres Modbus : module les consignes de courant pour la charge au surplus solaire et l'écrêtage des pointes. |
| **Delta AC MAX / SLIM / Chargeur Ultra-Rapide** | `delta_charger` | Delta | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active de charge (W), Énergie totale (kWh). | Consigne de courant de charge (A, 6 A à 32 A). | Module la consigne de courant de la wallbox Delta via Modbus TCP ; optimise la vitesse de charge pour absorber la production solaire sans prélever d'électricité coûteuse sur le réseau. |
| **EN+ Borne de Recharge VE AC** | `enplus_charger` | EN+ | `OCPP` | Port : 8887 | Puissance de charge (W), Énergie (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées. | Modulation du courant de charge (A, 6 A à 32 A), Commutation de phases (1P / 3P). | Suivi solaire autonome et écrêtage des pointes via des commandes locales OCPP SetChargingProfile. |
| **ETEK EKEPC2-C/S Contrôleur de Charge** | `etek_charger` | ETEK | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge (W), Énergie de session (kWh). | Modulation dynamique du courant (A, 6 A à 32 A). | Écriture directe de registres Modbus ajustant l'intensité de charge en temps réel selon le bilan énergétique du bâtiment. |
| **EVBox Elvi / Livo / BusinessLine** | `evbox_charger` | EVBox | `OCPP` | Port : 8887, ws://<EMS-IP>:8887/<ChargePointID> | Puissance de charge en temps réel (W), Énergie totale délivrée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), État du connecteur. | Modulation dynamique du courant via SetChargingProfile (6 A à 32 A), Commutation de phases (1P / 3P). | Prise en charge OCPP native complète pour EVBox : module dynamiquement le courant par pas de 1 A pour absorber le solaire en toiture et éviter les pénalités capacitaires. |
| **Easee Charger** | `easee_charger` | Easee | `CLOUD` | Authentification par identifiants cloud | Puissance active de charge (W), Énergie totale de session (kWh), État de la borne. | Courant dynamique circuit/borne via API Easee (6–32 A), `pause_charging` / `resume_charging` de session et commutation automatique `phaseMode` monophasé / triphasé. | Pilotage intelligent vérifié pour Easee Home, Charge et Charge Lite/Up : module l'intensité, met en pause/reprend proprement la session et bascule automatiquement entre 1 phase et 3 phases. |
| **Enovates SingleWallBox** | `enovates_charger` | Enovates | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge (W), Énergie totale (kWh). | Consigne dynamique de courant (A, 6 A à 32 A). | Contrôle Modbus local direct ; fonctionne en harmonie avec les plateformes de facturation CPO externes pendant que GEMS assure l'équilibrage local et l'écrêtage. |
| **Ensto Chago Wallbox / Pro** | `ensto_charger` | Ensto | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active de charge (W), Énergie totale (kWh). | Modulation du courant de charge (A, 6 A à 32 A). | Borne résidentielle et tertiaire scandinave haute fiabilité ; ajuste le courant de charge pour respecter le raccordement électrique et capter le surplus solaire. |
| **Etrel INCH / sonnenCharger** | `etrel_charger` | Etrel | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active (W), Énergie de session (kWh). | Consigne dynamique de courant (A, 6 A à 32 A). | Régulation locale Modbus TCP ; optimise la charge en coordination avec l'état des batteries domestiques et la production solaire. |
| **Fronius Wattpilot (Home / Go)** | `fronius_wattpilot` | Fronius | `OCPP` | Port : 8887 | Puissance active (W), Énergie (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Modulation dynamique du courant (A, 6 A à 32 A), Commutation de phases (1P / 3P). | Pilote le Wattpilot en mode 100 % sans cloud directement connecté à GEMS ; prend en charge la commutation dynamique monophasé/triphasé et le suivi du surplus solaire. |
| **GoodWe HCA Series EV Wallbox (Gen 2)** | `goodwe_charger` | GoodWe | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge (W), Énergie de session (kWh). | Consigne de courant de charge (A, 6 A à 32 A). | Coordonne les wallbox GoodWe avec les onduleurs hybrides GoodWe ; priorise la charge de la batterie domestique avant de diriger l'excédent vers le véhicule. |
| **Hager witty (one / plus / pro / park 2)** | `hager_charger` | Hager | `OCPP` | Port : 8887 | Puissance active (W), Énergie de session (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées. | Modulation dynamique du courant (A, 6 A à 32 A), Commutation de phases (1P / 3P). | Gestion résidentielle sans cloud des bornes Hager witty avec suivi de l'excédent solaire et écrêtage du tarif capacitaire flamand. |
| **Huawei FusionCharge (SCharger-7KS / 22KT)** | `huawei_scharger` | Huawei | `OCPP` | Port : 8887, ws://<EMS-IP>:8887/<ChargePointID> | Puissance active de charge (W), Énergie de session (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), État du câble. | Modulation dynamique du courant via SetChargingProfile (6 A à 32 A), Commutation de phases (1P / 3P). | Pilotage local direct de la borne Huawei FusionCharge sans cloud FusionSolar requis : se coordonne parfaitement avec les onduleurs Huawei SUN2000 et batteries LUNA2000 pour charger à 100 % à l'énergie solaire. |
| **KEBA KeContact P30/P40** | `keba_charger` | KEBA | `MODBUS` | Port par défaut : 502, ID d'unité : 255 | Puissance active de charge (W, reg 1020), Énergie totale (kWh, reg 1036). | Courant de charge en milliampères (`5004`), autorisation (`5014`) et commutation de phases KeContact S10 (`5050=3`, `5052=0/1`) sur KEBA KeContact P30 séries x/c & P40. | Contrôle Modbus TCP haute précision au milliampère (1 mA) et commutation de phases 1P/3P pour bornes KEBA KeContact P30 et P40. |
| **Mennekes AMTRON (4You / 4Business / ACU / AMEDIO)** | `mennekes_ocpp` | Mennekes | `OCPP` | Port : 8887 | Puissance active (W), Énergie totale (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées. | Modulation dynamique du courant via SetChargingProfile (6 A à 32 A), Commutation de phases (1P / 3P). | Pilotage OCPP universel des gammes modernes Mennekes ; permet la charge 100 % solaire et la prévention des pointes capacitaires flamandes. |
| **Mennekes AMTRON (Xtra / Premium / HCC3 Modbus)** | `mennekes_modbus` | Mennekes | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active de charge (W), Énergie cumulée (kWh). | Modulation dynamique du courant de charge (A, 6 A à 32 A). | Contrôle Modbus local direct pour bornes Mennekes premium ; élimine toute latence cloud pour un écrêtage instantané des pointes. |
| **Mercedes-Benz Wallbox** | `mercedes_wallbox` | Mercedes-Benz | `OCPP` | Port : 8887 | Puissance active (W), Énergie (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées. | Modulation du courant de charge (A, 6 A à 32 A), Commutation de phases (1P / 3P). | Recharge domestique autonome pour Mercedes-Benz Wallbox ; s'intègre directement dans l'équilibrage dynamique de charge GEMS. |
| **NRGkick (Gen 2)** | `nrgkick_gen2` | NRGkick | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge en temps réel (W), Énergie délivrée (kWh). | Modulation du courant de charge (A, 6 A à 32 A), Commutation de phases (1P / 3P). | Régulation Modbus TCP locale pour chargeurs mobiles/muraux NRGkick ; ajuste automatiquement la consigne de courant selon le surplus solaire. |
| **OCPP Charger** | `ocpp_charger` | Générique | `OCPP` | `ws://<EMS-IP>:8887/<ChargePointID>` ou `ws://<EMS-IP>:8080/api/ocpp/<ChargePointID>` | Puissance active (W), Énergie délivrée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), État du connecteur et de la transaction. | Profil standardisé OCPP 1.6-J SetChargingProfile (consignes de courant : pause 0 A et 6 A à 32 A). | Système central agnostique : prend en charge des centaines de bornes résidentielles et tertiaires conformes OCPP 1.6-J et applique des profils de charge dynamiques selon la stratégie GEMS. |
| **Peblar Borne de Recharge VE (Home / Business / Plus)** | `peblar_charger` | Peblar | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge en temps réel (W), Énergie de session cumulée (kWh). | Consigne dynamique de courant (A, 6 A à 32 A par pas de 0,1 A), Commutation de phases (1P / 3P). | Wallbox d'ingénierie néerlandaise : permet à GEMS d'ajuster le courant sous la seconde en Modbus TCP tout en maintenant la refacturation professionnelle split-billing en parallèle. |
| **Phoenix Contact Charx Charger** | `phoenix_charger` | Phoenix Contact | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge (W), Énergie totale de session (kWh). | Limite de courant de charge Modbus et registre/bobine d'autorisation sur Phoenix Contact CHARX SEC-3000 / EV-CC. | Équilibrage de charge industriel local en Modbus TCP et recharge au surplus solaire pour contrôleurs Phoenix Contact CHARX. |
| **Phoenix Contact EV-CC / CHARX (Modbus TCP)** | `phoenix_contact_evcc` | Phoenix Contact | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active de charge (W), Énergie totale (kWh). | Modulation dynamique du courant (A, 6 A à 32 A), Commutation de phases (1P / 3P). | Écritures directes de registres Modbus pour moduler l'intensité de charge aux fins d'écrêtage et de suivi solaire. |
| **Borne CPO Externe (OCPP 1.6-J)** | `generic_cpo_ocpp` | OCPP Générique | `OCPP` | `ws://<EMS-IP>:8080/api/ocpp/<ChargePointID>` | Puissance active (W), Énergie délivrée (kWh), Courants et tensions triphasés. | Modulation dynamique du courant (A, 6 A à 32 A). | Recharge intelligente locale et arbitrage de charge via proxy OCPP transparent avec les plateformes de facturation CPO externes selon le surplus solaire et les limites du disjoncteur. |
| **Porsche Wallbox / Mobile Charger Connect** | `porsche_wallbox` | Porsche | `OCPP` | Port : 8887 | Puissance active de charge (W), Énergie délivrée (kWh), Courants et tensions triphasés. | Modulation dynamique du courant (A, 6 A à 32 A), Commutation de phases (1P / 3P). | Connecte directement les bornes Porsche à GEMS sans abonnement et applique strictement les plafonds capacitaires flamands. |
| **RAEDIAN Gemini AC Wallbox** | `raedian_gemini` | RAEDIAN | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active combinée (W), Puissance de charge individuelle Prise 1 & Prise 2 (W), Énergie par prise (kWh), Courants triphasés individuels pour Prise 1 (L1, L2, L3) et Prise 2 (L1, L2, L3 en A), état du connecteur par prise. | Modulation dynamique continue du courant (plage totale de 0 A à 64 A répartie dynamiquement entre Prise 1 & Prise 2), Mode individuel par prise (Eco / Rapide / Arrêt). | Gestion dynamique avancée double prise : répartit simultanément la puissance entre deux véhicules, ajuste le courant combiné de 0 A à 64 A et protège les fusibles principaux tout en maximisant l'autoconsommation solaire. |
| **RAEDIAN NEO / NEX AC Wallbox** *(Référence Principale)* | `raedian_charger` | RAEDIAN | `MODBUS` | Port par défaut : 502, ID esclave : 1 ou 2 | Puissance active de charge en temps réel (W), Énergie de session (kWh), Courants de charge triphasés (L1, L2, L3 en A), Tensions de charge triphasées (L1, L2, L3 en V), État de la prise & codes d'erreur. | Modulation dynamique continue du courant (A, 6 A à 32 A par pas de 0,1 A), Pause & reprise automatiques de session. | Intégration phare Modbus TCP de référence : interroge les tensions et courants triphasés en une seule requête groupée ; la modulation sous la seconde réagit instantanément au surplus solaire et aux pointes capacitaires flamandes. |
| **SMA Borne de Recharge VE (7.4 / 22 / eCharger)** | `sma_evcharger` | SMA | `REST` | Port par défaut : 80 / 443 | Puissance active (W), Énergie cumulée (kWh), Courants triphasés (L1, L2, L3 en A). | Lecture seule (Télémétrie uniquement — la borne SMA Borne de Recharge VE requiert SEMP/SHM2 pour le pilotage actif). | Supervise en temps réel la puissance appelée et l'énergie de session du SMA EV Charger pour le bilan énergétique global du foyer. |
| **Schneider Electric EVlink (Wallbox / Pro AC)** | `schneider_evlink` | Schneider Electric | `OCPP` | Port : 8887 | Puissance active de charge (W), Énergie (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées. | Modulation dynamique du courant via SetChargingProfile (6 A à 32 A), Commutation de phases (1P / 3P). | Régulation native des consignes OCPP assurant une charge fluide au surplus solaire et la prévention des pointes capacitaires. |
| **Siemens VersiCharge GEN3 Wallbox** | `siemens_versicharge` | Siemens | `OCPP` | Port : 8887, ws://<EMS-IP>:8887/<ChargePointID> | Puissance en temps réel (W), Énergie cumulée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées. | Modulation dynamique du courant (A, 6 A à 32 A), Commutation de phases (1P / 3P). | Relie la borne Siemens VersiCharge GEN3 à GEMS via OCPP pour exécuter l'écrêtage flamand et le suivi du surplus solaire. |
| **Sigenergy SigenStor EVAC / EVDC Charger** | `sigenergy_evac` | Sigenergy | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge (W), Énergie de session (kWh), Courants et tensions triphasés. | Modulation dynamique du courant (A, 6 A à 32 A), Commutation de phases (1P / 3P). | Contrôle Modbus direct de la charge VE Sigen en parfaite coordination avec la batterie SigenStor pour absorber l'excédent photovoltaïque. |
| **SmartEVSE v2 / v3 (HTTP / Modbus)** | `smartevse_charger` | SmartEVSE | `MODBUS` | Port par défaut : 80, REST endpoint: /add | Puissance active (W), Énergie totale (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), État du signal pilote. | Modulation dynamique du courant (A, 6 A à 32 A via /add?current=X), Commutation de phases (1P / 3P). | Modulation locale des consignes via API REST permettant aux contrôleurs open-source de charger à 100 % au surplus solaire sans compte cloud. |
| **SolarEdge Borne de Recharge VE** | `solaredge_evse` | SolarEdge | `MODBUS` | Port par défaut : 502 / 1502, ID esclave : 1 | Puissance active de charge (W), Énergie cumulée (kWh). | Consigne dynamique de courant (A, 6 A à 32 A). | Synchronise la vitesse de charge avec la production de l'onduleur SolarEdge tout en protégeant le disjoncteur principal du logement. |
| **Veton / Phoenix CharX** | `veton_charger` | Veton | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active de charge (W), Énergie de session (kWh). | Modulation dynamique du courant de charge (A, 6 A à 32 A). | Écriture directe de registres Modbus TCP assurant une charge au surplus solaire fluide et un écrêtage précis sur les bornes architecturales Veton. |
| **Volkswagen / Elli / Skoda / SEAT (ID. Charger Connect / Pro)** | `elli_charger` | Volkswagen / Elli | `OCPP` | Port : 8887, ws://<EMS-IP>:8887/<ChargePointID> | Puissance active de charge (W), Énergie totale de session (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), État du câble. | Modulation dynamique du courant via SetChargingProfile (6 A à 32 A), Commutation de phases (1P / 3P). | Intégration directe au serveur OCPP natif : permet aux bornes ID. Charger du groupe VW de charger au pur surplus solaire et d'éviter les pointes capacitaires sans abonnement cloud constructeur. |
| **Wallbox Pulsar/Commander** | `wallbox_charger` | Wallbox | `CLOUD` | Authentification par identifiants Wallbox Cloud | Puissance active de charge (W), Énergie totale (kWh), État de la borne. | Limite dynamique d'intensité (6–32 A) via API Wallbox `PUT /v2/charger/{id}` et `POST /v3/chargers/{id}/remote-action` (`action: 1` Reprise / `2` Pause). | Modulation de courant vérifiée en boucle fermée et mise en pause/reprise automatique de session pour Wallbox Pulsar Plus, Pulsar Max, Copper SB et Commander 2. |
| **Webasto Next Charger** | `webasto_charger` | Webasto | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active de charge (W, reg 5000), Énergie fournie sur la session (kWh, reg 5002). | Modulation dynamique du courant de charge (A, reg 5004, 6 A à 32 A). | Contrôle Modbus direct : réduit le courant de la borne Webasto en quelques millisecondes pour protéger les fusibles et éviter les pointes capacitaires tout en conservant la facturation professionnelle. |
| **Zaptec Pro/Go** | `zaptec_charger` | Zaptec | `CLOUD` | Authentification OAuth2 Zaptec | Puissance active (W), Énergie cumulée (kWh), État de la session. | API OAuth2 Zaptec `/api/chargers/{id}/update` (`maxChargeCurrent` 0,1 A, `maxChargePhases` 1/3, Go 2 `threeToOnePhaseSwitchCurrent`) et `/sendCommand/506` (Pause) & `507` (Reprise). | Pilotage de précision vérifié pour bornes Zaptec Go, Go 2 et Pro avec décodage énergétique OCMF, pause/reprise et commutation solaire 1P/3P. |
| **go-e Charger Gemini / HOMEfix / PRO** | `goe_charger` | go-e | `REST` | Port par défaut : 80, JSON endpoints: /api/status, /api/set | Puissance de charge (W), Énergie de session (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), État d'autorisation. | Modulation du courant en RAM volatile (6 A à 32 A via `/api/set?amx=X` + pause/reprise `frc` — zéro usure flash NVS), commutation de phases (1P / 3P via `/api/set?psm=X`). | API HTTP locale haute vitesse : permet à GEMS de basculer dynamiquement entre monophasé (dès 1,4 kW solaire) et triphasé (jusqu'à 22 kW) et de délester en quelques millisecondes lors de pointes domestiques. |
| **Passerelle Locale EVSE REST Générique** | `generic_rest_evse` | REST Générique | `REST` | Port par défaut : 80, REST endpoint: /api/v1 | Puissance de charge en temps réel (W), Énergie de session cumulée (kWh), État de la borne de recharge. | Modulation dynamique du courant de charge (A, 6 A à 32 A). | Orchestration distribuée multi-bornes et gestion dynamique de charge équilibrant la puissance totale de la flotte par rapport aux limites du raccordement. |
| **Kempower Infrastructure de Charge Rapide** | `kempower_charger` | Kempower | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge en temps réel (W), Énergie de session (kWh), Courants de charge triphasés (L1, L2, L3 en A). | Modulation locale OCPP 1.6-J `SetChargingProfile` puissance/courant avec repli automatique sur le registre Modbus TCP `200` (`0,1 A`). | Gestion dynamique vérifiée de charge rapide tertiaire et de flotte pour bornes Kempower Satellite et Station. |
| **MyEnergi Zappi Borne de Recharge VE** | `myenergi_zappi` | MyEnergi | `REST` | Port par défaut : 80, Endpoint: /cgi-jstatus | Puissance de charge en temps réel (W), Énergie ajoutée durant la session (kWh), État de charge, mode (Fast, Eco, Eco+). | Commandes CGI HTTP Digest authentifiées (`/cgi-zappi-mode-Z{sno}-{mode}-...`) avec suivi de redirection ASN, basculant dynamiquement entre les modes Stop, Eco+, Eco et Fast. | Pilotage local/hub vérifié pour bornes myenergi Zappi v2/v2.1 avec télémétrie triphasée complète, lecture du mode de phase et modulation active de session. |
| **SolaX Borne de Recharge VE Intelligente** | `solax_evcharger` | SolaX | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge en temps réel (W), Énergie de session cumulée (kWh), Courants de phase (L1, L2, L3 en A). | Courant max. SolaX X1/X3-EVC (`0x0628` par pas de `0,01 A`), mode distant (`0x060D=1`), Arrêt/Marche (`0x0627`) et commutation monophasé / triphasé (`0xA105`). | Contrôle local Modbus TCP/RTU vérifié en boucle fermée pour bornes SolaX Smart EV Charger avec suivi solaire précis à 10 mA et commutation de contacteur 1P/3P. |
| **Teltonika TeltoCharge** | `teltonika_teltocharge` | Teltonika Energy | `OCPP` | Port : 8887, ws://<EMS-IP>:8887/<ChargePointID> | Puissance de charge en temps réel (W), Énergie de session cumulée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions (V). | Modulation dynamique du courant de charge (A, 6 A à 32 A via SetChargingProfile). | Intégration OCPP native pour installations résidentielles européennes ; optimise la recharge face aux pointes capacitaires flamandes et aux tarifs spot EPEX. |
| **Volt Time Source Borne de Recharge VE** | `volttime_source` | Volt Time | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance de charge en temps réel (W), Énergie de session cumulée (kWh), Courants de phase (L1, L2, L3 en A). | Limite d'intensité dynamique & pause/reprise via API v3 Volt Time / Plugchoice avec repli sur registre Modbus TCP local `1020`. | Équilibrage dynamique actif vérifié et modulation au surplus solaire pour bornes VE Volt Time Source et Plugchoice. |
| **Wallbox Pulsar Plus / Commander (OCPP)** | `wallbox_ocpp` | Wallbox | `OCPP` | Port : 8887, ws://<EMS-IP>:8887/<ChargePointID> | Puissance de charge en temps réel (W), Énergie de session cumulée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions (V). | Modulation dynamique du courant de charge (A, 6 A à 32 A via SetChargingProfile). | Intégration OCPP locale directe sans cloud pour matériel Wallbox ; supprime toute dépendance et latence cloud pour une automatisation résidentielle réactive. |
| **cFos Power Brain Wallbox / Solar** | `cfos_powerbrain` | cFos | `MODBUS` | Port par défaut : 4701, EVSE ID d'unité : 1, Registres Holding `8058`–`8094` | Puissance de charge en temps réel (W), Énergie prélevée cumulée (kWh), Courants de charge triphasés (0.1 A), État du relais de phases actif. | Limite de courant de charge à 0,1 A (`8093`), autorisation de charge (`8094`) et commutation de contacteur monophasé / triphasé (`8087`). | Suivi haute précision du surplus solaire au dixième d'ampère (0,1 A), protection du disjoncteur principal et commutation automatique de contacteur 1P/3P. |
| **FoxESS Borne de Recharge VE A7300 / A011K / A022K** | `foxess_evcharger` | FoxESS | `MODBUS` | Port par défaut : 502, ID d'unité : 1, Holding `0x1003`–`0x1017` & `0x3002` | Puissance de charge (W), Énergie cumulée (kWh), Courants triphasés (A), Tensions triphasées (V), État de la borne. | Limite de puissance par pas de 0,1 kW (`0x3002` : plage monophasée `1,4–4,1 kW`, plage triphasée `4,2–22,0 kW`, `0` Pause) & commutation auto de phases (`0x300A`). | Complément idéal des onduleurs hybrides FoxESS offrant une modulation fine du surplus solaire et une commutation automatique 1P/3P. |
| **Heidelberg Energy Control / Amperfied connect.solar** | `heidelberg_ampere` | Amperfied (Heidelberg) | `MODBUS` | Port : 502, ID d'unité : 255 | Puissance active de charge (W), Énergie totale (kWh), Courants triphasés (0.1 A), Tensions triphasées (V), État véhicule CEI, nombre de phases actives. | Limite de courant de charge à 0,1 A (Holding `261`), gestion veille/verrouillage (`258`–`259`) et commutation monophasé / triphasé (`501` sur `connect.solar`). | Modulation de courant à 0,1 A sous la seconde pour l'écrêtage capacitaire flamand et la recharge solaire fluide 1P/3P. |
| **openWB Pro / openWB series2 (HTTP & Modbus)** | `openwb_pro` | openWB | `MODBUS` | `/connect.php` | Puissance de charge en temps réel (W), Énergie prélevée (kWh), Courants triphasés (A), Tensions triphasées (V), État branchement & charge, phases actives. | Limite dynamique de courant à 0,1 A / 0,01 A (`ampere` / Holding `10171`) et commutation automatique de contacteur monophasé / triphasé (`phasetarget` / `10180`). | Suivi ultra-fin du surplus solaire (10–100 mA) et commutation matérielle de phases 1P/3P sans aucune dépendance au cloud. |
| **Sungrow AC011E-01 / AC22E-01 Borne de Recharge VE** | `sungrow_evcharger` | Sungrow | `MODBUS` | Port par défaut : 502, ID d'unité par défaut : 248, Input `21269`–`21316` & Holding `21202`–`21211` | Puissance active de charge (W), Énergie cumulée (kWh), Courants triphasés (0.1 A), Tensions triphasées (0.1 V), État de commutation de phases. | Limite de courant de sortie à 0,1 A (`21202`), commande Marche/Arrêt (`21211`) et commutation monophasé / triphasé (`21203`). | Partenaire Modbus local direct des installations Sungrow SH/SG avec régulation du surplus à 0,1 A et commutation 1P/3P. |
| **Tinkerforge WARP Charger 2 / 3 (Smart & Pro)** | `warp_charger` | Tinkerforge | `REST` | `/evse/state`, `/meter/values`, `/evse/external_current`, `/power_manager/external_control` | Puissance active de charge (W), Compteur d'énergie absolue (kWh), Courants triphasés (A), Tensions triphasées (V), État CEI 61851, état du contacteur 1P/3P. | Limite externe de courant à résolution 1 mA (`6000–32000 mA`, `0` Pause) et commutation de contacteur monophasé / triphasé WARP3 (`phases_wanted`). | Intégration industrielle à interface ouverte offrant un suivi solaire précis à 1 mA et un pilotage automatisé des contacteurs 1P/3P. |
| **Vestel EVC04 Home Smart / Mobility** | `vestel_evc04` | Vestel | `MODBUS` | Port par défaut : 502, ID d'unité par défaut : 255, Lifebit Watchdog `6000=1` | Puissance active totale (W), Énergie cumulée (kWh), Courants triphasés (mA), Tensions triphasées (V), État de la borne & du câble. | Limite dynamique de courant de charge (`5004`, `0` ou `6–32 A`), chien de garde fail-safe (`6000`) et commutation monophasé / triphasé (`405`). | Équilibrage de charge local fiable en Modbus TCP, protection du disjoncteur principal et commutation solaire 1P/3P pour bornes Vestel EVC04. |
| **Hardy Barth cPµ1 / cPµ2 (Salia / eCB1) Wallbox** | `hardy_barth_charger` | Hardy Barth | `REST` | Port par défaut : 80, `/api/v1/chargecontrols/1` & `/api/secc` | Puissance de charge en temps réel (W), Énergie de session cumulée (kWh), Courants de charge triphasés (`L1, L2, L3` en A) & Voltages (`L1, L2, L3` en V). | Limite dynamique locale REST de courant (`PUT /api/v1/chargecontrols/1/mode` avec `manualmodeamp=6..32 A` ou `mode=stop` ; repli Salia `PUT /api/secc` `grid_current_limit`). | Modulation locale du courant 100 % sans cloud pour bornes Hardy Barth Salia et eCB1 : adapte la vitesse de charge VE au surplus solaire et déleste lors des pointes disjoncteur ou capacitaires. |

### Tableau Récapitulatif : Compteurs Intelligents & Analyseurs de Réseau (40 Appareils)

| Nom de l'Appareil | Identifiant | Marque | Protocole | Port / Bus par Défaut | Données Lues | Consignes Pilotées | Rôle d'Automatisation GEMS |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ABB A43 / A44 / B23 / B24 Meter** | `abb_meter` | ABB | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active réseau prélevée/injectée (W), Énergie active totale prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), Fréquence (Hz). | Télémétrie réseau en lecture seule. | Mesure haute précision au point de raccordement ; fournit en continu les courants triphasés au moteur d'équilibrage par phase GEMS pour protéger les fusibles principaux et piloter le calcul quart-horaire flamand. |
| **Acrel ADW300 Meter** | `acrel_adw300` | Acrel | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active totale (W), Énergie prélevée/injectée (kWh), Puissance active par phase (W), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Télémétrie réseau en lecture seule. | Surveille le raccordement principal ou les tableaux divisionnaires ; informe GEMS des charges exactes par phase pour moduler les bornes VE et protéger les disjoncteurs. |
| **B+GE-TECH WS100 / DS100 Meter** | `bgetech_ws100` | B+GE-TECH | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance prélevée/injectée en temps réel (W), Énergie active totale (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Télémétrie réseau en lecture seule. | Mesure directe en tête d'installation ; fournit la puissance temps réel pour le suivi solaire VE en boucle fermée et l'écrêtage capacitaire flamand. |
| **Carlo Gavazzi EM112 / EM340 / EM540** | `carlogavazzi_em340` | Carlo Gavazzi | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active nette (W), kWh totaux prélevés/injectés, Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Télémétrie réseau en lecture seule. | Compteur de tête ultra-rapide sous la seconde (notamment l'EM540) ; essentiel au délestage réactif instantané des bornes VE lors des pointes domestiques pour protéger le disjoncteur principal. |
| **Carlo Gavazzi EM24 (RS485/Ethernet)** | `carlogavazzi_em24` | Carlo Gavazzi | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active totale (W, signée : + prélèvement, - injection), Registres d'énergie cumulée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Télémétrie réseau en lecture seule. | Compteur de référence dans les installations solaires et VE professionnelles ; fournit une télémétrie déterministe à la seconde pour l'écrêtage et le DLB GEMS. |
| **ESPHome DSMR / DLMS Compteur Intelligent** | `esphome_meter` | ESPHome | `REST` | Port par défaut : 80, Endpoint: /sensor/grid_power ou /text_sensor/dsmr | Puissance réseau en temps réel (W), Énergie totale prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), Consommation de gaz (m³). | Télémétrie REST en lecture seule. | Intègre les lecteurs P1 open-hardware dans GEMS et transmet les télégrammes numériques complets en Wi-Fi sans aucune dépendance cloud. |
| **Eastron SDM120 / SDM220 / SDM230 (Compteur Monophasé)** | `eastron_sdm120_230` | Eastron | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active (W), Énergie totale prélevée/injectée (kWh), Courant de phase (A), Tension de ligne (V), Facteur de puissance (cos φ). | Télémétrie en lecture seule. | Surveille les raccordements monophasés, les circuits dédiés de pompes à chaleur ou les onduleurs PV monophasés au sein de l'analyse de charge GEMS. |
| **Eastron SDM630 Compteur Triphasé** | `eastron_sdm630` | Eastron | `MODBUS` | Port par défaut : 502, ID esclave : 1, Débit : 9600 | Puissance active totale nette (W, reg 0x0034), Énergie totale prélevée/injectée (kWh), Courants individuels par phase (L1, L2, L3 en A, reg 0x0006), Tensions individuelles par phase (L1, L2, L3 en V, reg 0x0000). | Télémétrie réseau en lecture seule. | Compteur triphasé largement déployé ; fournit la télémétrie fondamentale pour la gestion du tarif capacitaire flamand, le suivi du déséquilibre de phases et le routage solaire. |
| **Eastron SDM72D / SMART X96 Compteur Triphasé** | `eastron_sdm72_x96` | Eastron | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active totale (W), Énergie active prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Télémétrie réseau en lecture seule. | Comptage compact sur rail DIN ; alimente la boucle de régulation GEMS en mesures temps réel pour moduler les bornes et générer les rapports énergétiques. |
| **Eltako DSZ15DZMOD / DSZ16 Meter** | `eltako_meter` | Eltako | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active (W), Énergie prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Télémétrie réseau en lecture seule. | Sous-comptage allemand de précision ; fournit en temps réel les courants de phase et les flux prélèvement/injection pour la protection anti-surcharge GEMS. |
| **Finder 7M.24 / 7M.38 Meter** | `finder_7m` | Finder | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active (W), Énergie active prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Télémétrie réseau en lecture seule. | Comptage fiable certifié MID ; transmet les grandeurs électriques en direct à GEMS pour la régulation dynamique du courant en boucle fermée. |
| **HomeWizard Meter** | `homewizard_meter` | HomeWizard | `REST` | Port par défaut : 80, JSON Endpoint: /api/v1/data | Puissance active réseau (W), Énergie totale prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), Consommation du compteur de gaz couplé (m³). | API REST locale en lecture seule. | Lecteur P1 Wi-Fi prêt à l'emploi : permet à GEMS d'interroger les télégrammes du compteur numérique toutes les 1 à 2 secondes sans câblage, avec suivi complet des pointes capacitaires. |
| **Homey Energy Dongle (P1)** | `homey_p1` | Homey | `NETWORK` | Port par défaut : 80 | Puissance active réseau (W), Énergie totale prélevée/injectée (kWh), Courants et tensions triphasés. | Télémétrie en lecture seule. | Capte les diffusions télémétriques locales des dongles P1 Homey et affiche en direct les flux réseau du foyer sur le tableau de bord GEMS. |
| **Inepro PRO380-MOD / PRO1-MOD Meter** | `inepro_pro380` | Inepro | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active totale (W), Registres kWh prélevés/injectés, Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Télémétrie réseau en lecture seule. | Compteur sur rail DIN haute précision ; fournit les courants triphasés pour l'équilibrage dynamique de charge et la protection disjoncteur GEMS. |
| **Lovato DMG610 Compteur Triphasé** | `lovato_dmg610` | Lovato | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active totale (W), Énergie prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Télémétrie réseau en lecture seule. | Analyseur réseau de classe industrielle ; fournit des mesures électriques rapides pour protéger les arrivées principales contre toute surcharge. |
| **Loxone Miniserver** | `loxone_miniserver` | Loxone | `REST` | Port par défaut : 80 / 443, Endpoints: /jdev/sfs/getstatus | Puissance domestique agrégée (W), puissances des sous-compteurs (W), Compteurs d'énergie totale (kWh). | Télémétrie REST en lecture seule. | Relie les installations domotiques Loxone Miniserver à GEMS, permettant d'utiliser les mesures compteur Loxone comme référence réseau principale. |
| **Niko Home Control (NHC II)** | `niko_nhc` | Niko | `REST` | Port par défaut : 8884 ou 80, JSON Endpoint: /hobby/v1/devices | Puissance réseau prélevée/injectée en temps réel (W), Puissance consommée par sous-circuit (W), Énergie cumulée (kWh). | API locale en lecture seule. | Intégration transparente avec les installations belges Niko Home Control II ; lit localement les pinces ampèremétriques pour piloter l'écrêtage GEMS. |
| **P1 Compteur Intelligent (Network/TCP)** | `p1_network` | Générique | `NETWORK` | Port par défaut : 23, 8088, ou 8234, Télégrammes DSMR bruts | Puissance active en temps réel (+ prélèvement / - injection en Watts, OBIS 1.7.0 & 2.7.0), énergie cumulée tarifs 1 & 2 (kWh, OBIS 1.8.1/2 & 2.8.1/2), Courants triphasés (L1, L2, L3 en A, OBIS 31.7.0, 51.7.0, 71.7.0), Tensions triphasées (L1, L2, L3 en V, OBIS 32.7.0, 52.7.0, 72.7.0), Registre flamand de pointe quart-horaire (15 min) (W, OBIS 1.6.0), Consommation de gaz (m³, OBIS 0-1:24.2.1). | Flux de télégrammes numériques en lecture seule. | Interface réseau principale pour compteurs P1 distants sur LAN : décode les télégrammes officiels Fluvius/ORES/RESA (Belgique) et DSMR 4.x/5.x (Pays-Bas) pour alimenter le moteur prédictif capacitaire et le plafond adaptatif. |
| **P1 Compteur Intelligent (USB/Serial)** | `p1_serial` | Générique | `SERIAL` | /dev/ttyUSB0 ou /dev/ttyAMA0, Débit : 115200 pour DSMR 4/5, 9600 pour DSMR 2/3 | Puissance active en temps réel (W, OBIS 1.7.0/2.7.0), énergie prélevée/injectée tarifs 1/2 (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), Pointe quart-horaire maximale belge (W, OBIS 1.6.0), Volume du compteur de gaz (m³). | Flux de télégrammes numériques en lecture seule. | Liaison matérielle directe sans latence avec les compteurs communicants belges et néerlandais ; fournit chaque seconde des télégrammes validés par CRC pour le délestage VE sous la seconde et l'écrêtage capacitaire. |
| **SMA Compteur d'Énergie 2.0 / Data Manager M (Modbus TCP)** | `sma_energymeter` | SMA | `MODBUS` | Port par défaut : 502, ID esclave : 2 ou 126 | Puissance active réseau prélevée/injectée (W), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Pilotage du bridage de puissance active (commande des onduleurs SMA via Data Manager). | Mesure la puissance au point de raccordement et agit comme passerelle ; informe GEMS du bilan net et transmet les consignes de bridage solaire aux onduleurs SMA. |
| **Schneider Electric Acti9 iEM3000 / PM3200 Series** | `schneider_iem3000` | Schneider Electric | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active totale (W), Énergie active prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Télémétrie réseau en lecture seule. | Comptage résidentiel et tertiaire de précision ; fournit une télémétrie déterministe des courants de phase pour protéger les tableaux électriques. |
| **Shelly 3EM (Gen 1 Compteur Triphasé)** | `shelly_3em` | Shelly | `REST` | Port par défaut : 80, JSON Endpoint: /status | Puissance active totale (W), Puissance par phase (W), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), Énergie cumulée injectée/consommée (kWh). | Sortie contacteur 10 A intégrée (Activation / Désactivation via /relay/0?turn=on). | Lit à haute fréquence les pinces ampèremétriques triphasées en Wi-Fi ; le contacteur intégré peut enclencher des charges thermiques ou délester des équipements non prioritaires lors des pointes. |
| **Shelly Pro 3EM / Gen3 3EM-63T (Compteur Triphasé)** | `shelly_pro_3em` | Shelly | `REST` | Port par défaut : 80, JSON Endpoint: /rpc/EM.GetStatus | Puissance active nette sur les trois phases (W), Puissance active par phase (W), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), Compteurs d'énergie 4 quadrants (kWh). | Sortie relais auxiliaire intégrée (Activation / Désactivation via /rpc/Switch.Set). | Compteur rail DIN Ethernet haute fiabilité : fournit une télémétrie de phase instantanée pour le délestage VE sous la seconde, tandis que sa sortie relais auxiliaire pilote le boost PAC ou l'eau chaude sanitaire. |
| **Siemens SENTRON (PAC2200 / 7KT1665 Meter)** | `siemens_pac2200` | Siemens | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active totale (W), Énergie prélevée/injectée cumulée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Télémétrie réseau en lecture seule. | Comptage industriel haut de gamme ; surveille la capacité de raccordement et alimente GEMS pour le délestage actif et le calcul des économies. |
| **Socomec COUNTIS E24/E34/E44 / DIRIS A-40** | `socomec_meter` | Socomec | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active totale (W), Énergie active prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Télémétrie réseau en lecture seule. | Comptage triphasé précis pour sites résidentiels et tertiaires ; renseigne GEMS sur la répartition par phase afin d'équilibrer la charge VE et protéger les fusibles. |
| **WAGO 879 Series (879-3000 / 879-3020 / 879-3040)** | `wago_879` | WAGO | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active (W), Énergie active totale (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V). | Télémétrie réseau en lecture seule. | Compteur rail DIN de précision ; transmet tensions et courants triphasés à GEMS pour la protection temps réel des fusibles, le calcul du surplus solaire et la visualisation PowerFlow. |
| **Accuenergy AcuRev / Acuvim Series Meter** | `accuenergy_meter` | Accuenergy | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active nette réseau en temps réel (W), Énergie totale (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V). | Autonome / Télémétrie réseau en lecture seule. | Surveillance triphasée haute précision du point de livraison et équilibrage de charge par phase pour sites tertiaires et résidentiels. |
| **Algodue UPM209 / UPM309 Series Meter** | `algodue_meter` | Algodue | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active nette réseau en temps réel (W), Énergie totale (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V). | Autonome / Télémétrie réseau en lecture seule. | Mesure continue des échanges réseau, suivi du facteur de puissance et protection contre la surcharge du disjoncteur principal. |
| **Chint DTSU666 / DTSU666-H Compteur Triphasé** | `chint_dtsu666` | Chint | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance active nette réseau en temps réel (W), Énergie totale prélevée & injectée (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V). | Autonome / Télémétrie réseau en lecture seule. | Intégration standard de compteur réseau bidirectionnel triphasé ; pilote le calcul du surplus photovoltaïque et la modulation des bornes VE. |
| **Hager ECM / ECR / ECP Compteur d'Énergie** | `hager_meter` | Hager | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance nette réseau en temps réel (W), Énergie totale prélevée (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V). | Autonome / Télémétrie réseau en lecture seule. | Surveillance sur rail DIN du tableau résidentiel fournissant une télémétrie de phase sous la seconde à la protection anti-surcharge GEMS. |
| **Janitza UMG Series Analyseur de Réseau** | `janitza_umg` | Janitza | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance nette réseau en temps réel (W), Énergie totale prélevée (kWh), Courants de phase (L1, L2, L3 en A), Tensions composées/simples (V), Fréquence (Hz). | Autonome / Télémétrie réseau en lecture seule. | Intégration d'analyseur de réseau industriel haute précision capturant à haute fréquence les flux électriques et les déséquilibres de phases. |
| **Kamstrup Compteur d'Énergie (Modbus Gateway)** | `kamstrup_meter` | Kamstrup | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance nette réseau en temps réel (W), Énergie totale prélevée (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V). | Autonome / Télémétrie réseau en lecture seule. | Intègre les compteurs électriques et thermiques de chauffage urbain dans la supervision énergétique globale GEMS. |
| **Landis+Gyr Compteur Industriel de Réseau** | `landisgyr_meter` | Landis+Gyr | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance nette réseau en temps réel (W), Énergie totale prélevée & injectée (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V). | Autonome / Télémétrie réseau en lecture seule. | Surveille les points de raccordement tertiaires et industriels de forte puissance afin de garantir le respect des plafonds d'écrêtage. |
| **Phoenix Contact EMpro Compteur d'Énergie** | `phoenix_empro` | Phoenix Contact | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance nette réseau en temps réel (W), Énergie totale prélevée (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V). | Autonome / Télémétrie réseau en lecture seule. | Transmet en temps réel les mesures triphasées en tête d'installation à GEMS pour un suivi instantané du surplus solaire. |
| **Weidmüller Compteur d'Énergie (500 / 600 / 700)** | `weidmuller_meter` | Weidmüller | `MODBUS` | Port par défaut : 502, ID esclave : 1 | Puissance nette réseau en temps réel (W), Énergie totale prélevée (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V). | Autonome / Télémétrie réseau en lecture seule. | Supervision énergétique de classe industrielle pour bâtiments tertiaires et tableaux divisionnaires multi-départs. |
| **YouLess LS120 Compteur à Impulsions & P1** | `youless_ls120` | YouLess | `REST` | Port par défaut : 80, Endpoint: /a?f=j | Puissance nette réseau en temps réel (W), Énergie totale prélevée (kWh). | Autonome / Télémétrie réseau en lecture seule. | Se connecte sur le réseau local aux ports P1 des compteurs numériques ou par lecteur optique aux compteurs électromécaniques sans abonnement cloud. |
| **Fronius Compteur Intelligent IP / Solar API v1** | `fronius_smartmeter_ip` | Fronius | `HTTP` | `GET /solar_api/v1/GetMeterRealtimeData.cgi?Scope=Device&DeviceId=0` | Puissance nette réseau signée (W), Énergie totale prélevée & injectée (kWh), Courants signés par phase (L1, L2, L3 en A), Tensions de phase (V). | Autonome / Lecture seule | Comptage réseau HTTP local sans câblage additionnel pour écosystèmes Fronius, fournissant les courants signés par phase pour la protection fusibles et l'écrêtage. |
| **Huawei EMMA-A02 / DTSU666-H Capteur de Puissance Intelligent** | `huawei_emma` | Huawei | `MODBUS` | Port : 502, Holding `31633`–`31666` sur EMMA-A02 & `2102`–`2175` Float32 sur DTSU666-H | Puissance signée au point de raccordement (W), Énergie totale prélevée & injectée (kWh), Courants triphasés signés (A), Tensions triphasées (V). | Autonome / Lecture seule | Télémétrie haute vitesse au point de raccordement pour sites Huawei SUN2000 & LUNA2000 équipés d'EMMA-A02 ou de capteurs RS485 dédiés. |
| **KOSTAL Compteur d'Énergie Intelligent (KSEM G1 / G2)** | `kostal_ksem` | KOSTAL | `MODBUS` | Port par défaut : 502, ID d'unité par défaut : 71, Registres Holding `0`–`143` & `512`–`519` | Puissance active prélevée & injectée (0.1 W), Énergie totale prélevée & injectée (0.1 Wh -> kWh), Courants directionnels par phase (A) & tensions (V). | Autonome / Lecture seule | Mesure réseau rail DIN Ethernet sous la seconde avec courants directionnels par phase pour l'équilibrage DLB et l'écrêtage capacitaire. |
| **Tasmota SML / OBIS Lecteur Optique Infrarouge & EcoTracker** | `tasmota_sml` | Tasmota | `REST` | `/cm?cmnd=Status%208` StatusSNS & EcoTracker `/v1/json` | Puissance nette réseau en temps réel (W), Compteurs d'énergie totale prélevée & injectée (kWh), Courants de phase (A) & Tensions (V). | Autonome / Lecture seule | Lecture optique infrarouge sans cloud pour compteurs numériques européens dépourvus de port RJ12 P1. |

### Tableau Récapitulatif : Relais Intelligents & Actionneurs Thermiques (12 Appareils)

| Nom de l'Appareil | Identifiant | Marque | Protocole | Port / Bus par Défaut | Données Lues | Consignes Pilotées | Rôle d'Automatisation GEMS |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Relais HTTP Générique** | `generic_relay` | Générique | `REST` | Port par défaut : 80 / 8080, URL configurables pour l'état et la commutation | Consommation active de l'appareil raccordé (W, optionnel si comptabilisé). | État de sortie du contacteur relais (Activation / Désactivation). | Pilotage automatisé de contacteur : enclenche les chauffe-eau électriques, pompes de piscine ou chauffages résistifs lorsque l'injection solaire dépasse un seuil configurable (ex. > 1500 W pendant 2 minutes), avec hystérésis stricte de durée minimale de marche et d'arrêt. |
| **Shelly Plus 1PM / Pro 1PM / Plug S (Relais & Mesure de Puissance)** | `shelly_plus_1pm` | Shelly | `REST` | Port par défaut : 80, Endpoints: /rpc/Switch.Set, /rpc/Switch.GetStatus | Puissance active de l'appareil raccordé (W), Consommation d'énergie cumulée (kWh), Température interne de l'appareil (°C), Tension d'alimentation (V). | État de sortie du contacteur relais (Activation / Désactivation via /rpc/Switch.Set). | Boost Pompe à Chaleur SG-Ready & Automatisation d'Appareils : enclenche l'état SG-Ready 3 (mode boost thermique) des pompes à chaleur ou ballons ECS lors de surplus solaires ou d'heures à prix négatifs, tout en journalisant la puissance réelle dans GEMS. |
| **Module Relais E/S Numériques Modbus** | `modbus_relay` | Relais / E/S Modbus | `MODBUS` | Port par défaut : 502, ID esclave : 1 | États des entrées / bobines numériques (Ouvert / Fermé). | Commande des bobines de relais (Bobines 1–8 Marche / Arrêt). | Commutation industrielle de contacteurs pour charges de forte intensité, batteries thermiques triphasées et délestage de machines lors des pointes. |
| **SG-Ready Pompe à Chaleur (Daikin/Nibe/Bosch/Vaillant/Panasonic)** | `sgready_heatpump` | SG-Ready (Daikin, Nibe, Bosch/Nefit, Vaillant, Panasonic, Mitsubishi, Stiebel Eltron, Wolf) | `REST` | Port par défaut : 80, REST Endpoint: /api/sgready | État de fonctionnement SG-Ready (État 1 : Délestage / État 2 : Normal / État 3 : Boost / État 4 : Marche forcée), puissance consommée (W). | Mode de fonctionnement SG-Ready (État 2 Normal vs État 3 Boost thermique). | Stockage thermique automatisé par pompe à chaleur : commande l'état 3 (consigne thermique relevée) durant les surplus solaires ou heures à prix négatifs pour préchauffer l'ECS et les ballons tampons, puis revient à l'état 2 lors des pointes réseau. |
| **Shelly Plus 1 / Pro 1 (Relais à Contact Sec)** | `shelly_plus_1` | Shelly | `REST` | Port par défaut : 80, Endpoint: /rpc/Switch.Set | État du relais (Marche / Arrêt), température interne (°C), état de l'entrée. | État de sortie du relais à contact sec (Activation / Désactivation). | Contact sec libre de potentiel permettant de piloter les entrées SG-Ready de pompes à chaleur, les bornes d'inhibition externes de wallbox VE ou les circulateurs. |
| **Shelly Plus 2PM / Pro 2PM (Double Relais & Compteur)** | `shelly_plus_2pm` | Shelly | `REST` | Port par défaut : 80, Endpoints: /rpc/Switch.Set, /rpc/Switch.GetStatus | Puissance active Canal 1 & Canal 2 (W), énergie cumulée par canal (kWh), Tension d'alimentation (V). | États des deux sorties relais (Canal 0 & Canal 1 Marche / Arrêt indépendants). | Automatisation indépendante à deux canaux : commande et mesure plusieurs étages de chauffe résistifs ou pilote les deux relais d'une interface PAC SG-Ready complète (États 1 à 4). |
| **Daikin Altherma 3 & HomeHub (Smart Grid Modbus)** | `daikin_altherma` | Daikin | `MODBUS` | Port par défaut : 502, ID d'unité : 1, Input `21`–`50` & Holding `2`, `53` | Puissance électrique instantanée de la pompe à chaleur (W), température du ballon ECS (°C), température de départ d'eau (°C), état Smart Grid. | Mode Smart Grid (`53` : fonctionnement normal vs Boost surplus PV recommandé) & consigne de température ECS (`2`). | Automatisation thermique native en Modbus TCP pour pompes à chaleur Daikin Altherma 3 : convertit le surplus PV et l'électricité à prix négatif en eau chaude sanitaire et chauffage. |
| **my-PV AC•THOR / AC•THOR 9s / AC ELWA 2 Routeur Solaire** | `mypv_acthor` | my-PV | `MODBUS` | Port par défaut : 502, ID d'unité : 1, Registres Holding `1000`–`1003` | Puissance réelle de chauffe du thermoplongeur (W), température du ballon d'eau chaude sanitaire (`0,1 °C`), état de fonctionnement. | Consigne linéaire progressive de puissance thermique (`1000` : `0–9000 W`), état relais Boost et consigne de température maximale du ballon (`1002`). | Stockage thermique proportionnel zéro-injection : dérive au watt près tout le surplus photovoltaïque vers les ballons d'eau chaude avant toute injection réseau ou bridage. |
| **NIBE S-Series Pompe à Chaleur (S1155 / S1255 / S2125 / VVM)** | `nibe_heatpump` | NIBE | `MODBUS` | Port par défaut : 502, ID d'unité : 1, Input `8`, `2166`, `2285` & Holding `697`, `707` | Puissance électrique instantanée du compresseur (`2166` W), Énergie électrique consommée cumulée (`2285` kWh), Température haute du ballon ECS (`8` °C). | Boost ECS SG-Ready / Smart Price Luxury (`697` / `47`) et consigne de température de confort (`707` `0,1 °C`). | Intégration directe Modbus TCP Wi-Fi/Ethernet pour pompes à chaleur NIBE Série S : renforce le stockage thermique durant les surplus solaires et les heures creuses EPEX. |
| **Stiebel Eltron / Tecalor ISG Web & Plus (WPM)** | `stiebel_eltron_isg` | Stiebel Eltron | `MODBUS` | Port par défaut : 502, ID d'unité : 1, Input `521`, `2500`, `3506` & Holding `1509`, `4000`–`4002` | Température du préparateur ECS (`521` °C), état compresseur & circulateur ECS (`2500`), Énergie électrique cumulée (kWh). | Activation gestion énergétique SG-Ready (`4000=1`), État 2 / État 3 Boost PV SG-Ready (`4001`–`4002`) et consigne ECS Confort (`1509`). | Pilotage normalisé Modbus TCP du boost SG-Ready et de la consigne de confort ECS pour pompes à chaleur Stiebel Eltron et Tecalor. |
| **Tasmota Prise Connectée / Relais de Puissance DIN** | `tasmota_relay` | Tasmota | `REST` | `/cm?cmnd=Power%20On\|Off` & `/cm?cmnd=Status%208` | Puissance active appelée (W), Énergie cumulée (kWh), Tension d'alimentation (V), Courant de charge (A). | État de sortie des canaux relais (`Power{1..8} On` / `Off` avec protection par hystérésis). | Commutation et mesure de puissance locales 100 % sans cloud pour chauffe-eau résistifs, pompes de piscine, chargeurs VAE et relais auxiliaires. |
| **Askoma ASKOHEAT+ Modbus TCP Thermoplongeur Solaire PV** | `askoheat_diverter` | Askoma | `MODBUS` | Port par défaut : 502, ID d'unité : 1, Registres Holding `100`, `200`–`202`, `300`–`304` | Puissance réelle du thermoplongeur (`300` W), température d'eau du ballon (`302` `0,1 °C`), masque binaire des étages actifs (`301`), Énergie thermique cumulée (`304` `0.1 kWh`). | Consigne progressive de surplus/charge (`200`–`201` W), commande à 7 étages (`100` étages 0–7), boost anti-légionellose et consigne de température maximale d'eau (`202` `0,1 °C`). | Dérivation électrothermique solaire proportionnelle à 7 étages et continue pour thermoplongeurs Askoma ASKOHEAT+ : convertit l'excédent solaire et l'électricité à prix négatif en eau chaude sanitaire. |

---

## Spécifications Détaillées par Appareil

Vous trouverez ci-dessous la spécification technique exhaustive des 168 profils matériels pris en charge nativement par GEMS.

## 1. Onduleurs Solaires & Hybrides (37 Appareils)

Les modèles d'onduleurs communiquent directement en Modbus TCP (clés Ethernet / Wi-Fi), selon les standards industriels SunSpec ou via des API HTTP REST locales. Ils supervisent en temps réel la production photovoltaïque (PV), l'état de charge batterie (SOC %), la puissance de charge/décharge et les flux réseau. Les pilotes avancés assurent le bridage actif de puissance lors des heures à prix spot négatifs ainsi que le forçage charge/décharge pour l'arbitrage tarifaire.

### 1.1 Afore Onduleur Hybride

- **Identifiant du Modèle**: `afore_inverter`
- **Fabricant / Marque**: Afore
- **Modèles Matériels Compatibles**: Afore AF-T (Triphasé) & AF-S (Monophasé) Series Onduleurs Hybrides (1kW – 30kW)
- **Interface de Communication**: Modbus TCP via dongle Ethernet / Wi-Fi (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Production solaire PV en temps réel (W), Puissance de charge/décharge batterie (W), Puissance réseau prélevée/injectée (W), Production solaire cumulée (kWh), État de charge de la batterie (SOC %), Courants de sortie triphasés de l'onduleur (L1, L2, L3 en A).

#### Consignes Pilotables & Données Écrites par GEMS
Mode énergétique EMS & consignes de charge/décharge forcée (Holding `3000`/`3002`), plus Limite de réduction de puissance active (`0–100%`).

#### Rôle Pratique & Automatisation GEMS
Pilotage hybride en boucle fermée pour onduleurs Afore AF-S et AF-T : charge et décharge dynamiquement la batterie pour l'écrêtage capacitaire flamand et l'arbitrage spot EPEX, tout en bridant l'injection PV lors des heures à prix négatifs.

---

### 1.2 Alpha ESS Storion SMILE

- **Identifiant du Modèle**: `alpha_ess_inverter`
- **Fabricant / Marque**: Alpha ESS
- **Modèles Matériels Compatibles**: Alpha ESS Storion SMILE5, SMILE-T10, SMILE-G3 Systèmes Onduleurs Hybrides & Stockage
- **Interface de Communication**: Modbus TCP via dongle réseau local (Port par défaut : 502 ou 8502, ID esclave : 85)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV active (W), Puissance de charge/décharge batterie (W), Prélèvement/injection réseau net (W), Énergie cumulée (kWh), SOC batterie (%), Courants triphasés (L1, L2, L3 en A).

#### Consignes Pilotables & Données Écrites par GEMS
Pilotage du mode Dispatch (`0x084F`), consigne d'offset de puissance active (`0x0850`–`0x0851` avec biais de 32 000 W), cible SOC et limite d'injection réseau.

#### Rôle Pratique & Automatisation GEMS
Pilotage complet en boucle fermée pour Alpha ESS Storion SMILE : envoie des consignes précises de charge/décharge en watts pour l'arbitrage EPEX Day-Ahead et la protection du plafond capacitaire flamand, avec écrêtement solaire actif.

---

### 1.3 Anker SOLIX X1 Onduleur Hybride

- **Identifiant du Modèle**: `anker_inverter`
- **Fabricant / Marque**: Anker
- **Modèles Matériels Compatibles**: Anker SOLIX X1 Système Hybride de Stockage Énergétique (Monophasé & Triphasé)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV (W), Flux batterie (W), Puissance d'échange réseau (W), Énergie totale cumulée (kWh), SOC batterie (%), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Mode de fonctionnement EMS Anker SOLIX X1 et consignes de charge/décharge forcée (W), ainsi que bridage actif d'injection.

#### Rôle Pratique & Automatisation GEMS
Régulation hybride résidentielle triphasée en boucle fermée pour Anker SOLIX X1 : exécute automatiquement l'écrêtage des pointes par batterie, la charge spot en heures creuses et le bridage solaire à prix négatifs.

---

### 1.4 Deye / Sunsynk Onduleur Hybride

- **Identifiant du Modèle**: `deye_inverter`
- **Fabricant / Marque**: Deye
- **Modèles Matériels Compatibles**: Deye SUN-(3-12)K-SG04LP3 / SUN-(5-16)K-SG01LP1, Sunsynk Onduleurs Hybrides
- **Interface de Communication**: Modbus TCP via Ethernet LAN ou Solarman/Deye Wi-Fi logger (Port par défaut : 502 ou 8899, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Production solaire PV (W), Puissance de charge/décharge batterie (W), Puissance du compteur réseau (W), Énergie totale cumulée (kWh), SOC batterie (%), Courants triphasés de l'onduleur (L1, L2, L3 en A).

#### Consignes Pilotables & Données Écrites par GEMS
Consignes Time-of-Use de charge et décharge réseau, plages SOC min./cible et limite dynamique max. de revente solaire (Holding `143` / `340`, mise à l'échelle auto BT & HT).

#### Rôle Pratique & Automatisation GEMS
Pilotage intégral en boucle fermée des onduleurs hybrides BT/HT Deye et Sunsynk : assure l'écrêtage capacitaire flamand sous la seconde, l'arbitrage batterie EPEX Day-Ahead et le bridage zéro-injection ou à prix négatifs.

---

### 1.5 Enerlution Onduleur Hybride

- **Identifiant du Modèle**: `enerlution_inverter`
- **Fabricant / Marque**: Enerlution
- **Modèles Matériels Compatibles**: Enerlution Onduleurs Hybrides de Stockage Énergétique (L3-L12 Series)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV (W), Puissance batterie (W), Puissance réseau (W), Énergie cumulée (kWh), SOC batterie (%), Courants triphasés (L1, L2, L3 en A).

#### Consignes Pilotables & Données Écrites par GEMS
Limite de bridage de puissance active (W ou % via Modbus registers 40400/40441).

#### Rôle Pratique & Automatisation GEMS
Intégration complète de bridage actif : réduit automatiquement la puissance de l'onduleur durant les heures spot EPEX Day-Ahead négatives (Mode Pays-Bas / Zéro-Injection) tout en respectant la valeur des certificats verts flamands (GSC), et route le surplus solaire vers la batterie et le VE.

---

### 1.6 Enphase IQ Gateway / Envoy

- **Identifiant du Modèle**: `enphase_envoy`
- **Fabricant / Marque**: Enphase
- **Modèles Matériels Compatibles**: Enphase IQ Gateway, Envoy-S Standard / Metered, IQ System Controller (IQ Battery 3T/10T)
- **Interface de Communication**: API HTTP REST locale avec authentification par jeton/digest (Port par défaut : 80 / 443, Endpoints: /api/v1/production, /ivp/livedata/status)

#### Données de Télémétrie Lues par GEMS
Production solaire PV agrégée des micro-onduleurs (W), Puissance de charge/décharge IQ Battery (W), Prélèvement/injection réseau net (W), Production totale cumulée (kWh), SOC batterie (%), Courants et tensions par phase.

#### Consignes Pilotables & Données Écrites par GEMS
Limitation dynamique d'injection HTTPS locale (jeton Bearer JWT) sur Enphase IQ Gateway et pilotage des modes de stockage IQ Battery.

#### Rôle Pratique & Automatisation GEMS
Intégration locale prioritaire avec Enphase IQ Gateway Metered et IQ Battery : collecte localement les flux de production, consommation et stockage et coordonne la limitation d'injection lors des prix négatifs sans dépendance au cloud.

---

### 1.7 FoxESS H1 / H3 / H3-Pro Onduleur Hybride

- **Identifiant du Modèle**: `foxess_inverter`
- **Fabricant / Marque**: FoxESS
- **Modèles Matériels Compatibles**: FoxESS H1, AC1, H3, H3-Pro, AIO Series Onduleurs Hybrides de Stockage
- **Interface de Communication**: Modbus TCP via LAN ou RS485 Ethernet converter (Port par défaut : 502, ID esclave : 1 ou 247)

#### Données de Télémétrie Lues par GEMS
Production solaire PV (W), Puissance batterie (W), Puissance active réseau (W), Énergie totale (kWh), SOC batterie (%), Courants triphasés (L1, L2, L3 en A).

#### Consignes Pilotables & Données Écrites par GEMS
Mode de travail FoxESS (`41000` / `44000`), consignes de puissance EMS à distance (W), seuil SOC minimal et limite active d'injection.

#### Rôle Pratique & Automatisation GEMS
Pilotage complet en boucle fermée des gammes hybrides FoxESS H1, H3 et H3-Pro : commande la charge/décharge forcée pour l'arbitrage spot et l'écrêtage des pointes ainsi que la limitation active d'injection PV.

---

### 1.8 Fronius Gen24 Onduleur

- **Identifiant du Modèle**: `fronius_inverter`
- **Fabricant / Marque**: Fronius
- **Modèles Matériels Compatibles**: Fronius Primo Gen24, Symo Gen24 Plus, Symo Hybrid, Tauro (SunSpec Modbus)
- **Interface de Communication**: Modbus TCP via protocole SunSpec (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Production solaire PV (W), Puissance de charge/décharge batterie (W), Flux de puissance réseau (W), Énergie cumulée (kWh), BYD / Fronius SOC batterie (%).

#### Consignes Pilotables & Données Écrites par GEMS
Limite de puissance active SunSpec Modèle 123 (`WMaxLimPct` registre simple FC06) et pilotage charge/décharge SunSpec Modèle 124 (`StorCtl_Mod`, `OutWRte`, `InWRte`).

#### Rôle Pratique & Automatisation GEMS
Contrôle complet en boucle fermée pour Fronius Symo / Primo / Gen24 Plus : régule la puissance de charge/décharge des batteries BYD Battery-Box HVS/HVM pour l'arbitrage spot et l'écrêtage, et bride la production PV lors des prix négatifs.

---

### 1.9 GoodWe Onduleur

- **Identifiant du Modèle**: `goodwe_inverter`
- **Fabricant / Marque**: GoodWe
- **Modèles Matériels Compatibles**: GoodWe ET, EH, ES, EM, Lynx Home F Series Onduleurs Hybrides (ARM/DSP)
- **Interface de Communication**: Modbus TCP / UDP via LAN ou Wi-Fi+LAN kit (Port par défaut : 502 ou 8899, ID esclave : 247)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV (W), Puissance de charge/décharge batterie (W), Flux réseau net (W), Énergie totale cumulée (kWh), SOC batterie (%).

#### Consignes Pilotables & Données Écrites par GEMS
Mode de puissance EMS GoodWe ET/EH/BT/BH (`47511` modes `1`/`2`/`8`/`9`), consigne EMS (`47512` W) et activation/valeur de limite d'injection réseau (`47509`–`47510`).

#### Rôle Pratique & Automatisation GEMS
Pilotage hybride vérifié en boucle fermée pour onduleurs GoodWe ET/EH/BT/BH : automatise l'écrêtage des pointes par batterie, l'arbitrage spot Day-Ahead et la limitation dynamique d'exportation PV.

---

### 1.10 Growatt Onduleur

- **Identifiant du Modèle**: `growatt_inverter`
- **Fabricant / Marque**: Growatt
- **Modèles Matériels Compatibles**: Growatt SPH, MIN, MOD, MID Series Onduleurs Hybrides et Réseau (ShineLAN-X)
- **Interface de Communication**: Modbus TCP via ShineLAN-X Ethernet dongle (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV active (W), Puissance batterie (W), Injection/consommation réseau (W), kWh cumulés, SOC batterie (%).

#### Consignes Pilotables & Données Écrites par GEMS
Mode de priorité Growatt SPH / MOD TL3-XH (`1044` / `3049`), taux de charge/décharge & SOC d'arrêt (`1070`–`1092`) et taux de puissance active / limite d'injection (`3`, `122`–`123`).

#### Rôle Pratique & Automatisation GEMS
Contrôle vérifié en boucle fermée pour onduleurs hybrides et string Growatt SPH et MOD : gère la charge forcée batterie, la décharge en pointe et l'écrêtement PV à prix spot négatifs.

---

### 1.11 Huawei Onduleur Hybride

- **Identifiant du Modèle**: `huawei_inverter`
- **Fabricant / Marque**: Huawei
- **Modèles Matériels Compatibles**: Huawei SUN2000 Series (2KTL-6KTL-L1, 3KTL-10KTL-M1, 12KTL-25KTL-M2/M5, 30KTL-100KTL-M3, MAP0, MB0) avec LUNA2000 Battery (5kWh-30kWh)
- **Interface de Communication**: Modbus TCP via SDongleA-05 (Ethernet/WLAN) ou SmartLogger3000 (Port par défaut : 502, ID esclave : 1 ou 2)

#### Données de Télémétrie Lues par GEMS
Production solaire PV active (W, reg 32080), Puissance de charge/décharge batterie LUNA2000 (W, reg 37001), Puissance réseau prélevée/injectée via DTSU666-H (W, reg 37113), Production cumulée (kWh, reg 32106), SOC batterie (%, reg 37004).

#### Consignes Pilotables & Données Écrites par GEMS
Consigne de charge / décharge forcée batterie (W, reg 40118/40120), Limite de bridage de puissance active (W ou % de la puissance nominale, reg 40118/40125).

#### Rôle Pratique & Automatisation GEMS
Pilotage bidirectionnel complet de la batterie et de l'écrêtement : commande la décharge de la LUNA2000 lors des pointes domestiques (tarif capacitaire flamand), force la charge réseau durant les heures EPEX creuses/négatives et bride la puissance PV lors des prix d'injection négatifs ou en mode zéro-injection.

---

### 1.12 LG ESS Home (8 / 10 / 15)

- **Identifiant du Modèle**: `lg_ess`
- **Fabricant / Marque**: LG
- **Modèles Matériels Compatibles**: LG ESS Home 8, Home 10, Home 15 Systèmes Hybrides de Stockage Énergétique
- **Interface de Communication**: API HTTP REST locale (Port par défaut : 80 / 443, JSON endpoints: /v1/user/setting/network)

#### Données de Télémétrie Lues par GEMS
Production solaire PV (W), Flux de puissance batterie (W), Prélèvement/injection réseau (W), Énergie cumulée (kWh), SOC batterie (%).

#### Consignes Pilotables & Données Écrites par GEMS
Pilotage local LG ESS Home `/v1/user/setting/batt` (charge forcée / autoconsommation) et bridage de puissance PCS.

#### Rôle Pratique & Automatisation GEMS
Intégration HTTPS locale sans cloud pour systèmes LG ESS Home 8 / 10 / 15 avec charge batterie automatisée en heures creuses et équilibrage des flux réseau.

---

### 1.13 Marstek Venus / Jupiter Storage

- **Identifiant du Modèle**: `marstek_storage`
- **Fabricant / Marque**: Marstek
- **Modèles Matériels Compatibles**: Marstek Venus Series, Jupiter Hybrid Stockage d'Énergie Batterie Tout-en-Un
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV (W), Puissance de charge/décharge batterie (W), Puissance d'échange réseau (W), Énergie totale (kWh), SOC batterie (%).

#### Consignes Pilotables & Données Écrites par GEMS
Activation du mode passif Marstek Venus C / E / Jupiter (`42000 = 0x55AA`), contrôle de direction (`42010`) et consignes exactes de charge/décharge en Watts (`42020`–`42021`).

#### Rôle Pratique & Automatisation GEMS
Régulation complète en boucle fermée du stockage couplé AC Marstek Venus C/E et Jupiter : absorbe le surplus solaire, écrête les pointes capacitaires domestiques et exécute l'arbitrage spot Day-Ahead.

---

### 1.14 SAJ eSolar (H1 / H2 / R5 / R6 Onduleur Hybride)

- **Identifiant du Modèle**: `saj_hybrid`
- **Fabricant / Marque**: SAJ
- **Modèles Matériels Compatibles**: SAJ eSolar H1, H2, R5, R6 Series Onduleurs Hybrides & Stockage (B1/B2 Batteries)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Production solaire PV (W), Puissance batterie (W), Puissance active réseau (W), Énergie totale (kWh), SOC batterie (%), Courants triphasés (L1, L2, L3 en A).

#### Consignes Pilotables & Données Écrites par GEMS
Consignes passives de charge et décharge (W) SAJ H1 / H2 / R5 / R6 AppMode et limite de réduction de puissance active (`0.1%`).

#### Rôle Pratique & Automatisation GEMS
Gestion hybride en boucle fermée des systèmes SAJ H1/H2 : coordonne le bridage PV triphasé, la charge forcée en heures creuses et l'écrêtage des pointes de demande.

---

### 1.15 SMA Sunny Boy / Tripower / Onduleur de Stockage

- **Identifiant du Modèle**: `sma_inverter`
- **Fabricant / Marque**: SMA
- **Modèles Matériels Compatibles**: SMA Sunny Boy (1.5-6.0), Sunny Tripower (3.0-10.0, X, Smart Energy), Sunny Island, Sunny Boy Storage
- **Interface de Communication**: Modbus TCP via Speedwire / SunSpec (Port par défaut : 502, ID esclave : 126 ou 3)

#### Données de Télémétrie Lues par GEMS
Production solaire PV (W, reg 30775), Puissance de charge/décharge batterie (W, reg 31393), Puissance active réseau (W, reg 30865), Énergie totale (kWh, reg 30513), SOC batterie (%, reg 30845), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Limite de puissance active SMA (`WModCfg` / `WMaxLimPct`) et pilotage bidirectionnel de batterie pour Sunny Island / Sunny Boy Storage (`40151=802`, `40149`) et Sunny Tripower Smart Energy (`40236`, `40793`–`40801`).

#### Rôle Pratique & Automatisation GEMS
Bridage solaire complet en boucle fermée et arbitrage batterie sur toute la gamme SMA Sunny Boy, Sunny Tripower, Sunny Tripower Smart Energy (STP-SE) et Sunny Boy Storage.

---

### 1.16 Senergy (SE Series / Onduleur Hybride)

- **Identifiant du Modèle**: `senergy_inverter`
- **Fabricant / Marque**: Senergy
- **Modèles Matériels Compatibles**: Senergy SE Series Onduleurs Hybrides & Stockage (3kW – 15kW)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV active (W), Puissance de charge/décharge batterie (W), Échange réseau (W), Énergie cumulée (kWh), SOC batterie (%).

#### Consignes Pilotables & Données Écrites par GEMS
Consignes passives de puissance de charge/décharge (W) Senergy SE Hybrid et limite de puissance active de sortie (%).

#### Rôle Pratique & Automatisation GEMS
Contrôle en boucle fermée des onduleurs hybrides Senergy : automatise l'écrêtage des pointes par batterie, la charge en heures creuses et le bridage PV à prix négatifs.

---

### 1.17 Sigenergy SigenStor (Onduleur Hybride & Stockage)

- **Identifiant du Modèle**: `sigenergy_hybrid`
- **Fabricant / Marque**: Sigenergy
- **Modèles Matériels Compatibles**: Sigenergy SigenStor Système de Stockage 5-en-1 (Onduleur, Batterie, EVDC/EVAC)
- **Interface de Communication**: Modbus TCP via Sigen Gateway / Onduleur (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV (W), Flux batterie Sigen (W), Puissance d'échange réseau (W), Énergie totale (kWh), Sigen SOC batterie (%), Courants triphasés (L1, L2, L3 en A).

#### Consignes Pilotables & Données Écrites par GEMS
Activation Remote EMS SigenStor (`40029`), mode de fonctionnement (`40031`), consignes max. de charge/décharge (`40032`–`40034` U32 W) et limite de bridage PV (`40038`).

#### Rôle Pratique & Automatisation GEMS
Pilotage EMS haute précision en boucle fermée pour systèmes 5-en-1 Sigenergy SigenStor : assure l'écrêtage capacitaire sous la seconde, l'arbitrage spot EPEX et la limitation d'injection PV.

---

### 1.18 SofarSolar (HYD / G3 / AMASS Onduleur Hybride)

- **Identifiant du Modèle**: `sofarsolar_hybrid`
- **Fabricant / Marque**: SofarSolar
- **Modèles Matériels Compatibles**: SofarSolar HYD 3000-6000-ES, HYD 5K-20KTL-3PH, G3 Series, AMASS StoreEdge Batteries
- **Interface de Communication**: Modbus TCP via clé Ethernet / Wi-Fi (Port par défaut : 8899 ou 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV (W), Puissance de charge/décharge batterie (W), Flux de puissance réseau (W), Énergie totale cumulée (kWh), SOC batterie (%), Courants triphasés (L1, L2, L3 en A).

#### Consignes Pilotables & Données Écrites par GEMS
Consignes de stockage passif SofarSolar HYD 5K–20KTL-3PH (`0x1187` mode, `0x1189`–`0x118D` S32 signé W) et limite de puissance active / anti-reflux.

#### Rôle Pratique & Automatisation GEMS
Pilotage vérifié en boucle fermée pour systèmes hybrides SofarSolar HYD 3PH G3 et ME3000SP : régule la puissance de charge/décharge batterie et le bridage solaire.

---

### 1.19 SolaX Onduleur

- **Identifiant du Modèle**: `solax_inverter`
- **Fabricant / Marque**: SolaX
- **Modèles Matériels Compatibles**: SolaX Power X1-Hybrid, X3-Hybrid Gen 2/3/4, X1/X3-Fit, Triple Power Batteries
- **Interface de Communication**: Modbus TCP via Pocket LAN ou Pocket Wi-Fi (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV active (W), Puissance batterie (W), Puissance active réseau (W), Énergie totale (kWh), SOC batterie (%).

#### Consignes Pilotables & Données Écrites par GEMS
Mode Remote Control SolaX X1/X3-Hybrid G4 (`0x007C`–`0x0080`, cible exacte de puissance active W + chien de garde) avec repli sur mode manuel `0x001F` et limite utilisateur d'injection (`0x0042`).

#### Rôle Pratique & Automatisation GEMS
Pilotage vérifié sous la seconde en boucle fermée pour systèmes SolaX X1/X3-Hybrid et Fit : optimise l'autoconsommation solaire, l'arbitrage tarifaire spot et l'écrêtement PV.

---

### 1.20 SolarEdge Triphasé Onduleur

- **Identifiant du Modèle**: `solaredge_3phase`
- **Fabricant / Marque**: SolarEdge
- **Modèles Matériels Compatibles**: SolarEdge Triphasé Onduleurs (SE3K – SE33.3K, StorEdge Triphasé avec SetApp)
- **Interface de Communication**: Modbus TCP via protocole SunSpec (Port par défaut : 1502 ou 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Production solaire PV (W), Puissance de charge/décharge batterie (W), Puissance du compteur réseau (W), Énergie totale (kWh), SOC de la batterie Energy Bank connectée (%).

#### Consignes Pilotables & Données Écrites par GEMS
Mode de contrôle StorEdge `4` (Remote) SolarEdge, limite de charge/décharge (`0xE00E`/`0xE010` float32 W), commande de mode (`0xE00D`) et Advanced Power Control (`0xF001` / SunSpec M123).

#### Rôle Pratique & Automatisation GEMS
Contrôle triphasé complet en boucle fermée SolarEdge Home Hub & StorEdge : module la puissance de charge/décharge batterie et bride la production PV lors des prix spot négatifs.

---

### 1.21 SolarEdge Onduleur

- **Identifiant du Modèle**: `solaredge_inverter`
- **Fabricant / Marque**: SolarEdge
- **Modèles Matériels Compatibles**: SolarEdge Monophasé HD-Wave Onduleurs (SE2200H – SE6000H, StorEdge Monophasé)
- **Interface de Communication**: Modbus TCP via protocole SunSpec (Port par défaut : 1502 ou 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Production solaire PV (W), Puissance de charge/décharge batterie (W), Puissance active réseau (W), Énergie totale (kWh), SOC batterie (%).

#### Consignes Pilotables & Données Écrites par GEMS
Mode de contrôle StorEdge `4` (Remote) SolarEdge, limite de charge/décharge (`0xE00E`/`0xE010` float32 W), commande de mode (`0xE00D`) et Advanced Power Control (`0xF001` / SunSpec M123).

#### Rôle Pratique & Automatisation GEMS
Contrôle monophasé complet en boucle fermée SolarEdge HD-Wave & Home Hub : pilote les consignes de charge/décharge StorEdge / Home Battery et limite la production solaire si nécessaire.

---

### 1.22 Solis Onduleurs Hybrides & Retrofit (Référence Principale)

- **Identifiant du Modèle**: `solis_hybrid`
- **Fabricant / Marque**: Solis
- **Modèles Matériels Compatibles**: Solis S5-EH1P, S6-EH1P Series (Hybride Monophasé), S6-EH3P Series (Hybride Triphasé 5kW-20kW), Solis RAI-3K-48V-5G, S6-EA1P3.6K-L, S6-EA1P5K-L Series (Stockage Retrofit Couplé AC)
- **Interface de Communication**: Modbus TCP via port Ethernet interne direct / Ginlong Wi-Fi/LAN stick (Port par défaut : 502 ou 8899, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active de production PV (W, reg 33079), Puissance de charge/décharge batterie (W, reg 33149), SOC batterie (%, reg 33139), Puissance active du compteur réseau (W, reg 33130), Production énergétique cumulée totale (kWh, reg 33029), Courants AC triphasés (0.1A, regs 33073-33075), Tensions triphasées (0.1V, regs 33076-33078).

#### Consignes Pilotables & Données Écrites par GEMS
Mode et limite de bridage de puissance active (W / % via registres Holding 43052/43070 sur Hybride et 3051/3052 sur String), consigne de charge et décharge forcée batterie (W via registres 43110/43129/43135/43136).

#### Rôle Pratique & Automatisation GEMS
Plateforme de référence principale désignée pour les onduleurs solaires hybrides et le stockage par batterie. Exécute un bridage actif en boucle fermée sous la seconde durant les heures spot négatives (Mode Pays-Bas / Zéro-Injection), stocke automatiquement le surplus photovoltaïque, ajuste la puissance lors de l'écrêtage capacitaire flamand et orchestre l'arbitrage EPEX Day-Ahead (charge forcée en heures creuses et décharge en pointe). Les modèles Solis Retrofit fonctionnent de manière transparente en stockage couplé AC indépendant de toute chaîne PV.

---

### 1.23 Sungrow Onduleur

- **Identifiant du Modèle**: `sungrow_inverter`
- **Fabricant / Marque**: Sungrow
- **Modèles Matériels Compatibles**: Sungrow SH5.0RT, SH6.0RT, SH8.0RT, SH10RT, SH15T, SH20T Onduleurs Hybrides (SBR096-SBR256)
- **Interface de Communication**: Modbus TCP via port RJ45 LAN interne direct (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Production solaire PV (W, reg 5016), Puissance de charge/décharge batterie (W, reg 13021), Puissance d'échange réseau (W, reg 13009), Production cumulée (kWh, reg 5003), SBR SOC batterie (%, reg 13022).

#### Consignes Pilotables & Données Écrites par GEMS
Sélection du mode EMS Sungrow SH-RS / SH-RT / SH-T (`13049`), commande charge/décharge (`13050` `0xAA`/`0xBB`/`0xCC`), consigne de puissance (`13051` W) et limitation de puissance active (`5006`–`5007`).

#### Rôle Pratique & Automatisation GEMS
Pilotage haute vitesse vérifié en boucle fermée pour onduleurs hybrides Sungrow SH et string SG : assure l'écrêtage sous la seconde, l'arbitrage batterie EPEX et le bridage PV.

---

### 1.24 Victron Onduleur/GX

- **Identifiant du Modèle**: `victron_inverter`
- **Fabricant / Marque**: Victron
- **Modèles Matériels Compatibles**: Victron Energy MultiPlus-II, Quattro, Cerbo GX, Ekrano GX, Color Control GX (Venus OS)
- **Interface de Communication**: Modbus TCP via Venus OS (Port par défaut : 502, ID d'unité : 100 pour System Calc / 228 pour l'onduleur)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV DC/AC (W, reg 811), Puissance de charge/décharge batterie (W, reg 842), Prélèvement/injection réseau AC net (W, reg 820), Énergie totale (kWh), SOC batterie (%, reg 843).

#### Consignes Pilotables & Données Écrites par GEMS
Consigne réseau ESS Victron Venus OS / Cerbo GX (`2700` S16 / `2703` S32 W), désactivation de décharge ESS et limite signée max. d'injection PV (`2706` par pas de 100 W).

#### Rôle Pratique & Automatisation GEMS
Intégration approfondie en boucle fermée avec les systèmes Victron MultiPlus-II / Quattro GX ESS : pilote la consigne réseau AC pour l'arbitrage batterie et l'écrêtage, et limite l'injection excédentaire.

---

### 1.25 ABB / Fimer Onduleur Solaire & Hybride

- **Identifiant du Modèle**: `abb_fimer_inverter`
- **Fabricant / Marque**: ABB / Fimer
- **Modèles Matériels Compatibles**: ABB UNO-DM-PLUS, REACT 2, TRIO, PVI, et Fimer onduleurs string et hybrides
- **Interface de Communication**: Modbus SunSpec sur TCP/RTU (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV active (W, registre standard SunSpec 40083), État de charge de la batterie (SOC %), Puissance de charge / décharge batterie (W), Puissance injectée sur le réseau (W), Énergie produite cumulée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
SunSpec Model 123 Bridage de puissance active (écrêtement) (`WMaxLimPct`, `WMaxLim_Ena`) et Pilotage du taux de charge/décharge SunSpec Modèle 124 (`StorCtl_Mod`, `OutWRte`, `InWRte`).

#### Rôle Pratique & Automatisation GEMS
Contrôle SunSpec complet en boucle fermée pour installations PV et hybrides ABB / Fimer REACT 2 : exécute le bridage solaire à prix spot négatifs, la limitation zéro-injection, l'écrêtage des pointes et l'arbitrage Day-Ahead.

---

### 1.26 Autarco Onduleur Solaire

- **Identifiant du Modèle**: `autarco_inverter`
- **Fabricant / Marque**: Autarco
- **Modèles Matériels Compatibles**: Autarco SX, MX, et LX series onduleurs solaires monophasés et triphasés
- **Interface de Communication**: Modbus TCP via dongle/passerelle réseau local (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV active (W), Production journalière et totale cumulée (kWh), Tension AC réseau (V), Fréquence AC (Hz).

#### Consignes Pilotables & Données Écrites par GEMS
Consignes à distance de puissance de charge/décharge batterie (`43129` / `43135`–`43136`) et Limite de bridage de puissance active (`43052` / `0–100%`).

#### Rôle Pratique & Automatisation GEMS
Pilotage complet en boucle fermée de l'onduleur hybride et du bridage PV pour systèmes Autarco S2.x / MH / LX : coordonne l'autoconsommation solaire, l'arbitrage spot batterie et l'écrêtage capacitaire flamand.

---

### 1.27 Chisage ESS Onduleur Hybride

- **Identifiant du Modèle**: `chisage_ess`
- **Fabricant / Marque**: Chisage ESS
- **Modèles Matériels Compatibles**: Chisage ESS Onduleurs Hybrides Résidentiels, Tertiaires & Industriels (3kW – 50kW)
- **Interface de Communication**: Modbus TCP / RTU via passerelle RS485-Ethernet (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV active (W), Puissance de charge / décharge batterie (W), SOC batterie (%), Puissance réseau prélevée / injectée (W), Énergie cumulée de l'onduleur (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Lecture seule (Télémétrie uniquement — table de pilotage propriétaire fermée).

#### Rôle Pratique & Automatisation GEMS
Intègre la télémétrie solaire et batterie hybride résidentielle, tertiaire et industrielle Chisage ESS dans l'équilibrage énergétique local GEMS.

---

### 1.28 Delta Electronics Onduleur Solaire

- **Identifiant du Modèle**: `delta_inverter`
- **Fabricant / Marque**: Delta Electronics
- **Modèles Matériels Compatibles**: Delta M6A, M8A, M10A, M15A, M50A, et RPI gammes tertiaires et résidentielles
- **Interface de Communication**: Modbus SunSpec sur TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance générée solaire PV (W), Tensions et courants des chaînes DC, Production cumulée (kWh), Puissance AC réseau (W).

#### Consignes Pilotables & Données Écrites par GEMS
SunSpec Model 123 Bridage de puissance active (écrêtement) (`WMaxLimPct`, `WMaxLim_Ena`) et Pilotage de stockage SunSpec Modèle 124.

#### Rôle Pratique & Automatisation GEMS
Télémétrie normalisée SunSpec en boucle fermée et bridage actif de puissance pour onduleurs solaires et hybrides résidentiels et tertiaires Delta.

---

### 1.29 HYXiPOWER Onduleur Hybride

- **Identifiant du Modèle**: `hyxipower_inverter`
- **Fabricant / Marque**: HYXiPOWER
- **Modèles Matériels Compatibles**: HYXiPOWER Onduleurs Hybrides Monophasés & Triphasés Résidentiels et Tertiaires
- **Interface de Communication**: Modbus TCP via dongle Wi-Fi / Ethernet (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Production solaire PV (W), Puissance de charge / décharge batterie (W), SOC batterie (%), Échange réseau (W), Énergie cumulée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Acquisition télémétrique en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Transmet en continu les mesures de production PV et de stockage batterie vers le schéma PowerFlow et le moteur de télémétrie GEMS.

---

### 1.30 KSTAR BluE Onduleur Hybride

- **Identifiant du Modèle**: `kstar_inverter`
- **Fabricant / Marque**: KSTAR
- **Modèles Matériels Compatibles**: KSTAR BluE-S, BluE-H3, et BluE-G systèmes hybrides résidentiels et C&I
- **Interface de Communication**: Modbus RTU / TCP via convertisseur RS485-Ethernet (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV active (W), Puissance de charge / décharge batterie (W), SOC batterie (%), Flux de puissance réseau (W), Courants de phase (L1, L2, L3 en A).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Acquisition télémétrique en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Alimente l'équilibreur de charge et le moteur d'optimisation multi-tarifs GEMS avec les mesures hybrides solaires et batterie.

---

### 1.31 Solinteg Integ M Onduleur Hybride

- **Identifiant du Modèle**: `solinteg_inverter`
- **Fabricant / Marque**: Solinteg
- **Modèles Matériels Compatibles**: Solinteg Integ M OHT/OMT Series (3kW – 50kW) Triphasé Onduleurs Hybrides
- **Interface de Communication**: Modbus RTU / TCP via clé LAN / Wi-Fi (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV active (W), Puissance de charge / décharge batterie (W), SOC batterie (%), Puissance nette d'échange réseau (W), Production cumulée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Mode EMS à distance Solinteg série Integ M, consignes de puissance charge/décharge et limite de puissance active.

#### Rôle Pratique & Automatisation GEMS
Pilotage hybride haute tension triphasé vérifié en boucle fermée pour onduleurs résidentiels et tertiaires Solinteg Integ M (4–50 kW).

---

### 1.32 Solplanet / AISWEI Onduleur

- **Identifiant du Modèle**: `solplanet_inverter`
- **Fabricant / Marque**: Solplanet (AISWEI)
- **Modèles Matériels Compatibles**: Solplanet ASW H-S2, ASW H-T2, ASW-LT-G2/G3 Onduleurs Monophasés et Triphasés
- **Interface de Communication**: Modbus RTU / TCP via Ethernet/Wi-Fi Ai-Dongle (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV active (W), Production énergétique totale (kWh), Tension et courant AC par phase, prélèvement/injection réseau (W).

#### Consignes Pilotables & Données Écrites par GEMS
Mode batterie AISWEI / Solplanet (`1103` bus / `41104` doc), consigne signée de charge/décharge (`1152` S16 W) et contrôle de puissance active (`4000` / `5402` `0,01 %`).

#### Rôle Pratique & Automatisation GEMS
Pilotage vérifié en boucle fermée pour onduleurs Solplanet ASW H-T2/T3 et KACO blueplanet hybrid NH3 : applique des consignes batterie exactes en watts et un bridage PV dynamique.

---

### 1.33 APsystems EZ1-M / EZ1-D Micro-onduleur Local

- **Identifiant du Modèle**: `apsystems_ez1`
- **Fabricant / Marque**: APsystems
- **Modèles Matériels Compatibles**: APsystems EZ1-M, EZ1-D Micro-onduleurs Wi-Fi Balcon & Toiture (Mode Local)
- **Interface de Communication**: API HTTP JSON locale (Port par défaut : 8050, Endpoints: `/getOutputData`, `/setMaxPower`)

#### Données de Télémétrie Lues par GEMS
Puissance active PV Canal 1 & Canal 2 (W), Énergie totale produite cumulée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Consigne locale directe de puissance AC maximale (`/setMaxPower?p=30..800` W).

#### Rôle Pratique & Automatisation GEMS
Télémétrie locale de micro-onduleur 100 % sans cloud et limitation continue de puissance active lors des prix spot EPEX négatifs ou en mode zéro-injection.

---

### 1.34 FENECON Home / OpenEMS Edge (FEMS)

- **Identifiant du Modèle**: `fenecon_fems`
- **Fabricant / Marque**: FENECON
- **Modèles Matériels Compatibles**: FENECON Home 6, Home 10, Home 15, Home 20, Home 30 & OpenEMS Edge Controllers
- **Interface de Communication**: API HTTP REST locale (Port par défaut : 8084, `/rest/channel/_sum/*` & `/rest/channel/ess0/*`)

#### Données de Télémétrie Lues par GEMS
Puissance de production solaire PV (W), Énergie PV cumulée (kWh), Puissance de charge/décharge batterie (W), SOC batterie (%), Puissance active réseau (W).

#### Consignes Pilotables & Données Écrites par GEMS
Consigne exacte de puissance active charge / décharge ESS (`ess0/SetActivePowerEquals` W) et Bridage de puissance active PV (`pvInverter0/SetActivePowerLimit` W).

#### Rôle Pratique & Automatisation GEMS
Intégration locale complète en boucle fermée pour systèmes FENECON Home & OpenEMS : coordonne l'arbitrage batterie EPEX Day-Ahead, l'écrêtage capacitaire flamand et le bridage à prix négatifs.

---

### 1.35 Hoymiles DTU-Pro / OpenDTU Micro-onduleur

- **Identifiant du Modèle**: `hoymiles_dtu`
- **Fabricant / Marque**: Hoymiles
- **Modèles Matériels Compatibles**: Hoymiles HM / HMS / HMT Series Micro-onduleurs via DTU-Pro, DTU-Pro-S, OpenDTU, ou AhoyDTU
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID d'unité : 1) ou API HTTP REST locale OpenDTU (`/api/livedata/status`, `/api/limit/config`)

#### Données de Télémétrie Lues par GEMS
Puissance active PV agrégée et par entrée (W), Rendement solaire cumulé (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Limite de puissance active de sortie (`0xC006` % sur DTU-Pro Modbus ; RAM volatile `limit_type=1` % sur OpenDTU sans usure EEPROM).

#### Rôle Pratique & Automatisation GEMS
Supervision sans cloud des micro-onduleurs et bridage dynamique de la production PV durant les heures de marché spot à prix négatifs.

---

### 1.36 KOSTAL Plenticore Plus / G2 / G3 Hybrid

- **Identifiant du Modèle**: `kostal_plenticore`
- **Fabricant / Marque**: KOSTAL
- **Modèles Matériels Compatibles**: KOSTAL Plenticore Plus, Plenticore BI, Plenticore G2, et Plenticore G3 Onduleurs Hybrides
- **Interface de Communication**: Modbus TCP (Port par défaut : 1502, ID d'unité : 71, Détection automatique CDAB/ABCD IEEE-754 Float32)

#### Données de Télémétrie Lues par GEMS
Puissance DC PV totale (W), Rendement cumulé (kWh), Puissance de charge/décharge batterie (W), SOC batterie (%), Puissance du capteur réseau (W), Tensions & courants triphasés.

#### Consignes Pilotables & Données Écrites par GEMS
Consigne signée de gestion externe de batterie (Holding `1034` Float32 W) et SunSpec Model 123 Bridage de puissance active (écrêtement) (`WMaxLimPct`).

#### Rôle Pratique & Automatisation GEMS
Pilotage complet en boucle fermée des installations hybrides KOSTAL Plenticore : exécute l'écrêtage des pointes par batterie, l'arbitrage spot Day-Ahead et le bridage solaire à prix négatifs.

---

### 1.37 KACO blueplanet hybrid NH3 / gridsave TL3

- **Identifiant du Modèle**: `kaco_inverter`
- **Fabricant / Marque**: KACO
- **Modèles Matériels Compatibles**: KACO blueplanet hybrid 6.0 / 8.0 / 10.0 / 12.0 NH3, blueplanet TL3, et gridsave 50.0 / 92.0 TL3-S Onduleurs de Stockage Tertiaires
- **Interface de Communication**: Modbus TCP / RTU (Port par défaut : 502, ID d'unité : 1, SunSpec Models 103/123/124 & NH3 Storage Block `40200`–`40203`)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV active (W), Énergie cumulée (kWh), Puissance de charge/décharge batterie (W), SOC batterie (%), Limites de puissance charge/décharge BMS en direct (`40202`–`40203` W), Courants & tensions triphasés.

#### Consignes Pilotables & Données Écrites par GEMS
SunSpec Model 123 Bridage de puissance active (écrêtement) (`WMaxLimPct`, `WMaxLim_Ena`) et Pilotage de stockage Modèle 124 (`WChaMax`, `WChaGra`, `WDisChaGra`, `StorCtl_Mod`, `WChaMaxRvrtTms=300s` Watchdog) plus repli EMS NH3 (`40210`–`40212`).

#### Rôle Pratique & Automatisation GEMS
Pilotage complet en boucle fermée pour installations KACO blueplanet hybrid NH3 et tertiaires gridsave TL3 : assure l'écrêtage par batterie, l'arbitrage spot EPEX Day-Ahead et le bridage solaire à prix négatifs.

---

### 1.38 Onduleur Modbus Personnalisé (Profil Registres UI)

- **Identifiant du Modèle**: `custom_modbus_inverter`
- **Fabricant / Marque**: Custom Modbus
- **Modèles Matériels Compatibles**: Tout onduleur photovoltaïque string, micro ou hybride Modbus TCP ou RS-485 RTU configuré via l'Éditeur UI de Profils Registres certifié
- **Interface de Communication**: Modbus TCP / RTU (Port configurable ou bus `/dev/serial/by-id/*`, ID d'unité, lectures `FC03`/`FC04` & écritures optionnelles `FC06`/`FC16`)

#### Données de Télémétrie Lues par GEMS
Puissance solaire PV (W), Puissance batterie (W), SOC batterie (%), Puissance nette réseau (W), Énergie cumulée (kWh), Tensions & courants triphasés mappés via l'UI (`int16`, `uint16`, `int32`, `uint32`, `float32` ou facteur d'échelle SunSpec `ABCD`/`CDAB`/`BADC`/`DCBA`).

#### Consignes Pilotables & Données Écrites par GEMS
Limite optionnelle de bridage de puissance active (`curtailment_limit_w` / `curtailment_limit_pct`), Puissance de charge/décharge batterie (`battery_power_w`), battement périodique Watchdog matériel et registre de repli sécurisé à l'arrêt.

#### Rôle Pratique & Automatisation GEMS
Permet aux installateurs certifiés d'intégrer des onduleurs solaires et hybrides hors catalogue directement depuis l'interface web avec test de registre en direct, import/export JSON et repli fail-safe.

---

## 2. Systèmes Dédiés de Stockage d'Énergie par Batterie (BESS) (18 Appareils)

Les systèmes dédiés de stockage stationnaire (BESS) s'interfacent en Modbus TCP/RTU ou via des API HTTP REST locales pour superviser et piloter les batteries résidentielles et tertiaires indépendamment des onduleurs solaires. Ils fournissent en temps réel l'état de charge (SOC %), la puissance active et les limites dynamiques du BMS afin d'alimenter les algorithmes d'arbitrage, d'autoconsommation et d'écrêtement de pointe.

### 2.1 Siemens Junelight Batterie Intelligente

- **Identifiant du Modèle**: `siemens_junelight`
- **Fabricant / Marque**: Siemens
- **Modèles Matériels Compatibles**: Siemens Junelight Système Intelligent de Stockage d'Énergie par Batterie (3.3kWh – 19.8kWh)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge/décharge batterie (W), État de charge de la batterie (SOC %), Flux net de puissance réseau (W), État interne de la batterie.

#### Consignes Pilotables & Données Écrites par GEMS
Mode de fonctionnement EMS Siemens Junelight Batterie Intelligente et consignes de charge/décharge forcée (W).

#### Rôle Pratique & Automatisation GEMS
Intégration vérifiée avec le stockage résidentiel Siemens Junelight pour l'autoconsommation solaire, l'écrêtage des pointes et la charge en heures creuses.

---

### 2.2 Solarwatt (EnergyManager / MyReserve Matrix)

- **Identifiant du Modèle**: `solarwatt_storage`
- **Fabricant / Marque**: Solarwatt
- **Modèles Matériels Compatibles**: Solarwatt EnergyManager Pro, MyReserve Matrix Système de Stockage par Batterie
- **Interface de Communication**: API HTTP REST locale (Port par défaut : 80, JSON endpoint: /rest/kiwigrid/private/items)

#### Données de Télémétrie Lues par GEMS
Flux de puissance batterie (W), SOC batterie (%), Production solaire (W), Échange réseau (W), Énergie cumulée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Pilotage local charge/décharge `/rest/items` et acquisition télémétrique Solarwatt EnergyManager / Reserve.

#### Rôle Pratique & Automatisation GEMS
Intégration LAN locale vérifiée sans cloud pour systèmes de stockage Solarwatt EnergyManager Pro et MyReserve / Battery flex.

---

### 2.3 sonnenBatterie (eco 6 / 8 / 10 / hybrid)

- **Identifiant du Modèle**: `sonnen_batterie`
- **Fabricant / Marque**: Sonnen
- **Modèles Matériels Compatibles**: sonnenBatterie eco 6, eco 8, eco 8.2, eco 10, sonnenBatterie hybrid 9.53
- **Interface de Communication**: API HTTP REST locale v1/v2 (Port par défaut : 80, JSON endpoint: /api/v2/status)

#### Données de Télémétrie Lues par GEMS
Puissance de charge/décharge batterie (W), SOC batterie (%), Production solaire PV (W), Injection / consommation réseau (W).

#### Consignes Pilotables & Données Écrites par GEMS
API locale v2 sonnenBatterie `PUT /api/v2/configurations` (`EM_OperatingMode=1` Manuel / `2` Autoconsommation) et `POST /api/v2/setpoint/charge|discharge/{W}`.

#### Rôle Pratique & Automatisation GEMS
Contrôle complet en boucle fermée pour sonnenBatterie eco 8 / 10 / performance : bascule proprement en mode API manuel lors de l'arbitrage forcé ou de l'écrêtage, puis rétablit l'autoconsommation autonome.

---

### 2.4 Duracell Energy Stockage Résidentiel

- **Identifiant du Modèle**: `duracell_energy`
- **Fabricant / Marque**: Duracell Energy
- **Modèles Matériels Compatibles**: Duracell Energy Dura5, DuraCharge, et Durai systèmes de stockage
- **Interface de Communication**: Modbus RTU / TCP via passerelle (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge / décharge batterie (W), État de charge de la batterie (SOC %), Flux de puissance réseau (W), Puissance AC onduleur (W).

#### Consignes Pilotables & Données Écrites par GEMS
Lecture seule (Télémétrie uniquement).

#### Rôle Pratique & Automatisation GEMS
Supervise l'état de charge (SOC) et les échanges de puissance des batteries résidentielles Duracell pour l'équilibrage du site et le routage du surplus solaire vers le VE.

---

### 2.5 Dyness Système de Stockage par Batterie

- **Identifiant du Modèle**: `dyness_battery`
- **Fabricant / Marque**: Dyness
- **Modèles Matériels Compatibles**: Dyness Tower, Powerbox F, DL5.0C, et A48100 batteries lithium résidentielles
- **Interface de Communication**: Modbus RTU / TCP via passerelle / Onduleur BMS Port (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge / décharge batterie (W), État de charge de la batterie (SOC %), Tension totale du pack (V), Courant (A), Températures des cellules (°C).

#### Consignes Pilotables & Données Écrites par GEMS
Mode EMS Modbus Dyness Tower / Powerbox / Junior Box et limites de puissance de charge/décharge (W).

#### Rôle Pratique & Automatisation GEMS
Intégration vérifiée BMS & PCS pour batteries Dyness HT/BT avec pilotage de charge et décharge en boucle fermée.

---

### 2.6 Elecnova Système BESS Tertiaire & Industriel

- **Identifiant du Modèle**: `elecnova_bess`
- **Fabricant / Marque**: Elecnova
- **Modèles Matériels Compatibles**: Elecnova ECO Series Armoires Extérieures BESS Tertiaires & Industrielles (50kW – 500kW)
- **Interface de Communication**: Modbus TCP via passerelle industrielle (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active batterie (W), État de charge de la batterie (SOC %), Puissance d'échange réseau (W), Énergie entrante / sortante cumulée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Lecture seule (Télémétrie uniquement).

#### Rôle Pratique & Automatisation GEMS
Supervise les flux de puissance, l'état de charge (SOC) et l'énergie cumulée des systèmes BESS tertiaires et industriels sur le tableau de bord en direct.

---

### 2.7 Goneo Système de Stockage Résidentiel

- **Identifiant du Modèle**: `goneo_storage`
- **Fabricant / Marque**: Goneo
- **Modèles Matériels Compatibles**: Goneo Systèmes Résidentiels Tout-en-Un de Stockage d'Énergie
- **Interface de Communication**: Modbus TCP / RTU via Wi-Fi/Ethernet Module (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge / décharge batterie (W), SOC batterie (%), Flux de puissance réseau (W), Énergie totale (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Lecture seule (Télémétrie uniquement).

#### Rôle Pratique & Automatisation GEMS
Suit l'état de charge (SOC) et les flux de puissance du stockage résidentiel pour coordonner l'équilibrage des bornes VE et des relais.

---

### 2.8 Mastervolt MLI Ultra / Combi CZone

- **Identifiant du Modèle**: `mastervolt_storage`
- **Fabricant / Marque**: Mastervolt
- **Modèles Matériels Compatibles**: Mastervolt MLI Ultra Lithium-ion series, Mass Combi Ultra, CZone Modbus Bridge
- **Interface de Communication**: Modbus RTU / TCP via CZone Bridge / MasterBus gateway (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance batterie (W), SOC batterie (%), Puissance de sortie AC onduleur (W), tension du bus DC (V), courant batterie (A).

#### Consignes Pilotables & Données Écrites par GEMS
Lecture seule (Télémétrie uniquement).

#### Rôle Pratique & Automatisation GEMS
Assure le suivi télémétrique des systèmes batteries Mastervolt / CZone résidentiels, marins et sites isolés.

---

### 2.9 Power Sonic Stockage d'Énergie C&I

- **Identifiant du Modèle**: `powersonic_bess`
- **Fabricant / Marque**: Power Sonic
- **Modèles Matériels Compatibles**: Power Sonic PS-C&I et PowerBlock Système BESS Tertiaire & Industriel
- **Interface de Communication**: Modbus TCP via BMS/PCS Controller (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active batterie (W), État de charge de la batterie (SOC %), Flux de puissance réseau (W), Registres d'état de défaut.

#### Consignes Pilotables & Données Écrites par GEMS
Lecture seule (Télémétrie uniquement).

#### Rôle Pratique & Automatisation GEMS
Supervise les flux de puissance et l'état de charge (SOC) des systèmes BESS commerciaux sur le tableau de bord GEMS en direct.

---

### 2.10 Poweroad Stockage Résidentiel & C&I

- **Identifiant du Modèle**: `poweroad_storage`
- **Fabricant / Marque**: Poweroad
- **Modèles Matériels Compatibles**: Poweroad ERA, Centauri, et H-ES systèmes de stockage d'énergie résidentiels et tertiaires
- **Interface de Communication**: Modbus RTU / TCP via passerelle (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance batterie (W), État de charge de la batterie (SOC %), Flux réseau (W), Énergie entrante / sortante cumulée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Lecture seule (Télémétrie uniquement).

#### Rôle Pratique & Automatisation GEMS
Assure la supervision télémétrique des systèmes de stockage batterie résidentiels et tertiaires Poweroad.

---

### 2.11 Pylontech Stockage Batterie (US / Force)

- **Identifiant du Modèle**: `pylontech_storage`
- **Fabricant / Marque**: Pylontech
- **Modèles Matériels Compatibles**: Pylontech US2000, US3000, US5000, Force-H1, Force-H2, et Pelio series
- **Interface de Communication**: Modbus RTU / TCP via Onduleur Gateway ou SC0500/SC1000 controller (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge / décharge batterie (W), État de charge (SOC %), Tension du pack (V), Courant du pack (A), SOH (%).

#### Consignes Pilotables & Données Écrites par GEMS
Consignes BMS/EMS de puissance de charge et décharge Pylontech US2000/US3000/US5000 & Force-H1/H2 via Modbus TCP/RTU.

#### Rôle Pratique & Automatisation GEMS
Télémétrie et pilotage de puissance vérifiés en boucle fermée pour baies de stockage stationnaires basse et haute tension Pylontech.

---

### 2.12 Socomec SUNSYS C-System / HES BESS

- **Identifiant du Modèle**: `socomec_bess`
- **Fabricant / Marque**: Socomec
- **Modèles Matériels Compatibles**: Socomec SUNSYS C-System et SUNSYS HES L / XL Systèmes Industriels de Stockage d'Énergie
- **Interface de Communication**: Modbus TCP via Diris Digiware / BESS Controller (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active batterie (W), SOC batterie (%), Limites max. de charge/décharge BMS en direct (`0xC008`–`0xC009` W), Flux de puissance active réseau (W), Énergie cumulée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Pilotage distant de puissance active PCS Socomec SUNSYS (`0xC100` Mode, `0xC101`–`0xC102` consigne S32 0,1 kW, chien de garde matériel `0xC103=300s`) avec repli SunSpec Modèle 124.

#### Rôle Pratique & Automatisation GEMS
Pilotage batterie C&I vérifié en boucle fermée pour Socomec SUNSYS HES L/XL et PCS+ : exécute l'écrêtage industriel des pointes, la protection capacitaire et l'arbitrage spot EPEX.

---

### 2.13 Sunwoda AtSmart Stockage d'Énergie

- **Identifiant du Modèle**: `sunwoda_energy`
- **Fabricant / Marque**: Sunwoda Energy
- **Modèles Matériels Compatibles**: Sunwoda AtSmart Système Batterie Résidentiel et Noah C&I BESS
- **Interface de Communication**: Modbus TCP via BMS Communication Hub (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge / décharge batterie (W), État de charge de la batterie (SOC %), Flux de puissance réseau (W), Température (°C).

#### Consignes Pilotables & Données Écrites par GEMS
Lecture seule (Télémétrie uniquement).

#### Rôle Pratique & Automatisation GEMS
Supervise l'état de charge et les échanges de puissance des batteries Sunwoda sur le tableau de bord GEMS en direct.

---

### 2.14 Sessy Batterie Intelligente (Stockage Domestique AC)

- **Identifiant du Modèle**: `sessy_battery`
- **Fabricant / Marque**: Sessy
- **Modèles Matériels Compatibles**: Sessy 5 kWh Batterie Domestique Modulaire Retrofit Couplée AC
- **Interface de Communication**: API HTTP REST locale avec authentification Basic (`/api/v1/power/status`, `/api/v1/power/active_strategy`, `/api/v1/power/setpoint`)

#### Données de Télémétrie Lues par GEMS
Puissance de charge/décharge batterie (W), État de charge (SOC %), Énergie injectée (kWh), Tensions (V) & courants (A) efficaces par phase.

#### Consignes Pilotables & Données Écrites par GEMS
Sélection dynamique de stratégie (`POWER_STRATEGY_API` vs `POWER_STRATEGY_NOM`) et consigne signée en Watts (`-W` Charge / `+W` Décharge).

#### Rôle Pratique & Automatisation GEMS
Pilotage local sans cloud des batteries domestiques retrofit Sessy pour l'autoconsommation solaire, l'écrêtage capacitaire flamand et l'arbitrage spot EPEX.

---

### 2.15 Tesla Powerwall 2 / 3 & Backup Gateway (HTTPS local)

- **Identifiant du Modèle**: `tesla_powerwall`
- **Fabricant / Marque**: Tesla Energy
- **Modèles Matériels Compatibles**: Tesla Powerwall 2, Powerwall+, Powerwall 3 & Backup Gateway 2 (Stockage Domestique Stationnaire)
- **Interface de Communication**: API HTTPS locale de passerelle (`POST /api/login/Basic`, `GET /api/meters/aggregates`, `GET /api/system_status/soe`)

#### Données de Télémétrie Lues par GEMS
Puissance batterie (W), État d'énergie utile (SOC %), Puissance réseau du site (W), Puissance solaire (W), Énergie cumulée (kWh), Courants & tensions triphasés du site.

#### Consignes Pilotables & Données Écrites par GEMS
Lecture seule (Le micrologiciel local Gateway v23+ impose une télémétrie en lecture seule).

#### Rôle Pratique & Automatisation GEMS
Acquisition HTTPS locale haute vitesse des flux réseau, solaires et batterie Powerwall pour piloter la charge VE au surplus et la protection contre les pointes capacitaires.

---

### 2.16 VARTA pulse / neo / element Stockage Domestique

- **Identifiant du Modèle**: `varta_storage`
- **Fabricant / Marque**: VARTA
- **Modèles Matériels Compatibles**: VARTA pulse, VARTA pulse neo, VARTA element, VARTA element backup, VARTA link
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID d'unité : 255, Registres Holding `1066`–`1102` & `2065`–`2066`)

#### Données de Télémétrie Lues par GEMS
Puissance de charge/décharge batterie (W), SOC batterie (%), Énergie chargée cumulée (kWh), Puissance du capteur réseau (W), Puissance du capteur PV raccordé (W).

#### Consignes Pilotables & Données Écrites par GEMS
Pilotage de puissance active EMS VARTA (`2065` Commande : Charge/Décharge/Auto, `2066` Puissance W ; registre de repli `1074`).

#### Rôle Pratique & Automatisation GEMS
Contrôle Modbus TCP local en boucle fermée pour systèmes de stockage couplés AC VARTA : automatise la charge spot en heures creuses et l'écrêtage des pointes domestiques.

---

### 2.17 Zendure SolarFlow AC / Hyper 2000

- **Identifiant du Modèle**: `zendure_solarflow`
- **Fabricant / Marque**: Zendure
- **Modèles Matériels Compatibles**: Zendure Hyper 2000, SolarFlow 800, SolarFlow AB1000/AB2000, SolarFlow 2400 AC
- **Interface de Communication**: API HTTP JSON locale (`GET /properties/report`, `POST /properties/write`)

#### Données de Télémétrie Lues par GEMS
Puissance d'entrée solaire (W), Puissance de charge et décharge du pack batterie (W), État de charge (`electricLevel` %).

#### Consignes Pilotables & Données Écrites par GEMS
Mode Smart AC (`acMode` Charge/Décharge) et consignes progressives `inputLimit` / `outputLimit` en Watts (`0–2400 W`).

#### Rôle Pratique & Automatisation GEMS
Pilotage local 100 % sans cloud pour systèmes Zendure plug-in et couplés AC : absorbe le surplus photovoltaïque et décharge pour couvrir les pointes résidentielles du soir.

---

### 2.18 Sinexcel PWS PCS Bidirectionnel / BESS Tertiaire

- **Identifiant du Modèle**: `sinexcel_bess`
- **Fabricant / Marque**: Sinexcel
- **Modèles Matériels Compatibles**: Sinexcel PWS1-30K / 50K / 100K / 250K / 500K / 630K Convertisseurs PCS Bidirectionnels & Baies BESS Tertiaires
- **Interface de Communication**: Modbus TCP / RTU (Port par défaut : 502, ID d'unité : 1, Holding `100`–`113` & `600`–`610`)

#### Données de Télémétrie Lues par GEMS
Puissance active batterie (`106` 0.1 kW), SOC batterie (`109` 0.1%), Énergie déchargée cumulée (`110`–`111` 0.1 kWh), Limites max. de puissance charge/décharge BMS en direct (`112`–`113` 0.1 kW), Tensions & courants triphasés.

#### Consignes Pilotables & Données Écrites par GEMS
Marche/Veille PCS à distance (`600`), mode PQ à puissance constante (`601`), consigne signée de puissance active (`602` S16 0,1 kW) et chien de garde fail-safe de 60 s (`610`).

#### Rôle Pratique & Automatisation GEMS
Contrôle batterie industriel et C&I en boucle fermée pour convertisseurs de stockage Sinexcel PWS : automatise l'écrêtage haute puissance, la protection du transformateur réseau et l'arbitrage spot Day-Ahead.

---

### 2.19 Stockage Batterie Modbus Personnalisé (Profil Registres UI)

- **Identifiant du Modèle**: `custom_modbus_battery`
- **Fabricant / Marque**: Custom Modbus
- **Modèles Matériels Compatibles**: Toute batterie domestique stationnaire, convertisseur PCS ou passerelle BMS Modbus TCP ou RS-485 RTU configurée via l'Éditeur UI de Profils Registres certifié
- **Interface de Communication**: Modbus TCP / RTU (Port configurable ou bus `/dev/serial/by-id/*`, ID d'unité, lectures `FC03`/`FC04` & écritures optionnelles `FC06`/`FC16`)

#### Données de Télémétrie Lues par GEMS
Puissance de charge/décharge batterie (W), SOC batterie (%), Limites max. BMS charge/décharge en direct (W), Énergie cumulée (kWh) et tensions/courants triphasés mappés via l'UI.

#### Consignes Pilotables & Données Écrites par GEMS
Consignes optionnelles signées ou séparées de puissance batterie (`battery_power_w`, `battery_charge_w`, `battery_discharge_w`), bornes min/max de sécurité, battement Watchdog et repli sécurisé en autoconsommation.

#### Rôle Pratique & Automatisation GEMS
Intègre des systèmes BESS Modbus résidentiels et tertiaires sur mesure dans l'arbitrage dynamique 24 h GEMS, l'écrêtement capacitaire flamand et l'absorption solaire à prix négatifs sans développement spécifique.

---

## 3. Bornes de Recharge pour Véhicules Électriques (VE) & Wallbox (61 Appareils)

Les bornes de recharge VE communiquent via **bus de terrain Modbus TCP/RTU (intégration recommandée et privilégiée)**, **serveur WebSocket natif OCPP 1.6-J** ou **API HTTP REST locales**. Elles prennent en charge la modulation dynamique infra-seconde du courant (6 A à 32 A par pas de 0,1 A ou 1 A), la commutation automatique monophasé / triphasé (1,4 kW à 22 kW sur matériel compatible), le suivi du surplus solaire (mode Eco), l'écrêtement du tarif capacitaire flamand et la protection du disjoncteur principal. Point essentiel : l'intégration Modbus TCP permet à GEMS de réguler localement la vitesse de charge sans interrompre la connexion OCPP vers les plateformes externes de facturation CPO ou de remboursement employeur.

### 3.1 ABB Charger

- **Identifiant du Modèle**: `abb_charger`
- **Fabricant / Marque**: ABB
- **Modèles Matériels Compatibles**: ABB Terra AC Wallbox (TAC-W7, TAC-W11, TAC-W22 Series)
- **Interface de Communication**: Modbus TCP via Ethernet / Wi-Fi (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W, reg 0x401C), Énergie de session cumulée (kWh, reg 0x401E).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant de charge (A, reg 0x4100, 6 A à 32 A par pas de 1 mA).

#### Rôle Pratique & Automatisation GEMS
Modulation de courant sous la seconde via Modbus TCP : ajuste dynamiquement la charge selon le surplus solaire (mode Éco) et réduit instantanément lors des pointes capacitaires (mode Flandre), en parfaite coexistence avec les plateformes externes de facturation et remboursement.

---

### 3.2 ABL eM4 Single/Twin (SBCx)

- **Identifiant du Modèle**: `abl_em4_charger`
- **Fabricant / Marque**: ABL
- **Modèles Matériels Compatibles**: ABL Wallbox eM4 Single & eM4 Twin (avec contrôleur SBCx interne)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID d'unité : 255 ou 1)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W, reg 0x300D), Énergie totale (kWh, reg 0x300F).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant de charge (A, reg 0x3001, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Contrôle Modbus direct : module le courant sur borne simple ou double prise pour suivre le surplus solaire et respecter les limites capacitaires flamandes sans interrompre la facturation professionnelle.

---

### 3.3 ABL eMH1 / eMH2 / eMH3

- **Identifiant du Modèle**: `abl_emh_charger`
- **Fabricant / Marque**: ABL
- **Modèles Matériels Compatibles**: ABL Wallbox eMH1, eMH2, eMH3 Series (avec RS485-to-Ethernet Bridge)
- **Interface de Communication**: Pont Modbus RTU sur TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie de session (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation du courant de charge (A, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Intègre les bornes ABL eMH existantes et récentes pour offrir une charge asservie au surplus solaire et un écrêtage automatisé des pointes.

---

### 3.4 AUTEL AC MaxiCharger

- **Identifiant du Modèle**: `autel_charger`
- **Fabricant / Marque**: AUTEL
- **Modèles Matériels Compatibles**: Autel MaxiCharger AC Compact / MaxiCharger AC Wallbox (7.4kW, 11kW, 22kW)
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (Port : 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie de session (kWh), État de connexion du véhicule, Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant via SetChargingProfile (6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Charge résidentielle autonome via OCPP natif : adapte la vitesse de charge à l'excédent solaire et suspend la session durant les périodes de pointe tarifaire.

---

### 3.5 Alfen Charger

- **Identifiant du Modèle**: `alfen_charger`
- **Fabricant / Marque**: Alfen
- **Modèles Matériels Compatibles**: Alfen Eve Single Pro-line, Eve Single S-line, Eve Double Pro-line (Direct Modbus TCP)
- **Interface de Communication**: Modbus TCP / licence Active Load Balancing (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie totale (kWh), Courants de charge par phase (A).

#### Consignes Pilotables & Données Écrites par GEMS
Courant max. esclave Modbus (`1210` Float32 IEEE-754 en A avec chien de garde) et commutation de phases par contacteur (`1215`: `1` = Monophasé, `3` = Triphasé).

#### Rôle Pratique & Automatisation GEMS
Intégration Modbus TCP privilégiée au Benelux pour Alfen Eve Single & Double Pro-line : suivi du surplus solaire sous la seconde, protection du disjoncteur principal et commutation automatique 1P/3P.

---

### 3.6 Alpitronic Hypercharger

- **Identifiant du Modèle**: `alpitronic_charger`
- **Fabricant / Marque**: Alpitronic
- **Modèles Matériels Compatibles**: Alpitronic Hypercharger HYC50, HYC150, HYC300, HYC400 Chargeurs Rapides DC
- **Interface de Communication**: Modbus TCP / OCPP 1.6-J (Port par défaut : 502 ou 8887, ID d'unité : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge DC (kW/W), Énergie délivrée cumulée (kWh), État du connecteur.

#### Consignes Pilotables & Données Écrites par GEMS
Limite dynamique de puissance de charge (kW / A consignes).

#### Rôle Pratique & Automatisation GEMS
Limite dynamiquement la puissance de charge rapide DC afin de rester strictement sous la capacité de raccordement du site et les plafonds capacitaires flamands.

---

### 3.7 BMW i Wallbox (Connect/Pro)

- **Identifiant du Modèle**: `bmw_charger`
- **Fabricant / Marque**: BMW
- **Modèles Matériels Compatibles**: BMW i Wallbox Connect, BMW i Wallbox Pro (Modbus TCP / UDP)
- **Interface de Communication**: Modbus TCP via LAN (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge (W), Énergie de session (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Consigne dynamique de courant (A, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Régulation locale du courant sur réseau LAN ; coordonne la charge avec la production solaire domestique et les heures creuses EPEX.

---

### 3.8 Bender Charger

- **Identifiant du Modèle**: `bender_charger`
- **Fabricant / Marque**: Bender
- **Modèles Matériels Compatibles**: Bender CC612, CC613 Contrôleurs de Charge (intégrés dans diverses bornes OEM)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie de session (kWh), État du signal pilote.

#### Consignes Pilotables & Données Écrites par GEMS
Limite HEMSw Bender CC612 / CC613 (`1001` 0,1 A sur FW >= 4.70, repli `1000` 1 A) et commutation dynamique monophasé / triphasé (`1002`).

#### Rôle Pratique & Automatisation GEMS
Pilotage Modbus TCP local direct des contrôleurs de charge Bender CC612/CC613 (OEM EBEE, Compleo, Mennekes) avec modulation au dixième d'ampère et commutation solaire 1P/3P.

---

### 3.9 Blitzpower / Phoenix CharX

- **Identifiant du Modèle**: `blitzpower_charger`
- **Fabricant / Marque**: Blitzpower
- **Modèles Matériels Compatibles**: Blitzpower AC Wallbox Series (Phoenix Contact CHARX architecture)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge (W), Énergie cumulée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation du courant de charge (A, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Régulation rapide par registres Modbus : module les consignes de courant pour la charge au surplus solaire et l'écrêtage des pointes.

---

### 3.10 Delta AC MAX / SLIM / Chargeur Ultra-Rapide

- **Identifiant du Modèle**: `delta_charger`
- **Fabricant / Marque**: Delta
- **Modèles Matériels Compatibles**: Delta AC MAX Basic/Smart (7.4kW/11kW/22kW), Delta SLIM, Chargeurs VE Ultra-Rapides
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie totale (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Consigne de courant de charge (A, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Module la consigne de courant de la wallbox Delta via Modbus TCP ; optimise la vitesse de charge pour absorber la production solaire sans prélever d'électricité coûteuse sur le réseau.

---

### 3.11 EN+ Borne de Recharge VE AC

- **Identifiant du Modèle**: `enplus_charger`
- **Fabricant / Marque**: EN+
- **Modèles Matériels Compatibles**: EN+ Borne de Recharge VE AC Series (Home / Commercial Series)
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (Port : 8887)

#### Données de Télémétrie Lues par GEMS
Puissance de charge (W), Énergie (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation du courant de charge (A, 6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Suivi solaire autonome et écrêtage des pointes via des commandes locales OCPP SetChargingProfile.

---

### 3.12 ETEK EKEPC2-C/S Contrôleur de Charge

- **Identifiant du Modèle**: `etek_charger`
- **Fabricant / Marque**: ETEK
- **Modèles Matériels Compatibles**: ETEK EKEPC2-C / EKEPC2-S Contrôleur de Charge Intelligent (Modbus RTU/TCP)
- **Interface de Communication**: Modbus TCP via passerelle (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge (W), Énergie de session (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant (A, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Écriture directe de registres Modbus ajustant l'intensité de charge en temps réel selon le bilan énergétique du bâtiment.

---

### 3.13 EVBox Elvi / Livo / BusinessLine

- **Identifiant du Modèle**: `evbox_charger`
- **Fabricant / Marque**: EVBox
- **Modèles Matériels Compatibles**: EVBox Elvi, EVBox Livo, EVBox BusinessLine (OCPP 1.6-J)
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (Port : 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie totale délivrée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), État du connecteur.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant via SetChargingProfile (6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Prise en charge OCPP native complète pour EVBox : module dynamiquement le courant par pas de 1 A pour absorber le solaire en toiture et éviter les pénalités capacitaires.

---

### 3.14 Easee Charger

- **Identifiant du Modèle**: `easee_charger`
- **Fabricant / Marque**: Easee
- **Modèles Matériels Compatibles**: Easee Home, Easee Charge (Cloud REST API)
- **Interface de Communication**: Easee Cloud REST API (Authentification par identifiants cloud)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie totale de session (kWh), État de la borne.

#### Consignes Pilotables & Données Écrites par GEMS
Courant dynamique circuit/borne via API Easee (6–32 A), `pause_charging` / `resume_charging` de session et commutation automatique `phaseMode` monophasé / triphasé.

#### Rôle Pratique & Automatisation GEMS
Pilotage intelligent vérifié pour Easee Home, Charge et Charge Lite/Up : module l'intensité, met en pause/reprend proprement la session et bascule automatiquement entre 1 phase et 3 phases.

---

### 3.15 Enovates SingleWallBox

- **Identifiant du Modèle**: `enovates_charger`
- **Fabricant / Marque**: Enovates
- **Modèles Matériels Compatibles**: Enovates SingleWallBox (Modbus TCP)
- **Interface de Communication**: Modbus TCP via LAN (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge (W), Énergie totale (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Consigne dynamique de courant (A, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Contrôle Modbus local direct ; fonctionne en harmonie avec les plateformes de facturation CPO externes pendant que GEMS assure l'équilibrage local et l'écrêtage.

---

### 3.16 Ensto Chago Wallbox / Pro

- **Identifiant du Modèle**: `ensto_charger`
- **Fabricant / Marque**: Ensto
- **Modèles Matériels Compatibles**: Ensto Chago Wallbox, Ensto One, Ensto Pro Series (Modbus TCP)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie totale (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation du courant de charge (A, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Borne résidentielle et tertiaire scandinave haute fiabilité ; ajuste le courant de charge pour respecter le raccordement électrique et capter le surplus solaire.

---

### 3.17 Etrel INCH / sonnenCharger

- **Identifiant du Modèle**: `etrel_charger`
- **Fabricant / Marque**: Etrel
- **Modèles Matériels Compatibles**: Etrel INCH Pro, Etrel INCH Lite, sonnenCharger (Modbus TCP)
- **Interface de Communication**: Modbus TCP via Ethernet (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active (W), Énergie de session (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Consigne dynamique de courant (A, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Régulation locale Modbus TCP ; optimise la charge en coordination avec l'état des batteries domestiques et la production solaire.

---

### 3.18 Fronius Wattpilot (Home / Go)

- **Identifiant du Modèle**: `fronius_wattpilot`
- **Fabricant / Marque**: Fronius
- **Modèles Matériels Compatibles**: Fronius Wattpilot Home (11J/22J), Fronius Wattpilot Go (11J/22J)
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (Port : 8887)

#### Données de Télémétrie Lues par GEMS
Puissance active (W), Énergie (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant (A, 6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Pilote le Wattpilot en mode 100 % sans cloud directement connecté à GEMS ; prend en charge la commutation dynamique monophasé/triphasé et le suivi du surplus solaire.

---

### 3.19 GoodWe HCA Series EV Wallbox (Gen 2)

- **Identifiant du Modèle**: `goodwe_charger`
- **Fabricant / Marque**: GoodWe
- **Modèles Matériels Compatibles**: GoodWe HCA Series EV Wallbox (Gen 2 Modbus TCP)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge (W), Énergie de session (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Consigne de courant de charge (A, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Coordonne les wallbox GoodWe avec les onduleurs hybrides GoodWe ; priorise la charge de la batterie domestique avant de diriger l'excédent vers le véhicule.

---

### 3.20 Hager witty (one / plus / pro / park 2)

- **Identifiant du Modèle**: `hager_charger`
- **Fabricant / Marque**: Hager
- **Modèles Matériels Compatibles**: Hager witty, witty one, witty plus, witty pro, witty park 2 (OCPP 1.6-J)
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (Port : 8887)

#### Données de Télémétrie Lues par GEMS
Puissance active (W), Énergie de session (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant (A, 6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Gestion résidentielle sans cloud des bornes Hager witty avec suivi de l'excédent solaire et écrêtage du tarif capacitaire flamand.

---

### 3.21 Huawei FusionCharge (SCharger-7KS / 22KT)

- **Identifiant du Modèle**: `huawei_scharger`
- **Fabricant / Marque**: Huawei
- **Modèles Matériels Compatibles**: Huawei FusionCharge AC Wallbox (SCharger-7KS Monophasé, SCharger-22KT Triphasé)
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (Port : 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie de session (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), État du câble.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant via SetChargingProfile (6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Pilotage local direct de la borne Huawei FusionCharge sans cloud FusionSolar requis : se coordonne parfaitement avec les onduleurs Huawei SUN2000 et batteries LUNA2000 pour charger à 100 % à l'énergie solaire.

---

### 3.22 KEBA KeContact P30/P40

- **Identifiant du Modèle**: `keba_charger`
- **Fabricant / Marque**: KEBA
- **Modèles Matériels Compatibles**: KEBA KeContact P30 (c-series, x-series), KeContact P40 Series (Modbus TCP / UDP)
- **Interface de Communication**: Modbus TCP via LAN (Port par défaut : 502, ID d'unité : 255)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W, reg 1020), Énergie totale (kWh, reg 1036).

#### Consignes Pilotables & Données Écrites par GEMS
Courant de charge en milliampères (`5004`), autorisation (`5014`) et commutation de phases KeContact S10 (`5050=3`, `5052=0/1`) sur KEBA KeContact P30 séries x/c & P40.

#### Rôle Pratique & Automatisation GEMS
Contrôle Modbus TCP haute précision au milliampère (1 mA) et commutation de phases 1P/3P pour bornes KEBA KeContact P30 et P40.

---

### 3.23 Mennekes AMTRON (4You / 4Business / ACU / AMEDIO)

- **Identifiant du Modèle**: `mennekes_ocpp`
- **Fabricant / Marque**: Mennekes
- **Modèles Matériels Compatibles**: Mennekes AMTRON 4You, AMTRON 4Business, AMTRON Professional, AMEDIO (OCPP 1.6-J)
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (Port : 8887)

#### Données de Télémétrie Lues par GEMS
Puissance active (W), Énergie totale (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant via SetChargingProfile (6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Pilotage OCPP universel des gammes modernes Mennekes ; permet la charge 100 % solaire et la prévention des pointes capacitaires flamandes.

---

### 3.24 Mennekes AMTRON (Xtra / Premium / HCC3 Modbus)

- **Identifiant du Modèle**: `mennekes_modbus`
- **Fabricant / Marque**: Mennekes
- **Modèles Matériels Compatibles**: Mennekes AMTRON Xtra, AMTRON Premium, HCC3 Controller Series (Modbus TCP)
- **Interface de Communication**: Modbus TCP via LAN (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie cumulée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant de charge (A, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Contrôle Modbus local direct pour bornes Mennekes premium ; élimine toute latence cloud pour un écrêtage instantané des pointes.

---

### 3.25 Mercedes-Benz Wallbox

- **Identifiant du Modèle**: `mercedes_wallbox`
- **Fabricant / Marque**: Mercedes-Benz
- **Modèles Matériels Compatibles**: Mercedes-Benz Wallbox (Home AC Charger, jusqu'à 22kW)
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (Port : 8887)

#### Données de Télémétrie Lues par GEMS
Puissance active (W), Énergie (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation du courant de charge (A, 6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Recharge domestique autonome pour Mercedes-Benz Wallbox ; s'intègre directement dans l'équilibrage dynamique de charge GEMS.

---

### 3.26 NRGkick (Gen 2)

- **Identifiant du Modèle**: `nrgkick_gen2`
- **Fabricant / Marque**: NRGkick
- **Modèles Matériels Compatibles**: NRGkick Gen 2 Chargeur VE Intelligent Mobile & Mural (Local Modbus TCP / Wi-Fi)
- **Interface de Communication**: Modbus TCP via Wi-Fi local (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie délivrée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation du courant de charge (A, 6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Régulation Modbus TCP locale pour chargeurs mobiles/muraux NRGkick ; ajuste automatiquement la consigne de courant selon le surplus solaire.

---

### 3.27 OCPP Charger

- **Identifiant du Modèle**: `ocpp_charger`
- **Fabricant / Marque**: Générique
- **Modèles Matériels Compatibles**: Universelle Générique OCPP 1.6-J Borne de Recharge VE Intelligente (Toute borne compatible OCPP 1.6-J)
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (`ws://<EMS-IP>:8887/<ChargePointID>` ou `ws://<EMS-IP>:8080/api/ocpp/<ChargePointID>`)

#### Données de Télémétrie Lues par GEMS
Puissance active (W), Énergie délivrée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), État du connecteur et de la transaction.

#### Consignes Pilotables & Données Écrites par GEMS
Profil standardisé OCPP 1.6-J SetChargingProfile (consignes de courant : pause 0 A et 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Système central agnostique : prend en charge des centaines de bornes résidentielles et tertiaires conformes OCPP 1.6-J et applique des profils de charge dynamiques selon la stratégie GEMS.

---

### 3.28 Peblar Borne de Recharge VE (Home / Business / Plus)

- **Identifiant du Modèle**: `peblar_charger`
- **Fabricant / Marque**: Peblar
- **Modèles Matériels Compatibles**: Peblar Home, Peblar Business, Peblar Plus (Modbus TCP Direct)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie de session cumulée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Consigne dynamique de courant (A, 6 A à 32 A par pas de 0,1 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Wallbox d'ingénierie néerlandaise : permet à GEMS d'ajuster le courant sous la seconde en Modbus TCP tout en maintenant la refacturation professionnelle split-billing en parallèle.

---

### 3.29 Phoenix Contact Charx Charger

- **Identifiant du Modèle**: `phoenix_charger`
- **Fabricant / Marque**: Phoenix Contact
- **Modèles Matériels Compatibles**: Phoenix Contact CHARX SEC / EV-CC-AC1-M3 Series (Modbus TCP)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge (W), Énergie totale de session (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Limite de courant de charge Modbus et registre/bobine d'autorisation sur Phoenix Contact CHARX SEC-3000 / EV-CC.

#### Rôle Pratique & Automatisation GEMS
Équilibrage de charge industriel local en Modbus TCP et recharge au surplus solaire pour contrôleurs Phoenix Contact CHARX.

---

### 3.30 Phoenix Contact EV-CC / CHARX (Modbus TCP)

- **Identifiant du Modèle**: `phoenix_contact_evcc`
- **Fabricant / Marque**: Phoenix Contact
- **Modèles Matériels Compatibles**: Phoenix Contact EV-CC-AC1-M3 / CHARX Control Modular (Modbus TCP)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie totale (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant (A, 6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Écritures directes de registres Modbus pour moduler l'intensité de charge aux fins d'écrêtage et de suivi solaire.

---

### 3.31 Borne CPO Externe (OCPP 1.6-J)

- **Identifiant du Modèle**: `generic_cpo_ocpp`
- **Fabricant / Marque**: OCPP Générique
- **Modèles Matériels Compatibles**: AC Wallbox Series compatible OCPP 1.6-J et remboursement CPO externe
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (`ws://<EMS-IP>:8080/api/ocpp/<ChargePointID>`)

#### Données de Télémétrie Lues par GEMS
Puissance active (W), Énergie délivrée (kWh), Courants et tensions triphasés.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant (A, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Recharge intelligente locale et arbitrage de charge via proxy OCPP transparent avec les plateformes de facturation CPO externes selon le surplus solaire et les limites du disjoncteur.

---

### 3.32 Porsche Wallbox / Mobile Charger Connect

- **Identifiant du Modèle**: `porsche_wallbox`
- **Fabricant / Marque**: Porsche
- **Modèles Matériels Compatibles**: Porsche Mobile Charger Connect, Porsche Wallbox (OCPP 1.6-J)
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (Port : 8887)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie délivrée (kWh), Courants et tensions triphasés.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant (A, 6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Connecte directement les bornes Porsche à GEMS sans abonnement et applique strictement les plafonds capacitaires flamands.

---

### 3.33 RAEDIAN Gemini AC Wallbox

- **Identifiant du Modèle**: `raedian_gemini`
- **Fabricant / Marque**: RAEDIAN
- **Modèles Matériels Compatibles**: RAEDIAN Gemini Borne AC Double Prise Tertiaire & Flotte (Jusqu'à 2x 22kW, 44kW total)
- **Interface de Communication**: Modbus TCP via LAN (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active combinée (W), Puissance de charge individuelle Prise 1 & Prise 2 (W), Énergie par prise (kWh), Courants triphasés individuels pour Prise 1 (L1, L2, L3) et Prise 2 (L1, L2, L3 en A), état du connecteur par prise.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique continue du courant (plage totale de 0 A à 64 A répartie dynamiquement entre Prise 1 & Prise 2), Mode individuel par prise (Eco / Rapide / Arrêt).

#### Rôle Pratique & Automatisation GEMS
Gestion dynamique avancée double prise : répartit simultanément la puissance entre deux véhicules, ajuste le courant combiné de 0 A à 64 A et protège les fusibles principaux tout en maximisant l'autoconsommation solaire.

---

### 3.34 RAEDIAN NEO / NEX AC Wallbox

- **Identifiant du Modèle**: `raedian_charger`
- **Fabricant / Marque**: RAEDIAN
- **Modèles Matériels Compatibles**: RAEDIAN NEO Series, RAEDIAN NEX Series AC Smart Wallbox (7.4kW, 11kW, 22kW)
- **Interface de Communication**: Modbus TCP via LAN ou Wi-Fi (Port par défaut : 502, ID esclave : 1 ou 2)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge en temps réel (W), Énergie de session (kWh), Courants de charge triphasés (L1, L2, L3 en A), Tensions de charge triphasées (L1, L2, L3 en V), État de la prise & codes d'erreur.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique continue du courant (A, 6 A à 32 A par pas de 0,1 A), Pause & reprise automatiques de session.

#### Rôle Pratique & Automatisation GEMS
Intégration phare Modbus TCP de référence : interroge les tensions et courants triphasés en une seule requête groupée ; la modulation sous la seconde réagit instantanément au surplus solaire et aux pointes capacitaires flamandes.

---

### 3.35 SMA Borne de Recharge VE (7.4 / 22 / eCharger)

- **Identifiant du Modèle**: `sma_evcharger`
- **Fabricant / Marque**: SMA
- **Modèles Matériels Compatibles**: SMA Borne de Recharge VE 7.4, SMA Borne de Recharge VE 22
- **Interface de Communication**: API HTTP REST locale (Port par défaut : 80 / 443)

#### Données de Télémétrie Lues par GEMS
Puissance active (W), Énergie cumulée (kWh), Courants triphasés (L1, L2, L3 en A).

#### Consignes Pilotables & Données Écrites par GEMS
Lecture seule (Télémétrie uniquement — la borne SMA Borne de Recharge VE requiert SEMP/SHM2 pour le pilotage actif).

#### Rôle Pratique & Automatisation GEMS
Supervise en temps réel la puissance appelée et l'énergie de session du SMA EV Charger pour le bilan énergétique global du foyer.

---

### 3.36 Schneider Electric EVlink (Wallbox / Pro AC)

- **Identifiant du Modèle**: `schneider_evlink`
- **Fabricant / Marque**: Schneider Electric
- **Modèles Matériels Compatibles**: Schneider Electric EVlink Wallbox, EVlink Pro AC, EVlink Smart Wallbox (OCPP 1.6-J)
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (Port : 8887)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant via SetChargingProfile (6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Régulation native des consignes OCPP assurant une charge fluide au surplus solaire et la prévention des pointes capacitaires.

---

### 3.37 Siemens VersiCharge GEN3 Wallbox

- **Identifiant du Modèle**: `siemens_versicharge`
- **Fabricant / Marque**: Siemens
- **Modèles Matériels Compatibles**: Siemens VersiCharge GEN3 AC Smart Wallbox (Commercial & Residential 7.4kW - 22kW)
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (Port : 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Données de Télémétrie Lues par GEMS
Puissance en temps réel (W), Énergie cumulée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant (A, 6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Relie la borne Siemens VersiCharge GEN3 à GEMS via OCPP pour exécuter l'écrêtage flamand et le suivi du surplus solaire.

---

### 3.38 Sigenergy SigenStor EVAC / EVDC Charger

- **Identifiant du Modèle**: `sigenergy_evac`
- **Fabricant / Marque**: Sigenergy
- **Modèles Matériels Compatibles**: Sigenergy Sigen EVAC AC Wallbox, Sigen EVDC Chargeur Rapide Bidirectionnel
- **Interface de Communication**: Modbus TCP via Sigen Gateway (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge (W), Énergie de session (kWh), Courants et tensions triphasés.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant (A, 6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Contrôle Modbus direct de la charge VE Sigen en parfaite coordination avec la batterie SigenStor pour absorber l'excédent photovoltaïque.

---

### 3.39 SmartEVSE v2 / v3 (HTTP / Modbus)

- **Identifiant du Modèle**: `smartevse_charger`
- **Fabricant / Marque**: SmartEVSE
- **Modèles Matériels Compatibles**: SmartEVSE v2, SmartEVSE v3 Contrôleur de Charge VE Open-Source
- **Interface de Communication**: API HTTP REST locale / Modbus TCP (Port par défaut : 80, REST endpoint: /add)

#### Données de Télémétrie Lues par GEMS
Puissance active (W), Énergie totale (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), État du signal pilote.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant (A, 6 A à 32 A via /add?current=X), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Modulation locale des consignes via API REST permettant aux contrôleurs open-source de charger à 100 % au surplus solaire sans compte cloud.

---

### 3.40 SolarEdge Borne de Recharge VE

- **Identifiant du Modèle**: `solaredge_evse`
- **Fabricant / Marque**: SolarEdge
- **Modèles Matériels Compatibles**: SolarEdge Home Borne de Recharge VE (Onduleur-chargeur intégré & borne AC autonome)
- **Interface de Communication**: Modbus TCP via onduleur SolarEdge ou module autonome (Port par défaut : 502 / 1502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie cumulée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Consigne dynamique de courant (A, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Synchronise la vitesse de charge avec la production de l'onduleur SolarEdge tout en protégeant le disjoncteur principal du logement.

---

### 3.41 Veton / Phoenix CharX

- **Identifiant du Modèle**: `veton_charger`
- **Fabricant / Marque**: Veton
- **Modèles Matériels Compatibles**: Veton One, Veton Two, Veton Wallbox Series (Bornes Design Haut de Gamme)
- **Interface de Communication**: Modbus TCP via contrôleur Phoenix Contact CHARX interne (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie de session (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant de charge (A, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Écriture directe de registres Modbus TCP assurant une charge au surplus solaire fluide et un écrêtage précis sur les bornes architecturales Veton.

---

### 3.42 Volkswagen / Elli / Skoda / SEAT (ID. Charger Connect / Pro)

- **Identifiant du Modèle**: `elli_charger`
- **Fabricant / Marque**: Volkswagen / Elli
- **Modèles Matériels Compatibles**: Volkswagen ID. Charger Connect / Pro, Elli Charger, Skoda iV Charger, SEAT Charger
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (Port : 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie totale de session (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), État du câble.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant via SetChargingProfile (6 A à 32 A), Commutation de phases (1P / 3P).

#### Rôle Pratique & Automatisation GEMS
Intégration directe au serveur OCPP natif : permet aux bornes ID. Charger du groupe VW de charger au pur surplus solaire et d'éviter les pointes capacitaires sans abonnement cloud constructeur.

---

### 3.43 Wallbox Pulsar/Commander

- **Identifiant du Modèle**: `wallbox_charger`
- **Fabricant / Marque**: Wallbox
- **Modèles Matériels Compatibles**: Wallbox Pulsar Plus, Pulsar Max, Commander 2, Copper SB (Wallbox Cloud REST API)
- **Interface de Communication**: Cloud REST API (Authentification par identifiants Wallbox Cloud)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie totale (kWh), État de la borne.

#### Consignes Pilotables & Données Écrites par GEMS
Limite dynamique d'intensité (6–32 A) via API Wallbox `PUT /v2/charger/{id}` et `POST /v3/chargers/{id}/remote-action` (`action: 1` Reprise / `2` Pause).

#### Rôle Pratique & Automatisation GEMS
Modulation de courant vérifiée en boucle fermée et mise en pause/reprise automatique de session pour Wallbox Pulsar Plus, Pulsar Max, Copper SB et Commander 2.

---

### 3.44 Webasto Next Charger

- **Identifiant du Modèle**: `webasto_charger`
- **Fabricant / Marque**: Webasto
- **Modèles Matériels Compatibles**: Webasto Next, Webasto Live, Webasto Unite (Modbus TCP Direct)
- **Interface de Communication**: Modbus TCP via LAN ou Wi-Fi (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W, reg 5000), Énergie fournie sur la session (kWh, reg 5002).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant de charge (A, reg 5004, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Contrôle Modbus direct : réduit le courant de la borne Webasto en quelques millisecondes pour protéger les fusibles et éviter les pointes capacitaires tout en conservant la facturation professionnelle.

---

### 3.45 Zaptec Pro/Go

- **Identifiant du Modèle**: `zaptec_charger`
- **Fabricant / Marque**: Zaptec
- **Modèles Matériels Compatibles**: Zaptec Go, Zaptec Pro (Zaptec Cloud REST API)
- **Interface de Communication**: Cloud REST API (Authentification OAuth2 Zaptec)

#### Données de Télémétrie Lues par GEMS
Puissance active (W), Énergie cumulée (kWh), État de la session.

#### Consignes Pilotables & Données Écrites par GEMS
API OAuth2 Zaptec `/api/chargers/{id}/update` (`maxChargeCurrent` 0,1 A, `maxChargePhases` 1/3, Go 2 `threeToOnePhaseSwitchCurrent`) et `/sendCommand/506` (Pause) & `507` (Reprise).

#### Rôle Pratique & Automatisation GEMS
Pilotage de précision vérifié pour bornes Zaptec Go, Go 2 et Pro avec décodage énergétique OCMF, pause/reprise et commutation solaire 1P/3P.

---

### 3.46 go-e Charger Gemini / HOMEfix / PRO

- **Identifiant du Modèle**: `goe_charger`
- **Fabricant / Marque**: go-e
- **Modèles Matériels Compatibles**: go-e Charger Gemini, Gemini flex, HOMEfix, HOME+ (Local HTTP API v2)
- **Interface de Communication**: API HTTP REST locale v2 (Port par défaut : 80, JSON endpoints: /api/status, /api/set)

#### Données de Télémétrie Lues par GEMS
Puissance de charge (W), Énergie de session (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), État d'autorisation.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation du courant en RAM volatile (6 A à 32 A via `/api/set?amx=X` + pause/reprise `frc` — zéro usure flash NVS), commutation de phases (1P / 3P via `/api/set?psm=X`).

#### Rôle Pratique & Automatisation GEMS
API HTTP locale haute vitesse : permet à GEMS de basculer dynamiquement entre monophasé (dès 1,4 kW solaire) et triphasé (jusqu'à 22 kW) et de délester en quelques millisecondes lors de pointes domestiques.

---

### 3.47 Passerelle Locale EVSE REST Générique

- **Identifiant du Modèle**: `generic_rest_evse`
- **Fabricant / Marque**: REST Générique
- **Modèles Matériels Compatibles**: Contrôleurs EVSE REST Locaux Ouverts et Passerelles de Charge
- **Interface de Communication**: API HTTP REST locale (Port par défaut : 80, REST endpoint: /api/v1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie de session cumulée (kWh), État de la borne de recharge.

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant de charge (A, 6 A à 32 A).

#### Rôle Pratique & Automatisation GEMS
Orchestration distribuée multi-bornes et gestion dynamique de charge équilibrant la puissance totale de la flotte par rapport aux limites du raccordement.

---

### 3.48 Kempower Infrastructure de Charge Rapide

- **Identifiant du Modèle**: `kempower_charger`
- **Fabricant / Marque**: Kempower
- **Modèles Matériels Compatibles**: Kempower C-Series et S-Series Satellites de Charge Rapide & Unités de Puissance
- **Interface de Communication**: Modbus TCP via Kempower Central Controller (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie de session (kWh), Courants de charge triphasés (L1, L2, L3 en A).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation locale OCPP 1.6-J `SetChargingProfile` puissance/courant avec repli automatique sur le registre Modbus TCP `200` (`0,1 A`).

#### Rôle Pratique & Automatisation GEMS
Gestion dynamique vérifiée de charge rapide tertiaire et de flotte pour bornes Kempower Satellite et Station.

---

### 3.49 MyEnergi Zappi Borne de Recharge VE

- **Identifiant du Modèle**: `myenergi_zappi`
- **Fabricant / Marque**: MyEnergi
- **Modèles Matériels Compatibles**: MyEnergi Zappi v2 et v2.1 avec Hub / built-in Wi-Fi
- **Interface de Communication**: API HTTP REST / CGI locale (Port par défaut : 80, Endpoint: /cgi-jstatus)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie ajoutée durant la session (kWh), État de charge, mode (Fast, Eco, Eco+).

#### Consignes Pilotables & Données Écrites par GEMS
Commandes CGI HTTP Digest authentifiées (`/cgi-zappi-mode-Z{sno}-{mode}-...`) avec suivi de redirection ASN, basculant dynamiquement entre les modes Stop, Eco+, Eco et Fast.

#### Rôle Pratique & Automatisation GEMS
Pilotage local/hub vérifié pour bornes myenergi Zappi v2/v2.1 avec télémétrie triphasée complète, lecture du mode de phase et modulation active de session.

---

### 3.50 SolaX Borne de Recharge VE Intelligente

- **Identifiant du Modèle**: `solax_evcharger`
- **Fabricant / Marque**: SolaX
- **Modèles Matériels Compatibles**: SolaX Borne de Recharge VE Intelligente X1-EVC / X3-EVC (7.2kW – 22kW)
- **Interface de Communication**: Modbus TCP via Wi-Fi/Ethernet (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie de session cumulée (kWh), Courants de phase (L1, L2, L3 en A).

#### Consignes Pilotables & Données Écrites par GEMS
Courant max. SolaX X1/X3-EVC (`0x0628` par pas de `0,01 A`), mode distant (`0x060D=1`), Arrêt/Marche (`0x0627`) et commutation monophasé / triphasé (`0xA105`).

#### Rôle Pratique & Automatisation GEMS
Contrôle local Modbus TCP/RTU vérifié en boucle fermée pour bornes SolaX Smart EV Charger avec suivi solaire précis à 10 mA et commutation de contacteur 1P/3P.

---

### 3.51 Teltonika TeltoCharge

- **Identifiant du Modèle**: `teltonika_teltocharge`
- **Fabricant / Marque**: Teltonika Energy
- **Modèles Matériels Compatibles**: Teltonika TeltoCharge EVC1 Series (7.4kW – 22kW)
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (Port : 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie de session cumulée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions (V).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant de charge (A, 6 A à 32 A via SetChargingProfile).

#### Rôle Pratique & Automatisation GEMS
Intégration OCPP native pour installations résidentielles européennes ; optimise la recharge face aux pointes capacitaires flamandes et aux tarifs spot EPEX.

---

### 3.52 Volt Time Source Borne de Recharge VE

- **Identifiant du Modèle**: `volttime_source`
- **Fabricant / Marque**: Volt Time
- **Modèles Matériels Compatibles**: Volt Time Source et Source Pro Bornes de Recharge Intelligentes
- **Interface de Communication**: Modbus TCP / OCPP 1.6-J (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie de session cumulée (kWh), Courants de phase (L1, L2, L3 en A).

#### Consignes Pilotables & Données Écrites par GEMS
Limite d'intensité dynamique & pause/reprise via API v3 Volt Time / Plugchoice avec repli sur registre Modbus TCP local `1020`.

#### Rôle Pratique & Automatisation GEMS
Équilibrage dynamique actif vérifié et modulation au surplus solaire pour bornes VE Volt Time Source et Plugchoice.

---

### 3.53 Wallbox Pulsar Plus / Commander (OCPP)

- **Identifiant du Modèle**: `wallbox_ocpp`
- **Fabricant / Marque**: Wallbox
- **Modèles Matériels Compatibles**: Wallbox Pulsar Plus, Pulsar Max, Commander 2 / 2s
- **Interface de Communication**: Serveur WebSocket OCPP 1.6-J natif (Port : 8887, ws://<EMS-IP>:8887/<ChargePointID>)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie de session cumulée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions (V).

#### Consignes Pilotables & Données Écrites par GEMS
Modulation dynamique du courant de charge (A, 6 A à 32 A via SetChargingProfile).

#### Rôle Pratique & Automatisation GEMS
Intégration OCPP locale directe sans cloud pour matériel Wallbox ; supprime toute dépendance et latence cloud pour une automatisation résidentielle réactive.

---

### 3.54 cFos Power Brain Wallbox / Solar

- **Identifiant du Modèle**: `cfos_powerbrain`
- **Fabricant / Marque**: cFos
- **Modèles Matériels Compatibles**: cFos Power Brain Wallbox 11kW / 22kW, cFos Power Brain Solar (1P/3P Relay)
- **Interface de Communication**: Modbus TCP (Port par défaut : 4701, EVSE ID d'unité : 1, Registres Holding `8058`–`8094`)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie prélevée cumulée (kWh), Courants de charge triphasés (0.1 A), État du relais de phases actif.

#### Consignes Pilotables & Données Écrites par GEMS
Limite de courant de charge à 0,1 A (`8093`), autorisation de charge (`8094`) et commutation de contacteur monophasé / triphasé (`8087`).

#### Rôle Pratique & Automatisation GEMS
Suivi haute précision du surplus solaire au dixième d'ampère (0,1 A), protection du disjoncteur principal et commutation automatique de contacteur 1P/3P.

---

### 3.55 FoxESS Borne de Recharge VE A7300 / A011K / A022K

- **Identifiant du Modèle**: `foxess_evcharger`
- **Fabricant / Marque**: FoxESS
- **Modèles Matériels Compatibles**: FoxESS A7300 (7.3 kW), A011K (11 kW), et A022K (22 kW) Bornes AC Intelligentes
- **Interface de Communication**: Modbus TCP / RTU (Port par défaut : 502, ID d'unité : 1, Holding `0x1003`–`0x1017` & `0x3002`)

#### Données de Télémétrie Lues par GEMS
Puissance de charge (W), Énergie cumulée (kWh), Courants triphasés (A), Tensions triphasées (V), État de la borne.

#### Consignes Pilotables & Données Écrites par GEMS
Limite de puissance par pas de 0,1 kW (`0x3002` : plage monophasée `1,4–4,1 kW`, plage triphasée `4,2–22,0 kW`, `0` Pause) & commutation auto de phases (`0x300A`).

#### Rôle Pratique & Automatisation GEMS
Complément idéal des onduleurs hybrides FoxESS offrant une modulation fine du surplus solaire et une commutation automatique 1P/3P.

---

### 3.56 Heidelberg Energy Control / Amperfied connect.solar

- **Identifiant du Modèle**: `heidelberg_ampere`
- **Fabricant / Marque**: Amperfied (Heidelberg)
- **Modèles Matériels Compatibles**: Heidelberg Energy Control, Amperfied Wallbox connect.home, connect.solar, connect.business
- **Interface de Communication**: Modbus TCP (Port : 502, ID d'unité : 255) & Modbus RTU RS485 (19200 8E1, ID d'unité : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie totale (kWh), Courants triphasés (0.1 A), Tensions triphasées (V), État véhicule CEI, nombre de phases actives.

#### Consignes Pilotables & Données Écrites par GEMS
Limite de courant de charge à 0,1 A (Holding `261`), gestion veille/verrouillage (`258`–`259`) et commutation monophasé / triphasé (`501` sur `connect.solar`).

#### Rôle Pratique & Automatisation GEMS
Modulation de courant à 0,1 A sous la seconde pour l'écrêtage capacitaire flamand et la recharge solaire fluide 1P/3P.

---

### 3.57 openWB Pro / openWB series2 (HTTP & Modbus)

- **Identifiant du Modèle**: `openwb_pro`
- **Fabricant / Marque**: openWB
- **Modèles Matériels Compatibles**: openWB Pro, openWB series2 standard+, custom, duo (2.0 Modbus TCP & Pro HTTP)
- **Interface de Communication**: API HTTP JSON/Form locale (`/connect.php`) et openWB 2.0 Modbus TCP (Port : 1502, ID d'unité : 1)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie prélevée (kWh), Courants triphasés (A), Tensions triphasées (V), État branchement & charge, phases actives.

#### Consignes Pilotables & Données Écrites par GEMS
Limite dynamique de courant à 0,1 A / 0,01 A (`ampere` / Holding `10171`) et commutation automatique de contacteur monophasé / triphasé (`phasetarget` / `10180`).

#### Rôle Pratique & Automatisation GEMS
Suivi ultra-fin du surplus solaire (10–100 mA) et commutation matérielle de phases 1P/3P sans aucune dépendance au cloud.

---

### 3.58 Sungrow AC011E-01 / AC22E-01 Borne de Recharge VE

- **Identifiant du Modèle**: `sungrow_evcharger`
- **Fabricant / Marque**: Sungrow
- **Modèles Matériels Compatibles**: Sungrow AC011E-01 (11 kW) et AC22E-01 (22 kW) Bornes Intelligentes Triphasées
- **Interface de Communication**: Modbus TCP / RTU (Port par défaut : 502, ID d'unité par défaut : 248, Input `21269`–`21316` & Holding `21202`–`21211`)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Énergie cumulée (kWh), Courants triphasés (0.1 A), Tensions triphasées (0.1 V), État de commutation de phases.

#### Consignes Pilotables & Données Écrites par GEMS
Limite de courant de sortie à 0,1 A (`21202`), commande Marche/Arrêt (`21211`) et commutation monophasé / triphasé (`21203`).

#### Rôle Pratique & Automatisation GEMS
Partenaire Modbus local direct des installations Sungrow SH/SG avec régulation du surplus à 0,1 A et commutation 1P/3P.

---

### 3.59 Tinkerforge WARP Charger 2 / 3 (Smart & Pro)

- **Identifiant du Modèle**: `warp_charger`
- **Fabricant / Marque**: Tinkerforge
- **Modèles Matériels Compatibles**: Tinkerforge WARP Charger 2 Smart/Pro & WARP Charger 3 Smart/Pro (11 kW / 22 kW)
- **Interface de Communication**: API HTTP REST locale (`/evse/state`, `/meter/values`, `/evse/external_current`, `/power_manager/external_control`)

#### Données de Télémétrie Lues par GEMS
Puissance active de charge (W), Compteur d'énergie absolue (kWh), Courants triphasés (A), Tensions triphasées (V), État CEI 61851, état du contacteur 1P/3P.

#### Consignes Pilotables & Données Écrites par GEMS
Limite externe de courant à résolution 1 mA (`6000–32000 mA`, `0` Pause) et commutation de contacteur monophasé / triphasé WARP3 (`phases_wanted`).

#### Rôle Pratique & Automatisation GEMS
Intégration industrielle à interface ouverte offrant un suivi solaire précis à 1 mA et un pilotage automatisé des contacteurs 1P/3P.

---

### 3.60 Vestel EVC04 Home Smart / Mobility

- **Identifiant du Modèle**: `vestel_evc04`
- **Fabricant / Marque**: Vestel
- **Modèles Matériels Compatibles**: Vestel EVC04-AC11 / EVC04-AC22 Home Smart, Mobility, et Bornes OEM Compatibles
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID d'unité par défaut : 255, Lifebit Watchdog `6000=1`)

#### Données de Télémétrie Lues par GEMS
Puissance active totale (W), Énergie cumulée (kWh), Courants triphasés (mA), Tensions triphasées (V), État de la borne & du câble.

#### Consignes Pilotables & Données Écrites par GEMS
Limite dynamique de courant de charge (`5004`, `0` ou `6–32 A`), chien de garde fail-safe (`6000`) et commutation monophasé / triphasé (`405`).

#### Rôle Pratique & Automatisation GEMS
Équilibrage de charge local fiable en Modbus TCP, protection du disjoncteur principal et commutation solaire 1P/3P pour bornes Vestel EVC04.

---

### 3.61 Hardy Barth cPµ1 / cPµ2 (Salia / eCB1) Wallbox

- **Identifiant du Modèle**: `hardy_barth_charger`
- **Fabricant / Marque**: Hardy Barth
- **Modèles Matériels Compatibles**: Hardy Barth cPµ1 (eCB1), cPµ2 (Salia PLCC), Wallbox cPH1 / cPH2 / cPP2 Series
- **Interface de Communication**: API HTTP REST locale (Port par défaut : 80, `/api/v1/chargecontrols/1` & `/api/secc`)

#### Données de Télémétrie Lues par GEMS
Puissance de charge en temps réel (W), Énergie de session cumulée (kWh), Courants de charge triphasés (`L1, L2, L3` en A) & Voltages (`L1, L2, L3` en V).

#### Consignes Pilotables & Données Écrites par GEMS
Limite dynamique locale REST de courant (`PUT /api/v1/chargecontrols/1/mode` avec `manualmodeamp=6..32 A` ou `mode=stop` ; repli Salia `PUT /api/secc` `grid_current_limit`).

#### Rôle Pratique & Automatisation GEMS
Modulation locale du courant 100 % sans cloud pour bornes Hardy Barth Salia et eCB1 : adapte la vitesse de charge VE au surplus solaire et déleste lors des pointes disjoncteur ou capacitaires.

---

### 3.62 Borne VE Modbus Personnalisée (Profil Registres UI)

- **Identifiant du Modèle**: `custom_modbus_charger`
- **Fabricant / Marque**: Custom Modbus
- **Modèles Matériels Compatibles**: Toute borne de recharge VE AC ou contrôleur de charge Modbus TCP ou RS-485 RTU configuré via l'Éditeur UI de Profils Registres certifié
- **Interface de Communication**: Modbus TCP / RTU (Port configurable ou bus `/dev/serial/by-id/*`, ID d'unité, lectures `FC03`/`FC04` & écritures optionnelles `FC06`/`FC16`)

#### Données de Télémétrie Lues par GEMS
Puissance de charge (W), Énergie de session cumulée (kWh), État prise/session et courants/tensions triphasés mappés via l'UI (`int16`/`uint16`/`int32`/`uint32`/`float32` + SunSpec SF).

#### Consignes Pilotables & Données Écrites par GEMS
Limite dynamique optionnelle du courant de charge (`ev_max_current_a`, bornée aux limites du disjoncteur), battement Watchdog périodique et courant de repli sécurisé à l'arrêt.

#### Rôle Pratique & Automatisation GEMS
Intègre des bornes VE Modbus hors catalogue dans l'équilibrage dynamique infra-seconde GEMS, la charge solaire, la planification d'échéance de départ (`+kWh avant HH:MM`) et la protection des fusibles principaux.

---

## 4. Compteurs Intelligents & Analyseurs de Réseau (40 Appareils)

Les compteurs de tête constituent la base télémétrique de toute la boucle de régulation GEMS. Ils mesurent en continu la puissance nette prélevée/injectée, les courants par phase (L1, L2, L3 en A), les tensions simples/composées (L1, L2, L3 en V), les index d'énergie (kWh), le volume de gaz couplé (m³) et le registre officiel flamand de pointe quart-horaire (W). Cette lecture infra-seconde garantit un délestage instantané, le respect du zéro-injection et la protection des fusibles principaux.

### 4.1 ABB A43 / A44 / B23 / B24 Meter

- **Identifiant du Modèle**: `abb_meter`
- **Fabricant / Marque**: ABB
- **Modèles Matériels Compatibles**: ABB A43, A44 (Triphasé Direct/CT), B23, B24 (Triphasé Compact) Modbus Meters
- **Interface de Communication**: Modbus RTU via passerelle RS485-vers-Ethernet ou Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active réseau prélevée/injectée (W), Énergie active totale prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), Fréquence (Hz).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Mesure haute précision au point de raccordement ; fournit en continu les courants triphasés au moteur d'équilibrage par phase GEMS pour protéger les fusibles principaux et piloter le calcul quart-horaire flamand.

---

### 4.2 Acrel ADW300 Meter

- **Identifiant du Modèle**: `acrel_adw300`
- **Fabricant / Marque**: Acrel
- **Modèles Matériels Compatibles**: Acrel ADW300 Series Wireless / Ethernet Triphasé Compteur d'Énergie Multifonction
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active totale (W), Énergie prélevée/injectée (kWh), Puissance active par phase (W), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Surveille le raccordement principal ou les tableaux divisionnaires ; informe GEMS des charges exactes par phase pour moduler les bornes VE et protéger les disjoncteurs.

---

### 4.3 B+GE-TECH WS100 / DS100 Meter

- **Identifiant du Modèle**: `bgetech_ws100`
- **Fabricant / Marque**: B+GE-TECH
- **Modèles Matériels Compatibles**: B+GE-TECH WS100, DS100 Series Triphasé DIN-Rail Modbus Compteurs Intelligents
- **Interface de Communication**: Modbus TCP / RTU Gateway (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance prélevée/injectée en temps réel (W), Énergie active totale (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Mesure directe en tête d'installation ; fournit la puissance temps réel pour le suivi solaire VE en boucle fermée et l'écrêtage capacitaire flamand.

---

### 4.4 Carlo Gavazzi EM112 / EM340 / EM540

- **Identifiant du Modèle**: `carlogavazzi_em340`
- **Fabricant / Marque**: Carlo Gavazzi
- **Modèles Matériels Compatibles**: Carlo Gavazzi EM112 (Monophasé), EM340 (Triphasé Direct), EM540 (Ultra-Fast Triphasé) Meters
- **Interface de Communication**: Modbus RTU via passerelle RS485 USB/Ethernet (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active nette (W), kWh totaux prélevés/injectés, Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Compteur de tête ultra-rapide sous la seconde (notamment l'EM540) ; essentiel au délestage réactif instantané des bornes VE lors des pointes domestiques pour protéger le disjoncteur principal.

---

### 4.5 Carlo Gavazzi EM24 (RS485/Ethernet)

- **Identifiant du Modèle**: `carlogavazzi_em24`
- **Fabricant / Marque**: Carlo Gavazzi
- **Modèles Matériels Compatibles**: Carlo Gavazzi EM24 Series Triphasé Compteur d'Énergie (RS485 & Ethernet LAN versions)
- **Interface de Communication**: Modbus TCP / Modbus RTU Gateway (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active totale (W, signée : + prélèvement, - injection), Registres d'énergie cumulée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Compteur de référence dans les installations solaires et VE professionnelles ; fournit une télémétrie déterministe à la seconde pour l'écrêtage et le DLB GEMS.

---

### 4.6 ESPHome DSMR / DLMS Compteur Intelligent

- **Identifiant du Modèle**: `esphome_meter`
- **Fabricant / Marque**: ESPHome
- **Modèles Matériels Compatibles**: ESPHome Compteur Intelligent Gateway (P1 DSMR Reader / DLMS / SML IR Optical Heads on ESP8266/ESP32)
- **Interface de Communication**: API JSON HTTP REST locale (Port par défaut : 80, Endpoint: /sensor/grid_power ou /text_sensor/dsmr)

#### Données de Télémétrie Lues par GEMS
Puissance réseau en temps réel (W), Énergie totale prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), Consommation de gaz (m³).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie REST en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Intègre les lecteurs P1 open-hardware dans GEMS et transmet les télégrammes numériques complets en Wi-Fi sans aucune dépendance cloud.

---

### 4.7 Eastron SDM120 / SDM220 / SDM230 (Compteur Monophasé)

- **Identifiant du Modèle**: `eastron_sdm120_230`
- **Fabricant / Marque**: Eastron
- **Modèles Matériels Compatibles**: Eastron SDM120, SDM220, SDM230 Series Monophasé DIN-Rail Modbus Compteurs Intelligents
- **Interface de Communication**: Modbus RTU via pont RS485-vers-Ethernet ou USB dongle (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active (W), Énergie totale prélevée/injectée (kWh), Courant de phase (A), Tension de ligne (V), Facteur de puissance (cos φ).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Surveille les raccordements monophasés, les circuits dédiés de pompes à chaleur ou les onduleurs PV monophasés au sein de l'analyse de charge GEMS.

---

### 4.8 Eastron SDM630 Compteur Triphasé

- **Identifiant du Modèle**: `eastron_sdm630`
- **Fabricant / Marque**: Eastron
- **Modèles Matériels Compatibles**: Eastron SDM630 Modbus V2 / V3 / MCT Triphasé Compteur d'Énergie Multifonction
- **Interface de Communication**: Modbus RTU via passerelle RS485 ou Modbus TCP (Port par défaut : 502, ID esclave : 1, Débit : 9600)

#### Données de Télémétrie Lues par GEMS
Puissance active totale nette (W, reg 0x0034), Énergie totale prélevée/injectée (kWh), Courants individuels par phase (L1, L2, L3 en A, reg 0x0006), Tensions individuelles par phase (L1, L2, L3 en V, reg 0x0000).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Compteur triphasé largement déployé ; fournit la télémétrie fondamentale pour la gestion du tarif capacitaire flamand, le suivi du déséquilibre de phases et le routage solaire.

---

### 4.9 Eastron SDM72D / SMART X96 Compteur Triphasé

- **Identifiant du Modèle**: `eastron_sdm72_x96`
- **Fabricant / Marque**: Eastron
- **Modèles Matériels Compatibles**: Eastron SDM72D-M / SDM72D-M-2, SDM72DR, SMART X96-1 / X96-5 Compteurs Multifonctions
- **Interface de Communication**: USB-RS485 RTU direct (`/dev/serial/by-id/...`, 9600 8N1) ou Modbus TCP via pont RS485-vers-Ethernet (Port par défaut : 502, ID esclave : 1 ou 2)

#### Données de Télémétrie Lues par GEMS
Puissance active totale (W, registre bidirectionnel `0x0034`), Énergie active prélevée et injectée (`0x0048` / `0x004A` kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau ou sous-compteur photovoltaïque en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Prend en charge deux rôles via **Rôle de Mesure du Compteur** : (1) **Compteur Principal Réseau (PCC)** pour l'équilibrage dynamique des bornes, ou (2) **Compteur de Production Solaire / PV** (`pv_production`) câblé sur le départ AC d'un onduleur photovoltaïque existant dépourvu de port Modbus/API — mesurant la production solaire en direct (W), les courants par phase et le rendement cumulé (kWh) avec détection automatique du sens de câblage et filtrage de la veille nocturne.

---

### 4.10 Eltako DSZ15DZMOD / DSZ16 Meter

- **Identifiant du Modèle**: `eltako_meter`
- **Fabricant / Marque**: Eltako
- **Modèles Matériels Compatibles**: Eltako DSZ15DZMOD-3x80A, DSZ16 Series Triphasé Modbus Compteurs d'Énergie
- **Interface de Communication**: Modbus RTU via passerelle RS485 (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active (W), Énergie prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Sous-comptage allemand de précision ; fournit en temps réel les courants de phase et les flux prélèvement/injection pour la protection anti-surcharge GEMS.

---

### 4.11 Finder 7M.24 / 7M.38 Meter

- **Identifiant du Modèle**: `finder_7m`
- **Fabricant / Marque**: Finder
- **Modèles Matériels Compatibles**: Finder 7M Series (7M.24 Monophasé, 7M.38 Triphasé Compteurs Modbus Bidirectionnels)
- **Interface de Communication**: Modbus RTU via pont RS485 (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active (W), Énergie active prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Comptage fiable certifié MID ; transmet les grandeurs électriques en direct à GEMS pour la régulation dynamique du courant en boucle fermée.

---

### 4.12 HomeWizard Meter

- **Identifiant du Modèle**: `homewizard_meter`
- **Fabricant / Marque**: HomeWizard
- **Modèles Matériels Compatibles**: HomeWizard Wi-Fi P1 Meter (HWE-P1), HomeWizard Wi-Fi kWh Meter (Monophasé & Triphasé)
- **Interface de Communication**: API HTTP REST locale v1 (Port par défaut : 80, JSON Endpoint: /api/v1/data)

#### Données de Télémétrie Lues par GEMS
Puissance active réseau (W), Énergie totale prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), Consommation du compteur de gaz couplé (m³).

#### Consignes Pilotables & Données Écrites par GEMS
API REST locale en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Lecteur P1 Wi-Fi prêt à l'emploi : permet à GEMS d'interroger les télégrammes du compteur numérique toutes les 1 à 2 secondes sans câblage, avec suivi complet des pointes capacitaires.

---

### 4.13 Homey Energy Dongle (P1)

- **Identifiant du Modèle**: `homey_p1`
- **Fabricant / Marque**: Homey
- **Modèles Matériels Compatibles**: Homey Energy Dongle (P1 Wi-Fi Gateway)
- **Interface de Communication**: Diffusion UDP réseau local / HTTP (Port par défaut : 80)

#### Données de Télémétrie Lues par GEMS
Puissance active réseau (W), Énergie totale prélevée/injectée (kWh), Courants et tensions triphasés.

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Capte les diffusions télémétriques locales des dongles P1 Homey et affiche en direct les flux réseau du foyer sur le tableau de bord GEMS.

---

### 4.14 Inepro PRO380-MOD / PRO1-MOD Meter

- **Identifiant du Modèle**: `inepro_pro380`
- **Fabricant / Marque**: Inepro
- **Modèles Matériels Compatibles**: Inepro PRO380-MOD, PRO1-MOD Series Triphasé & Monophasé DIN-Rail Modbus Meters
- **Interface de Communication**: Modbus RTU via passerelle RS485 (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active totale (W), Registres kWh prélevés/injectés, Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Compteur sur rail DIN haute précision ; fournit les courants triphasés pour l'équilibrage dynamique de charge et la protection disjoncteur GEMS.

---

### 4.15 Lovato DMG610 Compteur Triphasé

- **Identifiant du Modèle**: `lovato_dmg610`
- **Fabricant / Marque**: Lovato
- **Modèles Matériels Compatibles**: Lovato Electric DMG610, DMG800 Series Multimètres Numériques
- **Interface de Communication**: Modbus TCP / RTU (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active totale (W), Énergie prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Analyseur réseau de classe industrielle ; fournit des mesures électriques rapides pour protéger les arrivées principales contre toute surcharge.

---

### 4.16 Loxone Miniserver

- **Identifiant du Modèle**: `loxone_miniserver`
- **Fabricant / Marque**: Loxone
- **Modèles Matériels Compatibles**: Loxone Miniserver Gen 1 / Gen 2, Miniserver Compact (HTTP JSON API)
- **Interface de Communication**: API HTTP JSON locale (Port par défaut : 80 / 443, Endpoints: /jdev/sfs/getstatus)

#### Données de Télémétrie Lues par GEMS
Puissance domestique agrégée (W), puissances des sous-compteurs (W), Compteurs d'énergie totale (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie REST en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Relie les installations domotiques Loxone Miniserver à GEMS, permettant d'utiliser les mesures compteur Loxone comme référence réseau principale.

---

### 4.17 Niko Home Control (NHC II)

- **Identifiant du Modèle**: `niko_nhc`
- **Fabricant / Marque**: Niko
- **Modèles Matériels Compatibles**: Niko Home Control II (Connected Controller avec Energy Module / Electricity Clamps)
- **Interface de Communication**: API locale Hobby / REST (Port par défaut : 8884 ou 80, JSON Endpoint: /hobby/v1/devices)

#### Données de Télémétrie Lues par GEMS
Puissance réseau prélevée/injectée en temps réel (W), Puissance consommée par sous-circuit (W), Énergie cumulée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
API locale en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Intégration transparente avec les installations belges Niko Home Control II ; lit localement les pinces ampèremétriques pour piloter l'écrêtage GEMS.

---

### 4.18 P1 Compteur Intelligent (Network/TCP)

- **Identifiant du Modèle**: `p1_network`
- **Fabricant / Marque**: Générique
- **Modèles Matériels Compatibles**: P1 Compteur Intelligent Network Bridge (TCP/Ethernet P1 Readers, Telnet Bridges, ESP-P1, Ser2Net)
- **Interface de Communication**: Flux socket TCP brut (Port par défaut : 23, 8088, ou 8234, Télégrammes DSMR bruts)

#### Données de Télémétrie Lues par GEMS
Puissance active en temps réel (+ prélèvement / - injection en Watts, OBIS 1.7.0 & 2.7.0), énergie cumulée tarifs 1 & 2 (kWh, OBIS 1.8.1/2 & 2.8.1/2), Courants triphasés (L1, L2, L3 en A, OBIS 31.7.0, 51.7.0, 71.7.0), Tensions triphasées (L1, L2, L3 en V, OBIS 32.7.0, 52.7.0, 72.7.0), Registre flamand de pointe quart-horaire (15 min) (W, OBIS 1.6.0), Consommation de gaz (m³, OBIS 0-1:24.2.1).

#### Consignes Pilotables & Données Écrites par GEMS
Flux de télégrammes numériques en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Interface réseau principale pour compteurs P1 distants sur LAN : décode les télégrammes officiels Fluvius/ORES/RESA (Belgique) et DSMR 4.x/5.x (Pays-Bas) pour alimenter le moteur prédictif capacitaire et le plafond adaptatif.

---

### 4.19 P1 Compteur Intelligent (USB/Serial)

- **Identifiant du Modèle**: `p1_serial`
- **Fabricant / Marque**: Générique
- **Modèles Matériels Compatibles**: P1 Compteur Intelligent Câble série direct (USB-to-RJ12 FTDI / CP2102 Cable on Raspberry Pi USB)
- **Interface de Communication**: Port série TTY direct (/dev/ttyUSB0 ou /dev/ttyAMA0, Débit : 115200 pour DSMR 4/5, 9600 pour DSMR 2/3)

#### Données de Télémétrie Lues par GEMS
Puissance active en temps réel (W, OBIS 1.7.0/2.7.0), énergie prélevée/injectée tarifs 1/2 (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), Pointe quart-horaire maximale belge (W, OBIS 1.6.0), Volume du compteur de gaz (m³).

#### Consignes Pilotables & Données Écrites par GEMS
Flux de télégrammes numériques en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Liaison matérielle directe sans latence avec les compteurs communicants belges et néerlandais ; fournit chaque seconde des télégrammes validés par CRC pour le délestage VE sous la seconde et l'écrêtage capacitaire.

---

### 4.20 SMA Compteur d'Énergie 2.0 / Data Manager M (Modbus TCP)

- **Identifiant du Modèle**: `sma_energymeter`
- **Fabricant / Marque**: SMA
- **Modèles Matériels Compatibles**: SMA Compteur d'Énergie 2.0, SMA Data Manager M (Modbus TCP Speedwire)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 2 ou 126)

#### Données de Télémétrie Lues par GEMS
Puissance active réseau prélevée/injectée (W), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Pilotage du bridage de puissance active (commande des onduleurs SMA via Data Manager).

#### Rôle Pratique & Automatisation GEMS
Mesure la puissance au point de raccordement et agit comme passerelle ; informe GEMS du bilan net et transmet les consignes de bridage solaire aux onduleurs SMA.

---

### 4.21 Schneider Electric Acti9 iEM3000 / PM3200 Series

- **Identifiant du Modèle**: `schneider_iem3000`
- **Fabricant / Marque**: Schneider Electric
- **Modèles Matériels Compatibles**: Schneider Electric Acti9 iEM3150, iEM3155, iEM3255, PowerLogic PM3200 Series
- **Interface de Communication**: Modbus RTU via passerelle RS485 ou Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active totale (W), Énergie active prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Comptage résidentiel et tertiaire de précision ; fournit une télémétrie déterministe des courants de phase pour protéger les tableaux électriques.

---

### 4.22 Shelly 3EM (Gen 1 Compteur Triphasé)

- **Identifiant du Modèle**: `shelly_3em`
- **Fabricant / Marque**: Shelly
- **Modèles Matériels Compatibles**: Shelly 3EM (Gen 1 Triphasé Wi-Fi Compteur d'Énergie avec 120A CT Clamps)
- **Interface de Communication**: API HTTP REST locale (Port par défaut : 80, JSON Endpoint: /status)

#### Données de Télémétrie Lues par GEMS
Puissance active totale (W), Puissance par phase (W), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), Énergie cumulée injectée/consommée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Sortie contacteur 10 A intégrée (Activation / Désactivation via /relay/0?turn=on).

#### Rôle Pratique & Automatisation GEMS
Lit à haute fréquence les pinces ampèremétriques triphasées en Wi-Fi ; le contacteur intégré peut enclencher des charges thermiques ou délester des équipements non prioritaires lors des pointes.

---

### 4.23 Shelly Pro 3EM / Gen3 3EM-63T (Compteur Triphasé)

- **Identifiant du Modèle**: `shelly_pro_3em`
- **Fabricant / Marque**: Shelly
- **Modèles Matériels Compatibles**: Shelly Pro 3EM, Shelly Pro 3EM-400, Shelly Gen3 3EM-63T (DIN-Rail Ethernet/Wi-Fi)
- **Interface de Communication**: RPC HTTP local Gen 2/3 (Port par défaut : 80, JSON Endpoint: /rpc/EM.GetStatus)

#### Données de Télémétrie Lues par GEMS
Puissance active nette sur les trois phases (W), Puissance active par phase (W), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V), Compteurs d'énergie 4 quadrants (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Sortie relais auxiliaire intégrée (Activation / Désactivation via /rpc/Switch.Set).

#### Rôle Pratique & Automatisation GEMS
Compteur rail DIN Ethernet haute fiabilité : fournit une télémétrie de phase instantanée pour le délestage VE sous la seconde, tandis que sa sortie relais auxiliaire pilote le boost PAC ou l'eau chaude sanitaire.

---

### 4.24 Siemens SENTRON (PAC2200 / 7KT1665 Meter)

- **Identifiant du Modèle**: `siemens_pac2200`
- **Fabricant / Marque**: Siemens
- **Modèles Matériels Compatibles**: Siemens SENTRON PAC2200, 7KT1665 Series Triphasé Modbus Compteurs Intelligents
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active totale (W), Énergie prélevée/injectée cumulée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Comptage industriel haut de gamme ; surveille la capacité de raccordement et alimente GEMS pour le délestage actif et le calcul des économies.

---

### 4.25 Socomec COUNTIS E24/E34/E44 / DIRIS A-40

- **Identifiant du Modèle**: `socomec_meter`
- **Fabricant / Marque**: Socomec
- **Modèles Matériels Compatibles**: Socomec COUNTIS E24, E34, E44 Series, DIRIS A-40 Compteurs d'Énergie Multifonctions
- **Interface de Communication**: Modbus RTU via passerelle RS485 (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active totale (W), Énergie active prélevée/injectée (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Comptage triphasé précis pour sites résidentiels et tertiaires ; renseigne GEMS sur la répartition par phase afin d'équilibrer la charge VE et protéger les fusibles.

---

### 4.26 WAGO 879 Series (879-3000 / 879-3020 / 879-3040)

- **Identifiant du Modèle**: `wago_879`
- **Fabricant / Marque**: WAGO
- **Modèles Matériels Compatibles**: WAGO 879 Series (879-3000, 879-3020, 879-3040 Triphasé DIN-Rail Compteurs d'Énergie)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active (W), Énergie active totale (kWh), Courants triphasés (L1, L2, L3 en A), Tensions triphasées (L1, L2, L3 en V).

#### Consignes Pilotables & Données Écrites par GEMS
Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Compteur rail DIN de précision ; transmet tensions et courants triphasés à GEMS pour la protection temps réel des fusibles, le calcul du surplus solaire et la visualisation PowerFlow.

---

### 4.27 Accuenergy AcuRev / Acuvim Series Meter

- **Identifiant du Modèle**: `accuenergy_meter`
- **Fabricant / Marque**: Accuenergy
- **Modèles Matériels Compatibles**: Accuenergy Acuvim II, AcuRev 1310, AcuRev 2100 Sous-compteur Multi-départs
- **Interface de Communication**: Modbus TCP / RTU via passerelle RS485 (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active nette réseau en temps réel (W), Énergie totale (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Surveillance triphasée haute précision du point de livraison et équilibrage de charge par phase pour sites tertiaires et résidentiels.

---

### 4.28 Algodue UPM209 / UPM309 Series Meter

- **Identifiant du Modèle**: `algodue_meter`
- **Fabricant / Marque**: Algodue
- **Modèles Matériels Compatibles**: Algodue UPM209, UPM309 Triphasé Analyseurs de Réseau
- **Interface de Communication**: Modbus RTU / TCP via passerelle RS485 (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active nette réseau en temps réel (W), Énergie totale (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Mesure continue des échanges réseau, suivi du facteur de puissance et protection contre la surcharge du disjoncteur principal.

---

### 4.29 Chint DTSU666 / DTSU666-H Compteur Triphasé

- **Identifiant du Modèle**: `chint_dtsu666`
- **Fabricant / Marque**: Chint
- **Modèles Matériels Compatibles**: Chint DTSU666, DTSU666-H Triphasé Direct & CT Compteurs Intelligents
- **Interface de Communication**: Modbus RTU via RS485 / Modbus TCP Gateway (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance active nette réseau en temps réel (W), Énergie totale prélevée & injectée (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Intégration standard de compteur réseau bidirectionnel triphasé ; pilote le calcul du surplus photovoltaïque et la modulation des bornes VE.

---

### 4.30 Hager ECM / ECR / ECP Compteur d'Énergie

- **Identifiant du Modèle**: `hager_meter`
- **Fabricant / Marque**: Hager
- **Modèles Matériels Compatibles**: Hager ECM, ECR, ECP, et SM103E Monophasé et Triphasé Compteurs d'Énergie
- **Interface de Communication**: Modbus RTU / TCP via Agardio / IP Gateway (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance nette réseau en temps réel (W), Énergie totale prélevée (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Surveillance sur rail DIN du tableau résidentiel fournissant une télémétrie de phase sous la seconde à la protection anti-surcharge GEMS.

---

### 4.31 Janitza UMG Series Analyseur de Réseau

- **Identifiant du Modèle**: `janitza_umg`
- **Fabricant / Marque**: Janitza
- **Modèles Matériels Compatibles**: Janitza UMG 96RM, UMG 604, UMG 509 Analyseurs de Qualité de Réseau
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance nette réseau en temps réel (W), Énergie totale prélevée (kWh), Courants de phase (L1, L2, L3 en A), Tensions composées/simples (V), Fréquence (Hz).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Intégration d'analyseur de réseau industriel haute précision capturant à haute fréquence les flux électriques et les déséquilibres de phases.

---

### 4.32 Kamstrup Compteur d'Énergie (Modbus Gateway)

- **Identifiant du Modèle**: `kamstrup_meter`
- **Fabricant / Marque**: Kamstrup
- **Modèles Matériels Compatibles**: Kamstrup OMNIPOWER et MULTICAL Compteurs Électriques & Thermiques
- **Interface de Communication**: Modbus RTU / TCP via M-Bus / Modbus Gateway (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance nette réseau en temps réel (W), Énergie totale prélevée (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Intègre les compteurs électriques et thermiques de chauffage urbain dans la supervision énergétique globale GEMS.

---

### 4.33 Landis+Gyr Compteur Industriel de Réseau

- **Identifiant du Modèle**: `landisgyr_meter`
- **Fabricant / Marque**: Landis+Gyr
- **Modèles Matériels Compatibles**: Landis+Gyr E550, E650, E850 Compteurs Industriels & Tertiaires
- **Interface de Communication**: Modbus RTU / TCP via Communication Unit (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance nette réseau en temps réel (W), Énergie totale prélevée & injectée (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Surveille les points de raccordement tertiaires et industriels de forte puissance afin de garantir le respect des plafonds d'écrêtage.

---

### 4.34 Phoenix Contact EMpro Compteur d'Énergie

- **Identifiant du Modèle**: `phoenix_empro`
- **Fabricant / Marque**: Phoenix Contact
- **Modèles Matériels Compatibles**: Phoenix Contact EMpro EEM-MA370, EEM-MB370 Series
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance nette réseau en temps réel (W), Énergie totale prélevée (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Transmet en temps réel les mesures triphasées en tête d'installation à GEMS pour un suivi instantané du surplus solaire.

---

### 4.35 Weidmüller Compteur d'Énergie (500 / 600 / 700)

- **Identifiant du Modèle**: `weidmuller_meter`
- **Fabricant / Marque**: Weidmüller
- **Modèles Matériels Compatibles**: Weidmüller Compteur d'Énergie 525, 610, 700 Series
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
Puissance nette réseau en temps réel (W), Énergie totale prélevée (kWh), Courants de phase (L1, L2, L3 en A), Tensions (V).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Supervision énergétique de classe industrielle pour bâtiments tertiaires et tableaux divisionnaires multi-départs.

---

### 4.36 YouLess LS120 Compteur à Impulsions & P1

- **Identifiant du Modèle**: `youless_ls120`
- **Fabricant / Marque**: YouLess
- **Modèles Matériels Compatibles**: YouLess LS120 Dongle Optique à Impulsions & P1
- **Interface de Communication**: API HTTP REST locale (Port par défaut : 80, Endpoint: /a?f=j)

#### Données de Télémétrie Lues par GEMS
Puissance nette réseau en temps réel (W), Énergie totale prélevée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Télémétrie réseau en lecture seule.

#### Rôle Pratique & Automatisation GEMS
Se connecte sur le réseau local aux ports P1 des compteurs numériques ou par lecteur optique aux compteurs électromécaniques sans abonnement cloud.

---

### 4.37 Fronius Compteur Intelligent IP / Solar API v1

- **Identifiant du Modèle**: `fronius_smartmeter_ip`
- **Fabricant / Marque**: Fronius
- **Modèles Matériels Compatibles**: Fronius Compteur Intelligent IP, TS 65A-3, TS 5kA-3, TS 100A-1 (Direct IP ou via onduleur Fronius)
- **Interface de Communication**: API HTTP locale Fronius Solar v1 (`GET /solar_api/v1/GetMeterRealtimeData.cgi?Scope=Device&DeviceId=0`)

#### Données de Télémétrie Lues par GEMS
Puissance nette réseau signée (W), Énergie totale prélevée & injectée (kWh), Courants signés par phase (L1, L2, L3 en A), Tensions de phase (V).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Lecture seule

#### Rôle Pratique & Automatisation GEMS
Comptage réseau HTTP local sans câblage additionnel pour écosystèmes Fronius, fournissant les courants signés par phase pour la protection fusibles et l'écrêtage.

---

### 4.38 Huawei EMMA-A02 / DTSU666-H Capteur de Puissance Intelligent

- **Identifiant du Modèle**: `huawei_emma`
- **Fabricant / Marque**: Huawei
- **Modèles Matériels Compatibles**: Huawei EMMA-A02 Energy Management Assistant, Huawei Capteur de Puissance Intelligent DTSU666-H / DDSU666-H
- **Interface de Communication**: Modbus TCP / RTU (Port : 502, Holding `31633`–`31666` sur EMMA-A02 & `2102`–`2175` Float32 sur DTSU666-H)

#### Données de Télémétrie Lues par GEMS
Puissance signée au point de raccordement (W), Énergie totale prélevée & injectée (kWh), Courants triphasés signés (A), Tensions triphasées (V).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Lecture seule

#### Rôle Pratique & Automatisation GEMS
Télémétrie haute vitesse au point de raccordement pour sites Huawei SUN2000 & LUNA2000 équipés d'EMMA-A02 ou de capteurs RS485 dédiés.

---

### 4.39 KOSTAL Compteur d'Énergie Intelligent (KSEM G1 / G2)

- **Identifiant du Modèle**: `kostal_ksem`
- **Fabricant / Marque**: KOSTAL
- **Modèles Matériels Compatibles**: KOSTAL Compteur d'Énergie Intelligent G1 & G2 (DIN-Rail Ethernet / RS485 Compteur Réseau)
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID d'unité par défaut : 71, Registres Holding `0`–`143` & `512`–`519`)

#### Données de Télémétrie Lues par GEMS
Puissance active prélevée & injectée (0.1 W), Énergie totale prélevée & injectée (0.1 Wh -> kWh), Courants directionnels par phase (A) & tensions (V).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Lecture seule

#### Rôle Pratique & Automatisation GEMS
Mesure réseau rail DIN Ethernet sous la seconde avec courants directionnels par phase pour l'équilibrage DLB et l'écrêtage capacitaire.

---

### 4.40 Tasmota SML / OBIS Lecteur Optique Infrarouge & EcoTracker

- **Identifiant du Modèle**: `tasmota_sml`
- **Fabricant / Marque**: Tasmota
- **Modèles Matériels Compatibles**: Tasmota SML / OBIS / DLMS Têtes de Lecture Optiques IR (Hichi, BitShake) & everHome EcoTracker
- **Interface de Communication**: API HTTP JSON locale (`/cm?cmnd=Status%208` StatusSNS & EcoTracker `/v1/json`)

#### Données de Télémétrie Lues par GEMS
Puissance nette réseau en temps réel (W), Compteurs d'énergie totale prélevée & injectée (kWh), Courants de phase (A) & Tensions (V).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Lecture seule

#### Rôle Pratique & Automatisation GEMS
Lecture optique infrarouge sans cloud pour compteurs numériques européens dépourvus de port RJ12 P1.

---

### 4.41 Compteur Intelligent Modbus Personnalisé (Profil Registres UI)

- **Identifiant du Modèle**: `custom_modbus_meter`
- **Fabricant / Marque**: Custom Modbus
- **Modèles Matériels Compatibles**: Tout analyseur réseau rail DIN ou sous-compteur de production PV Modbus TCP ou RS-485 RTU configuré via l'Éditeur UI de Profils Registres certifié
- **Interface de Communication**: Modbus TCP / RTU (Port configurable ou bus `/dev/serial/by-id/*`, ID d'unité, registres d'entrée et de maintien `FC03`/`FC04`)

#### Données de Télémétrie Lues par GEMS
Puissance nette réseau ou PV (W), Compteurs d'énergie prélevée & injectée (kWh), Courants de phase (`L1, L2, L3` en A) & Tensions (`L1, L2, L3` en V) mappés via l'UI selon tous les ordres d'octets (`ABCD`, `CDAB`, `BADC`, `DCBA`).

#### Consignes Pilotables & Données Écrites par GEMS
Autonome / Lecture seule

#### Rôle Pratique & Automatisation GEMS
Permet un mappage de registres vérifié avec test de lecture en un clic pour les compteurs d'énergie Modbus industriels et régionaux (en compteur principal réseau ou sous-compteur de production PV).

---

## 5. Relais Intelligents & Actionneurs Thermiques (12 Appareils)

Les relais intelligents, routeurs solaires et contacteurs pilotent les charges thermiques importantes — pompes à chaleur (via contacts secs SG-Ready ou Modbus TCP direct), ballons d'eau chaude sanitaire (ECS), pompes de filtration de piscine et thermoplongeurs électriques. GEMS enclenche ces équipements dès que le surplus solaire dépasse les seuils configurés ou lorsque les prix spot deviennent négatifs, avec une hystérésis stricte anti-court-cycle pour protéger les compresseurs.

### 5.1 Relais HTTP Générique

- **Identifiant du Modèle**: `generic_relay`
- **Fabricant / Marque**: Générique
- **Modèles Matériels Compatibles**: Relais HTTP REST Générique (ESP8266, ESP32, Tasmota, Shelly Gen1, Custom Microcontrollers)
- **Interface de Communication**: HTTP REST local (Port par défaut : 80 / 8080, URL configurables pour l'état et la commutation)

#### Données de Télémétrie Lues par GEMS
Consommation active de l'appareil raccordé (W, optionnel si comptabilisé).

#### Consignes Pilotables & Données Écrites par GEMS
État de sortie du contacteur relais (Activation / Désactivation).

#### Rôle Pratique & Automatisation GEMS
Pilotage automatisé de contacteur : enclenche les chauffe-eau électriques, pompes de piscine ou chauffages résistifs lorsque l'injection solaire dépasse un seuil configurable (ex. > 1500 W pendant 2 minutes), avec hystérésis stricte de durée minimale de marche et d'arrêt.

---

### 5.2 Shelly Plus 1PM / Pro 1PM / Plug S (Relais & Mesure de Puissance)

- **Identifiant du Modèle**: `shelly_plus_1pm`
- **Fabricant / Marque**: Shelly
- **Modèles Matériels Compatibles**: Shelly Plus 1PM, Shelly Pro 1PM, Shelly Plug S, Shelly Pro 2PM (Gen 2 / Gen 3 Mongoose OS)
- **Interface de Communication**: RPC HTTP local Gen 2/3 (Port par défaut : 80, Endpoints: /rpc/Switch.Set, /rpc/Switch.GetStatus)

#### Données de Télémétrie Lues par GEMS
Puissance active de l'appareil raccordé (W), Consommation d'énergie cumulée (kWh), Température interne de l'appareil (°C), Tension d'alimentation (V).

#### Consignes Pilotables & Données Écrites par GEMS
État de sortie du contacteur relais (Activation / Désactivation via /rpc/Switch.Set).

#### Rôle Pratique & Automatisation GEMS
Boost Pompe à Chaleur SG-Ready & Automatisation d'Appareils : enclenche l'état SG-Ready 3 (mode boost thermique) des pompes à chaleur ou ballons ECS lors de surplus solaires ou d'heures à prix négatifs, tout en journalisant la puissance réelle dans GEMS.

---

### 5.3 Module Relais E/S Numériques Modbus

- **Identifiant du Modèle**: `modbus_relay`
- **Fabricant / Marque**: Relais / E/S Modbus
- **Modèles Matériels Compatibles**: Waveshare Modbus RTU/TCP Relay, ADAM-4000/6000, Moxa ioLogik, Kincony Modbus Relay
- **Interface de Communication**: Modbus TCP / RTU via RS485 (Port par défaut : 502, ID esclave : 1)

#### Données de Télémétrie Lues par GEMS
États des entrées / bobines numériques (Ouvert / Fermé).

#### Consignes Pilotables & Données Écrites par GEMS
Commande des bobines de relais (Bobines 1–8 Marche / Arrêt).

#### Rôle Pratique & Automatisation GEMS
Commutation industrielle de contacteurs pour charges de forte intensité, batteries thermiques triphasées et délestage de machines lors des pointes.

---

### 5.4 SG-Ready Pompe à Chaleur (Daikin/Nibe/Bosch/Vaillant/Panasonic)

- **Identifiant du Modèle**: `sgready_heatpump`
- **Fabricant / Marque**: SG-Ready (Daikin, Nibe, Bosch/Nefit, Vaillant, Panasonic, Mitsubishi, Stiebel Eltron, Wolf)
- **Modèles Matériels Compatibles**: Pompes à chaleur standard SG-Ready 4 états via deux canaux RelayController liés (`sgready_relay1_id` + `sgready_relay2_id`, ex. relais Shelly ou Modbus) ou passerelle HTTP REST locale
- **Interface de Communication**: Liaison Double Relais 4 États (`[1,0]`, `[0,0]`, `[0,1]`, `[1,1]`) ou API HTTP REST locale (`/api/sgready`)

#### Données de Télémétrie Lues par GEMS
État de fonctionnement SG-Ready 4 états (État 1 `[1,0]` : Délestage réseau / État 2 `[0,0]` : Normal / État 3 `[0,1]` : Solaire & tarif creux recommandé / État 4 `[1,1]` : Boost thermique forcé), puissance électrique cumulée (W).

#### Consignes Pilotables & Données Écrites par GEMS
Pilotage complet SG-Ready 4 états (`État 1` délestage de pointe limité à 2 h max., `État 2` Normal, `État 3` préchauffage confort solaire/pré-pointe, `État 4` boost forcé à prix négatifs) avec temporisation anti-court-cycle compresseur de 600 s.

#### Rôle Pratique & Automatisation GEMS
Stockage thermique 4 états & protection de pointe : préchauffe l'ECS et les ballons tampons lors de surplus solaires ou de créneaux peu coûteux avant les pointes du soir (`État 3`), maximise le stockage thermique en cas de prix négatifs (`État 4`) et ne déleste le compresseur (`État 1`) qu'en dernier recours lorsque les VE sont en pause et l'appui batterie épuisé.

---

### 5.5 Shelly Plus 1 / Pro 1 (Relais à Contact Sec)

- **Identifiant du Modèle**: `shelly_plus_1`
- **Fabricant / Marque**: Shelly
- **Modèles Matériels Compatibles**: Shelly Plus 1, Shelly Pro 1 (Gen 2 / Gen 3 relais à contact sec libre de potentiel)
- **Interface de Communication**: RPC HTTP local (Port par défaut : 80, Endpoint: /rpc/Switch.Set)

#### Données de Télémétrie Lues par GEMS
État du relais (Marche / Arrêt), température interne (°C), état de l'entrée.

#### Consignes Pilotables & Données Écrites par GEMS
État de sortie du relais à contact sec (Activation / Désactivation).

#### Rôle Pratique & Automatisation GEMS
Contact sec libre de potentiel permettant de piloter les entrées SG-Ready de pompes à chaleur, les bornes d'inhibition externes de wallbox VE ou les circulateurs.

---

### 5.6 Shelly Plus 2PM / Pro 2PM (Double Relais & Compteur)

- **Identifiant du Modèle**: `shelly_plus_2pm`
- **Fabricant / Marque**: Shelly
- **Modèles Matériels Compatibles**: Shelly Plus 2PM, Shelly Pro 2PM (Relais double canal avec mesure de puissance indépendante)
- **Interface de Communication**: RPC HTTP local (Port par défaut : 80, Endpoints: /rpc/Switch.Set, /rpc/Switch.GetStatus)

#### Données de Télémétrie Lues par GEMS
Puissance active Canal 1 & Canal 2 (W), énergie cumulée par canal (kWh), Tension d'alimentation (V).

#### Consignes Pilotables & Données Écrites par GEMS
États des deux sorties relais (Canal 0 & Canal 1 Marche / Arrêt indépendants).

#### Rôle Pratique & Automatisation GEMS
Automatisation indépendante à deux canaux : commande et mesure plusieurs étages de chauffe résistifs ou pilote les deux relais d'une interface PAC SG-Ready complète (États 1 à 4).

---

### 5.7 Daikin Altherma 3 & HomeHub (Smart Grid Modbus)

- **Identifiant du Modèle**: `daikin_altherma`
- **Fabricant / Marque**: Daikin
- **Modèles Matériels Compatibles**: Daikin Altherma 3 R / H / M & Daikin HomeHub (`EKRHH`) Systèmes de Pompe à Chaleur
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID d'unité : 1, Input `21`–`50` & Holding `2`, `53`)

#### Données de Télémétrie Lues par GEMS
Puissance électrique instantanée de la pompe à chaleur (W), température du ballon ECS (°C), température de départ d'eau (°C), état Smart Grid.

#### Consignes Pilotables & Données Écrites par GEMS
Mode Smart Grid (`53` : fonctionnement normal vs Boost surplus PV recommandé) & consigne de température ECS (`2`).

#### Rôle Pratique & Automatisation GEMS
Automatisation thermique native en Modbus TCP pour pompes à chaleur Daikin Altherma 3 : convertit le surplus PV et l'électricité à prix négatif en eau chaude sanitaire et chauffage.

---

### 5.8 my-PV AC•THOR / AC•THOR 9s / AC ELWA 2 Routeur Solaire

- **Identifiant du Modèle**: `mypv_acthor`
- **Fabricant / Marque**: my-PV
- **Modèles Matériels Compatibles**: my-PV AC•THOR (3 kW), AC•THOR 9s (9 kW), AC ELWA 2, AC ELWA-E Thermoplongeurs Photovoltaïques Linéaires
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID d'unité : 1, Registres Holding `1000`–`1003`)

#### Données de Télémétrie Lues par GEMS
Puissance réelle de chauffe du thermoplongeur (W), température du ballon d'eau chaude sanitaire (`0,1 °C`), état de fonctionnement.

#### Consignes Pilotables & Données Écrites par GEMS
Consigne linéaire progressive de puissance thermique (`1000` : `0–9000 W`), état relais Boost et consigne de température maximale du ballon (`1002`).

#### Rôle Pratique & Automatisation GEMS
Stockage thermique proportionnel zéro-injection : dérive au watt près tout le surplus photovoltaïque vers les ballons d'eau chaude avant toute injection réseau ou bridage.

---

### 5.9 NIBE S-Series Pompe à Chaleur (S1155 / S1255 / S2125 / VVM)

- **Identifiant du Modèle**: `nibe_heatpump`
- **Fabricant / Marque**: NIBE
- **Modèles Matériels Compatibles**: NIBE S1155, S1255, S1156, S1256, S2125, SMO S40, VVM S320 Pompes à Chaleur Inverter
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID d'unité : 1, Input `8`, `2166`, `2285` & Holding `697`, `707`)

#### Données de Télémétrie Lues par GEMS
Puissance électrique instantanée du compresseur (`2166` W), Énergie électrique consommée cumulée (`2285` kWh), Température haute du ballon ECS (`8` °C).

#### Consignes Pilotables & Données Écrites par GEMS
Boost ECS SG-Ready / Smart Price Luxury (`697` / `47`) et consigne de température de confort (`707` `0,1 °C`).

#### Rôle Pratique & Automatisation GEMS
Intégration directe Modbus TCP Wi-Fi/Ethernet pour pompes à chaleur NIBE Série S : renforce le stockage thermique durant les surplus solaires et les heures creuses EPEX.

---

### 5.10 Stiebel Eltron / Tecalor ISG Web & Plus (WPM)

- **Identifiant du Modèle**: `stiebel_eltron_isg`
- **Fabricant / Marque**: Stiebel Eltron
- **Modèles Matériels Compatibles**: Stiebel Eltron & Tecalor WPM3, WPM3i, WPMsystem Pompes à Chaleur via ISG web / ISG plus Gateway
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID d'unité : 1, Input `521`, `2500`, `3506` & Holding `1509`, `4000`–`4002`)

#### Données de Télémétrie Lues par GEMS
Température du préparateur ECS (`521` °C), état compresseur & circulateur ECS (`2500`), Énergie électrique cumulée (kWh).

#### Consignes Pilotables & Données Écrites par GEMS
Activation gestion énergétique SG-Ready (`4000=1`), État 2 / État 3 Boost PV SG-Ready (`4001`–`4002`) et consigne ECS Confort (`1509`).

#### Rôle Pratique & Automatisation GEMS
Pilotage normalisé Modbus TCP du boost SG-Ready et de la consigne de confort ECS pour pompes à chaleur Stiebel Eltron et Tecalor.

---

### 5.11 Tasmota Prise Connectée / Relais de Puissance DIN

- **Identifiant du Modèle**: `tasmota_relay`
- **Fabricant / Marque**: Tasmota
- **Modèles Matériels Compatibles**: Tasmota Wi-Fi / Ethernet Prises Connectées, Sonoff POW, Nous A1T, et Contacteurs DIN Multi-canaux
- **Interface de Communication**: API HTTP de commandes locale (`/cm?cmnd=Power%20On|Off` & `/cm?cmnd=Status%208`)

#### Données de Télémétrie Lues par GEMS
Puissance active appelée (W), Énergie cumulée (kWh), Tension d'alimentation (V), Courant de charge (A).

#### Consignes Pilotables & Données Écrites par GEMS
État de sortie des canaux relais (`Power{1..8} On` / `Off` avec protection par hystérésis).

#### Rôle Pratique & Automatisation GEMS
Commutation et mesure de puissance locales 100 % sans cloud pour chauffe-eau résistifs, pompes de piscine, chargeurs VAE et relais auxiliaires.

---

### 5.12 Askoma ASKOHEAT+ Modbus TCP Thermoplongeur Solaire PV

- **Identifiant du Modèle**: `askoheat_diverter`
- **Fabricant / Marque**: Askoma
- **Modèles Matériels Compatibles**: Askoma ASKOHEAT+ (AHIR-BI-PLUS 1.75 kW – 19.25 kW) Thermoplongeurs PV à Bride et à Visser à 7 Étages
- **Interface de Communication**: Modbus TCP (Port par défaut : 502, ID d'unité : 1, Registres Holding `100`, `200`–`202`, `300`–`304`)

#### Données de Télémétrie Lues par GEMS
Puissance réelle du thermoplongeur (`300` W), température d'eau du ballon (`302` `0,1 °C`), masque binaire des étages actifs (`301`), Énergie thermique cumulée (`304` `0.1 kWh`).

#### Consignes Pilotables & Données Écrites par GEMS
Consigne progressive de surplus/charge (`200`–`201` W), commande à 7 étages (`100` étages 0–7), boost anti-légionellose et consigne de température maximale d'eau (`202` `0,1 °C`).

#### Rôle Pratique & Automatisation GEMS
Dérivation électrothermique solaire proportionnelle à 7 étages et continue pour thermoplongeurs Askoma ASKOHEAT+ : convertit l'excédent solaire et l'électricité à prix négatif en eau chaude sanitaire.

---

## Protocoles de Communication & Configuration Réseau

### 1. Recommandations Passerelles Modbus TCP & RTU (Privilégié pour Bornes & Onduleurs)
- **Latence Infra-Seconde** : Le protocole Modbus TCP permet à GEMS de lire les registres et d'appliquer les consignes de courant en 200 à 500 millisecondes. Cette réactivité est indispensable pour absorber instantanément les appels de puissance domestiques (four électrique, table à induction).
- **Bus RS485 Multipoint Partagé & Passerelles Mono-Socket** : Plusieurs esclaves Modbus RTU raccordés sur un même adaptateur USB-RS485 (ou derrière une passerelle Ethernet-RS485 mono-connexion) partagent automatiquement un verrou de bus sérialisé et thread-safe avec débit et parité configurables (`8N1` / `8E1` / `8O1`).
- **Liaison USB Persistante `/dev/serial/by-id/*`** : Lorsque plusieurs câbles USB-RS485 et USB-P1 sont branchés sur le Raspberry Pi, GEMS détecte et affiche les liens matériels persistants (`/dev/serial/by-id/usb-FTDI_...`) sous forme de pastilles cliquables afin d'éviter toute inversion de ports au redémarrage.
- **Coexistence avec la Facturation CPO Externe** : Pour les véhicules de société dont la borne reste connectée en OCPP à un opérateur de facturation tiers ou un service de remboursement employeur, GEMS module localement le courant via Modbus TCP sans jamais interrompre la session ni le canal de facturation.
- **Ports Standards** : Le Modbus TCP standard utilise le port `502`. SolarEdge et KOSTAL utilisent généralement le port `1502`. Les clés Wi-Fi/LAN Solis, SofarSolar et GoodWe utilisent fréquemment le port `8899`.

### 2. Serveur WebSocket Natif OCPP 1.6-J
- **Serveur CSMS Embarqué** : GEMS intègre nativement un serveur WebSocket OCPP 1.6-J à l'écoute sur le port dédié `8887` ainsi que sur le port `8080` (`/api/ocpp/<ChargePointID>`).
- **Exploitation 100 % Locale Résidentielle & Flotte** : Les bornes dépourvues de Modbus TCP ouvert (p. ex. Huawei FusionCharge, EVBox, VW ID. Charger, Schneider EVlink) pointent simplement leur URL OCPP vers :
  ```text
  ws://<IP-Raspberry-Pi-GEMS>:8887/<ChargePointID>
  ws://<IP-Raspberry-Pi-GEMS>:8080/api/ocpp/<ChargePointID>
  ```
- **Mécanisme de Pilotage** : GEMS émet des profils `SetChargingProfile` avec une résolution de 0,1 A / 1 A (incluant la mise en pause à `0,0 A`) pour réguler finement la puissance de charge.

### 3. Interfaces Compteurs Intelligents (P1 DSMR & RS485)
- **Câble Série P1 USB** : Câble direct USB vers RJ12 branché sur le Raspberry Pi (`/dev/ttyUSB0`). Le débit standard est de `115200` bauds pour DSMR 4.x/5.x et Fluvius (Belgique), ou `9600` bauds pour les anciens compteurs DSMR 2.x/3.x. En Belgique, le port client P1 doit être activé via *Mijn Fluvius*.
- **Passerelle Réseau P1** : Les lecteurs P1 réseau (HomeWizard Wi-Fi P1, ponts TCP sur les ports `23`, `8088` ou `8234`) diffusent les télégrammes DSMR sur le réseau local sans câblage jusqu'au contrôleur GEMS.

### 4. API Locales REST & JSON-RPC
- Les équipements tels que HomeWizard (`/api/v1/data`), Shelly Gen 2/3 (`/rpc/EM.GetStatus`), go-e Charger (`/api/status`), APsystems EZ1 (`:8050/getOutputData`) et Enphase Envoy (`/ivp/livedata/status`) sont interrogés et pilotés directement sur le LAN en HTTP GET/POST sans aucune dépendance aux serveurs cloud des fabricants.

### 5. Récapitulatif des Ports Réseau

| Port | Protocole | Équipements Associés par Défaut |
| :--- | :--- | :--- |
| `502` | Modbus TCP | Huawei, SMA, Fronius, Sungrow, Victron, Deye, ABL, ABB, RAEDIAN, KEBA, Eastron, Carlo Gavazzi |
| `1502` | Modbus TCP (SunSpec) | Onduleurs & Bornes SolarEdge, KOSTAL Plenticore, openWB 2.0 |
| `8899` | Modbus TCP | Clés Wi-Fi/LAN Solis, SofarSolar, GoodWe |
| `8502` | Modbus TCP | Gamme Alpha ESS Storion |
| `8887` / `8080` | WebSocket (OCPP 1.6-J) | Serveur OCPP embarqué GEMS (`:8887/<ID>` ou `:8080/api/ocpp/<ID>`) |
| `80` / `443` | HTTP REST / JSON Local | HomeWizard P1, Shelly 3EM / Pro 3EM, go-e Charger, Enphase Envoy, SmartEVSE, sonnenBatterie, Sessy |
| `8884` | API JSON Locale | Contrôleur connecté Niko Home Control II |
| `8088` / `8234` / `23` | Flux TCP DSMR Brut | Passerelles TCP P1, Ser2Net, passerelles ESP-P1 |

### 6. Moteur de Test & Simulation (Modèles Démo Sans Matériel)

Pour les environnements de pré-configuration, les démonstrations commerciales et les tests automatisés sans matériel physique raccordé, GEMS propose six modèles simulés natifs couvrant les cinq catégories d'appareils :

| Modèle Démo | Identifiant | Catégorie | Télémétrie & Dynamique Simulées | Consignes Interactives |
| :--- | :--- | :--- | :--- | :--- |
| **Compteur Intelligent Numérique Démo (DSMR/P1)** | `demo_meter` | `meter` | Charge résidentielle de base, pointes matin/soir, courants & tensions triphasés asymétriques (230 V ±2 V), index prélèvement/injection kWh, gaz $m^3$, pointe quart-horaire flamande (`currentQuarterPeakW`). Équilibre automatiquement le bilan réseau selon la production PV, la batterie et la borne simulées. | Lecture seule (Bilan réseau synchronisé) |
| **Onduleur Solaire Démo (PV)** | `demo_solar` | `inverter` | Courbe solaire journalière en cloche (lever au coucher du soleil) mise à l'échelle de la puissance crête (p. ex. 5,0 kW) avec micro-fluctuations nuageuses (±3 %–10 %) et mesures triphasées. | `SetActivePowerLimit(W)` : bride dynamiquement la production active lors des prix négatifs ou du mode zéro-injection. |
| **Batterie Stationnaire Démo (BESS)** | `demo_battery` | `battery` | Intégration réaliste de l'état de charge ($dE/dt = P \cdot \eta$) entre le seuil de réserve de 10 % et 100 %, avec absorption autonome des excédents PV et couverture du déficit domestique. | `ChargeBattery(W)` et `DischargeBattery(W)` : répond aux ordres d'arbitrage EPEX et d'écrêtement de pointe. |
| **Onduleur Hybride & Stockage Démo** | `demo_hybrid_inverter` | `inverter` | Combinaison de production photovoltaïque et de stockage batterie intégré dans un seul équipement hybride. | `SetActivePowerLimit(W)`, `ChargeBattery(W)`, `DischargeBattery(W)`. |
| **Borne VE Intelligente Démo** | `demo_charger` | `charger` | Simulation d'un véhicule connecté appelant une puissance proportionnelle à la consigne ($P \approx \text{phases} \times 230\text{V} \times I$) avec variations réalistes et cumul d'énergie de session. | `SetChargeCurrent(A)` (6 A–32 A), `SetPhaseMode` (monophasé / triphasé). Entièrement compatible avec les modes DLB du Cluster de Flotte VE. |
| **Relais Intelligent / Pompe à Chaleur Démo** | `demo_relay` | `relay` | Simulation de compresseur thermique (~2,1 kW en marche, ~3 W en veille) avec suivi de température d'eau/ambiance. | `SetState(bool)` : commute le contact selon les règles d'automatisation. |

*Provisionnement Rapide :* Les installateurs peuvent déployer ou supprimer en un clic un kit complet coordonné de 4 appareils (Compteur Intelligent + Onduleur Solaire + Batterie + Borne VE) via le bouton **« 🧪 Ajout Rapide Kit Démo »** dans **Paramètres &rarr; Appareils**.

---

*Document maintenu automatiquement par GEMS (Grid Energy Management System). Référentiel canonique des 168 profils d'intégration matérielle (180 modèles enregistrés au total, incluant les alias multi-modèles et les 6 modèles de simulation).*
