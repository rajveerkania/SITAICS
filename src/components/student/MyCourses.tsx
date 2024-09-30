import React from 'react';

interface Course {
  name: string;
  specialization: string;
  period: string;
  batch: string;
  batchCoordinator: string;
}

const MyCourse: React.FC = () => {
  // This is dummy data. In a real application, you'd fetch this from an API
  const course: Course = {
    name: 'Bachelors in Computer Science',
    specialization: 'Cyber Security',
    period: 'Current semester',
    batch: 'BTech 2021-2025',
    batchCoordinator: 'Dr. John Doe'
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-black-500 font-semibold">My Enrolled Course</div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">{course.name}</h1>
          <p className="mt-2 text-gray-500">Specialization in {course.specialization}</p>
          <div className="mt-4">
            <p><strong>Period:</strong> {course.period}</p>
            <p><strong>Batch:</strong> {course.batch}</p>
            <p><strong>Batch Coordinator:</strong> {course.batchCoordinator}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourse;