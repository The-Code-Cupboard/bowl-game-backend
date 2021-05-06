const express = require("express");
const path = require("path");
const cors = require("cors");
const words = require("./Words");

const app = express();
app.use(cors());

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Members API routes
app.use("/api/words", require("./routes/api/words"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
