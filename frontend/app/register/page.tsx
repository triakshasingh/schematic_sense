"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      // Make API call to backend /register route
      const res = await axios.post("https://schematic-sense-api.onrender.com/register", {
        email,
        password,
      });

      if (res.status === 200) {
        alert("Registration successful! Please log in.");
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response) {
        if (error.response.status === 400) {
          alert("User already exists. Please log in instead.");
        } else {
          alert(`Error: ${error.response.data.detail || "Something went wrong"}`);
        }
      } else {
        alert("Server unreachable. Please check your internet or backend deployment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-white">
      <h1 className="text-4xl font-bold mb-6">Create Account</h1>

      <form
        onSubmit={handleRegister}
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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-400">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-indigo-400 hover:text-indigo-300 underline font-medium"
        >
          Log in
        </a>
      </p>
    </div>
  );
}
