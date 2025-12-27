
import os
import re

def fix_files(root_dir):
    # Regex to match the Submit handler (Demo Mode)
    # Matches: // Handle all form submissions ... });
    regex_submit = re.compile(
        r"// Handle all form submissions\s+document\.addEventListener\('submit',\s*function\(event\)\s*\{\s*event\.preventDefault\(\);\s*showDemoAlert\('Modifications are not allowed in demo mode\.'\);\s*\}\);",
        re.DOTALL
    )

    # Regex to match the Delete handler (Demo Mode)
    # Matches: // Handle delete links ... });
    regex_delete = re.compile(
        r"// Handle delete links\s+document\.addEventListener\('click',\s*function\(event\)\s*\{\s*const link = event\.target\.closest\('a'\);\s*if \(link && link\.href && link\.href\.includes\('delete'\)\) \{\s*event\.preventDefault\(\);\s*showDemoAlert\('Deletion is not allowed in demo mode\.'\);\s*\}\s*\}\);",
        re.DOTALL
    )

    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(".html"):
                filepath = os.path.join(dirpath, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    
                    # Remove Submit Handler
                    if regex_submit.search(new_content):
                        print(f"Removing Submit Demo Block from: {filepath}")
                        new_content = regex_submit.sub("// Demo Submit Handler Removed", new_content)
                    
                    # Remove Delete Handler
                    if regex_delete.search(new_content):
                        print(f"Removing Delete Demo Block from: {filepath}")
                        new_content = regex_delete.sub("// Demo Delete Handler Removed", new_content)
                    
                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

if __name__ == "__main__":
    fix_files("/home/akubrecah/Desktop/jail/admin")
