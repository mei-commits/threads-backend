const router = require('express').Router();
const { db, nextId } = require('../db');
const { auth, adminOnly } = require('../middleware');

// GET /api/orders  — user sees own, admin sees all
router.get('/', auth, (req, res) => {
  const list = req.user.role === 'admin'
    ? db.orders
    : db.orders.filter(o => o.userId === req.user.id);
  res.json({ orders: list.slice().reverse(), total: list.length });
});

// GET /api/orders/:id
router.get('/:id', auth, (req, res) => {
  const order = db.orders.find(o => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (req.user.role !== 'admin' && order.userId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden' });
  res.json({ order });
});

// POST /api/orders  — place an order (auth)
router.post('/', auth, (req, res) => {
  const { items, address } = req.body;
  if (!items || !items.length || !address)
    return res.status(400).json({ error: 'items and address are required' });

  // Validate items against products
  const enriched = [];
  for (const item of items) {
    const product = db.products.find(p => p.id === Number(item.productId));
    if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` });
    if (product.stock < item.qty) return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
    enriched.push({ productId: product.id, name: product.name, qty: item.qty, price: product.price });
    product.stock -= item.qty; // deduct stock
  }

  const total = enriched.reduce((s, i) => s + i.price * i.qty, 0);
  const order = {
    id: nextId('orders'),
    userId: req.user.id,
    userName: req.user.name,
    items: enriched,
    total,
    status: 'pending',
    address,
    createdAt: new Date().toISOString(),
  };
  db.orders.push(order);
  res.status(201).json({ order });
});

// PATCH /api/orders/:id/status  (admin)
router.patch('/:id/status', auth, adminOnly, (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const order = db.orders.find(o => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = status;
  order.updatedAt = new Date().toISOString();
  res.json({ order });
});

module.exports = router;
