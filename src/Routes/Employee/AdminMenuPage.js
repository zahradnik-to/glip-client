import React from "react";
import { Col, Row, Nav } from "react-bootstrap";
import PropTypes from "prop-types";
import HomePage from "../HomePage";
import Overview from "../../Components/AdminMenu/Overview";
import ProceduresList from "../../Components/CrudForms/ProceduresList";
import Vacation from "../../Components/AdminMenu/Vacation";

AdminMenuPage.propTypes = {
  typeOfService: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
  user: PropTypes.object,
}

function AdminMenuPage({ typeOfService, page, user }) {

  if (!user) {
    return <HomePage/>
  } else {
    if (user.role !== typeOfService && !user.isAdmin) {
      return <HomePage/>
    }
  }

  const renderContent = () => {
    switch (page) {
      case 'prehled':
        return (<Overview typeOfService={typeOfService} user={user}/>);
      case 'dovolena':
        return (<Vacation typeOfService={typeOfService}/>);
      case 'procedury':
        return (<ProceduresList passedService={typeOfService} user={user}/>);
    }
  }

  return (
    <>
      <Row>
        <Col xs={12} className='mb-3 text-center'>
          <h1>Menu</h1>
          <Nav variant="pills" defaultActiveKey={page} className="justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey={'prehled'} href='prehled'>Přehled</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={'dovolena'} href='dovolena'>Dovolená</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={'procedury'} href='procedury'>Procedury</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      {renderContent()}
    </>
  )
}

export default AdminMenuPage