# 🚀 Project SoloLeveling

**AI-Driven Student Guidance Platform**

Transform from a student to a job-ready professional with personalized roadmaps, AI-powered resume audits, and real-time market insights.

---

## ✨ Features

### Phase 1: Discovery & Foundation (Simple Level)
- **🧠 Domain Discovery**: AI analyzes your hobbies and skills to create a personalized career heatmap
- **📝 Smart Resume Audit**: Upload your resume and get ATS-optimized suggestions with keyword gap analysis
- **🗺️ Day Zero Roadmap**: Get a 3-step action plan (Learn, Setup, Do) for any career domain
- **👥 Recruiter Directory**: Connect with verified recruiters categorized by industry
- **📊 Readiness Quiz**: 15-minute assessment with radar chart visualization

### Phase 2: Personalization (Medium Level)
- **🌳 Adaptive Learning**: Skill tree with locked/unlocked progression based on quiz performance
- **🔧 Project-to-JD Translator**: Convert job descriptions into hands-on project plans

### Phase 3: Real-time Intelligence (Hard Level)
- **📈 Market Pivot Alerts**: Real-time job market trends and skill demand analysis
- **🎤 AI Mock Interviews**: Practice interviews with AI feedback and automatic roadmap updates

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **AI**: Google Gemini 1.5 Pro, OpenAI GPT-4
- **Database**: Supabase (PostgreSQL + pgvector)
- **PDF Processing**: pdfplumber, PyPDF2

### APIs
- Google Gemini API (primary reasoning)
- OpenAI API (mock interviews)
- Indian Job API (job market data)
- Arbeitnow API (international jobs)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.13+
- Supabase account

### Installation

1. **Clone the repository**
```bash
cd c:\Users\biggr\Downloads\stuguide
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Configure environment variables**

Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hpguxsacjuxolbcbiifp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
GEMINI_API_KEY=AIzaSyCMwH7VXK9qloDaTsaHM6zDqbgZ7NIKG50
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Create `backend/.env`:
```env
SUPABASE_URL=https://hpguxsacjuxolbcbiifp.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here
DATABASE_URL=postgresql://postgres:Ajay44481$$@db.hpguxsacjuxolbcbiifp.supabase.co:5432/postgres
GEMINI_API_KEY=AIzaSyCMwH7VXK9qloDaTsaHM6zDqbgZ7NIKG50
OPENAI_API_KEY=your_openai_key_here
INDIAN_JOB_API_KEY=sk-live-pVRlFGRY9p7SvC1oErpafNSKdTUaimO7dMVWzwoj
```

5. **Set up Supabase database**

Run the migrations in `IMPLEMENTATION_PLAN.md` in your Supabase SQL editor.

6. **Start the development servers**

Frontend (Terminal 1):
```bash
npm run dev
```

Backend (Terminal 2):
```bash
cd backend
python -m app.main
```

7. **Open the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 📁 Project Structure

```
stuguide/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Landing page
│   ├── assessment/          # Career assessment
│   ├── roadmap/             # Learning roadmaps
│   ├── resume-audit/        # Resume analysis
│   ├── recruiters/          # Recruiter directory
│   └── api/                 # API routes
├── components/              # React components
│   └── ui/                  # Shadcn/ui components
├── lib/                     # Utilities
│   ├── supabase/           # Supabase clients
│   └── gemini.ts           # Gemini AI utilities
├── backend/                 # FastAPI backend
│   └── app/
│       ├── main.py         # FastAPI app
│       ├── api/            # API routers
│       ├── services/       # Business logic
│       └── models/         # Data models
└── public/                  # Static assets
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Violet (500-900)
- **Secondary**: Fuchsia (500-900)
- **Accents**: Cyan, Emerald, Amber, Rose
- **Background**: Slate (900-950)
- **Text**: White, Slate (200-400)

### Design Principles
- Dark theme with glassmorphism effects
- Animated gradients and smooth transitions
- Responsive design (mobile-first)
- Accessible and user-friendly

---

## 🔐 Security

- API keys stored in `.env` files (gitignored)
- Supabase Row Level Security (RLS) enabled
- CORS configured for allowed origins
- Input validation and sanitization
- Secure file upload handling

---

## 📊 Development Status

- [x] Phase 0: Foundation & Setup
- [ ] Phase 1: Discovery & Foundation (In Progress)
  - [ ] Domain Discovery
  - [ ] Day Zero Roadmap
  - [ ] Smart Resume Audit
  - [ ] Recruiter Directory
  - [ ] Readiness Quiz
- [ ] Phase 2: Personalization
- [ ] Phase 3: Real-time Intelligence

---

## 🤝 Contributing

This is a personal project. For questions or suggestions, please open an issue.

---

## 📄 License

Private project - All rights reserved.

---

## 🙏 Acknowledgments

- **Google Gemini**: AI-powered career guidance
- **Supabase**: Database and authentication
- **Shadcn/ui**: Beautiful UI components
- **Vercel**: Deployment platform

---

**Built with ❤️ by the SoloLeveling Team**

*Powered by AI. Built for Students.*
