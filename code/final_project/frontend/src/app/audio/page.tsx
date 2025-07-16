"use client";

import React, { useState } from "react";
import Layout from "../../components/Layout";
import AudioRecorder from "../../components/AudioRecorder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faSearch, 
  faFileAudio, 
  faDownload,
  faCalendarAlt 
} from "@fortawesome/free-solid-svg-icons";

interface AudioFile {
  id: string;
  name: string;
  url: string;
  duration: number;
  size: number;
  type: "recorded" | "uploaded";
  timestamp: Date;
}

const AudioPage = () => {
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
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
    setAudioFiles([]); // Clear previous audio files when switching patients
  };

  const handleAudioFilesChange = (newAudioFiles: AudioFile[]) => {
    setAudioFiles(newAudioFiles);
  };

  const exportAllAudio = () => {
    if (audioFiles.length === 0) return;

    // Create a summary text file
    const summaryText = [
      `Audio Files Summary for Patient: ${selectedPatient?.name || "Unknown"} (${selectedPatient?.id || "N/A"})`,
      `Generated on: ${new Date().toLocaleString()}`,
      `Total Files: ${audioFiles.length}`,
      "",
      "Files List:",
      ...audioFiles.map((file, index) => 
        `${index + 1}. ${file.name} - ${formatTime(Math.floor(file.duration))} - ${formatFileSize(file.size)} - ${file.type} - ${file.timestamp.toLocaleString()}`
      )
    ].join("\n");

    const blob = new Blob([summaryText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audio_summary_${selectedPatient?.id || "unknown"}_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  const getTotalDuration = () => {
    return audioFiles.reduce((total, file) => total + file.duration, 0);
  };

  const getTotalSize = () => {
    return audioFiles.reduce((total, file) => total + file.size, 0);
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
            Audio Recording & Upload
          </h1>
          <div className="text-sm text-gray-600">
            {audioFiles.length} audio file{audioFiles.length !== 1 ? "s" : ""}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUser} className="text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">
                    Selected Patient: {selectedPatient.name} ({selectedPatient.id})
                  </span>
                </div>
                {audioFiles.length > 0 && (
                  <button
                    onClick={exportAllAudio}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-1" />
                    Export Summary
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Audio Recorder Component */}
        {selectedPatient ? (
          <AudioRecorder onAudioFilesChange={handleAudioFilesChange} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FontAwesomeIcon icon={faFileAudio} className="text-6xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No Patient Selected
            </h3>
            <p className="text-gray-500">
              Please select a patient from the search above to start recording or uploading audio files.
            </p>
          </div>
        )}

        {/* Audio Statistics */}
        {selectedPatient && audioFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Audio Session Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {audioFiles.length}
                </div>
                <div className="text-sm text-blue-800">Total Files</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {audioFiles.filter((f) => f.type === "recorded").length}
                </div>
                <div className="text-sm text-green-800">Recorded</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {formatTime(Math.floor(getTotalDuration()))}
                </div>
                <div className="text-sm text-purple-800">Total Duration</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {formatFileSize(getTotalSize())}
                </div>
                <div className="text-sm text-gray-800">Total Size</div>
              </div>
            </div>
          </div>
        )}

        {/* Session Info */}
        {selectedPatient && audioFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Session Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                <span className="text-gray-700">
                  <strong>Patient:</strong> {selectedPatient.name} ({selectedPatient.id})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500" />
                <span className="text-gray-700">
                  <strong>Session Date:</strong> {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faFileAudio} className="text-gray-500" />
                <span className="text-gray-700">
                  <strong>Uploaded Files:</strong> {audioFiles.filter((f) => f.type === "uploaded").length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faFileAudio} className="text-gray-500" />
                <span className="text-gray-700">
                  <strong>Recorded Files:</strong> {audioFiles.filter((f) => f.type === "recorded").length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AudioPage;

