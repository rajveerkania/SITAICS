import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaUpload } from "react-icons/fa"; // React icons for delete and upload

const Timetable: React.FC = () => {
  const [timetableFile, setTimetableFile] = useState<File | null>(null);
  const [timetableURL, setTimetableURL] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showManagement, setShowManagement] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("Manage Timetable");

  // Fetch timetable on load to see if it already exists
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await fetch("/api/addTimeTable", {
          method: "POST",
        });
        const data = await res.json();
        if (data.timetableExists && data.timetable) {
          const base64String = data.timetable;
          const blob = new Blob([Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0))], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(blob);
          setTimetableURL(fileURL);
          setShowManagement(false);
          setTitle("Existing Timetable");
        }
      } catch (error) {
        console.error("Error fetching timetable:", error);
      }
    };

    fetchTimetable();
  }, []);

  const validateFile = (file: File) => {
    const validTypes = ["application/pdf"];
    const maxSize = 1 * 1024 * 1024; // 1MB

    if (!validTypes.includes(file.type)) {
      setErrorMessage("Only PDF files are allowed.");
      return false;
    }

    if (file.size > maxSize) {
      setErrorMessage("File size should be less than 1MB.");
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && validateFile(file)) {
      setTimetableFile(file);
      setTimetableURL(null);
    }
  };

  const handleUpload = async () => {
    if (timetableFile) {
      setIsUploading(true);
      setShowManagement(false);
      setTitle("Updated Time Table");

      try {
        const formData = new FormData();
        formData.append("timetable", timetableFile);

        const res = await fetch("/api/addTimeTable", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          const fileURL = URL.createObjectURL(timetableFile);
          setTimetableURL(fileURL);
        } else {
          setErrorMessage("Failed to upload timetable.");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        setErrorMessage("Failed to upload timetable.");
      } finally {
        setIsUploading(false);
      }
    } else {
      setErrorMessage("Please upload a valid timetable file.");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("/api/deleteTimeTable", {
        method: "POST",
      });

      const data = await res.json();
      if (data.success) {
        setTimetableFile(null);
        setTimetableURL(null);
        setShowManagement(true);
        setTitle("Manage Timetable");
      } else {
        setErrorMessage("Failed to delete timetable.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      setErrorMessage("Failed to delete timetable.");
    }
  };

  return (
    <div className="max-w-full mx-auto my-16 p-12 bg-white shadow-2xl rounded-2xl border border-gray-300">
      <h2 className="text-4xl font-bold mb-8 text-center">{title}</h2>

      {/* File Upload Section */}
      {showManagement && !timetableFile && (
        <div className="mb-8">
          <label htmlFor="timetable" className="block text-xl font-medium text-gray-700">
            Upload Timetable
          </label>
          <input
            id="timetable"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="mt-4 block w-full p-5 border border-gray-400 rounded-lg shadow-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Display the file name if a file is selected */}
      {timetableFile && (
        <p className="mb-4 text-lg text-blue-600">
          File selected: {timetableFile.name}
        </p>
      )}

      {/* Error Message */}
      {errorMessage && <p className="text-red-500 text-lg mb-6">{errorMessage}</p>}

      {/* Upload Button */}
      {!timetableURL && timetableFile && (
        <div className="flex justify-end mb-8">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`bg-black text-white text-lg font-semibold py-4 px-8 rounded-lg shadow-lg transition-transform transform ${isUploading ? "opacity-50" : "hover:scale-105"}`}
          >
            <FaUpload className="inline mr-2" />
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}

      {/* Display Timetable */}
      {timetableURL && (
        <div className="flex flex-col items-center justify-center mb-8">
          <iframe src={timetableURL} width="80%" height="500px" className="border border-gray-500 shadow-lg"></iframe>
        </div>
      )}

      {/* Delete Timetable Button */}
      {timetableURL && (
        <div className="flex justify-end mb-8">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white text-lg font-semibold py-4 px-8 rounded-lg shadow-lg hover:scale-105 transition-transform transform"
          >
            <FaTrashAlt className="inline mr-2" />
            Delete Timetable
          </button>
        </div>
      )}
    </div>
  );
};

export default Timetable;
