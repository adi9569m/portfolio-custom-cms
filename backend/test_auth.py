from app import create_app
from app.models.user import User

def test_full_auth_flow():
    app = create_app()
    client = app.test_client()

    print("[TEST] 1. Testing Health Check...")
    res = client.get("/api/health")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    print("   -> Health check PASSED: ", res.get_json())

    print("[TEST] 2. Testing Login with Invalid Credentials...")
    bad_login = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "wrongpassword"
    })
    assert bad_login.status_code == 401, f"Expected 401, got {bad_login.status_code}"
    print("   -> Invalid login rejected properly (401)")

    print("[TEST] 3. Testing Login with Valid Credentials...")
    login_res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "adminpassword123"
    })
    assert login_res.status_code == 200, f"Expected 200, got {login_res.status_code}"
    data = login_res.get_json()
    assert "access_token" in data
    assert "refresh_token" in data
    access_token = data["access_token"]
    refresh_token = data["refresh_token"]
    print("   -> Valid login PASSED: Received JWT access & refresh tokens")

    print("[TEST] 4. Testing Protected Route (/api/auth/me) Without Token...")
    no_auth_res = client.get("/api/auth/me")
    assert no_auth_res.status_code == 401, f"Expected 401, got {no_auth_res.status_code}"
    print("   -> Missing token rejected properly (401):", no_auth_res.get_json())

    print("[TEST] 5. Testing Protected Route (/api/auth/me) With Valid Bearer Token...")
    auth_res = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert auth_res.status_code == 200, f"Expected 200, got {auth_res.status_code}"
    user_info = auth_res.get_json()
    assert user_info["user"]["username"] == "admin"
    print("   -> Protected /me access PASSED:", user_info)

    print("[TEST] 6. Testing Token Refresh (/api/auth/refresh)...")
    refresh_res = client.post(
        "/api/auth/refresh",
        headers={"Authorization": f"Bearer {refresh_token}"}
    )
    assert refresh_res.status_code == 200, f"Expected 200, got {refresh_res.status_code}"
    new_token_data = refresh_res.get_json()
    assert "access_token" in new_token_data
    print("   -> Token refresh PASSED: Received new access token")

    print("\n==============================================")
    print("ALL DAY 1 AUTHENTICATION TESTS PASSED 100%!")
    print("==============================================")

if __name__ == "__main__":
    test_full_auth_flow()
