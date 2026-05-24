import React, { useState } from 'react';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

const ResumeModal = ({ isOpen, toggle, resumeUrl }) => {
  // Build the full URL so the embed and download both work
  const fullUrl = resumeUrl.startsWith('http')
    ? resumeUrl
    : `http://localhost:5000${resumeUrl}`;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl" centered>
      <ModalHeader
        toggle={toggle}
        style={{ fontFamily: 'var(--font-display)', borderBottom: '1px solid var(--color-border)' }}
      >
        Resume
      </ModalHeader>
      <ModalBody style={{ padding: 0 }}>
        {/* PDF embed — works in all modern browsers */}
        <iframe
          src={fullUrl}
          title="Resume"
          width="100%"
          style={{ height: '80vh', border: 'none', display: 'block' }}
        />

        {/* Fallback + download bar */}
        <div style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          background: 'var(--color-bg)',
        }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-light)' }}>
            PDF not showing? Use the download button →
          </p>
          <a
            href={fullUrl}
            download="Morin_Fagbodun_Resume.pdf"
            style={{
              background: 'var(--color-dark)',
              color: 'white',
              padding: '0.5rem 1.25rem',
              borderRadius: '100px',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            ⬇ Download PDF
          </a>
        </div>
      </ModalBody>
    </Modal>
  );
};

const Hero = ({ profile = {} }) => {
  const [resumeOpen, setResumeOpen] = useState(false);

  const {
    name = 'Morin Fagbodun',
    title = 'Software Engineer',
    subtitle = "Hi, I'm",
    resumeUrl = '',
    profilePic = '',
    linkedin = '',
    github = '',
  } = profile;

  return (
    <section id="profile" className="hero-section portfolio-section">
      <Container>
        <Row className="align-items-center gy-5">
          {/* Image */}
          <Col md={5} className="text-center">
            <div className="hero-img-wrapper">
              {profilePic ? (
                <img src={profilePic} alt={name} className="hero-img" />
              ) : (
                <div className="hero-img" style={{
                  background: 'linear-gradient(135deg, #e8f4f0, #2d6a4f22)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '4rem',
                }}>
                  👤
                </div>
              )}
            </div>
          </Col>

          {/* Text */}
          <Col md={7}>
            <p className="hero-text-greeting">{subtitle}</p>
            <h1 className="hero-name">{name}</h1>
            <p className="hero-role">{title}</p>

            <div className="d-flex flex-wrap gap-3 mb-4">
              {resumeUrl && (
                <Button
                  className="btn-outline-custom"
                  onClick={() => setResumeOpen(true)}
                >
                  View Resume
                </Button>
              )}
              <Button
                className="btn-primary-custom"
                onClick={() => {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Contact Info
              </Button>
            </div>

            <div className="d-flex gap-3">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <img src="/assets/linkedin.png" alt="LinkedIn" className="social-icon" />
                </a>
              )}
              {github && (
                <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <img src="/assets/github.png" alt="GitHub" className="social-icon" />
                </a>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      <ResumeModal
        isOpen={resumeOpen}
        toggle={() => setResumeOpen(false)}
        resumeUrl={resumeUrl}
      />
    </section>
  );
};

export default Hero;
