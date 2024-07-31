"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [authState, setAuthState] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);

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

      if (res.ok) {
        const result = await signIn("credentials", {
          emailOrUsername: authState.emailOrUsername,
          password: authState.password,
          redirect: false,
        });

        if (result?.error) {
          setErrors({ general: result.error });
        } else {
          const role = data.role;

          switch (role) {
            case "Admin":
              router.push("/admin/dashboard");
              break;
            case "FacultyStaff":
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
      } else {
        setErrors({ general: data.error || "An error occurred during login." });
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      setErrors({ general: "An error occurred during login." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        <div className="relative flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
          <div className="absolute inset-0">
            <Image
              className="h-full w-full rounded-md object-cover object-top"
              src="/logo.png"
              alt="RRU LOGO"
              width={500}
              height={500}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h1 className="text-6xl font-bold leading-tight text-black sm:text-5xl">
              SITAICS
            </h1>

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
              className="mt-8"
            >
              <div className="space-y-5">
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
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      onChange={(e) =>
                        setAuthState({ ...authState, password: e.target.value })
                      }
                    />
                    <div className="mt-3 p-1 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center">
                        <input
                          id="show-password"
                          type="checkbox"
                          checked={showPassword}
                          onChange={() => setShowPassword(!showPassword)}
                          className="mr-2"
                        />
                        <label
                          htmlFor="show-password"
                          className="text-sm font-semibold text-black"
                        >
                          Show Password
                        </label>
                      </div>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-semibold text-black hover:underline mt-2 lg:mt-0"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    {errors.password && (
                      <span className="text-red-500 font-bold">
                        {errors.password}
                      </span>
                    )}
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
