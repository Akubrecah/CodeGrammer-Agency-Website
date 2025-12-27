
import { supabase } from './supabase-client.js';

// Fetch and apply site settings to the home page
async function loadHomePageSettings() {
    try {
        const { data: settings, error } = await supabase
            .from('site_settings')
            .select('*');

        if (error) {
            console.error('Error loading site settings:', error);
            return;
        }

        // Create settings map
        const settingsMap = {};
        settings.forEach(item => {
            settingsMap[item.key] = item.value;
        });

        // Apply settings to page elements with data-cms-bind attribute
        applySettings(settingsMap);

    } catch (err) {
        console.error('Error in loadHomePageSettings:', err);
    }
}

function applySettings(settingsMap) {
    // Services Section
    if (settingsMap['home_services']) {
        const s = settingsMap['home_services'];
        updateElement('[data-cms-bind="service_title_small"]', s.title_small);
        updateElement('[data-cms-bind="service_title_big"]', s.title_big);
    }

    // About Section
    if (settingsMap['home_about']) {
        const about = settingsMap['home_about'];
        updateElement('[data-cms-bind="about_subtitle"]', about.subtitle);
        updateElement('[data-cms-bind="about_title"]', about.title);
        updateElement('[data-cms-bind="about_short_description"]', about.short_description);
        updateElement('[data-cms-bind="about_long_description"]', about.long_description);
        updateElement('[data-cms-bind="about_tag_line"]', about.tag_line + (about.experience ? ` <span>${about.experience}</span>` : ''));
        
        // Update image if provided
        if (about.image) {
            const imgEl = document.querySelector('[data-cms-bind="about_image"]');
            if (imgEl) imgEl.src = about.image;
        }
        
        // Update video URL
        if (about.video_url) {
            const videoLink = document.querySelector('[data-cms-bind="about_video_url"]');
            if (videoLink) videoLink.href = about.video_url;
        }
    }

    // Fun Fact Section
    if (settingsMap['home_funfact']) {
        const ff = settingsMap['home_funfact'];
        updateElement('[data-cms-bind="funfact_title_small"]', ff.title_small);
        updateElement('[data-cms-bind="funfact_title_big"]', ff.title_big);
    }

    // Projects Section
    if (settingsMap['home_projects']) {
        const p = settingsMap['home_projects'];
        updateElement('[data-cms-bind="project_title_small"]', p.title_small);
        updateElement('[data-cms-bind="project_title_big"]', p.title_big);
    }

    // Clients Section
    if (settingsMap['home_clients']) {
        const c = settingsMap['home_clients'];
        updateElement('[data-cms-bind="client_title_small"]', c.title_small);
        updateElement('[data-cms-bind="client_title_big"]', c.title_big);
    }

    // Pricing Section
    if (settingsMap['home_pricing']) {
        const pr = settingsMap['home_pricing'];
        updateElement('[data-cms-bind="pricing_title_small"]', pr.title_small);
        updateElement('[data-cms-bind="pricing_title_big"]', pr.title_big);
    }

    // Testimonial Section
    if (settingsMap['home_testimonial']) {
        const t = settingsMap['home_testimonial'];
        updateElement('[data-cms-bind="testimonial_title_small"]', t.title_small);
        updateElement('[data-cms-bind="testimonial_title_big"]', t.title_big);
    }

    // Team Section
    if (settingsMap['home_team']) {
        const tm = settingsMap['home_team'];
        updateElement('[data-cms-bind="team_title_small"]', tm.title_small);
        updateElement('[data-cms-bind="team_title_big"]', tm.title_big);
    }

    // Blog Section
    if (settingsMap['home_blog']) {
        const b = settingsMap['home_blog'];
        updateElement('[data-cms-bind="blog_title_small"]', b.title_small);
        updateElement('[data-cms-bind="blog_title_big"]', b.title_big);
    }

    // SEO Meta Tags
    if (settingsMap['home_seo']) {
        const seo = settingsMap['home_seo'];
        if (seo.meta_title) {
            document.title = seo.meta_title;
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.content = seo.meta_title;
        }
        if (seo.meta_description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.content = seo.meta_description;
            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) ogDesc.content = seo.meta_description;
        }
    }
}

function updateElement(selector, value, isHtml = true) {
    const el = document.querySelector(selector);
    if (el && value !== undefined && value !== null) {
        if (isHtml) {
            el.innerHTML = value;
        } else {
            el.textContent = value;
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', loadHomePageSettings);

export { loadHomePageSettings };
