import React, { useState } from 'react';
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import PropTypes from 'prop-types';

DataTable.propTypes = {
  mapConfig: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
}

function DataTable({ data, mapConfig, handleDelete, handleUpdate }) {
  const [editedData, setEditedData] = useState([]);

  const tableHeader = mapConfig.headerNames.map((name) =>
    <th key={name.entryName}>{name.showName}</th>
  )

  const actionButtonsCell = (id) => {
    return (
      <td className={'h-100 d-flex align-items-center justify-content-around actionButtonsCell'}>
        <div className={'h-100 tableAction'} onClick={() => updateEntry(id)}>Edit</div>
        <div className={'h-100 tableAction'} onClick={() => handleDelete(id)}>Del</div>
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

  const getCorrectFormInput = (dbObject, objProperty, mapConfigOfProperty) => {
    if (mapConfigOfProperty.type === 'select') {
      if (dbObject.role === 'admin')
        return (
          <td key={`${dbObject._id}_${objProperty}`}>
            <Form.Control
              defaultValue={mapConfigOfProperty.options.find(roleOpt => roleOpt.name === 'admin').displayName}
              type="text"
              disabled
            />
          </td>
        );
      return (
        <td key={`${dbObject._id}_${objProperty}`}>
          <Form.Select
            defaultValue={dbObject[objProperty]}
            onChange={e => handleEdit(dbObject._id, objProperty, e.target.value)}
          >
            {mapConfigOfProperty.options.map(role =>
                <option key={role._id} value={role._id}>{role.displayName}</option>)}
          </Form.Select>
        </td>
      );
    }
    return (
      <td key={`${dbObject._id}_${objProperty}`}>
        <Form.Control
          defaultValue={dbObject[objProperty]}
          type={mapConfigOfProperty.type}
          onChange={e => handleEdit(dbObject._id, objProperty, e.target.value)}
          disabled={!!mapConfigOfProperty.disabled}
        />
      </td>
    );
  }

  /**
   * Creates a row for every db record stored in data variable
   * Creates a column from every entry in mapConfig.headerNames - dbObject[mapConfig.headerNames.entryName]
   */
  const tableContent = data.map(dbObject => {
    return <tr key={dbObject._id}>
      {
        mapConfig.headerNames.map(objProperty => {
          return getCorrectFormInput(dbObject, objProperty.entryName, objProperty)
        })
      }
      {actionButtonsCell(dbObject._id)}
    </tr>
  })

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