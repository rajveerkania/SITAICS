"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import usePreviousRoute from "@/app/hooks/usePreviousRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  User,
  Mail,
  Users,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Phone,
} from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ResultComponent from "@/components/admin/UserDetails/result";
import AchievementComponent from "@/components/admin/UserDetails/achievment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserEditPage: React.FC = () => {
  const { id } = useParams();
  const { handleBack } = usePreviousRoute();
  const [user, setUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [basicInfoExpanded, setBasicInfoExpanded] = useState(true);
  const [additionalInfoExpanded, setAdditionalInfoExpanded] = useState(true);

  interface UserRoleDetails {
    enrollmentNumber?: string;
    courseName?: string;
    batchName?: string;
    fatherName?: string;
    motherName?: string;
    contactNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    results?: any;
    achievements?: any;
  }

  interface User {
    name: string;
    email: string;
    role: "Student" | "Staff" | "Admin";
    roleDetails: UserRoleDetails;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data);
        setEditedUser(data);
      } catch (error) {
        toast.error("Error fetching user data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleSave = async () => {
    if (!editedUser) return;

    try {
      const response = await fetch(`/api/admin/updateUserDetails/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setEditedUser(updatedUser);
      toast.success("User updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    }
  };

  const handleInputChange = (field: keyof User, value: any) => {
    if (editedUser) {
      setEditedUser((prevState) => ({
        ...prevState!,
        [field]: value,
      }));
    }
  };

  const handleRoleDetailsChange = (
    field: keyof UserRoleDetails,
    value: any
  ) => {
    if (editedUser) {
      setEditedUser((prevState) => ({
        ...prevState!,
        roleDetails: {
          ...prevState!.roleDetails,
          [field]: value,
        },
      }));
    }
  };

  if (isLoading) {
    return <LoadingSkeleton loadingText="user details" />;
  }

  if (!user || !editedUser) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">User not found</h2>
          <Button variant="outline" onClick={handleBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" onClick={handleBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="mb-6">
        <CardHeader
          className="cursor-pointer"
          onClick={() => setBasicInfoExpanded(!basicInfoExpanded)}
        >
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Basic Information</CardTitle>
            {basicInfoExpanded ? <ChevronUp /> : <ChevronDown />}
          </div>
          <CardDescription>User's basic details</CardDescription>
        </CardHeader>

        {basicInfoExpanded && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <User className="mr-2 h-4 w-4" /> Name
                </label>
                {isEditing ? (
                  <Input
                    value={editedUser.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p className="text-lg">{user.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <Mail className="mr-2 h-4 w-4" /> Email
                </label>
                {isEditing ? (
                  <Input
                    value={editedUser.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p className="text-lg">{user.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <Users className="mr-2 h-4 w-4" /> Role
                </label>
                {isEditing ? (
                  <Select
                    value={editedUser.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-lg">{user.role}</p>
                )}
              </div>

              {(user?.role === "Student" || editedUser?.role === "Student") && (
                <div>
                  <label className="text-sm font-medium flex items-center mb-2">
                    <Users className="mr-2 h-4 w-4" /> Enrollment Number
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedUser?.roleDetails?.enrollmentNumber || ""}
                      onChange={(e) =>
                        handleRoleDetailsChange(
                          "enrollmentNumber",
                          e.target.value
                        )
                      }
                      className="w-full"
                      placeholder="Enter enrollment number"
                    />
                  ) : (
                    <p className="text-lg">
                      {user?.roleDetails?.enrollmentNumber || "Not provided"}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {(user.role !== "Admin" || editedUser.role !== "Admin") && (
        <Card className="mb-6">
          <CardHeader
            className="cursor-pointer"
            onClick={() => setAdditionalInfoExpanded(!additionalInfoExpanded)}
          >
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Additional Information</CardTitle>
              {additionalInfoExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>
            <CardDescription>
              Role-specific details and information
            </CardDescription>
          </CardHeader>

          {additionalInfoExpanded && (
            <CardContent>
              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="personal">Personal Details</TabsTrigger>
                  {(user.role === "Student" ||
                    editedUser.role === "Student") && (
                    <>
                      <TabsTrigger value="result">Results</TabsTrigger>
                      <TabsTrigger value="achievement">
                        Achievements
                      </TabsTrigger>
                    </>
                  )}
                  {(user.role === "Staff" || editedUser.role === "Staff") && (
                    <TabsTrigger value="achievement">Achievements</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="personal">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.role !== "Staff" && (
                      <>
                        <div>
                          <label className="text-sm font-medium flex items-center mb-2">
                            <User className="mr-2 h-4 w-4" /> Father's Name
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedUser.roleDetails.fatherName || ""}
                              onChange={(e) =>
                                handleRoleDetailsChange(
                                  "fatherName",
                                  e.target.value
                                )
                              }
                              className="w-full"
                              placeholder="Enter father's name"
                            />
                          ) : (
                            <p className="text-lg">
                              {user.roleDetails.fatherName || "Not provided"}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-medium flex items-center mb-2">
                            <User className="mr-2 h-4 w-4" /> Mother's Name
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedUser.roleDetails.motherName || ""}
                              onChange={(e) =>
                                handleRoleDetailsChange(
                                  "motherName",
                                  e.target.value
                                )
                              }
                              className="w-full"
                              placeholder="Enter mother's name"
                            />
                          ) : (
                            <p className="text-lg">
                              {user.roleDetails.motherName || "Not provided"}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <Phone className="mr-2 h-4 w-4" /> Contact Number
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedUser.roleDetails.contactNumber || ""}
                          onChange={(e) =>
                            handleRoleDetailsChange(
                              "contactNumber",
                              e.target.value
                            )
                          }
                          className="w-full"
                          placeholder="Enter contact number"
                        />
                      ) : (
                        <p className="text-lg">
                          {user.roleDetails.contactNumber || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <User className="mr-2 h-4 w-4" /> Address
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedUser.roleDetails.address || ""}
                          onChange={(e) =>
                            handleRoleDetailsChange("address", e.target.value)
                          }
                          className="w-full"
                          placeholder="Enter address"
                        />
                      ) : (
                        <p className="text-lg">
                          {user.roleDetails.address || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <User className="mr-2 h-4 w-4" /> City
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedUser.roleDetails.city || ""}
                          onChange={(e) =>
                            handleRoleDetailsChange("city", e.target.value)
                          }
                          className="w-full"
                          placeholder="Enter city"
                        />
                      ) : (
                        <p className="text-lg">
                          {user.roleDetails.city || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <User className="mr-2 h-4 w-4" /> State
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedUser.roleDetails.state || ""}
                          onChange={(e) =>
                            handleRoleDetailsChange("state", e.target.value)
                          }
                          className="w-full"
                          placeholder="Enter state"
                        />
                      ) : (
                        <p className="text-lg">
                          {user.roleDetails.state || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <User className="mr-2 h-4 w-4" /> Pin Code
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedUser.roleDetails.pinCode || ""}
                          onChange={(e) =>
                            handleRoleDetailsChange("pinCode", e.target.value)
                          }
                          className="w-full"
                          placeholder="Enter pin code"
                        />
                      ) : (
                        <p className="text-lg">
                          {user.roleDetails.pinCode || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {(user.role === "Student" || editedUser.role === "Student") && (
                  <>
                    <TabsContent value="result">
                      <ResultComponent
                        results={user.roleDetails.results}
                        isEditing={isEditing}
                        onResultsChange={(updatedResults: any) =>
                          handleRoleDetailsChange("results", updatedResults)
                        }
                      />
                    </TabsContent>
                    <TabsContent value="achievement">
                      <AchievementComponent
                        achievements={user.roleDetails.achievements}
                        isEditing={isEditing}
                        handleRoleDetailsChange={(field, value) =>
                          handleRoleDetailsChange("achievements", value)
                        }
                      />
                    </TabsContent>
                  </>
                )}

                {(user.role === "Staff" || editedUser.role === "Staff") && (
                  <TabsContent value="achievement">
                    <AchievementComponent
                      achievements={user.roleDetails.achievements}
                      isEditing={isEditing}
                      handleRoleDetailsChange={(field, value) =>
                        handleRoleDetailsChange("achievements", value)
                      }
                    />
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          )}
        </Card>
      )}

      <div className="flex justify-end gap-4">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setEditedUser(user);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit User</Button>
        )}
      </div>
    </div>
  );
};

export default UserEditPage;
