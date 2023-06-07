const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const socketServer = require("./sockets");
const cookieParser = require("cookie-parser");
const usersRoute = require("./routes/users");

const PORT = process.env.PORT || 8080;
const URI = process.env.URI;

//Preperation

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
//Routes
app.use((req, res, next) => {
  console.log(req.cookies.token);
  next();
});
app.use("/user", usersRoute);

app.use("*", (req, res) =>
  res.status(404).json({ message: "Page not found." })
);

//Error handling
app.use((err, req, res) => {
  console.log(`ERROR => ${err}`);
  res.status(400).send(err);
});

main();

async function main() {
  try {
    await mongoose
      .connect(URI, { dbName: "pixelDB" })
      .then(console.log("connected to db"));
    socketServer(io); // Start Socket.io server
    httpServer.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
