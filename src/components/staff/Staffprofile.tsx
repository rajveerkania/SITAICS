import React, { useState, useEffect } from "react";

interface StaffProfileProps {}

export const StaffProfile: React.FC<StaffProfileProps> = () => {
  const [staffData, setStaffData] = useState({
    name: "",
    email: "",
    username: "",
    department: "",
    contactNo: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        // Fetch staff details from API
        const response = await fetch("/api/fetchUserDetails");
        const data = await response.json();
        
        // Check if the response was successful
        if (response.ok && data.user && data.role === "Staff") {
          setStaffData({
            name: data.user.name,
            email: data.user.email,
            username: data.user.username,
            department: data.user.department || "N/A", // Optional field
            contactNo: data.user.contactNo || "N/A", // Optional field
          });
        } else {
          setError("Failed to fetch staff details.");
        }
      } catch (err) {
        setError("Error fetching staff details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStaffDetails();
  }, []);

  // If loading, display a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's an error, display the error message
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden text-gray-900">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Staff Profile</h2>
        <div className="max-h-[600px] overflow-y-auto">
          <div className="space-y-4">
            {[
              { label: "Name", value: staffData.name },
              { label: "Email", value: staffData.email },
              { label: "Username", value: staffData.username },
              { label: "Department", value: staffData.department },
              { label: "Contact No", value: staffData.contactNo },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-600">{label}:</span>
                <span className="text-gray-700 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
