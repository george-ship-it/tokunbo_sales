"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus]);

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    try {
      const res = await fetch("/api/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      if (res.status === 400) {
        setError("User with this email is not registered");
        toast.error("User with this email is not registered");
      }
      if (res.status === 200) {
        setError("");
        router.push("/login");
        toast.success("Reset link sent to your email!");
      }
    } catch (error) {
      setError("Error, try again");
      toast.error("Error, try again");
      console.log(error);
    }
  };

  if (sessionStatus === "loading") {
    return <h1 className="text-center text-gray-500">Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl sm:text-3xl text-center text-red-500 font-semibold mb-6">
            Forgot Password
          </h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-blue-400"
              placeholder="Email"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Submit
            </button>
            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
          </form>
          <div className="text-center text-gray-500 my-4">- OR -</div>
          <Link
            className="block text-center text-blue-500 hover:underline"
            href="/login"
          >
            Login Here
          </Link>
        </div>
      </div>
    )
  );
};

export default ForgetPassword;