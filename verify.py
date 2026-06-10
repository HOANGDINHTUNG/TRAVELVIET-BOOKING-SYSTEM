import re

v1 = open(r'backend\src\main\resources\db\migration\V1__tables.sql', encoding='utf-8').read()
v7 = open(r'backend\src\main\resources\db\migration\V7__seed_data.sql', encoding='utf-8').read()

table_schemas = {}
# Strip comments
v1_clean = re.sub(r'--.*', '', v1)
for stmt in re.findall(r'CREATE TABLE IF NOT EXISTS\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*ENGINE', v1_clean, re.DOTALL):
    table = stmt[0].strip()
    cols_text = stmt[1]
    cols = []
    for line in cols_text.split('\n'):
        line = line.strip()
        if not line or line.startswith('CONSTRAINT') or line.startswith('UNIQUE') or line.startswith('KEY') or line.startswith('PRIMARY'): continue
        match = re.match(r'^?([a-zA-Z0-9_]+)?\s+', line)
        if match:
            cols.append(match.group(1))
    table_schemas[table] = cols

issues = []
for match in re.finditer(r'INSERT (?:IGNORE )?INTO\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)', v7):
    table = match.group(1)
    cols = [c.strip().strip('') for c in match.group(2).split(',')]
    if table in table_schemas:
        valid_cols = table_schemas[table]
        for c in cols:
            if c not in valid_cols:
                issues.append(f"Table '{table}' has unknown column '{c}'")

if not issues:
    print('ALL GOOD')
else:
    for i in set(issues): print(i)
