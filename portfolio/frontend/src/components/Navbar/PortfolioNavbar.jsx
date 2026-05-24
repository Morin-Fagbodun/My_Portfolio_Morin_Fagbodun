import React, { useState } from 'react';
import {
  Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink
} from 'reactstrap';

const PortfolioNavbar = ({ name = 'Morin Fagbodun' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const scrollTo = (id) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Navbar className="portfolio-nav" expand="md" container>
      <NavbarBrand href="#" className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        {name}
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ms-auto" navbar>
          {['about', 'experience', 'projects', 'contact'].map((section) => (
            <NavItem key={section}>
              <NavLink
                href={`#${section}`}
                onClick={(e) => { e.preventDefault(); scrollTo(section); }}
                style={{ textTransform: 'capitalize' }}
              >
                {section}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default PortfolioNavbar;
