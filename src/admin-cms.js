/* src/admin-cms.js - Logic for Admin Home Page (Saving data) */
// This script runs on admin/pages/home-page.html

document.addEventListener('DOMContentLoaded', () => {
    // Identifiers for sections mapping to localStorage keys
    const CMS_KEY = 'cms_homepage_data';

    // Helper to get current data
    const getCMSData = () => {
        try {
            return JSON.parse(localStorage.getItem(CMS_KEY)) || {};
        } catch (e) {
            return {};
        }
    };

    // Helper to save data
    const saveCMSData = (data) => {
        localStorage.setItem(CMS_KEY, JSON.stringify(data));
        alert('Changes saved to live site!'); // Simple feedback
    };

    // 1. Initialize Forms with existing data
    const existingData = getCMSData();
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        // Assume each form corresponds to a section. 
        // We need to identify them. Let's use the first input's name or a custom attribute if we add one.
        // For now, let's look at specific inputs we care about.
        
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (existingData[input.name]) {
                input.value = existingData[input.name];
            }
        });

        // 2. Handle Submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentData = getCMSData();
            const formData = new FormData(form);
            
            for (let [key, value] of formData.entries()) {
                // If file input, we can't easily save to localStorage (fake it or skip)
                if (value instanceof File) {
                    if (value.name) {
                        // Just save the name for now as a placeholder
                        // In a real app we'd upload. Here we might just keep the old value if empty, or fake path.
                         if(value.size > 0) currentData[key] = "/media/fake_upload/" + value.name;
                    }
                } else {
                    currentData[key] = value;
                }
            }
            
            saveCMSData(currentData);
        });
    });

    // 3. UI: Select Dropdown to scroll to sections
    // Create the dropdown logic here if we add the select element
    const sectionSelector = document.getElementById('section-selector');
    if (sectionSelector) {
        sectionSelector.addEventListener('change', (e) => {
            const targetId = e.target.value;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
                // Optional: Open accordion if we implement one
                const collapse = targetEl.querySelector('.collapse');
                if(collapse) {
                    const bsCollapse = new bootstrap.Collapse(collapse, { show: true });
                }
            }
        });
    }
});
