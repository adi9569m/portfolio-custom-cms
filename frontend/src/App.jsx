import React, { useState, useEffect } from "react";
import {
  getProfile,
  getSkills,
  getProjects,
  getExperience,
  getEducation,
  getServices,
  getTestimonials,
  getBlogs
} from "./api/client";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Experience } from "./components/Experience";
import { Services } from "./components/Services";
import { Blogs } from "./components/Blogs";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

function App() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPortfolioData = async () => {
      try {
        setLoading(true);

        // Fetch all published CMS data in parallel
        const [
          profData,
          skillsData,
          projectsData,
          expData,
          eduData,
          srvData,
          testData,
          blogsData
        ] = await Promise.all([
          getProfile().catch(() => null),
          getSkills().catch(() => []),
          getProjects().catch(() => []),
          getExperience().catch(() => []),
          getEducation().catch(() => []),
          getServices().catch(() => []),
          getTestimonials().catch(() => []),
          getBlogs().catch(() => [])
        ]);

        setProfile(profData);
        setSkills(skillsData);
        setProjects(projectsData);
        setExperience(expData);
        setEducation(eduData);
        setServices(srvData);
        setTestimonials(testData);
        setBlogs(blogsData);
      } catch (err) {
        console.error("Error loading portfolio data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide">Loading Portfolio from CMS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Sticky Navigation */}
      <Navbar profile={profile} />

      {/* Main Content Flow */}
      <main className="flex-1">
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experience={experience} education={education} />
        <Services services={services} testimonials={testimonials} />
        <Blogs blogs={blogs} />
        <Contact profile={profile} />
      </main>

      {/* Footer */}
      <Footer profile={profile} />
    </div>
  );
}

export default App;
