import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import AddBatchForm from "./AddBatchForm";
import { Input } from "@/components/ui/input";

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
      // Handle the student details as needed, e.g., open a modal or navigate to a new page
      console.log("Student details:", response.data);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const handleBatchAdded = () => {
    fetchBatches();
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
                    onChange={(e) => handleUpdateSemester(batch.batchId, parseInt(e.target.value))}
                  />
                </TableCell>
                <TableCell>{batch.studentCount}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => {/* Implement delete functionality */}}
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
