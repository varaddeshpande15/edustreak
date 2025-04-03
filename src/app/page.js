"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Youtube } from "lucide-react"

export default function Home() {
  const router = useRouter();
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    const playlistId = playlistUrl.split("list=")[1]?.split("&")[0]; // Extract ID from URL

    if (!playlistId) {
      alert("Invalid playlist URL!");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(
        `/api/playlist?playlistId=${playlistId}`
      );
      setInsights(data);
    } catch (error) {
      alert("Error fetching playlist data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">StudyPlanner</h1>
        </div>
        <Link
          href="#features"
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Start Planning
        </Link>
      </header> */}

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Plan Your Self-Study Journey</h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            Organize your learning materials and create effective study plans with our intuitive tools.
          </p>
        </section>

        <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* YouTube Insights Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 flex flex-col">
            <div className="rounded-full bg-blue-100 p-3 w-fit mb-4">
              <Youtube className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">YouTube Insights</h3>
            <p className="text-gray-600 mb-6 flex-grow">
              Extract key topics and concepts from educational videos to enhance your study materials.
            </p>
            <button onClick={() => router.push("/playlist-insights")} className="mt-auto w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none cursor-pointer">
              Get Started
            </button>
          </div>

          {/* Talk to PDF Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 flex flex-col">
            <div className="rounded-full bg-blue-100 p-3 w-fit mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Talk to PDF</h3>
            <p className="text-gray-600 mb-6 flex-grow">
              Summarize and interact with your PDF documents to quickly extract important information.
            </p>
            <button onClick={() => router.push("/upload")} className=" cursor-pointer mt-auto w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
              Get Started
            </button>
          </div>

          {/* Text Input Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 flex flex-col">
            <div className="rounded-full bg-blue-100 p-3 w-fit mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Text Input</h3>
            <p className="text-gray-600 mb-6 flex-grow">
              Manually enter study topics and create custom study plans tailored to your learning goals.
            </p>
            <button onClick={() => router.push("/chatbot")} className="cursor-pointer mt-auto w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
              Get Started
            </button>
          </div>
        </section>

        <section className="mt-16 text-center">
          <Link
            href="/playlist-insights"
            className="inline-flex items-center justify-center py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Start Your Study Plan Now
          </Link>
        </section>
      </main>

      <footer className="bg-gray-50 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} StudyPlanner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
