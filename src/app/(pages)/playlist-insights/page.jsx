"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPlaylistData = async () => {
    setLoading(true);
    const playlistId = playlistUrl.split("list=")[1]?.split("&")[0];

    if (!playlistId) {
      alert("Invalid playlist URL!");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`/api/playlist?playlistId=${playlistId}`);
      setPlaylistData(data);
    } catch (error) {
      alert("Error fetching playlist data");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Heading - Bigger & moved up */}
      <h1 className="text-5xl font-bold mb-20 text-center text-gray-800">YouTube Playlist Insights</h1>

      {/* Input field - Increased width & padding */}
      <input
        type="text"
        className="w-3/4  max-w-3xl p-4 border border-gray-300 rounded-lg text-lg mb-6 shadow-md focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Enter YouTube Playlist URL"
        value={playlistUrl}
        onChange={(e) => setPlaylistUrl(e.target.value)}
      />

      {/* Button - Larger & higher up */}
      <button
        onClick={fetchPlaylistData}
        className="px-6 py-3 bg-blue-500 text-white text-lg rounded-lg shadow-md hover:bg-blue-600 transition-all"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Get Insights"}
      </button>

      {playlistData && (
        <div className="mt-8 w-full max-w-2xl bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800">{playlistData.playlistTitle}</h2>
          <p className="text-lg text-gray-600"><strong>Total Videos:</strong> {playlistData.totalVideos}</p>
          <p className="text-lg text-gray-600">
            <strong>Total Duration:</strong> {formatDuration(playlistData.totalDuration)}
          </p>
          <p className="text-lg text-gray-600">
            <strong>Average Video Duration:</strong> {formatDuration(playlistData.averageDuration)}
          </p>

          {/* Styled Speed Durations */}
          <h3 className="mt-6 text-xl font-semibold text-gray-700">Durations at Different Speeds</h3>
          <div className="mt-4 space-y-2">
            {[1.25, 1.5, 1.75, 2].map((speed, index) => (
              <div
                key={speed}
                className={`flex items-center justify-between p-3 rounded-lg shadow-sm transition-all 
                ${index === 0 ? "bg-blue-100" : index === 1 ? "bg-green-100" : index === 2 ? "bg-yellow-100" : "bg-red-100"} 
                hover:scale-105 hover:shadow-md`}
              >
                <span className={`px-3 py-1 text-sm font-semibold rounded-full 
                ${index === 0 ? "bg-blue-300 text-blue-900" : index === 1 ? "bg-green-300 text-green-900" 
                : index === 2 ? "bg-yellow-300 text-yellow-900" : "bg-red-300 text-red-900"}`}>
                  {speed}x Speed
                </span>
                <span className="text-lg font-medium text-gray-800">
                  {formatDuration(playlistData.totalDuration / speed)}
                </span>
              </div>
            ))}
          </div>

          {/* Make Plan Button - Bigger & More Prominent */}
          {/* Centering the "Make a Plan" button */}
<div className="flex justify-center mt-4">
  <button
    onClick={() => router.push("/make-plan")}
    className="px-6 py-3 bg-blue-500 text-white text-lg rounded-lg shadow-md mt-6 hover:bg-blue-600 transition-all"
  >
    Make a Plan
  </button>
</div>

        </div>
      )}
    </div>
  );
}
