import React, { useEffect, useState } from 'react';
import axios from "axios";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import DataTable from "./DataTable";

function ProceduresList() {
  const [procedures, setProcedures] = useState([])
  const [name, setName] = useState("")
  const [duration, setDuration] = useState("");
  const [typeOfService, setTypeOfService] = useState("")
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({});
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
    ignoredDataParams: ["_id", "__v", "typeOfService"],
  }

  const handleCreate = (event) => {
    event.preventDefault();
    console.log({ name, duration, typeOfService })
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

  const handleDelete = (id) => {
    axios.delete(`/procedure/delete`, { data: { id: id } })
      .then(response => {
        if (response.status === 200) {
          getProcedures()
          setToastContent({
            header: "Smazáno!",
            message: `Položka ${name} byla vymazána.`,
            variant: "warning"
          })
          setShowToast(true);
          return response.data
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
            variant: "light"
          })
          setShowToast(true);
          return response.data
        } else throw new Error("Auth failed")
      })
      .catch(err => renderToastError(err))
  }

  const getProcedures = () => {
    axios.get(`/procedure/get`)
      .then(response => {
        if (response.status === 200) {
          return response.data
        } else throw new Error("Auth failed")
      })
      .then(data => {
        setProcedures(data)
      })
      .catch(err => renderToastError(err))
  }

  const renderToastError = (err) => {
    console.log(err);
    setToastContent({
      header: "Error!",
      message: `Při provádění operace se objevila chyba.`,
      variant: "danger"
    })
    setShowToast(true);
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
    return getProcedures()
  }, []);

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

          {/* Todo make into select? */}
          <Form.Group as={Col} md={4} className='mb-2'>
            <Form.Label>Délka</Form.Label>
            <Form.Control
              type={"number"}
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
              required
            >
              <option value="">Vyberte službu</option>
              <option value="hair">Kadeřnictví</option>
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
        <DataTable dataInfo={dataInfo} data={procedures} handleDelete={handleDelete} handleUpdate={handleUpdate}/>
      </Row>
      {renderToast()}
    </>
  );
}

export default ProceduresList