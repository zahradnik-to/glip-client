import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

LinkBanner.propTypes = {
  hrefLink: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

function LinkBanner({ hrefLink, title }) {
  return (
    <Link to={hrefLink} className={"link-banner-wrapper d-block justify-content-center align-items-center mb-2"}>
      <div className={"link-banner d-flex justify-content-center align-items-center"}>
        <span className={"link-banner-title"}>
          {title}
        </span>
      </div>
    </Link>
  )
}

export default LinkBanner;