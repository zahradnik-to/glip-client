import React, { Children } from "react";
import LinkBanner from "../Components/LinkBanner";
import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

HomePage.propTypes = {
  services: PropTypes.array,
}

function HomePage({ services }) {

  return (
    <>
      <Row className="pt-5">
        <Col>
          <h1 className="text-center mt-3">OBJEDNÁVKY</h1>
          <div className={"d-flex flex-column align-items-center"}>
            {Children.toArray(services.map(service =>
              <LinkBanner title={service.displayName} key={service._id + "-hp"} hrefLink={"/" + service.name}/>))
            }
          </div>
        </Col>
      </Row>
    </>
  )
}

export default HomePage