import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link} from "react-router-dom";

function LinkBanner({hrefLink, title}) {
  return (
    <Row>
      <Col sm={12} style={{height: "4em"}}
           className="d-flex justify-content-center align-items-center">
        <Link to={hrefLink}>{title}</Link>
      </Col>
    </Row>
  )
}

export default LinkBanner;