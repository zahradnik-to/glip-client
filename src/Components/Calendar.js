import React, {useRef, useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import AddEventModal from './AddEventModal';
import axios from 'axios'
import moment from "moment";
import Button from "react-bootstrap/Button";

function GlipCalendar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);

  /* Create event in current calendar */
  const onEventAdded = (event) => {
    console.log(event)
    let calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent({
      start: moment(event.start).toDate(),
      end: moment(event.end).toDate(),
      title: event.title,
    })
  }

  /* Called after an event has been added to the calendar. */
  async function handleEventAdd(data) {
    await axios.post('/calendar/create-event', data.event)
  }

  async function handleDatesSet(data) {
    const response = await axios.get(
      `/calendar/get-events?start=${moment(data.start).toISOString()}&end=${moment(data.end).toISOString()}`)
    setEvents(response.data)
  }

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>Add event</Button>

      <div style={{position: 'relative', zIndex: 0}}>
        <FullCalendar
          ref={calendarRef}
          events={events}
          plugins={[dayGridPlugin]}
          initialView='dayGridMonth'
          eventAdd={event => handleEventAdd(event)}
          datesSet={date => handleDatesSet(date)}
          contentHeight='auto'
        />
      </div>

      <AddEventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEventAdded={event => onEventAdded(event)}
      />
    </>
  )
}

export default GlipCalendar;
