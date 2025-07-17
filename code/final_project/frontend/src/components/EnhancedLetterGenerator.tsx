"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faCalendarAlt, 
  faFileAlt, 
  faSpinner,
  faPlus,
  faMinus,
  faComments,
  faMicrophone,
  faFileText,
  faRobot,
  faSave,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import PatientDoctorChat, { Message } from './PatientDoctorChat';
import AudioRecorder, { AudioFile } from './AudioRecorder';
import ChatDocumentUpload, { ChatDocument } from './ChatDocumentUpload';
import LetterDisplay from './LetterDisplay';
import { 
  letterGenerationApi, 
  LetterGenerationRequest, 
  GeneratedLetter,
  PatientInfo,
  ParsedChatData
} from '../services/letterGenerationApi';

const EnhancedLetterGenerator: React.FC = () => {
  // Form state
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null);
  const [letterType, setLetterType] = useState('Referral Letter');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctorInfo, setDoctorInfo] = useState({
    name: '',
    title: '',
    department: ''
  });
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Data sources state
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [chatDocuments, setChatDocuments] = useState<ChatDocument[]>([]);
  const [parsedChatData, setParsedChatData] = useState<ParsedChatData[]>([]);

  // Include options
  const [includeConversation, setIncludeConversation] = useState(false);
  const [includeAudio, setIncludeAudio] = useState(false);
  const [includeChatDocuments, setIncludeChatDocuments] = useState(false);

  // UI state
  const [showConversation, setShowConversation] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [showChatDocuments, setShowChatDocuments] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetter | null>(null);
  const [isParsingDocuments, setIsParsingDocuments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Patient search
  const [patientSearch, setPatientSearch] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState<PatientInfo[]>([]);

  // Mock patient data - replace with actual API call
  const mockPatients: PatientInfo[] = [
    { id: 'P-1001', name: 'Alice Johnson', dateOfBirth: '1985-03-15', gender: 'Female' },
    { id: 'P-1002', name: 'Bob Smith', dateOfBirth: '1978-07-22', gender: 'Male' },
    { id: 'P-1003', name: 'Carol Williams', dateOfBirth: '1992-11-08', gender: 'Female' },
    { id: 'P-1004', name: 'David Brown', dateOfBirth: '1965-05-30', gender: 'Male' },
  ];

  // Handle patient search
  useEffect(() => {
    if (patientSearch.trim()) {
      const filtered = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        patient.id.toLowerCase().includes(patientSearch.toLowerCase())
      );
      setPatientSearchResults(filtered);
    } else {
      setPatientSearchResults([]);
    }
  }, [patientSearch]);

  // Parse chat documents when they change
  useEffect(() => {
    const parseDocuments = async () => {
      if (chatDocuments.length > 0 && includeChatDocuments) {
        setIsParsingDocuments(true);
        try {
          const parsed = await letterGenerationApi.parseMultipleChatDocuments(chatDocuments);
          setParsedChatData(parsed);
        } catch (error) {
          console.error('Error parsing chat documents:', error);
          setError('Failed to parse chat documents. Please check the format and try again.');
        } finally {
          setIsParsingDocuments(false);
        }
      }
    };

    parseDocuments();
  }, [chatDocuments, includeChatDocuments]);

  const handlePatientSelect = (patient: PatientInfo) => {
    setSelectedPatient(patient);
    setPatientSearch('');
    setPatientSearchResults([]);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleGenerateLetter = async () => {
    if (!selectedPatient) {
      setError('Please select a patient first.');
      return;
    }

    clearMessages();
    setIsGenerating(true);

    try {
      const request: LetterGenerationRequest = {
        patientInfo: selectedPatient,
        letterType,
        date,
        doctorInfo: doctorInfo.name ? doctorInfo : undefined,
        additionalNotes: additionalNotes || undefined,
        conversationData: includeConversation ? {
          messages: conversationMessages.map(msg => ({
            id: msg.id,
            sender: msg.sender,
            message: msg.message,
            timestamp: msg.timestamp
          })),
          include: true
        } : undefined,
        audioData: includeAudio ? {
          files: audioFiles,
          include: true
        } : undefined,
        documentData: includeChatDocuments ? {
          documents: chatDocuments,
          include: true
        } : undefined
      };

      const letter = await letterGenerationApi.generateLetter(request);
      setGeneratedLetter(letter);
      setSuccess('Enhanced letter generated successfully!');
    } catch (error) {
      console.error('Error generating letter:', error);
      setError('Failed to generate letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLetterUpdate = (updatedLetter: GeneratedLetter) => {
    setGeneratedLetter(updatedLetter);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Clinical Letter Generator</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setSuccess('Letter saved successfully!')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save Letter
            </button>
            <button 
              onClick={() => setSuccess('Letter downloaded successfully!')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
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
              <button onClick={clearMessages} className="ml-auto text-red-400 hover:text-red-600">
                ✕
              </button>
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
              <button onClick={clearMessages} className="ml-auto text-green-400 hover:text-green-600">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Patient Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Patient Search
            </label>
            <input
              type="text"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              placeholder="Search patient by name or ID"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Search Results */}
            {patientSearchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {patientSearchResults.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-gray-600">{patient.id}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
              Letter Type
            </label>
            <select
              value={letterType}
              onChange={(e) => setLetterType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Referral Letter">Referral Letter</option>
              <option value="Discharge Summary">Discharge Summary</option>
              <option value="Consultation Report">Consultation Report</option>
              <option value="Follow-up Letter">Follow-up Letter</option>
              <option value="Medical Certificate">Medical Certificate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Selected Patient Info */}
        {selectedPatient && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-blue-900 mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Selected Patient: {selectedPatient.name} ({selectedPatient.id})
            </h3>
            <div className="text-sm text-blue-800">
              <span className="mr-4">DOB: {selectedPatient.dateOfBirth}</span>
              <span>Gender: {selectedPatient.gender}</span>
            </div>
          </div>
        )}

        {/* Doctor Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
            <input
              type="text"
              value={doctorInfo.name}
              onChange={(e) => setDoctorInfo({...doctorInfo, name: e.target.value})}
              placeholder="Dr. John Smith"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={doctorInfo.title}
              onChange={(e) => setDoctorInfo({...doctorInfo, title: e.target.value})}
              placeholder="Consultant Cardiologist"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <input
              type="text"
              value={doctorInfo.department}
              onChange={(e) => setDoctorInfo({...doctorInfo, department: e.target.value})}
              placeholder="Cardiology Department"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Enhanced Features */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Enhanced Features</h2>

          {/* Patient Conversation */}
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faComments} className="text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Patient Conversation</h3>
                  <p className="text-sm text-gray-600">{conversationMessages.length} messages</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeConversation}
                    onChange={(e) => setIncludeConversation(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Include</span>
                </label>
                <button
                  onClick={() => setShowConversation(!showConversation)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FontAwesomeIcon icon={showConversation ? faMinus : faPlus} />
                </button>
              </div>
            </div>
            {showConversation && (
              <div className="p-4">
                <PatientDoctorChat
                  patientId={selectedPatient?.id}
                  patientName={selectedPatient?.name}
                  onMessagesChange={setConversationMessages}
                />
              </div>
            )}
          </div>

          {/* Audio Files */}
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faMicrophone} className="text-red-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Audio Files</h3>
                  <p className="text-sm text-gray-600">{audioFiles.length} files</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeAudio}
                    onChange={(e) => setIncludeAudio(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Include</span>
                </label>
                <button
                  onClick={() => setShowAudio(!showAudio)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FontAwesomeIcon icon={showAudio ? faMinus : faPlus} />
                </button>
              </div>
            </div>
            {showAudio && (
              <div className="p-4">
                <AudioRecorder onAudioFilesChange={setAudioFiles} />
              </div>
            )}
          </div>

          {/* Chat Documents */}
          <div className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faFileText} className="text-green-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Chat Documents</h3>
                  <p className="text-sm text-gray-600">
                    {chatDocuments.length} documents
                    {isParsingDocuments && (
                      <span className="ml-2">
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        Parsing...
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeChatDocuments}
                    onChange={(e) => setIncludeChatDocuments(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Include</span>
                </label>
                <button
                  onClick={() => setShowChatDocuments(!showChatDocuments)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FontAwesomeIcon icon={showChatDocuments ? faMinus : faPlus} />
                </button>
              </div>
            </div>
            {showChatDocuments && (
              <div className="p-4">
                <ChatDocumentUpload onDocumentsChange={setChatDocuments} />
              </div>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={4}
            placeholder="Any additional information or specific requirements for the letter..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Generate Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleGenerateLetter}
            disabled={!selectedPatient || isGenerating}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
          >
            {isGenerating ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                Generating Letter...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faRobot} className="mr-2" />
                Generate Enhanced Letter
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Letter Display */}
      <LetterDisplay
        letter={generatedLetter}
        isLoading={isGenerating}
        onLetterUpdate={handleLetterUpdate}
        className="mt-8"
      />
    </div>
  );
};

export default EnhancedLetterGenerator;

