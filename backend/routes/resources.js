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

    db.query(
        "INSERT INTO resources (title, type, link) VALUES (?, ?, ?)",
        [title, type, link],
        (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Resource added successfully" });
        }
    );
});

// UPDATE resource
router.put("/:id", (req, res) => {
    const { title, type, link } = req.body;

    db.query(
        "UPDATE resources SET title=?, type=?, link=? WHERE id=?",
        [title, type, link, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Resource updated successfully" });
        }
    );
});

// DELETE resource
router.delete("/:id", (req, res) => {
    db.query(
        "DELETE FROM resources WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Resource deleted successfully" });
        }
    );
});

module.exports = router;