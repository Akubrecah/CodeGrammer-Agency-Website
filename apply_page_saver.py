
import os
import re

def apply_page_saver(root_dir):
    # Regex to find the generic "Demo Mode" script (if any left) or the Inline Supabase script
    # Matches <script type="module">import { supabase } ... </script>
    regex_inline_script = re.compile(
        r'<script type="module">\s*import \{ supabase \} from [^<]+</script>',
        re.DOTALL
    )

    # Regex to find Demo Alert Styles
    # Matches <style>.demo-alert \{[^<]+</style>
    regex_styles = re.compile(
        r'<style>\s*\.demo-alert\s*\{[^<]+</style>',
        re.DOTALL
    )

    # Regex to find existing inject
    regex_existing_inject = re.compile(
        r'<script type="module" src="/admin/assets/js/page-saver.js"></script>'
    )
    
    inject_tag = '\n<script type="module" src="/admin/assets/js/page-saver.js"></script>\n'

    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".html"):
                filepath = os.path.join(dirpath, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    
                    # 1. Remove Inline Supabase Script (Clean up home-page.html)
                    if regex_inline_script.search(new_content):
                        print(f"Removing Inline Script from: {filename}")
                        new_content = regex_inline_script.sub("", new_content)

                    # 2. Remove Demo Alert Styles (Clean up home-page.html)
                    if regex_styles.search(new_content):
                        print(f"Removing Demo Styles from: {filename}")
                        new_content = regex_styles.sub("", new_content)

                    # 3. Inject Script (if not present)
                    if not regex_existing_inject.search(new_content):
                        if "</body>" in new_content:
                            print(f"Injecting Page Saver into: {filename}")
                            new_content = new_content.replace("</body>", inject_tag + "</body>")
                        else:
                            print(f"Warning: No </body> tag in {filename}")

                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

if __name__ == "__main__":
    apply_page_saver("/home/akubrecah/Desktop/jail/admin/pages")
