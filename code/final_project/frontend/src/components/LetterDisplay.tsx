// "use client";

// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { 
//   faDownload, 
//   faEdit, 
//   faSave, 
//   faEye, 
//   faPrint,
//   faShare,
//   faFilePdf,
//   faFileWord,
//   faFileText,
//   faSpinner,
//   faCheck,
//   faExclamationTriangle
// } from '@fortawesome/free-solid-svg-icons';
// import { 
//   GeneratedLetter, 
//   LetterDownloadOptions, 
//   letterGenerationApi,
//   downloadFile 
// } from '../services/letterGenerationApi';

// interface LetterDisplayProps {
//   letter: GeneratedLetter | null;
//   isLoading?: boolean;
//   onLetterUpdate?: (updatedLetter: GeneratedLetter) => void;
//   onLetterSave?: (letterId: string) => void;
//   className?: string;
// }

// const LetterDisplay: React.FC<LetterDisplayProps> = ({
//   letter,
//   isLoading = false,
//   onLetterUpdate,
//   onLetterSave,
//   className = ''
// }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedContent, setEditedContent] = useState('');
//   const [isSaving, setIsSaving] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');
//   const [showDownloadOptions, setShowDownloadOptions] = useState(false);
//   const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

//   const handleEditStart = () => {
//     if (letter) {
//       setEditedContent(letter.content);
//       setIsEditing(true);
//     }
//   };

//   const handleEditCancel = () => {
//     setIsEditing(false);
//     setEditedContent('');
//   };

//   const handleSave = async () => {
//     if (!letter || !editedContent.trim()) return;

//     setIsSaving(true);
//     setSaveStatus('saving');

//     try {
//       const updatedLetter = await letterGenerationApi.updateLetter(letter.id, editedContent);
//       onLetterUpdate?.(updatedLetter);
//       setIsEditing(false);
//       setSaveStatus('saved');
      
//       // Reset save status after 3 seconds
//       setTimeout(() => setSaveStatus('idle'), 3000);
//     } catch (error) {
//       console.error('Error saving letter:', error);
//       setSaveStatus('error');
//       setTimeout(() => setSaveStatus('idle'), 3000);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDownload = async (format: 'pdf' | 'docx' | 'txt') => {
//     if (!letter) return;

//     setIsDownloading(true);

//     try {
//       const options: LetterDownloadOptions = {
//         format,
//         includeAttachments: true,
//         letterhead: true
//       };

//       const blob = await letterGenerationApi.downloadLetter(letter.id, options);
//       const filename = `${letter.patientInfo.name}_${letter.letterType}_${new Date().toISOString().split('T')[0]}.${format}`;
      
//       downloadFile(blob, filename);
//       setShowDownloadOptions(false);
//     } catch (error) {
//       console.error('Error downloading letter:', error);
//       alert('Failed to download letter. Please try again.');
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   const handlePrint = () => {
//     if (!letter) return;
    
//     const printWindow = window.open('', '_blank');
//     if (printWindow) {
//       printWindow.document.write(`
//         <html>
//           <head>
//             <title>Clinical Letter - ${letter.patientInfo.name}</title>
//             <style>
//               body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
//               .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
//               .content { white-space: pre-wrap; }
//               @media print { body { margin: 20px; } }
//             </style>
//           </head>
//           <body>
//             <div class="header">
//               <h1>Clinical Letter</h1>
//               <p><strong>Patient:</strong> ${letter.patientInfo.name}</p>
//               <p><strong>Date:</strong> ${new Date(letter.generatedDate).toLocaleDateString()}</p>
//               <p><strong>Type:</strong> ${letter.letterType}</p>
//             </div>
//             <div class="content">${letter.content.replace(/\n/g, '<br>')}</div>
//           </body>
//         </html>
//       `);
//       printWindow.document.close();
//       printWindow.print();
//     }
//   };

//   const getStatusIcon = () => {
//     switch (saveStatus) {
//       case 'saving':
//         return <FontAwesomeIcon icon={faSpinner} className="animate-spin text-blue-600" />;
//       case 'saved':
//         return <FontAwesomeIcon icon={faCheck} className="text-green-600" />;
//       case 'error':
//         return <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600" />;
//       default:
//         return null;
//     }
//   };

//   const getStatusMessage = () => {
//     switch (saveStatus) {
//       case 'saving':
//         return 'Saving...';
//       case 'saved':
//         return 'Saved successfully';
//       case 'error':
//         return 'Save failed';
//       default:
//         return '';
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
//         <div className="flex items-center justify-center py-12">
//           <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-blue-600 mr-4" />
//           <span className="text-lg text-gray-600">Generating letter...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!letter) {
//     return (
//       <div className={`bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center ${className}`}>
//         <FontAwesomeIcon icon={faFileText} className="text-6xl text-gray-400 mb-4" />
//         <h3 className="text-xl font-medium text-gray-900 mb-2">No Letter Generated</h3>
//         <p className="text-gray-600">
//           Generate a letter using the form above to see it displayed here.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className={`bg-white rounded-lg shadow-md ${className}`}>
//       {/* Header */}
//       <div className="border-b border-gray-200 p-6">
//         <div className="flex justify-between items-start">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Generated Clinical Letter</h2>
//             <div className="space-y-1 text-sm text-gray-600">
//               <p><strong>Patient:</strong> {letter.patientInfo.name}</p>
//               <p><strong>Type:</strong> {letter.letterType}</p>
//               <p><strong>Generated:</strong> {new Date(letter.generatedDate).toLocaleString()}</p>
//               <p><strong>Status:</strong> 
//                 <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
//                   letter.status === 'final' ? 'bg-green-100 text-green-800' :
//                   letter.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
//                   'bg-blue-100 text-blue-800'
//                 }`}>
//                   {letter.status.charAt(0).toUpperCase() + letter.status.slice(1)}
//                 </span>
//               </p>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center space-x-2">
//             {/* Save Status */}
//             {saveStatus !== 'idle' && (
//               <div className="flex items-center space-x-2 mr-4">
//                 {getStatusIcon()}
//                 <span className="text-sm text-gray-600">{getStatusMessage()}</span>
//               </div>
//             )}

//             {/* Edit Button */}
//             {!isEditing && (
//               <button
//                 onClick={handleEditStart}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 <FontAwesomeIcon icon={faEdit} className="mr-2" />
//                 Edit
//               </button>
//             )}

//             {/* Print Button */}
//             <button
//               onClick={handlePrint}
//               className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
//             >
//               <FontAwesomeIcon icon={faPrint} className="mr-2" />
//               Print
//             </button>

//             {/* Download Button */}
//             <div className="relative">
//               <button
//                 onClick={() => setShowDownloadOptions(!showDownloadOptions)}
//                 disabled={isDownloading}
//                 className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
//               >
//                 {isDownloading ? (
//                   <>
//                     <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
//                     Downloading...
//                   </>
//                 ) : (
//                   <>
//                     <FontAwesomeIcon icon={faDownload} className="mr-2" />
//                     Download
//                   </>
//                 )}
//               </button>

//               {/* Download Options Dropdown */}
//               {showDownloadOptions && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
//                   <div className="py-1">
//                     <button
//                       onClick={() => handleDownload('pdf')}
//                       className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       <FontAwesomeIcon icon={faFilePdf} className="mr-3 text-red-600" />
//                       Download as PDF
//                     </button>
//                     <button
//                       onClick={() => handleDownload('docx')}
//                       className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       <FontAwesomeIcon icon={faFileWord} className="mr-3 text-blue-600" />
//                       Download as Word
//                     </button>
//                     <button
//                       onClick={() => handleDownload('txt')}
//                       className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       <FontAwesomeIcon icon={faFileText} className="mr-3 text-gray-600" />
//                       Download as Text
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-6">
//         {isEditing ? (
//           <div className="space-y-4">
//             <textarea
//               value={editedContent}
//               onChange={(e) => setEditedContent(e.target.value)}
//               className="w-full h-96 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
//               placeholder="Edit letter content..."
//             />
            
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={handleEditCancel}
//                 className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={isSaving || !editedContent.trim()}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSaving ? (
//                   <>
//                     <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <FontAwesomeIcon icon={faSave} className="mr-2" />
//                     Save Changes
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="prose max-w-none">
//             <div className="bg-gray-50 p-6 rounded-lg border">
//               <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
//                 {letter.content}
//               </pre>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Footer with Metadata */}
//       <div className="border-t border-gray-200 p-4 bg-gray-50">
//         <div className="flex justify-between items-center text-sm text-gray-600">
//           <div className="space-x-4">
//             <span>Word count: {letter.metadata.wordCount}</span>
//             <span>Generation time: {letter.metadata.generationTime}ms</span>
//           </div>
//           <div>
//             {letter.metadata.includedSources.length > 0 && (
//               <span>
//                 Sources: {letter.metadata.includedSources.join(', ')}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Click outside to close dropdown */}
//       {showDownloadOptions && (
//         <div 
//           className="fixed inset-0 z-0" 
//           onClick={() => setShowDownloadOptions(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default LetterDisplay;

import React from 'react';

interface GeneratedLetter {
  id?: string;
  content?: string; // Optional to support new format where only `response` is present
  response?: string; // New optional key from simplified backend
  patientInfo?: {
    name?: string;
  };
  letterType?: string;
  generatedDate?: string;
  status?: 'draft' | 'final';
  metadata?: {
    wordCount?: number;
    generationTime?: number;
    includedSources?: string[];
  };
}

interface LetterDisplayProps {
  letter: GeneratedLetter | null;
}

const LetterDisplay: React.FC<LetterDisplayProps> = ({ letter }) => {
  if (!letter) {
    return (
      <div className="p-4 rounded-xl border border-dashed border-gray-300 text-gray-500 text-center">
        No letter has been generated yet.
      </div>
    );
  }

  const {
    content,
    response,
    patientInfo,
    letterType,
    generatedDate,
    status,
    metadata,
  } = letter;

  const displayContent = content ?? response ?? 'No content available.';

  return (
    <div className="space-y-4">
      <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Generated Letter</h2>
          {patientInfo?.name && (
            <p className="text-gray-600">
              <span className="font-medium">Patient:</span> {patientInfo.name}
            </p>
          )}
          {letterType && (
            <p className="text-gray-600">
              <span className="font-medium">Type:</span> {letterType}
            </p>
          )}
          {generatedDate && (
            <p className="text-gray-600">
              <span className="font-medium">Date:</span>{' '}
              {new Date(generatedDate).toLocaleString()}
            </p>
          )}
          {status && (
            <p className="text-gray-600">
              <span className="font-medium">Status:</span> {status}
            </p>
          )}
        </div>
        <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
          {displayContent}
        </pre>
      </div>

      {metadata && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
          <p><span className="font-medium">Word Count:</span> {metadata.wordCount ?? 'N/A'}</p>
          <p><span className="font-medium">Generation Time:</span> {metadata.generationTime ?? 'N/A'}s</p>
          <p><span className="font-medium">Sources:</span> {metadata.includedSources?.join(', ') || 'None'}</p>
        </div>
      )}
    </div>
  );
};

export default LetterDisplay;
