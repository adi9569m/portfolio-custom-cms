from datetime import datetime, timezone
from app.extensions import db

class Profile(db.Model):
    __tablename__ = "profiles"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False, default="Your Name")
    title = db.Column(db.String(150), nullable=False, default="Full Stack Developer")
    bio = db.Column(db.Text, nullable=True)
    avatar_url = db.Column(db.String(300), nullable=True)
    resume_url = db.Column(db.String(300), nullable=True)
    email = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(30), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    github_url = db.Column(db.String(255), nullable=True)
    linkedin_url = db.Column(db.String(255), nullable=True)
    twitter_url = db.Column(db.String(255), nullable=True)
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "title": self.title,
            "bio": self.bio,
            "avatar_url": self.avatar_url,
            "resume_url": self.resume_url,
            "email": self.email,
            "phone": self.phone,
            "location": self.location,
            "github_url": self.github_url,
            "linkedin_url": self.linkedin_url,
            "twitter_url": self.twitter_url,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
