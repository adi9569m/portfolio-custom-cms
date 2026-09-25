from app.routes.auth import auth_bp
from app.routes.profile import profile_bp
from app.routes.projects import projects_bp
from app.routes.skills import skills_bp
from app.routes.experience import experience_bp
from app.routes.services import services_bp
from app.routes.blogs import blogs_bp

__all__ = [
    "auth_bp",
    "profile_bp",
    "projects_bp",
    "skills_bp",
    "experience_bp",
    "services_bp",
    "blogs_bp"
]
