const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "abcd1234",   // 🔴 VERY IMPORTANT
    database: "uniconnect"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err);
    } else {
        console.log("MySQL Connected Successfully");
    }
});

module.exports = db;