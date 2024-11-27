import React, { useState, useEffect } from "react";

interface AdminProfileProps {
  name: string;
  email: string;
  username: string;
}

export const AdminProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/fetchUserDetails"); // Adjust the path to match your actual API endpoint
        const data = await response.json();

        if (response.ok && data.user) {
          setFormData({
            name: data.user.name,
            email: data.user.email,
            username: data.user.username,
          });
        } else {
          setError("Error fetching user data");
        }
      } catch (err) {
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Admin Profile</h2>
        <div className="max-h-[600px] overflow-y-auto">
          <div className="space-y-4">
            {[
              { label: "Name", value: formData.name },
              { label: "Email", value: formData.email },
              { label: "Username", value: formData.username },
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
