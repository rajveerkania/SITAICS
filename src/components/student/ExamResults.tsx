import { useEffect, useState } from "react";
import { toast } from "sonner";
import PDFViewerModal from "./PDFViewerModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ExamResults = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [semester, setSemester] = useState<number | string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isRepeater, setIsRepeater] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [availableSemesters, setAvailableSemesters] = useState<number[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  useEffect(() => {
    fetchAvailableSemesters();
  }, []);

  useEffect(() => {
    if (activeTab === "view") {
      fetchResults();
    }
  }, [activeTab]);

  const fetchAvailableSemesters = async () => {
    try {
      const response = await fetch("/api/student/availableSemesters");
      if (!response.ok) throw new Error("Failed to fetch available semesters");
      const semesters = await response.json();
      setAvailableSemesters(semesters);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await fetch("/api/student/viewResults");
      if (!response.ok) throw new Error("Failed to fetch results");
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      toast.error("Error while fetching results");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !semester) {
      setMessage("Semester and file are required.");
      return;
    }
  
    const formData = new FormData();
    formData.append("semester", String(semester));
    formData.append("result", file);
    formData.append("isRepeater", String(isRepeater));
    if (name) formData.append("name", name);
  
    try {
      const res = await fetch("/api/student/addResult", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) {
        // Reset the form state and update view
        setSemester("");
        setFile(null);
        setIsRepeater(false);
        setName("");
        setActiveTab("view");
  
        // Fetch updated results and semesters
        fetchResults();
        fetchAvailableSemesters(); // <-- Re-fetch semesters here
      }
    } catch (err) {
      console.error("Error uploading:", err);
      setMessage("Failed to upload result.");
    }
  };

  const handleIsRepeaterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRepeater(e.target.checked);
    e.target.checked ? setAvailableSemesters([1, 2, 3, 4, 5, 6, 7, 8]) : fetchAvailableSemesters();
  };

  const handleViewPdf = async (pdfData: string) => {
    setSelectedPdf(pdfData);
    setIsPdfModalOpen(true);
  };

  return (
    <div>
      <div className="flex mb-6">
        {["add", "view"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 mx-1 rounded-lg font-medium transition duration-300 ${
              activeTab === tab ? "bg-black text-white" : "bg-gray-200 text-black"
            }`}
          >
            {tab === "add" ? "Add Result" : "View Results"}
          </button>
        ))}
      </div>

      {message && <p className="text-red-500 text-center mb-4">{message}</p>}

      {activeTab === "add" ? (
        <form className="space-y-6">
          <div className="flex items-center">
            <input
              id="isRepeater"
              type="checkbox"
              checked={isRepeater}
              onChange={handleIsRepeaterChange}
              className="h-4 w-4 text-black border-gray-300 rounded"
            />
            <label htmlFor="isRepeater" className="ml-2 text-sm text-gray-700">
              Is Repeater?
            </label>
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Select Semester
            <select
              id="semester"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
            >
              <option value="">Select Semester</option> {/* Add placeholder */}
              {availableSemesters.length > 0 ? (
                availableSemesters.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))
              ) : (
                <option value="">Loading...</option>
              )}
            </select>
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Upload Result (PDF)
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
            />
          </label>

          <button
            type="button"
            onClick={handleUpload}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Upload Result
          </button>
        </form>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-2">Your Results</h2>
          {results.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Semester</TableHead>
                  <TableHead>Is Repeater</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{result.semester}</TableCell>
                    <TableCell>{result.isRepeater ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleViewPdf(result.resultFile)}
                        className="text-black hover:underline"
                      >
                        View Result
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <PDFViewerModal
            isOpen={isPdfModalOpen}
            onClose={() => setIsPdfModalOpen(false)}
            pdfData={selectedPdf}
          />
        </div>
      )}
    </div>
  );
};

export default ExamResults;
