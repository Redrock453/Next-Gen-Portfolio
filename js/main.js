document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // INTERACTIVE TERMINAL
    // ============================================
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');
    const interactiveTerminal = document.getElementById('interactive-terminal');
    let commandHistory = [];
    let historyIndex = -1;

    const commandHandlers = {
        help: () => [
            { text: 'AVAILABLE COMMANDS:', type: 'highlight' },
            { text: '─────────────────────────', type: 'output' },
            { text: '  help      — Show this help message', type: 'output' },
            { text: '  about     — Operator information', type: 'output' },
            { text: '  projects  — List projects with IDs', type: 'output' },
            { text: '  stack     — Technology stack', type: 'output' },
            { text: '  status    — System status check', type: 'output' },
            { text: '  contact   — Communication channels', type: 'output' },
            { text: '  time      — Current UTC time', type: 'output' },
            { text: '  clear     — Clear terminal', type: 'output' },
        ],
        about: () => [
            { text: 'UNIT: BAS — ARDUPILOT SYSTEMS ENGINEER', type: 'highlight' },
            { text: '─────────────────────────────────', type: 'output' },
            { text: 'Specialization: Autonomous flight systems, FPV drones', type: 'output' },
            { text: 'Experience: 5+ years in ArduPilot ecosystem', type: 'output' },
            { text: 'Projects: 70+ public repositories on GitHub', type: 'output' },
            { text: 'Status: Active military service (ZSU)', type: 'output' },
            { text: 'Core: PID tuning, SITL, MAVLink, Python, C++', type: 'output' },
        ],
        projects: () => [
            { text: 'MISSION LOG — PROJECT DATABASE:', type: 'highlight' },
            { text: '─────────────────────────────────', type: 'output' },
            { text: '  [01] GRIM-FPV-AI — Autonomous combat FPV platform', type: 'output' },
            { text: '  [02] GRIM WORLD MODEL — VAE collision avoidance', type: 'output' },
            { text: '  [03] TACTICAL MESH — LoRa mesh network (ESP32)', type: 'output' },
            { text: '  [04] GSM SECURITY & SDR — RF anomaly detection', type: 'output' },
            { text: '  [05] TACTICAL FIBER — EW-resistant fiber network', type: 'output' },
            { text: '  [06] STRATEGIC INTEL AI — Multi-agent OSINT', type: 'output' },
        ],
        stack: () => [
            { text: 'TECH ARSENAL:', type: 'highlight' },
            { text: '─────────────────────────────────', type: 'output' },
            { text: '  FLIGHT:    ArduPilot, SITL, PID Tuning, MAVLink', type: 'output' },
            { text: '  AI/ML:     YOLOv8, ByteTrack, OpenVINS, PyTorch', type: 'output' },
            { text: '  RF/COMMS:  SDR, LoRa, FHSS, GSM Analysis', type: 'output' },
            { text: '  CODE:      Python, C/C++, FastAPI, TypeScript', type: 'output' },
            { text: '  DEVOPS:    Docker, CI/CD, systemd, Tailscale', type: 'output' },
        ],
        status: () => [
            { text: 'SYSTEM STATUS REPORT:', type: 'highlight' },
            { text: '─────────────────────────────────', type: 'output' },
            { text: '  [OK] vika_ok         — ONLINE  [6 LLM providers]', type: 'output' },
            { text: '  [OK] grim-fpv-ai     — DEPLOYED [PID tuner v1.0]', type: 'output' },
            { text: '  [OK] portfolio       — LIVE     [GitHub Pages]', type: 'output' },
            { text: '  [!!] grim-world-model— TRAINING [VAE model]', type: 'output' },
            { text: '  [OK] tactical-fiber  — DOCUMENTED [10km mesh]', type: 'output' },
        ],
        contact: () => [
            { text: 'SECURE COMMUNICATION CHANNELS:', type: 'highlight' },
            { text: '─────────────────────────────────', type: 'output' },
            { text: '  [CH-001] SIGNAL — Encrypted messaging', type: 'output' },
            { text: '  [CH-002] GITHUB — /Redrock453', type: 'output' },
            { text: '', type: 'output' },
            { text: '  > Navigate to #contact section for links', type: 'output' },
        ],
        time: () => {
            const now = new Date();
            return [
                { text: `UTC: ${now.toUTCString()}`, type: 'highlight' },
                { text: `Local: ${now.toLocaleString()}`, type: 'output' },
                { text: `Unix: ${Math.floor(now.getTime() / 1000)}`, type: 'output' },
            ];
        },
        clear: () => {
            terminalBody.innerHTML = '';
            return [];
        }
    };

    function addTerminalLine(text, type = 'output') {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        if (type === 'highlight') {
            line.innerHTML = `<span class="cmd-highlight">${text}</span>`;
        } else if (type === 'error') {
            line.innerHTML = `<span class="cmd-error">${text}</span>`;
        } else {
            line.innerHTML = `<span class="cmd-output">${text}</span>`;
        }
        terminalBody.appendChild(line);
    }

    function addCommandEcho(cmd) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="prompt">></span> <span class="cmd-echo">${cmd}</span>`;
        terminalBody.appendChild(line);
    }

    function processCommand(input) {
        const cmd = input.trim().toLowerCase();
        if (!cmd) return;

        commandHistory.unshift(cmd);
        if (commandHistory.length > 50) commandHistory.pop();
        historyIndex = -1;

        addCommandEcho(input.trim());

        if (commandHandlers[cmd]) {
            const lines = commandHandlers[cmd]();
            lines.forEach(l => addTerminalLine(l.text, l.type));
        } else {
            addTerminalLine(`Unknown command: '${cmd}'. Type 'help' for available commands.`, 'error');
        }

        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    if (terminalInput && interactiveTerminal) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                processCommand(terminalInput.value);
                terminalInput.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = -1;
                    terminalInput.value = '';
                }
            }
        });

        interactiveTerminal.addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    // ============================================
    // RF LINK BUDGET CALCULATOR
    // ============================================
    const rfCalcBtn = document.getElementById('rf-calculate');
    if (rfCalcBtn) {
        rfCalcBtn.addEventListener('click', () => {
            const pt = parseFloat(document.getElementById('rf-pt').value);
            const gt = parseFloat(document.getElementById('rf-gt').value);
            const gr = parseFloat(document.getElementById('rf-gr').value);
            const dist = parseFloat(document.getElementById('rf-dist').value);
            const freq = parseFloat(document.getElementById('rf-freq').value);
            const lm = parseFloat(document.getElementById('rf-lm').value);

            if ([pt, gt, gr, dist, freq, lm].some(isNaN)) {
                alert('All fields must be valid numbers');
                return;
            }
            if (dist <= 0 || freq <= 0) {
                alert('Distance and Frequency must be greater than zero');
                return;
            }

            const lfs = 20 * Math.log10(dist) + 20 * Math.log10(freq) + 32.44;
            const pr = pt + gt + gr - lfs - lm;
            const sensitivity = -110;
            const margin = pr - sensitivity;

            document.getElementById('rf-pr').textContent = pr.toFixed(2) + ' dBm';
            document.getElementById('rf-lfs').textContent = lfs.toFixed(2) + ' dB';
            const marginEl = document.getElementById('rf-margin');
            marginEl.textContent = margin.toFixed(2) + ' dB';
            marginEl.className = 'calc-result-value ' + (margin >= 0 ? 'positive' : 'negative');

            document.getElementById('rf-results').style.display = 'block';
        });
    }

    // ============================================
    // FLIGHT TIME CALCULATOR
    // ============================================
    const ftCalcBtn = document.getElementById('ft-calculate');
    if (ftCalcBtn) {
        ftCalcBtn.addEventListener('click', () => {
            const cap = parseFloat(document.getElementById('ft-cap').value);
            const s = parseFloat(document.getElementById('ft-s').value);
            const c = parseFloat(document.getElementById('ft-c').value);
            const draw = parseFloat(document.getElementById('ft-draw').value);

            if ([cap, s, c, draw].some(isNaN)) {
                alert('All fields must be valid numbers');
                return;
            }
            if (cap <= 0 || draw <= 0 || c <= 0) {
                alert('Capacity, C-Rating, and Current Draw must be greater than zero');
                return;
            }

            const maxCurrent = (cap / 1000) * c;
            const capUsed = cap * 0.8;
            const flightTimeMin = (capUsed / 1000) / draw * 60;
            const flightTimeSec = flightTimeMin * 60;

            const mins = Math.floor(flightTimeMin);
            const secs = Math.round((flightTimeMin - mins) * 60);

            document.getElementById('ft-time').textContent = `${mins}m ${secs}s (${flightTimeMin.toFixed(1)} min)`;
            document.getElementById('ft-max-current').textContent = maxCurrent.toFixed(1) + ' A';
            document.getElementById('ft-cap-used').textContent = capUsed.toFixed(0) + ' mAh (80%)';

            document.getElementById('ft-results').style.display = 'block';
        });
    }

    // ============================================
    // THREE.JS 3D GLOBE
    // ============================================
    const globeCanvas = document.getElementById('globe-canvas');
    const globeFallback = document.getElementById('globe-fallback');

    function initGlobe() {
        if (globeCanvas && typeof THREE !== 'undefined') {
            try {
                const testRenderer = new THREE.WebGLRenderer({ canvas: globeCanvas, alpha: true });
                testRenderer.dispose();
                buildGlobe();
                return;
            } catch (e) {
            }
        }
        if (globeFallback) {
            globeFallback.style.display = 'block';
            if (globeCanvas) globeCanvas.style.display = 'none';
        }
    }

    function buildGlobe() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.z = 3;

        const renderer = new THREE.WebGLRenderer({
            canvas: globeCanvas,
            alpha: true,
            antialias: true
        });

        function resizeGlobe() {
            const w = globeCanvas.clientWidth;
            const h = globeCanvas.clientHeight;
            if (globeCanvas.width !== w || globeCanvas.height !== h) {
                renderer.setSize(w, h, false);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            }
        }

        const AMBER = 0xFF9F1C;
        const AMBER_DIM = 0x4a3a10;

        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        // Wireframe sphere
        const globeGeo = new THREE.SphereGeometry(1, 32, 24);
        const globeWire = new THREE.WireframeGeometry(globeGeo);
        const globeLine = new THREE.LineSegments(globeWire, new THREE.LineBasicMaterial({
            color: AMBER,
            transparent: true,
            opacity: 0.15
        }));
        globeGroup.add(globeLine);

        // Latitude lines
        for (let lat = -60; lat <= 60; lat += 30) {
            const phi = (90 - lat) * Math.PI / 180;
            const r = Math.sin(phi);
            const y = Math.cos(phi);
            const points = [];
            for (let i = 0; i <= 64; i++) {
                const theta = (i / 64) * Math.PI * 2;
                points.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
            }
            const geo = new THREE.BufferGeometry().setFromPoints(points);
            globeGroup.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
                color: AMBER, transparent: true, opacity: 0.25
            })));
        }

        // Longitude lines
        for (let lon = 0; lon < 360; lon += 30) {
            const points = [];
            for (let i = 0; i <= 64; i++) {
                const phi = (i / 64) * Math.PI;
                const theta = lon * Math.PI / 180;
                points.push(new THREE.Vector3(
                    Math.sin(phi) * Math.cos(theta),
                    Math.cos(phi),
                    Math.sin(phi) * Math.sin(theta)
                ));
            }
            const geo = new THREE.BufferGeometry().setFromPoints(points);
            globeGroup.add(new THREE.Line(geo, new THREE.LineBasicMaterial({
                color: AMBER, transparent: true, opacity: 0.25
            })));
        }

        // Operation points
        const operations = [
            { name: 'Kyiv', lat: 50.45, lon: 30.52 },
            { name: 'London', lat: 51.51, lon: -0.13 },
            { name: 'Warsaw', lat: 52.23, lon: 21.01 },
            { name: 'Berlin', lat: 52.52, lon: 13.41 },
            { name: 'New York', lat: 40.71, lon: -74.01 },
            { name: 'Tokyo', lat: 35.68, lon: 139.69 },
            { name: 'Dubai', lat: 25.20, lon: 55.27 },
            { name: 'Singapore', lat: 1.35, lon: 103.82 },
        ];

        const pointGeo = new THREE.SphereGeometry(0.02, 8, 8);
        const pointMat = new THREE.MeshBasicMaterial({ color: AMBER });
        const pointPositions = [];

        operations.forEach(op => {
            const phi = (90 - op.lat) * Math.PI / 180;
            const theta = (op.lon + 180) * Math.PI / 180;
            const x = -1.02 * Math.sin(phi) * Math.cos(theta);
            const y = 1.02 * Math.cos(phi);
            const z = 1.02 * Math.sin(phi) * Math.sin(theta);

            const point = new THREE.Mesh(pointGeo, pointMat);
            point.position.set(x, y, z);
            globeGroup.add(point);
            pointPositions.push(new THREE.Vector3(x, y, z));
        });

        // Connection lines (mesh network)
        const lineMat = new THREE.LineBasicMaterial({
            color: AMBER,
            transparent: true,
            opacity: 0.35
        });

        const connections = [
            [0, 1], [0, 2], [0, 3], [0, 6],
            [1, 3], [2, 3], [3, 4],
            [4, 5], [5, 7], [6, 7],
            [1, 6], [0, 4]
        ];

        connections.forEach(([a, b]) => {
            const start = pointPositions[a];
            const end = pointPositions[b];
            const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            mid.normalize().multiplyScalar(1.2);

            const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
            const points = curve.getPoints(32);
            const geo = new THREE.BufferGeometry().setFromPoints(points);
            globeGroup.add(new THREE.Line(geo, lineMat));
        });

        // Mouse parallax
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function animate() {
            requestAnimationFrame(animate);
            resizeGlobe();

            globeGroup.rotation.y += 0.002;
            globeGroup.rotation.x = mouseY * 0.15;
            globeGroup.rotation.z = mouseX * 0.05;

            renderer.render(scene, camera);
        }

        window.addEventListener('resize', resizeGlobe);
        resizeGlobe();
        animate();
    }

    if (typeof THREE !== 'undefined') {
        initGlobe();
    } else {
        const threeCheck = setInterval(() => {
            if (typeof THREE !== 'undefined') {
                clearInterval(threeCheck);
                initGlobe();
            }
        }, 100);
        setTimeout(() => clearInterval(threeCheck), 5000);
        if (globeFallback) {
            globeFallback.style.display = 'block';
            if (globeCanvas) globeCanvas.style.display = 'none';
        }
    }

    // ============================================
    // I18N — LANGUAGE SWITCHER
    // ============================================
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = localStorage.getItem('portfolio-lang') || 'ua';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('portfolio-lang', lang);

        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        document.querySelectorAll('[data-ua][data-en]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                el.textContent = text;
            }
        });

        document.documentElement.lang = lang === 'ua' ? 'uk' : 'en';
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });

    setLanguage(currentLang);

    // ============================================
    // EXISTING: Smooth scroll markers
    // ============================================
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const marker = item.querySelector('.nav-marker');
            if (marker) {
                marker.style.opacity = '1';
                setTimeout(() => {
                    if (!item.matches(':hover')) {
                        marker.style.opacity = '0';
                    }
                }, 1000);
            }
        });
    });

    // ============================================
    // EXISTING: Random status changes
    // ============================================
    const statusText = document.querySelector('.status-text');
    setInterval(() => {
        const states = ['ONLINE', 'ENCRYPTED', 'SYNCING', 'SCANNING'];
        if (Math.random() > 0.8) {
            const original = statusText.textContent;
            statusText.textContent = states[Math.floor(Math.random() * states.length)];
            setTimeout(() => {
                statusText.textContent = original;
            }, 1000);
        }
    }, 5000);

    // ============================================
    // EXISTING: Scroll reveal animations
    // ============================================
    const revealTargets = document.querySelectorAll('.project-card, .stat-box, .briefing-box, .stack-module, .impact-metric, .timeline-item, .status-card, .calc-box');
    revealTargets.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealTargets.forEach(el => revealObserver.observe(el));

    // ============================================
    // EXISTING: Counter animation
    // ============================================
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const duration = 1500;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(eased * target);
                    el.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ============================================
    // EXISTING: Mobile hamburger menu
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileOverlay = document.querySelector('.mobile-overlay');

    if (hamburger && mobileNav) {
        function toggleMenu() {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('open');
            if (mobileOverlay) mobileOverlay.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        }

        hamburger.addEventListener('click', toggleMenu);
        if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMenu);

        mobileNav.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (mobileNav.classList.contains('open')) toggleMenu();
            });
        });
    }

    // ============================================
    // EXISTING: Canvas Particle System
    // ============================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        const PARTICLE_COUNT = 80;
        const CONNECTION_DISTANCE = 150;
        const MOUSE_RADIUS = 120;
        const PARTICLE_COLOR = '255, 159, 28';
        const BASE_SPEED = 0.3;

        function resizeCanvas() {
            const hero = canvas.parentElement;
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * BASE_SPEED,
                    vy: (Math.random() - 0.5) * BASE_SPEED,
                    radius: Math.random() * 2 + 1
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MOUSE_RADIUS) {
                        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                        p.vx += (dx / dist) * force * 0.5;
                        p.vy += (dy / dist) * force * 0.5;
                    }
                }

                p.vx *= 0.98;
                p.vy *= 0.98;

                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > 2) {
                    p.vx = (p.vx / speed) * 2;
                    p.vy = (p.vy / speed) * 2;
                }

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${PARTICLE_COLOR}, 0.8)`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DISTANCE) {
                        const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.4;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(drawParticles);
        }

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });

        resizeCanvas();
        createParticles();
        drawParticles();
    }

    // ============================================
    // PHASE 4: VAE TRAJECTORY VISUALIZER
    // ============================================
    const vaeCanvas = document.getElementById('vae-canvas');
    if (vaeCanvas) {
        const vaeCtx = vaeCanvas.getContext('2d');
        let vaeAnimId;
        let vaeSpeed = 1;
        let vaeShowCone = true;
        let vaeT = 0; // trajectory progress (0..1)

        // Parabolic trajectory parameters
        const traj = {
            startX: 0.08, startY: 0.75,
            endX: 0.92, endY: 0.25,
            peakY: 0.12,
        };

        // Obstacle position (normalized)
        const obstacle = { x: 0.55, y: 0.45, radius: 0.04 };

        function resizeVaeCanvas() {
            const container = vaeCanvas.parentElement;
            vaeCanvas.width = container.clientWidth * window.devicePixelRatio;
            vaeCanvas.height = container.clientHeight * window.devicePixelRatio;
            vaeCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        // Calculate point on parabolic trajectory at progress t
        function trajPoint(t) {
            const x = traj.startX + (traj.endX - traj.startX) * t;
            // Quadratic bezier for parabola
            const midX = (traj.startX + traj.endX) / 2;
            const midY = traj.peakY;
            const x1 = traj.startX, y1 = traj.startY;
            const x2 = traj.endX, y2 = traj.endY;
            const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
            const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;
            return { x: px, y: py };
        }

        // Calculate cone width at progress t (wider = more uncertain)
        function coneWidth(t) {
            // Uncertainty grows with distance traveled
            return 0.02 + t * 0.06;
        }

        function drawVaeScene() {
            const w = vaeCanvas.width / window.devicePixelRatio;
            const h = vaeCanvas.height / window.devicePixelRatio;

            vaeCtx.clearRect(0, 0, w, h);

            // Background grid
            vaeCtx.strokeStyle = 'rgba(42, 46, 56, 0.3)';
            vaeCtx.lineWidth = 0.5;
            const gridSize = 40;
            for (let x = 0; x < w; x += gridSize) {
                vaeCtx.beginPath();
                vaeCtx.moveTo(x, 0);
                vaeCtx.lineTo(x, h);
                vaeCtx.stroke();
            }
            for (let y = 0; y < h; y += gridSize) {
                vaeCtx.beginPath();
                vaeCtx.moveTo(0, y);
                vaeCtx.lineTo(w, y);
                vaeCtx.stroke();
            }

            const cw = w; // canvas width in CSS pixels
            const ch = h; // canvas height in CSS pixels

            // Draw obstacle
            const ox = obstacle.x * cw;
            const oy = obstacle.y * ch;
            const or = obstacle.radius * cw;

            vaeCtx.strokeStyle = 'rgba(244, 67, 54, 0.5)';
            vaeCtx.lineWidth = 1;
            vaeCtx.setLineDash([4, 4]);
            vaeCtx.beginPath();
            vaeCtx.arc(ox, oy, or, 0, Math.PI * 2);
            vaeCtx.stroke();
            vaeCtx.setLineDash([]);

            // Obstacle label
            vaeCtx.fillStyle = 'rgba(244, 67, 54, 0.6)';
            vaeCtx.font = '10px "JetBrains Mono", monospace';
            vaeCtx.fillText('OBSTACLE', ox + or + 5, oy + 3);

            // Draw uncertainty cone
            if (vaeShowCone) {
                const drone = trajPoint(vaeT);
                const dx = drone.x * cw;
                const dy = drone.y * ch;

                // Cone from drone position towards end
                const steps = 30;
                vaeCtx.beginPath();
                // Upper boundary
                for (let i = 0; i <= steps; i++) {
                    const st = vaeT + (1 - vaeT) * (i / steps);
                    const pt = trajPoint(st);
                    const halfW = coneWidth(st) * ch * 0.5;
                    if (i === 0) {
                        vaeCtx.moveTo(pt.x * cw, pt.y * ch - halfW);
                    } else {
                        vaeCtx.lineTo(pt.x * cw, pt.y * ch - halfW);
                    }
                }
                // Lower boundary (reverse)
                for (let i = steps; i >= 0; i--) {
                    const st = vaeT + (1 - vaeT) * (i / steps);
                    const pt = trajPoint(st);
                    const halfW = coneWidth(st) * ch * 0.5;
                    vaeCtx.lineTo(pt.x * cw, pt.y * ch + halfW);
                }
                vaeCtx.closePath();
                vaeCtx.fillStyle = 'rgba(244, 67, 54, 0.06)';
                vaeCtx.fill();
                vaeCtx.strokeStyle = 'rgba(244, 67, 54, 0.25)';
                vaeCtx.lineWidth = 1;
                vaeCtx.setLineDash([3, 3]);
                vaeCtx.stroke();
                vaeCtx.setLineDash([]);
            }

            // Draw trajectory line
            vaeCtx.beginPath();
            vaeCtx.strokeStyle = 'rgba(76, 175, 80, 0.8)';
            vaeCtx.lineWidth = 2;
            vaeCtx.shadowColor = 'rgba(76, 175, 80, 0.5)';
            vaeCtx.shadowBlur = 6;
            const totalSteps = 200;
            for (let i = 0; i <= totalSteps; i++) {
                const st = i / totalSteps;
                const pt = trajPoint(st);
                if (i === 0) {
                    vaeCtx.moveTo(pt.x * cw, pt.y * ch);
                } else {
                    vaeCtx.lineTo(pt.x * cw, pt.y * ch);
                }
            }
            vaeCtx.stroke();
            vaeCtx.shadowBlur = 0;

            // Draw drone position
            const drone = trajPoint(vaeT);
            const droneX = drone.x * cw;
            const droneY = drone.y * ch;

            // Drone glow
            vaeCtx.beginPath();
            vaeCtx.arc(droneX, droneY, 12, 0, Math.PI * 2);
            vaeCtx.fillStyle = 'rgba(255, 159, 28, 0.1)';
            vaeCtx.fill();

            // Drone dot
            vaeCtx.beginPath();
            vaeCtx.arc(droneX, droneY, 5, 0, Math.PI * 2);
            vaeCtx.fillStyle = '#FF9F1C';
            vaeCtx.shadowColor = '#FF9F1C';
            vaeCtx.shadowBlur = 10;
            vaeCtx.fill();
            vaeCtx.shadowBlur = 0;

            // Drone label
            vaeCtx.fillStyle = '#FF9F1C';
            vaeCtx.font = 'bold 10px "JetBrains Mono", monospace';
            vaeCtx.fillText('DRONE', droneX + 10, droneY - 8);

            // Telemetry readout
            const alt = (1 - drone.y) * 100;
            const spd = (12 + Math.sin(vaeT * Math.PI) * 8).toFixed(1);
            vaeCtx.fillStyle = 'rgba(255, 159, 28, 0.6)';
            vaeCtx.font = '9px "JetBrains Mono", monospace';
            vaeCtx.fillText(`ALT: ${alt.toFixed(1)}m  SPD: ${spd}m/s  T+${(vaeT * 12).toFixed(1)}s`, 10, ch - 10);

            // Update HUD elements
            const horizonEl = document.getElementById('hud-horizon');
            const collisionEl = document.getElementById('hud-collision');
            const obstacleEl = document.getElementById('hud-obstacle');
            if (horizonEl) horizonEl.textContent = ((1 - vaeT) * 2).toFixed(1) + 's';
            if (collisionEl) {
                const collProb = (0.01 + vaeT * 0.05 + Math.sin(vaeT * 10) * 0.02).toFixed(2);
                collisionEl.textContent = collProb + '%';
                collisionEl.className = 'hud-value ' + (parseFloat(collProb) > 0.05 ? 'hud-warn' : 'hud-ok');
            }
            if (obstacleEl) {
                const dist = Math.sqrt(
                    Math.pow((drone.x - obstacle.x) * cw, 2) +
                    Math.pow((drone.y - obstacle.y) * ch, 2)
                ) * 0.5;
                obstacleEl.textContent = dist.toFixed(1) + 'm';
                obstacleEl.className = 'hud-value ' + (dist < 20 ? 'hud-warn' : 'hud-ok');
            }
        }

        function animateVae() {
            vaeT += 0.002 * vaeSpeed;
            if (vaeT > 1) vaeT = 0; // loop
            drawVaeScene();
            vaeAnimId = requestAnimationFrame(animateVae);
        }

        // VAE controls
        const vaeResetBtn = document.getElementById('vae-reset');
        const vaeSpeedBtn = document.getElementById('vae-speed');
        const vaeConeBtn = document.getElementById('vae-toggle-cone');

        if (vaeResetBtn) {
            vaeResetBtn.addEventListener('click', () => {
                vaeT = 0;
            });
        }

        if (vaeSpeedBtn) {
            vaeSpeedBtn.addEventListener('click', () => {
                const speeds = [1, 2, 4, 0.5];
                const idx = speeds.indexOf(vaeSpeed);
                vaeSpeed = speeds[(idx + 1) % speeds.length];
                vaeSpeedBtn.textContent = `> SPEED: ${vaeSpeed}x`;
            });
        }

        if (vaeConeBtn) {
            vaeConeBtn.addEventListener('click', () => {
                vaeShowCone = !vaeShowCone;
                vaeConeBtn.textContent = `> CONE: ${vaeShowCone ? 'ON' : 'OFF'}`;
            });
        }

        // Init
        const vaeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    resizeVaeCanvas();
                    animateVae();
                    vaeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        vaeObserver.observe(vaeCanvas.parentElement);

        window.addEventListener('resize', () => {
            if (vaeCanvas.parentElement) {
                vaeCtx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
                resizeVaeCanvas();
            }
        });
    }

    // ============================================
    // PHASE 4: CHAT WIDGET (VIKA AI ASSISTANT)
    // ============================================
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    // Pre-defined tactical responses for demo mode
    const vikaResponses = {
        help: [
            'Доступные команды: help, about, projects, status, contact, time, clear, vae, offline',
            'Available commands: help, about, projects, status, contact, time, clear, vae, offline',
        ],
        about: [
            'UNIT: BAS — ArduPilot Systems Engineer. 5+ years experience. 70+ repos. Active ZSU service. Core: PID tuning, SITL, MAVLink, Python, C++.',
        ],
        projects: [
            'MISSION LOG: [01] GRIM-FPV-AI [02] GRIM WORLD MODEL [03] TACTICAL MESH [04] GSM SECURITY [05] TACTICAL FIBER [06] STRATEGIC INTEL AI',
        ],
        status: [
            '[OK] vika_ok — ONLINE [6 LLM providers]\n[OK] grim-fpv-ai — DEPLOYED\n[OK] portfolio — LIVE\n[!!] grim-world-model — TRAINING',
        ],
        contact: [
            'SECURE CHANNELS: [CH-001] SIGNAL — Encrypted | [CH-002] GITHUB — /Redrock453\nNavigate to #contact section for direct links.',
        ],
        time: [
            () => `UTC: ${new Date().toUTCString()}\nUnix: ${Math.floor(Date.now() / 1000)}`,
        ],
        vae: [
            'VAE Trajectory Visualizer активирован. Прокрутите вниз до секции #vae-demo для просмотра predictive collision avoidance.',
        ],
        offline: [
            'Offline support: Service Worker registered. Cache-First strategy active. System ready for disconnected operations.',
        ],
        clear: ['__CLEAR__'],
    };

    // Fallback responses for unrecognized input
    const fallbackResponses = [
        'Affirmative. Запрос обработан. [DEMO MODE — подключитесь через Termux для полного доступа.]',
        'Система Vika_OK работает в локальном режиме. Запрос записан в лог. [DEMO MODE]',
        'Команда принята. Бэкенд недоступен в демо-режиме. Разверните Vika_Ok на сервере для полной функциональности.',
        'Roger that. Ответ сгенерирован локально. Для AI-маршрутизации через 6 LLM провайдеров — см. репозиторий vika_ok.',
        'Copy. Это демо-режим чата. Полная версия доступна по адресу: github.com/Redrock453/vika_ok',
    ];

    function getVikaResponse(input) {
        const cmd = input.trim().toLowerCase();
        if (vikaResponses[cmd]) {
            const resp = vikaResponses[cmd];
            const chosen = resp[Math.floor(Math.random() * resp.length)];
            return typeof chosen === 'function' ? chosen() : chosen;
        }
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    function addChatMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        msgDiv.innerHTML = `
            <div class="chat-msg-header">
                <span class="chat-msg-sender">${sender === 'bot' ? 'VIKA' : 'YOU'}</span>
                <span class="chat-msg-time">${timeStr}</span>
            </div>
            <div class="chat-msg-body">${text.replace(/\n/g, '<br>')}</div>
        `;

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-typing';
        typingDiv.id = 'chat-typing-indicator';
        typingDiv.innerHTML = `
            <span>VIKA is typing</span>
            <span class="typing-dots"><span></span><span></span><span></span></span>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTyping() {
        const indicator = document.getElementById('chat-typing-indicator');
        if (indicator) indicator.remove();
    }

    function handleChatSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        addChatMessage(text, 'user');
        chatInput.value = '';

        // Handle clear command immediately
        if (text.toLowerCase() === 'clear') {
            chatMessages.innerHTML = '';
            addChatMessage('Terminal cleared. Vika_OK ready.', 'bot');
            return;
        }

        // Show typing indicator
        showTyping();

        // Simulate response delay (1-2 seconds)
        const delay = 1000 + Math.random() * 1000;
        setTimeout(() => {
            removeTyping();
            const response = getVikaResponse(text);
            addChatMessage(response, 'bot');
        }, delay);
    }

    if (chatToggle && chatWindow) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open') && chatInput) {
                setTimeout(() => chatInput.focus(), 100);
            }
        });
    }

    if (chatClose && chatWindow) {
        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('open');
        });
    }

    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleChatSend();
            }
        });
    }

    if (chatSend) {
        chatSend.addEventListener('click', handleChatSend);
    }

    // ============================================
    // PHASE 4: SERVICE WORKER REGISTRATION
    // ============================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((reg) => {
                    console.log('[SW] Registered. Scope:', reg.scope);
                    // Show offline-ready notification via terminal
                    if (terminalBody) {
                        const line = document.createElement('div');
                        line.className = 'terminal-line';
                        line.innerHTML = '<span class="prompt">></span> <span class="green">[SW] System Ready for Offline Ops</span>';
                        terminalBody.appendChild(line);
                        terminalBody.scrollTop = terminalBody.scrollHeight;
                    }
                })
                .catch((err) => {
                    console.warn('[SW] Registration failed:', err);
                });
        });
    }

    // ============================================
    // PHASE 4: LOCAL VISITOR COUNTER
    // ============================================
    let visitCount = parseInt(localStorage.getItem('portfolio-visits') || '0', 10);
    visitCount++;
    localStorage.setItem('portfolio-visits', visitCount.toString());

    // Show visitor number in footer
    const footerStatus = document.querySelector('.footer-status');
    if (footerStatus) {
        const counterSpan = document.createElement('span');
        counterSpan.className = 'visitor-counter';
        counterSpan.textContent = `VISITOR #${visitCount}`;
        footerStatus.appendChild(counterSpan);
    }
});
