import React from 'react';
import PropTypes from 'prop-types';
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

ToastNotification.propTypes = {
  showToast: PropTypes.bool,
  setShowToast: PropTypes.func,
  variant: PropTypes.string,
  header: PropTypes.string,
  message: PropTypes.string,
  toastContent: PropTypes.object,
};

ToastNotification.defaultProps = {
  showToast: false,
  toastContent: {
    header: "Info",
    message: `Informace.`,
    variant: "light"
  }
};

function ToastNotification({ showToast, setShowToast, toastContent }) {
  const { header, message, variant } = toastContent
  return (
    <ToastContainer className="p-3" position="bottom-center">
      <Toast show={showToast} onClose={() => setShowToast(false)} bg={variant} delay={5000} autohide>
        <Toast.Header>
          <strong className="me-auto">{header}</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ToastNotification;