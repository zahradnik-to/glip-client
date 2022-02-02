import React, { useEffect, useState } from 'react';
import axios from "axios";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import DataTable from "./DataTable";

function UserList() {
  const [users, setUsers] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({});
  const [roleOptions, setRoleOptions] = useState([]);
  const dataInfo = {
    headerNames: [
      {
        entryName: "email",
        showName: "Email",
        type: "text",
        disabled: true
      }, {
        entryName: "role",
        showName: "Role",
        type: "select",
        options: roleOptions,
      },
    ],
    ignoredDataParams: ["_id", "__v", "googleId"],
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

  const handleDelete = (id) => {
    console.log(id)
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
    console.log(object)
    // axios.put(`/procedure/update`, object)
    //   .then(response => {
    //     if (response.status === 200) {
    //       setToastContent({
    //         header: "Upraveno!",
    //         message: `Položka byla upravena.`,
    //         variant: "light"
    //       });
    //       setShowToast(true);
    //       return response.data;
    //     } else throw new Error("Auth failed")
    //   })
    //   .catch(err => renderToastError(err))
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

  useEffect(() => {
    return getUsers();
  }, []);

  useEffect(() => {
    return getRoles();
  }, []);

  return(
    <>
      <DataTable dataInfo={dataInfo} data={users} handleDelete={handleDelete} handleUpdate={handleUpdate}/>
      {renderToast()}
    </>
  );
}

export default UserList;