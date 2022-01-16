import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import EventModal from "./EventModal";

Overview.propTypes = {
  typeOfService: PropTypes.string.isRequired,
}

function Overview({ typeOfService }) {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [procedures, setProcedures] = useState([])


  const handleDatesSet = (data) => {
    axios.get(`/calendar/get-events?start=${data.start.toISOString()}&end=${data.end.toISOString()}&tos=${typeOfService}`)
      .then( dates => setEvents(dates.data))
      .catch( err => {
        console.log('Getting events failed');
        console.log(err);
      })
  }

  const openEventModal = (event) => {
    getProcedures()
    axios.get(`/calendar/get-event?_id=${event.extendedProps._id}`)
      .then( event => setSelectedEvent(event.data))
      .then( setModalIsOpen(true) )
      .catch( err => {
        console.log('Getting events failed');
        console.log(err);
      })
  }

  const handleSubmit = (event) => {
    setModalIsOpen(false)
    console.log(event)
  }

  const getProcedures = () => {
    axios.get(`/procedure/get?tos=${typeOfService}`)
      .then(response => {
        if (response.status === 200) {
          return response.data
        } else throw new Error("Auth failed")
      })
      .then( data => {
        setProcedures(data)
      })
      .catch(err => console.log(err))
  }

  const handleModalOnClose = () => {
    setModalIsOpen(false);
    setSelectedEvent({})
  }

  return(
    <>
      <div style={{ position: "relative", zIndex: 0 }}>
        <FullCalendar
          ref={calendarRef}
          events={events}
          plugins={[interactionPlugin, timeGridPlugin, dayGridPlugin]}
          initialView='timeGridWeek'
          datesSet={date => handleDatesSet(date)}
          contentHeight='auto'
          locale='cs'
          // Todo show more info on event click(tooltip??)
          eventClick={(info) => openEventModal(info.event)}
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
        />
      </div>
      <EventModal isOpen={modalIsOpen} onSubmit={handleSubmit} event={selectedEvent} onClose={handleModalOnClose} procedures={procedures}/>
    </>
  )
}

export default Overview;