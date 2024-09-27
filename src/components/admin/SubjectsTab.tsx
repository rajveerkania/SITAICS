import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "sonner";
import AddSubjectForm from "./AddSubjectForm";
import LoadingSkeleton from "../LoadingSkeleton";

interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  semester: number;
  courseName: string;
}

const SubjectTab = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("manage");
  const [currentPage, setCurrentPage] = useState(1);
  const subjectsPerPage = 5;

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/fetchSubjects");
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data: Subject[] = await response.json();
      setSubjects(data);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      const response = await fetch(`/api/deleteSubject/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subjectId }),
      });
      });

      if (!response.ok) {
        throw new Error("Failed to delete subject");
      }
      if (!response.ok) {
        throw new Error("Failed to delete subject");
      }

      setSubjects(
        subjects.filter((subject) => subject.subjectId !== subjectId)
      );
      toast.success("Subject deleted successfully");
      setSubjects(
        subjects.filter((subject) => subject.subjectId !== subjectId)
      );
      toast.success("Subject deleted successfully");
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject");
    }
  };

  const totalPages = Math.ceil(subjects.length / subjectsPerPage);
  const currentSubjects = subjects.slice(
    (currentPage - 1) * subjectsPerPage,
    currentPage * subjectsPerPage
  );

  if (isLoading) {
    return <LoadingSkeleton loadingText="subjects" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="manage">Manage Subjects</TabsTrigger>
          <TabsTrigger value="create">Create Subject</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <AddSubjectForm
            onSubjectAdded={() => {
              fetchSubjects();
              setActiveTab("manage");
            }}
            onTabChange={setActiveTab}
          />
        </TabsContent>
        <TabsContent value="manage">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Name</TableHead>
                <TableHead>Subject Code</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSubjects.map((subject) => (
                <TableRow key={subject.subjectId}>
                  <TableCell>{subject.subjectName}</TableCell>
                  <TableCell>{subject.subjectCode}</TableCell>
                  <TableCell>{subject.semester}</TableCell>
                  <TableCell>{subject.courseName}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button>
                        <FaRegEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteSubject(subject.subjectId)}
                      >
                        <FaTrashAlt className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="pagination mt-4 flex justify-center items-center space-x-4">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubjectTab;
