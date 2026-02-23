const express = require('express');
const router = express.Router();
const {
  getAllNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getNotesByNotebook,
} = require('../controllers/notesController');

// Get all notes
router.get('/', getAllNotes);

// Get notes by notebook
router.get('/notebook/:notebookId', getNotesByNotebook);

// Get a single note
router.get('/:noteId', getNote);

// Create a new note
router.post('/', createNote);

// Update a note
router.put('/:noteId', updateNote);

// Delete a note
router.delete('/:noteId', deleteNote);

module.exports = router;
