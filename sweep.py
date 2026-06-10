import re

def get_v1_schemas():
    v1 = open(r'backend\src\main\resources\db\migration\V1__tables.sql', encoding='utf-8').read()
    v1_clean = re.sub(r'--.*', '', v1)
    
    schemas = {}
    current_table = None
    cols = []
    
    for line in v1_clean.split('\n'):
        line = line.strip()
        if not line: continue
        
        m_start = re.search(r'CREATE TABLE IF NOT EXISTS\s+([a-zA-Z0-9_]+)', line)
        if m_start:
            current_table = m_start.group(1)
            cols = []
            continue
            
        if current_table and line.startswith(')'):
            schemas[current_table] = set(cols)
            current_table = None
            continue
            
        if current_table:
            # skip constraints
            if line.startswith('CONSTRAINT') or line.startswith('PRIMARY') or line.startswith('UNIQUE') or line.startswith('KEY') or line.startswith('FOREIGN'):
                continue
            
            m_col = re.match(r'^?([a-zA-Z0-9_]+)?\s+', line)
            if m_col:
                cols.append(m_col.group(1))
                
    return schemas

def check_v7(schemas):
    v7 = open(r'backend\src\main\resources\db\migration\V7__seed_data.sql', encoding='utf-8').read()
    mismatches = []
    for match in re.finditer(r'INSERT IGNORE INTO ([a-zA-Z0-9_]+)\s*\(([^)]+)\)', v7):
        table = match.group(1)
        cols = [c.strip().strip('') for c in match.group(2).split(',')]
        
        if table in schemas:
            for c in cols:
                if c not in schemas[table]:
                    mismatches.append(f"{table}: {c}")
        else:
            mismatches.append(f"UNKNOWN TABLE: {table}")
            
    return set(mismatches)

schemas = get_v1_schemas()
mismatches = check_v7(schemas)
for m in sorted(mismatches):
    print(m)
