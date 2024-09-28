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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "sonner";
import LoadingSkeleton from "../LoadingSkeleton";

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const batchesPerPage = 5;
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
  };

  const handleOpenEditDialog = (batch: Batch) => {
    setCurrentBatch(batch);
    setEditDialogOpen(true);
  };

  const handleSaveBatchEdit = async () => {
    if (!currentBatch) return;

    try {
      const response = await fetch(`/api/editBatch/${currentBatch.batchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchName: currentBatch.batchName,
          courseName: currentBatch.courseName,
          batchDuration: currentBatch.batchDuration,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchBatches();
      setEditDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error saving batch edit: ${error.message}`);
    }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentBatch) {
      setCurrentBatch({
        ...currentBatch,
        [e.target.name]: e.target.value,
      });
    }
  };

  const totalBatches = batches.length;
  const totalPages = Math.ceil(totalBatches / batchesPerPage);
  const currentBatches = batches.slice(
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
      <TabsList>
        <TabsTrigger value="manage">Manage Batches</TabsTrigger>
        <TabsTrigger value="Create">Create Batch</TabsTrigger>
      </TabsList>
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
            {currentBatches.map((batch) => (
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
                      onClick={() => handleOpenEditDialog(batch)}
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
            ))}
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Batch</DialogTitle>
          </DialogHeader>
          {currentBatch ? (
            <div>
              <Input
                type="text"
                name="batchName"
                value={currentBatch.batchName}
                onChange={handleInputChange}
                placeholder="Batch Name"
                className="mb-2"
              />
              <Input
                type="text"
                name="courseName"
                value={currentBatch.courseName}
                onChange={handleInputChange}
                placeholder="Course Name"
                className="mb-2"
              />
              <Input
                type="number"
                name="batchDuration"
                value={currentBatch.batchDuration}
                onChange={handleInputChange}
                placeholder="Batch Duration"
                className="mb-2"
              />
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveBatchEdit}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </DialogContent>
      </Dialog>
    </Tabs>
  );
};

export default BatchTab;
