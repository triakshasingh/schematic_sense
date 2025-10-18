# ⚡ SchematicSense

SchematicSense is an AI-powered tool that explains electronic circuits from images or netlists.  
Upload a schematic → get a clear breakdown like a human mentor.

## 🧠 Tech Stack
- Frontend: Next.js + Tailwind CSS
- Backend: FastAPI + OpenAI API
- AI: GPT-4o / GPT-4 Vision

## 🚀 Run locally
### Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
