import React from "react";
import { Layers, Quote, Sparkles, Code, Cpu, Database, Cloud } from "lucide-react";

export const Services = ({ services = [], testimonials = [] }) => {
  return (
    <section id="services" className="py-24 bg-slate-900/40 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Services Section */}
        <div>
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Solutions & Value
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              What I Offer
            </h2>
            <div className="w-12 h-1 bg-indigo-500 rounded-full mx-auto mt-4" />
            <p className="text-sm text-slate-400 mt-3 max-w-lg mx-auto">
              Custom web engineering, API design, and CMS solutions built tailored to your business needs.
            </p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-500 text-sm">
              No services added yet. Manage services via your custom CMS admin!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-800/40 text-indigo-400 flex items-center justify-center mb-4">
                      <Code className="w-5 h-5" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">
                      {srv.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs font-semibold text-indigo-400">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    <span>{srv.icon || "Full-Stack Solution"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Recommendations
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Client & Colleague Feedback
              </h2>
              <div className="w-12 h-1 bg-emerald-500 rounded-full mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 relative flex flex-col justify-between"
                >
                  <Quote className="w-8 h-8 text-slate-800 absolute top-4 right-4 pointer-events-none" />

                  <p className="text-sm text-slate-300 italic leading-relaxed mb-6 relative z-10">
                    "{t.feedback}"
                  </p>

                  <div className="flex items-center space-x-3 pt-4 border-t border-slate-800/80">
                    <div className="w-10 h-10 rounded-full bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 font-bold text-sm">
                      {t.client_name ? t.client_name.charAt(0) : "C"}
                    </div>

                    <div>
                      <div className="font-bold text-sm text-white">{t.client_name}</div>
                      <div className="text-xs text-slate-400">
                        {t.client_role} {t.company && `at ${t.company}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
