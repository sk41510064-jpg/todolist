const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// 1. GET ALL: Saare tasks fetch karne ke liye
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. CREATE: Naya task add karne ke liye
router.post('/', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    checklist: req.body.checklist // [{ text: "item1" }, { text: "item2" }]
  });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. PATCH: Checklist item toggle karne ke liye
router.patch('/:todoId/checklist/:itemId', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.todoId);
    const item = todo.checklist.id(req.params.itemId);
    item.isCompleted = !item.isCompleted;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. DELETE: Task delete karne ke liye
router.delete('/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted Successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;