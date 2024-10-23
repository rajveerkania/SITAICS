"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ForgotPassword() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState(""); 

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!emailOrUsername) {
      errors.emailOrUsername = "Email or Username is required.";
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
      setSuccessMessage(""); 

      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailOrUsername }),
      });

      const data = await res.json();
      if (!data.success) {
        setErrors({ emailOrUsername: "No account found with that information" });
        return;
      }

      setSuccessMessage("Request has been shared with the existing email address."); 
      
      setTimeout(() => {
        router.push("./");
      }, 2000); 
    } catch (error) {
      console.error("An error occurred during password reset:", error);
      setErrors({ emailOrUsername: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 max-w-md w-full transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-row items-center justify-between mb-6 sm:mb-10">
          <Image
            src="/rru.png"
            alt="RRU Logo"
            className="h-auto w-12 sm:w-20"
            height={64}
            width={64}
            priority
          />
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight text-black text-center">
            SITAICS
          </h1>
          <Image
            src="/sitaics.png"
            alt="SITAICS Logo"
            className="h-auto w-12 sm:w-20"
            width={64}
            height={64}
            priority
          />
        </div>

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
                  errors.emailOrUsername ? "border-red-500" : "border-gray-300"
                } bg-transparent placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                  errors.emailOrUsername
                    ? "focus:ring-red-500"
                    : "focus:ring-gray-400"
                } focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition duration-150 ease-in-out`}
                type="text"
                placeholder="Email or Username"
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
              {errors.emailOrUsername && (
                <span className="text-red-500 font-bold mt-2 block">
                  {errors.emailOrUsername}
                </span>
              )}
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
              {loading ? "Sending Request" : "Reset Password"}
            </button>
          </div>
        </form>

        {successMessage && (
          <div className="mt-4 text-green-600 font-semibold text-center">
            {successMessage}
          </div>
        )}
      </div>
    </section>
  );
}
