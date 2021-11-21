import React from "react";
import LoginPage from "./LoginPage";
import PropTypes from "prop-types";
import jwt_decode from "jwt-decode";

UserProfilePage.propTypes = {
  token: PropTypes.string,
  setToken: PropTypes.func.isRequired
}

function UserProfilePage({ token, setToken }) {

  if(!token) {
    return <LoginPage setToken={setToken} />
  }

  const parsedToken = jwt_decode( token );

  return (
    <>
      <h1>USER PROFILE PAGE: {parsedToken.email}</h1>
      <pre>
        token: {token}
        <br/>
        id: {parsedToken._id}
        <br/>
        exp: {parsedToken.exp}
      </pre>
    </>
  );
}

export default UserProfilePage;