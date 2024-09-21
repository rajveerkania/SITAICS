import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AddCourseFormProps {
  onAddCourseSuccess: (newCourse: {
    courseId: string;
    courseName: string;
    isActive: boolean;
  }) => void;
}

const AddCourseForm: React.FC<AddCourseFormProps> = ({
  onAddCourseSuccess,
}) => {
  const [courseName, setCourseName] = useState("");

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

        onAddCourseSuccess({ ...data, isActive: true });
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
      <Button type="submit">Create Course</Button>
    </form>
  );
};

export default AddCourseForm;