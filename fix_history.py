import re

file_path = r'backend\src\main\resources\db\migration\V7__seed_data.sql'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'INSERT IGNORE INTO (?:combo|flight|hotel)_booking_status_history \([^)]+\)\s*VALUES\s*([\s\S]*?)(?=;);', '', text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
