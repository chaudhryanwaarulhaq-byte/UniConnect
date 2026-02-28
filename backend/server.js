const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ THIS LINE IS CRITICAL
app.use(express.static(path.join(__dirname, "../frontend")));

// ROUTES
app.use("/api/events", require("./routes/events"));
app.use("/api/resources", require("./routes/resources"));
app.use("/api/announcements", require("./routes/announcements"));
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});