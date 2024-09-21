import React, { useState, useEffect } from "react";

interface Student {
  username: string;
  name: string;
  fatherName: string;
  motherName: string;
  enrollmentNumber: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  contactNo: string;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    // Fetch students from the API
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/fetchStudentDetails"); // Adjust the API route as necessary
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
  };

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
              <th className="p-4 border-b font-medium">Contact No</th>
              <th className="p-4 border-b font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr
                key={student.enrollmentNumber}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="p-4 border-b">{student.name}</td>
                <td className="p-4 border-b">{student.enrollmentNumber}</td>
                <td className="p-4 border-b">{student.contactNo}</td>
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

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`py-2 px-4 mx-1 rounded-lg ${
              currentPage === index + 1
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal for Student Details */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-2">Student Details</h3>
            <p><strong>Name:</strong> {selectedStudent.name}</p>
            <p><strong>Enrollment Number:</strong> {selectedStudent.enrollmentNumber}</p>
            <p><strong>Father's Name:</strong> {selectedStudent.fatherName}</p>
            <p><strong>Mother's Name:</strong> {selectedStudent.motherName}</p>
            <p><strong>Date of Birth:</strong> {selectedStudent.dateOfBirth}</p>
            <p><strong>Gender:</strong> {selectedStudent.gender}</p>
            <p><strong>Blood Group:</strong> {selectedStudent.bloodGroup}</p>
            <p><strong>Contact No:</strong> {selectedStudent.contactNo}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
