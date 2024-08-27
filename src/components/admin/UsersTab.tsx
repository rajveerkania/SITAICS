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
  const [activeTab, setActiveTab] = useState("view");
  const usersPerPage = 2;

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/fetchUsers");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        throw new Error(
          data.error || "Failed to fetch users or invalid data structure"
        );
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
      const response = await fetch("/api/deleteUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter((user) => user.id !== id));
        alert("User deleted successfully");
      } else {
        alert(data.error || "An error occurred");
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
    <div>
      <Tabs defaultValue="view" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          <div className="flex space-x-4">
            <TabsTrigger value="view">View Users</TabsTrigger>
            <TabsTrigger value="add">Add User</TabsTrigger>
          </div>
          {activeTab === "view" && (
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by username"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to page 1 on search
                }}
                className="flex-grow sm:flex-grow-0 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-300"
              />
            </div>
          )}
        </TabsList>
        <TabsContent value="view">
          <div className="w-full overflow-auto">
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
            <div className="pagination mt-4 flex justify-center items-center space-x-4">
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
          </div>
        </TabsContent>
        <TabsContent value="add">
          <AddUserForm onAddUserSuccess={handleAddUserSuccess} />
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
