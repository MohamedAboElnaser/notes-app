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

const updateNote = catchAsync(async (req, res, next) => {
  // TODO  validate request body
  const { userId } = req.user;
  const { noteId } = req.params;
  const updatedNote = await notesService.updateNote(noteId, userId, req.body);
  return res.status(200).json({
    status: 'success',
    message: 'Note updated successfully',
    data: {
      updatedNote,
    },
  });
});

const deleteNote=catchAsync(async (req,res,next)=>{
  const {noteId}=req.params;
  const {userId}=req.user;

  await notesService.deleteNote(noteId,userId);
  return res.status(200).json({
    status:'success',
    message:'Note deleted successfully'
  })
})
module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote
};
