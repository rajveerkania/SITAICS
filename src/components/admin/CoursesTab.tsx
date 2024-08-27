import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CoursesTab = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'BTech', duration: '4 years' },
    { id: 2, name: 'MTech CS', duration: '2 years' },
    { id: 3, name: 'MTech AI/ML', duration: '2 years' },
    { id: 4, name: 'MSCDF', duration: '2 years' },
  ]);
  const [newCourse, setNewCourse] = useState({ name: '', duration: '' });

  const handleAddCourse = (e:any) => {
    e.preventDefault();
    setCourses([...courses, { id: courses.length + 1, ...newCourse }]);
    setNewCourse({ name: '', duration: '' });
  };

  const handleDeleteCourse = (id:any) => {
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
          <Input
            placeholder="Duration"
            value={newCourse.duration}
            onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
          />
          <Button type="submit">Add Course</Button>
        </form>
      </TabsContent>
      <TabsContent value="manage">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.duration}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteCourse(course.id)}>Delete</Button>
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