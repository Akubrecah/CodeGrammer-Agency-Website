
import { supabase } from '../../../src/supabase-client.js';

// Settings keys mapping
const SETTINGS_KEYS = {
    seo: 'home_seo',
    services: 'home_services',
    about: 'home_about',
    funfact: 'home_funfact',
    projects: 'home_projects',
    clients: 'home_clients',
    pricing: 'home_pricing',
    testimonial: 'home_testimonial',
    team: 'home_team',
    blog: 'home_blog'
};

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed`;
    toast.style.cssText = 'bottom: 20px; right: 20px; z-index: 9999; min-width: 250px;';
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="ti ti-${type === 'success' ? 'check' : 'alert-circle'} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Load settings from Supabase
async function loadSettings() {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*');

        if (error) throw error;

        // Create a map for quick access
        const settingsMap = {};
        data.forEach(item => {
            settingsMap[item.key] = item.value;
        });

        // Populate forms
        populateForms(settingsMap);
        
    } catch (err) {
        console.error('Error loading settings:', err);
    }
}

// Populate form fields from settings
function populateForms(settingsMap) {
    // SEO Section
    if (settingsMap[SETTINGS_KEYS.seo]) {
        const seo = settingsMap[SETTINGS_KEYS.seo];
        setFieldValue('id_meta_title', seo.meta_title);
        setFieldValue('id_meta_description', seo.meta_description);
    }

    // Services Section
    if (settingsMap[SETTINGS_KEYS.services]) {
        const services = settingsMap[SETTINGS_KEYS.services];
        setFieldValue('id_service_title_small', services.title_small);
        setFieldValue('id_service_title_big', services.title_big);
        setFieldValue('id_service_card_more_text', services.service_card_more_text);
    }

    // About Section
    if (settingsMap[SETTINGS_KEYS.about]) {
        const about = settingsMap[SETTINGS_KEYS.about];
        setFieldValue('id_about_subtitle', about.subtitle);
        setFieldValue('id_about_title', about.title);
        setFieldValue('id_about_short_description', about.short_description);
        setFieldValue('id_about_tag_line', about.tag_line);
        setFieldValue('id_about_ranking_number', about.ranking_number);
        setFieldValue('id_about_experience', about.experience);
        setFieldValue('id_about_video_url', about.video_url);
        setFieldValue('id_about_long_description', about.long_description);
    }

    // Fun Fact Section
    if (settingsMap[SETTINGS_KEYS.funfact]) {
        const funfact = settingsMap[SETTINGS_KEYS.funfact];
        setFieldValue('id_funfact_title_small', funfact.title_small);
        setFieldValue('id_funfact_title_big', funfact.title_big);
    }

    // Projects Section
    if (settingsMap[SETTINGS_KEYS.projects]) {
        const projects = settingsMap[SETTINGS_KEYS.projects];
        setFieldValue('id_project_title_small', projects.title_small);
        setFieldValue('id_project_title_big', projects.title_big);
        setFieldValue('id_project_all_work_text', projects.all_work_text);
        setFieldValue('id_project_view_button_text', projects.view_button_text);
    }

    // Clients Section
    if (settingsMap[SETTINGS_KEYS.clients]) {
        const clients = settingsMap[SETTINGS_KEYS.clients];
        setFieldValue('id_client_title_small', clients.title_small);
        setFieldValue('id_client_title_big', clients.title_big);
    }

    // Pricing Section
    if (settingsMap[SETTINGS_KEYS.pricing]) {
        const pricing = settingsMap[SETTINGS_KEYS.pricing];
        setFieldValue('id_pricing_title_small', pricing.title_small);
        setFieldValue('id_pricing_title_big', pricing.title_big);
    }

    // Testimonial Section
    if (settingsMap[SETTINGS_KEYS.testimonial]) {
        const testimonial = settingsMap[SETTINGS_KEYS.testimonial];
        setFieldValue('id_testimonial_title_small', testimonial.title_small);
        setFieldValue('id_testimonial_title_big', testimonial.title_big);
    }

    // Team Section
    if (settingsMap[SETTINGS_KEYS.team]) {
        const team = settingsMap[SETTINGS_KEYS.team];
        setFieldValue('id_team_title_small', team.title_small);
        setFieldValue('id_team_title_big', team.title_big);
    }

    // Blog Section
    if (settingsMap[SETTINGS_KEYS.blog]) {
        const blog = settingsMap[SETTINGS_KEYS.blog];
        setFieldValue('id_blog_title_small', blog.title_small);
        setFieldValue('id_blog_title_big', blog.title_big);
    }
}

function setFieldValue(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined) {
        el.value = value;
    }
}

// Save settings to Supabase
async function saveSettings(key, data) {
    try {
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key, value: data, updated_at: new Date().toISOString() }, { onConflict: 'key' });

        if (error) throw error;
        
        showToast('Settings saved successfully!', 'success');
        return true;
    } catch (err) {
        console.error('Error saving settings:', err);
        showToast('Error saving settings: ' + err.message, 'danger');
        return false;
    }
}

// Initialize form handlers
function initFormHandlers() {
    // SEO Form
    const seoForm = document.getElementById('seo-form');
    if (seoForm) {
        seoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveSettings(SETTINGS_KEYS.seo, {
                meta_title: document.getElementById('id_meta_title')?.value,
                meta_description: document.getElementById('id_meta_description')?.value
            });
        });
    }

    // Services Form
    const servicesForm = document.getElementById('services-form');
    if (servicesForm) {
        servicesForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveSettings(SETTINGS_KEYS.services, {
                title_small: document.getElementById('id_service_title_small')?.value,
                title_big: document.getElementById('id_service_title_big')?.value,
                service_card_more_text: document.getElementById('id_service_card_more_text')?.value
            });
        });
    }

    // About Form
    const aboutForm = document.getElementById('about-form');
    if (aboutForm) {
        aboutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Handle image upload if any
            const imageInput = document.getElementById('id_about_image');
            let imageUrl = null;
            
            if (imageInput?.files?.[0]) {
                const file = imageInput.files[0];
                const fileName = `about_${Date.now()}.${file.name.split('.').pop()}`;
                const filePath = `site-assets/${fileName}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('site-assets')
                    .upload(filePath, file, { upsert: true });
                
                if (!uploadError) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('site-assets')
                        .getPublicUrl(filePath);
                    imageUrl = publicUrl;
                }
            }
            
            const aboutData = {
                subtitle: document.getElementById('id_about_subtitle')?.value,
                title: document.getElementById('id_about_title')?.value,
                short_description: document.getElementById('id_about_short_description')?.value,
                tag_line: document.getElementById('id_about_tag_line')?.value,
                ranking_number: document.getElementById('id_about_ranking_number')?.value,
                experience: document.getElementById('id_about_experience')?.value,
                video_url: document.getElementById('id_about_video_url')?.value,
                long_description: document.getElementById('id_about_long_description')?.value
            };
            
            if (imageUrl) {
                aboutData.image = imageUrl;
            }
            
            await saveSettings(SETTINGS_KEYS.about, aboutData);
        });
    }

    // Fun Fact Form
    const funfactForm = document.getElementById('funfact-form');
    if (funfactForm) {
        funfactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveSettings(SETTINGS_KEYS.funfact, {
                title_small: document.getElementById('id_funfact_title_small')?.value,
                title_big: document.getElementById('id_funfact_title_big')?.value
            });
        });
    }

    // Projects Form
    const projectsForm = document.getElementById('projects-form');
    if (projectsForm) {
        projectsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveSettings(SETTINGS_KEYS.projects, {
                title_small: document.getElementById('id_project_title_small')?.value,
                title_big: document.getElementById('id_project_title_big')?.value,
                all_work_text: document.getElementById('id_project_all_work_text')?.value,
                view_button_text: document.getElementById('id_project_view_button_text')?.value
            });
        });
    }

    // Clients Form
    const clientsForm = document.getElementById('clients-form');
    if (clientsForm) {
        clientsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveSettings(SETTINGS_KEYS.clients, {
                title_small: document.getElementById('id_client_title_small')?.value,
                title_big: document.getElementById('id_client_title_big')?.value
            });
        });
    }

    // Pricing Form
    const pricingForm = document.getElementById('pricing-form');
    if (pricingForm) {
        pricingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveSettings(SETTINGS_KEYS.pricing, {
                title_small: document.getElementById('id_pricing_title_small')?.value,
                title_big: document.getElementById('id_pricing_title_big')?.value
            });
        });
    }

    // Testimonial Form
    const testimonialForm = document.getElementById('testimonial-form');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveSettings(SETTINGS_KEYS.testimonial, {
                title_small: document.getElementById('id_testimonial_title_small')?.value,
                title_big: document.getElementById('id_testimonial_title_big')?.value
            });
        });
    }

    // Team Form
    const teamForm = document.getElementById('team-form');
    if (teamForm) {
        teamForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveSettings(SETTINGS_KEYS.team, {
                title_small: document.getElementById('id_team_title_small')?.value,
                title_big: document.getElementById('id_team_title_big')?.value
            });
        });
    }

    // Blog Form
    const blogForm = document.getElementById('blog-form');
    if (blogForm) {
        blogForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveSettings(SETTINGS_KEYS.blog, {
                title_small: document.getElementById('id_blog_title_small')?.value,
                title_big: document.getElementById('id_blog_title_big')?.value
            });
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    initFormHandlers();
});

export { loadSettings, saveSettings, SETTINGS_KEYS };
