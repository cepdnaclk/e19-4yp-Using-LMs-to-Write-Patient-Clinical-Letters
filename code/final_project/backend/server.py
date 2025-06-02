from flask import Flask, jsonify, request
import ollama
from werkzeug.security import generate_password_hash, check_password_hash
import logging
import mysql.connector
from settings import (
    DATABASE_USER,
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_PASSWORD,
    configure_cors
)
from flask_cors import CORS 
from createDB import initialize_database

# initialize database
initialize_database()

# app instance
app = Flask(__name__)

# Configure CORS
configure_cors(app)

mydb = mysql.connector.connect(
    host = DATABASE_HOST,
    user = DATABASE_USER,
    password = DATABASE_PASSWORD,
    database = DATABASE_NAME,
)

# Global variable to store patient data
patient_data = {}

def fetch_patient_data():
    """
    Fetch all patient IDs and patient names from the patient table
    and store them in the global patient_data dictionary.
    """
    global patient_data
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute("SELECT patient_id, patient_name FROM patient")
    patients = mycursor.fetchall()
    mycursor.close()
    
    patient_data = {patient['patient_id']: patient['patient_name'] for patient in patients}

# /api/home
@app.route("/api/home", methods=['GET'])
def return_home():
    return jsonify({
        'message': "Message delivered successfully"
    })

@app.route("/api/home", methods=['POST'])
def receive_data():
    data = request.json

    if 'patientName' in data:
        return jsonify({'patientName': data['patientName']})
    else:
        return jsonify({'error': 'Key not found in request'})

@app.route('/api/chat', methods=['POST'])
def chat():
    # Get the user input from the request
    prompt = request.json.get('prompt')

    # Call the OLLAMA chat function
    stream = ollama.chat(
        model='llama3',
        messages=[{'role': 'user', 'content': prompt}],
        stream=True,
    )

    # Process the stream and construct the response
    response = ''.join(chunk['message']['content'] for chunk in stream)

    return jsonify({'response': response})


@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('name')
    password = data.get('password')
    email = data.get('email')

    mycursor = mydb.cursor() 
    mycursor.execute("SELECT * FROM user WHERE name = %s", (username,))
    user = mycursor.fetchone()

    if user:
        return jsonify({"message": "User already exists"}), 400

    hashed_password = generate_password_hash(password)
    mycursor.execute("INSERT INTO user (name, password,email) VALUES (%s, %s, %s)", (username, hashed_password, email))
    mydb.commit()
    mycursor.close()

    return jsonify({"message": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    """
    Authenticate a user based on the provided email and password.

    Returns:
    - JSON response indicating whether the login was successful or not.
    """
    mycursor = mydb.cursor() 
    data = request.json
    email = data.get('email')
    password = data.get('password')

    mycursor.execute("SELECT * FROM user WHERE email = %s", (email,))
    user = mycursor.fetchone()

    if not user:
        return jsonify({"message": "User does not exist"}), 401
    elif not check_password_hash(user[2], password):
        return jsonify({"message": "Invalid password"}), 402

    mycursor.close()

    return jsonify({"message": "Login successful"}), 200

@app.route("/api/names", methods=['GET'])
def return_names():
    print("Returning demo names")
    demo_names = [
        "Alice", "Bob", "Charlie", "David", "Emma",
        "Frank", "Grace", "Henry", "Ivy", "Jack",
        "Kate", "Liam", "Mia", "Noah", "Olivia",
        "Peter", "Quinn", "Rose", "Sam", "Tina"
    ]

    # Ensure the array has exactly 20 elements
    demo_names = demo_names[:20]

    return jsonify({
        'names': demo_names
    })

@app.route('/api/search', methods=['POST'])
def search_patients():
    query = request.json.get('query', '').lower()
    if not query:
        return jsonify({"error": "No query provided"}), 400

    matched_patients = {pid: name for pid, name in patient_data.items() if query in str(pid).lower() or query in name.lower()}
    
    if not matched_patients:
        return jsonify({"error": "No match found"}), 404

    return jsonify(matched_patients)

@app.route('/api/patient-details', methods=['POST'])
def get_patient_details():
    patient_id = request.json.get('patient_id')

    if not patient_id:
        return jsonify({"error": "No patient_id provided"}), 400

    # Query to retrieve patient_name and birthdate
    mycursor = mydb.cursor()
    mycursor.execute("SELECT patient_name, birthdate FROM patient WHERE patient_id = %s", (patient_id,))
    patient = mycursor.fetchone()

    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    patient_name, birthdate = patient
    return jsonify({
        "patient_id": patient_id,
        "patient_name": patient_name,
        "birthdate": birthdate.strftime('%Y-%m-%d') if birthdate else None
    })


@app.route('/api/patientHistory',methods=['POST'])
def getPatientHistory():
    data = request.json
    name = data.get('patient_name')
    patient_id = data.get('patient_id')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    cursor = mydb.cursor(dictionary=True)

    # if name:
    #     query = "SELECT * FROM history WHERE name = %s"
    #     cursor.execute(query, (name,))
    if patient_id:
        query = "SELECT details, date FROM history WHERE patient_id = %s and date>= %s and date<= %s"
        cursor.execute(query, (patient_id, start_date, end_date,))
    else:
        return jsonify({'error': 'Invalid request'}), 400

    result = cursor.fetchall()
    return jsonify(result), 200

# Set up logging
logging.basicConfig(level=logging.DEBUG)


@app.route('/api/savePatientHistory',methods=['POST'])
def savePatientHistory():
    data = request.json
    patient_id = data.get('patient_id')
    details = data.get('historyDetails')
    date = data.get('date')

    cursor = mydb.cursor(dictionary=True)

    if patient_id and details:
        query = "INSERT INTO history (patient_id, date, details) VALUES (%s, %s, %s)"
        cursor.execute(query, (patient_id, date, details,))
    else:
        return jsonify({'error': 'Invalid request'}), 400

    mydb.commit()
    cursor.close()
    return jsonify({'message': 'History saved successfully'}), 200

@app.route('/api/patientData',methods=['POST'])
def getPatientData():
    data = request.json
    patient_name = data.get('patient_name')
    patient_id = data.get('patient_id')

    cursor = mydb.cursor(dictionary=True)

    if patient_name:
        query = "SELECT * FROM patient WHERE patient_name = %s"
        cursor.execute(query, (patient_name,))
    elif patient_id:
        query = "SELECT details FROM patient WHERE patient_id = %s"
        cursor.execute(query, (patient_id,))
    else:
        return jsonify({'error': 'Invalid request'}), 400

    result = cursor.fetchall()
    return jsonify(result), 200

@app.route('/api/addPatientData',methods=['POST'])
def addPatientData():
    data = request.json
    patient_name = data.get('patient_name')
    patient_id = data.get('patient_id')

    cursor = mydb.cursor(dictionary=True)

    if patient_name:
        query = "SELECT * FROM patient WHERE patient_name = %s"
        cursor.execute(query, (patient_name,))
    elif patient_id:
        query = "SELECT details FROM patient WHERE patient_id = %s"
        cursor.execute(query, (patient_id,))
    else:
        return jsonify({'error': 'Invalid request'}), 400

    result = cursor.fetchall()
    return jsonify(result), 200

if __name__ == "__main__":
    fetch_patient_data()
    app.run(debug=True, port=5001)