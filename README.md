# 🇱🇹 LT Egzaminai — Lithuanian State Language Exam Practice App

A full-stack web application for practising the **Lithuanian A2 State Language Exam (Valstybinės kalbos egzaminas)**. Built to replicate the official NSA (National State Authority) exam format so learners can prepare with realistic, timed mock exams.

---

## 📋 Table of Contents

- [What This App Does](#what-this-app-does)
- [Exam Structure](#exam-structure)
- [Getting Started](#getting-started)
- [How to Register](#how-to-register)
- [How to Start an Exam](#how-to-start-an-exam)
- [Features](#features)
- [Grammar Reference](#grammar-reference)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)

---

## What This App Does

LT Egzaminai lets you:

- **Practice the A2 Lithuanian State Language Exam** in a realistic timed environment
- **Test yourself** across all five exam sections: Reading, Listening, Writing, Speaking, and Grammar
- **See your results** with a skill-by-skill score breakdown after each attempt
- **Learn Lithuanian grammar** through an interactive declension reference page
- **Practice the Constitution Exam** (Konstitucijos egzaminas) with 20 civics questions
- **Translate the interface** into English, Spanish, French, Turkish, or German

Each time you start the exam, the app picks a **different random variant** (reading A/B/C, listening A/B, speaking A/B) and draws a fresh random set of 25 grammar questions from a pool of 75 — so no two exams are exactly the same.

---

## Exam Structure

The A2 exam has **five sections** modelled after the official NSA format:

### 📖 I. Skaitymas — Reading (28 questions)
Five NSA task types:

| Type | Description |
|------|-------------|
| **P1 — Match** | Match short descriptions to the correct person/item |
| **P2 — Definition Match** | Match words to their definitions |
| **P3 — Dialogue Gap** | Fill a missing line in a conversation |
| **P4 — True / False** | Read a text and mark statements true or false |
| **P5 — Notices** | Read three short notices (A/B/C) and answer which one matches |

### 🎧 II. Klausymas — Listening (20 questions)
Four sections, each with 5 questions and a shared audio player. The TTS audio stays playing while you answer all questions in the section.

| Section | Type | Scenario |
|---------|------|---------|
| L1 | Multiple choice A/B/C | Conversation (e.g. café, pharmacy) |
| L2 | Multiple choice A/B/C | Conversation (e.g. doctor, train station) |
| L3 | Multiple choice A/B/C | Conversation (e.g. bus stop, hotel) |
| L4 | Fill in the blank | Public announcement with 5 gaps to complete |

### ✍️ III. Rašymas — Writing (20 questions)
Four NSA writing task types:

| Type | Description |
|------|-------------|
| **W1 — Fill** | Read a passage with a numbered gap; type the missing word |
| **W2 — Select** | Read a passage with a gap; choose the correct word from options |
| **W3 — Form** | Answer short questions as if filling in a form (7 questions) |
| **W4 — Free** | Write a short paragraph (20–30 words) responding to a prompt |

### 🎤 IV. Kalbėjimas — Speaking (8 tasks)
Eight oral tasks presented one per screen with a microphone recording interface:

- Introduce yourself (name, country, age, profession)
- Describe food preferences, daily routine, family, hobbies
- Describe an image shown on screen (picture description task)
- Recommend places to visit in Lithuania
- Describe last weekend or upcoming holiday plans

Recording uses the browser's **Web Speech API** (Chrome/Edge). Your spoken words are transcribed in real time and saved as your answer. A fallback text box is provided for unsupported browsers.

### 📝 V. Gramatika — Grammar (25 questions)
25 multiple-choice grammar questions drawn randomly from a pool of 75. Tests knowledge of:
- Noun cases and their usage
- Verb conjugation and tenses
- Adjective agreement
- Common prepositions
- Sentence structure

---

## Getting Started

### Prerequisites

- **Node.js** v18 or newer
- **PostgreSQL** v14 or newer
- **npm** v9 or newer

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd lt-exam-app

# 2. Install all dependencies (root + client + server)
npm install
npm install --prefix client
npm install --prefix server

# 3. Set up environment variables
cp .env.example server/.env
# Edit server/.env with your database credentials (see Environment Variables below)

# 4. Run database migrations
cd server
npx prisma migrate deploy

# 5. Seed the database with exam questions
npm run seed        # from root, OR:
cd server && npm run seed

# 6. Start the development server
cd ..
npm run dev
```

The app will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

---

## How to Register

1. Open http://localhost:5173 in your browser
2. Click **"Registruotis"** (Register) on the homepage or navigation bar
3. Fill in your **name**, **email address**, and a **password**
4. Click **"Registruotis"** to create your account
5. You will be automatically logged in and redirected to the exam dashboard

> You can also click **"Prisijungti"** (Login) if you already have an account.

---

## How to Start an Exam

1. **Log in** to your account
2. On the homepage, you will see the available exams:
   - 🇱🇹 **Lietuvių kalbos A2 egzaminas** — full mock A2 exam (all 5 sections)
   - 📜 **Konstitucijos egzaminas** — 20 Lithuanian constitution/civics questions
3. Click **"Pradėti egzaminą"** (Start Exam) on the exam card
4. The exam loads with a **countdown timer** in the top-right corner
5. Navigate between questions using the **"Atgal" / "Toliau"** (Back / Next) buttons at the bottom
6. Use the sidebar navigator on the left to jump to any question
7. Flag questions you want to revisit using the **🏴 Pažymėti** button
8. When finished, click **"Pateikti egzaminą"** (Submit Exam) to see your results

### During the Exam

| Feature | How to use |
|---------|-----------|
| **Timer** | Shown in the top-right; exam auto-submits when time runs out |
| **Language** | Click the flag icon (top-left) to translate the interface |
| **Audio (Listening)** | Click ▶ **Klausyti** to play the audio; you can listen up to 2 times |
| **Recording (Speaking)** | Click 🎙️ **Pradėti įrašymą** to record your answer; click again to stop |
| **Flag** | Mark questions to come back to; flagged questions appear in amber in the sidebar |
| **Exit** | Click **Baigti** (top-left) to exit; answers will NOT be saved |

### After the Exam

- Your **total score** and **pass/fail** result are shown immediately
- A **skill breakdown chart** shows your score per section
- You can review every question with the correct answer highlighted
- Click **"Bandyti dar kartą"** (Try Again) to start a new attempt with a different variant

---

## Features

| Feature | Details |
|---------|---------|
| 🔀 **Randomised variants** | Reading (3 variants), Listening (2), Speaking (2), Grammar (25 random from 75) |
| 🔄 **Anti-repeat** | The app remembers your last attempt and picks a different variant next time |
| 🌍 **Multi-language UI** | Translate the interface to EN / ES / FR / TR / DE via the language picker |
| ⏱️ **Timed exam** | Configurable time limit per exam (A2 = 90 minutes) |
| 📊 **Score breakdown** | Results split by skill (Reading, Listening, Writing, Speaking, Grammar) |
| 🎧 **TTS Audio** | Listening sections use browser Text-to-Speech in Lithuanian (`lt-LT`) |
| 🎙️ **Speech recording** | Speaking tasks use Web Speech API for real-time transcription |
| 📖 **Grammar reference** | Full Lithuanian declension guide at `/grammar` with textbook-style comparison tables |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |

---

## Grammar Reference

Visit **/grammar** (🇱🇹 Linksniai in the navigation) for the interactive Lithuanian declension guide:

- All **7 cases** (Vardininkas → Šauksmininkas) with usage rules, examples, and prepositions
- **Textbook-style endings grid** — see Nominative as the base form, with any selected case shown below for direct comparison
- Columns for each declension class: ♂ -as, ♂ -is, ♂ -us, ♀ -a, ♀ -ė
- **Noun declension comparison chart** — see how *brolis*, *mama*, *draugas*, *sesė* change across all 7 cases
- **Master preposition table** — 32 prepositions with which case they govern, meaning, and example sentence

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL with Prisma ORM |
| **Auth** | JWT (access + refresh tokens), bcrypt |
| **Charts** | Recharts |
| **TTS** | Browser Web Speech API (`SpeechSynthesis`) |
| **Recording** | Browser Web Speech API (`SpeechRecognition`) |
| **Translation** | Unofficial Google Translate API (client-side) |

---

## Project Structure

```
lt-exam-app/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── exam/        # ExamTimer, QuestionPanel, ListeningSectionPanel, etc.
│   │   │   ├── layout/      # Navbar, Layout
│   │   │   └── ui/          # Button, Modal, Badge, Spinner, etc.
│   │   ├── context/
│   │   │   └── LanguageContext.tsx   # Multi-language translation hook
│   │   ├── hooks/           # useTimer
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── ExamSession.tsx       # Main exam interface
│   │   │   ├── Results.tsx           # Score & review page
│   │   │   ├── Grammar.tsx           # Declension reference
│   │   │   ├── Login.tsx / Register.tsx
│   │   │   └── ...
│   │   ├── types/           # Shared TypeScript types
│   │   └── api/             # Axios instance
│   └── package.json
│
├── server/                  # Express backend
│   ├── src/
│   │   ├── controllers/     # attempt, auth, exam controllers
│   │   ├── middleware/       # JWT auth middleware
│   │   └── routes/          # API route definitions
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── migrations/      # Database migration history
│   │   └── seed.ts          # Exam question seed data (300+ questions)
│   └── package.json
│
├── .env.example             # Environment variable template
├── .gitignore
├── package.json             # Root scripts (dev, build, seed)
└── README.md
```

---

## Environment Variables

Copy `.env.example` to `server/.env` and fill in your values:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/lt_exam_db"

# JWT secrets — use long random strings in production
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-change-in-production"

# Server port
PORT=3001

# Environment
NODE_ENV=development
```

> ⚠️ **Never commit your `.env` file.** It is excluded by `.gitignore`. Only `.env.example` (with placeholder values) should be committed.

---

## Available Scripts

From the **project root**:

```bash
npm run dev      # Start both frontend (port 5173) and backend (port 3001) concurrently
npm run build    # Build both client and server for production
npm run seed     # Seed the database with exam questions
```

From **`server/`**:

```bash
npm run dev      # Start backend only with hot-reload (ts-node-dev)
npm run seed     # Re-seed the database (safe to run multiple times)
npx prisma studio          # Open Prisma GUI to browse the database
npx prisma migrate dev     # Create and apply a new migration
```

From **`client/`**:

```bash
npm run dev      # Start frontend only
npm run build    # Build for production
npm run preview  # Preview the production build locally
```

---

## Licence

This project is for educational and personal practice purposes. Exam content is modelled after the NSA A2 Lithuanian State Language Exam format. No official affiliation with the National State Authority (Valstybinė kalbos inspekcija) is implied.
