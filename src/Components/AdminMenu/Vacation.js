import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import isPast from 'date-fns/isPast'
import './Vacation.css'
import ToastNotification from "../ToastNotification";

Vacation.propTypes = {
  typeOfService: PropTypes.string.isRequired,
}

function Vacation({ typeOfService }) {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [vacationEvent, setVacationEvent] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({});

  const handleDatesSet = (data) => {
    axios.get(`/calendar/get-events?start=${data.start.toISOString()}&end=${data.end.toISOString()}&typeOfService=${typeOfService}`)
      .then( dates => setEvents(dates.data))
      .catch( err => {
        console.log('Getting events failed');
        console.log(err);
      })
  }

  const createVacation = () => {
    const dtoIn = {
      title: `${typeOfService} dovolená`,
      start: new Date(vacationEvent.start).toISOString(),
      end: new Date(vacationEvent.end).toISOString(),
      display: 'background',
      allDay: vacationEvent.allDay,
      eventType: 'vacation',
      typeOfService,
    }

    axios.post('/calendar/create-staff-event', dtoIn)
      .then(result => {
        if (result.status === 201) {
          const calendarApi = calendarRef.current.getApi();
          calendarApi.unselect()
          renderCreatedVacation(dtoIn)
          setToastContent({
            header: "Zaznamenáno!",
            message: `Dovolená dne ${dtoIn.start.split('T')[0]} byla zaznamenána.`,
            variant: "success"
          })
          setShowToast(true);
        } else throw new Error("Nepovedlo se vytvořit událost.")
      })
      .catch(err => renderToastError(err))
  }

  const renderToastError = (err) => {
    console.log(err);
    setToastContent({
      header: "Chyba!",
      message: `Při provádění operace se objevila chyba.`,
      variant: "danger"
    })
    setShowToast(true);
  }

  const renderCreatedVacation = (event) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent(event)
  }

  const handleSelectAllow = (data) => {
    /* Forbid selecting range in the past */
    const isNotInPast = !(isPast(data.start) || isPast(data.end))
    /* Forbid selecting range of more than 1 day */
    const utc1 = Date.UTC(data.start.getFullYear(), data.start.getMonth(), data.start.getDate());
    const utc2 = Date.UTC(data.end.getFullYear(), data.end.getMonth(), data.end.getDate());
    const dayMilliseconds = 1000 * 60 * 60 * 24;
    const isInRange = Math.floor((utc2 - utc1) / dayMilliseconds) <= 7

    return isInRange && isNotInPast;
  }

  return(
    <>
      <Row>
        <Col xs={12} className='mb-4 vacation' id={"vacation"} style={{ position: "relative", zIndex: 0 }}>
          <FullCalendar
            ref={calendarRef}
            events={events}
            plugins={[interactionPlugin, timeGridPlugin]}
            initialView='timeGridWeek'
            datesSet={date => handleDatesSet(date)}
            contentHeight='auto'
            locale='cs'
            selectAllow={(e) => handleSelectAllow(e)}
            firstDay={1}
            weekends={false}
            slotDuration="00:15:00"
            slotMinTime="07:00:00"
            slotMaxTime="17:00:00"
            allDayText='Celý den'
            buttonText={{
              today: 'dnes',
              month: 'měsíc',
              week:  'týden',
              day:   'den',
              list:  'list'
            }}
            businessHours={{
              daysOfWeek: [ 1, 2, 3, 4, 5 ],
              startTime: '07:00',
              endTime: '17:00',
            }}
            headerToolbar={{
              left: 'prev,next today createVacationBtn',
              center: 'title',
              right: 'timeGridWeek'
            }}
            selectable={true}
            selectMirror={true}
            select={(event) => setVacationEvent(event)}
            selectOverlap={false}
            customButtons={{
              createVacationBtn: {
                text: "Vytvořit dovolenou",
                click: function () {
                  createVacation();
                }
              }
            }}
            nowIndicator={true}
          />
        </Col>
      </Row>
      <ToastNotification showToast={showToast} setShowToast={setShowToast} toastContent={toastContent}/>
    </>
  )
}

export default Vacation;