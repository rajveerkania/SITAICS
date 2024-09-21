import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null); // State to store user data
  const [isEditing, setIsEditing] = useState(false); // State to toggle editing
  const [formData, setFormData] = useState<any>(null); // Form data for editing
  const [loading, setLoading] = useState(true); // State to show loading
  const [error, setError] = useState<string | null>(null); // State to handle errors

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/fetchUserDetails"); // Replace with the correct API route
        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          setFormData(data.user);
        } else {
          throw new Error(data.message || "Failed to fetch user data");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Update the user state with the form data
    setUser({ ...user, ...formData });
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setFormData({ ...user }); // Reset form data to original user data
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <motion.div
      className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Profile</h2>
      <div className="space-y-4">
        {isEditing ? (
          <>
            {/* Edit Form */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-800">Name:</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                />
              </div>

              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-800">Email:</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                />
              </div>

              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-800">Username:</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                />
              </div>

              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-800">Batch Coordinator:</span>
                <input
                  type="checkbox"
                  name="isBatchCoordinator"
                  checked={formData.isBatchCoordinator}
                  onChange={(e) => setFormData({ ...formData, isBatchCoordinator: e.target.checked })}
                  className="border p-2 rounded-md"
                />
              </div>

              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-800">Batch ID:</span>
                <input
                  type="text"
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <span className="font-medium text-gray-800">Subjects:</span>
                <input
                  type="text"
                  name="subjects"
                  value={formData.subjects.join(", ")}
                  onChange={(e) => setFormData({ ...formData, subjects: e.target.value.split(", ") })}
                  className="border p-2 rounded-md"
                />
              </div>

              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-800">Contact Number:</span>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                />
              </div>

              {/* Save and Cancel buttons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSaveClick}
                  className="bg-green-500 text-white py-2 px-4 rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelClick}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Display User Info */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xl">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-800">Username:</span>
              <span className="text-gray-600">{user.username}</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-800">Batch Coordinator:</span>
              <span className={`text-gray-600 ${user.isBatchCoordinator ? "font-bold" : ""}`}>
                {user.isBatchCoordinator ? "Yes" : "No"}
              </span>
            </div>

            {user.batchId && (
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-800">Batch ID:</span>
                <span className="text-gray-600">{user.batchId}</span>
              </div>
            )}

            {user.subjects.length > 0 && (
              <div className="flex flex-col space-y-2">
                <span className="font-medium text-gray-800">Subjects:</span>
                <ul className="list-disc list-inside text-gray-600">
                  {user.subjects.map((subject: string, index: number) => (
                    <li key={index}>{subject}</li>
                  ))}
                </ul>
              </div>
            )}

            {user.contactNumber && (
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-800">Contact Number:</span>
                <span className="text-gray-600">{user.contactNumber}</span>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-800">Account Created:</span>
              <span className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Edit button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleEditClick}
                className="bg-black text-white py-2 px-4 rounded-md"
              > 
                Edit
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default UserProfile;
