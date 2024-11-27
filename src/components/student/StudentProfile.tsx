import React, { useState, useEffect } from "react";

interface StudentProfileProps {
  studentDetails: {
    email: string;
    username: string;
    name: string;
    enrollmentNumber: string;
    courseName: string;
    batchName: string;
    contactNo: string;
  };
}

export const StudentProfile = ({ studentDetails }: StudentProfileProps) => {
  const [formData, setFormData] = useState({
    ...studentDetails,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await fetch("/api/fetchUserDetails", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch student details.");
        }

        const data = await response.json();
        if (data?.user) {
          setFormData({
            ...data.user,
          });
        }
      } catch (error) {
        setError("Error fetching student details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden text-gray-900">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Student Profile</h2>
        <div className="max-h-[600px] overflow-y-auto">
          <div className="space-y-4">
            {[
              { label: "Email:", key: "email" },
              { label: "Username:", key: "username" },
              { label: "Full Name:", key: "name" },
              { label: "Register No:", key: "enrollmentNumber" },
              { label: "Course Name:", key: "courseName" },
              { label: "Batch Name:", key: "batchName" },
              { label: "Contact Number:", key: "contactNo" },
            ].map(({ label, key }) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600">{label}</span>
                <span className="text-gray-700 font-medium">
                  {formData[key as keyof typeof formData]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
