from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import base64
import sqlite3
import bcrypt
from io import BytesIO
from PIL import Image

app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://schematic-sense.vercel.app",
        "https://schematic-sense-8mla.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Database setup ---
def init_db():
    conn = sqlite3.connect("users.db")
    c = conn.cursor()
    c.execute(
        """CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )"""
    )
    conn.commit()
    conn.close()

init_db()

# --- Models ---
class User(BaseModel):
    email: str
    password: str


# --- Register route ---
@app.post("/register")
def register(user: User):
    conn = sqlite3.connect("users.db")
    c = conn.cursor()

    # Check if user already exists
    c.execute("SELECT * FROM users WHERE email = ?", (user.email,))
    if c.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash password
    hashed_pw = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
    c.execute("INSERT INTO users (email, password) VALUES (?, ?)", (user.email, hashed_pw))
    conn.commit()
    conn.close()

    return {"message": "User registered successfully"}


# --- Login route ---
@app.post("/login")
def login(user: User):
    conn = sqlite3.connect("users.db")
    c = conn.cursor()

    c.execute("SELECT password FROM users WHERE email = ?", (user.email,))
    row = c.fetchone()
    conn.close()

    if not row or not bcrypt.checkpw(user.password.encode("utf-8"), row[0]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"message": "Login successful"}


# --- Circuit analysis route ---
@app.post("/analyze")
async def analyze_circuit(file: UploadFile = File(...)):
    try:
        # Read uploaded image
        contents = await file.read()
        image = Image.open(BytesIO(contents))

        # Convert to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        # --- GPT Vision prompt ---
        prompt = (
            "You are an expert electronics engineer. Analyze this circuit diagram image. "
            "1. List all visible components (resistors, capacitors, transistors, ICs, diodes, etc). "
            "2. Explain the likely function or purpose of the circuit. "
            "3. Identify potential wiring or design errors, missing connections, or faulty placements. "
            "Provide your explanation clearly and logically."
        )

        # --- OpenAI call ---
        openai.api_key = "YOUR_OPENAI_API_KEY"  # Replace with your key
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": f"data:image/png;base64,{img_str}"}
                    ]
                }
            ]
        )

        analysis = response["choices"][0]["message"]["content"]
        return {"analysis": analysis}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Home route ---
@app.get("/")
def home():
    return {"message": "SchematicSense backend running successfully!"}


# --- Run the server ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)
