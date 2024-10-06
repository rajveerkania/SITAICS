import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddBatchForm from "./AddBatchForm";
import { Input } from "@/components/ui/input";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "sonner";
import LoadingSkeleton from "../LoadingSkeleton";
import { useRouter } from "next/navigation"; // Importing useRouter

interface Batch {
  batchId: string;
  batchName: string;
  courseName: string;
  batchDuration: number;
  currentSemester: number;
  studentCount: number;
}

const BatchTab = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [activeTab, setActiveTab] = useState("manage");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const batchesPerPage = 5;
  const router = useRouter(); // Initialize useRouter

  const fetchBatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/fetchBatches");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBatches(data);
    } catch (error: any) {
      setError("Failed to load courses. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleUpdateSemester = async (batchId: string, newSemester: number) => {
    try {
      const response = await fetch(`/api/UpdateBatchSemester/${batchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentSemester: newSemester }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchBatches();
    } catch (error: any) {
      toast.error(`Error updating semester: ${error.message}`);
    }
  };

  const handleViewBatchDetails = async (batchName: string) => {
    try {
      const response = await fetch(`/api/students?batchName=${batchName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error: any) {
      toast.error(`Error fetching student details: ${error.message}`);
    }
  };

  const handleBatchAdded = () => {
    fetchBatches();
    setActiveTab("manage");
  };

  const handleEditBatch = (batchId: string) => {
    router.push(`/admin/dashboard/batch/${batchId}`); // Navigate to the batch edit page
  };

  const handleDeleteBatch = async (batchId: string) => {
    try {
      const response = await fetch(`/api/deleteBatch/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ batchId }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Batch deleted successfully");
      } else {
        toast.error(`Error in deleting the batch: ${data.message}`);
      }
      fetchBatches();
    } catch (error: any) {
      toast.error(`An unexpected error occurred: ${error.message}`);
    }
  };

  const filteredBatches = batches.filter((batch) =>
    batch.batchName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBatches = filteredBatches.length;
  const totalPages = Math.ceil(totalBatches / batchesPerPage);
  const currentBatches = filteredBatches.slice(
    (currentPage - 1) * batchesPerPage,
    currentPage * batchesPerPage
  );

  if (isLoading) {
    return <LoadingSkeleton loadingText="batches" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="manage">Manage Batches</TabsTrigger>
          <TabsTrigger value="Create">Create Batch</TabsTrigger>
        </TabsList>
        {activeTab === "manage" && (
          <Input
            className="w-full sm:w-auto sm:ml-auto"
            type="text"
            placeholder="Search batches"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
      <TabsContent value="Create">
        <AddBatchForm
          onBatchAdded={handleBatchAdded}
          onTabChange={setActiveTab}
        />
      </TabsContent>
      <TabsContent value="manage">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Current Semester</TableHead>
              <TableHead>Total Students</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBatches.length > 0 ? (
              currentBatches.map((batch) => (
                <TableRow key={batch.batchId}>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() => handleViewBatchDetails(batch.batchName)}
                    >
                      {batch.batchName}
                    </Button>
                  </TableCell>
                  <TableCell>{batch.courseName}</TableCell>
                  <TableCell>{batch.currentSemester}</TableCell>
                  <TableCell>{batch.studentCount}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditBatch(batch.batchId)}
                        style={{ backgroundColor: "black", color: "white" }}
                        className="flex items-center"
                      >
                        <FaEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteBatch(batch.batchId)}
                        style={{ backgroundColor: "black", color: "white" }}
                        className="flex items-center"
                      >
                        <FaTrashAlt className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No batches found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="pagination mt-4 flex justify-center items-center space-x-4">
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
      </TabsContent>
    </Tabs>
  );
};

export default BatchTab;
