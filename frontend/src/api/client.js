import axios from "axios";

// Public API client configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Helper API calls to fetch published CMS content
export const getProfile = async () => {
  const res = await api.get("/api/profile");
  return res.data.profile;
};

export const getSkills = async () => {
  const res = await api.get("/api/skills");
  return res.data.skills || [];
};

export const getProjects = async (featured = false) => {
  const url = featured ? "/api/projects?featured=true" : "/api/projects";
  const res = await api.get(url);
  return res.data.projects || [];
};

export const getExperience = async () => {
  const res = await api.get("/api/experience");
  return res.data.experience || [];
};

export const getEducation = async () => {
  const res = await api.get("/api/education");
  return res.data.education || [];
};

export const getServices = async () => {
  const res = await api.get("/api/services");
  return res.data.services || [];
};

export const getTestimonials = async () => {
  const res = await api.get("/api/testimonials");
  return res.data.testimonials || [];
};

export const getBlogs = async () => {
  const res = await api.get("/api/blogs");
  return res.data.blogs || [];
};

export const sendContactMessage = async (messageData) => {
  const res = await api.post("/api/contact", messageData);
  return res.data;
};

export default api;
export { API_BASE_URL };
