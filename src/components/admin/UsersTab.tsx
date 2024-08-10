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
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import AddUserForm from "./AddUserForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { UserDetailsDialog } from "./UserDetailsDialog";

const UsersTab = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const handleDeleteUser = async (username: string) => {
    try {
      const response = await fetch("/api/deleteUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.filter((user) => user.username !== username)); // Decrement by removing the user
        alert("User deleted successfully");
      } else {
        alert(data.error || "An error occurred");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/fetchUsers");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        console.error("Failed to fetch users:", data.error);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [setUsers]);

  return (
    <div>
      <Tabs defaultValue="view">
        <TabsList>
          <TabsTrigger value="view">View Users</TabsTrigger>
          <TabsTrigger value="add">Add User</TabsTrigger>
        </TabsList>
        <TabsContent value="view">
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button onClick={() => setShowUserDetails(true)}>
                          <FaRegEdit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDeleteUser(user.username)}>
                          <FaTrashAlt className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="add">
          <AddUserForm setUsers={setUsers} />
        </TabsContent>
      </Tabs>
      <UserDetailsDialog
        open={showUserDetails}
        onOpenChange={setShowUserDetails}
      />
    </div>
  );
};

export default UsersTab;
