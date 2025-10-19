"use client";
import { useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setResponse("");
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a schematic image first.");
      return;
    }

    setLoading(true);
    setResponse("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/analyze-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResponse(res.data.explanation);
    } catch (error: any) {
      console.error(error);
      alert("Error analyzing the schematic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-10">SchematicSense AI Analyzer</h1>

      <div className="w-full max-w-lg bg-white/10 p-8 rounded-2xl shadow-xl backdrop-blur-lg">
        <div className="flex flex-col items-center">
          <label
            htmlFor="file-upload"
            className="cursor-pointer border border-gray-600 px-5 py-3 rounded-xl text-gray-300 hover:bg-white/10 transition-all"
          >
            {file ? file.name : "Choose a schematic image"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-6 w-full py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Schematic"}
          </button>
        </div>

        {response && (
          <div className="mt-8 p-4 bg-gray-900/60 rounded-lg text-gray-200 overflow-auto max-h-[300px]">
            <h2 className="text-xl font-semibold mb-2">AI Explanation</h2>
            <p className="whitespace-pre-wrap text-gray-300">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

