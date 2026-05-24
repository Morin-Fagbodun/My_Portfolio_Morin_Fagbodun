import React, { useState } from 'react';
import {
  Container, Row, Col,
  Modal, ModalHeader, ModalBody,
  Button, Badge
} from 'reactstrap';

const ProjectCard = ({ project, onClick }) => (
  <div className="project-card h-100" onClick={() => onClick(project)}>
    {project.image ? (
      <img
        src={project.image}
        alt={project.title}
        className="project-img"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    ) : (
      <div className="project-img-placeholder">🚀</div>
    )}
    <div className="project-body">
      <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
        {project.title}
      </h5>
      <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem', WebkitLineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
        {project.description}
      </p>
      <div>
        {(project.tags || []).map((tag) => (
          <span key={tag} className="project-tag">{tag}</span>
        ))}
      </div>
    </div>
  </div>
);

const ProjectModal = ({ project, isOpen, toggle }) => {
  if (!project) return null;
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle} style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
        {project.title}
      </ModalHeader>
      <ModalBody>
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="project-modal-img"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <p style={{ marginBottom: '1.25rem', lineHeight: '1.8' }}>{project.description}</p>

        {(project.tags || []).length > 0 && (
          <div className="mb-3">
            <strong style={{ fontSize: '0.85rem', marginRight: '0.5rem' }}>Tech Stack:</strong>
            {project.tags.map((tag) => (
              <span key={tag} className="project-tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="d-flex gap-3 mt-3 flex-wrap">
          {project.githubUrl && (
            <Button
              className="btn-outline-custom"
              tag="a"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </Button>
          )}
          {project.liveUrl && (
            <Button
              className="btn-primary-custom"
              tag="a"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              Live Demo
            </Button>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

const Projects = ({ projects = [] }) => {
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openProject = (project) => {
    setSelected(project);
    setModalOpen(true);
  };

  return (
    <section id="projects" className="portfolio-section projects-section">
      <Container>
        <p className="section-label">Browse My Recent</p>
        <h2 className="section-title">Projects</h2>

        <Row className="g-4">
          {projects.map((project) => (
            <Col key={project.id} lg={4} md={6}>
              <ProjectCard project={project} onClick={openProject} />
            </Col>
          ))}
        </Row>
      </Container>

      <ProjectModal
        project={selected}
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
      />
    </section>
  );
};

export default Projects;
