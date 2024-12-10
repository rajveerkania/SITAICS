import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AttendancePopupProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  onSubmit: (date: Date, status: string) => void;
  attendanceId?: string;
  currentStatus?: boolean;
}

const AttendancePopup = ({ 
  isOpen, 
  onClose, 
  date, 
  onSubmit,
  attendanceId, 
  currentStatus 
}: AttendancePopupProps) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateAttendance = async (isPresent: boolean) => {
    // Validate attendance ID
    if (!attendanceId) {
      toast.error("Attendance ID is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/updateAttendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          attendanceId, 
          isPresent 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update attendance');
      }

      // Call the onSubmit callback with the date and status
      onSubmit(date, isPresent ? 'Present' : 'Absent');

      toast.success("Attendance updated successfully");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Attendance</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p>Date: {date.toLocaleDateString()}</p>
          <p>Current Status: {currentStatus ? "Present" : "Absent"}</p>
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleUpdateAttendance(true)} 
              disabled={loading} 
              variant={currentStatus ? "default" : "outline"}
            >
              Mark Present
            </Button>
            <Button 
              onClick={() => handleUpdateAttendance(false)} 
              disabled={loading} 
              variant={!currentStatus ? "default" : "outline"}
            >
              Mark Absent
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendancePopup;