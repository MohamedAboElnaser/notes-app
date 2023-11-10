const { db } = require('../../config');
const { AppError } = require('../util');

const createNote = async (authorId, noteBody, noteTitle) => {
  if (!authorId || !noteBody || !noteTitle)
    throw new AppError('Missing required fields', 500);

  const newNote = await db.note.create({
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
    if (note.authorId !== authorId)
      throw new AppError('You have no permission to do this action.', 403);

    //update the note
    const updatedNote = await db.note.update({
      where: {
        id: noteId,
      },
      data: {
        title: data.title,
        body: data.body,
        updatedAt: new Date(),
      },
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

const deleteNote = async (noteId, authorId) => {
  try {
    //fetch note by noteId [uuid]
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
    if (note.authorId !== authorId)
      throw new AppError('You have no permission to do this action', 403);

    //delete note
    const deletedNote = await db.note.delete({
      where: {
        id: noteId,
      },
    });
    if (!deletedNote)
      throw new AppError(
        'Error happen while deleting the note, please try again.',
        500,
      );
  } catch (err) {
    throw err;
  }
};
module.exports = {
  createNote,
  getAllNotes,
  getNote,
  updateNote,
  deleteNote,
};
