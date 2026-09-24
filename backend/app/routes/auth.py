from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from app.models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticate admin user and issue JWT access + refresh tokens.
    Accepts: { "username" or "email", "password" }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    identifier = data.get("username") or data.get("email")
    password = data.get("password")

    if not identifier or not password:
        return jsonify({"error": "Username/email and password are required"}), 400

    # Search by username or email
    user = User.query.filter(
        (User.username == identifier) | (User.email == identifier)
    ).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    if not user.is_admin:
        return jsonify({"error": "Unauthorized access: Admin rights required"}), 403

    # Generate tokens
    identity = str(user.id)
    additional_claims = {
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
    }

    access_token = create_access_token(
        identity=identity,
        additional_claims=additional_claims
    )
    refresh_token = create_refresh_token(identity=identity)

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict()
    }), 200


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """
    Generate a new access token using a valid refresh token.
    Must send 'Authorization: Bearer <refresh_token>' in header.
    """
    identity = get_jwt_identity()
    user = db_user = User.query.get(int(identity))

    if not user or not user.is_admin:
        return jsonify({"error": "Invalid or revoked admin account"}), 401

    additional_claims = {
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin,
    }

    new_access_token = create_access_token(
        identity=identity,
        additional_claims=additional_claims
    )

    return jsonify({
        "access_token": new_access_token
    }), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    """
    Return currently authenticated admin user details.
    Must send 'Authorization: Bearer <access_token>' in header.
    """
    identity = get_jwt_identity()
    user = User.query.get(int(identity))

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user": user.to_dict()
    }), 200
