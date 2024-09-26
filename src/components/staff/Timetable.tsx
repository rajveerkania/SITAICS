import React, { useState, useEffect } from 'react';

const Timetable: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [timetableFile, setTimetableFile] = useState<File | null>(null);
  const [timetableData, setTimetableData] = useState<any>(null);

  const handleBatchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBatch(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTimetableFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedBatch && timetableFile) {
      // Simulate file upload
      console.log(`Uploading timetable for batch: ${selectedBatch}`);
      console.log(`File name: ${timetableFile.name}`);

      // Fetch timetable data after upload
      fetchTimetableData(selectedBatch);
    } else {
      alert('Please select a batch and upload a timetable file.');
    }
  };

  const fetchTimetableData = async (batch: string) => {
    try {
      // Replace this with your actual API endpoint
      const response = await fetch(`/api/timetable?batch=${batch}`);
      const data = await response.json();
      setTimetableData(data);
    } catch (error) {
      console.error('Error fetching timetable data:', error);
    }
  };

  useEffect(() => {
    if (selectedBatch) {
      fetchTimetableData(selectedBatch);
    }
  }, [selectedBatch]);

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

      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          className="bg-black text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-black transition-transform transform hover:scale-105"
        >
          Upload
        </button>
      </div>

      {timetableFile && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Uploaded File</h3>
          <p>{timetableFile.name}</p>
        </div>
      )}

      {timetableData && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Timetable for {selectedBatch}</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Day</th>
                <th className="py-2 px-4 border-b">Time</th>
                <th className="py-2 px-4 border-b">Subject</th>
              </tr>
            </thead>
            <tbody>
              {timetableData.map((entry: any, index: number) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{entry.day}</td>
                  <td className="py-2 px-4 border-b">{entry.time}</td>
                  <td className="py-2 px-4 border-b">{entry.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Timetable;