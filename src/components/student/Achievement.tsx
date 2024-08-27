import React, { useState, useEffect } from "react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
}

const Achievement: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"view" | "add">("view");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setAchievements(
        achievements.map((ach) =>
          ach.id === editingId
            ? { ...ach, title, description, date, category }
            : ach
        )
      );
      setEditingId(null);
    } else {
      const newAchievement: Achievement = {
        id: Date.now(),
        title,
        description,
        date,
        category,
      };
      setAchievements([...achievements, newAchievement]);
    }
    setTitle("");
    setDescription("");
    setDate("");
    setCategory("");
  };

  const handleEdit = (id: number) => {
    const achievementToEdit = achievements.find((ach) => ach.id === id);
    if (achievementToEdit) {
      setTitle(achievementToEdit.title);
      setDescription(achievementToEdit.description);
      setDate(achievementToEdit.date);
      setCategory(achievementToEdit.category);
      setEditingId(id);
      setActiveTab("add");
    }
  };

  const handleDelete = (id: number) => {
    setAchievements(achievements.filter((ach) => ach.id !== id));
  };

  const filteredAchievements = achievements
    .filter((ach) =>
      ach.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ach.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((ach) => filterCategory === "All" || ach.category === filterCategory);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Achievements</h2>
      
      {/* Tab Navigation */}
      <div className="flex mb-4">
        <button
          className={`p-2 flex-1 ${activeTab === "view" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} rounded-tl-lg`}
          onClick={() => setActiveTab("view")}
        >
          View Achievements
        </button>
        <button
          className={`p-2 flex-1 ${activeTab === "add" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} rounded-tr-lg`}
          onClick={() => setActiveTab("add")}
        >
          Add Achievement
        </button>
      </div>

      {activeTab === "view" && (
        <div>
          {/* Top Bar with Search and Filter */}
          <div className="flex justify-between items-center mb-4 space-x-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search achievements..."
              className="p-2 border rounded flex-1"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {filteredAchievements.map((achievement) => (
              <div key={achievement.id} className="border p-4 rounded">
                <h3 className="text-xl font-semibold">{achievement.title}</h3>
                <p className="text-gray-600">{achievement.description}</p>
                <p className="text-sm text-gray-500">
                  Date: {achievement.date} | Category: {achievement.category}
                </p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleEdit(achievement.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(achievement.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "add" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Achievement Title"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {editingId !== null ? "Update Achievement" : "Add Achievement"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Achievement;
