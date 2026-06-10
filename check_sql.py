import re

file_path = r'backend\src\main\resources\db\migration\V7__seed_data.sql'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Look for missing commas between values: ')\n(' instead of '),\n('
missing_comma_pattern = re.compile(r'\)[ \t]*\n[ \t]*\(', re.MULTILINE)
matches = missing_comma_pattern.finditer(text)
print("Missing commas between tuples:")
for m in matches:
    start = max(0, m.start() - 50)
    end = min(len(text), m.end() + 50)
    print(text[start:end])
    print('---')

# 2. Look for trailing commas before semicolon: ',;'
trailing_comma_pattern = re.compile(r',[ \t]*\n?[ \t]*;', re.MULTILINE)
matches = trailing_comma_pattern.finditer(text)
print("\nTrailing commas before semicolon:")
for m in matches:
    start = max(0, m.start() - 50)
    end = min(len(text), m.end() + 50)
    print(text[start:end])
    print('---')

# 3. Look for unbalanced quotes
print("\nUnbalanced simple quotes on a line:")
lines = text.split('\n')
for i, line in enumerate(lines):
    # remove escaped quotes
    cleaned = line.replace("\\'", "")
    if cleaned.count("'") % 2 != 0:
        if "--" not in line:  # skip comments
            print(f"Line {i+1}: {line}")

