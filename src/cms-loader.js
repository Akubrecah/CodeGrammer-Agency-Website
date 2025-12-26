/* src/cms-loader.js - Logic for Main Site (Loading data) */
// This script runs on index.html

document.addEventListener('DOMContentLoaded', () => {
    const CMS_KEY = 'cms_homepage_data';
    let data = {};
    try {
        data = JSON.parse(localStorage.getItem(CMS_KEY)) || {};
    } catch (e) {
        return; // No data, stick to static
    }

    // Heuristics to map CMS data keys to DOM elements.
    // Ideally we would add data-cms attributes to index.html, but let's try to target by content or structure 
    // to match the user's "update directly" request without massive HTML refactoring if possible.
    // However, reliability requires attributes. I will add data-cms attributes to index.html next.
    
    // Map: dataKey -> selector
    const mappings = {
        'meta_title': { selector: 'title', type: 'text' },
        'meta_description': { selector: 'meta[name="description"]', type: 'attr', attr: 'content' },
        
        // Service Section
        'title_small': { selector: '[data-cms-id="service_subtitle"]', type: 'text' }, // "Our Solutions"
        'title_big': { selector: '[data-cms-id="service_title"]', type: 'text' },     // "Services"
        
        // About Section
        'subtitle': { selector: '[data-cms-id="about_subtitle"]', type: 'text' },      // "Get To Know"
        'title': { selector: '[data-cms-id="about_title"]', type: 'text' },            // "About Us"
        'short_description': { selector: '[data-cms-id="about_short_desc"]', type: 'text' },
        'tag_line': { selector: '[data-cms-id="about_tagline"]', type: 'text' },
        'experience': { selector: '[data-cms-id="about_experience"]', type: 'text' },
        'long_description': { selector: '[data-cms-id="about_long_desc"]', type: 'text' },
        
        // We'll stick to a naming convention in index.html like data-cms-bind="key_name"
    };

    // Generic binder
    document.querySelectorAll('[data-cms-bind]').forEach(el => {
        const key = el.getAttribute('data-cms-bind');
        if (data[key]) {
            if (el.tagName === 'IMG') {
                el.src = data[key];
            } else if (el.tagName === 'INPUT') {
                el.value = data[key];
            } else {
                el.innerText = data[key];
            }
        }
    });

    // Special handlers if needed (e.g. Meta tags)
    if (data['meta_title']) document.title = data['meta_title'];
    if (data['meta_description']) {
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', data['meta_description']);
    }
});
