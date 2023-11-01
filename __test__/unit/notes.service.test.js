const { db } = require('../../config');
const { AppError } = require('../../src/util');
const noteService = require('../../src/services/notes.service');

//mock DB exposed from config.
jest.mock('../../config', () => ({
  db: {
    note: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('Test notes.service module UNIT-Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('createNote method', () => {
    it('Should throw error if any field is missed', async () => {
      await expect(noteService.createNote()).rejects.toThrow(AppError);
    });
    it('should throw error if error happen while creating note object', async () => {
      db.note.create.mockReturnValue(null);
      await expect(
        noteService.createNote('12', 'note body', 'note title'),
      ).rejects.toThrow('Error happen while creating note,please try agin');
    });
    //happy-scenario
    it('Should create new note', async () => {
      db.note.create.mockReturnValue({ title: 'aaa' });
      await expect(
        noteService.createNote('12', 'note body', 'title'),
      ).resolves.not.toThrow();
    });
  });

  describe('getAllNotes method', () => {
    it("Should return user's notes", async () => {
      await expect(noteService.getAllNotes('2')).resolves.not.toThrow();
      expect(db.note.findMany).toBeCalled();
    });
  });

  describe('getNote method', () => {
    it('Should throw appError if the not is not found', async () => {
      db.note.findUnique.mockReturnValue(null);
      await expect(noteService.getNote('1', '22')).rejects.toThrow('Not Found');
    });

    //happy Scenario
    it('Should return the note', async () => {
      db.note.findUnique.mockReturnValue({ body: 'note' });
      await expect(noteService.getNote('1', '1')).resolves.not.toThrow();
      expect(db.note.findUnique).toBeCalled();
    });
  });

  describe('updateNote method', () => {
    it('Should throw error if the note is not found', async () => {
      db.note.findUnique.mockReturnValue(null);
      await expect(noteService.updateNote('12', '12', '12')).rejects.toThrow(
        'Note not Found',
      );
    });

    it('Should throw error  if the user have no access to the note', async () => {
      db.note.findUnique.mockReturnValue({ authId: '1' });
      await expect(noteService.updateNote('1', '2', '111')).rejects.toThrow(
        'You have no permission to do this action.',
      );
    });

    it('Should throw an error if an internal error happen while updating the note', async () => {
      db.note.findUnique.mockReturnValue({ authorId: '1' });
      db.note.update.mockReturnValue(null);
      await expect(noteService.updateNote('1', '1', '1')).rejects.toThrow(
        'Error happen while updating note, please try again',
      );
    });
    //happy scenario
    it('Should update the note', async () => {
      db.note.findUnique.mockReturnValue({ authorId: '1' });
      db.note.update.mockResolvedValue({ note: 'updated' });
      await expect(
        noteService.updateNote('1', '1', '1'),
      ).resolves.not.toThrow();
    });
  });
});
