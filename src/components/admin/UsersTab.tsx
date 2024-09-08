import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSkeleton from "../LoadingSkeleton";
import AccessDenied from "../accessDenied";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { FaRegEdit, FaTrashAlt, FaEye } from "react-icons/fa";

interface Record {
  id: string;
  name: string;
  email?: string;
  role?: string;
  course?: string;
  subject?: string;
  batch?: string;
}

const InactiveRecords = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("admin");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const recordsPerPage = 10;

  const fetchRecords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/getInactiveRecords?category=${selectedOption}`
      );
      const data = await response.json();
      if (response.status !== 200 && response.status !== 403) {
        toast.error(data.message);
      }
      if (response.status === 403) {
        return <AccessDenied />;
      }

      if (data.success && Array.isArray(data.records)) {
        setRecords(data.records);
      } else {
        toast.error("An unexpected error occurred");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setError("Failed to load records. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedOption]);

  const filteredRecords = records.filter((record) =>
    record.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleDelete = (id: string) => {
    // Implement delete functionality
    console.log("Delete record with id:", id);
  };

  const handleView = (id: string) => {
    // Implement view functionality
    console.log("View record with id:", id);
  };

  if (isLoading) {
    return <LoadingSkeleton loadingText="records" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const isCourseSubjectBatch = ["course", "subject", "batch"].includes(
    selectedOption
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
        <div className="w-full sm:w-auto flex items-center space-x-4">
          <Select
            value={selectedOption}
            onValueChange={(value) => setSelectedOption(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="po">Placement Officers</SelectItem>
              <SelectItem value="batch">Batches</SelectItem>
              <SelectItem value="subject">Subjects</SelectItem>
              <SelectItem value="course">Courses</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {!isCourseSubjectBatch && (
                <>
                  <TableHead>Email</TableHead>
                  <TableHead>Username</TableHead>
                </>
              )}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRecords.length > 0 ? (
              currentRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.name}</TableCell>
                  {!isCourseSubjectBatch && (
                    <>
                      <TableCell>{record.email}</TableCell>
                      <TableCell>
                        {record.role ||
                          record.course ||
                          record.subject ||
                          record.batch}
                      </TableCell>
                    </>
                  )}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button onClick={() => handleView(record.id)}>
                        <FaEye className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDelete(record.id)}>
                        <FaTrashAlt className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isCourseSubjectBatch ? 2 : 4}
                  className="text-center"
                >
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {filteredRecords.length > recordsPerPage && (
          <div className="pagination mt-4 flex justify-center items-center space-x-4 mb-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="pagination-button"
            >
              Previous
            </Button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="pagination-button"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InactiveRecords;
