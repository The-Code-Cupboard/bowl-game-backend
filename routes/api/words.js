const express = require("express");
const nanoid = require("nanoid");
const router = express.Router();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

let words = [
  {
    id: 0,
    text: "word0",
    userId: "1",
  },
  {
    id: 1,
    text: "word1",
    userId: "2",
  },
];

const parseID = (id) => parseInt(id);
// const parseID = (id) => id;

// Postgres get all words
router.get("/", async (req, res) => {
  console.log("GET (all words) received");
  try {
    const client = await pool.connect();
    const results = await client.query("SELECT * FROM words");
    const results = { 'results': (result) ? result.rows : null };
    res.json(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Gets All Words
// router.get("/", (req, res) => {
//   console.log("GET (all words) received");
//   res.json(words);
// });

// Get Single Word
router.get("/:id", (req, res) => {
  console.log("GET received");
  const found = words.some((word) => word.id === parseID(req.params.id));

  if (found) {
    res.json(words.filter((word) => word.id === parseID(req.params.id)));
  } else {
    res.status(400).json({ msg: `No word with the id of ${req.params.id}` });
  }
});

// Create word
// router.post("/", (req, res) => {
//   console.log("POST received");
//   const newWord = {
//     id: nanoid(),
//     text: req.body.text,
//     // userId: req.body.userId,
//   };

//   // if (!newWord.text || !newWord.userId) {
//   if (!newWord.text) {
//     return res.status(400).json({ msg: "Please include a word and userId." });
//   }

//   words.push(newWord);
//   res.json({ msg: "Word successfully added." });
//   // res.json(words);
// });

// Postgres create word
router.post("/", (req, res) => {
  console.log("POST received");
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
    const results = await client.query(`INSERT INTO Words VALUES ${newWord.id} ${newWord.text})`);
    // const results = { results: result ? result.rows : null };
    // res.json(results);
    client.release();
    res.json({ msg: "Word successfully added." });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Delete word
router.delete("/:id", (req, res) => {
  console.log(`DELETE received for word with id of ${req.params.id}`);
  const found = words.some((word) => word.id === parseID(req.params.id));

  if (found) {
    res.json({
      msg: "word deleted",
      words: words.filter((word) => word.id !== parseID(req.params.id)),
    });
  } else {
    res.status(400).json({ msg: `No word with the id of ${req.params.id}` });
  }

  words = words.filter((word) => word.id !== parseID(req.params.id));
});

module.exports = router;
