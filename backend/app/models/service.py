from app.extensions import db

class Service(db.Model):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(100), nullable=True)
    display_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "icon": self.icon,
            "display_order": self.display_order
        }


class Testimonial(db.Model):
    __tablename__ = "testimonials"

    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(100), nullable=False)
    client_role = db.Column(db.String(100), nullable=True)
    company = db.Column(db.String(100), nullable=True)
    feedback = db.Column(db.Text, nullable=False)
    avatar_url = db.Column(db.String(300), nullable=True)
    display_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "client_name": self.client_name,
            "client_role": self.client_role,
            "company": self.company,
            "feedback": self.feedback,
            "avatar_url": self.avatar_url,
            "display_order": self.display_order
        }
