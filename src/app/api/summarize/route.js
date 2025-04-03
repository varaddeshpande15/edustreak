import { NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "Missing transcript data" }, { status: 400 });
    }

    const prompt = `
You are an AI assistant that summarizes YouTube video transcripts into concise and informative summaries.

Transcript:
${transcript}

Generate a well-structured summary that captures the key points discussed in the video.
Return the output in JSON format:

{
  "summary": "Generated summary here"
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
    const summaryResponse = JSON.parse(generatedText);

    return NextResponse.json({ summary: summaryResponse.summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
