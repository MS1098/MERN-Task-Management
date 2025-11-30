const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/signup
router.post('/signup', async (req,res) => {
  try {
    const { name, email, password, role } = req.body;
    if(await User.findOne({ email })) return res.status(400).json({message:'User exists'});
    const user = new User({ name, email, password, role: role === 'admin' ? 'admin' : 'user' });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id:user._id, name:user.name, email:user.email, role:user.role }});
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// POST /api/auth/signin
router.post('/signin', async (req,res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("user:",user);
    if(!user) return res.status(400).json({message:'Invalid credentials'});
    const match = await user.matchPassword(password);
    console.log("pass:::",match)
    if(!match) return res.status(400).json({message:'Invalid credentials'});
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id:user._id, name:user.name, email:user.email, role:user.role }});
  } catch(err) { res.status(500).json({ error: err.message }); }
});

router.get('/debug/list-users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
