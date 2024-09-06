import React, { useState } from "react";

interface StudentProfileProps {
  studentDetails: {
    fatherName: string;
    motherName: string;
    enrollmentNumber: string;
    courseName: string;
    batchName: string;
    dateOfBirth: string;
    gender: string;
    contactNo: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    bloodGroup: string;
  };
}

export const StudentProfile = ({ studentDetails }: StudentProfileProps) => {
  const [formData, setFormData] = useState({
    ...studentDetails,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic for updating student details or password
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Student Profile</h2>
        <div className="overflow-auto max-h-[600px]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(studentDetails).map((key) => (
              <div key={key}>
                <label className="block text-gray-700">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <input
                  type="text"
                  name={key}
                  value={formData[key as keyof typeof formData]}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            {/* Password Section */}
            <h3 className="text-xl font-semibold text-gray-700 mt-6">Change Password</h3>
            <div>
              <label className="block text-gray-700">Current Password:</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700">New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-2 mt-6 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
