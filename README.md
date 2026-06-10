# 📓 Havtam's Notes — Frontend AI Tutor

מחברת דיגיטלית חכמה ללמידת HTML, CSS ו-JavaScript  
מבוססת על קורס SheCodes Introduction to Frontend (אפריל–יוני 2025)

---

## מה יש כאן

| אזור | תיאור |
|------|-------|
| 📖 מילון | 65+ מושגי Frontend עם הסבר, קוד, פירוק, טעות נפוצה, תרגיל |
| 🤖 AI Tutor | שאלי שאלות חופשיות, בקשי הסברים, בדיקת קוד |
| 🧪 Playground | עורך HTML/CSS/JS חי עם זיהוי שגיאות בעברית |
| 🎯 מסלול למידה | 10 שיעורים + חידונים + מעקב התקדמות + Badges |
| 📂 הקודים שלי | היסטוריית ניסיונות קוד ב-localStorage |

---

## הפעלה ראשונה (Terminal)

### שלב 1 — מחקי node_modules הקיים ותתקיני מחדש

```bash
# Frontend
cd havtam-notes/frontend
rm -rf node_modules
npm install
```

```bash
# Backend (בטרמינל נפרד)
cd havtam-notes/backend
rm -rf node_modules
npm install
```

### שלב 2 — AI Key (אופציונלי, מומלץ)

```bash
# בתיקיית havtam-notes
cp .env.example .env
# פתחי .env ב-VS Code והכניסי את המפתח שלך:
# ANTHROPIC_API_KEY=sk-ant-...
# מפתח חינמי ב: https://console.anthropic.com/
```

### שלב 3 — הפעילי Frontend

```bash
cd havtam-notes/frontend
npm run dev
```
פתחי: **http://localhost:5173** 🌸

### שלב 4 — הפעילי Backend (ל-AI)

```bash
cd havtam-notes/backend
npm run dev
```

---

## ℹ️ ה-app עובד גם בלי Backend!

ללא backend — המילון, Playground, מסלול למידה, והיסטוריה עובדים מלאים.  
רק חלק ה-AI Tutor (שיחה חופשית + ביקורת קוד) דורש את ה-backend.

---

## מבנה הפרויקט

```
havtam-notes/
├── frontend/                     ← React + Vite + TypeScript + Tailwind
│   ├── dist/                     ← Built app (מוכן להרצה)
│   └── src/
│       ├── components/
│       │   ├── Dictionary/       ← DictCard, DictView
│       │   ├── Playground/       ← עורך קוד + בדיקת שגיאות
│       │   ├── LearningPath/     ← שיעורים + חידונים
│       │   ├── AIChat/           ← AI Tutor chat
│       │   └── CodeHistory/      ← היסטוריית קודים
│       ├── data/
│       │   ├── dictionary.ts     ← 65 מושגים מהקורס
│       │   └── lessons.ts        ← 10 שיעורים + חידונים
│       ├── hooks/
│       │   ├── useLocalStorage.ts
│       │   └── useProgress.ts
│       └── types/index.ts
│
├── backend/                      ← Node.js + Express (ל-AI)
│   └── src/
│       ├── routes/ai.js          ← /api/ai/chat, /review, /explain
│       ├── data/courseKnowledge.js ← System prompt + course topics
│       └── index.js
│
├── .env.example                  ← העתיקי ל-.env
└── README.md
```

---

## API (Backend)

| Method | URL | תיאור |
|--------|-----|-------|
| GET | `/api/health` | בדיקת שרת |
| POST | `/api/ai/chat` | שיחה עם AI Tutor |
| POST | `/api/ai/review` | ביקורת קוד HTML/CSS/JS |
| POST | `/api/ai/explain` | הסבר קוד שורה שורה |

---

## TODO לעתיד

```
[ ] Authentication — Supabase / Firebase (email + Google)
[ ] Database — שמירת התקדמות לפי משתמש (לא רק localStorage)
[ ] User profiles — פרופיל, רמה, נושאים חלשים
[ ] More lessons — שיעורים ממצגות הקורס האמיתיות
[ ] Projects section — פרויקטים מודרכים לתרגול
[ ] Semantic search — חיפוש ב-embeddings
```

---

*Havtam's Notes — Frontend AI Tutor · Built with ❤️ and 🌸*
