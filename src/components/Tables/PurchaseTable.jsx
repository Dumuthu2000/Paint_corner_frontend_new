import './estimateTable.css';

const PurchaseTable = (props) => {
  return (
    <div className="table-container" style={{width:`${props.tableWidth}`}}>
      <table className="custom-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Item Name</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {props.tableData?.map((data, index) => (
            <tr key={index}>
              <td>{data.no}</td>
              <td>{data.itemName}</td>
              <td>{data.qty}</td>
              <td>{data.amount}</td>
              <td>
                <div className="tableBtn">
                  <button className='editBtn' onClick={()=>{props.handleEdit(index)}}>Edit</button>
                  <button className='deleteBtn' onClick={()=>{props.handleDelete(index)}}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        {/* Add more rows as needed */}
      </tbody>
      </table>
    </div>
  )
}

export default PurchaseTable

