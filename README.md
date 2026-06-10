# 🧵 THREADS — Backend API

Node.js + Express REST API for the THREADS fashion store.

## Quick Start

```bash
cd threads-backend
npm install
npm start          # → http://localhost:3001
```

Then open `index.html` in your browser (or serve it with `npx serve .`).

---

## Default Credentials

| Role     | Email                  | Password   |
|----------|------------------------|------------|
| Admin    | admin@threads.com      | admin123   |
| Customer | demo@example.com       | demo123    |

---

## API Reference

### Auth
| Method | Endpoint              | Auth     | Description           |
|--------|-----------------------|----------|-----------------------|
| POST   | /api/auth/register    | —        | Register new user     |
| POST   | /api/auth/login       | —        | Login, returns JWT    |
| GET    | /api/auth/me          | Bearer   | Get current user      |

### Products
| Method | Endpoint              | Auth     | Description           |
|--------|-----------------------|----------|-----------------------|
| GET    | /api/products         | —        | List all products     |
| GET    | /api/products?cat=men | —        | Filter by category    |
| GET    | /api/products/:id     | —        | Get single product    |
| POST   | /api/products         | Admin    | Create product        |
| PUT    | /api/products/:id     | Admin    | Update product        |
| DELETE | /api/products/:id     | Admin    | Delete product        |

### Orders
| Method | Endpoint                   | Auth     | Description              |
|--------|----------------------------|----------|--------------------------|
| GET    | /api/orders                | Bearer   | My orders (all if admin) |
| GET    | /api/orders/:id            | Bearer   | Single order             |
| POST   | /api/orders                | Bearer   | Place order              |
| PATCH  | /api/orders/:id/status     | Admin    | Update order status      |

### Users (Admin only)
| Method | Endpoint        | Auth   | Description     |
|--------|-----------------|--------|-----------------|
| GET    | /api/users      | Admin  | List all users  |
| GET    | /api/users/:id  | Admin  | Get user        |
| PATCH  | /api/users/:id  | Admin  | Update user     |
| DELETE | /api/users/:id  | Admin  | Delete user     |

---

## Notes

- **In-memory storage** — data resets on server restart. Swap `db.js` for MongoDB/PostgreSQL for persistence.
- JWT tokens expire in **7 days**.
- CORS is open (`*`) for local development — restrict in production.
