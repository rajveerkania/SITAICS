"use client";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { LogoutButton } from "@/components/LogoutButton";

const FacultyDashboard: React.FC = () => {
  const [facultyInfo] = useState({
    name: "Dr. Jatin Patel",
    email: "jatini@rru.ac.in",
    employeeId: "ABC001",
    department: "Computer Science",
    designation: "Director",
    joinDate: "2020-09-01",
    mobileNo: "+91 9876543210",
    address: "123 Faculty Quarters",
    city: "Ahmedabad",
    state: "Gujarat",
    pinCode: "380015",
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isBatchCoordinator] = useState(true);

  const [notification, setNotification] = useState({
    recipient: "",
    message: "",
  });

  const [leaveRequest, setLeaveRequest] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [resultReport, setResultReport] = useState({
    course: "",
    semester: "",
    file: null as File | null,
  });

  const [attendance, setAttendance] = useState({
    course: "",
    date: "",
    students: [
      { name: "John Doe", rollNumber: "CS001", present: false },
      { name: "Jane Smith", rollNumber: "CS002", present: false },
      // Add more students as needed
    ],
  });

  const handleNotificationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNotification((prev) => ({ ...prev, [name]: value }));
  };

  const handleLeaveRequestChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLeaveRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleResultReportChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "file" && files) {
      setResultReport((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setResultReport((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAttendanceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAttendance((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentAttendanceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedStudents = [...attendance.students];
    updatedStudents[index].present = e.target.checked;
    setAttendance((prev) => ({ ...prev, students: updatedStudents }));
  };

  const sendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending notification:", notification);
    // Implement the actual sending logic here
    alert("Notification sent successfully!");
    setNotification({ recipient: "", message: "" });
  };

  const submitLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting leave request:", leaveRequest);
    // Implement the actual submission logic here
    alert("Leave request submitted successfully!");
    setLeaveRequest({ startDate: "", endDate: "", reason: "" });
  };

  const uploadResultReport = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Uploading result report:", resultReport);
    // Implement the actual upload logic here
    alert("Result report uploaded successfully!");
    setResultReport({ course: "", semester: "", file: null });
  };

  const submitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting attendance:", attendance);
    // Implement the actual attendance submission logic here
    alert("Attendance submitted successfully!");
    setAttendance({
      course: "",
      date: "",
      students: attendance.students.map((student) => ({
        ...student,
        present: false,
      })),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>SITAICS Faculty Portal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="SITAICS" width={50} height={50} />
            <h1 className="ml-2 text-xl font-bold text-black-500">SITAICS</h1>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Welcome {facultyInfo.name}</span>
            <Image
              src="/logo.png"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-gray-300"
            />
          </div>
        </div>
      </header>

      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <ul className="flex space-x-4 py-2">
            {[
              "Dashboard",
              "Notifications",
              "Leave",
              "Results",
              "Students",
              "Attendance",
            ].map((item) => (
              <li key={item}>
                <button
                  className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                    activeTab === item.toLowerCase()
                      ? "bg-gray-900"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab(item.toLowerCase())}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
          <LogoutButton />
        </div>
      </nav>

      <main className="container mx-auto mt-8 px-4">
        {activeTab === "dashboard" && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Faculty Information</h2>
            <div className="border border-gray-300 rounded-lg p-4">
              <p className="font-semibold text-lg">SITAICS (School of Information Technology)</p>
              <p className="mt-2"><strong>Name:</strong> {facultyInfo.name}</p>
              <p><strong>Email:</strong> {facultyInfo.email}</p>
              <p><strong>Employee ID:</strong> {facultyInfo.employeeId}</p>
              <p><strong>Department:</strong> {facultyInfo.department}</p>
              <p><strong>Designation:</strong> {facultyInfo.designation}</p>
              <p><strong>Join Date:</strong> {facultyInfo.joinDate}</p>
              <p><strong>Mobile No.:</strong> {facultyInfo.mobileNo}</p>
              <p><strong>Address:</strong> {facultyInfo.address}</p>
              <p><strong>City:</strong> {facultyInfo.city}</p>
              <p><strong>State:</strong> {facultyInfo.state}</p>
              <p><strong>PIN Code:</strong> {facultyInfo.pinCode}</p>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Send Notification</h2>
            <form onSubmit={sendNotification} className="space-y-4">
              <input
                type="text"
                name="recipient"
                placeholder="Recipient (Student ID or 'All')"
                value={notification.recipient}
                onChange={handleNotificationChange}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="message"
                placeholder="Notification message"
                value={notification.message}
                onChange={handleNotificationChange}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Send Notification
              </button>
            </form>
          </div>
        )}

        {activeTab === "leave" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Request Leave</h2>
            <form onSubmit={submitLeaveRequest} className="space-y-4">
              <input
                type="date"
                name="startDate"
                value={leaveRequest.startDate}
                onChange={handleLeaveRequestChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="date"
                name="endDate"
                value={leaveRequest.endDate}
                onChange={handleLeaveRequestChange}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="reason"
                placeholder="Reason for leave"
                value={leaveRequest.reason}
                onChange={handleLeaveRequestChange}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit Leave Request
              </button>
            </form>
          </div>
        )}

        {activeTab === "results" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Upload Result Report</h2>
            <form onSubmit={uploadResultReport} className="space-y-4">
              <select
                name="course"
                value={resultReport.course}
                onChange={handleResultReportChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Course</option>
                <option value="B.Tech Computer Science">
                  B.Tech Computer Science
                </option>
                {/* Add more course options as needed */}
              </select>
              <select
                name="semester"
                value={resultReport.semester}
                onChange={handleResultReportChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Semester</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                {/* Add more semester options as needed */}
              </select>
              <input
                type="file"
                name="file"
                onChange={handleResultReportChange}
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
        )}

        {activeTab === "students" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Student List</h2>
            <ul className="space-y-2">
              <li>Student 1</li>
              <li>Student 2</li>
              <li>Student 3</li>
              {/* Add more students as needed */}
            </ul>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>
            <form onSubmit={submitAttendance} className="space-y-4">
              <select
                name="course"
                value={attendance.course}
                onChange={handleAttendanceChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Course</option>
                <option value="B.Tech Computer Science">
                  B.Tech Computer Science
                </option>
                {/* Add more course options as needed */}
              </select>
              <input
                type="date"
                name="date"
                value={attendance.date}
                onChange={handleAttendanceChange}
                className="w-full p-2 border rounded"
                required
              />
              <div className="space-y-2">
                {attendance.students.map((student, index) => (
                  <div
                    key={student.rollNumber}
                    className="flex items-center space-x-4"
                  >
                    <span>{student.name}</span>
                    <span>{student.rollNumber}</span>
                    <input
                      type="checkbox"
                      checked={student.present}
                      onChange={(e) =>
                        handleStudentAttendanceChange(e, index)
                      }
                    />
                    <label>Present</label>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit Attendance
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyDashboard;
