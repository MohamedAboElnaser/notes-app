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
    select: {
      noteId: false,
      id: true,
      authorId: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return notes;
};

const getNote = async (id, authorId) => {
  const note = await db.note.findUnique({
    where: {
      id,
      authorId,
    },
  });
  console.log(note);
  if (!note) throw new AppError('Not Found.', 404);
  return note;
};

const updateNote = async (noteId, authorId, data) => {
  try {
    //fetch the note record using noteId
    const note = await db.note.findUnique({
      where: {
        id: noteId,
      },
      select: {
        authorId: true,
      },
    });
    if (!note) throw new AppError('Note not Found', 404);

    //check that current user has access to the note
    if (note.authorId !== authorId) throw new AppError('Not Authorized!', 401);

    //update the note
    const updatedNote = await db.note.update({
      where: {
        id: noteId,
      },
      data,
    });
    if (!updatedNote)
      throw new AppError(
        'Error happen while updating note, please try again',
        500,
      );
    return updatedNote;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNote,
  updateNote,
};
