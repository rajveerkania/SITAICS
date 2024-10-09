"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { User, Mail, MapPin, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

interface UserDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  username?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roleDetails: {
    // Student specific fields
    enrollmentNumber?: string;
    courseName?: string;
    batchName?: string;
    // Staff specific fields
    employeeId?: string;
    department?: string;
    // Common fields
    contactNo?: string;
    address?: string;
    city?: string;
    state?: string;
    pinCode?: string;
  };
}

const UserEditPage = () => {
  const { id } = useParams();
  const router = useRouter();
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
      toast.success("User updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (editedUser) {
      setEditedUser(prevState => ({
        ...prevState!,
        [field]: value,
      }));
    }
  };

  const handleRoleDetailsChange = (field: string, value: any) => {
    if (editedUser) {
      setEditedUser(prevState => ({
        ...prevState!,
        roleDetails: {
          ...prevState!.roleDetails,
          [field]: value,
        },
      }));
    }
  };

  const handleBackClick = () => {
    router.push('/admin/dashboard');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !editedUser) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        onClick={handleBackClick}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
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
          <CardDescription>User's basic details and contact information</CardDescription>
        </CardHeader>

        {basicInfoExpanded && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
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
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center mb-2">
                    <MapPin className="mr-2 h-4 w-4" /> Address
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editedUser.roleDetails.address || ''}
                        onChange={(e) => handleRoleDetailsChange('address', e.target.value)}
                        placeholder="Address"
                        className="w-full"
                      />
                      <Input
                        value={editedUser.roleDetails.city || ''}
                        onChange={(e) => handleRoleDetailsChange('city', e.target.value)}
                        placeholder="City"
                        className="w-full"
                      />
                      <Input
                        value={editedUser.roleDetails.state || ''}
                        onChange={(e) => handleRoleDetailsChange('state', e.target.value)}
                        placeholder="State"
                        className="w-full"
                      />
                      <Input
                        value={editedUser.roleDetails.pinCode || ''}
                        onChange={(e) => handleRoleDetailsChange('pinCode', e.target.value)}
                        placeholder="PIN Code"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg">{user.roleDetails.address || 'Not provided'}</p>
                      <p className="text-lg">{user.roleDetails.city && user.roleDetails.state ? `${user.roleDetails.city}, ${user.roleDetails.state}` : ''}</p>
                      <p className="text-lg">{user.roleDetails.pinCode || ''}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        )}

        {basicInfoExpanded && (
          <CardFooter className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedUser(user);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Details
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      <Card className="mb-6">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => setAdditionalInfoExpanded(!additionalInfoExpanded)}
        >
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Additional Information</CardTitle>
            {additionalInfoExpanded ? <ChevronUp /> : <ChevronDown />}
          </div>
          <CardDescription>Role-specific details and information</CardDescription>
        </CardHeader>

        {additionalInfoExpanded && (
          <CardContent>
            <Tabs defaultValue="details" className="space-y-6">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                {user.role === 'Student' && (
                  <TabsTrigger value="academic">Academic Info</TabsTrigger>
                )}
                {user.role === 'Staff' && (
                  <TabsTrigger value="employment">Employment Info</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <p className="text-lg">{user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Contact Number</label>
                    {isEditing ? (
                      <Input
                        value={editedUser.roleDetails.contactNo || ''}
                        onChange={(e) => handleRoleDetailsChange('contactNo', e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-lg">{user.roleDetails.contactNo || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {user.role === 'Student' && (
                <TabsContent value="academic">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium">Enrollment Number</label>
                      <p className="text-lg">{user.roleDetails.enrollmentNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Course</label>
                      <p className="text-lg">{user.roleDetails.courseName || 'Not assigned'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Batch</label>
                      <p className="text-lg">{user.roleDetails.batchName || 'Not assigned'}</p>
                    </div>
                  </div>
                </TabsContent>
              )}

              {user.role === 'Staff' && (
                <TabsContent value="employment">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium">Employee ID</label>
                      <p className="text-lg">{user.roleDetails.employeeId || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Department</label>
                      <p className="text-lg">{user.roleDetails.department || 'Not assigned'}</p>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default UserEditPage;