import React, { Children, useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';


EventModal.propTypes = {
  isOpen: PropTypes.bool,
  event: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  procedures: PropTypes.array,
};

function EventModal({ isOpen, event, onClose, procedures, onSubmit }) {
  const [title, setTitle] = useState("")
  const [start, setStart] = useState(new Date())
  const [procedure, setProcedure] = useState("")
  const [eventFromDb, setEventFromDb] = useState({})

  useEffect(() => {
    console.log(event)
  },[])


  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event)
    const modifiedEvent = {
      // _id: event.extendedProps._id,
      title,
      start,
      procedure,
    }
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
                  placeholder='Title'
                  value={event.title}
                  onChange={event => setTitle(event.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  placeholder='Title'
                  value={event.email}
                  onChange={event => setTitle(event.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className='mb-2'>
                <Form.Label>Úkon</Form.Label>
                <Form.Select name='procedure' onChange={e => setProcedure(Number(e.target.value))}>
                  <option value=''>Vyberte službu...</option>
                  {Children.toArray(procedures.map(procedure => <option key={procedure._id} value={procedure.duration}>{procedure.name}</option>))}
                </Form.Select>
              </Form.Group>

              <Form.Group className='mb-4'>
                <Form.Label>Začátek</Form.Label>
                <Form.Control
                  placeholder='Začátek'
                  value={new Date(event.start).toLocaleString('cs')}
                  onChange={event => setStart(event.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={onClose} className={"me-4"}>Smazat</Button>
              <Button variant="secondary" onClick={onClose}>Zrušit</Button>
              <Button variant="primary"  type='submit'>Uložit</Button>
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

export default EventModal;