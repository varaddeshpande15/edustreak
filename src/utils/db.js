import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URL;
console.log("MONGODB_URI:", MONGODB_URI);


let isConnected = false; // Track connection status

export const connect = async () => {
  if (isConnected) {
    console.log("✅ Already connected to MongoDB.");
    return;
  }

  try {
    console.time("⏳ MongoDB Connection Time");
    const db = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false, // Disable buffering to prevent timeouts
      serverSelectionTimeoutMS: 5000, // Fail faster if MongoDB is unavailable
    });
    console.timeEnd("⏳ MongoDB Connection Time");

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB Connection Established!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw new Error("Failed to connect to MongoDB.");
  }
};

export default connect;
