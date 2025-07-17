import axios, { AxiosResponse } from 'axios';

// API Base URL - Update this to match backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

// Types for API requests and responses
export interface PatientInfo {
  id: string;
  name: string;
  dateOfBirth?: string;
  gender?: string;
  contactInfo?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'patient' | 'doctor';
  message: string;
  timestamp: Date;
}

export interface AudioFile {
  id: string;
  name: string;
  url: string;
  duration?: number;
  size: number;
  uploadDate: Date;
}

export interface ChatDocument {
  id: string;
  name: string;
  content: string;
  size: number;
  uploadDate: Date;
  type: string;
}

export interface LetterGenerationRequest {
  patientInfo: PatientInfo;
  letterType: string;
  date: string;
  doctorInfo?: {
    name: string;
    title: string;
    department: string;
  };
  // Optional data sources
  conversationData?: {
    messages: ChatMessage[];
    include: boolean;
  };
  audioData?: {
    files: AudioFile[];
    include: boolean;
  };
  documentData?: {
    documents: ChatDocument[];
    include: boolean;
  };
  // Additional letter content
  additionalNotes?: string;
  urgency?: 'low' | 'medium' | 'high';
}

export interface ParsedChatData {
  messages: ChatMessage[];
  summary: string;
  keyPoints: string[];
  patientConcerns: string[];
  doctorRecommendations: string[];
  metadata: {
    totalMessages: number;
    conversationDuration?: string;
    participantCount: number;
  };
}

export interface GeneratedLetter {
  id: string;
  content: string;
  letterType: string;
  patientInfo: PatientInfo;
  generatedDate: Date;
  status: 'draft' | 'final' | 'sent';
  metadata: {
    wordCount: number;
    includedSources: string[];
    generationTime: number;
  };
}

export interface LetterDownloadOptions {
  format: 'pdf' | 'docx' | 'txt';
  includeAttachments?: boolean;
  letterhead?: boolean;
}

// API Service Class
class LetterGenerationApiService {
  
  /**
   * Parse chat document content and extract structured conversation data
   */
  async parseChatDocument(document: ChatDocument): Promise<ParsedChatData> {
    try {
      const response: AxiosResponse<ParsedChatData> = await apiClient.post('/chat/parse', {
        documentId: document.id,
        content: document.content,
        fileName: document.name,
        fileType: document.type
      });
      
      return response.data;
    } catch (error) {
      console.error('Error parsing chat document:', error);
      throw new Error('Failed to parse chat document. Please try again.');
    }
  }

  /**
   * Parse multiple chat documents
   */
  async parseMultipleChatDocuments(documents: ChatDocument[]): Promise<ParsedChatData[]> {
    try {
      const response: AxiosResponse<ParsedChatData[]> = await apiClient.post('/chat/parse-multiple', {
        documents: documents.map(doc => ({
          id: doc.id,
          content: doc.content,
          fileName: doc.name,
          fileType: doc.type
        }))
      });
      
      return response.data;
    } catch (error) {
      console.error('Error parsing multiple chat documents:', error);
      throw new Error('Failed to parse chat documents. Please try again.');
    }
  }

  /**
   * Generate clinical letter based on provided data
   */
  async generateLetter(request: LetterGenerationRequest): Promise<GeneratedLetter> {
    try {
      const response: AxiosResponse<GeneratedLetter> = await apiClient.post('/letters/generate', request);
      
      return response.data;
    } catch (error) {
      console.error('Error generating letter:', error);
      throw new Error('Failed to generate letter. Please try again.');
    }
  }

  /**
   * Get generated letter by ID
   */
  async getLetter(letterId: string): Promise<GeneratedLetter> {
    try {
      const response: AxiosResponse<GeneratedLetter> = await apiClient.get(`/letters/${letterId}`);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching letter:', error);
      throw new Error('Failed to fetch letter. Please try again.');
    }
  }

  /**
   * Update generated letter content
   */
  async updateLetter(letterId: string, content: string): Promise<GeneratedLetter> {
    try {
      const response: AxiosResponse<GeneratedLetter> = await apiClient.put(`/letters/${letterId}`, {
        content
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating letter:', error);
      throw new Error('Failed to update letter. Please try again.');
    }
  }

  /**
   * Download generated letter in specified format
   */
  async downloadLetter(letterId: string, options: LetterDownloadOptions): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await apiClient.get(`/letters/${letterId}/download`, {
        params: options,
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error downloading letter:', error);
      throw new Error('Failed to download letter. Please try again.');
    }
  }

  /**
   * Get letter generation history for a patient
   */
  async getPatientLetterHistory(patientId: string): Promise<GeneratedLetter[]> {
    try {
      const response: AxiosResponse<GeneratedLetter[]> = await apiClient.get(`/patients/${patientId}/letters`);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching patient letter history:', error);
      throw new Error('Failed to fetch letter history. Please try again.');
    }
  }

  /**
   * Delete a generated letter
   */
  async deleteLetter(letterId: string): Promise<void> {
    try {
      await apiClient.delete(`/letters/${letterId}`);
    } catch (error) {
      console.error('Error deleting letter:', error);
      throw new Error('Failed to delete letter. Please try again.');
    }
  }

  /**
   * Process audio files for transcription and analysis
   */
  async processAudioFiles(files: AudioFile[]): Promise<ParsedChatData> {
    try {
      const formData = new FormData();
      
      // Note: This assumes audio files are available as File objects
      // You may need to adapt this based on your audio file handling
      files.forEach((file, index) => {
        formData.append(`audioFiles`, file as any);
        formData.append(`audioMetadata`, JSON.stringify({
          id: file.id,
          name: file.name,
          duration: file.duration,
          size: file.size
        }));
      });

      const response: AxiosResponse<ParsedChatData> = await apiClient.post('/audio/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error processing audio files:', error);
      throw new Error('Failed to process audio files. Please try again.');
    }
  }

  /**
   * Get available letter templates
   */
  async getLetterTemplates(): Promise<{ id: string; name: string; description: string }[]> {
    try {
      const response = await apiClient.get('/templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching letter templates:', error);
      throw new Error('Failed to fetch letter templates. Please try again.');
    }
  }

  /**
   * Validate letter content and structure
   */
  async validateLetter(content: string, letterType: string): Promise<{
    isValid: boolean;
    errors: string[];
    suggestions: string[];
  }> {
    try {
      const response = await apiClient.post('/letters/validate', {
        content,
        letterType
      });
      
      return response.data;
    } catch (error) {
      console.error('Error validating letter:', error);
      throw new Error('Failed to validate letter. Please try again.');
    }
  }
}

// Export singleton instance
export const letterGenerationApi = new LetterGenerationApiService();

// Export utility functions
export const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default letterGenerationApi;

