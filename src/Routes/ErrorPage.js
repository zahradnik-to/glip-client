import React, { Children } from "react";
import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

ErrorPage.propTypes = {
  err: PropTypes.object,
}

function ErrorPage({ err }) {

  switch (err.status) {
    case 403:
      err.message = 'Znovu se prosím přihlašte.';
      break;
    case 404:
      err.message = 'Požadovaná stránka neexistuje.';
      break;
    default:
      err.message = 'Vraťte se prosím na domovskou stránku a akci opakujte.';
  }


  return (
    <>
      <Row className="pt-5">
        <Col>
          <h1 className="text-center mt-3">Objevila se chyba... <span className={"h3"}>({err?.status})</span></h1>
          <div className={"d-flex flex-column align-items-center"}>
            <span className={"h3"}>{err.message}</span>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default ErrorPage