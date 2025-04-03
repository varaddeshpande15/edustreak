"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sushant from '../../../../assets/Images/loginImage.png';
import { Input } from "@/components/ui/input";
const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
        router.replace("/");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      if (res?.url) router.replace(res.url);
    } else {
      setError("");
    }
  };

  if (sessionStatus === 'loading') {
    return <p>Loading</p>;
  }

  return (
    <div className="bg-[url('/blur-bg.svg')] bg-cover flex justify-center items-center h-screen">
      <div className="bg-gray-200  p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
        <button
          onClick={() => router.push('/')}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-4 flex items-center justify-center">
            <div className="flex flex-col">
            <Image src={Sushant} alt="Sushant" />
            </div>
          </div>
          <div className="md:w-1/2 p-4">
            <h2 className="text-xl text-center mb-5">Login to your Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full p-2 border rounded text-black"
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full p-2 border rounded text-black"
              />
              <button type="submit" className="bg-purple-600 font-semibold w-full py-2 rounded text-white">
                Login
              </button>
              <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
            </form>
            <div className="mt-4">
            </div>
            <p className="text-center text-lg mt-4">
              Don't have an account? <a href="/signup" className="text-purple-400">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;