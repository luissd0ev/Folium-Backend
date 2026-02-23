const { getFirestore } = require('../config/firebase');

// Get all notebooks for a user
const getAllNotebooks = async (req, res) => {
  try {
    const userId = req.user.uid;
    const db = getFirestore();

    const notebooksSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('notebooks')
      .orderBy('createdAt', 'desc')
      .get();

    const notebooks = [];
    notebooksSnapshot.forEach((doc) => {
      notebooks.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({ success: true, notebooks });
  } catch (error) {
    console.error('Error fetching notebooks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single notebook
const getNotebook = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { notebookId } = req.params;
    const db = getFirestore();

    const notebookDoc = await db
      .collection('users')
      .doc(userId)
      .collection('notebooks')
      .doc(notebookId)
      .get();

    if (!notebookDoc.exists) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    res.json({
      success: true,
      notebook: {
        id: notebookDoc.id,
        ...notebookDoc.data(),
      },
    });
  } catch (error) {
    console.error('Error fetching notebook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new notebook
const createNotebook = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { name } = req.body;
    const db = getFirestore();

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Notebook name is required' });
    }

    const now = new Date().toISOString();
    const notebookData = {
      name: name.trim(),
      createdAt: now,
      userId,
    };

    const notebookRef = await db
      .collection('users')
      .doc(userId)
      .collection('notebooks')
      .add(notebookData);

    res.status(201).json({
      success: true,
      notebook: {
        id: notebookRef.id,
        ...notebookData,
      },
    });
  } catch (error) {
    console.error('Error creating notebook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a notebook
const updateNotebook = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { notebookId } = req.params;
    const { name } = req.body;
    const db = getFirestore();

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Notebook name is required' });
    }

    const notebookRef = db
      .collection('users')
      .doc(userId)
      .collection('notebooks')
      .doc(notebookId);

    const notebookDoc = await notebookRef.get();
    if (!notebookDoc.exists) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    const updateData = {
      name: name.trim(),
    };

    await notebookRef.update(updateData);

    const updatedNotebook = await notebookRef.get();

    res.json({
      success: true,
      notebook: {
        id: updatedNotebook.id,
        ...updatedNotebook.data(),
      },
    });
  } catch (error) {
    console.error('Error updating notebook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a notebook
const deleteNotebook = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { notebookId } = req.params;
    const db = getFirestore();

    // Don't allow deleting the 'general' notebook
    if (notebookId === 'general') {
      return res.status(400).json({ success: false, error: 'Cannot delete the general notebook' });
    }

    const notebookRef = db
      .collection('users')
      .doc(userId)
      .collection('notebooks')
      .doc(notebookId);

    const notebookDoc = await notebookRef.get();
    if (!notebookDoc.exists) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    // Move all notes from this notebook to 'general'
    const notesSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('notes')
      .where('notebook', '==', notebookId)
      .get();

    const batch = db.batch();

    notesSnapshot.forEach((doc) => {
      batch.update(doc.ref, { notebook: 'general' });
    });

    batch.delete(notebookRef);

    await batch.commit();

    res.json({
      success: true,
      message: 'Notebook deleted successfully. Notes moved to general notebook.',
    });
  } catch (error) {
    console.error('Error deleting notebook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllNotebooks,
  getNotebook,
  createNotebook,
  updateNotebook,
  deleteNotebook,
};
