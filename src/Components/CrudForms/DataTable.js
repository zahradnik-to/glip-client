import React, { useEffect, useState } from 'react';
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import PropTypes from 'prop-types';

DataTable.propTypes = {
  dataInfo: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
}

function DataTable({ data, dataInfo, handleDelete, handleUpdate }) {
  const [editedData, setEditedData] = useState([]);

  const tableHeader = dataInfo.headerNames.map((name) =>
    <th key={name.entryName}>{name.showName}</th>
  )

  const actionButtonsCell = (id) => {
    return (
      <td className={'h-100 d-flex align-items-center justify-content-around actionButtonsCell'}>
        <div className={'h-100'} onClick={() => updateEntry(id)}>Edit</div>
        <div className={'h-100'} onClick={() => handleDelete(id)}>Del</div>
      </td>
    )
  }

  const updateEntry = (id) => {
    const entryToUpdate = editedData.find(obj => obj._id === id)
    if (entryToUpdate) {
      handleUpdate( entryToUpdate )
    } else {
      console.log("No changes to submit.")
    }
  }

  /* Adds edited row to array of edited objects. */
  const handleEdit = (id, objProperty, value) => {
    console.log("Edit this", { id, objProperty, value })
    const newEditedData = [...editedData];
    const existingEdit = newEditedData.find(obj => obj._id === id)
    if (existingEdit) {
      existingEdit[objProperty] = value;
    } else {
      const object = data.find(obj => obj._id === id)
      object[objProperty] = value;
      newEditedData.push(object)
    }
    setEditedData(newEditedData);
  };

  const tableContent = data.map(object => {
      return <tr key={object._id}>
        {Object.keys(object).map(objProperty => {
          if (!dataInfo.ignoredDataParams.includes(objProperty))
            return (
              <td key={`${object._id}_${object[objProperty]}`}>
                <Form.Control
                  defaultValue={object[objProperty]}
                  type={dataInfo.headerNames.find(o => o.entryName === objProperty).type}
                  onBlur={e => handleEdit(object._id, objProperty, e.target.value)}
                />
              </td>
            )
        })
        }
        {actionButtonsCell(object._id)}
      </tr>
    }
  )

  return (
    <Form>
      <Table bordered hover>
        <thead>
        <tr>
          {tableHeader}
          <th>Akce</th>
        </tr>
        </thead>
        <tbody>
        {tableContent}
        </tbody>
      </Table>
    </Form>
  );
}

export default DataTable;