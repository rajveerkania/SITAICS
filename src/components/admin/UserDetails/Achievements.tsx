import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
}

const Achievement: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["Academic", "Sports", "Extracurricular", "Professional", "Other"];

  useEffect(() => {
    const storedAchievements = localStorage.getItem("achievements");
    if (storedAchievements) {
      setAchievements(JSON.parse(storedAchievements));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(achievements));
  }, [achievements]);

  const handleDelete = (id: number) => {
    setAchievements(achievements.filter((ach) => ach.id !== id));
  };

  const filteredAchievements = achievements
    .filter(
      (ach) =>
        ach.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ach.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((ach) => filterCategory === "All" || ach.category === filterCategory);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 md:p-8 max-w-10xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Achievements</h2>

      {/* Top Bar with Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search achievements..."
          className="p-2 border rounded w-full md:w-1/2 lg:w-1/3"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border rounded w-full md:w-1/4 lg:w-1/5"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Achievement Cards */}
      <div className="space-y-4">
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map((achievement) => (
            <div key={achievement.id} className="border p-4 rounded shadow-md">
              <h3 className="text-xl font-semibold">{achievement.title}</h3>
              <p className="text-gray-600">{achievement.description}</p>
              <p className="text-sm text-gray-500">
                Date: {achievement.date} | Category: {achievement.category}
              </p>
              <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => handleDelete(achievement.id)}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full sm:w-auto flex items-center justify-center"
                >
                  <FaTrashAlt className="mr-2" /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No achievements found.</div>
        )}
      </div>
    </div>
  );
};

export default Achievement;