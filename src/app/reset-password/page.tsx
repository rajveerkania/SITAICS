"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "An error occurred.");
      } else {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          router.push("./");
        }, 2000);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("An unexpected error occurred.");
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="newPassword" className="text-base font-medium text-gray-900">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              required
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm border-gray-300 bg-transparent placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition duration-150 ease-in-out"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-base font-medium text-gray-900">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              className="flex h-10 w-full rounded-md border px-3 py-2 text-sm border-gray-300 bg-transparent placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition duration-150 ease-in-out"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <span className="text-red-500 font-bold mt-2 block">{error}</span>}
          {message && <span className="text-green-600 font-semibold mt-2 block">{message}</span>}
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
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
