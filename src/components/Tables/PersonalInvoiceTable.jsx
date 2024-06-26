import React from 'react';
import './estimateTable.css';

const PersonalInvoiceTable = (props) => {
  return (
    <div>
      <table className="custom-table" style={{ display: props.tableView, width: "100%" }}>
        <thead >
          <tr style={{display:props.headerDisplay}}>
          <th style={{backgroundColor:props.rowColor}}>No</th>
            <th style={{backgroundColor:props.rowColor}}>Item Name</th>
            <th style={{ display: props.display, backgroundColor:props.rowColor }}>Item Value</th>
            <th style={{backgroundColor:props.rowColor, display:props.view}}>Company Price</th>
            <th style={{backgroundColor:props.rowColor }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {props.tableData?.map((data, index) => (
            <tr key={index}>
              <td style={{fontSize:'12px'}}>{index + 1}</td>
              <td style={{fontSize:'12px'}}>{data.itemName}</td>
              <td style={{ display: props.display, fontSize:'12px' }}>{data.itemValue}</td>
              <td style={{textAlign:"end", fontSize:'12px' }}>{parseFloat(data.itemPrice).toFixed(2)}</td>
              <td style={{textAlign:"center", display:props.view}}>
                <button className='deleteBtn' onClick={() => { props.handleDelete(data.invoiceID) }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PersonalInvoiceTable;
