import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const LeavesTab = () => {
  const [leaves, setLeaves] = useState([
    { id: 1, name: 'John Doe', role: 'Student', reason: 'Medical', status: 'Pending' },
    { id: 2, name: 'Jane Smith', role: 'Faculty', reason: 'Personal', status: 'Pending' },
    { id: 3, name: 'Bob Johnson', role: 'Student', reason: 'Family Emergency', status: 'Approved' },
  ]);

  const handleApprove = (id: any) => {
    setLeaves(leaves.map(leave => 
      leave.id === id ? { ...leave, status: 'Approved' } : leave
    ));
  };

  const handleDeny = (id: any) => {
    setLeaves(leaves.map(leave => 
      leave.id === id ? { ...leave, status: 'Denied' } : leave
    ));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaves.map((leave) => (
          <TableRow key={leave.id}>
            <TableCell>{leave.name}</TableCell>
            <TableCell>{leave.role}</TableCell>
            <TableCell>{leave.reason}</TableCell>
            <TableCell>{leave.status}</TableCell>
            <TableCell>
              {leave.status === 'Pending' && (
                <>
                  <Button onClick={() => handleApprove(leave.id)} className="mr-2">Approve</Button>
                  <Button variant="destructive" onClick={() => handleDeny(leave.id)}>Deny</Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LeavesTab;