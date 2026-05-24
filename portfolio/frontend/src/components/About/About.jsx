import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const About = ({ profile = {} }) => {
  const {
    bio = '',
    aboutPic = '',
    education = '',
    experienceYears = '',
    name = '',
  } = profile;

  return (
    <section id="about" className="portfolio-section about-section">
      <Container>
        <p className="section-label">Get To Know More</p>
        <h2 className="section-title">About Me</h2>

        <Row className="align-items-center gy-5">
          {/* Photo */}
          <Col lg={4} md={5} className="text-center">
            {aboutPic ? (
              <img src={aboutPic} alt={name} className="about-img" />
            ) : (
              <div className="about-img" style={{
                background: 'var(--color-accent-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem', margin: '0 auto'
              }}>
                🧑‍💻
              </div>
            )}
          </Col>

          {/* Details */}
          <Col lg={8} md={7}>
            <Row className="g-3 mb-4">
              <Col sm={6}>
                <div className="detail-card">
                  <div style={{ fontSize: '1.5rem' }}>💼</div>
                  <h3>Experience</h3>
                  {experienceYears.split('|').map((line, i) => (
                    <p key={i} style={{ fontSize: '0.9rem', marginBottom: 0 }}>{line.trim()}</p>
                  ))}
                </div>
              </Col>
              <Col sm={6}>
                <div className="detail-card">
                  <div style={{ fontSize: '1.5rem' }}>🎓</div>
                  <h3>Education</h3>
                  {education.split('|').map((line, i) => (
                    <p key={i} style={{ fontSize: '0.9rem', marginBottom: 0 }}>{line.trim()}</p>
                  ))}
                </div>
              </Col>
            </Row>
            <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>{bio}</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;
