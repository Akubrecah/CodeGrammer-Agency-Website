
import os
import re
import traceback

def fix_sidebar_links(root_dir):
    # Mapping of "Broken/Old Path" -> "Correct Path"
    # Note: These regexes will match href="<KEY>"
    # We escape the key for regex
    
    replacements = {
        # Dashboard
        r'/admin/dashboard': '/admin/dashboard/index.html',
        
        # Pages (Appending .html)
        r'/admin/pages/home-page': '/admin/pages/home-page.html',
        r'/admin/pages/about-page': '/admin/pages/about-page.html',
        r'/admin/pages/service-page': '/admin/pages/service-page.html',
        r'/admin/pages/project-page': '/admin/pages/project-page.html',
        r'/admin/pages/pricing-page': '/admin/pages/pricing-page.html',
        r'/admin/pages/contact-page': '/admin/pages/contact-page.html',
        r'/admin/pages/blog-page': '/admin/pages/blogs-page.html', # Note: 'blog-page' vs 'blogs-page.html'
        r'/admin/pages/terms-page': '/admin/pages/terms-page.html',
        r'/admin/pages/policy-page': '/admin/pages/policy-page.html',
        
        # Custom Pages
        r'/admin/custom-pages/': '/admin/custom-pages/index.html',
        r'/admin/create/custom-page/': '/admin/custom-pages/create.html',
        
        # Blog
        r'/admin/blogs': '/admin/blogs/blog-list.html',
        r'/admin/blog/create': '/admin/blogs/create-blog.html',
        r'/admin/blog-category': '/admin/blogs/blog-category.html',
        
        # Project
        r'/admin/projects': '/admin/project/project-list.html',
        r'/admin/project/create': '/admin/project/create-project.html',
        r'/admin/project-category': '/admin/project/project-category.html',
        
        # Service
        r'/admin/services': '/admin/services/service-list.html',
        r'/admin/service/create': '/admin/services/create-service.html',
        
        # Elements
        r'/admin/element/sliders': '/admin/elements/slider.html',
        r'/admin/element/fun-facts': '/admin/elements/fun-fact.html',
        r'/admin/element/clients': '/admin/elements/clients.html',
        r'/admin/element/testimonials': '/admin/elements/testmonials.html',
        r'/admin/element/teams': '/admin/elements/team-members.html',
        r'/admin/element/pricings': '/admin/elements/pricing.html',
        
        # Element Create (Missing files -> Redirect to List for now to avoid 404)
        r'/admin/element/slider/create': '/admin/elements/slider.html',
        r'/admin/element/pricing/create': '/admin/elements/pricing.html',
        # ... logic for others if present
        
        # Users
        r'/admin/users/user-list/': '/admin/users/users-list.html',
        r'/admin/user/create': '/admin/users/create-user.html',
        
        # Form Data (Paths with spaces need %20 or handling)
        r'/admin/contacts': '/admin/form%20data/contact-form.html',
        r'/admin/subscribers': '/admin/form%20data/subscriber.html',
        
        # Menus
        r'/admin/menus/primary-menu': '/admin/menus/primary-menu.html',
        r'/admin/menus/sub-menu': '/admin/menus/sub-menu.html',
        r'/admin/primary-menu/create': '/admin/menus/create-primary-menu.html',
        
        # Settings
        r'/admin/settings/website-settings': '/admin/settings/website-settings.html',
        r'/admin/settings/template-settings': '/admin/settings/template-settings.html',
        r'/admin/settings/header-footer': '/admin/settings/header-footer-setting.html', # Check file name!
        r'/admin/settings/seo': '/admin/settings/SEO.html',
        
        # Marketing (Spaces)
        r'/admin/marketing/email-marketing/': '/admin/marketing%20tools/email-marketing.html',
        r'/admin/marketing/sms-marketing/': '/admin/marketing%20tools/sms-marketing.html',
        r'/admin/marketing/email-formator/': '/admin/marketing%20tools/email-formator.html',
        r'/admin/marketing/number-formator/': '/admin/marketing%20tools/number-fomator.html', # Check typo fomator
        
        # Auth
        r'/logout/': '/admin/login/index.html',
    }
    
    # Specific adjustment for "header-footer"
    # File list says: admin/settings/header-footer-setting.html
    # My dict above covers it.

    # Specific adjustment for "number-fomator"
    # File list says: admin/marketing tools/number-fomator.html (fomator typo)
    # My dict above covers it.

    # Specific adjustment: "admin/pages/blogs-page.html" vs "blog-page" link
    
    count_files = 0
    count_replacements = 0

    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".html"):
                filepath = os.path.join(dirpath, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    
                    for old_path, new_path in replacements.items():
                        # Regex to match href="OLD_PATH" or href='OLD_PATH'
                        # We use \b boundary or quotes to ensure exactness?
                        # Pattern: href=["']OLD_PATH["'] (optional trailing slash handled by OLD_PATH usually)
                        
                        # We must be careful not to replace substrings incorrectly
                        # But these paths are quite specific.
                        
                        # Pattern: href="<old_path>"
                        pattern = r'href=["\']' + re.escape(old_path) + r'(?:/)?["\']'
                        # Replacement: href="<new_path>"
                        
                        def replace_func(match):
                            # Quote used in match
                            quote = match.group(0)[5] # href="...
                            return f'href={quote}{new_path}{quote}'
                            
                        # Perform substitution
                        new_content, n = re.subn(pattern, replace_func, new_content)
                        count_replacements += n

                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        # print(f"Updated {filename}")
                        pass
                    count_files += 1
                        
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")
                    traceback.print_exc()

    print(f"Processed {count_files} files.")
    print(f"Made {count_replacements} replacements.")

if __name__ == "__main__":
    fix_sidebar_links("/home/akubrecah/Desktop/jail/admin")
