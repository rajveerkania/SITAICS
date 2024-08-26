import React, { useState, ChangeEvent } from "react";

interface UploadedResult {
  semester: string;
  file: File | null;
  url: string;
}

const ExamResults: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"Upload Result" | "View Results">("Upload Result");
  const [selectedSemester, setSelectedSemester] = useState<string>("Semester 1");
  const [uploadedResults, setUploadedResults] = useState<UploadedResult[]>([]);

  const handleTabChange = (tab: "Upload Result" | "View Results") => {
    setSelectedTab(tab);
  };

  const handleSemesterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const updatedResults = uploadedResults.filter(
        (result) => result.semester !== selectedSemester
      );
      updatedResults.push({
        semester: selectedSemester,
        file,
        url: URL.createObjectURL(file),
      });
      setUploadedResults(updatedResults);
    }
  };

  const handleRemoveFile = (semester: string) => {
    setUploadedResults(
      uploadedResults.filter((result) => result.semester !== semester)
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Student Exam Results</h2>

      <div className="mb-4 sm:mb-6 border-b border-gray-300">
        <nav className="flex justify-center">
          {["Upload Result", "View Results"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab as "Upload Result" | "View Results")}
              className={`py-2 px-3 sm:px-6 text-sm sm:text-lg font-medium transition-colors ${
                selectedTab === tab
                  ? "border-b-4 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {selectedTab === "Upload Result" && (
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Upload Your Exam Result PDF</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <label htmlFor="semester-select" className="text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-0 sm:w-1/3">
                Select Semester
              </label>
              <select
                id="semester-select"
                className="py-2 px-3 border border-gray-300 rounded-md w-full sm:w-2/3"
                value={selectedSemester}
                onChange={handleSemesterChange}
              >
                {[...Array(8)].map((_, i) => (
                  <option key={i} value={`Semester ${i + 1}`}>
                    Semester {i + 1}
                  </option>
                ))}
                <option value="Repeater Result">Repeater Result</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <label htmlFor="file-upload" className="text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-0 sm:w-1/3">
                Upload PDF
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="py-2 px-3 border border-gray-300 rounded-md cursor-pointer w-full sm:w-2/3"
              />
            </div>
          </div>
        </div>
      )}

      {selectedTab === "View Results" && (
        <div className="overflow-x-auto">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Your Uploaded Results</h3>
          {uploadedResults.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              {uploadedResults.map((result) => (
                <div key={result.semester} className="border-b last:border-b-0 p-3 sm:p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{result.semester}</span>
                    <div className="flex space-x-2 sm:space-x-4">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm sm:text-base"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleRemoveFile(result.semester)}
                        className="text-red-500 hover:underline text-sm sm:text-base"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{result.file?.name || "No file uploaded"}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You haven't uploaded any results yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamResults;
