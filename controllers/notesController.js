const { getFirestore } = require('../config/firebase');

// Get all notes for a user
const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.uid;
    const db = getFirestore();

    const notesSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('notes')
      .orderBy('updatedAt', 'desc')
      .get();

    const notes = [];
    notesSnapshot.forEach((doc) => {
      notes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({ success: true, notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single note
const getNote = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { noteId } = req.params;
    const db = getFirestore();

    const noteDoc = await db
      .collection('users')
      .doc(userId)
      .collection('notes')
      .doc(noteId)
      .get();

    if (!noteDoc.exists) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    res.json({
      success: true,
      note: {
        id: noteDoc.id,
        ...noteDoc.data(),
      },
    });
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { title, body, notebook } = req.body;
    const db = getFirestore();

    const now = new Date().toISOString();
    const noteData = {
      title: title || 'Sin título',
      body: body || '',
      notebook: notebook || 'general',
      createdAt: now,
      updatedAt: now,
      userId,
    };

    const noteRef = await db
      .collection('users')
      .doc(userId)
      .collection('notes')
      .add(noteData);

    res.status(201).json({
      success: true,
      note: {
        id: noteRef.id,
        ...noteData,
      },
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { noteId } = req.params;
    const updates = req.body;
    const db = getFirestore();

    const noteRef = db
      .collection('users')
      .doc(userId)
      .collection('notes')
      .doc(noteId);

    const noteDoc = await noteRef.get();
    if (!noteDoc.exists) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await noteRef.update(updateData);

    const updatedNote = await noteRef.get();

    res.json({
      success: true,
      note: {
        id: updatedNote.id,
        ...updatedNote.data(),
      },
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { noteId } = req.params;
    const db = getFirestore();

    const noteRef = db
      .collection('users')
      .doc(userId)
      .collection('notes')
      .doc(noteId);

    const noteDoc = await noteRef.get();
    if (!noteDoc.exists) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    await noteRef.delete();

    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get notes by notebook
const getNotesByNotebook = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { notebookId } = req.params;
    const db = getFirestore();

    const notesSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('notes')
      .where('notebook', '==', notebookId)
      .orderBy('updatedAt', 'desc')
      .get();

    const notes = [];
    notesSnapshot.forEach((doc) => {
      notes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({ success: true, notes });
  } catch (error) {
    console.error('Error fetching notes by notebook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getNotesByNotebook,
};
