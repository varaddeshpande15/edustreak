import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if needed
import studyPlans from "../../../../public/studyPlan.json"; // Ensure the correct path

export async function GET(req) {
  try {
    // Add a 5-second delay before processing the request
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Extract session from request
    const session = await getServerSession(authOptions);

    console.log("User Session:", session); // Debugging Log

    if (!session || !session.user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const userStudyPlan = studyPlans.users.includes(userEmail) ? studyPlans : null;

    if (!userStudyPlan) {
      return NextResponse.json({ error: "Study plan not found" }, { status: 404 });
    }

    return NextResponse.json({ studyPlan: userStudyPlan });
  } catch (error) {
    console.error("Error fetching study plan:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
