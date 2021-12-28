import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropTypes from "prop-types";

DataEditPage.propTypes = {
  contentForm: PropTypes.object
}

function DataEditPage({ contentForm }) {
  return(
    <>
      <Row>
        <Col xs={12} className='mb-3'>
          {contentForm}
        </Col>
      </Row>
    </>
  )
}

export default DataEditPage;