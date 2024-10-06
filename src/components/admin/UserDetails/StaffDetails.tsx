"use client";
import React, { useState } from "react";
import { User, Mail, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
interface StaffDetailsProps {
  staff: {
    id: string;
    name: string;
    email: string;
    username?: string;
    dateOfBirth?: string;
    gender?: string;
    contactNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    subjects?: string[];
  };
  onSave: (updatedStaff: StaffDetailsProps["staff"]) => void;
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
const StaffDetails: React.FC<StaffDetailsProps> = ({ staff, onSave }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [updatedStaff, setUpdatedStaff] = useState(staff);
  const handleChange =
    (field: keyof typeof staff) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setUpdatedStaff({
        ...updatedStaff,
        [field]: e.target.value,
      });
    };
  const handleSubjectChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSubjects = [...updatedStaff.subjects!];
      newSubjects[index] = e.target.value;
      setUpdatedStaff({
        ...updatedStaff,
        subjects: newSubjects,
      });
    };
  const handleEditClick = () => {
    setIsEditable(true);
  };
  const handleSaveClick = () => {
    setIsEditable(false);
    onSave(updatedStaff);
  };
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Staff Information</h2>
        <Button
          variant="secondary"
          className="mr-4"
          onClick={() => window.history.back()}
        >
          Back to Dashboard
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoSection
          title="Personal Details"
          icon={<User className="text-black" />}
        >
          <InfoItem
            label="Name"
            value={updatedStaff.name}
            onChange={handleChange("name")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Email"
            value={updatedStaff.email}
            onChange={handleChange("email")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Username"
            value={updatedStaff.username}
            onChange={handleChange("username")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Date of Birth"
            value={updatedStaff.dateOfBirth}
            onChange={handleChange("dateOfBirth")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Gender"
            value={updatedStaff.gender}
            onChange={handleChange("gender")}
            isEditable={isEditable}
          />
        </InfoSection>
        <InfoSection
          title="Contact Information"
          icon={<Mail className="text-black" />}
        >
          <InfoItem
            label="Contact No."
            value={updatedStaff.contactNumber}
            onChange={handleChange("contactNumber")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Address"
            value={updatedStaff.address}
            onChange={handleChange("address")}
            isEditable={isEditable}
          />
          <InfoItem
            label="City"
            value={updatedStaff.city}
            onChange={handleChange("city")}
            isEditable={isEditable}
          />
          <InfoItem
            label="State"
            value={updatedStaff.state}
            onChange={handleChange("state")}
            isEditable={isEditable}
          />
          <InfoItem
            label="PIN Code"
            value={updatedStaff.pinCode}
            onChange={handleChange("pinCode")}
            isEditable={isEditable}
          />
        </InfoSection>
        <InfoSection title="Subjects" icon={<Book className="text-black" />}>
          {updatedStaff.subjects?.map((subject, index) => (
            <InfoItem
              key={index}
              label={`Subject ${index + 1}`}
              value={subject}
              onChange={handleSubjectChange(index)}
              isEditable={isEditable}
            />
          ))}
        </InfoSection>
      </div>
      <div className="mt-6">
        {isEditable ? (
          <Button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleSaveClick}
          >
            Save
          </Button>
        ) : (
          <Button
            className="bg-gray-500 text-white py-2 px-4 rounded"
            onClick={handleEditClick}
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};
export default StaffDetails;
