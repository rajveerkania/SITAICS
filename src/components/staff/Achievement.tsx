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
  // Dummy achievement data
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "1", title: "Best Innovator Award", description: "Awarded for exceptional innovation in project development." },
    { id: "2", title: "Top Performer", description: "Recognized as the top performer of the year." },
  ]);

  const [newAchievement, setNewAchievement] = useState({ title: "", description: "", pdfUrl: "" });
  const [activeTab, setActiveTab] = useState("view");

  const handleAddAchievement = () => {
    if (newAchievement.title && newAchievement.description) {
      setAchievements((prev) => [
        ...prev,
        { id: (prev.length + 1).toString(), ...newAchievement },
      ]);
      setNewAchievement({ title: "", description: "", pdfUrl: "" });
    }
  };

  const handleDeleteAchievement = (id: string) => {
    setAchievements((prev) => prev.filter((ach) => ach.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
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
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="w-full mb-4"
            />
            <button
              onClick={handleAddAchievement}
              className="w-full bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg"
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
