# Remote Access Documentation

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
   http://<raspberry-pi-ip-address>:9090
   ```
   *(Or `http://ems.local:9090` if your network supports mDNS).*
4. **Login Credentials**:
   - Username: `admin`
   - Password: `manufacturer`
   *(It is highly recommended to change this password after your first login via the terminal or Cockpit interface).*

### Features
- **System Monitoring:** View CPU, Memory, and Network usage.
- **Service Management:** Start, stop, and inspect systemd services (e.g., `gems.service` or `nginx`).
- **Terminal Access:** Access a full root-capable bash shell without needing an SSH client.
- **Log Viewer:** Easily read system logs (`journalctl`) to diagnose hardware or connectivity issues.

---

## Raspberry Pi Connect

Raspberry Pi Connect provides secure remote screen sharing, allowing you to access the minimal desktop environment and the GEMS dashboard (`http://ems.local`) from anywhere in the world, without setting up a VPN or configuring port forwarding on your router.

The custom OS image comes pre-configured with:
- A minimal Wayland desktop environment (`wayfire`) autostarting Chromium in kiosk mode pointing directly to `http://ems.local`.
- `rpi-connect` and `rpi-connect-wayvnc` user-level systemd services.
- **Automatic Screen Sharing Acceptance**: Incoming screen sharing requests via Raspberry Pi Connect are accepted automatically by the device without requiring physical confirmation on the Pi screen.
- Session lingering enabled (`loginctl enable-linger gems`) so screen sharing services run unattended on boot without requiring a physical monitor attached.

### Initial Setup & Pairing
To link your device to your Raspberry Pi ID:

1. **Access the Terminal:** Use SSH or the terminal provided by **Cockpit** (on port 9090).
2. **Ensure Services are Active:**
   ```bash
   loginctl enable-linger gems
   systemctl --user enable --now rpi-connect
   systemctl --user enable --now rpi-connect-wayvnc
   ```
3. **Pair the Device:**
   Run the following command to generate a pairing link:
   ```bash
   rpi-connect signin
   ```
   *Follow the provided URL in your browser to log in to your Raspberry Pi ID and complete pairing.*

### Accessing the Dashboard Remotely
Once paired:
1. Go to [connect.raspberrypi.com](https://connect.raspberrypi.com) and log in.
2. Select your device (`ems`) and click **Screen Sharing**.
3. The connection will be **automatically accepted** by the device, bringing you straight into the desktop environment where the GEMS UI (`http://ems.local`) is automatically displayed in kiosk mode.

---

## Local CA Certificate & Zero-Warning HTTPS

When accessing the GEMS dashboard over HTTPS on `localhost`, `ems.local`, `gems.local`, or custom local network domains (such as `myems.lan`), browsers normally display a security warning (`NET::ERR_CERT_AUTHORITY_INVALID` or `NET::ERR_CERT_COMMON_NAME_INVALID`) when presented with an untrusted self-signed certificate.

GEMS includes an integrated **Local Certificate Authority (CA)** engine that solves this completely:

1. **Automatic Root CA Generation**: GEMS generates or adopts a local Root CA (`ca.crt`).
2. **Comprehensive SAN Coverage**: Server certificates (`cert.pem`) are automatically signed with all loopback interfaces (`127.0.0.1`, `::1`), standard hostnames (`localhost`, `ems.local`, `gems.local`, `*.ems.local`, `*.gems.local`), local machine IP addresses, and user-specified custom domains.
3. **Zero-Warning Local Trust**:
   - Run `./scripts/setup-local-ca.sh [custom domain]` to automatically register the Root CA in Google Chrome / Chromium's NSS store (`~/.pki/nssdb`) and Firefox.
   - For phones, tablets, and remote PCs, download the Root CA directly from `http://<ip>:8080/api/ca.crt` or via **Settings &rarr; System Information** and install it as a trusted certificate authority.
4. **Dynamic Domain Updates**: Add custom domains via **Settings &rarr; System Information &rarr; Local CA & SSL Certificate** or via `POST /api/system/certificate/domains` for immediate on-the-fly certificate regeneration and hot-reloading with zero downtime.