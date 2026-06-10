const bcrypt = require('bcryptjs');

// ── In-memory store ──────────────────────────────────────────────
const db = {
  users: [],
  products: [],
  orders: [],
  _nextId: { users: 1, products: 100, orders: 1000 },
};

function nextId(table) {
  return db._nextId[table]++;
}

// ── Seed admin ───────────────────────────────────────────────────
async function seed() {
  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  db.users.push({
    id: nextId('users'),
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@threads.com',
    password: adminHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
  });

  // Demo customer
  const userHash = await bcrypt.hash('demo123', 10);
  db.users.push({
    id: nextId('users'),
    name: 'Demo Customer',
    email: 'demo@example.com',
    password: userHash,
    role: 'user',
    createdAt: new Date().toISOString(),
  });

  // Seed products
  const rawProducts = [
    { name:'Classic Oxford Shirt',   cat:'men',   price:1299, oldPrice:null, badge:'new',  sizes:['S','M','L','XL'],          img:'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80', stock:45 },
    { name:'Slim Fit Chinos',        cat:'men',   price:1799, oldPrice:2200, badge:'sale', sizes:['M','L','XL'],               img:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80', stock:30 },
    { name:'Casual Linen Blazer',    cat:'men',   price:3499, oldPrice:null, badge:'hot',  sizes:['S','M','L'],                img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', stock:18 },
    { name:'Round Neck T-Shirt',     cat:'men',   price:699,  oldPrice:null, badge:null,   sizes:['S','M','L','XL','XXL'],     img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', stock:120 },
    { name:'Floral Wrap Dress',      cat:'women', price:2199, oldPrice:null, badge:'new',  sizes:['XS','S','M','L'],           img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80', stock:22 },
    { name:'Printed Kurta Set',      cat:'women', price:1599, oldPrice:1999, badge:'sale', sizes:['S','M','L','XL'],           img:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80', stock:55 },
    { name:'High-Rise Jeans',        cat:'women', price:2499, oldPrice:null, badge:'hot',  sizes:['26','28','30','32'],         img:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80', stock:40 },
    { name:'Cotton Crop Top',        cat:'women', price:799,  oldPrice:null, badge:null,   sizes:['XS','S','M','L'],           img:'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80', stock:80 },
    { name:'Boys Denim Jacket',      cat:'boys',  price:1299, oldPrice:null, badge:'new',  sizes:['4Y','6Y','8Y','10Y'],       img:'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80', stock:25 },
    { name:'Boys Cotton Shorts Set', cat:'boys',  price:699,  oldPrice:null, badge:null,   sizes:['2Y','4Y','6Y','8Y'],        img:'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80', stock:60 },
    { name:'Girls Frock Dress',      cat:'girls', price:899,  oldPrice:null, badge:'hot',  sizes:['2Y','4Y','6Y','8Y'],        img:'https://images.unsplash.com/photo-1518831959646-742c3a14ebf6?w=600&q=80', stock:35 },
    { name:'Girls Ethnic Lehenga',   cat:'girls', price:1499, oldPrice:1899, badge:'sale', sizes:['4Y','6Y','8Y','10Y'],       img:'https://images.unsplash.com/photo-1594938298603-c8148e0c29e1?w=600&q=80', stock:20 },
    { name:'Kids Unisex Hoodie',     cat:'kids',  price:1099, oldPrice:null, badge:'new',  sizes:['4Y','6Y','8Y','10Y','12Y'], img:'https://images.unsplash.com/photo-1532453288672-3a17ac36f101?w=600&q=80', stock:50 },
    { name:"Boys School Uniform Set",cat:'boys',  price:999,  oldPrice:null, badge:null,   sizes:['4Y','6Y','8Y','10Y'],       img:'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=600&q=80', stock:90 },
    { name:'Girls Printed Leggings', cat:'girls', price:499,  oldPrice:null, badge:null,   sizes:['2Y','4Y','6Y','8Y'],        img:'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80', stock:75 },
    { name:"Men's Formal Trousers",  cat:'men',   price:1899, oldPrice:null, badge:null,   sizes:['28','30','32','34','36'],    img:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80', stock:38 },
  ];

  rawProducts.forEach(p => {
    db.products.push({ id: nextId('products'), ...p, createdAt: new Date().toISOString() });
  });

  // Seed a demo order
  db.orders.push({
    id: nextId('orders'),
    userId: 2,
    items: [{ productId: 100, name: 'Classic Oxford Shirt', qty: 1, price: 1299 }],
    total: 1299,
    status: 'delivered',
    address: '12 MG Road, Mumbai 400001',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  });
}

module.exports = { db, nextId, seed };
