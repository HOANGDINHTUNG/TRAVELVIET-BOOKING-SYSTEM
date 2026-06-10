import re, subprocess

v7 = open(r'backend\src\main\resources\db\migration\V7__seed_data.sql', encoding='utf-8').read()

tables_cols = {}
for m in re.finditer(r'INSERT IGNORE INTO ([a-zA-Z0-9_]+)\s*\(([^)]+)\)', v7):
    table = m.group(1)
    cols = [c.strip().strip('') for c in m.group(2).split(',')]
    tables_cols[table] = cols
for m in re.finditer(r'INSERT INTO ([a-zA-Z0-9_]+)\s*\(([^)]+)\)', v7):
    table = m.group(1)
    cols = [c.strip().strip('') for c in m.group(2).split(',')]
    tables_cols[table] = cols

# Query all columns of wedservice at once
query = "SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.columns WHERE TABLE_SCHEMA='wedservice';"
cmd = f'mysql -u wed_app_user -p123456 -h 127.0.0.1 -P 3307 -e "{query}" -B'
out = subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.DEVNULL)

db_schema = {}
for line in out.strip().split('\n')[1:]:
    parts = line.split('\t')
    if len(parts) == 2:
        t, c = parts
        if t not in db_schema: db_schema[t] = set()
        db_schema[t].add(c)

mismatches = []
for t, cols in tables_cols.items():
    if t not in db_schema:
        mismatches.append(f"Table {t} does not exist!")
    else:
        for c in cols:
            if c not in db_schema[t]:
                mismatches.append(f"Table {t} Unknown Column: {c}")

with open('mismatches_db.txt', 'w', encoding='utf-8') as f:
    for m in sorted(set(mismatches)):
        f.write(m + '\n')
print("Done writing mismatches_db.txt")
