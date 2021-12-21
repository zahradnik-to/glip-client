import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
// import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import ReservationForm from "../Components/ReservationForm";

ReservationPage.propTypes = {
  typeOfService: PropTypes.string.isRequired
}

function ReservationPage({ typeOfService }) {
  const [events, setEvents] = useState([]);
  const [eventDate, setEventDate] = useState(new Date())
  const [freeTimes, setSetFreeTimes] = useState([]);
  const [eventTime, setEventTime] = useState('08:30')
  const calendarRef = useRef(null);

  useEffect(() => {
    getFreeTime();
  }, [eventDate]);

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
  const handleSaveEvent = (data) => {
    const time = eventTime.split(':')
    eventDate.setHours(Number(time[0]), Number(time[1]));

    const dtoIn = {
      start: eventDate,
      ...data
    }
    console.log(dtoIn)
    axios.post('/calendar/create-event', dtoIn)
      .then(event => createCalendarEvent(event.data))
      .catch(err => console.log(err))
  }

  const handleDatesSet = (data) => {
    axios.get(`/calendar/get-events?start=${data.start.toISOString()}&end=${data.end.toISOString()}&tos=${typeOfService}`)
      .then( dates => setEvents(dates.data))
      .catch( err => {
        console.log('Getting events failed');
        console.log(err);
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
  }

  const getFreeTime = () => {
    axios.get(`/calendar/get-free-time?date=${eventDate.toISOString()}&tos=${typeOfService}`)
      .then( freeTime => {
        setSetFreeTimes(freeTime.data)
        setEventTime('')
      })
      .catch(err => console.log(err))
  }


  return (
    <>
      <Row>
        <Col md={8} xs={12} className='mb-3'>
          <FullCalendar
            ref={calendarRef}
            events={events}
            // plugins={[interactionPlugin, timeGridPlugin]}
            // initialView='timeGridWeek'
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
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            weekends={false}
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