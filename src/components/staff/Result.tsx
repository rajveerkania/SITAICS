import React, { useState } from "react";

const Result: React.FC = () => {
  const [resultReport, setResultReport] = useState({
    course: "",
    semester: "",
    file: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    stateSetter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      stateSetter((prev: any) => ({
        ...prev,
        [name]: fileInput.files?.[0] || null,
      }));
    } else {
      stateSetter((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    // Implement your submit logic here
    console.log(resultReport);
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Upload Result Report</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="course"
          value={resultReport.course}
          onChange={(e) => handleInputChange(e, setResultReport)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Course</option>
          <option value="B.Tech Computer Science">B.Tech Computer Science</option>
          <option value="M.Tech AI/ML">M.Tech AI/ML</option>
        </select>
        <select
          name="semester"
          value={resultReport.semester}
          onChange={(e) => handleInputChange(e, setResultReport)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Semester</option>
          <option value="Semester 1">Semester 1</option>
          <option value="Semester 2">Semester 2</option>
        </select>
        <input
          type="file"
          name="file"
          onChange={(e) => handleInputChange(e, setResultReport)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Upload Result Report
        </button>
      </form>
    </div>
  );
};

export default Result;
