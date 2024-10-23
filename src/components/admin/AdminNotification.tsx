import React from "react";
import { useState } from "react";
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

export function NotificationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationType, setNotificationType] = useState("specific");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: notificationType, recipient, message }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Notification sent successfully!");
        setIsOpen(false);
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
            onValueChange={setNotificationType}
            defaultValue={notificationType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Notification Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="specific">Specific Student</SelectItem>
              <SelectItem value="circular">General Circular</SelectItem>
            </SelectContent>
          </Select>
          {notificationType === "specific" && (
            <Input
              placeholder="Student Name or ID"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
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
