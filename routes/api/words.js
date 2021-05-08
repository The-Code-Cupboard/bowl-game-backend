const express = require("express");
const uuid = require("uuid");
const router = express.Router();

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
const randomIntID = () => Math.floor(Math.random() * 1000) + 1;

// Gets All Words
router.get("/", (req, res) => {
  console.log("GET (all words) received");
  res.json(words);
});

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
router.post("/", (req, res) => {
  console.log("POST received");
  const newWord = {
    id: randomIntID(),
    text: req.body.text,
    // userId: req.body.userId,
  };

  // if (!newWord.text || !newWord.userId) {
  if (!newWord.text) {
    return res.status(400).json({ msg: "Please include a word and userId." });
  }

  words.push(newWord);
  res.json({ msg: "Word successfully added." });
  // res.json(words);
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
