from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.experience import Experience, Education

experience_bp = Blueprint("experience", __name__, url_prefix="/api")


# --- EXPERIENCE ENDPOINTS ---

@experience_bp.route("/experience", methods=["GET"])
def get_experience():
    """
    Public endpoint: Get all career experiences.
    Ordered by display order.
    """
    experiences = Experience.query.order_by(
        Experience.display_order.asc(),
        Experience.id.desc()
    ).all()

    result = []
    for item in experiences:
        result.append(item.to_dict())

    return jsonify({
        "count": len(result),
        "experience": result
    }), 200


@experience_bp.route("/experience", methods=["POST"])
@jwt_required()
def create_experience():
    """
    Admin only: Add a new job or role.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    company = data.get("company")
    position = data.get("position")
    start_date = data.get("start_date")

    if not company or not position or not start_date:
        return jsonify({"error": "Company, position, and start_date are required"}), 400

    new_exp = Experience(
        company=company,
        position=position,
        description=data.get("description", ""),
        start_date=start_date,
        end_date=data.get("end_date", "Present"),
        is_current=bool(data.get("is_current", False)),
        display_order=int(data.get("display_order", 0))
    )

    db.session.add(new_exp)
    db.session.commit()

    return jsonify({
        "message": "Experience added successfully",
        "experience": new_exp.to_dict()
    }), 201


@experience_bp.route("/experience/<int:exp_id>", methods=["PUT"])
@jwt_required()
def update_experience(exp_id):
    """
    Admin only: Update an existing job or role.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    exp = Experience.query.get(exp_id)
    if not exp:
        return jsonify({"error": "Experience not found"}), 404

    if "company" in data:
        exp.company = data["company"]

    if "position" in data:
        exp.position = data["position"]

    if "description" in data:
        exp.description = data["description"]

    if "start_date" in data:
        exp.start_date = data["start_date"]

    if "end_date" in data:
        exp.end_date = data["end_date"]

    if "is_current" in data:
        exp.is_current = bool(data["is_current"])

    if "display_order" in data:
        exp.display_order = int(data["display_order"])

    db.session.commit()

    return jsonify({
        "message": "Experience updated successfully",
        "experience": exp.to_dict()
    }), 200


@experience_bp.route("/experience/<int:exp_id>", methods=["DELETE"])
@jwt_required()
def delete_experience(exp_id):
    """
    Admin only: Delete an experience item.
    """
    exp = Experience.query.get(exp_id)
    if not exp:
        return jsonify({"error": "Experience not found"}), 404

    db.session.delete(exp)
    db.session.commit()

    return jsonify({
        "message": f"Experience at '{exp.company}' deleted successfully"
    }), 200


# --- EDUCATION ENDPOINTS ---

@experience_bp.route("/education", methods=["GET"])
def get_education():
    """
    Public endpoint: Get all academic degrees.
    """
    educations = Education.query.order_by(
        Education.display_order.asc(),
        Education.id.desc()
    ).all()

    result = []
    for item in educations:
        result.append(item.to_dict())

    return jsonify({
        "count": len(result),
        "education": result
    }), 200


@experience_bp.route("/education", methods=["POST"])
@jwt_required()
def create_education():
    """
    Admin only: Add a new educational qualification.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    institution = data.get("institution")
    degree = data.get("degree")
    start_year = data.get("start_year")

    if not institution or not degree or not start_year:
        return jsonify({"error": "Institution, degree, and start_year are required"}), 400

    new_edu = Education(
        institution=institution,
        degree=degree,
        field_of_study=data.get("field_of_study", ""),
        start_year=start_year,
        end_year=data.get("end_year", "Present"),
        display_order=int(data.get("display_order", 0))
    )

    db.session.add(new_edu)
    db.session.commit()

    return jsonify({
        "message": "Education added successfully",
        "education": new_edu.to_dict()
    }), 201


@experience_bp.route("/education/<int:edu_id>", methods=["PUT"])
@jwt_required()
def update_education(edu_id):
    """
    Admin only: Update an existing education entry.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    edu = Education.query.get(edu_id)
    if not edu:
        return jsonify({"error": "Education not found"}), 404

    if "institution" in data:
        edu.institution = data["institution"]

    if "degree" in data:
        edu.degree = data["degree"]

    if "field_of_study" in data:
        edu.field_of_study = data["field_of_study"]

    if "start_year" in data:
        edu.start_year = data["start_year"]

    if "end_year" in data:
        edu.end_year = data["end_year"]

    if "display_order" in data:
        edu.display_order = int(data["display_order"])

    db.session.commit()

    return jsonify({
        "message": "Education updated successfully",
        "education": edu.to_dict()
    }), 200


@experience_bp.route("/education/<int:edu_id>", methods=["DELETE"])
@jwt_required()
def delete_education(edu_id):
    """
    Admin only: Delete an education entry.
    """
    edu = Education.query.get(edu_id)
    if not edu:
        return jsonify({"error": "Education not found"}), 404

    db.session.delete(edu)
    db.session.commit()

    return jsonify({
        "message": f"Education from '{edu.institution}' deleted successfully"
    }), 200
