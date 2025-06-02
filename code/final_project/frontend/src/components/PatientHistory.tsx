"use client";

import React, { useState, useEffect } from "react";
import { patientApi } from "../app/api/apiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faCalendarAlt,
  faSearch,
  faEye,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

const PatientHistory = () => {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [historyRecords, setHistoryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Mock patient data for search
  const patients = [
    { id: "P-1001", name: "Alice Johnson" },
    { id: "P-1002", name: "Bob Smith" },
    { id: "P-1003", name: "Carol Williams" },
    { id: "P-1004", name: "David Brown" },
    { id: "P-1005", name: "Eva Davis" },
  ];

  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    // Set default dates if not set
    if (!startDate) {
      const defaultStartDate = new Date();
      defaultStartDate.setMonth(defaultStartDate.getMonth() - 3); // 3 months ago
      setStartDate(defaultStartDate.toISOString().split("T")[0]);
    }

    if (!endDate) {
      const defaultEndDate = new Date();
      setEndDate(defaultEndDate.toISOString().split("T")[0]);
    }
  }, []);

  const handleSearch = (query) => {
    if (!query) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // In a real integration, this would call the backend API
    // try {
    //   const results = await patientApi.searchPatients(query);
    //   setSearchResults(results);
    //   setShowSearchResults(true);
    // } catch (err) {
    //   console.error('Error searching patients:', err);
    //   setError('Failed to search patients. Please try again.');
    // }

    // For now, filter the mock data
    const results = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
        patient.id.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const selectPatient = (patient) => {
    setPatientId(patient.id);
    setPatientName(patient.name);
    setShowSearchResults(false);
    setHistoryRecords([]); // Clear previous records
    setSelectedRecord(null); // Clear selected record
  };

  const fetchHistory = async () => {
    if (!patientId) {
      setError("Please select a patient first.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real integration, this would call the backend API
      // const response = await patientApi.getPatientHistory(patientId, startDate, endDate);
      // setHistoryRecords(response);

      // Mock data
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      setHistoryRecords([
        {
          id: "H-1001",
          date: "2025-06-01",
          type: "Consultation",
          details:
            "Patient presented with symptoms of seasonal allergies. Prescribed antihistamines and nasal spray.",
          doctor: "Dr. Smith",
        },
        {
          id: "H-1002",
          date: "2025-05-15",
          type: "Follow-up",
          details:
            "Follow-up appointment for previous respiratory infection. Symptoms have resolved, no further treatment needed.",
          doctor: "Dr. Johnson",
        },
        {
          id: "H-1003",
          date: "2025-04-22",
          type: "Prescription",
          details:
            "Renewed prescription for blood pressure medication. Patient reports good control of blood pressure with current dosage.",
          doctor: "Dr. Smith",
        },
        {
          id: "H-1004",
          date: "2025-03-10",
          type: "Referral",
          details:
            "Referred to dermatologist for evaluation of persistent skin rash on forearms.",
          doctor: "Dr. Wilson",
        },
        {
          id: "H-1005",
          date: "2025-02-05",
          type: "Lab Results",
          details:
            "Annual blood work results reviewed. All values within normal range except slightly elevated cholesterol.",
          doctor: "Dr. Smith",
        },
      ]);

      // Set the first record as selected by default
      setSelectedRecord({
        id: "H-1001",
        date: "2025-06-01",
        type: "Consultation",
        details:
          "Patient presented with symptoms of seasonal allergies. Prescribed antihistamines and nasal spray.",
        doctor: "Dr. Smith",
      });
    } catch (err) {
      console.error("Error fetching patient history:", err);
      setError("Failed to fetch patient history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const viewRecord = (record) => {
    setSelectedRecord(record);
  };

  const downloadRecord = (record) => {
    // In a real integration, this would call the backend API to get PDF
    // For now, just show an alert
    alert(`Downloading record ${record.id} for ${patientName}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Patient History</h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search patient by name or ID"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto">
                {searchResults.map((patient) => (
                  <div
                    key={patient.id}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => selectPatient(patient)}
                  >
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-500">{patient.id}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="text-gray-400"
                  />
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="text-gray-400"
                  />
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient ID
            </label>
            <input
              type="text"
              value={patientId}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient Name
            </label>
            <input
              type="text"
              value={patientName}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              readOnly
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchHistory}
              disabled={!patientId || isLoading}
              className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                !patientId || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center`}
            >
              <FontAwesomeIcon icon={faHistory} className="mr-2" />
              {isLoading ? "Loading..." : "Fetch History"}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <svg
              className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-lg font-medium text-gray-700">
              Loading patient history...
            </span>
          </div>
        )}

        {!isLoading && historyRecords.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              History Records
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Doctor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historyRecords.map((record) => (
                    <tr
                      key={record.id}
                      className={`hover:bg-gray-50 ${
                        selectedRecord && selectedRecord.id === record.id
                          ? "bg-blue-50"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.doctor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          onClick={() => viewRecord(record)}
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-1" />
                          View
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => downloadRecord(record)}
                        >
                          <FontAwesomeIcon icon={faDownload} className="mr-1" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedRecord && (
              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  Selected Record Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-700">
                    {selectedRecord.details}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {!isLoading && historyRecords.length === 0 && patientId && (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No history records
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No history records found for this patient in the selected date
              range.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;
