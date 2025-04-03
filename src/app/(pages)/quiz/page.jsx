"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import Loader from '@/components/Loader'
export default function Quiz() {
  const searchParams = useSearchParams();
  const playlist = searchParams.get("playlist");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (!playlist) return;

    fetch("/studyPlan.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Study Plan Data:", data);

        const studyPlans = Array.isArray(data) ? data : [data];
        const plan = studyPlans.find((p) => p.playlist.toLowerCase() === playlist.toLowerCase());

        if (plan) {
          generateQuiz(plan);
        } else {
          console.error("No matching study plan found for playlist:", playlist);
        }
      })
      .catch((error) => console.error("Error loading study plan:", error));
  }, [playlist]);

  const generateQuiz = async (studyPlan) => {
    try {
      console.log("Sending request to API with videos:", studyPlan.daily_schedule.flatMap((day) => day.videos));

      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videos: studyPlan.daily_schedule.flatMap((day) => day.videos) }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        console.error("Invalid quiz data received:", data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error generating quiz:", error);
      setLoading(false);
    }
  };

  const handleAnswer = (option) => {
    const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
    setSelectedAnswer(option);
    
    if (isCorrect) {
      setScore(score + 1);
      confetti();
    }
    setTimeout(() => {
      setSelectedAnswer(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }, 1000);
  };

  if (loading) return 
  <h1 className="text-xl font-bold text-gray-700 ">Loading quiz...</h1>;
  if (currentQuestionIndex >= questions.length) return (
    <div className="container mx-auto p-6 text-center bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-green-600">Quiz Complete!</h1>
      <p className="text-lg font-semibold mt-4">Your Final Score: {score} / {questions.length}</p>
      <a href="/" className="mt-6 inline-block px-6 py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition">Go to Home</a>
    </div>
  );

  const question = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold text-gray-800">Quiz for {playlist}</h1>
      <div className="mt-6 p-6 border rounded-lg shadow-lg bg-white">
        <h2 className="text-lg font-semibold text-gray-900">{question.question}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`p-3 rounded-lg text-white text-lg font-medium transition ${
                selectedAnswer
                  ? option === question.correctAnswer
                    ? "bg-green-500"
                    : option === selectedAnswer
                    ? "bg-red-500"
                    : "bg-blue-500"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-6 text-lg font-semibold text-gray-700">Score: {score}</p>
    </div>
  );
}
