import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ImportButton from "@/components/ImportButton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AddCourseFormProps {
  onAddCourseSuccess: (newCourse: {
    courseId: string;
    courseName: string;
    isActive: boolean;
    totalBatches: string;
    totalSubjects: string;
  }) => void;
}

interface CSVData {
  [key: string]: string;
}

const AddCourseForm: React.FC<AddCourseFormProps> = ({
  onAddCourseSuccess,
}) => {
  const [courseName, setCourseName] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/addCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseName }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Course added successfully");

        // Create a complete course object
        onAddCourseSuccess({
          courseId: data.courseId, // Assuming the API returns courseId
          courseName: data.courseName,
          isActive: true,
          totalBatches: "0", // Default value
          totalSubjects: "0", // Default value
        });
        setCourseName("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        placeholder="Enter course name"
        required
      />
      <div className="flex justify-between pt-5">
        <Button type="submit">Create Course</Button>
        <ImportButton
          type="button"
          onFileUpload={handleFileUpload}
          fileCategory="importCourses"
          buttonText="Import CSV"
        />
      </div>
    </form>
  );
};

export default AddCourseForm;

