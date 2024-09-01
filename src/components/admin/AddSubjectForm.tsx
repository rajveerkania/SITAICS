import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdAdd } from 'react-icons/md';
export interface Subject {
    subjectId: string;
    subjectName: string;
    subjectCode: string;
    semester: number;
    courseId: string;
    isActive?: boolean;
  }
  
interface AddSubjectFormProps {
  onSubjectAdded: (subject: Subject) => void; // Use the Subject type here
}

const AddSubjectForm: React.FC<AddSubjectFormProps> = ({ onSubjectAdded }) => {
  const [newSubject, setNewSubject] = useState({
    subjectName: '',
    subjectCode: '',
    semester: '',
    courseId: '',
    batchId: ''
  });

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject)
      });

      if (response.ok) {
        const addedSubject: Subject = await response.json();
        onSubjectAdded(addedSubject);
        setNewSubject({
          subjectName: '',
          subjectCode: '',
          semester: '',
          courseId: '',
          batchId: ''
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to add subject:', errorData.error);
      }
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  return (
    <form onSubmit={handleAddSubject} className="space-y-4">
      <Input
        placeholder="Subject Name"
        value={newSubject.subjectName}
        onChange={(e) => setNewSubject({ ...newSubject, subjectName: e.target.value })}
      />
      <Input
        placeholder="Subject Code"
        value={newSubject.subjectCode}
        onChange={(e) => setNewSubject({ ...newSubject, subjectCode: e.target.value })}
      />
      <Input
        placeholder="Semester"
        type="number"
        value={newSubject.semester}
        onChange={(e) => setNewSubject({ ...newSubject, semester: e.target.value })}
      />
      <Input
        placeholder="Course ID"
        value={newSubject.courseId}
        onChange={(e) => setNewSubject({ ...newSubject, courseId: e.target.value })}
      />
      <Input
        placeholder="Batch ID"
        value={newSubject.batchId}
        onChange={(e) => setNewSubject({ ...newSubject, batchId: e.target.value })}
      />
      <Button type="submit" className="flex items-center">
        <MdAdd className="mr-2" />
        Add Subject
      </Button>
    </form>
  );
};

export default AddSubjectForm;
