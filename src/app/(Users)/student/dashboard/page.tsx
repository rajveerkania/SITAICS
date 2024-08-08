"use client";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";

const Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedExam, setSelectedExam] = useState(
    "B.Sc. Hons Regular Exam, Semester - 2, Summer 2023-24"
  );
  const [currentTab, setCurrentTab] = useState("apply_leave");

  const timetableData = [
    {
      time: "09:30 AM to 10:30 AM",
      monday: "11010503DS02 (GMP)",
      tuesday: "Self study/Library (Skd)",
      wednesday: "00019303AE01 (RRP)",
      thursday: "Self study/Library (Kpp)",
      friday: "",
      saturday: "03010503SE01 (SAS)",
    },
    {
      time: "10:30 AM to 11:30 AM",
      monday: "Self study/Library (Kpp)",
      tuesday: "11010503DS02 (GMP)",
      wednesday: "11010503DS02 (GMP)",
      thursday: "11010503DS03 (SAS)",
      friday: "11010503DS04 (PPK)",
      saturday: "MOOC Course (Skd)",
    },
    // Add more timetable rows...
  ];

  const examResults = [
    {
      code: "00019101SE01",
      subject: "Mathematical Aptitude",
      credits: 2.0,
      grade: "P",
    },
    { code: "00019302AE04", subject: "Basic English-II", credits: 2.0, grade: "A" },
    // Add more exam results...
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>SITAICS Student Portal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="SITAICS" width={50} height={50} />
            <h1 className="ml-2 text-xl font-bold text-black-500">SITAICS</h1>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Welcome Student</span>
            <Image
              src="/profile-pic.jpg"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-gray-300"
            />
          </div>
        </div>
      </header>

      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-4 py-2">
            {["Dashboard", "Timetable", "Exam", "Achievement", "Leave", "Feedback"].map(
              (item) => (
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
              )
            )}
          </ul>
        </div>
      </nav>

      <main className="container mx-auto mt-8 px-4">
        {activeTab === "dashboard" && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Student Information</h2>
            <div className="border border-gray-300 rounded-lg p-4">
              <p className="font-semibold text-lg">SITAICS (School of Information Technology)</p>
              <p className="mt-2">
                <strong>Semester:</strong> 3
              </p>
              <p>
                <strong>Course:</strong> B.Tech in Computer Science with Specialization in Cyber Security
              </p>
              <p>
                <strong>Batch No.:</strong> 1
              </p>
              <p>
                <strong>Enroll No.:</strong> 3
              </p>
              <p>
                <strong>Student:</strong> [Student Name]
              </p>
              <p>
                <strong>Father:</strong> [Father Name]
              </p>
              <p>
                <strong>Mother:</strong> [Mother Name]
              </p>
              <p>
                <strong>Email:</strong> [Email Address]
              </p>
            </div>
          </div>
        )}

        {activeTab === "timetable" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Student Timetable</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Time Slot</th>
                    <th className="border p-2">Monday</th>
                    <th className="border p-2">Tuesday</th>
                    <th className="border p-2">Wednesday</th>
                    <th className="border p-2">Thursday</th>
                    <th className="border p-2">Friday</th>
                    <th className="border p-2">Saturday</th>
                  </tr>
                </thead>
                <tbody>
                  {timetableData.map((row, index) => (
                    <tr key={index}>
                      <td className="border p-2">{row.time}</td>
                      <td className="border p-2">{row.monday}</td>
                      <td className="border p-2">{row.tuesday}</td>
                      <td className="border p-2">{row.wednesday}</td>
                      <td className="border p-2">{row.thursday}</td>
                      <td className="border p-2">{row.friday}</td>
                      <td className="border p-2">{row.saturday}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "exam" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Exam Result</h2>
            <div className="mb-4">
              <label
                htmlFor="exam-select"
                className="block text-sm font-medium text-gray-700"
              >
                Select Exam
              </label>
              <select
                id="exam-select"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
              >
                <option>
                  B.Sc. Hons Regular Exam, Semester - 2, Summer 2023-24
                </option>
                <option>
                  B.Sc. Hons Regular Exam, Semester - 1, Winter 2023-24
                </option>
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
        )}

        {activeTab === "leave" && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Leave Management</h2>
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setCurrentTab("apply_leave")}
                className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                  currentTab === "apply_leave"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                Apply for Leave
              </button>
              <button
                onClick={() => setCurrentTab("view_leaves")}
                className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                  currentTab === "view_leaves"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                View Leaves
              </button>
            </div>
            {currentTab === "apply_leave" && (
              <form className="space-y-4 mt-4">
                <div className="w-full">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Leave Type
                    </option>
                    <option value="sick">Sick Leave</option>
                    <option value="vacation">Vacation</option>
                    <option value="personal">Personal Leave</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    placeholder="Start Date"
                    className="border p-2 rounded-md"
                  />
                  <input
                    type="date"
                    placeholder="End Date"
                    className="border p-2 rounded-md"
                  />
                </div>
                <textarea
                  placeholder="Reason for Leave"
                  className="border p-2 w-full rounded-md"
                />
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Apply for Leave
                </button>
              </form>
            )}
            {currentTab === "view_leaves" && (
              <div className="mt-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Leave Type</th>
                      <th className="border p-2">Start Date</th>
                      <th className="border p-2">End Date</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Add mock data or fetch real data */}
                    <tr>
                      <td className="border p-2">Sick Leave</td>
                      <td className="border p-2">2023-08-01</td>
                      <td className="border p-2">2023-08-03</td>
                      <td className="border p-2">Approved</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add other tab content here */}
      </main>
    </div>
  );
};

export default Page;
