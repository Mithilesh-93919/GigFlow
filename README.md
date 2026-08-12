# ⚡ GigFlow — Lead Management CRM

> **GigFlow** is a modern, production-ready MERN stack CRM application built for efficient lead management. It features strict TypeScript typings, Role-Based Access Control (RBAC), real-time data dashboards, and a premium, responsive frontend.

---

## 🔗 Live Deployment

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | [https://client-two-gilt-35.vercel.app](https://client-two-gilt-35.vercel.app) |
| **Backend API (Render)** | [https://gigflow-api-awy7.onrender.com](https://gigflow-api-awy7.onrender.com) |
| **API Health Check** | [/api/v1/health](https://gigflow-api-awy7.onrender.com/api/v1/health) |
| **Database** | MongoDB Atlas (Cluster0) |

> ⚠️ **Note:** The backend runs on Render's free tier, which may take up to 50 seconds to spin up after inactivity. Wait a moment and retry if the first request times out.

---

## 📖 Project Overview

GigFlow equips sales teams and administrators with a high-performance workspace to track, query, and coordinate leads across various channels (Website, Instagram, Referrals). Built with scale in mind, it seamlessly integrates advanced data-grid functionalities — debounced searching, server-side pagination, status filtering, and dynamic CSV data exports — all wrapped in a premium, responsive UI.

---

## ✨ Features

- **Secure Authentication:** JWT-based session management with bcrypt-encrypted passwords and localStorage persistence.
- **Role-Based Access Control (RBAC):** `Admin` users can create, view, update, and delete leads. `Sales` users can create, view, and update, but cannot delete.
- **Real-Time Dashboard:** Live statistics (total leads, qualified count, conversion rate) and a recent leads feed — all powered by the actual API.
- **Advanced Lead Management:** Create, view (with detail page), edit inline, and delete leads with full form validation.
- **Server-Side Data Operations:** Scalable queries with skip/limit pagination, chronological sorting, and regex-powered global search.
- **One-Click CSV Export:** Instantly extract the active filtered lead list as a formatted CSV file.
- **Comprehensive Form Validation:** Zod schemas are shared between frontend (react-hook-form) and the backend Express routing layer for end-to-end integrity.
- **Premium UI/UX:** Glassmorphism accents, smooth micro-animations, skeleton loaders, graceful empty/error states.

---

## 🛠️ Tech Stack

### Backend (`/server`)
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | HTTP server and REST API |
| TypeScript | End-to-end type safety |
| MongoDB + Mongoose | Database and ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Zod | Request body validation |
| Winston | Structured logging |
| Helmet + CORS | Security headers |

### Frontend (`/client`)
| Technology | Purpose |
|-----------|---------|
| React 18 + TypeScript | UI framework |
| Vite | Build tool and dev server |
| TanStack Query | Server state management and caching |
| React Router v6 | Client-side routing + protected routes |
| Zustand | Auth state (with localStorage persistence) |
| Axios | HTTP client with interceptors |
| React Hook Form + Zod | Form management and validation |
| Lucide React | Icons |
| react-hot-toast | Notifications |
| Tailwind CSS | Utility-first styling |

---

## 📂 Project Structure

```
GigFlow/
├── client/                    # React frontend
│   ├── src/
│   │   ├── api/               # Axios API clients (auth, leads)
│   │   ├── components/        # Shared UI components (Table, Modal, Filters)
│   │   ├── hooks/             # Custom hooks (useAuth, useLeads)
│   │   ├── layouts/           # DashboardLayout with sidebar/navbar
│   │   ├── pages/             # Page components (Dashboard, Leads, Login, Register, LeadDetails)
│   │   ├── routes/            # ProtectedRoute wrapper
│   │   ├── store/             # Zustand auth store
│   │   ├── types/             # TypeScript interfaces (auth, lead)
│   │   └── utils/             # Helper utilities (cn, etc.)
│   ├── vercel.json            # Vercel SPA routing config
│   └── .env.production        # Production API URL
│
├── server/                    # Express backend API
│   ├── src/
│   │   ├── config/            # env, database, cors configuration
│   │   ├── controllers/       # Request handlers (auth, lead)
│   │   ├── middlewares/       # authenticate, authorize, validate, errorHandler
│   │   ├── models/            # Mongoose models (User, Lead)
│   │   ├── routes/            # Express routers (auth, lead, health)
│   │   ├── services/          # Business logic (auth.service, lead.service)
│   │   ├── types/             # Shared TypeScript types
│   │   ├── utils/             # AppError, asyncHandler, jwt, pagination
│   │   └── validators/        # Zod request schemas (auth, lead)
│   └── .env.example           # Environment variable template
│
└── docker-compose.yml         # Local Docker development setup
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local) or a MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone https://github.com/Mithilesh-93919/GigFlow.git
cd GigFlow
```

### 2. Install dependencies
```bash
# Install root + all workspace dependencies
npm install
```

### 3. Configure environment variables

**Server** — copy and fill in `/server/.env`:
```bash
cp server/.env.example server/.env
```

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gigflow
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_strong_random_secret_here
JWT_EXPIRES_IN=7d
LOG_LEVEL=debug
```

**Client** — create `/client/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 4. Start development servers
```bash
# From the root directory — starts both client and server concurrently
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/v1

---

## 🔑 API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/auth/register` | Public | Create a new account |
| `POST` | `/api/v1/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/v1/auth/profile` | Bearer Token | Get logged-in user profile |

### Leads
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/v1/leads` | Bearer | admin, sales | List all leads (paginated) |
| `POST` | `/api/v1/leads` | Bearer | admin, sales | Create a new lead |
| `GET` | `/api/v1/leads/export` | Bearer | admin, sales | Export leads to CSV |
| `GET` | `/api/v1/leads/:id` | Bearer | admin, sales | Get a single lead by ID |
| `PUT` | `/api/v1/leads/:id` | Bearer | admin, sales | Update a lead |
| `DELETE` | `/api/v1/leads/:id` | Bearer | **admin only** | Delete a lead |

### Health
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/health` | Public | Service health check |

### Query Parameters (GET /api/v1/leads)
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10) |
| `status` | string | Filter by: `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | Filter by: `Website`, `Instagram`, `Referral` |
| `search` | string | Regex search on name and email |
| `sort` | string | `latest` (default) or `oldest` |

---

## 🔐 Password Requirements

When registering, your password must:
- Be at least **8 characters** long
- Contain at least **one uppercase letter**
- Contain at least **one number**

---

## 🚢 Deployment (Render + Vercel + MongoDB Atlas)

### Backend (Render — Web Service)

**Build Command:** `npm run build`  
**Start Command:** `yarn start`  
**Health Check Path:** `/`

**Required Environment Variables:**
```
NODE_ENV=production
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a strong random secret>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=<your Vercel frontend URL>
LOG_LEVEL=info
```

### Frontend (Vercel)

Deploy the `/client` directory. The `vercel.json` in that folder handles SPA routing.

**Required Environment Variables:**
```
VITE_API_URL=<your Render backend URL>/api/v1
```

---

## 📄 License

This project is for educational and portfolio purposes.
