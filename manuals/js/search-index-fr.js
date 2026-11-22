/**
 * GEMS (New Energy Grid) Index de Recherche Documentaire — Français (FR)
 * Fournit une recherche plein texte instantanée côté client sur toutes les pages de documentation francophones.
 */
window.DOCS_SEARCH_INDEX = [
  // --- Aperçu & Portail Documentaire ---
  {
    title: "Aperçu de la Documentation & Architecture Système",
    category: "Aperçu",
    url: "index.html",
    snippet: "Architecture globale de GEMS (New Energy Grid), backend monolithique en Go, interface Vue 3 SPA, stockage SQLite WAL et présentation du système.",
    keywords: ["aperçu", "architecture", "monolithe", "golang", "vue3", "sqlite", "wal", "raspberry pi", "introduction", "manuel"]
  },
  {
    title: "Configuration Matérielle & Système Requise",
    category: "Aperçu",
    url: "index.html#requirements",
    snippet: "Matrice de compatibilité matérielle pour Raspberry Pi 3B+, 4B, 5 et Zero 2W, protection contre l'usure de la carte SD et empreinte mémoire.",
    keywords: ["matériel", "hardware", "prérequis", "raspberry pi", "carte sd", "ram", "arm64", "debian", "bookworm", "spécifications"]
  },
  {
    title: "Démarrage Rapide en 5 Minutes",
    category: "Aperçu",
    url: "index.html#quickstart",
    snippet: "Guide de mise en route rapide pour flasher l'image OS, démarrer le Raspberry Pi et accéder à l'interface web sur ems.local.",
    keywords: ["démarrage rapide", "quickstart", "premiers pas", "premier démarrage", "ems.local", "installation rapide"]
  },
  {
    title: "Rentabilité & Retour sur Investissement (Brochure ROI PDF)",
    category: "Aperçu",
    url: "../../docs/fr/GRID-EMS-Return-On-Investment-fr.pdf",
    snippet: "Analyse financière pour installations résidentielles et PME : économies sur le tarif capacitaire, hausse de l'autoconsommation et délai d'amortissement.",
    keywords: ["roi", "rentabilité", "retour sur investissement", "amortissement", "économies", "brochure", "tarif capacitaire", "autoconsommation", "pdf"]
  },
  {
    title: "Meilleure Stratégie par Pays & Installation (Guide PDF)",
    category: "Aperçu",
    url: "../../docs/fr/GRID-EMS-Strategy-Guide-fr.pdf",
    snippet: "Guide visuel de sélection en 4 pages : arbre de décision en 10 secondes, matrice Pays x Contrat (Flandre, Wallonie, Bruxelles, Pays-Bas, Allemagne), 6 profils 1-Clic et architectures matérielles.",
    keywords: ["guide stratégie", "meilleure stratégie", "pays", "flandre", "wallonie", "pays-bas", "allemagne", "installation", "profil 1-clic", "pdf"]
  },

  // --- Manuel d'Installation ---
  {
    title: "Nomenclature Matérielle de Référence Testée (BOM)",
    category: "Installation",
    url: "installation.html#hardware-reference",
    snippet: "Liste du matériel (BOM) de référence Raspberry Pi 5 4 Go NVMe, SSD M.2 NVMe, alimentation officielle USB-C PD 27 W et brochage RS485/P1.",
    keywords: ["matériel", "hardware", "raspberry pi 5", "nvme ssd", "alimentation 27w", "bom", "nomenclature", "kit de référence", "m.2 2280"]
  },
  {
    title: "Installation SSD M.2 NVMe & Configuration du Bootloader EEPROM",
    category: "Installation",
    url: "installation.html#nvme-setup",
    snippet: "Résolution de la détection SSD NVMe sur Raspberry Pi 5, BOOT_ORDER=0xf461, PCIE_PROBE=1, dtparam=pciex1, utilitaire EEPROM Raspberry Pi Imager et flashage dd.",
    keywords: ["installation nvme", "nvme ssd", "eeprom", "boot order", "ordre de démarrage", "pcie_probe", "dtparam=pciex1", "pciex1_gen", "ssd non détecté", "m.2 boot"]
  },
  {
    title: "Image Raspberry Pi OS Préconfigurée (Recommandé)",
    category: "Installation",
    url: "installation.html#custom-os-image",
    snippet: "Flashage de l'image OS Bookworm ARM64 préconfigurée avec BalenaEtcher ou Raspberry Pi Imager. Mode kiosque et Cockpit prêts à l'emploi.",
    keywords: ["image os", "image personnalisée", "balenaetcher", "raspberry pi imager", "flasher carte sd", "bookworm", "img.xz"]
  },
  {
    title: "Installation par Paquet Debian (.deb)",
    category: "Installation",
    url: "installation.html#deb-package",
    snippet: "Installation de GEMS sur une distribution Debian ou Ubuntu ARM64 existante via dpkg -i gems_*_arm64.deb et gestion du service gems.service.",
    keywords: ["deb", "debian", "dpkg", "apt", "paquet", "systemd", "gems.service", "ubuntu", "installer"]
  },
  {
    title: "Terminal Web Cockpit & Administration Système",
    category: "Installation",
    url: "installation.html#cockpit",
    snippet: "Accès à l'interface web Cockpit sur le port 9090 avec les identifiants administrateur Linux provisionnés pour le terminal et le diagnostic système.",
    keywords: ["cockpit", "port 9090", "terminal", "identifiants", "ssh", "systemctl", "journaux"]
  },
  {
    title: "Accès à Distance via Raspberry Pi Connect",
    category: "Installation",
    url: "installation.html#rpi-connect",
    snippet: "Association de Raspberry Pi Connect (rpi-connect signin) pour un accès terminal chiffré et un support supervisé à distance sans VPN ni redirection de port.",
    keywords: ["raspberry pi connect", "rpi-connect", "accès à distance", "télémaintenance", "vnc", "partage d'écran", "wayvnc", "wayfire"]
  },
  {
    title: "Guide de Câblage Physique RS485 & Modbus",
    category: "Installation",
    url: "installation.html#rs485-wiring",
    snippet: "Câblage USB vers RS485, polarité des lignes A/B, résistances de terminaison 120 Ohms, blindage des câbles et topologies de bus.",
    keywords: ["rs485", "câblage modbus", "résistance de terminaison", "polarité", "blindage", "paire torsadée", "usb vers rs485"]
  },
  {
    title: "Brochage RJ12 du Compteur Communicant P1 DSMR",
    category: "Installation",
    url: "installation.html#p1-wiring",
    snippet: "Connexions et brochage RJ12 (GND, RTS, RxD, VCC) pour les compteurs numériques intelligents en Belgique (Fluvius / ORES / RESA) et aux Pays-Bas.",
    keywords: ["compteur p1", "rj12", "pinout", "brochage", "fluvius", "ores", "resa", "dsmr", "câble p1", "rts", "gnd"]
  },

  // --- Manuel de Configuration ---
  {
    title: "Aperçu des Stratégies d'Optimisation du Site",
    category: "Configuration",
    url: "configuration.html#strategy-modes",
    snippet: "Configuration de strategy_mode : Mode Éco, Écrêtage des pointes Flandre (Tarif Capacitaire) et Zéro Injection Pays-Bas.",
    keywords: ["strategy_mode", "stratégie", "eco", "flandre", "pays-bas", "optimisation", "boucle de régulation"]
  },
  {
    title: "Stratégie Éco (Maximisation de l'Autoconsommation)",
    category: "Configuration",
    url: "configuration.html#strategy-modes",
    snippet: "Priorisation du surplus solaire pour la charge de la batterie domestique, la recharge VE solaire et l'eau chaude sanitaire.",
    keywords: ["mode éco", "autoconsommation", "surplus solaire", "recharge solaire", "excédent"]
  },
  {
    title: "Écrêtage des Pointes Flandre (Tarif Capacitaire)",
    category: "Configuration",
    url: "configuration.html#flanders-peak-shaving",
    snippet: "Écrêtage de la pointe quart-horaire glissante (15 min), capacity_peak_limit_kw, peak_shaving_buffer_w et modulation dynamique de la borne VE.",
    keywords: ["flandre", "écrêtage", "peak shaving", "tarif capacitaire", "capaciteitstarief", "capacity_peak_limit_kw", "quart-horaire", "obis 1.6.0", "bridage"]
  },
  {
    title: "Zéro Injection Pays-Bas & Bridage Actif d'Onduleur",
    category: "Configuration",
    url: "configuration.html#active-curtailment",
    snippet: "Prévention des pénalités d'injection et des prix négatifs via active_inverter_curtailment et le seuil spot dynamique min_profitable_export_price.",
    keywords: ["pays-bas", "zéro injection", "zero export", "bridage", "curtailment", "min_profitable_export_price", "prix négatifs"]
  },
  {
    title: "Arbitrage Tarifaire Dynamique EPEX Day-Ahead",
    category: "Configuration",
    url: "configuration.html#battery-arbitrage",
    snippet: "Pilotage intelligent de la batterie selon les prix spot horaires, force_charge_below_euro, force_discharge_above_euro et coût d'usure cyclique.",
    keywords: ["epex", "day-ahead", "tarifs dynamiques", "prix spot", "arbitrage", "dégradation batterie", "coût d'usure", "force_charge_below_euro"]
  },
  {
    title: "Contrats d'Énergie & Formules Fournisseurs",
    category: "Configuration",
    url: "configuration.html#energy-contracts",
    snippet: "Formules tarifaires et paramètres pour Engie Flextime, Luminus, Eneco, Frank Energie, Ecopower, EnergyZero et Enovos.",
    keywords: ["contrat d'énergie", "engie", "luminus", "eneco", "frank energie", "ecopower", "energyzero", "enovos", "tarifs", "marge"]
  },
  {
    title: "Délestage Dynamique Triphasé (DLB) & Protection Fusibles",
    category: "Configuration",
    url: "configuration.html#phase-balancing",
    snippet: "Protection du raccordement principal avec grid_nominal_current_a et phase_limit_amps par phase (L1, L2, L3).",
    keywords: ["délestage", "dlb", "équilibrage de phases", "phase_limit_amps", "grid_nominal_current_a", "protection disjoncteur", "triphasé", "déséquilibre"]
  },
  {
    title: "Relais Intelligents & Automatisation Pompe à Chaleur SG-Ready",
    category: "Configuration",
    url: "configuration.html#relay-automation",
    snippet: "Règles d'automatisation pour ballons ECS, modes PAC SG-Ready (verrouillage EVU, normal, boost, stockage thermique) et temporisateurs anti-court-cycle.",
    keywords: ["relais intelligent", "relais & commutateurs", "sg-ready", "pompe à chaleur", "chauffe-eau", "automatisation", "anti-court-cycle", "min_run_time_seconds"]
  },
  {
    title: "Alertes Webhook & Rapports E-mail SMTP",
    category: "Configuration",
    url: "configuration.html#alerts-reporting",
    snippet: "Configuration de alert_webhook_url pour les alertes à 90 % du plafond capacitaire et erreurs de communication, ainsi que SMTP pour les rapports PDF hebdomadaires.",
    keywords: ["webhook", "alert_webhook_url", "smtp", "rapports email", "rapports pdf", "notifications", "alerte capacitaire"]
  },

  // --- Manuel Utilisateur ---
  {
    title: "Tableau de Bord & Synoptique Animé des Flux d'Énergie",
    category: "Guide Utilisateur",
    url: "user-manual.html#dashboard-powerflow",
    snippet: "Visualisation en temps réel des flux énergétiques, affichage dynamique des nœuds actifs et vecteurs de puissance animés.",
    keywords: ["tableau de bord", "dashboard", "powerflow", "flux d'énergie", "temps réel", "réseau", "solaire", "batterie", "borne"]
  },
  {
    title: "Graphiques Historiques Interactifs & Comparaisons",
    category: "Guide Utilisateur",
    url: "user-manual.html#historical-charts",
    snippet: "Ouverture des courbes haute résolution en cliquant sur n'importe quel nœud, filtres temporels (1h, 24h, 7j, 30j) et superposition réseau.",
    keywords: ["graphiques historiques", "cliquer pour afficher", "séries temporelles", "comparer réseau", "zoom", "métriques", "fenêtre graphique"]
  },
  {
    title: "Jauge de Pointe Quart-Horaire (Tarif Capacitaire Flandre)",
    category: "Guide Utilisateur",
    url: "user-manual.html#flanders-gauge",
    snippet: "Jauge en temps réel de la pointe projetée sur 15 minutes, suivi OBIS 1.6.0 et badges d'état (Normal, Avertissement, Bridé).",
    keywords: ["jauge flandre", "pointe projetée", "quart d'heure", "badge d'état", "bridé", "avertissement", "tarif capacitaire"]
  },
  {
    title: "Ajout & Gestion des Appareils",
    category: "Guide Utilisateur",
    url: "user-manual.html#device-management",
    snippet: "Utilisation de l'assistant Ajouter un appareil et configuration de l'hôte Modbus, du port, de l'ID esclave et des intervalles d'interrogation.",
    keywords: ["gestion des appareils", "appareils", "ajouter appareil", "modèles", "modbus id", "poll interval", "modifier appareil"]
  },
  {
    title: "Scanner Réseau Intégré & Découverte MAC OUI",
    category: "Guide Utilisateur",
    url: "user-manual.html#network-scanner",
    snippet: "Détection automatique des onduleurs, compteurs intelligents et bornes sur le réseau local via analyse ARP et empreinte MAC OUI.",
    keywords: ["scanner réseau", "scanner", "découverte", "oui", "adresse mac", "scan sous-réseau", "détection appareils"]
  },
  {
    title: "Test de Joignabilité Modbus TCP (Tester la Connexion)",
    category: "Guide Utilisateur",
    url: "user-manual.html#modbus-probe",
    snippet: "Test en un clic pour vérifier l'accessibilité Modbus TCP et la latence de réponse (ms) avant d'enregistrer l'appareil.",
    keywords: ["tester la connexion", "sonde modbus", "latence", "joignabilité", "test tcp"]
  },
  {
    title: "Serveur de Recharge VE OCPP 1.6-J Natif",
    category: "Guide Utilisateur",
    url: "user-manual.html#ev-charging",
    snippet: "Serveur WebSocket OCPP 1.6-J embarqué sur ws://<pi-ip>:8887/<ID> et ws://<pi-ip>:8080/api/ocpp/<ID>, configuration de la borne et pilotage local autonome.",
    keywords: ["ocpp", "ocpp 1.6", "ocpp 1.6-j", "websocket", "connexion borne", "csms", "charge point id", "pilotage local", "8887", "raedian"]
  },
  {
    title: "Journal Système & Mises à Jour OTA en Un Clic",
    category: "Guide Utilisateur",
    url: "user-manual.html#logs-updates",
    snippet: "Consultation des journaux en direct, exportation journalctl et exécution transparente des mises à jour système .deb via Infos système.",
    keywords: ["journal", "logger", "journalctl", "mises à jour ota", "mise à jour système", "infos système", "version"]
  },

  // --- Serveur Cloud GRID-EMS-SERVER ---
  {
    title: "Architecture Cloud GRID-EMS-SERVER & Gestion de Flotte",
    category: "Serveur Cloud",
    url: "cloud-server.html#overview",
    snippet: "Synchronisation sécurisée des contrôleurs locaux GEMS avec la plateforme centrale de gestion de flotte GRID-EMS-SERVER (ems.newenergygrid.com).",
    keywords: ["serveur cloud", "grid-ems-server", "gestion de flotte", "fleet", "architecture", "tls", "ems.newenergygrid.com"]
  },
  {
    title: "Prérequis Réseau & Pare-feu pour la Synchronisation Cloud",
    category: "Serveur Cloud",
    url: "cloud-server.html#firewall",
    snippet: "Connexions HTTPS sortantes uniquement (port 443, TLS 1.2+) sans ouverture de port entrant ni VPN requis.",
    keywords: ["pare-feu", "firewall", "port 443", "https", "trafic sortant", "sécurité réseau", "dns", "ntp"]
  },
  {
    title: "Appairage Edge & Code d'Enregistrement (Pairing Handshake)",
    category: "Serveur Cloud",
    url: "cloud-server.html#pairing",
    snippet: "Procédure d'association d'une unité locale GEMS avec GRID-EMS-SERVER par jeton d'appairage à usage unique et authentification Bearer.",
    keywords: ["appairage", "pairing", "enregistrement", "handshake", "code d'appairage", "bearer token", "api/v1/device/register"]
  },
  {
    title: "Schéma de Télémétrie & Commandes à Distance",
    category: "Serveur Cloud",
    url: "cloud-server.html#telemetry",
    snippet: "Transmission télémétrique en temps réel (POST /api/v1/device/telemetry) et acquittement sécurisé des commandes distantes (ACK).",
    keywords: ["télémétrie", "commandes à distance", "remote commands", "command ack", "synchronisation", "schéma json"]
  },

  // --- Manuel Compteur Communicant P1 ---
  {
    title: "Guide du Port P1 Compteur Intelligent & Câble Sur Mesure",
    category: "Compteur P1",
    url: "p1-meter.html#p1-overview",
    snippet: "Guide complet pour raccorder les compteurs numériques (Fluvius e-MUCS / ORES / RESA / DSMR) via le port P1, inversion logique et câblage RJ11/RJ12.",
    keywords: ["port p1", "compteur intelligent", "compteur communicant", "fluvius", "ores", "resa", "dsmr", "e-mucs", "rj11", "rj12", "inversion signal", "ftdi"]
  },
  {
    title: "Activation du Port P1 (Fluvius / Gestionnaire de Réseau)",
    category: "Compteur P1",
    url: "p1-meter.html#port-activation",
    snippet: "Instructions étape par étape pour activer le port client P1 d'un compteur numérique belge via le portail du gestionnaire de réseau.",
    keywords: ["activer p1", "mijn fluvius", "ores p1", "resa p1", "ouvrir port utilisateur", "sagemcom", "landis+gyr"]
  },

  // --- Référence des Appareils Compatibles ---
  {
    title: "Procédure Universelle d'Intégration en 4 Étapes",
    category: "Appareils",
    url: "devices.html#onboarding-workflow",
    snippet: "Flux universel en 4 étapes : raccorder physiquement, préparer l'équipement, ajouter dans l'interface GEMS et vérifier l'état de lecture en direct.",
    keywords: ["intégration", "onboarding", "ajouter appareil", "étapes", "scanner", "découverte", "statut en ligne", "contrôle"]
  },
  {
    title: "Onduleurs Solaires & Hybrides (24 Marques & Modèles)",
    category: "Appareils",
    url: "devices.html#inverters",
    snippet: "Configuration pas à pas pour Solis Hybrid, Huawei SUN2000 (LUNA2000), SMA Sunny Boy/Tripower, Enerlution, Fronius Gen24/Symo, GoodWe, Growatt, SolarEdge, SolaX, Sungrow, Victron GX, Deye/Sunsynk, FoxESS, Sigenergy SigenStor, Alpha ESS, Anker SOLIX X1 et Enphase.",
    keywords: ["solis", "huawei", "sun2000", "luna2000", "sma", "sunny boy", "tripower", "enerlution", "fronius", "gen24", "goodwe", "growatt", "solaredge", "solax", "sofarsolar", "sungrow", "victron", "cerbo gx", "deye", "sunsynk", "foxess", "saj", "senergy", "sigenergy", "sigenstor", "alpha ess", "anker", "solix", "afore", "marstek", "lg ess", "enphase", "onduleur", "batterie", "bridage", "sunspec"]
  },
  {
    title: "Bornes de Recharge VE & Wallbox (38 Modèles)",
    category: "Appareils",
    url: "devices.html#ev-chargers",
    snippet: "OCPP 1.6-J natif universel (Raedian, Huawei FusionCharge, EVBox, Mennekes AMTRON, SMA, Schneider EVlink, Siemens VersiCharge, ABB Terra AC, Alpitronic, Autel, Hager, Fronius Wattpilot, Easee, bornes CPO externes), Modbus TCP (RAEDIAN NEO/NEX/Gemini, KEBA P30/P40, Webasto, Peblar, Phoenix Contact, Veton, ABL eM4, Enovates) et REST (go-e, SmartEVSE, Wallbox Pulsar, Zaptec).",
    keywords: ["raedian", "neo", "nex", "gemini", "ocpp", "huawei fusioncharge", "evbox", "mennekes", "amtron", "sma ev charger", "schneider", "evlink", "siemens", "versicharge", "elli", "abb", "terra ac", "alpitronic", "autel", "maxicharger", "hager", "cpo externe", "wattpilot", "easee", "keba", "p30", "p40", "webasto", "peblar", "phoenix contact", "charx", "veton", "goodwe hca", "sigenergy", "abl", "em4", "enovates", "etek", "etrel", "nrgkick", "go-e", "smartevse", "wallbox", "pulsar", "zaptec", "borne de recharge", "chargeur ve"]
  },
  {
    title: "Compteurs Réseau & Compteurs d'Énergie (26 Modèles)",
    category: "Appareils",
    url: "devices.html#smart-meters",
    snippet: "Configuration pour P1 DSMR Série (/dev/ttyUSB0), pont TCP réseau P1, HomeWizard Wi-Fi P1, Homey Energy Dongle, Shelly 3EM / Pro 3EM, Eastron (SDM120, SDM230, SDM630, SDM72D), Carlo Gavazzi (EM112, EM340, EM540, EM24), ABB, Schneider Acti9, Siemens PAC2200, SMA Energy Meter et Socomec.",
    keywords: ["p1 série", "p1 réseau", "dsmr", "fluvius", "ores", "homewizard", "homey", "shelly 3em", "shelly pro 3em", "eastron", "sdm630", "sdm230", "sdm120", "sdm72d", "smart x96", "carlo gavazzi", "em340", "em540", "em112", "em24", "abb", "schneider", "acti9", "iem3000", "pm3200", "siemens", "pac2200", "sma energy meter", "socomec", "wago", "eltako", "finder", "inepro", "lovato", "acrel", "esphome", "loxone", "niko", "compteur intelligent", "compteur réseau", "sous-compteur"]
  },
  {
    title: "Relais Intelligents & Contacteurs SG-Ready (2 Modèles)",
    category: "Appareils",
    url: "devices.html#smart-relays",
    snippet: "Configuration des Shelly Plus 1PM, Pro 1PM, Plug S et relais HTTP génériques pour pompes à chaleur SG-Ready, ballons d'eau chaude et charges thermiques selon le surplus solaire et les prix spot.",
    keywords: ["shelly plus 1pm", "shelly pro 1pm", "plug s", "relais générique", "pompe à chaleur", "sg-ready", "contacteur", "chauffe-eau", "charge thermique", "surplus solaire"]
  },
  {
    title: "Diagnostic en Direct & Vérification d'État",
    category: "Appareils",
    url: "devices.html#diagnostics",
    snippet: "Interprétation des badges d'état (En ligne, Erreur, Hors ligne), suivi des registres en temps réel dans le Journal et résolution des erreurs de lecture.",
    keywords: ["diagnostic", "badges d'état", "en ligne", "erreur", "hors ligne", "journal", "registres", "contrôle de santé"]
  },

  // --- Dépannage ---
  {
    title: "Dépannage Modbus TCP & RTU",
    category: "Dépannage",
    url: "troubleshooting.html#modbus-troubleshooting",
    snippet: "Résolution des erreurs connexion refusée (connection refused), délais d'attente (timeout), ID esclave incorrect, terminaison RS485 et erreurs de bus.",
    keywords: ["erreur modbus", "connection refused", "timeout", "erreur slave id", "erreur rs485", "erreur de bus", "communication"]
  },
  {
    title: "Problèmes de Communication du Compteur P1",
    category: "Dépannage",
    url: "troubleshooting.html#p1-troubleshooting",
    snippet: "Diagnostic des débits DSMR (9600 vs 115200 bauds), parité série, câbles sans inversion de signal et activation du port client P1.",
    keywords: ["erreur p1", "débit dsmr", "baud rate", "activation fluvius", "télégramme p1", "aucune donnée", "baud 115200"]
  },
  {
    title: "Diagnostic de Connexion des Bornes VE OCPP",
    category: "Dépannage",
    url: "troubleshooting.html#ocpp-troubleshooting",
    snippet: "Correction des rejets WebSocket, discordances d'identifiant ChargePoint ID, ports bloqués par pare-feu et mode de repli sécurisé hors ligne.",
    keywords: ["erreur ocpp", "erreur websocket", "chargepoint id", "borne hors ligne", "handshake rejeté", "port 8080", "port 8887"]
  },
  {
    title: "SSD NVMe Non Détecté & Diagnostic Bootloader",
    category: "Dépannage",
    url: "troubleshooting.html#nvme-troubleshooting",
    snippet: "Dépannage de la détection SSD NVMe sur Raspberry Pi 5, nappe PCIe, sous-tension d'alimentation 27 W, lspci et configuration EEPROM.",
    keywords: ["erreur nvme", "ssd non détecté", "pcieport link down", "nvme ssd", "pi 5 nvme", "écran noir", "bootloader", "lspci", "lsblk", "rpi-eeprom-config"]
  },
  {
    title: "Diagnostic SQLite & Santé du Stockage",
    category: "Dépannage",
    url: "troubleshooting.html#sd-card-sqlite",
    snippet: "Vérification du mode SQLite WAL, endurance d'écriture sur carte SD et NVMe, écritures groupées et intégrité de la base de données.",
    keywords: ["sqlite wal", "usure carte sd", "base corrompue", "batch write", "espace disque", "rétention", "santé nvme"]
  },
  {
    title: "Foire Aux Questions (FAQ)",
    category: "Dépannage",
    url: "troubleshooting.html#faq",
    snippet: "Réponses aux questions fréquentes sur l'absence volontaire d'API véhicule, le temps de réaction zéro injection, l'actualisation des prix et l'accès Cockpit.",
    keywords: ["faq", "questions fréquentes", "pourquoi pas d'api voiture", "mode hors ligne", "mot de passe cockpit", "échec mise à jour"]
  },

  // --- Manuel Huawei SUN2000, LUNA2000 & FusionSolar ---
  {
    title: "Guide Complet Huawei SUN2000, LUNA2000 & FusionSolar",
    category: "Manuel Huawei",
    url: "huawei.html",
    snippet: "Manuel complet de mise en service pour onduleurs Huawei SUN2000, batteries LUNA2000, SDongleA-05, EMMA-A02, réglages FusionSolar et optimisation GEMS.",
    keywords: ["huawei", "sun2000", "luna2000", "fusionsolar", "sdongle", "sdonglea-05", "emma", "emma-a02", "dtsu666-h", "ddsu666-h", "huawei_inverter", "huawei_emma"]
  },
  {
    title: "Réglages App FusionSolar : Déverrouiller Modbus TCP & LUNA2000",
    category: "Manuel Huawei",
    url: "huawei.html#fusionsolar-app",
    snippet: "Chemins exacts de mise en service dans FusionSolar : activer Modbus-TCP (sans restriction), désactiver TLS EMMA-A02 & IP client, Autoconsommation maximale LUNA2000 et Charge AC.",
    keywords: ["application fusionsolar", "modbus tcp sans restriction", "mise en service", "charge depuis ac", "autoconsommation maximale", "end-of-discharge soc", "chiffrement tls", "contrôle puissance active"]
  },
  {
    title: "Configuration Optimale GEMS pour Onduleurs Huawei & LUNA2000",
    category: "Manuel Huawei",
    url: "huawei.html#gems-optimization",
    snippet: "Bonnes pratiques GEMS pour Huawei : intervalle 10 s, écrêtage capacitaire Flandre, protection certificats verts, coût d'usure 0,04 EUR/kWh, repli hivernal et maintien batterie lors de la charge VE.",
    keywords: ["paramètres gems huawei", "poll interval 10", "coût usure batterie", "repli hivernal", "décharge batterie ve", "hold rule", "écrêtage huawei"]
  },

  // --- Manuel Solis Retrofit / Hybride & Batterie Easyway UNIV5200 ---
  {
    title: "Guide Complet Onduleurs Solis Retrofit / Hybrides & Batterie Easyway 5200 (UNIV5200)",
    category: "Manuel Solis & Easyway",
    url: "solis.html",
    snippet: "Manuel détaillé de câblage, compteurs Eastron SDM72D-M & SDM630-M, mise en service SolisCloud et optimisation GEMS pour Solis RAI-3K, S6-EA1P, S5-EH1P, S6-EH1P et S6-EH3P-L avec batteries LiFePO4 51,2 V Easyway UNIV5200.",
    keywords: ["solis", "easyway", "univ5200", "univ-5200", "easyway 5200", "solis_hybrid", "solis_retrofit", "solis_retrofit_battery", "rai-3k", "s6-ea1p", "s6-eh1p", "s6-eh3p-l", "51.2v", "sdm72d-m", "sdm630-m"]
  },
  {
    title: "Raccordement & Configuration des Compteurs Eastron SDM72D-M ou SDM630-M (Solis & GEMS)",
    category: "Manuel Solis & Easyway",
    url: "solis.html#eastron-meter",
    snippet: "Borniers AC pas à pas (Haut 1-4 Réseau IN, Bas 5-8 Charges OUT), brochage RS-485 A+/B- vers RJ45 Meter Solis ou USB-RS485 GEMS, configuration LCD (Mot de passe 1000, Adresse 001, 9600 8N1) et modèles GEMS.",
    keywords: ["sdm72d-m", "sdm72d-m-2", "sdm630-m", "sdm630-modbus", "sdm630mct", "eastron", "eastron_sdm72_x96", "eastron_sdm630", "port compteur solis", "meter_comm_fail", "mot de passe 1000", "eastron 3p"]
  },
  {
    title: "Câblage Batterie Easyway UNIV5200 vers Onduleur Solis (DC, Brochage CAN & DIP Switches)",
    category: "Manuel Solis & Easyway",
    url: "solis.html#battery-wiring",
    snippet: "Câblage DC parallèle diagonal & jeux de barres, disjoncteurs DC non polarisés, RJ45 CAN Broche 4 (CAN-H) & Broche 5 (CAN-L), table binaire ADD DIP (1-16 packs) et séquence de précharge.",
    keywords: ["câblage univ5200", "câblage easyway", "brochage can", "pin 4 can-h", "pin 5 can-l", "add dip switch", "câblage batterie parallèle", "disjoncteur dc", "séquence précharge"]
  },
  {
    title: "Mise en Service App SolisCloud & Réglages Optimaux GEMS pour Solis + UNIV5200",
    category: "Manuel Solis & Easyway",
    url: "solis.html#soliscloud-settings",
    snippet: "Réglages Bluetooth local SolisCloud : sélection batterie Modèle Lithium Battery LV (et NON PYLON LV), Overdischarge SOC 10 %, Forcecharge SOC 5 %, Autoconsommation, Autoriser charge réseau, RS-485 / S2-WL-ST et règles GEMS.",
    keywords: ["application soliscloud", "local debugging", "lithium battery lv", "battery select", "overdischarge soc", "forcecharge soc", "allow grid charging", "charge réseau", "s2-wl-st", "can_comm_fail", "réglages gems solis"]
  },

  // --- Manuel Onduleurs Hybrides Enerlution & Batteries LiFePO4 ---
  {
    title: "Guide Complet Onduleurs Hybrides Enerlution & Stockage LiFePO4",
    category: "Manuel Enerlution",
    url: "enerlution.html",
    snippet: "Manuel complet de câblage, mise en service App Enerlution et optimisation GEMS pour onduleurs Enerlution HY & HYTH avec batteries 51,2 V BT (LFPWall-5000, LFPWall-10K-V2, Roller-16K) et empilables HT (GroundHV-2500, GH02-5324).",
    keywords: ["enerlution", "enerlution_inverter", "lfpwall", "lfpwall-5000", "lfpwall-10k-v2", "roller-16k", "groundhv", "groundhv-2500", "gh02-5324", "hyth", "hyth-10k", "l3-l12"]
  },
  {
    title: "Câblage Batteries Enerlution BT Parallèles & HT Empilables, Brochage CAN & Compteur DTSU666",
    category: "Manuel Enerlution",
    url: "enerlution.html#battery-wiring",
    snippet: "Câblage parallèle 51,2 V BT, assemblage série PDU/BCU HT, RJ45 CAN Broche 4 (CAN-H) & Broche 5 (CAN-L), commutateurs DIP binaires ADD, CHINT DTSU666 bornes 24/25 et séquence de précharge.",
    keywords: ["câblage enerlution", "câblage lfpwall", "câblage groundhv", "hv pdu", "bcu", "msd plug", "dtsu666 pin 24 25", "sdm630", "brochage can enerlution", "dip switch enerlution"]
  },
  {
    title: "Mise en Service App Enerlution & Bridage Solaire GEMS au Watt Près",
    category: "Manuel Enerlution",
    url: "enerlution.html#enerlution-app",
    snippet: "Paramètres installateur App Enerlution : Lithium-Ion (CAN), mode Autoconsommation, SOC de réserve 10 %, Contrôle de puissance active, découverte MAC OUI (70:B3:D5 / E4:5F:01) et bridage solaire 1 Watt.",
    keywords: ["application enerlution", "autoconsommation", "bridage 1 watt", "curtailment", "40400", "40441", "70:b3:d5", "e4:5f:01", "réglages gems enerlution"]
  }
];
