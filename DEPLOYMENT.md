# 🚀 Complete Cloud Deployment Guide (Day 9)

This guide walks you through deploying your full-stack system completely free using **Neon (PostgreSQL)**, **Render (Backend API)**, and **Vercel (Public Portfolio & CMS Admin)**.

---

## 🏗️ Architecture Overview

```mermaid
flowchart TD
    DB[("1. Neon PostgreSQL<br/>(Cloud Database)")]
    API["2. Render<br/>(Flask API Backend)"]
    PORTAL["3. Vercel<br/>(Public Portfolio)"]
    CMS["4. Vercel<br/>(CMS Admin Panel)"]

    API --> DB
    PORTAL --> API
    CMS --> API
```

---

## Step 1: Create Free PostgreSQL Database on Neon

1. Go to [neon.tech](https://neon.tech) and create a free account.
2. Click **Create Project** (Name: `portfolio-cms`).
3. Under **Connection Details**, copy your **Connection String**:
   ```
   postgresql://alex_owner:password@ep-cool-cloud.us-east-2.aws.neon.tech/portfolio-cms?sslmode=require
   ```
*(Keep this URL handy for Step 2!)*

---

## Step 2: Deploy Backend API to Render

1. Go to [render.com](https://render.com) and create an account.
2. Click **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub repository: `adi9569m/portfolio-custom-cms`.
4. Configure the settings:
   * **Name**: `portfolio-cms-api`
   * **Root Directory**: `backend`
   * **Environment**: `Python 3`
   * **Build Command**: `pip install -r requirements.txt && python seed.py`
   * **Start Command**: `gunicorn run:app --workers 2 --bind 0.0.0.0:$PORT`
5. Click **Environment Variables** and add:
   * `DATABASE_URL`: *(Your Neon PostgreSQL connection string from Step 1)*
   * `SECRET_KEY`: *(Any long random string)*
   * `JWT_SECRET_KEY`: *(Any long random string)*
   * `CORS_ORIGINS`: `*` *(or your Vercel URLs once created)*
   * `ADMIN_USERNAME`: `admin`
   * `ADMIN_PASSWORD`: `YourStrongPassword123`
   * `ADMIN_EMAIL`: `admin@portfolio.com`
6. Click **Deploy Web Service**.
7. Once deployed, copy your live backend URL (e.g., `https://portfolio-cms-api.onrender.com`).

---

## Step 3: Deploy Public Portfolio to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** $\rightarrow$ **Project**.
3. Select `portfolio-custom-cms`.
4. In the configuration window:
   * **Project Name**: `my-portfolio`
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click *Edit* and select **`frontend`**
5. Expand **Environment Variables**:
   * Key: `VITE_API_URL`
   * Value: `https://portfolio-cms-api.onrender.com` *(Your Render URL from Step 2)*
6. Click **Deploy**.
7. Your public portfolio is now live! (e.g., `https://my-portfolio.vercel.app`).

---

## Step 4: Deploy CMS Admin Panel to Vercel

1. On Vercel, click **Add New...** $\rightarrow$ **Project** again.
2. Select the same repository `portfolio-custom-cms`.
3. In the configuration window:
   * **Project Name**: `my-portfolio-cms`
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click *Edit* and select **`cms-admin`**
4. Expand **Environment Variables**:
   * Key: `VITE_API_URL`
   * Value: `https://portfolio-cms-api.onrender.com` *(Your Render URL from Step 2)*
5. Click **Deploy**.
6. Your custom CMS dashboard is now live! (e.g., `https://my-portfolio-cms.vercel.app`).

---

## Step 5: Secure CORS on Render (Final Polish)

Once both Vercel apps are deployed:
1. Open Render dashboard $\rightarrow$ Your API service $\rightarrow$ **Environment**.
2. Change `CORS_ORIGINS` to:
   ```
   https://my-portfolio.vercel.app,https://my-portfolio-cms.vercel.app
   ```
3. Click **Save Changes**.

---

### 🎉 All 3 Services Are Now Connected Live on the Cloud!
