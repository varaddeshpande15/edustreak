
import { NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import path from "path";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";
const STORAGE_PATH = path.join(process.cwd(), "storage.json");

// Read local storage
function readStorage() {
  try {
    if (!fs.existsSync(STORAGE_PATH)) return {};
    const data = fs.readFileSync(STORAGE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading storage:", error.message);
    return {};
  }
}

// Write to local storage
function writeStorage(data) {
  try {
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing to storage:", error.message);
  }
}

// Convert YouTube duration (ISO 8601) to seconds
function parseDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  return hours * 3600 + minutes * 60 + seconds;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url, process.env.NEXT_PUBLIC_BASE_URL);
    const playlistId = searchParams.get("playlistId");

    if (!playlistId) {
      return NextResponse.json({ error: "Playlist ID is required" }, { status: 400 });
    }

    let storageData = readStorage();

    // ✅ Check if data is already stored
    if (storageData.playlists && storageData.playlists[playlistId]) {
      console.log("Serving playlist data from storage...");
      return NextResponse.json(storageData.playlists[playlistId]);
    }

    // ✅ Fetch Playlist Title
    const playlistResponse = await axios.get(`${YOUTUBE_API_URL}/playlists`, {
      params: {
        part: "snippet",
        id: playlistId,
        key: YOUTUBE_API_KEY,
      },
    });

    if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    const playlistTitle = playlistResponse.data.items[0].snippet.title;
    let nextPageToken = "";
    let videos = [];

    // ✅ Fetch all videos (title & ID)
    do {
      const response = await axios.get(`${YOUTUBE_API_URL}/playlistItems`, {
        params: {
          part: "snippet,contentDetails",
          maxResults: 50,
          playlistId,
          key: YOUTUBE_API_KEY,
          pageToken: nextPageToken,
        },
      });

      if (!response.data.items || response.data.items.length === 0) break;

      response.data.items.forEach((item) => {
        videos.push({
          title: item.snippet.title,
          videoId: item.contentDetails.videoId,
        });
      });

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    if (videos.length === 0) {
      return NextResponse.json({ error: "No videos found in the playlist" }, { status: 404 });
    }

    // ✅ Fetch video durations
    const videoIds = videos.map((video) => video.videoId);
    console.log("Video IDs being fetched:", videoIds);
    const videoResponse = await axios.get(`${YOUTUBE_API_URL}/videos`, {
      params: {
        part: "contentDetails",
        id: videoIds.join(","),
        key: YOUTUBE_API_KEY,
      },
    });

    const durations = videoResponse.data.items.map((video) => parseDuration(video.contentDetails.duration));

    videos = videos.map((video, index) => ({
      ...video,
      duration: durations[index], // Store duration in seconds
    }));

    const totalDuration = durations.reduce((acc, val) => acc + val, 0);
    const averageDuration = totalDuration / durations.length;

    const playlistData = {
      playlistTitle,
      totalVideos: videos.length,
      totalDuration, // in seconds
      averageDuration: averageDuration.toFixed(2), // in seconds
      videos,
    };

    // ✅ Save data to local storage
    storageData.playlists = storageData.playlists || {};
    storageData.playlists[playlistId] = playlistData;
    writeStorage(storageData);

    return NextResponse.json(playlistData);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to fetch playlist data" }, { status: 500 });
  }
}
