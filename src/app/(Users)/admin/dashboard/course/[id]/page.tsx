"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Book, Layers, Edit3, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';

interface Course {
  courseId: string;
  courseName: string;
  totalBatches: number;
  totalSubjects: number;
}

interface Batch {
  batchId: string;
  batchName: string;
  courseName: string;
  batchDuration: number;
  currentSemester: number;
  studentCount: number;
}

interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  semester: number;
  courseName: string;
}

const CourseEditPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourseName, setEditedCourseName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [courseDetailsExpanded, setCourseDetailsExpanded] = useState(true);
  const [batchesSubjectsExpanded, setBatchesSubjectsExpanded] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseResponse = await fetch('/api/fetchCourses');
        const courseData = await courseResponse.json();
        const currentCourse = courseData.courses.find(
          (c: Course) => c.courseId === id
        );
        
        if (currentCourse) {
          setCourse(currentCourse);
          setEditedCourseName(currentCourse.courseName);
        }

        // Fetch batches
        const batchResponse = await fetch('/api/fetchBatches');
        const batchData = await batchResponse.json();
        const courseBatches = batchData.filter(
          (batch: Batch) => batch.courseName === currentCourse?.courseName
        );
        setBatches(courseBatches);

        // Fetch subjects
        const subjectResponse = await fetch('/api/fetchSubjects');
        const subjectData = await subjectResponse.json();
        const courseSubjects = subjectData.filter(
          (subject: Subject) => subject.courseName === currentCourse?.courseName
        );
        setSubjects(courseSubjects);
      } catch (error) {
        toast.error("Error fetching course data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/updateCourse`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: id,
          courseName: editedCourseName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update course');
      }

      setCourse(prev => prev ? { ...prev, courseName: editedCourseName } : null);
      toast.success("Course updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update course");
      console.error(error);
    }
  };

  const handleBackClick = () => {
    router.push('/admin/dashboard');
  };

  const toggleCourseDetails = () => {
    setCourseDetailsExpanded(!courseDetailsExpanded);
  };

  const toggleBatchesSubjects = () => {
    setBatchesSubjectsExpanded(!batchesSubjectsExpanded);
  };

  if (isLoading) {
    return <LoadingSkeleton loadingText="course details" />;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="max-h-screen">
      <div className="bg-[#f2f3f5]">
        <div className="container mx-auto py-8 px-4">
          <Button 
            variant="outline" 
            onClick={handleBackClick}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>

          {/* Course Details Section */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="cursor-pointer" onClick={toggleCourseDetails}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Course Details</CardTitle>
                {courseDetailsExpanded ? <ChevronUp /> : <ChevronDown />}
              </div>
              <CardDescription>
                Manage course information and view associated data
              </CardDescription>
            </CardHeader>

            {courseDetailsExpanded && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <Book className="mr-2 h-4 w-4" /> Course Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedCourseName}
                          onChange={(e) => setEditedCourseName(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        <p className="text-lg">{course.courseName}</p>
                      )}
                    </div>
                    <div className="flex gap-8">
                      <div>
                        <label className="text-sm font-medium flex items-center mb-2">
                          <Layers className="mr-2 h-4 w-4" /> Total Batches
                        </label>
                        <p className="text-lg">{course.totalBatches}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium flex items-center mb-2">
                          <Book className="mr-2 h-4 w-4" /> Total Subjects
                        </label>
                        <p className="text-lg">{course.totalSubjects}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}

            {courseDetailsExpanded && (
              <CardFooter className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedCourseName(course.courseName);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Course
                  </Button>
                )}
              </CardFooter>
            )}
          </Card>

          {/* Batches and Subjects Section */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="cursor-pointer" onClick={toggleBatchesSubjects}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Course Batches and Subjects</CardTitle>
                {batchesSubjectsExpanded ? <ChevronUp /> : <ChevronDown />}
              </div>
              <CardDescription>
                View batches and subjects associated with this course
              </CardDescription>
            </CardHeader>

            {batchesSubjectsExpanded && (
              <CardContent>
                <Tabs defaultValue="batches" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="batches">Batches</TabsTrigger>
                    <TabsTrigger value="subjects">Subjects</TabsTrigger>
                  </TabsList>

                  <TabsContent value="batches">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Batch Name</TableHead>
                          <TableHead>Duration (Years)</TableHead>
                          <TableHead>Current Semester</TableHead>
                          <TableHead>Students</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batches.length > 0 ? (
                          batches.map((batch) => (
                            <TableRow key={batch.batchId}>
                              <TableCell>{batch.batchName}</TableCell>
                              <TableCell>{batch.batchDuration}</TableCell>
                              <TableCell>{batch.currentSemester}</TableCell>
                              <TableCell>{batch.studentCount}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center">
                              No batches found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="subjects">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject Name</TableHead>
                          <TableHead>Subject Code</TableHead>
                          <TableHead>Semester</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subjects.length > 0 ? (
                          subjects.map((subject) => (
                            <TableRow key={subject.subjectId}>
                              <TableCell>{subject.subjectName}</TableCell>
                              <TableCell>{subject.subjectCode}</TableCell>
                              <TableCell>{subject.semester}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">
                              No subjects found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseEditPage;