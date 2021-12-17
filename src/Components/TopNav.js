import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import PropTypes from "prop-types";

TopNav.propTypes = {
  user: PropTypes.object,
}

function TopNav({ user }) {

  const googleAuth = () => {
    window.open('http://localhost:5000/auth/google', '_self')
  }

  const logout = () => {
    window.open("http://localhost:5000/auth/logout", "_self");
  };

  return(
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Salon GLIP</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/kosmetika">Kosmetika</Nav.Link>
            <Nav.Link href="/kadernictvi">Kosmetika</Nav.Link>
            <Nav.Link href="/masaze">Masáže</Nav.Link>
          </Nav>
          <Nav>
            { user ? (
              <NavDropdown title={user.displayName} id="collasible-nav-dropdown">
                <NavDropdown.Item href="/profile">Profil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/#" onClick={() => logout()}>Odhlásit se</NavDropdown.Item>
              </NavDropdown>
              ) : (
              <Nav.Link href='#' onClick={() => googleAuth()}>
                Přihlásit se pomocí Google
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default TopNav;