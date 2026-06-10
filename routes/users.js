const router = require('express').Router();
const { db } = require('../db');
const { auth, adminOnly } = require('../middleware');

function safeUser(u) {
  const { password, ...rest } = u;
  return rest;
}

// GET /api/users  (admin)
router.get('/', auth, adminOnly, (req, res) => {
  res.json({ users: db.users.map(safeUser), total: db.users.length });
});

// GET /api/users/:id  (admin or self)
router.get('/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  if (req.user.role !== 'admin' && req.user.id !== id)
    return res.status(403).json({ error: 'Forbidden' });
  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: safeUser(user) });
});

// PATCH /api/users/:id  (admin or self — no role escalation)
router.patch('/:id', auth, (req, res) => {
  const id = Number(req.params.id);
  if (req.user.role !== 'admin' && req.user.id !== id)
    return res.status(403).json({ error: 'Forbidden' });
  const idx = db.users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });

  const { name, email } = req.body;
  if (name) db.users[idx].name = name;
  if (email) db.users[idx].email = email.toLowerCase();
  // role can only be changed by admin
  if (req.body.role && req.user.role === 'admin') db.users[idx].role = req.body.role;

  res.json({ user: safeUser(db.users[idx]) });
});

// DELETE /api/users/:id  (admin only)
router.delete('/:id', auth, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  if (id === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  const idx = db.users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  db.users.splice(idx, 1);
  res.json({ message: 'User deleted' });
});

module.exports = router;
