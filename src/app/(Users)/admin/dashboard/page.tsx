"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from "recharts";
import { Bell, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LogoutButton } from "@/components/LogoutButton";
import Image from "next/image";
import NumberTicker from "@/components/magicui/number-ticker";


interface StatCardProps {
  title: string;
  value: string | number;
}

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data
const studentData = [
  { course: "BTech", students: 120 },
  { course: "MTech CS", students: 25 },
  { course: "MTech AI/ML", students: 20 },
  { course: "MSCDF", students: 30 },
];

const users = [
  {
    id: 1,
    username: "Het Patel",
    email: "21bcscs021@student.rru.ac.in",
    role: "Student",
    batch: "BTech 2021-2025",
  },
  {
    id: 2,
    username: "Vivek Joshi",
    email: "vivek.joshi@rru.ac.in",
    role: "Assistant Professor",
  },
  {
    id: 3,
    username: "Darshan Prajapati",
    email: "darshan.prajapati@rru.ac.in",
    role: "Placement Officer",
  },
];

// NotificationDialog component
const NotificationDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationType, setNotificationType] = useState("specific");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    console.log("Sending notification:", {
      type: notificationType,
      recipient,
      message,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            onValueChange={setNotificationType}
            defaultValue={notificationType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Notification Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="specific">Specific Student</SelectItem>
              <SelectItem value="circular">General Circular</SelectItem>
            </SelectContent>
          </Select>
          {notificationType === "specific" && (
            <Input
              placeholder="Student Name or ID"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          )}
          <Textarea
            placeholder="Notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <Button onClick={handleSend}>Send Notification</Button>
      </DialogContent>
    </Dialog>
  );
};

// StatCard component
const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">
        <NumberTicker value={Number(value)} />
      </p>
    </CardContent>
  </Card>
);

// IndianCalendar component
const IndianCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrevMonth}>&lt;</Button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <Button onClick={handleNextMonth}>&gt;</Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
        {days.map((day) => (
          <div
            key={day}
            className={`text-center p-2 ${
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()
                ? "bg-black text-white rounded-full"
                : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

// AddUserForm component
const AddUserForm = () => {
  return (
    <form className="space-y-4 mt-4">
      <Input placeholder="Username" />
      <Input placeholder="Email" type="email" />
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="student">Student</SelectItem>
          <SelectItem value="assistant_professor">
            Assistant Professor
          </SelectItem>
          <SelectItem value="placement_officer">Placement Officer</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      <Input placeholder="Password" type="password" />
      <Button>Add User</Button>
    </form>
  );
};

// UserDetailsDialog component
const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  open,
  onOpenChange,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>User Details</DialogTitle>
      </DialogHeader>
      <div>
        <p>
          <strong>Username:</strong> john_doe
        </p>
        <p>
          <strong>Email:</strong> john@example.com
        </p>
        <p>
          <strong>Role:</strong> Student
        </p>
        <p>
          <strong>Batch:</strong> BTech 2021-2025
        </p>
      </div>
    </DialogContent>
  </Dialog>
);
// New CourseManagement component
const CourseManagement = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: "BTech", duration: "4 years" },
    { id: 2, name: "MTech CS", duration: "2 years" },
    { id: 3, name: "MTech AI/ML", duration: "2 years" },
    { id: 4, name: "MSCDF", duration: "2 years" },
  ]);
  const [newCourse, setNewCourse] = useState({ name: "", duration: "" });

  const addCourse = () => {
    setCourses([...courses, { id: courses.length + 1, ...newCourse }]);
    setNewCourse({ name: "", duration: "" });
  };

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Course Name"
          value={newCourse.name}
          onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
        />
        <Input
          placeholder="Duration"
          value={newCourse.duration}
          onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
        />
        <Button onClick={addCourse}>Add Course</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// New SubjectManagement component
const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Data Structures", course: "BTech" },
    { id: 2, name: "Machine Learning", course: "MTech AI/ML" },
    { id: 3, name: "Database Management", course: "BTech" },
  ]);
  const [newSubject, setNewSubject] = useState({ name: "", course: "" });

  const addSubject = () => {
    setSubjects([...subjects, { id: subjects.length + 1, ...newSubject }]);
    setNewSubject({ name: "", course: "" });
  };

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Subject Name"
          value={newSubject.name}
          onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
        />
        <Select
          onValueChange={(value) => setNewSubject({ ...newSubject, course: value })}
          value={newSubject.course}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BTech">BTech</SelectItem>
            <SelectItem value="MTech CS">MTech CS</SelectItem>
            <SelectItem value="MTech AI/ML">MTech AI/ML</SelectItem>
            <SelectItem value="MSCDF">MSCDF</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addSubject}>Add Subject</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Course</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell>{subject.name}</TableCell>
              <TableCell>{subject.course}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// New LeaveManagement component
const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: "John Doe", role: "Student", reason: "Medical", status: "Pending" },
    { id: 2, name: "Jane Smith", role: "Staff", reason: "Personal", status: "Pending" },
    { id: 3, name: "Bob Johnson", role: "Student", reason: "Family Event", status: "Pending" },
  ]);

  const updateLeaveStatus = (id: any, newStatus:any) => {
    setLeaveRequests(
      leaveRequests.map((request) =>
        request.id === id ? { ...request, status: newStatus } : request
      )
    );
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.name}</TableCell>
              <TableCell>{request.role}</TableCell>
              <TableCell>{request.reason}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>
                {request.status === "Pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateLeaveStatus(request.id, "Approved")}
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateLeaveStatus(request.id, "Denied")}
                    >
                      <X className="w-4 h-4 mr-1" /> Deny
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};


// Main AdminDashboard component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showUserDetails, setShowUserDetails] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Image
            src="/sitaics.png"
            alt="SITAICS Logo"
            width={90}
            height={90}
            priority
          />
          <div className="flex items-center space-x-4">
            <NotificationDialog />
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-8 px-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="flex flex-wrap justify-start gap-2 mb-8">
            <TabsTrigger
              value="overview"
              className="flex-grow basis-1/3 sm:basis-auto"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex-grow basis-1/3 sm:basis-auto"
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="flex-grow basis-1/3 sm:basis-auto"
            >
              Courses
            </TabsTrigger>
            <TabsTrigger
              value="subjects"
              className="flex-grow basis-1/3 sm:basis-auto"
            >
              Subjects
            </TabsTrigger>
            <TabsTrigger
              value="leaves"
              className="flex-grow basis-1/3 sm:basis-auto"
            >
              Leaves
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <StatCard title="Total Students" value={255} />
              <StatCard title="Total Staff Members" value={42} />
              <StatCard title="Total Courses" value={4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Students per Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={studentData}>
                      <Bar dataKey="students" fill="#000">
                        <LabelList dataKey="students" position="top" />
                      </Bar>
                      <Tooltip />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <IndianCalendar />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="view">
                  <TabsList>
                    <TabsTrigger value="view">View Users</TabsTrigger>
                    <TabsTrigger value="add">Add User</TabsTrigger>
                  </TabsList>
                  <TabsContent value="view">
                    <div className="w-full overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.role}</TableCell>
                              <TableCell>
                                <Button
                                  onClick={() => setShowUserDetails(true)}
                                >
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  <TabsContent value="add">
                    <AddUserForm />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CourseManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle>Subject Management</CardTitle>
              </CardHeader>
              <CardContent>
                <SubjectManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaves">
            <Card>
              <CardHeader>
                <CardTitle>Leave Management</CardTitle>
              </CardHeader>
              <CardContent>
                <LeaveManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <UserDetailsDialog
        open={showUserDetails}
        onOpenChange={setShowUserDetails}
      />
    </div>
  );
};

export default AdminDashboard;