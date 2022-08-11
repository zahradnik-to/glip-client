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
    }
  }

  /* Adds edited row to array of edited objects. */
  const handleEdit = (id, objProperty, value) => {
    const newEditedData = [...editedData];
    const existingEdit = newEditedData.find(obj => obj._id === id)
    if (existingEdit) {
      existingEdit[objProperty] = value;
    } else {
      const originalObject = data.find(obj => obj._id === id)
      const copyObject =JSON.parse(JSON.stringify(originalObject));
      copyObject[objProperty] = value;
      newEditedData.push(copyObject)
    }
    setEditedData(newEditedData);
  };

  const getCorrectFormInput = (dbObject, objProperty, mapConfigOfProperty) => {
    if (mapConfigOfProperty.type === 'select') {
      if (mapConfigOfProperty.entryName === 'role'){
        return (
            <td key={`${dbObject._id}_${objProperty}`}>
              <Form.Select
                  disabled={dbObject.role === 'admin'}
                  required={true}
                  defaultValue={dbObject[objProperty]}
                  onChange={e => handleEdit(dbObject._id, objProperty, e.target.value)}
              >
                {mapConfigOfProperty.options.map(role =>
                    <option key={role._id} value={role.name} hidden={role.name === 'admin'}>{role.displayName}</option>)}
              </Form.Select>
            </td>
        );
      }
      else {
        return (
            <td key={`${dbObject._id}_${objProperty}`}>
              <Form.Select
                  required={true}
                  defaultValue={dbObject[objProperty]}
                  onChange={e => handleEdit(dbObject._id, objProperty, e.target.value)}
                  disabled={!!mapConfigOfProperty.disabled}
              >
                {mapConfigOfProperty.options.map(opt =>
                    <option key={opt.value} value={opt.value}>{opt.displayName}</option>)}
              </Form.Select>
            </td>
        );
      }
    }
    return (
      <td key={`${dbObject._id}_${objProperty}`}>
        <Form.Control
          placeholder={dbObject[objProperty]}
          defaultValue={dbObject[objProperty]}
          type={mapConfigOfProperty.type}
          onChange={e => handleEdit(dbObject._id, objProperty, e.target.value)}
          disabled={!!mapConfigOfProperty.disabled}
          required={true}
        />
      </td>
    );
  }

  /**
   * Creates a row for every db record stored in data variable
   * Creates a column from every entry in mapConfig.headerNames - dbObject[mapConfig.headerNames.entryName]
   */
  const tableContent = data.map(dbObject => {
    return(
      <tr key={dbObject._id}>
          {
            mapConfig.headerNames.map(objProperty => {
              return getCorrectFormInput(dbObject, objProperty.entryName, objProperty)
            })
          }
          {actionButtonsCell(dbObject._id)}
      </tr>
    )
  })

  return (
    // <Form>
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
    // </Form>
  );
}

export default DataTable;