import React, { Children, useEffect, useState } from "react";
import PropTypes from "prop-types";
import HomePage from "./HomePage";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import InputGroup from "react-bootstrap/InputGroup";
import ToastNotification from "../Components/ToastNotification";

ProfilePage.propTypes = {
  user: PropTypes.object,
  login: PropTypes.func,
}

function ProfilePage({ user, login }) {
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber?.slice(3));
  const [showToast, setShowToast] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [toastContent, setToastContent] = useState({});

  useEffect(() => {
    if (user?.isAdmin) return getRoles();
    else return setDataLoaded(true)
  }, []);

  if (!user) {
    return <HomePage/>
  }

  const getRoles = () => {
    axios.get(`/role/get`)
      .then(response => {
        if (response.status === 200) {
          return response.data
        } else throw new Error("Auth failed")
      })
      .then(roleList => {
        setRoleOptions(roleList)
        setSelectedRole(roleList.find(r=> r.name === user.role))
        setDataLoaded(true)
      })
      .catch(err => console.error(err))
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    const dtoIn = {
      _id: user._id,
      phoneNumber: `420${phoneNumber}`,
      role: user.isAdmin ? selectedRole._id : undefined
    }
    axios.put(`/user/update`, dtoIn)
      .then(response => {
        if (response.status === 200) {
          user.role = selectedRole.name;
          setToastContent({
            header: "Hotovo!",
            message: `Změny uloženy.`,
            variant: "success"
          })
          setShowToast(true);
          login();
        } else throw new Error("Role update failed.")
      })
      .catch(err => renderToastError(err))
  }

  const renderToastError = (err) => {
    setToastContent({
      header: "Chyba!",
      message: `Při provádění operace se objevila chyba. ${err.toString()}`,
      variant: "danger"
    });
    setShowToast(true);
  }

  const handleSetRole = (roleId) => {
    const roleObj = roleOptions.find(r => r._id === roleId);
    setSelectedRole(roleObj)
  }

  return (
    <>
      <h1>Profil</h1>
      <dl>
        <dt>Email</dt>
        <dd>{user.email}</dd>

        <dt>Jméno</dt>
        <dd>{user.displayName}</dd>
        <Form onSubmit={handleUpdate}>
          <Form.Group as={Row} className='mb-2'>
            <Form.Label as={"dt"}>Telefonní číslo</Form.Label>
            <Col sm={12} md={3}>
              <InputGroup>
                <InputGroup.Text>+420</InputGroup.Text>
                <Form.Control
                    type="tel"
                    placeholder='111222333'
                    pattern="^\b\d{9}\b$"
                    minLength={9}
                    maxLength={9}
                    value={phoneNumber}
                    onChange={event => setPhoneNumber(event.target.value)}
                    required={true}
                />
              </InputGroup>
            </Col>
          </Form.Group>
          {user.isAdmin && dataLoaded
            ?
              <Form.Group as={Row} className='mb-2'>
                <Form.Label as={"dt"}>Role</Form.Label>
                <Col sm={12} md={3}>
                  <Form.Select
                    defaultValue={roleOptions.find(r=> r.name === user.role)._id}
                    name='role'
                    onChange={e => handleSetRole(e.target.value)}
                    required
                  >
                    {Children.toArray(roleOptions.map(role => <option key={role._id} value={role._id}>{role.displayName}</option>))}
                  </Form.Select>
                </Col>
              </Form.Group>
            : <></>
          }
        <Button variant="primary"  type='submit'>Uložit změny</Button>
        </Form>
      </dl>
      <ToastNotification showToast={showToast} setShowToast={setShowToast} toastContent={toastContent}/>
    </>
  );
}

export default ProfilePage;