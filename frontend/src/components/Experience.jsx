import React, { useState } from "react";
import { Briefcase, GraduationCap, Calendar, CheckCircle } from "lucide-react";

export const Experience = ({ experience = [], education = [] }) => {
  const [activeTab, setActiveTab] = useState("work"); // 'work' or 'education'

  return (
    <section id="experience" className="py-24 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Journey & Credentials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Experience & Education
          </h2>
          <div className="w-12 h-1 bg-indigo-500 rounded-full mx-auto mt-4" />
          <p className="text-sm text-slate-400 mt-3 max-w-lg mx-auto">
            My professional career path, software engineering milestones, and academic background.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center justify-center space-x-3 mb-12">
          <button
            onClick={() => setActiveTab("work")}
            className={`inline-flex items-center px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "work"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Work Experience ({experience.length})
          </button>

          <button
            onClick={() => setActiveTab("education")}
            className={`inline-flex items-center px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "education"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Education ({education.length})
          </button>
        </div>

        {/* Timeline Flow */}
        {activeTab === "work" ? (
          experience.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm bg-slate-900/40 rounded-2xl border border-slate-800">
              No work experience added yet. Add your employment history via the CMS admin!
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-800 ml-4 md:ml-32 space-y-8">
              {experience.map((item) => (
                <div key={item.id} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 group-hover:bg-indigo-500 transition-colors" />

                  {/* Card Content */}
                  <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {item.position}
                      </h3>

                      <div className="inline-flex items-center text-xs font-mono text-indigo-400 bg-indigo-950/50 px-2.5 py-1 rounded-md border border-indigo-800/40">
                        <Calendar className="w-3 h-3 mr-1.5" />
                        {item.start_date} — {item.end_date}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm font-medium text-slate-300 mb-3">
                      <span>{item.company}</span>
                      {item.is_current && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" /> Current Role
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          education.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm bg-slate-900/40 rounded-2xl border border-slate-800">
              No education entries added yet.
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-800 ml-4 md:ml-32 space-y-8">
              {education.map((item) => (
                <div key={item.id} className="relative pl-6 sm:pl-8 group">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-sky-500 group-hover:bg-sky-500 transition-colors" />

                  <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {item.degree}
                      </h3>

                      <div className="inline-flex items-center text-xs font-mono text-sky-400 bg-sky-950/50 px-2.5 py-1 rounded-md border border-sky-800/40">
                        <Calendar className="w-3 h-3 mr-1.5" />
                        {item.start_year} — {item.end_year}
                      </div>
                    </div>

                    <div className="text-sm font-medium text-slate-300">
                      {item.institution}
                    </div>

                    {item.field_of_study && (
                      <p className="text-xs text-slate-400 mt-2">
                        Specialization: {item.field_of_study}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
};
