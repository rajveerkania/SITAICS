 "use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface AddStaffDetailsProps {
  name: string;
  setShowAddStaffDetails: (value: boolean) => void;
  fetchUserDetails: () => void;
}

const AddStaffDetails: React.FC<AddStaffDetailsProps> = ({
  name,
  setShowAddStaffDetails,
  fetchUserDetails,
}) => {
  const MAX_SUBJECTS = 10;
  const username = name;
  const [currentStep, setCurrentStep] = useState(1);
  const [staffFormData, setStaffFormData] = useState({
    email: "",
    name: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    contactNumber: "",
    dateOfBirth: "",
    isBatchCoordinator: false,
    batchId: "",
    subjectCount: 0,
    subjects: [] as string[],
    selectedSubjectIds: [] as string[],
  });

  const [errors, setErrors] = useState({
    email: "",
    name: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    contactNumber: "",
    dateOfBirth: "",
    batchId: "",
    subjects: "",
    subjectCount: "",
  });

  const [batches, setBatches] = useState<
    {
      batchId: string;
      batchName: string;
      courseName: string;
    }[]
  >([]);

  const [availableSubjects, setAvailableSubjects] = useState<
    {
      subjectId: string;
      subjectName: string;
      subjectCode: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch("/api/fetchBatchStaff");
        if (!response.ok) throw new Error("Failed to fetch batches");
        const data = await response.json();
        setBatches(data);
      } catch (error) {
        console.error("Error fetching batches:", error);
        toast.error("Failed to fetch batches. Please try again.");
      }
    };
 
    const fetchSubjects = async () => {
      try {
        const response = await fetch("/api/fetchSubjectStaff");
        if (!response.ok) throw new Error("Failed to fetch subjects");
        const data = await response.json();
        setAvailableSubjects(data);
      } catch (error) {
        toast.error("Failed to fetch subjects. Please try again.");
      }
    };

    if (staffFormData.isBatchCoordinator) fetchBatches();
    fetchSubjects();
  }, [staffFormData.isBatchCoordinator]);

  const handleStaffInputChange = (
    e: React.ChangeEvent<HTMLElement & { name?: string }>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setStaffFormData((prevData) => ({
      ...prevData,
      [name]: name === "pinCode" ? parseInt(value) || "" : value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleBatchCoordinatorChange = (checked: boolean) => {
    setStaffFormData((prev) => ({
      ...prev,
      isBatchCoordinator: checked,
      batchId: checked ? prev.batchId : "",
    }));
  };

  const handleSubjectCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^[0-9]*$/.test(value)) {
      const newCount = value === "" ? 0 : parseInt(value, 10);

      if (newCount > MAX_SUBJECTS) {
        toast.error(`Maximum ${MAX_SUBJECTS} subjects are allowed.`);
        return;
      }

      setStaffFormData((prevData) => ({
        ...prevData,
        subjectCount: newCount,
        subjects: Array(newCount)
          .fill("")
          .map((_, i) => prevData.subjects[i] || ""),
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        subjectCount: "",
      }));
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

  const handleSelectedSubjectChange = (index: number, subjectId: string) => {
    setStaffFormData((prev) => {
      const selectedSubjects = [...prev.selectedSubjectIds];
      selectedSubjects[index] = subjectId;

      return {
        ...prev,
        selectedSubjectIds: selectedSubjects,
      };
    });
  };

  const validateStep = () => {
    let stepIsValid = true;
    let stepErrors = { ...errors };

    if (currentStep === 1) {
      if (!staffFormData.email) {
        stepErrors.email = "Email is required.";
        stepIsValid = false;
      }
      if (!staffFormData.name) {
        stepErrors.name = "Full Name is required.";
        stepIsValid = false;
      }
      if (!staffFormData.gender) {
        stepErrors.gender = "Gender is required.";
        stepIsValid = false;
      }
    }

    if (currentStep === 2) {
      if (!staffFormData.address) {
        stepErrors.address = "Address is required.";
        stepIsValid = false;
      }
      if (!staffFormData.city) {
        stepErrors.city = "City is required.";
        stepIsValid = false;
      }
      if (!staffFormData.state) {
        stepErrors.state = "State is required.";
        stepIsValid = false;
      }
      if (!staffFormData.pinCode) {
        stepErrors.pinCode = "Pin Code is required.";
        stepIsValid = false;
      }
    }

    if (currentStep === 3) {
      if (!staffFormData.contactNumber) {
        stepErrors.contactNumber = "Contact Number is required.";
        stepIsValid = false;
      }
      if (!staffFormData.dateOfBirth) {
        stepErrors.dateOfBirth = "Date of Birth is required.";
        stepIsValid = false;
      }
      if (staffFormData.subjectCount === 0) {
        stepErrors.subjectCount = "Please select number of subjects";
        stepIsValid = false;
      }

      // Only validate batchId if the staff is a batch coordinator
      if (staffFormData.isBatchCoordinator && !staffFormData.batchId) {
        stepErrors.batchId = "Batch is required for coordinators.";
        stepIsValid = false;
      }

      // Validation for subjects
      if (staffFormData.subjectCount > 0 && staffFormData.selectedSubjectIds.length === 0) {
        stepErrors.subjectCount = "Please select subjects.";
        stepIsValid = false;
      }
      if (staffFormData.subjectCount === 0 && staffFormData.selectedSubjectIds.length > 0) {
        stepErrors.subjectCount = ""; // Clear error if subjects are selected but count is 0
      }
    }

    setErrors(stepErrors);
    return stepIsValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    try {
      const updatedStaffDetails = await fetch("/api/addStaffDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staffFormData),
      });

      if (updatedStaffDetails.ok) {
        toast.success("Staff details added successfully.");
        setShowAddStaffDetails(false);
        fetchUserDetails();
      } else {
        toast.error("Failed to add staff details.");
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

  const filteredSubjects = (index: number) => {
    const selectedIds = staffFormData.selectedSubjectIds.slice(0, index);
    return availableSubjects.filter(
      (subject) => !selectedIds.includes(subject.subjectId)
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <Button
           onClick={handleLogout}>Logout</Button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-3 text-center">{username}</h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Enter staff details to continue
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 1 && (
            <>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={staffFormData.email}
                onChange={handleStaffInputChange}
                required
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                maxLength={30}
                value={staffFormData.name}
                onChange={handleStaffInputChange}
                required
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
              <Select
                name="gender"
                onValueChange={(value) =>
                  handleStaffInputChange({
                    target: { name: "gender", value },
                  } as React.ChangeEvent<HTMLSelectElement>)
                }
                value={staffFormData.gender}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  {["Male", "Female", "Other"].map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-500">{errors.gender}</p>}
            </>
          )}

          {currentStep === 2 && (
            <>
              <Input
                type="text"
                name="address"
                placeholder="Address"
                maxLength={100}
                value={staffFormData.address}
                onChange={handleStaffInputChange}
                required
              />
              {errors.address && (
                <p className="text-red-500">{errors.address}</p>
              )}
              <Input
                type="text"
                name="city"
                placeholder="City"
                value={staffFormData.city}
                onChange={handleStaffInputChange}
                required
              />
              {errors.city && <p className="text-red-500">{errors.city}</p>}
              <Input
                type="text"
                name="state"
                placeholder="State"
                value={staffFormData.state}
                onChange={handleStaffInputChange}
                required
              />
              {errors.state && <p className="text-red-500">{errors.state}</p>}
              <Input
                type="text"
                name="pinCode"
                placeholder="Pin Code"
                maxLength={6}
                value={staffFormData.pinCode}
                onChange={handleStaffInputChange}
                required
              />
              {errors.pinCode && (
                <p className="text-red-500">{errors.pinCode}</p>
              )}
            </>
          )}

          {currentStep === 3 && (
            <>
              <Input
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                value={staffFormData.contactNumber}
                onChange={handleStaffInputChange}
                required
              />
              {errors.contactNumber && (
                <p className="text-red-500">{errors.contactNumber}</p>
              )}
              <Input
                type="date"
                name="dateOfBirth"
                placeholder="Date of Birth"
                value={staffFormData.dateOfBirth}
                onChange={handleStaffInputChange}
                required
              />
              {errors.dateOfBirth && (
                <p className="text-red-500">{errors.dateOfBirth}</p>
              )}
              <div>
                <Input
                  type="text"
                  name="subjectCount"
                  placeholder={`How many subjects do you teach? (Max ${MAX_SUBJECTS})`}
                  value={staffFormData.subjectCount}
                  onChange={handleSubjectCountChange}
                />
              </div>
              {errors.subjectCount && (
                <p className="text-red-500">{errors.subjectCount}</p>
              )}
              {staffFormData.subjectCount > 0 &&
                [...Array(staffFormData.subjectCount)].map((_, index) => (
                  <Select
                    key={index}
                    onValueChange={(subjectId) =>
                      handleSelectedSubjectChange(index, subjectId)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={`Select Subject ${index + 1}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSubjects(index).map((subject) => (
                        <SelectItem
                          key={subject.subjectId}
                          value={subject.subjectId}
                        >
                          {`${subject.subjectName} (${subject.subjectCode})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={staffFormData.isBatchCoordinator}
                    onChange={(e) =>
                      handleBatchCoordinatorChange(e.target.checked)
                    }
                  />
                  <span>Batch Coordinator</span>
                </label>

                {staffFormData.isBatchCoordinator && (
                  <div className="mt-2">
                    <Select
                      name="batchId"
                      value={staffFormData.batchId}
                      onValueChange={(value) =>
                        handleStaffInputChange({
                          target: { name: "batchId", value },
                        } as React.ChangeEvent<HTMLSelectElement>)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem key={batch.batchId} value={batch.batchId}>
                            {batch.batchName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.batchId && (
                      <p className="text-red-500">{errors.batchId}</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-between">
            {currentStep > 1 && (
              <Button type="button" onClick={previousStep}>
                Previous
              </Button>
            )}
            <Button
              type="button"
              onClick={currentStep === 3 ? handleSubmit : nextStep}
            >
              {currentStep === 3 ? "Submit" : "Next"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffDetails;