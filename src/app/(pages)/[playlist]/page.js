"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Use useParams hook for dynamic route parameters

export default function StudyPlanPage() {
  const params = useParams(); // Fetch params asynchronously
  const [studyPlan, setStudyPlan] = useState(null);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    if (params?.playlist) {
      setPlaylist(decodeURIComponent(params.playlist).trim().toLowerCase());
    }
  }, [params]);

  useEffect(() => {
    async function fetchStudyPlan() {
      try {
        const response = await fetch("/studyPlan.json");
        const plan = await response.json();
        setStudyPlan(plan);
      } catch (error) {
        console.error("Error reading study plan:", error);
      }
    }
    fetchStudyPlan();
  }, []);

  if (!studyPlan || !playlist) return <h1>Loading...</h1>;

  const storedPlaylist = studyPlan.playlist?.trim().toLowerCase();

  if (playlist !== storedPlaylist) {
    return <h1>Study plan not found for this playlist.</h1>;
  }

  const totalVideos = studyPlan.total_videos;
  const completedCount = completedVideos.size;
  const progress = (completedCount / totalVideos) * 100;

  const toggleVideoCompletion = (videoId) => {
    setCompletedVideos((prev) => {
      const newSet = new Set(prev);
      newSet.has(videoId) ? newSet.delete(videoId) : newSet.add(videoId);
      return newSet;
    });
  };

  return (
    <div className="w-3/4 mx-auto p-6 font-sans">
      <h1 className="text-center text-2xl font-bold mb-4">{studyPlan.playlist}</h1>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        <p><strong>Start Date:</strong> {studyPlan.start_date}</p>
        <p><strong>Deadline:</strong> {studyPlan.deadline}</p>
        <p><strong>Total Videos:</strong> {studyPlan.total_videos}</p>
        <p><strong>Total Minutes:</strong> {studyPlan.total_minutes} min</p>
        <p><strong>Daily Study Time:</strong> {studyPlan.daily_study_time} min</p>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-300 rounded-lg h-4 overflow-hidden">
          <div className="bg-blue-500 h-4" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-center mt-2 font-medium">{Math.round(progress)}% Completed</p>
      </div>

      {studyPlan.daily_schedule.map((day, index) => (
        <div key={index} className="w-full mb-6 p-4 border rounded-md bg-white shadow-md">
          <h2 className="text-lg font-semibold mb-2">Day {day.day}: {day.date}</h2>
          <p className="text-sm text-gray-600 mb-1">Total Study Time: {day.total_minutes} mins</p>
          <p className="text-sm text-gray-700 italic mb-2">{day.notes}</p>

          {day.videos.map((video, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center md:items-start mb-4">
              <div className="w-full md:w-1/2 p-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="mr-2 w-5 h-5 border border-gray-400 rounded" 
                    checked={completedVideos.has(video.videoId)} 
                    onChange={() => toggleVideoCompletion(video.videoId)}
                  />
                  <p className="font-medium">{video.title}</p>
                </div>
                <p className="text-sm text-gray-500">Duration: {video.duration} mins</p>
                <p className="text-sm text-gray-500">Notes: {video.notes}</p>
                <p className={`text-sm font-bold ${completedVideos.has(video.videoId) ? 'text-green-500' : 'text-red-500'}`}>
                  {completedVideos.has(video.videoId) ? "Completed" : "Pending"}
                </p>
              </div>
              <div className="w-full md:w-1/2 flex justify-center p-2">
                <iframe
                  width="100%"
                  height="300"
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-md shadow-md"
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
