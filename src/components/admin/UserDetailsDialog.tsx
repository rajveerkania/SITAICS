import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type UserDetails = {
  id: string;
  name: string;
  email: string;
  username?: string;
  role?: string;
  [key: string]: any;
};

interface StudentInfoProps extends UserDetails {
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
  results?: string;
  bloodGroup?: string;
  achievements?: string;
  isProfileCompleted?: boolean;
}

interface StaffInfoProps extends UserDetails {
  contactNumber?: string;
  isBatchCoordinator?: boolean;
  department?: string;
  designation?: string;
  joiningDate?: string;
}

export const UserDetailsDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}> = ({ open, onOpenChange, userId }) => {
  const [userInfo, setUserInfo] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setError(null);
      fetch(`/api/fetchUserDetails?userId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setUserInfo(data.user);
          } else {
            setError("No user data found.");
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setError("Error fetching user data.");
          setIsLoading(false);
        });
    }
  }, [open, userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (userInfo) {
      setUserInfo({
        ...userInfo,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSaveChanges = () => {
    fetch(`/api/updateUserDetails?userId=${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User data updated successfully:", data);
        setIsEditing(false);
        onOpenChange(false);
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  const renderField = (key: string, label: string) => {
    if (!userInfo) return null;
    return (
      <div key={key} className="mb-4">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {isEditing ? (
          <Input
            type={key === "dateOfBirth" || key === "joiningDate" ? "date" : "text"}
            name={key}
            value={userInfo[key] || ""}
            onChange={handleInputChange}
            className="mt-1"
          />
        ) : (
          <p className="mt-1">{userInfo[key] || "N/A"}</p>
        )}
      </div>
    );
  };

  const renderUserFields = () => {
    if (!userInfo) return null;

    const commonFields = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "username", label: "Username" },
      { key: "role", label: "Role" },
    ];

    const studentFields = [
      { key: "fatherName", label: "Father's Name" },
      { key: "motherName", label: "Mother's Name" },
      { key: "enrollmentNumber", label: "Enrollment Number" },
      { key: "courseName", label: "Course Name" },
      { key: "batchName", label: "Batch Name" },
      { key: "dateOfBirth", label: "Date of Birth" },
      { key: "gender", label: "Gender" },
      { key: "contactNo", label: "Contact Number" },
      { key: "address", label: "Address" },
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "pinCode", label: "PIN Code" },
      { key: "bloodGroup", label: "Blood Group" },
      { key: "achievements", label: "Achievements" },
    ];

    const staffFields = [
      { key: "contactNumber", label: "Contact Number" },
      { key: "department", label: "Department" },
      { key: "designation", label: "Designation" },
      { key: "joiningDate", label: "Joining Date" },
    ];

    const fieldsToRender = [
      ...commonFields,
      ...(userInfo.role === "Student" ? studentFields : []),
      ...(userInfo.role === "Staff" ? staffFields : []),
    ];

    return fieldsToRender.map((field) => renderField(field.key, field.label));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : userInfo ? (
          <div className="mt-4">
            {renderUserFields()}
            <div className="mt-6 flex justify-end space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              )}
            </div>
          </div>
        ) : (
          <p>User data not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};