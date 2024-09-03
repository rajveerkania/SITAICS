"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
  
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
  const [courses, setCourses] = useState<{ courseName: string }[]>([]);
  const [batches, setBatches] = useState<{ batchName: string }[]>([]);
  const [userName, setUserName] = useState("User");

  const [studentFormData, setStudentFormData] = useState({
    id,
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
      [name]: name === "pinCode" ? parseInt(value) || "" : value,
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

  const fetchBatches = async (courseName: string) => {
    try {
      const response = await fetch(
        `/api/getBatchesName?courseName=${courseName}`
      );
      const data = await response.json();
      setBatches(data.batches);
    } catch (error) {
      toast.error("An error occurred while fetching courses.");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
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
        toast.success("Student details added successfully.");
        setShowAddStudentDetails(false);
        fetchUserDetails();
      } else {
        toast.error("Failed to add student details.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/getCoursesName`);
        const data = await response.json();
        setCourses(data.courses);
      } catch (error) {
        toast.error("Something went wrong. Please try again later");
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/fetchUserDetails`);
        const data = await response.json();
        setUserName(data.user.name);
        console.log(data.user.name);
      } catch (error) {
        toast.error("Something went wrong. Please try again later");
      }
    };
    fetchUserDetails();
    fetchCourses();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-3 text-center">{userName}</h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Enter your details to continue
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 1 && (
            <>
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                maxLength={30}
                value={studentFormData.name}
                onChange={handleStudentInputChange}
                required
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
              <Input
                type="text"
                name="fatherName"
                placeholder="Father's Name"
                maxLength={30}
                value={studentFormData.fatherName}
                onChange={handleStudentInputChange}
                required
              />
              {errors.fatherName && (
                <p className="text-red-500">{errors.fatherName}</p>
              )}
              <Input
                type="text"
                name="motherName"
                placeholder="Mother's Name"
                maxLength={30}
                value={studentFormData.motherName}
                onChange={handleStudentInputChange}
                required
              />
              {errors.motherName && (
                <p className="text-red-500">{errors.motherName}</p>
              )}
            </>
          )}
          {currentStep === 2 && (
            <>
              <Input
                type="text"
                name="enrollmentNumber"
                placeholder="Enrollment Number"
                value={studentFormData.enrollmentNumber}
                onChange={handleStudentInputChange}
                required
              />
              {errors.enrollmentNumber && (
                <p className="text-red-500">{errors.enrollmentNumber}</p>
              )}
              <Select
                name="courseName"
                onValueChange={(value) => {
                  handleStudentInputChange({
                    target: { name: "courseName", value },
                  } as React.ChangeEvent<HTMLSelectElement>);
                  fetchBatches(value);
                }}
                value={studentFormData.courseName}
              >
                <SelectTrigger className="w-full">
                  <span>{studentFormData.courseName || "Select Course"}</span>
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course, index) => (
                    <SelectItem key={index} value={course.courseName}>
                      {course.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.courseName && (
                <p className="text-red-500">{errors.courseName}</p>
              )}
              <Select
                name="batchName"
                onValueChange={(value) =>
                  handleStudentInputChange({
                    target: { name: "batchName", value },
                  } as React.ChangeEvent<HTMLSelectElement>)
                }
                value={studentFormData.batchName}
              >
                <SelectTrigger className="w-full">
                  <span>{studentFormData.batchName || "Select Batch"}</span>
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch, index) => (
                    <SelectItem key={index} value={batch.batchName}>
                      {batch.batchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.batchName && (
                <p className="text-red-500">{errors.batchName}</p>
              )}
            </>
          )}
          {currentStep === 3 && (
            <>
              <Input
                type="date"
                name="dateOfBirth"
                value={studentFormData.dateOfBirth}
                onChange={handleStudentInputChange}
                required
              />
              {errors.dateOfBirth && (
                <p className="text-red-500">{errors.dateOfBirth}</p>
              )}
              <Input
                type="text"
                name="gender"
                placeholder="Gender"
                value={studentFormData.gender}
                onChange={handleStudentInputChange}
                required
              />
              {errors.gender && <p className="text-red-500">{errors.gender}</p>}
            </>
          )}
          <div className="flex justify-between mt-4">
            {currentStep > 1 && (
              <Button type="button" onClick={previousStep} variant="outline">
                Back
              </Button>
            )}
            {currentStep < 3 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentDetails;
