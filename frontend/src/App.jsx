import React, { useState, useEffect } from "react";
import { getProfile, getSkills } from "./api/client";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Footer } from "./components/Footer";
import { FolderGit2, Briefcase, Mail, Layers, Sparkles } from "lucide-react";

// Placeholder section for Days 7 & 8
const SectionPlaceholder = ({ id, title, subtitle, icon: Icon, day }) => (
  <section id={id} className="py-20 bg-slate-900/30 border-t border-slate-800/80">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-950/60 text-indigo-400 border border-indigo-800/50 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h2 className="text-3xl font-extrabold text-white">{title}</h2>
      <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">{subtitle}</p>
      <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full bg-slate-800/60 text-xs font-semibold text-indigo-300 border border-slate-700">
        <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
        Coming in Day {day} Roadmap
      </div>
    </div>
  </section>
);

function App() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [profData, skillsData] = await Promise.all([
          getProfile().catch(() => null),
          getSkills().catch(() => [])
        ]);
        setProfile(profData);
        setSkills(skillsData);
      } catch (err) {
        console.error("Failed to load initial portfolio data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Sticky Navigation */}
      <Navbar profile={profile} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Day 6 Delivered Sections */}
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skills={skills} />

        {/* Days 7 & 8 Upcoming Sections */}
        <SectionPlaceholder
          id="projects"
          title="Featured Projects"
          subtitle="Interactive showcase of full-stack web applications and software systems."
          icon={FolderGit2}
          day="7"
        />

        <SectionPlaceholder
          id="experience"
          title="Experience & Education"
          subtitle="Career milestones, roles led, and academic qualifications."
          icon={Briefcase}
          day="7"
        />

        <SectionPlaceholder
          id="services"
          title="Services & Testimonials"
          subtitle="Client recommendations, peer reviews, and technical capabilities."
          icon={Layers}
          day="7"
        />

        <SectionPlaceholder
          id="contact"
          title="Get In Touch"
          subtitle="Send a direct message through the interactive contact form."
          icon={Mail}
          day="8"
        />
      </main>

      {/* Footer */}
      <Footer profile={profile} />
    </div>
  );
}

export default App;
