"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
const CompletePlanPage = () => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [studyPlan, setStudyPlan] = useState(null);
  const [studyPlanUrl, setStudyPlanUrl] = useState(null);

  useEffect(() => {
    const fetchStudyPlan = async () => {
      try {
        const { data } = await axios.get("/api/studyPlan");
        setStudyPlan(data.studyPlan);
      } catch (error) {
        console.error("Error fetching study plan:", error);
      }
    };
    fetchStudyPlan();
  }, []);

  const formatDateToWords = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDeploy = async () => {
    if (!session?.user?.email) {
      alert("You must be logged in to deploy your study plan.");
      return;
    }

    try {
      const response = await axios.post("/api/deployStudyPlan", {
        email: session.user.email,
      });

      if (!response.data.playlist) {
        alert("Failed to retrieve playlist name.");
        return;
      }

      const playlist = encodeURIComponent(response.data.playlist);
      const url = `http://localhost:3000/${playlist}`;
      setStudyPlanUrl(url);

      alert(response.data.message);
    } catch (error) {
      console.error("Error deploying study plan:", error);
      alert("Failed to deploy study plan.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Confirm Study Plan</h1>

      {/* Study Plan Overview */}
      <div className="w-full max-w-4xl bg-white p-6 shadow-md rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">{studyPlan?.playlist || "Your Study Plan"}</h2>
        {/* <p className="text-gray-600"><strong>Start Date:</strong> {formatDateToWords(studyPlan.start_date)}</p>
          <p className="text-gray-600"><strong>Deadline:</strong> {formatDateToWords(studyPlan.deadline)}</p> */}

        {studyPlan?.daily_schedule?.map((day, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-100">
            <h3 className="text-lg font-semibold text-gray-700">Day {day.day}: {formatDateToWords(day.date)}</h3>
            <p className="text-sm text-gray-700">🕒 {day.total_minutes} mins</p>
            <p className="text-sm italic text-gray-600">{day.notes}</p>

            {day.videos.map((video, i) => (
              <div key={i} className="mt-2">
                <p className="font-medium">{video.title}</p>
                <p className="text-sm text-gray-500">Duration: {video.duration} mins</p>
                <p className="text-sm text-gray-500">Status: {video.completed ? "✅ Completed" : "⏳ Pending"}</p>
                <iframe
                  width="80%"
                  height="350"
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-md shadow-md mt-2"
                ></iframe>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Fixed Deploy Button */}
      <div className="fixed bottom-10 left-0 w-full flex justify-center">
        <button
          onClick={handleDeploy}
          className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2 hover:bg-blue-600 transition-all"
          disabled={loading}
        >
          {loading ? "Deploying..." : <><CheckCircle size={20} /> Deploy Study Plan</>}
        </button>
      </div>

      {/* Pop-out Dialog for Deployment Confirmation */}
      {/* Deployment Link */}
      {/* Deployment Link */}
      {studyPlanUrl && (
        <p className="mt-4 text-lg font-medium text-center">
          Study Plan Deployed! View it here: 
          <a href={studyPlanUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">
            {studyPlanUrl}
          </a>
        </p>
      )}

    </div>
  );
};

export default CompletePlanPage;
