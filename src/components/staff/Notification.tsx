import React, { useState } from "react";

const Notification: React.FC = () => {
  const [notification, setNotification] = useState({
    recipient: "",
    message: "",
  });

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { name, value } = e.target;

    setNotification((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    // Add your submit logic here
    console.log("Notification sent:", notification);
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Send Notification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="recipient"
          placeholder="Recipient (Student ID or 'All')"
          value={notification.recipient}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="message"
          placeholder="Notification message"
          value={notification.message}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-black hover:bg-black text-white font-bold py-2 px-4 rounded"
        >
          Send Notification
        </button>
      </form>
    </div>
  );
};

export default Notification;