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

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fetchCourses");
      const data = await response.json();
      console.log("API Response for courses:", data);
      if (Array.isArray(data)) {
        setCourses(data);
      } else if (data && Array.isArray(data.courses)) {
        setCourses(data.courses);
      } else {
        // console.error("Unexpected response structure for courses:", data);
        toast.error("Unexpected response structure for courses:", data)
      }
    } catch (error:any) {
      // console.error("Error fetching courses:", error);
      toast.error("Error fetching courses",error)
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
      const response = await fetch("/api/addSubject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subjectData),
      });
      const result = await response.json();
      setNewSubject({
        subjectName: "",
        subjectCode: "",
        semester: "",
        courseId: "",
      });
      toast.success("Subject added successfully")
      fetchCourses();
      onSubjectAdded();
      onTabChange("manage");
    } catch (error:any) {
      // console.error("Error adding Subject:", error);
      toast.error("Error adding Subject",error)
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