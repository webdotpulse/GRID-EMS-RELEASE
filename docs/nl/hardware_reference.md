# Specificaties Referentiehardware

> 🌐 **Taal / Langue / Language:** [English](../hardware_reference.md) | **Nederlands** | [Français](../fr/hardware_reference.md)

Dit document bevat de officiële stuklijst (Bill of Materials / BOM), technische specificaties, bekabelingsvereisten en hardware-aandachtspunten voor het inzetten van **GEMS (New Energy Grid)**.

---

## 🛠️ Officieel Geteste Referentiehardware

De onderstaande hardwarecombinatie vormt het officieel geteste en geverifieerde referentieplatform voor GEMS:

| Onderdeel | Hardwarespecificatie | Belangrijkste Specificaties | Standaard / Vereiste |
| :--- | :--- | :--- | :--- |
| **Systeemcontroller & Basis** | **Raspberry Pi 5 Referentiehardware** | • Raspberry Pi 5 (4 GB of 8 GB RAM, Quad-Core ARM Cortex-A76 @ 2,4 GHz)<br>• Officiële Raspberry Pi 27W USB-C PD-voeding<br>• Op maat gemaakte aluminium behuizing met passieve/actieve koeling<br>• Officiële Raspberry Pi 5 Active Cooler<br>• M.2 NVMe PCIe HAT / Base met 16-pins FPC-flatcable<br>• MicroSD-kaart (voor eenmalig flashen van de bootloader) | Officieel Getest Referentieplatform |
| **Interne Opslag (NVMe)** | **128 GB+ M.2 NVMe SSD** | • Formaat: M.2 2280 M-Key (of 2230/2242)<br>• Interface: PCIe Gen 3.0 / Gen 2.0 x4 (NVMe 1.3+)<br>• Max. lezen: 1.600+ MB/s / Max. schrijven: 600+ MB/s<br>• Laag stroomverbruik (ideaal voor 24/7 Raspberry Pi EMS)<br>• Solid-state opslag met hoge levensduur (High Endurance) | Geverifieerde NVMe-opslag |

---

## ⚡ Voeding & Elektrische Vereisten

### 1. Vereiste Voeding (27W USB-C PD)
* Wanneer een M.2 NVMe SSD via de PCIe-connector op de Raspberry Pi 5 wordt aangesloten, vereist het systeem een officiële **5V / 5A (27W)** Power Delivery (PD)-voeding.
* Standaard 15W-laders (5V / 3A) veroorzaken onderspanningswaarschuwingen (`dmesg: Under-voltage detected!`) tijdens piekschrijfacties naar de NVMe-schijf en kunnen leiden tot het wegvallen van de PCIe-verbinding.
* Met de officiële 27W-voeding levert de Raspberry Pi 5 de volledige stroomcapaciteit van 1,6 A over de USB- en PCIe-poorten.

### 2. Formaat & Fysieke Montage
* **SSD-formaat:** Standaard NVMe PCIe HAT's/Bases ondersteunen **M.2 2280** (en 2230/2242) schijven.
* **Flatcable (16-pins 0,5 mm pitch FPC):**
  * De gouden contactpinnen op het Raspberry Pi 5-moederbord moeten **naar binnen wijzen, richting de USB-/Ethernet-poorten**.
  * De gouden contactpinnen op de NVMe HAT moeten naar de printplaatcontacten wijzen volgens de oriëntatie van de HAT-connector.
  * Til de zwarte vergrendelingslipjes voorzichtig omhoog, schuif de flatcable 100% recht naar binnen en druk het lipje stevig terug naar beneden.

---

## 🔌 Communicatie-accessoires

Voor het aansluiten van fysieke omvormers, thuisbatterijen en slimme meters:

### 1. RS485 / Modbus RTU-interfaces (USB-naar-RS485)
* **Chipset:** FTDI FT232RL, Silicon Labs CP2102 of CH340 / MAX485 met overspanningsbeveiliging (TVS).
* **Aansluiting:**
  * **A (D+)**: Verbind met Pin A van de omvormer
  * **B (D-)**: Verbind met Pin B van de omvormer
  * **GND / COM**: Verbind met de gemeenschappelijke signaalmassa
  * **Afsluitweerstand**: 120 Ω weerstand aan de uiteinden van de bus (bij kabellengtes > 10 m).

### 2. P1 Slimme Meter RJ12-kabel
* **Connector:** RJ12 (6P6C).
* **Baudrate:** 115200 baud (DSMR 5.0 in België/Nederland) of 9600 baud (DSMR 2/3).
* **Signaalinversie:** Vereist een actieve signaalinverter (seriële P1-signalen van Nederlandse en Belgische digitale meters zijn logisch geïnverteerd).

---

## 📖 Gerelateerde Documentatie
* [NVMe Opstart- & Probleemoplossingshandleiding](nvme_boot_guide.md) — Stapsgewijze handleiding voor het inschakelen van NVMe-boot op M.2 NVMe SSD's.
* [Gebruikers- & Installatiehandleiding](user_manual.md) — Volledige software- en configuratiegids.
* [Handleiding Toegang op Afstand](remote_access.md) — Configuratie van Cockpit en Raspberry Pi Connect.
