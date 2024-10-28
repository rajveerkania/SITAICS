"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import usePreviousRoute from '@/app/hooks/usePreviousRoute';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft, 
  Users 
} from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the UserDetails type
interface RoleDetails {
  enrollmentNumber?: string;
  courseName?: string;
  batchName?: string;
}

interface UserDetails {
  name: string;
  email: string;
  role: string;
  roleDetails: RoleDetails;
  address?: string;
}

const UserEditPage: React.FC = () => {
  const { id } = useParams();
  const { handleBack } = usePreviousRoute();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [editedUser, setEditedUser] = useState<UserDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [basicInfoExpanded, setBasicInfoExpanded] = useState(true);
  const [additionalInfoExpanded, setAdditionalInfoExpanded] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
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

  const handleInputChange = (field: keyof UserDetails, value: any) => {
    if (editedUser) {
      setEditedUser((prevState: UserDetails) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const handleRoleDetailsChange = (field: keyof RoleDetails, value: any) => {
    if (editedUser) {
      setEditedUser((prevState: UserDetails) => ({
        ...prevState,
        roleDetails: {
          ...prevState.roleDetails,
          [field]: value,
        },
      }));
    }
  };

  if (isLoading) {
    return <LoadingSkeleton loadingText='user details' />;
  }

  if (!user || !editedUser) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">User not found</h2>
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        onClick={handleBack}
        className="mb-6"
      >
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
                    onChange={(e) => handleInputChange('name', e.target.value)}
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
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <Users className="mr-2 h-4 w-4" /> Role
                </label>
                {isEditing ? (
                  <Select
                    value={editedUser.role}
                    onValueChange={(value) => handleInputChange('role', value)}
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

              {(user.role === 'Student' || editedUser.role === 'Student') && (
                <>
                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Users className="mr-2 h-4 w-4" /> Enrollment Number
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedUser.roleDetails.enrollmentNumber || ''}
                        onChange={(e) => handleRoleDetailsChange('enrollmentNumber', e.target.value)}
                        className="w-full"
                        placeholder="Enter enrollment number"
                      />
                    ) : (
                      <p className="text-lg">{user.roleDetails.enrollmentNumber || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Users className="mr-2 h-4 w-4" /> Course Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedUser.roleDetails.courseName || ''}
                        onChange={(e) => handleRoleDetailsChange('courseName', e.target.value)}
                        className="w-full"
                        placeholder="Enter course name"
                      />
                    ) : (
                      <p className="text-lg">{user.roleDetails.courseName || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Users className="mr-2 h-4 w-4" /> Batch Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={editedUser.roleDetails.batchName || ''}
                        onChange={(e) => handleRoleDetailsChange('batchName', e.target.value)}
                        className="w-full"
                        placeholder="Enter batch name"
                      />
                    ) : (
                      <p className="text-lg">{user.roleDetails.batchName || 'Not provided'}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {(user.role !== 'Admin' || editedUser.role !== 'Admin') && (
        <Card className="mb-6">
          <CardHeader 
            className="cursor-pointer" 
            onClick={() => setAdditionalInfoExpanded(!additionalInfoExpanded)}
          >
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Additional Information</CardTitle>
              {additionalInfoExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>
            <CardDescription>User's additional details</CardDescription>
          </CardHeader>

          {additionalInfoExpanded && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium flex items-center mb-2">
                    <MapPin className="mr-2 h-4 w-4" /> Address
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedUser.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full"
                      placeholder="Enter address"
                    />
                  ) : (
                    <p className="text-lg">{user.address || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <Card>
        <CardFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserEditPage;
