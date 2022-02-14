import React, { Children, useEffect, useState } from "react";
import PropTypes from "prop-types";
import HomePage from "./HomePage";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import ToastNotification from "../Components/ToastNotification";

ProfilePage.propTypes = {
  user: PropTypes.object,
}

function ProfilePage({ user }) {
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [showToast, setShowToast] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [toastContent, setToastContent] = useState({});

  useEffect(() => {
    if (user.role !== 'user') return getRoles();
    else setDataLoaded(true)
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
      .then(data => {
        setRoleOptions(data)
        setDataLoaded(true)
      })
      .catch(err => console.error(err))
  }

  const updateAdminRole = (e) => {
    e.preventDefault();
    const dtoIn = {
      _id: user._id,
      role: selectedRole
    }
    axios.put(`/user/update`, dtoIn)
      .then(response => {
        if (response.status === 200) {
          user.role = selectedRole;
          setToastContent({
            header: "Hotovo!",
            message: `Role změněna na ${selectedRole}.`,
            variant: "success"
          })
          setShowToast(true);
        } else throw new Error("Role update failed.")
      })
      .catch(err => renderToastError(err))
  }

  const renderToastError = (err) => {
    setToastContent({
      header: "Error!",
      message: `Při provádění operace se objevila chyba. ${err.toString()}`,
      variant: "danger"
    });
    setShowToast(true);
  }

  return (
    <>
      <h1>Profil</h1>
      <dl>
        <dt>Email</dt>
        <dd>{user.email}</dd>

        <dt>Jméno</dt>
        <dd>{user.displayName}</dd>
        {user.isAdmin && dataLoaded
          ?
          <Form onSubmit={updateAdminRole}>
            <Form.Group as={Row} className='mb-2'>
              <Form.Label as={"dt"}>Role</Form.Label>
              <Col sm={12} md={3}>
                <Form.Select
                  defaultValue={user.role}
                  name='role'
                  onChange={e => setSelectedRole(e.target.value)}
                  required
                >
                  <option value="admin">admin</option>
                  {Children.toArray(roleOptions.map(role => <option key={role._id} value={role.name}>{role.name}</option>))}
                </Form.Select>
              </Col>
            </Form.Group>
            <Button variant="primary"  type='submit'>Změnit roli</Button>
          </Form>
          : <></>
        }
      </dl>
      <ToastNotification showToast={showToast} setShowToast={setShowToast} toastContent={toastContent}/>
    </>
  );
}

export default ProfilePage;