/**
 * Minimal Interactions (Header Scroll) - Animations Removed
 * 
 * Per user request to "remove all animated images" and generic animations.
 * Only essential UI interactions (sticky header) remain.
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Navbar transparency on scroll
    const header = document.querySelector('.header-area');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    console.log('Animations disabled. UI is static.');
});

// Essential Styles 
const style = document.createElement('style');
style.textContent = `
    .header-area.scrolled {
        background-color: rgba(25, 26, 28, 0.95) !important;
        backdrop-filter: blur(10px);
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    }
    
    /* Ensure elements are visible if any CSS hid them awaiting animation */
    [data-wow-delay], .wow {
        visibility: visible !important;
        opacity: 1 !important;
        animation: none !important;
    }
`;
document.head.appendChild(style);
