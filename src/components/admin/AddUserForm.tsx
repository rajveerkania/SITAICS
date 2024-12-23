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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const validationErrors: { [key: string]: string } = {};

    if (!username) {
      validationErrors.username = "Username is required.";
    }

    if (!name) {
      validationErrors.name = "Full name is required.";
    }

    if (!email) {
      validationErrors.email = "Email is required.";
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@(student\.rru\.ac\.in|rru\.ac\.in)$/;
      if (!emailRegex.test(email)) {
        validationErrors.email =
          "Email must belong to student.rru.ac.in or rru.ac.in domains.";
      }
    }

    if (!role) {
      validationErrors.role = "Role selection is required.";
    }

    if (!password) {
      validationErrors.password = "Password is required.";
    }

    return validationErrors;
  };

  const handleEmailChange = (emailValue: string) => {
    setEmail(emailValue);

    // Automatically set the role based on email domain
    if (emailValue.endsWith("@student.rru.ac.in")) {
      setRole("Student");
    } else {
      setRole("");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const result = parseCSV(text);

      // Validate CSV emails and auto-set role for students
      const validatedData = result.map((row) => {
        if (row.email?.endsWith("@student.rru.ac.in")) {
          row.role = "Student";
        }
        return row;
      });

      const invalidEmails = validatedData.filter(
        (row) =>
          !/^[a-zA-Z0-9._%+-]+@(student\.rru\.ac\.in|rru\.ac\.in)$/.test(
            row.email
          )
      );

      if (invalidEmails.length > 0) {
        toast.error(
          `CSV contains invalid emails: ${invalidEmails
            .map((row) => row.email)
            .join(", ")}`
        );
        return;
      }

      setCSVData(validatedData);
      toast.success("CSV data imported successfully.");
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

  return (
    <form className="space-y-4 mt-4" onSubmit={handleAddUser}>
      <div>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`${errors.username ? "border-red-500" : ""}`}
        />
        {errors.username && (
          <span className="text-red-500 text-sm">{errors.username}</span>
        )}
      </div>
      <div>
        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${errors.name ? "border-red-500" : ""}`}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name}</span>
        )}
      </div>
      <div>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          className={`${errors.email ? "border-red-500" : ""}`}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email}</span>
        )}
      </div>
      <div>
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
        {errors.role && (
          <span className="text-red-500 text-sm">{errors.role}</span>
        )}
      </div>
      <div className="relative">
        <Input
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${errors.password ? "border-red-500" : ""} pr-10`}
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
        {errors.password && (
          <span className="text-red-500 text-sm">{errors.password}</span>
        )}
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
