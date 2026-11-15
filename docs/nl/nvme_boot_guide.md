# NVMe SSD Opstart- & Probleemoplossingshandleiding

> 🌐 **Taal / Langue / Language:** [English](../nvme_boot_guide.md) | **Nederlands** | [Français](../fr/nvme_boot_guide.md)

## Raspberry Pi 5 + M.2 NVMe PCIe Base + M.2 NVMe SSD

Deze handleiding biedt een volledig stappenplan voor het inschakelen van opstarten vanaf NVMe (NVMe boot) en het verhelpen van SSD-detectieproblemen bij een **M.2 NVMe SSD** gemonteerd op een **M.2 PCIe HAT / Base** op de Raspberry Pi 5.

---

## 🔍 Oorzaakanalyse: Waarom de Pi 5 de NVMe SSD Niet Standaard Ziet

Wanneer u een Raspberry Pi 5 assembleert met een NVMe HAT en een nieuwe NVMe SSD plaatst, zal de Pi niet standaard opstarten of de SSD herkennen vanwege vier redenen:

1. **Standaard Bootloadervolgorde (`BOOT_ORDER`):**
   * Fabrieks-EEPROM's van de Raspberry Pi 5 zijn ingesteld op `BOOT_ORDER=0xf41` (eerst SD-kaart `0x1`, daarna USB `0x4`, daarna herhaalcyclus `0xf`).
   * **NVMe-boot (code `0x6`) staat standaard uitgeschakeld** en de bootloader scant de PCIe-bus niet bij opstarten (`PCIE_PROBE=0`).
2. **Ontbrekende PCIe Device Tree-parameter in het OS (`config.txt`):**
   * Linux op de Raspberry Pi 5 activeert de 16-pins PCIe-header alleen wanneer `dtparam=pciex1` aanwezig is in `/boot/firmware/config.txt`.
3. **PCIe Gen 3 vs. Gen 2 Linkonderhandeling:**
   * De meeste NVMe SSD's zijn PCIe Gen 3.0- of Gen 4.0-schijven. De PCIe-interface van de Raspberry Pi 5 werkt officieel op PCIe Gen 2.0 (5,0 GT/s). Hoewel Gen 3 mogelijk is, kan de initiële linktraining mislukken tenzij PCIe Gen 2-compatibiliteit (`dtparam=pciex1_gen=2`) is ingesteld.
4. **Fysieke Montage van de FPC-flatcable:**
   * De 16-pins 0,5 mm pitch flexibele flatcable (FFC/FPC) moet in de juiste richting zijn geplaatst en volledig recht worden vergrendeld met de zwarte klemmetjes.

---

## 🚀 Snelle Oplossing: 2 Manieren om vanaf NVMe op te Starten

Kies tussen **Methode 1 (Aanbevolen — Geen Linux-kennis vereist)** of **Methode 2 (Via Terminal / Cockpit)**.

---

### 🌟 Methode 1: De 3-Minuten Oplossing (Met Raspberry Pi Imager EEPROM-hulpprogramma)

Dit is de snelste, schoonste en meest betrouwbare manier om uw Raspberry Pi 5 te configureren voor NVMe-boot zonder commando's te typen.

#### Stap 1: Flash de EEPROM Bootloader-updatekaart
1. Plaats een **MicroSD-kaart** in uw pc of Mac.
2. Download en open **[Raspberry Pi Imager](https://www.raspberrypi.com/software/)**.
3. Klik op **Kies apparaat (Choose Device)** &rarr; Selecteer **Raspberry Pi 5**.
4. Klik op **Kies besturingssysteem (Choose OS)** &rarr; Scrol omlaag en selecteer **Misc utility images** &rarr; **Bootloader** &rarr; **NVMe/PCIe Boot**.
5. Klik op **Kies opslag (Choose Storage)** &rarr; Selecteer uw MicroSD-kaart.
6. Klik op **Volgende (Next)** &rarr; Bevestig het schrijven.

```
+-------------------------------------------------------------+
| Raspberry Pi Imager                                         |
| Operating System: Bootloader -> NVMe/PCIe Boot              |
| Storage:          64GB MicroSD Card                         |
| [ WRITE ]                                                   |
+-------------------------------------------------------------+
```

#### Stap 2: Voer de EEPROM-update uit op de Pi 5
1. Zorg dat de **M.2 NVMe SSD** en **NVMe HAT** op de Raspberry Pi 5 zijn gemonteerd.
2. Plaats de voorbereide MicroSD-kaart in de Raspberry Pi 5.
3. Sluit de officiële **27W USB-C-voeding** aan.
4. Let op het groene **ACT-ledje** op de Pi 5:
   * Het zal snel en regelmatig knipperen.
   * Als er een HDMI-scherm is aangesloten, kleurt het volledige scherm binnen 5 tot 10 seconden **effen groen**.
5. Zodra het scherm effen groen is (of het ACT-ledje gelijkmatig knippert), koppelt u de voeding los.
6. **Verwijder de MicroSD-kaart.** De EEPROM van de Pi 5 is nu permanent geconfigureerd om vanaf NVMe op te starten (`BOOT_ORDER=0xf461`, `PCIE_PROBE=1`)!

#### Stap 3: Flash GEMS naar de M.2 NVMe SSD
1. Sluit de **M.2 NVMe SSD** aan op uw pc via een USB-naar-NVMe-adapter/behuizing (of ga verder met Methode 2 hieronder als u geen externe adapter heeft).
2. Download `gems-os-image.img.xz` via de [Laatste GitHub Release](https://github.com/webdotpulse/GRID-EMS-RELEASE/releases).
3. Selecteer in Raspberry Pi Imager (of BalenaEtcher) `gems-os-image.img.xz` als besturingssysteem en kies de NVMe SSD als doelopslag.
4. Klik op **Schrijven (Write)**.
5. Plaats de geflashte NVMe SSD terug in de M.2 NVMe HAT op de Pi 5.
6. Schakel de Raspberry Pi 5 in (zonder MicroSD-kaart).
7. Het systeem start binnen 8 seconden op vanaf de NVMe SSD! Open `http://ems.local` in uw browser.

---

### 💻 Methode 2: EEPROM Configureren & NVMe Flashen via Cockpit Terminal

Als u geen losse USB-naar-NVMe-adapter voor uw pc heeft, kunt u alles rechtstreeks op de Raspberry Pi instellen met behulp van een MicroSD-kaart.

#### Stap 1: Opstarten vanaf MicroSD-kaart
1. Flash `gems-os-image.img.xz` (of standaard Raspberry Pi OS Lite Bookworm 64-bit) op de MicroSD-kaart.
2. Monteer de M.2 NVMe SSD in de NVMe HAT op de Pi 5.
3. Plaats de MicroSD-kaart en schakel de stroom in.
4. Open een browser en ga naar de **Cockpit Webterminal** op:
   ```
   https://ems.local:9090
   ```
   *(Log in met de toegewezen Linux-beheerdersgegevens)* of maak verbinding via SSH.

#### Stap 2: Schakel de PCIe-bus in via `/boot/firmware/config.txt`
1. Open het opstartconfiguratiebestand in de terminal:
   ```bash
   sudo nano /boot/firmware/config.txt
   ```
2. Scrol helemaal naar beneden en voeg de volgende regels toe:
   ```ini
   # Enable Raspberry Pi 5 PCIe header & NVMe support
   dtparam=pciex1
   # Enforce PCIe Gen 2 link stability for NVMe drive
   dtparam=pciex1_gen=2
   ```
3. Druk op `Ctrl+O`, `Enter` om op te slaan, en vervolgens op `Ctrl+X` om af te sluiten.

#### Stap 3: Pas de Pi 5 EEPROM-opstartvolgorde & Probe aan
1. Open de EEPROM-configuratie-editor:
   ```bash
   sudo rpi-eeprom-config --edit
   ```
2. Wijzig of voeg de volgende parameters toe:
   ```ini
   [all]
   BOOT_UART=1
   WAKE_ON_GPIO=0
   POWER_OFF_ON_HALT=0
   
   # Enable PCIe bus probing at early boot
   PCIE_PROBE=1
   
   # Boot Order: Try NVMe (6) first, then SD Card (1), then USB (4), then loop (f)
   BOOT_ORDER=0xf416
   ```
   *(Opmerking: Met `BOOT_ORDER=0xf416` of `BOOT_ORDER=0xf461` controleert de Pi 5 automatisch het NVMe-station bij het opstarten).*
3. Druk op `Ctrl+O`, `Enter` en daarna `Ctrl+X` om op te slaan.
4. Herstart de Raspberry Pi:
   ```bash
   sudo reboot
   ```

#### Stap 4: Controleer of de NVMe SSD Wordt Gedetecteerd
Open na het herstarten opnieuw de Cockpit Terminal en verifieer dat de NVMe SSD zichtbaar is:

1. **Controleer de PCIe-busenumeratie:**
   ```bash
   lspci
   ```
   *Verwachte uitvoer:*
   ```text
   0000:00:00.0 PCI bridge: Broadcom Inc. and subsidiaries ...
   0001:00:00.0 PCI bridge: Broadcom Inc. and subsidiaries ...
   0001:01:00.0 Non-Volatile memory controller: Silicon Motion, Inc. Device 2263 (rev 03)
   ```

2. **Controleer het blokopslagapparaat:**
   ```bash
   lsblk
   ```
   *Verwachte uitvoer:*
   ```text
   NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
   mmcblk0     179:0    0  59.5G  0 disk 
   ├─mmcblk0p1 179:1    0   512M  0 part /boot/firmware
   └─mmcblk0p2 179:2    0    59G  0 part /
   nvme0n1     259:0    0 119.2G  0 disk 
   ```
   *(Let op dat `/dev/nvme0n1` nu zichtbaar is met ~119,2 GB capaciteit).*

#### Stap 5: Flash het GEMS OS-image Rechtstreeks naar `/dev/nvme0n1`
Download en schrijf het GEMS-image rechtstreeks vanuit de terminal naar de NVMe SSD:

```bash
# 1. Download the latest GEMS image
curl -LO https://github.com/webdotpulse/GRID-EMS-RELEASE/releases/latest/download/gems-os-image.img.xz

# 2. Decompress and flash directly to the NVMe SSD
xzcat gems-os-image.img.xz | sudo dd of=/dev/nvme0n1 bs=4M status=progress conv=fsync

# 3. Mount the newly flashed NVMe boot partition to verify PCIe configuration
sudo mkdir -p /mnt/nvme_boot
sudo mount /dev/nvme0n1p1 /mnt/nvme_boot

# 4. Ensure config.txt has dtparam=pciex1 enabled
if ! grep -q "dtparam=pciex1" /mnt/nvme_boot/config.txt; then
  echo "" | sudo tee -a /mnt/nvme_boot/config.txt
  echo "# Enable NVMe PCIe support" | sudo tee -a /mnt/nvme_boot/config.txt
  echo "dtparam=pciex1" | sudo tee -a /mnt/nvme_boot/config.txt
  echo "dtparam=pciex1_gen=2" | sudo tee -a /mnt/nvme_boot/config.txt
fi

sudo umount /mnt/nvme_boot

# 5. Safely shutdown the system
sudo poweroff
```

#### Stap 6: Verwijder de SD-kaart en Start Puur vanaf NVMe op
1. Koppel de USB-C-voedingskabel los.
2. **Haal de MicroSD-kaart uit het toestel.**
3. Sluit de voeding weer aan op de Raspberry Pi 5.
4. De Raspberry Pi 5 start nu in minder dan 8 seconden rechtstreeks op vanaf de **M.2 NVMe SSD**.

---

## 🛠️ Fysieke Montage & Kabelcontrole

Wordt de NVMe SSD na bovenstaande softwarestappen nog steeds niet herkend? Controleer dan de fysieke aansluiting:

```
Raspberry Pi 5 Moederbord                      M.2 NVMe Base / HAT
+-------------------------+                    +-------------------------+
| [USB] [ETH] [PCIe Port] |                    | [ M.2 NVMe SSD Slot ]   |
|                 |       |   FPC-flatcable    |       |                 |
|            [===|===]    |====================|  [===|===]              |
|          Gouden pinnen  |                    | Gouden pinnen naar      |
|          RICHTING USB   |                    | printplaatcontacten     |
+-------------------------+                    +-------------------------+
```

### Controlelijst:
1. **Richting van de FPC-flatcable op de Pi 5:**
   * Zoek de 16-pins FPC-connector op de Raspberry Pi 5 (gemarkeerd met `PCIe`).
   * Til het donkere vergrendelingslipje voorzichtig 1 mm recht omhoog.
   * Schuif de flatcable erin zodat de **gouden contacten NAAR BINNEN wijzen (richting de USB- en Ethernet-poorten)**.
   * Druk het zwarte vergrendelingslipje gelijkmatig omlaag om de kabel vast te klemmen.
2. **Richting van de FPC-flatcable op de M.2 NVMe HAT / Base:**
   * Controleer dat de kabel 100% recht en niet schuin in de connector zit.
   * Vergrendel het klemmetje stevig.
3. **M.2 Afstandsbus & Schroefje:**
   * Controleer of de M.2 NVMe SSD onder een hoek van 30 graden volledig in het M.2-slot is geschoven, vlak naar beneden is gedrukt en met het meegeleverde M2-schroefje is vastgezet.
4. **Voeding:**
   * Gebruik altijd de officiële **27W USB-C PD-voeding**. Standaard 15W-telefoonladers vertonen spanningsval zodra de NVMe SSD opspint, wat leidt tot PCIe-linkfouten.

---

## 📊 Handige Diagnostische Commando's (Cockpit Terminal / SSH)

| Diagnostische Controle | Commando | Verwachte Gezonde Uitvoer |
| :--- | :--- | :--- |
| **Controleer PCIe-bus** | `lspci -v` | Toont `Broadcom PCIe Host Bridge` en `Silicon Motion Non-Volatile memory controller`. |
| **Controleer Blokapparaten** | `lsblk` | Toont `/dev/nvme0n1` (119.2G) met partities `nvme0n1p1` en `nvme0n1p2`. |
| **Inspecteer Kernellogs** | `sudo dmesg \| grep -i -E "pci\|nvme"` | `pcieport ... link up, 5.0 GT/s PCIe x1`<br>`nvme nvme0: pci function 0001:01:00.0` |
| **Controleer EEPROM-config** | `sudo rpi-eeprom-config` | `BOOT_ORDER=0xf461` of `0xf416`<br>`PCIE_PROBE=1` |
| **Benchmark NVMe-snelheid** | `sudo hdparm -tT /dev/nvme0n1` | Gebufferde schijfleessnelheid: `~420 tot 850 MB/s` (meer dan 10× sneller dan MicroSD!). |

---

## 🏁 Samenvatting

Met een bijgewerkte EEPROM (`BOOT_ORDER=0xf461`, `PCIE_PROBE=1`) en `dtparam=pciex1` in `config.txt` levert uw **M.2 NVMe SSD** razendsnelle lees-/schrijfsnelheden, nul risico op SD-kaartcorruptie en uiterst betrouwbare 24/7 autonome werking voor **GEMS**.
