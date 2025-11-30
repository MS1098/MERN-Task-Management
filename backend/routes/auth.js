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

router.get("/debug/test-pass", async (req, res) => {
  try {
    const user = await User.findOne({ email: "admin@example.com" }).lean();
    if (!user) return res.json({ found: false });

    const bcrypt = require("bcryptjs");
    const match = await bcrypt.compare("admin123", user.password);

    res.json({
      found: true,
      storedHash: user.password,
      matchesAdmin123: match
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CREATE ADMIN ONLY ONCE
router.get('/debug/create-admin', async (req, res) => {
  const bcrypt = require("bcryptjs");
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);

  const user = await User.create({
    name: "Root Admin",
    email: "admin@example1.com",
    password: hashedPassword,
    role: "admin"
  });

  res.json({ message: "Admin created", user });
});




module.exports = router;
