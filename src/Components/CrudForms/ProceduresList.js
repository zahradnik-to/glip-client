import React, { useEffect, useState } from 'react';
import axios from "axios";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import DataTable from "./DataTable";

ProceduresList.propTypes = {
  // headerNames: PropTypes.array.isRequired,
}

function ProceduresList() {
  const [procedures, setProcedures] = useState([])
  const dataInfo = {
    headerNames: [
      {
        entryName: "name",
        showName: "Název",
        type: "text" // Todo add input type to form
      }, {
        entryName: "duration",
        showName: "Délka (minuty)",
        type: "number"
      },
    ],
    ignoredDataParams: ["_id", "__v", "typeOfService"],
  }

  const handleDelete = (id) => {
    axios.delete(`/procedure/delete`, { data: { id: id } })
      .then(response => {
        if (response.status === 200) {
          getProcedures()
          return response.data
        } else throw new Error("Auth failed")
      })
      .catch(err => console.log(err))
  }

  const handleUpdate = (object) => {
    console.log("sending this to BE: ",object);
    axios.put(`/procedure/update`, object)
      .then(response => {
        if (response.status === 200) {
          return response.data
        } else throw new Error("Auth failed")
      })
      .catch(err => console.log(err))
  }

  const getProcedures = () => {
    axios.get(`/procedure/get`)
      .then(response => {
        if (response.status === 200) {
          return response.data
        } else throw new Error("Auth failed")
      })
      .then(data => {
        setProcedures(data)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    return getProcedures()
  }, []);

  return (
    <>
      <Row>
        <Col xs={12}>
          <DataTable dataInfo={dataInfo} data={procedures} handleDelete={handleDelete} handleUpdate={handleUpdate}/>
        </Col>
      </Row>
    </>
  );
}

export default ProceduresList