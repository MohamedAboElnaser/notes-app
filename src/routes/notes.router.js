const notesRouter = require('express').Router();
const notesController = require('../controllers/notes.controller');
const  protect   = require('../middlewares/protectMIddleware');

notesRouter
  .route('/')
  .post(protect, notesController.createNote)
  .get(protect,notesController.getNotes);

module.exports = notesRouter;
