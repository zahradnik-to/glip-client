import React, { useState, Children, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import PropTypes from "prop-types";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import Spinner from 'react-bootstrap/Spinner';
import { isPast, addDays, addMinutes }  from 'date-fns';
import InputGroup from "react-bootstrap/InputGroup";

ReservationForm.propTypes = {
  typeOfService: PropTypes.string.isRequired,
  saveEvent: PropTypes.func.isRequired,
  setEventTime: PropTypes.func.isRequired,
  handleDatesSet: PropTypes.func.isRequired,
  handleSelectAllow: PropTypes.func.isRequired,
  events: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
}

ReservationForm.defaultProps = {
  eventDate: null,
}

function ReservationForm({ typeOfService, saveEvent, setEventTime, user, logout, events, handleDatesSet, handleSelectAllow,
}) {
  const calendarRef = useRef(null);
  const [procedureId, setProcedureId] = useState('');
  const [eventDate, setEventDate] = useState(null)
  const [eventEndTime, setEventEndTime] = useState('')
  const [extraDuration, setExtraDuration] = useState(0); // Todo Extra duration added by checking checkboxes
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [lastname, setLastname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [procedures, setProcedures] = useState([]);
  const [freeTime, setSetFreeTime] = useState(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email)
      setLastname(user.name.familyName)
      setPhoneNumber(user.phoneNumber.slice(3))
    }
    axios.get(`/procedure/get?typeOfService=${typeOfService}`)
      .then(response => {
        if (response.status === 200) {
          return response.data
        } else throw new Error("Auth failed")
      })
      .then(data => {
        setProcedures(data)
      })
      .catch(err => console.log(err))
  }, [typeOfService, user]);

  useEffect(() => {
    if (eventDate !== null && procedureId) getFreeTime();
  }, [eventDate, procedureId]);

  const getFreeTime = () => {
    setSetFreeTime(null);
    axios.get(`/calendar/get-free-time?date=${eventDate.toISOString()}&typeOfService=${typeOfService}&procedureId=${procedureId}`)
      .then(freeTime => {
        setSetFreeTime(freeTime.data)
        setEventTime('')
      })
      .catch(err => console.log(err));
  }

  const renderFreeTime = () => {
    if (!eventDate || !procedureId) return (
      <Form.Select
        name='eventTime'
        onChange={e => handleSetEventTime(e.target.value)}
        required
      >
        <option value="">Nejprve vyberte službu a datum</option>
      </Form.Select>
    );
    if (!eventDate) return (
      <Form.Select
        name='eventTime'
        onChange={e => handleSetEventTime(e.target.value)}
        required
      >
        <option value="">Nyní vyberte datum</option>
      </Form.Select>
    );
    if (freeTime === null) return (
      <div style={{ height: "38px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
    if (freeTime && freeTime.length) {return (
      <Form.Select
        name='eventTime'
        onChange={e => handleSetEventTime(e.target.value)}
        required
      >
        <option value="">Vyberte čas</option>
        {Children.toArray(freeTime.map(time => <option key={time} value={time}>{time}</option>))}
      </Form.Select>)
    } else {
      return (
        <Form.Control
          type='text'
          value={"Žádné volné termíny"}
          readOnly={true}
          disabled={true}
        />
      );
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    saveEvent({
      email,
      lastname,
      phoneNumber: `420${phoneNumber}`,
      procedureId,
      typeOfService,
      notes,
      eventDate: eventDate.toISOString(),
    })
    const calendarApi = calendarRef.current.getApi();
    calendarApi.unselect();

    setEventTime("");
    setEventEndTime("--:--");
    setEventDate(null)
  }

  const renderCustomerDataInputs = () => {
    return (
      <>
        <Form.Group className='mb-2'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            value={email}
            placeholder='Email'
            onChange={event => setEmail(event.target.value)}
            readOnly={!!user}
            disabled={!!user}
            required={!user}
          />
        </Form.Group>
        <Form.Group className='mb-2'>
          <Form.Label>Příjmení</Form.Label>
          <Form.Control
            type='text'
            value={lastname}
            placeholder='Příjmení'
            onChange={event => setLastname(event.target.value)}
            readOnly={!!user}
            disabled={!!user}
            required={!user}
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

        <Form.Group className='mb-4'>
          <Form.Label>Poznámka k objednávce</Form.Label>
          <Form.Control
            placeholder='Poznámka'
            as="textarea"
            defaultValue={""}
            onChange={event => setNotes(event.target.value)}
          />
        </Form.Group>
      </>
    );
  }

  const handleDateClick = (event) => {
    if (!isPast(addDays(new Date(event.date), 1))){
      setEventDate(event.date)
      setEventEndTime("--:--")
      return;
    }
    // If in past, unselect
    const calendarApi = calendarRef.current.getApi();
    calendarApi.unselect();
  }

  const handleSetEventTime = (timeValue) => {
    setEventTime(timeValue);
    getEndTime(timeValue);
  }

  const getEndTime = (timeStartValue) => {
    const startTime = timeStartValue.split(':').map(e => parseInt(e));
    const startDate = new Date(eventDate);
    const duration = procedures.find(e => e._id === procedureId)?.duration;
    startDate.setHours(startTime[0]);
    startDate.setMinutes(startTime[1]);

    const endDate = new Date(addMinutes(startDate, duration))

    const doubleDigit = (time) => ("0" + time).slice(-2);
    const endHours = doubleDigit(endDate.getHours());
    const endMins = doubleDigit(endDate.getMinutes());

    setEventEndTime(`${endHours}:${endMins}`)
  }

  const handleSetProcedureId = (procedureId) => {
    setProcedureId(procedureId);
    setEventEndTime("--:--");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={12} sm={12} className='mb-3 reservation'>
          <h1 className="h2 fst-italic">1. Vyberte službu</h1>
          <Form.Group className='mb-2'>
            <Form.Label>Úkon</Form.Label>
            <Form.Select
              name='procedure'
              onChange={e => handleSetProcedureId(e.target.value)}
              required
            >
              <option value=''>Vyberte službu</option>
              {Children.toArray(procedures
                .map(procedure => <option key={procedure._id} value={procedure._id}>{procedure.name} ({procedure.duration} minut) - {procedure.price}Kč</option>))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={8} sm={12} className='mb-3 reservation'>
          <h1 className="h2 fst-italic">2. Vyberte datum a čas</h1>
          <FullCalendar
            ref={calendarRef}
            events={events}
            plugins={[interactionPlugin, dayGridPlugin]}
            initialView='dayGridMonth'
            datesSet={date => handleDatesSet(date)}
            contentHeight='auto'
            locale={'cs'}
            firstDay={1}
            selectable={true}
            selectAllow={(e) => handleSelectAllow(e)}
            dateClick={e => handleDateClick(e)}
            unselectAuto={false}
            weekends={false}
            buttonText={{
              today: 'dnes',
              month: 'měsíc',
              week:  'týden',
              day:   'den',
              list:  'list',
            }}
            moreLinkText={'další'}
            dayMaxEvents={2}
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: false,
              hour12: false
            }}
          />
        </Col>
        <Col md={4} sm={12} className='mb-3 reservation'>
          <h4 className="mt-5">Čas</h4>
          <Form.Group className='mb-2'>
            <Form.Label>Začátek</Form.Label>
            {renderFreeTime()}
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Konec</Form.Label>
            <Form.Control
              type='text'
              value={eventEndTime}
              placeholder='--:--'
              readOnly
              disabled
            />
          </Form.Group>

          <h1 className="h2 fst-italic mt-5">3. Doplňte informace</h1>
          {renderCustomerDataInputs()}

          { user ? <>
            <div className={'text-center'}>
              <span>Jste přihlášen(a) jako {user.displayName}</span>
            </div>
            <div className={'mb-3 text-center'}>
              <span className={'text-muted'}>Nejste to vy? <span className={'logout-link'} onClick={logout}>Odhlásit</span>.</span>
            </div></> : <></>
          }

          <Button
            type='submit'
          >
            Vytvořit rezervaci
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default ReservationForm;