
import { supabase } from '../src/supabase-client.js';

// Auth Guard
export async function requireAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = '/admin/login/';
    }
    return session;
}

// Logout
export async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/admin/login/';
}

// Attach logout listeners
export function setupLogout() {
    const logoutLinks = document.querySelectorAll('a[href="/logout/"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            await handleLogout();
        });
    });
}

// Update Dashboard Stats
export async function updateDashboardStats() {
    try {
        // Projects
        const { count: projectCount } = await supabase
            .from('company_projects')
            .select('*', { count: 'exact', head: true });
            
        // Services
        const { count: serviceCount } = await supabase
            .from('company_services')
            .select('*', { count: 'exact', head: true });
            
        // Messages
        const { count: messageCount } = await supabase
            .from('contact_messages')
            .select('*', { count: 'exact', head: true });

        // Update DOM
        updateStat('Projects', projectCount);
        updateStat('Services', serviceCount);
        updateStat('Contacts', messageCount);
        
    } catch (e) {
        console.error('Error updating stats:', e);
    }
}

function updateStat(label, count) {
    // Find the card with the label
    // This depends on the exact HTML structure
    // We look for p.text-muted with text content == label, then update sibling h2
    const labels = Array.from(document.querySelectorAll('.text-muted'));
    const targetLabel = labels.find(el => el.textContent.trim() === label);
    if (targetLabel) {
        const countEl = targetLabel.parentElement.querySelector('h2');
        if (countEl) countEl.textContent = count || 0;
    }
}
