/**
 * GPS Demonstration - 3D Earth, Orbiting Satellites, and Squiggly Signal Beams
 * Powered by Three.js
 */

class GPSGlobe {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.onLocationSelect = options.onLocationSelect || null;
        
        this.EARTH_RADIUS = 5.0;
        this.ORBIT_RADIUS = 11.5;
        
        this.userCoords = { lat: 40, lon: -3 }; // Madrid default
        this.satellitesAcquired = false;
        this.activeStep = 0;
        
        this.satellites = [
            { id: 1, name: 'NAVSTAR SVN 12', prn: 'PRN 12', color: 0x00f0ff, hexColor: '#00f0ff', relAzimuth: 40, relElev: 58 },
            { id: 2, name: 'NAVSTAR SVN 24', prn: 'PRN 24', color: 0xffb000, hexColor: '#ffb000', relAzimuth: 130, relElev: 50 },
            { id: 3, name: 'NAVSTAR SVN 08', prn: 'PRN 08', color: 0x00ff88, hexColor: '#00ff88', relAzimuth: 220, relElev: 62 },
            { id: 4, name: 'NAVSTAR SVN 15', prn: 'PRN 15', color: 0xd946ef, hexColor: '#d946ef', relAzimuth: 310, relElev: 72 }
        ];

        this.initScene();
        this.createStars();
        this.createEarth();
        this.createContinents();
        this.createSatellites();
        this.createUserMarker();
        this.createSignalBeams();
        this.createIntersectionVisuals();
        this.setupInteraction();
        this.setupResizeListener();
        
        this.setCoordinates(this.userCoords.lat, this.userCoords.lon, false);
        
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x050a14, 0.015);

        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 500;

        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 8, 22);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x050a14, 1);
        this.container.appendChild(this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0x223355, 1.2);
        this.scene.add(ambientLight);

        this.sunLight = new THREE.DirectionalLight(0xffffff, 1.6);
        this.sunLight.position.set(15, 12, 18);
        this.scene.add(this.sunLight);

        const fillLight = new THREE.DirectionalLight(0x00b4d8, 0.4);
        fillLight.position.set(-15, -10, -15);
        this.scene.add(fillLight);

        this.earthGroup = new THREE.Group();
        this.scene.add(this.earthGroup);

        this.spaceGroup = new THREE.Group();
        this.scene.add(this.spaceGroup);

        this.clock = new THREE.Clock();
    }

    createStars() {
        const starCount = 600;
        const starGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
            const r = 80 + Math.random() * 120;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i] = r * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = r * Math.cos(phi);
            positions[i + 2] = r * Math.sin(phi) * Math.sin(theta);

            const c = 0.6 + Math.random() * 0.4;
            colors[i] = c * 0.8;
            colors[i + 1] = c * 0.9;
            colors[i + 2] = c;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starMaterial = new THREE.PointsMaterial({
            size: 1.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.85
        });

        this.starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.starField);
    }

    createEarth() {
        const sphereGeo = new THREE.SphereGeometry(this.EARTH_RADIUS, 64, 64);
        const sphereMat = new THREE.MeshPhongMaterial({
            color: 0x08192e,
            emissive: 0x030b14,
            specular: 0x1d3557,
            shininess: 25,
            transparent: true,
            opacity: 0.95
        });
        this.earthSphere = new THREE.Mesh(sphereGeo, sphereMat);
        this.earthGroup.add(this.earthSphere);

        const atmosGeo = new THREE.SphereGeometry(this.EARTH_RADIUS * 1.025, 48, 48);
        const atmosMat = new THREE.MeshBasicMaterial({
            color: 0x00b4d8,
            transparent: true,
            opacity: 0.12,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
        this.earthGroup.add(atmosphere);

        const equatorPoints = [];
        for (let i = 0; i <= 128; i++) {
            const angle = (i / 128) * Math.PI * 2;
            equatorPoints.push(new THREE.Vector3(
                (this.EARTH_RADIUS + 0.01) * Math.cos(angle),
                0,
                (this.EARTH_RADIUS + 0.01) * Math.sin(angle)
            ));
        }
        const lineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.25 });
        const equatorLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(equatorPoints), lineMat);
        this.earthGroup.add(equatorLine);
    }

    createContinents() {
        if (!window.CONTINENT_OUTLINES || !Array.isArray(window.CONTINENT_OUTLINES)) {
            return;
        }

        const continentMat = new THREE.LineBasicMaterial({
            color: 0x00ffcc,
            transparent: true,
            opacity: 0.85,
            linewidth: 1.5
        });

        const continentGroup = new THREE.Group();

        window.CONTINENT_OUTLINES.forEach(ring => {
            const points = [];
            for (let i = 0; i < ring.length; i++) {
                const lon = ring[i][0];
                const lat = ring[i][1];
                const pt = this.latLonToVector3(lat, lon, this.EARTH_RADIUS + 0.015);
                points.push(pt);
            }
            if (points.length > 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, continentMat);
                continentGroup.add(line);
            }
        });

        this.earthGroup.add(continentGroup);
    }

    latLonToVector3(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        return new THREE.Vector3(
            -radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
    }

    vector3ToLatLon(v) {
        const norm = v.clone().normalize();
        const phi = Math.acos(Math.max(-1, Math.min(1, norm.y)));
        const lat = 90 - (phi * 180 / Math.PI);
        const theta = Math.atan2(norm.z, -norm.x);
        let lon = (theta * 180 / Math.PI) - 180;
        while (lon < -180) lon += 360;
        while (lon > 180) lon -= 360;
        return {
            lat: Math.round(lat),
            lon: Math.round(lon)
        };
    }

    createUserMarker() {
        this.userMarkerGroup = new THREE.Group();

        const coneGeo = new THREE.ConeGeometry(0.18, 0.6, 16);
        coneGeo.rotateX(Math.PI);
        coneGeo.translate(0, 0.3, 0);
        const coneMat = new THREE.MeshStandardMaterial({
            color: 0xff3366,
            emissive: 0xff1144,
            roughness: 0.3
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        this.userMarkerGroup.add(cone);

        const headGeo = new THREE.SphereGeometry(0.22, 16, 16);
        headGeo.translate(0, 0.6, 0);
        const headMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xff3366,
            roughness: 0.2
        });
        const head = new THREE.Mesh(headGeo, headMat);
        this.userMarkerGroup.add(head);

        const ringGeo = new THREE.RingGeometry(0.15, 0.35, 24);
        ringGeo.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xff3366,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        this.pulseRing = new THREE.Mesh(ringGeo, ringMat);
        this.userMarkerGroup.add(this.pulseRing);

        this.earthGroup.add(this.userMarkerGroup);
    }

    createSatellites() {
        this.satelliteMeshes = [];

        this.satellites.forEach(sat => {
            const group = new THREE.Group();

            const bodyGeo = new THREE.BoxGeometry(0.35, 0.35, 0.5);
            const bodyMat = new THREE.MeshStandardMaterial({
                color: 0xd4af37,
                metalness: 0.85,
                roughness: 0.25,
                emissive: 0x443300
            });
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            group.add(body);

            const panelGeo = new THREE.BoxGeometry(1.4, 0.03, 0.32);
            const panelMat = new THREE.MeshStandardMaterial({
                color: 0x0055aa,
                metalness: 0.9,
                roughness: 0.2,
                emissive: 0x001133
            });
            const panels = new THREE.Mesh(panelGeo, panelMat);
            group.add(panels);

            const dishGeo = new THREE.ConeGeometry(0.18, 0.2, 16, 1, true);
            dishGeo.rotateX(Math.PI);
            const dishMat = new THREE.MeshStandardMaterial({
                color: 0xcccccc,
                metalness: 0.7,
                roughness: 0.3
            });
            const dish = new THREE.Mesh(dishGeo, dishMat);
            dish.position.z = -0.3;
            group.add(dish);

            const lightGeo = new THREE.SphereGeometry(0.08, 12, 12);
            const lightMat = new THREE.MeshBasicMaterial({ color: sat.color });
            const beacon = new THREE.Mesh(lightGeo, lightMat);
            beacon.position.y = 0.22;
            group.add(beacon);

            const sprite = this.createTextSprite(sat.prn, sat.hexColor);
            sprite.position.set(0, 0.65, 0);
            group.add(sprite);

            group.scale.set(0.001, 0.001, 0.001);
            group.visible = false;

            this.spaceGroup.add(group);
            this.satelliteMeshes.push({
                data: sat,
                group: group,
                dish: dish,
                worldPosition: new THREE.Vector3()
            });
        });
    }

    createTextSprite(text, colorHex) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgba(5, 12, 24, 0.85)';
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(8, 8, 240, 48, 10);
        } else {
            ctx.rect(8, 8, 240, 48);
        }
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 128, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(1.6, 0.4, 1);
        return sprite;
    }

    createSignalBeams() {
        this.signalBeams = [];
        this.BEAM_SEGMENTS = 100;

        this.satellites.forEach(sat => {
            const positions = new Float32Array(this.BEAM_SEGMENTS * 3);
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const material = new THREE.LineBasicMaterial({
                color: sat.color,
                transparent: true,
                opacity: 0.0,
                linewidth: 2.5
            });

            const line = new THREE.Line(geometry, material);
            this.scene.add(line);

            this.signalBeams.push({
                line: line,
                material: material,
                satId: sat.id,
                targetOpacity: 0.0
            });
        });
    }

    createIntersectionVisuals() {
        this.visualGroup = new THREE.Group();
        this.scene.add(this.visualGroup);

        this.rangeSpheres = [];
        this.satellites.forEach(sat => {
            const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
            const sphereMat = new THREE.MeshBasicMaterial({
                color: sat.color,
                wireframe: true,
                transparent: true,
                opacity: 0.0
            });
            const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
            this.visualGroup.add(sphereMesh);
            this.rangeSpheres.push(sphereMesh);
        });

        const circlePoints = [];
        for (let i = 0; i <= 64; i++) {
            const a = (i / 64) * Math.PI * 2;
            circlePoints.push(new THREE.Vector3(Math.cos(a), Math.sin(a), 0));
        }
        const circleGeo = new THREE.BufferGeometry().setFromPoints(circlePoints);
        const circleMat = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.0,
            linewidth: 3
        });
        this.intersectionCircle = new THREE.Line(circleGeo, circleMat);
        this.visualGroup.add(this.intersectionCircle);

        const falseGeo = new THREE.SphereGeometry(0.28, 16, 16);
        const falseMat = new THREE.MeshBasicMaterial({
            color: 0xff0044,
            wireframe: true,
            transparent: true,
            opacity: 0.0
        });
        this.falsePointMesh = new THREE.Mesh(falseGeo, falseMat);
        this.visualGroup.add(this.falsePointMesh);
    }

    updateSatellitePositions() {
        const userWorldPos = new THREE.Vector3();
        this.userMarkerGroup.getWorldPosition(userWorldPos);

        const normal = userWorldPos.clone().normalize();
        const arbitrary = Math.abs(normal.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
        const east = new THREE.Vector3().crossVectors(arbitrary, normal).normalize();
        const north = new THREE.Vector3().crossVectors(normal, east).normalize();

        this.satelliteMeshes.forEach((satObj) => {
            const sat = satObj.data;
            const azRad = sat.relAzimuth * (Math.PI / 180);
            const elRad = sat.relElev * (Math.PI / 180);

            const dir = normal.clone().multiplyScalar(Math.sin(elRad))
                .add(north.clone().multiplyScalar(Math.cos(elRad) * Math.cos(azRad)))
                .add(east.clone().multiplyScalar(Math.cos(elRad) * Math.sin(azRad)))
                .normalize();

            const satPos = dir.multiplyScalar(this.ORBIT_RADIUS);
            satObj.group.position.copy(satPos);
            satObj.worldPosition.copy(satPos);

            satObj.group.lookAt(0, 0, 0);
        });

        this.updateRangeSpheres();
    }

    updateRangeSpheres() {
        const userWorldPos = new THREE.Vector3();
        this.userMarkerGroup.getWorldPosition(userWorldPos);

        this.satelliteMeshes.forEach((satObj, index) => {
            const satPos = satObj.worldPosition;
            const dist = satPos.distanceTo(userWorldPos);
            const sphere = this.rangeSpheres[index];
            sphere.position.copy(satPos);
            sphere.scale.set(dist, dist, dist);
        });

        if (this.satelliteMeshes.length >= 2) {
            const p1 = this.satelliteMeshes[0].worldPosition;
            const p2 = this.satelliteMeshes[1].worldPosition;
            const r1 = p1.distanceTo(userWorldPos);
            const r2 = p2.distanceTo(userWorldPos);

            const d = p1.distanceTo(p2);
            if (d > 0.001) {
                const h = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
                const circleRadius = Math.sqrt(Math.max(0, r1 * r1 - h * h));
                const center = p1.clone().add(p2.clone().sub(p1).normalize().multiplyScalar(h));

                this.intersectionCircle.position.copy(center);
                this.intersectionCircle.scale.set(circleRadius, circleRadius, circleRadius);
                this.intersectionCircle.lookAt(p2);
            }
        }

        const s1 = this.satelliteMeshes[0].worldPosition;
        const s2 = this.satelliteMeshes[1].worldPosition;
        const s3 = this.satelliteMeshes[2].worldPosition;

        const planeNorm = new THREE.Vector3().crossVectors(s2.clone().sub(s1), s3.clone().sub(s1)).normalize();
        const distFromPlane = userWorldPos.clone().sub(s1).dot(planeNorm);
        const falsePoint = userWorldPos.clone().sub(planeNorm.clone().multiplyScalar(2 * distFromPlane));
        this.falsePointMesh.position.copy(falsePoint);
    }

    setCoordinates(lat, lon, animateTo = true) {
        this.userCoords.lat = Math.round(lat);
        this.userCoords.lon = Math.round(lon);

        const targetPos = this.latLonToVector3(this.userCoords.lat, this.userCoords.lon, this.EARTH_RADIUS);
        this.userMarkerGroup.position.copy(targetPos);
        this.userMarkerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), targetPos.clone().normalize());

        this.updateSatellitePositions();

        if (animateTo) {
            this.rotateToCoordinates(this.userCoords.lat, this.userCoords.lon);
        }

        if (this.onLocationSelect) {
            this.onLocationSelect(this.getTelemetryData());
        }
    }

    rotateToCoordinates(lat, lon) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        this.targetRotationY = -theta + Math.PI / 2;
        this.targetRotationX = phi - Math.PI / 2;
        
        this.earthGroup.rotation.y = this.targetRotationY;
        this.earthGroup.rotation.x = this.targetRotationX;
        this.updateSatellitePositions();
    }

    pingSatellites() {
        this.satellitesAcquired = true;

        this.satelliteMeshes.forEach((satObj) => {
            satObj.group.visible = true;
            satObj.group.scale.set(0.01, 0.01, 0.01);
        });

        this.signalBeams.forEach(beam => {
            beam.targetOpacity = 0.85;
        });

        if (this.onLocationSelect) {
            this.onLocationSelect(this.getTelemetryData());
        }
    }

    getTelemetryData() {
        const C = 299792.458;
        const REAL_EARTH_R_KM = 6371.0;

        const now = new Date();
        const baseSeconds = now.getUTCSeconds() + now.getUTCMilliseconds() / 1000;

        const userWorldPos = new THREE.Vector3();
        this.userMarkerGroup.getWorldPosition(userWorldPos);

        const telemetry = this.satelliteMeshes.map((satObj, idx) => {
            const sat = satObj.data;
            const satWorldPos = satObj.worldPosition;

            const visualDist = satWorldPos.distanceTo(userWorldPos);
            const realDistKm = (visualDist / this.EARTH_RADIUS) * REAL_EARTH_R_KM;
            
            const timeDeltaSec = realDistKm / C;
            const timeDeltaMs = timeDeltaSec * 1000;

            const satEcefKm = {
                x: Math.round((satWorldPos.x / this.EARTH_RADIUS) * REAL_EARTH_R_KM),
                y: Math.round((satWorldPos.y / this.EARTH_RADIUS) * REAL_EARTH_R_KM),
                z: Math.round((satWorldPos.z / this.EARTH_RADIUS) * REAL_EARTH_R_KM)
            };

            const txTimeSec = baseSeconds - timeDeltaSec;

            return {
                id: sat.id,
                name: sat.name,
                prn: sat.prn,
                color: sat.hexColor,
                ecef: satEcefKm,
                rxTimeFormatted: this.formatPreciseTime(baseSeconds),
                txTimeFormatted: this.formatPreciseTime(txTimeSec),
                timeDeltaMs: timeDeltaMs.toFixed(4),
                timeDeltaSec: timeDeltaSec.toFixed(8),
                distanceKm: realDistKm.toFixed(2),
                snrDb: (46 + Math.sin(idx * 2.3) * 4).toFixed(1)
            };
        });

        return {
            userCoords: { ...this.userCoords },
            satellitesAcquired: this.satellitesAcquired,
            satellites: telemetry
        };
    }

    formatPreciseTime(totalSeconds) {
        let sec = totalSeconds;
        while (sec < 0) sec += 86400;
        const s = Math.floor(sec) % 60;
        const m = Math.floor(sec / 60) % 60;
        const h = Math.floor(sec / 3600) % 24;
        const frac = Math.floor((sec - Math.floor(sec)) * 1000000000).toString().padStart(9, '0');
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${frac}`;
    }

    setCalculationStep(step) {
        this.activeStep = step;

        this.rangeSpheres.forEach((sphere, i) => {
            if (step === 2 && i === 0) {
                sphere.material.opacity = 0.22;
            } else if (step === 3 && (i === 0 || i === 1)) {
                sphere.material.opacity = 0.18;
            } else if (step === 4 && (i <= 2)) {
                sphere.material.opacity = 0.14;
            } else if (step === 5) {
                sphere.material.opacity = 0.10;
            } else {
                sphere.material.opacity = 0.0;
            }
        });

        this.intersectionCircle.material.opacity = (step === 3 || step === 4) ? 0.8 : 0.0;
        // In step 4 both points are shown; in step 5 the false space point fades out as 4th sat confirms Earth point
        this.falsePointMesh.material.opacity = (step === 4) ? 0.9 : 0.0;
    }

    setupInteraction() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.mouseDownPosition = { x: 0, y: 0 };

        const el = this.renderer.domElement;

        const onDown = (x, y) => {
            this.isDragging = true;
            this.previousMousePosition = { x, y };
            this.mouseDownPosition = { x, y };
        };

        const onMove = (x, y) => {
            if (!this.isDragging) return;

            const deltaX = x - this.previousMousePosition.x;
            const deltaY = y - this.previousMousePosition.y;

            this.earthGroup.rotation.y += deltaX * 0.006;
            this.earthGroup.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.earthGroup.rotation.x + deltaY * 0.006));

            this.previousMousePosition = { x, y };
            this.updateSatellitePositions();
        };

        const onUp = (x, y) => {
            this.isDragging = false;
            const distMoved = Math.hypot(x - this.mouseDownPosition.x, y - this.mouseDownPosition.y);
            if (distMoved < 6) {
                this.handleClick(x, y);
            }
        };

        el.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', (e) => onUp(e.clientX, e.clientY));

        el.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) onMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) onUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        });

        el.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camera.position.z = Math.max(12, Math.min(36, this.camera.position.z + e.deltaY * 0.02));
        }, { passive: false });
    }

    handleClick(clientX, clientY) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObject(this.earthSphere);

        if (intersects.length > 0) {
            const worldHit = intersects[0].point;
            const localHit = this.earthGroup.worldToLocal(worldHit.clone());

            const coords = this.vector3ToLatLon(localHit);
            this.setCoordinates(coords.lat, coords.lon, false);

            if (!this.satellitesAcquired) {
                this.pingSatellites();
            }
        }
    }

    setupResizeListener() {
        window.addEventListener('resize', () => {
            if (!this.container || !this.renderer || !this.camera) return;
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }

    animate() {
        requestAnimationFrame(this.animate);

        const elapsedTime = this.clock.getElapsedTime();

        if (!this.isDragging && this.activeStep === 0) {
            this.earthGroup.rotation.y += 0.0006;
            this.updateSatellitePositions();
        }

        if (this.satellitesAcquired) {
            this.satelliteMeshes.forEach(satObj => {
                if (satObj.group.scale.x < 1.0) {
                    const nextScale = Math.min(1.0, satObj.group.scale.x + 0.04);
                    satObj.group.scale.set(nextScale, nextScale, nextScale);
                }
            });
        }

        if (this.pulseRing) {
            const pulse = 1.0 + 0.25 * Math.sin(elapsedTime * 4);
            this.pulseRing.scale.set(pulse, pulse, pulse);
        }

        // Animated SQUIGGLY BEAMS
        if (this.satellitesAcquired) {
            const userWorldPos = new THREE.Vector3();
            this.userMarkerGroup.getWorldPosition(userWorldPos);

            this.signalBeams.forEach((beam, idx) => {
                beam.material.opacity += (beam.targetOpacity - beam.material.opacity) * 0.1;

                if (beam.material.opacity > 0.01) {
                    const satWorldPos = this.satelliteMeshes[idx].worldPosition;
                    const positions = beam.line.geometry.attributes.position.array;

                    const delta = userWorldPos.clone().sub(satWorldPos);
                    const length = delta.length();
                    const dir = delta.clone().normalize();

                    const up = Math.abs(dir.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
                    const perp = new THREE.Vector3().crossVectors(dir, up).normalize();

                    const numWaves = 8.0;
                    const waveSpeed = 9.0;
                    const waveAmp = 0.32;

                    for (let j = 0; j < this.BEAM_SEGMENTS; j++) {
                        const u = j / (this.BEAM_SEGMENTS - 1);
                        const base = satWorldPos.clone().add(dir.clone().multiplyScalar(u * length));
                        const envelope = Math.sin(u * Math.PI);
                        const wave = Math.sin(u * numWaves * Math.PI * 2 - elapsedTime * waveSpeed) * waveAmp * envelope;
                        const pt = base.add(perp.clone().multiplyScalar(wave));

                        positions[j * 3] = pt.x;
                        positions[j * 3 + 1] = pt.y;
                        positions[j * 3 + 2] = pt.z;
                    }

                    beam.line.geometry.attributes.position.needsUpdate = true;
                }
            });
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.GPSGlobe = GPSGlobe;
