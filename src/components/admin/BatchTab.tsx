import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import AddBatchForm from "./AddBatchForm";
import { useToast } from "@/components/ui/use-toast";

interface Batch {
  batchId: string;
  batchName: string;
  courseName: string;
  batchDuration: number;
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
        await axios.put('/api/deleteBatch', { batchId });
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
                <TableCell>{batch.studentCount}</TableCell>
                <TableCell>
                    <div className="flex items-center space-x-2">
                            {/* <Button onClick={() => setShowUserDetails(true)}>
                              <FaRegEdit className="h-4 w-4" />
                            </Button> */}
                      <Button onClick={() => handleDeleteBatch(batch.batchId)}>
                              <FaTrashAlt className="h-4 w-4" />
                       </Button>
                      </div>
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
