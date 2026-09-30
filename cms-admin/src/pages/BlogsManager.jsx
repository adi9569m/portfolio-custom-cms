import React, { useState, useEffect } from "react";
import api, { API_BASE_URL } from "../api/client";
import { Plus, Edit2, Trash2, Check, AlertCircle, X, Upload, BookOpen, ExternalLink } from "lucide-react";

export const BlogsManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [notification, setNotification] = useState({ type: "", text: "" });
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialForm = {
    title: "",
    slug: "",
    summary: "",
    content: "",
    cover_image: "",
    status: "draft"
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/blogs?status=all");
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error("Failed to load blog posts:", err);
      setNotification({ type: "error", text: "Failed to load articles." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      summary: blog.summary || "",
      content: blog.content || "",
      cover_image: blog.cover_image || "",
      status: blog.status || "draft"
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBlog(null);
    setFormData(initialForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    try {
      setUploadingImage(true);
      const res = await api.post("/api/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData((prev) => ({
        ...prev,
        cover_image: res.data.url
      }));
    } catch (err) {
      console.error("Cover image upload failed:", err);
      alert("Failed to upload blog cover image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await api.put(`/api/blogs/${editingBlog.id}`, formData);
        setNotification({ type: "success", text: "Article updated successfully!" });
      } else {
        await api.post("/api/blogs", formData);
        setNotification({ type: "success", text: "New article published/drafted!" });
      }
      closeModal();
      fetchBlogs();
    } catch (err) {
      console.error("Save blog error:", err);
      setNotification({ type: "error", text: "Failed to save article." });
    }
  };

  const handleToggleStatus = async (blog) => {
    const newStatus = blog.status === "published" ? "draft" : "published";
    try {
      await api.put(`/api/blogs/${blog.id}`, { status: newStatus });
      fetchBlogs();
      setNotification({
        type: "success",
        text: `Article is now ${newStatus}!`
      });
    } catch (err) {
      console.error("Toggle blog status error:", err);
      setNotification({ type: "error", text: "Failed to change status." });
    }
  };

  const handleDeleteBlog = async (id, title) => {
    if (!window.confirm(`Delete article '${title}'?`)) return;
    try {
      await api.delete(`/api/blogs/${id}`);
      fetchBlogs();
      setNotification({ type: "success", text: "Article deleted." });
    } catch (err) {
      console.error("Delete blog error:", err);
      setNotification({ type: "error", text: "Failed to delete article." });
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    if (filter === "published") return b.status === "published";
    if (filter === "draft") return b.status === "draft";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Blog Posts Manager</h2>
          <p className="text-sm text-slate-500 mt-1">
            Write technical articles, tutorials, and manage published/draft states.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Write New Article
        </button>
      </div>

      {/* Notification Toast */}
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

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            filter === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All ({blogs.length})
        </button>
        <button
          onClick={() => setFilter("published")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            filter === "published" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Published ({blogs.filter((b) => b.status === "published").length})
        </button>
        <button
          onClick={() => setFilter("draft")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            filter === "draft" ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Drafts ({blogs.filter((b) => b.status === "draft").length})
        </button>
      </div>

      {/* Articles Listing */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading articles...</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No articles found. Click "Write New Article" to draft your first post!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredBlogs.map((post) => (
              <div
                key={post.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70"
              >
                <div className="flex items-start space-x-4 min-w-0">
                  <div className="w-16 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {post.cover_image ? (
                      <img
                        src={`${API_BASE_URL}${post.cover_image}`}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 text-base truncate">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {post.summary || post.content}
                    </p>
                    <div className="text-xs text-slate-400 font-mono mt-1">
                      slug: /{post.slug}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleStatus(post)}
                    title="Click to toggle status"
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors cursor-pointer ${
                      post.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    {post.status === "published" ? "● Published" : "○ Draft"}
                  </button>

                  <button
                    onClick={() => openEditModal(post)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteBlog(post.id, post.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Write / Edit Article Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingBlog ? "Edit Article" : "Write New Article"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Modern Full Stack Architecture with Flask & React"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  URL Slug (Optional — generated automatically if left empty)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="modern-fullstack-architecture"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Short Summary / Excerpt
                </label>
                <input
                  type="text"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Brief preview sentence displayed on article cards..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Cover Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {formData.cover_image ? (
                      <img
                        src={`${API_BASE_URL}${formData.cover_image}`}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">No Image</span>
                    )}
                  </div>
                  <div>
                    <label className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer shadow-sm">
                      <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      {uploadingImage ? "Uploading..." : "Upload Cover"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Article Content (Markdown or Text)
                </label>
                <textarea
                  name="content"
                  rows="7"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your article in plain text or markdown..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Publishing Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  <option value="draft">Draft (Private in CMS)</option>
                  <option value="published">Published (Visible on Portfolio)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm"
                >
                  {editingBlog ? "Save Changes" : "Publish / Save Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
