import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import ToastNotification from "../Components/ToastNotification";
import UserEventModal from "../Components/UserEventModal";
import { Col, Row, Nav } from "react-bootstrap";
import UserEventList from "../Components/UserEventList";
import UserEventCalendar from "../Components/UserEventCalendar";
import ErrorPage from "./ErrorPage";
import { Link } from "react-router-dom";

UserOverviewPage.propTypes = {
  user: PropTypes.object,
  page: PropTypes.string.isRequired,
}

function UserOverviewPage({ user, page }) {
  const [selectedEvent, setSelectedEvent] = useState({});
  const [showEventModal, setShowEventModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({});
  const [updateRequired, setUpdateRequired] = useState(false);

  if (!user) return <ErrorPage err={{ status:403 }}/>

  const openEventModal = (event) => {
    const procedureName = event.procedureName
    axios.get(`/calendar/get-event?_id=${event._id}`)
      .then( foundEvent => setSelectedEvent({ ...foundEvent.data, procedureName }))
      .then( setShowEventModal(true) )
      .catch( err => {
        console.error(err);
      })
  }

  const handleEventUpdate = (data) => {
    setUpdateRequired(true)
    setShowEventModal(false)
    axios.put(`/calendar/update-event`, data)
      .then(response => {
        if (response.status === 200) {
          setToastContent({
            header: "Upraveno!",
            message: `Položka byla upravena.`,
            variant: "success"
          })
          setShowToast(true);
          return response.data
        } else throw new Error("Auth failed")
      })
      .then(setSelectedEvent({}))
      .catch(err => renderToastError(err))
  }

  const handleModalOnClose = () => {
    setSelectedEvent({})
    setShowEventModal(false);
  }

  const cancelEvent = (_id) => {
    setUpdateRequired(true)
    axios.put(`/calendar/cancel-event`, _id)
      .then(response => {
        if (response.status === 200) {
          setShowEventModal(false);
          setSelectedEvent({})
          setToastContent({
            header: "Stornováno!",
            message: `Rezervace byla stornována.`,
            variant: "warning"
          })
          setShowToast(true);
          return response.data
        } else throw new Error("Auth failed")
      })
    .catch(err => renderToastError(err))
  }

  const renderToastError = (err = "") => {
    setToastContent({
      header: "Chyba!",
      message: `Při provádění operace se objevila chyba. ${err.toString()}`,
      variant: "danger"
    });
    setShowToast(true);
  }

  const renderContent = () => {
    switch (page) {
      case '/rezervace/seznam':
        return (<UserEventList openEventModal={openEventModal} update={updateRequired} setUpdate={setUpdateRequired}/>);
      case '/rezervace/kalendar':
        return (<UserEventCalendar openEventModal={openEventModal} update={updateRequired} setUpdate={setUpdateRequired}/>);
    }
  }

  return(
    <>
      <Row>
        <Col xs={12} className='mb-3 text-center'>
          <h1>Rezervace</h1>
          <Nav variant="pills" defaultActiveKey={page} className="justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey={'/rezervace/seznam'} as={Link} to='/rezervace/seznam'>Seznam</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={'/rezervace/kalendar'} as={Link} to='/rezervace/kalendar'>Kalendář</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      {renderContent()}

      <ToastNotification showToast={showToast} setShowToast={setShowToast} toastContent={toastContent}/>
      <UserEventModal
        isOpen={showEventModal}
        onSubmit={handleEventUpdate}
        event={selectedEvent}
        onClose={handleModalOnClose}
        onEventCancel={cancelEvent}
        update={updateRequired}
        setUpdate={setUpdateRequired}
      />
    </>
  )
}

export default UserOverviewPage;