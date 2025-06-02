import mysql.connector

mydb = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password = "12345",
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
