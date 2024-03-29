import React, { useEffect, useState, } from "react";
import PropTypes from "prop-types";
import Row from "react-bootstrap/Row";
import axios from "axios";
import ReservationForm from "../Components/ReservationForm";
import ToastNotification from "../Components/ToastNotification";
import { formatDateToLocaleString } from "../Utils/DateTimeHelper";

ReservationPage.propTypes = {
  typeOfService: PropTypes.object.isRequired,
  logout: PropTypes.func,
  user: PropTypes.object,
}

function ReservationPage({ typeOfService, user, logout }) {
  const [events, setEvents] = useState([]);
  const [eventTime, setEventTime] = useState('')
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({
    header: "Chyba!",
    message: `Při provádění operace se objevila chyba.`,
    variant: "danger"
  });

  /* Saves event to database. Triggered by form. */
  const handleSaveEvent = (data) => {
    const time = eventTime.split(':')
    const start = new Date(data.eventDate);
    start.setHours(Number(time[0]), Number(time[1]));
    const dtoIn = {
      date: new Date(data.eventDate).toISOString(),
      start: start.toISOString(),
      eventTime,
      ...data
    }
    axios.post('/calendar/create-event', dtoIn)
      .then(result => {
        if (result.status === 201) {
          const event = result.data;
          const eventDate = formatDateToLocaleString(event.date)
          setToastContent({
            header: "Rezervováno!",
            message: `Vaše rezervace ${eventDate} v ${event.eventTime} byla zaznamenána.`,
            variant: "success"
          })
          setShowToast(true);
        } else{
          throw new Error('Rezervace neproběhla.')
        }
      })
      .catch((err) => renderToastError(err.response.data.message))
  }

  const renderToastError = (message) => {
    setToastContent({
      header: "Chyba!",
      message: message ?? `Při provádění operace se objevila chyba.`,
      variant: "danger"
    })
    setShowToast(true);
  }

  const handleDatesSet = (data) => {
    axios.get(`/calendar/get-bg-events?start=${data.start.toISOString()}&end=${data.end.toISOString()}&typeOfService=${typeOfService.displayName}`)
      .then( dates => setEvents(dates.data))
      .catch( () => renderToastError())
  }

  /* Forbid selecting range of more than 1 day */
  const handleSelectAllow = (data) => {
    const utc1 = Date.UTC(data.start.getFullYear(), data.start.getMonth(), data.start.getDate());
    const utc2 = Date.UTC(data.end.getFullYear(), data.end.getMonth(), data.end.getDate());
    const dayMilliseconds = 1000 * 60 * 60 * 24;

    return Math.floor((utc2 - utc1) / dayMilliseconds) <= 1;
  }

  return (
    <>
      <Row>
        <h1 className={"mb-3 text-center"}><u>{typeOfService.displayName}</u></h1>
        <ReservationForm
          typeOfService={typeOfService.name}
          saveEvent={handleSaveEvent}
          eventTime={eventTime}
          setEventTime={setEventTime}
          user={user}
          logout={logout}
          events={events}
          handleDatesSet={handleDatesSet}
          handleSelectAllow={handleSelectAllow}
        />
      </Row>
      <ToastNotification showToast={showToast} setShowToast={setShowToast} toastContent={toastContent}/>
    </>
  );
}

export default ReservationPage;