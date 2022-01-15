import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
import PropTypes from "prop-types";

Overview.propTypes = {
  typeOfService: PropTypes.string.isRequired,
}

function Overview({ typeOfService }) {
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
      slotMinTime="06:00:00"
      slotMaxTime="21:00:00"
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
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,dayGridMonth'
      }}
      eventLimit={true}
      nowIndicator={true}
    />
  )
}

export default Overview;