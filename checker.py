import os, re
issues = []
for root, dirs, files in os.walk('src/app/components'):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # split by className just for simpler scanning
            parts = content.split('className=')
            for i in range(1, len(parts)):
                c_str_match = re.search(r'^(?:\"(.*?)\"|\{.*?\"(.*?)\".*?\})', parts[i], flags=re.DOTALL)
                if not c_str_match:
                    continue
                c_str = c_str_match.group(1) or c_str_match.group(2)
                if not c_str:
                    continue
                    
                if 'bg-white' in c_str and 'dark:bg-' not in c_str:
                    issues.append(f'{file}: Missing dark:bg- for bg-white')
                if '#f0f1f5' in c_str and 'dark:bg-' not in c_str:
                    issues.append(f'{file}: Missing dark:bg- for bg-[#f0f1f5]')
                if '#20294c' in c_str and 'dark:text-' not in c_str:
                    issues.append(f'{file}: Missing dark:text- for text-[#20294c]')
                if '#676b89' in c_str and 'dark:text-' not in c_str:
                    issues.append(f'{file}: Missing dark:text- for text-[#676b89]')
                    
print("Scan Complete:", set(issues))
