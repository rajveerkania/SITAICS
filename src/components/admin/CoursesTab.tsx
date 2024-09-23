import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import AddCourseForm from "./AddCourseForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoadingSkeleton from "../LoadingSkeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Course {
  courseId: string;
  courseName: string;
  totalBatches: string;
  totalSubjects: string;
  isActive: boolean;
}

const CoursesTab = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("manage");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const coursesPerPage = 5;

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/fetchCourses");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch courses.");
      }

      if (Array.isArray(data.courses)) {
        setCourses(data.courses);
        console.log("This is useState", courses);
        console.log(data.courses);
      } else {
        throw new Error("Invalid data structure");
      }
    } catch (error: any) {
      setError(error || "Failed to load courses. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await fetch("/api/deleteCourse", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });
      if (response.ok) {
        toast.success("Course deleted successfully");
        fetchCourses();
      }
    } catch (error: any) {
      toast.error("Error in deleting course", error);
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditCourse(course);
    setEditDialogOpen(true);
  };

  const handleSaveCourseEdit = async () => {
    if (!editCourse) return;

    try {
      const response = await fetch(`/api/editCourse/${editCourse.courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseName: editCourse.courseName }),
      });

      if (response.ok) {
        await fetchCourses();
        setEditDialogOpen(false);
      } else
        (error: any) => {
          toast.error("Failed to update course", error);
        };
    } catch (error: any) {
      toast.error("Error saving course edit:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editCourse) {
      setEditCourse({ ...editCourse, [e.target.name]: e.target.value });
    }
  };

  const handleAddCourseSuccess = (newCourse: Course) => {
    setCourses((prevCourses) => [...prevCourses, newCourse]);
    setActiveTab("manage");
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      course.isActive
  );

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  if (isLoading) {
    return <LoadingSkeleton loadingText="courses" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          <TabsList>
            <TabsTrigger value="manage">Manage Courses</TabsTrigger>
            <TabsTrigger value="create">Create Course</TabsTrigger>
          </TabsList>
          {activeTab === "manage" && (
            <Input
              className="w-full sm:w-auto sm:ml-auto"
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          )}
        </div>

        <TabsContent value="manage">
          <div className="w-full overflow-auto">
            <div className="flex items-center space-x-2 w-full sm:w-auto"></div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Total Batches</TableHead>
                  <TableHead>Total Subjects</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCourses.length > 0 ? (
                  currentCourses.map((course) => (
                    <TableRow key={course.courseId}>
                      <TableCell>{course.courseName}</TableCell>
                      <TableCell>{course.totalBatches}</TableCell>
                      <TableCell>{course.totalSubjects}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleEditCourse(course)}
                            style={{ backgroundColor: "black", color: "white" }}
                          >
                            <FaEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteCourse(course.courseId)}
                            variant="destructive"
                            style={{ backgroundColor: "black", color: "white" }}
                            className="flex items-center"
                          >
                            <FaTrashAlt className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      No courses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {filteredCourses.length > coursesPerPage && (
              <div className="pagination mt-4 flex justify-center items-center space-x-4">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="pagination-button"
                >
                  Previous
                </Button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="pagination-button"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="create">
          <AddCourseForm onAddCourseSuccess={handleAddCourseSuccess} />
        </TabsContent>
      </Tabs>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          {editCourse ? (
            <div>
              <Input
                type="text"
                name="courseName"
                value={editCourse.courseName}
                onChange={handleInputChange}
                placeholder="Course Name"
                className="mb-2"
              />
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveCourseEdit}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CoursesTab;
