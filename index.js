const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static(__dirname + "/public"));
const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Unit4CareerSim",
  port: 5433,
  password: "Mlynch24",
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// Authentication middleware
const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
});
app.post(
  "/login",
  asyncHandler(async (req, res) => {
    // You'll need a users table with hashed passwords
    const { username, password } = req.body;
    const userResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = userResult.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({ accessToken });
    } else {
      res.send("Username or password incorrect");
    }
  })
);

app.get("/api/books", async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT "ID", "Title", "Author", "Synopsis" FROM public."books"'
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" + err });
  }
});

app.get("/api/books/:id/reviews", async (req, res) => {
  const result = await db.query(
    'SELECT "ID", "review_comments", "review_rating", "user_id", "book_id", "review_title" FROM public."reviews" WHERE book_id = $1',
    [req.params.id]
  );
  res.json(result.rows);
});
app.get("/api/users", async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT "ID", "Name", "Email", "Registered" FROM public."users"'
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" + err });
  }
});

app.get("/api/reviews", async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT "ID", "review_comments", "review_rating", "user_id", "book_id", "review_title" FROM public."reviews"'
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" + err });
  }
});
