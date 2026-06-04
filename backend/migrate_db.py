import sqlite3

def run_migration():
    conn = sqlite3.connect("subsync.db")
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN security_question VARCHAR")
        cursor.execute("ALTER TABLE users ADD COLUMN security_answer VARCHAR")
        cursor.execute("ALTER TABLE users ADD COLUMN is_email_verified INTEGER DEFAULT 0")
        cursor.execute("ALTER TABLE users ADD COLUMN email_otp VARCHAR")
    except sqlite3.OperationalError:
        pass
        
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN reset_token VARCHAR")
    except sqlite3.OperationalError:
        pass
        
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN reset_token_expiry DATETIME")
        conn.commit()
        print("Migration successful")
    except sqlite3.OperationalError as e:
        print("Migration error (might already exist):", e)
    finally:
        conn.close()

run_migration()
