# Spécifications du Matériel de Référence

> 🌐 **Langue / Taal / Language:** [English](../hardware_reference.md) | [Nederlands](../nl/hardware_reference.md) | **Français**

Ce document présente la nomenclature officielle du matériel de référence (Bill of Materials / BOM), les caractéristiques techniques, les exigences de câblage et les recommandations matérielles pour le déploiement de **GEMS (New Energy Grid)**.

---

## 🛠️ Matériel de Référence Officiellement Testé

La combinaison matérielle suivante constitue la plateforme de référence officiellement testée et validée pour GEMS :

| Composant | Spécification Matérielle | Caractéristiques Clés | Norme / Exigence |
| :--- | :--- | :--- | :--- |
| **Contrôleur Système & Base** | **Matériel de Référence Raspberry Pi 5** | • Raspberry Pi 5 (4 Go ou 8 Go de RAM, Quad-Core ARM Cortex-A76 @ 2,4 GHz)<br>• Alimentation officielle Raspberry Pi 27 W USB-C PD<br>• Boîtier métallique en aluminium sur mesure avec refroidissement passif/actif<br>• Refroidisseur actif officiel Raspberry Pi 5 (*Active Cooler*)<br>• Base / HAT M.2 NVMe PCIe avec nappe FPC 16 broches<br>• Carte MicroSD (pour le flashage initial du chargeur d'amorçage) | Plateforme de Référence Officiellement Validée |
| **Stockage Interne (NVMe)** | **SSD M.2 NVMe 128 Go+** | • Format : M.2 2280 M-Key (ou 2230/2242)<br>• Interface : PCIe Gen 3.0 / Gen 2.0 x4 (NVMe 1.3+)<br>• Lecture max. : 1 600+ Mo/s / Écriture max. : 600+ Mo/s<br>• Faible consommation électrique (idéal pour un EMS Raspberry Pi 24h/24 et 7j/7)<br>• Stockage SSD à haute endurance | Stockage NVMe Vérifié |

---

## ⚡ Alimentation & Exigences Électriques

### 1. Exigence d'Alimentation (27 W USB-C PD)
* Lorsqu'un SSD M.2 NVMe est raccordé au connecteur PCIe du Raspberry Pi 5, le système nécessite impérativement une alimentation officielle **5 V / 5 A (27 W)** Power Delivery (PD).
* Les chargeurs standard de 15 W (5 V / 3 A) provoquent des alertes de sous-tension (`dmesg: Under-voltage detected!`) lors des écritures intensives sur le disque NVMe et peuvent entraîner une perte de liaison PCIe.
* Alimenté par le bloc officiel 27 W, le Raspberry Pi 5 délivre jusqu'à 1,6 A sur l'ensemble des ports USB et PCIe.

### 2. Format & Montage Physique
* **Format du SSD :** Les bases et HAT PCIe NVMe standard prennent en charge les formats **M.2 2280** (ainsi que 2230/2242).
* **Nappe plate FPC (16 broches au pas de 0,5 mm) :**
  * Sur la carte mère du Raspberry Pi 5, les pistes dorées doivent être orientées **vers l'intérieur, en direction des ports USB/Ethernet**.
  * Sur le HAT NVMe, les pistes dorées doivent faire face aux contacts du connecteur selon l'orientation prévue par la carte d'extension.
  * Soulevez délicatement les loquets noirs de verrouillage, insérez la nappe parfaitement droite, puis rabattez fermement les loquets.

---

## 🔌 Accessoires Matériels de Communication

Pour le raccordement physique aux onduleurs, batteries et compteurs intelligents :

### 1. Interfaces RS485 / Modbus RTU (USB vers RS485)
* **Chipset :** FTDI FT232RL, Silicon Labs CP2102 ou CH340 / MAX485 avec protection contre les surtensions transitoires (TVS).
* **Raccordement :**
  * **A (D+)** : Raccorder à la borne A de l'onduleur
  * **B (D-)** : Raccorder à la borne B de l'onduleur
  * **GND / COM** : Raccorder à la masse de signal commune
  * **Terminaison** : Résistance de 120 Ω aux extrémités du bus (pour les longueurs > 10 m).

### 2. Câble RJ12 pour Compteur Communicant P1
* **Connecteur :** RJ12 (6P6C).
* **Débit en bauds :** 115 200 bauds (DSMR 5.0 en Belgique / aux Pays-Bas) ou 9 600 bauds (DSMR 2/3).
* **Inversion du signal :** Nécessite un inverseur de signal actif (les signaux série P1 des compteurs communicants belges et néerlandais sont logiquement inversés).

---

## 📖 Documentation Associée
* [Guide de Démarrage & Dépannage NVMe](nvme_boot_guide.md) — Procédure pas à pas pour activer le démarrage sur SSD M.2 NVMe.
* [Manuel d'Utilisation & d'Installation](user_manual.md) — Guide complet de mise en place logicielle.
* [Documentation d'Accès à Distance](remote_access.md) — Configuration de Cockpit et Raspberry Pi Connect.
