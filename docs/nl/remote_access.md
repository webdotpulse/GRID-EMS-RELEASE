# Documentatie Toegang op Afstand

> 🌐 **Taal / Langue / Language:** [English](../remote_access.md) | **Nederlands** | [Français](../fr/remote_access.md)

GEMS biedt meerdere veilige methoden om uw Raspberry Pi te beheren en uw energiedashboard op afstand te raadplegen:
- **GRID-EMS-SERVER (Officiële Cloudintegratie — 100% Optioneel)**: Centraal cloudportaal voor weergave op smartphone/desktop en centraal vlootbeheer.
- **Cockpit Webconsole**: Webgebaseerd grafisch Linux-systeembeheer en terminal op poort `9090`.
- **Raspberry Pi Connect**: Browsergebaseerd schermdelen op afstand.

---

## GRID-EMS-SERVER (Officieel Cloudplatform — 100% Optioneel)

GEMS is ontworpen volgens een strikt **local-first principe**: alle zonne-optimalisatie, batterijsturing, EV-laadsturing en netbeveiligingslussen draaien 100% lokaal op de Raspberry Pi edge-hardware. Cloudverbinding is volledig optioneel en nooit vereist voor de dagelijkse werking.

Wanneer u of uw installateur het live dashboard buiten het thuisnetwerk wilt bekijken, meerdere installaties wilt beheren of ondersteuning op afstand wenst, kan GEMS worden gekoppeld aan **GRID-EMS-SERVER** (`https://ems.newenergygrid.com`).

### Functies & Beveiliging
* **Uitsluitend Uitgaande TLS 1.3:** GEMS bouwt alle verbindingen uitgaand op via versleuteld HTTPS. Port forwarding, DDNS of wijzigingen in de routerfirewall zijn nooit nodig.
* **Directe Koppeling:** Genereer een koppelingstoken van 16 tekens in het cloudportaal, voer deze in onder **Instellingen &rarr; Cloudserver** en klik op *Koppelen & Verbinden*.
* **Vlootbeheer op Afstand:** Pas strategiemodi aan, bekijk live meetwaarden en inspecteer historische prestatielogboeken overal ter wereld.

---

## Cockpit

Cockpit is een webgebaseerde grafische beheerinterface voor Linux-servers. Hiermee beheert u systeemservices, bewaakt u systeemprestaties en opent u rechtstreeks een terminal vanuit uw webbrowser.

### Toegang tot Cockpit
1. Controleer of uw Raspberry Pi is verbonden met uw lokale netwerk en ingeschakeld is.
2. Open een webbrowser op een toestel in hetzelfde netwerk.
3. Navigeer naar:
   ```
   https://<ip-adres-van-raspberry-pi>:9090
   ```
   *(Of `https://ems.local:9090` indien uw netwerk mDNS ondersteunt).*
4. **Aanmeldgegevens**:
   - Meld u aan met de in de fabriek ingestelde Linux-beheerdersgegevens die aan uw geautoriseerde installateursaccount zijn toegewezen.
   *(Wijzig bij oplevering altijd de initiële wachtwoorden via de terminal of de Cockpit-interface).*

### Mogelijkheden
- **Systeemmonitoring:** Bekijk CPU-, geheugen- en netwerkgebruik.
- **Servicebeheer:** Start, stop en inspecteer systemd-services (zoals `gems.service` of `nginx`).
- **Terminaltoegang:** Gebruik een volledige bash-shell met beheerdersrechten zonder aparte SSH-client.
- **Logboekviewer:** Raadpleeg systeemlogboeken (`journalctl`) om hardware- of verbindingsproblemen snel te analyseren.

---

## Raspberry Pi Connect

Raspberry Pi Connect biedt beveiligd schermdelen op afstand, zodat geautoriseerde supporttechnici de minimale lokale desktopomgeving (`http://127.0.0.1`) kunnen meekijken zonder een VPN op te zetten of port forwarding in uw router te configureren.

Het aangepaste OS-image is standaard voorbereid met:
- Een minimale Wayland-desktopomgeving (`wayfire`) onder de afgeschermde, onbevoorrechte gebruiker `gems-kiosk`, die automatisch Chromium in kioskmodus opstart op `http://127.0.0.1`.
- De systemd-gebruikersservices `rpi-connect` en `rpi-connect-wayvnc` klaar voor optionele koppeling.
- **Privacy-eerst Standaardinstellingen onder Toezicht**: Onbeheerde automatische acceptatie van schermdelen staat **standaard uitgeschakeld** (`auto_accept = false`) met zichtbare verbindingsmeldingen op het scherm ingeschakeld (`show_notifications = true`), zodat schermdelen altijd expliciete koppeling en toestemming vereist.

### Initiële Installatie & Koppeling (Optioneel)
Om een controller te koppelen aan een geautoriseerd Raspberry Pi Connect-supportaccount:

1. **Open de Terminal:** Gebruik SSH of de terminal in **Cockpit** (`https://<ip>:9090`).
2. **Activeer de Services voor het Kiosk-account:**
   ```bash
   sudo loginctl enable-linger gems-kiosk
   sudo -u gems-kiosk XDG_RUNTIME_DIR=/run/user/$(id -u gems-kiosk) systemctl --user enable --now rpi-connect rpi-connect-wayvnc
   ```
3. **Koppel het Toestel:**
   Voer het volgende commando uit om een koppelingslink te genereren:
   ```bash
   sudo -u gems-kiosk XDG_RUNTIME_DIR=/run/user/$(id -u gems-kiosk) rpi-connect signin
   ```
   *Open de weergegeven URL in uw browser om in te loggen met uw Raspberry Pi ID en de koppeling te voltooien.*

### Het Dashboard op Afstand Bekijken
Na koppeling:
1. Ga naar [connect.raspberrypi.com](https://connect.raspberrypi.com) en log in.
2. Selecteer uw toestel (`ems`) en klik op **Screen Sharing**.
3. Keur de sessie goed op het lokale scherm (of configureer een beheerd onderhoudsbeleid volgens de beveiligingsrichtlijnen van de locatie) om het lokale kioskdashboard (`http://127.0.0.1`) te bekijken.

---

## Lokale CA & Waarschuwingsvrij HTTPS

Wanneer u het GEMS-dashboard via HTTPS opent op `localhost`, `ems.local`, `gems.local` of een eigen lokaal netwerkdomein (zoals `myems.lan`), tonen webbrowsers normaal gesproken een beveiligingswaarschuwing (`NET::ERR_CERT_AUTHORITY_INVALID` of `NET::ERR_CERT_COMMON_NAME_INVALID`) bij een onbekend zelfondertekend certificaat.

GEMS beschikt over een ingebouwde **Local Certificate Authority (CA)**-engine die dit volledig oplost:

1. **Automatische Generatie van Root-CA**: GEMS genereert of gebruikt automatisch een lokale Root-CA (`ca.crt`).
2. **Volledige SAN-dekking**: Servercertificaten (`cert.pem`) worden automatisch ondertekend voor alle loopback-interfaces (`127.0.0.1`, `::1`), standaard hostnamen (`localhost`, `ems.local`, `gems.local`, `*.ems.local`, `*.gems.local`), lokale IP-adressen van de controller én door de gebruiker opgegeven domeinnamen.
3. **Waarschuwingsvrij Lokaal Vertrouwen**:
   - Voer `./scripts/setup-local-ca.sh [eigen-domein]` uit om de Root-CA automatisch te registreren in de NSS-opslag van Google Chrome / Chromium (`~/.pki/nssdb`) en Firefox.
   - Voor smartphones, tablets en externe pc's downloadt u het Root-CA-certificaat rechtstreeks via `http://<ip>:8080/api/ca.crt` (of via **Instellingen &rarr; Systeeminformatie** wanneer de **Gecertificeerde installateursmodus** is ontgrendeld) en installeert u dit als vertrouwde certificaatautoriteit.
4. **Dynamische Domeinupdates (Gecertificeerde installateursmodus)**: Ontgrendel de **Gecertificeerde installateursmodus** via het hangsloticoon in **Instellingen** en voeg extra domeinnamen toe onder **Instellingen &rarr; Systeeminformatie &rarr; Lokale CA & SSL-certificaat** om het SSL-certificaat direct en zonder onderbreking opnieuw te genereren en te activeren.
