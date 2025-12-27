
import { supabase } from '/src/supabase-client.js';

// 1. Inject Styles
const style = document.createElement('style');
style.textContent = `
.demo-alert {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    max-width: 350px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    font-weight: 500;
}

.demo-alert.success { background-color: #28a745; }
.demo-alert.error { background-color: #dc3545; }

.demo-alert.show {
    opacity: 1;
    transform: translateY(0);
}

.demo-alert-close {
    background: none;
    border: none;
    color: white;
    margin-left: 10px;
    cursor: pointer;
    font-size: 18px;
    padding: 0 5px;
}

.demo-alert-message {
    margin-right: 10px;
}
`;
document.head.appendChild(style);

// 2. Toast Logic
document.addEventListener('DOMContentLoaded', async function() {
    const alertTemplate = document.createElement('div');
    alertTemplate.className = 'demo-alert';
    alertTemplate.innerHTML = `
        <span class="demo-alert-message"></span>
        <button class="demo-alert-close">&times;</button>
    `;
    document.body.appendChild(alertTemplate);

    window.showToast = function(message, type = 'success') {
        const alert = document.querySelector('.demo-alert');
        const messageEl = alert.querySelector('.demo-alert-message');
        
        alert.className = 'demo-alert ' + type; 
        messageEl.textContent = message;
        alert.classList.add('show');

        setTimeout(() => {
            alert.classList.remove('show');
        }, 5000);
    }
    
    const closeBtn = document.querySelector('.demo-alert-close');
    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.querySelector('.demo-alert').classList.remove('show');
        });
    }

    // 3. Key Identification
    function getPagePrefix() {
        const path = window.location.pathname;
        let filename = path.split('/').pop().replace('.html', '');
        
        // Normalize
        if (filename === 'home-page') return 'home';
        if (filename === 'about-page') return 'about';
        if (filename === 'service-page') return 'service';
        if (filename === 'contact-page') return 'contact';
        if (filename === 'pricing-page') return 'pricing';
        if (filename === 'projects-page') return 'project';
        if (filename === 'blogs-page') return 'blog';
        if (filename === 'terms-page') return 'terms';
        if (filename === 'policy-page') return 'policy';
        
        return filename.replace('-page', '');
    }

    function getSectionName(form) {
        // Explicit Data Key (Override)
        if (form.dataset.key) return form.dataset.key; // Returns full key, need to handle returning 'section' vs 'full key'

        // Check hidden inputs or unique fields
        if (form.querySelector('[name="meta_title"]')) return 'seo';
        if (form.querySelector('[name="service_section_title"]')) return 'services';
        if (form.querySelector('[name="about_section_title"]')) return 'about';
        if (form.querySelector('[name="ranking_number"]')) return 'about'; // Heuristic for About
        
        if (form.querySelector('[name="funfact_section_title"]')) return 'funfact';
        if (form.querySelector('[name="project_section_title"]')) return 'project';
        if (form.querySelector('[name="client_section_title"]')) return 'clients';
        if (form.querySelector('[name="pricing_section_title"]')) return 'pricing';
        if (form.querySelector('[name="testimonial_section_title"]')) return 'testimonials';
        if (form.querySelector('[name="team_section_title"]')) return 'team';
        if (form.querySelector('[name="blog_section_title"]')) return 'blog';
        
        if (form.querySelector('[name="contact_form_title"]')) return 'contact_form';
        if (form.querySelector('[name="subscriber_form_title"]')) return 'subscriber_form';

        return null;
    }

    function getFullKey(form) {
        if (form.dataset.key) return form.dataset.key;
        
        const prefix = getPagePrefix();
        const section = getSectionName(form);
        if (section) return `${prefix}_${section}`;
        return null;
    }

    // 4. Load Data
    async function loadData() {
        // Optimization: Fetch all settings for this page prefix
        const prefix = getPagePrefix();
        const { data: settings, error } = await supabase
            .from('site_settings')
            .select('*')
            .like('key', `${prefix}_%`);
        
        if (error || !settings) return;

        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const key = getFullKey(form);
            if (!key) return;

            const setting = settings.find(s => s.key === key);
            if (setting && setting.value) {
                Object.entries(setting.value).forEach(([fieldName, value]) => {
                    const input = form.querySelector(`[name="${fieldName}"]`);
                    if (input) {
                        if (input.type === 'file') {
                            const container = input.parentElement;
                            const link = container.querySelector('a');
                            if (link && value) {
                                link.href = value;
                                link.textContent = value.split('/').pop();
                            }
                        } else if (input.type === 'checkbox' || input.type === 'radio') {
                            input.checked = value;
                        } else {
                            input.value = value;
                        }
                    } else if (fieldName === 'long_description') {
                         const textarea = form.querySelector(`[name="${fieldName}"]`);
                         if(textarea) textarea.value = value;
                    }
                });
            }
        });
    }

    await loadData();

    // --- Collection Data Loading (New) ---
    const collectionForms = document.querySelectorAll('form[data-table]');
    collectionForms.forEach(async (form) => {
        const table = form.dataset.table;
        const urlParams = new URLSearchParams(window.location.search);
        let id = urlParams.get('id');
        
        // Also check path-based ID as backup
        if (!id) {
             const urlParts = window.location.pathname.split('/');
             const editIndex = urlParts.indexOf('edit');
             if (editIndex !== -1 && urlParts[editIndex + 1]) {
                 id = urlParts[editIndex + 1];
             }
        }

        if (id && table) {
            try {
                const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
                if (error) throw error;
                if (data) {
                    for (const [key, value] of Object.entries(data)) {
                        const input = form.querySelector(`[name="${key}"]`);
                        if (input) {
                           if (input.type === 'file') {
                               // Can't set file input
                               // Optional: Show preview link?
                               if(value && typeof value === 'string' && value.startsWith('http')) {
                                   const preview = document.createElement('div');
                                   preview.innerHTML = `<small>Current: <a href="${value}" target="_blank">View File</a></small>`;
                                   input.parentNode.appendChild(preview);
                               }
                           } else if (input.type === 'checkbox') {
                               input.checked = value;
                           } else {
                               input.value = value;
                           }
                           
                           // CKEditor handling
                           if (window.CKEDITOR && window.CKEDITOR.instances[input.id]) {
                               window.CKEDITOR.instances[input.id].setData(value);
                           }
                        }
                    }
                }
            } catch (err) {
                console.error("Error loading collection item:", err);
                window.showToast("Error loading item: " + err.message, "error");
            }
        }
    });

    // 5. Submit Handler
    // 5. Submit Handler
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Sync CKEditor
            if (window.CKEDITOR) {
                for (const instance in window.CKEDITOR.instances) {
                    window.CKEDITOR.instances[instance].updateElement();
                }
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : 'Save';
            if (submitBtn) {
                submitBtn.textContent = 'Saving...';
                submitBtn.disabled = true;
            }

            try {
                const table = form.dataset.table;
                const formData = new FormData(form);
                const finalData = {};

                // Process Files & Data
                for (const [key, value] of formData.entries()) {
                    if (value instanceof File) {
                        if (value.size > 0) {
                            const fileExt = value.name.split('.').pop();
                            const fileName = `uploads/${Date.now()}_${key}.${fileExt}`;
                            const { error: uploadError } = await supabase.storage
                                .from('site-assets')
                                .upload(fileName, value);
                            
                            if (uploadError) throw uploadError;

                            const { data: { publicUrl } } = supabase.storage
                                .from('site-assets')
                                .getPublicUrl(fileName);
                            
                            finalData[key] = publicUrl;
                        }
                    } else {
                        // Skip internal Django tokens
                        if (key !== 'csrfmiddlewaretoken') {
                             finalData[key] = value;
                        }
                    }
                }

                if (table) {
                    // --- Collection Logic (Blogs, Sliders) ---
                    const urlParts = window.location.pathname.split('/');
                    // Heuristic: check if last segment is a UUID or number, or if 'edit' is present
                    const editIndex = urlParts.indexOf('edit'); 
                    let id = null;
                    const urlParams = new URLSearchParams(window.location.search);
                    
                    if (urlParams.get('id')) {
                        id = urlParams.get('id');
                    } else if (editIndex !== -1 && urlParts[editIndex + 1]) {
                        id = urlParts[editIndex + 1];
                    }

                    let error;
                    if (id) {
                         // Update
                         ({ error } = await supabase.from(table).update(finalData).eq('id', id));
                    } else {
                         // Insert
                         ({ error } = await supabase.from(table).insert(finalData));
                    }
                    if (error) throw error;
                    
                    window.showToast('Item saved successfully!', 'success');
                     // Redirect to list? Optional. For now just toast.
                     // window.location.href = `admin/${table}/list.html`; // Logic needed

                } else {
                    // --- Key-Value Logic (Site Settings) ---
                    const key = getFullKey(form);
                    if (!key) throw new Error('Unknown form type (no data-key or data-table)');

                    // Fetch current to merge? Or just overwrite value blob?
                    // Previous logic fetched current value to merge.
                    const { data: currentData } = await supabase
                        .from('site_settings')
                        .select('value')
                        .eq('key', key)
                        .single();
                    
                    const newValue = { ...(currentData?.value || {}), ...finalData }; // Merge

                    const { error } = await supabase
                        .from('site_settings')
                        .upsert({ key: key, value: newValue });

                    if (error) throw error;
                    window.showToast('Settings saved successfully!', 'success');
                    if (form.querySelector('input[type="file"]')) await loadData();
                }

            } catch (err) {
                console.error('Save error:', err);
                window.showToast('Error saving: ' + err.message, 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    });
});
