import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PortfolioNavbar from '../components/Navbar/PortfolioNavbar';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Experience from '../components/Experience/Experience';
import Projects from '../components/Projects/Projects';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';

const FALLBACK = {
  profile: {
    name: 'Morin Fagbodun',
    title: 'Software Engineer Intern',
    subtitle: "Hi, I'm",
    bio: 'Third-year Software Engineering student with internship experience building full-stack and back-end solutions using TypeScript, Node.js, Python, and AWS.',
    email: 'morinfagbodun@gmail.com',
    linkedin: 'https://www.linkedin.com/in/morin-fagbodun-183220260',
    github: 'https://github.com/Morin-Fagbodun',
    education: 'B.Sc. in Software Engineering | Minor in Legal Studies | Rochester Institute of Technology | May 2028',
    experienceYears: 'Internship Experience | Full Stack & Backend | AI/Cloud',
  },
  skills: { languages: [], frontend: [], cloud: [], ai: [] },
  workExperience: [],
  projects: [],
};

const PortfolioPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/portfolio')
      .then(res => setData(res.data))
      .catch(() => setData(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border" style={{ color: 'var(--color-accent)' }} role="status" />
      </div>
    );
  }

  return (
    <>
      <PortfolioNavbar name={data?.profile?.name} />
      <main>
        <Hero profile={data?.profile} />
        <About profile={data?.profile} />
        <Experience skills={data?.skills} workExperience={data?.workExperience} />
        <Projects projects={data?.projects} />
        <Contact profile={data?.profile} />
      </main>
      <Footer name={data?.profile?.name} />
    </>
  );
};

export default PortfolioPage;
