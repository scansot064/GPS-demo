/**
 * GPS Demonstration - Step-by-step Coordinate Calculation Animation
 * Breaks down trilateration into 5 clear pedagogical phases for secondary students
 */

class GPSCalculator {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.onStepChange = options.onStepChange || null;
        this.currentStep = 1;
        this.totalSteps = 5;
        this.isPlaying = false;
        this.playTimer = null;
        this.telemetry = null;

        this.stepsInfo = [
            {
                number: 1,
                title: "Calculate Satellite Distances (Time of Flight)",
                badge: "Step 1 of 5",
                subtitle: "Measuring the time delay of radio waves traveling at light speed",
                description: `
                    <p>Every GPS satellite broadcasts its precise atomic clock time (<span class="code-pill">t_tx</span>) and its 3D position in space (<span class="code-pill">X, Y, Z</span>).</p>
                    <p>Your watch notes the arrival time (<span class="code-pill">t_rx</span>). Because radio waves travel at the speed of light (<span class="code-pill">c = 299,792.458 km/s</span>), the distance is simply:</p>
                    <div class="formula-box">
                        $$d = c \times \Delta t = c \times (t_{rx} - t_{tx})$$
                    </div>
                `
            },
            {
                number: 2,
                title: "Satellite 1: First Sphere of Possibility",
                badge: "Step 2 of 5",
                subtitle: "One distance narrows your position to a spherical shell in space",
                description: `
                    <p>With only Satellite 1, we know we are exactly <strong class="c-sat1" id="calc-step2-dist">... km</strong> away from it.</p>
                    <p>All points at this distance form a giant 3D sphere centered on Satellite 1. You could be anywhere on this sphere's surface (on Earth, deep underground, or floating in space!).</p>
                    <div class="formula-box">
                        $$(X - X_1)^2 + (Y - Y_1)^2 + (Z - Z_1)^2 = d_1^2$$
                    </div>
                `
            },
            {
                number: 3,
                title: "Satellite 2: Two Spheres Intersect in a Circle",
                badge: "Step 3 of 5",
                subtitle: "Adding a second satellite cuts the possibilities down to a 2D ring",
                description: `
                    <p>We now bring in Satellite 2 at distance <strong class="c-sat2" id="calc-step3-dist">... km</strong>, creating a second giant sphere.</p>
                    <p>When two spheres intersect in 3D geometry, their overlap is a <strong>flat circular ring</strong> in space. We are guaranteed to be somewhere along this ring!</p>
                    <div class="formula-box">
                        $$\text{Sphere}_1 \cap \text{Sphere}_2 = \text{Circle of Intersection}$$
                    </div>
                `
            },
            {
                number: 4,
                title: "Satellite 3: Three Spheres Intersect at 2 Points",
                badge: "Step 4 of 5",
                subtitle: "A third sphere intersects the circle at exactly TWO points",
                description: `
                    <p>Adding Satellite 3 creates a third sphere at distance <strong class="c-sat3" id="calc-step4-dist">... km</strong>.</p>
                    <p>This 3rd sphere cuts through our circle at exactly <strong>TWO points</strong>: <span class="highlight-point">Point A</span> and <span class="highlight-point">Point B</span>.</p>
                    <p>One of these points is situated out in deep space (~15,000+ km away), while the other is right near the Earth's surface!</p>
                    <div class="formula-box">
                        $$\text{Circle} \cap \text{Sphere}_3 = \{ \text{Point}_A, \text{Point}_B \}$$
                    </div>
                `
            },
            {
                number: 5,
                title: "Earth Filtering & Converting to Coordinates",
                badge: "Step 5 of 5",
                subtitle: "Discard the space point and convert (X, Y, Z) to Latitude and Longitude",
                description: `
                    <p>Because the receiver is on Earth, the watch computer automatically checks the distance to Earth's center (<span class="code-pill">R_Earth \approx 6,371 km</span>). It discards the deep-space point and keeps the Earth solution!</p>
                    <p>Finally, it converts the Cartesian coordinates <span class="code-pill">(X, Y, Z)</span> to Geographic Coordinates:</p>
                    <div class="formula-box">
                        $$\text{Latitude} = \arcsin\left(\frac{Z}{R}\right), \quad \text{Longitude} = \text{atan2}(Y, X)$$
                    </div>
                    <div class="final-fix-card" id="calc-final-fix-box">
                        Calculated Position: <strong id="calc-final-coords" class="glow-text">--° N, --° W</strong> (Exact Whole Degrees)
                    </div>
                `
            }
        ];

        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="calc-stepper-card">
                <!-- Step progress tabs -->
                <div class="calc-nav-tabs">
                    ${this.stepsInfo.map(s => `
                        <button class="step-tab-btn ${s.number === 1 ? 'active' : ''}" data-step="${s.number}">
                            <span class="tab-num">${s.number}</span>
                            <span class="tab-text">${s.title.split(':')[0]}</span>
                        </button>
                    `).join('')}
                </div>

                <!-- Main dynamic content container -->
                <div class="calc-body">
                    <div class="calc-header-row">
                        <span class="badge calc-badge" id="calc-badge">Step 1 of 5</span>
                        <h3 id="calc-step-title" class="calc-title">Title</h3>
                        <p id="calc-step-sub" class="calc-subtitle">Subtitle</p>
                    </div>

                    <div class="calc-main-content" id="calc-description">
                        <!-- Dynamic explanation injected here -->
                    </div>

                    <!-- Live Numbers Comparison Table -->
                    <div class="calc-live-data-table" id="calc-live-table">
                        <!-- Injected live calculations -->
                    </div>
                </div>

                <!-- Playback controls -->
                <div class="calc-controls-bar">
                    <div class="playback-buttons">
                        <button class="btn btn-secondary" id="calc-btn-prev">⬅ Previous Step</button>
                        <button class="btn btn-primary" id="calc-btn-play">▶ Auto-Play Steps</button>
                        <button class="btn btn-secondary" id="calc-btn-next">Next Step ➡</button>
                        <button class="btn btn-outline" id="calc-btn-reset">↺ Reset</button>
                    </div>
                    <div class="step-counter-text">
                        Step <strong id="calc-step-indicator">1</strong> of 5
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const tabs = this.container.querySelectorAll('.step-tab-btn');
        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const step = parseInt(btn.getAttribute('data-step'), 10);
                this.goToStep(step);
            });
        });

        document.getElementById('calc-btn-prev').addEventListener('click', () => {
            if (this.currentStep > 1) this.goToStep(this.currentStep - 1);
        });

        document.getElementById('calc-btn-next').addEventListener('click', () => {
            if (this.currentStep < this.totalSteps) this.goToStep(this.currentStep + 1);
        });

        document.getElementById('calc-btn-reset').addEventListener('click', () => {
            this.stopAutoPlay();
            this.goToStep(1);
        });

        document.getElementById('calc-btn-play').addEventListener('click', () => {
            if (this.isPlaying) {
                this.stopAutoPlay();
            } else {
                this.startAutoPlay();
            }
        });
    }

    startAutoPlay() {
        this.isPlaying = true;
        const playBtn = document.getElementById('calc-btn-play');
        if (playBtn) {
            playBtn.textContent = '⏸ Pause';
            playBtn.classList.add('playing');
        }

        if (this.currentStep === this.totalSteps) {
            this.goToStep(1);
        }

        this.playTimer = setInterval(() => {
            if (this.currentStep < this.totalSteps) {
                this.goToStep(this.currentStep + 1);
            } else {
                this.stopAutoPlay();
            }
        }, 4500);
    }

    stopAutoPlay() {
        this.isPlaying = false;
        if (this.playTimer) {
            clearInterval(this.playTimer);
            this.playTimer = null;
        }
        const playBtn = document.getElementById('calc-btn-play');
        if (playBtn) {
            playBtn.textContent = '▶ Auto-Play Steps';
            playBtn.classList.remove('playing');
        }
    }

    goToStep(step) {
        this.currentStep = Math.max(1, Math.min(this.totalSteps, step));
        const info = this.stepsInfo[this.currentStep - 1];

        // Update tabs
        const tabs = this.container.querySelectorAll('.step-tab-btn');
        tabs.forEach(btn => {
            const btnStep = parseInt(btn.getAttribute('data-step'), 10);
            btn.classList.toggle('active', btnStep === this.currentStep);
        });

        // Update text
        document.getElementById('calc-badge').textContent = info.badge;
        document.getElementById('calc-step-title').textContent = info.title;
        document.getElementById('calc-step-sub').textContent = info.subtitle;
        document.getElementById('calc-description').innerHTML = info.description;
        document.getElementById('calc-step-indicator').textContent = this.currentStep;

        // Button disabled states
        document.getElementById('calc-btn-prev').disabled = (this.currentStep === 1);
        document.getElementById('calc-btn-next').disabled = (this.currentStep === this.totalSteps);

        this.updateLiveData();

        if (this.onStepChange) {
            this.onStepChange(this.currentStep);
        }
    }

    update(telemetry) {
        this.telemetry = telemetry;
        this.updateLiveData();
    }

    updateLiveData() {
        if (!this.telemetry || !this.telemetry.satellites) return;

        const sats = this.telemetry.satellites;
        const { lat, lon } = this.telemetry.userCoords;
        const latStr = lat >= 0 ? `${lat}° N` : `${Math.abs(lat)}° S`;
        const lonStr = lon >= 0 ? `${lon}° E` : `${Math.abs(lon)}° W`;

        // Update specific step inline placeholders
        const step2Dist = document.getElementById('calc-step2-dist');
        if (step2Dist && sats[0]) step2Dist.textContent = `${parseFloat(sats[0].distanceKm).toLocaleString()} km`;

        const step3Dist = document.getElementById('calc-step3-dist');
        if (step3Dist && sats[1]) step3Dist.textContent = `${parseFloat(sats[1].distanceKm).toLocaleString()} km`;

        const step4Dist = document.getElementById('calc-step4-dist');
        if (step4Dist && sats[2]) step4Dist.textContent = `${parseFloat(sats[2].distanceKm).toLocaleString()} km`;

        const finalCoords = document.getElementById('calc-final-coords');
        if (finalCoords) finalCoords.textContent = `${latStr}, ${lonStr}`;

        // Live calculation data card below
        const liveTable = document.getElementById('calc-live-table');
        if (liveTable) {
            liveTable.innerHTML = `
                <div class="live-math-grid">
                    ${sats.map((s, idx) => `
                        <div class="math-card" style="border-left-color: ${s.color}">
                            <div class="math-card-title" style="color: ${s.color}">${s.name} (${s.prn})</div>
                            <div class="math-line"><span>Delay (\\Delta t):</span> <strong>${s.timeDeltaMs} ms</strong></div>
                            <div class="math-line"><span>Speed (c):</span> <span>299,792 km/s</span></div>
                            <div class="math-line highlight-calc"><span>Radius (d_${idx+1}):</span> <strong>${parseFloat(s.distanceKm).toLocaleString()} km</strong></div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
}

window.GPSCalculator = GPSCalculator;
