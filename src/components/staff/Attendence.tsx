import React, { useState } from "react";

interface Student {
  name: string;
  rollNumber: string;
  present: boolean;
}

interface AttendanceState {
  course: string;
  batch: string;
  date: string;
  students: Student[];
}

const Attendance: React.FC = () => {
  const courseData: Record<string, string[]> = {
    "B.Tech Computer Science": ["Batch A", "Batch B"],
    "M.Tech AI/ML": ["Batch 1", "Batch 2"],
  };

  const studentData: Record<string, Student[]> = {
    "Batch A": [
      { name: "John Doe", rollNumber: "CS001", present: false },
      { name: "Jane Smith", rollNumber: "CS002", present: false },
    ],
    "Batch B": [
      { name: "Alice Johnson", rollNumber: "CS003", present: false },
      { name: "Bob Brown", rollNumber: "CS004", present: false },
    ],
    "Batch 1": [
      { name: "Charlie Wilson", rollNumber: "AI001", present: false },
      { name: "David Lee", rollNumber: "AI002", present: false },
    ],
    "Batch 2": [
      { name: "Eve Adams", rollNumber: "AI003", present: false },
      { name: "Frank Miller", rollNumber: "AI004", present: false },
    ],
  };

  const [attendance, setAttendance] = useState<AttendanceState>({
    course: "",
    batch: "",
    date: "",
    students: [],
  });

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    const { name, value } = e.target;

    setAttendance((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "course") {
      setAttendance((prevState) => ({
        ...prevState,
        batch: "",
        students: [],
      }));
    }

    if (name === "batch") {
      setAttendance((prevState) => ({
        ...prevState,
        students: studentData[value as keyof typeof studentData] || [],
      }));
    }
  }

  function handleStudentAttendanceChange(index: number): void {
    setAttendance((prevState) => {
      const updatedStudents = [...prevState.students];
      updatedStudents[index].present = !updatedStudents[index].present;
      return { ...prevState, students: updatedStudents };
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    console.log("Attendance submitted:", attendance);
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-black mb-6">Mark Attendance</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <select
          name="course"
          value={attendance.course}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        >
          <option value="">Select Course</option>
          {Object.keys(courseData).map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>

        <select
          name="batch"
          value={attendance.batch}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
          disabled={!attendance.course}
        >
          <option value="">Select Batch</option>
          {attendance.course &&
            courseData[attendance.course as keyof typeof courseData].map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
        </select>

        <input
          type="date"
          name="date"
          value={attendance.date}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />

        <div className="space-y-4">
          {attendance.students.map((student, index) => (
            <div key={student.rollNumber} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
              <span className="text-gray-700">{student.name}</span>
              <span className="text-gray-500">{student.rollNumber}</span>
              <input
                type="checkbox"
                checked={student.present}
                onChange={() => handleStudentAttendanceChange(index)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <label className="text-gray-700">Present</label>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-4 rounded-lg shadow"
        >
          Submit Attendance
        </button>
      </form>
    </div>
  );
};

export default Attendance;
