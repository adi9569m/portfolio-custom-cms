import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.message import Message

contact_bp = Blueprint("contact", __name__, url_prefix="/api/contact")


def send_email_notification(sender_name: str, sender_email: str, subject: str, content: str):
    """
    Helper function to send email notification to admin.
    If SMTP credentials are not set in .env, prints a clean notification to console.
    """
    mail_server = current_app.config.get("MAIL_SERVER")
    mail_username = current_app.config.get("MAIL_USERNAME")
    mail_password = current_app.config.get("MAIL_PASSWORD")
    recipient = current_app.config.get("NOTIFICATION_EMAIL")

    # If SMTP is not configured, log to console safely
    if not mail_server or not mail_username:
        print("[EMAIL NOTIFICATION] (SMTP not configured in .env - Logging message instead)")
        print(f"  From:    {sender_name} <{sender_email}>")
        print(f"  Subject: {subject}")
        print(f"  Message: {content}")
        return True

    # Real SMTP email dispatch
    try:
        mail_port = current_app.config.get("MAIL_PORT", 587)
        use_tls = current_app.config.get("MAIL_USE_TLS", True)

        msg = MIMEMultipart()
        msg["From"] = mail_username
        msg["To"] = recipient
        msg["Subject"] = f"[Portfolio Contact] {subject} (from {sender_name})"

        body_text = f"You received a new message from your portfolio contact form:\n\n"
        body_text += f"Name:    {sender_name}\n"
        body_text += f"Email:   {sender_email}\n"
        body_text += f"Subject: {subject}\n\n"
        body_text += f"Message:\n{content}\n"

        msg.attach(MIMEText(body_text, "plain"))

        server = smtplib.SMTP(mail_server, mail_port, timeout=10)
        if use_tls:
            server.starttls()
        server.login(mail_username, mail_password)
        server.sendmail(mail_username, recipient, msg.as_string())
        server.quit()
        return True
    except Exception as exc:
        print(f"[EMAIL ERROR] Failed to send email alert: {exc}")
        return False


@contact_bp.route("", methods=["POST"])
def submit_contact_form():
    """
    Public endpoint: Visitors send contact inquiries.
    Saves message to database and sends notification email.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    subject = data.get("subject", "General Inquiry").strip()
    content = data.get("message", "").strip()

    # Step-by-step validations
    if not name:
        return jsonify({"error": "Your name is required"}), 400

    if not email or "@" not in email or "." not in email:
        return jsonify({"error": "A valid email address is required"}), 400

    if not content:
        return jsonify({"error": "A message is required"}), 400

    # 1. Save message to database
    new_message = Message(
        name=name,
        email=email,
        subject=subject if subject else "General Inquiry",
        message=content,
        is_read=False
    )

    db.session.add(new_message)
    db.session.commit()

    # 2. Trigger notification
    send_email_notification(name, email, subject, content)

    return jsonify({
        "message": "Thank you! Your message has been sent successfully.",
        "id": new_message.id
    }), 201


@contact_bp.route("/messages", methods=["GET"])
@jwt_required()
def get_messages():
    """
    Admin only: View contact messages received from portfolio visitors.
    Supports optional query filter: ?unread=true
    """
    unread_only = request.args.get("unread", "").lower() in ["true", "1", "yes"]

    query = Message.query
    if unread_only:
        query = query.filter(Message.is_read == False)

    query = query.order_by(Message.created_at.desc())
    messages = query.all()

    result = []
    for item in messages:
        result.append(item.to_dict())

    return jsonify({
        "count": len(result),
        "messages": result
    }), 200


@contact_bp.route("/messages/<int:msg_id>/read", methods=["PUT"])
@jwt_required()
def mark_message_read(msg_id):
    """
    Admin only: Toggle or mark a message as read.
    """
    msg = Message.query.get(msg_id)
    if not msg:
        return jsonify({"error": "Message not found"}), 404

    data = request.get_json(silent=True) or {}
    new_status = data.get("is_read", True)
    msg.is_read = bool(new_status)

    db.session.commit()

    return jsonify({
        "message": "Message status updated",
        "message_item": msg.to_dict()
    }), 200


@contact_bp.route("/messages/<int:msg_id>", methods=["DELETE"])
@jwt_required()
def delete_message(msg_id):
    """
    Admin only: Delete a contact message from the inbox.
    """
    msg = Message.query.get(msg_id)
    if not msg:
        return jsonify({"error": "Message not found"}), 404

    db.session.delete(msg)
    db.session.commit()

    return jsonify({
        "message": "Message deleted successfully"
    }), 200
