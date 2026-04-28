# 🌶️ ATA GiGUN

**Nollywood Movie Discovery, Rating & Review Platform**

ATA GiGUN (meaning "pepper" in Yoruba) is a full-stack web application for discovering, rating, and reviewing Nollywood movies. Think Rotten Tomatoes, but built specifically for Nigerian cinema.

## ✨ Features

- **ATA Score**: Combined critic + audience score (0-100)
- **Movie Discovery**: Browse by genre, language, year, and more
- **Community Reviews**: Rate and review your favorite Nollywood films
- **Language Tags**: English, Yoruba, Igbo, Pidgin, Mixed
- **Cinema Tracker**: See what's currently in cinemas
- **Hidden Gems**: Discover underrated classics

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) |

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/your-username/ata-gigun.git
cd ata-gigun

# 2. Install all dependencies
npm run install-all

# 3. Set up environment variables
cd server
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET

# 4. Seed the database
npm run seed

# 5. Start both servers
cd ..
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Project Structure

```
ata-gigun/
├── client/          # React frontend (Vite)
├── server/          # Node.js backend (Express)
├── .gitignore
├── package.json
└── README.md
```

## 🌶️ ATA Score System

| Score | Label |
|-------|-------|
| 85-100 | 🌶️🌶️🌶️ Pepper Hot — Certified Classic |
| 70-84 | 🌶️🌶️ Still Hot — Strong Recommend |
| 50-69 | 🌶️ Mild Pepper — Worth Watching |
| < 50 | ❌ Dry Pepper — Proceed with Caution |

---

Built with 🌶️ by **Pelumi Emmanuel Adeniyi**
