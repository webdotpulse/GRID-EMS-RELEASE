# NVMe SSD Setup & Troubleshooting Manual
## Raspberry Pi 5 + db-tronic NVMe Kit + Patriot P300 SSD

This manual provides a complete, step-by-step resolution for enabling NVMe boot and resolving SSD detection issues with the **Patriot P300 128GB M.2 NVMe SSD** installed in the **db-tronic Raspberry Pi 5 NVMe Kit**.

---

## 🔍 Root Cause Analysis: Why the Pi 5 Doesn't See the Patriot SSD

When you assemble a Raspberry Pi 5 with an NVMe HAT and insert a fresh Patriot P300 SSD, the Pi will fail to boot or detect the SSD due to three primary reasons:

1. **Factory Bootloader Sequence (`BOOT_ORDER`):**
   * Factory Raspberry Pi 5 EEPROMs are configured with `BOOT_ORDER=0xf41` (SD Card first `0x1`, then USB `0x4`, then reboot loop `0xf`).
   * **NVMe boot (Code `0x6`) is disabled by default**, and the bootloader does not probe PCIe (`PCIE_PROBE=0`).
2. **Missing PCIe Device Tree Parameter in OS (`config.txt`):**
   * Linux on Raspberry Pi 5 does not activate the 16-pin PCIe header unless `dtparam=pciex1` is declared in `/boot/firmware/config.txt`.
3. **PCIe Gen 3 Link Negotiation vs Gen 2:**
   * The Patriot P300 is a PCIe Gen 3.0 x4 drive. Raspberry Pi 5's PCIe interface officially operates at PCIe Gen 2.0 (5.0 GT/s). While Pi 5 can operate in Gen 3 mode, initial link training may fail unless PCIe Gen 2 compatibility (`dtparam=pciex1_gen=2`) is active.
4. **Physical FPC Ribbon Cable Seating:**
   * The 16-pin 0.5mm pitch flexible flat cable (FFC/FPC) must be correctly oriented and firmly seated with the black locking tabs latched.

---

## 🚀 Quick Solution: 2 Ways to Fix & Boot from NVMe

You can choose either **Method 1 (Recommended - No Linux knowledge needed)** or **Method 2 (Using Terminal / Cockpit)**.

---

### 🌟 Method 1: The 3-Minute Quick Fix (Using Raspberry Pi Imager EEPROM Utility)

This is the fastest, cleanest, and most reliable way to configure your Raspberry Pi 5 for NVMe boot without typing commands.

#### Step 1: Flash the EEPROM Bootloader Update Card
1. Insert the **64GB MicroSD card** (included in the db-tronic kit) into your PC/Mac.
2. Download and launch **[Raspberry Pi Imager](https://www.raspberrypi.com/software/)**.
3. Click **Choose Device** &rarr; Select **Raspberry Pi 5**.
4. Click **Choose OS** &rarr; Scroll down and select **Misc utility images** &rarr; **Bootloader** &rarr; **NVMe/PCIe Boot**.
5. Click **Choose Storage** &rarr; Select your MicroSD card.
6. Click **Next** &rarr; Confirm write.

```
+-------------------------------------------------------------+
| Raspberry Pi Imager                                         |
| Operating System: Bootloader -> NVMe/PCIe Boot              |
| Storage:          64GB MicroSD Card                         |
| [ WRITE ]                                                   |
+-------------------------------------------------------------+
```

#### Step 2: Apply the EEPROM Update on the Pi 5
1. Ensure the **Patriot P300 SSD** and **NVMe HAT** are assembled onto the Raspberry Pi 5.
2. Insert the prepared MicroSD card into the Raspberry Pi 5.
3. Connect the official **27W USB-C power supply**.
4. Observe the green **ACT LED** on the Pi 5:
   * It will blink rapidly and steadily.
   * If an HDMI monitor is attached, the entire screen will turn **solid green** within 5 to 10 seconds.
5. Once the screen is solid green (or ACT LED blinks regularly), disconnect the power.
6. **Remove the MicroSD card.** The Pi 5 EEPROM is now permanently configured to boot from NVMe (`BOOT_ORDER=0xf461`, `PCIE_PROBE=1`)!

#### Step 3: Flash GEMS to the Patriot P300 SSD
1. Connect the **Patriot P300 128GB SSD** to your PC using a USB-to-NVMe enclosure/adapter (or proceed to Method 2 below if you don't have an external adapter).
2. Download `gems-os-image.img.xz` from the [Latest GitHub Release](https://github.com/webdotpulse/GRID-EMS-RELEASE/releases).
3. In Raspberry Pi Imager (or BalenaEtcher), select `gems-os-image.img.xz` directly as the OS and choose the Patriot P300 SSD as the storage target.
4. Click **Write**.
5. Once flashed, install the Patriot P300 back into the db-tronic NVMe HAT on the Pi 5.
6. Power on the Raspberry Pi 5 (without any MicroSD card inserted).
7. The system will boot from the NVMe SSD within 8 seconds! Access `http://ems.local` in your browser.

---

### 💻 Method 2: Configure EEPROM & Flash NVMe via Cockpit Terminal

If you do not have a separate USB-to-NVMe adapter for your PC, you can configure everything directly on the Raspberry Pi using the included 64GB MicroSD card.

#### Step 1: Boot from MicroSD Card
1. Flash `gems-os-image.img.xz` (or standard Raspberry Pi OS Lite Bookworm 64-bit) onto the 64GB MicroSD card.
2. Assemble the Patriot P300 SSD in the db-tronic HAT on the Pi 5.
3. Insert the MicroSD card and power on.
4. Open a browser and navigate to **Cockpit Web Terminal** at:
   ```
   http://ems.local:9090
   ```
   *(Login: `admin` / Password: `manufacturer`)* or connect via SSH.

#### Step 2: Enable the PCIe Bus in `/boot/firmware/config.txt`
1. In the terminal, edit the boot config file:
   ```bash
   sudo nano /boot/firmware/config.txt
   ```
2. Scroll to the bottom and add the following lines:
   ```ini
   # Enable Raspberry Pi 5 PCIe header & NVMe support
   dtparam=pciex1
   # Enforce PCIe Gen 2 link stability for Patriot P300
   dtparam=pciex1_gen=2
   ```
3. Press `Ctrl+O`, `Enter` to save, then `Ctrl+X` to exit.

#### Step 3: Update Pi 5 EEPROM Boot Order & Probe
1. Open the EEPROM configuration editor:
   ```bash
   sudo rpi-eeprom-config --edit
   ```
2. Modify or add the following parameters:
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
   *(Note: Setting `BOOT_ORDER=0xf416` or `BOOT_ORDER=0xf461` ensures the Pi 5 checks the NVMe drive).*
3. Press `Ctrl+O`, `Enter`, then `Ctrl+X` to save.
4. Reboot the Pi:
   ```bash
   sudo reboot
   ```

#### Step 4: Verify NVMe SSD Detection
Once rebooted, re-open Cockpit Terminal and verify that the Patriot P300 SSD is detected:

1. **Check PCIe bus enumeration:**
   ```bash
   lspci
   ```
   *Expected output:*
   ```text
   0000:00:00.0 PCI bridge: Broadcom Inc. and subsidiaries ...
   0001:00:00.0 PCI bridge: Broadcom Inc. and subsidiaries ...
   0001:01:00.0 Non-Volatile memory controller: Silicon Motion, Inc. Device 2263 (rev 03)
   ```

2. **Check block storage device:**
   ```bash
   lsblk
   ```
   *Expected output:*
   ```text
   NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
   mmcblk0     179:0    0  59.5G  0 disk 
   ├─mmcblk0p1 179:1    0   512M  0 part /boot/firmware
   └─mmcblk0p2 179:2    0    59G  0 part /
   nvme0n1     259:0    0 119.2G  0 disk 
   ```
   *(Notice `/dev/nvme0n1` is now present with ~119.2GB capacity).*

#### Step 5: Flash GEMS OS Image Directly to `/dev/nvme0n1`
Download and write the GEMS image to the NVMe SSD directly from the terminal:

```bash
# 1. Download the latest GEMS image
curl -LO https://github.com/webdotpulse/GRID-EMS-RELEASE/releases/latest/download/gems-os-image.img.xz

# 2. Decompress and flash directly to the Patriot P300 SSD
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

#### Step 6: Remove SD Card and Enjoy Pure NVMe Boot
1. Disconnect the USB-C power cable.
2. **Eject and remove the MicroSD card.**
3. Power on the Raspberry Pi 5.
4. The Raspberry Pi 5 will boot directly from the **Patriot P300 NVMe SSD** in under 8 seconds.

---

## 🛠️ Physical Installation & Cable Troubleshooting

If the NVMe SSD is still not detected after following the software steps, inspect the physical connection:

```
Raspberry Pi 5 Mainboard                       db-tronic NVMe Base
+-------------------------+                    +-------------------------+
| [USB] [ETH] [PCIe Port] |                    | [ M.2 NVMe SSD Slot ]   |
|                 |       |   FPC Ribbon       |       |                 |
|            [===|===]    |====================|  [===|===]              |
|          Gold Pins Face |                    | Gold Pins Face Contacts |
|          TOWARDS Ports  |                    +-------------------------+
+-------------------------+
```

### Checklist:
1. **FPC Ribbon Orientation on Pi 5 Board:**
   * Look at the 16-pin FPC header on the Raspberry Pi 5 (labeled `PCIe`).
   * Gently lift the dark locking collar straight up by 1mm.
   * Slide the ribbon cable in so that the **gold contacts face INWARD (toward the USB and Ethernet ports)**.
   * Push the black locking collar back down evenly to clamp the ribbon cable.
2. **FPC Ribbon Orientation on db-tronic NVMe HAT:**
   * Ensure the ribbon is completely parallel and not inserted at an angle.
   * Lock the collar firmly.
3. **M.2 Stand-off & Screw:**
   * Ensure the Patriot P300 SSD is fully inserted into the M.2 key slot at a 30-degree angle, pressed flat, and secured with the included M2 screw.
4. **Power Supply:**
   * Always use the official **27W USB-C PD power supply**. 15W phone chargers will drop voltage when the NVMe SSD spins up, causing PCIe link failures.

---

## 📊 Useful Diagnostic Commands (Cockpit Terminal / SSH)

| Diagnostic Task | Command | Expected Healthy Output |
| :--- | :--- | :--- |
| **Check PCIe Bus** | `lspci -v` | Lists `Broadcom PCIe Host Bridge` and `Silicon Motion Non-Volatile memory controller`. |
| **Check Block Devices** | `lsblk` | Shows `/dev/nvme0n1` (119.2G) with partitions `nvme0n1p1` and `nvme0n1p2`. |
| **Inspect Kernel Logs** | `sudo dmesg \| grep -i -E "pci\|nvme"` | `pcieport ... link up, 5.0 GT/s PCIe x1`<br>`nvme nvme0: pci function 0001:01:00.0` |
| **Check EEPROM Config** | `sudo rpi-eeprom-config` | `BOOT_ORDER=0xf461` or `0xf416`<br>`PCIE_PROBE=1` |
| **Benchmark NVMe Speed** | `sudo hdparm -tT /dev/nvme0n1` | Timing buffered disk reads: `~420 to 850 MB/s` (Over 10x faster than MicroSD!). |

---

## 🏁 Summary

With the EEPROM updated (`BOOT_ORDER=0xf461`, `PCIE_PROBE=1`) and `dtparam=pciex1` declared in `config.txt`, your **Patriot P300 128GB SSD** provides ultra-fast read/write speeds, zero SD-card corruption, and reliable 24/7 autonomous operation for **GEMS**.
