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
import { toast } from "sonner";
import ImportButton from "../ImportButton";

interface Course {
  courseName: string;
}

interface CSVData {
  [key: string]: string;
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
  const [csvData, setCSVData] = useState<CSVData[]>([]);

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const result = parseCSV(text);
      setCSVData(result);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const parseCSV = (text: string): CSVData[] => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());

    return lines.slice(1).map((line) => {
      const values = line.split(",").map((value) => value.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || "";
        return obj;
      }, {} as CSVData);
    });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/fetchCourses");
      const data = await response.json();
      if (response.ok) {
        setCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/addBatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBatch),
      });
      const data = await response.json();
      if (response.ok) {
        setNewBatch({
          batchName: "",
          courseName: "",
          batchDuration: "",
          currentSemester: "",
        });
        onBatchAdded();
        onTabChange("manage");
        toast.success("Batch added successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
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
        placeholder="Current Semester"
        type="number"
        value={newBatch.currentSemester}
        onChange={(e) =>
          setNewBatch({ ...newBatch, currentSemester: e.target.value })
        }
        required
      />
      <div className="flex justify-between pt-5">
        <Button type="submit">Create Batch</Button>
        <ImportButton
          type="button"
          onSuccess={onBatchAdded}
          onFileUpload={handleFileUpload}
          fileCategory="importBatches"
          buttonText="Import CSV"
        />
      </div>
    </form>
  );
};

export default AddBatchForm;