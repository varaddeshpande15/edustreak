// getStudyPlan.js
import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const STUDY_PLAN_PATH = path.join(process.cwd(), "public", "studyPlan.json");

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const playlist = url.searchParams.get("playlist");
    
    if (!playlist) {
      return NextResponse.json({ error: "Playlist is required" }, { status: 400 });
    }

    let studyPlan;
    try {
      const data = await readFile(STUDY_PLAN_PATH, "utf8");
      studyPlan = JSON.parse(data);
    } catch (error) {
      console.error("Error reading study plan:", error.message);
      return NextResponse.json({ error: "Failed to fetch study plan" }, { status: 500 });
    }

    if (studyPlan.playlist !== playlist) {
      return NextResponse.json({ error: "Study plan not found" }, { status: 404 });
    }

    return NextResponse.json({ studyPlan }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error.message);
    return NextResponse.json({ error: "Failed to fetch study plan" }, { status: 500 });
  }
}
