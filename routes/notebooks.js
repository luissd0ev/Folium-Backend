const express = require('express');
const router = express.Router();
const {
  getAllNotebooks,
  getNotebook,
  createNotebook,
  updateNotebook,
  deleteNotebook,
} = require('../controllers/notebooksController');

// Get all notebooks
router.get('/', getAllNotebooks);

// Get a single notebook
router.get('/:notebookId', getNotebook);

// Create a new notebook
router.post('/', createNotebook);

// Update a notebook
router.put('/:notebookId', updateNotebook);

// Delete a notebook
router.delete('/:notebookId', deleteNotebook);

module.exports = router;
