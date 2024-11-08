"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import usePreviousRoute from "@/app/hooks/usePreviousRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Book, Edit3, ArrowLeft, ChevronDown, ChevronUp, Bookmark, Users } from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  semester: number;
  courseName: string;
  isElective: boolean;
  electiveGroup?: {
    groupName: string;
  };
}

interface Course {
  courseId: string;
  courseName: string;
}

const SubjectEditPage = () => {
  const { id } = useParams();
  const { handleBack } = usePreviousRoute();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [detailsExpanded, setDetailsExpanded] = useState(true);

  const [editedSubject, setEditedSubject] = useState({
    subjectName: "",
    subjectCode: "",
    semester: 1,
    courseName: "",
    isElective: false,
    electiveGroupName: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectResponse = await fetch("/api/fetchSubjects");
        const subjectData = await subjectResponse.json();
        const currentSubject = subjectData.find(
          (s: Subject) => s.subjectId === id
        );

        if (currentSubject) {
          setSubject(currentSubject);
          setEditedSubject({
            subjectName: currentSubject.subjectName,
            subjectCode: currentSubject.subjectCode,
            semester: currentSubject.semester,
            courseName: currentSubject.courseName,
            isElective: currentSubject.isElective,
            electiveGroupName: currentSubject.electiveGroup?.groupName || "",
          });
        }

        const courseResponse = await fetch("/api/fetchCourses");
        const courseData = await courseResponse.json();
        setCourses(courseData.courses);
      } catch (error) {
        toast.error("Error fetching subject data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/updateSubject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectId: id,
          ...editedSubject,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update subject");
      }

      setSubject((prev) =>
        prev
          ? {
              ...prev,
              ...editedSubject,
              electiveGroup: editedSubject.electiveGroupName 
                ? { groupName: editedSubject.electiveGroupName }
                : undefined,
            }
          : null
      );

      toast.success("Subject updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update subject");
      console.error(error);
    }
  };

  const toggleDetails = () => {
    setDetailsExpanded(!detailsExpanded);
  };

  if (isLoading) {
    return <LoadingSkeleton loadingText="subject details" />;
  }

  if (!subject) {
    return <div>Subject not found</div>;
  }

  return (
    <div className="bg-[#f2f3f5] min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Card className="mb-6 overflow-hidden">
          <CardHeader className="cursor-pointer" onClick={toggleDetails}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Subject Details</CardTitle>
              {detailsExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>
            <CardDescription>
              Manage subject information and details
            </CardDescription>
          </CardHeader>

          {detailsExpanded && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Book className="mr-2 h-4 w-4" /> Subject Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedSubject.subjectName}
                        onChange={(e) =>
                          setEditedSubject({
                            ...editedSubject,
                            subjectName: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                    ) : (
                      <p className="text-lg">{subject.subjectName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Book className="mr-2 h-4 w-4" /> Subject Code
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedSubject.subjectCode}
                        onChange={(e) =>
                          setEditedSubject({
                            ...editedSubject,
                            subjectCode: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                    ) : (
                      <p className="text-lg">{subject.subjectCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Book className="mr-2 h-4 w-4" /> Semester
                    </label>
                    {isEditing ? (
                      <Select
                        value={editedSubject.semester.toString()}
                        onValueChange={(value) =>
                          setEditedSubject({
                            ...editedSubject,
                            semester: parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <SelectItem key={sem} value={sem.toString()}>
                              Semester {sem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-lg">Semester {subject.semester}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Book className="mr-2 h-4 w-4" /> Course
                    </label>
                    {isEditing ? (
                      <Select
                        value={editedSubject.courseName}
                        onValueChange={(value) =>
                          setEditedSubject({
                            ...editedSubject,
                            courseName: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem
                              key={course.courseId}
                              value={course.courseName}
                            >
                              {course.courseName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-lg">{subject.courseName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Bookmark className="mr-2 h-4 w-4" /> Subject Type
                    </label>
                    {isEditing ? (
                      <Select
                        value={editedSubject.isElective.toString()}
                        onValueChange={(value) =>
                          setEditedSubject({
                            ...editedSubject,
                            isElective: value === "true",
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select subject type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="false">Core</SelectItem>
                          <SelectItem value="true">Elective</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-lg">{subject.isElective ? "Elective" : "Core"}</p>
                    )}
                  </div>

                  {(editedSubject.isElective || subject.isElective) && (
                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <Users className="mr-2 h-4 w-4" /> Elective Group
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedSubject.electiveGroupName}
                          onChange={(e) =>
                            setEditedSubject({
                              ...editedSubject,
                              electiveGroupName: e.target.value,
                            })
                          }
                          className="w-full"
                          placeholder="Enter elective group name"
                        />
                      ) : (
                        <p className="text-lg">{subject.electiveGroup?.groupName || "Not assigned"}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          )}

          {detailsExpanded && (
            <CardFooter className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedSubject({
                        subjectName: subject.subjectName,
                        subjectCode: subject.subjectCode,
                        semester: subject.semester,
                        courseName: subject.courseName,
                        isElective: subject.isElective,
                        electiveGroupName: subject.electiveGroup?.groupName || "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Subject
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SubjectEditPage;