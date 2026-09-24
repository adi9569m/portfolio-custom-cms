from flask import Flask, jsonify
from app.config import Config
from app.extensions import db, jwt, cors, migrate

def create_app(config_class=Config):
    """Application factory for Flask CMS backend."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(
        app,
        origins=app.config.get("CORS_ORIGINS", ["*"]),
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    # Register blueprints
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp)

    # Health check route
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "message": "Portfolio Custom CMS API is running",
            "version": "1.0.0"
        }), 200

    # JWT Error handlers for consistent JSON API responses
    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return jsonify({
            "error": "Authorization header missing or invalid",
            "code": "token_missing"
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(callback):
        return jsonify({
            "error": "The token provided is invalid or malformed",
            "code": "token_invalid"
        }), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "error": "Token has expired. Please refresh your session",
            "code": "token_expired"
        }), 401

    # Create tables automatically in development
    with app.app_context():
        # Import models so SQLAlchemy discovers them
        from app.models.user import User  # noqa: F401
        db.create_all()

    return app
