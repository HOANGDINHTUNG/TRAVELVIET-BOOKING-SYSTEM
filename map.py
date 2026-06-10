import re

c = open(r'backend\src\main\resources\db\migration\V7__seed_data.sql', encoding='utf-8').read()

m = re.search(r'(?si)INSERT IGNORE INTO destinations.*?VALUES\s*(.*?);', c)
if m:
    lines = m.group(1).split('),')
    dest_map = {}
    for l in lines:
        match = re.search(r"\((\d+),\s*'[^']*',\s*'[^']*',\s*'([^']*)'", l)
        if match:
            dest_map[match.group(2)] = match.group(1)
            
    # Now read tours.txt
    t_lines = open('tours.txt', encoding='utf-8').readlines()
    for l in t_lines:
        if l.startswith('('):
            tour_m = re.search(r"\((\d+),'[^']*',\s*'([^']*)'", l)
            if tour_m:
                print(f"Tour {tour_m.group(1)}: {tour_m.group(2)}")
