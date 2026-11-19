# GEMS P1 Slimme Meter Interface & Zelfbouw-kabelhandleiding

> 🌐 **Taal / Langue / Language:** [English](../p1_port_manual.md) | **Nederlands** | [Français](../fr/p1_port_manual.md)

Deze handleiding biedt volledige technische richtlijnen voor het aansluiten van **GEMS (Grid Energy Management System)** op digitale slimme elektriciteitsmeters via de **P1-poort** (DSMR 5.0.2 / Belgische e-MUCS v1.4). U vindt hier elektrische specificaties, pinbezettingen, de werking van het geïnverteerde open-collectorsignaal, een complete onderdelenlijst (BOM) en stapsgewijze instructies om zelf een **USB-naar-RJ11 / RJ12-kabel** samen te stellen met een hardware-transistorinverter of FTDI-softwarematige inversie.

---

## 1. De P1-gebruikerspoort Begrijpen

Moderne digitale elektriciteitsmeters in België (**Fluvius, Sibelga, ORES, RESA**), Nederland (**Liander, Enexis, Stedin**) en Luxemburg (**Creos**) beschikken over een RJ12-klantinterface gemarkeerd met **P1**.

De P1-poort stuurt officiële, facturatienauwkeurige energiemetingen rechtstreeks vanuit de slimme meter met hoge frequentie naar GEMS (elke seconde op DSMR 5.0- en Fluvius-meters).

### Meetgegevens Verwerkt door GEMS
| Meetwaarde | Frequentie | Rol in GEMS-optimalisatie |
| :--- | :--- | :--- |
| **Actief Afnamevermogen uit het Net (W)** | Elke 1s | Activeert Vlaamse piekbewaking, batterij-ontlading of EV-terugregeling zodra het huisverbruik piekt. |
| **Actief Injectievermogen naar het Net (W)** | Elke 1s | Wordt gestuurd naar de thuisbatterij, EV-laden (6A–32A) of SG-Ready warmtepomp-boost voor maximaal zon-zelfverbruik. |
| **Fasestroom (A) & Fasespanning (V)** | Elke 1s | Bewaakt over fase L1, L2 en L3 voor fasebalancering en bescherming van de hoofdzekering. |
| **Maximale Maandelijkse Kwartierpiek (kW)**<br>`OBIS 1-0:1.6.0` | Elk telegram | Officieel geregistreerd maximaal 15-minuten kwartiervermogen van de lopende maand, gebruikt door het **Slim Adaptief Plafond**. |
| **Cumulatieve Afname/Injectie (kWh)** | Elk telegram | Fiscale telwerken (Tarief 1 Dag / Piek & Tarief 2 Nacht / Dal) voor 100% nauwkeurige energierapporten. |
| **Digitale Gasmeter (m³)** | Elke 5 min | Gasverbruik draadloos via M-Bus doorgestuurd van de gasmeter naar de elektriciteitsmeter. |

---

## 2. Ondersteunde Meters & Transmissieparameters

| Regio / Netbeheerder | Veelvoorkomende Metermodellen | Standaard | Seriële Baudrate |
| :--- | :--- | :--- | :--- |
| **Fluvius (Vlaanderen, BE)** | Sagemcom T211 (3-fasig), S211 (1-fasig), Landis+Gyr E360 | e-MUCS v1.4 / DSMR 5.0.2 | **115.200 baud** (8N1) |
| **Sibelga (Brussel, BE)** | Sagemcom T211 / S211 | e-MUCS v1.4 / DSMR 5.0.2 | **115.200 baud** (8N1) |
| **ORES / RESA (Wallonië, BE)** | Sagemcom T211 / Landis+Gyr E360 | e-MUCS v1.4 / DSMR 5.0.2 | **115.200 baud** (8N1) |
| **Nederland (NL)** | Landis+Gyr E350/E360, Kaifa MA105/MA304, Iskra ME382 | DSMR 5.0.2 / DSMR 4.x | **115.200 baud** (DSMR 5)<br>**9.600 baud** (DSMR 4/3/2) |
| **Creos (Luxemburg)** | Sagemcom T210-D Smarty | e-MUCS / DSMR 5.0 | **115.200 baud** (8N1) |

---

## 3. Fysieke & Elektrische Pinbezetting (RJ12 vs. RJ11)

De P1-aansluiting op de slimme meter is een modulaire **6-positie, 6-contact (6P6C)** bus (RJ12).

### Kunt u een Standaard 4-aderige RJ11-telefoonkabel Gebruiken?
**Ja.** Standaard telefoonstekkers zijn **RJ11 (6P4C)**. Deze passen exact in de 6P6C-aansluiting en maken contact met de middelste **pinnen 2, 3, 4 en 5**. Omdat GEMS via USB met de Raspberry Pi verbindt, haalt de USB-adapter zijn 5V-voeding uit de USB-poort van de Pi, waardoor Pin 1 (+5V uit de meter) niet nodig is!

### Vergelijking Pinbezetting
| Pin # | Signaalnaam | Elektrische Functie | RJ12 (6P6C) | RJ11 (6P4C) |
| :---: | :--- | :--- | :---: | :---: |
| **Pin 1** | **+5V Voeding** | +5 VDC uitgang (tot 250 mA bij DSMR 5.0). Voedt externe dongles. | Ader 1 | *Niet verbonden* |
| **Pin 2** | **Data Request (RTS)** | Ingang. **Moet HOOG (+5V) getrokken worden** om telegramoverdracht te starten. | Ader 2 | Ader 1 |
| **Pin 3** | **Data Ground (GND)** | Signaalreferentiemassa. | Ader 3 | Ader 2 |
| **Pin 4** | **Gereserveerd (NC)** | Niet aangesloten. | Ader 4 | Ader 3 |
| **Pin 5** | **Data Output (TxD)** | Geïnverteerde open-collector seriële uitgang (0V = Mark / Logisch 1). | Ader 5 | Ader 4 |
| **Pin 6** | **Power Ground (GND)** | Voedingsmassa (intern in de meter doorverbonden met Pin 3). | Ader 6 | *Niet verbonden* |

```
    RJ12 (6P6C) Stekkerindeling               RJ11 (6P4C) Stekkerindeling
   ┌─────────────────────────┐               ┌─────────────────────────┐
   │  [1] [2] [3] [4] [5] [6]│               │  [ ] [1] [2] [3] [4] [ ]│
   │   │   │   │   │   │   │ │               │       │   │   │   │     │
   │  +5V RTS GND  NC TXD GND│               │      RTS GND  NC TXD    │
   │                         │               │                         │
   │       Plastic lipje     │               │       Plastic lipje     │
   │     (aan achterzijde)   │               │     (aan achterzijde)   │
   └───────────┬─┬───────────┘               └───────────┬─┬───────────┘
```

---

## 4. Signaalinversie Uitgelegd (Waarom Directe TTL Niet Werkt)

De DSMR- / Fluvius-specificatie schrijft een **open-collector-uitgang met geïnverteerde logica** voor:
- **Rusttoestand (Idle):** Naar 0V getrokken &rarr; Logisch 1
- **Actieve bits:** Naar +5V getrokken &rarr; Logisch 0

Een standaard TTL UART verwacht juist Rust = Hoog (+5V) en Startbit = Laag (0V). Sluit u Pin 5 rechtstreeks aan op een gewone UART RX-pin, dan zijn alle bits omgekeerd, wat resulteert in framingfouten en onleesbare tekens in Linux.

Om dit op te lossen moet het signaal worden geïnverteerd. GEMS ondersteunt twee doe-het-zelf-methoden:
1. **Methode A (Hardware Transistorinverter):** Een NPN-transistor (BC547) met pull-up-weerstand. Compatibel met *alle* USB-serieel-chips (CH340, CP2102, FTDI, PL2303).
2. **Methode B (FTDI Softwarematige Inversie):** Een originele FTDI FT232RL-chip waarvan het RX-signaal intern via het EEPROM wordt geïnverteerd — helemaal zonder losse componenten!

---

## 5. Onderdelenlijst (BOM) & Gereedschap

| Nr. | Onderdeel | Aanbevolen Type | Richtprijs |
| :--- | :--- | :--- | :--- |
| 1 | **USB-naar-Serieel UART-module** | FTDI FT232RL (of CH340G / CP2102) met 5V-logica | € 3,50 – € 6,00 |
| 2 | **Modulaire Stekker & Kabel** | RJ12 (6P6C) of RJ11 (6P4C) stekker + 1–2 m 4/6-aderige platte kabel | € 1,00 |
| 3 | **NPN-transistor** *(Methode A)* | BC547, BC548, 2N3904 of 2N2222 | € 0,15 |
| 4 | **Weerstand R1** *(Methode A)* | 1 kΩ 1/4W weerstand (Pull-up) | € 0,05 |
| 5 | **Weerstand R2** *(Methode A)* | 10 kΩ 1/4W weerstand (Basisstroombegrenzing) | € 0,05 |
| 6 | **Krimpkous** | 3 mm en 6 mm polyolefine krimpkous | € 0,20 |

**Benodigd gereedschap:** Modulaire krimptang, draadstripper, soldeerbout en digitale multimeter.

---

## 6. Methode A: Opbouw met Hardware Transistorinverter

```
  SLIMME METER P1-POORT                             USB-UART PRINTPLAAT (CH340 / FTDI)
  =====================                             ==================================

  [ Pin 2: RTS ] ─────────────────────────────────────────── [ +5V VCC Pin ]
                                                      (Trekt RTS HOOG om te zenden)

  [ Pin 3: GND ] ─────────────────────────────────────────── [ GND Pin ]
                                                      (Signaalmassa)

                                  +5V (uit USB)
                                       │
                                      ┌┴┐
                                      │ │ R1 (1 kΩ Pull-up)
                                      └┬┘
                                       ├──────────── [ RXD Pin ] (Geïnverteerde TTL-ingang)
                                       │
                                     C │
  [ Pin 5: TXD ] ────[ 10 kΩ R2 ]────┤  BC547 (NPN-transistor)
                                     B ╲
                                       │ E
                                       │
  [ Pin 3/6: GND ] ────────────────────┴──────────── [ GND Pin ]
```

### Werking van de Schakeling
1. Wanneer P1 Pin 5 **Laag (0V / Rust)** is, spert de transistor. Weerstand R1 trekt de RXD-pin van de USB-adapter naar **+5V (Hoog)**, exact wat de UART in rust verwacht.
2. Wanneer P1 Pin 5 **Hoog (+5V / Bit 0)** wordt, geleidt de transistor en trekt deze de RXD-pin naar **0V (GND)**.
3. Alle bits worden zuiver geïnverteerd met een vertraging van minder dan een microseconde.

---

## 7. Methode B: Strakke 3-draads FTDI Softwarematige Inversie

Bij gebruik van een originele **FTDI FT232RL** USB-adapter zijn er geen weerstanden of transistoren nodig.

### 3-draads Aansluitschema
```
  SLIMME METER P1 (RJ11 of RJ12)                    FTDI FT232RL USB-ADAPTER
  ==============================                    ========================

  [ Pin 2: RTS ] ─────────────────────────────────── [ +5V (VCC) ] (Trekt RTS Hoog)

  [ Pin 3: GND ] ─────────────────────────────────── [ GND ]

  [ Pin 5: TXD ] ─────────────────────────────────── [ RXD ] (Rechtstreekse verbinding)
```

### FTDI-inversie Flashen onder Linux (in 60 Seconden)
```bash
# 1. Installeer ftdi-eeprom
sudo apt-get update && sudo apt-get install -y ftdi-eeprom

# 2. Maak het configuratiebestand aan
cat << 'EOF' > ftdi_p1.conf
vendor_id=0x0403
product_id=0x6001
invert_rxd=true
EOF

# 3. Schrijf naar het EEPROM van de FTDI-chip
sudo ftdi_eeprom --flash-eeprom ftdi_p1.conf

# 4. Haal de USB-kabel los en sluit deze opnieuw aan
```

*(Gebruik op Windows het gratis hulpprogramma **FT_Prog** van FTDI: Scan &rarr; Hardware Specific &rarr; Invert RS232 Signals &rarr; Vink "Invert RXD" aan &rarr; Program).*

---

## 8. Stapsgewijze Kabelmontage & Multimetercontrole

1. **Kabel strippen:** Strip 25 mm van de buitenmantel en 4 mm van elke individuele ader.
2. **Stekker aankrimpen:** Houd het plastic lipje aan de onderzijde en de koperen contacten naar boven gericht:
   - RJ12 (6P6C): Pin 1 (Links, optioneel 5V) &bull; Pin 2 (RTS) &bull; Pin 3 (GND) &bull; Pin 4 (NC) &bull; Pin 5 (TxD) &bull; Pin 6 (GND).
   - RJ11 (4-aderig): Ader 1 &rarr; Pin 2 (RTS) &bull; Ader 2 &rarr; Pin 3 (GND) &bull; Ader 3 &rarr; Pin 4 (NC) &bull; Ader 4 &rarr; Pin 5 (TxD).
3. **Soldeer op de USB-adapter:** Verbind RTS met +5V, GND met GND en TxD volgens Methode A of Methode B.
4. **Verplichte Veiligheidstest met Multimeter:**
   - Zet de multimeter op **Doorbelstand / Ohm (Ω)**.
   - Meet tussen **+5V en GND**: Controleer dat er **GEEN kortsluiting** is (weerstand moet oneindig / OL zijn).
   - Meet tussen **TxD en GND**: Controleer dat er geen kortsluiting aanwezig is.

---

## 9. De P1-poort Activeren bij Uw Netbeheerder

In België is de P1-poort bij plaatsing standaard elektronisch vergrendeld ter bescherming van de privacy van de klant.

### Activatiestappen bij Fluvius (Vlaanderen, België)
1. Log in op [Mijn Fluvius](https://www.fluvius.be).
2. Ga naar **Meters & Aansluitingen** &rarr; Selecteer uw elektriciteitsmeter (EAN-code).
3. Zoek **"Poorten digitaal beheer (P1 en S1)"** &rarr; Klik op **"Activeer gebruikerspoorten"**.
4. De draadloze activering wordt binnen 15 minuten tot maximaal 72 uur uitgevoerd.
5. **Bevestiging op het Meterdisplay:**
   - **VERGRENDELD:** Dicht hangsloticoon (🔒) boven "P1".
   - **ACTIEF:** Het hangsloticoon verdwijnt en er verschijnt een pijltje naar beneden (▼) boven "P1".

*(In Nederland staan de P1-poorten op DSMR 4- en DSMR 5-meters standaard open).*

---

## 10. Seriële Controle onder Linux

Sluit de USB-kabel aan op uw GEMS Raspberry Pi 5:

```bash
# 1. Controleer USB-herkenning
dmesg | grep -E "ttyUSB|FTDI|ch341"
# Uitvoer: usb 1-1.2: FTDI USB Serial Device converter now attached to ttyUSB0

# 2. Lees live telegrammen uit
stty -F /dev/ttyUSB0 115200 cs8 -cstopb -parenb
cat /dev/ttyUSB0
```

U ziet nu elke seconde heldere ASCII-telegrammen binnenkomen:
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

## 11. De Slimme Meter Configureren in de GEMS-interface

1. Open uw webbrowser en ga naar `http://ems.local`.
2. Navigeer naar **Instellingen &rarr; Toestellen** (ontgrendel eerst de **Gecertificeerde installateursmodus** via het hangsloticoon).
3. **Automatische Detectie met Één Klik (Aanbevolen):** Klik op **Seriële toestellen detecteren** bovenaan het venster *Nieuw energietoestel toevoegen* (of ga naar **Scanner &rarr; Seriële poorten scannen &rarr; Configureren**). GEMS herkent automatisch uw DSMR / e-MUCS P1-meter, het vaste `/dev/serial/by-id/*`-kabelpad en de juiste baudrate (`115200` of `9600`) en vult alle velden voor u in.
4. **Handmatige Selectie:** Of kies de categoriekaart **Slimme Meter**, selecteer de template **DSMR P1 RJ12 Serial Dongle (/dev/serial/by-id)** en controleer:
   - **Toestelnaam:** `Grid Main Smart Meter` (of `Hoofdmeter P1`)
   - **Seriële poort:** Vast pad `/dev/serial/by-id/...` (of klik op **Automatisch detecteren** naast het veld)
   - **Baudrate:** `115200` (voor Fluvius en DSMR 5) of `9600` (voor DSMR 2/3/4)
   - **Uitleesinterval (Poll Interval):** `1` seconde
5. Klik op **Opslaan / Toestel toevoegen**. De meetwaarden verschijnen onmiddellijk live op het **Dashboard**!

---

## 12. Probleemoplossing

| Symptoom | Waarschijnlijke Oorzaak | Oplossing |
| :--- | :--- | :--- |
| **Vreemde tekens of binaire ruis** | Signaalinversie ontbreekt of verkeerde baudrate | Controleer de transistor-inverterschakeling of FTDI `invert_rxd=true`. Zet de baudrate op 115200. |
| **`cat /dev/ttyUSB0` toont helemaal niets** | RTS Pin 2 staat op 0V of de P1-poort is vergrendeld | Meet met een multimeter of Pin 2 +5,0V krijgt. Controleer het LCD-scherm van de meter op het hangsloticoon (activeer de poort via Mijn Fluvius). |
| **"Permission denied" op `/dev/ttyUSB0`** | Gebruiker `gems` mist rechten voor de `dialout`-groep | Voer `sudo usermod -a -G dialout gems && sudo systemctl restart gems` uit. |
| **Poortnaam verspringt naar `/dev/ttyUSB1`** | USB-volgorde gewijzigd na herstart | Gebruik altijd `/dev/serial/by-id/<device-id>` in plaats van `/dev/ttyUSB0` in de GEMS-instellingen. |
| **Incidentele `DSMR CRC mismatch`-meldingen** | EMI-inkoppeling op onafgeschermde RJ12-kabel of passieve P1-splitter | GEMS verwerkt 1 Hz P1-stromen automatisch en herleest verstoorde frames direct; leg de RJ12-kabel gescheiden van zware AC-voedingskabels en gebruik een actieve P1-splitter bij gedeeld poortgebruik. |
