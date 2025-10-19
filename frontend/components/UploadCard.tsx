"use client";
import React, { useState } from "react";
import axios from "axios";

const UploadCard: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an image or video file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/analyze-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data.response || "No response received.");
    } catch (error) {
      console.error(error);
      setResult("Error analyzing the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 px-4">
      <div className="bg-zinc-900/70 backdrop-blur-lg border border-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-xl hover:shadow-2xl transition-all duration-300">
        <h1 className="text-3xl font-semibold mb-4 text-center text-indigo-400">
          SchematicSense
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Upload a schematic to analyze with AI
        </p>

        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-400 
                       file:mr-4 file:py-2 file:px-4 
                       file:rounded-full file:border-0 
                       file:text-sm file:font-semibold 
                       file:bg-indigo-600 file:text-white 
                       hover:file:bg-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-all"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>

        {loading && (
          <div className="mt-4 text-center text-cyan-400 animate-pulse">
            Processing schematic...
          </div>
        )}

        {result && (
          <div className="mt-6 bg-zinc-800 p-4 rounded-xl text-sm border border-zinc-700">
            <h2 className="text-cyan-400 mb-2 font-semibold">AI Analysis:</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCard;
