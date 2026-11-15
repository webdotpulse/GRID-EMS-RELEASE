# Documentation d'Accès à Distance

> 🌐 **Langue / Taal / Language:** [English](../remote_access.md) | [Nederlands](../nl/remote_access.md) | **Français**

GEMS propose plusieurs méthodes sécurisées pour administrer votre Raspberry Pi et consulter votre tableau de bord énergétique à distance :
- **GRID-EMS-SERVER (Intégration Cloud Officielle — 100 % Optionnelle)** : Portail cloud centralisé pour la consultation mobile/bureau et la gestion de flotte.
- **Console Web Cockpit** : Interface graphique web d'administration système Linux et terminal intégré sur le port `9090`.
- **Raspberry Pi Connect** : Partage d'écran du bureau local directement depuis un navigateur web.

---

## GRID-EMS-SERVER (Plateforme Cloud Officielle — 100 % Optionnelle)

GEMS repose sur un principe strict **local-first** : toutes les boucles d'équilibrage solaire, d'optimisation batterie, de recharge VE et de protection électrique s'exécutent à 100 % localement sur le matériel edge Raspberry Pi. La connectivité cloud est entièrement facultative et n'est jamais requise pour le fonctionnement normal.

Si vous ou votre installateur souhaitez accéder au tableau de bord en direct hors du réseau domestique, superviser plusieurs sites ou bénéficier d'un télédiagnostic, GEMS peut être associé à **GRID-EMS-SERVER** (`https://ems.newenergygrid.com`).

### Fonctionnalités & Sécurité
* **Connexions Sortantes TLS 1.3 Uniquement :** GEMS initie exclusivement des connexions sortantes chiffrées en HTTPS. Aucune redirection de port (*port forwarding*), aucun DDNS ni aucune modification du pare-feu du routeur ne sont nécessaires.
* **Appairage Instantané :** Générez un jeton d'appairage à 16 caractères sur le portail cloud, saisissez-le dans **Paramètres &rarr; Serveur Cloud**, puis cliquez sur *Appairer & Connecter*.
* **Gestion de Flotte à Distance :** Modifiez les modes de stratégie, consultez les mesures en direct et analysez l'historique de performance depuis n'importe où dans le monde.

---

## Cockpit

Cockpit est une interface web graphique d'administration serveur permettant de superviser les services système, de suivre les performances et d'ouvrir un terminal directement depuis votre navigateur.

### Accéder à Cockpit
1. Vérifiez que votre Raspberry Pi est sous tension et connecté à votre réseau local.
2. Ouvrez un navigateur web depuis un appareil situé sur le même réseau.
3. Accédez à l'adresse :
   ```
   https://<adresse-ip-du-raspberry-pi>:9090
   ```
   *(Ou `https://ems.local:9090` si votre réseau prend en charge mDNS).*
4. **Identifiants de Connexion** :
   - Authentifiez-vous à l'aide des identifiants administrateur Linux provisionnés en usine pour votre compte installateur agréé.
   *(Modifiez systématiquement les identifiants initiaux lors de la mise en service via le terminal ou l'interface Cockpit).*

### Fonctionnalités
- **Supervision Système :** Visualisation de l'utilisation CPU, mémoire et réseau.
- **Gestion des Services :** Démarrage, arrêt et inspection des services `systemd` (par ex. `gems.service` ou `nginx`).
- **Accès Terminal :** Accès complet à un shell bash avec privilèges administrateur sans client SSH externe.
- **Lecteur de Journaux :** Consultation directe des journaux système (`journalctl`) pour diagnostiquer le matériel ou la connectivité.

---

## Raspberry Pi Connect

Raspberry Pi Connect offre un partage d'écran distant sécurisé permettant aux techniciens de support habilités d'inspecter l'environnement de bureau local minimal (`http://127.0.0.1`) sans configurer de VPN ni ouvrir de ports sur votre routeur.

L'image système personnalisée est préconfigurée avec :
- Un environnement de bureau Wayland minimal (`wayfire`) exécuté sous l'utilisateur dédié non privilégié `gems-kiosk`, lançant automatiquement Chromium en mode kiosque sur `http://127.0.0.1`.
- Les services utilisateur `systemd` `rpi-connect` et `rpi-connect-wayvnc` prêts pour un appairage optionnel.
- **Confidentialité Supervisée par Défaut** : L'acceptation automatique sans surveillance du partage d'écran est **désactivée par défaut** (`auto_accept = false`) et les notifications visuelles de connexion sont activées (`show_notifications = true`), garantissant un appairage et un consentement explicites.

### Configuration Initiale & Appairage (Optionnel)
Pour associer une unité à un compte de support Raspberry Pi Connect autorisé :

1. **Ouvrir le Terminal :** Utilisez SSH ou le terminal intégré à **Cockpit** (`https://<ip>:9090`).
2. **Activer les Services pour le Compte Kiosque :**
   ```bash
   sudo loginctl enable-linger gems-kiosk
   sudo -u gems-kiosk XDG_RUNTIME_DIR=/run/user/$(id -u gems-kiosk) systemctl --user enable --now rpi-connect rpi-connect-wayvnc
   ```
3. **Appairer l'Unité :**
   Exécutez la commande suivante pour générer un lien d'appairage :
   ```bash
   sudo -u gems-kiosk XDG_RUNTIME_DIR=/run/user/$(id -u gems-kiosk) rpi-connect signin
   ```
   *Ouvrez l'URL fournie dans votre navigateur pour vous connecter avec votre Raspberry Pi ID et finaliser l'appairage.*

### Accéder au Tableau de Bord à Distance
Une fois l'unité appairée :
1. Rendez-vous sur [connect.raspberrypi.com](https://connect.raspberrypi.com) et connectez-vous.
2. Sélectionnez votre unité (`ems`) et cliquez sur **Screen Sharing**.
3. Approuvez la session sur l'écran local (ou appliquez la politique de télémaintenance supervisée du site) pour visualiser le tableau de bord kiosque local (`http://127.0.0.1`).

---

## Autorité CA Locale & HTTPS Sans Avertissement

Lors de l'accès au tableau de bord GEMS en HTTPS via `localhost`, `ems.local`, `gems.local` ou un nom de domaine local personnalisé (tel que `myems.lan`), les navigateurs affichent habituellement un avertissement de sécurité (`NET::ERR_CERT_AUTHORITY_INVALID` ou `NET::ERR_CERT_COMMON_NAME_INVALID`) face à un certificat auto-signé non reconnu.

GEMS intègre un moteur d'**Autorité de Certification (CA) Locale** qui élimine totalement cet avertissement :

1. **Génération Automatique de l'Autorité Racine (Root CA)** : GEMS génère ou adopte automatiquement une autorité racine locale (`ca.crt`).
2. **Couverture SAN Complète** : Les certificats serveur (`cert.pem`) incluent automatiquement toutes les interfaces de bouclage (`127.0.0.1`, `::1`), les noms d'hôte standards (`localhost`, `ems.local`, `gems.local`, `*.ems.local`, `*.gems.local`), les adresses IP locales de l'unité et les domaines personnalisés configurés.
3. **Confiance Locale Sans Alerte Navigateur** :
   - Exécutez `./scripts/setup-local-ca.sh [domaine-personnalisé]` pour enregistrer automatiquement la Root CA dans le magasin NSS de Google Chrome / Chromium (`~/.pki/nssdb`) et de Firefox.
   - Sur smartphones, tablettes et postes distants, téléchargez directement la Root CA depuis `http://<ip>:8080/api/ca.crt` (ou depuis **Paramètres &rarr; Infos système** lorsque le **Mode installateur certifié** est déverrouillé) et installez-la comme autorité de certification approuvée.
4. **Mise à Jour Dynamique des Domaines (Mode installateur certifié)** : Déverrouillez le **Mode installateur certifié** via l'icône cadenas dans **Paramètres** et ajoutez vos domaines personnalisés sous **Paramètres &rarr; Infos système &rarr; Autorité CA locale & Certificat SSL** pour régénérer et recharger à chaud le certificat SSL sans aucune interruption de service.
