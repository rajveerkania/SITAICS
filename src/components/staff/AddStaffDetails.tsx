import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

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
    id,
    email: "",
    name: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    contactNo: "",
    dateOfBirth: "",
    isBatchCoordinator: false,
    batchId: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    name: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    contactNo: "",
    dateOfBirth: "",
    batchId: "",
  });

  const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch("/api/fetchBatches");
        if (!response.ok) {
          throw new Error("Failed to fetch batches");
        }
        const data = await response.json();
        setBatches(data);
      } catch (error) {
        console.error("Error fetching batches:", error);
        toast.error("Failed to fetch batches. Please try again.");
      }
    };

    if (staffFormData.isBatchCoordinator) {
      fetchBatches();
    }
  }, [staffFormData.isBatchCoordinator]);

  const handleStaffInputChange = (
    e: React.ChangeEvent<HTMLElement & { name?: string }>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    const fieldValue = type === "checkbox" ? checked : value;

    setStaffFormData((prevData) => ({
      ...prevData,
      [name]: name === "pinCode" ? parseInt(value) || "" : fieldValue,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
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
      if (!staffFormData.contactNo) {
        stepErrors.contactNo = "Contact Number is required.";
        stepIsValid = false;
      }
      if (!staffFormData.dateOfBirth) {
        stepErrors.dateOfBirth = "Date of Birth is required.";
        stepIsValid = false;
      }
      if (staffFormData.isBatchCoordinator && !staffFormData.batchId) {
        stepErrors.batchId = "Batch is required for coordinators.";
        stepIsValid = false;
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

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-3 text-center">Staff Details</h1>
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
                  <span>{staffFormData.gender || "Select Gender"}</span>
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
              {errors.address && <p className="text-red-500">{errors.address}</p>}
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
              {errors.pinCode && <p className="text-red-500">{errors.pinCode}</p>}
            </>
          )}

          {currentStep === 3 && (
            <>
              <Input
                type="text"
                name="contactNo"
                placeholder="Contact Number"
                maxLength={10}
                value={staffFormData.contactNo}
                onChange={handleStaffInputChange}
                required
              />
              {errors.contactNo && <p className="text-red-500">{errors.contactNo}</p>}
              <Input
                type="date"
                name="dateOfBirth"
                value={staffFormData.dateOfBirth}
                onChange={handleStaffInputChange}
                required
              />
              {errors.dateOfBirth && <p className="text-red-500">{errors.dateOfBirth}</p>}
              <label>
                <input
                  type="checkbox"
                  name="isBatchCoordinator"
                  checked={staffFormData.isBatchCoordinator}
                  onChange={handleStaffInputChange}
                />
                Is Batch Coordinator
              </label>
              {staffFormData.isBatchCoordinator && (
                <Select
                  name="batchId"
                  onValueChange={(value) =>
                    handleStaffInputChange({
                      target: { name: "batchId", value },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                  value={staffFormData.batchId}
                  required
                >
                  <SelectTrigger className="w-full">
                    <span>{staffFormData.batchId || "Select Batch"}</span>
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.batchId && <p className="text-red-500">{errors.batchId}</p>}
            </>
          )}

          <div className="flex justify-between">
            {currentStep > 1 && (
              <Button type="button" onClick={previousStep}>
                Previous
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

export default AddStaffDetails;
