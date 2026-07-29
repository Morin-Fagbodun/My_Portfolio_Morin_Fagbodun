import axios from 'axios';
import { useAuth } from '../context/AuthContext';


const BASE_URL = process.env.REACT_APP_API_URL || 'https://my-portfolio-morin-fagbodun.onrender.com';
const BASE = `${BASE_URL}/api`;

export const useApi = () => {
  const { token } = useAuth();

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    // ── Public ───────────────────────────────────────────────────────────────
    getPortfolio: () => axios.get(`${BASE}/portfolio`),
    getProjects:  () => axios.get(`${BASE}/projects`),

    // ── Auth ─────────────────────────────────────────────────────────────────
    login: (username, password) =>
      axios.post(`${BASE}/auth/login`, { username, password }),
    changePassword: (newPassword) =>
      axios.post(`${BASE}/auth/change-password`, { newPassword }, authHeaders()),

    // ── Admin: Profile ────────────────────────────────────────────────────────
    updateProfile: (profileData) =>
      axios.put(`${BASE}/portfolio/profile`, profileData, authHeaders()),

    // ── Admin: Skills ─────────────────────────────────────────────────────────
    updateSkills: (skillsData) =>
      axios.put(`${BASE}/portfolio/skills`, skillsData, authHeaders()),
    addSkill: (category, name, level) =>
      axios.post(`${BASE}/portfolio/skills/item`, { category, name, level }, authHeaders()),
    deleteSkill: (category, id) =>
      axios.delete(`${BASE}/portfolio/skills/${category}/${id}`, authHeaders()),

    // ── Admin: Projects ───────────────────────────────────────────────────────
    addProject: (projectData) =>
      axios.post(`${BASE}/portfolio/projects`, projectData, authHeaders()),
    updateProject: (id, projectData) =>
      axios.put(`${BASE}/portfolio/projects/${id}`, projectData, authHeaders()),
    deleteProject: (id) =>
      axios.delete(`${BASE}/portfolio/projects/${id}`, authHeaders()),

    // ── Admin: Work Experience ────────────────────────────────────────────────
    updateWorkExperience: (workArray) =>
      axios.put(`${BASE}/portfolio/work`, workArray, authHeaders()),
  };
};
