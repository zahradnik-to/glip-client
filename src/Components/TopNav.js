import React, { Children } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import PropTypes from "prop-types";

TopNav.propTypes = {
  user: PropTypes.object,
  googleAuth: PropTypes.func,
  logout: PropTypes.func,
  services: PropTypes.array,
}

const typeOfServicesEnum = {
  hair: "kadernictvi",
  massage: "masaze",
  cosmetics: "kosmetika",
}

function TopNav({ user, googleAuth, logout, services }) {
  const renderAdminNav = () => {
    if (user.role === 'admin' && user.isAdmin) {
      return(
        <NavDropdown title="Administrace" id="collasible-nav-dropdown">
          {Children.toArray(services.map(service =>
            <NavDropdown.Item href={"/" + service.name + "/prehled"} key={service._id + "-admNav"}>{service.displayName}</NavDropdown.Item>))
          }
          <NavDropdown.Divider />
          <NavDropdown.Item href="/admin/uzivatele">Uživatelé</NavDropdown.Item>
        </NavDropdown>
      )
    } else if (Object.keys(typeOfServicesEnum).includes(user.role)) {
      return (
        <Nav.Link href={`/${typeOfServicesEnum[user.role]}/prehled`}>Administrace</Nav.Link>
      )
    }
    return null;
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
        <NavDropdown.Item href="/profil">Profil</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/#" onClick={logout}>Odhlásit se</NavDropdown.Item>
      </NavDropdown> )
  };

  return(
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Salon GLIP</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {Children.toArray(services.map(service =>
              <Nav.Link href={"/" + service.name} key={service._id}>{service.displayName}</Nav.Link>))
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
}

export default TopNav;