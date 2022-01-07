import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import PropTypes from "prop-types";

TopNav.propTypes = {
  user: PropTypes.object,
  googleAuth: PropTypes.func,
  logout: PropTypes.func,
}

function TopNav({ user, googleAuth, logout }) {
  return(
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Salon GLIP</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/kosmetika">Kosmetika</Nav.Link>
            <Nav.Link href="/kadernictvi">Kadeřnictví</Nav.Link>
            <Nav.Link href="/masaze">Masáže</Nav.Link>
            <NavDropdown title="Administrace" id="collasible-nav-dropdown">
              <NavDropdown.Item className='disabled' href="#">Objednavky</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/kosmetika/objednavky">Kosmetika</NavDropdown.Item>
              <NavDropdown.Item href="/kadernictvi/objednavky">Kadeřnictví</NavDropdown.Item>
              <NavDropdown.Item href="/masaze/objednavky">Masáže</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/admin/procedury">Procedury</NavDropdown.Item>
              <NavDropdown.Item href="/admin/uzivatele">Uživatelé</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            { user ? (
              <NavDropdown title={user.displayName} id="collasible-nav-dropdown">
                <NavDropdown.Item href="/profile">Profil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/#" onClick={logout}>Odhlásit se</NavDropdown.Item>
              </NavDropdown>
              ) : (
              <Nav.Link href='#' onClick={googleAuth}>
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