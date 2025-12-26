document.addEventListener('DOMContentLoaded', function() {
    // --- Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('pc-theme-toggle');
    const body = document.body;
    const THEME_KEY = 'pc-theme';

    // Initialize Theme
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark'; // Default to dark as requested
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentTheme = body.getAttribute('data-pc-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    function applyTheme(theme) {
        body.setAttribute('data-pc-theme', theme);
        body.setAttribute('data-pc-sidebar-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        
        // Update icon if exists
        const icon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
        if (icon) {
            if (theme === 'dark') {
                icon.classList.remove('ph-moon');
                icon.classList.add('ph-sun-dim');
            } else {
                icon.classList.remove('ph-sun-dim');
                icon.classList.add('ph-moon');
            }
        }
    }

    // --- Sidebar Dropdown Logic ---
    const sidebar = document.querySelector('.pc-sidebar');
    if (sidebar) {
        sidebar.addEventListener('click', function(e) {
            const link = e.target.closest('.pc-hasmenu > .pc-link');
            if (!link) return;

            e.preventDefault();
            const menuItem = link.parentElement;
            const submenu = menuItem.querySelector('.pc-submenu');

            // Toggle classes
            menuItem.classList.toggle('pc-trigger');
            menuItem.classList.toggle('active');

            // Toggle Slide
            if (submenu) {
                if (window.getComputedStyle(submenu).display === 'block') {
                    submenu.style.display = 'none';
                } else {
                    submenu.style.display = 'block';
                }
            }
        });
    }
});
