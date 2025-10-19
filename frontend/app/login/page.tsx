"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        email,
        password,
      });

      if (res.status === 200) {
        alert("Login successful!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response) {
        alert(error.response.data.detail || "Invalid credentials");
      } else {
        alert("Server unreachable. Please check your connection or backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-white">
      <h1 className="text-4xl font-bold mb-6">Login</h1>

      <form
        onSubmit={handleLogin}
        className="w-80 bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl"
      >
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 bg-transparent border-b border-gray-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-6 bg-transparent border-b border-gray-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-400">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="text-indigo-400 hover:text-indigo-300 underline font-medium"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}


