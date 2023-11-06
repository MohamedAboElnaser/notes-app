const notesRouter = require('express').Router();
const notesController = require('../controllers/notes.controller');
const {protectMiddleWare,validationMiddleWare} = require('../middlewares');

notesRouter.use(protectMiddleWare);
notesRouter.use(validationMiddleWare)
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
