import React, { useEffect, useState } from 'react';
import axios from "axios";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import DataTable from "./DataTable";
import ErrorPage from "../../Routes/ErrorPage";
import PropTypes from "prop-types";

UserList.propTypes = {
  user: PropTypes.object,
}

function UserList({ user }) {
  const [users, setUsers] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [toastContent, setToastContent] = useState({});
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  if (!user.isAdmin) {
    return <ErrorPage err={{ status:403 }}/>
  }

  const dataInfo = {
    headerNames: [
      {
        entryName: "displayName",
        showName: "Jméno",
        type: "text",
        disabled: true,
      },
      {
        entryName: "email",
        showName: "Email",
        type: "text",
        disabled: true
      },
      {
        entryName: "role",
        showName: "Role",
        type: "select",
        options: roleOptions,
      },
    ],
  }

  const getUsers = () => {
    axios.get(`/user/get-many`)
      .then(response => {
        if (response.status === 200) {
          return response.data
        } else throw new Error("Auth failed")
      })
      .then(data => {
        setUsers(data)
      })
      .catch(err => renderToastError(err))
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
        setDataLoaded(true);
      })
      .catch(err => renderToastError(err))
  }

  const renderToastError = (err = "") => {
    setToastContent({
      header: "Chyba!",
      message: `Při provádění operace se objevila chyba. ${err.toString()}`,
      variant: "danger"
    });
    setShowToast(true);
  }

  const handleDelete = (id) => {
    axios.delete(`/user/delete`, { data: { id: id } })
      .then(response => {
        if (response.status === 200) {
          getUsers();
          setToastContent({
            header: "Smazáno!",
            message: `Uživatel ${name} byl vymazán.`,
            variant: "warning"
          });
          setShowToast(true);
          return response.data;
        } else throw new Error("Auth failed")
      })
      .catch(err => renderToastError(err))
  }

  const handleUpdate = (object) => {
    axios.put(`/user/update`, object)
      .then(response => {
        if (response.status === 200) {
          setToastContent({
            header: "Hotovo!",
            message: `Role změněna.`,
            variant: "success"
          })
          setShowToast(true);
        } else throw new Error("Role update failed.")
      })
      .catch(err => renderToastError(err))
  }

  const renderToast = () => {
    const { header, message, variant } = toastContent;
    return (
      <ToastContainer className="p-3" position="bottom-center">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg={variant} delay={5000} autohide>
          <Toast.Header>
            <strong className="me-auto">{header}</strong>
          </Toast.Header>
          <Toast.Body>{message}</Toast.Body>
        </Toast>
      </ToastContainer>
    )
  }

  return (
    <>
      <h1>Uživatelé</h1>
      {dataLoaded
        ?
        <DataTable mapConfig={dataInfo} data={users} handleDelete={handleDelete} handleUpdate={handleUpdate}/>
        :
        <></>
      }
      {renderToast()}
    </>
  );
}

export default UserList;