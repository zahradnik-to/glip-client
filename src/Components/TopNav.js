import React, { Children } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import PropTypes from "prop-types";

TopNav.propTypes = {
  user: PropTypes.object,
  googleAuth: PropTypes.func,
  logout: PropTypes.func,
  serviceList: PropTypes.array,
}

function TopNav({ user, googleAuth, logout, serviceList }) {
  const renderAdminNav = () => {
    if (user.role === 'admin' && user.isAdmin) {
      return(
        <NavDropdown title="Administrace" id="collasible-nav-dropdown">
          {Children.toArray(serviceList.map(service =>
            <NavDropdown.Item as={Link} to={`/${service.name}/prehled`} key={service._id + "-admNav"}>{service.displayName}</NavDropdown.Item>) )
          }
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to="/admin/uzivatele">Uživatelé</NavDropdown.Item>
        </NavDropdown>
      )
    } else {
      const service = serviceList.find(s => s.name === user?.role);
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

    return (
      <NavDropdown title={user.displayName} id="collasible-nav-dropdown">
        <NavDropdown.Item href="/profil">Profil</NavDropdown.Item>
        <NavDropdown.Item href="/rezervace/seznam">Moje rezervace</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/#" onClick={logout}>Odhlásit se</NavDropdown.Item>
      </NavDropdown>
    )
  };

  if (serviceList)  return(
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">Salon GLIP</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {Children.toArray(serviceList.map(service =>
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