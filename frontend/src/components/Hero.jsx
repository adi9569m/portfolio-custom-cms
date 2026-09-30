import React from "react";
import { API_BASE_URL } from "../api/client";
import { ArrowRight, FileDown, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./SocialIcons";

export const Hero = ({ profile }) => {
  const avatarSrc = profile?.avatar_url
    ? `${API_BASE_URL}${profile.avatar_url}`
    : null;

  const resumeSrc = profile?.resume_url
    ? `${API_BASE_URL}${profile.resume_url}`
    : null;

  return (
    <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Status Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 mb-8 backdrop-blur-sm shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
          <span className="text-xs font-semibold text-slate-300">
            Available for new opportunities & contracts
          </span>
        </div>

        {/* Avatar Photo */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-indigo-500/20 bg-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={profile?.full_name || "Developer"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-indigo-400">
                {profile?.full_name ? profile.full_name.charAt(0) : "D"}
              </span>
            )}
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
            {profile?.full_name || "Portfolio Developer"}
          </span>
        </h1>

        <p className="mt-3 text-lg sm:text-2xl font-medium text-slate-300">
          {profile?.title || "Full Stack Engineer & System Designer"}
        </p>

        {/* Short Bio */}
        <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {profile?.bio ||
            "I design and engineer performant web applications, custom CMS engines, and scalable REST APIs with a focus on simplicity and craftsmanship."}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
          >
            Explore Projects
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition-all transform hover:-translate-y-0.5"
          >
            <Mail className="w-4 h-4 mr-2 text-indigo-400" />
            Get in Touch
          </a>

          {resumeSrc && (
            <a
              href={resumeSrc}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-5 py-3 text-slate-300 hover:text-white text-sm font-semibold rounded-xl hover:bg-slate-800/50 transition-colors"
            >
              <FileDown className="w-4 h-4 mr-1.5 text-indigo-400" />
              Download Resume
            </a>
          )}
        </div>

        {/* Social Links */}
        <div className="mt-10 flex items-center justify-center space-x-6 text-slate-400">
          {profile?.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              title="GitHub Profile"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
          )}

          {profile?.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              title="LinkedIn Profile"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
          )}

          {profile?.twitter_url && (
            <a
              href={profile.twitter_url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              title="Twitter / X Profile"
            >
              <TwitterIcon className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
