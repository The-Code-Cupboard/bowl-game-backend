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

const buildFromList = (myList) => {
  outputList = [];
  for (i = 0; i < myList.length; i++) {
    outputList.push({
      id: myList[i].id,
      text: myList[i].text,
      userId: myList[i].userId,
    });
  }
  return outputList;
};

// Postgres get all words
router.get("/", async (req, res) => {
  console.log("/api/words/ : GET (all words) received");
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM words;");
    res.json(result ? buildFromList(result.rows) : null);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Postgres get single word
// TODO : response seems to always be returning {} -- fix this when this route is needed
// router.get("/:id", async (req, res) => {
//   console.log("GET received");
//   try {
//     const client = await pool.connect();
//     const result = await client.query(
//       `SELECT * FROM Words WHERE WordID='${req.params.id}';`
//     );
//     res.json({ id: result.wordid, text: result.wordtext });
//     client.release();
//   } catch (err) {
//     console.error(err);
//     res.send("Error " + err);
//   }
// });

// Postgres create word
router.post("/", async (req, res) => {
  console.log("/api/words/ : POST received");
  const newWord = {
    id: nanoid(),
    text: req.body.text,
    userId: req.body.userId,
  };
  if (!newWord.text) {
    return res.status(400).json({ msg: "Please include a word and userId." });
  }
  try {
    const client = await pool.connect();
    console.log(`Before SQL query for to insert ${newWord}`);
    const results = await client.query(
      `INSERT INTO words (id, text, userid) VALUES ('${newWord.id}', '${newWord.text}', '${newWord.userId}');`
    );
    console.log(`After SQL query for to insert ${newWord}`);
    client.release();
    res.json({ msg: "Word successfully added." });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Postgres delete word
router.delete("/:id", async (req, res) => {
  console.log(
    `/api/words/ : DELETE received for word with id of ${req.params.id}`
  );
  try {
    const client = await pool.connect();
    client.query(`DELETE FROM words WHERE id='${req.params.id}';`);
    const result = await client.query("SELECT * FROM words;");
    res.json(result ? buildFromList(result.rows) : null);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

module.exports = router;
