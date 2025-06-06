"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { useSession } from "next-auth/react";
import Spinner from '@/components/Spinner';
import Image from "next/image";
import Sushant from '../../../../assets/Images/loginImage.png';
import { Input } from '@/components/ui/input';

const Register = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();
  
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push('/');
      }
    };
    checkSession();
  }, [router]);

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!isValidEmail(email)) {
      setError("Invalid Email");
      return;
    }

    if (!password || password.length < 8) {
      setError("Invalid Password");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("trying fastapi");
      const response = await fetch('http://127.0.0.1:8000/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (res.status === 400) {
        setError("This email is already registered");
      } else if (res.status === 201) {
        setError("");
        router.push("/login");
      } else {
        setError("Error, try again");
      }
    } catch (error) {
      setError("Error, try again");
      console.log(error);
    }
  };
  if (sessionStatus === 'loading') {
    return <Spinner />;
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
            <h2 className="text-xl text-center mb-5">Create an Account</h2>
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
                Sign Up
              </button>
              <p className="text-red-600 text-[16px] mb-4">{error && error}</p>
            </form>
            <div className="mt-4">
            </div>
            <p className="text-center text-lg mt-4">
              Already have an account? <a href="/login" className="text-purple-400">Log In</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
