# Guide de Configuration & Dépannage SSD NVMe

> 🌐 **Langue / Taal / Language:** [English](../nvme_boot_guide.md) | [Nederlands](../nl/nvme_boot_guide.md) | **Français**

## Raspberry Pi 5 + Base PCIe M.2 NVMe + SSD M.2 NVMe

Ce manuel fournit une procédure complète, étape par étape, pour activer le démarrage sur NVMe (*NVMe boot*) et résoudre les problèmes de détection d'un **SSD M.2 NVMe** installé sur une **carte d'extension / base M.2 PCIe HAT** avec le Raspberry Pi 5.

---

## 🔍 Analyse des Causes : Pourquoi le Pi 5 ne Détecte pas le SSD NVMe par Défaut

Lorsque vous assemblez un Raspberry Pi 5 avec un HAT NVMe et un SSD NVMe neuf, le système ne démarre pas ou ne détecte pas le SSD pour quatre raisons principales :

1. **Séquence d'Amorçage d'Usine (`BOOT_ORDER`) :**
   * L'EEPROM d'usine du Raspberry Pi 5 est configurée avec `BOOT_ORDER=0xf41` (carte SD d'abord `0x1`, puis USB `0x4`, puis boucle de redémarrage `0xf`).
   * **Le démarrage NVMe (code `0x6`) est désactivé par défaut**, et le chargeur d'amorçage n'interroge pas le bus PCIe (`PCIE_PROBE=0`).
2. **Paramètre Device Tree PCIe Absent de l'OS (`config.txt`) :**
   * Linux sur Raspberry Pi 5 n'active le connecteur PCIe 16 broches que si `dtparam=pciex1` est déclaré dans `/boot/firmware/config.txt`.
3. **Négociation de Liaison PCIe Gen 3 vs Gen 2 :**
   * La plupart des SSD NVMe sont des disques PCIe Gen 3.0 ou Gen 4.0. L'interface PCIe du Raspberry Pi 5 est officiellement certifiée en PCIe Gen 2.0 (5,0 GT/s). Bien que le mode Gen 3 existe, l'initialisation du lien peut échouer sans le mode de compatibilité PCIe Gen 2 (`dtparam=pciex1_gen=2`).
4. **Insertion Physique de la Nappe FPC :**
   * La nappe plate flexible 16 broches au pas de 0,5 mm (FFC/FPC) doit être correctement orientée et parfaitement verrouillée par les loquets noirs.

---

## 🚀 Solution Rapide : 2 Méthodes pour Démarrer sur NVMe

Vous pouvez choisir la **Méthode 1 (Recommandée — Aucune connaissance Linux requise)** ou la **Méthode 2 (Via Terminal / Cockpit)**.

---

### 🌟 Méthode 1 : La Solution Express en 3 Minutes (Utilitaire EEPROM Raspberry Pi Imager)

Il s'agit de la méthode la plus rapide, la plus propre et la plus fiable pour configurer le démarrage NVMe sur votre Raspberry Pi 5 sans saisir la moindre ligne de commande.

#### Étape 1 : Préparer la Carte MicroSD de Mise à Jour EEPROM
1. Insérez une **carte MicroSD** dans votre PC ou Mac.
2. Téléchargez et lancez **[Raspberry Pi Imager](https://www.raspberrypi.com/software/)**.
3. Cliquez sur **Choisir l'appareil (Choose Device)** &rarr; Sélectionnez **Raspberry Pi 5**.
4. Cliquez sur **Choisir le système d'exploitation (Choose OS)** &rarr; Faites défiler vers le bas et sélectionnez **Misc utility images** &rarr; **Bootloader** &rarr; **NVMe/PCIe Boot**.
5. Cliquez sur **Choisir le stockage (Choose Storage)** &rarr; Sélectionnez votre carte MicroSD.
6. Cliquez sur **Suivant (Next)** &rarr; Confirmez l'écriture.

```
+-------------------------------------------------------------+
| Raspberry Pi Imager                                         |
| Operating System: Bootloader -> NVMe/PCIe Boot              |
| Storage:          64GB MicroSD Card                         |
| [ WRITE ]                                                   |
+-------------------------------------------------------------+
```

#### Étape 2 : Appliquer la Mise à Jour EEPROM sur le Pi 5
1. Vérifiez que le **SSD M.2 NVMe** et le **HAT NVMe** sont assemblés sur le Raspberry Pi 5.
2. Insérez la carte MicroSD préparée dans le Raspberry Pi 5.
3. Branchez l'alimentation officielle **27 W USB-C**.
4. Observez la **LED verte ACT** du Pi 5 :
   * Elle clignote rapidement et régulièrement.
   * Si un écran HDMI est branché, l'affichage devient entièrement **vert fixe** au bout de 5 à 10 secondes.
5. Dès que l'écran est vert fixe (ou que la LED ACT clignote régulièrement), débranchez l'alimentation.
6. **Retirez la carte MicroSD.** L'EEPROM du Pi 5 est désormais configurée de façon permanente pour démarrer sur NVMe (`BOOT_ORDER=0xf461`, `PCIE_PROBE=1`) !

#### Étape 3 : Flasher GEMS sur le SSD M.2 NVMe
1. Connectez le **SSD M.2 NVMe** à votre ordinateur à l'aide d'un boîtier/adaptateur USB vers NVMe (ou passez à la Méthode 2 ci-dessous si vous n'en possédez pas).
2. Téléchargez `gems-os-image.img.xz` depuis la [Dernière Version GitHub](https://github.com/webdotpulse/GRID-EMS-RELEASE/releases).
3. Dans Raspberry Pi Imager (ou BalenaEtcher), sélectionnez directement `gems-os-image.img.xz` comme système d'exploitation et choisissez le SSD NVMe comme cible de stockage.
4. Cliquez sur **Écrire (Write)**.
5. Une fois l'écriture terminée, réinstallez le SSD NVMe sur le HAT M.2 NVMe du Pi 5.
6. Mettez le Raspberry Pi 5 sous tension (sans aucune carte MicroSD insérée).
7. Le système démarre depuis le SSD NVMe en moins de 8 secondes ! Ouvrez `http://ems.local` dans votre navigateur.

---

### 💻 Méthode 2 : Configurer l'EEPROM & Flasher le NVMe via le Terminal Cockpit

Si vous ne disposez pas d'adaptateur USB vers NVMe pour votre PC, vous pouvez effectuer l'intégralité de l'opération directement sur le Raspberry Pi à l'aide d'une carte MicroSD.

#### Étape 1 : Démarrer depuis la Carte MicroSD
1. Flashez `gems-os-image.img.xz` (ou Raspberry Pi OS Lite Bookworm 64-bit) sur la carte MicroSD.
2. Montez le SSD M.2 NVMe sur le HAT NVMe du Pi 5.
3. Insérez la carte MicroSD et mettez sous tension.
4. Ouvrez un navigateur et accédez au **Terminal Web Cockpit** :
   ```
   https://ems.local:9090
   ```
   *(Connectez-vous avec vos identifiants administrateur Linux provisionnés)* ou connectez-vous en SSH.

#### Étape 2 : Activer le Bus PCIe dans `/boot/firmware/config.txt`
1. Dans le terminal, éditez le fichier de configuration de démarrage :
   ```bash
   sudo nano /boot/firmware/config.txt
   ```
2. Faites défiler jusqu'en bas et ajoutez les lignes suivantes :
   ```ini
   # Enable Raspberry Pi 5 PCIe header & NVMe support
   dtparam=pciex1
   # Enforce PCIe Gen 2 link stability for NVMe drive
   dtparam=pciex1_gen=2
   ```
3. Appuyez sur `Ctrl+O`, `Entrée` pour enregistrer, puis `Ctrl+X` pour quitter.

#### Étape 3 : Mettre à Jour l'Ordre d'Amorçage EEPROM & la Détection PCIe
1. Ouvrez l'éditeur de configuration EEPROM :
   ```bash
   sudo rpi-eeprom-config --edit
   ```
2. Modifiez ou ajoutez les paramètres suivants :
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
   *(Remarque : `BOOT_ORDER=0xf416` ou `BOOT_ORDER=0xf461` garantit que le Pi 5 interroge le disque NVMe au démarrage).*
3. Appuyez sur `Ctrl+O`, `Entrée`, puis `Ctrl+X` pour enregistrer.
4. Redémarrez le Raspberry Pi :
   ```bash
   sudo reboot
   ```

#### Étape 4 : Vérifier la Détection du SSD NVMe
Après le redémarrage, rouvrez le Terminal Cockpit et vérifiez que le SSD NVMe est bien détecté :

1. **Vérifier l'énumération du bus PCIe :**
   ```bash
   lspci
   ```
   *Sortie attendue :*
   ```text
   0000:00:00.0 PCI bridge: Broadcom Inc. and subsidiaries ...
   0001:00:00.0 PCI bridge: Broadcom Inc. and subsidiaries ...
   0001:01:00.0 Non-Volatile memory controller: Silicon Motion, Inc. Device 2263 (rev 03)
   ```

2. **Vérifier le périphérique bloc de stockage :**
   ```bash
   lsblk
   ```
   *Sortie attendue :*
   ```text
   NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
   mmcblk0     179:0    0  59.5G  0 disk 
   ├─mmcblk0p1 179:1    0   512M  0 part /boot/firmware
   └─mmcblk0p2 179:2    0    59G  0 part /
   nvme0n1     259:0    0 119.2G  0 disk 
   ```
   *(Notez que `/dev/nvme0n1` apparaît désormais avec une capacité d'environ 119,2 Go).*

#### Étape 5 : Flasher l'Image OS GEMS Directement sur `/dev/nvme0n1`
Téléchargez et écrivez l'image GEMS directement sur le SSD NVMe depuis le terminal :

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

#### Étape 6 : Retirer la Carte SD et Démarrer sur NVMe Pur
1. Débranchez le câble d'alimentation USB-C.
2. **Éjectez et retirez la carte MicroSD.**
3. Remettez le Raspberry Pi 5 sous tension.
4. Le Raspberry Pi 5 démarre directement depuis le **SSD M.2 NVMe** en moins de 8 secondes.

---

## 🛠️ Installation Physique & Vérification de la Nappe

Si le SSD NVMe n'est toujours pas détecté après les étapes logicielles, inspectez les connexions physiques :

```
Carte Mère Raspberry Pi 5                      Base / HAT M.2 NVMe
+-------------------------+                    +-------------------------+
| [USB] [ETH] [PCIe Port] |                    | [ M.2 NVMe SSD Slot ]   |
|                 |       |   Nappe FPC        |       |                 |
|            [===|===]    |====================|  [===|===]              |
|          Pistes dorées  |                    | Pistes dorées face aux  |
|          VERS les ports |                    | contacts du connecteur  |
+-------------------------+                    +-------------------------+
```

### Liste de Contrôle :
1. **Orientation de la nappe FPC sur le Raspberry Pi 5 :**
   * Repérez le connecteur FPC 16 broches sur le Raspberry Pi 5 (marqué `PCIe`).
   * Soulevez délicatement le collier de verrouillage foncé de 1 mm vers le haut.
   * Glissez la nappe de sorte que les **pistes dorées soient orientées VERS L'INTÉRIEUR (vers les ports USB et Ethernet)**.
   * Rabattez uniformément le collier noir pour verrouiller la nappe.
2. **Orientation de la nappe FPC sur la Base / HAT M.2 NVMe :**
   * Assurez-vous que la nappe est parfaitement droite et non insérée de biais.
   * Verrouillez fermement le loquet.
3. **Entretoise M.2 & Vis de Fixation :**
   * Vérifiez que le SSD M.2 NVMe est inséré à fond selon un angle de 30°, plaqué à plat, puis fixé avec la vis M2 fournie.
4. **Alimentation Électrique :**
   * Utilisez impérativement l'alimentation officielle **27 W USB-C PD**. Les chargeurs de téléphone de 15 W subissent une chute de tension lors de l'appel de courant du SSD NVMe, provoquant des pertes de liaison PCIe.

---

## 📊 Commandes de Diagnostic Utiles (Terminal Cockpit / SSH)

| Tâche de Diagnostic | Commande | Résultat Sain Attendu |
| :--- | :--- | :--- |
| **Vérifier le Bus PCIe** | `lspci -v` | Affiche `Broadcom PCIe Host Bridge` et `Silicon Motion Non-Volatile memory controller`. |
| **Vérifier les Périphériques Bloc** | `lsblk` | Affiche `/dev/nvme0n1` (119.2G) avec les partitions `nvme0n1p1` et `nvme0n1p2`. |
| **Inspecter les Journaux Noyau** | `sudo dmesg \| grep -i -E "pci\|nvme"` | `pcieport ... link up, 5.0 GT/s PCIe x1`<br>`nvme nvme0: pci function 0001:01:00.0` |
| **Vérifier la Config EEPROM** | `sudo rpi-eeprom-config` | `BOOT_ORDER=0xf461` ou `0xf416`<br>`PCIE_PROBE=1` |
| **Mesurer le Débit NVMe** | `sudo hdparm -tT /dev/nvme0n1` | Lecture disque tamponnée : `~420 à 850 Mo/s` (plus de 10× plus rapide qu'une carte MicroSD !). |

---

## 🏁 Résumé

Avec l'EEPROM mise à jour (`BOOT_ORDER=0xf461`, `PCIE_PROBE=1`) et `dtparam=pciex1` déclaré dans `config.txt`, votre **SSD M.2 NVMe** offre des débits de lecture/écriture ultra-rapides, élimine tout risque de corruption de carte SD et garantit un fonctionnement autonome 24h/24 et 7j/7 pour **GEMS**.
