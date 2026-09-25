from app import create_app
from app.extensions import db
from app.models.user import User

def test_day2_crud():
    app = create_app()
    client = app.test_client()

    print("\n--- STARTING DAY 2 TESTS ---\n")

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

    # 2. Test Profile (GET & PUT)
    print("[2] Testing Profile Endpoints...")
    put_profile = client.put("/api/profile", json={
        "full_name": "Alex Developer",
        "title": "Senior Full Stack Engineer",
        "bio": "Building scalable web apps and custom CMS architectures.",
        "location": "San Francisco, CA",
        "github_url": "https://github.com/developer"
    }, headers=headers)
    assert put_profile.status_code == 200, "Failed to update profile"
    get_profile = client.get("/api/profile")
    assert get_profile.status_code == 200
    assert get_profile.get_json()["profile"]["full_name"] == "Alex Developer"
    print("   -> Profile GET & PUT working perfectly!")

    # 3. Test Draft vs Published Projects
    print("[3] Testing Project Draft vs Published Flow...")
    # Create draft project
    create_draft = client.post("/api/projects", json={
        "title": "AI Image Studio",
        "description": "A generative AI platform built with React and Python.",
        "status": "draft",
        "featured": True
    }, headers=headers)
    assert create_draft.status_code == 201, "Failed to create draft project"
    project_id = create_draft.get_json()["project"]["id"]

    # Public visitor check: should NOT see the draft project
    public_projects = client.get("/api/projects")
    assert public_projects.status_code == 200
    for p in public_projects.get_json()["projects"]:
        assert p["id"] != project_id, "Draft project leaked to public visitor!"
    print("   -> Public visitor cannot see draft project (PASSED)")

    # Admin check: should see draft project when requesting all
    admin_projects = client.get("/api/projects?status=all", headers=headers)
    assert admin_projects.status_code == 200
    found_draft = any(p["id"] == project_id for p in admin_projects.get_json()["projects"])
    assert found_draft, "Admin could not retrieve draft project"
    print("   -> Admin can see draft project (PASSED)")

    # Publish the project
    publish_res = client.put(f"/api/projects/{project_id}", json={
        "status": "published"
    }, headers=headers)
    assert publish_res.status_code == 200
    assert publish_res.get_json()["project"]["status"] == "published"

    # Public visitor check again: should NOW see the project
    public_projects_now = client.get("/api/projects")
    found_published = any(p["id"] == project_id for p in public_projects_now.get_json()["projects"])
    assert found_published, "Published project not visible to public visitor!"
    print("   -> Published project is now visible to public (PASSED)")

    # 4. Test Skills
    print("[4] Testing Skills CRUD...")
    add_skill = client.post("/api/skills", json={
        "name": "Python",
        "category": "Backend",
        "proficiency": 95
    }, headers=headers)
    assert add_skill.status_code == 201
    skill_id = add_skill.get_json()["skill"]["id"]

    get_skills = client.get("/api/skills")
    assert get_skills.status_code == 200
    assert any(s["id"] == skill_id for s in get_skills.get_json()["skills"])
    print("   -> Skills CRUD working properly!")

    # 5. Test Experience & Education
    print("[5] Testing Experience & Education Endpoints...")
    add_exp = client.post("/api/experience", json={
        "company": "Tech Corp",
        "position": "Software Engineer",
        "start_date": "Jan 2023",
        "end_date": "Present",
        "is_current": True
    }, headers=headers)
    assert add_exp.status_code == 201

    add_edu = client.post("/api/education", json={
        "institution": "University of Technology",
        "degree": "B.S. in Computer Science",
        "start_year": "2019",
        "end_year": "2023"
    }, headers=headers)
    assert add_edu.status_code == 201
    print("   -> Experience & Education added and working!")

    # 6. Test Services & Testimonials
    print("[6] Testing Services & Testimonials...")
    add_service = client.post("/api/services", json={
        "title": "API Development",
        "description": "High performance REST APIs with Flask and PostgreSQL"
    }, headers=headers)
    assert add_service.status_code == 201

    add_test = client.post("/api/testimonials", json={
        "client_name": "Sarah Connor",
        "feedback": "Outstanding work delivered on time!"
    }, headers=headers)
    assert add_test.status_code == 201
    print("   -> Services & Testimonials working!")

    # 7. Test Blog with Auto-Slug
    print("[7] Testing Blog Post & Slug Generation...")
    add_blog = client.post("/api/blogs", json={
        "title": "Building a Headless CMS from Scratch",
        "summary": "Step by step architecture guide.",
        "content": "In this article we will build a headless CMS...",
        "status": "published"
    }, headers=headers)
    assert add_blog.status_code == 201
    blog_data = add_blog.get_json()["blog"]
    assert blog_data["slug"] == "building-a-headless-cms-from-scratch"

    get_blog = client.get(f"/api/blogs/{blog_data['slug']}")
    assert get_blog.status_code == 200
    assert get_blog.get_json()["blog"]["title"] == "Building a Headless CMS from Scratch"
    print("   -> Blog creation & auto-slug generation working!")

    print("\n==============================================")
    print("ALL DAY 2 CRUD & DRAFT/PUBLISH TESTS PASSED 100%!")
    print("==============================================\n")

if __name__ == "__main__":
    test_day2_crud()
