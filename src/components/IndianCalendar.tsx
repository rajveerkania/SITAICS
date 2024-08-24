import React from "react";
import { useState } from "react";
import { Button } from "./ui/button";

export function IndianCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handlePrevMonth}>&lt;</Button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <Button onClick={handleNextMonth}>&gt;</Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-semibold">
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
            className={`text-center p-2 ${
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()
                ? "bg-black text-white rounded-full"
                : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
