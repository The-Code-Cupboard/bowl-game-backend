const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();
const { Pool } = require("pg");

const sqlq = require("../../sql_queries");

// for local dev
const pool = new Pool({
  connectionString: "postgres://postgres:password@localhost:5432/bowlgamelocal",
});

// for production
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// Postgres get all users
router.get("/", async (req, res) => {
  console.log("/api/users/ : GET received");
  try {
    const query = sqlq.select_all_from_table("users");
    const client = await pool.connect();
    const result = await client.query(query);
    res.json(result ? result.rows : null);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Postgres get single user
router.get("/:id", async (req, res) => {
  console.log(`/api/users/ : GET received for user with id: ${req.params.id}`);
  try {
    const query = sqlq.select_from_table_filter("users", "id", req.params.id);
    const client = await pool.connect();
    const result = await client.query(query);
    returnUser = {
      id: result.rows[0].id,
      username: result.rows[0].username,
    };
    res.json(returnUser);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Postgres create user
// If userID already exists, update user
router.post("/", async (req, res) => {
  console.log("/api/users/ : POST received");
  const newUser = {
    id: req.body.id,
    username: req.body.username,
  };
  try {
    const query = sqlq.insert_user_into_table(newUser);
    // const query = sqlq.insert_into_table(
    //   "users",
    //   ["id", "username"],
    //   [newUser.id, newUser.username]
    // );
    const client = await pool.connect();
    const results = await client.query(query);
    client.release();
    res.json({ msg: "User successfully added." });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Postgres delete user and associated words
router.delete("/:id", async (req, res) => {
  console.log(
    `/api/users/ : DELETE received for user with id of ${req.params.id}`
  );
  try {
    const query1 = sqlq.delete_from_table_filter("users", "id", req.params.id);
    const query2 = sqlq.delete_from_table_filter(
      "words",
      "userid",
      req.params.id
    );
    const client = await pool.connect();
    client.query(query1);
    client.query(query2);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

module.exports = router;
