"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    fatherName?: string;
    motherName?: string;
    dateOfBirth?: string;
    gender?: string;
    bloodGroup?: string;
    achievements?: string;
    electiveSubjects?: Array<{
      groupName: string;
      subjectName: string;
      subjectCode: string;
    }>;
    // Staff specific fields
    employeeId?: string;
    department?: string;
    subjects?: Array<{
      subjectName: string;
      subjectCode: string;
      semester: number;
    }>;
    isBatchCoordinator?: boolean;
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

  const handleBackClick = () => {
    router.push('/admin/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || !editedUser) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">User not found</h2>
          <Button 
            variant="outline" 
            onClick={handleBackClick}
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
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

      {/* Basic Information Card */}
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
                  <Phone className="mr-2 h-4 w-4" /> Contact Number
                </label>
                {isEditing ? (
                  <Input
                    value={editedUser.roleDetails.contactNo || ''}
                    onChange={(e) => handleRoleDetailsChange('contactNo', e.target.value)}
                    className="w-full"
                    placeholder="Enter contact number"
                  />
                ) : (
                  <p className="text-lg">{user.roleDetails.contactNo || 'Not provided'}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium flex items-center mb-2">
                  <MapPin className="mr-2 h-4 w-4" /> Address
                </label>
                {isEditing ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editedUser.roleDetails.address || ''}
                      onChange={(e) => handleRoleDetailsChange('address', e.target.value)}
                      placeholder="Enter address"
                      className="w-full"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        value={editedUser.roleDetails.city || ''}
                        onChange={(e) => handleRoleDetailsChange('city', e.target.value)}
                        placeholder="City"
                      />
                      <Input
                        value={editedUser.roleDetails.state || ''}
                        onChange={(e) => handleRoleDetailsChange('state', e.target.value)}
                        placeholder="State"
                      />
                      <Input
                        value={editedUser.roleDetails.pinCode || ''}
                        onChange={(e) => handleRoleDetailsChange('pinCode', e.target.value)}
                        placeholder="PIN Code"
                        type="number"
                      />
                    </div>
                  </div>
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
          </CardContent>
        )}
      </Card>

      {/* Additional Information Card */}
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
                {user.role === 'Student' && (
                  <>
                    <TabsTrigger value="academic">Academic Info</TabsTrigger>
                    <TabsTrigger value="family">Family Info</TabsTrigger>
                  </>
                )}
                {user.role === 'Staff' && (
                  <TabsTrigger value="professional">Professional Info</TabsTrigger>
                )}
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
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
                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Users2 className="mr-2 h-4 w-4" /> Blood Group
                    </label>
                    {isEditing ? (
                      <Select 
                        value={editedUser.roleDetails.bloodGroup || ''} 
                        onValueChange={(value) => handleRoleDetailsChange('bloodGroup', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                            <SelectItem key={group} value={group}>{group}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-lg">{editedUser.roleDetails.bloodGroup || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {user.role === 'Student' && (
                <>
                  <TabsContent value="academic">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium flex items-center mb-2">
                          <Book className="mr-2 h-4 w-4" /> Enrollment Number
                        </label>
                        <p className="text-lg">{user.roleDetails.enrollmentNumber || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium flex items-center mb">
                          
                        </label>
                        <div>
                        <label className="text-sm font-medium flex items-center mb-2">
                          <GraduationCap className="mr-2 h-4 w-4" /> Course
                        </label>
                        <p className="text-lg">{user.roleDetails.courseName || 'Not assigned'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium flex items-center mb-2">
                          <Users className="mr-2 h-4 w-4" /> Batch
                        </label>
                        <p className="text-lg">{user.roleDetails.batchName || 'Not assigned'}</p>
                      </div>
                      {user.roleDetails.electiveSubjects && user.roleDetails.electiveSubjects.length > 0 && (
                        <div className="col-span-2">
                          <label className="text-sm font-medium flex items-center mb-2">
                            <Book className="mr-2 h-4 w-4" /> Elective Subjects
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {user.roleDetails.electiveSubjects.map((subject, index) => (
                              <div key={index} className="p-4 border rounded-md bg-gray-50">
                                <p className="font-medium text-primary">{subject.groupName}</p>
                                <p>{subject.subjectName}</p>
                                <p className="text-sm text-gray-600">Code: {subject.subjectCode}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="family">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium flex items-center mb-2">
                          <Users2 className="mr-2 h-4 w-4" /> Father's Name
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedUser.roleDetails.fatherName || ''}
                            onChange={(e) => handleRoleDetailsChange('fatherName', e.target.value)}
                            className="w-full"
                            placeholder="Enter father's name"
                          />
                        ) : (
                          <p className="text-lg">{user.roleDetails.fatherName || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium flex items-center mb-2">
                          <Users2 className="mr-2 h-4 w-4" /> Mother's Name
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedUser.roleDetails.motherName || ''}
                            onChange={(e) => handleRoleDetailsChange('motherName', e.target.value)}
                            className="w-full"
                            placeholder="Enter mother's name"
                          />
                        ) : (
                          <p className="text-lg">{user.roleDetails.motherName || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </>
              )}

              {user.role === 'Staff' && (
                <TabsContent value="professional">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <Briefcase className="mr-2 h-4 w-4" /> Department
                      </label>
                      <p className="text-lg">{user.roleDetails.department || 'Not assigned'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium flex items-center mb-2">
                        <Users className="mr-2 h-4 w-4" /> Batch Coordinator
                      </label>
                      <p className="text-lg">
                        {user.roleDetails.isBatchCoordinator ? 'Yes' : 'No'}
                      </p>
                    </div>
                    {user.roleDetails.subjects && user.roleDetails.subjects.length > 0 && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium flex items-center mb-2">
                          <Book className="mr-2 h-4 w-4" /> Subjects Taught
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          {user.roleDetails.subjects.map((subject, index) => (
                            <div key={index} className="p-4 border rounded-md bg-gray-50">
                              <p className="font-medium text-primary">{subject.subjectName}</p>
                              <p className="text-sm text-gray-600">Code: {subject.subjectCode}</p>
                              <p className="text-sm text-gray-600">Semester: {subject.semester}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}

              <TabsContent value="achievements">
                <div className="space-y-4">
                  <label className="text-sm font-medium flex items-center mb-2">
                    <Award className="mr-2 h-4 w-4" /> Achievements
                  </label>
                  {isEditing ? (
                    <Textarea
                      value={editedUser.roleDetails.achievements || ''}
                      onChange={(e) => handleRoleDetailsChange('achievements', e.target.value)}
                      placeholder="Enter achievements"
                      className="w-full min-h-[200px]"
                    />
                  ) : (
                    <div className="prose max-w-none">
                      {user.roleDetails.achievements ? (
                        <p className="text-lg whitespace-pre-line">{user.roleDetails.achievements}</p>
                      ) : (
                        <p className="text-lg text-gray-500">No achievements recorded</p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        )}

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
      </Card>
    </div>
  );
};

export default UserEditPage;