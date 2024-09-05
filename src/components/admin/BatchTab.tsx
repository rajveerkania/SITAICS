import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import AddBatchForm from "./AddBatchForm";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get<Batch[]>("/api/fetchBatches");
      setBatches(response.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const handleUpdateSemester = async (batchId: string, newSemester: number) => {
    try {
      await axios.put(`/api/UpdateBatchSemester/${batchId}`, { currentSemester: newSemester });
      fetchBatches();
    } catch (error) {
      console.error("Error updating semester:", error);
    }
  };

  const handleViewBatchDetails = async (batchName: string) => {
    try {
      const response = await axios.get(`/api/students?batchName=${batchName}`);
      console.log("Student details:", response.data);
    } catch (error) {
      console.error("Error fetching student details:", error);
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
      await axios.put(`/api/editBatch/${currentBatch.batchId}`, {
        batchName: currentBatch.batchName,
        courseName: currentBatch.courseName,
        batchDuration: currentBatch.batchDuration,
      });
      fetchBatches();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error saving batch edit:", error);
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    try {
      await axios.delete(`/api/deleteBatch/${batchId}`);
      fetchBatches();
    } catch (error) {
      console.error("Error deleting batch:", error);
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
              <TableHead>Actions</TableHead>
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
                    onChange={(e) => handleUpdateSemester(batch.batchId, parseInt(e.target.value))}
                  />
                </TableCell>
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
                <Button variant="secondary" onClick={() => setEditDialogOpen(false)}>
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
