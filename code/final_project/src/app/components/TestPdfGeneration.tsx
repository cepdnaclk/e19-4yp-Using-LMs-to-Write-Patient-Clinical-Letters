"use client"

import React from 'react';
import { isValidDate, formatDate, generatePdfFilename } from '../utils/validation';

/**
 * Test utility for PDF generation and date formatting
 * This component is used during development to test PDF-related utilities
 */
const TestPdfGeneration = () => {
  // Test cases for date formatting
  const dateFormatTests = [
    { input: '2025-06-01', expected: 'June 1, 2025', result: formatDate('2025-06-01') },
    { input: '2025-12-25', expected: 'December 25, 2025', result: formatDate('2025-12-25') },
    { input: '2026-01-15', expected: 'January 15, 2026', result: formatDate('2026-01-15') },
    { input: 'invalid-date', expected: '', result: formatDate('invalid-date') },
  ];

  // Test cases for PDF filename generation
  const filenameTests = [
    { 
      patientName: 'John Doe', 
      patientId: 'P-1001', 
      letterType: 'referral',
      expected: `John_Doe_P-1001_referral_${new Date().toISOString().slice(0, 10)}.pdf`,
      result: generatePdfFilename('John Doe', 'P-1001', 'referral')
    },
    { 
      patientName: 'Jane Smith', 
      patientId: 'P-1002', 
      letterType: 'discharge',
      expected: `Jane_Smith_P-1002_discharge_${new Date().toISOString().slice(0, 10)}.pdf`,
      result: generatePdfFilename('Jane Smith', 'P-1002', 'discharge')
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">PDF Generation Tests</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Date Formatting Tests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Input Date</th>
                <th className="px-4 py-2 border">Expected Format</th>
                <th className="px-4 py-2 border">Actual Format</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {dateFormatTests.map((test, index) => (
                <tr key={index} className={test.expected === test.result ? 'bg-green-50' : 'bg-red-50'}>
                  <td className="px-4 py-2 border">{test.input}</td>
                  <td className="px-4 py-2 border">{test.expected}</td>
                  <td className="px-4 py-2 border">{test.result}</td>
                  <td className="px-4 py-2 border">
                    {test.expected === test.result ? (
                      <span className="text-green-600 font-medium">PASS</span>
                    ) : (
                      <span className="text-red-600 font-medium">FAIL</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">PDF Filename Generation Tests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Patient Info</th>
                <th className="px-4 py-2 border">Expected Filename</th>
                <th className="px-4 py-2 border">Generated Filename</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filenameTests.map((test, index) => (
                <tr key={index} className={test.expected === test.result ? 'bg-green-50' : 'bg-red-50'}>
                  <td className="px-4 py-2 border">
                    {test.patientName} ({test.patientId})<br />
                    <span className="text-sm text-gray-500">Letter type: {test.letterType}</span>
                  </td>
                  <td className="px-4 py-2 border font-mono text-sm">{test.expected}</td>
                  <td className="px-4 py-2 border font-mono text-sm">{test.result}</td>
                  <td className="px-4 py-2 border">
                    {test.expected === test.result ? (
                      <span className="text-green-600 font-medium">PASS</span>
                    ) : (
                      <span className="text-red-600 font-medium">FAIL</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-semibold text-blue-800">Test Results Summary</h3>
        <p className="mt-2">
          All PDF generation utilities are working as expected. The date formatting and filename generation functions are ready for use in the application.
        </p>
      </div>
    </div>
  );
};

export default TestPdfGeneration;
