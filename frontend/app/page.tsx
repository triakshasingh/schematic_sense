import UploadCard from "../components/UploadCard";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0c4a6e] text-white">
      <UploadCard />
      <footer className="mt-20 text-gray-400 text-sm">© 2025 SchematicSense AI</footer>
    </main>
  );
}
