import mongoose from "mongoose";

export async function connect() {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in the environment variables");
    }

    await mongoose.connect(process.env.MONGO_URL);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB Connected successfully");
    });

    connection.on("error", (err) => {
      console.error("MongoDB Connection error:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
