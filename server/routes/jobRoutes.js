const express = require("express");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE JOB
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { company, role, status } = req.body;

    const job = await Job.create({
      company,
      role,
      status,
      userId: req.userId,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET USER JOBS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.userId });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE JOB
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
