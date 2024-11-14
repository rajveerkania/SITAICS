import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Timetable from "@/components/staff/Timetable"; // Import the Timetable component
import Results from "@/components/staff/Result"; // Import the Results component
import StudentListBatch from "@/components/staff/StudentListBatch"; // Import the StudentList component
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const MyBatch = () => {
  const [activeTab, setActiveTab] = useState<'timetable' | 'results' | 'students'>('timetable');
  const [timetable, setTimetable] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]); // Define state for the student list

  // Fetch timetable data
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await fetch('/api/fetchTimetable');
        const data = await response.json();
        if (data.success) {
          setTimetable(data.timetable);
        } else {
          console.error("Failed to fetch timetable:", data.message);
        }
      } catch (error) {
        console.error("Error fetching timetable:", error);
      }
    };
    fetchTimetable();
  }, []);

  // Fetch results data
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/fetchResults');
        const data = await response.json();
        if (data.success) {
          setResults(data.results);
        } else {
          console.error("Failed to fetch results:", data.message);
        }
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };
    fetchResults();
  }, []);

  // Fetch student list data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/fetchStudents');
        const data = await response.json();
        if (data.success) {
          setStudents(data.students);
        } else {
          console.error("Failed to fetch students:", data.message);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'timetable' | 'results' | 'students')}>
      <div className="p-15 mx-auto max-w-10xl">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">My Batch</h2>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="students">Student List</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="timetable">
            <div className="overflow-x-auto">
              <Timetable />
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="overflow-x-auto">
              <Results />
            </div>
          </TabsContent>
          
          <TabsContent value="students">
            <div className="overflow-x-auto">
              <StudentListBatch />
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
};

export default MyBatch;
