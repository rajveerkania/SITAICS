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

interface RoleDetails {
  enrollmentNumber?: string;
  courseName?: string;
  batchName?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: number;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  achievements?: any; // Updated to allow any type
}

interface UserDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  roleDetails: RoleDetails;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: number;
}

const UserEditPage: React.FC = () => {
  const { id } = useParams();
  const { handleBack } = usePreviousRoute();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [basicInfoExpanded, setBasicInfoExpanded] = useState(true);
  const [additionalInfoExpanded, setAdditionalInfoExpanded] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/usersStaff/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
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

  if (isLoading) {
    return <LoadingSkeleton loadingText='user details' />;
  }

  if (!user) {
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

      {/* Basic Info Card */}
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
                <p className="text-lg">{user.name}</p>
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
                <p className="text-lg">{user.role}</p>
              </div>

              {user.role === 'Student' && (
                <>
                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Users className="mr-2 h-4 w-4" /> Enrollment Number
                    </label>
                    <p className="text-lg">{user.roleDetails.enrollmentNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Users className="mr-2 h-4 w-4" /> Course Name
                    </label>
                    <p className="text-lg">{user.roleDetails.courseName || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Users className="mr-2 h-4 w-4" /> Batch Name
                    </label>
                    <p className="text-lg">{user.roleDetails.batchName || 'Not provided'}</p>
                  </div>

                  {/* Additional student details */}
                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Users className="mr-2 h-4 w-4" /> Date of Birth
                    </label>
                    <p className="text-lg">{user.roleDetails.dateOfBirth ? new Date(user.roleDetails.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Users className="mr-2 h-4 w-4" /> Gender
                    </label>
                    <p className="text-lg">{user.roleDetails.gender || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center mb-2">
                      <Users className="mr-2 h-4 w-4" /> Blood Group
                    </label>
                    <p className="text-lg">{user.roleDetails.bloodGroup || 'Not provided'}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Address Card */}
      {user.role === 'Student' && user.roleDetails.address && (
        <Card className="mb-6">
          <CardHeader 
            className="cursor-pointer" 
            onClick={() => setAdditionalInfoExpanded(!additionalInfoExpanded)}
          >
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Address</CardTitle>
              {additionalInfoExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>
            <CardDescription>Student's address details</CardDescription>
          </CardHeader>

          {additionalInfoExpanded && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium flex items-center mb-2">
                    <MapPin className="mr-2 h-4 w-4" /> Address
                  </label>
                  <p className="text-lg">{user.roleDetails.address || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center mb-2">
                    <MapPin className="mr-2 h-4 w-4" /> City
                  </label>
                  <p className="text-lg">{user.roleDetails.city || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center mb-2">
                    <MapPin className="mr-2 h-4 w-4" /> State
                  </label>
                  <p className="text-lg">{user.roleDetails.state || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center mb-2">
                    <MapPin className="mr-2 h-4 w-4" /> Pin Code
                  </label>
                  <p className="text-lg">{user.roleDetails.pinCode || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Achievements Card */}
      {user.role === 'Student' && user.roleDetails.achievements && (
        <Card className="mb-6"> 
          <CardHeader 
            className="cursor-pointer" 
            onClick={() => setAdditionalInfoExpanded(!additionalInfoExpanded)}
          >
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Achievements</CardTitle>
              {additionalInfoExpanded ? <ChevronUp /> : <ChevronDown />}
            </div>
            <CardDescription>Student's achievements</CardDescription>
          {/* Result section */}
          {Array.isArray(user.roleDetails.achievements) && (
            <div className="mt-4 text-lg font-semibold">
              Total Achievements: {user.roleDetails.achievements.length}
            </div>
            )}
          </CardHeader>

          {additionalInfoExpanded && (
            <CardContent>
              <p className="text-lg">
                {/* If achievements is an array, we render each item */}
                {Array.isArray(user.roleDetails.achievements) ? (
                  user.roleDetails.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="border p-4 rounded shadow-md flex justify-between items-center"
                    >
                      <div>
                        <h3 className="text-xl font-semibold">
                          {achievement.title}
                        </h3>
                        <p className="text-gray-600">
                          {achievement.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          Date: {achievement.date} | Category:{" "}
                          {achievement.category}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Otherwise, we display it directly as a string
                  user.roleDetails.achievements
                )}
              </p>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export default UserEditPage;
