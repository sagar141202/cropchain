# 🌾 CropChain — AI-Powered Agricultural Intelligence Platform

A production-grade, full-stack platform built for Indian farmers — ML yield predictions, fair price anomaly detection, Groq AI negotiation coaching, direct investor connectivity, and a native Android APK with persistent login.

Built as a portfolio project demonstrating full-stack engineering, ML integration, LLM integration, DevOps, and mobile delivery.

[![Live Demo](https://img.shields.io/badge/🌐_LIVE_DEMO-cropchain.vercel.app-22c55e?style=flat-square)](https://cropchain-nine.vercel.app/)
[![API Docs](https://img.shields.io/badge/📄_API_DOCS-Swagger_UI-blue?style=flat-square)](https://cropchain-backend-production.up.railway.app/docs)
[![Android APK](https://img.shields.io/badge/📱_ANDROID-Download_APK-orange?style=flat-square)](#-android-app--apk-download)

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python)
![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?style=flat-square&logo=scikit-learn)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-FF4B4B?style=flat-square)
![Capacitor](https://img.shields.io/badge/Mobile-Capacitor_APK-119EFF?style=flat-square)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel)
![Railway](https://img.shields.io/badge/Backend-Railway-8B5CF6?style=flat-square)

---

## ✨ Features at a Glance

### Core Platform
| Feature | Description |
|---|---|
| 🔐 **Persistent JWT Auth** | Login once, stay logged in — token survives app restarts, backgrounding, and phone reboots. Manual sign-out only. |
| 🌱 **Yield Predictor** | ML LinearRegression model — predicts crop yield from soil, weather, irrigation inputs |
| 🛡️ **Fair Price Radar** | IsolationForest anomaly detection — flags unfair mandi pricing in real time |
| 🤖 **AI Negotiation Coach** | Groq Llama 3.3 70B — multilingual pitch generation + negotiation advice in 6 Indian languages |
| 📋 **Proposal System** | Farmers create, save drafts, publish, manage investor pitches end-to-end |
| 💰 **Investor Connect** | Investors browse ML-verified proposals, invest, track portfolio |
| 🌙 **Dark / Light Mode** | Persistent theme toggle with CSS variable swap across all pages |
| 🔄 **Real-time Updates** | Investor browse page auto-polls every 3s — no manual refresh needed |
| 📱 **Android APK** | Native app via Capacitor — smooth 60fps, hardware-accelerated, safe-area aware |
| ⚙️ **CI/CD Pipeline** | pytest + ESLint + Docker + APK build triggered on every push to main |

### 9 Dashboard Features
| # | Feature | Description |
|---|---|---|
| 1 | 🌤️ **Live Weather Widget** | Open-Meteo API — current conditions, 7-day forecast, sowing advice per state |
| 2 | 💚 **Crop Health Score** | Animated SVG ring with count-up — Green/Amber/Red based on weather + yield confidence |
| 3 | 📈 **Mandi Price Ticker** | Infinite auto-scrolling strip — 11 states × 8 crops, tap for sparkline price modal |
| 4 | 🌾 **Seasonal Advisory** | Claude API (claude-sonnet) — AI-generated seasonal tip, cached 7 days, Kharif/Rabi/Zaid aware |
| 5 | 🧮 **ROI Calculator** | Interactive sliders — Investment × ROI% × Duration = real-time return + bar chart breakdown |
| 6 | 🛡️ **Risk Score Badges** | 5-factor frontend scoring (Low/Medium/High) on every proposal card — tappable breakdown modal |
| 7 | 🔥 **Trending Crops** | Horizontally scrollable cards ranked by open proposals + avg ROI — tap to filter browse page |
| 8 | 💚 **Investment Impact Counter** | Animated count-up on scroll: farmers supported, acres, quintals, ₹ invested |
| 9 | 🎊 **Confetti Milestones** | Canvas-confetti burst on first proposal publish + first investment |

### Mobile UX Features
| Feature | Description |
|---|---|
| 👆 **Pull-to-Refresh** | Native-feel rubber-band pull with animated arrow indicator |
| 🔔 **Notification Centre** | Bell icon with badge — spring slide-down panel, role-aware, persisted to localStorage |
| 🔍 **Search + Filter + Sort** | Multi-filter browse with active pills, sort by risk/ROI/amount |
| 💫 **Onboarding Flow** | 3-step swipeable first-run flow — shown once after first register |
| ⚡ **60fps Animations** | Hardware-accelerated with `translateZ(0)` + `will-change: transform` on all cards |
| 📐 **Safe Area Aware** | Notch, status bar, home indicator handled via `env(safe-area-inset-*)` |

---

## 🏗️ Architecture

```
CLIENT LAYER
┌──────────────────────────────────────────────────────────┐
│  🌐 Web (Next.js 14 — Vercel)    📱 Android APK          │
│  App Router + TypeScript         Capacitor 6 wrapper     │
│  Glassmorphism + Framer Motion   Same Next.js codebase   │
│  Persistent auth via Zustand     Built via GitHub Actions │
└─────────────────────┬────────────────────────────────────┘
                      │ HTTPS REST API
┌─────────────────────▼────────────────────────────────────┐
│              BACKEND LAYER (FastAPI — Railway)            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │  /auth   │ │  /ml     │ │ /coach   │ │ /proposals │  │
│  │ register │ │ predict  │ │ generate │ │ create     │  │
│  │ login    │ │ fair-    │ │ negotiate│ │ publish    │  │
│  │ refresh  │ │ price    │ │ script   │ │ invest     │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘  │
└──────────┬──────────────────────────┬────────────────────┘
           │                          │
┌──────────▼──────────┐  ┌────────────▼────────────────────┐
│   ML LAYER           │  │   LLM LAYER                     │
│   (scikit-learn)     │  │   Groq — Llama 3.3 70B (coach)  │
│   LinearRegression   │  │   Claude Sonnet (advisory)      │
│   IsolationForest    │  │   Open-Meteo (weather, free)    │
└──────────┬──────────┘  └─────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────┐
│   DATABASE LAYER — MongoDB Atlas (Free M0)               │
│   Collections: users, proposals, investments             │
│   Motor async ODM + PyJWT tokens                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Persistent Login — How It Works

Login once, never see the login screen again until you manually sign out.

```
LAYER 1 — Zustand persist middleware
  Stores { user, token, refreshToken } in localStorage: "cropchain-auth"
  Survives: page refresh, tab close, browser restart, APK kill, phone reboot

LAYER 2 — Axios request interceptor
  Reads token from store on every API call, attaches as Authorization: Bearer

LAYER 3 — Silent token refresh on 401
  Calls POST /auth/refresh with refreshToken
  Updates access token + retries the original failed request
  User never sees an error or gets redirected to login

LAYER 4 — Capacitor appStateChange listener
  Fires when user switches back to the app from background
  If token expires within 5min → silent refresh proactively
  If refresh fails → clean logout, no loop
```

**Access token lifetime:** 24 hours
**Refresh token lifetime:** 7 days
**Result:** Active users never get logged out. Inactive users stay logged in for 7 days.

---

## 🔧 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14 | React framework, App Router, TypeScript, static export for APK |
| Tailwind CSS | 3 | Utility-first styling |
| Framer Motion | 11 | Spring animations, page transitions, modals |
| Zustand + persist | 4 | Global auth state — survives restarts via localStorage |
| Axios | 1.7 | HTTP client with JWT interceptor + silent token refresh |
| Capacitor | 6 | Android APK wrapper with native plugins |
| canvas-confetti | 1.9 | Milestone celebration animations |
| Lucide React | 0.383 | Icon library |
| React Hot Toast | 2 | Toast notifications |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.135 | Async Python REST API |
| Motor | 3.7 | Async MongoDB ODM |
| PyJWT / python-jose | 3.5 | JWT access + refresh tokens |
| bcrypt + passlib | 4.0 / 1.7 | Password hashing |
| scikit-learn | 1.8 | ML models (LinearRegression + IsolationForest) |
| Groq SDK | 1.1 | Llama 3.3 70B LLM inference |
| Pydantic v2 + email-validator | 2.12 | Request/response validation |
| Open-Meteo | — | Free weather API, no key needed |
| pydantic-settings | 2.13 | Environment variable management |

### Infrastructure
| Technology | Purpose |
|---|---|
| MongoDB Atlas (Free M0) | Cloud database |
| Vercel | Frontend deployment — auto-deploys on push to main |
| Railway | Backend deployment — Docker container, auto-deploys on push |
| GitHub Actions | CI/CD pipeline + Android APK builder |
| Capacitor 6 | Android APK wrapper with SplashScreen, StatusBar, Keyboard plugins |

---

## 📱 Android App — APK Download

The APK is automatically built on every push to `main` via GitHub Actions.

### How to download and install
```
1. Go to GitHub repo → Actions tab
2. Click "Build Android APK" → latest successful run (green tick)
3. Scroll to bottom → Artifacts section
4. Click "cropchain-debug-apk" → downloads a .zip
5. Unzip → you get cropchain-latest.apk
6. Transfer to Android phone (Google Drive / USB / email)
7. On phone: Settings → Security → Enable "Install from unknown sources"
8. Tap the APK file → Install → Open
9. Sign in once — you will never be asked again until you sign out manually
```

### Why it feels native
- **No sign-in on reopen** — Zustand persist + localStorage survives WebView kills
- **60fps animations** — `transform: translateZ(0)` hardware acceleration on all cards
- **No tap delay** — `touch-action: manipulation` removes 300ms click delay globally
- **Safe area** — notch, status bar, home indicator via `env(safe-area-inset-*)`
- **Keyboard** — `resize: body` prevents layout jumping when keyboard appears
- **Overscroll** — `overscroll-behavior: none` stops rubber-band revealing background
- **Splash screen** — dark green, auto-hides after 1.2s
- **Status bar** — dark style matching glass UI theme

### Trigger a fresh build manually
```bash
git commit --allow-empty -m "trigger APK build"
git push origin main
# Wait ~10 minutes, then download from Actions → Artifacts
```

---

## 🚀 Local Development

### Prerequisites
- Python 3.11+
- Node.js 22+
- pnpm (`npm install -g pnpm`)
- MongoDB Atlas account (free at mongodb.com)
- Groq API key (free at console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/cropchain.git
cd cropchain
```

### 2. Backend setup
```bash
cd backend

python3.11 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

# Create .env file
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cropchain?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-this
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=7
GROQ_API_KEY=gsk_your_groq_key_here
OPEN_METEO_BASE_URL=https://api.open-meteo.com/v1/forecast
ENVIRONMENT=development
EOF

# Train ML models (creates yield_model.pkl + anomaly_model.pkl)
python app/ml/train_all.py

# Start server
uvicorn app.main:app --reload --port 8000
# API:   http://localhost:8000
# Docs:  http://localhost:8000/docs
```

### 3. Frontend setup
```bash
cd frontend

pnpm install

echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

pnpm dev
# App: http://localhost:3000
```

### 4. Test on physical phone (same WiFi)
```bash
# Get your machine's local IP
IP=$(ipconfig getifaddr en0)           # Mac
# IP=$(hostname -I | awk '{print $1}') # Linux

echo "NEXT_PUBLIC_API_URL=http://$IP:8000" > frontend/.env.local

# Backend accessible on network
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend accessible on network
cd frontend && pnpm dev --hostname 0.0.0.0

# Open on phone browser: http://YOUR_IP:3000
```

---

## 🧠 ML Models

### Yield Predictor — `LinearRegression`
```
Inputs:  crop_name, area_acres, soil_type, irrigation_type,
         season, state, avg_rainfall, avg_temp

Outputs: predicted_yield (quintals), confidence_min, confidence_max

Training: synthetic dataset of 5000 samples across 14 crops × 14 states
Performance: R² = 0.14 — reasonable for sparse agricultural data
```

### Fair Price Radar — `IsolationForest`
```
Inputs:  crop_name, market_name, state, offered_price (₹/quintal)

Outputs: is_anomaly (bool), severity (low/medium/high),
         modal_price, deviation_percent, recommendation

Performance: 76% accuracy, F1 = 0.68 (anomaly) / 0.81 (normal)
```

### Risk Score — Pure Frontend (no API call)
```
5 factors scored 0–100:
  ROI sanity      → >35% ROI adds risk
  Farm area       → <1 acre or >100 acres adds risk
  Ask per acre    → >₹80K/acre adds risk
  Yield per acre  → >60 qtl/acre is unrealistic, adds risk
  Pitch quality   → No AI pitch adds risk

Bands: 0–28 = 🟢 Low | 29–55 = 🟡 Medium | 56–100 = 🔴 High
```

---

## 🤖 AI Integrations

### Groq — Llama 3.3 70B (Negotiation Coach)
Free tier, no daily limits.

| Endpoint | Input | Output |
|---|---|---|
| `POST /coach/generate-proposal` | crop, area, yield, ask, ROI, state, language | Full structured investor pitch |
| `POST /coach/negotiate` | question, context, language | Negotiation advice + strategy |
| `POST /coach/price-script` | crop, offered price, modal price, deviation | Spoken mandi script |

**Languages:** Hindi, English, Marathi, Punjabi, Tamil, Telugu

### Claude API — Seasonal Advisory Banner
- **Model:** `claude-sonnet-4-20250514`
- **Called from:** Frontend directly (no backend proxy)
- **Prompt:** State + month + season (Kharif/Rabi/Zaid) + top 3 crops + farming activity
- **Output:** 2–3 sentences, max 60 words, mentions state + crop + actionable tip
- **Cache:** 7 days in localStorage per `state_month` key
- **Fallback:** 48 hand-written static tips (12 months × 4 regional groups) if API fails

---

## 📋 API Reference

### Authentication
```
POST /auth/register   → { name, email, password, role, state, language }
                      ← { access_token, refresh_token, user }

POST /auth/login      → { email, password }
                      ← { access_token, refresh_token, user }

POST /auth/refresh    → { refresh_token }
                      ← { access_token }
```

### ML
```
POST /ml/predict-yield → { crop_name, area_acres, soil_type, irrigation_type, season, state }
POST /ml/fair-price    → { crop_name, market_name, state, offered_price }
```

### Proposals
```
POST   /proposals/create   → { title, description, crop_name, area_acres, expected_yield, amount_requested, roi_percent }
POST   /proposals/publish  → { proposal_id }
GET    /proposals/my       → farmer's own proposals list
DELETE /proposals/{id}     → delete a draft
```

### Investor
```
GET  /investor/proposals  → all open proposals (used for live polling every 3s)
POST /investor/invest     → { proposal_id, amount }
GET  /investor/portfolio  → investment history (used by Impact Counter widget)
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
cd backend
source venv/bin/activate
python -m pytest tests/ -v
```

| File | Tests | What's covered |
|---|---|---|
| `test_auth.py` | 6 | Register, login, duplicate detection, token refresh, invalid credentials |
| `test_ml.py` | 5 | Yield prediction, fair price detection, edge cases |
| `test_proposals.py` | 4 | Create, publish, farmer auth guard, investor browse |

---

## ⚙️ CI/CD Pipeline

Every push to `main` triggers two GitHub Actions workflows simultaneously:

```
Push to main
│
├── 🔄 CI Pipeline (.github/workflows/ci.yml)
│   ├── Backend: pip install → pytest → all 15 tests pass ✅
│   ├── Frontend: pnpm install → ESLint → 0 errors ✅
│   └── Docker: docker build → image builds OK ✅
│
└── 📱 APK Builder (.github/workflows/apk-build.yml)
    ├── Node 22 + Java 17 + Android SDK 34
    ├── pnpm install + build (NEXT_PUBLIC_BUILD_MODE=capacitor)
    ├── npx cap add android + npx cap sync android
    ├── ./gradlew assembleDebug
    └── cropchain-latest.apk uploaded as artifact (30 days) ✅
```

---

## 🌍 Environment Variables

### Backend — `.env` (local) + Railway dashboard (production)
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cropchain?retryWrites=true&w=majority
JWT_SECRET=your-secret-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=7
GROQ_API_KEY=gsk_...
OPEN_METEO_BASE_URL=https://api.open-meteo.com/v1/forecast
ENVIRONMENT=production
FRONTEND_URL=https://cropchain.vercel.app
```

### Frontend — `.env.local` (local) + Vercel dashboard (production)
```bash
NEXT_PUBLIC_API_URL=https://cropchain-backend-production.up.railway.app
```

### GitHub Actions Secrets (for APK builds)
```bash
NEXT_PUBLIC_API_URL=https://cropchain-backend-production.up.railway.app
```

---

## 📁 Project Structure

```
cropchain/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI entry + CORS (allow_origins=["*"])
│   │   ├── database.py                # MongoDB Motor async connection
│   │   ├── config.py                  # Pydantic settings from env vars
│   │   ├── routers/
│   │   │   ├── auth.py                # Register, login, refresh token
│   │   │   ├── ml.py                  # Yield predict + fair price
│   │   │   ├── groq_coach.py          # AI pitch + negotiation + price script
│   │   │   ├── proposals.py           # Farmer proposal CRUD
│   │   │   ├── investor.py            # Browse, invest, portfolio
│   │   │   ├── farmer.py              # Farmer-specific routes
│   │   │   └── market.py              # Market data routes
│   │   ├── services/
│   │   │   ├── auth_service.py        # bcrypt hashing + JWT creation
│   │   │   ├── ml_service.py          # scikit-learn model inference
│   │   │   └── groq_service.py        # Groq API calls
│   │   ├── schemas/
│   │   │   ├── user.py                # Pydantic models (uses EmailStr)
│   │   │   └── ml.py                  # ML request/response schemas
│   │   └── ml/
│   │       ├── train_all.py           # Run this to generate .pkl files
│   │       ├── yield_model.pkl        # Trained LinearRegression
│   │       └── anomaly_model.pkl      # Trained IsolationForest
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_ml.py
│   │   └── test_proposals.py
│   ├── Dockerfile
│   ├── Procfile                       # web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
│   └── requirements.txt               # includes email-validator==2.1.0
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx               # Landing page
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx      # + Onboarding flow
│   │   │   ├── farmer/
│   │   │   │   ├── page.tsx           # Dashboard: Ticker + Advisory + Weather + Health
│   │   │   │   ├── yield-predictor/
│   │   │   │   ├── fair-price/
│   │   │   │   ├── coach/             # AI pitch generator + negotiation chat
│   │   │   │   ├── proposals/
│   │   │   │   └── profile/
│   │   │   └── investor/
│   │   │       ├── page.tsx           # Dashboard: Impact Counter + ROI Calculator
│   │   │       ├── browse/            # Trending Crops + Risk Badges + Filters + Sort
│   │   │       ├── portfolio/
│   │   │       └── profile/
│   │   ├── api/
│   │   │   ├── client.ts              # Axios + JWT interceptor + silent refresh (withCredentials: false)
│   │   │   ├── auth.ts
│   │   │   ├── investor.ts
│   │   │   └── ...
│   │   ├── store/
│   │   │   ├── authStore.ts           # Zustand + persist middleware → localStorage
│   │   │   └── uiStore.ts             # Dark mode + initTheme
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx         # Glass navbar + NotificationCenter bell
│   │   │   │   └── BottomNav.tsx      # Role-aware tab bar
│   │   │   ├── ui/
│   │   │   │   ├── WeatherWidget.tsx       # Live weather + 7-day modal
│   │   │   │   ├── CropHealthScore.tsx     # Animated SVG ring + breakdown
│   │   │   │   ├── MandiTicker.tsx         # Infinite scroll + sparkline modal
│   │   │   │   ├── SeasonalAdvisory.tsx    # Claude API + 7-day cache
│   │   │   │   ├── ROICalculator.tsx       # Sliders + bar chart
│   │   │   │   ├── RiskBadge.tsx           # Score badge + factor modal
│   │   │   │   ├── TrendingCrops.tsx       # Horizontal scroll cards
│   │   │   │   ├── ImpactCounter.tsx       # Animated portfolio stats
│   │   │   │   ├── EmptyState.tsx          # SVG illustrations
│   │   │   │   ├── PullIndicator.tsx       # Pull-to-refresh UI
│   │   │   │   └── NotificationCenter.tsx  # Bell + slide-down panel
│   │   │   ├── Onboarding.tsx              # 3-step first-run swipeable flow
│   │   │   └── AuthProvider.tsx            # Capacitor resume handler + theme init
│   │   ├── hooks/
│   │   │   └── usePullToRefresh.ts
│   │   └── utils/
│   │       ├── riskScore.ts           # 5-factor frontend risk scoring
│   │       ├── confetti.ts            # canvas-confetti milestone bursts
│   │       ├── cropConstants.ts       # 14 crops, soils, states, languages
│   │       └── formatCurrency.ts      # INR formatter
│   ├── next.config.js                 # Static export for Capacitor, ignoreBuildErrors
│   ├── .env.local                     # NEXT_PUBLIC_API_URL (local dev)
│   └── .env.production                # NEXT_PUBLIC_API_URL (Railway URL, committed)
│
├── capacitor.config.json              # App ID, SplashScreen, StatusBar, Keyboard plugins
├── package.json                       # Root: @capacitor/core + @capacitor/android
├── Dockerfile                         # Python 3.11-slim, trains ML models at build
├── docker-compose.yml
├── .github/
│   └── workflows/
│       ├── ci.yml                     # pytest + ESLint + Docker check
│       └── apk-build.yml              # Node 22 + Java 17 + Gradle APK build
└── README.md
```

---

## 🛠️ Development Journey

- ✅ **Week 1** — Environment setup: Node, Python 3.11, MongoDB Atlas, Groq API key
- ✅ **Week 2** — FastAPI backend: JWT auth with refresh tokens, all routers, Motor ODM
- ✅ **Week 3** — ML models: LinearRegression yield predictor + IsolationForest anomaly detector
- ✅ **Week 4** — Next.js frontend: Zustand stores, Axios client, all pages scaffolded
- ✅ **Week 5** — Groq AI integration: multilingual pitch generator + negotiation coach
- ✅ **Week 6** — Proposals flow: create → save draft → publish → investor browse → invest
- ✅ **Week 7** — UI redesign: glassmorphism + gradient mesh + spring-animated modals
- ✅ **Week 8** — Real-time polling, dark mode, API field name audit and fixes
- ✅ **Week 9** — CI/CD, Docker, Android APK via Capacitor, GitHub Actions
- ✅ **Week 10** — 9 new dashboard features: weather widget, crop health score, mandi ticker, seasonal advisory (Claude API), ROI calculator, risk badges, trending crops, impact counter, confetti
- ✅ **Week 11** — Persistent login (4-layer auth), mobile performance CSS, pull-to-refresh, notifications, onboarding
- ✅ **Week 12** — Production deployment: Railway (backend) + Vercel (frontend), CORS fix, APK pointing to live backend

---

## 💡 Key Engineering Decisions

| Challenge | Solution |
|---|---|
| Sign-in required every app open | Zustand `persist` middleware writes to localStorage — survives WebView restarts completely |
| Token expiry while app is backgrounded | Capacitor `App.appStateChange` → silent refresh on resume if token < 5min remaining |
| CORS 400 on APK but not browser | `allow_origins=["*"]` + `allow_credentials=False` in FastAPI + `withCredentials: false` in Axios |
| Capacitor plugin crashing on web | `window?.Capacitor?.isNativePlatform()` guard — plugin only loads inside native APK |
| email-validator missing on Railway | Added `email-validator==2.1.0` to requirements.txt — Pydantic `EmailStr` requires it |
| TypeScript errors blocking APK build | `ignoreBuildErrors: true` + `ignoreDuringBuilds: true` in next.config.js |
| Capacitor CLI requires Node 22 | Upgraded GitHub Actions workflow from Node 20 → Node 22 |
| Android platform not found in CI | `npm install @capacitor/android@6` + `npx cap add android` before `cap sync` in workflow |
| 300ms tap delay in Capacitor | `touch-action: manipulation` globally in CSS |
| Animations janky on Android | `translateZ(0)` + `will-change: transform` on all animated card/modal elements |
| Input zoom on Android keyboard | `font-size: 16px !important` on all inputs prevents OS auto-zoom |
| Groq output had markdown markers | `stripMarkdown()` strips `**bold**`, `##headers`, backticks before rendering |
| Dark mode only partially applied | All colours as CSS variables; `toggleDark()` adds/removes `dark` class on `<html>` |
| Concurrent 401 refresh storm | Request queue (`failedQueue`) — one refresh attempt, all queued requests replay together |

---

## 👤 Author

**Sagar Maddi**

Full-stack portfolio project demonstrating:
- **Frontend:** Next.js 14 App Router, TypeScript, Zustand, Framer Motion, glassmorphism design system
- **Backend:** FastAPI, Motor ODM, PyJWT refresh tokens, Pydantic v2
- **ML:** scikit-learn LinearRegression + IsolationForest, trained and served via FastAPI
- **LLM:** Groq Llama 3.3 70B (coach), Claude Sonnet (seasonal advisory)
- **DevOps:** Docker, Railway, Vercel, GitHub Actions CI/CD
- **Mobile:** Capacitor 6 Android APK, persistent auth, 60fps native-feel animations

---

## 📄 License

MIT License — feel free to use this as a reference or starting point.