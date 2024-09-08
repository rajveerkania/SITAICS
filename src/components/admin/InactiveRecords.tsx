import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingSkeleton from "../LoadingSkeleton";
import AccessDenied from "../accessDenied";
import { toast } from "sonner";
import { Input } from "../ui/input";

interface Record {
  id?: string;
  name?: string;
  email?: string;
  username?: string;
  role?: string;
  course?: string;
  subject?: string;
  batch?: string;
  batchName?: string;
  subjectName?: string;
  courseName?: string;
}

const InactiveRecords = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("admin");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRecords = async () => {
    setRecords([]);
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/getInactiveRecords?category=${selectedOption}`
      );
      const data = await response.json();
      if (response.status !== 200 && response.status !== 403) {
        toast.error(data.message);
      }
      if (response.status === 403) {
        return <AccessDenied />;
      }

      if (data.success) {
        setRecords(data.records);
      } else {
        toast.error("An unexpected error occurred");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setError("Failed to load records. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedOption]);

  if (isLoading) {
    return <LoadingSkeleton loadingText="records" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getFilteredRecords = () => {
    return records.filter((record) => {
      const searchFields = [
        "name",
        "email",
        "batchName",
        "subjectName",
        "courseName",
      ];
      return searchFields.some((field) =>
        record[field as keyof Record]
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });
  };

  const filteredRecords = getFilteredRecords();

  const getTableHeaders = () => {
    switch (selectedOption) {
      case "batch":
        return ["Batch Name"];
      case "subject":
        return ["Subject Name"];
      case "course":
        return ["Course Name"];
      default:
        return ["Name", "Email", "Username"];
    }
  };

  const renderTableCell = (record: Record, header: string) => {
    switch (header) {
      case "Batch Name":
        return record.batchName;
      case "Subject Name":
        return record.subjectName;
      case "Course Name":
        return record.courseName;
      case "Name":
        return record.name;
      case "Email":
        return record.email;
      case "Username":
        return record.username;
      default:
        return "";
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
        <div className="w-full sm:w-auto flex items-center space-x-4">
          <Select
            value={selectedOption}
            onValueChange={(value) => setSelectedOption(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="po">Placement Officers</SelectItem>
              <SelectItem value="course">Courses</SelectItem>
              <SelectItem value="batch">Batches</SelectItem>
              <SelectItem value="subject">Subjects</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {getTableHeaders().map((header, index) => (
                <TableHead key={index}>{header}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <TableRow key={index}>
                  {getTableHeaders().map((header, cellIndex) => (
                    <TableCell key={cellIndex}>
                      {renderTableCell(record, header)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button>Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={getTableHeaders().length + 1}
                  className="text-center"
                >
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InactiveRecords;
