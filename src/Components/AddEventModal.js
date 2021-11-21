import React, {useState} from "react";
import Modal from "react-modal";
import Datetime from 'react-datetime'
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function AddEventModal({ isOpen, onClose, onEventAdded }) {
  const [title, setTitle] = useState("")
  const [start, setStart] = useState(new Date())
  const [end, setEnd] = useState(new Date())

  const handleSubmit = (event) => {
    event.preventDefault();

    onEventAdded({
      title,
      start,
      end
    })
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <Form onSubmit={handleSubmit} action='POST' >
        <input
          placeholder='Title'
          value={title}
          onChange={ event => setTitle(event.target.value)}
        />

        <div>
          <label>Set Start Date</label>
          <Datetime value={start} onChange={date => setStart(date)}></Datetime>
        </div>

        <div>
          <label>Set End Date</label>
          <Datetime value={end} onChange={date => setEnd(date)}></Datetime>
        </div>

        <Button type='submit'>Add event</Button>
      </Form>
    </Modal>
  );
}

export default AddEventModal;