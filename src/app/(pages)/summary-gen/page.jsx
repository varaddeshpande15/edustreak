"use client";
import { useState, useEffect } from "react";

export default function StudyPlanSummaries() {
    const [studyPlan, setStudyPlan] = useState(null);
    const [summaries, setSummaries] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch study plan JSON from local or API
        const fetchStudyPlan = async () => {
            try {
                const res = await fetch("/studyPlan.json"); // Update path if needed
                const data = await res.json();
                setStudyPlan(data);
            } catch (error) {
                console.error("Error fetching study plan:", error);
            }
        };

        fetchStudyPlan();
    }, []);

    const fetchSummary = async (videoId) => {
        try {
            // Fetch transcript
            const transcriptRes = await fetch(`/api/get-transcript?videoId=${videoId}`);
            const transcriptData = await transcriptRes.json();

            if (!transcriptData.transcript) {
                return "No transcript available.";
            }

            // Fetch summary
            const summaryRes = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript: transcriptData.transcript })
            });

            const summaryData = await summaryRes.json();
            return summaryData.summary || "Summary not available.";
        } catch (error) {
            console.error("Error fetching summary:", error);
            return "Error fetching summary.";
        }
    };

    const generateSummaries = async () => {
        if (!studyPlan) return;
        setLoading(true);
        const newSummaries = {};

        for (const day of studyPlan.daily_schedule) {
            for (const video of day.videos) {
                const summary = await fetchSummary(video.videoId);
                if (summary !== "Summary not available.") {
                    newSummaries[video.videoId] = summary;
                }
            }
        }

        setSummaries(newSummaries);
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-5">
            <h1 className="text-2xl font-bold text-center">
                {studyPlan ? studyPlan.playlist : "Loading..."}
            </h1>

            <button
                className="bg-blue-500 text-white p-2 mt-3"
                onClick={generateSummaries}
                disabled={loading}
            >
                {loading ? "Loading Summaries..." : "Generate AI Summaries"}
            </button>

            {studyPlan &&
                studyPlan.daily_schedule.map((day) =>
                    day.videos.map((video) => (
                        summaries[video.videoId] ? (
                            <div key={video.videoId} className="mt-5 bg-gray-100 p-4 w-full max-w-2xl">
                                <h2 className="text-lg font-semibold">{video.title}</h2>
                                <p className="mt-2">{summaries[video.videoId]}</p>
                            </div>
                        ) : null
                    ))
                )}
        </div>
    );
}
