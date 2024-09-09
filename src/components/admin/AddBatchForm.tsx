import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

interface Course {
  courseName: string;
}

interface AddBatchFormProps {
  onBatchAdded: () => void;
  onTabChange: (tab: string) => void;
}

const AddBatchForm: React.FC<AddBatchFormProps> = ({
  onBatchAdded,
  onTabChange,
}) => {
  const [newBatch, setNewBatch] = useState({
    batchName: "",
    courseName: "",
    batchDuration: "",
    currentSemester: "",
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/fetchCourses");
      if (response.data && response.data.courses) {
        setCourses(response.data.courses);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch courses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/addBatch", newBatch);
      setNewBatch({
        batchName: "",
        courseName: "",
        batchDuration: "",
        currentSemester: "",
      });
      onBatchAdded();
      onTabChange("manage");
      toast({
        title: "Success",
        description: "New batch added successfully.",
      });
    } catch (error) {
      console.error("Error adding batch:", error);
      toast({
        title: "Error",
        description: "Failed to add new batch. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleAddBatch} className="space-y-4">
      <Input
        placeholder="Batch Name"
        value={newBatch.batchName}
        onChange={(e) =>
          setNewBatch({ ...newBatch, batchName: e.target.value })
        }
        required
      />
      <Select
        value={newBatch.courseName}
        onValueChange={(value) =>
          setNewBatch({ ...newBatch, courseName: value })
        }
        required
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
            courses.map((course, index) => (
              <SelectItem key={index} value={course.courseName}>
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
        onChange={(e) =>
          setNewBatch({ ...newBatch, batchDuration: e.target.value })
        }
        required
      />
      <Input
        placeholder="Current Semester"
        type="number"
        value={newBatch.currentSemester}
        onChange={(e) =>
          setNewBatch({ ...newBatch, currentSemester: e.target.value })
        }
        required
      />
      <Button type="submit" className="flex items-center">
        Create Batch
      </Button>
    </form>
  );
};

export default AddBatchForm;
