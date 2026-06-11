import re
import csv
from io import StringIO

input_file = "src/main/resources/db/migration/V7__seed_data.sql"
output_file = "V7__seed_data_fixed.sql"

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# First, find the tours INSERT match
match = re.search(r'INSERT IGNORE INTO tours \((.*?)\) VALUES\s*(.*?);', content, re.DOTALL | re.IGNORECASE)
if not match:
    print("Could not find tours block.")
    exit(1)

columns_str = match.group(1).strip()
values_str = match.group(2).strip()

# Create a list to parse values
# We will replace `), (` with `\n` to process row by row using csv reader
# Wait, values are like `(1,'code'...),(2,'code'...)`
# Remove enclosing parens
values_str = values_str[1:-1]
lines = values_str.split('),')
clean_lines = []
for line in lines:
    line = line.strip()
    if line.startswith('('):
        line = line[1:]
    clean_lines.append(line)

new_values = []
tour_destinations = []

for line in clean_lines:
    # Use csv to split by comma, respecting quotes
    reader = csv.reader(StringIO(line), quotechar="'", skipinitialspace=True)
    row = next(reader)
    
    # row = [id, code, name, slug, destination_id, cancellation_policy_id, short_description, description, highlights, inclusions, exclusions, duration_days, max_group_size, min_age, base_price, currency, trip_mode, status, is_featured]
    # Indices:
    # 0: id
    # 1: code
    # 2: name
    # 3: slug
    # 4: destination_id 
    # 11: duration_days
    
    tour_id = row[0]
    dest_id = row[4]
    duration_days = int(row[11])
    
    # Calculate nights
    if duration_days >= 2:
        duration_nights = duration_days - 1
    else:
        duration_nights = 0
        
    # Generate an attractive name
    old_name = row[2]
    # For example: (1,'TOUR_LOCAL_VN_001','Hà Nội 1N – Khám phá Hồ Hoàn Kiếm'...)
    # Replace to: "TOUR KHÁM PHÁ HỒ HOÀN KIẾM 1 NGÀY TỪ HÀ NỘI: TRẢI NGHIỆM VĂN HÓA ĐỊA PHƯƠNG"
    # Actually, a simple rule: uppercase it, append "TIÊU CHUẨN CAO CẤP" or something depending on is_featured
    # It must be like "TOUR ... X NGÀY Y ĐÊM..."
    # We will just write a simple transform:
    # "TOUR " + {main location} + " " + X NGÀY Y ĐÊM + ": " + {highlight}
    
    # We extract name parts
    parts = old_name.split(' – ')
    if len(parts) >= 2:
        loc_and_time = parts[0].strip() # "Hà Nội 1N"
        highlight = parts[1].strip() # "Khám phá Hồ Hoàn Kiếm"
        
        loc = loc_and_time.split(' ')[0:-1]
        loc = ' '.join(loc)
        if not loc:
            loc = "ĐIỂM ĐẾN NỔI BẬT"
            
        time_str = f"{duration_days} NGÀY"
        if duration_nights > 0:
            time_str += f" {duration_nights} ĐÊM"
            
        is_featured = row[18].upper() == 'TRUE'
        suffix = "NGHỈ DƯỠNG KHÁCH SẠN 5 SAO" if is_featured else "CHẤT LƯỢNG CAO"
        
        new_name = f"TOUR {loc.upper()} {time_str}: {highlight.upper()} - {suffix}"
    else:
        time_str = f"{duration_days} NGÀY"
        if duration_nights > 0:
            time_str += f" {duration_nights} ĐÊM"
        new_name = f"TOUR {old_name.upper()} {time_str} CAO CẤP"
        
    row[2] = new_name
    
    # Remove destination_id (index 4)
    del row[4]
    
    # Insert duration_nights after duration_days (which is now index 10 since we deleted 1)
    # wait, old duration_days index was 11. Now it is 10.
    row.insert(11, str(duration_nights))
    
    # Format values for SQL 
    # Strings need quotes, but wait, numbers and TRUE/FALSE shouldn't have quotes.
    # csv writes everything without distinction if we just use string.
    
    def quote_val(v, idx):
        if idx in [0, 4, 10, 11, 12, 13, 14, 18]: # Numbers and booleans
            # Wait, the indices shifted!
            # id(0), code(1), name(2), slug(3), cancellation_policy_id(4), short_description(5), description(6), highlights(7), inclusions(8), exclusions(9), duration_days(10), duration_nights(11), max_group_size(12), min_age(13), base_price(14), currency(15), trip_mode(16), status(17), is_featured(18)
            # Numbers/bool: 0, 4, 10, 11, 12, 13, 14, 18
            # BUT let's just check if it's digit or TRUE/FALSE
            if str(v).isdigit() or str(v).upper() in ['TRUE', 'FALSE']:
                return str(v)
        return "'" + str(v).replace("'", "\\'") + "'"
        
    formatted_row = ",".join([quote_val(v, i) for i, v in enumerate(row)])
    new_values.append(f"({formatted_row})")
    tour_destinations.append(f"({tour_id},{dest_id})")

new_cols = "id, code, name, slug, cancellation_policy_id, short_description, description, highlights, inclusions, exclusions, duration_days, duration_nights, max_group_size, min_age, base_price, currency, trip_mode, status, is_featured"

new_sql = "INSERT IGNORE INTO tours (\n    " + new_cols + "\n) VALUES\n"
new_sql += ",\n".join(new_values) + ";\n\n"

# Add tour_destinations
new_sql += "INSERT IGNORE INTO tour_destinations (tour_id, destination_id) VALUES\n"
new_sql += ",\n".join(tour_destinations) + ";\n"

# Replace the old block in content
new_content = content[:match.start()] + new_sql + content[match.end():]

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print("Successfully processed tours and generated V7__seed_data_fixed.sql")
