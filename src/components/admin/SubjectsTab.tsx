import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MdAdd, MdDelete } from 'react-icons/md'; // Importing icons

const SubjectsTab = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Mathematics', course: 'BTech' },
    { id: 2, name: 'Data Structures', course: 'BTech' },
    { id: 3, name: 'Machine Learning', course: 'MTech AI/ML' },
  ]);
  const [newSubject, setNewSubject] = useState({ name: '', course: '' });

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    setSubjects([...subjects, { id: subjects.length + 1, ...newSubject }]);
    setNewSubject({ name: '', course: '' });
  };

  const handleDeleteSubject = (id: number) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  return (
    <Tabs defaultValue="add">
      <TabsList>
        <TabsTrigger value="add">Add Subject</TabsTrigger>
        <TabsTrigger value="manage">Manage Subjects</TabsTrigger>
      </TabsList>
      <TabsContent value="add">
        <form onSubmit={handleAddSubject} className="space-y-4">
          <Input
            placeholder="Subject Name"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
          />
          <Input
            placeholder="Course"
            value={newSubject.course}
            onChange={(e) => setNewSubject({ ...newSubject, course: e.target.value })}
          />
          <Button type="submit" className="flex items-center">
            <MdAdd className="mr-2" />
            Add Subject
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="manage">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.course}</TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeleteSubject(subject.id)} 
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

export default SubjectsTab;
