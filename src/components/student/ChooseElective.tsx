import React, { useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { toast, Toaster } from "sonner";

interface ElectiveGroup {
  electiveGroupId: string;
  groupName: string;
  subjects: {
    subjectId: string;
    subjectName: string;
  }[];
}

interface ChooseElectiveProps {
  id: string;
  name: string;
  setSemesterUpdated: (value: boolean) => void;
  electiveGroups: ElectiveGroup[];
}

const ChooseElective: React.FC<ChooseElectiveProps> = ({
  id,
  name,
  setSemesterUpdated,
  electiveGroups,
}) => {
  const [selectedSubjects, setSelectedSubjects] = useState<
    Record<string, string>
  >({});

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

    // Check if all elective groups have a selected subject
    if (Object.keys(selectedSubjects).length !== electiveGroups.length) {
      toast.error("Please select one subject from each elective group");
      return;
    }

    // Transform selectedSubjects into the expected API payload format
    const electiveChoices = Object.entries(selectedSubjects).map(
      ([electiveGroupId, subjectId]) => ({
        electiveGroupId,
        subjectId,
      })
    );

    try {
      const response = await fetch(`/api/student/updateElectives`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: id,
          electiveChoices,
        }),
      });

      if (response.ok) {
        toast.success("Electives updated successfully");
        setSemesterUpdated(false);
        
      } else {
        toast.error("Failed to update electives");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <Toaster />
      <div className="absolute top-4 right-4">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-3 text-center">{name}</h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Please select your electives
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {electiveGroups.map((group, index) => (
            <div key={group.electiveGroupId} className="space-y-4">
              <h2 className="text-lg font-semibold">Elective {index + 1}:</h2>
              <RadioGroup.Root
                className="space-y-2"
                onValueChange={(value) =>
                  setSelectedSubjects((prev) => ({
                    ...prev,
                    [group.electiveGroupId]: value,
                  }))
                }
                value={selectedSubjects[group.electiveGroupId]}
              >
                {group.subjects.map((subject) => (
                  <div
                    key={subject.subjectId}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroup.Item
                      id={subject.subjectId}
                      value={subject.subjectId}
                      className="h-4 w-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-primary after:content-['']" />
                    </RadioGroup.Item>
                    <Label htmlFor={subject.subjectId} className="text-sm">
                      {subject.subjectName}
                    </Label>
                  </div>
                ))}
              </RadioGroup.Root>
            </div>
          ))}

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChooseElective;
