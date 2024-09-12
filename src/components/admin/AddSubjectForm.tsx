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

interface AddSubjectFormProps {
  onSubjectAdded: () => void;
  onTabChange: (tab: string) => void;
}

const AddSubjectForm: React.FC<AddSubjectFormProps> = ({
  onSubjectAdded,
  onTabChange,
}) => {
  const [newSubject, setNewSubject] = useState({
    subjectName: "",
    subjectCode: "",
    semester: "",
    courseId: "",
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/fetchCourses");
      console.log("API Response for courses:", response.data);
      if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else if (response.data && Array.isArray(response.data.courses)) {
        setCourses(response.data.courses);
      } else {
        console.error(
          "Unexpected response structure for courses:",
          response.data
        );
        toast({
          title: "Error",
          description: "Failed to fetch courses. Unexpected data structure.",
          variant: "destructive",
        });
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

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert semester to integer before submitting
    const subjectData = {
      ...newSubject,
      semester: parseInt(newSubject.semester, 10), // Convert to integer
    };

    try {
      await axios.post("/api/addSubject", subjectData);
      setNewSubject({
        subjectName: "",
        subjectCode: "",
        semester: "",
        courseId: "",
      });
      onSubjectAdded();
      onTabChange("view");
      toast({
        title: "Success",
        description: "New Subject added successfully.",
      });
    } catch (error) {
      console.error("Error adding Subject:", error);
      toast({
        title: "Error",
        description: "Failed to add new Subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleAddSubject} className="space-y-4">
      <Input
        placeholder="Subject Name"
        value={newSubject.subjectName}
        onChange={(e) =>
          setNewSubject({ ...newSubject, subjectName: e.target.value })
        }
        required
      />
      <Input
        placeholder="Subject Code"
        value={newSubject.subjectCode}
        onChange={(e) =>
          setNewSubject({ ...newSubject, subjectCode: e.target.value })
        }
        required
      />
      <Input
        placeholder="Semester"
        value={newSubject.semester}
        onChange={(e) =>
          setNewSubject({ ...newSubject, semester: e.target.value })
        }
        required
      />
      <Select
        value={newSubject.courseId}
        onValueChange={(value) =>
          setNewSubject({ ...newSubject, courseId: value })
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
      <Button type="submit" className="flex items-center">
        Create Subject
      </Button>
    </form>
  );
};

export default AddSubjectForm;
