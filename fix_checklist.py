import re

file_path = r'backend\src\main\resources\db\migration\V7__seed_data.sql'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix tour_checklist_items
def repl_checklist(match):
    cols = match.group(1)
    values_block = match.group(2)
    
    # replace column names
    cols = cols.replace('item_text', 'item_name').replace(', sort_order', '')
    
    # regex to strip the last value from each tuple: (..., ..., FALSE, 0) -> (..., ..., FALSE)
    # The tuples are like (1,'Mang giấy tờ...',FALSE,0)
    values_block = re.sub(r'(\([^)]+?),[^,)]+\)', r'\1)', values_block)
    
    return f"INSERT IGNORE INTO tour_checklist_items ({cols}) VALUES\n{values_block.strip()};"

text = re.sub(r'INSERT IGNORE INTO tour_checklist_items \(([^)]+)\)\s*VALUES\s*([\s\S]*?)(?=;)', repl_checklist, text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed tour_checklist_items!')
