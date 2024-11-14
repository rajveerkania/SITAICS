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

interface StaffNotification {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const StaffNotification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationType, setNotificationType] = useState("class");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showNotificationList, setShowNotificationList] = useState(false);
  const [notifications, setNotifications] = useState<StaffNotification[]>([
    {
      id: "1",
      message: "Assignment submission deadline extended",
      timestamp: "2 hours ago",
      isRead: false,
    },
    {
      id: "2",
      message: "New student enrolled in your class",
      timestamp: "5 hours ago",
      isRead: false,
    },
  ]);

  const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch("/api/fetchBatch");
        const data = await response.json();

        if (response.ok) {
          const formattedBatches = data.map((batch: any) => ({
            id: batch.batchId,
            name: batch.batchName,
          }));
          setBatches(formattedBatches);
        } else {
          console.error("Failed to fetch batches:", data.message);
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await fetch("/api/fetchSubjectStaff");
        const data = await response.json();

        if (response.ok) {
          const formattedSubjects = data.map((subject: any) => ({
            id: subject.subjectId,
            name: subject.subjectName,
          }));
          setSubjects(formattedSubjects);
        } else {
          console.error("Failed to fetch subjects:", data.message);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchBatches();
    fetchSubjects();
  }, []);

  const handleSend = async () => {
    try {
      const response = await fetch("/api/notifications/staffNotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: notificationType,
          recipient,
          message,
          class: selectedClass,
          subject: selectedSubject,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Notification sent successfully!");
        setIsOpen(false);
        resetForm();
      } else {
        alert(data.error || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("An error occurred while sending the notification");
    }
  };

  const resetForm = () => {
    setRecipient("");
    setMessage("");
    setSelectedClass("");
    setSelectedSubject("");
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".notification-container")) {
        setShowNotificationList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative notification-container">
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={(e) => {
          e.stopPropagation();
          setShowNotificationList(!showNotificationList);
        }}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {showNotificationList && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Notifications</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsOpen(true);
                  setShowNotificationList(false);
                }}
              >
                Send New
              </Button>
            </div>
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${notification.isRead ? "bg-gray-50" : "bg-blue-50"} hover:bg-gray-100 cursor-pointer`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <p className="text-sm">{notification.message}</p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {notification.timestamp}
                  </span>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-center text-gray-500 py-2">No notifications</p>
              )}
            </div>
          </div>
        </div>
      )}

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
                <SelectItem value="class">Batch Notification</SelectItem>
                <SelectItem value="subject">Subject Related</SelectItem>
              </SelectContent>
            </Select>

            {(notificationType === "class" || notificationType === "subject") && (
              <>
                {notificationType === "class" && (
                  <Select
                    onValueChange={setSelectedClass}
                    defaultValue={selectedClass}
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

                {notificationType === "subject" && (
                  <Select
                    onValueChange={setSelectedSubject}
                    defaultValue={selectedSubject}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </>
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
