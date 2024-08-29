import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const Leave = () => {
  const [leaves, setLeaves] = useState([
    { id: 1, name: 'John Doe', role: 'Student', reason: 'Medical', status: 'Pending' },
    { id: 2, name: 'Jane Smith', role: 'Faculty', reason: 'Personal', status: 'Pending' },
    { id: 3, name: 'Bob Johnson', role: 'Student', reason: 'Family Emergency', status: 'Approved' },
  ]);

  const handleApprove = (id: number) => {
    setLeaves(leaves.map(leave => 
      leave.id === id ? { ...leave, status: 'Approved' } : leave
    ));
  };

  const handleDeny = (id: number) => {
    setLeaves(leaves.map(leave => 
      leave.id === id ? { ...leave, status: 'Denied' } : leave
    ));
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Leave Requests</h2>
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="p-4 text-left">Name</TableHead>
                <TableHead className="p-4 text-left">Role</TableHead>
                <TableHead className="p-4 text-left">Reason</TableHead>
                <TableHead className="p-4 text-left">Status</TableHead>
                <TableHead className="p-4 text-left">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((leave) => (
                <TableRow key={leave.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <TableCell className="p-4 border-b">{leave.name}</TableCell>
                  <TableCell className="p-4 border-b">{leave.role}</TableCell>
                  <TableCell className="p-4 border-b">{leave.reason}</TableCell>
                  <TableCell className="p-4 border-b">
                    <span
                      className={`px-3 py-1 rounded-full text-white font-semibold ${
                        leave.status === 'Pending' ? 'bg-yellow-500' :
                        leave.status === 'Approved' ? 'bg-green-500' :
                        'bg-red-500'
                      } transition-colors duration-300`}
                    >
                      {leave.status}
                    </span>
                  </TableCell>
                  <TableCell className="p-4 border-b">
                    {leave.status === 'Pending' && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleApprove(leave.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg transition-transform transform hover:scale-105"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeny(leave.id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition-transform transform hover:scale-105"
                        >
                          Deny
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Leave;
