"use client";
import React, { useState } from "react";
import { User, Mail, Book } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentDetailsProps {
  student: {
    id: string;
    name: string;
    email: string;
    username?: string;
    fatherName?: string;
    motherName?: string;
    enrollmentNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    bloodGroup?: string;
    contactNo?: string;
    address?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    achievements?: string[];
    results?: string[];
  };
  onSave: (updatedStudent: StudentDetailsProps["student"]) => void;
}

const InfoSection: React.FC<{
  title: string;
  icon: JSX.Element;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-bold ml-2">{title}</h3>
    </div>
    <div>{children}</div>
  </div>
);

const InfoItem: React.FC<{
  label: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditable: boolean;
}> = ({ label, value, onChange, isEditable }) => (
  <div className="flex justify-between py-2">
    <span className="font-medium text-gray-700">{label}:</span>
    {isEditable ? (
      <input
        type="text"
        className="border border-gray-300 rounded p-1 text-gray-800 w-2/3"
        value={value || ""}
        onChange={onChange}
      />
    ) : (
      <span className="text-gray-800">{value || "N/A"}</span>
    )}
  </div>
);

const StudentDetails: React.FC<StudentDetailsProps> = ({ student, onSave }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [updatedStudent, setUpdatedStudent] = useState(student);

  const handleChange = (field: keyof typeof student) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedStudent({
      ...updatedStudent,
      [field]: e.target.value,
    });
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSaveClick = () => {
    setIsEditable(false);
    onSave(updatedStudent);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Student Information</h2>
        <Button variant="secondary" className="mr-4" onClick={() => window.history.back()}>
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoSection title="Personal Details" icon={<User className="text-black" />}>
          <InfoItem
            label="Name"
            value={updatedStudent.name}
            onChange={handleChange("name")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Email"
            value={updatedStudent.email}
            onChange={handleChange("email")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Username"
            value={updatedStudent.username}
            onChange={handleChange("username")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Father's Name"
            value={updatedStudent.fatherName}
            onChange={handleChange("fatherName")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Mother's Name"
            value={updatedStudent.motherName}
            onChange={handleChange("motherName")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Enrollment Number"
            value={updatedStudent.enrollmentNumber}
            onChange={handleChange("enrollmentNumber")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Date of Birth"
            value={updatedStudent.dateOfBirth}
            onChange={handleChange("dateOfBirth")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Gender"
            value={updatedStudent.gender}
            onChange={handleChange("gender")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Blood Group"
            value={updatedStudent.bloodGroup}
            onChange={handleChange("bloodGroup")}
            isEditable={isEditable}
          />
        </InfoSection>

        <InfoSection title="Contact Information" icon={<Mail className="text-black" />}>
          <InfoItem
            label="Contact No."
            value={updatedStudent.contactNo}
            onChange={handleChange("contactNo")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Address"
            value={updatedStudent.address}
            onChange={handleChange("address")}
            isEditable={isEditable}
          />
          <InfoItem
            label="City"
            value={updatedStudent.city}
            onChange={handleChange("city")}
            isEditable={isEditable}
          />
          <InfoItem
            label="State"
            value={updatedStudent.state}
            onChange={handleChange("state")}
            isEditable={isEditable}
          />
          <InfoItem
            label="PIN Code"
            value={updatedStudent.pinCode}
            onChange={handleChange("pinCode")}
            isEditable={isEditable}
          />
        </InfoSection>

        {/* <InfoSection title="Achievements" icon={<Book className="text-black" />}>
          {updatedStudent.achievements?.map((achievement, index) => (
            <InfoItem
              key={index}
              label={`Achievement ${index + 1}`}
              value={achievement}
              onChange={handleChange(`achievements[${index}]`)}
              isEditable={isEditable}
            />
          ))}
        </InfoSection> */}

        {/* <InfoSection title="Results" icon={<Book className="text-black" />}>
          {updatedStudent.results?.map((result, index) => (
            <InfoItem
              key={index}
              label={`Result ${index + 1}`}
              value={result}
              onChange={handleChange(`results[${index}]`)}
              isEditable={isEditable}
            />
          ))}
        </InfoSection> */}
      </div>

      <div className="mt-6">
        {isEditable ? (
          <Button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleSaveClick}>
            Save
          </Button>
        ) : (
          <Button className="bg-gray-500 text-white py-2 px-4 rounded" onClick={handleEditClick}>
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;