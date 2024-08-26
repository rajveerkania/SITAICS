import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const LeavesTab = () => {
  const [leaves, setLeaves] = useState([
    { id: 1, name: 'John Doe', role: 'Student', reason: 'Medical', status: 'Pending', batch: '2024A', course: 'BTech' },
    { id: 2, name: 'Jane Smith', role: 'Student', reason: 'Personal', status: 'Pending', batch: '2024B', course: 'MTech' },
    { id: 3, name: 'Bob Johnson', role: 'Student', reason: 'Family Emergency', status: 'Approved', batch: '2024A', course: 'MTech AI/ML' },
    { id: 4, name: 'Alice Williams', role: 'Student', reason: 'Medical', status: 'Denied', batch: '2024C', course: 'MSCDF' },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredLeaves = leaves.filter((leave) => {
    return (
      leave.role === 'Student' &&
      leave.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === "" || leave.status === filterStatus) &&
      (filterCourse === "" || leave.course === filterCourse)
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
            <option value="Denied">Denied</option>
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
              <TableCell>{leave.name}</TableCell>
              <TableCell>{leave.role}</TableCell>
              <TableCell>{leave.reason}</TableCell>
              <TableCell>{leave.status}</TableCell>
              <TableCell>{leave.batch}</TableCell>
              <TableCell>{leave.course}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeavesTab;
