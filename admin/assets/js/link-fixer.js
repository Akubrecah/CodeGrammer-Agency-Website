
document.addEventListener('DOMContentLoaded', () => {
    const routeMap = {
        // Elements (Lists)
        '/admin/element/sliders': '/admin/elements/slider.html',
        '/admin/element/fun-facts': '/admin/elements/fun-fact.html',
        '/admin/element/clients': '/admin/elements/clients.html',
        '/admin/element/testimonials': '/admin/elements/testmonials.html',
        '/admin/element/teams': '/admin/elements/team-members.html',
        '/admin/element/pricings': '/admin/elements/pricing.html', 

        // Elements (Create - Fallback to Lists as files differ/missing)
        '/admin/element/slider/create': '/admin/elements/create-slider.html',
        '/admin/element/fun-fact/create': '/admin/elements/fun-fact.html',
        '/admin/element/client/create': '/admin/elements/clients.html',
        '/admin/element/testimonial/create': '/admin/elements/testmonials.html',
        '/admin/element/team/create': '/admin/elements/team-members.html',
        '/admin/element/pricing/create': '/admin/elements/pricing.html',

        // Services
        '/admin/services': '/admin/services/service-list.html',
        '/admin/service/create': '/admin/services/create-service.html',

        // Projects
        '/admin/projects': '/admin/project/project-list.html',
        '/admin/project/create': '/admin/project/create-project.html',
        '/admin/project-category': '/admin/project/project-category.html',

        // Blogs
        '/admin/blogs': '/admin/blogs/blog-list.html',
        '/admin/blog/create': '/admin/blogs/create-blog.html',
        '/admin/blog-category': '/admin/blogs/blog-category.html',

        // Users
        '/admin/users/user-list/': '/admin/users/users-list.html',
        '/admin/user/create': '/admin/users/create-user.html',
        '/admin/edit-profile/1': '/admin/users/users-list.html', // Placeholder
        '/admin/user/change-password/1': '/admin/users/users-list.html',

        // Form Data
        '/admin/contacts': '/admin/form%20data/contact-form.html',
        '/admin/subscribers': '/admin/form%20data/subscriber.html',

        // Settings
        '/admin/settings/header-footer': '/admin/settings/header-footer-setting.html',
        '/admin/settings/seo': '/admin/settings/SEO.html',
        '/admin/settings/website-settings': '/admin/settings/website-settings.html',
        '/admin/settings/template-settings': '/admin/settings/template-settings.html',

        // Marketing
        '/admin/marketing/email-marketing/': '/admin/marketing%20tools/email-marketing.html',
        '/admin/marketing/sms-marketing/': '/admin/marketing%20tools/sms-marketing.html',
        '/admin/marketing/email-formator/': '/admin/marketing%20tools/email-formator.html',
        '/admin/marketing/number-formator/': '/admin/marketing%20tools/number-fomator.html',

        // Menus
        '/admin/menus/primary-menu': '/admin/menus/primary-menu.html',
        '/admin/menus/sub-menu': '/admin/menus/sub-menu.html',
        '/admin/primary-menu/create': '/admin/menus/create-primary-menu.html',

        // Pages
        '/admin/pages/home-page': '/admin/pages/home-page.html',
        '/admin/pages/about-page': '/admin/pages/about-page.html',
        '/admin/pages/service-page': '/admin/pages/service-page.html',
        '/admin/pages/project-page': '/admin/pages/projects-page.html', // Note singular vs plural file
        '/admin/pages/pricing-page': '/admin/pages/pricing-page.html',
        '/admin/pages/contact-page': '/admin/pages/contact-page.html',
        '/admin/pages/blog-page': '/admin/pages/blogs-page.html', // Note singular vs plural file
        '/admin/pages/terms-page': '/admin/pages/terms-page.html',
        '/admin/pages/policy-page': '/admin/pages/policy-page.html',
        
        // Custom Pages
        '/admin/custom-pages/': '/admin/custom-pages/index.html',
        '/admin/create/custom-page/': '/admin/custom-pages/create.html',

        // Logs/Misc
        '/logout/': '/admin/login/index.html',
        '/admin/dashboard': '/admin/dashboard/index.html'
    };

    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        let href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript')) return;

        // Clean href logic if needed (remove trailing slash?)
        // Exact match check
        if (routeMap[href]) {
            e.preventDefault();
            window.location.href = routeMap[href];
            return;
        }


        // Dynamic Routes (Regex)
        // Blog Edit /admin/blog/edit/123 -> /admin/blogs/create-blog.html?id=123
        const blogEditMatch = href.match(/\/admin\/blog\/edit\/(\d+)/);
        if (blogEditMatch) {
             e.preventDefault();
             window.location.href = `/admin/blogs/create-blog.html?id=${blogEditMatch[1]}`;
             return;
        }

        // Project Edit /admin/project/edit/123 -> /admin/project/create-project.html?id=123
        const projectEditMatch = href.match(/\/admin\/project\/edit\/(\d+)/);
        if (projectEditMatch) {
             e.preventDefault();
             window.location.href = `/admin/project/create-project.html?id=${projectEditMatch[1]}`;
             return;
        }

        // Service Edit
        const serviceEditMatch = href.match(/\/admin\/service\/edit\/(\d+)/);
        if (serviceEditMatch) {
             e.preventDefault();
             window.location.href = `/admin/services/create-service.html?id=${serviceEditMatch[1]}`;
             return;
        }
        
        // User Edit
        const userEditMatch = href.match(/\/admin\/user\/edit\/(\d+)/);
        if (userEditMatch) {
             e.preventDefault();
             window.location.href = `/admin/users/create-user.html?id=${userEditMatch[1]}`;
             return;
        }
        
        // Element Edits (Fallback to List)
        if (href.includes('/admin/element/') && href.includes('/edit/')) {
             // Try to find the base type: /admin/element/TYPE/edit/...
             // Fallback to strict map check by constructing 'create' path?
             // e.g. /admin/element/pricing/edit/1 -> /admin/elements/pricing.html
             if (href.includes('/pricing/')) window.location.href = '/admin/elements/pricing.html';
             else if (href.includes('/slider/')) window.location.href = '/admin/elements/slider.html';
             else if (href.includes('/fun-fact/')) window.location.href = '/admin/elements/fun-fact.html';
             else if (href.includes('/client/')) window.location.href = '/admin/elements/clients.html';
             else if (href.includes('/testimonial/')) window.location.href = '/admin/elements/testmonials.html';
             else if (href.includes('/team/')) window.location.href = '/admin/elements/team-members.html';
             
             if (href.includes('/pricing/') || href.includes('/slider/') || href.includes('/fun-fact/') || href.includes('/client/') || href.includes('/testimonial/') || href.includes('/team/')) {
                 e.preventDefault();
                 return;
             }
        }

        // Try fuzzy match (e.g. removing trailing slash)
        const stripped = href.replace(/\/$/, '');
        if (routeMap[stripped]) {
            e.preventDefault();
            window.location.href = routeMap[stripped];
            return;
        }

        // Try appending .html
        if (!href.endsWith('.html') && !href.includes('.')) {
             if (href.startsWith('/admin/')) {
                 e.preventDefault();
                 window.location.href = href + '.html';
             }
        }
    });
});
