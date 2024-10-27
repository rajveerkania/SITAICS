import { useEffect, useState } from "react";

const ExamResults = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [semester, setSemester] = useState<number | string>(1);
  const [file, setFile] = useState<File | null>(null);
  const [isRepeater, setIsRepeater] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [availableSemesters, setAvailableSemesters] = useState<number[]>([]);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
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

    fetchAvailableSemesters();
  }, []);

  useEffect(() => {
    if (activeTab === "view") {
      const fetchResults = async () => {
        try {
          const response = await fetch("/api/student/viewResults");
          if (!response.ok) throw new Error("Failed to fetch results");
          const data = await response.json();
          setResults(data.results); // Assuming the API returns a results array
        } catch (error) {
          console.error("Error fetching results:", error);
        }
      };
      fetchResults();
    }
  }, [activeTab]);

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
      const res = await fetch("/api/student/addResult", { method: "POST", body: formData });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) {
        // Reset the form
        setSemester(1);
        setFile(null);
        setIsRepeater(false);
        setName("");

        // Reload the page after upload
        window.location.reload(); // Refresh the page
      }
    } catch (err) {
      console.error("Error uploading:", err);
      setMessage("Failed to upload result.");
    }
  };

  const handleIsRepeaterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsRepeater(checked);
    // Update available semesters based on the checkbox state
    if (checked) {
      // If isRepeater is checked, set all semesters
      setAvailableSemesters([1, 2, 3, 4, 5, 6, 7, 8]);
    } else {
      // If unchecked, fetch available semesters
      fetchAvailableSemesters(); // Call the function here
    }
  };

  // Fetch available semesters for the first time
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

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Exam Results</h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-6 py-2 rounded-lg transition duration-300 ${activeTab === "add" ? "bg-black text-white" : "bg-gray-200 text-black"}`}
        >
          Add Result
        </button>
        <button
          onClick={() => setActiveTab("view")}
          className={`ml-4 px-6 py-2 rounded-lg transition duration-300 ${activeTab === "view" ? "bg-black text-white" : "bg-gray-200 text-black"}`}
        >
          View Results
        </button>
      </div>
      {message && <p className="text-red-500 text-center mb-4">{message}</p>}
      
      {activeTab === "add" ? (
        <>
          <div className="mb-4 flex items-center">
            <input
              id="isRepeater"
              type="checkbox"
              checked={isRepeater}
              onChange={handleIsRepeaterChange}
              className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <label htmlFor="isRepeater" className="ml-2 block text-sm text-gray-700">Is Repeater?</label>
          </div>
          <div className="mb-4">
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700">Select Semester</label>
            <select
              id="semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black transition duration-200 ease-in-out"
            >
              {availableSemesters.length > 0 ? (
                availableSemesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))
              ) : (
                <option value="">Loading...</option>
              )}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Upload Result (PDF)</label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black transition duration-200 ease-in-out"
            />
          </div>
          <button
            onClick={handleUpload}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-black transition duration-200 ease-in-out"
          >
            Upload Result
          </button>
        </>
      ) : (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Your Results</h2>
          {results.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Semester</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Is Repeater</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{result.semester}</td>
                    <td className="border border-gray-300 px-4 py-2">{result.isRepeater ? "Yes" : "No"}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <a href={`data:application/pdf;base64,${result.resultFile}`} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                        View Result
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamResults;
