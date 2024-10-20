 "use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import usePreviousRoute from '@/app/hooks/usePreviousRoute';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { 
  User, 
  Mail, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft, 
  Calendar, 
  Users, 
  Award,
  Phone,
  Book,
  GraduationCap,
  Briefcase,
  Users2
} from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ResultComponent from '@/components/admin/UserDetails/result';
import AchievementComponent from '@/components/admin/UserDetails/achievment';
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
            <CardDescription>Role-specific details and information</CardDescription>
          </CardHeader>

          {additionalInfoExpanded && (
            <CardContent>
              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="personal">Personal Details</TabsTrigger>
                  {(user.role === 'Student' || editedUser.role === 'Student') && (
                    <>
                      <TabsTrigger value="result">Results</TabsTrigger>
                      <TabsTrigger value="achievement">Achievements</TabsTrigger>
                    </>
                  )}
                  {(user.role === 'Staff' || editedUser.role === 'Staff') && 
                    <TabsTrigger value="achievement">Achievements</TabsTrigger>
                  }
                </TabsList>

                <TabsContent value="personal">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <Calendar className="mr-2 h-4 w-4" /> Date of Birth
                      </label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editedUser.roleDetails.dateOfBirth?.split('T')[0] || ''}
                          onChange={(e) => handleRoleDetailsChange('dateOfBirth', e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        <p className="text-lg">
                          {editedUser.roleDetails.dateOfBirth 
                            ? new Date(editedUser.roleDetails.dateOfBirth).toLocaleDateString()
                            : 'Not provided'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <Users className="mr-2 h-4 w-4" /> Gender
                      </label>
                      {isEditing ? (
                        <Select 
                          value={editedUser.roleDetails.gender || ''} 
                          onValueChange={(value) => handleRoleDetailsChange('gender', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-lg">
                          {editedUser.roleDetails.gender 
                            ? editedUser.roleDetails.gender.charAt(0).toUpperCase() + 
                              editedUser.roleDetails.gender.slice(1)
                            : 'Not provided'}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium flex items-center mb-2">
                        <MapPin className="mr-2 h-4 w-4" /> Address
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedUser.roleDetails.contactNumber || ''}
                          onChange={(e) => handleRoleDetailsChange('contactNumber', e.target.value)}
                          className="w-full"
                          placeholder="Enter contact number"
                        />
                      ) : (
                        <p className="text-lg">{user.roleDetails.contactNumber || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <User className="mr-2 h-4 w-4" /> Address
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedUser.roleDetails.address || ''}
                          onChange={(e) => handleRoleDetailsChange('address', e.target.value)}
                          className="w-full"
                          placeholder="Enter address"
                        />
                      ) : (
                        <p className="text-lg">{user.roleDetails.address || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <User className="mr-2 h-4 w-4" /> City
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedUser.roleDetails.city || ''}
                          onChange={(e) => handleRoleDetailsChange('city', e.target.value)}
                          className="w-full"
                          placeholder="Enter city"
                        />
                      ) : (
                        <p className="text-lg">{user.roleDetails.city || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <User className="mr-2 h-4 w-4" /> State
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedUser.roleDetails.state || ''}
                          onChange={(e) => handleRoleDetailsChange('state', e.target.value)}
                          className="w-full"
                          placeholder="Enter state"
                        />
                      ) : (
                        <p className="text-lg">{user.roleDetails.state || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <User className="mr-2 h-4 w-4" /> Pin Code
                      </label>
                      {isEditing ? (<Input
                          value={editedUser.roleDetails.pinCode || ''}
                          onChange={(e) => handleRoleDetailsChange('pinCode', e.target.value)}
                          className="w-full"
                          placeholder="Enter pin code"
                        />
                      ) : (
                        <div>
                          <p className="text-lg">{user.roleDetails.address || 'Not provided'}</p>
                          <p className="text-lg">
                            {user.roleDetails.city && user.roleDetails.state 
                              ? `${user.roleDetails.city}, ${user.roleDetails.state}` 
                              : ''}
                            {user.roleDetails.pinCode ? ` - ${user.roleDetails.pinCode}` : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {(user.role === 'Student' || editedUser.role === 'Student') && (
                  <>
                    <TabsContent value="result">
                      <ResultComponent 
                        results={user.roleDetails.results} 
                        isEditing={isEditing}
                        onResultsChange={(updatedResults: any) => 
                          handleRoleDetailsChange('results', updatedResults)
                        }
                      />
                    </TabsContent>
                    <TabsContent value="achievement">
                      <AchievementComponent 
                        achievements={user.roleDetails.achievements} 
                        isEditing={isEditing}
                        handleRoleDetailsChange={(field, value) => 
                          handleRoleDetailsChange('achievements', value)
                        }
                      />
                    </TabsContent>
                  </>
                )}

                {(user.role === 'Staff' || editedUser.role === 'Staff') && (
                  <TabsContent value="achievement">
                    <AchievementComponent 
                      achievements={user.roleDetails.achievements} 
                      isEditing={isEditing}
                      handleRoleDetailsChange={(field, value) => 
                        handleRoleDetailsChange('achievements', value)
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
            <Button variant="outline" onClick={() => {
              setEditedUser(user);
              setIsEditing(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            Edit User
          </Button>
        )}
      </CardFooter>
    </div>
  );
};

export default UserEditPage;