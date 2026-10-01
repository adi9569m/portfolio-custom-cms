import React, { useState } from "react";
import { sendContactMessage } from "../api/client";
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./SocialIcons";

export const Contact = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    // Step-by-step validations
    if (!formData.name.trim()) {
      setStatus({ type: "error", text: "Please enter your name." });
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setStatus({ type: "error", text: "Please provide a valid email address." });
      return;
    }

    if (!formData.message.trim()) {
      setStatus({ type: "error", text: "Please enter a message." });
      return;
    }

    try {
      setSubmitting(true);
      await sendContactMessage(formData);
      setStatus({
        type: "success",
        text: "Thank you! Your message has been received. I will respond to your email shortly."
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (err) {
      console.error("Contact form error:", err);
      const errMsg = err.response?.data?.error || "Failed to send message. Please try again.";
      setStatus({ type: "error", text: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-900/60 border-t border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Let's Collaborate
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Get in Touch
          </h2>
          <div className="w-12 h-1 bg-indigo-500 rounded-full mx-auto mt-4" />
          <p className="text-sm text-slate-400 mt-3 max-w-lg mx-auto">
            Have a project in mind, a freelance inquiry, or just want to connect? Send a note below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
          {/* Left Column: Direct Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-md">
              <h3 className="text-base font-bold text-white flex items-center">
                <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
                Contact Details
              </h3>

              {profile?.email && (
                <div className="flex items-start space-x-3 text-sm">
                  <div className="p-2 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Direct Email</span>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-slate-200 hover:text-indigo-400 font-medium transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}

              {profile?.location && (
                <div className="flex items-start space-x-3 text-sm">
                  <div className="p-2 rounded-lg bg-sky-950/60 text-sky-400 border border-sky-800/40">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Based in</span>
                    <span className="text-slate-200 font-medium">{profile.location}</span>
                  </div>
                </div>
              )}

              {/* Social Media Links */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 block mb-3 font-semibold uppercase tracking-wider">
                  Follow & Connect
                </span>
                <div className="flex items-center space-x-3 text-slate-400">
                  {profile?.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}

                  {profile?.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                  )}

                  {profile?.twitter_url && (
                    <a
                      href={profile.twitter_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      <TwitterIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="md:col-span-3">
            <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
              {/* Alert Status */}
              {status.text && (
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm flex items-start space-x-2.5 mb-6 ${
                    status.type === "success"
                      ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/80"
                      : "bg-rose-950/60 text-rose-300 border border-rose-800/80"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{status.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Subject (Optional)
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Job Opportunity"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows="5"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hello, I would like to discuss..."
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Sending Inquiry..." : "Send Message"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
