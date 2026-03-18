const mongoose = require('mongoose');

const ChecklistSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }
});

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  isCompleted: { type: Boolean, default: false },
  checklist: [ChecklistSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', TodoSchema);