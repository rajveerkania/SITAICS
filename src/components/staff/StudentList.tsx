import React, { useState } from "react";

interface Student {
  name: string;
  rollNumber: string;
  email: string;
  present: boolean;
}

const StudentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState({
    course: "",
    date: "",
    students: [
      { name: "John Doe", rollNumber: "CS001", email: "john@example.com", present: false },
      { name: "Jane Smith", rollNumber: "CS002", email: "jane@example.com", present: false },
      { name: "Alice Johnson", rollNumber: "CS003", email: "alice@example.com", present: false },
    ],
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
  };

  const filteredStudents = attendance.students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Student List</h2>
      
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-black focus:border-black"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 border-b font-medium">Name</th>
              <th className="p-4 border-b font-medium">Enrollment Number</th>
              <th className="p-4 border-b font-medium">Email ID</th>
              <th className="p-4 border-b font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.rollNumber} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="p-4 border-b">{student.name}</td>
                <td className="p-4 border-b">{student.rollNumber}</td>
                <td className="p-4 border-b">{student.email}</td>
                <td className="p-4 border-b">
                  <button
                    onClick={() => handleViewDetails(student)}
                    className="bg-black text-white py-1 px-3 rounded-lg shadow-md hover:bg-black transition-transform transform hover:scale-105"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2">Student Details</h3>
          <p><strong>Name:</strong> {selectedStudent.name}</p>
          <p><strong>Enrollment Number:</strong> {selectedStudent.rollNumber}</p>
          <p><strong>Email ID:</strong> {selectedStudent.email}</p>
          {/* Add more details if needed */}
        </div>
      )}
    </div>
  );
};

export default StudentList;
