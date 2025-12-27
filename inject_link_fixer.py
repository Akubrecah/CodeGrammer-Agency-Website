
import os
import re

def inject_link_fixer(root_dir):
    inject_tag = '\n<script src="/admin/assets/js/link-fixer.js"></script>\n'
    regex_existing = re.compile(r'<script src="/admin/assets/js/link-fixer.js"></script>')

    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".html"):
                filepath = os.path.join(dirpath, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if not regex_existing.search(content):
                        if "</body>" in content:
                            print(f"Injecting Link Fixer into: {filepath}")
                            new_content = content.replace("</body>", inject_tag + "</body>")
                            
                            with open(filepath, 'w', encoding='utf-8') as f:
                                f.write(new_content)
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

if __name__ == "__main__":
    inject_link_fixer("/home/akubrecah/Desktop/jail/admin")
