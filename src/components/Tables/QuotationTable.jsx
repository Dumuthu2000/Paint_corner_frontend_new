import './estimateTable.css';

const QuotationTable = (props) => {
  return (
    <div className="table-container" style={{width:`${props.tableWidth}`}}>
      <table className="custom-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Item Name</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {props.tableData?.map((data, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{data.itemName}</td>
              {/* <td>{data.amount}</td> */}
              <td>
              {props.disableInput === index ? (
                  <>
                    <input
                      type="text"
                      className='insurancePrice'
                      style={{ padding: "5px", width: "8rem", borderRadius: "2px", }}
                      // value={data.amount}
                      onChange={(e) => props.handleQuotationPrice(e.target.value, index)

                    }
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      className='insurancePrice'
                      style={{ padding: "5px", width: "8rem", borderRadius: "2px", color:"#c9184a", fontWeight:"bold", display:props.InputDisplay}}
                      // value={data.insurancePrice}
                      disabled
                    />
                  </>
                )}
              </td>
              <td style={{display:props.insuranceDisplay}}>
                <div className="tableBtn">
                  {props.disableInput === index ? (
                    <>
                      <button className='tableUpdateBtn' onClick={() => {props.handleUpdate(index) }}>Update</button>
                    </>
                  ) : (
                    <>
                      <button className='editBtn' onClick={() => { props.handleEdit(index) }}>Edit</button>
                      <button className='deleteBtn' onClick={()=>{props.handleDelete(index)}}>Delete</button>
                    </>
                  )}
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

export default QuotationTable

