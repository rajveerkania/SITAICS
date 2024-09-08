import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import AddSubjectForm from "./AddSubjectForm";

interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  semester: number;
  courseName: string;
  batchName?: string;
}

const SubjectTab = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeTab, setActiveTab] = useState("view");
  const { toast } = useToast();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get<Subject[]>("/api/fetchSubjects");
      setSubjects(response.data);
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
    if (confirm("Are you sure you want to delete this subject? This action cannot be undone.")) {
      try {
        await axios.delete(`/api/deleteSubject/${subjectId}`);
        setSubjects(subjects.filter(subject => subject.subjectId !== subjectId));
        toast({
          title: "Success",
          description: "Subject deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting subject:", error);
        toast({
          title: "Error",
          description: "Failed to delete subject. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="view">View Subjects</TabsTrigger>
          <TabsTrigger value="add">Add Subject</TabsTrigger>
        </TabsList>
        <TabsContent value="add">
          <AddSubjectForm
            onSubjectAdded={() => {
              fetchSubjects();
            }}
            onTabChange={setActiveTab}
          />
        </TabsContent>
        <TabsContent value="view">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Name</TableHead>
                <TableHead>Subject Code</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Batch</TableHead>
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
                  <TableCell>{subject.batchName || "N/A"}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDeleteSubject(subject.subjectId)}>
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