from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.blog import Blog, slugify

blogs_bp = Blueprint("blogs", __name__, url_prefix="/api/blogs")


@blogs_bp.route("", methods=["GET"])
@jwt_required(optional=True)
def get_blogs():
    """
    Get all blog articles.
    - Visitors: Only see status='published'.
    - Admin: Can request ?status=all or ?status=draft.
    """
    admin_id = get_jwt_identity()
    status_filter = request.args.get("status", "published")

    query = Blog.query

    if admin_id is not None:
        if status_filter != "all":
            query = query.filter(Blog.status == status_filter)
    else:
        query = query.filter(Blog.status == "published")

    query = query.order_by(Blog.created_at.desc())
    blogs = query.all()

    result = []
    for item in blogs:
        result.append(item.to_dict())

    return jsonify({
        "count": len(result),
        "blogs": result
    }), 200


@blogs_bp.route("/<identifier>", methods=["GET"])
@jwt_required(optional=True)
def get_blog(identifier):
    """
    Get a single blog post by its slug or numeric ID.
    Draft posts are only accessible to an authenticated admin.
    """
    admin_id = get_jwt_identity()

    if identifier.isdigit():
        blog = Blog.query.get(int(identifier))
    else:
        blog = Blog.query.filter(Blog.slug == identifier).first()

    if not blog:
        return jsonify({"error": "Blog post not found"}), 404

    # Security check for drafts
    if blog.status == "draft" and admin_id is None:
        return jsonify({"error": "Blog post not found"}), 404

    return jsonify({
        "blog": blog.to_dict()
    }), 200


@blogs_bp.route("", methods=["POST"])
@jwt_required()
def create_blog():
    """
    Admin only: Create a new blog post.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    title = data.get("title")
    content = data.get("content")

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    # Generate slug from title or use custom provided slug
    custom_slug = data.get("slug")
    if custom_slug:
        slug = slugify(custom_slug)
    else:
        slug = slugify(title)

    # Ensure unique slug
    existing = Blog.query.filter(Blog.slug == slug).first()
    if existing:
        slug = f"{slug}-{int(Blog.query.count()) + 1}"

    new_blog = Blog(
        title=title,
        slug=slug,
        summary=data.get("summary", ""),
        content=content,
        cover_image=data.get("cover_image", ""),
        status=data.get("status", "draft")
    )

    db.session.add(new_blog)
    db.session.commit()

    return jsonify({
        "message": "Blog post created successfully",
        "blog": new_blog.to_dict()
    }), 201


@blogs_bp.route("/<int:blog_id>", methods=["PUT"])
@jwt_required()
def update_blog(blog_id):
    """
    Admin only: Update an existing blog post.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    blog = Blog.query.get(blog_id)
    if not blog:
        return jsonify({"error": "Blog post not found"}), 404

    if "title" in data:
        blog.title = data["title"]

    if "slug" in data:
        blog.slug = slugify(data["slug"])

    if "summary" in data:
        blog.summary = data["summary"]

    if "content" in data:
        blog.content = data["content"]

    if "cover_image" in data:
        blog.cover_image = data["cover_image"]

    if "status" in data:
        blog.status = data["status"]

    db.session.commit()

    return jsonify({
        "message": "Blog post updated successfully",
        "blog": blog.to_dict()
    }), 200


@blogs_bp.route("/<int:blog_id>", methods=["DELETE"])
@jwt_required()
def delete_blog(blog_id):
    """
    Admin only: Delete a blog post.
    """
    blog = Blog.query.get(blog_id)
    if not blog:
        return jsonify({"error": "Blog post not found"}), 404

    db.session.delete(blog)
    db.session.commit()

    return jsonify({
        "message": f"Blog post '{blog.title}' deleted successfully"
    }), 200
