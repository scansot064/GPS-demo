/**
 * GPS Demonstration - Section 5: Interactive Equation Lab
 * Displays exact numerical values on each block and explicit arithmetic solutions
 */

class GPSInteractiveLab {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStageIndex = 0;
        this.selectedBlock = null;
        this.telemetry = null;

        this.initStages();
        this.render();
    }

    getLiveValues() {
        const coords = (this.telemetry && this.telemetry.userCoords) ? this.telemetry.userCoords : { lat: 40, lon: -3 };
        const sat1 = (this.telemetry && this.telemetry.satellites && this.telemetry.satellites[0]) ? this.telemetry.satellites[0] : null;

        const delayMs = sat1 ? sat1.timeDeltaMs : "68.4230";
        const delaySec = (parseFloat(delayMs) / 1000).toFixed(5);
        const distKm = sat1 ? parseFloat(sat1.distanceKm).toLocaleString() : "20,515";
        const distNum = sat1 ? Math.round(parseFloat(sat1.distanceKm)) : 20515;

        const rxTime = sat1 ? sat1.rxTimeFormatted : "12:00:00.068423000";
        const txTime = sat1 ? sat1.txTimeFormatted : "12:00:00.000000000";

        const x1 = sat1 ? sat1.ecef.x : 14200;
        const y1 = sat1 ? sat1.ecef.y : -8500;
        const z1 = sat1 ? sat1.ecef.z : 21000;

        const R = 6371;
        const phi = coords.lat * (Math.PI / 180);
        const theta = coords.lon * (Math.PI / 180);
        const ecefX = Math.round(R * Math.cos(phi) * Math.cos(theta));
        const ecefY = Math.round(R * Math.cos(phi) * Math.sin(theta));
        const ecefZ = Math.round(R * Math.sin(phi));

        const latStr = coords.lat >= 0 ? `${coords.lat}° N` : `${Math.abs(coords.lat)}° S`;
        const lonStr = coords.lon >= 0 ? `${coords.lon}° E` : `${Math.abs(coords.lon)}° W`;

        return {
            rxTime, txTime, delayMs, delaySec, distKm, distNum,
            x1, y1, z1, ecefX, ecefY, ecefZ,
            lat: coords.lat, lon: coords.lon, latStr, lonStr
        };
    }

    initStages() {
        this.stageDefinitions = [
            {
                id: 1,
                badge: "Equation 1 of 5",
                title: "Signal Travel Time (Time of Flight)",
                subtitle: "Find how many milliseconds the radio wave traveled from Satellite 1 to your watch.",
                hint: "Subtract the Broadcast Time from the Arrival Time.",
                formulaTemplate: `
                    <div class="lab-eq-line">
                        <span class="eq-symbol">&Delta;t<sub>1</sub></span>
                        <span class="eq-operator">=</span>
                        <div class="drop-slot" data-slot="slot1" data-expected="t_rx">
                            <span class="slot-placeholder">Drop: Arrival Time (t_rx)</span>
                        </div>
                        <span class="eq-operator">&minus;</span>
                        <div class="drop-slot" data-slot="slot2" data-expected="t_tx1">
                            <span class="slot-placeholder">Drop: Broadcast Time (t_tx1)</span>
                        </div>
                    </div>
                `,
                getBlocks: (v) => [
                    { id: "t_rx", label: "t_rx", title: "Arrival Time", val: v.rxTime },
                    { id: "t_tx1", label: "t_tx1", title: "Broadcast Time", val: v.txTime },
                    { id: "c", label: "c", title: "Speed of Light", val: "299,792 km/s" },
                    { id: "R_Earth", label: "R_Earth", title: "Earth Radius", val: "6,371 km" },
                    { id: "X1", label: "X₁", title: "Satellite 1 X", val: `${v.x1} km` }
                ],
                getSolveResult: (v) => `
                    <div class="result-success-box">
                        <div class="res-title">✔ Equation 1 Solved!</div>
                        <div class="res-math">&Delta;t<sub>1</sub> = t<sub>rx</sub> &minus; t<sub>tx1</sub></div>
                        <div class="res-math-numbers">
                            <strong>Actual Math:</strong> ${v.rxTime} &minus; ${v.txTime} = <span class="highlight-val">${v.delaySec} s</span> (<span class="highlight-val">${v.delayMs} ms</span>)
                        </div>
                        <p class="res-explanation">
                            By subtracting the two clock timestamps, the watch knows the radio wave took <strong>${v.delayMs} milliseconds</strong> to arrive from space!
                        </p>
                    </div>
                `
            },
            {
                id: 2,
                badge: "Equation 2 of 5",
                title: "Calculating Distance (Pseudorange)",
                subtitle: "Multiply the speed of light by the travel time to calculate distance.",
                hint: "Distance = Speed of Light (c) × Travel Time (Δt₁).",
                formulaTemplate: `
                    <div class="lab-eq-line">
                        <span class="eq-symbol">d<sub>1</sub></span>
                        <span class="eq-operator">=</span>
                        <div class="drop-slot" data-slot="slot1" data-expected="c">
                            <span class="slot-placeholder">Drop: Speed of Light (c)</span>
                        </div>
                        <span class="eq-operator">&times;</span>
                        <div class="drop-slot" data-slot="slot2" data-expected="dt1">
                            <span class="slot-placeholder">Drop: Time Delay (&Delta;t₁)</span>
                        </div>
                    </div>
                `,
                getBlocks: (v) => [
                    { id: "c", label: "c", title: "Speed of Light", val: "299,792.458 km/s" },
                    { id: "dt1", label: "&Delta;t₁", title: "Time Delay", val: `${v.delaySec} s` },
                    { id: "t_rx", label: "t_rx", title: "Arrival Time", val: v.rxTime },
                    { id: "Y1", label: "Y₁", title: "Satellite 1 Y", val: `${v.y1} km` },
                    { id: "Z1", label: "Z₁", title: "Satellite 1 Z", val: `${v.z1} km` }
                ],
                getSolveResult: (v) => `
                    <div class="result-success-box">
                        <div class="res-title">✔ Equation 2 Solved!</div>
                        <div class="res-math">d<sub>1</sub> = c &times; &Delta;t<sub>1</sub></div>
                        <div class="res-math-numbers">
                            <strong>Actual Math:</strong> 299,792.458 km/s &times; ${v.delaySec} s = <span class="highlight-val">${v.distKm} km</span>
                        </div>
                        <p class="res-explanation">
                            Radio waves travel at 299,792 km per second. Multiplying speed by time yields an exact distance of <strong>${v.distKm} km</strong> to Satellite 1!
                        </p>
                    </div>
                `
            },
            {
                id: 3,
                badge: "Equation 3 of 5",
                title: "3D Sphere Equation (Satellite 1)",
                subtitle: "Assemble the 3D sphere equation centered at Satellite 1 with radius d₁.",
                hint: "Fill in the satellite 3D coordinates (X₁, Y₁, Z₁) and its radial distance d₁.",
                formulaTemplate: `
                    <div class="lab-eq-line">
                        <span class="eq-paren">(</span><span class="eq-symbol">X</span> <span class="eq-operator">&minus;</span>
                        <div class="drop-slot" data-slot="slot1" data-expected="X1">
                            <span class="slot-placeholder">Drop: X₁</span>
                        </div><span class="eq-paren">)</span><sup>2</sup>
                        <span class="eq-operator">+</span>
                        <span class="eq-paren">(</span><span class="eq-symbol">Y</span> <span class="eq-operator">&minus;</span>
                        <div class="drop-slot" data-slot="slot2" data-expected="Y1">
                            <span class="slot-placeholder">Drop: Y₁</span>
                        </div><span class="eq-paren">)</span><sup>2</sup>
                        <span class="eq-operator">+</span>
                        <span class="eq-paren">(</span><span class="eq-symbol">Z</span> <span class="eq-operator">&minus;</span>
                        <div class="drop-slot" data-slot="slot3" data-expected="Z1">
                            <span class="slot-placeholder">Drop: Z₁</span>
                        </div><span class="eq-paren">)</span><sup>2</sup>
                        <span class="eq-operator">=</span>
                        <div class="drop-slot" data-slot="slot4" data-expected="d1">
                            <span class="slot-placeholder">Drop: d₁</span>
                        </div><sup>2</sup>
                    </div>
                `,
                getBlocks: (v) => [
                    { id: "X1", label: "X₁", title: "Sat 1 X Position", val: `${v.x1} km` },
                    { id: "Y1", label: "Y₁", title: "Sat 1 Y Position", val: `${v.y1} km` },
                    { id: "Z1", label: "Z₁", title: "Sat 1 Z Position", val: `${v.z1} km` },
                    { id: "d1", label: "d₁", title: "Sphere 1 Radius", val: `${v.distKm} km` },
                    { id: "c", label: "c", title: "Speed of Light", val: "299,792 km/s" },
                    { id: "dt_clock", label: "&Delta;t_clock", title: "Clock Bias", val: "+0.00000128 s" }
                ],
                getSolveResult: (v) => `
                    <div class="result-success-box">
                        <div class="res-title">✔ Equation 3 Solved!</div>
                        <div class="res-math">(X &minus; X<sub>1</sub>)<sup>2</sup> + (Y &minus; Y<sub>1</sub>)<sup>2</sup> + (Z &minus; Z<sub>1</sub>)<sup>2</sup> = d<sub>1</sub><sup>2</sup></div>
                        <div class="res-math-numbers">
                            <strong>Actual Math:</strong> (X &minus; ${v.x1})<sup>2</sup> + (Y &minus; ${v.y1})<sup>2</sup> + (Z &minus; ${v.z1})<sup>2</sup> = (${v.distKm} km)<sup>2</sup>
                        </div>
                        <p class="res-explanation">
                            Sphere 1 is established! Every point on this 3D sphere is located at distance <strong>${v.distKm} km</strong> from Satellite 1.
                        </p>
                    </div>
                `
            },
            {
                id: 4,
                badge: "Equation 4 of 5",
                title: "4th Satellite Clock Bias Correction",
                subtitle: "Subtract the watch quartz clock error to lock into atomic time.",
                hint: "Light speed (c) × (Measured Delay - Watch Clock Bias).",
                formulaTemplate: `
                    <div class="lab-eq-line">
                        <span class="eq-symbol">(X &minus; X<sub>i</sub>)<sup>2</sup> + (Y &minus; Y<sub>i</sub>)<sup>2</sup> + (Z &minus; Z<sub>i</sub>)<sup>2</sup></span>
                        <span class="eq-operator">=</span>
                        <span class="eq-bracket">[</span>
                        <div class="drop-slot" data-slot="slot1" data-expected="c">
                            <span class="slot-placeholder">Drop: c</span>
                        </div>
                        <span class="eq-operator">&times;</span>
                        <span class="eq-paren">(</span>
                        <div class="drop-slot" data-slot="slot2" data-expected="dti">
                            <span class="slot-placeholder">Drop: &Delta;t_i</span>
                        </div>
                        <span class="eq-operator">&minus;</span>
                        <div class="drop-slot" data-slot="slot3" data-expected="dt_clock">
                            <span class="slot-placeholder">Drop: &Delta;t_clock</span>
                        </div>
                        <span class="eq-paren">)</span>
                        <span class="eq-bracket">]</span><sup>2</sup>
                    </div>
                `,
                getBlocks: (v) => [
                    { id: "c", label: "c", title: "Speed of Light", val: "299,792.458 km/s" },
                    { id: "dti", label: "&Delta;t<sub>i</sub>", title: "Measured Delay", val: `${v.delaySec} s` },
                    { id: "dt_clock", label: "&Delta;t_clock", title: "Quartz Clock Bias", val: "+0.00000128 s (1.28 &mu;s)" },
                    { id: "R_Earth", label: "R_Earth", title: "Earth Radius", val: "6,371 km" },
                    { id: "Zi", label: "Z<sub>i</sub>", title: "Satellite Z Coord", val: `${v.z1} km` }
                ],
                getSolveResult: (v) => `
                    <div class="result-success-box">
                        <div class="res-title">✔ 4-Satellite System Solved!</div>
                        <div class="res-math-numbers">
                            <strong>Actual Math:</strong> (${v.delaySec} s &minus; 0.00000128 s) &times; 299,792.458 km/s = <span class="highlight-val">${v.distKm} km</span>
                        </div>
                        <div class="res-math-numbers" style="margin-top: 6px;">
                            <strong>Solved 3D Position:</strong> X = <span class="highlight-val">${v.ecefX} km</span>, Y = <span class="highlight-val">${v.ecefY} km</span>, Z = <span class="highlight-val">${v.ecefZ} km</span>
                        </div>
                        <p class="res-explanation">
                            The 4th satellite synchronized your watch to atomic time (0.00 ns drift) and solved the 4 equations for your exact 3D Cartesian coordinates in space!
                        </p>
                    </div>
                `
            },
            {
                id: 5,
                badge: "Equation 5 of 5",
                title: "Converting to Latitude & Longitude",
                subtitle: "Convert Cartesian (X, Y, Z) coordinates into the final whole-degree geographic coordinates!",
                hint: "Latitude uses Z divided by Earth radius (R_Earth); Longitude uses atan2 of Y and X.",
                formulaTemplate: `
                    <div class="lab-eq-multi">
                        <div class="lab-eq-line">
                            <span class="eq-symbol">Latitude</span>
                            <span class="eq-operator">=</span>
                            <span class="eq-func">arcsin</span><span class="eq-paren">(</span>
                            <div class="drop-slot" data-slot="slot1" data-expected="Z">
                                <span class="slot-placeholder">Drop: Z</span>
                            </div>
                            <span class="eq-operator">/</span>
                            <div class="drop-slot" data-slot="slot2" data-expected="R_Earth">
                                <span class="slot-placeholder">Drop: R_Earth</span>
                            </div>
                            <span class="eq-paren">)</span>
                        </div>
                        <div class="lab-eq-line" style="margin-top: 14px;">
                            <span class="eq-symbol">Longitude</span>
                            <span class="eq-operator">=</span>
                            <span class="eq-func">atan2</span><span class="eq-paren">(</span>
                            <div class="drop-slot" data-slot="slot3" data-expected="Y">
                                <span class="slot-placeholder">Drop: Y</span>
                            </div>
                            <span class="eq-operator">,</span>
                            <div class="drop-slot" data-slot="slot4" data-expected="X">
                                <span class="slot-placeholder">Drop: X</span>
                            </div>
                            <span class="eq-paren">)</span>
                        </div>
                    </div>
                `,
                getBlocks: (v) => [
                    { id: "Z", label: "Z", title: "ECEF Z (North-South)", val: `${v.ecefZ} km` },
                    { id: "R_Earth", label: "R_Earth", title: "Earth Radius", val: "6,371 km" },
                    { id: "Y", label: "Y", title: "ECEF Y Coord", val: `${v.ecefY} km` },
                    { id: "X", label: "X", title: "ECEF X Coord", val: `${v.ecefX} km` },
                    { id: "c", label: "c", title: "Speed of Light", val: "299,792 km/s" },
                    { id: "d1", label: "d₁", title: "Distance", val: `${v.distKm} km` }
                ],
                getSolveResult: (v) => {
                    const sinRatio = (v.ecefZ / 6371).toFixed(4);
                    return `
                        <div class="result-success-box final-celebration">
                            <div class="celebration-badge">🏆 MISSION ACCOMPLISHED: 3D GPS FIX</div>
                            
                            <div class="res-math-numbers" style="margin: 14px 0; text-align: left; background: rgba(5, 12, 24, 0.85); padding: 14px; border-radius: 8px;">
                                <div><strong>Latitude Arithmetic:</strong> arcsin( ${v.ecefZ} km / 6,371 km ) = arcsin(${sinRatio}) = <strong style="color:#00ff88;">${v.latStr}</strong></div>
                                <div style="margin-top: 8px;"><strong>Longitude Arithmetic:</strong> atan2( ${v.ecefY} km , ${v.ecefX} km ) = <strong style="color:#00ff88;">${v.lonStr}</strong></div>
                            </div>

                            <div class="res-title" style="color: #00ff88; font-size: 1.8rem; margin: 12px 0;">
                                Final Coordinates: ${v.latStr}, ${v.lonStr}
                            </div>
                            <p class="res-explanation" style="font-size: 1.05rem; max-width: 680px; margin: 0 auto;">
                                Congratulations! You computed the signal travel delay, multiplied by light speed, set up intersecting spheres, corrected clock drift, and solved for whole-degree coordinates!
                            </p>
                            <div style="margin-top: 20px;">
                                <button class="btn btn-primary" id="btn-restart-lab">↺ Practice Again</button>
                            </div>
                        </div>
                    `;
                }
            }
        ];
    }

    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    scrambleTray() {
        const tray = document.getElementById('lab-blocks-tray');
        if (!tray) return;
        const blocks = Array.from(tray.children);
        for (let i = blocks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            tray.appendChild(blocks[j]);
        }
    }

    render() {
        const val = this.getLiveValues();
        const stageDef = this.stageDefinitions[this.currentStageIndex];
        const blocks = this.shuffle(stageDef.getBlocks(val));

        this.container.innerHTML = `
            <div class="lab-card">
                <div class="lab-header">
                    <div class="lab-stage-steps">
                        ${this.stageDefinitions.map((s, idx) => `
                            <div class="lab-step-indicator ${idx === this.currentStageIndex ? 'active' : ''} ${idx < this.currentStageIndex ? 'completed' : ''}">
                                <span class="step-dot">${idx < this.currentStageIndex ? '✔' : idx + 1}</span>
                                <span class="step-label">Stage ${idx + 1}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="lab-stage-body">
                    <div class="lab-meta-row">
                        <span class="badge badge-gps">${stageDef.badge}</span>
                        <h3 class="lab-stage-title">${stageDef.title}</h3>
                        <p class="lab-stage-subtitle">${stageDef.subtitle}</p>
                    </div>

                    <div class="lab-instruction-bar">
                        <span class="hint-icon">💡</span>
                        <span><strong>Objective:</strong> ${stageDef.hint} Drag or tap the boxes below with their actual numbers into the formula slots.</span>
                    </div>

                    <div class="lab-equation-frame math-formula" id="lab-equation-slots">
                        ${stageDef.formulaTemplate}
                    </div>

                    <div class="lab-tray-container">
                        <div class="tray-label">📦 Available Data Blocks (with real values):</div>
                        <div class="lab-blocks-tray" id="lab-blocks-tray">
                            ${blocks.map(b => `
                                <div class="movable-block" draggable="true" data-block-id="${b.id}" data-label="${b.label}" data-val="${b.val}">
                                    <span class="block-grip">⋮⋮</span>
                                    <div class="block-text-col">
                                        <div class="block-top-row">
                                            <span class="block-label">${b.label}</span>
                                            <span class="block-title">${b.title}</span>
                                        </div>
                                        <div class="block-numeric-val">${b.val}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="lab-actions-bar">
                        <button class="btn btn-outline" id="btn-clear-slots">↺ Clear Slots</button>
                        <button class="btn btn-primary" id="btn-solve-equation" disabled>
                            ⚡ SOLVE!
                        </button>
                    </div>

                    <div class="lab-solution-container" id="lab-solution-box" style="display: none;"></div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const slots = this.container.querySelectorAll('.drop-slot');
        const solveBtn = document.getElementById('btn-solve-equation');
        const clearBtn = document.getElementById('btn-clear-slots');

        const blocks = this.container.querySelectorAll('.movable-block');
        blocks.forEach(block => {
            block.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', block.getAttribute('data-block-id'));
                block.classList.add('dragging');
            });

            block.addEventListener('dragend', () => {
                block.classList.remove('dragging');
            });

            block.addEventListener('click', () => {
                if (block.classList.contains('placed')) return;

                if (this.selectedBlock === block) {
                    this.selectedBlock.classList.remove('selected-touch');
                    this.selectedBlock = null;
                } else {
                    if (this.selectedBlock) this.selectedBlock.classList.remove('selected-touch');
                    this.selectedBlock = block;
                    this.selectedBlock.classList.add('selected-touch');
                }
            });
        });

        slots.forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });

            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });

            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                const blockId = e.dataTransfer.getData('text/plain');
                this.placeBlockInSlot(blockId, slot);
            });

            slot.addEventListener('click', () => {
                if (slot.dataset.filledBlockId) {
                    this.removeBlockFromSlot(slot);
                } else if (this.selectedBlock) {
                    const blockId = this.selectedBlock.getAttribute('data-block-id');
                    this.placeBlockInSlot(blockId, slot);
                    if (this.selectedBlock) {
                        this.selectedBlock.classList.remove('selected-touch');
                        this.selectedBlock = null;
                    }
                }
            });
        });

        clearBtn.addEventListener('click', () => {
            slots.forEach(slot => this.removeBlockFromSlot(slot));
            this.scrambleTray();
            this.checkSolveReadiness();
        });

        solveBtn.addEventListener('click', () => {
            this.handleSolve();
        });
    }

    placeBlockInSlot(blockId, slot) {
        if (slot.dataset.filledBlockId) {
            this.removeBlockFromSlot(slot);
        }

        const blockEl = this.container.querySelector(`.movable-block[data-block-id="${blockId}"]`);
        if (!blockEl) return;

        const previousSlot = this.container.querySelector(`.drop-slot[data-filled-block-id="${blockId}"]`);
        if (previousSlot) {
            delete previousSlot.dataset.filledBlockId;
            previousSlot.innerHTML = previousSlot.dataset.originalPlaceholder || '<span class="slot-placeholder">Empty</span>';
            previousSlot.classList.remove('filled');
        }

        if (!slot.dataset.originalPlaceholder) {
            slot.dataset.originalPlaceholder = slot.innerHTML;
        }

        const label = blockEl.dataset.label;
        const val = blockEl.dataset.val;

        slot.dataset.filledBlockId = blockId;
        slot.classList.add('filled');
        slot.innerHTML = `
            <div class="placed-pill">
                <span class="pill-label">${label}</span>
                <span class="pill-val">(${val})</span>
                <button class="pill-remove-btn" title="Remove">&times;</button>
            </div>
        `;

        blockEl.classList.add('placed');

        slot.querySelector('.pill-remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeBlockFromSlot(slot);
        });

        this.checkSolveReadiness();
    }

    removeBlockFromSlot(slot) {
        const blockId = slot.dataset.filledBlockId;
        if (!blockId) return;

        const blockEl = this.container.querySelector(`.movable-block[data-block-id="${blockId}"]`);
        if (blockEl) {
            blockEl.classList.remove('placed');
        }

        delete slot.dataset.filledBlockId;
        slot.classList.remove('filled');
        slot.innerHTML = slot.dataset.originalPlaceholder || '<span class="slot-placeholder">Empty</span>';

        this.checkSolveReadiness();
    }

    checkSolveReadiness() {
        const slots = Array.from(this.container.querySelectorAll('.drop-slot'));
        const solveBtn = document.getElementById('btn-solve-equation');
        if (!solveBtn) return;

        const allFilled = slots.every(slot => !!slot.dataset.filledBlockId);
        const allCorrect = allFilled && slots.every(slot => slot.dataset.filledBlockId === slot.dataset.expected);

        if (allCorrect) {
            solveBtn.disabled = false;
            solveBtn.classList.add('ready-to-solve');
            solveBtn.innerHTML = '⚡ SOLVE! (Order Verified)';
        } else {
            solveBtn.disabled = true;
            solveBtn.classList.remove('ready-to-solve');
            solveBtn.innerHTML = allFilled ? '❌ Incorrect Order - Check Slots' : '⚡ SOLVE!';
        }
    }

    handleSolve() {
        const stageDef = this.stageDefinitions[this.currentStageIndex];
        const solutionBox = document.getElementById('lab-solution-box');
        const solveBtn = document.getElementById('btn-solve-equation');
        const val = this.getLiveValues();

        this.playSuccessSound();

        solveBtn.disabled = true;
        solutionBox.style.display = 'block';
        solutionBox.innerHTML = stageDef.getSolveResult(val);

        if (this.currentStageIndex < this.stageDefinitions.length - 1) {
            solutionBox.innerHTML += `
                <div style="margin-top: 16px; text-align: right;">
                    <button class="btn btn-primary" id="btn-next-lab-stage">
                        Next Equation (Stage ${this.currentStageIndex + 2}) ➡
                    </button>
                </div>
            `;
            document.getElementById('btn-next-lab-stage').addEventListener('click', () => {
                this.currentStageIndex++;
                this.render();
            });
        } else {
            const restartBtn = document.getElementById('btn-restart-lab');
            if (restartBtn) {
                restartBtn.addEventListener('click', () => {
                    this.currentStageIndex = 0;
                    this.render();
                });
            }
        }
    }

    update(telemetry) {
        this.telemetry = telemetry;
        const slots = Array.from(this.container.querySelectorAll('.drop-slot'));
        const anyFilled = slots.some(slot => !!slot.dataset.filledBlockId);
        if (!anyFilled) {
            this.render();
        }
    }

    playSuccessSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.12, now + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.28);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.08);
                osc.stop(now + i * 0.08 + 0.28);
            });
        } catch (e) {}
    }
}

window.GPSInteractiveLab = GPSInteractiveLab;
