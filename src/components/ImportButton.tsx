import React, { useRef, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import AccessDenied from "./accessDenied";

interface CSVUploadButtonProps {
  fileCategory: string;
  onFileUpload: (file: File) => void;
  buttonText?: string;
  type?: "button" | "submit" | "reset";
}

export default function ImportButton({
  fileCategory,
  buttonText,
  type = "button",
}: CSVUploadButtonProps) {
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      toast.error("No file selected");
    }

    if (file?.type !== "text/csv" && !file?.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
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

      const data = await response.json();
      if (response.status !== 200 && response.status !== 403) {
        toast.error(data.message);
      }
      if (response.status === 403) {
        return <AccessDenied />;
      }

      if (data.success) {
        toast.success("File imported successfully");
      }
    } catch (error: any) {
      toast.error(error);
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
    </div>
  );
}
