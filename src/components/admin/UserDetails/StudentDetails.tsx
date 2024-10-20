"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Calendar,
  Phone,
} from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ResultComponent from "@/components/admin/UserDetails/result";
import AchievementComponent from "@/components/admin/UserDetails/achievment";

const StudentDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
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
    return <LoadingSkeleton loadingText="user details" />;
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">User not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Student Details</CardTitle>
          <CardDescription>User's basic details</CardDescription>
        </CardHeader>
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
                <Calendar className="mr-2 h-4 w-4" /> Date of Birth
              </label>
              <p className="text-lg">{user.dateOfBirth || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center mb-2">
                <Phone className="mr-2 h-4 w-4" /> Contact Number
              </label>
              <p className="text-lg">{user.roleDetails.contactNo || "Not provided"}</p>
            </div>
            {/* Other fields like Address, City, State, etc. can be added similarly */}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Additional Information</CardTitle>
          <CardDescription>More details about the student</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium flex items-center mb-2">
                <MapPin className="mr-2 h-4 w-4" /> Address
              </label>
              <p className="text-lg">{user.roleDetails.address || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center mb-2">
                <MapPin className="mr-2 h-4 w-4" /> City
              </label>
              <p className="text-lg">{user.roleDetails.city || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center mb-2">
                <MapPin className="mr-2 h-4 w-4" /> State
              </label>
              <p className="text-lg">{user.roleDetails.state || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium flex items-center mb-2">
                <MapPin className="mr-2 h-4 w-4" /> Pin Code
              </label>
              <p className="text-lg">{user.roleDetails.pinCode || "Not provided"}</p>
            </div>
            {/* Additional fields can be added here */}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Results and Achievements */}
      <Tabs defaultValue="result" className="space-y-6 mt-6">
        <TabsList>
          <TabsTrigger value="result">Results</TabsTrigger>
          <TabsTrigger value="achievement">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="result">
          <ResultComponent results={user.roleDetails.results} />
        </TabsContent>
        <TabsContent value="achievement">
          <AchievementComponent achievements={user.roleDetails.achievements} isEditing={false} handleRoleDetailsChange={function (field: string, value: any): void {
            throw new Error("Function not implemented.");
          } } />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetailsPage;
