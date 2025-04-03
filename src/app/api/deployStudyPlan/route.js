import { readFile, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const STUDY_PLAN_PATH = path.join(process.cwd(), "public", "studyPlan.json");

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    let studyPlan = {};
    try {
      const data = await readFile(STUDY_PLAN_PATH, "utf8");
      studyPlan = JSON.parse(data);
    } catch (error) {
      console.error("Error reading study plan:", error.message);
      return NextResponse.json({ error: "Failed to read study plan" }, { status: 500 });
    }

    if (!studyPlan.users) {
      studyPlan.users = [];
    }

    if (!studyPlan.users.includes(email)) {
      studyPlan.users.push(email);
    }

    await writeFile(STUDY_PLAN_PATH, JSON.stringify(studyPlan, null, 2), "utf8");

    return NextResponse.json({
      message: "Study plan updated successfully!",
      playlist: studyPlan.playlist, // Send back the playlist name
    });
  } catch (error) {
    console.error("API Error:", error.message);
    return NextResponse.json({ error: "Failed to update study plan" }, { status: 500 });
  }
}
