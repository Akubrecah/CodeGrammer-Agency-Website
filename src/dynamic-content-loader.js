import { supabase } from './supabase-client.js';

// Load sliders from Supabase
async function loadSliders() {
    const container = document.querySelector('.hero-slide .swiper-wrapper');
    if (!container) return;

    try {
        const { data: sliders, error } = await supabase
            .from('sliders')
            .select('*')
            .order('serial_number', { ascending: true });

        if (error) throw error;
        if (!sliders || sliders.length === 0) return;

        // Clear existing slides
        container.innerHTML = '';

        sliders.forEach((slide, index) => {
            const slideHtml = `
                <div class="swiper-slide">
                    <section class="hero-area">
                        <div id="particles-js-${index + 1}" class="particles-cls"></div>
                        <div class="hero-wrapper">
                            <div class="container">
                                <div class="row align-items-center">
                                    <div class="col-lg-6">
                                        <div class="hero-content layout2">
                                            <h1>${slide.title}
                                                <span>${slide.subtitle}</span>
                                            </h1>
                                            <p>${slide.description}</p>
                                            <div class="buttons">
                                                <div class="cmn-btn">
                                                    <div class="line-1"></div>
                                                    <div class="line-2"></div>
                                                    <a href="${slide.button_link || '#'}">${slide.button_text || 'Learn More'}</a>
                                                </div>
                                                <div class="cmn-btn layout-two">
                                                    <div class="line-1"></div>
                                                    <div class="line-2"></div>
                                                    <a href="/projects/">Projects</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="hero-img">
                                            <img src="${slide.image}" class="slider_img" alt="${slide.title}">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', slideHtml);
        });

        // Reinitialize Swiper if available
        if (window.Swiper) {
            new Swiper('.hero-slide', {
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                autoplay: {
                    delay: 5000,
                },
            });
        }

    } catch (err) {
        console.error('Error loading sliders:', err);
    }
}

// Load fun facts from Supabase
async function loadFunFacts() {
    const container = document.getElementById('fun-facts-container');
    if (!container) return;

    try {
        const { data: funFacts, error } = await supabase
            .from('fun_facts')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        if (!funFacts || funFacts.length === 0) return;

        // Clear existing fun facts
        container.innerHTML = '';

        funFacts.forEach(fact => {
            const factHtml = `
                <div class="col-md-6 col-lg-3 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
                    <div class="single-feature">
                        <div class="feature-inner">
                            <div class="icon">
                                <i class="${fact.icon} service-ico"></i>
                            </div>
                            <span class="counter" data-target="${fact.count}">0</span>
                            <sup>+</sup>
                            <h4>${fact.title}</h4>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', factHtml);
        });

        // Reinitialize counters
        initCounters();

    } catch (err) {
        console.error('Error loading fun facts:', err);
    }
}

// Load projects from Supabase
async function loadProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(6);

        if (error) throw error;
        if (!projects || projects.length === 0) return;

        container.innerHTML = '';

        projects.forEach(project => {
            const categoryClass = (project.category || 'all').toLowerCase().replace(/[^a-z0-9]/g, '-');
            const projectHtml = `
                <div class="col-md-6 col-lg-4 single-item ${categoryClass}">
                    <div class="item-img">
                        <a href="${project.link || '/projects/'}">
                            <img src="${project.image || '/assets/images/projects/project-1.webp'}" alt="${project.title}">
                        </a>
                    </div>
                    <div class="item-inner-cnt">
                        <span>${project.category || 'Project'}</span>
                        <h4>${project.title}</h4>
                        <div class="view-btn">
                            <a href="${project.link || '/projects/'}">View Details</a>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', projectHtml);
        });

    } catch (err) {
        console.error('Error loading projects:', err);
    }
}

// Load clients from Supabase
async function loadClients() {
    const container = document.getElementById('clients-container');
    if (!container) return;

    try {
        const { data: clients, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        if (!clients || clients.length === 0) return;

        container.innerHTML = '';

        clients.forEach(client => {
            const clientHtml = `
                <div class="swiper-slide">
                    <div class="single-partner">
                        <img src="${client.image || '/assets/images/partner.png'}" alt="${client.name || 'partner'}">
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', clientHtml);
        });

        // Reinitialize Swiper for partners
        if (window.Swiper) {
            new Swiper('.partner-slider', {
                slidesPerView: 5,
                spaceBetween: 30,
                loop: true,
                speed: 1000,
                autoplay: { delay: 2000, disableOnInteraction: false },
                navigation: {
                    nextEl: '.swiper-button-next-c',
                    prevEl: '.swiper-button-prev-c',
                },
                breakpoints: {
                    320: { slidesPerView: 2 },
                    576: { slidesPerView: 3 },
                    992: { slidesPerView: 4 },
                    1200: { slidesPerView: 5 }
                }
            });
        }

    } catch (err) {
        console.error('Error loading clients:', err);
    }
}

// Load testimonials from Supabase (matching exact HTML structure)
async function loadTestimonials() {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    try {
        const { data: testimonials, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        if (!testimonials || testimonials.length === 0) return;

        container.innerHTML = '';

        testimonials.forEach(testimonial => {
            const rating = testimonial.rating || 5;
            let starsHtml = '';
            for (let i = 0; i < rating; i++) {
                starsHtml += '<a href="#"><i class="fas fa-star"></i></a>';
            }
            
            const testimonialHtml = `
                <div class="swiper-slide">
                    <div class="single-testimonial">
                        <div class="quote">
                            <i class="fas fa-quote-right"></i>
                        </div>
                        <h5>${testimonial.name}</h5>
                        <span>${testimonial.role || 'Customer'}</span>
                        <div class="stars">
                            ${starsHtml}
                        </div>
                        <p>${testimonial.review}</p>
                        <div class="reviewer">
                            <img src="${testimonial.image || 'https://agency.thecodegrammer.net/media/Testimonials/reivewer.jpg'}" alt="reviewer">
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', testimonialHtml);
        });

        // Reinitialize Swiper for testimonials
        if (window.Swiper) {
            new Swiper('.testimonial-slider', {
                slidesPerView: 2,
                spaceBetween: 30,
                loop: true,
                speed: 1000,
                autoplay: { delay: 4000, disableOnInteraction: false },
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    320: { slidesPerView: 1 },
                    992: { slidesPerView: 2 }
                }
            });
        }

    } catch (err) {
        console.error('Error loading testimonials:', err);
    }
}

// Load team members from Supabase (matching exact HTML structure)
async function loadTeam() {
    const container = document.getElementById('team-container');
    if (!container) return;

    try {
        const { data: team, error } = await supabase
            .from('team_members')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        if (!team || team.length === 0) return;

        container.innerHTML = '';

        team.forEach(member => {
            const memberHtml = `
                <div class="swiper-slide wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
                    <div class="single-team layout2">
                        <div class="member-img">
                            <img src="${member.image || 'https://agency.thecodegrammer.net/media/Teams/team-1.jpg'}" alt="${member.name}">
                            <svg width="185" height="299" viewBox="0 0 167 269" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.25412 0.814453C1.68125 2.62384 0 5.61553 0 8.99991V269H167C167 269 47 269 66.5 112.171C75.5581 39.3209 20.2679 8.22409 4.25412 0.814453Z" fill="#191A1C" />
                            </svg>
                            <ul class="team-social">
                                ${member.instagram ? `<li><a href="${member.instagram}"><i class="fab fa-instagram"></i></a></li>` : '<li><a href="#"><i class="fab fa-instagram"></i></a></li>'}
                                ${member.facebook ? `<li><a href="${member.facebook}"><i class="fab fa-facebook-f"></i></a></li>` : '<li><a href="#"><i class="fab fa-facebook-f"></i></a></li>'}
                                ${member.linkedin ? `<li><a href="${member.linkedin}"><i class="fab fa-linkedin"></i></a></li>` : '<li><a href="#"><i class="fab fa-linkedin"></i></a></li>'}
                                ${member.twitter ? `<li><a href="${member.twitter}"><i class="fab fa-whatsapp"></i></a></li>` : '<li><a href="#"><i class="fab fa-whatsapp"></i></a></li>'}
                            </ul>
                        </div>
                        <div class="team-inner">
                            <h4>${member.name}</h4>
                            <span>${member.role || 'Team Member'}</span>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', memberHtml);
        });

        // Reinitialize Swiper for team
        if (window.Swiper) {
            new Swiper('.team-slider', {
                slidesPerView: 4,
                spaceBetween: 30,
                loop: true,
                speed: 1000,
                autoplay: { delay: 3000, disableOnInteraction: false },
                breakpoints: {
                    320: { slidesPerView: 1 },
                    576: { slidesPerView: 2 },
                    992: { slidesPerView: 3 },
                    1200: { slidesPerView: 4 }
                }
            });
        }

    } catch (err) {
        console.error('Error loading team:', err);
    }
}

// Load pricing plans from Supabase
async function loadPricing() {
    const container = document.getElementById('pricing-container');
    if (!container) return;

    try {
        const { data: plans, error } = await supabase
            .from('pricing_plans')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        if (!plans || plans.length === 0) return;

        container.innerHTML = '';

        plans.forEach(plan => {
            const features = (plan.features || '').split('\n').filter(f => f.trim());
            const featuresHtml = features.map(f => `<li>${f}</li>`).join('');
            const isFeatured = plan.is_featured;
            
            const planHtml = `
                <div class="col-md-6 col-lg-4 wow animate fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
                    <div class="price-box layout2 ${isFeatured ? 'tcg-price-box premium-pricing' : ''}">
                        ${isFeatured ? `<div class="plan-ribbon-wrapper"><div class="plan-ribbon">Popular</div></div>` : ''}
                        <h3>${plan.title}</h3>
                        <span>${plan.duration || 'Monthly'}</span>
                        <strong>$ ${plan.price}</strong>
                        <div class="item-list">
                            <ul>${featuresHtml}</ul>
                        </div>
                        <div class="price-btn">
                            <div class="line-1"></div>
                            <div class="line-2"></div>
                            <a href="${plan.button_link || '#'}">${plan.button_text || 'PAY NOW'}</a>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', planHtml);
        });

    } catch (err) {
        console.error('Error loading pricing:', err);
    }
}

// Counter animation function
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(counter, target) {
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        counter.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            counter.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Load all dynamic content from Supabase
    loadSliders();
    loadFunFacts();
    loadProjects();
    loadClients();
    loadTestimonials();
    loadTeam();
    loadPricing();
});

export { loadSliders, loadFunFacts, loadProjects, loadClients, loadTestimonials, loadTeam, loadPricing };
