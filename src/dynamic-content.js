
import { getProjects } from './supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
    // PROJECTS PAGE LOGIC
    const projectGrid = document.querySelector('.project-items');
    
    if (projectGrid) {
        // Clear existing static content if we want full dynamic loading
        // For now, let's append or replace? User wants DB source of truth.
        // So we should probably clear and fetch.
        
        try {
            const projects = await getProjects();
            
            if (projects && projects.length > 0) {
                // Generate HTML for each project
                const projectItemsHTML = projects.map(project => {
                    // Normalize category for class name (e.g. "UI/UX" -> "uiux")
                    const categoryClass = project.category.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                    // Handle special case for ui-ux -> uiux to match existing CSS if needed, 
                    // but looking at existing HTML: "uiux"
                    // "Web Design" -> "web-design"
                    // "Graphic Design" -> "graphic-design"
                    // "Developing" -> "developing"
                    // "Software" -> "software"
                    
                    let filteredCategory = categoryClass;
                    if (categoryClass === 'ui-ux') filteredCategory = 'uiux'; 
                    
                    return `
                        <div class="col-md-6 col-lg-4 single-item ${filteredCategory}" style="position: absolute; left: 0px; top: 0px;">
                            <div class="item-img">
                                <a href="${project.detail_url || '#'}"><img src="${project.image_url}" alt="${project.title}"></a>
                            </div>
                            <div class="item-inner-cnt">
                                <span>${project.category}</span>
                                <h4>${project.title}</h4>
                                <div class="view-btn">
                                    <a href="${project.detail_url || '#'}">view details</a>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                // We need to destroy isotope before replacing content to avoid memory leaks or issues?
                // Actually, just replacing innerHTML is aggressive.
                // Let's replace innerHTML then init Isotope.
                
                // Note: The Isotope init logic in custom.js runs on load. 
                // We might run into a race condition.
                // It's better if we handle Isotope here or ensure custom.js waits for us.
                
                // For this implementation, I'll clear and append.
                if (window.jQuery && window.jQuery(projectGrid).data('isotope')) {
                     window.jQuery(projectGrid).isotope('destroy');
                }
                
                projectGrid.innerHTML = projectItemsHTML;
                
                // Re-initialize Isotope
                // We need images to be loaded first
                const $grid = window.jQuery(projectGrid);
                
                // Use the same validation logic we added to custom.js
                if ($grid.imagesLoaded) {
                    $grid.imagesLoaded().then(function() {
                        $grid.isotope({
                            itemSelector: '.single-item',
                            layoutMode: 'fitRows',
                            percentPosition: true
                        });
                        // Trigger layout again to be safe
                        $grid.isotope('layout');
                    });
                }
                
                console.log(`Loaded ${projects.length} projects from Supabase.`);
            }
        } catch (error) {
            console.error('Failed to load dynamic projects:', error);
        }
    }
});
