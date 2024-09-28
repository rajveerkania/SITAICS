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

interface Course {
  courseName: string;
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/fetchCourses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses);
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("An error occurred while fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

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
                  <span
                    className={
                      studentFormData.courseName ? "" : "text-gray-500 "
                    }
                  >
                    {studentFormData.courseName || "Select Course"}
                  </span>
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
                  <span
                    className={
                      studentFormData.batchName ? "" : "text-gray-500 "
                    }
                  >
                    {studentFormData.batchName || "Select Batch"}
                  </span>
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

              <Select
                name="gender"
                onValueChange={(value) =>
                  handleStudentInputChange({
                    target: { name: "gender", value },
                  } as React.ChangeEvent<HTMLSelectElement>)
                }
                value={studentFormData.gender}
              >
                <SelectTrigger className="w-full">
                  <span>{studentFormData.gender || "Gender"}</span>
                </SelectTrigger>
                <SelectContent>
                  {["Male", "Female", "Others"].map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-500">{errors.gender}</p>}

              <Select
                name="bloodGroup"
                onValueChange={(value) =>
                  handleStudentInputChange({
                    target: { name: "bloodGroup", value },
                  } as React.ChangeEvent<HTMLSelectElement>)
                }
                value={studentFormData.bloodGroup}
              >
                <SelectTrigger className="w-full">
                  <span>{studentFormData.bloodGroup || "Blood Group"}</span>
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                    (group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {errors.bloodGroup && (
                <p className="text-red-500">{errors.bloodGroup}</p>
              )}
            </>
          )}
          {currentStep === 4 && (
            <>
              <Input
                type="tel"
                name="contactNo"
                placeholder="Contact Number"
                value={studentFormData.contactNo}
                onChange={handleStudentInputChange}
                required
              />
              {errors.contactNo && (
                <p className="text-red-500">{errors.contactNo}</p>
              )}
              <Input
                type="text"
                name="address"
                placeholder="Address"
                maxLength={100}
                value={studentFormData.address}
                onChange={handleStudentInputChange}
                className="h-16"
                required
              />
              {errors.address && (
                <p className="text-red-500">{errors.address}</p>
              )}
              <Input
                type="text"
                name="city"
                placeholder="City"
                value={studentFormData.city}
                onChange={handleStudentInputChange}
                required
              />
              {errors.city && <p className="text-red-500">{errors.city}</p>}
              <Input
                type="text"
                name="state"
                placeholder="State"
                value={studentFormData.state}
                onChange={handleStudentInputChange}
                required
              />
              {errors.state && <p className="text-red-500">{errors.state}</p>}
              <Input
                type="text"
                name="pinCode"
                placeholder="Pin Code"
                value={studentFormData.pinCode}
                onChange={handleStudentInputChange}
                required
              />
              {errors.pinCode && (
                <p className="text-red-500">{errors.pinCode}</p>
              )}
            </>
          )}
          <div className="flex justify-between mt-4">
            {currentStep > 1 && (
              <Button onClick={previousStep}>Previous</Button>
            )}
            {currentStep < 4 ? (
              <Button onClick={nextStep}>Next</Button>
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
