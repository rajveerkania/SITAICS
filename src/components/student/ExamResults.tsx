import React, { useState, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, X, Upload, Eye, Plus } from "lucide-react";

interface UploadedResult {
  id: string;
  semester: string;
  file: File | null;
  url: string;
}

const SemesterCard: React.FC<{
  semester: string;
  result: UploadedResult | undefined;
  onUpload: (file: File) => void;
  onRemove: () => void;
}> = ({ semester, result, onUpload, onRemove }) => (
  <Card className="w-full sm:w-64">
    <CardHeader>
      <CardTitle className="text-lg">{semester}</CardTitle>
    </CardHeader>
    <CardContent>
      {result ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-500 truncate">{result.file?.name}</p>
          <div className="flex justify-between">
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" /> View
            </a>
            <Button variant="destructive" size="sm" onClick={onRemove}>
              <X className="w-4 h-4 mr-1" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Input
            type="file"
            accept=".pdf"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
            className="hidden"
            id={`file-upload-${semester}`}
          />
          <label
            htmlFor={`file-upload-${semester}`}
            className="flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
          >
            <Upload className="w-5 h-5 mr-2" />
            <span>Upload PDF</span>
          </label>
        </div>
      )}
    </CardContent>
  </Card>
);

const RepeaterResultCard: React.FC<{
  result: UploadedResult;
  onUpload: (file: File) => void;
  onRemove: () => void;
}> = ({ result, onUpload, onRemove }) => (
  <Card className="w-full sm:w-64">
    <CardHeader>
      <CardTitle className="text-lg">Repeater Result</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p className="text-sm text-gray-500 truncate">{result.file?.name}</p>
        <div className="flex justify-between">
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center"
          >
            <Eye className="w-4 h-4 mr-1" /> View
          </a>
          <Button variant="destructive" size="sm" onClick={onRemove}>
            <X className="w-4 h-4 mr-1" /> Remove
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ExamResults: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedResults, setUploadedResults] = useState<UploadedResult[]>([]);
  const [repeaterResults, setRepeaterResults] = useState<UploadedResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const semesters = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
  ];

  const handleFileUpload = (semester: string, file: File, isRepeater: boolean = false) => {
    const validationMessage = validateFile(file);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const newResult: UploadedResult = {
      id: isRepeater ? `repeater-${Date.now()}` : semester,
      semester: semester,
      file: file,
      url: URL.createObjectURL(file),
    };

    if (isRepeater) {
      setRepeaterResults([...repeaterResults, newResult]);
    } else {
      const updatedResults = uploadedResults.filter((result) => result.semester !== semester);
      setUploadedResults([...updatedResults, newResult]);
    }

    setSuccessMessage("File uploaded successfully!");
    setError(null);
  };

  const handleRemoveFile = (id: string, isRepeater: boolean = false) => {
    if (isRepeater) {
      const newResults = repeaterResults.filter((result) => result.id !== id);
      const removedFile = repeaterResults.find((result) => result.id === id);
      if (removedFile) {
        URL.revokeObjectURL(removedFile.url);
      }
      setRepeaterResults(newResults);
    } else {
      const newResults = uploadedResults.filter((result) => result.id !== id);
      const removedFile = uploadedResults.find((result) => result.id === id);
      if (removedFile) {
        URL.revokeObjectURL(removedFile.url);
      }
      setUploadedResults(newResults);
    }
    setSuccessMessage(null);
  };

  const validateFile = (file: File) => {
    if (file.type !== "application/pdf") {
      return "Please upload a valid PDF file.";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "File size exceeds 5MB. Please choose a smaller file.";
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Results</TabsTrigger>
          <TabsTrigger value="view">View Results</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          {error && (
            <div className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50">
              <AlertCircle className="flex-shrink-0 w-5 h-5 mr-2" />
              <span className="sr-only">Error</span>
              <div>{error}</div>
            </div>
          )}
          {successMessage && (
            <div className="flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50">
              <CheckCircle2 className="flex-shrink-0 w-5 h-5 mr-2" />
              <span className="sr-only">Success</span>
              <div>{successMessage}</div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {semesters.map((semester) => (
              <SemesterCard
                key={semester}
                semester={semester}
                result={uploadedResults.find((r) => r.semester === semester)}
                onUpload={(file) => handleFileUpload(semester, file)}
                onRemove={() => handleRemoveFile(semester)}
              />
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Repeater Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {repeaterResults.map((result) => (
                <RepeaterResultCard
                  key={result.id}
                  result={result}
                  onUpload={(file) => handleFileUpload("Repeater", file, true)}
                  onRemove={() => handleRemoveFile(result.id, true)}
                />
              ))}
              <Card className="w-full sm:w-64 flex items-center justify-center">
                <CardContent>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload("Repeater", file, true);
                    }}
                    className="hidden"
                    id="repeater-upload"
                  />
                  <label
                    htmlFor="repeater-upload"
                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
                  >
                    <Plus className="w-8 h-8 mb-2" />
                    <span>Add Repeater Result</span>
                  </label>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="view" className="mt-4">
          <h3 className="text-xl font-semibold mb-4">Your Uploaded Results</h3>
          {uploadedResults.length > 0 || repeaterResults.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedResults.map((result) => (
                  <SemesterCard
                    key={result.id}
                    semester={result.semester}
                    result={result}
                    onUpload={(file) => handleFileUpload(result.semester, file)}
                    onRemove={() => handleRemoveFile(result.id)}
                  />
                ))}
              </div>
              {repeaterResults.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold my-4">Repeater Results</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {repeaterResults.map((result) => (
                      <RepeaterResultCard
                        key={result.id}
                        result={result}
                        onUpload={(file) => handleFileUpload("Repeater", file, true)}
                        onRemove={() => handleRemoveFile(result.id, true)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="text-gray-500">You haven't uploaded any results yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamResults;