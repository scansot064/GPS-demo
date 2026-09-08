# 🛰️ GPS Demonstration: The Science Behind Satellite Trilateration

An interactive, browser-based demonstration designed for **secondary school physics, math, and geography students** to understand the science, geometry, and technology behind the Global Positioning System (GPS).

Zero build steps, zero package installations—simply open `index.html` in any modern web browser!

---

## 🌟 Key Sections

### 1. The Science and the Equations
- **The Speed of Light ($c pprox 299,792.458\text{ km/s}$)**: Radio waves traveling across space in ~67 milliseconds.
- **Time of Flight ($d = c \times \Delta t$)**: Measuring nanosecond time differences between satellite atomic clocks and receiver clocks.
- **Spherical Trilateration**:
  $$(X - X_i)^2 + (Y - Y_i)^2 + (Z - Z_i)^2 = d_i^2$$
- **Trilateration vs. Triangulation**: Explaining why GPS measures *distances* (trilateration), not *angles* (triangulation).
- **The 4th Satellite Mystery**: Why 3 satellites mathematically yield two points (one on Earth, one deep in space), and why real-world receivers use a 4th satellite to calibrate quartz clock drift.

### 2. Interactive 3D Earth & Satellite Constellation
- **Rotatable 3D Globe**: Rendered in Three.js with vector continent coastlines from Natural Earth.
- **Click to Place Receiver**: Click or tap anywhere on Earth to set a ground target (automatically snapped to whole degrees for educational simplicity).
- **Satellite Deployment & Squiggly Beams**: Press **"Acquire Satellites"** to spawn 3 GPS satellites in high orbit (~20,200 km altitude) beaming animated sinusoidal electromagnetic radio waves down to the target!
- **City Presets**: Quickly jump to famous world cities (Madrid, London, New York, Tokyo, Sydney, Cairo, etc.).

### 3. Smartwatch Telemetry Simulation
- **Realistic Receiver UI**: A stylized smartwatch display showing what a GPS chip actually "hears".
- **3 Satellite Data Feeds**:
  - Satellite ID & PRN code (e.g. NAVSTAR SVN 12 / PRN 12)
  - 3D ECEF Orbit Coordinates in kilometers
  - Broadcast timestamp ($t_{\text{tx}}$) and arrival timestamp ($t_{\text{rx}}$)
  - Time delta ($\Delta t \approx 65\text{--}80\text{ ms}$)
  - Calculated pseudorange distance ($d = c \times \Delta t$)
  - Signal strength meter (SNR in dB-Hz)

### 4. Coordinate Calculation Animation (Step-by-Step Solver)
- **Step 1: Time of Flight to Range**: Computing radial distances from time delays.
- **Step 2: Sphere 1 ($S_1$)**: 1 satellite narrows your location to a 3D spherical shell.
- **Step 3: Two Spheres ($S_1 \cap S_2$)**: Intersection of two spheres forms a 2D circle in space.
- **Step 4: Three Spheres ($S_1 \cap S_2 \cap S_3$)**: 3rd sphere cuts the circle into exactly two points (Point A on Earth, Point B in outer space).
- **Step 5: Earth Filtering & Geographic Coordinates**: Discards the space solution and converts $(X, Y, Z)$ into final integer **Latitude & Longitude**!
- Interactive stepper controls: **Auto-Play**, **Next Step**, **Previous Step**, and **Reset**.

---

## 🚀 How to Run

No installation, build tools, or Node.js required!

1. Double-click [index.html](file:///C:/Users/Sergio/Documents/GPS-demo/index.html) to open directly in Chrome, Firefox, Edge, or Safari.
2. Or serve locally with Python:
   ```bash
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000`.

---

## 🛠️ Built With

- **HTML5 & CSS3**: Responsive dark-mode scientific UI with custom smartwatch container.
- **JavaScript (ES6)**: Vanilla modular architecture (`globe.js`, `smartwatch.js`, `calculator.js`, `main.js`).
- **Three.js (r128)**: High-performance WebGL 3D rendering for the Earth, satellites, and wave paths.
- **Natural Earth 110m Data**: Embedded vector coastlines for offline and `file://` compatibility.

---

## 📄 License

MIT License. See [LICENSE](file:///C:/Users/Sergio/Documents/GPS-demo/LICENSE) for details.
