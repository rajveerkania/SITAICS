import React from "react";

interface StaffProfileProps {
  name: string;
  email: string;
  username: string;
  department: string;
  contactNo: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export const StaffProfile: React.FC<StaffProfileProps> = ({
  name,
  email,
  username,
  department,
  contactNo,
  address,
  city,
  state,
  pinCode,
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800">Staff Profile</h2>
      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Name:</span>
          <span className="text-gray-900 font-medium">{name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Email:</span>
          <span className="text-gray-900 font-medium">{email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Username:</span>
          <span className="text-gray-900 font-medium">{username}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Department:</span>
          <span className="text-gray-900 font-medium">{department}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Contact No:</span>
          <span className="text-gray-900 font-medium">{contactNo}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Address:</span>
          <span className="text-gray-900 font-medium">{address}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">City:</span>
          <span className="text-gray-900 font-medium">{city}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">State:</span>
          <span className="text-gray-900 font-medium">{state}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Pin Code:</span>
          <span className="text-gray-900 font-medium">{pinCode}</span>
        </div>
      </div>
    </div>
  );
};
