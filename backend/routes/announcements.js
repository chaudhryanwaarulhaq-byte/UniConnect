const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all announcements
router.get("/", (req, res) => {
    db.query("SELECT * FROM announcements ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// ADD announcement
router.post("/", (req, res) => {
    const { title, message } = req.body;

    if (!title || !message) {
        return res.status(400).json({ error: "All fields required" });
    }

    db.query(
        "INSERT INTO announcements (title, message) VALUES (?, ?)",
        [title, message],
        (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Announcement added successfully" });
        }
    );
});

// UPDATE announcement
router.put("/:id", (req, res) => {
    const { title, message } = req.body;

    db.query(
        "UPDATE announcements SET title=?, message=? WHERE id=?",
        [title, message, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Announcement updated successfully" });
        }
    );
});

// DELETE announcement
router.delete("/:id", (req, res) => {
    db.query(
        "DELETE FROM announcements WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Announcement deleted successfully" });
        }
    );
});

module.exports = router;