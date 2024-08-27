import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdAdd, MdDelete } from "react-icons/md"; // Importing icons

const BatchesTab = () => {
  const [batches, setBatches] = useState([
    {
      id: 1,
      name: "Batch A",
      course: "BTech",
      duration: "8 Semesters",
      currentSemester: 2,
    },
    {
      id: 2,
      name: "Batch B",
      course: "MTech CS",
      duration: "4 Semesters",
      currentSemester: 1,
    },
  ]);

  const [newBatch, setNewBatch] = useState({
    name: "",
    course: "",
    duration: "",
    currentSemester: "",
  });

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setBatches([...batches, { id: batches.length + 1, ...newBatch }]);
    setNewBatch({ name: "", course: "", duration: "", currentSemester: "" });
  };

  const handleDeleteBatch = (id: number) => {
    setBatches(batches.filter((batch) => batch.id !== id));
  };

  return (
    <Tabs defaultValue="add">
      <TabsList>
        <TabsTrigger value="add">Add Batch</TabsTrigger>
        <TabsTrigger value="manage">Manage Batches</TabsTrigger>
      </TabsList>
      <TabsContent value="add">
        <form onSubmit={handleAddBatch} className="space-y-4">
          <Input
            placeholder="Batch Name"
            value={newBatch.name}
            onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
          />
          <Input
            placeholder="Course"
            value={newBatch.course}
            onChange={(e) =>
              setNewBatch({ ...newBatch, course: e.target.value })
            }
          />
          <Input
            placeholder="Duration (e.g., 8 Semesters)"
            value={newBatch.duration}
            onChange={(e) =>
              setNewBatch({ ...newBatch, duration: e.target.value })
            }
          />
          <Input
            placeholder="Current Semester"
            type="number"
            value={newBatch.currentSemester}
            onChange={(e) =>
              setNewBatch({ ...newBatch, currentSemester: e.target.value })
            }
          />
          <Button type="submit" className="flex items-center">
            <MdAdd className="mr-2" />
            Add Batch
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="manage">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Current Semester</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell>{batch.name}</TableCell>
                <TableCell>{batch.course}</TableCell>
                <TableCell>{batch.duration}</TableCell>
                <TableCell>{batch.currentSemester}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteBatch(batch.id)}
                    style={{ backgroundColor: "black", color: "white" }} // Inline style for black background and white text
                    className="flex items-center"
                  >
                    <MdDelete style={{ color: "white" }} className="mr-2" />{" "}
                    {/* White icon */}
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

export default BatchesTab;
