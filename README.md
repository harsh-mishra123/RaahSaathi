# RaahSaathi (राहसाथी) — Navigate Without Barriers

> **RaahSaathi** (Hindi for "Path Companion") is an accessibility-first navigation platform that empowers differently-abled individuals to navigate cities safely. Unlike traditional maps that assume able-bodied users, RaahSaathi provides barrier-aware routing based on real-time, community-verified data.

<div align="center">
  
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  ![Backend](https://img.shields.io/badge/backend-FastAPI-green)
  ![Frontend](https://img.shields.io/badge/frontend-Next.js-black)
  ![Database](https://img.shields.io/badge/database-Supabase-orange)
  ![AI](https://img.shields.io/badge/AI-Groq_LLaVA-purple)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Why RaahSaathi?](#-why-raahsaathi)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [License](#-license)

---

## 🎯 Overview

Cities are not designed equally for everyone. A broken ramp, a missing tactile path, or a flooded footpath can turn a 5-minute walk into an impossible journey.

**RaahSaathi solves this by:**

| Feature | Description |
|---------|-------------|
| 🗺️ **Crowdsourced Data** | Community-reported barriers in real-time |
| 🤖 **AI Classification** | Groq LLaVA vision model auto-tags barriers from photos |
| 🚫 **Barrier-Aware Routing** | Routes avoid severe barriers automatically |
| ✅ **Community Validation** | Upvote/downvote system keeps data accurate |
| 🏆 **Gamification** | Points, badges, and leaderboards to encourage participation |

---

## 💡 Why RaahSaathi?

| **Existing Maps** | **RaahSaathi** |
|------------------|----------------|
| Static infrastructure data | Dynamic, real-time barrier data |
| Distance-first routing | Accessibility-first routing |
| Updated monthly/yearly | Updated in real-time by community |
| "Accessible" binary label | 10+ barrier types with severity scores |
| No validation mechanism | Community upvote/downvote system |
| One route for all | Personalized by disability type |

---

## ✨ Features

**1. 🚧 Barrier Reporting**
- Geotagged reporting with photo upload
- Under 30-second submission flow
- 9 barrier categories + severity levels

**2. 🤖 AI-Powered Classification**
- Groq LLaVA vision model integration
- Automatic category detection & severity assessment
- Confidence scoring & user hint integration

**3. 👥 Community Validation**
- Upvote/downvote system (Reddit-style)
- Auto-archival of fixed barriers
- Verified status after 5 upvotes

**4. 🗺️ Barrier-Aware Routing**
- PostGIS spatial queries
- Barrier penalty system for route calculation
- Real-time barrier warnings along route

**5. 👤 Personalized Experience**
- User profiles with disability type
- Wheelchair, visually impaired, and elderly modes
- Customizable accessibility preferences

**6. 🏅 Gamification**
- Points system for contributions
- Achievement badges: Pioneer, Validator, Area Guardian, Pathfinder, Community Hero

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | REST API framework |
| Python 3.12 | Programming language |
| Groq LLaVA | Vision-language AI model |
| Supabase | Database + Auth (PostgreSQL) |
| PostGIS | Spatial queries and geo-indexing |
| Pydantic | Data validation |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Mapbox GL | Interactive maps |
| Lucide React | Icons |

### Database Tables
| Table | Purpose |
|-------|---------|
| profiles | User profiles and preferences |
| barriers | Barrier reports with geospatial data |
| barrier_votes | Upvote/downvote tracking |
| achievements | Badge definitions |
| user_achievements | User earned badges |
| routes | Saved routes history |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND (Next.js)                                             │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌───────────┐           │
│ │Map View │ │Barriers   │ │Report    │ │Route      │           │
│ │         │ │Feed       │ │Form      │ │Planner    │           │
│ └──────────┘ └───────────┘ └──────────┘ └───────────┘           │
└─────────────────────────────────────────────────────────────────┘
        │
        │ HTTP / REST API
        ▼
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND (FastAPI)                                               │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐     │
│ │ API Endpoints                                          │     │
│ │ • POST /classify-barrier • GET /barriers/nearby        │     │
│ │ • POST /barriers • POST /barriers/{id}/vote            │     │
│ └─────────────────────────────────────────────────────────┘     │
│        │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│ │ Groq AI     │ │ Supabase     │ │ Cloudinary   │             │
│ │ Service     │ │ Client       │ │ Upload       │             │
│ └──────────────┘ └──────────────┘ └──────────────┘             │
└─────────────────────────────────────────────────────────────────┘
        │
        │ Database Connection
        ▼
┌─────────────────────────────────────────────────────────────────┐
│ SUPABASE (PostgreSQL + PostGIS)                                 │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐     │
│ │ Tables: profiles, barriers, barrier_votes,              │     │
│ │ achievements, user_achievements, routes                 │     │
│ └─────────────────────────────────────────────────────────┘     │
│        │
│ • PostGIS spatial indexes for fast geo-queries                  │
│ • Row Level Security (RLS) policies for data protection         │
│ • Triggers for vote counts and user statistics                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+
- Supabase account (free tier)
- Groq API key (free)
- Mapbox access token (free tier)

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/raahsaathi.git
cd raahsaathi
```

### Step 2: Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Configure `.env`:
```env
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
ENVIRONMENT=development
DEBUG=true
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Step 3: Database Setup
- Create Supabase project
- Enable PostGIS extension
- Run `database/schema.sql` in Supabase SQL Editor

### Step 4: Run Backend
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Step 5: Frontend Setup
```bash
# Open new terminal
cd frontend
npm install

# Create .env.local
cat <<EOT >> .env.local
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
EOT

# Run development server
npm run dev
```
- Frontend: http://localhost:3000

---

## 📡 API Documentation

### Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/v1/classify-barrier/ | AI barrier classification |
| GET    | /api/v1/health           | Service health check |
| GET    | /api/v1/barriers/nearby  | Get barriers within radius |
| POST   | /api/v1/barriers/        | Create barrier report |
| GET    | /api/v1/barriers/{id}    | Get specific barrier |
| PATCH  | /api/v1/barriers/{id}    | Update barrier |
| DELETE | /api/v1/barriers/{id}    | Delete barrier |
| POST   | /api/v1/barriers/{id}/vote | Upvote/downvote barrier |
| GET    | /api/v1/barriers/{id}/vote | Get user's vote |

#### Example Requests

**Create a barrier:**
```bash
curl -X POST http://localhost:8000/api/v1/barriers/ \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 19.0760,
    "longitude": 72.8777,
    "category": "broken_ramp",
    "severity": 2,
    "description": "Broken ramp at Gateway of India"
  }'
```

**Get nearby barriers:**
```bash
curl "http://localhost:8000/api/v1/barriers/nearby?latitude=19.0760&longitude=72.8777&radius_meters=500"
```

**Upvote a barrier:**
```bash
curl -X POST http://localhost:8000/api/v1/barriers/{id}/vote \
  -H "Content-Type: application/json" \
  -d '{"vote_type": "upvote"}'
```

---

## 📁 Project Structure

```
raahsaathi/
├── backend/
│   ├── app/
│   │   ├── api/v1/           # API endpoints
│   │   │   ├── classify.py   # AI classification
│   │   │   ├── barriers.py   # Barrier CRUD + votes
│   │   │   └── health.py     # Health checks
│   │   ├── models/           # Pydantic models
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Helpers
│   │   ├── core/             # Middleware, exceptions
│   │   ├── config.py         # Environment config
│   │   └── main.py           # FastAPI entry point
│   ├── database/
│   │   └── schema.sql        # Complete database schema
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── app/              # Next.js pages
    │   │   ├── page.tsx      # Landing page
    │   │   ├── map/page.tsx  # Map view
    │   │   ├── barriers/page.tsx  # Reddit-style feed
    │   │   ├── report/page.tsx    # Report form
    │   │   ├── routes/page.tsx    # Route planner
    │   │   └── profile/page.tsx   # User profile
    │   ├── components/       # Reusable components
    │   └── lib/              # API clients
    └── package.json
```

---

## 🗄️ Database Schema

### Key Tables

#### barriers
| Column     | Type                | Description                  |
|------------|---------------------|------------------------------|
| id         | UUID                | Primary key                  |
| location   | GEOMETRY(POINT,4326)| PostGIS spatial point        |
| latitude, longitude | DOUBLE      | Coordinates                  |
| category   | TEXT                | Barrier type                 |
| severity   | INTEGER             | 1 (minor) to 3 (severe)      |
| upvotes, downvotes | INTEGER      | Vote counts                  |
| status     | TEXT                | active / fixed / disputed / archived |
| reported_by| UUID                | References profiles(id)      |

#### profiles
| Column     | Type        | Description                  |
|------------|------------|------------------------------|
| id         | UUID       | References auth.users        |
| username   | TEXT       | Unique username              |
| disability_type | TEXT[] | wheelchair, visual, elderly  |
| accessibility_preferences | JSONB | User preferences     |
| total_points | INTEGER   | Gamification points          |

### PostGIS Functions

```sql
-- Get barriers within radius
SELECT * FROM get_barriers_nearby(lat, lng, radius, status);

-- Distance calculation
ST_Distance(location::geography, target::geography)

-- Within radius check
ST_DWithin(location::geography, target::geography, radius)
```

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgements

- Groq for LLaVA vision model API
- Supabase for PostgreSQL + PostGIS hosting
- Mapbox for mapping infrastructure
- OpenStreetMap for base map data

<div align="center"> Made with ❤️ for accessibility </div>
