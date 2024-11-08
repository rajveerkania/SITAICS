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
import { toast, Toaster } from "sonner";
import { Switch } from "@/components/ui/switch";

interface AddStaffDetailsProps {
  name: string;
  id: string;
  setSemesterUpdate: (value: boolean) => void;
  fetchUserDetails: () => void;
}

const AddStaffDetails: React.FC<AddStaffDetailsProps> = ({
  name,
  id,
  setSemesterUpdate,
  fetchUserDetails,
}) => {
  const MAX_SUBJECTS = 10;
  const username = name;
  const [staffFormData, setStaffFormData] = useState({
    staffId: id,
    isBatchCoordinator: false,
    batchId: "",
    subjectCount: 0,
    selectedSubjectIds: [] as string[],
  });


  const [errors, setErrors] = useState({
    batchId: "",
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
        selectedSubjectIds: Array(newCount).fill(""),
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        subjectCount: "",
      }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedStaffDetails = await fetch("/api/updateStaffDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(staffFormData),
      });

      if (updatedStaffDetails.status === 200) {
        toast.success("Staff details updated successfully.");
        setSemesterUpdate(false);
        fetchUserDetails();
      } else {
        toast.error("Failed to update staff details.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const filteredSubjects = (index: number) => {
    const selectedIds = staffFormData.selectedSubjectIds.slice(0, index);
    return availableSubjects.filter(
      (subject) => !selectedIds.includes(subject.subjectId)
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <Toaster />
      <div className="absolute top-4 right-4">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-3 text-center">{username}</h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Select subjects to continue
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="subjectCount"
            placeholder={`Enter number of subjects you teach (Max ${MAX_SUBJECTS})`}
            value={staffFormData.subjectCount}
            onChange={handleSubjectCountChange}
          />
          {errors.subjectCount && (
            <p className="text-red-500">{errors.subjectCount}</p>
          )}

          {staffFormData.subjectCount > 0 &&
            [...Array(staffFormData.subjectCount)].map((_, index) => (
              <Select
                key={index}
                value={staffFormData.selectedSubjectIds[index]}
                onValueChange={(subjectId) =>
                  handleSelectedSubjectChange(index, subjectId)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select Subject ${index + 1}`} />
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

          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <Switch
                checked={staffFormData.isBatchCoordinator}
                onCheckedChange={handleBatchCoordinatorChange}
              />
              <span>Batch Coordinator</span>
            </label>

            {staffFormData.isBatchCoordinator && (
              <div className="mt-2">
                <Select
                  name="batchId"
                  value={staffFormData.batchId}
                  onValueChange={(value) =>
                    setStaffFormData((prev) => ({
                      ...prev,
                      batchId: value,
                    }))
                  }
                  required
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
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffDetails;
