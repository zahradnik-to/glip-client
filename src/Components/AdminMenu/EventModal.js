import React, { Children, useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import DatePicker from "react-datepicker";
import { isPast }  from 'date-fns';
import isSameDay from 'date-fns/isSameDay';
import InputGroup from "react-bootstrap/InputGroup";

import "react-datepicker/dist/react-datepicker.css";

EventModal.propTypes = {
  isOpen: PropTypes.bool,
  event: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  onEventCancel: PropTypes.func,
  procedures: PropTypes.array,
};

function EventModal({ isOpen, event, onClose, procedures, onSubmit, onEventCancel }) {
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [staffNotes, setStaffNotes] = useState("")
  const [eventTime, setEventTime] = useState('00:00')
  const [oldEventTime, setOldEventTime] = useState('11:11')
  const [procedureId, setProcedureId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [freeTime, setFreeTime] = useState([]);

  useEffect(() => {
    if (Object.keys(event).length){
      setStartDate(new Date(event.start))
      setOldEventTime(getEventTime());
      setTitle(event.title)
      setStaffNotes(event.staffNotes)
      setNotes(event.notes)
      setProcedureId(event.procedure)
    }
  }, [event])

  useEffect(() => {
    getFreeTime(startDate)
  }, [startDate, onSubmit])


  // Todo Fixme on order update, tel number gets deleted
  const handleSubmit = (e) => {
    e.preventDefault();
    let modifiedEvent = {
      _id: event._id,
      title,
      procedureId,
      staffNotes,
      phoneNumber: `420${phoneNumber}`,
      dateTimeChange: false,
    }
    if (!isSelectedDateSameAsOriginal() || getEventTime() !== eventTime) {
      modifiedEvent.dateTimeChange = true;
      console.log("Use this time: ", eventTime)
      modifiedEvent = {
        ...modifiedEvent,
        date: startDate,
        time: eventTime,
      }
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

  const getFreeTime = (date) => {
    if (Object.keys(event).length){
      const dateObj = new Date(date)
      axios.get(`/calendar/get-free-time?date=${dateObj.toISOString()}&typeOfService=${event.typeOfService}&procedureId=${event.procedureId}&eventId=${event._id}`)
        .then( freeTime => {
          setFreeTime(freeTime.data)
          setEventTime(getEventTime)
        })
        .catch(err => console.log(err));
    }
  }

  const isSelectedDateSameAsOriginal = () => {
    return isSameDay(new Date(event.start), new Date(startDate));
  }

  const isEventInPast = ()=> {
    return isPast(new Date(event.start));
  }

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Objedn??vka</Modal.Title>
      </Modal.Header>

      { Object.keys(event).length !== 0
        ? <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className='mb-2'>
                <Form.Label>N??zev objen??vky</Form.Label>
                <Form.Control
                  placeholder='Title'
                  defaultValue={event.title}
                  onChange={event => setTitle(event.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>??kon</Form.Label>
                <Form.Select
                  name='procedure'
                  defaultValue={event.procedureId}
                  onChange={e => setProcedureId(e.target.value)}
                  disabled={isEventInPast()}
                  required>
                  {Children.toArray(procedures.map(procedure =>
                    <option key={procedure._id} value={procedure._id}>
                      {procedure.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  placeholder='Email'
                  value={event.email}
                  disabled
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Telefonn?? ????slo</Form.Label>
                <InputGroup>
                  <InputGroup.Text>+420</InputGroup.Text>
                  <Form.Control
                    type="tel"
                    placeholder='111222333'
                    pattern="^\b\d{9}\b$"
                    minLength={9}
                    maxLength={9}
                    defaultValue={event.phoneNumber.split("420")[1]}
                    onChange={event => setPhoneNumber(event.target.value)}
                    required={true}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Pozn??mky z??kazn??ka</Form.Label>
                <Form.Control
                  placeholder='Pozn??mky z??kazn??ka'
                  as="textarea"
                  defaultValue={notes ?? ""}
                  disabled
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Va??e pozn??mky</Form.Label>
                <Form.Control
                  placeholder='Va??e pozn??mky'
                  as="textarea"
                  defaultValue={staffNotes ?? ""}
                  onChange={event => setStaffNotes(event.target.value)}
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Den</Form.Label>
                <DatePicker
                  todayButton="Dnes"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="form-control"
                  dateFormat="dd/MM/yyyy"
                  disabled={isEventInPast()}
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>??as</Form.Label>
                <Form.Select
                  name='eventTime'
                  onChange={e => setEventTime(e.target.value)}
                  defaultValue={'sameTime'}
                  disabled={isEventInPast()}
                  required
                >
                  { isSelectedDateSameAsOriginal()
                    ? <option value="sameTime">{oldEventTime} (p??vodn??)</option>
                    : <option value="">Vyberte ??as</option>
                  }
                  {Children.toArray(freeTime.map(time => <option key={time} value={time}>{time}</option>))}
                </Form.Select>
              </Form.Group>

            </Modal.Body>
            <Modal.Footer>
              { !isEventInPast()
                ?<Button variant="danger" onClick={handleEventCancel} className={"me-4"}>Stornovat</Button>
                : <></>
              }
              <Button variant="secondary" onClick={onClose}>Zru??it</Button>
              <Button variant="primary"  type='submit'>Ulo??it</Button>
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

export default EventModal;