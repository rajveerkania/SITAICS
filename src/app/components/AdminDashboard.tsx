
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar as CalendarIcon, Bell, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";


// Mock data for the chart
const studentData = [
    { course: 'BTech', students: 120 },
    { course: 'MTech Cyber Security', students: 25 },
    { course: 'MTech AI/ML', students: 20 },
    { course: 'MSCDF', students: 30 },
];

// Mock user data
const users = [
    { id: 1, username: 'Het Patel', email: '21bcscs021@student.rru.ac.in', role: 'Student', batch: 'BTech 2021-2025' },
    { id: 2, username: 'Vivek Jhoshi', email: 'vivek.joshi@rru.ac.in', role: 'Assistant Professor' },
    { id: 3, username: 'Darshan Prajapati', email: 'darashan.prajapato@rru.ac.in', role: 'Placement Officer' }
    //We can add More Users 
];

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedRole, setSelectedRole] = useState('');
    const [showUserDetails, setShowUserDetails] = useState(false);

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="/api/placeholder/32/32" alt="SITAICS Logo" className="mr-2" />
                        {/* <span className="text-xl font-bold">SITAICS ERP</span> */}
                    </div>
                    <div className="flex items-center space-x-4">
                        <NotificationDialog />
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto mt-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="courses">Courses</TabsTrigger>
                        <TabsTrigger value="subjects">Subjects</TabsTrigger>
                        <TabsTrigger value="leaves">Leaves</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-3 gap-4 mb-8">
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

                        <div className="grid grid-cols-2 gap-4">
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
                                            <Bar dataKey="students" fill="#8884d8" />
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
                                <Tabs defaultValue="add">
                                    <TabsList>
                                        <TabsTrigger value="add">Add User</TabsTrigger>
                                        <TabsTrigger value="view">View Users</TabsTrigger>
                                        <TabsTrigger value="delete">Delete User</TabsTrigger>
                                        <TabsTrigger value="role">Assign Role</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="add">
                                        <form className="space-y-4 mt-4">
                                            <Input placeholder="Username" />
                                            <Input placeholder="Email" type="email" />
                                            <Select onValueChange={handleRoleChange}>
                                                <SelectTrigger>
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
                                                        <SelectTrigger>
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
                                            <Button>Add User</Button>
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
                                                        {/* Add more details as needed */}
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

                    {/* Other TabsContent components remain the same */}

                </Tabs>
            </div>
        </div>
    );
};

const IndianCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
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
                    <div key={day} className="text-center font-semibold">{day}</div>
                ))}
                {Array(firstDayOfMonth).fill(null).map((_, index) => (
                    <div key={`empty-${index}`} />
                ))}
                {days.map((day) => (
                    <div
                        key={day}
                        className={`text-center p-2 ${day === new Date().getDate() &&
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
        // Implement sending notification logic here
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
                        <Select onValueChange={setNotificationType} defaultValue={notificationType}>
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
