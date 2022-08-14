import React from "react";
import { Col, Row, Nav } from "react-bootstrap";
import PropTypes from "prop-types";
import Overview from "../../Components/AdminMenu/Overview";
import ProceduresList from "../../Components/CrudForms/ProceduresList";
import Vacation from "../../Components/AdminMenu/Vacation";
import { Link } from "react-router-dom";
import ErrorPage from "../ErrorPage";

AdminMenuPage.propTypes = {
  typeOfService: PropTypes.object.isRequired,
  page: PropTypes.string.isRequired,
  user: PropTypes.object,
}

function AdminMenuPage({ typeOfService, page, user }) {
  if (!user) {
    return <ErrorPage err={{ status:403 }}/>
  } else {
    if (user.role !== typeOfService && !user.isAdmin) {
      return <ErrorPage err={{ status:403 }}/>
    }
  }

  const renderContent = () => {
    switch (page) {
      case 'prehled':
        return (<Overview typeOfService={typeOfService.name} user={user}/>);
      case 'dovolena':
        return (<Vacation typeOfService={typeOfService.name}/>);
      case 'sluzby':
        return (<ProceduresList typeOfService={typeOfService.name}/>);
    }
  }

  return (
    <>
      <Row>
        <Col xs={12} className='mb-3 text-center'>
          <h1>{typeOfService.displayName}</h1>
          <Nav variant="pills" className="justify-content-center">
            <Nav.Item>
              <Nav.Link as={Link} active={page === "prehled"} to={`/${typeOfService.name}/prehled`}>Přehled</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} active={page === "dovolena"} to={`/${typeOfService.name}/dovolena`}>Dovolená</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} active={page === "sluzby"} to={`/${typeOfService.name}/sluzby`}>Služby</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      {renderContent()}
    </>
  )
}

export default AdminMenuPage