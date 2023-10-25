const express = require("express");
const morgan = require("morgan");

const authRouter = require("./routes/auth.router");

const app = express();

//pre-middlewares
app.use(morgan("dev"));

app.use(express.json());

app.use("/api/v1/auth", authRouter);
module.exports = app;
