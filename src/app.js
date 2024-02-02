const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { AppError } = require('./util');
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const authRouter = require('./routes/auth.router');
const notesRouter = require('./routes/notes.router');

const app = express();

//pre-middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/notes', notesRouter);

//post-middlewares
app.all('*', (req, res, next) => {
  next(new AppError(`Can not response to ${req.originalUrl}`, 404));
});

//Global Error handler
app.use(globalErrorHandler);
module.exports = app;
