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
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const submitForm = async () => {
    try {
      setLoading(true);
      setErrors({});

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authState),
      });

      const data = await res.json();
      if (!data.success) {
        setErrors({ general: data.message });
      } else {
        const role = data.role;

        switch (role) {
          case "Admin":
            router.push("/admin/dashboard");
            break;
          case "Staff":
            router.push("staff/dashboard");
            break;
          case "PlacementOfficer":
            router.push("po/dashboard");
            break;
          default:
            router.push("student/dashboard");
            break;
        }
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      setErrors({ general: "An error occurred during login." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f3f4f6] min-h-screen flex items-center justify-center sm:*:justify-">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-10">
          <Image
            src="/rru.png"
            alt="RRU Logo"
            className="mr-2"
            height={80}
            width={80}
            priority
          />
          <h1 className="text-4xl font-bold leading-tight text-black text-center flex-1">
            SITAICS
          </h1>
          <Image
            src="/sitaics.png"
            alt="SITAICS Logo"
            className="ml-2"
            width={80}
            height={80}
            priority
          />
        </div>

        {errors.general && (
          <p className="bg-red-400 font-bold rounded-md p-4 mt-4">
            {errors.general}
          </p>
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
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
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
                <span className="text-red-500 font-bold">
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
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
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
              {errors.password && (
                <span className="text-red-500 font-bold">
                  {errors.password}
                </span>
              )}
            </div>
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
              } hover:bg-black/80`}
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
