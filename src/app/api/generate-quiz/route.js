import { NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req) {
    try {
      const { videos } = await req.json();
  
      if (!videos || videos.length === 0) {
        console.error("No videos provided in request");
        return NextResponse.json({ error: "No videos provided" }, { status: 400 });
      }
  
      const videoTitles = videos.map((video) => video.title).join(", ");
      console.log("Received video titles:", videoTitles);
  
      const prompt = `
  You are an AI assistant that generates multiple-choice quiz questions based on given video topics.
  
  Video Topics:
  ${videoTitles}
  
  Generate a JSON array of quiz questions. Each question should have:
  - A question text
  - Four answer options
  - Exactly one correct answer
  
  Return the response in this JSON format:
  [
    {
      "question": "What is ...?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Option 2"
    }
  ]`;
  
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        { contents: [{ role: "user", parts: [{ text: prompt }] }] },
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Gemini API Response:", response.data);
  
      let generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      generatedText = generatedText.replace(/```json|```/g, "").trim();
  
      let questions;
      try {
        questions = JSON.parse(generatedText);
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError, generatedText);
        return NextResponse.json({ error: "Invalid response format from Gemini" }, { status: 500 });
      }
  
      console.log("Parsed quiz questions:", questions);
  
      return NextResponse.json({ questions });
    } catch (error) {
      console.error("Error generating quiz:", error);
      return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
    }
  }