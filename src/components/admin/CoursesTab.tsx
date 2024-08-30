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
import { FaTrashAlt } from "react-icons/fa";
import AddCourseForm from "./AddCourseForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoadingSkeleton from "../LoadingSkeleton";

interface Course {
  courseId: string;
  courseName: string;
  isActive: boolean;
}

const CoursesTab = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("view");
  const coursesPerPage = 5;

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/fetchCourses");
      const data = await response.json();
      if (Array.isArray(data.courses)) {
        setCourses(data.courses);
      } else {
        throw new Error("Failed to fetch courses or invalid data structure");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Failed to load courses. Please try again later.");
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
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });
      if (response.ok) {
        setCourses(courses.filter((course) => course.courseId !== courseId));
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleAddCourseSuccess = (newCourse: Course) => {
    setCourses((prevCourses) => [...prevCourses, newCourse]);
    setActiveTab("view");
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
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          <div className="flex space-x-4">
            <TabsTrigger value="view">View Courses</TabsTrigger>
            <TabsTrigger value="add">Add Course</TabsTrigger>
          </div>
          {activeTab === "view" && (
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by course name"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-grow sm:flex-grow-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-300"
              />
            </div>
          )}
        </TabsList>
        <TabsContent value="view">
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCourses.length > 0 ? (
                  currentCourses.map((course) => (
                    <TableRow key={course.courseId}>
                      <TableCell>{course.courseName}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleDeleteCourse(course.courseId)}
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
        <TabsContent value="add">
          <AddCourseForm onAddCourseSuccess={handleAddCourseSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoursesTab;