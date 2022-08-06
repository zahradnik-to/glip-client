import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropTypes from "prop-types";
import ErrorPage from "../ErrorPage";

DataEditPage.propTypes = {
  contentForm: PropTypes.object,
  user: PropTypes.object,
}

function DataEditPage({ contentForm, user }) {

  if (!user) return <ErrorPage err={{ status:403 }}/>

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