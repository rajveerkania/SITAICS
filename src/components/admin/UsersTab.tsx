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
import { FaRegEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import AddUserForm from "./AddUserForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LoadingSkeleton from "../LoadingSkeleton";
import AccessDenied from "../accessDenied";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UsersTab = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("manage");
  const usersPerPage = 5;

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/fetchUsers");
      const data = await response.json();
      if (response.status === 403) {
        return <AccessDenied />;
      }
      if (response.status !== 200) {
        throw new Error(data.message || "Failed to fetch users");
      }
      setUsers(data.users);
    } catch (error) {
      setError("Failed to load users. Please try again later.");
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/deleteUser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (response.status === 403) {
        return <AccessDenied />;
      }
      if (response.status !== 200) {
        throw new Error(data.message || "Failed to delete user");
      }
      setUsers(users.filter((user) => user.id !== id));
      toast.success(data.message);
    } catch (error) {
      toast.error("Error while deleting user!");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddUserSuccess = async () => {
    await fetchUsers();
  };

  const handleViewDetails = (userId: string) => {
    router.push(`/admin/dashboard/user/${userId}`);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleChangePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
                            <Button onClick={() => handleViewDetails(user.id)}>
                              <FaEye className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={isDeleting}
                            >
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
              <div className="pagination mt-4 flex justify-center items-center space-x-4 mb-4">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => handleChangePage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => handleChangePage(currentPage + 1)}
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
    </>
  );
};

export default UsersTab;
