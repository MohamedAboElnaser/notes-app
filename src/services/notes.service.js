const { db } = require('../../config');
const { AppError } = require('../util');

const createNote = async (authorId, noteBody, noteTitle) => {
  if ((!authorId, !noteBody || !noteTitle))
    throw new AppError('Missing required fields', 500);

  const newNote = db.note.create({
    data: {
      body: noteBody,
      title: noteTitle,
      authorId,
    },
  });

  if (!newNote)
    throw new AppError('Error happen while creating note,please try agin', 500);

  return newNote;
};

const getAllNotes = async (authorId) => {
  const notes = await db.note.findMany({
    where: {
      authorId,
    },
  });
  return notes;
};
module.exports = {
  createNote,
  getAllNotes,
};
