import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import {
  FolderGit2,
  Cpu,
  Mail,
  BookOpen,
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle2
} from "lucide-react";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    projectsCount: 0,
    publishedProjects: 0,
    draftProjects: 0,
    skillsCount: 0,
    messagesCount: 0,
    unreadMessages: 0,
    blogsCount: 0
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch projects (all statuses for admin)
        const projectsRes = await api.get("/api/projects?status=all");
        const projectsList = projectsRes.data.projects || [];
        const published = projectsList.filter((p) => p.status === "published").length;
        const drafts = projectsList.filter((p) => p.status === "draft").length;

        // Fetch skills
        const skillsRes = await api.get("/api/skills");
        const skillsList = skillsRes.data.skills || [];

        // Fetch messages
        const msgsRes = await api.get("/api/contact/messages");
        const msgsList = msgsRes.data.messages || [];
        const unread = msgsList.filter((m) => !m.is_read).length;

        // Fetch blogs
        const blogsRes = await api.get("/api/blogs?status=all");
        const blogsList = blogsRes.data.blogs || [];

        setStats({
          projectsCount: projectsList.length,
          publishedProjects: published,
          draftProjects: drafts,
          skillsCount: skillsList.length,
          messagesCount: msgsList.length,
          unreadMessages: unread,
          blogsCount: blogsList.length
        });

        setRecentProjects(projectsList.slice(0, 4));
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400 font-medium animate-pulse">
          Loading metrics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">CMS Overview</h2>
        <p className="text-sm text-slate-500 mt-1">
          Welcome back! Here is a summary of your portfolio content and activity.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Projects Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Projects
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {stats.projectsCount}
          </div>
          <div className="flex items-center space-x-2 mt-2 text-xs">
            <span className="text-emerald-600 font-medium">
              {stats.publishedProjects} Published
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-600 font-medium">
              {stats.draftProjects} Drafts
            </span>
          </div>
        </div>

        {/* Skills Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Skills
            </span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {stats.skillsCount}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Technical stack & proficiencies
          </p>
        </div>

        {/* Messages Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Inquiries
            </span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {stats.messagesCount}
          </div>
          <p className="text-xs mt-2 font-medium text-rose-600">
            {stats.unreadMessages} Unread messages
          </p>
        </div>

        {/* Articles Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Blog Posts
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {stats.blogsCount}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Published & draft articles
          </p>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/projects"
            className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-sm font-medium text-slate-800"
          >
            <span className="flex items-center">
              <PlusCircle className="w-4 h-4 mr-2 text-indigo-600" />
              Manage Projects
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            to="/skills"
            className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-sky-400 hover:bg-sky-50/30 transition-all text-sm font-medium text-slate-800"
          >
            <span className="flex items-center">
              <PlusCircle className="w-4 h-4 mr-2 text-sky-600" />
              Manage Skills
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            to="/profile"
            className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all text-sm font-medium text-slate-800"
          >
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
              Update Profile & Bio
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Recent Projects Table Preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">
            Recent Projects
          </h3>
          <Link
            to="/projects"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View All →
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No projects added yet. Click Manage Projects to create your first one!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentProjects.map((p) => (
              <div
                key={p.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50"
              >
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {p.description}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      p.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
