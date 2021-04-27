/* write your server code here */
const userRouter = require("./routes/users");
const apiRouter = require("./routes/api");

const express = require("express");
const { verify } = require("jsonwebtoken");
const app = express();
const options = require("./routes/options");

app.use(express.json());
app.use(options);
app.use("/users", userRouter);
app.use("/api", apiRouter);

app.use("*", (req, res) => {
  res.status(404).send("unknown endpoint");
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(403).send();
});

module.exports = app;

// require('dotenv').config();
// const cors = require('cors');

// const userRouter = require('./api/users/userRouter');

// app.use(cors());
// app.use(checkToken());

// Another Router
// app.use('/posts', postRouter);
