"use client";

import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faFile, 
  faTrash, 
  faDownload, 
  faEye,
  faFileText,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

export interface ChatDocument {
  id: string;
  name: string;
  content: string;
  size: number;
  uploadDate: Date;
  type: string;
}

interface ChatDocumentUploadProps {
  onDocumentsChange?: (documents: ChatDocument[]) => void;
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
}

const ChatDocumentUpload: React.FC<ChatDocumentUploadProps> = ({
  onDocumentsChange,
  maxFileSize = 10,
  acceptedFormats = ['.txt', '.doc', '.docx', '.pdf'],
  className = ''
}) => {
  const [documents, setDocuments] = useState<ChatDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<ChatDocument | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    setIsUploading(true);
    const newDocuments: ChatDocument[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`);
        continue;
      }

      // Validate file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedFormats.includes(fileExtension)) {
        alert(`File ${file.name} format not supported. Accepted formats: ${acceptedFormats.join(', ')}`);
        continue;
      }

      try {
        const content = await readFileContent(file);
        const document: ChatDocument = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          content,
          size: file.size,
          uploadDate: new Date(),
          type: file.type || 'text/plain'
        };
        newDocuments.push(document);
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
        alert(`Error reading file ${file.name}. Please try again.`);
      }
    }

    const updatedDocuments = [...documents, ...newDocuments];
    setDocuments(updatedDocuments);
    onDocumentsChange?.(updatedDocuments);
    setIsUploading(false);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeDocument = (documentId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    setDocuments(updatedDocuments);
    onDocumentsChange?.(updatedDocuments);
    
    if (selectedDocument?.id === documentId) {
      setSelectedDocument(null);
      setShowPreview(false);
    }
  };

  const downloadDocument = (document: ChatDocument) => {
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = document.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const previewDocument = (document: ChatDocument) => {
    setSelectedDocument(document);
    setShowPreview(true);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearAllDocuments = () => {
    setDocuments([]);
    onDocumentsChange?.([]);
    setSelectedDocument(null);
    setShowPreview(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <FontAwesomeIcon 
          icon={faFileText} 
          className="text-4xl text-gray-400 mb-4" 
        />
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload Chat Documents
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          Drag and drop text files here, or click to browse
        </p>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Select Files
            </>
          )}
        </button>
        
        <p className="text-xs text-gray-500 mt-2">
          Max {maxFileSize}MB • {acceptedFormats.join(', ')}
        </p>
      </div>

      {/* Document List */}
      {documents.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium text-gray-900">
              Uploaded Documents ({documents.length})
            </h4>
            <button
              onClick={clearAllDocuments}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-1" />
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon 
                    icon={faFile} 
                    className="text-blue-600" 
                  />
                  <div>
                    <p className="font-medium text-gray-900">{document.name}</p>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(document.size)} • {document.uploadDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => previewDocument(document)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Preview"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={() => downloadDocument(document)}
                    className="text-green-600 hover:text-green-800 p-1"
                    title="Download"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button
                    onClick={() => removeDocument(document.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Remove"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {showPreview && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedDocument.name}
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-96 p-4 bg-gray-50 rounded border">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {selectedDocument.content}
              </pre>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => downloadDocument(selectedDocument)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {documents.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Document Summary</h4>
          <p className="text-sm text-blue-800">
            {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded • 
            Total size: {formatFileSize(documents.reduce((total, doc) => total + doc.size, 0))}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatDocumentUpload;

