import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
import PropTypes from "prop-types";
import EventModal from "./EventModal";
import StaffEventModal from "./StaffEventModal";
import ToastNotification from "../ToastNotification";

Overview.propTypes = {
  typeOfService: PropTypes.string.isRequired,
  user: PropTypes.object,
}

function Overview({ typeOfService, user }) {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedStaffEvent, setSelectedStaffEvent] = useState({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [showStaffEventModal, setShowStaffEventModal] = useState(false);
  const [procedures, setProcedures] = useState([])
  const [datesStart, setDatesStart] = useState(new Date())
  const [datesEnd, setDatesEnd] = useState(new Date())
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({});


  const handleDatesSet = (data) => {
    axios.get(`/calendar/get-events?start=${data.start.toISOString()}&end=${data.end.toISOString()}&typeOfService=${typeOfService}`)
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

  const getEvents = () => {
    axios.get(`/calendar/get-events?start=${datesStart.toISOString()}&end=${datesEnd.toISOString()}&typeOfService=${typeOfService}`)
      .then( dates => {
        console.log(dates.data)
        setEvents(dates.data)
      })
      .catch( err => {
        console.log('Getting events failed');
        console.log(err);
      })
  }

  const openEventModal = (event) => {
    if (event.display === 'background'){
      axios.get(`/calendar/get-staff-event?_id=${event.extendedProps._id}`)
        .then( event => setSelectedStaffEvent(event.data))
        .then( setShowStaffEventModal(true) )
        .catch( err => {
          console.warn('Getting staff event failed.');
          console.error(err);
        })
    } else {
      getProcedures()
      axios.get(`/calendar/get-event?_id=${event.extendedProps._id}`)
        .then( event => setSelectedEvent(event.data))
        .then( setShowEventModal(true) )
        .catch( err => {
          console.warn('Getting event failed.');
          console.error(err);
        })
    }
  }

  const handleEventUpdate = (data) => {
    setShowEventModal(false)
    if (data.dateTimeChange) {
      const time = data.time.split(':')
      const start = data.date.setHours(Number(time[0]), Number(time[1]))
      data = {
        ...data,
        start: new Date(start).toISOString(),
      }
    }
    axios.put(`/calendar/update-event`, data)
      .then(response => {
        if (response.status === 200) {
          setToastContent({
            header: "Upraveno!",
            message: `Položka byla upravena.`,
            variant: "success"
          })
          setShowToast(true);
          getEvents();
          return response.data
        } else throw new Error("Auth failed")
      })
      .then(setSelectedEvent({}))
      .catch(err => renderToastError(err))
  }

  const handleStaffEventUpdate = (data) => {
    setShowStaffEventModal(false)
    console.log(data)
    axios.put(`/calendar/update-staff-event`, data)
      .then(response => {
        if (response.status === 200) {
          setToastContent({
            header: "Upraveno!",
            message: `Položka byla upravena.`,
            variant: "success"
          })
          setShowToast(true);
          getEvents();
          return response.data
        } else throw new Error("Auth failed")
      })
      .then(setSelectedStaffEvent({}))
    .catch(err => renderToastError(err))
  }

  const getProcedures = () => {
    axios.get(`/procedure/get?typeOfService=${typeOfService}`)
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
    setSelectedEvent({})
    setSelectedStaffEvent({})
    setShowEventModal(false);
    setShowStaffEventModal(false);
  }

  const cancelEvent = (dtoIn) => {
    axios.put(`/calendar/cancel-event`, dtoIn)
      .then(response => {
        if (response.status === 200) {
          setShowEventModal(false);
          setSelectedEvent({})
          getEvents();
          setToastContent({
            header: "Stornováno!",
            message: `Událost byla stornována.`,
            variant: "warning"
          })
          setShowToast(true);
          return response.data
        } else throw new Error("Auth failed")
      })
    .catch(err => renderToastError(err))
  }

  const deleteStaffEvent = (_id) => {
    axios.delete(`/calendar/delete-staff-event`, { data: { _id } })
      .then(response => {
        if (response.status === 200) {
          setShowStaffEventModal(false);
          setSelectedStaffEvent({})
          getEvents();
          setToastContent({
            header: "Smazáno!",
            message: `Dovolená byla vymazána.`,
            variant: "warning"
          })
          setShowToast(true);
          return response.data;
        } else throw new Error("Auth failed")
      })
      .catch(err => renderToastError(err))
  }

  const renderToastError = (err) => {
    setToastContent({
      header: "Chyba!",
      message: `Při provádění operace se objevila chyba. ${err.toString()}`,
      variant: "danger"
    });
    setShowToast(true);
  }

  return(
    <>
      <div style={{ position: "relative", zIndex: 0 }} className={"mb-4"}>
        <FullCalendar
          ref={calendarRef}
          events={events}
          plugins={[interactionPlugin, timeGridPlugin, dayGridPlugin]}
          initialView='timeGridWeek'
          datesSet={date => handleDatesSet(date)}
          contentHeight='auto'
          locale='cs'
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
          eventDurationEditable={false}
          eventOverlap={true}
          eventConstraint={{
            startTime: new Date().toISOString()
        }}
        />
      </div>
      <ToastNotification showToast={showToast} setShowToast={setShowToast} toastContent={toastContent}/>
      <EventModal
        isOpen={showEventModal}
        onSubmit={handleEventUpdate}
        event={selectedEvent}
        onClose={handleModalOnClose}
        procedures={procedures}
        onEventCancel={cancelEvent} />
      <StaffEventModal
        isOpen={showStaffEventModal}
        onSubmit={handleStaffEventUpdate}
        event={selectedStaffEvent}
        onClose={handleModalOnClose}
        onDelete={deleteStaffEvent}
        user={user} />
    </>
  )
}

export default Overview;