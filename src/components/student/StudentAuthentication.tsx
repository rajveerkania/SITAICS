import React, { useState, useEffect } from "react";

interface AuthenticationProps {
  setIsAuthenticated: (value: boolean) => void;
  setStudentInfo: (info: StudentInfo) => void;
  handleLogout: () => void;
}

interface StudentInfo {
  name: string;
  fatherName: string;
  motherName: string;
  email: string;
  enrollmentNumber: string;
  courseName: string;
  semester: string;
  batchName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  contactNo: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

const StudentAuthentication: React.FC<AuthenticationProps> = ({
  setIsAuthenticated,
  setStudentInfo,
  handleLogout,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState<boolean>(false);

  const [studentFormData, setStudentFormData] = useState<StudentInfo>({
    name: "",
    fatherName: "",
    motherName: "",
    email: "",
    enrollmentNumber: "",
    courseName: "",
    semester: "",
    batchName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    contactNo: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const [errors, setErrors] = useState<Partial<StudentInfo>>({});

  useEffect(() => {
    const checkStudentData = async () => {
      const response = await apicalltocheckstudentsdata();
      if (response.dataExists && response.data) {
        setStudentInfo(response.data);
        setIsAuthenticated(true);
      } else {
        setIsProfileIncomplete(true);
      }
    };
    checkStudentData();
  }, [setIsAuthenticated, setStudentInfo]);

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
      case "dateOfBirth":
        errorMessage = /^\d{4}-\d{2}-\d{2}$/.test(value)
          ? ""
          : "Date of Birth must be in YYYY-MM-DD format";
        break;
      case "contactNo":
        errorMessage = /^\d{10}$/.test(value)
          ? ""
          : "Contact Number must be 10 digits";
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

  const validateStep = (): boolean => {
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
        if (!studentFormData.enrollmentNumber) {
          stepErrors.enrollmentNumber = "Enrollment Number is required";
          stepIsValid = false;
        }
        if (!studentFormData.courseName) {
          stepErrors.courseName = "Course is required";
          stepIsValid = false;
        }
        break;
      case 3:
        if (!studentFormData.semester) {
          stepErrors.semester = "Semester is required";
          stepIsValid = false;
        }
        if (!studentFormData.batchName) {
          stepErrors.batchName = "Batch Year is required";
          stepIsValid = false;
        }
        if (errors.dateOfBirth || !studentFormData.dateOfBirth) {
          stepErrors.dateOfBirth = errors.dateOfBirth || "Date of Birth is required";
          stepIsValid = false;
        }
        break;
      case 4:
        if (!studentFormData.gender) {
          stepErrors.gender = "Gender is required";
          stepIsValid = false;
        }
        if (errors.contactNo || !studentFormData.contactNo) {
          stepErrors.contactNo = errors.contactNo || "Contact Number is required";
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
                name="enrollmentNumber"
                placeholder="Enrollment Number"
                value={studentFormData.enrollmentNumber}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.enrollmentNumber && (
                <p className="text-red-500">{errors.enrollmentNumber}</p>
              )}
              <select
                name="courseName"
                value={studentFormData.courseName}
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
              {errors.courseName && <p className="text-red-500">{errors.courseName}</p>}
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
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
              {errors.semester && <p className="text-red-500">{errors.semester}</p>}
              <input
                type="text"
                name="batchName"
                placeholder="Batch Year"
                value={studentFormData.batchName}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.batchName && <p className="text-red-500">{errors.batchName}</p>}
              <input
                type="date"
                name="dateOfBirth"
                placeholder="Date of Birth"
                value={studentFormData.dateOfBirth}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.dateOfBirth && <p className="text-red-500">{errors.dateOfBirth}</p>}
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
              </select>
              {errors.gender && <p className="text-red-500">{errors.gender}</p>}
              <input
                type="text"
                name="contactNo"
                placeholder="Contact Number"
                value={studentFormData.contactNo}
                onChange={handleStudentInputChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.contactNo && <p className="text-red-500">{errors.contactNo}</p>}
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
              {errors.pinCode && <p className="text-red-500">{errors.pinCode}</p>}
            </>
          )}

          <div className="flex justify-between mt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={previousStep}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Previous
              </button>
            )}
            {currentStep < 5 && (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Next
              </button>
            )}
            {currentStep === 5 && (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
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
  // Simulated API call
  return new Promise<{ dataExists: boolean; data?: StudentInfo }>((resolve) => {
    setTimeout(() => {
      resolve({
        dataExists: false, // Change this to true to simulate existing data
        data: undefined, // or provide a valid StudentInfo object for testing
      });
    }, 1000);
  });
};

export default StudentAuthentication;
