import React, { useState, useEffect } from "react";
import api from "../api/client";
import { Plus, Edit2, Trash2, Check, AlertCircle, X, Briefcase, GraduationCap } from "lucide-react";

export const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("experience"); // 'experience' or 'education'
  const [notification, setNotification] = useState({ type: "", text: "" });

  // Modals state
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [editingEdu, setEditingEdu] = useState(null);

  // Forms initial state
  const initialExpForm = {
    company: "",
    position: "",
    description: "",
    start_date: "",
    end_date: "Present",
    is_current: false,
    display_order: 0
  };

  const initialEduForm = {
    institution: "",
    degree: "",
    field_of_study: "",
    start_year: "",
    end_year: "Present",
    display_order: 0
  };

  const [expForm, setExpForm] = useState(initialExpForm);
  const [eduForm, setEduForm] = useState(initialEduForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, eduRes] = await Promise.all([
        api.get("/api/experience"),
        api.get("/api/education")
      ]);
      setExperiences(expRes.data.experience || []);
      setEducations(eduRes.data.education || []);
    } catch (err) {
      console.error("Failed to fetch experience/education:", err);
      setNotification({ type: "error", text: "Failed to load timeline records." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- EXPERIENCE HANDLERS ---
  const openExpCreate = () => {
    setEditingExp(null);
    setExpForm(initialExpForm);
    setExpModalOpen(true);
  };

  const openExpEdit = (item) => {
    setEditingExp(item);
    setExpForm({
      company: item.company || "",
      position: item.position || "",
      description: item.description || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "Present",
      is_current: !!item.is_current,
      display_order: item.display_order || 0
    });
    setExpModalOpen(true);
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExp) {
        await api.put(`/api/experience/${editingExp.id}`, expForm);
        setNotification({ type: "success", text: "Work experience updated!" });
      } else {
        await api.post("/api/experience", expForm);
        setNotification({ type: "success", text: "New experience added!" });
      }
      setExpModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Save experience error:", err);
      setNotification({ type: "error", text: "Failed to save work experience." });
    }
  };

  const handleDeleteExp = async (id, company) => {
    if (!window.confirm(`Delete experience at '${company}'?`)) return;
    try {
      await api.delete(`/api/experience/${id}`);
      fetchData();
      setNotification({ type: "success", text: "Experience record removed." });
    } catch (err) {
      console.error("Delete experience error:", err);
      setNotification({ type: "error", text: "Failed to delete experience." });
    }
  };

  // --- EDUCATION HANDLERS ---
  const openEduCreate = () => {
    setEditingEdu(null);
    setEduForm(initialEduForm);
    setEduModalOpen(true);
  };

  const openEduEdit = (item) => {
    setEditingEdu(item);
    setEduForm({
      institution: item.institution || "",
      degree: item.degree || "",
      field_of_study: item.field_of_study || "",
      start_year: item.start_year || "",
      end_year: item.end_year || "Present",
      display_order: item.display_order || 0
    });
    setEduModalOpen(true);
  };

  const handleEduSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEdu) {
        await api.put(`/api/education/${editingEdu.id}`, eduForm);
        setNotification({ type: "success", text: "Education record updated!" });
      } else {
        await api.post("/api/education", eduForm);
        setNotification({ type: "success", text: "New degree/education added!" });
      }
      setEduModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Save education error:", err);
      setNotification({ type: "error", text: "Failed to save education record." });
    }
  };

  const handleDeleteEdu = async (id, institution) => {
    if (!window.confirm(`Delete education from '${institution}'?`)) return;
    try {
      await api.delete(`/api/education/${id}`);
      fetchData();
      setNotification({ type: "success", text: "Education record removed." });
    } catch (err) {
      console.error("Delete education error:", err);
      setNotification({ type: "error", text: "Failed to delete education record." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Career & Education Timeline</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your employment history and academic qualifications.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {activeTab === "experience" ? (
            <button
              onClick={openExpCreate}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Job Experience
            </button>
          ) : (
            <button
              onClick={openEduCreate}
              className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Degree / Education
            </button>
          )}
        </div>
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

      {/* Tab Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("experience")}
          className={`flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === "experience"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 mr-2" />
          Work Experience ({experiences.length})
        </button>

        <button
          onClick={() => setActiveTab("education")}
          className={`flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === "education"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 mr-2" />
          Education ({educations.length})
        </button>
      </div>

      {/* Content Container */}
      {loading ? (
        <div className="p-8 text-center text-sm text-slate-400">Loading timeline...</div>
      ) : activeTab === "experience" ? (
        /* Work Experience List */
        experiences.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-sm text-slate-500">
            No work experience added yet. Click "Add Job Experience" to document your roles!
          </div>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-slate-900 text-base">{exp.position}</h3>
                    <span className="text-slate-400">•</span>
                    <span className="font-medium text-indigo-600 text-sm">{exp.company}</span>
                    {exp.is_current && (
                      <span className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-medium">
                        Current Role
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 font-medium">
                    {exp.start_date} — {exp.end_date}
                  </div>

                  {exp.description && (
                    <p className="text-sm text-slate-600 mt-2 whitespace-pre-line leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => openExpEdit(exp)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExp(exp.id, exp.company)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Education List */
        educations.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-sm text-slate-500">
            No education entries added yet. Click "Add Degree / Education" to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {educations.map((edu) => (
              <div
                key={edu.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-900 text-base">{edu.degree}</h3>
                  <div className="text-sm font-medium text-sky-600">
                    {edu.institution} {edu.field_of_study && `(${edu.field_of_study})`}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {edu.start_year} — {edu.end_year}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => openEduEdit(edu)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEdu(edu.id, edu.institution)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Experience Modal */}
      {expModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingExp ? "Edit Experience" : "Add Work Experience"}
              </h3>
              <button
                onClick={() => setExpModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExpSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Job Position / Title
                </label>
                <input
                  type="text"
                  value={expForm.position}
                  onChange={(e) => setExpForm({ ...expForm, position: e.target.value })}
                  placeholder="e.g. Lead Frontend Engineer"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  placeholder="e.g. Stripe, Freelance"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={expForm.start_date}
                    onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })}
                    placeholder="e.g. Jan 2023"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={expForm.end_date}
                    onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })}
                    placeholder="e.g. Present or Dec 2024"
                    disabled={expForm.is_current}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isCurrentExp"
                  checked={expForm.is_current}
                  onChange={(e) =>
                    setExpForm({
                      ...expForm,
                      is_current: e.target.checked,
                      end_date: e.target.checked ? "Present" : expForm.end_date
                    })
                  }
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300"
                />
                <label htmlFor="isCurrentExp" className="text-xs font-medium text-slate-700">
                  I currently work here
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Responsibilities & Achievements
                </label>
                <textarea
                  rows="3"
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  placeholder="Key accomplishments, technologies utilized, projects led..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setExpModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm"
                >
                  {editingExp ? "Save Changes" : "Add Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {eduModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingEdu ? "Edit Education" : "Add Education / Degree"}
              </h3>
              <button
                onClick={() => setEduModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEduSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Degree / Certificate
                </label>
                <input
                  type="text"
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  placeholder="e.g. B.S. in Computer Science"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Institution / University
                </label>
                <input
                  type="text"
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  placeholder="e.g. Stanford University"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Field of Study (Optional)
                </label>
                <input
                  type="text"
                  value={eduForm.field_of_study}
                  onChange={(e) => setEduForm({ ...eduForm, field_of_study: e.target.value })}
                  placeholder="e.g. Software Engineering"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Start Year
                  </label>
                  <input
                    type="text"
                    value={eduForm.start_year}
                    onChange={(e) => setEduForm({ ...eduForm, start_year: e.target.value })}
                    placeholder="e.g. 2019"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    End Year / Graduation
                  </label>
                  <input
                    type="text"
                    value={eduForm.end_year}
                    onChange={(e) => setEduForm({ ...eduForm, end_year: e.target.value })}
                    placeholder="e.g. 2023 or Present"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEduModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg shadow-sm"
                >
                  {editingEdu ? "Save Changes" : "Add Education"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
