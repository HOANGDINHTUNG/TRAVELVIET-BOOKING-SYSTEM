import re

sql_file = r"d:\Documents\WED_SERVICE\travelviet-booking-system\backend\src\main\resources\db\migration\V1__tables.sql"
with open(sql_file, "r", encoding="utf-8") as f:
    content = f.read()

# Extract CREATE TABLE statements
tables = re.findall(r'CREATE TABLE (destinations?[a-z_]*) \((.*?)\);', content, re.DOTALL)
out = []
for t_name, t_cols in tables:
    out.append(f"Table: {t_name}")
    # clean cols
    lines = [l.strip() for l in t_cols.split('\n') if l.strip() and not l.strip().startswith('CONSTRAINT')]
    for l in lines:
        out.append(f"  - {l}")
    out.append("")

with open("dest_schema.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out))
    
print("Extracted schema")
