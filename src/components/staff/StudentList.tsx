import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

interface Student {
  username: string;
  name: string;
  enrollmentNumber: string;
  email: string;
  batchName: string;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [batches, setBatches] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("/api/fetchStudentDetails");
        const studentsData = response.data.students;

        // Set students in state
        setStudents(studentsData);

        // Get unique batches
        const uniqueBatches: string[] = Array.from(new Set(studentsData.map((student: Student) => student.batchName)));

        // Set batches with "all" as a filter option
        setBatches(["all", ...uniqueBatches]);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  // Search term handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Batch selection handler
  const handleBatchChange = (value: string) => {
    setSelectedBatch(value);
  };

  // Filter students based on search term and selected batch
  const filteredStudents = students.filter((student) =>
    (selectedBatch === "all" || student.batchName === selectedBatch) &&
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Student List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          {/* Batch Filter Dropdown */}
          <Select onValueChange={handleBatchChange} value={selectedBatch}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch} value={batch}>
                  {batch === "all" ? "All Batches" : batch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Input */}
          <Input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:w-[200px]"
          />
        </div>

        {/* Student Table */}
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
            {currentStudents.map((student) => (
              <TableRow key={student.enrollmentNumber}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.enrollmentNumber}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.batchName}</TableCell>
                <TableCell>
                  {/* View Details Dialog */}
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
                          <strong>Enrollment Number:</strong> {student.enrollmentNumber}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <strong>Email ID:</strong> {student.email}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <strong>Batch:</strong> {student.batchName}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button key={index + 1} onClick={() => paginate(index + 1)} variant="outline">
              {index + 1}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentList;
