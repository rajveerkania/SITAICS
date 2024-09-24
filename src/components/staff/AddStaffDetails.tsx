"use client";
import React, { useState } from "react";

interface AddStaffDetailsProps {
  id: string;
  setShowAddStaffDetails: (value: boolean) => void;
  fetchUserDetails: () => void;
}

const AddStaffDetails: React.FC<AddStaffDetailsProps> = ({
  id,
  setShowAddStaffDetails,
  fetchUserDetails,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [staffFormData, setStaffFormData] = useState({
    id: id,
    email: "",
    username: "",
    name: "",
    isBatchCoordinator: false,
    batchId: "",
    subjects: "",
    contactNumber: "",
    achievements: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    name: "",
    batchId: "",
    subjects: "",
    contactNumber: "",
    achievements: "",
  });

  const handleStaffInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setStaffFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    let errorMessage = "";
    switch (name) {
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const validateStep = () => {
    let stepIsValid = true;
    let stepErrors = { ...errors };

    setErrors(stepErrors);
    return stepIsValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedStaffDetails = await fetch(`/api/addStaffDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staffFormData),
      });

      if (updatedStaffDetails.ok) {
        console.log("Staff details added successfully.");
        setShowAddStaffDetails(false);
        fetchUserDetails();
      } else {
        console.error("Failed to add staff details.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
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
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Add Staff Details
        </h1>
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
                type="text"
                name="subjects"
                placeholder="Subjects"
                value={staffFormData.subjects}
                onChange={handleStaffInputChange}
                className="w-full p-2 border rounded"
              />
              {errors.subjects && (
                <p className="text-red-500">{errors.subjects}</p>
              )}
            </>
          )}
          {currentStep === 3 && (
            <>
              <input
                type="text"
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
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
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
