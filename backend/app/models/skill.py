from app.extensions import db

class Skill(db.Model):
    __tablename__ = "skills"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False, default="General")
    proficiency = db.Column(db.Integer, nullable=True, default=80)
    icon = db.Column(db.String(100), nullable=True)
    display_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "proficiency": self.proficiency,
            "icon": self.icon,
            "display_order": self.display_order
        }
