import React, { useState } from "react";

interface AuthenticationProps {
  setIsAuthenticated: (value: boolean) => void;
  setStudentInfo: (info: any) => void;
}

const StudentAuthentication: React.FC<AuthenticationProps> = ({
  setIsAuthenticated,
  setStudentInfo,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [studentFormData, setStudentFormData] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    email: "",
    enrollmentNo: "",
    course: "",
    semester: "",
    batchNo: "",
    dob: "",
    gender: "",
    mobileNo: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const handleStudentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStudentFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentInfo(studentFormData);
    setIsAuthenticated(true);
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Profile Details</h1>
        <form onSubmit={handleStudentSubmit} className="space-y-4">
          {currentStep === 1 && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={studentFormData.name}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="fatherName"
                placeholder="Father's Name"
                value={studentFormData.fatherName}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="motherName"
                placeholder="Mother's Name"
                value={studentFormData.motherName}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </>
          )}
          {currentStep === 2 && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={studentFormData.email}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="enrollmentNo"
                placeholder="Enrollment Number"
                value={studentFormData.enrollmentNo}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="course"
                placeholder="Course"
                value={studentFormData.course}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </>
          )}
          {currentStep === 3 && (
            <>
              <input
                type="text"
                name="semester"
                placeholder="Semester"
                value={studentFormData.semester}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="batchNo"
                placeholder="Batch Number"
                value={studentFormData.batchNo}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={studentFormData.dob}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </>
          )}
          {currentStep === 4 && (
            <>
              <select
                name="gender"
                value={studentFormData.gender}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                name="mobileNo"
                placeholder="Mobile Number"
                value={studentFormData.mobileNo}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="address"
                placeholder="Address"
                value={studentFormData.address}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </>
          )}
          {currentStep === 5 && (
            <>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={studentFormData.city}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={studentFormData.state}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="pinCode"
                placeholder="Pin Code"
                value={studentFormData.pinCode}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </>
          )}

          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={previousStep}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Previous
              </button>
            )}
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentAuthentication;
