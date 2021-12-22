import React, { useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import PropTypes from "prop-types";
import dayGridPlugin from "@fullcalendar/daygrid";

AppointmentsPage.propTypes = {
  typeOfService: PropTypes.string.isRequired
}

function AppointmentsPage({ typeOfService }) {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);

  const handleDatesSet = (data) => {
    axios.get(`/calendar/get-events?start=${data.start.toISOString()}&end=${data.end.toISOString()}&tos=${typeOfService}`)
      .then( dates => setEvents(dates.data))
      .catch( err => {
        console.log('Getting events failed');
        console.log(err);
      })
  }

  return(
    <Row>
      <Col xs={12} className='mb-3'>
        <FullCalendar
          ref={calendarRef}
          events={events}
          plugins={[interactionPlugin, timeGridPlugin, dayGridPlugin]}
          initialView='timeGridWeek'
          datesSet={date => handleDatesSet(date)}
          contentHeight='auto'
          locale='cs'
          // Todo show more info on event click(tooltip??)
          eventClick={(info) => console.log("Event ", info.event)}
          selectable={true}
          unselectAuto={false}
          firstDay={1}
          weekends={false}
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          buttonText={{
            today:    'dnes',
            month:    'měsíc',
            week:     'týden',
            day:      'den',
            list:     'list'
          }}
          allDayText='Celý den'
        />
      </Col>
    </Row>
  )
}

export default AppointmentsPage