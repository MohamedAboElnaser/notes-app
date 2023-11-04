const notesRouter = require('express').Router();
const notesController = require('../controllers/notes.controller');
const protect = require('../middlewares/protectMIddleware');

notesRouter.use(protect);

notesRouter
  .route('/')
  .post(notesController.createNote)
  .get(notesController.getNotes);

notesRouter
  .route('/:noteId')
  .get(notesController.getNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote);
module.exports = notesRouter;
