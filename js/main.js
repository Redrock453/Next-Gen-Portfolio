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
});
