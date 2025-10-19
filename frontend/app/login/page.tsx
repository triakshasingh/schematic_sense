"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "test@example.com" && password === "1234") {
      router.push("/dashboard");
    } else {
      alert("Invalid credentials. Try test@example.com / 1234");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-white">
      <h1 className="text-4xl font-bold mb-6">Sign In</h1>
      <form onSubmit={handleLogin} className="w-80 bg-white/10 p-6 rounded-2xl backdrop-blur-md">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 bg-transparent border-b border-gray-500 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-6 bg-transparent border-b border-gray-500 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
