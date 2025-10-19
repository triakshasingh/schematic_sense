from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import base64
import sqlite3
import bcrypt

app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://schematic-sense.vercel.app",
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


@app.get("/")
def home():
    return {"message": "SchematicSense backend running successfully!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)
