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
import LoadingSkeleton from "../LoadingSkeleton";

interface AddElectiveGroupFormProps {
  onAddElectiveGroupSuccess: () => void;
}

const AddElectiveGroupForm: React.FC<AddElectiveGroupFormProps> = ({
  onAddElectiveGroupSuccess,
}) => {
  const [newElectiveGroup, setNewElectiveGroup] = useState({
    groupName: "",
    courseName: "",
    semester: "",
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getCoursesName");
        const data = await response.json();
        if (Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          throw new Error("Invalid course data format");
        }
      } catch (error) {
        toast.error("Error fetching courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleAddElectiveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/addElectiveGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newElectiveGroup),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add elective group");
      }
      setNewElectiveGroup({ groupName: "", courseName: "", semester: "" });
      toast.success("Group added successfully");
      onAddElectiveGroupSuccess();
    } catch (error: any) {
      toast.error(error.message || "Error adding elective group");
    }
  };

  if (loading) {
    return <LoadingSkeleton loadingText="Loading courses..." />;
  }

  return (
    <form onSubmit={handleAddElectiveGroup} className="space-y-4">
      <Input
        placeholder="Elective Group Name"
        value={newElectiveGroup.groupName}
        onChange={(e) =>
          setNewElectiveGroup({
            ...newElectiveGroup,
            groupName: e.target.value,
          })
        }
        required
      />
      <Select
        value={newElectiveGroup.courseName}
        onValueChange={(value) =>
          setNewElectiveGroup({ ...newElectiveGroup, courseName: value })
        }
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Course" />
        </SelectTrigger>
        <SelectContent>
          {courses.length > 0 ? (
            courses.map((course: any, index) => (
              <SelectItem key={index} value={course.courseName}>
                {course.courseName}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>
              No courses available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <Input
        placeholder="Semester"
        value={newElectiveGroup.semester}
        onChange={(e) =>
          setNewElectiveGroup({ ...newElectiveGroup, semester: e.target.value })
        }
        required
      />
      <Button type="submit">Add Elective Group</Button>
    </form>
  );
};

export default AddElectiveGroupForm;
