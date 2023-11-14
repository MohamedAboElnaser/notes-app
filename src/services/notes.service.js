const { db } = require('../../config');
const { AppError } = require('../util');
/**
 * Creates a new note and associates it with the specified author.
 *
 * @param {string} authorId - The unique identifier of the author.
 * @param {string} noteBody - The content/body of the note.
 * @param {string} noteTitle - The title of the note.
 * @throws {AppError} Throws an error if any of the required fields are missing.
 * @throws {AppError} Throws an error if an issue occurs while creating the note.
 * @returns {Promise<object>} Returns a Promise that resolves to the created note object.
 * @async
 * @function
 * @name createNote
 */

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
/**
 * Retrieves all notes associated with a specific author.
 *
 * @param {string} authorId - The unique identifier of the author.
 * @throws {AppError} Throws an error if the authorId is missing.
 * @returns {Promise<Array<object>>} Returns a Promise that resolves to an array of note objects.
 * @async
 * @function
 * @name getAllNotes
 */
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

/**
 * Retrieves a specific note based on its ID and author.
 *
 * @param {string} id - The unique identifier of the note.
 * @param {string} authorId - The unique identifier of the author associated with the note.
 * @throws {AppError} Throws an error if the note is not found.
 * @returns {Promise<object>} Returns a Promise that resolves to the found note object.
 * @async
 * @function
 * @name getNote
 */

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

/**
 * Updates a specific note based on its ID and author, with the provided data.
 *
 * @param {string} noteId - The unique identifier of the note to be updated.
 * @param {string} authorId - The unique identifier of the author associated with the note.
 * @param {object} data - The data to update the note with, including title and body.
 * @throws {AppError} Throws an error if the note is not found.
 * @throws {AppError} Throws an error if the current user doesn't have permission to update the note.
 * @throws {AppError} Throws an error if an issue occurs while updating the note.
 * @returns {Promise<object>} Returns a Promise that resolves to the updated note object.
 * @async
 * @function
 * @name updateNote
 */
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

/**
 * Deletes a specific note based on its ID and author.
 *
 * @param {string} noteId - The unique identifier of the note to be deleted.
 * @param {string} authorId - The unique identifier of the author associated with the note.
 * @throws {AppError} Throws an error if the note is not found.
 * @throws {AppError} Throws an error if the current user doesn't have permission to delete the note.
 * @throws {AppError} Throws an error if an issue occurs while deleting the note.
 * @async
 * @function
 * @name deleteNote
 */
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
