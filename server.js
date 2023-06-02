const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const URI = process.env.URI;
const usersRoute = require("./routes/users");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", usersRoute);

app.use("*", (req, res) =>
  res.status(404).json({ message: "Page not found." })
);

//todo: add mongodb URI in .env file

main();

async function main() {
  try {
    await mongoose.connect(URI);
    console.log("connected to db");
    const server = app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
