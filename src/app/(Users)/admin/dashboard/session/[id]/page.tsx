"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import usePreviousRoute from "@/app/hooks/usePreviousRoute";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

const PasswordModal = ({ isOpen, onClose, onSubmit }: any) => {
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (password) {
      setPassword("");
      await onSubmit(password);
    } else {
      toast.error("Password is required.");
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-xl font-bold mb-4">Enter Admin Password</h3>
        <Input
          type="password"
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};

const UpdateAcademicSession = () => {
  const [session, setSession] = useState("");
  const { id } = useParams<{ id: string | string[] }>();
  const [currentYear, setCurrentYear] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleBack } = usePreviousRoute();


  const fetchData = async () => {
    try {
      const response = await fetch("/api/getAcademicSession");
      const data = await response.json();
      setSession(data.session);
      const currentYear = new Date().getFullYear();
      setCurrentYear(currentYear);
    } catch (error) {
      toast.error("Error fetching batch data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNextSession = async () => {
    setIsModalOpen(true);
  };

  const handlePasswordSubmit = async (password: string) => {
    try {
      const response = await fetch("/api/updateSessionPassword/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to authenticate");
      }

      const sessionUpdateResponse = await fetch("/api/updateSession", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "next" }),
      });

      if (!sessionUpdateResponse.ok) {
        throw new Error("Failed to update academic session");
      }

      toast.success("Academic session updated successfully");
      fetchData();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  if (isLoading) {
    return <LoadingSkeleton loadingText="Session Details" />;
  }

  return (
    <div className="bg-[#f2f3f5] min-h-screen">
      <Toaster />
      <div className="container mx-auto py-8 px-4">
        <Button variant="outline" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="bg-white p-12 rounded-lg shadow-lg max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">
            {session} Semester for A.Y. {currentYear}
          </h2>
          <div className="flex justify-center space-x-4">
            <Button onClick={handleNextSession}>Update Session</Button>
          </div>
        </div>
      </div>

      <PasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
};

export default UpdateAcademicSession;
