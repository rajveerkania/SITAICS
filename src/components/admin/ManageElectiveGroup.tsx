import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { FaTrashAlt } from "react-icons/fa";

interface ElectiveGroup {
  electiveGroupId: string;
  groupName: string;
  courseName: string;
  semester: number;
}

const ManageElectiveGroup = () => {
  const [electiveGroups, setElectiveGroups] = useState<ElectiveGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchElectiveGroups = async () => {
    try {
      const response = await fetch("/api/fetchElectiveGroups");

      if (!response.ok) {
        throw new Error("Failed to fetch elective groups");
      }

      const data = await response.json();

      if (Array.isArray(data.groups)) {
        setElectiveGroups(data.groups);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error: any) {
      setError(error.message);
      toast.error("Error fetching elective groups: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async (electiveGroupId: string) => {
    try {
      const response = await fetch(
        `/api/deleteElectiveGroup?electiveGroupId=${electiveGroupId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ electiveGroupId }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete elective group");
      }

      setElectiveGroups((prevGroups) =>
        prevGroups.filter((group) => group.electiveGroupId !== electiveGroupId)
      );

      toast.success("Elective group deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Error deleting elective group");
    }
  };

  useEffect(() => {
    fetchElectiveGroups();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!Array.isArray(electiveGroups) || electiveGroups.length === 0) {
    return <div>No elective groups found</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Group Name</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Semester</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {electiveGroups.map((group) => (
          <TableRow key={group.electiveGroupId}>
            <TableCell>{group.groupName}</TableCell>
            <TableCell>{group.courseName}</TableCell>
            <TableCell>{group.semester}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteGroup(group.electiveGroupId)}
                  style={{ backgroundColor: "black", color: "white" }}
                  className="flex items-center"
                >
                  <FaTrashAlt className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ManageElectiveGroup;
