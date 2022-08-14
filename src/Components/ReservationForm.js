import React, { Children, useEffect, useRef, useState } from "react";
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
import { addDays, addMinutes, isPast, isToday, startOfMonth, endOfMonth } from 'date-fns';
import InputGroup from "react-bootstrap/InputGroup";
import AdditionalProceduresAccordion from "./AdditionalProceduresAccordion";
import { formatTimeToLocaleString } from "../Utils/DateTimeHelper";

ReservationForm.propTypes = {
  typeOfService: PropTypes.string.isRequired,
  saveEvent: PropTypes.func.isRequired,
  eventTime: PropTypes.string.isRequired,
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

function ReservationForm({ typeOfService, saveEvent, eventTime ,setEventTime, user, logout, events, handleDatesSet, handleSelectAllow,
}) {
  const calendarRef = useRef(null);
  const [procedureId, setProcedureId] = useState('');
  const [eventDate, setEventDate] = useState(null)
  const [eventEndTime, setEventEndTime] = useState('')
  const [selectedAddProcList, setSelectedAddProcList] = useState([]);
  const [extraDuration, setExtraDuration] = useState(0);
  const [email, setEmail] = useState(user?.email);
  const [notes, setNotes] = useState('');
  const [lastname, setLastname] = useState(user?.name?.familyName);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber?.slice(3));
  const [procedures, setProcedures] = useState([]);
  const [additionalProcedures, setAdditionalProcedures] = useState([]);
  const [freeTime, setFreeTime] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [extraPrice, setExtraPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    axios.get(`/procedure/get?typeOfService=${typeOfService}&type=full`)
      .then(response => {
        if (response.status === 200) {
          return response.data
        } else throw new Error("Nepovedlo se získat služby.")
      })
      .then(data => {
        setProcedures(data)
        getAdditionalProcedures()
        // Set calendar to current date to force rerender and vacation fetch
        const calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate( new Date() )
      })
      .catch(err => console.log(err))
  }, [typeOfService, user]);

  useEffect(() => {
    if (eventDate !== null && procedureId) getFreeTime();
  }, [eventDate, procedureId, extraDuration]);

  const getAdditionalProcedures = () => {
    axios.get(`/procedure/get?typeOfService=${typeOfService}&type=additional`)
    .then(response => {
      if (response.status === 200) {
        return response.data
      } else throw new Error("Nepovedlo se získat služby.")
    })
    .then(data => {
      setAdditionalProcedures(data)
    })
    .catch(err => console.log(err))
  }

  const getFreeTime = () => {
    setFreeTime(null);
    axios.get(`/calendar/get-free-time?date=${eventDate.toISOString()}&procedureId=${procedureId}&duration=${totalDuration}`)
      .then(response => {
        setFreeTime(response.data)
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
      additionalProcedures: selectedAddProcList
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
    const calendarApi = calendarRef.current.getApi();
    if (selectedIsNotInPast(event) && selectedIsNotToday(event)){
      highlightDateOnMobile(calendarApi, event.dateStr)
      setEventDate(event.date)
      resetEventEndTime()
    } else {
      calendarApi.unselect();
    }
  }

  function selectedIsNotInPast(event) {
    return !isPast(addDays(new Date(event.date), 1));
  }

  function selectedIsNotToday (event) {
    return !isToday(new Date(event.date));
  }

  const highlightDateOnMobile = (calendarApi, dateStr) => {
    calendarApi.select(dateStr)
  }

  const handleSetProcedureId = (procedureId) => {
    setProcedureId(procedureId);
    const { price, duration } = procedures.find(p => p._id === procedureId)
    setTotalPrice(price + extraPrice)
    setTotalDuration(duration + extraDuration)
    resetEventEndTime();
  }

  const resetEventEndTime = () => {
    setEventEndTime("--:--");
  }

  const handleSetEventTime = (timeValue) => {
    setEventTime(timeValue);
    calculateEndTime(timeValue);
  }

  const calculateEndTime = (timeValue) => {
    const startTime = timeValue || eventTime;
    if (!startTime) return;
    const [startHour, startMin] = startTime.split(':').map(e => parseInt(e));
    const startDate = new Date(eventDate);
    startDate.setHours(startHour);
    startDate.setMinutes(startMin);

    const duration = procedures.find(e => e._id === procedureId)?.duration;
    const endDate = new Date(addMinutes(startDate, duration + extraDuration))

    setEventEndTime(formatTimeToLocaleString(endDate))
  }

  const handleAdditionalProcSelect = (chBox) => {
    const isCheckboxChecked = chBox.checked;
    const triggeredProcedureId = chBox.id;
    const procObj = additionalProcedures.find(p => p._id === triggeredProcedureId);
    if (isCheckboxChecked){
      setSelectedAddProcList([...selectedAddProcList, procObj])

      setExtraDuration(extraDuration + procObj.duration)
      setTotalDuration(totalDuration + procObj.duration)

      setExtraPrice(extraPrice + procObj.price)
      setTotalPrice(totalPrice + procObj.price)
    } else {
      const listWithRemovedProc = selectedAddProcList.filter(p => p._id !== triggeredProcedureId)
      setSelectedAddProcList(listWithRemovedProc)

      setExtraDuration(extraDuration - procObj.duration)
      setTotalDuration(totalDuration - procObj.duration)

      setExtraPrice(extraPrice - procObj.price)
      setTotalPrice(totalPrice - procObj.price)
    }
    resetEventEndTime()
  }

  // useEffect(() => {
  //   calculateEndTime()
  //   resetEventEndTime();
  // }, [handleAdditionalProcSelect])

  const validRangeObj = {
    start: "2022-08-10T07:43:32.998Z",
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={12} sm={12} className='mb-3 reservation'>
          <h1 className="h2 fst-italic">1. Vyberte službu</h1>
          <Form.Group className='mb-2'>
            <Form.Label visuallyHidden={true}>Služba</Form.Label>
            <Form.Select
              name='procedure'
              onChange={e => handleSetProcedureId(e.target.value)}
              required
            >
              <option value=''>Vyberte službu</option>
              {Children.toArray(procedures
                .map(procedure => <option
                    key={procedure._id}
                    value={procedure._id}>
                  {procedure.name} ({procedure.duration} minut) - {procedure.price} Kč
                </option>))}
            </Form.Select>
          </Form.Group>
          <AdditionalProceduresAccordion addProcList={additionalProcedures} handleAddProcedureSelect={handleAdditionalProcSelect}/>
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
          <Row>
            <Form.Group as={Col} xs={12} sm={6} className='mb-2'>
              <Form.Label>Konec</Form.Label>
              <Form.Control
                type='text'
                defaultValue={eventEndTime}
                placeholder='--:--'
                readOnly
                disabled
              />
            </Form.Group>
            <Form.Group as={Col} xs={12} sm={6} className='mb-2'>
              <Form.Label>Celková cena</Form.Label>
              <Form.Control
                  type='text'
                  value={`${totalPrice} Kč`}
                  placeholder='0'
                  readOnly
                  disabled
              />
            </Form.Group>
          </Row>
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