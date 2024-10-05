"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { ArrowLeft, Edit3, Users, School, Calendar } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  enrollmentNumber: string;
  email: string;
  contactNo: string;
}

interface Course {
  courseId: string;
  courseName: string;
}

interface BatchDetails {
  batchId: string;
  batchName: string;
  courseName: string;
  batchDuration: number;
  currentSemester: number;
  studentCount: number;
}

const BatchEditPage = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [courses, setCourses] = useState<Course[]>([
    { courseId: '1', courseName: 'Bachelor of Computer Science' },
    { courseId: '2', courseName: 'Bachelor of Engineering' },
    // Add more courses as needed
  ]);

  const [batchDetails, setBatchDetails] = useState<BatchDetails>({
    batchId: "batch-1",
    batchName: "CS 2024",
    courseName: "Bachelor of Computer Science",
    batchDuration: 4,
    currentSemester: 1,
    studentCount: 45
  });

  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "John Doe",
      enrollmentNumber: "CS2024001",
      email: "john.doe@example.com",
      contactNo: "1234567890"
    },
    {
      id: "2",
      name: "Jane Smith",
      enrollmentNumber: "CS2024002",
      email: "jane.smith@example.com",
      contactNo: "9876543210"
    },
    // Add more dummy students as needed
  ]);

  const handleSave = () => {
    toast.success("Batch details updated successfully");
    setIsEditing(false);
  };

  const handleBackClick = () => {
    router.push('/admin/dashboard');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        onClick={handleBackClick}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Batch Details</CardTitle>
              <CardDescription>
                Manage batch information and view enrolled students
              </CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Batch
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <School className="mr-2 h-4 w-4" /> Batch Name
                </label>
                {isEditing ? (
                  <Input
                    value={batchDetails.batchName}
                    onChange={(e) => setBatchDetails({...batchDetails, batchName: e.target.value})}
                    className="w-full"
                  />
                ) : (
                  <p className="text-lg">{batchDetails.batchName}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <School className="mr-2 h-4 w-4" /> Course
                </label>
                {isEditing ? (
                  <Select 
                    value={batchDetails.courseName}
                    onValueChange={(value) => setBatchDetails({...batchDetails, courseName: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.courseId} value={course.courseName}>
                          {course.courseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-lg">{batchDetails.courseName}</p>
                )}
              </div>
              <div className="flex gap-8">
                <div>
                  <label className="text-sm font-medium flex items-center mb-2">
                    <Calendar className="mr-2 h-4 w-4" /> Current Semester
                  </label>
                  <p className="text-lg">{batchDetails.currentSemester}</p>
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center mb-2">
                    <Users className="mr-2 h-4 w-4" /> Total Students
                  </label>
                  <p className="text-lg">{batchDetails.studentCount}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students">Enrolled Students</TabsTrigger>
          <TabsTrigger value="subjects">Batch Subjects</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>
                Students currently enrolled in this batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Enrollment Number</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Contact Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.enrollmentNumber}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.contactNo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>Batch Subjects</CardTitle>
              <CardDescription>
                Subjects assigned to this batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Subject Code</TableHead>
                    <TableHead>Semester</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Introduction to Programming</TableCell>
                    <TableCell>CS101</TableCell>
                    <TableCell>1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Data Structures</TableCell>
                    <TableCell>CS201</TableCell>
                    <TableCell>2</TableCell>
                  </TableRow>
                  {/* Add more subjects as needed */}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BatchEditPage;