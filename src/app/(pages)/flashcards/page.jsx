"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Flashcards() {
  const searchParams = useSearchParams();
  const playlist = searchParams.get("playlist");
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playlist) return;
  
    fetch("/studyPlan.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Study Plan Data:", data); // Debugging log
  
        // Ensure `data` is treated as an array
        const studyPlans = Array.isArray(data) ? data : [data];
  
        const plan = studyPlans.find((p) => p.playlist?.toLowerCase() === playlist.toLowerCase());
  
        if (plan) {
          generateFlashcards(plan);
        } else {
          console.error("No matching study plan found for playlist:", playlist);
          setLoading(false); // Stop loading if no plan is found
        }
      })
      .catch((error) => {
        console.error("Error loading study plan:", error);
        setLoading(false); // Stop loading if there's an error
      });
  }, [playlist]);
  

  const generateFlashcards = async (studyPlan) => {
    if (!studyPlan.daily_schedule) {
      console.error("Study plan does not contain daily_schedule:", studyPlan);
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videos: studyPlan.daily_schedule.flatMap((day) => day.videos || []) }),
      });
  
      const data = await response.json();
      if (!data.flashcards || data.flashcards.length === 0) {
        console.error("No flashcards generated:", data);
      }
  
      setFlashcards(data.flashcards || []);
      setLoading(false);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      setLoading(false);
    }
  };
  

  const nextFlashcard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  if (loading) return <h1>Loading flashcards...</h1>;
  if (flashcards.length === 0) return <h1>No flashcards available.</h1>;

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Flashcards for {playlist}</h1>
      <div className="flex justify-center">
        <div className="relative w-100 h-100">
          <AnimatePresence mode="wait">
          <motion.div
  key={currentIndex}
  initial={{ opacity: 0, rotateY: -90 }}
  animate={{ opacity: 1, rotateY: 0 }}
  exit={{ opacity: 0, rotateY: 90 }}
  transition={{ duration: 0.5 }}
  className="absolute inset-0 flex flex-col items-center justify-center bg-white p-4 shadow-lg rounded-lg border"
>
  <p className="text-lg font-semibold">{flashcards[currentIndex]?.term}</p>
  <p className="text-sm text-gray-600 mt-2">{flashcards[currentIndex]?.definition}</p>
</motion.div>

          </AnimatePresence>
        </div>
      </div>
      <button onClick={nextFlashcard} className="mt-4 px-4 py-2 bg-purple-500 text-white rounded shadow-lg hover:bg-purple-600">
        Next Flashcard
      </button>
    </div>
  );
}
