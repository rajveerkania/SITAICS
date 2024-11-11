import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";

// Define types for Course and Batch
interface Course {
  courseName: string;
}

interface Batch {
  id: string;
  name: string;
}

export function NotificationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationType, setNotificationType] = useState("specific");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [sendToAllBatches, setSendToAllBatches] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]); // Set the type for courses
  const [batches, setBatches] = useState<Batch[]>([]); // Set the type for batches

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/getCoursesName"); 
        const data = await response.json();
        if (data.success) {
          setCourses(data.courses);
        } else {
          console.error("Failed to fetch courses:", data.error);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchBatches = async () => {
      if (selectedCourse) {
        try {
          const response = await fetch("/api/getBatchesName", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ courseName: selectedCourse }),
          });
          const data = await response.json();
          if (data.batchNames) {
            setBatches(data.batchNames.map((name: string) => ({ id: name, name })));
          } else {
            console.warn("No batches found for selected course:", data.message);
            setBatches([]);
          }
        } catch (error) {
          console.error("Error fetching batches:", error);
        }
      } else {
        setBatches([]);
      }
    };

    fetchBatches();
  }, [selectedCourse]);

  const handleSend = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: notificationType,
          recipient,
          message,
          course: selectedCourse,
          batch: sendToAllBatches ? null : selectedBatch,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Notification sent successfully!");
        setIsOpen(false);
        setRecipient("");
        setMessage("");
        setSelectedCourse("");
        setSelectedBatch("");
        setSendToAllBatches(false);
      } else {
        alert(data.error || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("An error occurred while sending the notification");
    }
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
            onValueChange={(value) => {
              setNotificationType(value);
              setRecipient("");
              setSelectedCourse("");
              setSelectedBatch("");
              setSendToAllBatches(false);
            }}
            defaultValue={notificationType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Notification Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="specific">Specific Student</SelectItem>
              <SelectItem value="circular">General Circular</SelectItem>
              <SelectItem value="course">Course</SelectItem>
            </SelectContent>
          </Select>

          {notificationType === "specific" && (
            <Input
              placeholder="Student Name or ID"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          )}

          {notificationType === "course" && (
            <>
              <Select
                onValueChange={setSelectedCourse}
                defaultValue={selectedCourse}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Course" />
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
                  <div className="flex items-center gap-2 mt-2">
                    <Checkbox
                      checked={sendToAllBatches}
                      onChange={(e) => {
                        setSendToAllBatches(e.target.checked);
                        setSelectedBatch("");
                      }}
                    />
                    <label>Send to all batches</label>
                  </div>

                  {!sendToAllBatches && batches.length > 0 && (
                    <Select
                      onValueChange={setSelectedBatch}
                      defaultValue={selectedBatch}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Batch" />
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
                </>
              )}
            </>
          )}

          <Textarea
            placeholder="Notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <Button onClick={handleSend}>Send Notification</Button>
      </DialogContent>
    </Dialog>
  );
}
