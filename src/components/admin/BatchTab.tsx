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
import { FaTrashAlt } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import AddSubjectForm from "./AddSubjectForm";

interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  semester: number;
  courseName: string;
}

const SubjectTab: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeTab, setActiveTab] = useState("manage");
  const { toast } = useToast();

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
      console.error("Error fetching subjects:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subjects. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this subject? This action cannot be undone."
      )
    ) {
      try {
        console.log("Attempting to delete subject:", subjectId);
        const response = await fetch(`/api/deleteSubject/${subjectId}`, {
          method: "DELETE",
        });

        console.log("Delete response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response data:", errorData);
          throw new Error(errorData.message || "Failed to delete subject");
        }

        const responseData = await response.json();
        console.log("Delete response data:", responseData);

        // Remove the subject from the local state
        setSubjects(subjects.filter((subject) => subject.subjectId !== subjectId));
        toast({
          title: "Success",
          description: "Subject deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting subject:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete subject. Please try again.",
          variant: "destructive",
        });
      }
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
                    <Button
                      onClick={() => handleDeleteSubject(subject.subjectId)}
                    >
                      <FaTrashAlt className="h-4 w-4" />
                    </Button>
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