import React, { useState } from "react";
import { API_BASE_URL } from "../api/client";
import { Menu, X, FileDown, Lock } from "lucide-react";

export const Navbar = ({ profile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" }
  ];

  const resumeUrl = profile?.resume_url
    ? `${API_BASE_URL}${profile.resume_url}`
    : null;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              {profile?.full_name ? profile.full_name.charAt(0) : "P"}
            </div>
            <span className="font-bold text-white text-base tracking-tight group-hover:text-indigo-400 transition-colors">
              {profile?.full_name || "Portfolio"}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors shadow-sm"
              >
                <FileDown className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                Resume
              </a>
            )}

            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              title="Access Custom Headless CMS Admin"
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-800/50 rounded-lg transition-colors"
            >
              <Lock className="w-3 h-3 mr-1.5" />
              CMS Admin
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              {link.name}
            </a>
          ))}

          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 rounded-lg"
              >
                <FileDown className="w-4 h-4 mr-2 text-indigo-400" />
                Download Resume
              </a>
            )}

            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center px-4 py-2 text-xs font-semibold text-indigo-400 bg-indigo-950/50 rounded-lg border border-indigo-800/50"
            >
              <Lock className="w-3.5 h-3.5 mr-2" />
              CMS Admin Portal
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
