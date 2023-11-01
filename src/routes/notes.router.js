const notesRouter = require('express').Router();
const notesController = require('../controllers/notes.controller');
const protect = require('../middlewares/protectMIddleware');

notesRouter
  .route('/')
  .post(protect, notesController.createNote)
  .get(protect, notesController.getNotes);

notesRouter
  .route('/:noteId')
  .get(protect, notesController.getNote)
  .patch(protect, notesController.updateNote)
  .delete(protect, notesController.deleteNote);
module.exports = notesRouter;
