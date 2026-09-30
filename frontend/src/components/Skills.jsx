import React, { useState } from "react";
import { Cpu } from "lucide-react";

export const Skills = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Extract unique categories from skills
  const categories = ["all", ...new Set(skills.map((s) => s.category).filter(Boolean))];

  const filteredSkills = skills.filter((s) => {
    if (selectedCategory === "all") return true;
    return s.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <section id="skills" className="py-20 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Expertise & Tools
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Technical Skills
          </h2>
          <div className="w-12 h-1 bg-indigo-500 rounded-full mx-auto mt-4" />
          <p className="text-sm text-slate-400 mt-3 max-w-lg mx-auto">
            Technologies and frameworks I use to build scalable full-stack applications.
          </p>
        </div>

        {/* Category Filter Pills */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full capitalize transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Skills Grid */}
        {skills.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No skills registered yet. Log into the CMS Admin to add your skills!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/40 flex items-center justify-center">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm text-white">
                      {skill.name}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-slate-400">
                    {skill.proficiency || 80}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-sky-400 h-1.5 rounded-full"
                    style={{ width: `${skill.proficiency || 80}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-400 font-medium mt-2">
                  {skill.category}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
