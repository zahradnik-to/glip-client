import React from "react";
import PropTypes from "prop-types";
import HomePage from "./HomePage";

ProfilePage.propTypes = {
  user: PropTypes.object,
}

function ProfilePage({ user }) {

  if(!user) {
    return <HomePage />
  }

  return (
    <>
      <h1>GOOGLE PROFILE PAGE</h1>
      <img src={user.photos[0].value} alt="User avatar"/>
      {
        (()=>{
          return <pre>{JSON.stringify(user, null, 2) }</pre>
        })()
      }
    </>
  );
}

export default ProfilePage;