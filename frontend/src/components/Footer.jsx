import React from "react";
import { Lock } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./SocialIcons";

export const Footer = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-white text-base">
              {profile?.full_name || "Portfolio Developer"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Built with custom Python CMS (Flask + PostgreSQL) and React
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-5 text-slate-400">
            {profile?.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}

            {profile?.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}

            {profile?.twitter_url && (
              <a
                href={profile.twitter_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                title="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            )}

            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 ml-2 inline-flex items-center"
            >
              <Lock className="w-3 h-3 mr-1" />
              CMS Admin
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 text-center text-xs text-slate-500 flex items-center justify-center space-x-1">
          <span>&copy; {currentYear} {profile?.full_name || "Portfolio"}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
