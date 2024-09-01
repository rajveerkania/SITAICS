import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import AddBatchForm from "./AddBatchForm";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

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
  const [activeTab, setActiveTab] = useState("add");
  const { toast } = useToast();

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get<Batch[]>("/api/fetchBatches");
      setBatches(response.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast({
        title: "Error",
        description: "Failed to fetch batches. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSemester = async (batchId: string, newSemester: number) => {
    console.log(`Attempting to update batch ${batchId} to semester ${newSemester}`);
    if (confirm(`Are you sure you want to update the semester to ${newSemester} for all students in this batch?`)) {
      try {
        console.log(`Sending PUT request to /api/UpdateBatchSemester/${batchId}`);
        const response = await axios.put(`/api/UpdateBatchSemester/${batchId}`, { currentSemester: newSemester });
        console.log("Update response:", response.data);
        
        if (response.data.success) {
          setBatches(batches.map(batch => 
            batch.batchId === batchId ? { ...batch, currentSemester: newSemester } : batch
          ));
          
          toast({
            title: "Success",
            description: `Semester updated to ${newSemester} for all students in the batch.`,
          });
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        console.error("Error updating semester:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message || "Failed to update semester. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewBatchDetails = async (batchName: string) => {
    try {
      const response = await axios.get(`/api/students?batchName=${batchName}`);
      console.log("Student details:", response.data);
      // You might want to open a modal or navigate to a new page to display this data
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch student details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBatchAdded = () => {
    fetchBatches();
  };

  const handleDeleteBatch = async (batchId: string) => {
    if (confirm("Are you sure you want to delete this batch? This action cannot be undone.")) {
      try {
        await axios.delete(`/api/deleteBatch/${batchId}`);
        setBatches(batches.filter(batch => batch.batchId !== batchId));
        toast({
          title: "Success",
          description: "Batch deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting batch:", error);
        toast({
          title: "Error",
          description: "Failed to delete batch. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="add">Add Batch</TabsTrigger>
        <TabsTrigger value="manage">Manage Batches</TabsTrigger>
      </TabsList>
      <TabsContent value="add">
        <AddBatchForm onBatchAdded={handleBatchAdded} onTabChange={setActiveTab} />
      </TabsContent>
      <TabsContent value="manage">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Duration (Years)</TableHead>
              <TableHead>Current Semester</TableHead>
              <TableHead>Total Students</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch.batchId}>
                <TableCell>
                  <Button variant="link" onClick={() => handleViewBatchDetails(batch.batchName)}>
                    {batch.batchName}
                  </Button>
                </TableCell>
                <TableCell>{batch.courseName}</TableCell>
                <TableCell>{batch.batchDuration}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={batch.currentSemester}
                    onChange={(e) => {
                      const newSemester = parseInt(e.target.value);
                      if (!isNaN(newSemester) && newSemester > 0) {
                        handleUpdateSemester(batch.batchId, newSemester);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{batch.studentCount}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteBatch(batch.batchId)}
                    style={{ backgroundColor: "black", color: "white" }}
                    className="flex items-center"
                  >
                    <MdDelete style={{ color: "white" }} className="mr-2" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
};

export default BatchTab;