from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import base64
import sqlite3
import bcrypt
from io import BytesIO
from PIL import Image
import os 
from dotenv import load_dotenv
load_dotenv()


app = FastAPI()
openai.api_key = os.getenv("OPENAI_API_KEY")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://schematic-sense.vercel.app",
        "https://schematic-sense-ppxp7e5iw-triakshasingh-1949s-projects.vercel.app",
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
async def analyze(file: UploadFile = File(...)):
    try:
        # Read the uploaded image
        image_bytes = await file.read()
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        print("API key loaded:", openai.api_key is not None)

        # Call GPT-4o for image analysis
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "Analyze this circuit schematic. "
                                "Identify its components, describe their function, "
                                "and mention any design issues or potential improvements."
                            )
                        },
                        {
                            "type": "image_url",
                            "image_url": f"data:image/jpeg;base64,{image_base64}"
                        }
                    ]
                }
            ],
        )

        result = response.choices[0].message.content
        return {"analysis": result}

    except Exception as e:
        print("Error analyzing image:", e)
        raise HTTPException(status_code=500, detail=str(e))



# --- Home route ---
@app.get("/")
def home():
    return {"message": "SchematicSense backend running successfully!"}


# --- Run the server ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)
