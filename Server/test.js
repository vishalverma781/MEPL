import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://vishalvermayt:d513z03kHO56O6NA@cluster0.kbgw1y6.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0" // Replace with your actual URI

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:");
    console.error(err.message);
    process.exit(1);
  });
