import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import ReservationForm from "../Components/ReservationForm";

ReservationPage.propTypes = {
  typeOfService: PropTypes.string.isRequired
}

function ReservationPage({ typeOfService }) {
  const [events, setEvents] = useState([]);
  const [freeTimes, setSetFreeTimes] = useState([]);
  const [eventDate, setEventDate] = useState(new Date())
  const [eventTime, setEventTime] = useState('08:30')
  const calendarRef = useRef(null);

  /* Creates event in current calendar */
  const createCalendarEvent = (event) => {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent({
      start: new Date(event.start),
      title: `${event.lastname} ${event.duration}min`,
      allDay: event.allDay,
    })
  }

  /* Saves event to database. Triggered by form. */
  async function handleSaveEvent(data) {
    const time = eventTime.split(':')
    eventDate.setHours(Number(time[0]), Number(time[1]));

    const dtoIn = {
      start: eventDate,
      ...data
    }
    await axios.post('/calendar/create-event', dtoIn)
      .then(event => createCalendarEvent(event.data))
      .catch(err => console.log(err))
  }

  async function handleDatesSet(data) {
    await axios
      .get(`/calendar/get-events?start=${data.start.toISOString()}&end=${data.end.toISOString()}`)
      .then((res) => {
        setEvents(res.data)
      })
      .catch(err => {
        console.log(err)
        Promise.reject(err)
      })

    await axios
      .get(`/calendar/get-free-time?date=${eventDate.toISOString()}`)
      .then((res) => {
        setSetFreeTimes(res.data)
      })
      .catch(err => {
        console.log(err)
        Promise.reject(err)
      })
  }

  /* Forbid selecting range of more than 1 day */
  const handleSelectAllow = (data) => {
    const utc1 = Date.UTC(data.start.getFullYear(), data.start.getMonth(), data.start.getDate());
    const utc2 = Date.UTC(data.end.getFullYear(), data.end.getMonth(), data.end.getDate());
    const dayMilliseconds = 1000 * 60 * 60 * 24;

    return Math.floor((utc2 - utc1) / dayMilliseconds) <= 1;
  }

  const handleDateClick = (event) => {
    setEventDate(event.date)
    setEventTime('')
  }


  return (
    <>
      <Row>
        <Col md={8} xs={12} className='mb-3'>
          <FullCalendar
            ref={calendarRef}
            events={events}
            plugins={[interactionPlugin, dayGridPlugin]}
            initialView='dayGridMonth'
            datesSet={date => handleDatesSet(date)}
            contentHeight='auto'
            locale='cs'
            firstDay={1}
            selectable={true}
            selectAllow={(e) => handleSelectAllow(e)}
            eventClick={(info) => console.log("Event ", info.event.start)}
            dateClick={e => handleDateClick(e)}
            unselectAuto={false}
          />
        </Col>
        <Col md={4} xs={12}>
          <ReservationForm
            typeOfService={typeOfService}
            saveEvent={handleSaveEvent}
            freeTimes={freeTimes}
            setEventTime={setEventTime}
          />
        </Col>
      </Row>
    </>
  );
}

export default ReservationPage;