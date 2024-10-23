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
import { Eye, EyeOff } from "lucide-react";
import ImportButton from "@/components/ImportButton";
import { toast } from "sonner";
import AccessDenied from "../accessDenied";

interface CSVData {
  [key: string]: string;
}

const AddUserForm = ({
  onAddUserSuccess,
}: {
  onAddUserSuccess: () => void;
}) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [csvData, setCSVData] = useState<CSVData[]>([]);

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const result = parseCSV(text);
      setCSVData(result);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const parseCSV = (text: string): CSVData[] => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());

    return lines.slice(1).map((line) => {
      const values = line.split(",").map((value) => value.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || "";
        return obj;
      }, {} as CSVData);
    });
  };

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
      if (response.status !== 200 && response.status !== 403) {
        toast.error(data.message);
      }
      if (response.status === 403) {
        return <AccessDenied />;
      }
      if (data.success) {
        toast.success("User added successfully");
        onAddUserSuccess();
        setUsername("");
        setName("");
        setEmail("");
        setRole("");
        setPassword("");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
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
          <SelectItem value="Staff">Staff</SelectItem>
          <SelectItem value="PO">Placement Officer</SelectItem>
          <SelectItem value="Admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      <div className="relative">
        <Input
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pr-10"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      <div className="flex justify-between pt-5">
        <Button type="submit">Create User</Button>
        <ImportButton
          type="button"
          onFileUpload={handleFileUpload}
          fileCategory="importUsers"
          onSuccess={onAddUserSuccess}
          buttonText="Import CSV"
        />
      </div>
    </form>
  );
};

export default AddUserForm;
