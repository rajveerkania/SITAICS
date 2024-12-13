import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Subject {
  subjectId: string;
  subjectName: string;
  batchId: string;
  batchName: string;
}

export const StaffNotification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationType, setNotificationType] = useState("batch");
  const [message, setMessage] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [batches, setBatches] = useState<{ batchId: string; batchName: string }[]>([]);

  const loadSubjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/fetchSubjectsStaffAttendence", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load subjects");

      const data = await response.json();
      if (data.success && Array.isArray(data.subjects)) {
        setSubjects(data.subjects);

        // Extract unique batches from subjects
        const uniqueBatches = Array.from(
          new Set(data.subjects.map((item: Subject) => item.batchId))
        ).map((batchId) => {
          const batchInfo = data.subjects.find((item: Subject) => item.batchId === batchId);
          return {
            batchId: batchInfo.batchId,
            batchName: batchInfo.batchName,
          };
        });
        setBatches(uniqueBatches);
      }
    } catch (error) {
      console.error("Error loading subjects:", error);
      toast.error("Failed to load subjects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleSend = async () => {
    if (!message) {
      toast.error("Please enter a message");
      return;
    }

    if (!selectedBatchId) {
      toast.error("Please select a batch");
      return;
    }

    if (notificationType === "subject" && !selectedSubjectId) {
      toast.error("Please select a subject");
      return;
    }

    try {
      const response = await fetch("/api/notifications/staffNotification", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: notificationType,
          message,
          batchId: selectedBatchId,
          subjectId: notificationType === "subject" ? selectedSubjectId : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Notification sent successfully!");
        setIsOpen(false);
        resetForm();
      } else {
        toast.error(data.error || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("An error occurred while sending the notification");
    }
  };

  const resetForm = () => {
    setMessage("");
    setSelectedBatchId("");
    setSelectedSubjectId("");
  };

  const filteredSubjects = subjects.filter((subject) => subject.batchId === selectedBatchId);

  return (
    <div className="relative notification-container">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select
              onValueChange={(value) => {
                setNotificationType(value);
                resetForm();
              }}
              defaultValue={notificationType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Notification Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="batch">Batch Notification</SelectItem>
                <SelectItem value="subject">Subject Related</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedBatchId}
              onValueChange={setSelectedBatchId}
              disabled={isLoading}
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

            {notificationType === "subject" && (
              <Select
                value={selectedSubjectId}
                onValueChange={setSelectedSubjectId}
                disabled={isLoading || !selectedBatchId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubjects.map((subject) => (
                    <SelectItem key={subject.subjectId} value={subject.subjectId}>
                      {subject.subjectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Textarea
              placeholder="Notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend}>Send</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffNotification;