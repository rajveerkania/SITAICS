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
      <Tabs defaultValue="view" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          <div className="flex space-x-4">
            <TabsTrigger value="view">View Users</TabsTrigger>
            <TabsTrigger value="add">Add User</TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="view">
          <div className="w-full overflow-auto">
            <div className="overflow-x-auto">
              <div className="w-full sm:w-auto mt-1 flex items-center">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-col-reverse sm:flex-grow-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring focus:ring-gray-200 transition-all duration-300"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button onClick={() => setShowUserDetails(true)}>
                              <FaRegEdit className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => handleDeleteUser(user.id)}>
                              <FaTrashAlt className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

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
