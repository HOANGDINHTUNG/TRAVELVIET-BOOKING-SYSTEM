import re
import glob
import os

sql_file = r"d:\Documents\WED_SERVICE\travelviet-booking-system\backend\src\main\resources\db\migration\V1__tables.sql"
out_file = r"C:\Users\Admin\.gemini\antigravity\brain\f6fc655d-d3f5-41b7-b823-99b48801f9d9\table3.md"
java_dir = r"d:\Documents\WED_SERVICE\travelviet-booking-system\backend\src\main\java\com\wedservice\backend\module"

# Find table to entity mappings
table_to_entity = {}
for root, dirs, files in os.walk(java_dir):
    for f in files:
        if f.endswith(".java"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                content = file.read()
                match = re.search(r'@Table\(name\s*=\s*"([^"]+)"', content)
                if match:
                    table_name = match.group(1)
                    table_to_entity[table_name] = f.replace(".java", "")

with open(sql_file, "r", encoding="utf-8") as f:
    sql_content = f.read()

# Extract CREATE TABLE blocks
# Regex finds CREATE TABLE [IF NOT EXISTS] table_name ( ... )
table_regex = re.compile(r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)\s*\((.*?)\)\s*(?:ENGINE|;)", re.IGNORECASE | re.DOTALL)
matches = table_regex.findall(sql_content)

out = []
out.append("### BẢNG 3: ĐẶC TẢ CHI TIẾT CƠ SỞ DỮ LIỆU & QUAN HỆ CÁC BẢNG\n\n")

for table_name, columns_str in matches:
    entity = table_to_entity.get(table_name, "Chưa xác định")
    out.append(f"#### Bảng: `{table_name}`\n")
    out.append(f"**Entity Java:** `{entity}`\n\n")
    out.append(f"| Tên Trường (Field) | Kiểu Dữ Liệu | Ràng buộc | Mô tả chức năng |\n")
    out.append(f"|--------------------|--------------|-----------|-----------------|\n")
    
    # Simple split by comma, but need to be careful with commas inside types like DECIMAL(10,2) or ENUM('a','b')
    # A naive approach: replace commas inside parens with a special char before split
    
    def repl(m):
        return m.group(0).replace(",", "|||")
    
    columns_escaped = re.sub(r"\([^)]*\)", repl, columns_str)
    lines = columns_escaped.split(",")
    for line in lines:
        line = line.replace("|||", ",").strip()
        if not line or line.startswith("CONSTRAINT") or line.startswith("PRIMARY KEY") or line.startswith("UNIQUE") or line.startswith("KEY "):
            continue
            
        parts = line.split(maxsplit=2)
        if len(parts) >= 2:
            field = parts[0].strip()
            dtype = parts[1].strip()
            rest = parts[2] if len(parts) > 2 else ""
            
            # extract comment
            desc = ""
            if "--" in rest:
                rest, desc = rest.split("--", 1)
            elif "COMMENT" in rest:
                cmt_match = re.search(r"COMMENT\s+'([^']+)'", rest, re.IGNORECASE)
                if cmt_match:
                    desc = cmt_match.group(1)
            
            constraints = []
            if "PRIMARY KEY" in rest.upper(): constraints.append("PK")
            if "UNIQUE" in rest.upper(): constraints.append("Unique")
            if "NOT NULL" in rest.upper(): constraints.append("NOT NULL")
            if "DEFAULT" in rest.upper(): constraints.append("Default")
            if "AUTO_INCREMENT" in rest.upper(): constraints.append("Auto Inc")
            
            cons_str = ", ".join(constraints) if constraints else "Nullable"
            
            out.append(f"| `{field}` | `{dtype}` | {cons_str} | {desc.strip()} |\n")
    
    out.append("\n**Chú thích quan hệ logic:**\n")
    out.append("- [Mô tả tự động: bảng này thuộc hệ thống, các khóa ngoại chưa xử lý bằng script, xin chờ audit chi tiết ngầm định]\n\n")

with open(out_file, "w", encoding="utf-8") as f:
    f.write("".join(out))
