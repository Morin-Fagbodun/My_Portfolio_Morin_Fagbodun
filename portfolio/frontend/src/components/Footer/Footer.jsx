import React from 'react';
import { Container, Row, Col, Nav, NavItem, NavLink } from 'reactstrap';

const Footer = ({ name = 'Morin Fagbodun' }) => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="portfolio-footer">
      <Container>
        <Row className="align-items-center gy-3">
          <Col md={6} className="text-center text-md-start">
            <span style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: '1.1rem' }}>
              {name}
            </span>
          </Col>
          <Col md={6}>
            <Nav className="justify-content-center justify-content-md-end">
              {['about', 'experience', 'projects', 'contact'].map((s) => (
                <NavItem key={s}>
                  <NavLink
                    href={`#${s}`}
                    onClick={(e) => { e.preventDefault(); scrollTo(s); }}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {s}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </Col>
        </Row>
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />
        <p className="text-center mb-0" style={{ fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} {name}. All Rights Reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
