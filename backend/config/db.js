const mongoose = require("mongoose");

// in case mangodb cluster dosen't work will work on localhost
const DEFAULT_URI = "mongodb://127.0.0.1:27017/leave_management";

async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_URI;

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || "leave_management",
  });

  console.log("MongoDB connected:", mongoose.connection.name);
}

module.exports = connectDB;
