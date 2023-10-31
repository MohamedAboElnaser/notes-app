const { db } = require('../../config');
const { AppError } = require('../../src/util');
const noteService = require('../../src/services/notes.service');

//mock DB exposed from config.
jest.mock('../../config', () => ({
  db: {
    note: {
      create: jest.fn(),
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
});
