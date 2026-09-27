import io
from app import create_app

def test_day3_media_and_contact():
    app = create_app()
    client = app.test_client()

    print("\n--- STARTING DAY 3 TESTS ---\n")

    # 1. Login to get Admin JWT Token
    print("[1] Logging in as Admin...")
    login_res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "adminpassword123"
    })
    assert login_res.status_code == 200, f"Login failed: {login_res.get_json()}"
    token = login_res.get_json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("   -> Logged in successfully!")

    # 2. Test Media Upload - Security & Validations
    print("[2] Testing Media Upload Security & Rejections...")
    
    # 2a. Without Auth
    unauth_upload = client.post("/api/upload")
    assert unauth_upload.status_code == 401, "Upload permitted without JWT token!"
    print("   -> Unauthenticated upload rejected (401)")

    # 2b. Missing file field
    empty_upload = client.post("/api/upload", data={}, headers=headers)
    assert empty_upload.status_code == 400, "Accepted request without file!"
    print("   -> Empty file request rejected (400)")

    # 2c. Disallowed extension (.exe)
    fake_exe = (io.BytesIO(b"binary content"), "virus.exe")
    bad_ext_res = client.post(
        "/api/upload",
        data={"file": fake_exe},
        content_type="multipart/form-data",
        headers=headers
    )
    assert bad_ext_res.status_code == 400, "Dangerous file extension was not rejected!"
    print("   -> Disallowed file extension (.exe) rejected (400)")

    # 3. Test Media Upload - Image & PDF
    print("[3] Testing Valid File Uploads (Image and PDF)...")

    # 3a. Upload sample project screenshot (.png)
    fake_png = (io.BytesIO(b"\x89PNG\r\n\x1a\nfake-image-bytes"), "project_screenshot.png")
    upload_img_res = client.post(
        "/api/upload",
        data={"file": fake_png},
        content_type="multipart/form-data",
        headers=headers
    )
    assert upload_img_res.status_code == 201, f"Failed image upload: {upload_img_res.get_json()}"
    img_data = upload_img_res.get_json()
    assert "url" in img_data
    assert img_data["url"].startswith("/uploads/")
    print(f"   -> Image uploaded successfully: {img_data['url']}")

    # 3b. Serve uploaded image statically
    fetch_img_res = client.get(img_data["url"])
    assert fetch_img_res.status_code == 200
    assert b"fake-image-bytes" in fetch_img_res.data
    print("   -> Static serving of uploaded file verified (200)")

    # 3c. Upload sample resume (.pdf)
    fake_pdf = (io.BytesIO(b"%PDF-1.4 sample resume content"), "my_resume.pdf")
    upload_pdf_res = client.post(
        "/api/upload",
        data={"file": fake_pdf},
        content_type="multipart/form-data",
        headers=headers
    )
    assert upload_pdf_res.status_code == 201
    pdf_data = upload_pdf_res.get_json()
    assert pdf_data["url"].endswith(".pdf")
    print(f"   -> Resume PDF uploaded successfully: {pdf_data['url']}")

    # 4. Test Public Contact Form Submission
    print("[4] Testing Public Contact Form API...")

    # 4a. Invalid email validation
    bad_email_res = client.post("/api/contact", json={
        "name": "Visitor",
        "email": "invalid-email-string",
        "message": "Hello!"
    })
    assert bad_email_res.status_code == 400
    print("   -> Invalid email address rejected (400)")

    # 4b. Valid submission
    contact_res = client.post("/api/contact", json={
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "subject": "Freelance Opportunity",
        "message": "Hi, we love your portfolio and would like to discuss a project."
    })
    assert contact_res.status_code == 201
    contact_data = contact_res.get_json()
    message_id = contact_data["id"]
    print(f"   -> Contact message submitted successfully (Message ID: {message_id})")

    # 5. Test Admin Contact Inbox
    print("[5] Testing Admin Contact Inbox & Management...")

    # 5a. Admin retrieves message list
    get_msgs_res = client.get("/api/contact/messages", headers=headers)
    assert get_msgs_res.status_code == 200
    msgs = get_msgs_res.get_json()["messages"]
    found_msg = next((m for m in msgs if m["id"] == message_id), None)
    assert found_msg is not None, "Submitted contact message not in admin inbox!"
    assert found_msg["is_read"] is False
    print("   -> Admin successfully retrieved submitted message from inbox")

    # 5b. Admin marks message as read
    read_res = client.put(f"/api/contact/messages/{message_id}/read", json={"is_read": True}, headers=headers)
    assert read_res.status_code == 200
    assert read_res.get_json()["message_item"]["is_read"] is True
    print("   -> Admin marked message as read (is_read=True)")

    # 5c. Admin deletes message
    del_res = client.delete(f"/api/contact/messages/{message_id}", headers=headers)
    assert del_res.status_code == 200
    print("   -> Admin deleted message from inbox")

    # Verify message is gone
    get_after_del = client.get("/api/contact/messages", headers=headers)
    assert not any(m["id"] == message_id for m in get_after_del.get_json()["messages"])
    print("   -> Verified message was permanently removed")

    print("\n==============================================")
    print("ALL DAY 3 MEDIA & CONTACT TESTS PASSED 100%!")
    print("==============================================\n")

if __name__ == "__main__":
    test_day3_media_and_contact()
