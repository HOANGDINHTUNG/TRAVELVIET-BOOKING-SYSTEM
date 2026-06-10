import re, subprocess

v7 = open(r'backend\src\main\resources\db\migration\V7__seed_data.sql', encoding='utf-8').read()

# Get all tables and columns from v7
tables_cols = {}
for m in re.finditer(r'INSERT (?:IGNORE )?INTO ([a-zA-Z0-9_]+)\s*\(([^)]+)\)', v7):
    table = m.group(1)
    cols = [c.strip().strip('') for c in m.group(2).split(',')]
    tables_cols[table] = cols

# Ask MySQL for the columns of each table
mismatches = []
for table, cols in tables_cols.items():
    try:
        res = subprocess.check_output(f'mysql -u wed_app_user -p123456 -h 127.0.0.1 -P 3307 wedservice -e "DESCRIBE {table};"', shell=True, text=True)
        valid_cols = []
        for line in res.strip().split('\n')[1:]:
            parts = line.split('\t')
            if parts:
                valid_cols.append(parts[0])
        
        for c in cols:
            if c not in valid_cols:
                mismatches.append(f"Table {table} Unknown Column: {c}")
                
    except subprocess.CalledProcessError:
        mismatches.append(f"Table {table} does not exist in DB!")

print("MISMATCHES:")
for m in set(mismatches):
    print(m)
print("DONE")
