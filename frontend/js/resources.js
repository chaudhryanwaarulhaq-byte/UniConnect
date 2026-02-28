const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all resources
router.get("/", (req, res) => {
    db.query("SELECT * FROM resources ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// ADD resource
router.post("/", (req, res) => {
    const { title, type, link } = req.body;

    if (!title || !type || !link) {
        return res.status(400).json({ error: "All fields required" });
    }

    const sql = "INSERT INTO resources (title, type, link) VALUES (?, ?, ?)";
    db.query(sql, [title, type, link], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Resource added successfully" });
    });
});

module.exports = router;