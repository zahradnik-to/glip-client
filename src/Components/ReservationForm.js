import React, { useState, Children, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';

ReservationForm.propTypes = {
  typeOfService: PropTypes.string.isRequired,
  saveEvent: PropTypes.func.isRequired,
  freeTimes: PropTypes.array,
  setEventTime: PropTypes.func,
  user: PropTypes.object,
  logout: PropTypes.func,
  eventDate: PropTypes.instanceOf(Date),
}

ReservationForm.defaultProps = {
  eventDate: null,
}

function ReservationForm({ typeOfService, saveEvent, eventDate, setEventTime, user, logout }) {
  const [procedureId, setProcedureId] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [lastname, setLastname] = useState('')
  const [procedures, setProcedures] = useState([])
  const [freeTime, setSetFreeTime] = useState(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email)
      setLastname(user.name.familyName)
    }
    axios.get(`/procedure/get?typeOfService=${typeOfService}`)
      .then(response => {
        if (response.status === 200) {
          return response.data
        } else throw new Error("Auth failed")
      })
      .then( data => {
        setProcedures(data)
      })
      .catch(err => console.log(err))
  }, [typeOfService, user]);

  useEffect(() => {
    if (eventDate !== null) getFreeTime();
  }, [eventDate]);

  const getFreeTime = () => {
    setSetFreeTime(null);
    console.log(eventDate.toISOString())
    axios.get(`/calendar/get-free-time?date=${eventDate.toISOString()}&typeOfService=${typeOfService}`)
      .then( freeTime => {
        setSetFreeTime(freeTime.data)
        setEventTime('')
      })
      .catch(err => console.log(err));
  }

  const renderFreeTime = () => {
    if (!eventDate) return(
      <Form.Select
        name='eventTime'
        onChange={e => setEventTime(e.target.value)}
        disabled
        required
      >
        <option value="">Nejprve vyberte datum</option>
      </Form.Select>
    );
    if (freeTime === null) { return(
      <div style={{ height: "38px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>)
    }
    if (freeTime && freeTime.length) {
      return(
        <Form.Select
          name='eventTime'
          onChange={e => setEventTime(e.target.value)}
          required
        >
          <option value="">Vyberte čas</option>
          {Children.toArray(freeTime.map(time => <option key={time} value={time}>{time}</option>))}
        </Form.Select>
      )
    } else {
      return(<span>Žádné termíny.</span>);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    saveEvent({
      email,
      lastname,
      procedureId,
      typeOfService,
      notes,
      eventDate: eventDate.toISOString(),
    })
  }

  const renderCustomerDataInputs = () => {
    if (user) {
      return(
        <>
          <div className={'text-center'}>
            <span>Jste přihlášen(a) jako {user.displayName}</span>
          </div>
          <div className={'mb-3 text-center'}>
            <span className={'text-muted'}>Nejste to vy? <span className={'logout-link'} onClick={logout}>Odhlásit</span>.</span>
          </div>
        </>
      );
    } else {
      return(
        <>
          <Form.Group className='mb-2'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              placeholder='Email'
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-2'>
            <Form.Label>Příjmení</Form.Label>
            <Form.Control
              type='text'
              placeholder='Příjmení'
              value={lastname}
              onChange={event => setLastname(event.target.value)}
              required
            />
          </Form.Group>
        </>
      );
    }
  }

  return (
    <Form onSubmit={handleSubmit} method='POST'>
      {renderCustomerDataInputs()}

      <Form.Group className='mb-4'>
        <Form.Label>Poznámka</Form.Label>
        <Form.Control
          placeholder='Poznámka'
          as="textarea"
          defaultValue={""}
          onChange={event => setNotes(event.target.value)}
        />
      </Form.Group>

      <Form.Group className='mb-2'>
        <Form.Label>Úkon</Form.Label>
        <Form.Select
          name='duration'
          onChange={e => setProcedureId(e.target.value)}
          required
        >
          <option value=''>Vyberte službu...</option>
          {Children.toArray(procedures.map(procedure => <option key={procedure._id} value={procedure._id}>{procedure.name}</option>))}
        </Form.Select>

      </Form.Group>

      <Form.Group className='mb-2'>
        <Form.Label>Čas</Form.Label>
        { renderFreeTime() }
      </Form.Group>
      <Button type='submit'>Vytvořit rezervaci</Button>
    </Form>
  )
}

export default ReservationForm;