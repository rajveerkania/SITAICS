// components/admin/AddUserForm.tsx
"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const AddUserForm = ({
  setUsers,
}: {
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, name, email, password, role }),
      });

      const data = await response.json();

      if (data.success) {
        alert("User added successfully!");
        setUsers((prevUsers) => [...prevUsers, data.user]);
        setUsername("");
        setName("");
        setEmail("");
        setRole("");
        setPassword("");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user");
    }
  };

  return (
    <form className="space-y-4 mt-4" onSubmit={handleAddUser}>
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Student">Student</SelectItem>
          <SelectItem value="FacultyStaff">Assistant Professor</SelectItem>
          <SelectItem value="PlacementOfficer">Placement Officer</SelectItem>
          <SelectItem value="Admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit">Add User</Button>
    </form>
  );
};

export default AddUserForm;
