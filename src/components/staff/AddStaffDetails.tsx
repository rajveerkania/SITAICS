"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface AddStaffDetailsProps {
  id: string;
  setShowAddStaffDetails: (value: boolean) => void;
  fetchUserDetails: () => void;
}

interface StaffFormData {
  id: string;
  email: string;
  username: string;
  name: string;
  isBatchCoordinator: boolean;
  batchId?: string; // Optional
  contactNumber?: string; // Optional
  achievements?: string; // Optional
}

const AddStaffDetails: React.FC<AddStaffDetailsProps> = ({
  id,
  setShowAddStaffDetails,
  fetchUserDetails,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [staffFormData, setStaffFormData] = useState<StaffFormData>({
    id: id, 
    email: "",
    username: "",
    name: "",
    isBatchCoordinator: false,
    batchId: "",
    contactNumber: "",
    achievements: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StaffFormData, string>>>({
    email: "",
    username: "",
    name: "",
    batchId: "",
    contactNumber: "",
    achievements: "",
  });

  const router = useRouter();

  const handleStaffInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStaffFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name as keyof StaffFormData, value);
  };

  const validateField = (name: keyof StaffFormData, value: string) => {
    let errorMessage = "";
    if (!value && ["email", "username", "name"].includes(name)) {
      errorMessage = `${name} is required`;
    } else if (name === "email" && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      errorMessage = "Invalid email address";
    } else if (name === "contactNumber" && !/^\d{10}$/.test(value)) {
      errorMessage = "Invalid contact number";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const validateStep = () => {
    let stepIsValid = true;
    let stepErrors: Partial<Record<keyof StaffFormData, string>> = { ...errors };

    if (currentStep === 1) {
      ["email", "username", "name"].forEach((field) => {
        const key = field as keyof StaffFormData;
        if (!staffFormData[key]) {
          stepErrors[key] = `${field} is required`;
          stepIsValid = false;
        }
      });
    }

    setErrors(stepErrors);
    return stepIsValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        const response = await fetch(`/api/addStaffDetails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(staffFormData),
        });

        if (response.ok) {
          setShowAddStaffDetails(false);
          fetchUserDetails();
          router.push("/staff/dashboard");
        } else {
          console.error("Failed to add staff details.");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Staff Details</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 1 && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={staffFormData.email}
                onChange={handleStaffInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={staffFormData.username}
                onChange={handleStaffInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.username && (
                <p className="text-red-500">{errors.username}</p>
              )}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={staffFormData.name}
                onChange={handleStaffInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </>
          )}
          {currentStep === 2 && (
            <>
              <input
                type="checkbox"
                name="isBatchCoordinator"
                checked={staffFormData.isBatchCoordinator}
                onChange={(e) =>
                  setStaffFormData({
                    ...staffFormData,
                    isBatchCoordinator: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <label htmlFor="isBatchCoordinator">Batch Coordinator</label>

              <input
                type="text"
                name="batchId"
                placeholder="Batch ID"
                value={staffFormData.batchId}
                onChange={handleStaffInputChange}
                className="w-full p-2 border rounded"
              />
              {errors.batchId && (
                <p className="text-red-500">{errors.batchId}</p>
              )}
              <input
                type="tel"
                name="contactNumber"
                placeholder="Contact Number"
                value={staffFormData.contactNumber}
                onChange={handleStaffInputChange}
                className="w-full p-2 border rounded"
              />
              {errors.contactNumber && (
                <p className="text-red-500">{errors.contactNumber}</p>
              )}
              <textarea
                name="achievements"
                placeholder="Achievements"
                value={staffFormData.achievements}
                onChange={handleStaffInputChange}
                className="w-full p-2 border rounded"
              />
              {errors.achievements && (
                <p className="text-red-500">{errors.achievements}</p>
              )}
            </>
          )}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={previousStep}
                className="bg-gray-200 p-2 rounded"
              >
                Back
              </button>
            )}
            {currentStep < 2 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffDetails;
