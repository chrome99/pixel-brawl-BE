const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const URI = process.env.URI;
const usersRoute = require("./routes/users");


//Preperation
const app = express();
app.use(express.json());
app.use(cors());

//Routes
app.use("/user", usersRoute);

app.use("*", (req, res) =>
  res.status(404).json({ message: "Page not found." })
);

//Error handling 
app.use((err, req, res) => {
  console.log(`ERROR => ${err}`)
  res.status(400).send(err)
})



main();

async function main() {
  try {
    await mongoose.connect(URI, {dbName: "pixelDB"}).then(console.log("connected to db"));
    const server = app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
