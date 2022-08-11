import React, { Children, useState } from 'react';
import PropTypes from 'prop-types';
import Accordion from 'react-bootstrap/Accordion';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

AdditionalProceduresAccordion.propTypes = {
  addProcList: PropTypes.array.isRequired,
  handleAddProcedureSelect: PropTypes.func.isRequired,
};

function AdditionalProceduresAccordion({ addProcList, handleAddProcedureSelect }) {

  return (
      <Accordion>
        <Accordion.Item eventKey="additional">
          <Accordion.Header>Doplňkové služby...</Accordion.Header>
          <Accordion.Body>
            <Row>
              {Children.toArray(addProcList
                .map(p =>
                  <Col xs={4} key={p._id}>
                    <Form.Group className="mb-3 pull" controlId={`${p._id}`}>
                      <Form.Check onChange={e => handleAddProcedureSelect(e.target)} type="checkbox" label={`${p.name} (${p.duration}min) - ${p.price} Kč`}/>
                    </Form.Group>
                  </Col>
              ))}
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
  );
}

export default AdditionalProceduresAccordion;