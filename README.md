# 🌾 CropChain — AI-Powered Agricultural Intelligence Platform

A production-grade, full-stack platform built for Indian farmers — ML yield predictions, fair price anomaly detection, Groq AI negotiation coaching, and direct investor connectivity, with a native Android APK.

Built as a portfolio project demonstrating full-stack engineering, ML integration, LLM integration, DevOps, and mobile delivery.

[![Live Demo](https://img.shields.io/badge/🌐_LIVE_DEMO-cropchain.vercel.app-22c55e?style=flat-square)](https://cropchain.vercel.app)
[![API Docs](https://img.shields.io/badge/📄_API_DOCS-Swagger_UI-blue?style=flat-square)](http://localhost:8000/docs)
[![Android APK](https://img.shields.io/badge/📱_ANDROID-APK_Download-orange?style=flat-square)](#android-app)

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python)
![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?style=flat-square&logo=scikit-learn)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-FF4B4B?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)
![Railway](https://img.shields.io/badge/Backend-Railway-8B5CF6?style=flat-square)
![Capacitor](https://img.shields.io/badge/Mobile-Capacitor_APK-119EFF?style=flat-square)

---

## ✨ Features at a Glance

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure register/login with role-based access (farmer / investor) |
| 🌱 **Yield Predictor** | ML LinearRegression model — predicts crop yield from soil, weather, irrigation |
| 🛡️ **Fair Price Radar** | IsolationForest anomaly detection — flags unfair mandi pricing in real time |
| 🤖 **AI Negotiation Coach** | Groq Llama 3.3 70B — multilingual pitch generation + negotiation advice |
| 📋 **Proposal System** | Farmers create, publish, manage investor pitches end-to-end |
| 💰 **Investor Connect** | Investors browse ML-verified proposals, invest, track portfolio |
| 🌙 **Dark / Light Mode** | Persistent theme toggle with CSS variable swap across all pages |
| 🔄 **Real-time Updates** | Investor browse page auto-polls every 3s — no refresh needed |
| 📱 **Android App** | Native APK via Capacitor — same React codebase, built with GitHub Actions |
| ⚙️ **CI/CD Pipeline** | Automated pytest + ESLint + Docker build check on every push to main |

---

## 🏗️ Architecture

```
CLIENT LAYER
┌─────────────────────────────────────────────────────────┐
│  🌐 Web Browser (Next.js 14)        📱 Android APK       │
│  App Router + TypeScript            Capacitor wrapper    │
│  Glassmorphism UI + Framer Motion   Same Next.js code    │
│  Deployed on Vercel                 Built via CI/CD       │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS REST API
┌─────────────────────▼───────────────────────────────────┐
│                  BACKEND LAYER (FastAPI)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │  /auth   │ │  /ml     │ │ /coach   │ │ /proposals │  │
│  │ register │ │ predict  │ │ generate │ │ create     │  │
│  │ login    │ │ fair-    │ │ negotiate│ │ publish    │  │
│  │ refresh  │ │ price    │ │ script   │ │ invest     │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘  │
└──────────┬─────────────────────────┬────────────────────┘
           │                         │
┌──────────▼──────────┐   ┌──────────▼──────────────────┐
│    ML LAYER          │   │    LLM LAYER                 │
│    (scikit-learn)    │   │    (Groq API)                │
│  LinearRegression    │   │  Llama 3.3 70B (Free Tier)  │
│  IsolationForest     │   │  Multilingual pitch + chat  │
└──────────┬──────────┘   └─────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────┐
│                   DATABASE LAYER                          │
│   MongoDB Atlas (Free M0 Cluster)                        │
│   Collections: users, proposals, investments             │
│   Motor (async ODM) + PyJWT auth                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework with SSR + TypeScript |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Spring animations, page transitions, modals |
| Recharts | Yield forecast area charts, portfolio pie charts |
| Zustand | Global state — auth store + UI store |
| Axios | HTTP client with JWT interceptor |
| Lucide React | Icon library |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | Async Python REST API |
| Motor | Async MongoDB ODM |
| PyJWT | JWT access + refresh tokens |
| bcrypt + passlib | Password hashing |
| scikit-learn | ML models (LinearRegression + IsolationForest) |
| Groq SDK | Llama 3.3 70B LLM inference |
| Open-Meteo | Free weather API (no key needed) |
| Pydantic v2 | Request/response validation |

### Infrastructure
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Free M0 cloud database |
| Vercel | Frontend deployment |
| Railway | Backend deployment |
| Docker | Containerised backend |
| GitHub Actions | CI/CD + Android APK builder |
| Capacitor | Android APK wrapper |

---

## 🚀 Local Development

### Prerequisites
- Python 3.11+
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- MongoDB Atlas account (free)
- Groq API key (free at console.groq.com)

### Backend Setup

```bash
cd cropchain/backend

# Create and activate virtual environment
python3.11 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/cropchain
SECRET_KEY=your-super-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=7
GROQ_API_KEY=gsk_your_groq_key_here
FRONTEND_URL=http://localhost:3000
EOF

# Train ML models
cd app/ml
python train_all.py
# → yield_model.pkl ✅
# → anomaly_model.pkl ✅

# Start server
cd ../..
uvicorn app.main:app --reload --port 8000
# API: http://localhost:8000
# Swagger docs: http://localhost:8000/docs
```

### Frontend Setup

```bash
cd cropchain/frontend

# Install dependencies
pnpm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start dev server
pnpm dev
# App: http://localhost:3000
```

### View on Mobile (same WiFi)

```bash
# Get your Mac's local IP
IP=$(ipconfig getifaddr en0)

# Update env with real IP
echo "NEXT_PUBLIC_API_URL=http://$IP:8000" > cropchain/frontend/.env.local

# Run backend on network
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run frontend on network
cd cropchain/frontend && pnpm dev --hostname 0.0.0.0

# Open on phone: http://YOUR_IP:3000
```

---

## 🧠 ML Models

### Yield Predictor — `LinearRegression`
```
Input features:
  crop_name       → label encoded (14 crops)
  area_acres      → continuous
  soil_type       → label encoded (6 types)
  irrigation_type → label encoded (5 types)
  season          → label encoded (kharif/rabi/zaid)
  state           → label encoded (14 states)
  avg_rainfall    → mm (optional)
  avg_temp        → °C (optional)
  crop_area       → interaction feature (crop × area)
  rain_area       → interaction feature (rainfall × area)

Output:
  predicted_yield  → quintals
  confidence_min   → lower bound
  confidence_max   → upper bound
  unit             → "quintals"

Performance: R² = 0.14 (training data), reasonable for sparse agricultural data
```

### Fair Price Radar — `IsolationForest`
```
Input features:
  crop_name    → label encoded
  market_name  → text lookup
  state        → label encoded
  offered_price → ₹/quintal

Output:
  is_anomaly        → boolean
  severity          → "low" | "medium" | "high"
  modal_price       → market reference price
  deviation_percent → % difference from modal
  recommendation    → actionable advice string

Performance: 76% accuracy, F1 = 0.68/0.81
```

---

## 🤖 Groq AI Coach

Three endpoints powered by **Llama 3.3 70B** (free tier, no daily limits):

| Endpoint | Input | Output |
|---|---|---|
| `POST /coach/generate-proposal` | crop, area, yield, investment ask, ROI, state, language | Full investor pitch in chosen language |
| `POST /coach/negotiate` | question, context, language | Negotiation advice + strategy |
| `POST /coach/price-script` | crop, offered price, modal price, deviation | Spoken negotiation script |

**Supported languages:** Hindi, English, Marathi, Punjabi, Tamil, Telugu

---

## 📋 API Reference

### Authentication
```
POST /auth/register   → { name, email, password, role, state, language }
POST /auth/login      → { email, password }
POST /auth/refresh    → { refresh_token }
```

### ML Endpoints
```
POST /ml/predict-yield  → { crop_name, area_acres, soil_type, irrigation_type, season, state }
POST /ml/fair-price     → { crop_name, market_name, state, offered_price }
```

### Proposals
```
POST   /proposals/create   → { title, description, crop_name, area_acres, expected_yield, amount_requested, roi_percent }
POST   /proposals/publish  → { proposal_id }
GET    /proposals/my       → farmer's own proposals
DELETE /proposals/{id}     → delete draft
```

### Investor
```
GET  /investor/proposals      → all open proposals (live-polled every 3s)
GET  /investor/proposals/{id} → proposal detail
POST /investor/invest         → { proposal_id, amount }
GET  /investor/portfolio      → investment history
```

### Groq Coach
```
POST /coach/generate-proposal → { crop_name, area_acres, predicted_yield, investment_ask, roi_percent, state, language }
POST /coach/negotiate         → { question, context, language }
POST /coach/price-script      → { crop_name, offered_price, modal_price, deviation_percent, language }
```

---

## 🧪 Testing

```bash
cd cropchain/backend
source venv/bin/activate
python -m pytest tests/ -v
```

| File | Tests | Coverage |
|---|---|---|
| `test_auth.py` | 6 tests | Register, login, duplicate detection, token refresh, invalid credentials |
| `test_ml.py` | 5 tests | Yield prediction, fair price detection, edge cases |
| `test_proposals.py` | 4 tests | Create, publish, farmer auth guard, investor browse |

---

## ⚙️ CI/CD Pipeline

Every push to `main` triggers two GitHub Actions workflows:

```
Push to main
│
├── 🔄 CropChain CI Pipeline
│   ├── Backend Tests (pytest) ──────→ all pass ✅
│   ├── Frontend Lint (ESLint) ──────→ 0 errors ✅
│   └── Docker Build Check ──────────→ builds OK ✅
│
└── 📱 Build Android APK
    ├── Node 20 + Java 17 setup
    ├── pnpm build → Capacitor sync
    ├── Gradle assembleRelease
    └── APK uploaded as artifact ✅
```

---

## 📱 Android App

The Android APK is automatically built on every push via GitHub Actions:

1. Go to **Actions → Build Android APK → latest run**
2. Scroll to **Artifacts → download cropchain-debug-apk**
3. Unzip → install `app-debug.apk` on any Android phone
4. Enable **"Install from unknown sources"** if prompted

The app is a native wrapper around the live deployment — all features work identically including camera-ready glassmorphism UI optimised for mobile screens.

---

## 🌍 Environment Variables

### Backend (`.env` + Railway)
```bash
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/cropchain
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=7
GROQ_API_KEY=gsk_...                    # Free at console.groq.com
FRONTEND_URL=https://cropchain.vercel.app
```

### Frontend (`.env.local` + Vercel)
```bash
NEXT_PUBLIC_API_URL=https://cropchain-backend.railway.app
```

---

## 📁 Project Structure

```
cropchain/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI entry point + CORS
│   │   ├── database.py              # MongoDB Motor connection
│   │   ├── config.py                # Environment config
│   │   ├── middleware/
│   │   │   └── auth_middleware.py   # JWT get_current_user dependency
│   │   ├── models/                  # MongoDB document models
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   │   ├── user.py
│   │   │   └── ml.py
│   │   ├── routers/
│   │   │   ├── auth.py              # Register, login, refresh
│   │   │   ├── ml.py                # Yield predict + fair price
│   │   │   ├── groq_coach.py        # AI pitch + negotiation
│   │   │   ├── proposals.py         # Farmer proposal CRUD
│   │   │   └── investor.py          # Browse, invest, portfolio
│   │   ├── services/
│   │   │   ├── auth_service.py      # bcrypt + JWT utils
│   │   │   ├── ml_service.py        # scikit-learn inference
│   │   │   ├── groq_service.py      # Groq LLM calls
│   │   │   └── weather_service.py   # Open-Meteo integration
│   │   └── ml/
│   │       ├── train_yield_model.py
│   │       ├── train_anomaly_model.py
│   │       ├── train_all.py
│   │       ├── yield_model.pkl
│   │       └── anomaly_model.pkl
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_ml.py
│   │   └── test_proposals.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/                     # Next.js App Router pages
│   │   │   ├── page.tsx             # Landing page
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── farmer/
│   │   │   │   ├── page.tsx         # Farmer dashboard
│   │   │   │   ├── yield-predictor/
│   │   │   │   ├── fair-price/
│   │   │   │   ├── coach/           # AI pitch + chat coach
│   │   │   │   ├── proposals/
│   │   │   │   └── profile/
│   │   │   └── investor/
│   │   │       ├── page.tsx         # Investor dashboard
│   │   │       ├── browse/          # Real-time proposal browser
│   │   │       ├── portfolio/
│   │   │       └── profile/
│   │   ├── api/                     # Axios API layer
│   │   │   ├── client.ts            # Axios + JWT interceptor
│   │   │   ├── auth.ts
│   │   │   ├── ml.ts
│   │   │   ├── groq.ts
│   │   │   ├── proposals.ts
│   │   │   └── investor.ts
│   │   ├── store/
│   │   │   ├── authStore.ts         # Zustand auth + hydration
│   │   │   └── uiStore.ts           # Dark mode + theme
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx       # Sticky glass navbar
│   │   │   │   └── BottomNav.tsx    # Role-aware bottom nav
│   │   │   ├── ui/
│   │   │   │   └── ThemeToggle.tsx
│   │   │   └── AuthProvider.tsx     # Hydrates auth + theme on mount
│   │   └── utils/
│   │       ├── cropConstants.ts     # 14 crops, soils, states, languages
│   │       └── formatCurrency.ts    # INR formatter
│   ├── .env.local
│   └── next.config.js
│
├── android/                         # Capacitor Android project
├── capacitor.config.json
├── docker-compose.yml
├── .github/
│   └── workflows/
│       ├── ci.yml                   # CI/CD pipeline
│       └── apk-build.yml            # Android APK builder
└── README.md
```

---

## 🛠️ Development Journey

- ✅ **Week 1** — Environment setup: Node 20, Python 3.11, MongoDB Atlas, Groq API
- ✅ **Week 2** — FastAPI backend: JWT auth, all routers, Motor ODM
- ✅ **Week 3** — ML models: LinearRegression yield predictor + IsolationForest anomaly detector
- ✅ **Week 4** — Next.js frontend: Zustand stores, Axios client, all pages scaffolded
- ✅ **Week 5** — Groq AI integration: multilingual pitch generator + negotiation coach
- ✅ **Week 6** — Proposals flow: create → save draft → publish → investor browse → invest
- ✅ **Week 7** — UI redesign: glassmorphism + gradient mesh + spring-animated modals
- ✅ **Week 8** — Real-time polling, auth persistence, dark mode, API field name fixes
- ✅ **Week 9** — Mobile testing, CI/CD, Docker, Android APK via Capacitor

---

## 💡 Key Engineering Decisions

| Challenge | Solution |
|---|---|
| Auth lost on page refresh | Added `hydrated` flag to Zustand store; `AuthProvider` rehydrates from localStorage on mount |
| Groq output had `**bold**` markers | `stripMarkdown()` utility strips all markdown before rendering |
| Frontend field names ≠ backend schema | Audited all API files; `crop_type` → `crop_name`, `pitch_content` → `description` + `generated_pitch` |
| `apiClient` named export vs default `client` | Standardised all API files to `import client from "./client"` (default export) |
| Investor proposals not updating live | Polling interval every 3s with `useCallback` + `setInterval` cleanup on unmount |
| bcrypt errors on Apple Silicon | Uninstalled passlib/bcrypt, reinstalled `bcrypt==4.0.1` + `passlib[bcrypt]==1.7.4`, rewrote auth service |
| Dark mode only applying to navbar | Moved all colors to CSS variables; `toggleDark()` adds/removes `dark` class on `<html>` |
| Phone couldn't reach localhost | `--host 0.0.0.0` on both servers + `NEXT_PUBLIC_API_URL=http://MAC_IP:8000` |

---

## 👤 Author

**Sagar Maddi**
Full-stack portfolio project demonstrating Next.js 14, FastAPI, MongoDB, ML with scikit-learn, LLM integration with Groq, CI/CD pipelines, and mobile app delivery via Capacitor.

---

## 📄 License

MIT License — feel free to use this as a reference or starting point.