"use client";
import React, { useState } from "react";
import { toast } from "sonner";

interface AddStaffDetailsProps {
  id: string;
  setShowAddStaffDetails: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUserDetails: () => void;
}

const AddStaffDetails: React.FC<AddStaffDetailsProps> = ({
  id,
  setShowAddStaffDetails,
  fetchUserDetails,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [numSubjects, setNumSubjects] = useState(0);
  const [subjects, setSubjects] = useState<string[]>([]);

  const handleNumSubjectsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = Number(e.target.value);
    setNumSubjects(count);
    setSubjects(Array(count).fill(""));
  };

  const handleSubjectChange = (index: number, value: string) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = value;
    setSubjects(updatedSubjects);
  };

  const handleSubmit = async () => {
    if (!name || !email || !contactNo || subjects.some((subject) => !subject)) {
      toast.error("Please fill in all the details");
      return;
    }

    try {
      const response = await fetch("/api/submitStaffDetails", {
        method: "POST",
        body: JSON.stringify({
          id,
          name,
          email,
          contactNo,
          subjects,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Details updated successfully!");
        setShowAddStaffDetails(false);
        fetchUserDetails();
      } else {
        toast.error("Failed to update details");
      }
    } catch (error) {
      console.error("Error submitting staff details:", error);
      toast.error("Error submitting details");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">Complete Your Profile</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Contact Number</label>
          <input
            type="tel"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">How many subjects do you teach?</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={numSubjects}
            onChange={handleNumSubjectsChange}
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {subjects.map((subject, index) => (
          <div className="mb-4" key={index}>
            <label className="block text-gray-700">Subject {index + 1} Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={subject}
              onChange={(e) => handleSubjectChange(index, e.target.value)}
            />
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddStaffDetails;
