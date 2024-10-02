"use client"
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import UserDetails from "@/components/admin/UserDetails/userdetails";
import Result from "@/components/admin/UserDetails/result";
import Achievement from "@/components/admin/UserDetails/achievment";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import AccessDenied from "@/components/accessDenied";
import { Button } from "@/components/ui/button";  

interface PageProps {
  params: {
    id: string;
  };
}

const UserTabContent = ({ params }: PageProps) => {
  const [activeTab, setActiveTab] = useState("userdetails");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/fetchUserDetails?userId=${params.id}`);
        const data = await response.json();
        if (response.status !== 200) {
          toast.error("Error while fetching user data");
        } else {
          setUserInfo(data.user);
        }
      } catch (error) {
        setError("Error while fetching user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [params.id]);

  if (loading) return <LoadingSkeleton loadingText="User Data" />;
  if (error) return <AccessDenied />;

  const handleBackToDashboard = () => {
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <div className="container mx-auto mt-8 px-4">
        <h1 className="text-center text-2xl font-semibold mb-6">Student Details</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          <TabsList className="flex flex-wrap gap-4 mb-8 p-4 bg-white text-black rounded-lg shadow-md">
            <TabsTrigger
              value="userdetails"
              className={`text-center px-4 py-2 rounded-md font-medium text-sm ${activeTab === "userdetails" ? "bg-gray-900 text-white shadow-md" : "bg-gray-200 text-black hover:bg-gray-300"}`}
              onClick={() => setActiveTab("userdetails")}
            >
              User Details
            </TabsTrigger>
            <TabsTrigger
              value="result"
              className={`text-center px-4 py-2 rounded-md font-medium text-sm ${activeTab === "result" ? "bg-gray-900 text-white shadow-md" : "bg-gray-200 text-black hover:bg-gray-300"}`}
              onClick={() => setActiveTab("result")}
            >
              Result
            </TabsTrigger>
            <TabsTrigger
              value="achievement"
              className={`text-center px-4 py-2 rounded-md font-medium text-sm ${activeTab === "achievement" ? "bg-gray-900 text-white shadow-md" : "bg-gray-200 text-black hover:bg-gray-300"}`}
              onClick={() => setActiveTab("achievement")}
            >
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="userdetails">
            <Card>
              <UserDetails
                user={userInfo || {
                  id: "",
                  name: "",
                  email: "",
                  role: "",
                  fatherName: undefined,
                  motherName: undefined,
                  enrollmentNumber: undefined,
                  courseName: undefined,
                  batchName: undefined,
                  dateOfBirth: undefined,
                  gender: undefined,
                  contactNo: undefined,
                  address: undefined,
                  city: undefined,
                  state: undefined,
                  pinCode: undefined
                }} onSave={function (updatedUser: { id: string; name: string; email: string; role: string; fatherName?: string; motherName?: string; enrollmentNumber?: string; courseName?: string; batchName?: string; dateOfBirth?: string; gender?: string; contactNo?: string; address?: string; city?: string; state?: string; pinCode?: string; bloodGroup?: string; }): void {
                  throw new Error("Function not implemented.");
                } }              />
            </Card>
          </TabsContent>

          <TabsContent value="result">
            <Result />
          </TabsContent>

          <TabsContent value="achievement">
            <Achievement />
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center">
          <Button onClick={handleBackToDashboard} variant="secondary">Back to Dashboard</Button>
        </div>
      </div>
    </div>
  );
};

export default UserTabContent;
