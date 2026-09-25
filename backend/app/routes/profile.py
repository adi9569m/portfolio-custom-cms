from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.profile import Profile

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")


@profile_bp.route("", methods=["GET"])
def get_profile():
    """
    Public endpoint: Get the developer's profile information.
    Returns the first profile row or default structure.
    """
    profile = Profile.query.first()
    if not profile:
        return jsonify({
            "message": "No profile found",
            "profile": None
        }), 200

    return jsonify({
        "profile": profile.to_dict()
    }), 200


@profile_bp.route("", methods=["PUT"])
@jwt_required()
def update_profile():
    """
    Admin only: Create or update the developer's profile.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    profile = Profile.query.first()
    if not profile:
        profile = Profile()
        db.session.add(profile)

    # Simple step-by-step field updates
    if "full_name" in data:
        profile.full_name = data["full_name"]

    if "title" in data:
        profile.title = data["title"]

    if "bio" in data:
        profile.bio = data["bio"]

    if "avatar_url" in data:
        profile.avatar_url = data["avatar_url"]

    if "resume_url" in data:
        profile.resume_url = data["resume_url"]

    if "email" in data:
        profile.email = data["email"]

    if "phone" in data:
        profile.phone = data["phone"]

    if "location" in data:
        profile.location = data["location"]

    if "github_url" in data:
        profile.github_url = data["github_url"]

    if "linkedin_url" in data:
        profile.linkedin_url = data["linkedin_url"]

    if "twitter_url" in data:
        profile.twitter_url = data["twitter_url"]

    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully",
        "profile": profile.to_dict()
    }), 200
