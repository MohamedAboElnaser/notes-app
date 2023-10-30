const notesRouter = require('express').Router();
const notesController = require('../controllers/notes.controller');

notesRouter
  .route('/')
  .post(notesController.createNote)
  .get(notesController.getNotes);
