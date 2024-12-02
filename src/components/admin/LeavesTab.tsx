import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Define the type for the leave object
interface Leave {
  id: string;
  reason: string;
  status: string;
  student: {
    name: string;
    batchName: string;
    courseName: string;
  };
}

const LeavesTab = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]); // Specify the type of leaves as an array of Leave objects
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch leaves data from the API
  useEffect(() => {
    const fetchLeaves = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/fetchLeaves');  // Adjust the API URL as needed
        const data = await response.json();
        if (data.leaves) {
          setLeaves(data.leaves);
        }
      } catch (error) {
        console.error("Error fetching leaves:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredLeaves = leaves.filter((leave) => {
    return (
      leave.student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === "" || leave.status === filterStatus) &&
      (filterCourse === "" || leave.student.courseName === filterCourse)
    );
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <div className="flex flex-col sm:flex-row sm:space-x-2 mb-4 sm:mb-0">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name"
            className="px-4 py-2 border border-gray-300 rounded-md mb-2 sm:mb-0 sm:w-64"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md mb-2 sm:mb-0 sm:w-64"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md mb-2 sm:mb-0 sm:w-64"
          >
            <option value="">All Courses</option>
            <option value="BTech">BTech</option>
            <option value="MTech">MTech</option>
            <option value="MTech AI/ML">MTech AI/ML</option>
            <option value="MSCDF">MSCDF</option>
          </select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setSearchQuery(""); setFilterStatus(""); setFilterCourse(""); }}
          className="w-full sm:w-auto mt-2 sm:mt-0"
        >
          Clear
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Course</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{leave.student.name}</TableCell>
                <TableCell>{'Student'}</TableCell>
                <TableCell>{leave.reason}</TableCell>
                <TableCell>{leave.status}</TableCell>
                <TableCell>{leave.student.batchName}</TableCell>
                <TableCell>{leave.student.courseName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default LeavesTab;
