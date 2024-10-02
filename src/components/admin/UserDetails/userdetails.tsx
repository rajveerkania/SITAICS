import React, { useState } from "react";
import { User, Mail, Book, Calendar } from "lucide-react";

interface UserDetailsProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    fatherName?: string;
    motherName?: string;
    enrollmentNumber?: string;
    courseName?: string;
    batchName?: string;
    dateOfBirth?: string;
    gender?: string;
    contactNo?: string;
    address?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    bloodGroup?: string;
  };
  onSave: (updatedUser: UserDetailsProps["user"]) => void;
}

const InfoSection: React.FC<{
  title: string;
  icon: JSX.Element;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <div className="bg-black text-white p-6 flex items-center">
      {icon}
      <h3 className="text-xl font-bold ml-2">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
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
        className="border border-gray-300 rounded p-1 text-gray-800 w-1/2"
        value={value || ""}
        onChange={onChange}
      />
    ) : (
      <span className="text-gray-800">{value || "N/A"}</span>
    )}
  </div>
);

const UserDetails: React.FC<UserDetailsProps> = ({ user, onSave }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);

  const handleChange = (field: keyof typeof user) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser({
      ...updatedUser,
      [field]: e.target.value,
    });
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSaveClick = () => {
    setIsEditable(false);
    onSave(updatedUser);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InfoSection title="Personal Details" icon={<User className="text-white" />}>
          <InfoItem
            label="Name"
            value={updatedUser.name}
            onChange={handleChange("name")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Father's Name"
            value={updatedUser.fatherName}
            onChange={handleChange("fatherName")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Mother's Name"
            value={updatedUser.motherName}
            onChange={handleChange("motherName")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Date of Birth"
            value={updatedUser.dateOfBirth}
            onChange={handleChange("dateOfBirth")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Gender"
            value={updatedUser.gender}
            onChange={handleChange("gender")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Blood Group"
            value={updatedUser.bloodGroup}
            onChange={handleChange("bloodGroup")}
            isEditable={isEditable}
          />
        </InfoSection>

        <InfoSection title="Contact Information" icon={<Mail className="text-white" />}>
          <InfoItem
            label="Email"
            value={updatedUser.email}
            onChange={handleChange("email")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Contact No."
            value={updatedUser.contactNo}
            onChange={handleChange("contactNo")}
            isEditable={isEditable}
          />
          <InfoItem
            label="Address"
            value={updatedUser.address}
            onChange={handleChange("address")}
            isEditable={isEditable}
          />
          <InfoItem
            label="City"
            value={updatedUser.city}
            onChange={handleChange("city")}
            isEditable={isEditable}
          />
          <InfoItem
            label="State"
            value={updatedUser.state}
            onChange={handleChange("state")}
            isEditable={isEditable}
          />
          <InfoItem
            label="PIN Code"
            value={updatedUser.pinCode?.toString()}
            onChange={handleChange("pinCode")}
            isEditable={isEditable}
          />
        </InfoSection>

        {updatedUser.role === "Student" && (
          <InfoSection title="Academic Information" icon={<Book className="text-white" />}>
            <InfoItem
              label="Enrollment No"
              value={updatedUser.enrollmentNumber}
              onChange={handleChange("enrollmentNumber")}
              isEditable={isEditable}
            />
            <InfoItem
              label="Course"
              value={updatedUser.courseName}
              onChange={handleChange("courseName")}
              isEditable={isEditable}
            />
            <InfoItem
              label="Batch No"
              value={updatedUser.batchName}
              onChange={handleChange("batchName")}
              isEditable={isEditable}
            />
          </InfoSection>
        )}
      </div>

      <div className="mt-6">
        {isEditable ? (
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleSaveClick}
          >
            Save
          </button>
        ) : (
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded"
            onClick={handleEditClick}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
  