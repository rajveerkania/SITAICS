import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Subject {
  name: string;
  code: string;
  credits: number;
  professor: string;
}

const SubjectTab: React.FC = () => {
  // This is example data. In a real application, you'd fetch this data from an API or pass it as props.
  const subjects: Subject[] = [
    { name: "Introduction to Computer Science", code: "CS101", credits: 3, professor: "Dr. Jane Smith" },
    { name: "Calculus I", code: "MATH201", credits: 4, professor: "Prof. John Doe" },
    { name: "Physics for Engineers", code: "PHY150", credits: 4, professor: "Dr. Alice Johnson" },
    { name: "English Composition", code: "ENG101", credits: 3, professor: "Prof. Robert Brown" },
  ];

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">Subject Name</TableHead>
            <TableHead className="w-[20%]">Subject Code</TableHead>
            <TableHead className="w-[15%]">Credits</TableHead>
            <TableHead className="w-[40%]">Professor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{subject.name}</TableCell> 
              <TableCell>{subject.code}</TableCell>
              <TableCell>{subject.credits}</TableCell>
              <TableCell>{subject.professor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubjectTab;