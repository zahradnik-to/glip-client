import React, { useEffect, useState } from 'react';
import axios from "axios";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DataTable from "./DataTable";
import HomePage from "../../Routes/HomePage";
import PropTypes from "prop-types"
import ToastNotification from "../ToastNotification";

ProceduresList.propTypes = {
  user: PropTypes.object,
  passedService: PropTypes.string,
}

function ProceduresList({ user, passedService }) {
  const [procedures, setProcedures] = useState([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [typeOfService, setTypeOfService] = useState(passedService);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({});

  useEffect(() => {
    if(!user) return <HomePage />
    return getProcedures()
  }, []);

  const dataInfo = {
    headerNames: [
      {
        entryName: "name",
        showName: "Název",
        type: "text",
      }, {
        entryName: "duration",
        showName: "Délka (minuty)",
        type: "number",
      },
    ],
  }

  const handleCreate = (event) => {
    event.preventDefault();
    axios.post(`/procedure/create`, { name, duration, typeOfService })
      .then(response => {
        if (response.status === 201) {
          getProcedures()
          setToastContent({
            header: "Přidáno!",
            message: `Položka ${name} byla přidána.`,
            variant: "success"
          })
          setShowToast(true);
          return response.data
        } else throw new Error("Auth failed")
      })
      .catch(err => renderToastError(err))
  }

  const handleDelete = (_id) => {
    axios.delete(`/procedure/delete`, { data: { _id } })
      .then(response => {
        if (response.status === 200) {
          getProcedures();
          setToastContent({
            header: "Smazáno!",
            message: `Položka ${name} byla vymazána.`,
            variant: "warning"
          })
          setShowToast(true);
          return response.data;
        } else throw new Error("Auth failed")
      })
      .catch(err => renderToastError(err))
  }

  const handleUpdate = (object) => {
    axios.put(`/procedure/update`, object)
      .then(response => {
        if (response.status === 200) {
          setToastContent({
            header: "Upraveno!",
            message: `Položka byla upravena.`,
            variant: "success"
          })
          setShowToast(true);
          return response.data
        } else throw new Error("Auth failed")
      })
      .catch(err => renderToastError(err))
  }

  const getProcedures = () => {
    axios.get(`/procedure/get?typeOfService=${typeOfService}`)
      .then(response => {
        if (response.status === 200) {
          return response.data
        } else throw new Error("Nepovedlo se získat procedury.")
      })
      .then(data => {
        setProcedures(data)
      })
      .catch(err => renderToastError(err, "Nepovedlo se získat procedury."))
  }

  const renderToastError = (err, message = 'Při provádění operace se objevila chyba.') => {
    setToastContent({
      header: "Chyba!",
      message: message,
      variant: "danger"
    })
    setShowToast(true);
  }

  return (
    <>
      <Form onSubmit={event => handleCreate(event)} className='mb-3'>
        <Row>
          <h1>Přidat proceduru</h1>
          <Form.Group as={Col} md={4} className='mb-2'>
            <Form.Label>Název</Form.Label>
            <Form.Control
              type={"text"}
              placeholder="Název"
              value={name}
              onChange={event => setName(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group as={Col} md={4} className='mb-2'>
            <Form.Label>Délka</Form.Label>
            <Form.Control
              type="number"
              step={15}
              snap={"true"}
              min={15}
              pattern="^[+-]?[012]?\d:[012345]?[15]$"
              placeholder="Délka (minut)"
              value={duration}
              onChange={event => setDuration(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group as={Col} md={4} className='mb-2'>
            <Form.Label>Služba</Form.Label>
            <Form.Select
              value={typeOfService}
              onChange={event => setTypeOfService(event.target.value)}
              disabled={!user.isAdmin}
              required
            >
              {/* Todo Fixme load services instead of hardcode */}
              <option value="kadernictvi">Kadeřnictví</option>
              <option value="cosmetics">Kosmetika</option>
              <option value="massage">Masáže</option>
            </Form.Select>
          </Form.Group>
        </Row>
        <Button variant="primary" type="submit">
          Přidat
        </Button>
      </Form>
      <Row>
        <h1>Procedury</h1>
        <DataTable mapConfig={dataInfo} data={procedures} handleDelete={handleDelete} handleUpdate={handleUpdate}/>
      </Row>
      <ToastNotification showToast={showToast} setShowToast={setShowToast} toastContent={toastContent}/>
    </>
  );
}

export default ProceduresList