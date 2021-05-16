const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Postgres get all users
router.get("/", async (req, res) => {
  console.log("/api/users: GET received");
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM Users;");
    res.json(result ? result.rows : null);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Postgres create user
router.post("/", async (req, res) => {
  console.log("/api/users: POST received");
  const newWord = {
    id: nanoid(),
    text: req.body.text,
    // userId: req.body.userId,
  };
  if (!newWord.text) {
    return res.status(400).json({ msg: "Please include a word and userId." });
  }
  try {
    const client = await pool.connect();
    console.log(`Before SQL query for to insert ${newWord}`);
    const results = await client.query(
      `INSERT INTO Users (ID, UserName) VALUES ('${newWord.id}', '${newWord.text}');`
    );
    console.log(`After SQL query for to insert ${newWord}`);
    client.release();
    res.json({ msg: "Word successfully added." });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

module.exports = router;
