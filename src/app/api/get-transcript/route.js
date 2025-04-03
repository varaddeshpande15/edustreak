import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const videoId = searchParams.get("videoId");

        if (!videoId) {
            return NextResponse.json({ error: "No video ID provided" }, { status: 400 });
        }

        // Fetch transcript using `youtube-transcript`
        const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);

        if (!transcriptData || transcriptData.length === 0) {
            return NextResponse.json({ error: "No transcript available" }, { status: 404 });
        }

        // Extract only text from the transcript array
        const transcriptText = transcriptData.map((item) => item.text).join(" ");

        return NextResponse.json({ transcript: transcriptText });
    } catch (error) {
        console.error("Error fetching transcript:", error);
        return NextResponse.json({ error: "Failed to fetch transcript" }, { status: 500 });
    }
}
