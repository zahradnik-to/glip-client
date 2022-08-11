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
import { formatTimeToLocaleString } from "../../Utils/DateTimeHelper";

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
  const [duration, setDuration] = useState(0);
  const [extraDuration, setExtraDuration] = useState(0);

  useEffect(() => {
    if (Object.keys(event).length){
      setStartDate(new Date(event.start))
      setOldEventTime(formatTimeToLocaleString(event.start));
      setNotes(event.notes)
      setPhoneNumber(event.phoneNumber.slice(3))
      setTitle(event.title)
      setStaffNotes(event.staffNotes)
      setProcedureId(event.procedureId)
      setPhoneNumber(event.phoneNumber.slice(3))
      setDuration(event.duration)
      setExtraDuration(event.extraDuration)
    }
  }, [event])

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
    console.log({ modifiedEvent })
    if (!isSelectedDateSameAsOriginal() || formatTimeToLocaleString(event.start) !== eventTime) {
      modifiedEvent.dateTimeChange = true;
      console.log("Use this time: ", eventTime)
      modifiedEvent = {
        ...modifiedEvent,
        date: startDate,
        time: eventTime,
      }
    }
    console.log({ modifiedEvent })
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

  const handleSetProcedureId = (procId) => {
    console.log(procId)
    const proc = procedures.find(p => p._id === procId);
    setDuration(proc.duration);
    setProcedureId(procId)
  }


  const getFreeTime = (date) => {
    console.log("freeTime")
    console.log({ duration })
    if (Object.keys(event).length){
      const dateObj = new Date(date)
      axios.get(`/calendar/get-free-time?date=${dateObj.toISOString()}&procedureId=${procedureId}&eventId=${event._id}&duration=${duration+extraDuration}`)
        .then( response => {
          setFreeTime(response.data)
          setEventTime(formatTimeToLocaleString(event.start))
        })
        .catch(err => console.log(err));
    }
  }

  useEffect(() => {
    console.log({ procedureId, duration })
    if (procedureId && duration) getFreeTime(startDate)
  }, [startDate, onSubmit, procedureId, duration])

  const isSelectedDateSameAsOriginal = () => {
    return isSameDay(new Date(event.start), new Date(startDate));
  }

  const isEventInPast = ()=> {
    return isPast(new Date(event.start));
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
                <Form.Label>Název objenávky</Form.Label>
                <Form.Control
                  placeholder='Title'
                  defaultValue={event.title}
                  onChange={event => setTitle(event.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Úkon</Form.Label>
                <Form.Select
                  name='procedure'
                  defaultValue={event.procedureId}
                  onChange={e => handleSetProcedureId(e.target.value)}
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
                <Form.Label>Telefonní číslo</Form.Label>
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
                <Form.Label>Cena</Form.Label>
                <Form.Control
                    name='eventPrice'
                    value={`${event.price + event.extraPrice}Kč`}
                    readOnly
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Poznámky zákazníka</Form.Label>
                <Form.Control
                  placeholder='Poznámky zákazníka'
                  as="textarea"
                  defaultValue={notes ?? ""}
                  disabled
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Vaše poznámky</Form.Label>
                <Form.Control
                  placeholder='Vaše poznámky'
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
                <Form.Label>Čas</Form.Label>
                <Form.Select
                  name='eventTime'
                  onChange={e => setEventTime(e.target.value)}
                  defaultValue={'sameTime'}
                  disabled={isEventInPast()}
                  required
                >
                  { isSelectedDateSameAsOriginal()
                    ? <option value="sameTime">{oldEventTime} (původní)</option>
                    : <option value="">Vyberte čas</option>
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

export default EventModal;