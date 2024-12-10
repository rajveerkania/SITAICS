  import React, { useState, useEffect, useCallback } from "react";
  import { toast } from "react-toastify";
  import PDFViewerModal from "./PDFViewerModel"; // Make sure this path is correct

  type ResultComponentProps = {
    id: string; // ID to fetch the results
    isEditing: boolean; // Whether the component is in editing mode
    onResultsChange: (updatedResults: any[]) => void; // Callback to handle changes in results
  };

  const ResultComponent: React.FC<ResultComponentProps> = ({ id, isEditing, onResultsChange }) => {
    const [results, setResults] = useState<any[]>([]); // State to store fetched results
    const [fetchedId, setFetchedId] = useState<string | null>(null); // Track the last fetched ID
    const [selectedResultUrl, setSelectedResultUrl] = useState<string | null>(null); // Selected result to display
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false); // PDF Modal state

    // Memoized callback for onResultsChange
    const handleResultsChange = useCallback(onResultsChange, [onResultsChange]);

    // Fetch results when `id` changes
    useEffect(() => {
      const fetchResults = async () => {
        if (!id || id === fetchedId) return; // Avoid fetching if the same ID is already fetched

        try {
          const response = await fetch(`/api/fetchResultAdmin?studentId=${id}`);
          if (!response.ok) {
            const error = await response.json();
            toast.error(error.message || "Failed to fetch results");
            return;
          }

          const data = await response.json();
          setResults(data); // Update local results state
          handleResultsChange(data); // Pass data to parent component if needed
          setFetchedId(id); // Update fetched ID
        } catch (error) {
          console.error("Error fetching results:", error);
          toast.error("An error occurred while fetching results.");
        }
      };

      fetchResults();
    }, [id, fetchedId, handleResultsChange]);

    const handleViewPdf = (url: string) => {
      setSelectedResultUrl(url); // Set the URL to display
      setIsPdfModalOpen(true); // Open the modal
    };

    return (
      <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Student Results
        </h2>

        {results.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">Student Name</th>
                  <th className="px-4 py-2 border">Semester</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border">{result.studentName}</td>
                    <td className="px-4 py-2 border">{result.semester}</td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleViewPdf(result.url)}
                        className="bg-black text-white px-3 py-1 rounded hover:bg-black"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600">No results found</p>
        )}

        {/* PDF Viewer Modal */}
        {selectedResultUrl && (
          <PDFViewerModal
            isOpen={isPdfModalOpen}
            onClose={() => setIsPdfModalOpen(false)}
            pdfData={selectedResultUrl}
          />
        )}
      </div>
    );
  };

  export default ResultComponent;
