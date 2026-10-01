import React, { useState } from "react";
import { API_BASE_URL } from "../api/client";
import { ExternalLink, Star, FolderGit2 } from "lucide-react";
import { GithubIcon } from "./SocialIcons";

export const Projects = ({ projects }) => {
  const [filter, setFilter] = useState("all"); // 'all', 'featured'

  const filteredProjects = projects.filter((p) => {
    if (filter === "featured") return p.featured;
    return true;
  });

  return (
    <section id="projects" className="py-24 bg-slate-900/50 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Portfolio Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Featured Projects
          </h2>
          <div className="w-12 h-1 bg-indigo-500 rounded-full mx-auto mt-4" />
          <p className="text-sm text-slate-400 mt-3 max-w-lg mx-auto">
            Live web applications and systems managed dynamically through the custom CMS.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center space-x-2 mb-10">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              filter === "all"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            All Projects ({projects.length})
          </button>

          <button
            onClick={() => setFilter("featured")}
            className={`inline-flex items-center px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              filter === "featured"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
            Featured ({projects.filter((p) => p.featured).length})
          </button>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-500 text-sm">
            No published projects found in this view. Use the CMS admin panel to publish items!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const imageSrc = project.image_url
                ? `${API_BASE_URL}${project.image_url}`
                : null;

              return (
                <div
                  key={project.id}
                  className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all hover:-translate-y-1 shadow-lg flex flex-col group"
                >
                  {/* Image / Thumbnail Container */}
                  <div className="h-48 bg-slate-800/80 relative overflow-hidden flex items-center justify-center border-b border-slate-800">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-600">
                        <FolderGit2 className="w-10 h-10 mb-2" />
                        <span className="text-xs font-mono">No Preview Image</span>
                      </div>
                    )}

                    {project.featured && (
                      <div className="absolute top-3 right-3 inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/90 text-amber-950 font-bold text-[11px] shadow-sm backdrop-blur-sm">
                        <Star className="w-3 h-3 mr-1 fill-amber-950" />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1" />
                            Live Demo
                          </a>
                        )}

                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                          >
                            <GithubIcon className="w-3.5 h-3.5 mr-1" />
                            Source Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
