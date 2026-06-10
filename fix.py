import re

file_path = r'backend\src\main\resources\db\migration\V7__seed_data.sql'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = r'-- =====================================================================\n-- Seed dataset lon cho Hotels / Flights / Combos'
end_marker = r'-- =====================================================================\n-- 02_AUTH_PERMISSIONS'
target_marker = r'-- =====================================================================\n-- 07_COMBOS_HOTELS_FLIGHTS'

s = re.search(start_marker, text)
e = re.search(end_marker, text)
t = re.search(target_marker, text)

if s and e and t:
    block = text[s.start() : e.start()]
    text = text[:s.start()] + text[e.start():]
    t2 = re.search(target_marker, text)
    text = text[:t2.start()] + block + '\n' + text[t2.start():]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print('SUCCESS')
else:
    print('FAILED:', bool(s), bool(e), bool(t))
