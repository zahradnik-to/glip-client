import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from 'axios';

UserEventCalendar.propTypes = {
  openEventModal: PropTypes.func.isRequired,
  setUpdate: PropTypes.func.isRequired,
  update: PropTypes.bool.isRequired,
};

function UserEventCalendar({ openEventModal, update, setUpdate }) {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [datesStart, setDatesStart] = useState(new Date())
  const [datesEnd, setDatesEnd] = useState(new Date())

  const handleDatesSet = (data) => {
    axios.get(`/calendar/get-events?start=${data.start.toISOString()}&end=${data.end.toISOString()}`)
      .then( dates => {setEvents(dates.data)})
      .then(() => {
        setDatesStart(data.start);
        setDatesEnd(data.end);
      })
      .catch( err => {
        console.log('Getting events failed');
        console.log(err);
      })
  }

  useEffect(() => {
    if (update) return getEvents();
  }, [update])

  const getEvents = () => {
    axios.get(`/calendar/get-events?start=${datesStart.toISOString()}&end=${datesEnd.toISOString()}`)
      .then( dates => {
        setEvents(dates.data)
        setUpdate(false)
      })
      .catch( err => {
        console.log('Getting events failed');
        console.log(err);
      })
  }

  return (
    <div style={{ position: "relative", zIndex: 0 }} className={"mb-4"}>
      <FullCalendar
        ref={calendarRef}
        events={events}
        plugins={[interactionPlugin, timeGridPlugin, dayGridPlugin]}
        initialView='dayGridMonth'
        datesSet={date => handleDatesSet(date)}
        contentHeight='auto'
        locale='cs'
        eventClick={(info) => openEventModal(info.event.extendedProps)}
        selectable={false}
        unselectAuto={false}
        firstDay={1}
        slotMinTime="06:00:00"
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
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,dayGridMonth'
        }}
        nowIndicator={true}
        eventDurationEditable={false}
        eventOverlap={true}
        eventConstraint={{
          startTime: new Date().toISOString()
        }}
      />
      <span className="text-muted">Kalendář zobrazuje pouze nestornované objednávky.</span>
    </div>
  );
}

export default UserEventCalendar;