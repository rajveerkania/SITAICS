// import React, { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { AttendanceType } from "@prisma/client";

// interface AttendancePopupProps {
//   isOpen: boolean;
//   onClose: () => void;
//   date: Date;
//   studentId: string;
//   subjectId: string;
//   batchId: string;
//   type: AttendanceType;
//   currentStatus?: boolean;
//   onAttendanceUpdate: (updatedRecord: any) => void;
// }

// const AttendancePopup = ({ 
//   isOpen, 
//   onClose, 
//   date, 
//   studentId,
//   subjectId,
//   batchId,
//   type,
//   currentStatus, 
//   onAttendanceUpdate
// }: AttendancePopupProps) => {
//   const [loading, setLoading] = useState(false);

//   const handleUpdateAttendance = async (isPresent: boolean) => {
//     setLoading(true);

//     try {
//       const response = await fetch('/api/updateAttendance', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           date:date.toISOString(), 
//           studentId,
//           subjectId,
//           batchId,
//           type,
//           isPresent 
//         }),
//       });

//       const data = await response.json();
 
//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to update attendance');
//       }

//       // Call the onAttendanceUpdate callback with the updated record
//       onAttendanceUpdate(data.attendance);

//       toast.success("Attendance updated successfully");
//       onClose();
//     } catch (error: any) {
//       toast.error(error.message || "Failed to update attendance");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Update {type === AttendanceType.LECTURE ? 'Lecture' : 'Lab'} Attendance</DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-4">
//           <p>Date: {date.toLocaleDateString()}</p>
//           <p>Current Status: {currentStatus ? "Present" : "Absent"}</p>
          
//           <div className="flex space-x-2">
//             <Button 
//               onClick={() => handleUpdateAttendance(true)} 
//               disabled={loading} 
//               variant={currentStatus ? "default" : "outline"}
//             >
//               Mark Present
//             </Button>
//             <Button 
//               onClick={() => handleUpdateAttendance(false)} 
//               disabled={loading} 
//               variant={!currentStatus ? "default" : "outline"}
//             >
//               Mark Absent
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AttendancePopup;
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AttendanceType } from "@prisma/client";

interface AttendancePopupProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  studentId: string;
  subjectId: string;
  type: AttendanceType;
  currentStatus?: boolean;
  onAttendanceUpdate: (updatedRecord: any) => void;
}

const AttendancePopup: React.FC<AttendancePopupProps> = ({ 
  isOpen, 
  onClose, 
  date, 
  studentId,
  subjectId,
  type,
  currentStatus, 
  onAttendanceUpdate
}) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateAttendance = async (isPresent: boolean) => {
    setLoading(true);
  
    try {
      // Adjusting date to local time before sending
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0]; // Format as YYYY-MM-DD
  
      console.log('Sending attendance update:', { 
        date: localDate, 
        studentId,
        subjectId,
        type,
        isPresent
      });
  
      const response = await fetch('/api/updateAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          date: localDate, // Use the adjusted date
          studentId,
          subjectId,
          type,
          isPresent
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to update attendance');
      }
  
      const data = await response.json();
  
      if (data.attendance) {
        onAttendanceUpdate({
          ...data.attendance,
          date: new Date(data.attendance.date)
        });
      }
  
      toast.success("Attendance updated successfully");
      onClose();
    } catch (error: any) {
      console.error('Attendance update error:', error);
      toast.error(error.message || "Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {type === AttendanceType.LECTURE ? 'Lecture' : 'Lab'} Attendance</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p>Date: {date.toLocaleDateString()}</p>
          <p>Current Status: {currentStatus !== undefined ? (currentStatus ? "Present" : "Absent") : "Not recorded"}</p>
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleUpdateAttendance(true)} 
              disabled={loading} 
              variant={currentStatus === true ? "default" : "outline"}
            >
              Mark Present
            </Button>
            <Button 
              onClick={() => handleUpdateAttendance(false)} 
              disabled={loading} 
              variant={currentStatus === false ? "default" : "outline"}
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

