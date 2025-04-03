import { NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const prompt = `You are an AI chatbot that provides guidance and answers user questions. Answer the following user input clearly and concisely:

    User: "${message}"
    
    AI Response:`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ role: "user", parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    let generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    
    return NextResponse.json({ response: generatedText });
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return NextResponse.json({ error: "Failed to generate a response" }, { status: 500 });
  }
}
