"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCalendarAlt,
  faFileAlt,
  faSave,
  faDownload,
  faComments,
  faMicrophone,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
import PatientDoctorChat from "./PatientDoctorChat";
import AudioRecorder from "./AudioRecorder";

// Import React-Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Message {
  id: string;
  sender: "patient" | "doctor";
  content: string;
  timestamp: Date;
}

interface AudioFile {
  id: string;
  name: string;
  url: string;
  duration: number;
  size: number;
  type: "recorded" | "uploaded";
  timestamp: Date;
}

const EnhancedLetterGenerator = () => {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [letterContent, setLetterContent] = useState("");
  const [letterType, setLetterType] = useState("referral");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // New state for messaging and audio integration
  const [showChatSection, setShowChatSection] = useState(false);
  const [showAudioSection, setShowAudioSection] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [includeConversation, setIncludeConversation] = useState(false);
  const [includeAudioSummary, setIncludeAudioSummary] = useState(false);

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

  const handleSearch = (query) => {
    if (!query) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // In a real integration, this would call the backend API
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
  };

  const handleMessagesChange = (newMessages: Message[]) => {
    setMessages(newMessages);
  };

  const handleAudioFilesChange = (newAudioFiles: AudioFile[]) => {
    setAudioFiles(newAudioFiles);
  };

  const generateConversationSummary = () => {
    if (messages.length === 0) return "";

    const patientMessages = messages.filter((m) => m.sender === "patient");
    const doctorMessages = messages.filter((m) => m.sender === "doctor");

    let summary = "\n\n--- PATIENT-DOCTOR CONVERSATION SUMMARY ---\n";
    summary += `Total Messages: ${messages.length} (Patient: ${patientMessages.length}, Doctor: ${doctorMessages.length})\n`;
    summary += `Conversation Date: ${new Date().toLocaleDateString()}\n\n`;

    summary += "CONVERSATION TRANSCRIPT:\n";
    messages.forEach((message, index) => {
      const time = message.timestamp.toLocaleTimeString();
      const sender = message.sender === "patient" ? "PATIENT" : "DOCTOR";
      summary += `${index + 1}. [${time}] ${sender}: ${message.content}\n`;
    });

    return summary;
  };

  const generateAudioSummary = () => {
    if (audioFiles.length === 0) return "";

    const totalDuration = audioFiles.reduce((total, file) => total + file.duration, 0);
    const totalSize = audioFiles.reduce((total, file) => total + file.size, 0);
    const recordedFiles = audioFiles.filter((f) => f.type === "recorded");
    const uploadedFiles = audioFiles.filter((f) => f.type === "uploaded");

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    let summary = "\n\n--- AUDIO SESSION SUMMARY ---\n";
    summary += `Total Audio Files: ${audioFiles.length}\n`;
    summary += `Recorded Files: ${recordedFiles.length}\n`;
    summary += `Uploaded Files: ${uploadedFiles.length}\n`;
    summary += `Total Duration: ${formatTime(Math.floor(totalDuration))}\n`;
    summary += `Total Size: ${formatFileSize(totalSize)}\n`;
    summary += `Session Date: ${new Date().toLocaleDateString()}\n\n`;

    summary += "AUDIO FILES LIST:\n";
    audioFiles.forEach((file, index) => {
      summary += `${index + 1}. ${file.name}\n`;
      summary += `   - Duration: ${formatTime(Math.floor(file.duration))}\n`;
      summary += `   - Size: ${formatFileSize(file.size)}\n`;
      summary += `   - Type: ${file.type}\n`;
      summary += `   - Timestamp: ${file.timestamp.toLocaleString()}\n\n`;
    });

    return summary;
  };

  const generateLetter = async () => {
    if (!patientId || !letterContent) {
      setError("Please select a patient and enter letter content.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let finalContent = letterContent;

      // Add conversation summary if requested
      if (includeConversation && messages.length > 0) {
        finalContent += generateConversationSummary();
      }

      // Add audio summary if requested
      if (includeAudioSummary && audioFiles.length > 0) {
        finalContent += generateAudioSummary();
      }

      // In a real integration, this would call the backend API with the enhanced content
      // await letterApi.generateLetter(patientId, letterType, finalContent, {
      //   includeConversation,
      //   includeAudioSummary,
      //   messages: includeConversation ? messages : [],
      //   audioFiles: includeAudioSummary ? audioFiles : []
      // });

      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("Enhanced letter generated successfully with additional data!");
    } catch (err) {
      console.error("Error generating letter:", err);
      setError("Failed to generate letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadLetter = async () => {
    if (!patientId || !letterContent) {
      setError("Please generate a letter first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real integration, this would call the backend API to get PDF
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Enhanced letter downloaded successfully!");
    } catch (err) {
      console.error("Error downloading letter:", err);
      setError("Failed to download letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["clean"],
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Enhanced Clinical Letter Generator
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={generateLetter}
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {loading ? "Processing..." : "Save Letter"}
          </button>
          <button
            onClick={downloadLetter}
            disabled={loading || !success}
            className={`bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center ${
              loading || !success ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Download PDF
          </button>
        </div>
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

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
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
                <FontAwesomeIcon icon={faUser} className="text-gray-400" />
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Letter Type
            </label>
            <select
              value={letterType}
              onChange={(e) => setLetterType(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="referral">Referral Letter</option>
              <option value="discharge">Discharge Summary</option>
              <option value="followup">Follow-up Letter</option>
              <option value="prescription">Prescription Letter</option>
              <option value="consultation">Consultation Note</option>
            </select>
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
              onChange={(e) => setPatientId(e.target.value)}
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
              onChange={(e) => setPatientName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Enhanced Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-md border">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faComments} className="text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Patient Conversation</p>
                  <p className="text-sm text-gray-600">{messages.length} messages</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeConversation}
                    onChange={(e) => setIncludeConversation(e.target.checked)}
                    className="mr-2"
                    disabled={messages.length === 0}
                  />
                  Include
                </label>
                <button
                  onClick={() => setShowChatSection(!showChatSection)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                >
                  <FontAwesomeIcon icon={showChatSection ? faTrash : faPlus} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-md border">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faMicrophone} className="text-red-600 mr-3" />
                <div>
                  <p className="font-medium">Audio Files</p>
                  <p className="text-sm text-gray-600">{audioFiles.length} files</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeAudioSummary}
                    onChange={(e) => setIncludeAudioSummary(e.target.checked)}
                    className="mr-2"
                    disabled={audioFiles.length === 0}
                  />
                  Include
                </label>
                <button
                  onClick={() => setShowAudioSection(!showAudioSection)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                >
                  <FontAwesomeIcon icon={showAudioSection ? faTrash : faPlus} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        {showChatSection && (
          <div className="mb-6">
            <PatientDoctorChat
              patientId={patientId}
              patientName={patientName}
              onMessagesChange={handleMessagesChange}
            />
          </div>
        )}

        {/* Audio Section */}
        {showAudioSection && (
          <div className="mb-6">
            <AudioRecorder onAudioFilesChange={handleAudioFilesChange} />
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Letter Content
          </label>
          <div className="border border-gray-300 rounded-md">
            <ReactQuill
              theme="snow"
              value={letterContent}
              onChange={setLetterContent}
              modules={modules}
              className="h-64"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </button>
          <button
            onClick={generateLetter}
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Generate Enhanced Letter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLetterGenerator;

