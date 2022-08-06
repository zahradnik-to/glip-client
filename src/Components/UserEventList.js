import React, { Children, useEffect, useState } from 'react';
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import PropTypes from 'prop-types';
import axios from "axios";
import { formatDateToLocaleString, formatTimeToLocaleString } from "../Utils/UserEventListHelper";

UserEventList.propTypes = {
  openEventModal: PropTypes.func.isRequired,
  update: PropTypes.bool.isRequired,
  setUpdate: PropTypes.func.isRequired,
};

function UserEventList({ openEventModal, update, setUpdate }) {
  const [events, setEvents] = useState([]);
  const [manualPage, setManualPage] = useState(0);
  const [pagination, setPagination] = useState({ page: 1 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    return getEvents(1);
  }, [])

  useEffect(() => {
    if (update){
      setUpdate(false)
      return getEvents();
    }
  }, [update])

  const getEvents = (page = pagination.page) => {
    axios.get(`/calendar/get-events-page?page=${page}`)
      .then( result => {
        const { events, ...pagination } = result.data
        setEvents(events)
        setPagination(pagination)
      })
      .catch( err => {
        console.log('Getting events failed');
        console.log(err);
      })
      .finally(() => {
        setLoaded(true)
      });
  }

  const renderPagination = () => {
    const pageNumberList = [];
    const { page, totalPages } = pagination
    let elipsisFlag = false;
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 3 || Math.abs(i - page) <= 2 || i >= totalPages - 2 ) {
        elipsisFlag = false;
        pageNumberList.push(<Pagination.Item active={i === pagination.page} onClick={() => getEvents(i)} key={i}>{i}</Pagination.Item>)
      } else {
        if (!elipsisFlag) pageNumberList.push(<Pagination.Ellipsis key={i} disabled/>)
        elipsisFlag = true;
      }
    }
    return(
      <Pagination>
        <Pagination.First disabled={!pagination.hasPrevPage} onClick={() => getEvents(1)}/>
        <Pagination.Prev  disabled={!pagination.hasPrevPage} onClick={() => getEvents(pagination.page - 1)}/>
        { pageNumberList }
        <Pagination.Next disabled={!pagination.hasNextPage} onClick={() => getEvents(pagination.page + 1)}/>
        <Pagination.Last disabled={!pagination.hasNextPage} onClick={() => getEvents(pagination.totalPages)}/>
      </Pagination>
    )
  }

  const goToPage = (ev) => {
    ev.preventDefault()
    getEvents(manualPage)
  }

  return (
    <div>
      { loaded
      ? <Form>
        <Table bordered hover responsive="md" size="sm">
          <thead>
          <tr>
            <th>Den 📅</th>
            <th>Trvání</th>
            <th>Studio</th>
            <th>Úkon</th>
            <th>Akce</th>
          </tr>
          </thead>
          <tbody>
          {Children.toArray(events.map(e =>
            <tr key={e._id} className={ e.canceled ? "bg-warning" : ""}>
              {/* Day */}
              <td>{ formatDateToLocaleString(e.start) }</td>
              {/* Beginning - End*/}
              <td>
                { formatTimeToLocaleString(e.start) } - { formatTimeToLocaleString(e.end) }
              </td>
              {/* End */}
              <td>{ e.typeOfService }</td>
              <td>{ e.procedureName }</td>
              <td>
                <span className={'h-100 me-md-3 tableAction'} onClick={() => openEventModal(e)}>Detail🖊</span>
              </td>
            </tr>
          ))}
          </tbody>
        </Table>
      </Form> : <></>}
      { renderPagination() }

      <Form onSubmit={goToPage}>
        <Row className="align-items-center">
          <Col sm={3} className="my-1">
            <Form.Label visuallyHidden>
              Přejít na stránku
            </Form.Label>
            <InputGroup>
              <InputGroup.Text>🔍</InputGroup.Text>
              <FormControl
                placeholder='Stránka'
                type="number"
                min={1}
                max={pagination.totalPages}
                onChange={event => setManualPage(event.target.value)}
                required />
            </InputGroup>
          </Col>
          <Col xs="auto">
            <Button type="submit">Přejít</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default UserEventList;