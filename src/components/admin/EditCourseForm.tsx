// "use client";

// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardFooter, 
//   CardHeader, 
//   CardTitle 
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableHeader, 
//   TableRow 
// } from "@/components/ui/table";
// import { toast } from "sonner";
// import { Book, Layers, Edit3, ArrowLeft } from 'lucide-react';

// // Dummy data
// const dummyCourse = {
//   courseId: "1",
//   courseName: "Computer Science",
//   totalBatches: 3,
//   totalSubjects: 12,
//   isActive: true
// };

// const dummyBatches = [
//   {
//     batchId: "1",
//     batchName: "CSE 2023",
//     courseName: "Computer Science",
//     batchDuration: 4,
//     currentSemester: 2,
//     studentCount: 60
//   },
//   {
//     batchId: "2",
//     batchName: "CSE 2022",
//     courseName: "Computer Science",
//     batchDuration: 4,
//     currentSemester: 4,
//     studentCount: 55
//   }
// ];

// const dummySubjects = [
//   {
//     subjectId: "1",
//     subjectName: "Data Structures",
//     subjectCode: "CS201",
//     semester: 3,
//     courseName: "Computer Science"
//   },
//   {
//     subjectId: "2",
//     subjectName: "Database Management",
//     subjectCode: "CS202",
//     semester: 3,
//     courseName: "Computer Science"
//   },
//   {
//     subjectId: "3",
//     subjectName: "Operating Systems",
//     subjectCode: "CS303",
//     semester: 4,
//     courseName: "Computer Science"
//   }
// ];

// const CourseEditPage = () => {
//   const [course, setCourse] = useState(dummyCourse);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedCourseName, setEditedCourseName] = useState(dummyCourse.courseName);

//   const handleSave = () => {
//     setCourse({
//       ...course,
//       courseName: editedCourseName
//     });
//     setIsEditing(false);
//     toast.success("Course updated successfully");
//   };

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <Button 
//         variant="outline" 
//         onClick={() => console.log('Back clicked')} 
//         className="mb-6"
//       >
//         <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
//       </Button>

//       <Card className="mb-6">
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <div>
//               <CardTitle className="text-2xl">Course Details</CardTitle>
//               <CardDescription>
//                 Manage course information, batches, and subjects
//               </CardDescription>
//             </div>
//             {!isEditing && (
//               <Button onClick={() => setIsEditing(true)}>
//                 <Edit3 className="mr-2 h-4 w-4" /> Edit Course
//               </Button>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium flex items-center mb-2">
//                   <Book className="mr-2 h-4 w-4" /> Course Name
//                 </label>
//                 {isEditing ? (
//                   <Input
//                     value={editedCourseName}
//                     onChange={(e) => setEditedCourseName(e.target.value)}
//                     className="w-full"
//                   />
//                 ) : (
//                   <p className="text-lg">{course.courseName}</p>
//                 )}
//               </div>
//               <div className="flex gap-8">
//                 <div>
//                   <label className="text-sm font-medium flex items-center mb-2">
//                     <Layers className="mr-2 h-4 w-4" /> Total Batches
//                   </label>
//                   <p className="text-lg">{course.totalBatches}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm font-medium flex items-center mb-2">
//                     <Book className="mr-2 h-4 w-4" /> Total Subjects
//                   </label>
//                   <p className="text-lg">{course.totalSubjects}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//         {isEditing && (
//           <CardFooter className="flex justify-end space-x-4">
//             <Button variant="outline" onClick={() => {
//               setIsEditing(false);
//               setEditedCourseName(course.courseName);
//             }}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave}>
//               Save Changes
//             </Button>
//           </CardFooter>
//         )}
//       </Card>

//       <Tabs defaultValue="batches" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="batches">Batches</TabsTrigger>
//           <TabsTrigger value="subjects">Subjects</TabsTrigger>
//         </TabsList>

//         <TabsContent value="batches">
//           <Card>
//             <CardHeader>
//               <CardTitle>Course Batches</CardTitle>
//               <CardDescription>
//                 All batches enrolled in this course
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Batch Name</TableHead>
//                     <TableHead>Duration (Years)</TableHead>
//                     <TableHead>Current Semester</TableHead>
//                     <TableHead>Students</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {dummyBatches.map((batch) => (
//                     <TableRow key={batch.batchId}>
//                       <TableCell>{batch.batchName}</TableCell>
//                       <TableCell>{batch.batchDuration}</TableCell>
//                       <TableCell>{batch.currentSemester}</TableCell>
//                       <TableCell>{batch.studentCount}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="subjects">
//           <Card>
//             <CardHeader>
//               <CardTitle>Course Subjects</CardTitle>
//               <CardDescription>
//                 All subjects in this course
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Subject Name</TableHead>
//                     <TableHead>Subject Code</TableHead>
//                     <TableHead>Semester</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {dummySubjects.map((subject) => (
//                     <TableRow key={subject.subjectId}>
//                       <TableCell>{subject.subjectName}</TableCell>
//                       <TableCell>{subject.subjectCode}</TableCell>
//                       <TableCell>{subject.semester}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default CourseEditPage;