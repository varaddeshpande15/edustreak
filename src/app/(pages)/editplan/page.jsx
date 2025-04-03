"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Send, CheckCircle, Edit3 } from "lucide-react"; // Icons

export default function EditPlanPage() {
  const[loadingState, setLoadingState] = useState(false);
  const [studyPlan, setStudyPlan] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const router = useRouter();

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

  const savePlanAndNavigate = async (path) => {
    if (!studyPlan) {
      alert("No study plan available to save!");
      return;
    }

    try {
      await axios.post("/api/savePlan", { studyPlan });
      router.push(path);
    } catch (error) {
      console.error("Error saving study plan:", error);
      alert("Failed to save study plan.");
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    setLoading(true);

    setChatHistory([...chatHistory, { sender: "user", text: userMessage }]);

    try {
      const { data } = await axios.post("/api/editPlan", { userMessage });

      if (data.studyPlan) {
        setStudyPlan(data.studyPlan);
        setChatHistory((prev) => [
          ...prev,
          { sender: "ai", text: "Study plan updated successfully!" },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { sender: "ai", text: "Failed to update the study plan." },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setUserMessage("");
      setLoading(false);
    }

    setTimeout(() => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Edit Study Plan</h1>

      {/* Main Layout */}
      <div className="flex w-full max-w-6xl mx-auto gap-6">
        {/* Left: Study Plan Overview */}
        <div className="w-1/2 bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-2">
            {studyPlan?.playlist || "Your Study Plan"}
          </h2>
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
                  <div className="w-full mt-2">
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

        {/* Right: AI Chat for Editing */}
        <div className="w-1/2 bg-white p-6 shadow-md rounded-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4">✏️ Edit Using AI</h2>
          <div ref={chatContainerRef} className="overflow-y-auto h-64 p-2 border rounded-md mb-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md mb-2 ${
                  msg.sender === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-200 text-gray-900"
                }`}
              >
                <strong>{msg.sender === "user" ? "You:" : "AI:"}</strong> {msg.text}
              </div>
            ))}
          </div>

          {/* Input & Buttons */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="border p-2 flex-1 rounded-md shadow-sm"
              placeholder="Ask AI to edit your plan..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-1 hover:bg-blue-600 transition-all disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? "Editing..." : "Send"} <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-6 left-0 w-full flex justify-center gap-12">
      <button
    onClick={() => {
      setLoadingState("confirm");
      savePlanAndNavigate("/confirmplan");
    }}
    disabled={loadingState === "confirm"}
    className={`px-6 py-3 font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2 
      ${loadingState === "confirm" ? "bg-green-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
  >
    {loadingState === "confirm" ? "⏳ Saving..." : "✅ Confirm Plan"}
  </button>
    </div>
    </div>
  );
}
