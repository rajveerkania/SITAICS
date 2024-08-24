"use client";
import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { LogoutButton } from "@/components/LogoutButton";

const PlacementOfficerDashboard: React.FC = () => {
  const [officerInfo] = useState({
    name: "Mr. Rahul Desai",
    email: "rahuldesai@university.edu",
    employeeId: "TIPO001",
    department: "Placement Office",
    designation: "Training Internship Placement Officer",
    joinDate: "2018-05-15",
    mobileNo: "+91 9876543210",
    address: "456 TIPO Office, University Campus",
    city: "Pune",
    state: "Maharashtra",
    pinCode: "411007",
  });

  const [activeTab, setActiveTab] = useState("dashboard");

  const [jobPosting, setJobPosting] = useState({
    company: "",
    position: "",
    deadline: "",
    description: "",
    eligibility: "",
  });

  const [interviewSchedule, setInterviewSchedule] = useState({
    company: "",
    date: "",
    time: "",
    venue: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    stateSetter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { name, value } = e.target;
    stateSetter((prev:any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent, action: string) => {
    e.preventDefault();
    console.log(`Submitting ${action}:`, { jobPosting, interviewSchedule }[action]);
    alert(`${action.charAt(0).toUpperCase() + action.slice(1)} submitted successfully!`);
  };

  const renderDashboardContent = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg shadow-lg">
        <h3 className="font-bold text-lg">Total Companies</h3>
        <p className="text-2xl">25</p>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg shadow-lg">
        <h3 className="font-bold text-lg">Active Job Postings</h3>
        <p className="text-2xl">8</p>
      </div>
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-lg shadow-lg">
        <h3 className="font-bold text-lg">Scheduled Interviews</h3>
        <p className="text-2xl">3</p>
      </div>
      <LogoutButton/>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>TIPO Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="University" width={50} height={50} />
            <h1 className="ml-2 text-xl font-bold text-gray-700">TIPO Dashboard</h1>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Welcome {officerInfo.name}</span>
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
            {["Dashboard", "Job Postings", "Interviews", "Companies", "Reports"].map(
              (item) => (
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
              )
            )}
          </ul>
        </nav>

        <main>
          {activeTab === "dashboard" && renderDashboardContent()}

          {activeTab === "job postings" && (
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Create Job Posting</h2>
              <form onSubmit={(e) => handleSubmit(e, "jobPosting")} className="space-y-4">
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={jobPosting.company}
                  onChange={(e) => handleInputChange(e, setJobPosting)}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="position"
                  placeholder="Position"
                  value={jobPosting.position}
                  onChange={(e) => handleInputChange(e, setJobPosting)}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="date"
                  name="deadline"
                  value={jobPosting.deadline}
                  onChange={(e) => handleInputChange(e, setJobPosting)}
                  className="w-full p-2 border rounded"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Job Description"
                  value={jobPosting.description}
                  onChange={(e) => handleInputChange(e, setJobPosting)}
                  className="w-full p-2 border rounded"
                  required
                />
                <textarea
                  name="eligibility"
                  placeholder="Eligibility Criteria"
                  value={jobPosting.eligibility}
                  onChange={(e) => handleInputChange(e, setJobPosting)}
                  className="w-full p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Create Job Posting
                </button>
              </form>
            </div>
          )}

          {activeTab === "interviews" && (
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Schedule Interview</h2>
              <form
                onSubmit={(e) => handleSubmit(e, "interviewSchedule")}
                className="space-y-4"
              >
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={interviewSchedule.company}
                  onChange={(e) => handleInputChange(e, setInterviewSchedule)}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={interviewSchedule.date}
                  onChange={(e) => handleInputChange(e, setInterviewSchedule)}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={interviewSchedule.time}
                  onChange={(e) => handleInputChange(e, setInterviewSchedule)}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="venue"
                  placeholder="Venue"
                  value={interviewSchedule.venue}
                  onChange={(e) => handleInputChange(e, setInterviewSchedule)}
                  className="w-full p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Schedule Interview
                </button>
              </form>
            </div>
          )}

          {activeTab === "companies" && (
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Manage Companies</h2>
              <ul className="space-y-2">
                <li>Company 1</li>
                <li>Company 2</li>
                <li>Company 3</li>
              </ul>
              {/* Implement Add/Edit/Delete Company functionality */}
            </div>
          )}

          {activeTab === "reports" && (
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Generate Reports</h2>
              {/* Implement Report generation for placements, internships, etc. */}
             
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Implement report generation logic
                  alert("Report generated successfully!");
                }}
                className="space-y-4"
              >
                <select
                  name="reportType"
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Report Type</option>
                  <option value="placement">Placement Report</option>
                  <option value="internship">Internship Report</option>
                  <option value="company">Company Interaction Report</option>
                </select>
                <input
                  type="date"
                  name="startDate"
                  placeholder="Start Date"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="date"
                  name="endDate"
                  placeholder="End Date"
                  className="w-full p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Generate Report
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PlacementOfficerDashboard;
