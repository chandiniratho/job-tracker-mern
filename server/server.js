const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));



// 🔹 CONNECT TO MONGODB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
  })
  .catch((err) => {
    console.error("MongoDB connection error ❌", err);
  });

// 🔹 TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// 🔹 START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
