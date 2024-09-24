import React, { useState, useEffect } from "react";
import { IndianCalendar } from "../IndianCalendar";
import { StatCard } from "../StatCard";

const studentData = [
  { course: "BTech", students: 120 },
  { course: "MTech CS", students: 25 },
  { course: "MTech AI/ML", students: 20 },
  { course: "MSCDF", students: 30 },
];

const scheduleData = [
  { time: "11:00 PM", subject: "Data Structures", location: "Room 101" },
  { time: "11:00 PM", subject: "Database Management", location: "Lab 2" },
  { time: "10:00 PM", subject: "Algorithms", location: "Room 203" },
];

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Convert time to 12-hour format for comparison
  const formatTime = (time: Date) => {
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Filter schedule to show only upcoming events
  const upcomingEvents = scheduleData.filter((event) => {
    const eventTime = new Date();
    const [hour, minute] = event.time.split(/[: ]/);
    eventTime.setHours(+hour % 12 + (event.time.includes("PM") ? 12 : 0), +minute);
    return eventTime >= currentTime;
  });

  return (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Subjects" value={3} />
        <StatCard title="Total Students" value={42} />
        <StatCard title="Approved Leaves" value={4} />
      </div>

      {/* Schedule and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-4">Today's Schedule</h3>
          <p className="text-sm text-gray-500 mb-4">Current Time: {formatTime(currentTime)}</p>
          <ul className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <li
                  key={index}
                  className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-300"
                >
                  <p className="font-medium">{event.time} - {event.subject}</p>
                  <p className="text-sm text-gray-400">{event.location}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No more events for today.</p>
            )}
          </ul>
        </div>

        {/* Calendar */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg mb-4">Calendar</h3>
          <IndianCalendar />
        </div>
      </div>
      <br />
    </>
  );
};

export default Dashboard;
