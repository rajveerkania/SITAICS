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

  const examResults: ExamResult[] = [
    { code: "00019101SE01", subject: "Mathematical Aptitude", credits: 2.0, grade: "P" },
    { code: "00019302AE04", subject: "Basic English-II", credits: 2.0, grade: "A" },
    // Add more exam results as needed
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Exam Result</h2>
      <div className="mb-4">
        <label htmlFor="exam-select" className="block text-sm font-medium text-gray-700">
          Select Exam
        </label>
        <select
          id="exam-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
        >
          <option>B.Sc. Hons Regular Exam, Semester - 2, Summer 2023-24</option>
          <option>B.Sc. Hons Regular Exam, Semester - 1, Winter 2023-24</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Sr.</th>
              <th className="border p-2">Code</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Credits</th>
              <th className="border p-2">Grade</th>
            </tr>
          </thead>
          <tbody>
            {examResults.map((result, index) => (
              <tr key={index}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{result.code}</td>
                <td className="border p-2">{result.subject}</td>
                <td className="border p-2">{result.credits}</td>
                <td className="border p-2">{result.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <p>SGPA: 6.64</p>
        <p>CGPA: 7.32</p>
        <p>Result class: First Class</p>
      </div>
      <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
        Download Transcript
      </button>
    </div>
  );
};

export default ExamResults;