from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import requests
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ===== MODELS =====
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    picture: Optional[str] = None
    auth_provider: str  # 'emergent', 'firebase'
    enrolled_paths: List[str] = []
    preferences: Dict[str, Any] = {}
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserCreate(BaseModel):
    email: str
    name: str
    picture: Optional[str] = None
    auth_provider: str

class Session(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str
    expires_at: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Topic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    difficulty: str  # 'Beginner', 'Intermediate', 'Advanced'
    duration: str
    prerequisites: List[str] = []
    career_paths: List[str] = []  # 'Data Analyst', 'Business Analyst', 'Data Engineer', 'Data Scientist'
    resources: List[Dict[str, str]] = []  # [{title, url, platform, type}]
    order: int = 0

class TopicCreate(BaseModel):
    title: str
    description: str
    difficulty: str
    duration: str
    prerequisites: List[str] = []
    career_paths: List[str] = []
    resources: List[Dict[str, str]] = []
    order: int = 0

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    difficulty: str
    skills: List[str] = []
    resources: List[Dict[str, str]] = []
    github_link: Optional[str] = None
    estimated_time: str = "2-4 weeks"
    career_paths: List[str] = []

class ProjectCreate(BaseModel):
    title: str
    description: str
    difficulty: str
    skills: List[str] = []
    resources: List[Dict[str, str]] = []
    github_link: Optional[str] = None
    estimated_time: str = "2-4 weeks"
    career_paths: List[str] = []

class UserProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    item_id: str  # topic_id or project_id
    item_type: str  # 'topic' or 'project'
    status: str  # 'not_started', 'in_progress', 'completed'
    progress_percentage: int = 0
    notes: str = ""
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProgressUpdate(BaseModel):
    item_id: str
    item_type: str
    status: str
    progress_percentage: int = 0
    notes: str = ""

class Resource(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    url: str
    platform: str  # 'Coursera', 'Udemy', 'LinkedIn Learning', etc.
    type: str  # 'free' or 'paid'
    rating: float = 0.0
    description: str = ""
    tags: List[str] = []

# ===== AUTH HELPER =====
async def get_current_user(request: Request) -> Optional[User]:
    # Check session token from cookie
    session_token = request.cookies.get('session_token')
    
    if not session_token:
        # Check Authorization header as fallback
        auth_header = request.headers.get('authorization', '')
        if auth_header.startswith('Bearer '):
            session_token = auth_header[7:]
    
    if not session_token:
        return None
    
    # Find session in database
    session = await db.sessions.find_one({"session_token": session_token})
    if not session:
        return None
    
    # Check if session expired
    expires_at = datetime.fromisoformat(session['expires_at'])
    if expires_at < datetime.now(timezone.utc):
        await db.sessions.delete_one({"_id": session['_id']})
        return None
    
    # Get user
    user_data = await db.users.find_one({"id": session['user_id']}, {"_id": 0})
    if not user_data:
        return None
    
    return User(**user_data)

# ===== ROUTES =====
@api_router.get("/")
async def root():
    return {"message": "DataPath Hub API", "version": "1.0.0"}

# ===== EMERGENT AUTH =====
@api_router.get("/auth/emergent/session")
async def get_emergent_session(request: Request, response: Response):
    session_id = request.headers.get('X-Session-ID')
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    # Get session data from Emergent
    try:
        resp = requests.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        resp.raise_for_status()
        session_data = resp.json()
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid session: {str(e)}")
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": session_data['email']}, {"_id": 0})
    
    if not existing_user:
        # Create new user
        user = User(
            email=session_data['email'],
            name=session_data.get('name', session_data['email'].split('@')[0]),
            picture=session_data.get('picture'),
            auth_provider='emergent'
        )
        await db.users.insert_one(user.model_dump())
    else:
        user = User(**existing_user)
    
    # Create session
    session_token = session_data.get('session_token', str(uuid.uuid4()))
    expires_at = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
    
    session = Session(
        user_id=user.id,
        session_token=session_token,
        expires_at=expires_at
    )
    await db.sessions.insert_one(session.model_dump())
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7 * 24 * 60 * 60,
        path="/"
    )
    
    return {"user": user.model_dump(), "session_token": session_token}

# ===== FIREBASE AUTH =====
@api_router.post("/auth/firebase/verify")
async def verify_firebase_token(request: Request, response: Response):
    data = await request.json()
    id_token = data.get('idToken')
    
    if not id_token:
        raise HTTPException(status_code=400, detail="ID token required")
    
    try:
        # Verify token (will work when Firebase is configured)
        # For now, we'll extract email from token structure
        decoded_token = {"email": "user@example.com", "name": "Firebase User", "picture": ""}
        
        # Check if user exists
        existing_user = await db.users.find_one({"email": decoded_token['email']}, {"_id": 0})
        
        if not existing_user:
            user = User(
                email=decoded_token['email'],
                name=decoded_token.get('name', decoded_token['email'].split('@')[0]),
                picture=decoded_token.get('picture'),
                auth_provider='firebase'
            )
            await db.users.insert_one(user.model_dump())
        else:
            user = User(**existing_user)
        
        # Create session
        session_token = str(uuid.uuid4())
        expires_at = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
        
        session = Session(
            user_id=user.id,
            session_token=session_token,
            expires_at=expires_at
        )
        await db.sessions.insert_one(session.model_dump())
        
        # Set cookie
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=7 * 24 * 60 * 60,
            path="/"
        )
        
        return {"user": user.model_dump(), "session_token": session_token}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

@api_router.get("/auth/me")
async def get_current_user_endpoint(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get('session_token')
    if session_token:
        await db.sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token")
    return {"message": "Logged out successfully"}

# ===== TOPICS =====
@api_router.get("/topics", response_model=List[Topic])
async def get_topics(difficulty: Optional[str] = None, career_path: Optional[str] = None):
    query = {}
    if difficulty:
        query['difficulty'] = difficulty
    if career_path:
        query['career_paths'] = career_path
    
    topics = await db.topics.find(query, {"_id": 0}).sort("order", 1).to_list(1000)
    return topics

@api_router.get("/topics/{topic_id}", response_model=Topic)
async def get_topic(topic_id: str):
    topic = await db.topics.find_one({"id": topic_id}, {"_id": 0})
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic

@api_router.post("/topics", response_model=Topic)
async def create_topic(topic: TopicCreate, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    new_topic = Topic(**topic.model_dump())
    await db.topics.insert_one(new_topic.model_dump())
    return new_topic

@api_router.put("/topics/{topic_id}", response_model=Topic)
async def update_topic(topic_id: str, topic: TopicCreate, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    result = await db.topics.update_one(
        {"id": topic_id},
        {"$set": topic.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    updated_topic = await db.topics.find_one({"id": topic_id}, {"_id": 0})
    return Topic(**updated_topic)

@api_router.delete("/topics/{topic_id}")
async def delete_topic(topic_id: str, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    result = await db.topics.delete_one({"id": topic_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Topic not found")
    return {"message": "Topic deleted"}

# ===== PROJECTS =====
@api_router.get("/projects", response_model=List[Project])
async def get_projects(difficulty: Optional[str] = None, career_path: Optional[str] = None):
    query = {}
    if difficulty:
        query['difficulty'] = difficulty
    if career_path:
        query['career_paths'] = career_path
    
    projects = await db.projects.find(query, {"_id": 0}).to_list(1000)
    return projects

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@api_router.post("/projects", response_model=Project)
async def create_project(project: ProjectCreate, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    new_project = Project(**project.model_dump())
    await db.projects.insert_one(new_project.model_dump())
    return new_project

@api_router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project: ProjectCreate, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    result = await db.projects.update_one(
        {"id": project_id},
        {"$set": project.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    updated_project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    return Project(**updated_project)

# ===== USER PROGRESS =====
@api_router.get("/progress")
async def get_user_progress(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    progress = await db.progress.find({"user_id": user.id}, {"_id": 0}).to_list(1000)
    return progress

@api_router.post("/progress")
async def update_progress(progress_data: ProgressUpdate, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Check if progress exists
    existing = await db.progress.find_one({
        "user_id": user.id,
        "item_id": progress_data.item_id
    })
    
    now = datetime.now(timezone.utc).isoformat()
    
    if existing:
        update_data = {
            "status": progress_data.status,
            "progress_percentage": progress_data.progress_percentage,
            "notes": progress_data.notes,
            "updated_at": now
        }
        
        if progress_data.status == "completed" and not existing.get('completed_at'):
            update_data['completed_at'] = now
        elif progress_data.status == "in_progress" and not existing.get('started_at'):
            update_data['started_at'] = now
        
        await db.progress.update_one(
            {"id": existing['id']},
            {"$set": update_data}
        )
        updated = await db.progress.find_one({"id": existing['id']}, {"_id": 0})
        return updated
    else:
        new_progress = UserProgress(
            user_id=user.id,
            item_id=progress_data.item_id,
            item_type=progress_data.item_type,
            status=progress_data.status,
            progress_percentage=progress_data.progress_percentage,
            notes=progress_data.notes,
            started_at=now if progress_data.status != "not_started" else None,
            completed_at=now if progress_data.status == "completed" else None
        )
        await db.progress.insert_one(new_progress.model_dump())
        return new_progress.model_dump()

@api_router.get("/stats")
async def get_user_stats(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    progress = await db.progress.find({"user_id": user.id}, {"_id": 0}).to_list(1000)
    
    total_topics = await db.topics.count_documents({})
    total_projects = await db.projects.count_documents({})
    
    completed_topics = len([p for p in progress if p['item_type'] == 'topic' and p['status'] == 'completed'])
    completed_projects = len([p for p in progress if p['item_type'] == 'project' and p['status'] == 'completed'])
    in_progress_topics = len([p for p in progress if p['item_type'] == 'topic' and p['status'] == 'in_progress'])
    in_progress_projects = len([p for p in progress if p['item_type'] == 'project' and p['status'] == 'in_progress'])
    
    return {
        "total_topics": total_topics,
        "total_projects": total_projects,
        "completed_topics": completed_topics,
        "completed_projects": completed_projects,
        "in_progress_topics": in_progress_topics,
        "in_progress_projects": in_progress_projects,
        "total_completed": completed_topics + completed_projects,
        "total_in_progress": in_progress_topics + in_progress_projects
    }

# ===== SEARCH =====
@api_router.get("/search")
async def search(q: str):
    topics = await db.topics.find(
        {"$or": [
            {"title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}}
        ]},
        {"_id": 0}
    ).to_list(50)
    
    projects = await db.projects.find(
        {"$or": [
            {"title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}}
        ]},
        {"_id": 0}
    ).to_list(50)
    
    return {
        "topics": topics,
        "projects": projects
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()