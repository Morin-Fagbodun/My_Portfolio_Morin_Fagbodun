import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Row, Col, Nav, NavItem, NavLink,
  Form, FormGroup, Label, Input, Button, Alert,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Badge, Spinner
} from 'reactstrap';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

// ── Helpers ───────────────────────────────────────────────────────────────────
const Field = ({ label, name, value, onChange, type = 'text', rows }) => (
  <FormGroup>
    <Label style={{ fontWeight: 500, fontSize: '0.85rem' }}>{label}</Label>
    {type === 'textarea' ? (
      <Input type="textarea" name={name} value={value} onChange={onChange} rows={rows || 3} />
    ) : (
      <Input type={type} name={name} value={value} onChange={onChange} />
    )}
  </FormGroup>
);

const saveBtn = { background: 'var(--color-dark)', border: 'none', borderRadius: '0.5rem', fontWeight: 600 };

// ── Profile Panel ─────────────────────────────────────────────────────────────
const ProfilePanel = ({ profile: init }) => {
  const [form, setForm] = useState(init || {});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const api = useApi();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    setSaving(true); setMsg(null);
    try { await api.updateProfile(form); setMsg({ type: 'success', text: 'Profile saved!' }); }
    catch { setMsg({ type: 'danger', text: 'Save failed.' }); }
    finally { setSaving(false); }
  };

  const fields = [
    { label: 'Full Name', name: 'name' },
    { label: 'Title / Role', name: 'title' },
    { label: 'Greeting Line', name: 'subtitle' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'LinkedIn URL', name: 'linkedin' },
    { label: 'GitHub URL', name: 'github' },
    { label: 'Resume URL', name: 'resumeUrl' },
    { label: 'Profile Picture URL', name: 'profilePic' },
    { label: 'About Photo URL', name: 'aboutPic' },
    { label: 'Experience Summary (use | to separate lines)', name: 'experienceYears' },
    { label: 'Education (use | to separate lines)', name: 'education' },
    { label: 'Bio', name: 'bio', type: 'textarea', rows: 4 },
  ];

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">✏️ Profile Information</h3>
      {msg && <Alert color={msg.type} className="py-2">{msg.text}</Alert>}
      <Form>
        <Row className="g-3">
          {fields.map(f => (
            <Col key={f.name} md={f.type === 'textarea' ? 12 : 6}>
              <Field label={f.label} name={f.name} type={f.type || 'text'} rows={f.rows} value={form[f.name] || ''} onChange={handleChange} />
            </Col>
          ))}
        </Row>
        <Button onClick={save} disabled={saving} style={saveBtn}>
          {saving ? <Spinner size="sm" /> : 'Save Profile'}
        </Button>
      </Form>
    </div>
  );
};

// ── Skills Panel ──────────────────────────────────────────────────────────────
const SKILL_CATS = [
  { key: 'languages', label: 'Languages' },
  { key: 'frontend',  label: 'Frameworks & Libraries' },
  { key: 'cloud',     label: 'Cloud & DevOps' },
  { key: 'ai',        label: 'AI / ML' },
];

const SkillsPanel = ({ skills: init }) => {
  const [skills, setSkills] = useState(init || {});
  const [newSkill, setNewSkill] = useState({ category: 'languages', name: '', level: 'Beginner' });
  const [msg, setMsg] = useState(null);
  const api = useApi();

  const addSkill = async () => {
    if (!newSkill.name) return;
    try {
      const res = await api.addSkill(newSkill.category, newSkill.name, newSkill.level);
      const updated = { ...skills };
      if (!updated[newSkill.category]) updated[newSkill.category] = [];
      updated[newSkill.category].push(res.data.skill);
      setSkills(updated);
      setNewSkill({ ...newSkill, name: '' });
      setMsg({ type: 'success', text: 'Skill added!' });
    } catch { setMsg({ type: 'danger', text: 'Failed to add skill.' }); }
  };

  const removeSkill = async (category, id) => {
    try {
      await api.deleteSkill(category, id);
      setSkills(prev => ({ ...prev, [category]: prev[category].filter(s => s.id !== id) }));
    } catch { setMsg({ type: 'danger', text: 'Failed to delete skill.' }); }
  };

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">🛠️ Skills</h3>
      {msg && <Alert color={msg.type} className="py-2">{msg.text}</Alert>}

      {SKILL_CATS.map(({ key, label }) => (
        <div key={key} className="mb-4">
          <h5 style={{ marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 600 }}>{label}</h5>
          <div className="d-flex flex-wrap gap-2">
            {(skills[key] || []).map(skill => (
              <Badge key={skill.id}
                style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)', padding: '0.4rem 0.7rem', fontWeight: 500, cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={() => removeSkill(key, skill.id)} title="Click to remove">
                {skill.name} — {skill.level} ✕
              </Badge>
            ))}
            {!(skills[key] || []).length && <span style={{ fontSize: '0.8rem', color: 'var(--color-light)' }}>No skills yet</span>}
          </div>
        </div>
      ))}

      <hr />
      <h6 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Add a New Skill</h6>
      <Row className="g-2 align-items-end">
        <Col sm={3}>
          <Label style={{ fontSize: '0.85rem' }}>Category</Label>
          <Input type="select" value={newSkill.category} onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}>
            {SKILL_CATS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </Input>
        </Col>
        <Col sm={3}>
          <Label style={{ fontSize: '0.85rem' }}>Skill Name</Label>
          <Input value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} placeholder="e.g. TypeScript" />
        </Col>
        <Col sm={3}>
          <Label style={{ fontSize: '0.85rem' }}>Level</Label>
          <Input type="select" value={newSkill.level} onChange={e => setNewSkill({ ...newSkill, level: e.target.value })}>
            {['Beginner', 'Intermediate', 'Proficient', 'Expert'].map(l => <option key={l}>{l}</option>)}
          </Input>
        </Col>
        <Col sm={3}>
          <Button onClick={addSkill} block style={saveBtn}>+ Add</Button>
        </Col>
      </Row>
    </div>
  );
};

// ── Work Experience Panel ──────────────────────────────────────────────────────
const emptyJob = { company: '', role: '', location: '', period: '', bullets: '', tags: '' };

const WorkPanel = ({ work: initWork }) => {
  const [jobs, setJobs] = useState(initWork || []);
  const [modal, setModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState(emptyJob);
  const [msg, setMsg] = useState(null);
  const api = useApi();

  const openNew = () => { setEditingJob(null); setForm(emptyJob); setModal(true); };
  const openEdit = (j) => {
    setEditingJob(j);
    setForm({ ...j, bullets: (j.bullets || []).join('\n'), tags: (j.tags || []).join(', ') });
    setModal(true);
  };
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    const payload = {
      ...form,
      bullets: form.bullets.split('\n').map(b => b.trim()).filter(Boolean),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      // Work experience is stored in portfolio.json — we update via profile endpoint trick
      // Actually we update the full workExperience array via a direct PUT
      let updated;
      if (editingJob) {
        updated = jobs.map(j => j.id === editingJob.id ? { ...payload, id: editingJob.id } : j);
      } else {
        updated = [...jobs, { ...payload, id: Date.now() }];
      }
      await api.updateWorkExperience(updated);
      setJobs(updated);
      setModal(false);
      setMsg({ type: 'success', text: editingJob ? 'Job updated!' : 'Job added!' });
    } catch { setMsg({ type: 'danger', text: 'Save failed.' }); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    const updated = jobs.filter(j => j.id !== id);
    try {
      await api.updateWorkExperience(updated);
      setJobs(updated);
    } catch { setMsg({ type: 'danger', text: 'Delete failed.' }); }
  };

  return (
    <div className="admin-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="admin-card-title mb-0">💼 Work Experience</h3>
        <Button onClick={openNew} size="sm" style={{ background: 'var(--color-accent)', border: 'none', borderRadius: '0.5rem', fontWeight: 600 }}>
          + Add Job
        </Button>
      </div>
      {msg && <Alert color={msg.type} className="py-2">{msg.text}</Alert>}

      {jobs.map(job => (
        <div key={job.id} style={{ border: '1px solid var(--color-border)', borderLeft: '4px solid var(--color-accent)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <strong>{job.role}</strong>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-accent)' }}>{job.company} · {job.location}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-light)' }}>{job.period}</p>
            </div>
            <div className="d-flex gap-2">
              <Button size="sm" outline onClick={() => openEdit(job)} style={{ borderRadius: '0.4rem', fontSize: '0.8rem' }}>Edit</Button>
              <Button size="sm" color="danger" outline onClick={() => remove(job.id)} style={{ borderRadius: '0.4rem', fontSize: '0.8rem' }}>Delete</Button>
            </div>
          </div>
        </div>
      ))}

      <Modal isOpen={modal} toggle={() => setModal(false)} size="lg" centered>
        <ModalHeader toggle={() => setModal(false)}>{editingJob ? 'Edit Job' : 'Add New Job'}</ModalHeader>
        <ModalBody>
          <Row className="g-3">
            <Col md={6}><Field label="Company" name="company" value={form.company} onChange={handleChange} /></Col>
            <Col md={6}><Field label="Role / Title" name="role" value={form.role} onChange={handleChange} /></Col>
            <Col md={6}><Field label="Location" name="location" value={form.location} onChange={handleChange} /></Col>
            <Col md={6}><Field label="Period (e.g. May 2025 – Aug 2025)" name="period" value={form.period} onChange={handleChange} /></Col>
            <Col md={12}><Field label="Bullet Points (one per line)" name="bullets" type="textarea" rows={5} value={form.bullets} onChange={handleChange} /></Col>
            <Col md={12}><Field label="Tags (comma-separated)" name="tags" value={form.tags} onChange={handleChange} /></Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setModal(false)} outline style={{ borderRadius: '0.5rem' }}>Cancel</Button>
          <Button onClick={save} style={saveBtn}>{editingJob ? 'Save Changes' : 'Add Job'}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

// ── Projects Panel ─────────────────────────────────────────────────────────────
const emptyProject = { title: '', description: '', image: '', githubUrl: '', liveUrl: '', tags: '', featured: false };

const ProjectsPanel = ({ projects: initProjects }) => {
  const [projects, setProjects] = useState(initProjects || []);
  const [modal, setModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [msg, setMsg] = useState(null);
  const api = useApi();

  const openNew = () => { setEditingProject(null); setForm(emptyProject); setModal(true); };
  const openEdit = (p) => { setEditingProject(p); setForm({ ...p, tags: (p.tags || []).join(', ') }); setModal(true); };
  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const save = async () => {
    const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
    try {
      if (editingProject) {
        const res = await api.updateProject(editingProject.id, payload);
        setProjects(prev => prev.map(p => p.id === editingProject.id ? res.data.project : p));
        setMsg({ type: 'success', text: 'Project updated!' });
      } else {
        const res = await api.addProject(payload);
        setProjects(prev => [...prev, res.data.project]);
        setMsg({ type: 'success', text: 'Project added!' });
      }
      setModal(false);
    } catch { setMsg({ type: 'danger', text: 'Save failed.' }); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await api.deleteProject(id); setProjects(prev => prev.filter(p => p.id !== id)); }
    catch { setMsg({ type: 'danger', text: 'Delete failed.' }); }
  };

  return (
    <div className="admin-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="admin-card-title mb-0">🚀 Projects</h3>
        <Button onClick={openNew} size="sm" style={{ background: 'var(--color-accent)', border: 'none', borderRadius: '0.5rem', fontWeight: 600 }}>+ New Project</Button>
      </div>
      {msg && <Alert color={msg.type} className="py-2">{msg.text}</Alert>}
      {projects.length === 0 && <p className="text-muted text-center py-3">No projects yet.</p>}
      <Row className="g-3">
        {projects.map(p => (
          <Col key={p.id} md={6} lg={4}>
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ height: '100px', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                {p.image ? <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} /> : '🚀'}
              </div>
              <div style={{ padding: '0.75rem' }}>
                <strong style={{ fontSize: '0.9rem' }}>{p.title}</strong>
                <p style={{ fontSize: '0.78rem', margin: '0.2rem 0 0.5rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.description}</p>
                <div className="d-flex gap-2">
                  <Button size="sm" outline onClick={() => openEdit(p)} style={{ borderRadius: '0.4rem', fontSize: '0.8rem' }}>Edit</Button>
                  <Button size="sm" color="danger" outline onClick={() => remove(p.id)} style={{ borderRadius: '0.4rem', fontSize: '0.8rem' }}>Delete</Button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Modal isOpen={modal} toggle={() => setModal(false)} size="lg" centered>
        <ModalHeader toggle={() => setModal(false)}>{editingProject ? 'Edit Project' : 'Add New Project'}</ModalHeader>
        <ModalBody>
          <Row className="g-3">
            <Col md={6}><Field label="Title" name="title" value={form.title} onChange={handleChange} /></Col>
            <Col md={6}><Field label="GitHub URL" name="githubUrl" value={form.githubUrl} onChange={handleChange} /></Col>
            <Col md={6}><Field label="Live Demo URL (optional)" name="liveUrl" value={form.liveUrl} onChange={handleChange} /></Col>
            <Col md={6}><Field label="Image URL" name="image" value={form.image} onChange={handleChange} /></Col>
            <Col md={12}><Field label="Tags (comma-separated)" name="tags" value={form.tags} onChange={handleChange} /></Col>
            <Col md={12}><Field label="Description" name="description" type="textarea" rows={4} value={form.description} onChange={handleChange} /></Col>
            <Col md={12}>
              <FormGroup check>
                <Input type="checkbox" name="featured" checked={!!form.featured} onChange={handleChange} />
                <Label check style={{ fontSize: '0.9rem' }}>Featured project</Label>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setModal(false)} outline style={{ borderRadius: '0.5rem' }}>Cancel</Button>
          <Button onClick={save} style={saveBtn}>{editingProject ? 'Save Changes' : 'Add Project'}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

// ── Password Panel ─────────────────────────────────────────────────────────────
const PasswordPanel = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState(null);
  const api = useApi();

  const save = async () => {
    if (newPassword !== confirm) { setMsg({ type: 'danger', text: "Passwords don't match." }); return; }
    if (newPassword.length < 6) { setMsg({ type: 'danger', text: 'At least 6 characters required.' }); return; }
    try { await api.changePassword(newPassword); setMsg({ type: 'success', text: 'Password updated!' }); setNewPassword(''); setConfirm(''); }
    catch { setMsg({ type: 'danger', text: 'Update failed.' }); }
  };

  return (
    <div className="admin-card">
      <h3 className="admin-card-title">🔐 Change Password</h3>
      {msg && <Alert color={msg.type} className="py-2">{msg.text}</Alert>}
      <Row>
        <Col md={4}>
          <FormGroup><Label style={{ fontSize: '0.85rem', fontWeight: 500 }}>New Password</Label>
            <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} /></FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup><Label style={{ fontSize: '0.85rem', fontWeight: 500 }}>Confirm Password</Label>
            <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} /></FormGroup>
        </Col>
        <Col md={4} className="d-flex align-items-end">
          <Button onClick={save} style={{ ...saveBtn, marginBottom: '1rem' }}>Update Password</Button>
        </Col>
      </Row>
    </div>
  );
};

// ── Main Admin Page ───────────────────────────────────────────────────────────
const TABS = [
  { key: 'projects',  icon: '🚀', label: 'Projects' },
  { key: 'work',      icon: '💼', label: 'Work Experience' },
  { key: 'skills',    icon: '🛠️', label: 'Skills' },
  { key: 'profile',   icon: '👤', label: 'Profile' },
  { key: 'password',  icon: '🔐', label: 'Security' },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    api.getPortfolio()
      .then(res => setData(res.data))
      .catch(() => setData({ profile: {}, skills: {}, projects: [], workExperience: [] }))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const currentLabel = TABS.find(t => t.key === activeTab)?.label || '';

  return (
    <div style={{ display: 'flex' }}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">⚙️ Admin Panel</div>
        <Nav vertical>
          {TABS.map(tab => (
            <NavItem key={tab.key}>
              <NavLink href="#" className={activeTab === tab.key ? 'active' : ''}
                onClick={e => { e.preventDefault(); setActiveTab(tab.key); }}>
                {tab.icon} {tab.label}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <NavLink href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'block' }}>
            ← View Portfolio
          </NavLink>
          <NavLink href="#" onClick={e => { e.preventDefault(); handleLogout(); }}
            style={{ color: 'rgba(255,100,100,0.8)', fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'block' }}>
            🚪 Logout
          </NavLink>
        </div>
      </aside>

      <main className="admin-main">
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>{currentLabel}</h2>
        {loading ? (
          <div className="text-center py-5"><Spinner /></div>
        ) : (
          <>
            {activeTab === 'profile'  && <ProfilePanel profile={data?.profile} />}
            {activeTab === 'skills'   && <SkillsPanel skills={data?.skills} />}
            {activeTab === 'work'     && <WorkPanel work={data?.workExperience} />}
            {activeTab === 'projects' && <ProjectsPanel projects={data?.projects} />}
            {activeTab === 'password' && <PasswordPanel />}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
