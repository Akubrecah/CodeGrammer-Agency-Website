
import os

ADMIN_DIR = '/home/akubrecah/Desktop/jail/admin'
TARGET_SCRIPT = '<script type="module" src="/admin/assets/js/auth-guard.js"></script>'

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # 1. Fix Assets
    content = content.replace('https://agency.thecodegrammer.net/static', '/static')
    content = content.replace('https://agency.thecodegrammer.net/media', '/media')

    # 2. Inject Auth Guard (if not present)
    if 'auth-guard.js' not in content:
        if '</body>' in content:
            content = content.replace('</body>', f'{TARGET_SCRIPT}\n</body>')
        else:
            content += f'\n{TARGET_SCRIPT}'

    if content != original_content:
        print(f"Updating {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

for root, dirs, files in os.walk(ADMIN_DIR):
    for file in files:
        if file.endswith('.html'):
            update_file(os.path.join(root, file))
