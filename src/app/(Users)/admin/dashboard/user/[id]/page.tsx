"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { User, Mail, Edit3, ArrowLeft } from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import StudentDetails from "@/components/admin/UserDetails/StudentDetails";
import StaffDetails from "@/components/admin/UserDetails/StaffDetails";
import Achievement from "@/components/admin/UserDetails/Achievement";
interface UserInfo {
  id?: string;
  name: string;
  email: string;
  username: string;
  role?: string;
}
interface StudentInfo extends UserInfo {
  id: string;
  fatherName?: string;
  motherName?: string;
  enrollmentNumber?: string;
  courseName?: string;
  batchName?: string;
  results?: any;
  bloodGroup?: string;
  dateOfBirth?: string;
  gender?: string;
  contactNo?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  achievements?: string[];
  isProfileCompleted?: boolean;
}
interface StaffInfo extends UserInfo {
  id: string;
  email: string;
  contactNumber?: string;
  isBatchCoordinator?: boolean;
  achievements?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  subjects?: any[];
  batchId?: string;
}

const UserTabContent = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<
    UserInfo | StudentInfo | StaffInfo | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "details" | "result" | "achievements"
  >("details");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/fetchUserDetails");
        const data = await response.json();
        if (data.user) {
          setUserInfo(data.user);
          setEditedName(data.user.name);
          setEditedEmail(data.user.email);
        }
      } catch (error) {
        toast.error("Error fetching user data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);
  const handleSave = async () => {
    toast.success("User updated successfully");
    setIsEditing(false);
  };
  const handleBackClick = () => {
    router.push("/admin/dashboard");
  };
  if (isLoading) {
    return <LoadingSkeleton loadingText="user details" />;
  }
  if (!userInfo) {
    return <div>User not found</div>;
  }
  const renderTabs = () => {
    switch (userInfo.role) {
      case "Student":
        return (
          <>
            <Button
              variant={activeTab === "details" ? "default" : "outline"}
              onClick={() => setActiveTab("details")}
            >
              Details
            </Button>
            <Button
              variant={activeTab === "result" ? "default" : "outline"}
              onClick={() => setActiveTab("result")}
            >
              Result
            </Button>
            <Button
              variant={activeTab === "achievements" ? "default" : "outline"}
              onClick={() => setActiveTab("achievements")}
            >
              Achievements
            </Button>
          </>
        );
      case "Staff":
        return (
          <>
            <Button
              variant={activeTab === "details" ? "default" : "outline"}
              onClick={() => setActiveTab("details")}
            >
              Details
            </Button>
            <Button
              variant={activeTab === "achievements" ? "default" : "outline"}
              onClick={() => setActiveTab("achievements")}
            >
              Achievements
            </Button>
          </>
        );
      default:
        return null;
    }
  };
  const renderTabContent = () => {
    switch (userInfo.role) {
      case "Student":
        if (activeTab === "details") {
          return (
            <StudentDetails
              student={userInfo as StudentInfo}
              onSave={handleSave}
            />
          );
        } else if (activeTab === "result") {
          return <div>Result Component</div>;
        } else if (activeTab === "achievements") {
          return <div>Achievement Component</div>;
        }
        break;
      case "Staff":
        if (activeTab === "details") {
          return (
            <StaffDetails staff={userInfo as StaffInfo} onSave={handleSave} />
          );
        } else if (activeTab === "achievements") {
          return (
            <div>
              <Achievement />
            </div>
          );
        }
        break;
      default:
        return null;
    }
  };
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" onClick={handleBackClick} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">User Details</CardTitle>
              <CardDescription>
                {userInfo.role === "Admin"
                  ? "Admin information"
                  : "Manage user information and view related data"}
              </CardDescription>
            </div>
            {!isEditing && userInfo.role !== "Admin" && (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit User
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <User className="mr-2 h-4 w-4" /> Name
                </label>
                {isEditing && userInfo.role !== "Admin" ? (
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p className="text-lg">{userInfo.name}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <Mail className="mr-2 h-4 w-4" /> Email
                </label>
                {isEditing && userInfo.role !== "Admin" ? (
                  <Input
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p className="text-lg">{userInfo.email}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <User className="mr-2 h-4 w-4" /> Role
                </label>
                <p className="text-lg">{userInfo.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium flex items-center mb-2">
                  <User className="mr-2 h-4 w-4" /> Username
                </label>
                <p className="text-lg">{userInfo.username}</p>
              </div>
            </div>
          </div>
        </CardContent>
        {isEditing && userInfo.role !== "Admin" && (
          <CardFooter className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditedName(userInfo.name);
                setEditedEmail(userInfo.email);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardFooter>
        )}
      </Card>
      {userInfo.role !== "Admin" && (
        <>
          <div className="mb-6 flex space-x-4">{renderTabs()}</div>
          <CardContent>{renderTabContent()}</CardContent>
        </>
      )}
    </div>
  );
};
export default UserTabContent;
