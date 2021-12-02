import React from "react";
import LoginForm from "../Components/LoginForm";
import PropTypes from "prop-types";
import LinkBanner from "../Components/LinkBanner";

LoginPage.propTypes = {
  setToken: PropTypes.func.isRequired
}

function LoginPage({ setToken }) {

  return (
    <>
      <LinkBanner title="PROFIL" hrefLink="/profile"/>
      <LoginForm setToken={setToken}/>
    </>
  );
}

export default LoginPage;