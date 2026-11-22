/**
 * GEMS (New Energy Grid) Documentatie Zoekindex — Nederlands (NL)
 * Biedt directe client-side full-text zoekfunctionaliteit over alle Nederlandstalige documentatiepagina's.
 */
window.DOCS_SEARCH_INDEX = [
  // --- Overzicht & Documentatiehub ---
  {
    title: "Documentatieoverzicht & Systeemarchitectuur",
    category: "Overzicht",
    url: "index.html",
    snippet: "Hoogover-architectuur van GEMS (New Energy Grid), monolithische Go-backend, Vue 3 SPA, SQLite WAL-opslag en systeemoverzicht.",
    keywords: ["overzicht", "architectuur", "monoliet", "golang", "vue3", "sqlite", "wal", "raspberry pi", "introductie", "handleiding"]
  },
  {
    title: "Systeem- en Hardwarevereisten",
    category: "Overzicht",
    url: "index.html#requirements",
    snippet: "Hardwarecompatibiliteitsmatrix voor Raspberry Pi 3B+, 4B, 5 en Zero 2W, slijtage-optimalisatie voor SD-kaart en geheugengebruik.",
    keywords: ["hardware", "systeemvereisten", "raspberry pi", "sd-kaart", "ram", "arm64", "debian", "bookworm", "specificaties"]
  },
  {
    title: "Snelstartgids in 5 Minuten",
    category: "Overzicht",
    url: "index.html#quickstart",
    snippet: "Snelle installatiegids om het OS-image te flashen, de Raspberry Pi op te starten en de webinterface te openen via ems.local.",
    keywords: ["snelstart", "quickstart", "aan de slag", "eerste opstart", "ems.local", "snelle installatie"]
  },
  {
    title: "Rendement & Terugverdientijd (ROI-brochure PDF)",
    category: "Overzicht",
    url: "../../docs/nl/GRID-EMS-Return-On-Investment-nl.pdf",
    snippet: "Financiële analyse voor residentiële en KMO-installaties: besparing op Vlaams capaciteitstarief, verhoging van zelfverbruik en terugverdientijd.",
    keywords: ["roi", "rendement", "terugverdientijd", "besparing", "businesscase", "brochure", "capaciteitstarief", "zelfverbruik", "pdf"]
  },
  {
    title: "Beste Strategie per Land & Installatie (Strategiegids PDF)",
    category: "Overzicht",
    url: "../../docs/nl/GRID-EMS-Strategy-Guide-nl.pdf",
    snippet: "Visuele keuzegids in 4 pagina's: beslissingsschema in 10 seconden, Land x Contractmatrix (Vlaanderen, Wallonië, Brussel, Nederland, Duitsland), 6 1-Klik profielen en opstellingen per installatietype.",
    keywords: ["strategiegids", "beste strategie", "land", "vlaanderen", "wallonië", "nederland", "duitsland", "installatie", "1-klik profiel", "pdf"]
  },

  // --- Installatiehandleiding ---
  {
    title: "Officiële Geteste Referentiehardware (BOM)",
    category: "Installatie",
    url: "installation.html#hardware-reference",
    snippet: "Stuklijst (BOM) voor Raspberry Pi 5 4GB NVMe-referentiehardware, M.2 NVMe SSD, officiële 27W USB-C PD-voeding en RS485/P1-pinbezetting.",
    keywords: ["hardware", "raspberry pi 5", "nvme ssd", "27w voeding", "bom", "stuklijst", "referentiekit", "m.2 2280", "rpi 5 kit"]
  },
  {
    title: "NVMe M.2 SSD-installatie & EEPROM-bootloaderconfiguratie",
    category: "Installatie",
    url: "installation.html#nvme-setup",
    snippet: "Oplossen van NVMe SSD-detectie op Raspberry Pi 5, BOOT_ORDER=0xf461, PCIE_PROBE=1, dtparam=pciex1, Raspberry Pi Imager EEPROM-hulpprogramma en flashen met dd.",
    keywords: ["nvme installatie", "nvme ssd", "eeprom", "boot order", "opstartvolgorde", "pcie_probe", "dtparam=pciex1", "pciex1_gen", "imager bootloader", "ssd niet herkend", "m.2 boot"]
  },
  {
    title: "Aangepast Raspberry Pi OS-image (Aanbevolen)",
    category: "Installatie",
    url: "installation.html#custom-os-image",
    snippet: "Het vooraf geconfigureerde Bookworm ARM64 OS-image flashen met BalenaEtcher of Raspberry Pi Imager. Direct gebruiksklare kioskmodus en Cockpit.",
    keywords: ["os image", "aangepast image", "balenaetcher", "raspberry pi imager", "sd-kaart flashen", "bookworm", "img.xz"]
  },
  {
    title: "Debian-pakket (.deb) Installatie",
    category: "Installatie",
    url: "installation.html#deb-package",
    snippet: "GEMS installeren op bestaande Debian- of Ubuntu ARM64-systemen via dpkg -i gems_*_arm64.deb en het beheren van gems.service.",
    keywords: ["deb", "debian", "dpkg", "apt", "pakket", "systemd", "gems.service", "ubuntu", "installeren"]
  },
  {
    title: "Cockpit Webterminal & Systeembeheer",
    category: "Installatie",
    url: "installation.html#cockpit",
    snippet: "Toegang tot de Cockpit-webinterface op poort 9090 met de ingestelde Linux-beheerdersgegevens voor terminaltoegang en servicediagnose.",
    keywords: ["cockpit", "poort 9090", "terminal", "inloggegevens", "ssh", "systemctl", "logboek"]
  },
  {
    title: "Raspberry Pi Connect Toegang op Afstand",
    category: "Installatie",
    url: "installation.html#rpi-connect",
    snippet: "Raspberry Pi Connect koppelen (rpi-connect signin) voor versleutelde externe terminaltoegang en ondersteuning op afstand zonder VPN of port forwarding.",
    keywords: ["raspberry pi connect", "rpi-connect", "toegang op afstand", "remote access", "vnc", "scherm delen", "wayvnc", "wayfire"]
  },
  {
    title: "RS485 & Modbus Fysieke Bekabelingsgids",
    category: "Installatie",
    url: "installation.html#rs485-wiring",
    snippet: "USB-naar-RS485-bekabeling, A/B-lijnpoolrichting, 120 Ohm afsluitweerstanden, kabelafscherming en bustopologieën.",
    keywords: ["rs485", "modbus bekabeling", "afsluitweerstand", "polariteit", "afscherming", "twisted pair", "usb naar rs485"]
  },
  {
    title: "P1 DSMR Slimme Meter RJ12-pinbezetting",
    category: "Installatie",
    url: "installation.html#p1-wiring",
    snippet: "RJ12-pinaansluitingen (GND, RTS, RxD, VCC) voor digitale slimme meters in België (Fluvius) en Nederland.",
    keywords: ["p1 meter", "rj12", "pinout", "pinbezetting", "fluvius", "dsmr", "slimme meterkabel", "rts", "gnd"]
  },

  // --- Configuratiehandleiding ---
  {
    title: "Overzicht Optimalisatiestrategieën",
    category: "Configuratie",
    url: "configuration.html#strategy-modes",
    snippet: "Configuratie van strategy_mode: Eco-modus, Vlaams Capaciteitstarief (piekafvlakking) en Nederland Nul-op-de-Meter (Zero-Export).",
    keywords: ["strategy_mode", "strategie", "eco", "vlaanderen", "nederland", "optimalisatie", "regellus"]
  },
  {
    title: "Eco-strategie (Maximalisatie van Zelfverbruik)",
    category: "Configuratie",
    url: "configuration.html#strategy-modes",
    snippet: "Zonne-overschot prioriteren voor het laden van de thuisbatterij, slim EV-laden en sanitair warm water.",
    keywords: ["eco modus", "zelfverbruik", "eigenverbruik", "zonne-overschot", "groen laden", "surplus"]
  },
  {
    title: "Vlaams Capaciteitstarief & Piekafvlakking",
    category: "Configuratie",
    url: "configuration.html#flanders-peak-shaving",
    snippet: "Piekafvlakking op basis van het voortschrijdend kwartiergemiddelde (15 min), capacity_peak_limit_kw, peak_shaving_buffer_w en dynamische EV-afregeling.",
    keywords: ["vlaanderen", "piekafvlakking", "peak shaving", "capaciteitstarief", "capacity_peak_limit_kw", "kwartierpiek", "obis 1.6.0", "afregeling"]
  },
  {
    title: "Nederland Zero-Export & Actieve Omvormerterugregeling",
    category: "Configuratie",
    url: "configuration.html#active-curtailment",
    snippet: "Terugleverkosten en negatieve prijzen vermijden met active_inverter_curtailment en dynamische drempelwaarde min_profitable_export_price.",
    keywords: ["nederland", "zero export", "nul op de meter", "saldering", "terugregeling", "curtailment", "min_profitable_export_price", "negatieve prijzen", "terugleverkosten"]
  },
  {
    title: "Day-Ahead EPEX Spotprijs-arbitrage",
    category: "Configuratie",
    url: "configuration.html#battery-arbitrage",
    snippet: "Dynamisch laden en ontladen van de thuisbatterij op basis van uurprijzen, force_charge_below_euro, force_discharge_above_euro en slijtagekostmodellering.",
    keywords: ["epex", "day-ahead", "dynamische tarieven", "spotprijzen", "arbitrage", "batterijslijtage", "wear cost", "force_charge_below_euro"]
  },
  {
    title: "Energiecontracten & Leveranciersformules",
    category: "Configuratie",
    url: "configuration.html#energy-contracts",
    snippet: "Prijsformules en opslaginstellingen voor Engie Flextime, Luminus, Eneco, Frank Energie, Ecopower, EnergyZero en Enovos.",
    keywords: ["energiecontract", "engie", "luminus", "eneco", "frank energie", "ecopower", "energyzero", "enovos", "tarieven", "opslag"]
  },
  {
    title: "3-Fasige Fasebewuste Load Balancing & Zekeringbeveiliging",
    category: "Configuratie",
    url: "configuration.html#phase-balancing",
    snippet: "Beveiliging van de hoofdaansluiting met grid_nominal_current_a en phase_limit_amps per fase (L1, L2, L3).",
    keywords: ["load balancing", "dlb", "fasebewaking", "phase_limit_amps", "grid_nominal_current_a", "zekeringbeveiliging", "3-fasig", "onbalans"]
  },
  {
    title: "Slimme Relais & SG-Ready Warmtepompautomatisering",
    category: "Configuratie",
    url: "configuration.html#relay-automation",
    snippet: "Automatiseringsregels voor boilers, SG-Ready warmtepompmodi (EVU-blokkering, normaal, boost, bufferopslag) en pendelbeveiligingstimers.",
    keywords: ["slim relais", "relais & schakelaars", "sg-ready", "warmtepomp", "boiler", "automatisering", "anti-short-cycle", "min_run_time_seconds"]
  },
  {
    title: "Webhookmeldingen & SMTP E-mailrapportage",
    category: "Configuratie",
    url: "configuration.html#alerts-reporting",
    snippet: "Configuratie van alert_webhook_url voor waarschuwingen bij 90% capaciteitspiek en communicatiefouten, plus SMTP-instellingen voor wekelijkse PDF-rapporten.",
    keywords: ["webhook", "alert_webhook_url", "smtp", "e-mailrapporten", "pdf-rapporten", "meldingen", "capaciteitswaarschuwing"]
  },

  // --- Gebruikershandleiding ---
  {
    title: "Dashboard & Interactief Energiestroomdiagram (PowerFlow)",
    category: "Gebruikersgids",
    url: "user-manual.html#dashboard-powerflow",
    snippet: "Realtime visualisatie van energiestromen op het dashboard, dynamische weergave van actieve knooppunten en geanimeerde vermogensvectoren.",
    keywords: ["dashboard", "powerflow", "energiestroom", "realtime vermogen", "net", "zonnepanelen", "batterij", "laadpaal"]
  },
  {
    title: "Klikbare Historische Grafieken & Vergelijkingslagen",
    category: "Gebruikersgids",
    url: "user-manual.html#historical-charts",
    snippet: "Tijdreeksgrafieken in hoge resolutie openen door op een knooppunt te klikken, resolutiefilters (1u, 24u, 7d, 30d) en netvergelijking.",
    keywords: ["historische grafieken", "klik om te openen", "tijdreeksen", "net vergelijken", "zoom", "metrieken", "grafiekvenster"]
  },
  {
    title: "Meter voor Vlaamse Kwartierpiek (Capaciteitstarief)",
    category: "Gebruikersgids",
    url: "user-manual.html#flanders-gauge",
    snippet: "Realtime meter voor verwachte 15-minuten kwartierpiek, OBIS 1.6.0-opvolging en statusbadges (Normaal, Waarschuwing, Afgeregeld).",
    keywords: ["kwartierpiekmeter", "verwachte piek", "kwartieruur", "statusbadge", "afgeregeld", "waarschuwing", "capaciteitstarief"]
  },
  {
    title: "Toestellen Toevoegen & Beheren",
    category: "Gebruikersgids",
    url: "user-manual.html#device-management",
    snippet: "De wizard Toestel toevoegen gebruiken en Modbus-host, poort, Slave ID en uitleesintervallen configureren.",
    keywords: ["toestembeheer", "toestellen", "toestel toevoegen", "sjablonen", "modbus id", "poll interval", "toestel bewerken"]
  },
  {
    title: "Ingebouwde Netwerkscanner & MAC OUI-detectie",
    category: "Gebruikersgids",
    url: "user-manual.html#network-scanner",
    snippet: "Lokale omvormers, slimme meters en laadpalen automatisch vinden op het LAN via ARP-scanning en MAC OUI-herkenning.",
    keywords: ["netwerkscanner", "scanner", "detectie", "oui", "mac-adres", "subnetscan", "toestellen zoeken"]
  },
  {
    title: "Modbus TCP Bereikbaarheidstest (Verbinding Testen)",
    category: "Gebruikersgids",
    url: "user-manual.html#modbus-probe",
    snippet: "Verbindingstest met één klik om Modbus TCP-bereikbaarheid en responstijd (ms) te controleren vóór het opslaan.",
    keywords: ["verbinding testen", "modbus test", "latentie", "bereikbaarheid", "tcp-test"]
  },
  {
    title: "Ingebouwde OCPP 1.6-J Laadpaalserver",
    category: "Gebruikersgids",
    url: "user-manual.html#ev-charging",
    snippet: "Geïntegreerde OCPP 1.6-J WebSocket-server op ws://<pi-ip>:8887/<ID> en ws://<pi-ip>:8080/api/ocpp/<ID>, laadpaalconfiguratie en lokale aansturing zonder cloudafhankelijkheid.",
    keywords: ["ocpp", "ocpp 1.6", "ocpp 1.6-j", "websocket", "laadpaal verbinden", "csms", "charge point id", "lokale sturing", "8887", "raedian"]
  },
  {
    title: "Systeemlogboek & Over-The-Air (OTA) Updates met Één Klik",
    category: "Gebruikersgids",
    url: "user-manual.html#logs-updates",
    snippet: "Realtime logboeken bekijken, journalctl exporteren en naadloze .deb-systeemupdates uitvoeren via Systeeminformatie.",
    keywords: ["logboek", "logger", "journalctl", "ota updates", "systeemupdate", "systeeminformatie", "versie"]
  },

  // --- GRID-EMS-SERVER Cloudkoppeling ---
  {
    title: "GRID-EMS-SERVER Cloudarchitectuur & Vlootbeheer",
    category: "Cloudserver",
    url: "cloud-server.html#overview",
    snippet: "Beveiligde koppeling van lokale GEMS edge-units met het centrale vlootbeheerplatform GRID-EMS-SERVER (ems.newenergygrid.com).",
    keywords: ["cloudserver", "grid-ems-server", "vlootbeheer", "fleet", "architectuur", "tls", "ems.newenergygrid.com"]
  },
  {
    title: "Netwerk- & Firewallvereisten voor Cloudsynchronisatie",
    category: "Cloudserver",
    url: "cloud-server.html#firewall",
    snippet: "Uitsluitend uitgaande HTTPS-verbindingen (poort 443, TLS 1.2+) zonder inkomende port forwarding of VPN-vereisten.",
    keywords: ["firewall", "poort 443", "https", "uitgaand verkeer", "netwerkbeveiliging", "dns", "ntp"]
  },
  {
    title: "Edge-registratie & Koppelingscode (Pairing Handshake)",
    category: "Cloudserver",
    url: "cloud-server.html#pairing",
    snippet: "Stapsgewijze koppeling van een lokale GEMS-controller met GRID-EMS-SERVER via een eenmalige koppelingstoken en Bearer API-authenticatie.",
    keywords: ["koppelen", "pairing", "registratie", "handshake", "koppelcode", "bearer token", "api/v1/device/register"]
  },
  {
    title: "Telemetrieschema & Externe Opdrachten op Afstand",
    category: "Cloudserver",
    url: "cloud-server.html#telemetry",
    snippet: "Realtime telemetrie-overdracht (POST /api/v1/device/telemetry) en verwerking van externe commando's met ACK-bevestiging.",
    keywords: ["telemetrie", "remote commands", "opdrachten op afstand", "command ack", "synchronisatie", "json schema"]
  },

  // --- P1 Slimme Meter Handleiding ---
  {
    title: "P1-poort Slimme Meter & Zelfbouwkabel Handleiding",
    category: "P1-meter",
    url: "p1-meter.html#p1-overview",
    snippet: "Volledige gids voor het aansluiten van digitale elektriciteitsmeters (Fluvius e-MUCS / DSMR) via de P1-poort, signaalinversie en RJ11/RJ12-bekabeling.",
    keywords: ["p1-poort", "slimme meter", "digitale meter", "fluvius", "dsmr", "e-mucs", "rj11", "rj12", "signaalinversie", "ftdi"]
  },
  {
    title: "Fluvius P1-poort Activeren (Mijn Fluvius)",
    category: "P1-meter",
    url: "p1-meter.html#port-activation",
    snippet: "Stapsgewijze instructies om de gebruikerspoort (P1) van een Belgische Fluvius digitale meter te activeren via mijn.fluvius.be.",
    keywords: ["fluvius activeren", "mijn fluvius", "gebruikerspoort openen", "p1 activeren", "sagemcom", "landis+gyr"]
  },

  // --- Ondersteunde Toestellen ---
  {
    title: "Universele 4-Stappen Onboarding voor Toestellen",
    category: "Toestellen",
    url: "devices.html#onboarding-workflow",
    snippet: "Universeel 4-stappenplan: fysiek aansluiten, hardware voorbereiden, toevoegen in de GEMS-interface en realtime uitlezing controleren.",
    keywords: ["onboarding", "toestel toevoegen", "stappenplan", "scanner", "detectie", "online status", "controle"]
  },
  {
    title: "Zonne- & Hybride Omvormers (24 Merken & Sjablonen)",
    category: "Toestellen",
    url: "devices.html#inverters",
    snippet: "Stapsgewijze configuratie voor Solis Hybrid, Huawei SUN2000 (LUNA2000), SMA Sunny Boy/Tripower, Enerlution, Fronius Gen24/Symo, GoodWe, Growatt, SolarEdge, SolaX, Sungrow, Victron GX, Deye/Sunsynk, FoxESS, Sigenergy SigenStor, Alpha ESS, Anker SOLIX X1 en Enphase.",
    keywords: ["solis", "huawei", "sun2000", "luna2000", "sma", "sunny boy", "tripower", "enerlution", "fronius", "gen24", "goodwe", "growatt", "solaredge", "solax", "sofarsolar", "sungrow", "victron", "cerbo gx", "deye", "sunsynk", "foxess", "saj", "senergy", "sigenergy", "sigenstor", "alpha ess", "anker", "solix", "afore", "marstek", "lg ess", "enphase", "omvormer", "thuisbatterij", "terugregeling", "sunspec"]
  },
  {
    title: "EV-laadpalen & Wallboxen (38 Sjablonen)",
    category: "Toestellen",
    url: "devices.html#ev-chargers",
    snippet: "Universele ingebouwde OCPP 1.6-J (Raedian, Huawei FusionCharge, EVBox, Mennekes AMTRON, SMA, Schneider EVlink, Siemens VersiCharge, ABB Terra AC, Alpitronic, Autel, Hager, Fronius Wattpilot, Easee, externe CPO-laadpalen), Modbus TCP (RAEDIAN NEO/NEX/Gemini, KEBA P30/P40, Webasto, Peblar, Phoenix Contact, Veton, ABL eM4, Enovates) en REST (go-e, SmartEVSE, Wallbox Pulsar, Zaptec).",
    keywords: ["raedian", "neo", "nex", "gemini", "ocpp", "huawei fusioncharge", "evbox", "mennekes", "amtron", "sma ev charger", "schneider", "evlink", "siemens", "versicharge", "elli", "abb", "terra ac", "alpitronic", "autel", "maxicharger", "hager", "externe cpo", "wattpilot", "easee", "keba", "p30", "p40", "webasto", "peblar", "phoenix contact", "charx", "veton", "goodwe hca", "sigenergy", "abl", "em4", "enovates", "etek", "etrel", "nrgkick", "go-e", "smartevse", "wallbox", "pulsar", "zaptec", "laadpaal", "ev lader"]
  },
  {
    title: "Net- & Slimme Energiemeters (26 Sjablonen)",
    category: "Toestellen",
    url: "devices.html#smart-meters",
    snippet: "Configuratie voor P1 DSMR Serieel (/dev/ttyUSB0), P1 Netwerk TCP-bridge, HomeWizard Wi-Fi P1, Homey Energy Dongle, Shelly 3EM / Pro 3EM, Eastron (SDM120, SDM230, SDM630, SDM72D), Carlo Gavazzi (EM112, EM340, EM540, EM24), ABB, Schneider Acti9, Siemens PAC2200, SMA Energy Meter en Socomec.",
    keywords: ["p1 serieel", "p1 netwerk", "dsmr", "fluvius", "homewizard", "homey", "shelly 3em", "shelly pro 3em", "eastron", "sdm630", "sdm230", "sdm120", "sdm72d", "smart x96", "carlo gavazzi", "em340", "em540", "em112", "em24", "abb", "schneider", "acti9", "iem3000", "pm3200", "siemens", "pac2200", "sma energy meter", "socomec", "wago", "eltako", "finder", "inepro", "lovato", "acrel", "esphome", "loxone", "niko", "slimme meter", "netmeter", "energiemeter"]
  },
  {
    title: "Slimme Relais & SG-Ready Schakelaars (2 Sjablonen)",
    category: "Toestellen",
    url: "devices.html#smart-relays",
    snippet: "Configuratie van Shelly Plus 1PM, Pro 1PM, Plug S en generieke HTTP-relais voor SG-Ready warmtepompen, boilers en thermische verbruikers op basis van zonne-overschot en uurprijzen.",
    keywords: ["shelly plus 1pm", "shelly pro 1pm", "plug s", "generiek relais", "warmtepomp", "sg-ready", "contactor", "boiler", "thermische belasting", "zonne-overschot"]
  },
  {
    title: "Live Diagnose & Gezondheidscontrole",
    category: "Toestellen",
    url: "devices.html#diagnostics",
    snippet: "Statusbadges interpreteren (Online, Fout, Offline), realtime registeruitlezing volgen in het Logboek en communicatiefouten verhelpen.",
    keywords: ["diagnose", "statusbadges", "online", "fout", "offline", "logboek", "registers", "gezondheidscontrole"]
  },

  // --- Probleemoplossing ---
  {
    title: "Modbus TCP & RTU Probleemoplossing",
    category: "Probleemoplossing",
    url: "troubleshooting.html#modbus-troubleshooting",
    snippet: "Oplossen van geweigerde verbindingen (connection refused), time-outs, verkeerde Slave ID's, RS485-afsluitweerstanden en busfouten.",
    keywords: ["modbus fout", "connection refused", "timeout", "slave id fout", "rs485 fout", "busfout", "communicatiefout"]
  },
  {
    title: "P1 Slimme Meter Communicatieproblemen",
    category: "Probleemoplossing",
    url: "troubleshooting.html#p1-troubleshooting",
    snippet: "Diagnose van DSMR-baudrates (9600 vs. 115200), pariteitsinstellingen, niet-geïnverteerde signaalkabels en Fluvius-poortactivatie.",
    keywords: ["p1 fout", "dsmr baudrate", "fluvius activatie", "p1 telegram", "geen data", "baud 115200"]
  },
  {
    title: "OCPP EV-laadpaal Verbindingsdiagnose",
    category: "Probleemoplossing",
    url: "troubleshooting.html#ocpp-troubleshooting",
    snippet: "Herstellen van WebSocket-handshakefouten, niet-overeenkomende ChargePoint ID's, geblokkeerde poorten en veilige offline terugvalmodus.",
    keywords: ["ocpp fout", "websocket fout", "chargepoint id", "laadpaal offline", "handshake geweigerd", "poort 8080", "poort 8887"]
  },
  {
    title: "NVMe SSD Niet Herkend & Bootloaderdiagnose",
    category: "Probleemoplossing",
    url: "troubleshooting.html#nvme-troubleshooting",
    snippet: "Probleemoplossing voor NVMe SSD-detectie op Raspberry Pi 5, PCIe-flatkabelmontage, 27W voedingsspanning, lspci en EEPROM-instellingen.",
    keywords: ["nvme fout", "ssd niet gedetecteerd", "pcieport link down", "nvme ssd", "pi 5 nvme", "zwart scherm", "bootloader", "lspci", "lsblk", "rpi-eeprom-config"]
  },
  {
    title: "SQLite & Opslaggezondheid Diagnose",
    category: "Probleemoplossing",
    url: "troubleshooting.html#sd-card-sqlite",
    snippet: "Controleren van SQLite WAL-modus, schrijfbelasting op SD-kaart en NVMe, gebatchte schrijfbewerkingen en database-integriteit.",
    keywords: ["sqlite wal", "sd-kaart slijtage", "database beschadigd", "batch write", "schijfruimte", "retentie", "nvme gezondheid"]
  },
  {
    title: "Veelgestelde Vragen (FAQ)",
    category: "Probleemoplossing",
    url: "troubleshooting.html#faq",
    snippet: "Antwoorden op veelgestelde vragen over het bewust weglaten van wagen-API's, reactietijd bij zero-export, prijsupdates en Cockpit-toegang.",
    keywords: ["faq", "veelgestelde vragen", "waarom geen auto api", "offline modus", "cockpit wachtwoord", "update mislukt"]
  },

  // --- Huawei SUN2000, LUNA2000 & FusionSolar Handleiding ---
  {
    title: "Huawei SUN2000, LUNA2000 & FusionSolar Volledige Gids",
    category: "Huawei Handleiding",
    url: "huawei.html",
    snippet: "Uitgebreide inbedrijfstellingshandleiding voor Huawei SUN2000-omvormers, LUNA2000-batterijen, SDongleA-05, EMMA-A02, FusionSolar-app en optimale GEMS-configuratie.",
    keywords: ["huawei", "sun2000", "luna2000", "fusionsolar", "sdongle", "sdonglea-05", "emma", "emma-a02", "dtsu666-h", "ddsu666-h", "huawei_inverter", "huawei_emma"]
  },
  {
    title: "FusionSolar-app Instellingen: Modbus TCP & LUNA2000 Vrijgeven",
    category: "Huawei Handleiding",
    url: "huawei.html#fusionsolar-app",
    snippet: "Exacte menupaden in FusionSolar-inbedrijfstelling: Modbus-TCP inschakelen (onbeperkt), EMMA-A02 TLS uitschakelen & Client-IP, LUNA2000 Maximaal Zelfverbruik en Laden via AC.",
    keywords: ["fusionsolar app", "modbus tcp onbeperkt", "inbedrijfstelling", "laden via ac", "maximaal zelfverbruik", "end-of-discharge soc", "tls encryptie", "actief vermogensbeheer"]
  },
  {
    title: "Optimale GEMS-configuratie voor Huawei-omvormers & LUNA2000",
    category: "Huawei Handleiding",
    url: "huawei.html#gems-optimization",
    snippet: "Aanbevolen GEMS-instellingen voor Huawei: 10s uitleesinterval, Vlaamse piekafvlakking, GSC-bescherming, 0,04 EUR/kWh slijtagekost, winterterugval en batterijbehoud bij EV-laden.",
    keywords: ["huawei gems instellingen", "poll interval 10", "batterijslijtagekost", "winter fallback", "ev batterij leegtrekken", "hold rule", "piekafvlakking huawei"]
  },

  // --- Solis Retrofit / Hybride & Easyway UNIV5200 Batterij Handleiding ---
  {
    title: "Solis Retrofit / Hybride Omvormers & Easyway 5200 (UNIV5200) Volledige Gids",
    category: "Solis & Easyway Handleiding",
    url: "solis.html",
    snippet: "Uitgebreide handleiding voor bekabeling, Eastron SDM72D-M & SDM630-M slimme meters, SolisCloud-inbedrijfstelling en GEMS-optimalisatie voor Solis RAI-3K, S6-EA1P, S5-EH1P, S6-EH1P en S6-EH3P-L met Easyway UNIV5200 51,2V LiFePO4-batterijen.",
    keywords: ["solis", "easyway", "univ5200", "univ-5200", "easyway 5200", "solis_hybrid", "solis_retrofit", "solis_retrofit_battery", "rai-3k", "s6-ea1p", "s6-eh1p", "s6-eh3p-l", "51.2v", "sdm72d-m", "sdm630-m"]
  },
  {
    title: "Eastron SDM72D-M of SDM630-M Slimme Meter Aansluiten & Instellen (Solis & GEMS)",
    category: "Solis & Easyway Handleiding",
    url: "solis.html#eastron-meter",
    snippet: "Stapsgewijze AC-klemmen (Boven 1-4 Net IN, Onder 5-8 Verbruik UIT), RS-485 A+/B- pinout naar Solis Meter RJ45 of GEMS USB-RS485, LCD-instellingen (Wachtwoord 1000, Adres 001, 9600 8N1) en GEMS-sjablonen.",
    keywords: ["sdm72d-m", "sdm72d-m-2", "sdm630-m", "sdm630-modbus", "sdm630mct", "eastron", "eastron_sdm72_x96", "eastron_sdm630", "solis meterpoort", "meter_comm_fail", "wachtwoord 1000", "eastron 3p"]
  },
  {
    title: "Easyway UNIV5200 Batterij Bekabelen naar Solis-omvormer (DC, CAN-pinout & DIP-switches)",
    category: "Solis & Easyway Handleiding",
    url: "solis.html#battery-wiring",
    snippet: "Volledige diagonale DC-parallelbekabeling & verzamelrails, ongepolariseerde DC-automaten, RJ45 CAN Pin 4 (CAN-H) & Pin 5 (CAN-L), binaire ADD DIP-switchtabel (1-16 modules) en soft-start inschakelvolgorde.",
    keywords: ["univ5200 bekabeling", "easyway bekabeling", "can pinout", "pin 4 can-h", "pin 5 can-l", "add dip switch", "parallelle batterijbekabeling", "dc automaat", "inschakelvolgorde"]
  },
  {
    title: "SolisCloud-app Inbedrijfstelling & Optimale GEMS-instellingen voor Solis + UNIV5200",
    category: "Solis & Easyway Handleiding",
    url: "solis.html#soliscloud-settings",
    snippet: "Lokale Bluetooth-instellingen in SolisCloud: Batterijselectie Model Lithium Battery LV (NIET PYLON LV), Overdischarge SOC 10%, Forcecharge SOC 5%, Zelfverbruik, Netladen toestaan, RS-485 / S2-WL-ST en GEMS-regels.",
    keywords: ["soliscloud app", "local debugging", "lithium battery lv", "battery select", "overdischarge soc", "forcecharge soc", "allow grid charging", "netladen", "s2-wl-st", "can_comm_fail", "solis gems instellingen"]
  },

  // --- Enerlution Hybride Omvormers & LiFePO4 Batterijopslag Handleiding ---
  {
    title: "Enerlution Hybride Omvormers & LiFePO4 Batterijopslag Volledige Gids",
    category: "Enerlution Handleiding",
    url: "enerlution.html",
    snippet: "Volledige bekabelings-, Enerlution-app- en GEMS-optimalisatiehandleiding voor Enerlution HY & HYTH-omvormers met 51,2V LV (LFPWall-5000, LFPWall-10K-V2, Roller-16K) en stapelbare HV-batterijen (GroundHV-2500, GH02-5324).",
    keywords: ["enerlution", "enerlution_inverter", "lfpwall", "lfpwall-5000", "lfpwall-10k-v2", "roller-16k", "groundhv", "groundhv-2500", "gh02-5324", "hyth", "hyth-10k", "l3-l12"]
  },
  {
    title: "Enerlution LV Parallelle & HV Stapelbare Batterijen, CAN-pinout & DTSU666-meter",
    category: "Enerlution Handleiding",
    url: "enerlution.html#battery-wiring",
    snippet: "51,2V LV parallelle bekabeling, HV PDU/BCU-seriestapelmontage, RJ45 CAN Pin 4 (CAN-H) & Pin 5 (CAN-L), binaire ADD DIP-switches, CHINT DTSU666 klemmen 24/25 en soft-start inschakelvolgorde.",
    keywords: ["enerlution bekabeling", "lfpwall bekabeling", "groundhv bekabeling", "hv pdu", "bcu", "msd plug", "dtsu666 pin 24 25", "sdm630", "enerlution can pinout", "enerlution dip switch"]
  },
  {
    title: "Enerlution-app Inbedrijfstelling & 1-Watt GEMS Terugregeling",
    category: "Enerlution Handleiding",
    url: "enerlution.html#enerlution-app",
    snippet: "Installateursinstellingen in de Enerlution-app: Lithium-Ion (CAN), modus Zelfverbruik, 10% Reserve SOC, Actieve vermogensregeling, MAC OUI-herkenning (70:B3:D5 / E4:5F:01) en 1-Watt zonneterugregeling.",
    keywords: ["enerlution app", "zelfverbruik", "1-watt terugregeling", "curtailment", "40400", "40441", "70:b3:d5", "e4:5f:01", "enerlution gems instellingen"]
  }
];
