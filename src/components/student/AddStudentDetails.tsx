"use client";
import React, { useState } from "react";

interface AddStudentDetailsProps {
  id: string;
  setShowAddStudentDetails: (value: boolean) => void;
  fetchUserDetails: () => void;
}

const AddStudentDetails: React.FC<AddStudentDetailsProps> = ({
  id,
  setShowAddStudentDetails,
  fetchUserDetails,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [studentFormData, setStudentFormData] = useState({
    id: id,
    name: "",
    fatherName: "",
    motherName: "",
    enrollmentNumber: "",
    courseName: "",
    batchName: "",
    results: "",
    bloodGroup: "",
    dateOfBirth: "",
    gender: "",
    contactNo: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    enrollmentNumber: "",
    courseName: "",
    batchName: "",
    results: "",
    bloodGroup: "",
    dateOfBirth: "",
    gender: "",
    contactNo: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const handleStudentInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setStudentFormData((prevData) => ({
      ...prevData,
      [name]: name === "pinCode" ? parseInt(value) || null : value,
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
      const updatedStudentDetails = await fetch(`/api/addStudentDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentFormData),
      });

      if (updatedStudentDetails.ok) {
        console.log("Student details added successfully.");
        setShowAddStudentDetails(false);
        fetchUserDetails();
      } else {
        console.error("Failed to add student details.");
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
          Add Profile Details
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 1 && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                maxLength={30}
                value={studentFormData.name}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
              <input
                type="text"
                name="fatherName"
                placeholder="Father's Name"
                maxLength={30}
                value={studentFormData.fatherName}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.fatherName && (
                <p className="text-red-500">{errors.fatherName}</p>
              )}
              <input
                type="text"
                name="motherName"
                placeholder="Mother's Name"
                maxLength={30}
                value={studentFormData.motherName}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.motherName && (
                <p className="text-red-500">{errors.motherName}</p>
              )}
            </>
          )}
          {currentStep === 2 && (
            <>
              <input
                type="text"
                name="enrollmentNumber"
                placeholder="Enrollment Number"
                value={studentFormData.enrollmentNumber}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.enrollmentNumber && (
                <p className="text-red-500">{errors.enrollmentNumber}</p>
              )}
              <select
                name="courseName"
                value={studentFormData.courseName}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Course</option>
                <option value="B.Tech CS&E (CS)">BTech</option>
                <option value="MTech">MTech</option>
                <option value="MTech AI/ML">MTech AI/ML</option>
              </select>
              {errors.courseName && (
                <p className="text-red-500">{errors.courseName}</p>
              )}
              <input
                type="text"
                name="batchName"
                placeholder="Batch Name"
                value={studentFormData.batchName}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.batchName && (
                <p className="text-red-500">{errors.batchName}</p>
              )}
            </>
          )}
          {currentStep === 3 && (
            <>
              <input
                type="date"
                name="dateOfBirth"
                value={studentFormData.dateOfBirth}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.dateOfBirth && (
                <p className="text-red-500">{errors.dateOfBirth}</p>
              )}
              <input
                type="text"
                name="gender"
                placeholder="Gender"
                value={studentFormData.gender}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.gender && <p className="text-red-500">{errors.gender}</p>}
              <input
                type="text"
                name="bloodGroup"
                placeholder="Blood Group"
                value={studentFormData.bloodGroup}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.bloodGroup && (
                <p className="text-red-500">{errors.bloodGroup}</p>
              )}
              <input
                type="text"
                name="contactNo"
                placeholder="Contact Number"
                value={studentFormData.contactNo}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.contactNo && (
                <p className="text-red-500">{errors.contactNo}</p>
              )}
            </>
          )}
          {currentStep === 4 && (
            <>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={studentFormData.address}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.address && (
                <p className="text-red-500">{errors.address}</p>
              )}
              <input
                type="text"
                name="city"
                placeholder="City"
                value={studentFormData.city}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.city && <p className="text-red-500">{errors.city}</p>}
              <input
                type="text"
                name="state"
                placeholder="State"
                value={studentFormData.state}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.state && <p className="text-red-500">{errors.state}</p>}
              <input
                type="number"
                name="pinCode"
                placeholder="Pin Code"
                value={studentFormData.pinCode}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.pinCode && (
                <p className="text-red-500">{errors.pinCode}</p>
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
            {currentStep < 4 ? (
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

export default AddStudentDetails;
