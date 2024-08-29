import React, { useState } from 'react';

interface UploadedTimetable {
  batch: string;
  file: File;
}

const Timetable: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [timetableFile, setTimetableFile] = useState<File | null>(null);
  const [uploadedTimetables, setUploadedTimetables] = useState<UploadedTimetable[]>([]);

  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBatch(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTimetableFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedBatch && timetableFile) {
      // Process the file upload here (e.g., upload to a server or handle in-state)
      console.log(`Uploading timetable for batch: ${selectedBatch}`);
      console.log(`File name: ${timetableFile.name}`);
      
      // Add the uploaded timetable to the list
      const newUpload: UploadedTimetable = { batch: selectedBatch, file: timetableFile };
      setUploadedTimetables((prev) => [...prev, newUpload]);
      
      // Clear the selected batch and file after upload
      setSelectedBatch('');
      setTimetableFile(null);
    } else {
      alert('Please select a batch and upload a timetable file.');
    }
  };

  const handleDelete = (index: number) => {
    // Remove the timetable from the uploaded list
    setUploadedTimetables((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Upload Timetable</h2>
      <div className="mb-4">
        <label htmlFor="batch" className="block text-sm font-medium text-gray-700">Select Batch</label>
        <select
          id="batch"
          value={selectedBatch}
          onChange={handleBatchChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose a batch</option>
          <option value="Batch A">Batch A</option>
          <option value="Batch B">Batch B</option>
          <option value="Batch C">Batch C</option>
          <option value="Batch D">Batch D</option>
          {/* Add more batches as needed */}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="timetable" className="block text-sm font-medium text-gray-700">Upload Timetable</label>
        <input
          id="timetable"
          type="file"
          accept=".pdf,.doc,.docx,.xlsx,.xls"
          onChange={handleFileChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
        >
          Upload
        </button>
      </div>

      {uploadedTimetables.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Uploaded Timetables</h3>
          <ul className="list-disc pl-5">
            {uploadedTimetables.map((timetable, index) => (
              <li key={index} className="mb-2 flex justify-between items-center">
                <span>
                  Batch: {timetable.batch}, File: {timetable.file.name}
                </span>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Timetable;
