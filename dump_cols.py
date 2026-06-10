import subprocess
query = "SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.columns WHERE TABLE_SCHEMA='wedservice' AND TABLE_NAME IN ('schedule_price_rules', 'tour_price_rules', 'tour_schedule_guides');"
cmd = f'mysql -u wed_app_user -p123456 -h 127.0.0.1 -P 3307 -e "{query}" -B'
out = subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.DEVNULL)
with open('cols.txt', 'w') as f: f.write(out)
