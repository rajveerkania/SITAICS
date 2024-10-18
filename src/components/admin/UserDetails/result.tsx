"use client";

import React, { useState } from "react";
import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface UploadedResult {
  id: number;
  studentName: string;
  semester: string;
  fileName: string;
  url: string;
}

const initialResults: UploadedResult[] = [
  { id: 1, studentName: "John Doe", semester: "Semester 1", fileName: "result1.pdf", url: "path/to/result1.pdf" },
  { id: 2, studentName: "Jane Smith", semester: "Semester 2", fileName: "result2.pdf", url: "path/to/result2.pdf" },
  { id: 3, studentName: "Alice Johnson", semester: "Semester 3", fileName: "result3.pdf", url: "path/to/result3.pdf" },
  { id: 4, studentName: "Bob Brown", semester: "Semester 1", fileName: "result4.pdf", url: "path/to/result4.pdf" },
  { id: 5, studentName: "Charlie White", semester: "Semester 4", fileName: "result5.pdf", url: "path/to/result5.pdf" },
  { id: 6, studentName: "David Green", semester: "Semester 2", fileName: "result6.pdf", url: "path/to/result6.pdf" },
  { id: 7, studentName: "Eve Black", semester: "Semester 1", fileName: "result7.pdf", url: "path/to/result7.pdf" },
  { id: 8, studentName: "Frank Blue", semester: "Semester 2", fileName: "result8.pdf", url: "path/to/result8.pdf" },
];

const semesters = ["All", "Semester 1", "Semester 2", "Semester 3", "Semester 4"];
const itemsPerPage = 5;

const Result: React.FC = () => {
  const [uploadedResults, setUploadedResults] = useState<UploadedResult[]>(initialResults);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredResults = uploadedResults.filter((result) => {
    const matchesSearch = result.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = selectedSemester === "All" || result.semester === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const currentResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSemester("All");
    setCurrentPage(1);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Student Uploaded Results</h2>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-2 flex-grow items-center">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full sm:w-48"
            />
            <Select onValueChange={setSelectedSemester} value={selectedSemester}>
              <SelectTrigger className="w-full sm:w-[200px]">
                {selectedSemester || "Select Semester"}
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentResults.length > 0 ? (
                currentResults.map((result) => (
                  <TableRow key={result.id} className="hover:bg-gray-100 transition-all">
                    <TableCell className="font-medium">{result.studentName}</TableCell>
                    <TableCell>{result.semester}</TableCell>
                    <TableCell>{result.fileName}</TableCell>
                    <TableCell>
                      <div className="flex justify-start ml-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => window.open(result.url, "_blank")}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredResults.length > itemsPerPage && (
          <div className="pagination mt-4 flex justify-center items-center space-x-4 mb-">
            <Button
              disabled={currentPage === 1}
              onClick={handlePrevPage}
              className="pagination-button"
            >
              Previous
            </Button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
              className="pagination-button"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
