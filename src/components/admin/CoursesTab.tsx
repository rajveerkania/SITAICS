import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MdAdd, MdDelete } from 'react-icons/md'; 

const CoursesTab = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'BTech' },
    { id: 2, name: 'MTech' },
    { id: 3, name: 'MTech AI/ML' },
    { id: 4, name: 'MSCDF' },
  ]);
  const [newCourse, setNewCourse] = useState({ name: '' });

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await fetch("/api/deleteCourse", {
        method: "PUT", // Use PUT method to update course status
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });
      if (response.ok) {
        // Filter out the deleted course from the state
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

  const handleDeleteCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

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
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-grow sm:flex-grow-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring focus:ring-gray-200 transition-all duration-300"
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
