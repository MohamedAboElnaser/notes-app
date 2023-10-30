const { catchAsync } = require('../util');
const notesService = require('../services/notes.service');

const createNote = catchAsync(async (req, res, next) => {
  const { title, body } = req.body;
  const { userId } = req.user;
  const note = await notesService.createNote(userId, body, title);

  return res.status(201).json({
    status: 'success',
    message: 'Note created successfully.',
    data: {
      note,
    },
  });
});

const getNotes = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const notes = await notesService.getAllNotes(userId);

  return res.status(200).json({
    status: 'success',
    message: 'Notes returned successfully',
    length: notes.length,
    data: {
      notes,
    },
  });
});

const getNote = catchAsync(async (req, res, next) => {
  const { noteId } = req.params;
  const { userId } = req.user;
  const note = await notesService.getNote(noteId, userId);

  return res.status(200).json({
    status: 'success',
    message: 'Note object returned successful',
    data: {
      note,
    },
  });
});
module.exports = {
  createNote,
  getNotes,
  getNote,
};
