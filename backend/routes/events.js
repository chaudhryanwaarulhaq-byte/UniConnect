const express = require("express");
const router = express.Router();
const db = require("../db");

/* =========================
   READ – Get all events
   ========================= */
router.get("/", (req, res) => {
  const sql = "SELECT * FROM events";

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
});

/* =========================
   CREATE – Add new event
   ========================= */
router.post("/add", (req, res) => {
  const { title, description, event_date } = req.body;

  const sql =
    "INSERT INTO events (title, description, event_date) VALUES (?, ?, ?)";

  db.query(sql, [title, description, event_date], (err) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json({ message: "Event added successfully" });
    }
  });
});

/* =========================
   UPDATE – Update event by ID
   ========================= */
router.put("/update/:id", (req, res) => {
  const { title, description, event_date } = req.body;
  const eventId = req.params.id;

  const sql =
    "UPDATE events SET title=?, description=?, event_date=? WHERE id=?";

  db.query(
    sql,
    [title, description, event_date, eventId],
    (err) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.json({ message: "Event updated successfully" });
      }
    }
  );
});

/* =========================
   DELETE – Delete event by ID
   ========================= */
router.delete("/delete/:id", (req, res) => {
  const eventId = req.params.id;

  const sql = "DELETE FROM events WHERE id=?";

  db.query(sql, [eventId], (err) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json({ message: "Event deleted successfully" });
    }
  });
});
// UPDATE EVENT
router.put("/update/:id", (req, res) => {
  const { title, description, event_date } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE events
    SET title = ?, description = ?, event_date = ?
    WHERE id = ?
  `;

  db.query(sql, [title, description, event_date, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Update failed" });
    }
    res.json({ message: "Event updated successfully" });
  });
});

module.exports = router;
// DELETE event
router.delete("/delete/:id", (req, res) => {
  const eventId = req.params.id;

  const sql = "DELETE FROM events WHERE id = ?";

  db.query(sql, [eventId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Delete failed" });
    }

    res.json({ message: "Event deleted successfully" });
  });
});
