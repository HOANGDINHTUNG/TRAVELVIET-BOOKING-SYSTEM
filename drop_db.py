import mysql.connector

try:
    db = mysql.connector.connect(host='127.0.0.1', port=3307, user='wed_app_user', password='123456', database='wedservice')
    cursor = db.cursor()
    cursor.execute('SET FOREIGN_KEY_CHECKS = 0')
    cursor.execute('SHOW TABLES')
    tables = [t[0] for t in cursor.fetchall()]
    for t in tables:
        cursor.execute(f'DROP TABLE IF EXISTS {t}')
    cursor.execute('SET FOREIGN_KEY_CHECKS = 1')
    db.commit()
    print('DB cleaned successfully.')
except Exception as e:
    print('Failed:', e)
