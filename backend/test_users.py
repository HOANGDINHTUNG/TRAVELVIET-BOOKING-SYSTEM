import urllib.request
import urllib.parse
import json

def fetch_api():
    try:
        # First query local DB directly using mysql connector
        import mysql.connector
        conn = mysql.connector.connect(host='127.0.0.1', user='wed_app_user', password='123456', database='wedservice', port=3307)
        cursor = conn.cursor()
        cursor.execute("SELECT u.email FROM users u JOIN user_roles hr ON u.id = hr.user_id JOIN roles r ON r.id = hr.role_id WHERE r.code = 'SUPER_ADMIN'")
        admin_email = cursor.fetchone()[0]
        print(f"Found admin email: {admin_email}")
        
        # Login
        req = urllib.request.Request('http://localhost:8088/api/v1/auth/login', 
            data=json.dumps({"email": admin_email, "password": "password123"}).encode('utf-8'),
            headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as response:
            token = json.loads(response.read().decode('utf-8'))['data']['accessToken']
            print("Logged in!")
            
        # GET /users?roleCode=USER
        try:
            req = urllib.request.Request('http://localhost:8088/api/v1/users?roleCode=USER&page=0&size=10', 
                headers={'Authorization': f'Bearer {token}'})
            with urllib.request.urlopen(req) as response:
                users = json.loads(response.read().decode('utf-8'))
                print("Users response:", users)
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            print(f"GET Users Failed! Status: {e.code}, Error: {error_body}")
            
    except Exception as e:
        print("Script error:", e)

fetch_api()
