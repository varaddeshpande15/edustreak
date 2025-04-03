import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to the saved study plan JSON
const studyPlanPath = path.join(process.cwd(), "public", "studyPlan.json");


export async function GET() {
  try {
    if (!fs.existsSync(studyPlanPath)) {
      return NextResponse.json({ error: "Study plan not found." }, { status: 404 });
    }

    const rawData = fs.readFileSync(studyPlanPath, "utf8");
    const studyPlan = JSON.parse(rawData);

    return NextResponse.json({ studyPlan });
  } catch (error) {
    console.error("Error fetching study plan:", error);
    return NextResponse.json({ error: "Failed to fetch study plan." }, { status: 500 });
  }
}
