import React, { useState, Children } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";


ReservationForm.propTypes = {
  typeOfService: PropTypes.string.isRequired,
  saveEvent: PropTypes.func.isRequired,
  freeTimes: PropTypes.array,
  setEventTime: PropTypes.func,
}

function ReservationForm({ typeOfService, saveEvent, freeTimes, setEventTime }) {

  const [duration, setDuration] = useState(0)
  const [email, setEmail] = useState('')
  const [lastname, setLastname] = useState('')

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

  return (
    <Form onSubmit={handleSubmit} method='POST'>
      <Form.Group className='mb-2'>
        <Form.Label>Email</Form.Label>
        <Form.Control
          // type='email' Fixme enable browser email verification
          placeholder='Email'
          value={email}
          onChange={event => setEmail(event.target.value)}
          required/>
      </Form.Group>

      <Form.Group className='mb-2'>
        <Form.Label>Příjmení</Form.Label>
        <Form.Control
          type='text'
          placeholder='Příjmení'
          value={lastname}
          onChange={event => setLastname(event.target.value)}
          required/>
      </Form.Group>

      <Form.Group className='mb-2'>
        {/* Todo list services based on typeOfService */}
        <Form.Label>Úkon</Form.Label>
        <Form.Select
          name='duration'
          onChange={e => setDuration(Number(e.target.value))}
          required
        >
          <option value=''>Vyberte službu...</option>
          <option value='30'>Stříhání páni</option>
          <option value='45'>Stříhání dámy</option>
          <option value='60'>Barvení vlasů</option>
        </Form.Select>

      </Form.Group>
      <div className='mb-2'>
        {/* Fixme add unique keys */}
        {/* eslint-disable-next-line react/jsx-key */}
        {Children.toArray(freeTimes.map(time => <span onClick={e => handleTimeClick(e.target)} className='timePickerEntry me-3 mt-3'>{time}</span>))}
      </div>
      <Button type='submit'>Add event</Button>
    </Form>
  )
}

export default ReservationForm;