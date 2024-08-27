import React, { useState } from "react";

const Feedback: React.FC = () => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle feedback submission here
    console.log("Feedback submitted:", feedback);
    // Reset the form
    setFeedback("");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Provide Feedback</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback"
          className="border p-2 w-full rounded-md h-32"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default Feedback;