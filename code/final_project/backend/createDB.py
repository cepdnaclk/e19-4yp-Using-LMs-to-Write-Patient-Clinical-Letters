import mysql.connector
from settings import (
    DATABASE_USER,
    DATABASE_HOST,
    DATABASE_PASSWORD
)

def initialize_database(sql_file_path='./dbStructure.sql'):
    try:
        # Connect to MySQL server (not to a specific database yet)
        mydb = mysql.connector.connect(
            host=DATABASE_HOST,
            user=DATABASE_USER,
            password=DATABASE_PASSWORD,
            autocommit=True  # optional, to auto-commit each DDL command
        )

        mycursor = mydb.cursor()

        # Read and split SQL script
        with open(sql_file_path, 'r') as file:
            sql_script = file.read()

        sql_commands = sql_script.split(';')

        for command in sql_commands:
            command = command.strip()
            if command:
                try:
                    mycursor.execute(command)
                except mysql.connector.Error as err:
                    print(f"Error executing command: {command}\n{err}\n")

        print("✅ SQL script executed successfully")

    except mysql.connector.Error as err:
        print(f"❌ Error connecting to MySQL: {err}")
    finally:
        if 'mycursor' in locals():
            mycursor.close()
        if 'mydb' in locals():
            mydb.close()