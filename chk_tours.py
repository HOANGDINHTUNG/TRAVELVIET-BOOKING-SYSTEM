import re

c = open(r'backend\src\main\resources\db\migration\V7__seed_data.sql', encoding='utf-8').read()
tours_match = re.search(r'(?si)INSERT IGNORE INTO tours.*?VALUES\s*(.*?);', c)
if tours_match:
    print("Found tours insert")
    # let's write it to a test SQL file along with destinations to check what's wrong
