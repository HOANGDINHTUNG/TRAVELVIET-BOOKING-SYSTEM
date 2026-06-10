import re

file_path = r'backend\src\main\resources\db\migration\V7__seed_data.sql'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Delete price rules inserts
text = re.sub(r'INSERT IGNORE INTO schedule_price_rules \([^)]+\)\s*VALUES\s*([\s\S]*?)(?=;);', '', text)
text = re.sub(r'INSERT IGNORE INTO tour_price_rules \([^)]+\)\s*VALUES\s*([\s\S]*?)(?=;);', '', text)

# 2. Fix tour_schedule_guides
def repl_guides(match):
    cols = match.group(1).replace('role', 'guide_role').replace(', is_active', '')
    vals = match.group(2)
    vals = re.sub(r',\s*(?:TRUE|FALSE)\s*\)', ')', vals, flags=re.IGNORECASE)
    return f"INSERT IGNORE INTO tour_schedule_guides ({cols}) VALUES {vals};"
text = re.sub(r'INSERT IGNORE INTO tour_schedule_guides \(([^)]+)\)\s*VALUES\s*([\s\S]*?)(?=;);', repl_guides, text)

# 3. Fix tour_schedule_pickup_points
def repl_pickups(match):
    cols = match.group(1).replace('pickup_name', 'point_name').replace(', is_active', '')
    vals = match.group(2)
    vals = re.sub(r',\s*(?:TRUE|FALSE)\s*\)', ')', vals, flags=re.IGNORECASE)
    return f"INSERT IGNORE INTO tour_schedule_pickup_points ({cols}) VALUES {vals};"
text = re.sub(r'INSERT IGNORE INTO tour_schedule_pickup_points \(([^)]+)\)\s*VALUES\s*([\s\S]*?)(?=;);', repl_pickups, text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed successfully!')
