from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.service import Service, Testimonial

services_bp = Blueprint("services", __name__, url_prefix="/api")


# --- SERVICES ENDPOINTS ---

@services_bp.route("/services", methods=["GET"])
def get_services():
    """
    Public endpoint: Get all offered services.
    """
    services = Service.query.order_by(Service.display_order.asc(), Service.id.asc()).all()

    result = []
    for item in services:
        result.append(item.to_dict())

    return jsonify({
        "count": len(result),
        "services": result
    }), 200


@services_bp.route("/services", methods=["POST"])
@jwt_required()
def create_service():
    """
    Admin only: Create a new service offering.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    title = data.get("title")
    description = data.get("description")

    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400

    new_service = Service(
        title=title,
        description=description,
        icon=data.get("icon", ""),
        display_order=int(data.get("display_order", 0))
    )

    db.session.add(new_service)
    db.session.commit()

    return jsonify({
        "message": "Service created successfully",
        "service": new_service.to_dict()
    }), 201


@services_bp.route("/services/<int:service_id>", methods=["PUT"])
@jwt_required()
def update_service(service_id):
    """
    Admin only: Update an existing service.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    service = Service.query.get(service_id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    if "title" in data:
        service.title = data["title"]

    if "description" in data:
        service.description = data["description"]

    if "icon" in data:
        service.icon = data["icon"]

    if "display_order" in data:
        service.display_order = int(data["display_order"])

    db.session.commit()

    return jsonify({
        "message": "Service updated successfully",
        "service": service.to_dict()
    }), 200


@services_bp.route("/services/<int:service_id>", methods=["DELETE"])
@jwt_required()
def delete_service(service_id):
    """
    Admin only: Delete a service.
    """
    service = Service.query.get(service_id)
    if not service:
        return jsonify({"error": "Service not found"}), 404

    db.session.delete(service)
    db.session.commit()

    return jsonify({
        "message": f"Service '{service.title}' deleted successfully"
    }), 200


# --- TESTIMONIALS ENDPOINTS ---

@services_bp.route("/testimonials", methods=["GET"])
def get_testimonials():
    """
    Public endpoint: Get all client testimonials and reviews.
    """
    testimonials = Testimonial.query.order_by(
        Testimonial.display_order.asc(),
        Testimonial.id.desc()
    ).all()

    result = []
    for item in testimonials:
        result.append(item.to_dict())

    return jsonify({
        "count": len(result),
        "testimonials": result
    }), 200


@services_bp.route("/testimonials", methods=["POST"])
@jwt_required()
def create_testimonial():
    """
    Admin only: Add a new client testimonial.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    client_name = data.get("client_name")
    feedback = data.get("feedback")

    if not client_name or not feedback:
        return jsonify({"error": "Client name and feedback are required"}), 400

    new_testimonial = Testimonial(
        client_name=client_name,
        client_role=data.get("client_role", ""),
        company=data.get("company", ""),
        feedback=feedback,
        avatar_url=data.get("avatar_url", ""),
        display_order=int(data.get("display_order", 0))
    )

    db.session.add(new_testimonial)
    db.session.commit()

    return jsonify({
        "message": "Testimonial added successfully",
        "testimonial": new_testimonial.to_dict()
    }), 201


@services_bp.route("/testimonials/<int:test_id>", methods=["PUT"])
@jwt_required()
def update_testimonial(test_id):
    """
    Admin only: Update a client testimonial.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    test = Testimonial.query.get(test_id)
    if not test:
        return jsonify({"error": "Testimonial not found"}), 404

    if "client_name" in data:
        test.client_name = data["client_name"]

    if "client_role" in data:
        test.client_role = data["client_role"]

    if "company" in data:
        test.company = data["company"]

    if "feedback" in data:
        test.feedback = data["feedback"]

    if "avatar_url" in data:
        test.avatar_url = data["avatar_url"]

    if "display_order" in data:
        test.display_order = int(data["display_order"])

    db.session.commit()

    return jsonify({
        "message": "Testimonial updated successfully",
        "testimonial": test.to_dict()
    }), 200


@services_bp.route("/testimonials/<int:test_id>", methods=["DELETE"])
@jwt_required()
def delete_testimonial(test_id):
    """
    Admin only: Delete a testimonial.
    """
    test = Testimonial.query.get(test_id)
    if not test:
        return jsonify({"error": "Testimonial not found"}), 404

    db.session.delete(test)
    db.session.commit()

    return jsonify({
        "message": f"Testimonial from '{test.client_name}' deleted successfully"
    }), 200
