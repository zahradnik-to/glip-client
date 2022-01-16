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
  const [duration, setDuration] = useState(0)
  const [email, setEmail] = useState('')
  const [lastname, setLastname] = useState('')
  const [procedures, setProcedures] = useState([])
  const [freeTimes, setSetFreeTimes] = useState(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email)
      setLastname(user.name.familyName)
    }
    axios.get(`/procedure/get?tos=${typeOfService}`)
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
    setSetFreeTimes(null);
    axios.get(`/calendar/get-free-time?date=${eventDate.toISOString()}&tos=${typeOfService}`)
      .then( freeTime => {
        setSetFreeTimes(freeTime.data)
        setEventTime('')
      })
      .catch(err => console.log(err));
  }

  const renderFreeTime = () => {
    if (!eventDate) return(<span>Vyberte datum.</span>);
    if (freeTimes === null) { return(
        <Spinner animation="border" role="status" className={"m-4"}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>)
    }

    if (freeTimes && freeTimes.length) {
      return(
        Children.toArray(freeTimes.map(time => <span key={time} onClick={e => handleTimeClick(e.target)} className='timePickerEntry me-3 mt-3'>{time}</span>))
      )
    } else {
      return(<span>Žádné termíny.</span>); // Todo This should not happen. Block date from picking in the first place.
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    saveEvent({
      email,
      lastname,
      duration,
      typeOfService,
    })
  }

  const handleTimeClick = (element) => {
    setEventTime(element.innerText)
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
      <Form.Group className='mb-2'>
        <Form.Label>Úkon</Form.Label>
        <Form.Select
          name='duration'
          onChange={e => setDuration(Number(e.target.value))}
          required
        >
          <option value=''>Vyberte službu...</option>
          {Children.toArray(procedures.map(procedure => <option key={procedure._id} value={procedure.duration}>{procedure.name}</option>))}
        </Form.Select>

      </Form.Group>
      <div className='mb-2 text-center'>
        { renderFreeTime() }
      </div>

      <Button type='submit'>Vytvořit rezervaci</Button>
    </Form>
  )
}

export default ReservationForm;