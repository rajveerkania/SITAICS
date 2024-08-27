import React, { useState } from "react";

interface Leave {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

const LeaveManagement: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("apply_leave");
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaves, setLeaves] = useState<Leave[]>([
    { type: "Sick Leave", startDate: "2023-08-01", endDate: "2023-08-03", reason: "Fever", status: "Approved" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLeave: Leave = {
      type: leaveType,
      startDate,
      endDate,
      reason,
      status: "Pending",
    };
    setLeaves([...leaves, newLeave]);
    // Reset form
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  return (
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
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            required
          >
            <option value="">Leave Type</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Vacation">Vacation</option>
            <option value="Personal Leave">Personal Leave</option>
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              placeholder="Start Date"
              className="border p-2 rounded-md"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <input
              type="date"
              placeholder="End Date"
              className="border p-2 rounded-md"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <textarea
            placeholder="Reason for Leave"
            className="border p-2 w-full rounded-md"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
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
              {leaves.map((leave, index) => (
                <tr key={index}>
                  <td className="border p-2">{leave.type}</td>
                  <td className="border p-2">{leave.startDate}</td>
                  <td className="border p-2">{leave.endDate}</td>
                  <td className="border p-2">{leave.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;