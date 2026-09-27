import os
import uuid
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename

upload_bp = Blueprint("upload", __name__)


def is_allowed_file(filename: str) -> bool:
    """Check if the uploaded file has a permitted extension."""
    if "." not in filename:
        return False

    parts = filename.rsplit(".", 1)
    extension = parts[1].lower()
    allowed = current_app.config.get("ALLOWED_EXTENSIONS", set())
    return extension in allowed


@upload_bp.route("/api/upload", methods=["POST"])
@jwt_required()
def upload_file():
    """
    Admin only: Upload an image or document (PDF resume, screenshots).
    Expects multipart/form-data with key 'file'.
    Returns public URL to access the saved file.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file field found in request"}), 400

    uploaded_file = request.files["file"]

    if uploaded_file.filename == "":
        return jsonify({"error": "No file selected for upload"}), 400

    if not is_allowed_file(uploaded_file.filename):
        allowed_list = list(current_app.config.get("ALLOWED_EXTENSIONS", []))
        return jsonify({
            "error": "File type not supported",
            "allowed_extensions": allowed_list
        }), 400

    # Ensure upload folder exists
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)

    # Create safe unique filename to avoid overwriting existing files
    clean_name = secure_filename(uploaded_file.filename)
    unique_prefix = uuid.uuid4().hex[:8]
    safe_filename = f"{unique_prefix}_{clean_name}"
    save_path = os.path.join(upload_folder, safe_filename)

    # Save to disk
    uploaded_file.save(save_path)

    # Calculate file size in bytes
    file_size = os.path.getsize(save_path)

    # Publicly accessible URL path
    public_url = f"/uploads/{safe_filename}"

    return jsonify({
        "message": "File uploaded successfully",
        "url": public_url,
        "filename": safe_filename,
        "original_name": uploaded_file.filename,
        "size_bytes": file_size
    }), 201


@upload_bp.route("/uploads/<filename>", methods=["GET"])
def serve_uploaded_file(filename):
    """
    Public route: Serve uploaded images and documents.
    """
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    return send_from_directory(upload_folder, filename)
