
import { supabase } from '/src/supabase-client.js';

document.addEventListener('DOMContentLoaded', async function() {
    const table = document.querySelector('[data-table-list]');
    if (!table) return;

    const tableName = table.dataset.tableList;
    const tbody = table.querySelector('tbody');
    
    // Show Loading
    tbody.innerHTML = '<tr><td colspan="6" class="text-center p-4">Loading...</td></tr>';

    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        tbody.innerHTML = '';
        
        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center p-4">No items found.</td></tr>';
            return;
        }

        data.forEach((item, index) => {
            const row = document.createElement('tr');
            
            // Render Logic based on Table
            if (tableName === 'sliders') {
                let imageCell = item.image ? `<img src="${item.image}" width="50" style="border-radius:5px;">` : '<span class="text-muted">No Image</span>';
                const editUrl = `create-slider.html?id=${item.id}`;

                row.innerHTML = `
                    <td class="f-w-600">${index + 1}</td>
                    <td>${imageCell}</td>
                    <td class="f-w-600"><a href="${editUrl}">${item.title || 'Untitled'}</a></td>
                    <td class="f-w-600">${item.subtitle || '-'}</td>
                    <td class="f-w-600">${(item.description || '').substring(0, 50)}...</td>
                    <td>
                        <div class="">
                            <ul class="list-inline mb-0">
                                <li class="list-inline-item m-0">
                                    <a href="${editUrl}" class="btn btn-primary btn-sm">
                                        <i class="ti ti-pencil f-18 text-white"></i>
                                    </a>
                                </li>
                                <li class="list-inline-item m-0">
                                    <button type="button" class="btn bg-danger btn-sm delete-btn" data-id="${item.id}" data-table="${tableName}">
                                        <i class="ti ti-trash f-18 text-white"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </td>
                `;
            } else if (tableName === 'blogs') {
                const editUrl = `create-blog.html?id=${item.id}`;
                let imageCell = item.thumbnail ? `<img src="${item.thumbnail}" width="50" style="border-radius:5px;">` : 'No Image';
                
                row.innerHTML = `
                    <td class="f-w-600">${index + 1}</td>
                    <td>${imageCell}</td>
                    <td class="f-w-600"><a href="${editUrl}">${item.title || 'Untitled'}</a></td>
                    <td class="f-w-600"><span class="badge bg-info">${item.category || 'General'}</span></td>
                    <td class="f-w-600">${item.author || 'Admin'}</td>
                    <td class="f-w-600">${new Date(item.created_at).toLocaleDateString()}</td>
                    <td class="f-w-600">${new Date(item.created_at).toLocaleDateString()}</td>
                   <td>
                        <div class="">
                            <ul class="list-inline mb-0">
                                <li class="list-inline-item m-0">
                                    <a href="${editUrl}" class="btn btn-primary btn-sm">
                                        <i class="ti ti-pencil f-18 text-white"></i>
                                    </a>
                                </li>
                                <li class="list-inline-item m-0">
                                    <button type="button" class="btn bg-danger btn-sm delete-btn" data-id="${item.id}" data-table="${tableName}">
                                        <i class="ti ti-trash f-18 text-white"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </td>
                `;
            }
            tbody.appendChild(row);
        });

        // Attach Delete Listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = btn.dataset.id;
                const table = btn.dataset.table;
                if(confirm('Are you sure you want to delete this item?')) {
                    try {
                        const { error } = await supabase.from(table).delete().eq('id', id);
                        if(error) throw error;
                        window.location.reload();
                    } catch(err) {
                        alert('Error deleting: ' + err.message);
                    }
                }
            });
        });

    } catch (err) {
        console.error('Error loading List:', err);
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger p-4">Error loading data: ${err.message}</td></tr>`;
    }
});
