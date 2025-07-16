"use client";

import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faStop,
  faPlay,
  faPause,
  faUpload,
  faTrash,
  faDownload,
  faFileAudio,
  faSpinner,
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

interface AudioRecorderProps {
  onAudioFilesChange?: (files: AudioFile[]) => void;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioFilesChange,
  maxFileSize = 50, // 50MB default
  acceptedFormats = [".mp3", ".wav", ".m4a", ".ogg", ".webm"],
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioElementsRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    if (onAudioFilesChange) {
      onAudioFilesChange(audioFiles);
    }
  }, [audioFiles, onAudioFilesChange]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      Object.values(audioElementsRef.current).forEach((audio) => {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      });
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audioFile: AudioFile = {
          id: Date.now().toString(),
          name: `Recording_${new Date().toISOString().split("T")[0]}_${new Date().toLocaleTimeString().replace(/:/g, "-")}.webm`,
          url: audioUrl,
          duration: recordingTime,
          size: audioBlob.size,
          type: "recorded",
          timestamp: new Date(),
        };

        setAudioFiles((prev) => [...prev, audioFile]);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Failed to start recording. Please check microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setError(null);
    setUploadProgress(0);

    Array.from(files).forEach((file) => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`);
        return;
      }

      // Check file format
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!acceptedFormats.includes(fileExtension)) {
        setError(`File ${file.name} format not supported. Accepted formats: ${acceptedFormats.join(", ")}`);
        return;
      }

      const audioUrl = URL.createObjectURL(file);
      
      // Get audio duration
      const audio = new Audio(audioUrl);
      audio.onloadedmetadata = () => {
        const audioFile: AudioFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: audioUrl,
          duration: audio.duration,
          size: file.size,
          type: "uploaded",
          timestamp: new Date(),
        };

        setAudioFiles((prev) => [...prev, audioFile]);
        setUploadProgress(null);
      };

      audio.onerror = () => {
        setError(`Failed to load audio file: ${file.name}`);
        setUploadProgress(null);
      };
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const playAudio = (audioFile: AudioFile) => {
    // Stop any currently playing audio
    Object.values(audioElementsRef.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    if (playingId === audioFile.id) {
      setPlayingId(null);
      return;
    }

    const audio = new Audio(audioFile.url);
    audioElementsRef.current[audioFile.id] = audio;

    audio.onended = () => {
      setPlayingId(null);
      delete audioElementsRef.current[audioFile.id];
    };

    audio.onerror = () => {
      setError(`Failed to play audio: ${audioFile.name}`);
      setPlayingId(null);
      delete audioElementsRef.current[audioFile.id];
    };

    audio.play();
    setPlayingId(audioFile.id);
  };

  const pauseAudio = (audioFile: AudioFile) => {
    const audio = audioElementsRef.current[audioFile.id];
    if (audio) {
      audio.pause();
      setPlayingId(null);
    }
  };

  const deleteAudioFile = (audioFile: AudioFile) => {
    // Stop audio if playing
    if (playingId === audioFile.id) {
      const audio = audioElementsRef.current[audioFile.id];
      if (audio) {
        audio.pause();
        delete audioElementsRef.current[audioFile.id];
      }
      setPlayingId(null);
    }

    // Revoke object URL to free memory
    URL.revokeObjectURL(audioFile.url);
    
    setAudioFiles((prev) => prev.filter((file) => file.id !== audioFile.id));
  };

  const downloadAudioFile = (audioFile: AudioFile) => {
    const link = document.createElement("a");
    link.href = audioFile.url;
    link.download = audioFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Audio Recording & Upload</h2>
        <div className="text-sm text-gray-600">
          {audioFiles.length} file{audioFiles.length !== 1 ? "s" : ""}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
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

      {/* Recording Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Record Audio</h3>
        <div className="flex items-center space-x-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              <FontAwesomeIcon icon={faMicrophone} className="mr-2" />
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center"
            >
              <FontAwesomeIcon icon={faStop} className="mr-2" />
              Stop Recording
            </button>
          )}
          
          {isRecording && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-600 font-medium">
                Recording: {formatTime(recordingTime)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Upload Audio Files</h3>
        <div className="flex items-center space-x-4">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(",")}
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadProgress !== null}
            className={`px-4 py-2 rounded-md transition-colors flex items-center ${
              uploadProgress !== null
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {uploadProgress !== null ? (
              <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
            )}
            Upload Audio Files
          </button>
          <div className="text-sm text-gray-600">
            Max {maxFileSize}MB • {acceptedFormats.join(", ")}
          </div>
        </div>
      </div>

      {/* Audio Files List */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">Audio Files</h3>
        {audioFiles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FontAwesomeIcon icon={faFileAudio} className="text-4xl mb-2" />
            <p>No audio files yet. Record or upload audio files to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {audioFiles.map((audioFile) => (
              <div
                key={audioFile.id}
                className="flex items-center justify-between p-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon
                    icon={faFileAudio}
                    className={`text-lg ${
                      audioFile.type === "recorded" ? "text-red-500" : "text-blue-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-800">{audioFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {formatTime(Math.floor(audioFile.duration))} • {formatFileSize(audioFile.size)} • 
                      {audioFile.type === "recorded" ? " Recorded" : " Uploaded"} • 
                      {audioFile.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      playingId === audioFile.id
                        ? pauseAudio(audioFile)
                        : playAudio(audioFile)
                    }
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                    title={playingId === audioFile.id ? "Pause" : "Play"}
                  >
                    <FontAwesomeIcon
                      icon={playingId === audioFile.id ? faPause : faPlay}
                    />
                  </button>
                  <button
                    onClick={() => downloadAudioFile(audioFile)}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                    title="Download"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button
                    onClick={() => deleteAudioFile(audioFile)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;

