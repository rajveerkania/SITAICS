"use client";

import React, { useEffect, useState } from "react";
import { Eye, Download, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import LoadingSkeleton from "../LoadingSkeleton";

// Types
interface UploadedResult {
  id: string;
  studentName: string;
  semester: number;
  url: string;
}

interface StaffPDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  studentName: string;
  semester: number;
}

// PDF Viewer Modal Component
const StaffPDFViewerModal: React.FC<StaffPDFViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  studentName,
  semester,
}) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (pdfUrl) {
      setLoading(true);
    }
  }, [pdfUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full h-full max-w-4xl max-h-[90vh] m-4 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">
              {studentName}'s Result - Semester {semester}
            </h2>
          </div>
        </div>

        <div className="w-full h-[calc(100%-5rem)]">
          {loading && <LoadingSkeleton loadingText="result" />}
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full rounded-b-lg"
              title="PDF Viewer"
              onLoad={() => setLoading(false)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No PDF available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Result Component
const Result: React.FC = () => {
  const [uploadedResults, setUploadedResults] = useState<UploadedResult[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [semesterFilter, setSemesterFilter] = useState<string>("");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<UploadedResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/fetchResultStaff");
      const data = await response.json();

      if (response.ok) {
        setUploadedResults(data);
      } else {
        toast.error(data.message || "Failed to fetch results");
      }
    } catch (error) {
      toast.error("An error occurred while fetching results");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResults = uploadedResults.filter((result) => {
    const nameMatch = result.studentName
      .toLowerCase()
      .includes(nameFilter.toLowerCase());

    const sanitizedSemesterFilter = semesterFilter.trim();
    const semesterMatch = result.semester
      .toString()
      .includes(sanitizedSemesterFilter);

    return nameMatch && semesterMatch;
  });

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const currentResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleViewPdf = (result: UploadedResult) => {
    setSelectedResult(result);
    setIsPdfModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Student Uploaded Results
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          type="text"
          placeholder="Filter by Student Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="max-w-xs"
        />
        <Input
          type="text"
          placeholder="Filter by Semester"
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto relative">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingSkeleton loadingText="results" />
            ) : currentResults.length > 0 ? (
              currentResults.map((result) => (
                <TableRow
                  key={result.id}
                  className="hover:bg-gray-100 transition-all"
                >
                  <TableCell className="font-medium">
                    {result.studentName}
                  </TableCell>
                  <TableCell>{result.semester}</TableCell>
                  <TableCell>
                    <div className="flex justify-start gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => handleViewPdf(result)}
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
                <TableCell colSpan={3} className="text-center py-10">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredResults.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
          >
            Next
          </Button>
        </div>
      )}

      {/* PDF Viewer Modal */}
      <StaffPDFViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => {
          setIsPdfModalOpen(false);
          setSelectedResult(null);
        }}
        pdfUrl={selectedResult?.url || null}
        studentName={selectedResult?.studentName || ""}
        semester={selectedResult?.semester || 0}
      />
    </div>
  );
};

export default Result;
