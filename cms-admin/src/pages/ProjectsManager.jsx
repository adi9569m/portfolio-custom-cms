import React, { useState, useEffect } from "react";
import api, { API_BASE_URL } from "../api/client";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Code2,
  Upload,
  Check,
  AlertCircle,
  X,
  Star
} from "lucide-react";

export const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [notification, setNotification] = useState({ type: "", text: "" });
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialFormState = {
    title: "",
    description: "",
    image_url: "",
    github_url: "",
    live_url: "",
    tags: "",
    featured: false,
    status: "draft",
    display_order: 0
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch all projects for admin
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/projects?status=all");
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setNotification({ type: "error", text: "Failed to load projects" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData(initialFormState);
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      image_url: project.image_url || "",
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      tags: project.raw_tags || (project.tags ? project.tags.join(", ") : ""),
      featured: !!project.featured,
      status: project.status || "draft",
      display_order: project.display_order || 0
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProject(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      setUploadingImage(true);
      const res = await api.post("/api/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData((prev) => ({
        ...prev,
        image_url: res.data.url
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload project screenshot.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        // Update existing project
        await api.put(`/api/projects/${editingProject.id}`, formData);
        setNotification({ type: "success", text: "Project updated successfully!" });
      } else {
        // Create new project
        await api.post("/api/projects", formData);
        setNotification({ type: "success", text: "New project created successfully!" });
      }
      closeModal();
      fetchProjects();
    } catch (err) {
      console.error("Save project error:", err);
      setNotification({ type: "error", text: "Failed to save project." });
    }
  };

  // Direct toggle for Draft <-> Published status
  const handleToggleStatus = async (project) => {
    const newStatus = project.status === "published" ? "draft" : "published";
    try {
      await api.put(`/api/projects/${project.id}`, { status: newStatus });
      fetchProjects();
      setNotification({
        type: "success",
        text: `Project '${project.title}' is now ${newStatus}!`
      });
    } catch (err) {
      console.error("Status toggle error:", err);
      setNotification({ type: "error", text: "Failed to update project status." });
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete '${title}'?`)) {
      return;
    }

    try {
      await api.delete(`/api/projects/${id}`);
      fetchProjects();
      setNotification({ type: "success", text: "Project removed successfully." });
    } catch (err) {
      console.error("Delete project error:", err);
      setNotification({ type: "error", text: "Failed to delete project." });
    }
  };

  const filteredProjects = projects.filter((item) => {
    if (filter === "published") return item.status === "published";
    if (filter === "draft") return item.status === "draft";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects Manager</h2>
          <p className="text-sm text-slate-500 mt-1">
            Create, showcase, and toggle draft/published status for your portfolio items.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Project
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
            filter === "all"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All ({projects.length})
        </button>
        <button
          onClick={() => setFilter("published")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            filter === "published"
              ? "bg-emerald-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Published ({projects.filter((p) => p.status === "published").length})
        </button>
        <button
          onClick={() => setFilter("draft")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            filter === "draft"
              ? "bg-amber-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Drafts ({projects.filter((p) => p.status === "draft").length})
        </button>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Loading projects...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No projects found in this view. Click "Add New Project" to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Tags</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Links</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {p.image_url ? (
                            <img
                              src={`${API_BASE_URL}${p.image_url}`}
                              alt={p.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-slate-400">IMG</span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{p.title}</div>
                          <div className="text-xs text-slate-500 line-clamp-1 max-w-xs">
                            {p.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.tags && p.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {p.featured ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-amber-700 bg-amber-50 rounded border border-amber-200">
                          <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Standard</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        title="Click to toggle status"
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors cursor-pointer ${
                          p.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        {p.status === "published" ? "● Published" : "○ Draft"}
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2 text-slate-400">
                        {p.live_url && (
                          <a
                            href={p.live_url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-indigo-600"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {p.github_url && (
                          <a
                            href={p.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-slate-900"
                          >
                            <Code2 className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id, p.title)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingProject ? "Edit Project" : "Create New Project"}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. AI Content Platform"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Project Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Briefly describe what this project solves and its key features..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Project Screenshot / Thumbnail
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {formData.image_url ? (
                      <img
                        src={`${API_BASE_URL}${formData.image_url}`}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">No Image</span>
                    )}
                  </div>
                  <div>
                    <label className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer shadow-sm">
                      <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      {uploadingImage ? "Uploading..." : "Upload Image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.image_url && (
                      <p className="text-xs text-emerald-600 mt-1 truncate max-w-xs">
                        Saved: {formData.image_url}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    name="live_url"
                    value={formData.live_url}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleInputChange}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tech Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Technologies / Tags (Comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="React, Flask, PostgreSQL, Tailwind"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Status and Featured Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
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

                <div className="flex items-center pt-6 space-x-2">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="featuredCheckbox" className="text-sm font-medium text-slate-700">
                    Feature on Homepage
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
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
                  {editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
