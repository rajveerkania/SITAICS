import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing icons
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface Subject {
  id: number;
  name: string;
  course: string;
}

const SubjectsTab = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: 'Mathematics', course: 'BTech' },
    { id: 2, name: 'Data Structures', course: 'BTech' },
    { id: 3, name: 'Machine Learning', course: 'MTech AI/ML' },
  ]);
  const [newSubject, setNewSubject] = useState({ name: '', course: '' });
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    setSubjects([...subjects, { id: subjects.length + 1, ...newSubject }]);
    setNewSubject({ name: '', course: '' });
  };

  const handleDeleteSubject = (id: number) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const handleEditSubject = (subject: Subject) => {
    setEditSubject(subject);
    setEditDialogOpen(true);
  };

  const handleSaveSubjectEdit = () => {
    if (editSubject) {
      setSubjects(subjects.map(subject =>
        subject.id === editSubject.id ? editSubject : subject
      ));
      setEditDialogOpen(false);
      setEditSubject(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editSubject) {
      setEditSubject({ ...editSubject, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
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
              <FaEdit className="mr-2" />
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.course}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        onClick={() => handleEditSubject(subject)}
                        style={{ backgroundColor: 'black', color: 'white' }}
                      >
                        <FaEdit className="mr-2" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDeleteSubject(subject.id)} 
                        style={{ backgroundColor: 'black', color: 'white' }}
                      >
                        <FaTrashAlt className="mr-2" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          {editSubject ? (
            <div>
              <Input
                type="text"
                name="name"
                value={editSubject.name}
                onChange={handleInputChange}
                placeholder="Subject Name"
                className="mb-2"
              />
              <Input
                type="text"
                name="course"
                value={editSubject.course}
                onChange={handleInputChange}
                placeholder="Course"
                className="mb-2"
              />
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="secondary" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSubjectEdit}>Save Changes</Button>
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

export default SubjectsTab;
