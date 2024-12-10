import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingSkeleton from "../LoadingSkeleton";

interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  semester: number;
  staff: string[];
}

interface SubjectsData {
  studentId: string;
  batchName: string;
  currentSemester: number;
  subjects: Subject[];
}

interface SubjectProps {
  studentId: string;
}

const SubjectTab: React.FC<SubjectProps> = ({ studentId }) => {
  const [subjectsData, setSubjectsData] = useState<SubjectsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          `/api/student/fetchSubjects?studentId=${studentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch subjects");
        }
        const data: SubjectsData = await response.json(); 
        if (data.subjects.length === 0) {
          setError("No subjects found");
        }
        setSubjectsData(data);
      } catch (err) {
        setError("Error fetching subjects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [studentId]);

  if (loading) return <LoadingSkeleton loadingText="subjects" />;
  if (error) return <div>{error}</div>;
  if (!subjectsData) return null;

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject Name</TableHead>
            <TableHead>Subject Code</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Staff</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjectsData.subjects.map((subject) => (
            <TableRow key={subject.subjectId}>
              <TableCell className="font-medium">
                {subject.subjectName}
              </TableCell>
              <TableCell>{subject.subjectCode}</TableCell>
              <TableCell>{subject.semester}</TableCell>
              <TableCell>
                {subject.staff.join(", ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubjectTab;
