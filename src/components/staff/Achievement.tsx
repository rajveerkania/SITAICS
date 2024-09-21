import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiFillDelete } from "react-icons/ai"; // For delete icon
import { FiFileText } from "react-icons/fi"; // For file icon

interface Achievement {
  id: string;
  title: string;
  description: string;
  pdfUrl?: string;
}

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievement, setNewAchievement] = useState({ title: "", description: "", pdfUrl: "", date: "" });
  const [activeTab, setActiveTab] = useState("view");
  const [file, setFile] = useState<File | null>(null);

  const fetchAchievements = async () => {
    // Fetch achievements from the backend (if needed)
  };

  const handleAddAchievement = async () => {
    if (newAchievement.title && newAchievement.description && newAchievement.date) {
      try {
        const formData = new FormData();
        formData.append("title", newAchievement.title);
        formData.append("description", newAchievement.description);
        formData.append("date", newAchievement.date);
        if (file) formData.append("file", file);

        const res = await fetch("/api/achievements", {
          method: "POST",
          body: JSON.stringify({
            title: newAchievement.title,
            description: newAchievement.description,
            date: newAchievement.date,
            file: newAchievement.pdfUrl,
            userId: 1, // Replace with the actual user ID when available
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (data.success) {
          setAchievements([...achievements, data.achievement]);
          setNewAchievement({ title: "", description: "", pdfUrl: "", date: "" });
          setFile(null);
        } else {
          console.error("Failed to add achievement:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleDeleteAchievement = (id: string) => {
    setAchievements((prev) => prev.filter((ach) => ach.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setNewAchievement((prev) => ({ ...prev, pdfUrl: url }));
    }
  };

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Achievements</h2>

      <div className="mb-6">
        <button
          onClick={() => setActiveTab("view")}
          className={`mr-4 py-2 px-4 rounded-t-lg ${activeTab === "view" ? "bg-black text-white" : "bg-gray-200"}`}
        >
          View Achievements
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`py-2 px-4 rounded-t-lg ${activeTab === "add" ? "bg-black text-white" : "bg-gray-200"}`}
        >
          Add Achievement
        </button>
      </div>

      {activeTab === "view" && (
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Achievements</h3>
          <div className="space-y-4">
            {achievements.length > 0 ? (
              achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xl font-semibold text-gray-800">{achievement.title}</h4>
                      <button
                        onClick={() => handleDeleteAchievement(achievement.id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        <AiFillDelete size={20} />
                      </button>
                    </div>
                    <p className="text-gray-600">{achievement.description}</p>
                    {achievement.pdfUrl && (
                      <iframe
                        src={achievement.pdfUrl}
                        className="w-full h-48 mt-4 border rounded-lg"
                        style={{ border: "none" }}
                        title="PDF Viewer"
                      ></iframe>
                    )}
                  </div>
                  {achievement.pdfUrl && (
                    <a
                      href={achievement.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:text-black"
                    >
                      <FiFileText size={24} />
                    </a>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600">No achievements yet. Add some to get started!</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "add" && (
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add New Achievement</h3>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <input
              type="text"
              placeholder="Title"
              value={newAchievement.title}
              onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
              className="w-full p-3 mb-2 border border-gray-300 rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={newAchievement.description}
              onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
              className="w-full p-3 mb-2 border border-gray-300 rounded-lg"
              rows={3}
            />
            <input
              type="date"
              value={newAchievement.date}
              onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
              className="w-full p-3 mb-2 border border-gray-300 rounded-lg"
            />
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleAddAchievement}
              className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-900"
            >
              Add Achievement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
