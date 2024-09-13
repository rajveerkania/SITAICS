"use client";

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
import LoadingSkeleton from "../LoadingSkeleton";
import AccessDenied from "../accessDenied";
import { toast } from "sonner";
import { Input } from "../ui/input";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("manage");
  const usersPerPage = 10;

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/fetchUsers");
      const data = await response.json();
      if (response.status !== 200 && response.status !== 403) {
      }
      if (response.status === 403) {
        return <AccessDenied />;
      }

      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        toast.error("An unexpected error occurred");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setError("Failed to load users. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/deleteUser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (response.status != 200 && response.status !== 403) {
        toast.error(data.message);
      }
      if (response.status === 403) {
        return <AccessDenied />;
      }
      if (data.success) {
        setUsers(users.filter((user) => user.id !== id));
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user");
    }
  };

  const handleAddUserSuccess = async () => {
    await fetchUsers();
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  if (isLoading) {
    return <LoadingSkeleton loadingText="users" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Tabs
        defaultValue="manage"
        onValueChange={(value) => setActiveTab(value)}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="manage">Manage Users</TabsTrigger>
            <TabsTrigger value="create">Create User</TabsTrigger>
          </TabsList>
          {activeTab === "manage" && (
            <Input
              className="w-full sm:w-auto sm:ml-auto"
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          )}
        </div>

        <TabsContent value="manage">
          <div className="w-full overflow-auto">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button onClick={() => setShowUserDetails(true)}>
                              <FaRegEdit className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => handleDeleteUser(user.id)}>
                              <FaTrashAlt className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length > usersPerPage && (
              <div className="pagination mt-4 flex justify-center items-center space-x-4 mb-">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="pagination-button"
                >
                  Previous
                </Button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="pagination-button"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="create">
          <AddUserForm onAddUserSuccess={handleAddUserSuccess} />
        </TabsContent>
      </Tabs>
      <UserDetailsDialog
        open={showUserDetails}
        onOpenChange={setShowUserDetails}
        userId={""}
      />
    </>
  );
};

export default UsersTab;
