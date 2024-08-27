"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [authState, setAuthState] = useState({
    emailOrUsername: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!authState.role) {
      errors.role = "Please select a role.";
    }
    if (!authState.emailOrUsername) {
      errors.emailOrUsername = "Email or Username is required.";
    }
    if (!authState.password) {
      errors.password = "Password is required.";
    }
    return errors;
  };

  const submitForm = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      setDialogMessage("");

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authState),
      });

      const data = await res.json();
      if (!data.success) {
        setDialogMessage("Incorrect username or password.");
      } else {
        setDialogMessage("Login successful!");
        setTimeout(() => {
          switch (authState.role) {
            case "Admin":
              router.push("/admin/dashboard");
              break;
            case "Staff":
              router.push("staff/dashboard");
              break;
            default:
              router.push("student/dashboard");
              break;
          }
        }, 1500);
      }

      // Add the timeout to hide the dialog message after 3 seconds
      setTimeout(() => {
        setDialogMessage("");
      }, 3000);
    } catch (error) {
      console.error("An error occurred during login:", error);
      setDialogMessage("An error occurred during login.");

      // Add the timeout to hide the error message after 3 seconds
      setTimeout(() => {
        setDialogMessage("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative">
      {dialogMessage && (
        <div
          className={`absolute top-8 left-1/2 transform -translate-x-1/2 p-4 rounded-md text-white z-50 ${
            dialogMessage === "Login successful!"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {dialogMessage}
        </div>
      )}
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full transform transition-transform duration-300 ease-in-out hover:scale-105">
        <div className="flex flex-col items-center justify-center mb-10 space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
          <Image
            src="/rru.png"
            alt="RRU Logo"
            className="h-auto w-20 sm:w-24"
            height={80}
            width={80}
            priority
          />
          <h1 className="text-4xl font-bold leading-tight text-black text-center">
            SITAICS
          </h1>
          <Image
            src="/sitaics.png"
            alt="SITAICS Logo"
            className="h-auto w-20 sm:w-24"
            width={80}
            height={80}
            priority
          />
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="Student"
              onChange={(e) =>
                setAuthState({ ...authState, role: e.target.value })
              }
              className="form-radio"
            />
            <span className="ml-2 text-base text-gray-900">Student</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="Admin"
              onChange={(e) =>
                setAuthState({ ...authState, role: e.target.value })
              }
              className="form-radio"
            />
            <span className="ml-2 text-base text-gray-900">Admin</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="Staff"
              onChange={(e) =>
                setAuthState({ ...authState, role: e.target.value })
              }
              className="form-radio"
            />
            <span className="ml-2 text-base text-gray-900">Staff</span>
          </label>
        </div>
        {errors.role && (
          <p className="text-red-500 font-bold mb-4">{errors.role}</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="emailOrUsername"
              className="text-base font-medium text-gray-900"
            >
              Email address or Username
            </label>
            <div className="mt-2">
              <input
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                  errors.emailOrUsername
                    ? "border-red-500"
                    : "border-gray-300"
                } bg-transparent placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                  errors.emailOrUsername
                    ? "focus:ring-red-500"
                    : "focus:ring-gray-400"
                } focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition duration-150 ease-in-out`}
                type="text"
                placeholder="Email or Username"
                onChange={(e) =>
                  setAuthState({
                    ...authState,
                    emailOrUsername: e.target.value,
                  })
                }
              />
              {errors.emailOrUsername && (
                <span className="text-red-500 font-bold mt-2 block">
                  {errors.emailOrUsername}
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-base font-medium text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2 relative">
              <input
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } bg-transparent placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                  errors.password ? "focus:ring-red-500" : "focus:ring-gray-400"
                } focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 pr-10 transition duration-150 ease-in-out`}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) =>
                  setAuthState({ ...authState, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 font-bold mt-2 block animate-pulse">
                {errors.password}
              </span>
            )}
            <div className="mt-3 flex">
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-black hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className={`inline-flex w-full items-center justify-center rounded-md px-3.5 py-2.5 font-semibold leading-7 text-white ${
                loading ? "bg-gray-500" : "bg-black"
              } hover:bg-black/80 transition duration-150 ease-in-out transform ${
                loading ? "scale-95" : "hover:scale-105"
              }`}
              disabled={loading}
            >
              {loading ? "Authenticating" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
