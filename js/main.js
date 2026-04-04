document.addEventListener('DOMContentLoaded', () => {
    // Typing Effect Logic
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach(element => {
        const text = element.getAttribute('data-text');
        let index = 0;
        
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, 50);
            }
        }
        
        type();
    });

    // Smooth scroll markers
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

    // Random status changes to simulate live system
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

    // Scroll reveal animations via Intersection Observer
    const revealTargets = document.querySelectorAll('.project-card, .stat-box, .briefing-box, .stack-module');
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

    // Mobile hamburger menu
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
});
