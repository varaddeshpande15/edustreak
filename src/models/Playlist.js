// /models/Playlist.js
import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
  playlistId: {
    type: String,
    required: true,
    unique: true,
  },
  playlistTitle: {
    type: String,
    required: true,
  },
  totalVideos: {
    type: Number,
    required: true,
  },
  totalDuration: {
    type: Number,
    required: true,
  },
  averageDuration: {
    type: Number,
    required: true,
  },
  videos: [
    {
      title: String,
      videoId: String,
      duration: Number,
    },
  ],
});

export default mongoose.models.Playlist || mongoose.model("Playlist", PlaylistSchema);
