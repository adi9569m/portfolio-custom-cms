import os
from app import create_app
from app.extensions import db
from app.models.user import User

app = create_app()

def seed_admin():
    """Create default admin user if one doesn't already exist."""
    with app.app_context():
        username = os.getenv("ADMIN_USERNAME", "admin")
        email = os.getenv("ADMIN_EMAIL", "admin@portfolio.com")
        password = os.getenv("ADMIN_PASSWORD", "adminpassword123")

        existing_user = User.query.filter(
            (User.username == username) | (User.email == email)
        ).first()

        if existing_user:
            print(f"[INFO] Admin user '{existing_user.username}' ({existing_user.email}) already exists.")
            return

        admin = User(
            username=username,
            email=email,
            is_admin=True
        )
        admin.set_password(password)

        db.session.add(admin)
        db.session.commit()

        print("[SUCCESS] Superuser / Admin successfully created!")
        print("---------------------------------------------")
        print(f"  Username: {username}")
        print(f"  Email:    {email}")
        print(f"  Password: {password}")
        print("---------------------------------------------")
        print("[NOTE] Remember to change the password in production (.env)!")

if __name__ == "__main__":
    seed_admin()
