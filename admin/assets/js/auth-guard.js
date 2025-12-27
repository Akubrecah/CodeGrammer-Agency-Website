
import { supabase } from '../../../src/supabase-client.js';

async function checkAuth() {
    const path = window.location.pathname;
    const isLoginPage = path.includes('/admin/login/');
    
    // Quick session check
    const { data: { session } } = await supabase.auth.getSession();

    if (!session && !isLoginPage) {
        // Store current page to redirect back after login?
        sessionStorage.setItem('redirect_to', window.location.href);
        window.location.href = '/admin/login/index.html';
    } else if (session && isLoginPage) {
        window.location.href = '/admin/dashboard/index.html';
    }
}

// Initial Check
checkAuth();

// Auth State Change Listener
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        window.location.href = '/admin/login/index.html';
    }
});

// Logout Handler Injection
document.addEventListener('DOMContentLoaded', () => {
    // Find all links that look like Logout
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.innerText.toLowerCase();
        
        // Check for Logout links (href to login AND text 'logout')
        if ((href && href.includes('/admin/login') && text.includes('logout')) || 
            (link.dataset.action === 'logout')) {
            
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                await supabase.auth.signOut();
                // onAuthStateChange will handle redirect
            });
        }
    });
});
