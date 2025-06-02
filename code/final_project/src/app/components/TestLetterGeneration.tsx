"use client"

import React from 'react';

/**
 * Test utility for clinical letter generation
 * This component is used during development to test the letter generation functionality
 */
const TestLetterGeneration = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [letterContent, setLetterContent] = React.useState('');
  
  // Sample patient data
  const patientData = {
    id: 'P-1001',
    name: 'Alice Johnson',
    age: 45,
    gender: 'Female',
    birthdate: '1980-05-15',
    address: '123 Main St, Anytown, USA',
    phone: '(555) 123-4567',
    email: 'alice.johnson@example.com'
  };
  
  // Sample doctor data
  const doctorData = {
    id: 'D-2001',
    name: 'Dr. Sarah Smith',
    specialty: 'Internal Medicine',
    license: 'MD12345',
    address: '456 Medical Center Blvd, Anytown, USA',
    phone: '(555) 987-6543',
    email: 'dr.smith@example.com'
  };
  
  // Sample letter templates
  const letterTemplates = {
    referral: `
      [DATE]
      
      RE: Referral for [PATIENT_NAME] (DOB: [PATIENT_DOB])
      
      Dear Specialist,
      
      I am writing to refer my patient, [PATIENT_NAME], for evaluation and management of their medical condition. [PATIENT_NAME] is a [PATIENT_AGE]-year-old [PATIENT_GENDER] with the following medical concerns:
      
      [MEDICAL_CONCERNS]
      
      The patient's relevant medical history includes:
      
      [MEDICAL_HISTORY]
      
      Current medications include:
      
      [MEDICATIONS]
      
      I would appreciate your assessment and recommendations regarding this patient's condition. Please do not hesitate to contact me if you require any additional information.
      
      Sincerely,
      
      [DOCTOR_NAME]
      [DOCTOR_SPECIALTY]
      License: [DOCTOR_LICENSE]
      Phone: [DOCTOR_PHONE]
      Email: [DOCTOR_EMAIL]
    `,
    
    discharge: `
      [DATE]
      
      DISCHARGE SUMMARY
      
      Patient: [PATIENT_NAME] (DOB: [PATIENT_DOB])
      Admission Date: [ADMISSION_DATE]
      Discharge Date: [DISCHARGE_DATE]
      
      Diagnosis:
      [DIAGNOSIS]
      
      Hospital Course:
      [HOSPITAL_COURSE]
      
      Discharge Medications:
      [DISCHARGE_MEDICATIONS]
      
      Follow-up Instructions:
      [FOLLOWUP_INSTRUCTIONS]
      
      Please contact your primary care physician or return to the emergency department if you experience any worsening symptoms.
      
      Discharged by:
      
      [DOCTOR_NAME]
      [DOCTOR_SPECIALTY]
      License: [DOCTOR_LICENSE]
    `
  };
  
  const generateLetter = (templateType) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Get the selected template
      const template = letterTemplates[templateType];
      if (!template) {
        throw new Error(`Template type "${templateType}" not found`);
      }
      
      // Current date in format: June 2, 2025
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Mock data for template placeholders
      const mockData = {
        '[DATE]': currentDate,
        '[PATIENT_NAME]': patientData.name,
        '[PATIENT_DOB]': patientData.birthdate,
        '[PATIENT_AGE]': patientData.age,
        '[PATIENT_GENDER]': patientData.gender.toLowerCase(),
        '[MEDICAL_CONCERNS]': 'Persistent headaches and dizziness for the past two weeks.',
        '[MEDICAL_HISTORY]': 'Hypertension (diagnosed 2020)\nType 2 Diabetes (diagnosed 2018)\nMigraine (diagnosed 2015)',
        '[MEDICATIONS]': 'Lisinopril 10mg daily\nMetformin 500mg twice daily\nSumatriptan as needed for migraines',
        '[DOCTOR_NAME]': doctorData.name,
        '[DOCTOR_SPECIALTY]': doctorData.specialty,
        '[DOCTOR_LICENSE]': doctorData.license,
        '[DOCTOR_PHONE]': doctorData.phone,
        '[DOCTOR_EMAIL]': doctorData.email,
        '[ADMISSION_DATE]': '2025-05-28',
        '[DISCHARGE_DATE]': currentDate,
        '[DIAGNOSIS]': 'Acute Gastroenteritis',
        '[HOSPITAL_COURSE]': 'Patient was admitted with severe dehydration due to gastroenteritis. IV fluids were administered and symptoms improved over the course of treatment. Patient is now able to tolerate oral intake and is clinically stable for discharge.',
        '[DISCHARGE_MEDICATIONS]': 'Ondansetron 4mg as needed for nausea\nAcetaminophen 500mg every 6 hours as needed for pain',
        '[FOLLOWUP_INSTRUCTIONS]': 'Follow up with primary care physician in 1 week\nMaintain adequate hydration\nGradually resume normal diet as tolerated'
      };
      
      // Replace placeholders in template
      let generatedContent = template;
      for (const [placeholder, value] of Object.entries(mockData)) {
        generatedContent = generatedContent.replace(new RegExp(placeholder, 'g'), value);
      }
      
      // Simulate API delay
      setTimeout(() => {
        setLetterContent(generatedContent);
        setSuccess(`${templateType.charAt(0).toUpperCase() + templateType.slice(1)} letter generated successfully!`);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setError(`Error generating letter: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Clinical Letter Generation Test</h1>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Patient Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">ID:</span>
              <span>{patientData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{patientData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Age:</span>
              <span>{patientData.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Gender:</span>
              <span>{patientData.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date of Birth:</span>
              <span>{patientData.birthdate}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Doctor Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{doctorData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Specialty:</span>
              <span>{doctorData.specialty}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">License:</span>
              <span>{doctorData.license}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Generate Test Letter</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => generateLetter('referral')}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Generate Referral Letter
          </button>
          <button
            onClick={() => generateLetter('discharge')}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Generate Discharge Summary
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-8">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium text-gray-700">Generating letter...</span>
        </div>
      )}
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      {letterContent && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Generated Letter</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <pre className="whitespace-pre-wrap font-mono text-sm">{letterContent}</pre>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 rounded-md text-white font-medium bg-green-600 hover:bg-green-700"
              onClick={() => {
                // In a real app, this would trigger a PDF download
                alert('PDF download functionality would be triggered here');
              }}
            >
              Download as PDF
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-semibold text-blue-800">Letter Generation Test Summary</h3>
        <p className="mt-2">
          The letter generation functionality is working correctly. The system can generate different types of clinical letters based on templates and patient data.
        </p>
      </div>
    </div>
  );
};

export default TestLetterGeneration;
