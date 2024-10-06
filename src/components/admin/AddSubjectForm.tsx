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

interface ElectiveGroup {
  electiveGroupId: string;
  groupName: string;
}

interface CSVData {
  [key: string]: string;
}

interface AddSubjectFormProps {
  onAddSubjectSuccess: () => void;
}

const AddSubjectForm: React.FC<AddSubjectFormProps> = ({
  onAddSubjectSuccess,
}) => {
  const [newSubject, setNewSubject] = useState({
    subjectName: "",
    subjectCode: "",
    semester: "",
    courseId: "",
    isElective: false,
    electiveGroupId: "",
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [electiveGroups, setElectiveGroups] = useState<ElectiveGroup[]>([]);
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
    fetchElectiveGroups();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fetchCourses");
      const data = await response.json();
      if (Array.isArray(data)) {
      } else if (data && Array.isArray(data.courses)) {
        setCourses(data.courses);
      } else {
        toast.error("Unexpected response structure for courses:", data);
      }
    } catch (error: any) {
      toast.error("Error fetching courses", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchElectiveGroups = async () => {
    try {
      const response = await fetch("/api/fetchElectiveGroups");
      const data = await response.json();
      if (Array.isArray(data.groups)) {
        setElectiveGroups(data.groups);
      } else {
        throw new Error("Failed to fetch groups");
      }
    } catch (error: any) {
      toast.error("Error fetching elective groups", error);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();

    const subjectData = {
      ...newSubject,
      semester: parseInt(newSubject.semester, 10),
    };

    try {
      const response = await fetch("/api/addSubject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subjectData),
      });
      const data = await response.json();
      setNewSubject({
        subjectName: "",
        subjectCode: "",
        semester: "",
        courseId: "",
        isElective: false,
        electiveGroupId: "",
      });
      if (response.ok) {
        toast.success("Subject added successfully");
        onAddSubjectSuccess();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error("Error adding Subject", error);
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
      <Select
        value={newSubject.isElective ? "true" : "false"}
        onValueChange={(value) => {
          const isElectiveValue = value === "true";
          setNewSubject({
            ...newSubject,
            isElective: isElectiveValue,
            electiveGroupId: isElectiveValue ? newSubject.electiveGroupId : "",
          });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Is Elective?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="false">No</SelectItem>
          <SelectItem value="true">Yes</SelectItem>
        </SelectContent>
      </Select>

      {newSubject.isElective === true && (
        <Select
          value={newSubject.electiveGroupId}
          onValueChange={(value) =>
            setNewSubject({ ...newSubject, electiveGroupId: value })
          }
          required={newSubject.isElective === true}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Elective Group" />
          </SelectTrigger>
          <SelectContent>
            {electiveGroups.length > 0 ? (
              electiveGroups.map((group) => (
                <SelectItem
                  key={group.electiveGroupId}
                  value={group.electiveGroupId}
                >
                  {group.groupName}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No Elective Groups Available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      )}
      <div className="flex justify-between pt-5">
        <Button type="submit">Create Subject</Button>
        <ImportButton
          type="button"
          onSuccess={onAddSubjectSuccess}
          onFileUpload={handleFileUpload}
          fileCategory="importSubjects"
          buttonText="Import CSV"
        />
      </div>
    </form>
  );
};

export default AddSubjectForm;
