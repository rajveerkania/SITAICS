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

interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  semester: number;
  courseName: string;
}

const SubjectTab = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeTab, setActiveTab] = useState("manage");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/fetchSubjects");
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data: Subject[] = await response.json();
      setSubjects(data);
    } catch (error) {
      toast.error("Failed to fetch subject details");
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      const response = await fetch(`/api/deleteSubject/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subjectId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete subject");
      }

      setSubjects(
        subjects.filter((subject) => subject.subjectId !== subjectId)
      );
      toast.success("Subject deleted successfully");
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject");
    }
  };

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
              {subjects.map((subject) => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubjectTab;