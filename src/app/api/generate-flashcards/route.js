import { NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req) {
  try {
    const { videos } = await req.json();
    if (!videos || videos.length === 0) {
      return NextResponse.json({ error: "No videos provided" }, { status: 400 });
    }

    const videoTitles = videos.map((video) => video.title).join(", ");
    const prompt = `
You are an AI assistant that generates flashcards based on given video topics.

Video Topics:
${videoTitles}

Generate a JSON array of flashcards. Each flashcard should have:
- A term
- A definition

Return the response in this JSON format:
[
  {
    "term": "Term 1",
    "definition": "Definition for term 1."
  },
  {
    "term": "Term 2",
    "definition": "Definition for term 2."
  }
]`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ role: "user", parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    let generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    generatedText = generatedText.replace(/```json|```/g, "").trim();

    let flashcards;
    try {
      flashcards = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError, generatedText);
      return NextResponse.json({ error: "Invalid response format from Gemini" }, { status: 500 });
    }

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
  }
}
