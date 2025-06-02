import mysql.connector
from settings import (
    DATABASE_USER,
    DATABASE_HOST,
    DATABASE_PASSWORD
)


mydb = mysql.connector.connect(
    host = DATABASE_HOST,
    user = DATABASE_USER,
    password = DATABASE_PASSWORD,
)

mycursor = mydb.cursor() 

with open(r'.\dbStructure.sql', 'r') as file:
    sql_script = file.read()

# Split the script into individual statements
sql_commands = sql_script.split(';')

# Execute each command
for command in sql_commands:
    # Strip any leading/trailing whitespace
    command = command.strip()
    if command:
        mycursor.execute(command)

# Commit the changes to the database
mydb.commit()

print("SQL script executed successfully")

# Close the cursor and connection
mycursor.close()
mydb.close()
