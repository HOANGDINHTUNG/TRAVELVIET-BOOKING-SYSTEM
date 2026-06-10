file_path = r'backend\src\main\resources\db\migration\V7__seed_data.sql'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace column names for the tour_seasonality insert
search_str = '''INSERT IGNORE INTO tour_seasonality (
    tour_id, from_month, to_month, season_type, note        
)'''
replace_str = '''INSERT IGNORE INTO tour_seasonality (
    tour_id, month_from, month_to, season_name, notes        
)'''

if search_str in text:
    text = text.replace(search_str, replace_str)
    
# Wait, I also need to remove the orphaned L4029-4030 syntax error!
text = text.replace('follow the live itinerary from operations).\'\n);\n', '')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed V7 query columns and orphaned text.')
