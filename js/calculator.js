/**
 * GPS Demonstration - Step-by-step Coordinate Calculation Animation
 * Breaks down trilateration and the 4th satellite clock bias correction for secondary students
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
                title: "Calculate Distances: The 4 Pseudoranges",
                badge: "Step 1 of 5",
                subtitle: "Measuring time delays from 4 satellites traveling at the speed of light",
                description: `
                    <p>Each of the <strong>4 satellites</strong> carries an atomic clock and broadcasts its exact transmission timestamp (<span class="code-pill">t<sub>tx</sub></span>) and orbital position (<span class="code-pill">X, Y, Z</span>).</p>
                    <p>Your watch registers the arrival time (<span class="code-pill">t<sub>rx</sub></span>). Radio waves travel at the speed of light (<span class="code-pill">c &approx; 299,792.458 km/s</span>), giving 4 raw distances called <strong>pseudoranges</strong> (&rho;):</p>
                    <div class="formula-box math-formula">
                        &rho;<sub>i</sub> = c &times; (t<sub>rx</sub> - t<sub>tx, i</sub>) = c &times; &Delta;t<sub>i</sub>
                    </div>
                    <p><em>Why "pseudoranges"?</em> Because your watch contains an inexpensive quartz clock with a slight unknown time error (<span class="code-pill">&Delta;t<sub>clock</sub></span>). A clock error of just 1 microsecond would throw position off by 300 meters! We will use the 4th satellite to solve for this error.</p>
                `
            },
            {
                number: 2,
                title: "Satellite 1: First Sphere of Possibility",
                badge: "Step 2 of 5",
                subtitle: "Distance from Satellite 1 defines a giant 3D spherical shell in space",
                description: `
                    <p>Satellite 1 (PRN 12) gives our first radial distance: <strong class="c-sat1" id="calc-step2-dist">... km</strong>.</p>
                    <p>All points in space at this exact distance form a 3D sphere centered on Satellite 1. You could be anywhere on this sphere (in space, on the ground, or underground!).</p>
                    <div class="formula-box math-formula">
                        (X - X<sub>1</sub>)<sup>2</sup> + (Y - Y<sub>1</sub>)<sup>2</sup> + (Z - Z<sub>1</sub>)<sup>2</sup> = d<sub>1</sub><sup>2</sup>
                    </div>
                `
            },
            {
                number: 3,
                title: "Satellite 2: Two Spheres Intersect in a Circle",
                badge: "Step 3 of 5",
                subtitle: "Adding Satellite 2 cuts the possibilities down to a flat circular ring",
                description: `
                    <p>Satellite 2 (PRN 24) introduces a second sphere with radius <strong class="c-sat2" id="calc-step3-dist">... km</strong>.</p>
                    <p>In 3D geometry, two intersecting spheres overlap along a <strong>flat 2D circle</strong> in space. We know for certain our location lies somewhere along the boundary of this ring!</p>
                    <div class="formula-box math-formula">
                        Sphere<sub>1</sub> &cap; Sphere<sub>2</sub> = Circle of Intersection
                    </div>
                `
            },
            {
                number: 4,
                title: "Satellite 3: Three Spheres Intersect at 2 Points",
                badge: "Step 4 of 5",
                subtitle: "Satellite 3 intersects the circle at exactly TWO points (Earth vs. Outer Space)",
                description: `
                    <p>Satellite 3 (PRN 08) adds a third sphere of radius <strong class="c-sat3" id="calc-step4-dist">... km</strong>.</p>
                    <p>The 3rd sphere cuts through our circle at exactly <strong>TWO points</strong>: <span class="highlight-point">Point A</span> and <span class="highlight-point">Point B</span>.</p>
                    <p>One point is on Earth, but the second point is ~20,000 km out in outer space! However, we still have one crucial problem: our watch clock is not an atomic clock.</p>
                    <div class="formula-box math-formula">
                        Circle &cap; Sphere<sub>3</sub> = { Point<sub>A</sub> (Earth), Point<sub>B</sub> (Outer Space) }
                    </div>
                `
            },
            {
                number: 5,
                title: "Satellite 4: Clock Bias Correction & Final Coordinates",
                badge: "Step 5 of 5",
                subtitle: "The 4th satellite solves for 4 unknowns (X, Y, Z, and Clock Error)!",
                description: `
                    <p>Here is where the <strong>4th Satellite (PRN 15)</strong> solves the whole puzzle! We have 4 unknowns: 3 spatial coordinates (<span class="code-pill">X, Y, Z</span>) plus the receiver clock bias (<span class="code-pill">&Delta;t<sub>clock</sub></span>).</p>
                    <p>The 4th sphere will ONLY intersect the Earth point if <span class="code-pill">&Delta;t<sub>clock</sub></span> is perfectly adjusted! By solving the system of 4 equations simultaneously:</p>
                    <div class="formula-box math-formula">
                        (X - X<sub>i</sub>)<sup>2</sup> + (Y - Y<sub>i</sub>)<sup>2</sup> + (Z - Z<sub>i</sub>)<sup>2</sup> = [c &times; (&Delta;t<sub>i</sub> - &Delta;t<sub>clock</sub>)]<sup>2</sup>
                        <div style="font-size: 0.85em; color: var(--text-secondary); margin-top: 6px;">for each satellite i &in; {1, 2, 3, 4}</div>
                    </div>
                    <p>The watch corrects its quartz clock to atomic synchronization, eliminates the outer space point, and converts Cartesian <span class="code-pill">(X, Y, Z)</span> to your exact whole-degree geographic coordinates:</p>
                    <div class="formula-box math-formula" style="border-left-color: var(--accent-green);">
                        Latitude = arcsin(Z / R<sub>Earth</sub>) &nbsp;&bull;&nbsp; Longitude = atan2(Y, X)
                    </div>
                    <div class="final-fix-card" id="calc-final-fix-box">
                        Final Calculated Position: <strong id="calc-final-coords" class="glow-text">--° N, --° W</strong> &bull; Clock Sync: <strong style="color: #00d2ff;">0.00 ns Atomic Lock</strong>
                    </div>
                `
            }
        ];

        this.render();
        this.bindEvents();
        this.goToStep(this.currentStep);
        if (window.gpsI18n) window.gpsI18n.apply();
        this.goToStep(this.currentStep);
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

                    <div class="calc-main-content" id="calc-description"></div>

                    <!-- Live Numbers Comparison Table -->
                    <div class="calc-live-data-table" id="calc-live-table"></div>
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
        }, 5000);
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

        const tabs = this.container.querySelectorAll('.step-tab-btn');
        tabs.forEach(btn => {
            const btnStep = parseInt(btn.getAttribute('data-step'), 10);
            btn.classList.toggle('active', btnStep === this.currentStep);
        });

        document.getElementById('calc-badge').textContent = info.badge;
        document.getElementById('calc-step-title').textContent = info.title;
        document.getElementById('calc-step-sub').textContent = info.subtitle;
        document.getElementById('calc-description').innerHTML = info.description;
        document.getElementById('calc-step-indicator').textContent = this.currentStep;

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

        const step2Dist = document.getElementById('calc-step2-dist');
        if (step2Dist && sats[0]) step2Dist.textContent = `${parseFloat(sats[0].distanceKm).toLocaleString()} km`;

        const step3Dist = document.getElementById('calc-step3-dist');
        if (step3Dist && sats[1]) step3Dist.textContent = `${parseFloat(sats[1].distanceKm).toLocaleString()} km`;

        const step4Dist = document.getElementById('calc-step4-dist');
        if (step4Dist && sats[2]) step4Dist.textContent = `${parseFloat(sats[2].distanceKm).toLocaleString()} km`;

        const finalCoords = document.getElementById('calc-final-coords');
        if (finalCoords) finalCoords.textContent = `${latStr}, ${lonStr}`;

        const liveTable = document.getElementById('calc-live-table');
        if (liveTable) {
            liveTable.innerHTML = `
                <div class="live-math-grid">
                    ${sats.map((s, idx) => `
                        <div class="math-card" style="border-left-color: ${s.color}">
                            <div class="math-card-title" style="color: ${s.color}">${s.name} (${s.prn})</div>
                            <div class="math-line"><span>Delay (&Delta;t):</span> <strong>${s.timeDeltaMs} ms</strong></div>
                            <div class="math-line"><span>Speed of Light (c):</span> <span>299,792 km/s</span></div>
                            <div class="math-line highlight-calc"><span>Pseudorange Radius (d<sub>${idx+1}</sub>):</span> <strong>${parseFloat(s.distanceKm).toLocaleString()} km</strong></div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
}

window.GPSCalculator = GPSCalculator;
