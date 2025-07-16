"use client";

import React, { useState } from "react";
import Layout from "../../components/Layout";
import PatientDoctorChat from "../../components/PatientDoctorChat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSearch } from "@fortawesome/free-solid-svg-icons";

interface Message {
  id: string;
  sender: "patient" | "doctor";
  content: string;
  timestamp: Date;
}

const ConversationPage = () => {
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Mock patient data for search
  const patients = [
    { id: "P-1001", name: "Alice Johnson" },
    { id: "P-1002", name: "Bob Smith" },
    { id: "P-1003", name: "Carol Williams" },
    { id: "P-1004", name: "David Brown" },
    { id: "P-1005", name: "Eva Davis" },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setShowSearchResults(false);
      return;
    }

    // In a real integration, this would call the backend API
    const results = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
        patient.id.toLowerCase().includes(query.toLowerCase())
    );

    setShowSearchResults(results.length > 0);
  };

  const selectPatient = (patient: { id: string; name: string }) => {
    setSelectedPatient(patient);
    setShowSearchResults(false);
    setSearchQuery("");
    setMessages([]); // Clear previous messages when switching patients
  };

  const handleMessagesChange = (newMessages: Message[]) => {
    setMessages(newMessages);
  };

  const searchResults = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Patient-Doctor Conversation
          </h1>
          <div className="text-sm text-gray-600">
            {messages.length} message{messages.length !== 1 ? "s" : ""} in conversation
          </div>
        </div>

        {/* Patient Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Select Patient</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search patient by name or ID"
            />
            
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

          {selectedPatient && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUser} className="text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">
                  Selected Patient: {selectedPatient.name} ({selectedPatient.id})
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Component */}
        {selectedPatient ? (
          <PatientDoctorChat
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
            onMessagesChange={handleMessagesChange}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FontAwesomeIcon icon={faUser} className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Patient Selected
            </h3>
            <p className="text-gray-500">
              Please select a patient from the search above to start a conversation.
            </p>
          </div>
        )}

        {/* Conversation Summary */}
        {selectedPatient && messages.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Conversation Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {messages.filter((m) => m.sender === "patient").length}
                </div>
                <div className="text-sm text-blue-800">Patient Messages</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {messages.filter((m) => m.sender === "doctor").length}
                </div>
                <div className="text-sm text-green-800">Doctor Messages</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {messages.length}
                </div>
                <div className="text-sm text-gray-800">Total Messages</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ConversationPage;

