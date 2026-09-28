import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  Layers,
  BookOpen,
  Mail,
  LogOut,
  ExternalLink
} from "lucide-react";

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Profile & About", href: "/profile", icon: User },
    { name: "Projects", href: "/projects", icon: FolderGit2 },
    { name: "Skills", href: "/skills", icon: Cpu },
    { name: "Experience", href: "/experience", icon: Briefcase },
    { name: "Services", href: "/services", icon: Layers },
    { name: "Blog Posts", href: "/blogs", icon: BookOpen },
    { name: "Messages", href: "/messages", icon: Mail }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              P
            </div>
            <div>
              <h1 className="text-white font-semibold text-base">Custom CMS</h1>
              <p className="text-xs text-slate-400">Admin Control Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="truncate">
              <p className="text-sm font-medium text-white truncate">
                {user?.username || "Admin"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email || "admin@portfolio.com"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors border border-rose-900/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-500">Workspace /</span>
            <span className="text-sm font-semibold text-slate-800">
              {navigation.find((nav) => nav.href === location.pathname)?.name || "CMS"}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Preview Public Portfolio
            </a>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
