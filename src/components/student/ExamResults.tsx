import React, { useState } from "react";

interface ExamResult {
  code: string;
  subject: string;
  credits: number;
  grade: string;
}

const ExamResults: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState(
    "B.Sc. Hons Regular Exam, Semester - 2, Summer 2023-24"
  );

  const [examResults, setExamResults] = useState<ExamResult[]>([
    { code: "00019101SE01", subject: "Mathematical Aptitude", credits: 2.0, grade: "P" },
    { code: "00019302AE04", subject: "Basic English-II", credits: 2.0, grade: "A" },
  ]);

  // Mock function to simulate fetching results based on selected exam
  const fetchResults = (exam: string) => {
    if (exam === "B.Sc. Hons Regular Exam, Semester - 2, Summer 2023-24") {
      setExamResults([
        { code: "00019101SE01", subject: "Mathematical Aptitude", credits: 2.0, grade: "P" },
        { code: "00019302AE04", subject: "Basic English-II", credits: 2.0, grade: "A" },
      ]);
    } else if (exam === "B.Sc. Hons Regular Exam, Semester - 1, Winter 2023-24") {
      setExamResults([
        { code: "00019101SE01", subject: "Introduction to Algebra", credits: 2.0, grade: "B" },
        { code: "00019302AE04", subject: "Advanced English-I", credits: 2.0, grade: "A" },
      ]);
    }
  };

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedExam = e.target.value;
    setSelectedExam(selectedExam);
    fetchResults(selectedExam);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Exam Result</h2>
      <div className="mb-4">
        <label htmlFor="exam-select" className="block text-sm font-medium text-gray-700">
          Select Exam
        </label>
        <select
          id="exam-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition-transform duration-300 ease-in-out"
          value={selectedExam}
          onChange={handleExamChange}
        >
          <option value="B.Sc. Hons Regular Exam, Semester - 2, Summer 2023-24">
            B.Sc. Hons Regular Exam, Semester - 2, Summer 2023-24
          </option>
          <option value="B.Sc. Hons Regular Exam, Semester - 1, Winter 2023-24">
            B.Sc. Hons Regular Exam, Semester - 1, Winter 2023-24
          </option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Sr.</th>
              <th className="border p-2 text-left">Code</th>
              <th className="border p-2 text-left">Subject</th>
              <th className="border p-2 text-left">Credits</th>
              <th className="border p-2 text-left">Grade</th>
            </tr>
          </thead>
          <tbody>
            {examResults.length ? (
              examResults.map((result, index) => (
                <tr key={index} className="hover:bg-gray-100 transition-colors duration-300 ease-in-out">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{result.code}</td>
                  <td className="border p-2">{result.subject}</td>
                  <td className="border p-2">{result.credits}</td>
                  <td className="border p-2">{result.grade}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border p-2 text-center text-gray-500">
                  No results available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <p>SGPA: 6.64</p>
        <p>CGPA: 7.32</p>
        <p>Result class: First Class</p>
      </div>
      <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out">
        Download Transcript
      </button>
    </div>
  );
};

export default ExamResults;
