
import { supabase } from '../../src/supabase-client.js';

document.addEventListener('DOMContentLoaded', async () => {
    const tableElement = document.querySelector('[data-table-list]');
    if (!tableElement) return;

    const tableName = tableElement.getAttribute('data-table-list');
    const tbody = tableElement.querySelector('tbody');

    if (!tableName || !tbody) return;

    async function loadItems() {
        try {
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            tbody.innerHTML = '';

            if (data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted">No records found.</td></tr>`;
                return;
            }

            data.forEach((item, index) => {
                const row = document.createElement('tr');
                
                // --- Action Buttons ---
                const getEditUrl = (id) => {
                    if (tableName === 'blogs') return `create-blog.html?id=${id}`;
                    if (tableName === 'sliders') return `create-slider.html?id=${id}`;
                    if (tableName === 'testimonials') return `create-testimonial.html?id=${id}`;
                    if (tableName === 'team_members') return `create-team-member.html?id=${id}`;
                    if (tableName === 'clients') return `create-client.html?id=${id}`;
                    if (tableName === 'pricing_plans') return `create-pricing.html?id=${id}`;
                    if (tableName === 'fun_facts') return `create-fun-fact.html?id=${id}`;
                    if (tableName === 'services') return `create-service.html?id=${id}`;
                    if (tableName === 'projects') return `create-project.html?id=${id}`;
                    return '#';
                };

                const editUrl = getEditUrl(item.id);
                // Use closest for event delegation logic if needed, but here simple click handler logic
                const deleteBtn = `<button type="button" class="btn bg-danger btn-sm delete-btn" data-id="${item.id}" data-table="${tableName}"><i class="ti ti-trash f-18 text-white"></i></button>`;
                const editBtn = `<a href="${editUrl}" class="btn btn-primary btn-sm"><i class="ti ti-pencil f-18 text-white"></i></a>`;
                const actions = `<div class=""><ul class="list-inline mb-0"><li class="list-inline-item m-0">${editBtn}</li><li class="list-inline-item m-0">${deleteBtn}</li></ul></div>`;

                // --- Helper ---
                const img = (src) => src ? `<img src="${src}" width="50" style="border-radius:5px;">` : 'No Image';
                const icon = (cls) => cls ? `<i class="${cls} f-20"></i>` : '-';

                let columns = '';

                if (tableName === 'sliders') {
                    columns = `
                        <td class="f-w-600">${index + 1}</td>
                        <td>${img(item.image)}</td>
                        <td class="f-w-600"><a href="${editUrl}">${item.title || 'Untitled'}</a></td>
                        <td class="f-w-600">${item.subtitle || '-'}</td>
                        <td class="f-w-600">${(item.description || '').substring(0, 50)}...</td>
                        <td>${actions}</td>
                    `;
                } else if (tableName === 'blogs') {
                    columns = `
                        <td class="f-w-600">${index + 1}</td>
                        <td>${img(item.thumbnail)}</td>
                        <td class="f-w-600"><a href="${editUrl}">${item.title || 'Untitled'}</a></td>
                        <td class="f-w-600"><span class="badge bg-info">${item.category || 'General'}</span></td>
                        <td class="f-w-600">${item.author || 'Admin'}</td>
                        <td class="f-w-600">${new Date(item.created_at).toLocaleDateString()}</td>
                        <td class="f-w-600">${new Date(item.created_at).toLocaleDateString()}</td>
                        <td>${actions}</td>
                    `;
                } else if (tableName === 'testimonials') {
                    columns = `
                        <td class="f-w-600">${index + 1}</td>
                        <td>${img(item.image)}</td>
                        <td class="f-w-600"><a href="${editUrl}">${item.name || 'Unknown'}</a></td>
                        <td class="f-w-600">${item.role || '-'}</td>
                        <td>${actions}</td>
                    `;
                 } else if (tableName === 'team_members') {
                    columns = `
                        <td class="f-w-600">${index + 1}</td>
                        <td>${img(item.image)}</td>
                        <td class="f-w-600"><a href="${editUrl}">${item.name || 'Unknown'}</a></td>
                        <td class="f-w-600">${item.role || '-'}</td>
                        <td>${actions}</td>
                    `;
                 } else if (tableName === 'clients') {
                    columns = `
                        <td class="f-w-600">${index + 1}</td>
                        <td>${img(item.image)}</td>
                        <td class="f-w-600"><a href="${editUrl}">${item.name || 'Unknown'}</a></td>
                        <td>${actions}</td>
                    `;
                 } else if (tableName === 'pricing_plans') {
                    columns = `
                        <td class="f-w-600">${index + 1}</td>
                        <td class="f-w-600"><a href="${editUrl}">${item.title || 'Entry'}</a></td>
                        <td class="f-w-600">${item.currency || '$'}${item.price || '0'}</td>
                        <td>${actions}</td>
                    `;
                 } else if (tableName === 'fun_facts') {
                    columns = `
                        <td class="f-w-600">${index + 1}</td>
                        <td>${icon(item.icon)}</td>
                        <td class="f-w-600"><a href="${editUrl}">${item.title || 'Fact'}</a></td>
                        <td class="f-w-600">${item.count || '0'}</td>
                        <td>${actions}</td>
                    `;
                 } else if (tableName === 'services') {
                    columns = `
                        <td class="f-w-600">${index + 1}</td>
                        <td>${img(item.image)}</td>
                        <td class="f-w-600"><a href="${editUrl}">${item.title || 'Service'}</a></td>
                        <td class="f-w-600">${(item.description || '').substring(0, 50)}...</td>
                         <td>${actions}</td>
                    `;
                 } else if (tableName === 'projects') {
                    columns = `
                        <td class="f-w-600">${index + 1}</td>
                        <td>${img(item.image)}</td>
                        <td class="f-w-600"><a href="${editUrl}">${item.title || 'Project'}</a></td>
                        <td class="f-w-600">${item.category || '-'}</td>
                        <td class="f-w-600">${item.client || '-'}</td>
                        <td>${actions}</td>
                    `;
                 }

                row.innerHTML = columns;
                tbody.appendChild(row);
            });

            // Attach Delete Listeners
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const button = e.target.tagName === 'I' ? e.target.parentElement : e.target;
                    const id = button.dataset.id;
                    const table = button.dataset.table;
                    
                    if (confirm('Are you sure you want to delete this item?')) {
                        const { error } = await supabase.from(table).delete().eq('id', id);
                        
                        if (error) {
                            alert('Error deleting: ' + error.message);
                        } else {
                            loadItems(); // Reload
                        }
                    }
                });
            });

        } catch (err) {
            console.error('Error loading items:', err);
            tbody.innerHTML = `<tr><td colspan="10" class="text-danger">Error loading data: ${err.message}</td></tr>`;
        }
    }

    loadItems();
});
