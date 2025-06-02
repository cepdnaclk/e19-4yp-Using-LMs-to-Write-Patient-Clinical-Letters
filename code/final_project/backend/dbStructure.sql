CREATE DATABASE IF NOT EXISTS fyp;
USE fyp;

CREATE TABLE IF NOT EXISTS User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(30),
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Patient (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) UNIQUE,
    birthdate DATE
);

CREATE TABLE IF NOT EXISTS History (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    date DATE,
    details VARCHAR(1000),
    letter_link VARCHAR(200),
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
);

CREATE TABLE IF NOT EXISTS Doctorandpatient (
    dp_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    user_id INT,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);
