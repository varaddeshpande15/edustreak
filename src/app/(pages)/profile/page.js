"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [studyPlans, setStudyPlans] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/studyPlan.json") // Assuming studyPlans.json is in /public
      .then((res) => res.json())
      .then((data) => {
        setStudyPlans([data]); // Ensure it's an array
      })
      .catch((error) => console.error("Error loading study plans:", error));
  }, []);

  const handleQuizRedirect = (playlist) => {
    const encodedPlaylist = encodeURIComponent(playlist.trim().toLowerCase());
    router.push(`/quiz?playlist=${encodedPlaylist}`);
  };

  const handleFlashcardsRedirect = (playlist) => {
    const encodedPlaylist = encodeURIComponent(playlist.trim().toLowerCase());
    router.push(`/flashcards?playlist=${encodedPlaylist}`);
  };

  const handleSummarizeRedirect = (playlist) => {
    const encodedPlaylist = encodeURIComponent(playlist.trim().toLowerCase());
    router.push(`/summary-gen?playlist=${encodedPlaylist}`);
  };

  return (
    <div className="container mx-auto p-4 w-full">
      <h1 className="text-2xl font-semibold mb-4">Your Study Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studyPlans.map((plan, index) => {
          const subdomain = encodeURIComponent(plan.playlist.trim().toLowerCase());
          const studyPlanUrl = `${subdomain}`;

          return (
            <div key={index} className="border p-4 rounded-lg shadow-lg bg-white w-full md:w-100 lg:w-128">
              <h2 className="text-xl font-bold">{plan.playlist}</h2>
              <p className="text-sm text-gray-600">Total Videos: {plan.total_videos}</p>
              <p className="text-sm text-gray-600">Deadline: {plan.deadline}</p>
              <div className="mt-2 flex space-x-2">
                <a href={studyPlanUrl} target="_blank" rel="noopener noreferrer"
                   className="bg-blue-500 text-white px-4 py-2 rounded">
                  Open Study Plan
                </a>
                <button 
                  onClick={() => handleQuizRedirect(plan.playlist)}
                  className="bg-green-500 text-white px-4 py-2 rounded">
                  Take a Quiz
                </button>
                <button 
                  onClick={() => handleFlashcardsRedirect(plan.playlist)}
                  className="bg-purple-500 text-white px-4 py-2 rounded">
                  Generate Flashcards
                </button>
                <button 
                  onClick={() => handleSummarizeRedirect(plan.playlist)}
                  className="bg-orange-500 text-white px-4 py-2 rounded">
                  AI Summarize
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
