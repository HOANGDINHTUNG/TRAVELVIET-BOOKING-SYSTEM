import re

filepath = r"d:\Documents\WED_SERVICE\travelviet-booking-system\frontend\web\src\router\index.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False

for i, line in enumerate(lines):
    # Remove lazy management imports
    if "lazyManagement" in line and "const lazyManagement" in line:
        skip = True
    if skip and ");" in line:
        skip = False
        continue
    if skip:
        continue
        
    # Remove routes block manually for lines 344 to 496 (0-indexed 343 to 495)
    # Actually just string replace the huge block or do line based
    if 343 <= i <= 495:
        continue

    new_lines.append(line)

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Updated router index.")
