
import os
import re

def fix_admin_files(root_dir):
    # regex for demo submit blocker
    r_demo_submit = re.compile(
        r"document\.addEventListener\('submit',\s*function\(event\)\s*\{[^}]*showDemoAlert\('Modifications are not allowed in demo mode\.'\);[^}]*\}\);", 
        re.DOTALL
    )
    # regex for demo delete blocker
    r_demo_click = re.compile(
        r"document\.addEventListener\('click',\s*function\(event\)\s*\{[^}]*showDemoAlert\('Deletion is not allowed in demo mode\.'\);[^}]*\}\);", 
        re.DOTALL
    )

    # scripts to inject
    script_fixer = '\n<script src="/admin/assets/js/link-fixer.js"></script>\n'
    script_saver = '\n<script type="module" src="/admin/assets/js/page-saver.js"></script>\n'

    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".html"):
                filepath = os.path.join(dirpath, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    
                    # 1. Remove Demo Blocker (Submit)
                    if r_demo_submit.search(new_content):
                        print(f"Removing Demo Submit Blocker from: {filename}")
                        new_content = r_demo_submit.sub("", new_content)
                    
                    # 2. Remove Demo Blocker (Click/Delete)
                    if r_demo_click.search(new_content):
                        print(f"Removing Demo Delete Blocker from: {filename}")
                        new_content = r_demo_click.sub("", new_content)

                    # 3. Inject Link Fixer (if missing)
                    if "link-fixer.js" not in new_content:
                        if "</body>" in new_content:
                            print(f"Injecting Link Fixer into: {filename}")
                            new_content = new_content.replace("</body>", script_fixer + "</body>")
                    
                    # 4. Inject Page Saver (if missing)
                    if "page-saver.js" not in new_content:
                         if "</body>" in new_content:
                            print(f"Injecting Page Saver into: {filename}")
                            new_content = new_content.replace("</body>", script_saver + "</body>")

                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                            
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

if __name__ == "__main__":
    fix_admin_files("/home/akubrecah/Desktop/jail/admin")
