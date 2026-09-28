import React, { useState, useEffect } from "react";
import api from "../api/client";
import { Plus, Edit2, Trash2, Check, AlertCircle, X, Cpu } from "lucide-react";

export const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [notification, setNotification] = useState({ type: "", text: "" });

  const initialForm = {
    name: "",
    category: "Frontend",
    proficiency: 85,
    icon: "",
    display_order: 0
  };

  const [formData, setFormData] = useState(initialForm);

  const categories = ["Frontend", "Backend", "Database", "DevOps & Cloud", "Tools", "General"];

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/skills");
      setSkills(res.data.skills || []);
    } catch (err) {
      console.error("Failed to load skills:", err);
      setNotification({ type: "error", text: "Failed to load skills list." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openCreateModal = () => {
    setEditingSkill(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || "",
      category: skill.category || "Frontend",
      proficiency: skill.proficiency || 80,
      icon: skill.icon || "",
      display_order: skill.display_order || 0
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSkill(null);
    setFormData(initialForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "proficiency" || name === "display_order" ? parseInt(value) || 0 : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await api.put(`/api/skills/${editingSkill.id}`, formData);
        setNotification({ type: "success", text: "Skill updated successfully!" });
      } else {
        await api.post("/api/skills", formData);
        setNotification({ type: "success", text: "New skill added successfully!" });
      }
      closeModal();
      fetchSkills();
    } catch (err) {
      console.error("Skill save error:", err);
      setNotification({ type: "error", text: "Failed to save skill." });
    }
  };

  const handleDeleteSkill = async (id, name) => {
    if (!window.confirm(`Delete skill '${name}'?`)) return;

    try {
      await api.delete(`/api/skills/${id}`);
      fetchSkills();
      setNotification({ type: "success", text: "Skill deleted." });
    } catch (err) {
      console.error("Delete skill error:", err);
      setNotification({ type: "error", text: "Failed to delete skill." });
    }
  };

  // Group skills by category for cleaner organization
  const groupedSkills = categories.reduce((acc, cat) => {
    const matched = skills.filter((s) => s.category.toLowerCase() === cat.toLowerCase());
    if (matched.length > 0) {
      acc[cat] = matched;
    }
    return acc;
  }, {});

  // Add any skills whose categories don't match predefined list
  const otherSkills = skills.filter(
    (s) => !categories.some((c) => c.toLowerCase() === s.category.toLowerCase())
  );
  if (otherSkills.length > 0) {
    groupedSkills["Other"] = otherSkills;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Skills Manager</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your technical languages, frameworks, proficiencies, and categories.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Skill
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

      {/* Content */}
      {loading ? (
        <div className="p-8 text-center text-sm text-slate-400">Loading skills...</div>
      ) : skills.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-sm text-slate-500">
          No skills added yet. Click "Add New Skill" to define your tech stack!
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([categoryName, skillItems]) => (
            <div
              key={categoryName}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
                  {categoryName} ({skillItems.length})
                </span>
              </div>

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {skillItems.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2 flex-1">
                      <div className="font-medium text-slate-900 text-sm truncate">
                        {skill.name}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          {skill.proficiency}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => openEditModal(skill)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id, skill.name)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingSkill ? "Edit Skill" : "Add Technical Skill"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. React, Python, PostgreSQL"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Proficiency ({formData.proficiency}%)
                  </label>
                </div>
                <input
                  type="range"
                  name="proficiency"
                  min="10"
                  max="100"
                  step="5"
                  value={formData.proficiency}
                  onChange={handleInputChange}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
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
                  {editingSkill ? "Update Skill" : "Add Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
