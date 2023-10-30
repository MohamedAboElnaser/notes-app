const { catchAsync } = require('../util');
const notesService = require('../services/notes.service');

const createNote = catchAsync(async (req, res, next) => {});

const getNotes = catchAsync(async (req, res, next) => {});

module.exports = {
  createNote,
  getNotes,
};
