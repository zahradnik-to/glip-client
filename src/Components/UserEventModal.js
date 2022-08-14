import React, { useState, useEffect, Children } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import DatePicker from "react-datepicker";
import { isPast, subHours } from 'date-fns';
import InputGroup from "react-bootstrap/InputGroup";
import Accordion from 'react-bootstrap/Accordion';
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"

import "react-datepicker/dist/react-datepicker.css";
import { formatTimeToLocaleString } from "../Utils/DateTimeHelper";

UserEventModal.propTypes = {
  isOpen: PropTypes.bool,
  event: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  onEventCancel: PropTypes.func,
  procedures: PropTypes.array,
};

function UserEventModal({ isOpen, event, onClose, onSubmit, onEventCancel }) {
  const [notes, setNotes] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [oldEventTime, setOldEventTime] = useState('11:11')
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    if (Object.keys(event).length){
      setStartDate(new Date(event.start))
      setOldEventTime(formatTimeToLocaleString(event.start));
      setNotes(event.notes)
      setPhoneNumber(event.phoneNumber.slice(3))
    }
  }, [event])

  const handleSubmit = (e) => {
    e.preventDefault();
    const modifiedEvent = {
      _id: event._id,
      phoneNumber: `420${phoneNumber}`,
      notes,
    }
    onSubmit(modifiedEvent);
  }

  const handleEventCancel = (e) => {
    e.preventDefault();
    const dtoIn = {
      _id: event._id,
      canceled: true,
    }
    onEventCancel(dtoIn);
  }

  const isEditAllowed = () => {
    // Returns true if its >24h before start
    const prevDay = subHours(new Date(event.start), 24)
    return (!isPast(prevDay))
  }

  const renderCancelButton = ()=> {
    if (event.canceled) return (<Button variant="danger" disabled className={"me-4"}>Stornováno!</Button>)
    if (isEditAllowed()) return(<Button variant="danger" onClick={handleEventCancel} className={"me-4"}>Stornovat</Button>)
    return(<Button variant="danger" disabled className={"me-4"}>Nelze stornovat</Button>)
  }

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Objednávka</Modal.Title>
      </Modal.Header>

      { Object.keys(event).length !== 0
        ? <Form onSubmit={handleSubmit}>
            <Modal.Body>

              <Form.Group className='mb-2'>
                <Form.Label>Úkon</Form.Label>
                <Form.Control
                  name='procedure'
                  value={event.procedureName}
                  readOnly={true}
                  disabled
                  required/>
              </Form.Group>

              { event.additionalProcedures.length !== 0
                ? <Accordion className='mb-2'>
                  <Accordion.Item eventKey="additional">
                    <Accordion.Header>Doplňkové služby...</Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        {Children.toArray(event.additionalProcedures
                        .map(p =>
                            <Col xs={6} key={p._id}>• {p.name}</Col>
                        ))}
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                : <></>
              }

              <Form.Group className='mb-2'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  placeholder='Email'
                  value={event.email}
                  readOnly={true}
                  disabled
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Telefonní číslo</Form.Label>
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
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Den</Form.Label>
                <DatePicker
                  todayButton="Dnes"
                  selected={startDate}
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  readOnly
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Začátek</Form.Label>
                <Form.Control
                  name='eventTime'
                  value={oldEventTime}
                  readOnly
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Konec</Form.Label>
                <Form.Control
                  name='eventTime'
                  value={
                    new Date(event.end).toLocaleTimeString('cs', {
                      hour: '2-digit',
                      minute: 'numeric',
                    })
                  }
                  readOnly
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Cena</Form.Label>
                <Form.Control
                    name='eventPrice'
                    value={`${event.price + event.extraPrice}Kč`}
                    readOnly
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Poznámka</Form.Label>
                <Form.Control
                  placeholder='Poznámka'
                  as="textarea"
                  onChange={event => setNotes(event.target.value)}
                  defaultValue={event.notes ?? ""}
                />
              </Form.Group>

              <div className="text-center">
                <span className="text-muted text-center">Objednávku lze stornovat nejpozději 24h před začátkem.</span>
              </div>
              <div className="text-center">
                <span className="text-muted text-center">Pro úpravu objednávky kontaktujte náš personál nebo vytvořte novou objednávku.</span>
              </div>
            </Modal.Body>
            <Modal.Footer>
              { renderCancelButton() }
              <Button variant="secondary" onClick={onClose}>Zpět</Button>

              <Button variant="primary"  type='submit'>Uložit</Button>
            </Modal.Footer>
          </Form>
        : <div className={'text-center p-3'}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
      }
    </Modal>
  );
}

export default UserEventModal;