# Remote Access Documentation

> 🌐 **Language / Taal / Langue:** **English** | [Nederlands](nl/remote_access.md) | [Français](fr/remote_access.md)

GEMS provides multiple methods to manage your Raspberry Pi and access your energy dashboard remotely:
- **GRID-EMS-SERVER (Official Cloud Integration - 100% Optional)**: Centralized cloud portal for mobile/desktop dashboard mirroring and fleet management.
- **Cockpit Web Console**: Web-based graphical Linux system administration and terminal on port `9090`.
- **Raspberry Pi Connect**: Browser-based remote desktop screen sharing.

---

## GRID-EMS-SERVER (Official Cloud Platform - 100% Optional)

GEMS is architected with a **local-first principle**: all solar balancing, battery optimization, EV charging, and grid protection loops execute 100% locally on the Raspberry Pi edge hardware. Cloud connectivity is completely optional and never required for normal operation.

If you or your installer wish to access the live dashboard from outside your home network, manage multiple installations, or receive remote assistance, GEMS can be linked to **GRID-EMS-SERVER** (`https://ems.newenergygrid.com`).

### Features & Security
* **Outbound-Only TLS 1.3:** GEMS initiates all connections outbound over encrypted HTTPS. No port forwarding, DDNS, or router firewall changes are ever required.
* **Instant Pairing:** Generate a 16-character pairing token in the cloud portal, enter it under **Settings &rarr; Cloud Server**, and click *Pair & Connect Now*.
* **Remote Fleet Management:** Adjust strategy modes, view live metrics, and inspect historical performance logs from anywhere in the world.

---

## Cockpit

Cockpit is a web-based graphical interface for servers. It allows you to manage system services, monitor performance, and access a terminal directly from your web browser.

### Accessing Cockpit
1. Ensure your Raspberry Pi is connected to your local network and powered on.
2. Open a web browser on a device on the same network.
3. Navigate to:
   ```
   https://<raspberry-pi-ip-address>:9090
   ```
   *(Or `https://ems.local:9090` if your network supports mDNS).*
4. **Login Credentials**:
   - Authenticate using the factory-provisioned Linux administrator credentials assigned to your authorized installer account.
   *(Always rotate initial provisioning credentials upon commissioning via the terminal or Cockpit interface).*

### Features
- **System Monitoring:** View CPU, Memory, and Network usage.
- **Service Management:** Start, stop, and inspect systemd services (e.g., `gems.service` or `nginx`).
- **Terminal Access:** Access a full root-capable bash shell without needing an SSH client.
- **Log Viewer:** Easily read system logs (`journalctl`) to diagnose hardware or connectivity issues.

---

## Raspberry Pi Connect

Raspberry Pi Connect provides secure remote screen sharing, allowing authorized support engineers to inspect the minimal local desktop environment (`http://127.0.0.1`) without setting up a VPN or configuring port forwarding on your router.

The custom OS image comes pre-configured with:
- A minimal Wayland desktop environment (`wayfire`) running under the dedicated unprivileged `gems-kiosk` user, autostarting Chromium in kiosk mode pointing directly to `http://127.0.0.1`.
- `rpi-connect` and `rpi-connect-wayvnc` user-level systemd services available for optional pairing.
- **Supervised Privacy-First Defaults**: Unattended automatic screen sharing acceptance is **disabled by default** (`auto_accept = false`) with visible on-screen connection notifications enabled (`show_notifications = true`), ensuring screen sharing requires explicit pairing and consent.

### Initial Setup & Pairing (Optional)
To link an appliance to an authorized Raspberry Pi Connect support account:

1. **Access the Terminal:** Use SSH or the terminal provided by **Cockpit** (`https://<ip>:9090`).
2. **Enable Services for the Kiosk Account:**
   ```bash
   sudo loginctl enable-linger gems-kiosk
   sudo -u gems-kiosk XDG_RUNTIME_DIR=/run/user/$(id -u gems-kiosk) systemctl --user enable --now rpi-connect rpi-connect-wayvnc
   ```
3. **Pair the Device:**
   Run the following command to generate a pairing link:
   ```bash
   sudo -u gems-kiosk XDG_RUNTIME_DIR=/run/user/$(id -u gems-kiosk) rpi-connect signin
   ```
   *Follow the provided URL in your browser to log in to your Raspberry Pi ID and complete pairing.*

### Accessing the Dashboard Remotely
Once paired:
1. Go to [connect.raspberrypi.com](https://connect.raspberrypi.com) and log in.
2. Select your device (`ems`) and click **Screen Sharing**.
3. Approve the screen sharing session on the local display (or configure supervised remote maintenance policy per site security rules) to view the local kiosk dashboard (`http://127.0.0.1`).

---

## Local CA Certificate & Zero-Warning HTTPS

When accessing the GEMS dashboard over HTTPS on `localhost`, `ems.local`, `gems.local`, or custom local network domains (such as `myems.lan`), browsers normally display a security warning (`NET::ERR_CERT_AUTHORITY_INVALID` or `NET::ERR_CERT_COMMON_NAME_INVALID`) when presented with an untrusted self-signed certificate.

GEMS includes an integrated **Local Certificate Authority (CA)** engine that solves this completely:

1. **Automatic Root CA Generation**: GEMS generates or adopts a local Root CA (`ca.crt`).
2. **Comprehensive SAN Coverage**: Server certificates (`cert.pem`) are automatically signed with all loopback interfaces (`127.0.0.1`, `::1`), standard hostnames (`localhost`, `ems.local`, `gems.local`, `*.ems.local`, `*.gems.local`), local machine IP addresses, and user-specified custom domains.
3. **Zero-Warning Local Trust**:
   - Run `./scripts/setup-local-ca.sh [custom domain]` to automatically register the Root CA in Google Chrome / Chromium's NSS store (`~/.pki/nssdb`) and Firefox.
   - For phones, tablets, and remote PCs, download the Root CA directly from `http://<ip>:8080/api/ca.crt` (or via **Settings &rarr; System Information** when **Certified Installer Mode** is unlocked) and install it as a trusted certificate authority.
4. **Dynamic Domain Updates (Certified Installer Mode)**: Unlock **Certified Installer Mode** via the padlock icon in Settings and add custom domains under **Settings &rarr; System Information &rarr; Local CA & SSL Certificate** for immediate on-the-fly certificate regeneration and hot-reloading with zero downtime.
