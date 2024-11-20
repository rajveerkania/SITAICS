"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit3,
  Users,
  School,
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

interface BatchDetails {
  batchId: string;
  batchName: string;
  courseName: string;
  batchDuration: number;
  currentSemester: number;
  studentCount: number;
}

interface Student {
  studentId: string;
  name: string;
  enrollmentNumber: string;
  email: string;
  contactNo: string;
}

const BatchEditPage = () => {
  const { handleBack } = usePreviousRoute();
  const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<
    {
      courseId: string;
      courseName: string;
    }[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [batchDetailsExpanded, setBatchDetailsExpanded] = useState(true);
  const [studentsExpanded, setStudentsExpanded] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        const batchResponse = await fetch(`/api/fetchBatches?batchId=${id}`);
        const batchData = await batchResponse.json();
        setBatchDetails(batchData);

        const studentsResponse = await fetch(
          `/api/fetchStudents?batchId=${id}`
        );
        const studentsData = await studentsResponse.json();
        setStudents(studentsData.students);

        const coursesResponse = await fetch("/api/fetchCourses");
        const coursesData = await coursesResponse.json();
        setCourses(coursesData.courses);
        setIsLoading(false);
      } catch (error) {
        toast.error("Error while fetching batch data!");
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchBatchDetails();
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/updateBatch/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batchDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to update batch");
      }

      toast.success("Batch details updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update batch details");
      console.error(error);
    }
  };

  const handleViewStudent = (studentId: string) => {
    if (studentId) router.push(`/admin/dashboard/user/${studentId}`);
  };

  const toggleBatchDetails = () => {
    setBatchDetailsExpanded(!batchDetailsExpanded);
  };

  const toggleStudents = () => {
    setStudentsExpanded(!studentsExpanded);
  };

  if (isLoading) {
    return <LoadingSkeleton loadingText="Batch Details" />;
  }

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {/* Batch Details Card */}
        <Card className="mb-6">
          <CardHeader className="cursor-pointer" onClick={toggleBatchDetails}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Batch Details</CardTitle>
              {batchDetailsExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>
            <CardDescription>
              Manage batch information and view enrolled students
            </CardDescription>
          </CardHeader>

          {batchDetailsExpanded && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <School className="mr-2 h-4 w-4" /> Batch Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={batchDetails?.batchName}
                        onChange={(e) =>
                          setBatchDetails({
                            ...batchDetails!,
                            batchName: e.target.value,
                          })
                        }
                        className="w-full"
                      />
                    ) : (
                      <p className="text-lg">{batchDetails?.batchName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <School className="mr-2 h-4 w-4" /> Course
                    </label>
                    {isEditing ? (
                      <Select
                        value={batchDetails?.courseName}
                        onValueChange={(value) =>
                          setBatchDetails({
                            ...batchDetails!,
                            courseName: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Course" />
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
                      <p className="text-lg">{batchDetails?.courseName}</p>
                    )}
                  </div>

                  <div className="flex gap-8">
                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <Calendar className="mr-2 h-4 w-4" /> Current Semester
                      </label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={batchDetails?.currentSemester}
                          onChange={(e) =>
                            setBatchDetails({
                              ...batchDetails!,
                              currentSemester: parseInt(e.target.value),
                            })
                          }
                          className="w-full"
                        />
                      ) : (
                        <p className="text-lg">
                          {batchDetails?.currentSemester}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <Users className="mr-2 h-4 w-4" /> Total Students
                      </label>
                      <p className="text-lg">{batchDetails?.studentCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}

          {batchDetailsExpanded && (
            <CardFooter className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Batch
                </Button>
              )}
            </CardFooter>
          )}
        </Card>

        {/* Students Card */}
        <Card className="mb-6">
          <CardHeader className="cursor-pointer" onClick={toggleStudents}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Enrolled Students</CardTitle>
              {studentsExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>
            <CardDescription>
              View enrolled students in this batch
            </CardDescription>
          </CardHeader>

          {studentsExpanded && (
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Enrollment Number</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contact Number</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.enrollmentNumber}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.contactNo}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleViewStudent(student.studentId)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BatchEditPage;
