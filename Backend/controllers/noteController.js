const Note = require('../models/Note');

// Get all notes for user
exports.getNotes = async (req, res) => {
  const notes = await Note.find({ userId: req.user._id }).sort({ updatedAt: -1 });
  res.json({ success: true, data: notes });
};

// Create note
exports.createNote = async (req, res) => {
  const note = await Note.create({
    userId: req.user._id,
    title: req.body.title || '',
    content: req.body.content || ''
  });
  res.status(201).json({ success: true, data: note });
};

// Update note
exports.updateNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { title: req.body.title, content: req.body.content, updatedAt: Date.now() },
    { new: true }
  );
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
  res.json({ success: true, data: note });
};

// Delete note
exports.deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
  res.json({ success: true });
};
