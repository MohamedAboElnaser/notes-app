const express = require("express");
const morgan = require("morgan");

const { AppError } = require("./util");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const authRouter = require("./routes/auth.router");

const app = express();

//pre-middlewares
app.use(morgan("dev"));

app.use(express.json());

app.use("/api/v1/auth", authRouter);

//post-middlewares
app.all("*", (req, res, next) => {
    next(new AppError(`Can not response to ${req.originalUrl}`, 404));
});

//Global Error handler
app.use(globalErrorHandler);
module.exports = app;
