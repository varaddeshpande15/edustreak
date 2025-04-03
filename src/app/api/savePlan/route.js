import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const { studyPlan } = await req.json();

    if (!studyPlan) {
      return new Response(JSON.stringify({ error: "No study plan provided" }), {
        status: 400,
      });
    }

    const filePath = path.join(process.cwd(), "public", "studyPlan.json");

    await writeFile(filePath, JSON.stringify(studyPlan, null, 2));

    return new Response(JSON.stringify({ message: "Study plan saved successfully!" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error saving study plan:", error);
    return new Response(JSON.stringify({ error: "Failed to save study plan" }), {
      status: 500,
    });
  }
}
