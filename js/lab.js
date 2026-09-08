/**
 * GPS Demonstration - Section 5: Interactive Equation Lab
 * Hands-on drag-and-drop and tap-to-place equation builder for secondary students
 */

class GPSInteractiveLab {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStageIndex = 0;
        this.selectedBlock = null; // for click-to-place on touchscreens
        this.telemetry = null;

        this.initStages();
        this.render();
    }

    initStages() {
        this.stages = [
            {
                id: 1,
                badge: "Equation 1 of 5",
                title: "Time of Flight (Signal Delay)",
                subtitle: "Calculate how long the radio wave took to travel from Satellite 1 to your watch.",
                hint: "Subtract the satellite's transmission timestamp from your watch's arrival timestamp.",
                formulaTemplate: `
                    <div class="lab-eq-line">
                        <span class="eq-symbol">&Delta;t<sub>1</sub></span>
                        <span class="eq-operator">=</span>
                        <div class="drop-slot" data-slot="slot1" data-expected="t_rx">
                            <span class="slot-placeholder">Drop: Arrival Time</span>
                        </div>
                        <span class="eq-operator">&minus;</span>
                        <div class="drop-slot" data-slot="slot2" data-expected="t_tx1">
                            <span class="slot-placeholder">Drop: Broadcast Time</span>
                        </div>
                    </div>
                `,
                blocks: [
                    { id: "t_rx", label: "t_rx", desc: "Watch Arrival Time", type: "time" },
                    { id: "t_tx1", label: "t_tx1", desc: "Satellite Broadcast Time", type: "time" },
                    { id: "c", label: "c", desc: "Speed of Light (299,792 km/s)", type: "const" },
                    { id: "R_Earth", label: "R_Earth", desc: "Earth Radius (6,371 km)", type: "const" },
                    { id: "X1", label: "X₁", desc: "Satellite 1 X Coord", type: "coord" }
                ],
                getSolveResult: (tel) => {
                    const sat = tel && tel.satellites && tel.satellites[0] ? tel.satellites[0] : null;
                    const delayMs = sat ? sat.timeDeltaMs : "68.4230";
                    const delaySec = sat ? sat.timeDeltaSec : "0.06842300";
                    return `
                        <div class="result-success-box">
                            <div class="res-title">✔ Equation 1 Solved!</div>
                            <div class="res-math">&Delta;t<sub>1</sub> = t<sub>rx</sub> &minus; t<sub>tx1</sub> = <strong>${delayMs} ms</strong> (${delaySec} s)</div>
                            <p class="res-explanation">Great job! You found the exact time of flight of the radio wave traveling from space.</p>
                        </div>
                    `;
                }
            },
            {
                id: 2,
                badge: "Equation 2 of 5",
                title: "Calculating Distance (Pseudorange)",
                subtitle: "Convert the signal delay into radial distance in kilometers.",
                hint: "Distance equals speed of light multiplied by time delay.",
                formulaTemplate: `
                    <div class="lab-eq-line">
                        <span class="eq-symbol">d<sub>1</sub></span>
                        <span class="eq-operator">=</span>
                        <div class="drop-slot" data-slot="slot1" data-expected="c">
                            <span class="slot-placeholder">Drop: Speed of Light</span>
                        </div>
                        <span class="eq-operator">&times;</span>
                        <div class="drop-slot" data-slot="slot2" data-expected="dt1">
                            <span class="slot-placeholder">Drop: Time Delay (&Delta;t₁)</span>
                        </div>
                    </div>
                `,
                blocks: [
                    { id: "c", label: "c", desc: "Speed of Light (299,792 km/s)", type: "const" },
                    { id: "dt1", label: "&Delta;t₁", desc: "Time Delay (from Eq 1)", type: "time" },
                    { id: "t_rx", label: "t_rx", desc: "Arrival Time", type: "time" },
                    { id: "Y1", label: "Y₁", desc: "Satellite 1 Y Coord", type: "coord" },
                    { id: "Z1", label: "Z₁", desc: "Satellite 1 Z Coord", type: "coord" }
                ],
                getSolveResult: (tel) => {
                    const sat = tel && tel.satellites && tel.satellites[0] ? tel.satellites[0] : null;
                    const dist = sat ? parseFloat(sat.distanceKm).toLocaleString() : "20,515";
                    return `
                        <div class="result-success-box">
                            <div class="res-title">✔ Equation 2 Solved!</div>
                            <div class="res-math">d<sub>1</sub> = 299,792.458 km/s &times; &Delta;t<sub>1</sub> = <strong>${dist} km</strong></div>
                            <p class="res-explanation">Awesome! You determined the exact straight-line distance from your watch to Satellite 1.</p>
                        </div>
                    `;
                }
            },
            {
                id: 3,
                badge: "Equation 3 of 5",
                title: "3D Sphere Equation (Satellite 1)",
                subtitle: "Assemble the 3D spherical shell representing all points at distance d₁.",
                hint: "Use the satellite 3D coordinates (X₁, Y₁, Z₁) and its radial distance d₁.",
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
                blocks: [
                    { id: "X1", label: "X₁", desc: "Satellite 1 X Position", type: "coord" },
                    { id: "Y1", label: "Y₁", desc: "Satellite 1 Y Position", type: "coord" },
                    { id: "Z1", label: "Z₁", desc: "Satellite 1 Z Position", type: "coord" },
                    { id: "d1", label: "d₁", desc: "Range Radius (Eq 2)", type: "dist" },
                    { id: "c", label: "c", desc: "Speed of Light", type: "const" },
                    { id: "dt_clock", label: "&Delta;t_clock", desc: "Clock Bias", type: "time" }
                ],
                getSolveResult: (tel) => {
                    const sat = tel && tel.satellites && tel.satellites[0] ? tel.satellites[0] : null;
                    const x = sat ? sat.ecef.x : "14200";
                    const y = sat ? sat.ecef.y : "-8500";
                    const z = sat ? sat.ecef.z : "21000";
                    const d = sat ? Math.round(parseFloat(sat.distanceKm)) : "20515";
                    return `
                        <div class="result-success-box">
                            <div class="res-title">✔ Equation 3 Solved!</div>
                            <div class="res-math">(X &minus; ${x})<sup>2</sup> + (Y &minus; ${y})<sup>2</sup> + (Z &minus; ${z})<sup>2</sup> = ${d}<sup>2</sup></div>
                            <p class="res-explanation">Sphere 1 is locked in! In 3D space, you are somewhere on this spherical surface.</p>
                        </div>
                    `;
                }
            },
            {
                id: 4,
                badge: "Equation 4 of 5",
                title: "4th Satellite Clock Bias Correction",
                subtitle: "Incorporate the quartz clock error (&Delta;t_clock) into the satellite ranging equation.",
                hint: "Multiply light speed by the measured delay minus the clock bias.",
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
                blocks: [
                    { id: "c", label: "c", desc: "Speed of Light", type: "const" },
                    { id: "dti", label: "&Delta;t<sub>i</sub>", desc: "Measured Delay", type: "time" },
                    { id: "dt_clock", label: "&Delta;t<sub>clock</sub>", desc: "Watch Clock Bias", type: "time" },
                    { id: "R_Earth", label: "R_Earth", desc: "Earth Radius", type: "const" },
                    { id: "Zi", label: "Z<sub>i</sub>", desc: "Satellite Z Coord", type: "coord" }
                ],
                getSolveResult: (tel) => {
                    const coords = tel ? tel.userCoords : { lat: 40, lon: -3 };
                    // Calculate representative Earth ECEF coordinates
                    const R = 6371;
                    const phi = coords.lat * (Math.PI / 180);
                    const theta = coords.lon * (Math.PI / 180);
                    const ecefX = Math.round(R * Math.cos(phi) * Math.cos(theta));
                    const ecefY = Math.round(R * Math.cos(phi) * Math.sin(theta));
                    const ecefZ = Math.round(R * Math.sin(phi));

                    return `
                        <div class="result-success-box">
                            <div class="res-title">✔ 4-Equation System Solved!</div>
                            <div class="res-math">Clock Bias &Delta;t<sub>clock</sub> = +1.28 &mu;s &rarr; <strong>0.00 ns Atomic Lock</strong></div>
                            <div class="res-math" style="margin-top: 6px; font-size: 0.95em;">
                                Solved ECEF Cartesian Coordinates: <strong>X: ${ecefX} km, Y: ${ecefY} km, Z: ${ecefZ} km</strong>
                            </div>
                            <p class="res-explanation">Brilliant! The 4th satellite eliminated the outer space point and synchronized your watch clock to GPS atomic time!</p>
                        </div>
                    `;
                }
            },
            {
                id: 5,
                badge: "Equation 5 of 5",
                title: "Converting to Latitude & Longitude",
                subtitle: "Convert Cartesian (X, Y, Z) coordinates into the final whole-degree geographic coordinates!",
                hint: "Latitude uses Z over Earth radius (R_Earth); Longitude uses atan2 of Y and X.",
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
                blocks: [
                    { id: "Z", label: "Z", desc: "ECEF Z (North-South)", type: "coord" },
                    { id: "R_Earth", label: "R_Earth", desc: "Earth Radius (6,371 km)", type: "const" },
                    { id: "Y", label: "Y", desc: "ECEF Y Coord", type: "coord" },
                    { id: "X", label: "X", desc: "ECEF X Coord", type: "coord" },
                    { id: "c", label: "c", desc: "Speed of Light", type: "const" },
                    { id: "d1", label: "d₁", desc: "Distance", type: "dist" }
                ],
                getSolveResult: (tel) => {
                    const coords = tel ? tel.userCoords : { lat: 40, lon: -3 };
                    const latStr = coords.lat >= 0 ? `${coords.lat}° N` : `${Math.abs(coords.lat)}° S`;
                    const lonStr = coords.lon >= 0 ? `${coords.lon}° E` : `${Math.abs(coords.lon)}° W`;

                    return `
                        <div class="result-success-box final-celebration">
                            <div class="celebration-badge">🏆 MISSION COMPLETE: 3D GPS FIX</div>
                            <div class="res-title" style="color: #00ff88; font-size: 1.6rem; margin: 10px 0;">
                                ${latStr}, ${lonStr}
                            </div>
                            <p class="res-explanation" style="font-size: 1.05rem;">
                                You successfully navigated the entire physics and mathematics pipeline of GPS satellite navigation!
                                From nanosecond time delays to intersecting spheres and whole-degree coordinates!
                            </p>
                            <div style="margin-top: 16px;">
                                <button class="btn btn-primary" id="btn-restart-lab">↺ Practice Again</button>
                            </div>
                        </div>
                    `;
                }
            }
        ];
    }

    render() {
        const stage = this.stages[this.currentStageIndex];

        this.container.innerHTML = `
            <div class="lab-card">
                <!-- Lab Header & Stage Steps -->
                <div class="lab-header">
                    <div class="lab-stage-steps">
                        ${this.stages.map((s, idx) => `
                            <div class="lab-step-indicator ${idx === this.currentStageIndex ? 'active' : ''} ${idx < this.currentStageIndex ? 'completed' : ''}">
                                <span class="step-dot">${idx < this.currentStageIndex ? '✔' : idx + 1}</span>
                                <span class="step-label">Stage ${idx + 1}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Stage Info -->
                <div class="lab-stage-body">
                    <div class="lab-meta-row">
                        <span class="badge badge-gps">${stage.badge}</span>
                        <h3 class="lab-stage-title">${stage.title}</h3>
                        <p class="lab-stage-subtitle">${stage.subtitle}</p>
                    </div>

                    <!-- Hint / Instructions -->
                    <div class="lab-instruction-bar">
                        <span class="hint-icon">💡</span>
                        <span><strong>Objective:</strong> ${stage.hint} Drag or tap the blocks below into the equation slots.</span>
                    </div>

                    <!-- Target Equation Frame with Slots -->
                    <div class="lab-equation-frame math-formula" id="lab-equation-slots">
                        ${stage.formulaTemplate}
                    </div>

                    <!-- Movable Blocks Tray -->
                    <div class="lab-tray-container">
                        <div class="tray-label">📦 Available Data Blocks (Drag or Tap to place):</div>
                        <div class="lab-blocks-tray" id="lab-blocks-tray">
                            ${stage.blocks.map(b => `
                                <div class="movable-block" draggable="true" data-block-id="${b.id}" data-type="${b.type}">
                                    <span class="block-grip">⋮⋮</span>
                                    <span class="block-label">${b.label}</span>
                                    <span class="block-desc">${b.desc}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Action Buttons Bar -->
                    <div class="lab-actions-bar">
                        <button class="btn btn-outline" id="btn-clear-slots">↺ Clear Slots</button>
                        <button class="btn btn-primary" id="btn-solve-equation" disabled>
                            ⚡ SOLVE!
                        </button>
                    </div>

                    <!-- Dynamic Solution Display -->
                    <div class="lab-solution-container" id="lab-solution-box" style="display: none;"></div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const tray = document.getElementById('lab-blocks-tray');
        const slots = this.container.querySelectorAll('.drop-slot');
        const solveBtn = document.getElementById('btn-solve-equation');
        const clearBtn = document.getElementById('btn-clear-slots');

        // Drag & Drop Handlers for desktop
        const blocks = this.container.querySelectorAll('.movable-block');
        blocks.forEach(block => {
            block.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', block.getAttribute('data-block-id'));
                block.classList.add('dragging');
            });

            block.addEventListener('dragend', () => {
                block.classList.remove('dragging');
            });

            // Tap/Click support for tablets & touchscreen students
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

        // Drop Slots Handlers
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

            // Click slot to place selected touch block or remove existing block
            slot.addEventListener('click', () => {
                if (slot.dataset.filledBlockId) {
                    // Clicking filled slot removes the block and returns it to tray
                    this.removeBlockFromSlot(slot);
                } else if (this.selectedBlock) {
                    // Place selected block into slot
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
            this.checkSolveReadiness();
        });

        solveBtn.addEventListener('click', () => {
            this.handleSolve();
        });
    }

    placeBlockInSlot(blockId, slot) {
        // If slot already filled, return previous block
        if (slot.dataset.filledBlockId) {
            this.removeBlockFromSlot(slot);
        }

        const blockEl = this.container.querySelector(`.movable-block[data-block-id="${blockId}"]`);
        if (!blockEl) return;

        // If block was in another slot, clear that slot
        const previousSlot = this.container.querySelector(`.drop-slot[data-filled-block-id="${blockId}"]`);
        if (previousSlot) {
            delete previousSlot.dataset.filledBlockId;
            previousSlot.innerHTML = previousSlot.dataset.originalPlaceholder || '<span class="slot-placeholder">Empty</span>';
            previousSlot.classList.remove('filled');
        }

        // Save original placeholder
        if (!slot.dataset.originalPlaceholder) {
            slot.dataset.originalPlaceholder = slot.innerHTML;
        }

        // Mark slot filled
        slot.dataset.filledBlockId = blockId;
        slot.classList.add('filled');
        slot.innerHTML = `
            <div class="placed-pill">
                <span class="pill-label">${blockEl.querySelector('.block-label').textContent}</span>
                <button class="pill-remove-btn" title="Remove">&times;</button>
            </div>
        `;

        // Mark block in tray
        blockEl.classList.add('placed');

        // Hook up remove button inside pill
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

        // Check if all slots are filled
        const allFilled = slots.every(slot => !!slot.dataset.filledBlockId);

        // Check if all slots have the EXPECTED block
        const allCorrect = allFilled && slots.every(slot => slot.dataset.filledBlockId === slot.dataset.expected);

        if (allCorrect) {
            solveBtn.disabled = false;
            solveBtn.classList.add('ready-to-solve');
            solveBtn.innerHTML = '⚡ SOLVE! (Order Verified)';
        } else {
            solveBtn.disabled = true;
            solveBtn.classList.remove('ready-to-solve');
            solveBtn.innerHTML = allFilled ? '❌ Incorrect Order - Try Again' : '⚡ SOLVE!';
        }
    }

    handleSolve() {
        const stage = this.stages[this.currentStageIndex];
        const solutionBox = document.getElementById('lab-solution-box');
        const solveBtn = document.getElementById('btn-solve-equation');

        this.playSuccessSound();

        solveBtn.disabled = true;
        solutionBox.style.display = 'block';
        solutionBox.innerHTML = stage.getSolveResult(this.telemetry);

        if (this.currentStageIndex < this.stages.length - 1) {
            solutionBox.innerHTML += `
                <div style="margin-top: 14px; text-align: right;">
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
            // Final restart button
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
    }

    playSuccessSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
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
        } catch (e) {
            // Audio not supported
        }
    }
}

window.GPSInteractiveLab = GPSInteractiveLab;
