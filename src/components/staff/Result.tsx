"use client";

import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";

interface UploadedResult {
  id: string;
  studentName: string;
  semester: number; // Ensure semester is a number
  url: string; // Keep the URL for viewing results
}

const Result: React.FC = () => {
  const [uploadedResults, setUploadedResults] = useState<UploadedResult[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10); // Define the number of items per page
  const [nameFilter, setNameFilter] = useState<string>(""); // State for name filter
  const [semesterFilter, setSemesterFilter] = useState<string>(""); // State for semester filter

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch("/api/fetchresultStaff");
      const data = await response.json();

      if (response.ok) {
        console.log(data); // Log the fetched data
        setUploadedResults(data);
      } else {
        toast.error(data.message || "Failed to fetch results");
      }
    } catch (error) {
      toast.error("An error occurred while fetching results");
    }
  };

  const totalPages = Math.ceil(uploadedResults.length / itemsPerPage);

  // Filter the results based on the search criteria
  const filteredResults = uploadedResults.filter(result => {
    const nameMatch = result.studentName.toLowerCase().includes(nameFilter.toLowerCase());
    
    // Trim the input for clean comparisons
    const sanitizedSemesterFilter = semesterFilter.trim();

    // Ensure semester is a number before comparing
    const semesterMatch = typeof result.semester === 'number' 
      && result.semester.toString().includes(sanitizedSemesterFilter);

    return nameMatch && semesterMatch;
  });

  const currentResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Student Uploaded Results</h2>
      
      <div className="mb-4">
        {/* Name Filter Input */}
        <input
          type="text"
          placeholder="Filter by Student Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="border rounded-md p-2 mr-2"
        />
        {/* Semester Filter Input */}
        <input
          type="text"
          placeholder="Filter by Semester"
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="border rounded-md p-2"
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentResults.length > 0 ? (
              currentResults.map((result) => (
                <TableRow key={result.id} className="hover:bg-gray-100 transition-all">
                  <TableCell className="font-medium">{result.studentName}</TableCell>
                  <TableCell>{result.semester}</TableCell>
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
                <TableCell colSpan={3} className="text-center">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredResults.length > itemsPerPage && ( // Check against filtered results for pagination
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
  );
};

export default Result;
