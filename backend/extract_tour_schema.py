import re

with open(r'C:\Users\Admin\.gemini\antigravity\brain\f6fc655d-d3f5-41b7-b823-99b48801f9d9\table3.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
out_lines = []
in_target = False
for line in lines:
    if line.startswith('#### Bảng: `tours`') or line.startswith('#### Bảng: `tour_'):
        in_target = True
        out_lines.append(line)
    elif line.startswith('#### Bảng: ') and not (line.startswith('#### Bảng: `tour') and not line.startswith('#### Bảng: `tour_')):
        if line.startswith('#### Bảng: `tours`') or line.startswith('#### Bảng: `tour_'):
            in_target = True
        else:
            in_target = False
    elif in_target:
        out_lines.append(line)

with open(r'd:\Documents\WED_SERVICE\travelviet-booking-system\backend\tour_schema.md', 'w', encoding='utf-8') as out:
    out.write(''.join(out_lines))
print('Extracted DB schema')
