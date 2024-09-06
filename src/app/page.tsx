"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import { Eye, EyeOff } from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function Login() {
  const router = useRouter();
  const [authState, setAuthState] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [skeleton, setSkeleton] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!authState.emailOrUsername) {
      errors.emailOrUsername = "Email or Username is required.";
    }
    if (!authState.password) {
      errors.password = "Password is required.";
    }
    if (!captchaToken) {
      errors.captcha = "Captcha not verified!";
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

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(authState),
      });

      if (res.ok) {
        setSkeleton(true);
      }

      const data = await res.json();
      if (!data.success) {
        setErrors({ emailOrUsername: "Incorrect Details" });
        return;
      }

      switch (data.role) {
        case "Admin":
          router.push("/admin/dashboard");
          break;
        case "Staff":
          router.push("/staff/dashboard");
          break;
        default:
          router.push("/student/dashboard");
          break;
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      setErrors({ emailOrUsername: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return skeleton ? (
    <LoadingSkeleton loadingText="Dashboard" />
  ) : (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 max-w-sm w-full">
        <div className="flex items-center justify-center mb-6">
          <Image
            src="/rru.png"
            alt="RRU Logo"
            className="h-auto w-14 sm:w-16"
            height={64}
            width={64}
            priority
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-center mx-4">
            SITAICS
          </h1>
          <Image
            src="/sitaics.png"
            alt="SITAICS Logo"
            className="h-auto w-14 sm:w-16"
            height={64}
            width={64}
            priority
          />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="emailOrUsername"
              className="text-sm sm:text-base font-medium text-gray-900"
            >
              Email address or Username
            </label>
            <div className="mt-1">
              <input
                className={`block w-full rounded-lg border px-3 py-2 text-sm sm:text-base ${
                  errors.emailOrUsername ? "border-red-500" : "border-gray-300"
                } bg-transparent placeholder-gray-400 focus:outline-none focus:ring-1 ${
                  errors.emailOrUsername
                    ? "focus:ring-red-500"
                    : "focus:ring-gray-400"
                }`}
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
                <span className="text-red-500 font-bold mt-1 block">
                  {errors.emailOrUsername}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <label
                htmlFor="password"
                className="text-sm sm:text-base font-medium text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-1 relative">
              <input
                className={`block w-full rounded-lg border px-3 py-2 text-sm sm:text-base ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } bg-transparent placeholder-gray-400 focus:outline-none focus:ring-1 ${
                  errors.password ? "focus:ring-red-500" : "focus:ring-gray-400"
                } pr-10`}
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
              <span className="text-red-500 font-bold mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-black hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="mt-4">
            <ReCAPTCHA
              sitekey="6Ldx5i8qAAAAAGNuXmx6IP-LjQG7Zhwc9f7VSr3R"
              onChange={(token) => setCaptchaToken(token)}
              className="w-full"
            />
          </div>
          {errors.captcha && (
            <span className="text-red-500 font-bold mt-2 block">
              {errors.captcha}
            </span>
          )}

          <div>
            <button
              type="submit"
              className={`block w-full rounded-lg px-4 py-2.5 font-semibold text-white ${
                loading ? "bg-gray-500" : "bg-black"
              } hover:bg-black/80 transition duration-150 ease-in-out ${
                loading ? "cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
