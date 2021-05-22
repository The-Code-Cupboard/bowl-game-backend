const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();

const { Pool } = require("pg");

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
  console.log("/api/users: GET received");
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users;");
    res.json(result ? result.rows : null);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Postgres get single user
// TODO : response seems to always be returning {} -- fix this when this route is needed
router.get("/:id", async (req, res) => {
  console.log(`/api/users: GET received for user with id: ${req.params.id}`);
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT * FROM users WHERE id='${req.params.id}';`
    );
    res.json({ id: result.rows[0].id, username: result.rows[0].username });
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Postgres create user
router.post("/", async (req, res) => {
  console.log("/api/users: POST received");
  const newUser = {
    id: req.body.id,
    username: req.body.username,
  };
  try {
    const client = await pool.connect();
    console.log(`Before SQL query for to insert ${newUser}`);
    const results = await client.query(
      `INSERT INTO users (id, username) VALUES ('${newUser.id}', '${newUser.username}');`
    );
    console.log(`After SQL query for to insert ${newUser}`);
    client.release();
    res.json({ msg: "Word successfully added." });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Postgres Update User
router.put("/", async (req, res) => {
  console.log(
    `/api/users/ : PUT received for user with id of ${req.params.id}`
  );
  const updMember = req.body;
  try {
    const client = await pool.connect();
    client.query(
      `UPDATE users SET username='${updMember.username}' WHERE id='${updMember.id}';`
    );
    res.json({ msg: "User updated", updMember });
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
    const client = await pool.connect();
    client.query(`DELETE FROM users WHERE id='${req.params.id}';`);
    client.query(`DELETE FROM words WHERE userid='${req.params.id}';`);
    // const result = await client.query("SELECT * FROM users;");
    // res.json(result ? buildFromList(result.rows) : null);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

module.exports = router;
