# Architecture Overview

GEMS (Grid Energy Management System by New Energy Grid) is designed as a lightweight, embedded Energy Management System (EMS) optimized for running on low-powered ARM hardware (like a Raspberry Pi) without wearing out the SD card.

## High-Level Architecture

The system follows a monolith architecture composed of two main parts:
1. **Go Backend:** A statically compiled binary that serves both the JSON API, handles hardware device polling (Modbus/REST/UDP), executes energy control strategies, runs an embedded OCPP 1.6/2.0.1 WebSocket server, and serves the static frontend assets. The build number is injected as a release tag at compile time via `-ldflags="-X main.BuildNumber=${GITHUB_REF_NAME}"`, and CPU data is explicitly omitted from system info endpoints.
2. **Vue 3 Frontend:** A Single Page Application (SPA) that provides a fully UI-driven interface for monitoring and configuring the EMS.

Both parts are combined during the CI/CD release process into a single Debian (`.deb`) package, encapsulating the frontend assets and the backend binary. This package sets up the restricted `gems` system user and manages the `gems.service` systemd unit. For seamless onboarding, the project also generates a custom Raspberry Pi OS Lite image that pre-installs the `.deb` package, `nginx` as a reverse proxy (routing port 80 to `ems.local`), a minimal Wayland desktop (`wayfire`) configured to launch Chromium in kiosk mode displaying the GEMS UI (`ems.local`), and `rpi-connect` configured for auto-accepted remote screen sharing (host set to `ems`).

```mermaid
graph TD
    UI[Vue 3 Frontend SPA] <-->|HTTP REST & WebSockets/SSE| API[Go Backend API]
    API <--> PM[Poller Manager]
    PM <-->|Modbus/REST/Serial| Devices[Physical Inverters, Chargers, Meters, Relays]
    PM -->|Batched Writes| DB[(SQLite DB with WAL)]
    API <--> SC[Strategy Controller]
    API <--> Pricing[Dynamic Pricing Engine]
    SC -->|Hardware Limits & Curtailment| Devices
    API <-->|WebSocket| OCPP[Native OCPP Server]
    OCPP <-->|OCPP 1.6/2.0.1| EVCharger[EV Chargers]
```

## Data Flow

### 1. Device Polling (`PollerManager`)
- The `PollerManager` instantiates "Pollers" based on configured device templates (90 native hardware templates covering Huawei, SMA, Solis, Fronius, SolarEdge, Eastron, Fluvius P1, Shelly, Easee, Alfen, etc.).
- It runs two tickers:
  - **Fast Ticker (1s):** Polls high-frequency devices (like smart meters) to ensure rapid reaction times for peak shaving and zero-export logic.
  - **Standard Ticker (5s):** Polls heavier devices (like inverters and EV chargers).
- Polled data is immediately cached in memory (`deviceCache`) to decouple hardware IO from UI responsiveness.

### 2. Native OCPP Server
- A built-in WebSocket server at `/api/ocpp/` (or port 8887) handles incoming connections from EV Chargers.
- The `OcppState` struct receives live telemetry (e.g., `MeterValues`, `Heartbeat`, `BootNotification`) directly from the charger with zero cloud dependencies.

### 3. Live Site State (WebSockets & SSE)
- When new data is polled, the `PollerManager` aggregates the data (total grid, total solar, battery SOC, EV power) into a `SiteState` struct.
- This struct is broadcasted to the frontend via WebSockets and Server-Sent Events (SSE) at `/api/live`. This allows the Vue dashboard and live powerflow graphic to update in real-time without continuous AJAX polling.

### 4. Historical Data & Database
- To minimize SD card wear, the `PollerManager` buffers polled measurements in memory.
- Every 1 minute, the `flushBuffer` function runs, averages the buffered data, and performs a single transactional `INSERT` into the SQLite `measurements` table.
- SQLite is configured with WAL mode (`journal_mode=WAL`), `synchronous=NORMAL`, and `temp_store=MEMORY` to further reduce disk I/O and optimize NVMe lifespan.

### 5. Strategy & Pricing Execution
- The `StrategyController` runs a background loop (every 1 second).
- It reads the latest `deviceCache` from the `PollerManager` and categorizes the measurements using the `registry.GetCategory()` properties to aggregate composite values (`totalGridImport`, `totalSolar`).
- Based on the user's selected strategy (Eco, Flanders, Netherlands), it calculates optimal setpoints:
  - **Predictive Peak Shaving & Flanders Mode:** An instantaneous power allowance is dynamically calculated based on elapsed time in the synchronized 15-minute window and accumulated energy. GEMS tracks true 15-minute rolling average import peaks in SQLite (`/api/peaks/monthly`) and employs a Smart Adaptive Ceiling.
  - **Dynamic Battery Arbitrage:** The EMS optimizes battery operation via Day-Ahead EPEX spot prices using dynamic price spreads.
  - **Belgian Contract Engine:** Resolves dynamic formulas for TotalEnergies, Mega, Bolt, Engie, Luminus, Eneco, etc. and calculates stacked breakdowns for `/api/tariffs/breakdown`.
- It then safely dispatches hardware commands, immediately checking for execution errors (`err == nil`) before reflecting state updates within the internal EMS `strategyMaps`.

## Design Decisions

- **Scope Directives:** Car integration, billing, RFID, and ENTSO-E/imbalance APIs are strictly forbidden.
- **Network Scanner Heuristics:** To achieve zero-dependency network discovery across multiple manufacturer hardware types, GEMS implements localized mapping of MAC Organizationally Unique Identifiers (OUIs). This avoids runtime third-party API dependencies and ensures rapid scanning performance.
- **No YAML:** GEMS strictly uses a UI-driven database approach. Device configurations are stored in SQLite. This lowers the barrier to entry for non-technical users.
- **Null Safety in JSON:** The `SiteState` struct uses pointers for float values (`*float64`). If a device type (e.g., a Battery) is not configured, the pointer remains `nil`, resulting in `null` in the JSON payload. The Vue frontend uses this `null` state to completely hide the relevant UI cards, rather than displaying `0 W`.
- **Registry Pattern for Devices:** Device templates are added by creating a new file in `backend/internal/templates/` and calling `registry.RegisterTemplate()` inside the `init()` function. This makes adding new hardware integrations highly modular.
