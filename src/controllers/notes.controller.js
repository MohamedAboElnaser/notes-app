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

const getNotes = catchAsync(async (req, res, next) => {});

module.exports = {
  createNote,
  getNotes,
};
