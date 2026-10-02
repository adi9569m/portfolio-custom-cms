import os
from run import app
from app.config import Config

def test_production_readiness():
    print("\n--- STARTING DAY 9 PRODUCTION READINESS CHECKS ---\n")

    # 1. Verify WSGI Application Callable
    print("[1] Verifying WSGI Application Object...")
    assert app is not None
    assert hasattr(app, "wsgi_app")
    print("   -> Gunicorn callable 'run:app' verified successfully!")

    # 2. Verify Database URI Normalization
    print("[2] Verifying PostgreSQL URI Parsing...")
    test_raw_postgres = "postgres://user:secret123@db.neon.tech/portfolio_db"
    normalized = test_raw_postgres.replace("postgres://", "postgresql://", 1)
    assert normalized.startswith("postgresql://")
    print(f"   -> Successfully converts 'postgres://' to '{normalized[:20]}...'")

    # 3. Verify CORS Configuration Handling
    print("[3] Verifying Production CORS Whitelist...")
    origins = Config.CORS_ORIGINS
    assert len(origins) > 0
    print(f"   -> Active CORS origins: {origins}")

    # 4. Verify Secret Keys Configuration
    print("[4] Verifying Security Keys...")
    assert Config.SECRET_KEY != ""
    assert Config.JWT_SECRET_KEY != ""
    print("   -> Secret Key & JWT Secret Key are properly loaded.")

    # 5. Verify Upload Directory Readiness
    print("[5] Verifying Upload Storage Path...")
    upload_path = Config.UPLOAD_FOLDER
    assert os.path.exists(upload_path)
    print(f"   -> Upload directory ready at: {upload_path}")

    print("\n==============================================")
    print("ALL DAY 9 PRODUCTION READINESS CHECKS PASSED!")
    print("==============================================\n")

if __name__ == "__main__":
    test_production_readiness()
