/**
 * Scroll Trigger Animations
 * Adds animation classes to elements when they enter the viewport
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const animation = el.dataset.animation || 'animate-fade-in-up';
                const delay = el.dataset.delay || '0';
                
                el.style.animationDelay = delay + 'ms';
                el.classList.add(animation);
                el.classList.add('animated');
                
                // Unobserve after animation
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animateOnScroll = [
        '.single-service',
        '.single-item',
        '.project-card',
        '.service-card',
        '.footer-widget',
        '.sidebar-widget',
        '.subscribe-cnt',
        '.subscribe-form',
        '.project-details-content',
        '.client-box',
        '.news-letter-content',
        '.sec-title',
        '.breadcrumb-cnt',
        '.cmpy-info',
        '.project-slider',
        '.counter-single',
        '.testimonial-item',
        '.blog-card',
        '.pricing-card',
        '.team-member'
    ];

    // Add data attributes and observe
    animateOnScroll.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.style.opacity = '0';
            el.dataset.animation = 'animate-fade-in-up';
            el.dataset.delay = (index * 100).toString();
            animationObserver.observe(el);
        });
    });

    // Counter animation
    const counters = document.querySelectorAll('.counter, .count, [data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count || counter.textContent);
                let count = 0;
                const increment = target / 50;
                const updateCounter = () => {
                    if (count < target) {
                        count += increment;
                        counter.textContent = Math.ceil(count);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));

    // Parallax effect for elements with data-parallax
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Images load normally without animation effects
    // (removed fade-in animation for better performance)

    // Add hover effects to cards
    const cards = document.querySelectorAll('.single-service, .single-item, .sidebar-widget');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        });
    });

    // Ripple effect on buttons
    const buttons = document.querySelectorAll('.cmn-btn a, .subscribe-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add typewriter effect to hero text if present
    const heroText = document.querySelector('.hero-typewriter');
    if (heroText) {
        const text = heroText.textContent;
        heroText.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        typeWriter();
    }

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

    console.log('🎨 Animations initialized successfully!');
});

// Add ripple keyframe animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animated {
        opacity: 1 !important;
    }
    
    .header-area.scrolled {
        background-color: rgba(25, 26, 28, 0.95) !important;
        backdrop-filter: blur(10px);
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    }
`;
document.head.appendChild(style);
