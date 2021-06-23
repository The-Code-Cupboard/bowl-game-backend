const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();
const { Pool } = require("pg");

const sqlq = require("../../sql_queries");

// for local dev
// const pool = new Pool({
//   connectionString: "postgres://postgres:password@localhost:5432/bowlgamelocal",
// });

// for production
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
      userId: myList[i].userid,
    });
  }
  return outputList;
};

// Postgres get all words
router.get("/", async (req, res) => {
  console.log("/api/words/ : GET (all words) received");
  try {
    const query = sqlq.select_all_from_table("words");
    const client = await pool.connect();
    const result = await client.query(query);
    res.json(result ? buildFromList(result.rows) : null);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Postgres create word
router.post("/", async (req, res) => {
  console.log("/api/words/ : POST received");
  const newWord = {
    id: nanoid(),
    text: req.body.text,
    userId: req.body.userId,
  };
  if (!newWord.text || !newWord.userId) {
    return res.status(400).json({ msg: "Please include a word and userId." });
  }
  try {
    const query = sqlq.insert_into_table(
      "words",
      ["id", "text", "userid"],
      [newWord.id, newWord.text, newWord.userId]
    );
    const client = await pool.connect();
    await client.query(query);
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
    // delete word from table
    const query1 = sqlq.delete_from_table_filter("words", "id", req.params.id);
    const client = await pool.connect();
    client.query(query1);
    // return updated words to client (TODO: adjust front-end so this isn't necessey)
    const query2 = sqlq.select_all_from_table("words");
    const result = await client.query(query2);
    res.json(result ? buildFromList(result.rows) : null);

    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

module.exports = router;
