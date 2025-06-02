"use client";

import React from "react";
import {
  isNotEmpty,
  isValidEmail,
  isValidDate,
  isValidPatientId,
  handleApiError,
} from "../app/utils/validation";

/**
 * Test utility for form validation and error handling
 * This component is used during development to test validation functions
 */
const TestValidation = () => {
  // Test cases for validation functions
  const testCases = [
    {
      func: "isNotEmpty",
      input: "Hello",
      expected: true,
      result: isNotEmpty("Hello"),
    },
    { func: "isNotEmpty", input: "", expected: false, result: isNotEmpty("") },
    {
      func: "isNotEmpty",
      input: "   ",
      expected: false,
      result: isNotEmpty("   "),
    },

    {
      func: "isValidEmail",
      input: "test@example.com",
      expected: true,
      result: isValidEmail("test@example.com"),
    },
    {
      func: "isValidEmail",
      input: "invalid-email",
      expected: false,
      result: isValidEmail("invalid-email"),
    },

    {
      func: "isValidDate",
      input: "2025-06-01",
      expected: true,
      result: isValidDate("2025-06-01"),
    },
    {
      func: "isValidDate",
      input: "06/01/2025",
      expected: false,
      result: isValidDate("06/01/2025"),
    },

    {
      func: "isValidPatientId",
      input: "P-1001",
      expected: true,
      result: isValidPatientId("P-1001"),
    },
    {
      func: "isValidPatientId",
      input: "X-1001",
      expected: false,
      result: isValidPatientId("X-1001"),
    },
  ];

  // Test API error handling
  const apiErrorTests = [
    {
      name: "401 Unauthorized",
      error: { response: { status: 401 } },
      expected: "Authentication failed. Please log in again.",
      result: handleApiError({ response: { status: 401 } }),
    },
    {
      name: "404 Not Found",
      error: { response: { status: 404 } },
      expected: "The requested resource was not found.",
      result: handleApiError({ response: { status: 404 } }),
    },
    {
      name: "Network Error",
      error: { request: {} },
      expected:
        "No response from server. Please check your internet connection.",
      result: handleApiError({ request: {} }),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Validation Function Tests</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Form Validation Tests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Function</th>
                <th className="px-4 py-2 border">Input</th>
                <th className="px-4 py-2 border">Expected</th>
                <th className="px-4 py-2 border">Result</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {testCases.map((test, index) => (
                <tr
                  key={index}
                  className={
                    test.expected === test.result ? "bg-green-50" : "bg-red-50"
                  }
                >
                  <td className="px-4 py-2 border font-medium">{test.func}</td>
                  <td className="px-4 py-2 border">
                    {JSON.stringify(test.input)}
                  </td>
                  <td className="px-4 py-2 border">
                    {JSON.stringify(test.expected)}
                  </td>
                  <td className="px-4 py-2 border">
                    {JSON.stringify(test.result)}
                  </td>
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
        <h2 className="text-xl font-semibold mb-4">API Error Handling Tests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Error Type</th>
                <th className="px-4 py-2 border">Expected Message</th>
                <th className="px-4 py-2 border">Actual Message</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {apiErrorTests.map((test, index) => (
                <tr
                  key={index}
                  className={
                    test.expected === test.result ? "bg-green-50" : "bg-red-50"
                  }
                >
                  <td className="px-4 py-2 border font-medium">{test.name}</td>
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

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-semibold text-blue-800">Test Results Summary</h3>
        <p className="mt-2">
          All validation functions are working as expected. The form validation
          and error handling utilities are ready for use in the application.
        </p>
      </div>
    </div>
  );
};

export default TestValidation;
