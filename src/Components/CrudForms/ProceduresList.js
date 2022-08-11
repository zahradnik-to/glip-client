import React, { useEffect, useState } from 'react';
import axios from "axios";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DataTable from "./DataTable";
import PropTypes from "prop-types"
import ToastNotification from "../ToastNotification";

ProceduresList.propTypes = {
  typeOfService: PropTypes.string,
}

function ProceduresList({ typeOfService }) {
  const [procedures, setProcedures] = useState([]);
  const [additionalProcedures, setAdditionalProcedures] = useState([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("full"); // Additional/full
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({});

  useEffect(() => {
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
      {
        entryName: "price",
        showName: "Cena",
        type: "number",
      },
      {
        entryName: "type",
        showName: "Typ služby",
        type: "select",
        disabled: true,
        options: [
          {
            displayName: "Plnohodnotná",
            value: "full"
          },
          {
            displayName: "Doplňková",
            value: "additional"
          }
        ]
      },
    ],
  }

  const handleCreate = (event) => {
    event.preventDefault();
    console.log({ name, duration, price ,type , typeOfService })
    axios.post(`/procedure/create`, { name, duration, price ,type , typeOfService })
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
    axios.get(`/procedure/get?typeOfService=${typeOfService}&type=full`)
      .then(response => {
        if (response.status === 200) {
          return response.data
        } else throw new Error("Nepovedlo se získat procedury.")
      })
      .then(data => {
        setProcedures(data)
        getAdditionalProcedures();
      })
      .catch(err => renderToastError(err, "Nepovedlo se získat procedury."))
  }

  const getAdditionalProcedures = () => {
    axios.get(`/procedure/get?typeOfService=${typeOfService}&type=additional`)
    .then(response => {
      if (response.status === 200) {
        return response.data
      } else throw new Error("Nepovedlo se získat procedury.")
    })
    .then(data => {
      setAdditionalProcedures(data)
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
  
  const DIVISIBLE_BY_15_PATTERN = '^[+-]?[012]?\\d:[012345]?[15]$';

  return (
    <>
      <Form onSubmit={event => handleCreate(event)} className='mb-3'>
        <Row>
          <h1>Přidat proceduru</h1>
          <Form.Group as={Col} md={3} sm={12} className='mb-2'>
            <Form.Label>Název</Form.Label>
            <Form.Control
              type={"text"}
              placeholder="Název"
              value={name}
              onChange={event => setName(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group as={Col} md={3} sm={12} className='mb-2'>
            <Form.Label>Délka</Form.Label>
            <Form.Control
              type="number"
              step={15}
              snap={"true"}
              min={0}
              pattern={DIVISIBLE_BY_15_PATTERN}
              placeholder="Délka (minut)"
              value={duration}
              onChange={event => setDuration(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group as={Col} md={3} sm={12} className='mb-2'>
            <Form.Label>Cena (Kč)</Form.Label>
            <Form.Control
                type="number"
                min={0}
                placeholder="Cena (Kč)"
                value={price}
                onChange={event => setPrice(event.target.value)}
                required
            />
          </Form.Group>

          <Form.Group as={Col} md={3} sm={12} className='mb-2'>
            <Form.Label>Typ služby</Form.Label>
            <Form.Select
                defaultValue={type}
                name='procedureType'
                onChange={e => setType(e.target.value)}
                required
            >
              <option value="full">Plnohodnotná</option>
              <option value="additional">Doplňková</option>
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
      <Row>
        <h1>Doplňkové Procedury</h1>
        <DataTable mapConfig={dataInfo} data={additionalProcedures} handleDelete={handleDelete} handleUpdate={handleUpdate}/>
      </Row>
      <ToastNotification showToast={showToast} setShowToast={setShowToast} toastContent={toastContent}/>
    </>
  );
}

export default ProceduresList