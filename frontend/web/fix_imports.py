import re
import os

src_dir = r"d:\Documents\WED_SERVICE\travelviet-booking-system\frontend\web\src"

# Fix @/module/management imports
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            modified = False
            
            if '@/module/management/schedules/utils/currency' in content:
                content = content.replace('@/module/management/schedules/utils/currency', '@/utils/currency')
                modified = True
                
            if modified:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)

# Use absolute alias imports for utils instead of mapping relative paths over and over which caused errors.
# We will replace all `../../../something/utils/currency` with `@/utils/currency` globally.
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            orig_content = content
            # Fix systemShared
            content = re.sub(r'from [\'"][\./]+utils/systemShared[\'"]', "from '@/utils/systemShared'", content)
            
            # Fix currency
            content = re.sub(r'from [\'"][\./]+utils/currency[\'"]', "from '@/utils/currency'", content)

            # Fix scheduleStatus
            content = re.sub(r'from [\'"][\./]+utils/scheduleStatus[\'"]', "from '@/utils/scheduleStatus'", content)

            # Fix tour types
            content = re.sub(r'from [\'"][\./]+types/tour[\'"]', "from '@/types/tour'", content)

            # Fix schedule types
            content = re.sub(r'from [\'"][\./]+types/schedule[\'"]', "from '@/types/schedule'", content)
            
            if content != orig_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)

# Fix router/index.tsx lazyDashboardOverview
router_path = os.path.join(src_dir, 'router', 'index.tsx')
with open(router_path, 'r', encoding='utf-8') as f:
    r_content = f.read()
r_content = re.sub(r'const lazyDashboardOverview = [^;]+;', '', r_content)
with open(router_path, 'w', encoding='utf-8') as f:
    f.write(r_content)

print("Fixed imports")

