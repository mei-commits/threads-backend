const router = require('express').Router();
const { db, nextId } = require('../db');
const { auth, adminOnly } = require('../middleware');

// GET /api/products  (public)
router.get('/', (req, res) => {
  const { cat, search } = req.query;
  let list = [...db.products];
  if (cat && cat !== 'all') {
    const kidsGroup = ['boys', 'girls', 'kids'];
    list = cat === 'kids'
      ? list.filter(p => kidsGroup.includes(p.cat))
      : list.filter(p => p.cat === cat);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
  }
  res.json({ products: list, total: list.length });
});

// GET /api/products/:id  (public)
router.get('/:id', (req, res) => {
  const p = db.products.find(p => p.id === Number(req.params.id));
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json({ product: p });
});

// POST /api/products  (admin)
router.post('/', auth, adminOnly, (req, res) => {
  const { name, cat, price, oldPrice, badge, sizes, img, stock } = req.body;
  if (!name || !cat || !price) return res.status(400).json({ error: 'name, cat and price are required' });
  const product = {
    id: nextId('products'),
    name, cat,
    price: Number(price),
    oldPrice: oldPrice ? Number(oldPrice) : null,
    badge: badge || null,
    sizes: sizes || [],
    img: img || '',
    stock: stock ? Number(stock) : 0,
    createdAt: new Date().toISOString(),
  };
  db.products.push(product);
  res.status(201).json({ product });
});

// PUT /api/products/:id  (admin)
router.put('/:id', auth, adminOnly, (req, res) => {
  const idx = db.products.findIndex(p => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  db.products[idx] = { ...db.products[idx], ...req.body, id: db.products[idx].id };
  res.json({ product: db.products[idx] });
});

// DELETE /api/products/:id  (admin)
router.delete('/:id', auth, adminOnly, (req, res) => {
  const idx = db.products.findIndex(p => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  db.products.splice(idx, 1);
  res.json({ message: 'Product deleted' });
});

module.exports = router;
