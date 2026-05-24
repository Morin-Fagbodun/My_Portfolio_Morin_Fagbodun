import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const Contact = ({ profile = {} }) => {
  const { email = '', linkedin = '' } = profile;

  return (
    <section id="contact" className="portfolio-section">
      <Container>
        <p className="section-label">Get In Touch</p>
        <h2 className="section-title">Contact Me</h2>

        <Row className="justify-content-center g-4">
          {email && (
            <Col md={5}>
              <a
                href={`mailto:${email}`}
                className="contact-card"
                style={{ color: 'var(--color-dark)' }}
              >
                <div className="contact-icon-wrap">
                  <span style={{ fontSize: '1.25rem' }}>✉️</span>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--color-light)' }}>Email</p>
                  <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-dark)' }}>{email}</p>
                </div>
              </a>
            </Col>
          )}
          {linkedin && (
            <Col md={5}>
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="contact-card"
                style={{ color: 'var(--color-dark)' }}
              >
                <div className="contact-icon-wrap">
                  <span style={{ fontSize: '1.25rem' }}>💼</span>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--color-light)' }}>LinkedIn</p>
                  <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-dark)' }}>View Profile</p>
                </div>
              </a>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default Contact;
