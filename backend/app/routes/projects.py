from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.project import Project

projects_bp = Blueprint("projects", __name__, url_prefix="/api/projects")


@projects_bp.route("", methods=["GET"])
@jwt_required(optional=True)
def get_projects():
    """
    Get list of projects.
    - Visitors: Only see status='published'.
    - Admin: Can request ?status=all or ?status=draft or ?status=published.
    - Optional filter: ?featured=true
    """
    admin_id = get_jwt_identity()
    status_filter = request.args.get("status", "published")
    featured_filter = request.args.get("featured")

    query = Project.query

    # Security check for draft items
    if admin_id is not None:
        # Admin is logged in, respect requested status
        if status_filter != "all":
            query = query.filter(Project.status == status_filter)
    else:
        # Public visitor is browsing, strictly show only published projects
        query = query.filter(Project.status == "published")

    # Optional featured filter (for homepage highlights)
    if featured_filter is not None:
        is_featured = featured_filter.lower() in ["true", "1", "yes"]
        query = query.filter(Project.featured == is_featured)

    # Order projects
    query = query.order_by(Project.display_order.asc(), Project.created_at.desc())
    projects = query.all()

    result = []
    for item in projects:
        result.append(item.to_dict())

    return jsonify({
        "count": len(result),
        "projects": result
    }), 200


@projects_bp.route("/<int:project_id>", methods=["GET"])
@jwt_required(optional=True)
def get_project_by_id(project_id):
    """
    Get a single project by its ID.
    Draft projects can only be viewed by an authenticated admin.
    """
    admin_id = get_jwt_identity()
    project = Project.query.get(project_id)

    if not project:
        return jsonify({"error": "Project not found"}), 404

    # If it is a draft and user is not an admin, hide it
    if project.status == "draft" and admin_id is None:
        return jsonify({"error": "Project not found"}), 404

    return jsonify({
        "project": project.to_dict()
    }), 200


@projects_bp.route("", methods=["POST"])
@jwt_required()
def create_project():
    """
    Admin only: Create a new project.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    title = data.get("title")
    description = data.get("description")

    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400

    new_project = Project(
        title=title,
        description=description,
        image_url=data.get("image_url", ""),
        github_url=data.get("github_url", ""),
        live_url=data.get("live_url", ""),
        tags=data.get("tags", ""),
        featured=bool(data.get("featured", False)),
        status=data.get("status", "draft"),
        display_order=int(data.get("display_order", 0))
    )

    db.session.add(new_project)
    db.session.commit()

    return jsonify({
        "message": "Project created successfully",
        "project": new_project.to_dict()
    }), 201


@projects_bp.route("/<int:project_id>", methods=["PUT"])
@jwt_required()
def update_project(project_id):
    """
    Admin only: Update an existing project.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    if "title" in data:
        project.title = data["title"]

    if "description" in data:
        project.description = data["description"]

    if "image_url" in data:
        project.image_url = data["image_url"]

    if "github_url" in data:
        project.github_url = data["github_url"]

    if "live_url" in data:
        project.live_url = data["live_url"]

    if "tags" in data:
        project.tags = data["tags"]

    if "featured" in data:
        project.featured = bool(data["featured"])

    if "status" in data:
        project.status = data["status"]

    if "display_order" in data:
        project.display_order = int(data["display_order"])

    db.session.commit()

    return jsonify({
        "message": "Project updated successfully",
        "project": project.to_dict()
    }), 200


@projects_bp.route("/<int:project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id):
    """
    Admin only: Delete a project.
    """
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    db.session.delete(project)
    db.session.commit()

    return jsonify({
        "message": f"Project '{project.title}' deleted successfully"
    }), 200
