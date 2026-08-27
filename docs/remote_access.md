# Remote Access Documentation

GEMS custom OS images include two powerful tools to help you manage your Raspberry Pi and access your dashboard remotely: **Cockpit** and **Raspberry Pi Connect**.

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
- Session lingering enabled (`loginctl enable-linger nems`) so screen sharing services run unattended on boot without requiring a physical monitor attached.

### Initial Setup & Pairing
To link your device to your Raspberry Pi ID:

1. **Access the Terminal:** Use SSH or the terminal provided by **Cockpit** (on port 9090).
2. **Ensure Services are Active:**
   ```bash
   loginctl enable-linger nems
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