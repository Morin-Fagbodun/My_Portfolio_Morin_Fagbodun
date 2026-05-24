const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const DATA_FILE = path.join(__dirname, '../data/portfolio.json');

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

router.get('/', (req, res) => res.json(readData()));
router.get('/profile', (req, res) => res.json(readData().profile));
router.get('/skills', (req, res) => res.json(readData().skills));
router.get('/projects', (req, res) => res.json(readData().projects));
router.get('/work', (req, res) => res.json(readData().workExperience || []));

// ─── ADMIN PROTECTED ROUTES ───────────────────────────────────────────────────

// Profile
router.put('/profile', authMiddleware, (req, res) => {
  const data = readData();
  data.profile = { ...data.profile, ...req.body };
  writeData(data);
  res.json({ message: 'Profile updated.', profile: data.profile });
});

// Skills - replace all
router.put('/skills', authMiddleware, (req, res) => {
  const data = readData();
  data.skills = req.body;
  writeData(data);
  res.json({ message: 'Skills updated.', skills: data.skills });
});

// Skills - add one item
router.post('/skills/item', authMiddleware, (req, res) => {
  const { category, name, level } = req.body;
  if (!category || !name || !level)
    return res.status(400).json({ message: 'category, name, and level are required.' });
  const data = readData();
  if (!data.skills[category]) data.skills[category] = [];
  const newSkill = { id: Date.now(), name, level };
  data.skills[category].push(newSkill);
  writeData(data);
  res.status(201).json({ message: 'Skill added.', skill: newSkill });
});

// Skills - delete one item
router.delete('/skills/:category/:id', authMiddleware, (req, res) => {
  const data = readData();
  const { category, id } = req.params;
  if (!data.skills[category]) return res.status(404).json({ message: 'Category not found.' });
  data.skills[category] = data.skills[category].filter(s => s.id !== parseInt(id));
  writeData(data);
  res.json({ message: 'Skill deleted.' });
});

// Work Experience - replace entire array
router.put('/work', authMiddleware, (req, res) => {
  if (!Array.isArray(req.body))
    return res.status(400).json({ message: 'Expected an array.' });
  const data = readData();
  data.workExperience = req.body;
  writeData(data);
  res.json({ message: 'Work experience updated.', workExperience: data.workExperience });
});

// Projects - add
router.post('/projects', authMiddleware, (req, res) => {
  const data = readData();
  const newProject = {
    id: Date.now(),
    title: req.body.title || 'Untitled Project',
    description: req.body.description || '',
    image: req.body.image || '/assets/new-project-loading.png',
    githubUrl: req.body.githubUrl || '',
    liveUrl: req.body.liveUrl || '',
    tags: req.body.tags || [],
    featured: req.body.featured ?? false,
  };
  data.projects.push(newProject);
  writeData(data);
  res.status(201).json({ message: 'Project added.', project: newProject });
});

// Projects - update
router.put('/projects/:id', authMiddleware, (req, res) => {
  const data = readData();
  const idx = data.projects.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Project not found.' });
  data.projects[idx] = { ...data.projects[idx], ...req.body, id: data.projects[idx].id };
  writeData(data);
  res.json({ message: 'Project updated.', project: data.projects[idx] });
});

// Projects - delete
router.delete('/projects/:id', authMiddleware, (req, res) => {
  const data = readData();
  const idx = data.projects.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Project not found.' });
  data.projects.splice(idx, 1);
  writeData(data);
  res.json({ message: 'Project deleted.' });
});

module.exports = router;
