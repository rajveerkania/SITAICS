import React, { useState } from "react";
import { toast } from "react-hot-toast"; // Ensure you have react-hot-toast installed

interface Course {
  id: string;
  courseName: string;
}

interface AddCourseFormProps {
  onAddCourseSuccess: (newCourse: Course) => void;
}

const AddCourseForm: React.FC<AddCourseFormProps> = ({ onAddCourseSuccess }) => {
  const [courseName, setCourseName] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/addCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseName }),
      });

      const data = await response.json();

      if (data.success) {
        const newCourse: Course = {
          id: data.id, // Assuming the response contains the new course ID
          courseName,
        };
        onAddCourseSuccess(newCourse);
        setCourseName("");
        toast.success("Course added successfully"); // Show success message
      } else {
        console.error(data.error || "An error occurred while adding the course");
      }
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
          Course Name
        </label>
        <input
          type="text"
          id="courseName"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Course
      </button>
    </form>
  );
};

export default AddCourseForm;
