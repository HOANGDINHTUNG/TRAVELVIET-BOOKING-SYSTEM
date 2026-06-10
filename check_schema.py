import re

v1 = open(r'backend\src\main\resources\db\migration\V1__tables.sql', encoding='utf-8').read()
v7 = open(r'backend\src\main\resources\db\migration\V7__seed_data.sql', encoding='utf-8').read()

# build a dictionary of table -> list of valid columns
table_schemas = {}
current_table = None
for line in v1.split('\n'):
    match = re.search(r'CREATE TABLE IF NOT EXISTS\s+([a-zA-Z0-9_]+)', line)
    if match:
        current_table = match.group(1)
        table_schemas[current_table] = []
    elif current_table and line.strip().startswith(')'):
        current_table = None
    elif current_table:
        # crude column parsing
        col_match = re.match(r'^\s*([a-zA-Z0-9_]+)\s+[A-Z]+', line)
        if col_match:
            col_name = col_match.group(1)
            if col_name.upper() not in ['CONSTRAINT', 'PRIMARY', 'UNIQUE', 'KEY', 'FOREIGN', 'CHECK']:
                table_schemas[current_table].append(col_name)

# Now check all INSERT statements in V7
issues = set()
for match in re.finditer(r'INSERT IGNORE INTO ([a-zA-Z0-9_]+)\s*\(([^)]+)\)', v7):
    table = match.group(1)
    cols = [c.strip() for c in match.group(2).split(',')]
    if table in table_schemas:
        valid_cols = table_schemas[table]
        for c in cols:
            if c not in valid_cols:
                issues.add(f"Table '{table}' has unknown column '{c}'")

for match in re.finditer(r'INSERT INTO ([a-zA-Z0-9_]+)\s*\(([^)]+)\)', v7):
    table = match.group(1)
    cols = [c.strip() for c in match.group(2).split(',')]
    if table in table_schemas:
        valid_cols = table_schemas[table]
        for c in cols:
            if c not in valid_cols:
                issues.add(f"Table '{table}' has unknown column '{c}'")

for i in issues:
    print(i)
