import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { NotificationPayload, Course, Batch } from "@/types/type";

export function AdminNotification() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationType, setNotificationType] = useState<NotificationPayload['type']>("CIRCULAR");
  const [message, setMessage] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [sendToAllBatches, setSendToAllBatches] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchBatches();
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/getCoursesName");
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses);
      } else {
        showToast("destructive", "Error", data.error || "Failed to fetch courses");
      }
    } catch (error) {
      showToast("destructive", "Error", "Failed to fetch courses");
    }
  };

  const fetchBatches = async () => {
    if (!selectedCourse) return;

    try {
      const response = await fetch("/api/getBatchesName", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseName: selectedCourse }),
      });
      const data = await response.json();

      if (data.success) {
        setBatches(data.batchNames.map((batchName: string) => ({ batchName })));
      } else {
        setBatches([]);
        showToast("destructive", "Error", data.error || "Failed to fetch batches");
      }
    } catch (error) {
      showToast("destructive", "Error", "Failed to fetch batches");
    }
  };

  const handleSend = async () => {
    try {
      setLoading(true);

      const payload: NotificationPayload = {
        type: notificationType,
        message,
        ...(notificationType === "COURSE" && {
          courseName: selectedCourse,
          batchName: sendToAllBatches ? undefined : selectedBatch,
          sendToAllBatches,
        }),
      };

      const response = await fetch("/api/notifications/adminNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        showToast("success", "Success", "Notification sent successfully");
        handleClose();
      } else {
        throw new Error(data.error || "Failed to send notification");
      }
    } catch (error) {
      showToast("destructive", "Error", error instanceof Error ? error.message : "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setNotificationType("CIRCULAR");
    setMessage("");
    setSelectedCourse("");
    setSelectedBatch("");
    setSendToAllBatches(false);
  };

  const showToast = (variant: "success" | "destructive", title: string, description: string) => {
    console.log({ variant, title, description });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            value={notificationType}
            onValueChange={(value: NotificationPayload['type']) => {
              setNotificationType(value);
              setSelectedCourse("");
              setSelectedBatch("");
              setSendToAllBatches(false);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select notification type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CIRCULAR">General Circular</SelectItem>
              <SelectItem value="COURSE">Course Notification</SelectItem>
            </SelectContent>
          </Select>

          {notificationType === "COURSE" && (
            <>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.courseName} value={course.courseName}>
                      {course.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedCourse && (
                <>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={sendToAllBatches}
                      onCheckedChange={(checked: boolean) => {
                        setSendToAllBatches(checked);
                        if (checked) setSelectedBatch("");
                      }}
                    />
                    <label>Send to all batches</label>
                  </div>

                  <Select
                    value={selectedBatch}
                    onValueChange={setSelectedBatch}
                    disabled={sendToAllBatches}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((batch: Batch) => (
                        <SelectItem key={batch.batchName} value={batch.batchName}>
                          {batch.batchName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </>
          )}

          <Textarea
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button onClick={handleSend} disabled={loading}>
            {loading ? "Sending..." : "Send Notification"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
