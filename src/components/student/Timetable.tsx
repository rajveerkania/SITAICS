import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StudentTimetable = () => {
  const [timetableURL, setTimetableURL] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("Student Timetable");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await fetch("/api/student/fetchTimetable", {
          method: "POST",
        });
        const data = await res.json();

        if (data.timetableExists && data.timetable) {
          const base64String = data.timetable;
          const blob = new Blob(
            [Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0))],
            { type: "application/pdf" }
          );
          const fileURL = URL.createObjectURL(blob);
          setTimetableURL(fileURL);
          setTitle("Your Timetable");
        } else {
          setErrorMessage("No timetable found.");
        }
      } catch (error) {
        console.error("Error fetching timetable:", error);
        setErrorMessage("Failed to fetch timetable.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-16 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
          <p className="mt-4 text-gray-600">Fetching timetable...</p>
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className="p-8 bg-gray-100 border border-gray-300 rounded-md">
          <p className="text-gray-900 text-center text-lg">{errorMessage}</p>
        </div>
      );
    }

    if (timetableURL) {
      return (
        <div className="space-y-4">
          <iframe
            src={timetableURL}
            width="100%"
            height="800px"
            className="border border-gray-200 rounded-md shadow-sm"
            title="Student Timetable PDF"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="max-w-6xl mx-auto my-8 bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-black">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};

export default StudentTimetable;
