# 🏛️ GraamSeva AI — ଗ୍ରାମ ସେବା AI

> **AI for Governance & Social Good** | Odisha AI Hackathon 2026

GraamSeva AI is a multilingual AI-powered governance platform that empowers rural Odisha citizens to access government schemes, file grievances, and get real-time help — all in Odia language.

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Chatbot | Gemini-powered chatbot in Odia/Hindi/English |
| 📋 Scheme Finder | Eligibility matching for 8+ Odisha government schemes |
| 😤 Grievance Filing | Voice/text/photo complaint submission |
| 📱 WhatsApp Alerts | Auto-notifications via Twilio |
| 🗺️ CSC Locator | Find nearest Jan Seva Kendra |
| 📊 Admin Dashboard | Heatmaps, SLA tracking, analytics |
| 🔁 Duplicate Detection | AI-powered ticket deduplication |
| 📄 AI Draft Reply | One-click Odia draft for officers |

---

## 🏗️ Tech Stack

### Backend
- **FastAPI** — Python async API framework
- **PostgreSQL** — Primary database
- **SQLAlchemy** — ORM
- **Google Gemini API** — AI/NLP (gemini-1.5-flash)
- **IndicTrans2** — Odia ↔ English translation
- **Twilio** — WhatsApp notifications
- **Alembic** — DB migrations

### Frontend
- **React 18 + TypeScript** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Leaflet** — Interactive maps
- **Recharts** — Analytics charts
- **Zustand** — State management
- **PWA** — Offline capable

---

## 📁 Project Structure

```
odishaai/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy DB models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routers/         # FastAPI route handlers
│   │   ├── services/        # Business logic
│   │   └── utils/           # Auth, file helpers
│   ├── alembic/             # DB migrations
│   ├── uploads/             # Uploaded images
│   ├── main.py              # FastAPI app entry
│   ├── seed_data.py         # Initial data seeder
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── citizen/     # Citizen-facing pages
│   │   │   └── admin/       # Officer dashboard pages
│   │   ├── components/      # Reusable UI components
│   │   ├── stores/          # Zustand state stores
│   │   ├── api/             # API client functions
│   │   └── types/           # TypeScript interfaces
│   ├── public/
│   └── package.json
└── docs/
    └── flowcharts.md        # Architecture flowcharts
```

---

## ⚡ Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 15+
- Google Gemini API key

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Run database migrations
alembic upgrade head

# Seed initial data (8 schemes + admin user)
python seed_data.py

# Start the API server
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
pnpm install   # or npm install

# Start dev server
pnpm dev       # or npm run dev
```

### Access the App
- **Citizen App**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin
- **API Docs**: http://localhost:8000/docs
- **Admin Login**: admin@graamseva.gov.in / Admin@123

---

## 🤖 AI Capabilities

### Gemini Integration
The app uses `gemini-1.5-flash` for:
1. **Intent Classification** — Scheme query / Grievance / General / Legal
2. **Grievance Categorization** — Auto-routes to correct department
3. **Response Generation** — Context-aware answers in Odia
4. **Duplicate Detection** — Semantic similarity check
5. **Officer Draft Reply** — Auto-generate Odia response for officers
6. **Image Description** — Vision AI for photo complaints

### Translation Pipeline
```
Citizen Input (Odia) 
  → Language Detection 
  → IndicTrans2 / Gemini Translation 
  → English Processing 
  → Gemini Response 
  → Translate back to Odia 
  → Citizen
```

---

## 📋 Odisha Government Schemes (Seeded)

| Scheme | Beneficiary | Key Benefit |
|--------|-------------|-------------|
| BSKY | BPL families | ₹5 lakh health insurance |
| KALIA Yojana | Farmers | ₹10,000/year financial aid |
| Mamata Yojana | Pregnant women | ₹5,000 maternity benefit |
| Mission Shakti | Women SHGs | Microfinance + training |
| Madhu Babu Pension | Elderly/Disabled | ₹700–1000/month pension |
| Biju Pucca Ghar | Homeless poor | Free pucca house |
| MKUY | Agri entrepreneurs | Subsidized equipment loans |
| Adarsha Vidyalaya | School students | Merit scholarship |

---

## 🗄️ Database Schema

```sql
citizens       -- Citizen profiles
schemes        -- Government scheme definitions with eligibility rules
grievances     -- Filed complaints with GPS, SLA tracking
eligibility_checks -- Scheme matching history
notifications  -- WhatsApp/SMS notification log
officers       -- Panchayat officer accounts
```

---

## 📱 PWA Features
- ✅ Installable on mobile home screen
- ✅ Works offline (cached static assets)
- ✅ Push notifications (WhatsApp via Twilio)
- ✅ Camera access for photo complaints
- ✅ Microphone for voice input

---

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | AI chatbot message |
| `/api/schemes` | GET | List all schemes |
| `/api/schemes/check-eligibility` | POST | Check citizen eligibility |
| `/api/grievances` | POST | File new grievance |
| `/api/grievances/ticket/{id}` | GET | Track ticket |
| `/api/grievances/heatmap` | GET | GPS points for map |
| `/api/dashboard/stats` | GET | Admin statistics |
| `/api/auth/login` | POST | Officer login |

Full API docs at `/docs` (Swagger UI)

---

## 📊 SLA Policy

| Category | SLA Deadline |
|----------|-------------|
| Ration / PDS | 3 days |
| Health | 3 days |
| Water / Sanitation | 7 days |
| Road / Infrastructure | 15 days |
| Education | 7 days |
| Land Dispute | 15 days |

Auto-escalation to District Collector if breached.

---

## 🏆 Hackathon Info

- **Event**: Odisha AI Hackathon 2026
- **Theme**: AI for Governance & Social Good
- **Team**: GraamSeva AI Team
- **Built in**: 5 days

---

## 📄 License

MIT License — Built for social good

---

*ଜୟ ଓଡ଼ିଶା 🙏 — GraamSeva AI — ପ୍ରତ୍ୟେକ ଗ୍ରାମ ପାଇଁ AI*

