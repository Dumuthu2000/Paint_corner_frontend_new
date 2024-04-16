import "./previewPurchaseOrder.css";
import Drawer from "../../components/Drawer/Drawer";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const previewPurchaseOrder = () => {
    const[orderDetails, setOrderDetails] = useState({})
    const[orderItems, setOrderItems] = useState([])
    const {poID} = useParams();

    useEffect(()=>{
        if(poID){
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseOrder/getPurchaseOrder/${poID}`)
          .then((res)=>{
              setOrderItems(res.data.purchaseItems)
              setOrderDetails(res.data.purchaseOrder)
              console.log(res.data.purchaseOrder)
            
          }).catch((err)=>{
              alert(err.message);
          })
        }else{
           axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseOrder/getPurchaseOrder`)
          .then((res)=>{
              setOrderItems(res.data.purchaseItems)
              setOrderDetails(res.data.purchaseOrder)
              console.log(res.data.purchaseOrder)
            
          }).catch((err)=>{
              alert(err.message);
          })
        }
    },[])
  return (
    <div className="createEstimateContainer">
      <Drawer />
      <div className="estimateContainer">
        <Navbar className="navbarComponent" text="Purchase Order / Preview" />
        {/* <Error value={erroVisible} errorName={error} backColor={backgroundColor} border={borderColor} font={fontColor} icon={iconColor}/> */}
        <div className="mainContainer">
          <h2 className="purchaseOrderTitle">Preview Purchase Order</h2>
          <div className="purchasePreviewContainer">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div>
                  <label htmlFor="">Date:</label>
                  <br />
                  <input type="text" className="estimateInput" disabled value={orderDetails.issuedDate}/>
                </div>
                <div>
                  <label htmlFor="">Vehicle Name:</label>
                  <br />
                  <input type="text" className="estimateInput" disabled value={orderDetails.vehicleModel+' '+orderDetails.vehicleMake}/>
                </div>
              </div>
              <div>
                <div>
                  <label htmlFor="">Vehicle No:</label>
                  <br />
                  <input type="text" className="estimateInput" disabled value={orderDetails.vehicleNo}/>
                </div>
                <div>
                  <label htmlFor="">Purchase Order No:</label>
                  <br />
                  <input type="text" className="estimateInput" disabled value={orderDetails.poID}/>
                </div>
              </div>
            </div>
                <div>
                  <label htmlFor="">To:</label>
                  <br />
                  <input type="text" className="estimateInput" disabled value={orderDetails.companyName}/>
                </div>
          </div>
        </div>
        <div className="table-container-purchase">
            <h3 className="purchaseTitle">PURCHASE DETAILS</h3>
            <table className="custom-table">
                <thead className="purchaseTblHead">
                <tr>
                    <th>Pos</th>
                    <th>Decription</th>
                    <th>Qty</th>
                    <th>Amount</th>
                </tr>
                </thead>
                <tbody>
                    {orderItems.map((data, index)=>(
                    <tr key={index}>
                        <td>{index+1}</td>
                        <td>{data.itemName}</td>
                        <td style={{textAlign:'center'}}>{data.itemQty}</td>
                        <td style={{textAlign:'end'}}>{parseFloat(data.itemPrice).toFixed(2)}</td>
                    </tr>
                    ))}
             </tbody>
            </table>
        </div>
        <div className="amountContainer">
        <div className="btnSection">
          <Link to="/purchase-order/createPurchaseOrder">
            <button className="backBtn">Back</button>
          </Link>
          <Link to="/purchase-order/purchaseOrder-report">
            <button className="previewBtn">
              Print
            </button>
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default previewPurchaseOrder;
