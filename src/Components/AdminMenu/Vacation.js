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

Vacation.propTypes = {
  typeOfService: PropTypes.string.isRequired,
}

const typeOfServicesEnum = {
  hair: "Kadeřnictví",
  massage: "Masáže",
  cosmetics: "Kosmetika",
}

function Vacation({ typeOfService }) {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [vacationEvent, setVacationEvent] = useState({});

  const handleDatesSet = (data) => {
    axios.get(`/calendar/get-events?start=${data.start.toISOString()}&end=${data.end.toISOString()}&tos=${typeOfService}`)
      .then( dates => setEvents(dates.data))
      .catch( err => {
        console.log('Getting events failed');
        console.log(err);
      })
  }

  const createVacation = () => {
    console.log(vacationEvent)
    const dtoIn = {
      title: `${typeOfServicesEnum[typeOfService]} dovolená`,
      start: new Date(vacationEvent.start).toISOString(),
      end: new Date(vacationEvent.end).toISOString(),
      display: 'background',
      allDay: vacationEvent.allDay,
      typeOfService,
    }

    axios.post('/calendar/create-vacation', dtoIn)
      .then(result => {
        if (result.status === 201) {
          // Todo add confirmation to user
          const calendarApi = calendarRef.current.getApi();
          calendarApi.unselect()
          renderCreatedVacation(dtoIn)
        } else {
          // Something went wrong!
        }
      })
      .catch(err => console.log(err))
  }

  const renderCreatedVacation = (event) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent(event)
  }

  /* Forbid selecting range in the past */
  const handleSelectAllow = (data) => {
    return !(isPast(data.start) || isPast(data.end));
  }

  return(
    <Row>
      <Col xs={12} className='mb-4 vacation' id={"vacation"}>
        <FullCalendar
          className='vacation'
          ref={calendarRef}
          events={events}
          plugins={[interactionPlugin, timeGridPlugin, dayGridPlugin]}
          initialView='timeGridWeek'
          datesSet={date => handleDatesSet(date)}
          contentHeight='auto'
          locale='cs'
          // Todo show more info on event click(tooltip??)
          eventClick={(info) => console.log("Event ", info.event)}
          // dateClick={(event) => handleDateClick(event)}
          selectAllow={(e) => handleSelectAllow(e)}
          firstDay={1}
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
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
            endTime: '20:00',
          }}
          headerToolbar={{
            left: 'prev,next today createVacationBtn',
            center: 'title',
            right: 'timeGridWeek,dayGridMonth'
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
  )
}

export default Vacation;