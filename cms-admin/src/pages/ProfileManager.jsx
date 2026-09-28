import React, { useState, useEffect } from "react";
import api, { API_BASE_URL } from "../api/client";
import { Upload, Check, AlertCircle, FileText, User } from "lucide-react";

export const ProfileManager = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    title: "",
    bio: "",
    avatar_url: "",
    resume_url: "",
    email: "",
    phone: "",
    location: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [notification, setNotification] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/profile");
        if (res.data.profile) {
          setFormData({
            full_name: res.data.profile.full_name || "",
            title: res.data.profile.title || "",
            bio: res.data.profile.bio || "",
            avatar_url: res.data.profile.avatar_url || "",
            resume_url: res.data.profile.resume_url || "",
            email: res.data.profile.email || "",
            phone: res.data.profile.phone || "",
            location: res.data.profile.location || "",
            github_url: res.data.profile.github_url || "",
            linkedin_url: res.data.profile.linkedin_url || "",
            twitter_url: res.data.profile.twitter_url || ""
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      setUploadingAvatar(true);
      const res = await api.post("/api/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData((prev) => ({
        ...prev,
        avatar_url: res.data.url
      }));
      setNotification({ type: "success", text: "Avatar uploaded successfully!" });
    } catch (err) {
      console.error("Avatar upload failed:", err);
      setNotification({ type: "error", text: "Failed to upload avatar" });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      setUploadingResume(true);
      const res = await api.post("/api/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData((prev) => ({
        ...prev,
        resume_url: res.data.url
      }));
      setNotification({ type: "success", text: "Resume document uploaded successfully!" });
    } catch (err) {
      console.error("Resume upload failed:", err);
      setNotification({ type: "error", text: "Failed to upload resume PDF" });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setNotification({ type: "", text: "" });

      await api.put("/api/profile", formData);
      setNotification({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      console.error("Save profile error:", err);
      setNotification({ type: "error", text: "Failed to save profile changes" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400 font-medium animate-pulse">
          Loading profile details...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Profile & Bio Manager</h2>
        <p className="text-sm text-slate-500 mt-1">
          Update your public profile, about section, social links, and downloadable resume.
        </p>
      </div>

      {notification.text && (
        <div
          className={`p-4 rounded-lg text-sm flex items-center space-x-2 ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        {/* Media Row: Avatar & Resume */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
          {/* Avatar Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Profile Photo / Avatar
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                {formData.avatar_url ? (
                  <img
                    src={`${API_BASE_URL}${formData.avatar_url}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <div>
                <label className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer shadow-sm">
                  <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  {uploadingAvatar ? "Uploading..." : "Upload New Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, or WEBP up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Resume Document (PDF)
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <label className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer shadow-sm">
                  <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  {uploadingResume ? "Uploading..." : "Upload PDF Resume"}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
                {formData.resume_url && (
                  <p className="text-xs text-emerald-600 mt-1 font-medium truncate max-w-xs">
                    File linked: {formData.resume_url}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. Alex Developer"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Job Title / Headline
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Full Stack Python & React Developer"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            About / Bio Description
          </label>
          <textarea
            name="bio"
            rows="4"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write a concise overview of your background, experience, and passions..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Contact Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@domain.com"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Phone (Optional)
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 555-0199"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="San Francisco, CA"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Social URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              LinkedIn URL
            </label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Twitter / X URL
            </label>
            <input
              type="url"
              name="twitter_url"
              value={formData.twitter_url}
              onChange={handleChange}
              placeholder="https://x.com/..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </div>
      </form>
    </div>
  );
};
