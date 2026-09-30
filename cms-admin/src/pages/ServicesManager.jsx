import React, { useState, useEffect } from "react";
import api from "../api/client";
import { Plus, Edit2, Trash2, Check, AlertCircle, X, Layers, MessageSquareQuote } from "lucide-react";

export const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services"); // 'services' or 'testimonials'
  const [notification, setNotification] = useState({ type: "", text: "" });

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const initialServiceForm = {
    title: "",
    description: "",
    icon: "code",
    display_order: 0
  };

  const initialTestimonialForm = {
    client_name: "",
    client_role: "",
    company: "",
    feedback: "",
    avatar_url: "",
    display_order: 0
  };

  const [serviceForm, setServiceForm] = useState(initialServiceForm);
  const [testimonialForm, setTestimonialForm] = useState(initialTestimonialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [srvRes, testRes] = await Promise.all([
        api.get("/api/services"),
        api.get("/api/testimonials")
      ]);
      setServices(srvRes.data.services || []);
      setTestimonials(testRes.data.testimonials || []);
    } catch (err) {
      console.error("Failed to load services/testimonials:", err);
      setNotification({ type: "error", text: "Failed to load records." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- SERVICE ACTIONS ---
  const openServiceCreate = () => {
    setEditingService(null);
    setServiceForm(initialServiceForm);
    setServiceModalOpen(true);
  };

  const openServiceEdit = (srv) => {
    setEditingService(srv);
    setServiceForm({
      title: srv.title || "",
      description: srv.description || "",
      icon: srv.icon || "code",
      display_order: srv.display_order || 0
    });
    setServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/api/services/${editingService.id}`, serviceForm);
        setNotification({ type: "success", text: "Service updated!" });
      } else {
        await api.post("/api/services", serviceForm);
        setNotification({ type: "success", text: "New service created!" });
      }
      setServiceModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Service save error:", err);
      setNotification({ type: "error", text: "Failed to save service." });
    }
  };

  const handleDeleteService = async (id, title) => {
    if (!window.confirm(`Delete service '${title}'?`)) return;
    try {
      await api.delete(`/api/services/${id}`);
      fetchData();
      setNotification({ type: "success", text: "Service deleted." });
    } catch (err) {
      console.error("Delete service error:", err);
      setNotification({ type: "error", text: "Failed to delete service." });
    }
  };

  // --- TESTIMONIAL ACTIONS ---
  const openTestimonialCreate = () => {
    setEditingTestimonial(null);
    setTestimonialForm(initialTestimonialForm);
    setTestimonialModalOpen(true);
  };

  const openTestimonialEdit = (t) => {
    setEditingTestimonial(t);
    setTestimonialForm({
      client_name: t.client_name || "",
      client_role: t.client_role || "",
      company: t.company || "",
      feedback: t.feedback || "",
      avatar_url: t.avatar_url || "",
      display_order: t.display_order || 0
    });
    setTestimonialModalOpen(true);
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await api.put(`/api/testimonials/${editingTestimonial.id}`, testimonialForm);
        setNotification({ type: "success", text: "Testimonial updated!" });
      } else {
        await api.post("/api/testimonials", testimonialForm);
        setNotification({ type: "success", text: "New testimonial added!" });
      }
      setTestimonialModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Testimonial save error:", err);
      setNotification({ type: "error", text: "Failed to save testimonial." });
    }
  };

  const handleDeleteTestimonial = async (id, name) => {
    if (!window.confirm(`Delete testimonial from '${name}'?`)) return;
    try {
      await api.delete(`/api/testimonials/${id}`);
      fetchData();
      setNotification({ type: "success", text: "Testimonial deleted." });
    } catch (err) {
      console.error("Delete testimonial error:", err);
      setNotification({ type: "error", text: "Failed to delete testimonial." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Services & Client Reviews</h2>
          <p className="text-sm text-slate-500 mt-1">
            Showcase what you offer to clients and display testimonials from colleagues.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {activeTab === "services" ? (
            <button
              onClick={openServiceCreate}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </button>
          ) : (
            <button
              onClick={openTestimonialCreate}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
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

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("services")}
          className={`flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === "services"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-3.5 h-3.5 mr-2" />
          Services ({services.length})
        </button>

        <button
          onClick={() => setActiveTab("testimonials")}
          className={`flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === "testimonials"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <MessageSquareQuote className="w-3.5 h-3.5 mr-2" />
          Testimonials ({testimonials.length})
        </button>
      </div>

      {/* Tab Panels */}
      {loading ? (
        <div className="p-8 text-center text-sm text-slate-400">Loading records...</div>
      ) : activeTab === "services" ? (
        services.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-sm text-slate-500">
            No services listed yet. Click "Add Service" to describe what you build!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-xs uppercase">
                      {srv.icon || "SERVICE"}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openServiceEdit(srv)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(srv.id, srv.title)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-base">{srv.title}</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        testimonials.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-sm text-slate-500">
            No testimonials added yet. Click "Add Testimonial" to add reviews!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-slate-900 text-sm">
                      {test.client_name}
                      <span className="text-xs text-slate-400 font-normal ml-2">
                        {test.client_role} {test.company && `at ${test.company}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openTestimonialEdit(test)}
                        className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(test.id, test.client_name)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    "{test.feedback}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Service Modal */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingService ? "Edit Service" : "Add New Service"}
              </h3>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleServiceSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  placeholder="e.g. Full-Stack Web Development"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="What value or solutions do you deliver for this service?"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Icon Tag / Label
                </label>
                <input
                  type="text"
                  value={serviceForm.icon}
                  onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                  placeholder="e.g. Code, Database, Cloud"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm"
                >
                  {editingService ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {testimonialModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingTestimonial ? "Edit Testimonial" : "Add Client Testimonial"}
              </h3>
              <button
                onClick={() => setTestimonialModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTestimonialSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Client / Colleague Name
                </label>
                <input
                  type="text"
                  value={testimonialForm.client_name}
                  onChange={(e) =>
                    setTestimonialForm({ ...testimonialForm, client_name: e.target.value })
                  }
                  placeholder="e.g. Sarah Connor"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Role / Position
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.client_role}
                    onChange={(e) =>
                      setTestimonialForm({ ...testimonialForm, client_role: e.target.value })
                    }
                    placeholder="e.g. Engineering Lead"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.company}
                    onChange={(e) =>
                      setTestimonialForm({ ...testimonialForm, company: e.target.value })
                    }
                    placeholder="e.g. TechCorp Inc."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Testimonial / Review Quote
                </label>
                <textarea
                  rows="3"
                  value={testimonialForm.feedback}
                  onChange={(e) =>
                    setTestimonialForm({ ...testimonialForm, feedback: e.target.value })
                  }
                  placeholder="Write the recommendation quote here..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setTestimonialModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm"
                >
                  {editingTestimonial ? "Save Changes" : "Add Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
