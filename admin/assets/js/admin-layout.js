/**
 * Admin Layout Loader
 * Dynamically loads and injects the shared admin layout (sidebar, header, footer)
 * into any admin page that includes this script.
 */

class AdminLayout {
    constructor() {
        this.init();
    }

    async init() {
        // Load the layout HTML
        await this.loadLayout();
        // Initialize scripts
        this.initializeFeather();
        this.initializeTheme();
    }

    async loadLayout() {
        // Inject sidebar
        const sidebarHtml = this.getSidebarHTML();
        const headerHtml = this.getHeaderHTML();
        const footerHtml = this.getFooterHTML();
        
        // Find pc-container and wrap content properly
        const mainContent = document.querySelector('.pc-container');
        if (mainContent) {
            // Insert sidebar before pc-container
            mainContent.insertAdjacentHTML('beforebegin', sidebarHtml);
            // Insert header after sidebar
            const sidebar = document.querySelector('.pc-sidebar');
            if (sidebar) {
                sidebar.insertAdjacentHTML('afterend', headerHtml);
            }
            // Insert footer after pc-container
            mainContent.insertAdjacentHTML('afterend', footerHtml);
        }
    }

    getSidebarHTML() {
        return `
<!-- [ Sidebar Menu ] start -->
<nav class="pc-sidebar">
  <div class="navbar-wrapper">
    <div class="m-header">
      <a href="/admin/dashboard/index.html" class="b-brand text-primary">
          <img src="/assets/images/app_config/logolight.webp" alt="logo image" class="logo-light" width="200" height="45" />
          <img src="/assets/images/app_config/logodark.webp" alt="logo image" class="logo-dark" width="200" height="45" />
      </a>
    </div>
    <div class="navbar-content">
      <ul class="pc-navbar">
        <li class="pc-item pc-caption">
          <label>Navigation</label>
          <i class="ph-duotone ph-gauge"></i>
        </li>
        <li class="pc-item">
          <a href="/admin/dashboard/index.html" class="pc-link">
            <span class="pc-micon"><i class="ph-duotone ph-gauge"></i></span>
            <span class="pc-mtext">Dashboard</span>
          </a>
        </li>
        
        <li class="pc-item pc-hasmenu">
          <a href="javascript:void(0)" class="pc-link">
            <span class="pc-micon"><i class="ph-duotone ph-file"></i></span>
            <span class="pc-mtext">Pages</span><span class="pc-arrow"><i data-feather="chevron-right"></i></span>
          </a>
          <ul class="pc-submenu">
            <li class="pc-item"><a class="pc-link" href="/admin/pages/page-editor.html" style="color: #4680ff; font-weight: 600;"><i class="fas fa-edit me-1"></i> Page Editor</a></li>
            <li class="pc-item"><a class="pc-link" href="/admin/pages/page-editor.html?page=home">Home Page</a></li>
            <li class="pc-item"><a class="pc-link" href="/admin/pages/page-editor.html?page=about">About Page</a></li>
            <li class="pc-item"><a class="pc-link" href="/admin/pages/page-editor.html?page=sliders">Sliders</a></li>
            <li class="pc-item"><a class="pc-link" href="/admin/pages/page-editor.html?page=contact">Contact Page</a></li>
          </ul>
        </li>
        
        <li class="pc-item pc-caption">
          <label>Site Configuration</label>
          <i class="ph-duotone ph-chart-pie"></i>
        </li>
        
        <li class="pc-item pc-hasmenu">
          <a href="javascript:void(0)" class="pc-link">
            <span class="pc-micon"><i class="ph-duotone ph-package"></i></span>
            <span class="pc-mtext">Elements</span><span class="pc-arrow"><i data-feather="chevron-right"></i></span>
          </a>
          <ul class="pc-submenu">
            <li class="pc-item"><a class="pc-link" href="/admin/pages/page-editor.html?page=sliders">Sliders</a></li>
            <li class="pc-item"><a class="pc-link" href="/admin/pages/page-editor.html?page=funfacts">Fun Facts</a></li>
            <li class="pc-item"><a class="pc-link" href="/admin/pages/page-editor.html?page=clients">Clients</a></li>
            <li class="pc-item"><a class="pc-link" href="/admin/pages/page-editor.html?page=testimonials">Testimonials</a></li>
            <li class="pc-item"><a class="pc-link" href="/admin/pages/page-editor.html?page=team">Team Members</a></li>
            <li class="pc-item"><a class="pc-link" href="/admin/elements/pricing.html">Pricing</a></li>
          </ul>
        </li>

        <li class="pc-item pc-hasmenu">
          <a href="javascript:void(0)" class="pc-link">
            <span class="pc-micon"><i class="ph-duotone ph-gear"></i></span>
            <span class="pc-mtext">Settings</span><span class="pc-arrow"><i data-feather="chevron-right"></i></span>
          </a>
          <ul class="pc-submenu">
            <li class="pc-item"><a class="pc-link" href="/admin/settings/website-settings.html">Website Settings</a></li>
            <li class="pc-item"><a class="pc-link" href="/admin/settings/SEO.html">SEO</a></li>
          </ul>
        </li>

      </ul>
    </div>
  </div>
</nav>
<!-- [ Sidebar Menu ] end -->`;
    }

    getHeaderHTML() {
        return `
<!-- [ Header Topbar ] start -->
<header class="pc-header">
  <div class="header-wrapper">
    <div class="me-auto pc-mob-drp">
      <ul class="list-unstyled">
        <li class="pc-h-item pc-sidebar-collapse">
          <a href="javascript:void(0)" class="pc-head-link ms-0" id="sidebar-hide">
            <i class="ti ti-menu-2"></i>
          </a>
        </li>
        <li class="pc-h-item pc-sidebar-popup">
          <a href="javascript:void(0)" class="pc-head-link ms-0" id="mobile-collapse">
            <i class="ti ti-menu-2"></i>
          </a>
        </li>
      </ul>
    </div>
    <div class="ms-auto">
      <ul class="list-unstyled">
        <li class="pc-h-item">
          <a class="pc-head-link arrow-none me-0" id="pc-theme-toggle" href="javascript:void(0)">
            <i class="ph-duotone ph-sun-dim"></i>
          </a>
        </li>
        <li class="dropdown pc-h-item header-user-profile">
          <a class="pc-head-link dropdown-toggle arrow-none me-0" data-bs-toggle="dropdown" href="javascript:void(0)">
            <img src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png" alt="user-image" class="user-avtar" />
          </a>
          <div class="dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown">
            <div class="dropdown-header d-flex align-items-center justify-content-between">
              <h5 class="m-0">Profile</h5>
            </div>
            <div class="dropdown-body">
              <ul class="list-group list-group-flush w-100">
                <li class="list-group-item">
                  <a href="/admin/dashboard/index.html" class="dropdown-item">
                    <i class="ph-duotone ph-gauge"></i> <span>Dashboard</span>
                  </a>
                </li>
                <li class="list-group-item">
                  <a href="/" class="dropdown-item">
                    <i class="ph-duotone ph-globe"></i> <span>View Site</span>
                  </a>
                </li>
                <li class="list-group-item">
                  <a href="/admin/auth/login.html" class="dropdown-item" onclick="localStorage.removeItem('sb-auth-token')">
                    <i class="ph-duotone ph-power"></i> <span>Logout</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</header>
<!-- [ Header ] end -->`;
    }

    getFooterHTML() {
        return `
<footer class="pc-footer">
  <div class="footer-wrapper container-fluid">
    <div class="row">
      <div class="col-sm-6 my-1">
        <p class="m-0">Copyright © 2025 <a href="/">The CodeGrammer</a></p>
      </div>
    </div>
  </div>
</footer>`;
    }

    initializeFeather() {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    initializeTheme() {
        const themeToggle = document.getElementById('pc-theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const body = document.body;
                const currentTheme = body.getAttribute('data-pc-theme') || 'light';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                body.setAttribute('data-pc-theme', newTheme);
                localStorage.setItem('theme-mode', newTheme);
            });
            
            // Apply saved theme
            const savedTheme = localStorage.getItem('theme-mode');
            if (savedTheme) {
                document.body.setAttribute('data-pc-theme', savedTheme);
            }
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AdminLayout();
});
