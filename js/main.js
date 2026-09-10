/**
 * GPS Demonstration - Main App Controller
 * Connects Globe, Smartwatch, Calculator, and Audio Effects
 */

document.addEventListener('DOMContentLoaded', () => {
    // City Presets
    const PRESET_CITIES = [
        { name: "Madrid, Spain", lat: 40, lon: -3 },
        { name: "London, UK", lat: 51, lon: 0 },
        { name: "New York, USA", lat: 41, lon: -74 },
        { name: "Tokyo, Japan", lat: 36, lon: 140 },
        { name: "Sydney, Australia", lat: -34, lon: 151 },
        { name: "Cairo, Egypt", lat: 30, lon: 31 },
        { name: "Rio de Janeiro, Brazil", lat: -23, lon: -43 },
        { name: "Quito, Ecuador (Equator)", lat: 0, lon: -78 }
    ];

    // Initialize Smartwatch
    const smartwatch = new SmartwatchDisplay('smartwatch-container');

    // Initialize Step-by-Step Calculator
    const calculator = new GPSCalculator('calculator-container', {
        onStepChange: (step) => {
            if (window.gpsGlobe) {
                window.gpsGlobe.setCalculationStep(step);
            }
        }
    });

    // Initialize Interactive Lab (Section 5)
    const lab = new GPSInteractiveLab('interactive-lab-container');

    // This callback is invoked synchronously while the globe initializes its
    // default coordinates, so it must exist before GPSGlobe is constructed.
    const updateSelectedDisplay = (coords) => {
        const displayEl = document.getElementById('selected-location-badge');
        if (displayEl) {
            const latStr = coords.lat >= 0 ? `${coords.lat}° N` : `${Math.abs(coords.lat)}° S`;
            const lonStr = coords.lon >= 0 ? `${coords.lon}° E` : `${Math.abs(coords.lon)}° W`;
            displayEl.textContent = `${latStr}, ${lonStr}`;
        }
    };

    // Initialize 3D Globe
    const globe = new GPSGlobe('globe-canvas-container', {
        onLocationSelect: (telemetry) => {
            smartwatch.update(telemetry);
            calculator.update(telemetry);
            lab.update(telemetry);
            updateSelectedDisplay(telemetry.userCoords);
        }
    });

    window.gpsGlobe = globe;

    // Hook up Acquire Satellites Button
    const pingBtn = document.getElementById('btn-ping-satellites');
    if (pingBtn) {
        pingBtn.addEventListener('click', () => {
            globe.pingSatellites();
            playPingSound();
            pingBtn.classList.add('active');
            pingBtn.innerHTML = '✔ Satellites Deployed & Beaming';
            if (window.gpsI18n) window.gpsI18n.apply();
        });
    }

    // Hook up City Presets Dropdown
    const presetSelect = document.getElementById('preset-cities-select');
    if (presetSelect) {
        PRESET_CITIES.forEach(city => {
            const opt = document.createElement('option');
            opt.value = `${city.lat},${city.lon}`;
            opt.textContent = `${city.name} (${city.lat >= 0 ? city.lat + '°N' : Math.abs(city.lat) + '°S'}, ${city.lon >= 0 ? city.lon + '°E' : Math.abs(city.lon) + '°W'})`;
            presetSelect.appendChild(opt);
        });
            if (window.gpsI18n) window.gpsI18n.apply();

        presetSelect.addEventListener('change', (e) => {
            if (!e.target.value) return;
            const [lat, lon] = e.target.value.split(',').map(Number);
            globe.setCoordinates(lat, lon, true);
            if (!globe.satellitesAcquired) {
                globe.pingSatellites();
                if (pingBtn) {
                    pingBtn.classList.add('active');
                    pingBtn.innerHTML = '✔ Satellites Deployed & Beaming';
                    if (window.gpsI18n) window.gpsI18n.apply();
                }
            }
        });
    }

    // Synthesized Web Audio Sound Effect for radio satellite beep
    function playPingSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
            osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.18);
            gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.35);
        } catch (e) {
            // Audio context not allowed or not supported, ignore silently
        }
    }
});
