"use client"
import React, { useState, useEffect } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { Input } from '@/components/ui/input';
import router, { useRouter } from 'next/router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from '@radix-ui/react-switch';

// Custom Label component
const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    {children}
  </label>
);

async function fetchUserDetails(id: string) {
  // Implement your API call here
  // For now, we'll return mock data
  return {
    id,
    email: 'user@example.com',
    name: 'John Doe',
    role: 'Student',
    username: 'johndoe',
    isActive: true,
    studentDetails: {
      enrollmentNumber: 'EN12345',
      courseName: 'Computer Science',
      batchName: 'CS2023',
      dateOfBirth: '1995-05-15',
      gender: 'Male',
      contactNo: '1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      pinCode: 10001,
    },
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  username: string;
  isActive: boolean;
  studentDetails: {
    enrollmentNumber: string;
    courseName: string;
    batchName: string;
    dateOfBirth: string;
    gender: string;
    contactNo: string;
    address: string;
    city: string;
    state: string;
    pinCode: number;
  };
}

export default function UserDetails({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  

  useEffect(() => {
    async function loadUserDetails() {
      const userData = await fetchUserDetails(params.id);
      setUser(userData);
    }
    loadUserDetails();
  }, [params.id]);

  const handleInputChange = (field: keyof User, value: any) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      return { ...prevUser, [field]: value };
    });
  };

  const handleStudentDetailsChange = (field: keyof User['studentDetails'], value: any) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      return {
        ...prevUser,
        studentDetails: { ...prevUser.studentDetails, [field]: value },
      };
    });
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving user:', user);
    alert('Changes saved successfully!');
  };

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="academic">Academic Info</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={user.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                  >
                    <SelectTrigger id="role">
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="PO">PO</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={user.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="academic">
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                  <Input
                    id="enrollmentNumber"
                    value={user.studentDetails.enrollmentNumber}
                    onChange={(e) => handleStudentDetailsChange('enrollmentNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input
                    id="courseName"
                    value={user.studentDetails.courseName}
                    onChange={(e) => handleStudentDetailsChange('courseName', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batchName">Batch Name</Label>
                  <Input
                    id="batchName"
                    value={user.studentDetails.batchName}
                    onChange={(e) => handleStudentDetailsChange('batchName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={user.studentDetails.dateOfBirth}
                    onChange={(e) => handleStudentDetailsChange('dateOfBirth', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={user.studentDetails.gender}
                    onValueChange={(value) => handleStudentDetailsChange('gender', value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNo">Contact Number</Label>
                  <Input
                    id="contactNo"
                    value={user.studentDetails.contactNo}
                    onChange={(e) => handleStudentDetailsChange('contactNo', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={user.studentDetails.address}
                  onChange={(e) => handleStudentDetailsChange('address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={user.studentDetails.city}
                    onChange={(e) => handleStudentDetailsChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={user.studentDetails.state}
                    onChange={(e) => handleStudentDetailsChange('state', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pinCode">Pin Code</Label>
                  <Input
                    id="pinCode"
                    type="number"
                    value={user.studentDetails.pinCode}
                    onChange={(e) => handleStudentDetailsChange('pinCode', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}