'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Calendar as CalendarIcon, Bell, Send, Menu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { LogoutButton } from '@/components/logoutbutton';

// Mock data for the chart
const studentData = [
  { course: 'BTech', students: 120 },
  { course: 'MTech Cyber Security', students: 45 },
  { course: 'MTech AI/ML', students: 60 },
  { course: 'MSC', students: 30 },
];

// Mock user data
const users = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    role: 'Student',
    batch: 'BTech 2021-2025',
  },
  { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'Assistant Professor' },
  // Add more mock users as needed
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRole, setSelectedRole] = useState('');
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="SITAICS Logo"
              className="mr-2 h-14 w-14"
            />
            <span className="text-xl font-bold hidden md:inline">SITAICS ERP</span>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationDialog />
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <LogoutButton />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto mt-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-col md:flex-row justify-around bg-gray-800 text-white p-2 rounded-lg mb-6">
            {['overview', 'users', 'courses', 'subjects', 'leaves'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="tab-item flex-1 py-2 px-4 text-center cursor-pointer transition-colors duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md mb-2 md:mb-0"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">255</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Assistant Professors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">42</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">4</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Students per Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={studentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="course" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="students" fill="#4F46E5" />
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
                <Tabs defaultValue="add" className="space-y-4">
                  <TabsList className="flex flex-wrap justify-start space-x-2">
                    {['add', 'view', 'delete', 'role'].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="px-4 py-2 rounded-md transition-colors duration-300 hover:bg-gray-200"
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} User
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value="add">
                    <form className="space-y-4 mt-4">
                      <Input placeholder="Username" />
                      <Input placeholder="Email" type="email" />
                      <Select onValueChange={handleRoleChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="assistant_professor">Assistant Professor</SelectItem>
                          <SelectItem value="placement_officer">Placement Officer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="Password" type="password" />
                      {selectedRole === 'student' && (
                        <>
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="btech">BTech</SelectItem>
                              <SelectItem value="mtech_cs">MTech Cyber Security</SelectItem>
                              <SelectItem value="mtech_ai">MTech in AI/ML</SelectItem>
                              <SelectItem value="msc">MSC</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input placeholder="Batch (e.g., 2021-2025)" />
                        </>
                      )}
                      <Button className="w-full">Add User</Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="view">
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
                              <Button onClick={() => setShowUserDetails(true)}>View Details</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {showUserDetails && (
                      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                          </DialogHeader>
                          <div>
                            <p><strong>Username:</strong> john_doe</p>
                            <p><strong>Email:</strong> john@example.com</p>
                            <p><strong>Role:</strong> Student</p>
                            <p><strong>Batch:</strong> BTech 2021-2025</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TabsContent>
                  <TabsContent value="delete">
                    <p>Delete user functionality to be implemented</p>
                  </TabsContent>
                  <TabsContent value="role">
                    <p>Role assignment functionality to be implemented</p>
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
                <Tabs defaultValue="add_course">
                  <TabsList>
                    <TabsTrigger value="add_course">Add Course</TabsTrigger>
                    <TabsTrigger value="view_courses">View Courses</TabsTrigger>
                  </TabsList>
                  <TabsContent value="add_course">
                    <form className="space-y-4 mt-4">
                      <Input placeholder="Course Name" />
                      <Input placeholder="Course Code" />
                      <Textarea placeholder="Course Description" />
                      <Button className="w-full">Add Course</Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="view_courses">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course Name</TableHead>
                          <TableHead>Course Code</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Add mock data or fetch real data */}
                        <TableRow>
                          <TableCell>BTech in Computer Science</TableCell>
                          <TableCell>BTech-CS</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="ml-2">Delete</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle>Subject Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="add_subject">
                  <TabsList>
                    <TabsTrigger value="add_subject">Add Subject</TabsTrigger>
                    <TabsTrigger value="view_subjects">View Subjects</TabsTrigger>
                  </TabsList>
                  <TabsContent value="add_subject">
                    <form className="space-y-4 mt-4">
                      <Input placeholder="Subject Name" />
                      <Input placeholder="Subject Code" />
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="btech_cs">BTech in Computer Science</SelectItem>
                          <SelectItem value="mtech_cs">MTech in Cyber Security</SelectItem>
                          {/* Add more courses */}
                        </SelectContent>
                      </Select>
                      <Textarea placeholder="Subject Description" />
                      <Button className="w-full">Add Subject</Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="view_subjects">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject Name</TableHead>
                          <TableHead>Subject Code</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Add mock data or fetch real data */}
                        <TableRow>
                          <TableCell>Data Structures</TableCell>
                          <TableCell>CS201</TableCell>
                          <TableCell>BTech in Computer Science</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="ml-2">Delete</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaves">
            <Card>
              <CardHeader>
                <CardTitle>Leave Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="apply_leave">
                  <TabsList>
                    <TabsTrigger value="apply_leave">Apply for Leave</TabsTrigger>
                    <TabsTrigger value="view_leaves">View Leaves</TabsTrigger>
                  </TabsList>
                  <TabsContent value="apply_leave">
                    <form className="space-y-4 mt-4">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Leave Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="vacation">Vacation</SelectItem>
                          <SelectItem value="personal">Personal Leave</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="grid grid-cols-2 gap-4">
                        <Input type="date" placeholder="Start Date" />
                        <Input type="date" placeholder="End Date" />
                      </div>
                      <Textarea placeholder="Reason for Leave" />
                      <Button className="w-full">Apply for Leave</Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="view_leaves">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Leave Type</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Add mock data or fetch real data */}
                        <TableRow>
                          <TableCell>Sick Leave</TableCell>
                          <TableCell>2023-08-01</TableCell>
                          <TableCell>2023-08-03</TableCell>
                          <TableCell>Approved</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const IndianCalendar: React.FC = () => {
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
          {currentDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
        </h2>
        <Button onClick={handleNextMonth}>&gt;</Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
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
                ? 'bg-blue-500 text-white rounded-full'
                : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

const NotificationDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationType, setNotificationType] = useState('specific');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    console.log('Sending notification:', { type: notificationType, recipient, message });
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
          <DialogDescription>
            Send a notification to a specific student or as a general circular.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Select
              onValueChange={setNotificationType}
              defaultValue={notificationType}
            >
              <SelectTrigger className="col-span-4">
                <SelectValue placeholder="Notification Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="specific">Specific Student</SelectItem>
                <SelectItem value="circular">General Circular</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {notificationType === 'specific' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="recipient"
                className="col-span-4"
                placeholder="Student Name or ID"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Textarea
              id="message"
              className="col-span-4"
              placeholder="Notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleSend}>Send Notification</Button>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDashboard;