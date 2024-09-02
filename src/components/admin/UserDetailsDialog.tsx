import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

// Define a type for generic user details
type UserDetails = {
  id: string;
  name: string;
  email: string;
  username?: string;
  role?: string;
  [key: string]: any;
};

// Extend StudentInfoProps from the generic UserDetails
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

export const UserDetailsDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string; // Add a prop for user ID to fetch specific user data
}> = ({ open, onOpenChange, userId }) => {
  const [userInfo, setUserInfo] = useState<UserDetails | null>(null); // Maintain flexibility for different roles
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      fetch(`/api/fetchUserDetails?userId=${userId}`) // Fetching user details
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setUserInfo(data.user); // Set user details dynamically
          } else {
            console.error("No user data found.");
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setIsLoading(false);
        });
    }
  }, [open, userId]);

  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userInfo) {
      setUserInfo({
        ...userInfo,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Function to handle form submission
  const handleSaveChanges = () => {
    fetch(`/api/updateUserDetails?userId=${userId}`, { // Update the API endpoint for PUT request
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User data updated successfully:", data);
        onOpenChange(false); // Close dialog on success
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p>Loading...</p>
        ) : userInfo ? (
          <div>
            {isEditing ? (
              // Editable form fields
              <div>
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                />
                {userInfo.role === "Student" && (
                  <>
                    <input
                      type="text"
                      name="fatherName"
                      value={userInfo.fatherName}
                      onChange={handleInputChange}
                      placeholder="Father's Name"
                    />
                    <input
                      type="text"
                      name="motherName"
                      value={userInfo.motherName}
                      onChange={handleInputChange}
                      placeholder="Mother's Name"
                    />
                    <input
                      type="text"
                      name="enrollmentNumber"
                      value={userInfo.enrollmentNumber}
                      onChange={handleInputChange}
                      placeholder="Enrollment Number"
                    />
                    <input
                      type="text"
                      name="courseName"
                      value={userInfo.courseName}
                      onChange={handleInputChange}
                      placeholder="Course Name"
                    />
                    <input
                      type="text"
                      name="batchName"
                      value={userInfo.batchName}
                      onChange={handleInputChange}
                      placeholder="Batch Name"
                    />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={userInfo.dateOfBirth}
                      onChange={handleInputChange}
                      placeholder="Date of Birth"
                    />
                    <input
                      type="text"
                      name="gender"
                      value={userInfo.gender}
                      onChange={handleInputChange}
                      placeholder="Gender"
                    />
                    <input
                      type="tel"
                      name="contactNo"
                      value={userInfo.contactNo}
                      onChange={handleInputChange}
                      placeholder="Contact Number"
                    />
                    <input
                      type="text"
                      name="address"
                      value={userInfo.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                    />
                    <input
                      type="text"
                      name="city"
                      value={userInfo.city}
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                    <input
                      type="text"
                      name="state"
                      value={userInfo.state}
                      onChange={handleInputChange}
                      placeholder="State"
                    />
                    <input
                      type="text"
                      name="pinCode"
                      value={userInfo.pinCode}
                      onChange={handleInputChange}
                      placeholder="PIN Code"
                    />
                    {/* Add more fields as required */}
                  </>
                )}
                {userInfo.role === "Staff" && (
                  <>
                    <input
                      type="text"
                      name="contactNumber"
                      value={userInfo.contactNumber}
                      onChange={handleInputChange}
                      placeholder="Contact Number"
                    />
                    <input
                      type="text"
                      name="isBatchCoordinator"
                      value={userInfo.isBatchCoordinator ? "Yes" : "No"}
                      onChange={handleInputChange}
                      placeholder="Batch Coordinator"
                    />
                    {/* Additional staff fields if any */}
                  </>
                )}
                {/* Add conditions for other roles if needed */}
                <button onClick={handleSaveChanges}>Save Changes</button>
              </div>
            ) : (
              // Display user details
              <div>
                <p>
                  <strong>Name:</strong> {userInfo.name}
                </p>
                <p>
                  <strong>Email:</strong> {userInfo.email}
                </p>
                {userInfo.role === "Student" && (
                  <>
                    <p>
                      <strong>Father's Name:</strong> {userInfo.fatherName}
                    </p>
                    <p>
                      <strong>Mother's Name:</strong> {userInfo.motherName}
                    </p>
                    <p>
                      <strong>Enrollment Number:</strong> {userInfo.enrollmentNumber}
                    </p>
                    <p>
                      <strong>Course Name:</strong> {userInfo.courseName}
                    </p>
                    <p>
                      <strong>Batch Name:</strong> {userInfo.batchName}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong> {userInfo.dateOfBirth}
                    </p>
                    <p>
                      <strong>Gender:</strong> {userInfo.gender}
                    </p>
                    <p>
                      <strong>Contact No.:</strong> {userInfo.contactNo}
                    </p>
                    <p>
                      <strong>Address:</strong> {userInfo.address}
                    </p>
                    <p>
                      <strong>City:</strong> {userInfo.city}
                    </p>
                    <p>
                      <strong>State:</strong> {userInfo.state}
                    </p>
                    <p>
                      <strong>PIN Code:</strong> {userInfo.pinCode}
                    </p>
                    {/* Display other student-specific details */}
                  </>
                )}
                {userInfo.role === "Staff" && (
                  <>
                    <p>
                      <strong>Contact Number:</strong> {userInfo.contactNumber}
                    </p>
                    <p>
                      <strong>Batch Coordinator:</strong> {userInfo.isBatchCoordinator ? "Yes" : "No"}
                    </p>
                    {/* Additional staff details if any */}
                  </>
                )}
                {/* Add conditions for other roles if needed */}
                <button onClick={() => setIsEditing(true)}>Edit</button>
              </div>
            )}
          </div>
        ) : (
          <p>User data not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
