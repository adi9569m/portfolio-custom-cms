from app.extensions import db

class Experience(db.Model):
    __tablename__ = "experiences"

    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(150), nullable=False)
    position = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.String(50), nullable=False)
    end_date = db.Column(db.String(50), nullable=True, default="Present")
    is_current = db.Column(db.Boolean, default=False)
    display_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "company": self.company,
            "position": self.position,
            "description": self.description,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "is_current": self.is_current,
            "display_order": self.display_order
        }


class Education(db.Model):
    __tablename__ = "educations"

    id = db.Column(db.Integer, primary_key=True)
    institution = db.Column(db.String(150), nullable=False)
    degree = db.Column(db.String(150), nullable=False)
    field_of_study = db.Column(db.String(150), nullable=True)
    start_year = db.Column(db.String(20), nullable=False)
    end_year = db.Column(db.String(20), nullable=True, default="Present")
    display_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "institution": self.institution,
            "degree": self.degree,
            "field_of_study": self.field_of_study,
            "start_year": self.start_year,
            "end_year": self.end_year,
            "display_order": self.display_order
        }
