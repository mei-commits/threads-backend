require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { seed } = require('./db');

const app = express();

// ── Middleware ───────────────────────────────────────────────────
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','PATCH','DELETE'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json());

// ── Request logger ───────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/users',    require('./routes/users'));

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ── 404 ──────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
seed().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🧵 THREADS API running on http://localhost:${PORT}`);
    console.log(`   Auth   → POST /api/auth/register | /api/auth/login`);
    console.log(`   Me     → GET  /api/auth/me`);
    console.log(`   Products → GET/POST/PUT/DELETE /api/products`);
    console.log(`   Orders   → GET/POST /api/orders`);
    console.log(`   Users    → GET/PATCH/DELETE /api/users  (admin)`);
    console.log(`\n   Admin credentials: admin@threads.com / admin123`);
    console.log(`   Demo user:          demo@example.com / demo123\n`);
  });
});
