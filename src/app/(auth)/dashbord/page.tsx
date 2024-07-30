"use client"
import React ,{useState} from 'react';
import Link from 'next/link';
import { useSearchParams} from "next/navigation";
import axios from 'axios';
import {signIn} from "next-auth/react"


export default function Login() {
    const params = useSearchParams()
    const[authState , setAuthstate]= useState({
        email:"",
        password:"",
    });
    
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setError] = useState<loginErrorType>({});


    const submitForm = () => {
        console.log("The Auth state is",authState)
        axios
        .post("/api/auth/login", authState)
        .then((res) => {
          setLoading(false);
          const response = res.data;
          console.log("The response is", res.data);
          if (response.status == 200) {
              signIn("credentials" ,{
                email:authState.email,
                password:authState.password,
                callbackUrl:"/page1",
                redirect: true ,
              })
          } else if (response?.status == 400) {
            setError(response?.errors);
          } else {
            setError({});
          }
        })
    }
  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        <div className="relative flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
          <div className="absolute inset-0">
            <img
              className="h-full w-full rounded-md object-cover object-top"
              src="https://rru.ac.in/wp-content/uploads/2021/07/RRU-Logo12.png"
              alt=""
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div> 
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign in</h2>
            <p className="mt-2 text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/Register"
                title=""
                className="font-semibold text-black transition-all duration-200 hover:underline"
              >
                Create a free account
              </Link>
            </p>
            {params.get("message") ? <p className='bg-green-400 font-bold FontSize(10) rounded-md p-4'>{params.get("message")}</p> : <></>}
            <form action="#" method="POST" className="mt-8">
              <div className="space-y-5">
                <div>
                  <label htmlFor="" className="text-base font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      placeholder="Email"
                      onChange={(e) => setAuthstate({...authState ,email:e.target.value})}
                    ></input>
                    <span className="text-red-500 font-bold">
                      {errors?.email}
                    </span>
                    
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="" className="text-base font-medium text-gray-900">
                      Password
                    </label>
                    <a
                      href="#"
                      title=""
                      className="text-sm font-semibold text-black hover:underline"
                    >
                      {' '}
                      Forgot password?{' '}
                    </a>
                  </div>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setAuthstate({...authState ,password:e.target.value})}
                    ></input>
                    <span className="text-red-500 font-bold">
                      {errors?.password}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    className={'inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 ${ loading ? "bg-gray-500" :"bg-black"}' }
                    onClick={submitForm}
                  >
                    {loading ? "processing" : "login" }
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-3 space-y-3">
              <button
                type="button"
                className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
              >
                <span className="mr-2 inline-block">
                  <svg
                    className="h-6 w-6 text-rose-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                  </svg>
                </span>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
