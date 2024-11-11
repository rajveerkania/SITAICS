import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FaTrashAlt } from "react-icons/fa";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation"; // import the correct router hook

interface Student {
  id: string;
  username: string;
  name: string;
  enrollmentNumber: string;
  email: string;
  batchName: string;
}

const StudentListBatch: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [batches, setBatches] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  const router = useRouter(); // Use the router hook here

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/fetchBatchStudents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.status !== 200) {
          toast.error(data.message || "Error while fetching user data");
        } else {
          setStudents(data.students);
        }

        const uniqueBatches: string[] = Array.from(
          new Set(data.students.map((student: Student) => student.batchName))
        );

        setBatches(["all", ...uniqueBatches]);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleBatchChange = (value: string) => {
    setSelectedBatch(value);
  };

  const handleViewUser = async (userId: string) => {
    // Ensure the router push only happens on the client-side
    if (typeof window !== "undefined") {
      router.push(`/staff/dashboard/user/${userId}`);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      (selectedBatch === "all" || student.batchName === selectedBatch) &&
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
              {batches.map((batch) => (
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
            {currentStudents.map((student) => (
              <TableRow key={student.enrollmentNumber}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.enrollmentNumber}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.batchName}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      style={{
                        backgroundColor: "black",
                        color: "white",
                      }}
                      onClick={() => handleViewUser(student.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              variant="outline"
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentListBatch;
