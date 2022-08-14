import React, { useEffect, useState } from 'react';
import axios from "axios";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import DataTable from "./DataTable";
import PropTypes from "prop-types";
import ErrorPage from "../../Routes/ErrorPage";


RoleList.propTypes = {
  reloadRoles: PropTypes.func,
  roleList: PropTypes.array,
  user: PropTypes.object,
}

function RoleList({ reloadRoles, roleList, user }) {
  const [showToast, setShowToast] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [toastContent, setToastContent] = useState({});
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    (async function(){
      await reloadRoles();
      setDataLoaded(true)
    })();
  }, []);

  if (!user.isAdmin) {
    return <ErrorPage err={{ status:403 }}/>
  }

  const dataInfo = {
    headerNames: [
      {
        entryName: "displayName",
        showName: "Název v menu",
        type: "text",
        disabled: false,
      },
      {
        entryName: "name",
        showName: "Adresa v url",
        type: "text",
        disabled: false,
      }
    ],
  }

  const renderToastError = (err = "") => {
    setToastContent({
      header: "Chyba!",
      message: `Při provádění operace se objevila chyba. ${err.toString()}`,
      variant: "danger"
    });
    setShowToast(true);
  }

  const handleCreate = (event) => {
    event.preventDefault();
    axios.post(`/role/create`, { name, displayName })
    .then(response => {
      if (response.status === 201) {
        reloadRoles();
        setToastContent({
          header: "Přidáno!",
          message: `Položka ${displayName} byla přidána.`,
          variant: "success"
        })
        setShowToast(true);
        setName('');
        setDisplayName('');
        return response.data
      } else throw new Error("Operation failed.")
    })
    .catch(err => renderToastError(err))
  }

  const handleDelete = (id) => {
    axios.delete(`/role/delete`, { data: { _id: id } })
      .then(response => {
        if (response.status === 200) {
          reloadRoles();
          setToastContent({
            header: "Smazáno!",
            message: `Role byla vymazána.`,
            variant: "warning"
          });
          setShowToast(true);
          return response.data;
        } else throw new Error("Auth failed")
      })
      .catch(err => renderToastError(err))
  }

  const handleUpdate = (object) => {
    axios.put(`/role/update`, object)
      .then(response => {
        if (response.status === 200) {
          setToastContent({
            header: "Hotovo!",
            message: `Role změněna.`,
            variant: "success"
          })
          setShowToast(true);
          reloadRoles();
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
      <Form onSubmit={event => handleCreate(event)} className='mb-3'>
        <Row>
          <h1>Přidat roli</h1>
          <Form.Group as={Col} md={4} sm={12} className='mb-2'>
            <Form.Label>Název v menu</Form.Label>
            <Form.Control
                type={"text"}
                placeholder="Název v menu"
                value={displayName}
                maxLength={50}
                onChange={event => setDisplayName(event.target.value)}
                required
            />
          </Form.Group>

          <Form.Group as={Col} md={4} sm={12} className='mb-2'>
            <Form.Label>Adresa v url</Form.Label>
            <Form.Control
                type={"text"}
                placeholder="Adresa v url"
                value={name}
                maxLength={50}
                onChange={event => setName(event.target.value)}
                required
            />
          </Form.Group>
        </Row>
        <Button variant="primary" type="submit">
          Přidat
        </Button>
      </Form>
      <h1>Role</h1>
      {dataLoaded
        ?
        <DataTable mapConfig={dataInfo} data={roleList} handleDelete={handleDelete} handleUpdate={handleUpdate}/>
        :
        <div className={'text-center p-3'}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      }
      {renderToast()}
    </>
  );
}

export default RoleList;