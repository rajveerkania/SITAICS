import React, { useState, useEffect } from "react";

interface AuthenticationProps {
  setIsAuthenticated: (value: boolean) => void;
  setStudentInfo: (info: any) => void;
  handleLogout: () => void;
}

const StudentAuthentication: React.FC<AuthenticationProps> = ({
  setIsAuthenticated,
  setStudentInfo,
  handleLogout,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);

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

  const [errors, setErrors] = useState({
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

  useEffect(() => {
    const checkStudentData = async () => {
      const response = await apicalltocheckstudentsdata();
      if (response.dataExists) {
        setStudentInfo(response.data);
        setIsAuthenticated(true);
      } else {
        setIsProfileIncomplete(true);
      }
    };
    checkStudentData();
  }, []);

  const handleStudentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStudentFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validation logic
    let errorMessage = "";
    switch (name) {
      case "email":
        errorMessage = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Invalid email address";
        break;
      case "dob":
        errorMessage = /^\d{4}-\d{2}-\d{2}$/.test(value)
          ? ""
          : "Date of Birth must be in YYYY-MM-DD format";
        break;
      case "mobileNo":
        errorMessage = /^\d{10}$/.test(value)
          ? ""
          : "Mobile number must be 10 digits";
        break;
      case "pinCode":
        errorMessage = /^\d{6}$/.test(value)
          ? ""
          : "Pin Code must be 6 digits";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const validateStep = () => {
    let stepIsValid = true;
    let stepErrors = { ...errors };

    switch (currentStep) {
      case 1:
        if (!studentFormData.name) {
          stepErrors.name = "Full Name is required";
          stepIsValid = false;
        }
        if (!studentFormData.fatherName) {
          stepErrors.fatherName = "Father's Name is required";
          stepIsValid = false;
        }
        if (!studentFormData.motherName) {
          stepErrors.motherName = "Mother's Name is required";
          stepIsValid = false;
        }
        break;
      case 2:
        if (errors.email || !studentFormData.email) {
          stepErrors.email = errors.email || "Email is required";
          stepIsValid = false;
        }
        if (!studentFormData.enrollmentNo) {
          stepErrors.enrollmentNo = "Enrollment Number is required";
          stepIsValid = false;
        }
        if (!studentFormData.course) {
          stepErrors.course = "Course is required";
          stepIsValid = false;
        }
        break;
      case 3:
        if (!studentFormData.semester) {
          stepErrors.semester = "Semester is required";
          stepIsValid = false;
        }
        if (!studentFormData.batchNo) {
          stepErrors.batchNo = "Batch Year is required";
          stepIsValid = false;
        }
        if (errors.dob || !studentFormData.dob) {
          stepErrors.dob = errors.dob || "Date of Birth is required";
          stepIsValid = false;
        }
        break;
      case 4:
        if (!studentFormData.gender) {
          stepErrors.gender = "Gender is required";
          stepIsValid = false;
        }
        if (errors.mobileNo || !studentFormData.mobileNo) {
          stepErrors.mobileNo = errors.mobileNo || "Mobile Number is required";
          stepIsValid = false;
        }
        break;
      case 5:
        if (!studentFormData.address) {
          stepErrors.address = "Address is required";
          stepIsValid = false;
        }
        if (!studentFormData.city) {
          stepErrors.city = "City is required";
          stepIsValid = false;
        }
        if (!studentFormData.state) {
          stepErrors.state = "State is required";
          stepIsValid = false;
        }
        if (errors.pinCode || !studentFormData.pinCode) {
          stepErrors.pinCode = errors.pinCode || "Pin Code is required";
          stepIsValid = false;
        }
        break;
      default:
        break;
    }

    setErrors(stepErrors);
    return stepIsValid;
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateStep()) {
      setStudentInfo(studentFormData);
      setIsAuthenticated(true);
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  if (!isProfileIncomplete) {
    return <div>Loading...</div>;
  }

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
                maxLength={30}
                value={studentFormData.name}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
              <input
                type="text"
                name="fatherName"
                placeholder="Father's Name"
                maxLength={30}
                value={studentFormData.fatherName}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.fatherName && (
                <p className="text-red-500">{errors.fatherName}</p>
              )}
              <input
                type="text"
                name="motherName"
                placeholder="Mother's Name"
                maxLength={30}
                value={studentFormData.motherName}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.motherName && (
                <p className="text-red-500">{errors.motherName}</p>
              )}
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
              {errors.email && <p className="text-red-500">{errors.email}</p>}
              <input
                type="text"
                name="enrollmentNo"
                placeholder="Enrollment Number"
                value={studentFormData.enrollmentNo}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.enrollmentNo && (
                <p className="text-red-500">{errors.enrollmentNo}</p>
              )}
              <select
                name="course"
                value={studentFormData.course}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Course</option>
               
                <option value="BTech">BTech</option>
                <option value="MTech">MTech</option>
                <option value="MTech AI/ML">MTech AI/ML</option>
                <option value="MSCDF">MSCDF</option>
              </select>
              {errors.course && <p className="text-red-500">{errors.course}</p>}
            </>
          )}
          {currentStep === 3 && (
            <>
              <select
              name="semester"
              value={studentFormData.semester}
              onChange={handleStudentInputChange}
              className="w-full p-2 border rounded"
              required
              >
  <option value="">Select Semester</option>
  {Array.from({ length: 8 }, (_, i) => (
    <option key={i + 1} value={i + 1}>
      Semester {i + 1}
    </option>
  ))}
</select>

              {errors.semester && (
                <p className="text-red-500">{errors.semester}</p>
              )}
              <input
                type="text"
                name="batchNo"
                placeholder="Batch Year"
                value={studentFormData.batchNo}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.batchNo && <p className="text-red-500">{errors.batchNo}</p>}
              <input
                type="text"
                name="dob"
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={studentFormData.dob}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.dob && <p className="text-red-500">{errors.dob}</p>}
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
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500">{errors.gender}</p>}
              <input
                type="text"
                name="mobileNo"
                placeholder="Mobile Number"
                value={studentFormData.mobileNo}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.mobileNo && (
                <p className="text-red-500">{errors.mobileNo}</p>
              )}
            </>
          )}
          {currentStep === 5 && (
            <>
              <textarea
                name="address"
                placeholder="Address"
                value={studentFormData.address}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.address && <p className="text-red-500">{errors.address}</p>}
              <input
                type="text"
                name="city"
                placeholder="City"
                value={studentFormData.city}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.city && <p className="text-red-500">{errors.city}</p>}
              <input
                type="text"
                name="state"
                placeholder="State"
                value={studentFormData.state}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.state && <p className="text-red-500">{errors.state}</p>}
              <input
                type="text"
                name="pinCode"
                placeholder="Pin Code"
                value={studentFormData.pinCode}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.pinCode && (
                <p className="text-red-500">{errors.pinCode}</p>
              )}
            </>
          )}

          <div className="flex justify-between mt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={previousStep}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Previous
              </button>
            )}
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
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

const apicalltocheckstudentsdata = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    dataExists: false, 
    data: {}, 
  };
};

export default StudentAuthentication;
