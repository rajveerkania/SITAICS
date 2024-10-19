import React, { useState } from "react";
import { Button } from "./ui/button";

interface Event {
  date: number;
  month: number;
  year: number;
  description: string;
}

const events: Event[] = [
  { date: 5, month: 9, year: 2024, description: "Meeting with team" },
  { date: 10, month: 9, year: 2024, description: "Project deadline" },
  { date: 15, month: 9, year: 2024, description: "Workshop on React" },
  // Add more events with appropriate month and year
];

export function IndianCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Filter events based on the selected month and year
  const filteredEvents = events.filter(
    (event) =>
      event.month === currentDate.getMonth() + 1 &&
      event.year === currentDate.getFullYear() &&
      event.date === selectedDate
  );

  // Format selected date for the pop-up header
  const formattedDate = selectedDate
    ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate).toLocaleDateString("en-IN", {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : "";

  // Inline CSS for animation
  const popUpAnimation = {
    animation: 'pop-up 0.3s ease-in-out',
  };

  // Define the animation in inline style
  const style = {
    '@keyframes pop-up': {
      from: {
        opacity: 0,
        transform: 'scale(0.9)',
      },
      to: {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
  };

  return (
    <div className="w-full max-w-sm mx-auto relative">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrevMonth} className="text-gray-600 hover:text-gray-800">&lt;</Button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <Button onClick={handleNextMonth} className="text-gray-600 hover:text-gray-800">&gt;</Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-700">
            {day}
          </div>
        ))}
        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
        {days.map((day) => (
          <div
            key={day}
            onClick={() => handleDateClick(day)}
            className={`text-center p-2 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 ${
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()
                ? "bg-black text-white rounded-full"
                : "hover:bg-gray-200"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Modern Pop-Up for Events */}
      {showPopup && selectedDate !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg relative max-w-sm w-full"
            style={popUpAnimation}
          >
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Events on {formattedDate}</h3>
            <ul className="space-y-2">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <li key={index} className="bg-gray-100 p-2 rounded-lg shadow-sm">
                    {event.description}
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No events for this date.</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
