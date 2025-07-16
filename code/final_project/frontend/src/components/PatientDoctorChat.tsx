"use client";

import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faUser,
  faUserMd,
  faTrash,
  faCopy,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

interface Message {
  id: string;
  sender: "patient" | "doctor";
  content: string;
  timestamp: Date;
}

interface PatientDoctorChatProps {
  patientId?: string;
  patientName?: string;
  onMessagesChange?: (messages: Message[]) => void;
}

const PatientDoctorChat: React.FC<PatientDoctorChatProps> = ({
  patientId = "",
  patientName = "",
  onMessagesChange,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentSender, setCurrentSender] = useState<"patient" | "doctor">("patient");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (onMessagesChange) {
      onMessagesChange(messages);
    }
  }, [messages, onMessagesChange]);

  const addMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: currentSender,
      content: newMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const clearAllMessages = () => {
    setMessages([]);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const exportMessages = () => {
    const conversationText = messages
      .map((msg) => {
        const time = msg.timestamp.toLocaleString();
        const sender = msg.sender === "patient" ? "Patient" : "Doctor";
        return `[${time}] ${sender}: ${msg.content}`;
      })
      .join("\n");

    const blob = new Blob([conversationText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `conversation_${patientId || "unknown"}_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addMessage();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Patient-Doctor Conversation
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={exportMessages}
            disabled={messages.length === 0}
            className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center ${
              messages.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            <FontAwesomeIcon icon={faDownload} className="mr-1" />
            Export
          </button>
          <button
            onClick={clearAllMessages}
            disabled={messages.length === 0}
            className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center ${
              messages.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            <FontAwesomeIcon icon={faTrash} className="mr-1" />
            Clear All
          </button>
        </div>
      </div>

      {patientName && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Patient:</strong> {patientName} {patientId && `(${patientId})`}
          </p>
        </div>
      )}

      {/* Messages Container */}
      <div className="border border-gray-300 rounded-md mb-4 h-96 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation below.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "doctor" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative group ${
                    message.sender === "doctor"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 border border-gray-300"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <FontAwesomeIcon
                      icon={message.sender === "doctor" ? faUserMd : faUser}
                      className={`mt-1 ${
                        message.sender === "doctor" ? "text-blue-200" : "text-gray-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">
                        {message.sender === "doctor" ? "Doctor" : "Patient"}
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "doctor" ? "text-blue-200" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Message Actions */}
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => copyMessage(message.content)}
                        className={`p-1 rounded text-xs ${
                          message.sender === "doctor"
                            ? "hover:bg-blue-700 text-blue-200"
                            : "hover:bg-gray-200 text-gray-600"
                        }`}
                        title="Copy message"
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className={`p-1 rounded text-xs ${
                          message.sender === "doctor"
                            ? "hover:bg-blue-700 text-blue-200"
                            : "hover:bg-gray-200 text-gray-600"
                        }`}
                        title="Delete message"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Send as:</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="patient"
                checked={currentSender === "patient"}
                onChange={(e) => setCurrentSender(e.target.value as "patient" | "doctor")}
                className="mr-2"
              />
              <FontAwesomeIcon icon={faUser} className="mr-1 text-gray-600" />
              Patient
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="doctor"
                checked={currentSender === "doctor"}
                onChange={(e) => setCurrentSender(e.target.value as "patient" | "doctor")}
                className="mr-2"
              />
              <FontAwesomeIcon icon={faUserMd} className="mr-1 text-blue-600" />
              Doctor
            </label>
          </div>
        </div>

        <div className="flex space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Type a message as ${currentSender}...`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={2}
          />
          <button
            onClick={addMessage}
            disabled={!newMessage.trim()}
            className={`px-4 py-2 rounded-md transition-colors flex items-center ${
              !newMessage.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDoctorChat;

