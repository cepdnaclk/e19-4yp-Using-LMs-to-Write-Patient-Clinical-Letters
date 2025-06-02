CREATE DATABASE fyp;

USE fyp;

CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(30),
    password VARCHAR(255)
);

CREATE TABLE Patient(
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) UNIQUE,
    birthdate DATE
);

CREATE TABLE History(
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    date DATE,
    details VARCHAR(1000),
    letter_link VARCHAR(200),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);

CREATE TABLE Doctorandpatient (
    dp_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    user_id INT,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);
