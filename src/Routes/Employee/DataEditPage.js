import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropTypes from "prop-types";
import HomePage from "../HomePage";

DataEditPage.propTypes = {
  contentForm: PropTypes.object,
  user: PropTypes.object,
}

function DataEditPage({ contentForm, user }) {

  if (!user) {
    return <HomePage/>
  } else { // Fixme authentication
    // if (user.role !== typeOfService && !user.isAdmin) {
    //   return <HomePage/>
    // }
  }

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