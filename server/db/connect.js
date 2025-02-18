import mongoose from "mongoose";

const connect = async () => {
  try {
    console.log("Attempting to connect to the database...");
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to the database");
  } catch (error) {
    console.log("Failed to connect to the database", error.message);
  }
};

export default connect;
