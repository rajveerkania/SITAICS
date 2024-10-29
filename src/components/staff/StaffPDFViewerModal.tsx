import React, { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaffPDFViewerModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
  /** URL of the PDF to display */
  pdfUrl: string | null;
  /** Student name for the PDF being viewed */
  studentName: string;
  /** Semester number for the PDF being viewed */
  semester: number;
}

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

  const handleDownload = async () => {
    if (!pdfUrl) return;
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${studentName}_Semester${semester}_Result.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100 rounded-full p-2"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="w-full h-[calc(100%-5rem)]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
              <p>Loading PDF...</p>
            </div>
          )}
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full rounded-b-lg"
              title="PDF Viewer"
              onLoad={() => setLoading(false)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>No PDF available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffPDFViewerModal;
