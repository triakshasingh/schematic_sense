from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import openai
import base64

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Replace with your API key
openai.api_key = "YOUR_OPENAI_API_KEY"

@app.get("/")
def home():
    return {"message": "SchematicSense backend running successfully!"}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    b64_image = base64.b64encode(image_bytes).decode("utf-8")

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You explain circuits like an electronics tutor."},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Explain this schematic in detail."},
                    {"type": "image_url", "image_url": f"data:image/png;base64,{b64_image}"}
                ]
            }
        ]
    )

    return {"explanation": response["choices"][0]["message"]["content"]}
