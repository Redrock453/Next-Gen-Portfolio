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
    // Smooth scroll markers
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
    // Random status changes
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
    // Scroll reveal animations
    // ============================================
    const revealTargets = document.querySelectorAll('.project-card, .stat-box, .briefing-box, .stack-module, .impact-metric, .timeline-item, .status-card');
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
    // Counter animation
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
    // Mobile hamburger menu
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
    // Auto-update sync date in footer
    // ============================================
    const syncDateEl = document.getElementById('sync-date');
    if (syncDateEl) {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        syncDateEl.textContent = `${y}.${m}.${d}`;
    }
});
