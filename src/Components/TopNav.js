import React, { Children } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import PropTypes from "prop-types";

TopNav.propTypes = {
  user: PropTypes.object,
  googleAuth: PropTypes.func,
  logout: PropTypes.func,
  services: PropTypes.array,
}

function TopNav({ user, googleAuth, logout, services }) {
  const renderAdminNav = () => {
    if (user.role === 'admin' && user.isAdmin) {
      return(
        <NavDropdown title="Administrace" id="collasible-nav-dropdown">
          {Children.toArray(services.map(service =>
            <NavDropdown.Item as={Link} to={`/${service.name}/prehled`} key={service._id + "-admNav"}>{service.displayName}</NavDropdown.Item>) )
          }
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to="/admin/uzivatele">Uživatelé</NavDropdown.Item>
        </NavDropdown>
      )
    } else {
      const service = services.find(s => s.name === user?.role);
      if (!service) return null;
      return (
        <Nav.Link as={Link} to={`/${service.name}/prehled`}>Administrace</Nav.Link>
      )
    }
  }

  const renderLoginNav = () => {
    if (!user) return (
      <Nav.Link href='#' onClick={googleAuth}>
        Přihlásit se pomocí Google
      </Nav.Link> )

    if (user.role === 'user') return (
      <NavDropdown title={user.displayName} id="collasible-nav-dropdown">
        <NavDropdown.Item href="/profil">Profil</NavDropdown.Item>
        <NavDropdown.Item href="/objednavky/seznam">Moje objednávky</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/#" onClick={logout}>Odhlásit se</NavDropdown.Item>
      </NavDropdown> )
    else return (
      <NavDropdown title={user.displayName} id="collasible-nav-dropdown">
        <NavDropdown.Item as={Link} to="/profil">Profil</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item as={Link} to="/" onClick={logout}>Odhlásit se</NavDropdown.Item>
      </NavDropdown> )
  };

  if (services)  return(
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">Salon GLIP</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {Children.toArray(services.map(service =>
              <Nav.Link as={Link} to={"/" + service.name} key={service._id}>{service.displayName}</Nav.Link>
              ))
            }
            { user && user.role !== 'user' ? renderAdminNav() : <></>}
          </Nav>
          <Nav>
            { renderLoginNav() }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
  else return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand to="/">Salon GLIP</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}

export default TopNav;