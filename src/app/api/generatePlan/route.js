
// import { NextResponse } from "next/server";
// import axios from "axios";
// import path from "path";
// import fs from "fs";

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
// const STORAGE_PATH = path.join(process.cwd(), "storage.json");

// // Read local storage
// function readStorage() {
//   try {
//     if (!fs.existsSync(STORAGE_PATH)) return {};
//     const data = fs.readFileSync(STORAGE_PATH, "utf8");
//     return JSON.parse(data);
//   } catch (error) {
//     console.error("Error reading storage:", error.message);
//     return {};
//   }
// }

// export async function POST(req) {
//   try {
//     const { targetDeadline, dailyTime } = await req.json();

//     if (!targetDeadline || !dailyTime) {
//       console.log("GEMINI_API_KEY:", GEMINI_API_KEY);
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // ✅ Fetch latest playlist from local storage
//     const storageData = readStorage();
//     const playlists = storageData.playlists || {};

//     // ✅ Get the latest playlist (assuming there's only one)
//     const playlistId = Object.keys(playlists)[0]; // First playlist ID
//     if (!playlistId) {
//       return NextResponse.json({ error: "No playlist found in local storage" }, { status: 400 });
//     }

//     const playlist = playlists[playlistId];
//     const { playlistTitle, videos } = playlist;

//     if (!playlistTitle || !videos || videos.length === 0) {
//       return NextResponse.json({ error: "Invalid playlist data" }, { status: 400 });
//     }

//     // ✅ Format video details for prompt (include videoId)
//     const videoDetails = videos
//       .filter((v) => v.duration && v.duration > 0) // Ignore private or unavailable videos
//       .map((v) => `- **Title**: ${v.title} (${Math.round(v.duration / 60)} mins), **Video ID**: ${v.videoId}`)
//       .join("\n");

//     const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

//     const prompt = `
// Generate a structured study plan for the YouTube playlist "${playlistTitle}" containing ${videos.length} videos. 
// The available study time per day is ${dailyTime} minutes, and the deadline is ${targetDeadline}. 
// The study plan **must be detailed** and structured.

// ### **Instructions for Generating the Study Plan**
// - **Distribute the videos across multiple days**, ensuring each day's total duration is within the given daily study time.
// - **Provide a detailed breakdown for each day**, including:
//   - List of videos to study (title, duration, video ID)
//   - Key learning points for each video
//   - A short summary of the day's study focus
//   - Whether any topics need revision
// - **Include necessary metadata**: start date (which is today: ${currentDate}), deadline, total videos, total minutes, and required days.

// ### **Video List**
// ${videoDetails}

// ### **Expected JSON Format**
// \`\`\`json
// {
//   "studyPlan": {
//     "study_plan": {
//       "playlist": "${playlistTitle}",
//       "total_videos": ${videos.length},
//       "total_minutes": <TOTAL_MINUTES>,
//       "daily_study_time": ${dailyTime},
//       "deadline": "${targetDeadline}",
//       "start_date": "${currentDate}",
//       "days_required": <DAYS_NEEDED>,
//       "daily_schedule": [
//         {
//           "day": 1,
//           "date": "<YYYY-MM-DD>",
//           "videos": [
//             {
//               "title": "<Video Title>",
//               "videoId": "<YouTube Video ID>",
//               "duration": <Duration in Minutes>,
//               "completed": false,
//               "notes": "<Key learning points and summary>"
//             }
//           ],
//           "total_minutes": <Total Duration for the Day>,
//           "notes": "<Overall study focus for the day, topics to revise, and additional insights>"
//         }
//       ]
//     }
//   }
// }
// \`\`\`

// Ensure the output **exactly** follows the given JSON structure. Do not add extra fields.
// Make sure **each day's plan is detailed** and provides valuable insights for efficient studying.
// `;
// console.log("GEMINI_API_KEY:", GEMINI_API_KEY);
//     const response = await axios.post(
//       `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
//       { contents: [{ role: "user", parts: [{ text: prompt }] }] },
//       { headers: { "Content-Type": "application/json" } }
//     );

//     // ✅ Parse response and include videoId
//     const studyPlan = JSON.parse(response.data.candidates?.[0]?.content?.parts?.[0]?.text.replace(/```json|```/g, "").trim());

//     return NextResponse.json({ studyPlan });
//   } catch (error) {
//     console.error("Error generating plan:", error.message);
//     return NextResponse.json({ error: "Failed to generate study plan" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "@/lib/dbConnect";
import Playlist from "@/models/Playlist";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req) {
  try {
    await dbConnect();

    const { targetDeadline, dailyTime } = await req.json();

    if (!targetDeadline || !dailyTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Fetch latest playlist from MongoDB
    const playlist = await Playlist.findOne().sort({ createdAt: -1 });

    if (!playlist) {
      return NextResponse.json({ error: "No playlist found in database" }, { status: 400 });
    }

    const { playlistTitle, videos } = playlist;

    if (!playlistTitle || !videos || videos.length === 0) {
      return NextResponse.json({ error: "Invalid playlist data" }, { status: 400 });
    }

    // ✅ Format video details for prompt (include videoId)
    const videoDetails = videos
      .filter((v) => v.duration && v.duration > 0)
      .map((v) => `- **Title**: ${v.title} (${Math.round(v.duration / 60)} mins), **Video ID**: ${v.videoId}`)
      .join("\n");

    const currentDate = new Date().toISOString().split("T")[0];

    const prompt = `
Generate a structured study plan for the YouTube playlist "${playlistTitle}" containing ${videos.length} videos. 
The available study time per day is ${dailyTime} minutes, and the deadline is ${targetDeadline}. 
The study plan **must be detailed** and structured.

### **Video List**
${videoDetails}
// ### **Expected JSON Format**
// \`\`\`json
// {
//   "studyPlan": {
//     "study_plan": {
//       "playlist": "${playlistTitle}",
//       "total_videos": ${videos.length},
//       "total_minutes": <TOTAL_MINUTES>,
//       "daily_study_time": ${dailyTime},
//       "deadline": "${targetDeadline}",
//       "start_date": "${currentDate}",
//       "days_required": <DAYS_NEEDED>,
//       "daily_schedule": [
//         {
//           "day": 1,
//           "date": "<YYYY-MM-DD>",
//           "videos": [
//             {
//               "title": "<Video Title>",
//               "videoId": "<YouTube Video ID>",
//               "duration": <Duration in Minutes>,
//               "completed": false,
//               "notes": "<Key learning points and summary>"
//             }
//           ],
//           "total_minutes": <Total Duration for the Day>,
//           "notes": "<Overall study focus for the day, topics to revise, and additional insights>"
//         }
//       ]
//     }
//   }
// }
// \`\`\`

// Ensure the output **exactly** follows the given JSON structure. Do not add extra fields. Ensure that its a valid JSON only dont give anything else in the response other than required given JSON Structure.
// Make sure **each day's plan is detailed** and provides valuable insights for efficient studying.
// `;

    // ✅ Make API Call to Gemini
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ role: "user", parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const studyPlan = JSON.parse(response.data.candidates?.[0]?.content?.parts?.[0]?.text.replace(/```json|```/g, "").trim());

    return NextResponse.json({ studyPlan });
  } catch (error) {
    console.error("Error generating plan:", error.message);
    return NextResponse.json({ error: "Failed to generate study plan" }, { status: 500 });
  }
}
