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
      { name: "Alice Johnson", rollNumber: "CS003", present: false },
    ],
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

  const handleStudentAttendanceChange = (index: number) => {
    setAttendance((prev) => ({
      ...prev,
      students: prev.students.map((student, i) =>
        i === index ? { ...student, present: !student.present } : student
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent, action: string) => {
    e.preventDefault();
    console.log(
      `Submitting ${action}:`,
      { notification, leaveRequest, resultReport, attendance }[action]
    );
    alert(`${action.charAt(0).toUpperCase() + action.slice(1)} submitted successfully!`);
    // Reset form state here
  };

  const renderDashboardContent = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg">Total Classes</h3>
          <p className="text-2xl">5</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg">Students</h3>
          <p className="text-2xl">150</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg">Pending Leaves</h3>
          <p className="text-2xl">2</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-2">Today's Schedule</h3>
          <ul className="space-y-2">
            <li>09:00 AM - Data Structures (Room 101)</li>
            <li>11:00 AM - Database Management (Lab 2)</li>
            <li>02:00 PM - Algorithms (Room 203)</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-2">Calendar</h3>
          <p>Calendar component placeholder</p>
        </div>
      </div>
    </>
  );

  const renderNotificationsForm = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Send Notification</h2>
      <form onSubmit={(e) => handleSubmit(e, "notification")} className="space-y-4">
        <input
          type="text"
          name="recipient"
          placeholder="Recipient (Student ID or 'All')"
          value={notification.recipient}
          onChange={(e) => handleInputChange(e, setNotification)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="message"
          placeholder="Notification message"
          value={notification.message}
          onChange={(e) => handleInputChange(e, setNotification)}
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
  );

  const renderLeaveRequestForm = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Request Leave</h2>
      <form onSubmit={(e) => handleSubmit(e, "leaveRequest")} className="space-y-4">
        <input
          type="date"
          name="startDate"
          value={leaveRequest.startDate}
          onChange={(e) => handleInputChange(e, setLeaveRequest)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          name="endDate"
          value={leaveRequest.endDate}
          onChange={(e) => handleInputChange(e, setLeaveRequest)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="reason"
          placeholder="Reason for leave"
          value={leaveRequest.reason}
          onChange={(e) => handleInputChange(e, setLeaveRequest)}
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
  );

  const renderResultReportForm = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Upload Result Report</h2>
      <form onSubmit={(e) => handleSubmit(e, "resultReport")} className="space-y-4">
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

  const renderStudentList = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Student List</h2>
      <ul className="space-y-2">
        {attendance.students.map((student) => (
          <li key={student.rollNumber}>
            {student.name} - {student.rollNumber}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderAttendanceForm = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>
      <form onSubmit={(e) => handleSubmit(e, "attendance")} className="space-y-4">
        <select
          name="course"
          value={attendance.course}
          onChange={(e) => handleInputChange(e, setAttendance)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Course</option>
          <option value="B.Tech Computer Science">B.Tech Computer Science</option>
          <option value="M.Tech AI/ML">M.Tech AI/ML</option>
        </select>
        <input
          type="date"
          name="date"
          value={attendance.date}
          onChange={(e) => handleInputChange(e, setAttendance)}
          className="w-full p-2 border rounded"
          required
        />
        <div className="space-y-2">
          {attendance.students.map((student, index) => (
            <div key={student.rollNumber} className="flex items-center space-x-4">
              <span>{student.name}</span>
              <span>{student.rollNumber}</span>
              <input
                type="checkbox"
                checked={student.present}
                onChange={() => handleStudentAttendanceChange(index)}
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
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>SITAICS Faculty Portal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="SITAICS" width={50} height={50} />
            <h1 className="ml-2 text-xl font-bold text-gray-700">SITAICS</h1>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Welcome {facultyInfo.name}</span>
            <Image
              src="/profile.png"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-gray-300"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto mt-8 px-4">
        <nav className="bg-gray-800 text-white mb-8">
          <ul className="flex flex-wrap">
            {["Dashboard", "Notifications", "Leave", "Results", "Students", "Attendance"].map((item) => (
              <li key={item}>
                <button
                  onClick={() => setActiveTab(item.toLowerCase())}
                  className={`px-4 py-2 transition-all duration-300 ${
                    activeTab === item.toLowerCase()
                      ? "bg-gray-700"
                      : "hover:bg-gray-600"
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main>
          {activeTab === "dashboard" && renderDashboardContent()}
          {activeTab === "notifications" && renderNotificationsForm()}
          {activeTab === "leave" && renderLeaveRequestForm()}
          {activeTab === "results" && renderResultReportForm()}
          {activeTab === "students" && renderStudentList()}
          {activeTab === "attendance" && renderAttendanceForm()}
        </main>
        <LogoutButton/>
      </div>
    </div>
  );
};

export default FacultyDashboard;
