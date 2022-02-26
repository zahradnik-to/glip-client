import React, { Children, useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import DatePicker from "react-datepicker";
import { isPast, subHours } from 'date-fns';
import isSameDay from 'date-fns/isSameDay';

import "react-datepicker/dist/react-datepicker.css";

UserEventModal.propTypes = {
  isOpen: PropTypes.bool,
  event: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  onEventCancel: PropTypes.func,
  procedures: PropTypes.array,
  setUpdate: PropTypes.func.isRequired,
  update: PropTypes.bool.isRequired,
};

function UserEventModal({ isOpen, event, onClose, onSubmit, onEventCancel, update, setUpdate  }) {
  const [notes, setNotes] = useState("")
  const [oldEventTime, setOldEventTime] = useState('11:11')
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    if (Object.keys(event).length){
      setStartDate(new Date(event.start))
      setOldEventTime(getEventTime());
      setNotes(event.notes)
    }
  }, [event])

  const handleSubmit = (e) => {
    e.preventDefault();
    const modifiedEvent = {
      _id: event._id,
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

  const getEventTime = () => {
    const eventDate = new Date(event.start);
    const hours = makeTimeDoubleDigit(eventDate.getHours());
    const minutes = makeTimeDoubleDigit(eventDate.getMinutes());
    return `${hours}:${minutes}`
  }

  const makeTimeDoubleDigit = (time) => {
    return ("0" + time).slice(-2);
  }

  const isEventInPast = ()=> {
    return isPast(new Date(event.start));
  }

  const canBeCanceled = ()=> {
    const prevDay = subHours(new Date(event.start), 24)
    return !isEventInPast || isPast(prevDay);
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
                <Form.Label>Poznámka</Form.Label>
                <Form.Control
                  placeholder='Poznámka'
                  as="textarea"
                  onChange={event => setNotes(event.target.value)}
                  defaultValue={event.notes ?? ""}
                />
              </Form.Group>

              <div className="text-center">
                <span className="text-muted text-center">Pro další změny objednávky kontaktujte náš personál nebo vytvořte novou objednávku.</span>
              </div>
            </Modal.Body>
            <Modal.Footer>
              { !canBeCanceled()
                ?<Button variant="danger" onClick={handleEventCancel} className={"me-4"}>Stornovat</Button>
                : <></>
              }
              <Button variant="secondary" onClick={onClose}>Zrušit</Button>
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