import React, { useState } from "react";

// Interface for representing each uploaded result
interface UploadedResult {
  studentName: string;
  course: string;
  semester: string;
  fileName: string;
  url: string;
}

// Sample data for uploaded results (simulate fetching from a server or database)
const initialResults: UploadedResult[] = [
  {
    studentName: "John Doe",
    course: "B.Tech Computer Science",
    semester: "Semester 1",
    fileName: "result1.pdf",
    url: "path/to/result1.pdf",
  },
  {
    studentName: "Jane Smith",
    course: "M.Tech AI/ML",
    semester: "Semester 2",
    fileName: "result2.pdf",
    url: "path/to/result2.pdf",
  },
];

const Result: React.FC = () => {

  const [uploadedResults, setUploadedResults] = useState<UploadedResult[]>(initialResults);

  const handleRemoveFile = (fileName: string) => {
    setUploadedResults(uploadedResults.filter((result) => result.fileName !== fileName));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Student Uploaded Results</h2>
      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Results List</h3>
        {uploadedResults.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            {uploadedResults.map((result) => (
              <div key={result.fileName} className="border-b last:border-b-0 p-3 hover:bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium">{result.studentName}</p>
                    <p className="text-sm text-gray-500">
                      {result.course} - {result.semester}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleRemoveFile(result.fileName)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{result.fileName}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No results uploaded by students yet.</p>
        )}
      </div>
    </div>
  );
};

export default Result;
