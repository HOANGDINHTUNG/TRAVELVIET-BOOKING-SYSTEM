with open(r'C:\Users\Admin\.gemini\antigravity\brain\f6fc655d-d3f5-41b7-b823-99b48801f9d9\table3.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
dests = []
in_dest = False
for line in lines:
    if line.startswith('#### Bảng: `destinations`') or line.startswith('#### Bảng: `destination_'):
        in_dest = True
        dests.append(line)
    elif line.startswith('#### Bảng: ') and not line.startswith('#### Bảng: `destination'):
        in_dest = False
    elif in_dest:
        dests.append(line)

with open(r'd:\Documents\WED_SERVICE\travelviet-booking-system\backend\dest_schema.md', 'w', encoding='utf-8') as out:
    out.write(''.join(dests))
print('Written')
