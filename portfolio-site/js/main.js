// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Header background on scroll
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.background = 'rgba(18, 20, 24, 0.98)';
    } else {
        header.style.background = 'rgba(18, 20, 24, 0.95)';
    }
});

// Terminal typing effect
const terminalLines = document.querySelectorAll('.typing-text');
terminalLines.forEach(line => {
    const text = line.getAttribute('data-text');
    line.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            line.textContent += text.charAt(i);
            i++;
            setTimeout(type, 30);
        }
    }
    
    setTimeout(type, 500);
});

// Console
console.log('%c⚡ UNIT: BAS // TACTICAL OPERATIONS', 'font-size: 16px; color: #FF9F1C; font-weight: bold;');
console.log('%c// READY FOR DEPLOYMENT', 'color: #4F6D55;');
