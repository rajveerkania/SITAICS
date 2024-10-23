import React, { useState, useEffect } from "react";

const StudentTimetable: React.FC = () => {
  const [timetableURL, setTimetableURL] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("Student Timetable");

  // Fetch timetable on load
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await fetch("/api/student/fetchTimetable", {
          method: "POST",
        });
        const data = await res.json();

        if (data.timetableExists && data.timetable) {
          const base64String = data.timetable;
          const blob = new Blob([Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0))], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(blob);
          setTimetableURL(fileURL);
          setTitle("Your Timetable");
        } else {
          setErrorMessage("No timetable found.");
        }
      } catch (error) {
        console.error("Error fetching timetable:", error);
        setErrorMessage("Failed to fetch timetable.");
      }
    };

    fetchTimetable();
  }, []);

  return (
    <div className="max-w-full mx-auto my-16 p-12 bg-white shadow-2xl rounded-2xl border border-gray-300">
      <h2 className="text-4xl font-bold mb-8 text-center">{title}</h2>

      {/* Error Message */}
      {errorMessage && <p className="text-red-500 text-lg mb-6">{errorMessage}</p>}

      {/* Display Timetable */}
      {timetableURL ? (
        <div className="flex flex-col items-center justify-center mb-8">
          <iframe src={timetableURL} width="100%" height="800px" className="border border-gray-500 shadow-lg"></iframe>
        </div>
      ) : (
        <p className="text-gray-500 text-center">Fetching timetable...</p>
      )}
    </div>
  );
};

export default StudentTimetable;
