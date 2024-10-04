import React, { useState } from 'react';
import { FaTrashAlt, FaUpload } from 'react-icons/fa'; // React icons for delete and upload

const Timetable: React.FC = () => {
  const [timetableFile, setTimetableFile] = useState<File | null>(null);
  const [timetableURL, setTimetableURL] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showManagement, setShowManagement] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('Manage Timetable');

  const validateFile = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setErrorMessage('Only PDF, DOC, DOCX, XLS, and XLSX files are allowed.');
      return false;
    }

    if (file.size > maxSize) {
      setErrorMessage('File size should be less than 10MB.');
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && validateFile(file)) {
      setTimetableFile(file);
      setTimetableURL(null);
    }
  };

  const handleUpload = async () => {
    if (timetableFile) {
      setIsUploading(true);
      setShowManagement(false);
      setTitle('Updated Time Table');

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const fileURL = URL.createObjectURL(timetableFile);
        setTimetableURL(fileURL);
      } catch (error) {
        console.error('Upload failed:', error);
        setErrorMessage('Failed to upload timetable.');
      } finally {
        setIsUploading(false);
      }
    } else {
      setErrorMessage('Please upload a valid timetable file.');
    }
  };

  const handleDelete = () => {
    setTimetableFile(null);
    setTimetableURL(null);
    setShowManagement(true);
    setTitle('Manage Timetable');
  };

  return (
    <div className="max-w-full mx-auto my-16 p-12 bg-white shadow-2xl rounded-2xl border border-gray-300">
      <h2 className="text-4xl font-bold mb-8 text-center">{title}</h2>

      {/* File Upload Section */}
      {showManagement && !timetableFile && (
        <div className="mb-8">
          <label htmlFor="timetable" className="block text-xl font-medium text-gray-700">
            Upload Timetable
          </label>
          <input
            id="timetable"
            type="file"
            accept=".pdf,.doc,.docx,.xlsx,.xls"
            onChange={handleFileChange}
            className="mt-4 block w-full p-5 border border-gray-400 rounded-lg shadow-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Error Message */}
      {errorMessage && <p className="text-red-500 text-lg mb-6">{errorMessage}</p>}

      {/* Upload Button */}
      {!timetableURL && timetableFile && (
        <div className="flex justify-end mb-8">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`bg-black text-white text-lg font-semibold py-4 px-8 rounded-lg shadow-lg transition-transform transform ${isUploading ? 'opacity-50' : 'hover:scale-105'}`}
          >
            <FaUpload className="inline mr-2" /> {/* Upload Icon */}
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}

      {/* Uploaded Timetable Section */}
      {timetableURL && (
        <>
          {/* Display PDF Preview */}
          {timetableFile?.type === 'application/pdf' && (
            <div className="w-full h-[600px] bg-white border border-gray-400 shadow-lg rounded-lg overflow-hidden mb-6"> {/* Added margin-bottom here */}
              <iframe
                src={timetableURL}
                className="w-full h-full"
                title="Timetable Preview"
                aria-label="Timetable Preview"
              />
            </div>
          )}
          {timetableFile?.type !== 'application/pdf' && (
            <div className="flex justify-between items-center mb-6">
              <a
                href={timetableURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-xl underline"
              >
                View or Download Timetable
              </a>
            </div>
          )}
        </>
      )}

      {/* Delete Button with space from PDF view */}
      {timetableURL && (
        <div className="flex justify-center mb-8"> {/* Added margin-bottom for spacing */}
          <button
            onClick={handleDelete}
            className="bg-black text-white text-lg font-semibold py-4 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <FaTrashAlt className="inline mr-2" /> {/* Delete Icon */}
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Timetable;
