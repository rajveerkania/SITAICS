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

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourse.name.trim() === '') return; 
    setCourses([...courses, { id: courses.length + 1, ...newCourse }]);
    setNewCourse({ name: '' });
  };

  const handleDeleteCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  return (
    <Tabs defaultValue="add">
      <TabsList>
        <TabsTrigger value="add">Add Course</TabsTrigger>
        <TabsTrigger value="manage">Manage Courses</TabsTrigger>
      </TabsList>
      <TabsContent value="add">
        <form onSubmit={handleAddCourse} className="space-y-4">
          <Input
            placeholder="Course Name"
            value={newCourse.name}
            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
          />
          <Button type="submit" className="flex items-center">
            <MdAdd className="mr-2" />
            Add Course
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="manage">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Name</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteCourse(course.id)}
                    style={{ backgroundColor: 'black', color: 'white' }} // Inline style for black background and white text
                    className="flex items-center"
                  >
                    <MdDelete style={{ color: 'white' }} className="mr-2" /> {/* White icon */}
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
};

export default CoursesTab;
