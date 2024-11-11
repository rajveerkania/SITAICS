import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Timetable from "@/components/staff/Timetable"; // Import the Timetable component
import Results from "@/components/staff/Result"; // Import the Results component
import StudentListBatch from "@/components/staff/StudentListBatch"; // Import the StudentList component

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
    <div className="p-15 mx-auto max-w-10xl">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">My Batch</h2>

        <div className="mb-4">
          <Button
            onClick={() => setActiveTab('timetable')}
            className={`mr-2 ${activeTab === 'timetable' ? 'bg-black text-white' : 'bg-gray-200 text-black'} py-2 px-4 rounded-lg transition-transform transform hover:scale-105`}
          >
            Timetable
          </Button>
          <Button
            onClick={() => setActiveTab('results')}
            className={`${activeTab === 'results' ? 'bg-black text-white' : 'bg-gray-200 text-black'} py-2 px-4 rounded-lg transition-transform transform hover:scale-105`}
          >
            Results
          </Button>
          <Button
            onClick={() => setActiveTab('students')}
            className={`${activeTab === 'students' ? 'bg-black text-white' : 'bg-gray-200 text-black'} py-2 px-4 rounded-lg transition-transform transform hover:scale-105`}
          >
            Student List
          </Button>
        </div>

        {activeTab === 'timetable' ? (
          <div className="overflow-x-auto">
            <Timetable />
          </div>
        ) : activeTab === 'results' ? (
          <div className="overflow-x-auto">
            <Results />
          </div>
        ) : (
          <div className ="overflow-x-auto">
            <StudentListBatch />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBatch;
