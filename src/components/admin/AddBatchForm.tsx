import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";

interface Course {
  courseId: string;
  courseName: string;
}

interface AddBatchFormProps {
  onBatchAdded: () => void;
  onTabChange: (tab: string) => void;
}

const AddBatchForm: React.FC<AddBatchFormProps> = ({ onBatchAdded, onTabChange }) => {
  const [newBatch, setNewBatch] = useState({
    batchName: "",
    courseName: "",
    batchDuration: "",
    currentSemester: "",
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get<Course[]>("/api/fetchCourses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/addBatch", newBatch);
      setNewBatch({ batchName: "", courseName: "", batchDuration: "", currentSemester: "" });
      onBatchAdded();
      onTabChange("manage");
    } catch (error) {
      console.error("Error adding batch:", error);
    }
  };

  return (
    <form onSubmit={handleAddBatch} className="space-y-4">
      <Input
        placeholder="Batch Name"
        value={newBatch.batchName}
        onChange={(e) => setNewBatch({ ...newBatch, batchName: e.target.value })}
      />
      <Select
        value={newBatch.courseName}
        onValueChange={(value) => setNewBatch({ ...newBatch, courseName: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Course" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="none" disabled>
              Loading Courses...
            </SelectItem>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <SelectItem key={course.courseId} value={course.courseName}>
                {course.courseName}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>
              No Courses Available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <Input
        placeholder="Duration (in years)"
        type="number"
        value={newBatch.batchDuration}
        onChange={(e) => setNewBatch({ ...newBatch, batchDuration: e.target.value })}
      />
      <Input
        placeholder="Current Semester"
        type="number"
        value={newBatch.currentSemester}
        onChange={(e) => setNewBatch({ ...newBatch, currentSemester: e.target.value })}
      />
      <Button type="submit" className="flex items-center">
        Add Batch
      </Button>
    </form>
  );
};

export default AddBatchForm;
