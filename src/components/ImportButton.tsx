import React, { useRef, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface CSVUploadButtonProps {
  fileCategory: string;
  onFileUpload: (file: File) => void;
  buttonText?: string;
  type?: "button" | "submit" | "reset";
}

export default function ImportButton({
  fileCategory,
  onFileUpload,
  buttonText = "Upload CSV",
  type = "button",
}: CSVUploadButtonProps) {
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) {
      setError("No file selected");
      return;
    }

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file");
      setFileName("");
      return;
    }

    setFileName(file.name);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/${fileCategory}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        alert("File imported successfully!");
        onFileUpload(file);
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }
    } catch (error: any) {
      setError(`An error occurred while importing the file: ${error.message}`);
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleButtonClick} disabled={isLoading} type={type}>
        <Upload className="mr-2 h-4 w-4" />
        {isLoading ? "Importing..." : buttonText}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="sr-only"
        aria-label="Upload CSV file"
      />
      {fileName && (
        <p className="text-sm text-muted-foreground">Selected: {fileName}</p>
      )}
      {error && error}
    </div>
  );
}
