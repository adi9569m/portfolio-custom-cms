import React from "react";
import { MapPin, Mail, Sparkles, Code2, Globe } from "lucide-react";

export const About = ({ profile }) => {
  return (
    <section id="about" className="py-20 bg-slate-900/50 border-t border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Background & Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            About Me
          </h2>
          <div className="w-12 h-1 bg-indigo-500 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Main Bio Text */}
          <div className="md:col-span-2 space-y-4 text-slate-300 text-base leading-relaxed">
            <p>
              {profile?.bio ||
                "Hello! I am a software engineer dedicated to building high-performance web products, resilient APIs, and intuitive content systems."}
            </p>

            <p>
              This entire portfolio operates on a{" "}
              <strong className="text-indigo-300">Custom-Built Python Headless CMS</strong>{" "}
              without relying on third-party SaaS platforms like Strapi, Sanity, or WordPress.
              Every project, technical skill, career milestone, and blog article is managed through
              a dedicated administrative panel with JWT authorization and relational database
              storage.
            </p>

            <p>
              I believe in clean architecture, type safety, human-readable logic, and software that
              delivers genuine business value while remaining delightful to use.
            </p>
          </div>

          {/* Quick Details Card */}
          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
              <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
              Quick Facts
            </h3>

            {profile?.location && (
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block">Location</span>
                  <span className="text-slate-200 font-medium">{profile.location}</span>
                </div>
              </div>
            )}

            {profile?.email && (
              <div className="flex items-start space-x-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs text-slate-400 block">Direct Email</span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-indigo-400 hover:text-indigo-300 font-medium truncate block"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3 text-sm">
              <Code2 className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">Stack Focus</span>
                <span className="text-slate-200 font-medium">
                  Python (Flask/Django) + React
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-sm">
              <Globe className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">CMS Architecture</span>
                <span className="text-slate-200 font-medium">
                  100% Custom Headless CMS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
