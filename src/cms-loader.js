
import { supabase } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch Settings
    const { data: settings, error } = await supabase
        .from('site_settings')
        .select('*')
        .like('key', 'home_%');

    if (error || !settings) return;

    // Convert to Map
    const dataMap = {};
    settings.forEach(item => {
        dataMap[item.key] = item.value;
    });

    // 2. Bind Elements
    const elements = document.querySelectorAll('[data-cms-bind]');
    elements.forEach(el => {
        const bindKey = el.dataset.cmsBind;
        const [section, field] = parseBindKey(bindKey); 

        if (section && dataMap[section] && dataMap[section][field]) {
            const value = dataMap[section][field];
            
            if (el.tagName === 'IMG') {
                el.src = value;
            } else if (el.tagName === 'A' && (field.includes('url') || field.includes('link'))) {
                el.href = value;
            } else {
                el.innerHTML = value; // Use innerHTML to support basic formatting
            }
        }
    });
});

function parseBindKey(key) {
    if (key.startsWith('service_')) return ['home_services', key.replace('service_', '')];
    if (key.startsWith('about_')) return ['home_about', key.replace('about_', '')];
    if (key.startsWith('funfact_')) return ['home_funfact', key.replace('funfact_', '')];
    if (key.startsWith('project_')) return ['home_projects', key.replace('project_', '')];
    if (key.startsWith('client_')) return ['home_clients', key.replace('client_', '')]; 
    if (key.startsWith('pricing_')) return ['home_pricing', key.replace('pricing_', '')];
    if (key.startsWith('testimonial_')) return ['home_testimonial', key.replace('testimonial_', '')];
    if (key.startsWith('team_')) return ['home_team', key.replace('team_', '')];
    if (key.startsWith('blog_')) return ['home_blog', key.replace('blog_', '')];
    
    // SEO (meta tags - special case)
    if (key.startsWith('meta_')) return ['home_seo', key];

    return [null, null];
}
