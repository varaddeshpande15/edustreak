
"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CoursePlanner() {
  const [pdfText, setPdfText] = useState("");
  const [targetDeadline, setTargetDeadline] = useState("");
  const [dailyTime, setDailyTime] = useState("");
  const [coursePlan, setCoursePlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => console.log("PDF.js loaded");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async function (e) {
      const arrayBuffer = e.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);

      if (!window.pdfjsLib) {
        console.error("PDF.js library not loaded.");
        setLoading(false);
        return;
      }

      const loadingTask = window.pdfjsLib.getDocument({ data: uint8Array });
      loadingTask.promise.then(async (pdf) => {
        let extractedText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          textContent.items.forEach((textItem) => {
            extractedText += textItem.str + " ";
          });
          extractedText += "\n";
        }
        setPdfText(extractedText);
        setLoading(false);
      });
    };

    reader.readAsArrayBuffer(file);
  };

  const handleGeneratePlan = async () => {
    if (!pdfText || !targetDeadline || !dailyTime) {
      alert("Please provide all inputs!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/generate-course-plan", {
        extractedText: pdfText,
        targetDeadline,
        dailyTime,
      });

      setCoursePlan(response.data.coursePlan.coursePlan);
    } catch (error) {
      console.error("Error generating plan:", error);
      alert("Failed to generate course plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Course Planner</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="w-full p-2 border rounded mb-3"
      />
      
      <textarea
        className="w-full p-2 border rounded mb-3"
        rows={6}
        placeholder="Extracted text will appear here..."
        value={pdfText}
        onChange={(e) => setPdfText(e.target.value)}
      ></textarea>

      <input
        type="date"
        className="w-full p-2 border rounded mb-3"
        value={targetDeadline}
        onChange={(e) => setTargetDeadline(e.target.value)}
      />

      <input
        type="number"
        className="w-full p-2 border rounded mb-3"
        placeholder="Daily Study Time (minutes)"
        value={dailyTime}
        onChange={(e) => setDailyTime(e.target.value)}
      />

      <button
        onClick={handleGeneratePlan}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Study Plan"}
      </button>

      {coursePlan && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-bold">{coursePlan.courseTitle}</h3>
          <p>Total Concepts: {coursePlan.totalConcepts}</p>
          <p>Total Duration: {coursePlan.totalDuration}</p>
          <p>Average Duration per Concept: {coursePlan.averageDuration}</p>

          <h4 className="mt-3 font-semibold">Concepts:</h4>
          <ul className="list-disc pl-6">
            {coursePlan.concepts.map((concept, index) => (
              <li key={index}>
                {concept.title} ({concept.type}) - {concept.duration} 
              </li>
            ))}
          </ul>

          <h4 className="mt-3 font-semibold">Revision Plan:</h4>
          <p>Quiz: {coursePlan.revision.quiz.enabled ? "Enabled" : "Disabled"} ({coursePlan.revision.quiz.questions} questions)</p>
          <p>Flashcards: {coursePlan.revision.flashcards.enabled ? "Enabled" : "Disabled"}</p>
          {coursePlan.revision.flashcards.enabled && (
            <ul className="list-disc pl-6">
              {coursePlan.revision.flashcards.topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          )}
          
          <p className="mt-3 font-semibold">Final Review Day: {coursePlan.finalReviewDay ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}
