import re
file_path = r'backend\src\main\resources\db\migration\V7__seed_data.sql'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace column names
text = re.sub(r'INSERT IGNORE INTO tour_seasonality \([^)]+\)',
              'INSERT IGNORE INTO tour_seasonality (\n    tour_id, month_from, month_to, season_name, notes\n)', text)

# Try removing orphan text using flexible spaces
text = re.sub(r'follow the live itinerary from operations\)\.\'\s*\);', '', text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed successfully using regex.')
