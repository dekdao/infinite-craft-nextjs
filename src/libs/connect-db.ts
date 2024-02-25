import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }

  const conn = await mongoose.connect(process.env.MONGO_URI);

  // console.log(`MongoDB Connected: ${conn.connection.host}`);
};

export default connectDB;
