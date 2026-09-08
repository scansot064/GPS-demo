/**
 * GPS Demonstration - Smartwatch Telemetry Display
 * Displays live simulated data received from 4 satellites
 */

class SmartwatchDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.renderShell();
        this.clockInterval = setInterval(() => this.updateClock(), 1000);
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="watch-chassis">
                <div class="watch-strap watch-strap-top"></div>
                <div class="watch-crown"></div>
                <div class="watch-button"></div>
                
                <div class="watch-body">
                    <div class="watch-screen">
                        <!-- Top status bar -->
                        <div class="watch-header">
                            <div class="watch-time" id="watch-clock">12:00:00</div>
                            <div class="watch-status-badges">
                                <span class="badge badge-gps" id="watch-gps-badge">
                                    <span class="status-pulse"></span> 4 SATS LOCKED
                                </span>
                                <span class="badge badge-battery">94% ⚡</span>
                            </div>
                        </div>

                        <!-- Target Fix Banner -->
                        <div class="watch-target-banner">
                            <div class="target-title">RECEIVER ANTENNA STATUS</div>
                            <div class="target-coords-display" id="watch-coords-display">
                                Lat: <span class="highlight">--°</span> | Lon: <span class="highlight">--°</span>
                            </div>
                        </div>

                        <!-- Clock Bias & Fix Banner -->
                        <div class="watch-clock-sync-banner" id="watch-clock-sync-banner">
                            <div class="sync-item">
                                <span class="sync-label">⏱️ Quartz Clock Bias (&Delta;t<sub>clock</sub>):</span>
                                <span class="sync-val mono-font" id="watch-clock-bias">+1.28 &mu;s &rarr; 0.00 ns (Synced!)</span>
                            </div>
                            <div class="sync-item">
                                <span class="sync-label">🌐 Solution Type:</span>
                                <span class="sync-val mono-font" style="color: #00ff88;">3D Fix + Time Sync (4 Sats)</span>
                            </div>
                        </div>

                        <!-- 4 Satellite Telemetry Cards Grid -->
                        <div class="satellites-grid" id="watch-satellites-container">
                            <div class="sat-card empty-state">
                                <p>Click <strong>"Acquire Satellites"</strong> or tap the 3D Globe to receive telemetry from all 4 satellites.</p>
                            </div>
                        </div>

                        <!-- Watch Footer Status -->
                        <div class="watch-footer">
                            <div class="watch-accuracy-info">
                                <span>Constellation: <strong>GPS NAVSTAR (Operational)</strong></span>
                                <span>Status: <strong id="watch-lock-status" style="color: #00ff88;">4/4 Satellites Locked</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="watch-strap watch-strap-bottom"></div>
            </div>
        `;
    }

    updateClock() {
        const el = document.getElementById('watch-clock');
        if (el) {
            const now = new Date();
            el.textContent = now.toLocaleTimeString();
        }
    }

    update(telemetry) {
        const coordsDisplay = document.getElementById('watch-coords-display');
        const container = document.getElementById('watch-satellites-container');
        const gpsBadge = document.getElementById('watch-gps-badge');
        const lockStatus = document.getElementById('watch-lock-status');

        if (!telemetry || !telemetry.satellites || telemetry.satellites.length === 0) return;

        const { lat, lon } = telemetry.userCoords;
        const latStr = lat >= 0 ? `${lat}° N` : `${Math.abs(lat)}° S`;
        const lonStr = lon >= 0 ? `${lon}° E` : `${Math.abs(lon)}° W`;
        
        if (coordsDisplay) {
            coordsDisplay.innerHTML = `True Ground Fix: <strong class="highlight">${latStr}, ${lonStr}</strong>`;
        }

        if (gpsBadge) {
            gpsBadge.className = telemetry.satellitesAcquired ? 'badge badge-gps locked' : 'badge badge-gps searching';
            gpsBadge.innerHTML = telemetry.satellitesAcquired 
                ? '<span class="status-pulse active"></span> 4 SATS LOCKED' 
                : '<span class="status-pulse searching"></span> SEARCHING...';
        }

        if (lockStatus) {
            lockStatus.textContent = telemetry.satellitesAcquired ? '4/4 High GDOP Locked' : 'Searching for Signal...';
            lockStatus.style.color = telemetry.satellitesAcquired ? '#00ff88' : '#ffaa00';
        }

        if (!container) return;

        let cardsHtml = '';
        telemetry.satellites.forEach((sat, i) => {
            cardsHtml += `
                <div class="sat-card" style="border-top-color: ${sat.color}">
                    <div class="sat-card-header">
                        <div class="sat-name-box">
                            <span class="sat-dot" style="background-color: ${sat.color}"></span>
                            <strong>${sat.name}</strong>
                            <span class="sat-prn">(${sat.prn})</span>
                        </div>
                        <div class="sat-snr">
                            <span class="snr-bars">
                                <span class="bar full"></span>
                                <span class="bar full"></span>
                                <span class="bar full"></span>
                                <span class="bar ${sat.snrDb > 45 ? 'full' : 'mid'}"></span>
                            </span>
                            <span>${sat.snrDb} dB-Hz</span>
                        </div>
                    </div>

                    <div class="sat-telemetry-body">
                        <div class="telemetry-row">
                            <span class="t-label">🛰️ Orbit Pos (ECEF):</span>
                            <span class="t-val mono-font">X:${sat.ecef.x}, Y:${sat.ecef.y}, Z:${sat.ecef.z} km</span>
                        </div>
                        <div class="telemetry-row">
                            <span class="t-label">⏱️ Broadcast (t<sub>tx</sub>):</span>
                            <span class="t-val mono-font">${sat.txTimeFormatted}</span>
                        </div>
                        <div class="telemetry-row">
                            <span class="t-label">⌚ Arrival (t<sub>rx</sub>):</span>
                            <span class="t-val mono-font">${sat.rxTimeFormatted}</span>
                        </div>
                        <div class="telemetry-row highlight-row">
                            <span class="t-label">⚡ Time Delta (&Delta;t):</span>
                            <span class="t-val highlight-val mono-font">${sat.timeDeltaMs} ms</span>
                        </div>
                        <div class="telemetry-row calc-row">
                            <span class="t-label">📏 Pseudorange (c &times; &Delta;t):</span>
                            <span class="t-val distance-val mono-font">${parseFloat(sat.distanceKm).toLocaleString()} km</span>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = cardsHtml;
    }
}

window.SmartwatchDisplay = SmartwatchDisplay;
