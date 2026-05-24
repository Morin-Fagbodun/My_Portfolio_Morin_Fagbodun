import React, { useState } from 'react';
import { Container, Row, Col, Badge } from 'reactstrap';

// ── Work Experience Card ───────────────────────────────────────────────────────
const WorkCard = ({ job }) => (
  <div style={{
    background: 'white',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    padding: '1.75rem',
    marginBottom: '1.25rem',
    boxShadow: 'var(--shadow)',
    borderLeft: '4px solid var(--color-accent)',
  }}>
    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
      <div>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '0.15rem' }}>
          {job.role}
        </h4>
        <p style={{ fontWeight: 600, color: 'var(--color-accent)', margin: 0, fontSize: '0.95rem' }}>
          {job.company}
        </p>
      </div>
      <div className="text-end">
        <span style={{
          background: 'var(--color-accent-light)',
          color: 'var(--color-accent)',
          padding: '0.25rem 0.75rem',
          borderRadius: '100px',
          fontSize: '0.8rem',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          {job.period}
        </span>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-light)', marginTop: '0.25rem', marginBottom: 0 }}>
          📍 {job.location}
        </p>
      </div>
    </div>

    <ul style={{ paddingLeft: '1.25rem', margin: '0.75rem 0', color: 'var(--color-mid)' }}>
      {(job.bullets || []).map((b, i) => (
        <li key={i} style={{ marginBottom: '0.4rem', lineHeight: '1.6', fontSize: '0.92rem' }}>{b}</li>
      ))}
    </ul>

    <div className="mt-2">
      {(job.tags || []).map(tag => (
        <span key={tag} className="project-tag" style={{ marginRight: '0.3rem', marginBottom: '0.3rem', display: 'inline-block' }}>
          {tag}
        </span>
      ))}
    </div>
  </div>
);

// ── Skill Item ────────────────────────────────────────────────────────────────
const SkillItem = ({ name, level }) => (
  <div className="skill-item">
    <span className="skill-check">✓</span>
    <div>
      <span className="skill-name">{name}</span>
      <span className="skill-level ms-2">— {level}</span>
    </div>
  </div>
);

const SKILL_TABS = [
  { key: 'languages', label: '💻 Languages' },
  { key: 'frontend',  label: '🎨 Frameworks' },
  { key: 'cloud',     label: '☁️ Cloud & DevOps' },
  { key: 'ai',        label: '🤖 AI / ML' },
];

// ── Main Component ────────────────────────────────────────────────────────────
const Experience = ({ skills = {}, workExperience = [] }) => {
  const [activeSkillTab, setActiveSkillTab] = useState('languages');

  const activeSkills = skills[activeSkillTab] || [];

  return (
    <section id="experience" className="portfolio-section">
      <Container>
        <p className="section-label">Explore My</p>
        <h2 className="section-title">Experience</h2>

        <Row className="g-5">
          {/* ── Left: Work Experience ── */}
          <Col lg={7}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              marginBottom: '1.25rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid var(--color-border)',
            }}>
              Work History
            </h3>
            {workExperience.length === 0 ? (
              <p className="text-muted">No work experience added yet.</p>
            ) : (
              workExperience.map(job => <WorkCard key={job.id} job={job} />)
            )}
          </Col>

          {/* ── Right: Skills ── */}
          <Col lg={5}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              marginBottom: '1.25rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid var(--color-border)',
            }}>
              Technical Skills
            </h3>

            {/* Tab buttons */}
            <div className="d-flex flex-wrap gap-2 mb-3">
              {SKILL_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveSkillTab(tab.key)}
                  style={{
                    background: activeSkillTab === tab.key ? 'var(--color-dark)' : 'white',
                    color: activeSkillTab === tab.key ? 'white' : 'var(--color-mid)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '100px',
                    padding: '0.35rem 0.9rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Skill list */}
            <div className="skill-card">
              {activeSkills.length === 0 ? (
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>No skills in this category yet.</p>
              ) : (
                activeSkills.map(skill => (
                  <SkillItem key={skill.id} name={skill.name} level={skill.level} />
                ))
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Experience;
