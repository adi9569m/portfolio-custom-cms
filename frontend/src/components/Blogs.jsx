import React, { useState } from "react";
import { API_BASE_URL } from "../api/client";
import { BookOpen, Calendar, ArrowRight, X } from "lucide-react";

export const Blogs = ({ blogs = [] }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <section id="blogs" className="py-24 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Thoughts & Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Latest Articles
          </h2>
          <div className="w-12 h-1 bg-indigo-500 rounded-full mx-auto mt-4" />
          <p className="text-sm text-slate-400 mt-3 max-w-lg mx-auto">
            Technical writing on web architecture, Python APIs, and custom software systems.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-14 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-sm">
            No published articles yet. Write and publish your first article from the CMS dashboard!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((article) => {
              const coverSrc = article.cover_image
                ? `${API_BASE_URL}${article.cover_image}`
                : null;

              return (
                <div
                  key={article.id}
                  className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover Photo */}
                    <div className="h-44 bg-slate-800 relative overflow-hidden flex items-center justify-center">
                      {coverSrc ? (
                        <img
                          src={coverSrc}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <BookOpen className="w-10 h-10 text-slate-600" />
                      )}
                    </div>

                    {/* Content Excerpt */}
                    <div className="p-5">
                      <div className="flex items-center text-xs text-slate-500 font-mono mb-2">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                        {article.created_at
                          ? new Date(article.created_at).toLocaleDateString()
                          : "Recently"}
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {article.summary || article.content}
                      </p>
                    </div>
                  </div>

                  {/* Read Button */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-3xl rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-indigo-400">
                  {selectedArticle.created_at
                    ? new Date(selectedArticle.created_at).toLocaleDateString()
                    : ""}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {selectedArticle.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              {selectedArticle.cover_image && (
                <div className="h-64 rounded-xl overflow-hidden bg-slate-800 mb-6">
                  <img
                    src={`${API_BASE_URL}${selectedArticle.cover_image}`}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                {selectedArticle.content}
              </div>
            </div>

            <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
