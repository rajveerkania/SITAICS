import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Student {
  name: string;
  rollNumber: string;
  email: string;
  present: boolean;
  batch: string;
}

const StudentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBatch, setSelectedBatch] = useState("all");

  const [attendance] = useState({
    course: "",
    date: "",
    students: [
      { name: "Het Patel", rollNumber: "CS001", email: "het@example.com", present: false, batch: "Batch A" },
      { name: "Hetanshu Shah", rollNumber: "CS002", email: "hetanshu@example.com", present: false, batch: "Batch B" },
      { name: "Harsh Vasava", rollNumber: "CS003", email: "harsh@example.com", present: false, batch: "Batch A" },
      { name: "Nirav Joshi", rollNumber: "CS004", email: "nirav@example.com", present: false, batch: "Batch C" },
      { name: "Rajveer Kania", rollNumber: "CS005", email: "rajveer@example.com", present: false, batch: "Batch B" },
    ],
  });

  const batches = ["all", ...new Set(attendance.students.map(student => student.batch))];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleBatchChange = (value: string) => {
    setSelectedBatch(value);
  };

  const filteredStudents = attendance.students.filter(student =>
    (selectedBatch === "all" || student.batch === selectedBatch) &&
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Student List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <Select onValueChange={handleBatchChange} value={selectedBatch}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map(batch => (
                <SelectItem key={batch} value={batch}>
                  {batch === "all" ? "All Batches" : batch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:w-[200px]"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Enrollment Number</TableHead>
              <TableHead>Email ID</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map(student => (
              <TableRow key={student.rollNumber}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.batch}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedStudent(student)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Student Details</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <p className="text-gray-700 mb-2">
                          <strong>Name:</strong> {student.name}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <strong>Enrollment Number:</strong> {student.rollNumber}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <strong>Email ID:</strong> {student.email}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <strong>Batch:</strong> {student.batch}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StudentList;