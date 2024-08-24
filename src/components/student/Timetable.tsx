import React from "react";

interface TimetableRow {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
}

const Timetable: React.FC = () => {
  const timetableData: TimetableRow[] = [
    {
      time: "09:30 AM to 10:30 AM",
      monday: "11010503DS02 (GMP)",
      tuesday: "Self study/Library (Skd)",
      wednesday: "00019303AE01 (RRP)",
      thursday: "Self study/Library (Kpp)",
      friday: "",
      saturday: "03010503SE01 (SAS)",
    },
    {
      time: "10:30 AM to 11:30 AM",
      monday: "Self study/Library (Kpp)",
      tuesday: "11010503DS02 (GMP)",
      wednesday: "11010503DS02 (GMP)",
      thursday: "11010503DS03 (SAS)",
      friday: "11010503DS04 (PPK)",
      saturday: "MOOC Course (Skd)",
    },
    // Add more timetable rows as needed
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Student Timetable</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Time Slot</th>
              <th className="border p-2">Monday</th>
              <th className="border p-2">Tuesday</th>
              <th className="border p-2">Wednesday</th>
              <th className="border p-2">Thursday</th>
              <th className="border p-2">Friday</th>
              <th className="border p-2">Saturday</th>
            </tr>
          </thead>
          <tbody>
            {timetableData.map((row, index) => (
              <tr key={index}>
                <td className="border p-2">{row.time}</td>
                <td className="border p-2">{row.monday}</td>
                <td className="border p-2">{row.tuesday}</td>
                <td className="border p-2">{row.wednesday}</td>
                <td className="border p-2">{row.thursday}</td>
                <td className="border p-2">{row.friday}</td>
                <td className="border p-2">{row.saturday}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;