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
});
