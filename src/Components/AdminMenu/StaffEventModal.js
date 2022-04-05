import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';


StaffEventModal.propTypes = {
  isOpen: PropTypes.bool,
  event: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  onDelete: PropTypes.func,
  user: PropTypes.object,
};

function StaffEventModal({ isOpen, event, onClose, onSubmit, onDelete, user }) {
  const [title, setTitle] = useState("")
  const [staffNotes, setStaffNotes] = useState("")

  useEffect(() => {
    setTitle(event.title)
    setStaffNotes(event.staffNotes)
  },[event, isOpen])


  const handleSubmit = (e) => {
    e.preventDefault();
    const modifiedEvent = {
      _id: event._id,
      title,
      staffNotes
    }
    onSubmit(modifiedEvent);
  }

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Objednávka</Modal.Title>
      </Modal.Header>

      { Object.keys(event).length !== 0
        ? <Form onSubmit={handleSubmit}>
            <Modal.Body>

              <Form.Group className='mb-2'>
                <Form.Label>Název</Form.Label>
                <Form.Control
                  placeholder='Název'
                  defaultValue={title ?? ""}
                  onChange={event => setTitle(event.target.value)}
                  disabled={!user.isAdmin && event.staffId !== user._id}
                  required
                />
              </Form.Group>

              <Form.Group className='mb-4'>
                <Form.Label>Začátek</Form.Label>
                <Form.Control
                  defaultValue={new Date(event.start).toLocaleString('cs')}
                  disabled
                />
              </Form.Group>

              <Form.Group className='mb-4'>
                <Form.Label>Konec</Form.Label>
                <Form.Control
                  defaultValue={new Date(event.end).toLocaleString('cs')}
                  disabled
                />
              </Form.Group>

              <Form.Group className='mb-4'>
                <Form.Label>Poznámky</Form.Label>
                <Form.Control
                  placeholder='Poznámky'
                  as="textarea"
                  defaultValue={staffNotes ?? ""}
                  onChange={event => setStaffNotes(event.target.value)}
                  disabled={!user.isAdmin && event.staffId !== user._id}
                />
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              { user.isAdmin || event.staffId === user._id
                ? <>
                  <Button variant="danger" onClick={() => onDelete(event._id)} className={"me-4"}>Smazat</Button>
                  <Button variant="secondary" onClick={onClose}>Zpět</Button>
                  <Button variant="primary" type='submit'>Uložit</Button>
                </>
                : <>
                  <Button variant="danger" disabled className={"me-4"}>Nelze smazat</Button>
                  <Button variant="secondary" onClick={onClose}>Zpět</Button>
                  <Button variant="primary" disabled>Uložit</Button>
                </>
              }
            </Modal.Footer>
          </Form>

        : <div className={'text-center p-3'}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
      }
    </Modal>
  );
}

export default StaffEventModal;