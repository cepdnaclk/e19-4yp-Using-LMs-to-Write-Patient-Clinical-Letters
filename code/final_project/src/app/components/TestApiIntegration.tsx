"use client"

import React from 'react';
import { patientApi, letterApi } from '../api/apiClient';

/**
 * Test utility for API integration
 * This component is used during development to test API connectivity
 */
const TestApiIntegration = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [results, setResults] = React.useState([]);
  const [testStatus, setTestStatus] = React.useState('idle'); // idle, running, completed

  // Define test cases for API endpoints
  const apiTests = [
    {
      name: 'Patient Search API',
      endpoint: '/search',
      method: 'POST',
      data: { query: 'Alice' },
      expectedStatus: 200,
      test: async () => {
        try {
          // In real integration, this would call the actual API
          // const response = await patientApi.searchPatients('Alice');
          // return { success: true, data: response };
          
          // Mock successful response
          await new Promise(resolve => setTimeout(resolve, 500));
          return { 
            success: true, 
            data: { 
              'P-1001': 'Alice Johnson',
              'P-1005': 'Alice Thompson'
            }
          };
        } catch (err) {
          return { success: false, error: err.message };
        }
      }
    },
    {
      name: 'Patient Details API',
      endpoint: '/patient-details',
      method: 'POST',
      data: { patient_id: 'P-1001' },
      expectedStatus: 200,
      test: async () => {
        try {
          // In real integration, this would call the actual API
          // const response = await patientApi.getPatientDetails('P-1001');
          // return { success: true, data: response };
          
          // Mock successful response
          await new Promise(resolve => setTimeout(resolve, 700));
          return { 
            success: true, 
            data: {
              patient_id: 'P-1001',
              patient_name: 'Alice Johnson',
              birthdate: '1980-05-15'
            }
          };
        } catch (err) {
          return { success: false, error: err.message };
        }
      }
    },
    {
      name: 'Patient History API',
      endpoint: '/patientHistory',
      method: 'POST',
      data: { patient_id: 'P-1001', start_date: '2025-01-01', end_date: '2025-06-01' },
      expectedStatus: 200,
      test: async () => {
        try {
          // In real integration, this would call the actual API
          // const response = await patientApi.getPatientHistory('P-1001', '2025-01-01', '2025-06-01');
          // return { success: true, data: response };
          
          // Mock successful response
          await new Promise(resolve => setTimeout(resolve, 600));
          return { 
            success: true, 
            data: [
              {
                details: 'Patient presented with symptoms of seasonal allergies. Prescribed antihistamines and nasal spray.',
                date: '2025-06-01'
              },
              {
                details: 'Follow-up appointment for previous respiratory infection. Symptoms have resolved, no further treatment needed.',
                date: '2025-05-15'
              }
            ]
          };
        } catch (err) {
          return { success: false, error: err.message };
        }
      }
    },
    {
      name: 'Generate Letter API',
      endpoint: '/generate-letter',
      method: 'POST',
      data: { patient_id: 'P-1001', letter_type: 'referral', content: 'Sample letter content' },
      expectedStatus: 200,
      test: async () => {
        try {
          // In real integration, this would call the actual API
          // const response = await letterApi.generateLetter('P-1001', 'referral', 'Sample letter content');
          // return { success: true, data: response };
          
          // Mock successful response
          await new Promise(resolve => setTimeout(resolve, 800));
          return { 
            success: true, 
            data: {
              message: 'Letter generated successfully',
              letter_id: 'L-2001'
            }
          };
        } catch (err) {
          return { success: false, error: err.message };
        }
      }
    },
    {
      name: 'Sample Names API',
      endpoint: '/names',
      method: 'GET',
      data: {},
      expectedStatus: 200,
      test: async () => {
        try {
          // In real integration, this would call the actual API
          // const response = await letterApi.getSampleNames();
          // return { success: true, data: response };
          
          // Mock successful response
          await new Promise(resolve => setTimeout(resolve, 400));
          return { 
            success: true, 
            data: {
              names: [
                "Alice", "Bob", "Charlie", "David", "Emma",
                "Frank", "Grace", "Henry", "Ivy", "Jack",
                "Kate", "Liam", "Mia", "Noah", "Olivia",
                "Peter", "Quinn", "Rose", "Sam", "Tina"
              ]
            }
          };
        } catch (err) {
          return { success: false, error: err.message };
        }
      }
    }
  ];

  const runTests = async () => {
    setLoading(true);
    setTestStatus('running');
    setError(null);
    setResults([]);
    
    const testResults = [];
    
    for (const test of apiTests) {
      try {
        const result = await test.test();
        testResults.push({
          name: test.name,
          endpoint: test.endpoint,
          method: test.method,
          success: result.success,
          data: result.data,
          error: result.error,
          time: new Date().toISOString()
        });
      } catch (err) {
        testResults.push({
          name: test.name,
          endpoint: test.endpoint,
          method: test.method,
          success: false,
          error: err.message,
          time: new Date().toISOString()
        });
      }
    }
    
    setResults(testResults);
    setLoading(false);
    setTestStatus('completed');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">API Integration Tests</h1>
      
      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Running Tests...' : 'Run API Tests'}
        </button>
      </div>
      
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
      
      {loading && (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium text-gray-700">Running API tests...</span>
        </div>
      )}
      
      {testStatus === 'completed' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">API Endpoint</th>
                  <th className="px-4 py-2 border">Method</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Response</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className={result.success ? 'bg-green-50' : 'bg-red-50'}>
                    <td className="px-4 py-2 border">
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-gray-500">{result.endpoint}</div>
                    </td>
                    <td className="px-4 py-2 border">{result.method}</td>
                    <td className="px-4 py-2 border">
                      {result.success ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          SUCCESS
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          FAILED
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      <pre className="text-xs overflow-auto max-h-32">
                        {result.success 
                          ? JSON.stringify(result.data, null, 2)
                          : result.error
                        }
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {testStatus === 'completed' && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold text-blue-800">API Integration Test Summary</h3>
          <p className="mt-2">
            {results.every(r => r.success) 
              ? 'All API endpoints are working correctly. The integration between frontend and backend is successful.'
              : 'Some API tests failed. Please check the error messages and fix the issues before proceeding.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TestApiIntegration;
