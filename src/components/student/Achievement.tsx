import React, { useState, useEffect } from "react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

interface Achievement {
  title: string;
  description: string;
  date: string;
  category: string;
}

interface AchievementProps {
  userId: string;
  userRole: string;
}

const Achievement: React.FC<AchievementProps> = ({ userId, userRole }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"view" | "add">("view");

  const categories = [
    "Academic",
    "Sports",
    "Extracurricular",
    "Professional",
    "Other",
  ];

  useEffect(() => {
    fetchAchievements();
  }, []);
  const fetchAchievements = async () => {
    try {
      const response = await fetch("/api/fetchAchievements", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error fetching achievements: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched achievements data:", data);

      setAchievements(
        Array.isArray(data.achievements) ? data.achievements : []
      );
    } catch (error) {
      console.error("Error fetching achievements:", error);
      setAchievements([]);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newAchievement = { title, description, date, category };

    try {
      const response = await fetch("/api/addAchievement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAchievement),
      });

      const data = await response.json();
      console.log("Add Achievement Response:", data);

      if (response.ok) {
        await fetchAchievements();
      } else {
        throw new Error("Failed to add achievement");
      }

      resetForm();
    } catch (error) {
      console.error("Error adding achievement:", error);
    }
  };
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setCategory("");
    setEditingId(null);
  };
  const handleDelete = async (
    userId: string,
    role: string,
    achievement: Achievement
  ) => {
    try {
      const response = await fetch("/api/deleteAchievement", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: achievement.title,
          description: achievement.description,
          date: achievement.date,
          category: achievement.category,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Delete Achievement Response:", data);
        setAchievements((prev) =>
          prev.filter(
            (a) =>
              a.title !== achievement.title ||
              a.description !== achievement.description ||
              a.date !== achievement.date ||
              a.category !== achievement.category
          )
        );
      } else {
        throw new Error("Failed to delete achievement");
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-6 md:p-8 max-w-10xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Achievements
      </h2>
      <div className="flex flex-col md:flex-row mb-4 border-b border-gray-300">
        <button
          className={`p-2 flex-1 ${
            activeTab === "view"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("view")}
        >
          View Achievements
        </button>
        <button
          className={`p-2 flex-1 ${
            activeTab === "add"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("add")}
        >
          Add Achievement
        </button>
      </div>
      {activeTab === "view" && (
        <div>
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
          <div className="space-y-4">
            {Array.isArray(achievements) && achievements.length > 0 ? (
              achievements
                .filter((achievement) => {
                  const matchesSearch =
                    achievement.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    achievement.description
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());

                  const matchesCategory =
                    filterCategory === "All" ||
                    achievement.category === filterCategory;

                  return matchesSearch && matchesCategory;
                })
                .map((achievement, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded shadow-md flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-xl font-semibold">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-600">{achievement.description}</p>
                      <p className="text-sm text-gray-500">
                        Date: {achievement.date} | Category:{" "}
                        {achievement.category}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleDelete(userId, userRole, achievement)
                      }
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full sm:w-auto flex items-center justify-center"
                    >
                      <FaTrashAlt className="mr-2" /> Delete
                    </button>
                  </div>
                ))
            ) : (
              <p>No achievements found</p>
            )}
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
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
          >
            {editingId !== null ? "Update Achievement" : "Add Achievement"}
          </button>
        </form>
      )}
    </div>
  );
};
export default Achievement;
