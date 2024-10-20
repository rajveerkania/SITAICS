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
  courseId: string;
}

interface ElectiveGroup {
  electiveGroupId: string;
  groupName: string;
  courseId: string;
  semester: number;
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
    courseName: "", // Added to store courseName
    isElective: "false",
    electiveGroupId: "",
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [electiveGroups, setElectiveGroups] = useState<ElectiveGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [csvData, setCSVData] = useState<CSVData[]>([]);
  const [availableElectiveGroups, setAvailableElectiveGroups] = useState<ElectiveGroup[]>([]);


  useEffect(() => {
    console.log("Current subject state:", newSubject);
    console.log("Available elective groups:", availableElectiveGroups);
  }, [newSubject, availableElectiveGroups]);
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

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fetchCourses");
      const data = await response.json();
      if (data && Array.isArray(data.courses)) {
        setCourses(data.courses);
      } else {
        toast.error("Unexpected response structure for courses");
      }
    } catch (error: any) {
      toast.error("Error fetching courses");
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
        console.log("Fetched elective groups:", data.groups); // Debug log
      } else {
        throw new Error("Failed to fetch groups");
      }
    } catch (error: any) {
      toast.error("Error fetching elective groups");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchElectiveGroups();
  }, []);


  useEffect(() => {
    if (newSubject.courseName && newSubject.semester) {
      const selectedCourse = courses.find(
        (course) => course.courseName === newSubject.courseName
      );

      if (selectedCourse) {
        const matchingGroups = electiveGroups.filter(
          (group) =>
            group.courseId === selectedCourse.courseId &&
            group.semester === parseInt(newSubject.semester, 10)
        );

        console.log("Matching groups found:", matchingGroups); 
        setAvailableElectiveGroups(matchingGroups);

        if (matchingGroups.length === 0) {
          setNewSubject((prev) => ({
            ...prev,
            isElective: "false",
            electiveGroupId: "",
          }));
        }
      }
    } else {
      setAvailableElectiveGroups([]);
    }
  }, [newSubject.courseName, newSubject.semester, courses, electiveGroups]);

  const handleCourseChange = (courseName: string) => {
    const selectedCourse = courses.find(
      (course) => course.courseName === courseName
    );

    if (selectedCourse) {
      setNewSubject((prev) => ({
        ...prev,
        courseName: courseName,
        courseId: selectedCourse.courseId,
      }));
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();

    const subjectData = {
      ...newSubject,
      semester: parseInt(newSubject.semester, 10),
      isElective: newSubject.isElective === "true",
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
      
      if (response.ok) {
        setNewSubject({
          subjectName: "",
          subjectCode: "",
          semester: "",
          courseId: "",
          courseName: "",
          isElective: "false",
          electiveGroupId: "",
        });
        toast.success("Subject added successfully");
        onAddSubjectSuccess();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error("Error adding Subject");
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
      <Select
        value={newSubject.courseName}
        onValueChange={handleCourseChange}
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
        placeholder="Semester"
        type="number"
        min="1"
        value={newSubject.semester}
        onChange={(e) =>
          setNewSubject({ ...newSubject, semester: e.target.value })
        }
        required
      />

      {availableElectiveGroups.length > 0 && (
        <>
          <Select
            value={newSubject.isElective}
            onValueChange={(value) => {
              setNewSubject({
                ...newSubject,
                isElective: value,
                electiveGroupId: value === "false" ? "" : newSubject.electiveGroupId,
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

          {newSubject.isElective === "true" && (
            <Select
              value={newSubject.electiveGroupId}
              onValueChange={(value) =>
                setNewSubject({ ...newSubject, electiveGroupId: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Elective Group" />
              </SelectTrigger>
              <SelectContent>
                {availableElectiveGroups.map((group) => (
                  <SelectItem
                    key={group.electiveGroupId}
                    value={group.electiveGroupId}
                  >
                    {group.groupName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </>
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