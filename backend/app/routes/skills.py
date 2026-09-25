from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.skill import Skill

skills_bp = Blueprint("skills", __name__, url_prefix="/api/skills")


@skills_bp.route("", methods=["GET"])
def get_skills():
    """
    Public endpoint: Get all skills.
    Ordered by category and display order.
    """
    category_filter = request.args.get("category")
    query = Skill.query

    if category_filter:
        query = query.filter(Skill.category == category_filter)

    query = query.order_by(Skill.category.asc(), Skill.display_order.asc(), Skill.name.asc())
    skills = query.all()

    result = []
    for item in skills:
        result.append(item.to_dict())

    return jsonify({
        "count": len(result),
        "skills": result
    }), 200


@skills_bp.route("", methods=["POST"])
@jwt_required()
def create_skill():
    """
    Admin only: Add a new technical skill.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    name = data.get("name")
    if not name:
        return jsonify({"error": "Skill name is required"}), 400

    new_skill = Skill(
        name=name,
        category=data.get("category", "General"),
        proficiency=int(data.get("proficiency", 80)),
        icon=data.get("icon", ""),
        display_order=int(data.get("display_order", 0))
    )

    db.session.add(new_skill)
    db.session.commit()

    return jsonify({
        "message": "Skill created successfully",
        "skill": new_skill.to_dict()
    }), 201


@skills_bp.route("/<int:skill_id>", methods=["PUT"])
@jwt_required()
def update_skill(skill_id):
    """
    Admin only: Update an existing skill.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    skill = Skill.query.get(skill_id)
    if not skill:
        return jsonify({"error": "Skill not found"}), 404

    if "name" in data:
        skill.name = data["name"]

    if "category" in data:
        skill.category = data["category"]

    if "proficiency" in data:
        skill.proficiency = int(data["proficiency"])

    if "icon" in data:
        skill.icon = data["icon"]

    if "display_order" in data:
        skill.display_order = int(data["display_order"])

    db.session.commit()

    return jsonify({
        "message": "Skill updated successfully",
        "skill": skill.to_dict()
    }), 200


@skills_bp.route("/<int:skill_id>", methods=["DELETE"])
@jwt_required()
def delete_skill(skill_id):
    """
    Admin only: Delete a skill.
    """
    skill = Skill.query.get(skill_id)
    if not skill:
        return jsonify({"error": "Skill not found"}), 404

    db.session.delete(skill)
    db.session.commit()

    return jsonify({
        "message": f"Skill '{skill.name}' deleted successfully"
    }), 200
