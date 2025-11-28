const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Task = require('../models/Task');

// Create task
router.post('/', auth, async (req,res) => {
  try {
    const { title, description, status } = req.body;
    const task = new Task({ title, description, status, createdBy: req.user._id });
    await task.save();
    res.json(task);
  } catch(err) { res.status(500).json({error: err.message}); }
});

// List tasks with pagination and optional filter
router.get('/', auth, async (req,res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // optionally filter by status
    const filter = {};
    if(req.query.status) filter.status = req.query.status;
    // only list all tasks for admin, for normal user show only their tasks
    if(req.user.role !== 'admin') filter.createdBy = req.user._id;

    const skip = (page-1)*limit;
    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({createdAt:-1}).skip(skip).limit(limit).populate('createdBy','name email'),
      Task.countDocuments(filter)
    ]);
    res.json({ tasks, page, totalPages: Math.ceil(total/limit), total });
  } catch(err) { res.status(500).json({error:err.message}); }
});

// Update task
router.put('/:id', auth, async (req,res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new:true });
    if(!updated) return res.status(404).json({message:'Task not found'});
    res.json(updated);
  } catch(err){ res.status(500).json({error:err.message}); }
});

// Delete task (only admin)
router.delete('/:id', auth, role('admin'), async (req,res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if(!deleted) return res.status(404).json({message:'Task not found'});
    res.json({message:'Task deleted'});
  } catch(err){ res.status(500).json({error:err.message}); }
});

module.exports = router;
