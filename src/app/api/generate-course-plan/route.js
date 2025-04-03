import { NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req) {
  try {
    const { extractedText, targetDeadline, dailyTime } = await req.json();

    if (!extractedText || !targetDeadline || !dailyTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `
You are an AI assistant that structures learning materials into an organized course plan. Based on the given extracted text from a PDF, create a structured study plan.

Extracted Content:
${extractedText}

Course Plan Details:
- Course Title: Automatically derive from the text
- Total Concepts: Extract major topics from the content
- Total Duration: Suggest based on estimated time per topic
- Average Duration per Concept: Evenly distribute based on total time available
- Concepts should be categorized into theory, practical, exercises, and projects.
- Include strategic revision days, quizzes, and flashcards for review.
- Provide a final revision day.

Return the output in JSON format:

{
  "coursePlan": {
    "courseTitle": "Derived Course Title",
    "totalConcepts": X,
    "totalDuration": Y,
    "averageDuration": Z,
    "concepts": [
      {
        "title": "Concept Name",
        "type": "theory | practical | coding | project",
        "duration": W,
        "completed": false
      }
    ],
    "revision": {
      "quiz": {
        "enabled": true,
        "questions": 5
      },
      "flashcards": {
        "enabled": true,
        "topics": ["Topic1", "Topic2"]
      }
    },
    "finalReviewDay": true
  }
}`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ role: "user", parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    let generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Remove potential formatting issues
    generatedText = generatedText.replace(/```json|```/g, "").trim();

    // Parse JSON response
    const coursePlan = JSON.parse(generatedText);

    return NextResponse.json({ coursePlan });
  } catch (error) {
    console.error("Error generating course plan:", error);
    return NextResponse.json({ error: "Failed to generate course plan" }, { status: 500 });
  }
}