import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Leave {
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
}

const LeaveRequest: React.FC = () => {
  const [currentTab, setCurrentTab] = useState("apply_leave");
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchLeaves = async () => {
    try {
      const response = await fetch("/api/student/fetchLeaveRequests");
      const data = await response.json();
      if (response.ok) {
        setLeaves(data.leaves);
        setErrorMessage("");
      } else {
        setErrorMessage(data.message || "Failed to load leave requests.");
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setErrorMessage("Failed to fetch leave requests. Please try again.");
    }
  };

  useEffect(() => {
    if (currentTab === "view_leaves") {
      fetchLeaves();
    }
  }, [currentTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/student/addLeaveRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: leaveType,
          startDate,
          endDate,
          reason,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const newLeave: Leave = {
          leaveType,
          fromDate: startDate,
          toDate: endDate,
          reason,
          status: "Pending",
        };
        setLeaves([...leaves, newLeave]);
        setLeaveType("");
        setStartDate("");
        setEndDate("");
        setReason("");
        setSuccessMessage("Leave request submitted successfully.");
        setErrorMessage("");
      } else {
        setErrorMessage(data.message || "Error submitting leave request.");
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      setErrorMessage("Failed to submit leave request. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setCurrentTab("apply_leave")}
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            currentTab === "apply_leave"
              ? "bg-black text-white hover:bg-gray-900"
              : "bg-gray-200 text-black"
          }`}
        >
          Apply for Leave
        </button>
        <button
          onClick={() => setCurrentTab("view_leaves")}
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            currentTab === "view_leaves"
              ? "bg-black text-white hover:bg-gray-900"
              : "bg-gray-200 text-black"
          }`}
        >
          View Leaves
        </button>
      </div>

      {currentTab === "apply_leave" && (
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <Select onValueChange={setLeaveType} value={leaveType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Leave Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sick Leave">Sick Leave</SelectItem>
              <SelectItem value="Vacation">Vacation</SelectItem>
              <SelectItem value="Personal Leave">Personal Leave</SelectItem>
            </SelectContent>
          </Select>

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
          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
          >
            Apply for Leave
          </Button>
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
                  <td className="border p-2">{leave.leaveType}</td>
                  <td className="border p-2">{leave.fromDate}</td>
                  <td className="border p-2">{leave.toDate}</td>
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

export default LeaveRequest;
