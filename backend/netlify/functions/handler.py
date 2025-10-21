# Netlify Python function wrapper that adapts FastAPI (ASGI) to Lambda via Mangum.
# This file lives at backend/netlify/functions/handler.py and imports backend/server.py (app).
import os
import sys

# Add backend/ (two levels up from this file) to sys.path so `import server` works
BACKEND_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

# Import the FastAPI `app` object from backend/server.py
try:
    # backend/server.py defines `app = FastAPI()` at top-level
    from server import app
except Exception as e:
    # When imports fail, provide a tiny fallback app that returns an error
    from fastapi import FastAPI
    app = FastAPI()

    @app.get("/_netlify_handler_error")
    def _handler_error():
        return {"error": "failed to import backend.server: " + str(e)}

# Mangum adapts ASGI apps to AWS Lambda (Netlify functions)
from mangum import Mangum
handler = Mangum(app)
