import json
import os # Import the 'os' module to interact with the file system
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --- CORS Middleware (no changes needed) ---
origins = [
    "http://localhost",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoint (MODIFIED) ---
@app.get("/lang/{language_code}")
async def get_language(language_code: str):
    """
    Fetches the translation dictionary for a given language code
    by reading the corresponding JSON file from the 'locales' directory.
    """
    # Sanitize input to prevent directory traversal attacks
    safe_lang_code = os.path.basename(language_code)
    file_path = f"locales/{safe_lang_code}.json"

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Language '{safe_lang_code}' not found.")

    with open(file_path, "r", encoding="utf-8") as f:
        translations = json.load(f)

    return translations

@app.get("/")
async def root():
    return {"message": "Digit-Tally Multi-Language API is running!"}