import React, { useState, useEffect } from "react";

interface NotificationProps {
  isBatchCoordinator: boolean;
}

const Notification: React.FC<NotificationProps> = ({ isBatchCoordinator }) => {
  const [notification, setNotification] = useState({
    recipientType: "individual", // Default to individual
    recipient: "",
    message: "",
    customStudents: "", // For group of students input
  });

  const [students, setStudents] = useState<string[]>([]); // List of all students
  const [batches] = useState<string[]>(["Batch A", "Batch B", "Batch C", "Batch D"]); // List of batches
  const [filteredStudents, setFilteredStudents] = useState<string[]>([]); // Filtered list for autocomplete

  useEffect(() => {
    // Simulating fetching students from backend
    setStudents(["Student1", "Student2", "Student3", "Student4", "Student5"]);
  }, []);

  const handleCustomStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setNotification((prevState) => ({
      ...prevState,
      customStudents: inputValue,
    }));

    if (inputValue) {
      const filtered = students.filter((student) =>
        student.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  };

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void {
    const { name, value } = e.target;

    setNotification((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    // Initialize payload with current notification state
    let payload = { ...notification };

    // if (notification.recipientType === "group") {
    //   // If recipient type is group, convert customStudents to an array
    //   if (notification.customStudents.trim()) {
    //     const customStudentsArray = notification.customStudents.split(",").map((student) => student.trim());
    //     payload = { ...notification, customStudents: customStudentsArray };
    //   } else {
    //     alert("Please enter valid student IDs or names for the group.");
    //     return; // Exit the function to prevent submission
    //   }
    // }

    console.log("Notification payload:", payload);

    // Add your submit logic here
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Send Notification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Send To</label>
          <select
            name="recipientType"
            value={notification.recipientType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="individual">Individual Student</option>
            <option value="group">Group of Students</option>
            {isBatchCoordinator && <option value="batch">Entire Batch</option>}
          </select>
        </div>

        {/* Conditional Recipient Selection */}
        {notification.recipientType === "individual" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Student</label>
            <select
              name="recipient"
              value={notification.recipient}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="">Choose a student</option>
              {students.map((student, index) => (
                <option key={index} value={student}>
                  {student}
                </option>
              ))}
            </select>
          </div>
        )}

        {notification.recipientType === "group" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enter Student IDs/Names (comma-separated)
            </label>
            <input
              type="text"
              name="customStudents"
              value={notification.customStudents}
              onChange={handleCustomStudentChange}
              className="w-full p-2 border rounded mt-1"
              placeholder="Enter student IDs or names, separated by commas"
            />
            {/* Autocomplete Suggestions */}
            {filteredStudents.length > 0 && (
              <div className="border rounded mt-1 p-2 max-h-40 overflow-y-auto">
                {filteredStudents.map((student, index) => (
                  <div key={index} className="p-1 cursor-pointer hover:bg-gray-100">
                    {student}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {notification.recipientType === "batch" && isBatchCoordinator && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Batch</label>
            <select
              name="recipient"
              value={notification.recipient}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="">Choose a batch</option>
              {batches.map((batch, index) => (
                <option key={index} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Notification Message */}
        <div>
          <textarea
            name="message"
            placeholder="Notification message"
            value={notification.message}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mt-1"
            rows={4}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Send Notification
        </button>
      </form>
    </div>
  );
};

export default Notification;
