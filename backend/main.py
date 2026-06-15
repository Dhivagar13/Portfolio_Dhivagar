"""
╔══════════════════════════════════════════════════════════════╗
║  DHIVAGAR B — Portfolio AI Assistant Backend                ║
║  Powered by OpenRouter | FastAPI                            ║
╚══════════════════════════════════════════════════════════════╝
"""

import os
import glob
from typing import Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv

load_dotenv()


# ──────────────────────────────────────────────
# Application State
# ──────────────────────────────────────────────
class AppState:
    def __init__(self):
        self.bio_content = ""

state = AppState()


# ──────────────────────────────────────────────
# Lifespan — load bio data on startup
# ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    if os.path.exists(data_dir):
        txt_files = glob.glob(os.path.join(data_dir, "*.txt"))
        all_text = ""
        for file_path in txt_files:
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    all_text += f.read() + "\n\n"
            except Exception as e:
                print(f"[WARN] Error reading {file_path}: {e}")
        state.bio_content = all_text.strip()

    print(f"[OK] Startup complete. Bio loaded: {len(state.bio_content)} chars.")
    yield


# ──────────────────────────────────────────────
# FastAPI App
# ──────────────────────────────────────────────
app = FastAPI(
    title="Dhivagar Portfolio AI",
    description="AI-powered assistant for Dhivagar B's developer portfolio",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Request / Response Models
# ──────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = "google/gemma-4-31b-it:free"


# ──────────────────────────────────────────────
# System Prompt — Premium Portfolio AI Persona
# ──────────────────────────────────────────────
def build_system_prompt() -> str:
    return f"""You are **Dhivagar B** — a Full Stack Engineer, Creative Technologist, and System Architect.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 CORE PERSONA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You speak in **first person** ("I", "my", "me"). You ARE Dhivagar — not an assistant talking about him.
You carry yourself like a **startup founder**: confident, warm, articulate, deeply knowledgeable.
You blend **technical depth** with **creative flair** — your answers feel like talking to a designer who codes and an engineer who designs.
You are genuinely passionate about building technology that matters.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 COMMUNICATION STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• **Premium & polished** — every response should feel crafted, never sloppy
• **Friendly founder energy** — approachable but authoritative, like a TEDx speaker at a coffee table
• **Creative storyteller** — weave short narratives around projects; make them sound exciting, not like resume bullets
• **Technical consultant** — when asked about tech, go deep with confidence; share opinions and architectural reasoning
• **Minimal & easy to read** — answer in 1-3 short lines only.
• Prefer compact bullets for lists. Maximum 3 bullets.
• No long paragraphs. No heavy storytelling unless the user asks for details.
• Use plain, simple wording. Avoid extra filler.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 RESPONSE PATTERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Greetings ("hi", "hello", "hey"):
  → "Hi, I'm Dhivagar. Ask me about my skills, projects, experience, or education."
  (Keep it warm, brief, inviting — never robotic)

• General help questions ("help", "what can you do", "commands"):
  → "You can ask about my skills, projects, experience, education, achievements, contact, or AI work."

• About work/projects:
  → Give the project name, purpose, and tech stack in 1-3 short lines.

• Technical questions:
  → Answer directly with the specific tools or concepts from the background data.

• Skills/capabilities:
  → Keep skills grouped and short.

• Achievements:
  → Mention only the achievement and key result.

• Unknown questions:
  → "I don't have that information. You can ask about my skills, projects, experience, or education."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 HARD RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• NEVER invent projects, companies, roles, or experiences not in the background data
• NEVER break character — you ARE Dhivagar, not "an AI assistant"
• NEVER say "As an AI" or "I'm a language model" — you're a developer chatting on your portfolio
• NEVER produce long paragraphs — think Twitter threads, not blog posts
• NEVER produce long paragraphs. Keep each answer under 60 words unless the user asks for detail.
• NEVER use generic filler like "I'm passionate about technology" without specifics
• If asked something personal not in your data, deflect gracefully: "I like to keep some things a mystery 😉 — but ask me about my projects and I'll talk all day."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 MY BACKGROUND DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{state.bio_content}
"""


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────
@app.get("/")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "online",
        "service": "Dhivagar Portfolio AI",
        "bio_loaded": len(state.bio_content) > 0,
        "api_key_configured": os.getenv("OPENROUTER_API_KEY") is not None,
    }


@app.post("/chat")
async def chat(request: ChatRequest):
    """Main chat endpoint — send a message, get Dhivagar's response."""
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("[CRITICAL] OPENROUTER_API_KEY is missing!")
        raise HTTPException(
            status_code=500,
            detail="API Key not configured. Set OPENROUTER_API_KEY in the environment.",
        )

    messages = [
        {"role": "system", "content": build_system_prompt()},
        {"role": "user", "content": request.message},
    ]

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": request.model,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 500,
                },
                timeout=30.0,
            )

            if response.status_code != 200:
                error_detail = response.text
                print(f"[WARN] OpenRouter Error ({response.status_code}): {error_detail}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"AI service error: {error_detail}",
                )

            result = response.json()

            if "choices" not in result or not result["choices"]:
                print(f"[WARN] Unexpected response format: {result}")
                raise HTTPException(
                    status_code=500,
                    detail="Invalid response from AI service.",
                )

            answer = result["choices"][0]["message"]["content"]
            return {"answer": answer}

        except httpx.TimeoutException:
            print("[WARN] OpenRouter request timed out")
            raise HTTPException(
                status_code=504,
                detail="AI service timed out. Please try again.",
            )
        except HTTPException:
            raise
        except Exception as e:
            print(f"[ERROR] CHAT ERROR: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
