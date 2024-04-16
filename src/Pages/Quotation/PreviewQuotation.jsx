import "./previewQuotation.css";
import Drawer from "../../components/Drawer/Drawer";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const PreviewQuotation = () => {
    const[orderDetails, setOrderDetails] = useState({})
    const[orderItems, setOrderItems] = useState([])
    const {quotationID} = useParams();

    useEffect(()=>{
        if(quotationID){
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/quotation/getQuotation/${quotationID}`)
          .then((res)=>{
              setOrderItems(res.data.quotationItems)
              setOrderDetails(res.data.quotation)
              console.log(res.data.quotation)
            
          }).catch((err)=>{
              alert(err.message);
          })
        }else{
           axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/quotation/getQuotation`)
          .then((res)=>{
              setOrderItems(res.data.quotationItems)
              setOrderDetails(res.data.quotation)
              console.log(res.data)
            
          }).catch((err)=>{
              alert(err.message);
          })
        }
    },[])
  return (
    <div className="createEstimateContainer">
      <Drawer />
      <div className="estimateContainer">
        <Navbar className="navbarComponent" text="Quotation / Preview" />
        {/* <Error value={erroVisible} errorName={error} backColor={backgroundColor} border={borderColor} font={fontColor} icon={iconColor}/> */}
        <div className="mainContainer">
          <h2 className="purchaseOrderTitle">Preview Quotation</h2>
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
                  <label htmlFor="">Insurance Name:</label>
                  <br />
                  <input type="text" className="estimateInput" disabled value={orderDetails.insuranceName}/>
                </div>
                <div>
                  <label htmlFor="">Vehicle Name:</label>
                  <br />
                  <input type="text" className="estimateInput" disabled value={orderDetails.VehicleModel+' '+orderDetails.vehicleMake}/>
                </div>
              </div>
              <div>
                <div>
                  <label htmlFor="">Vehicle No:</label>
                  <br />
                  <input type="text" className="estimateInput" disabled value={orderDetails.vehicleNo}/>
                </div>
                <div>
                  <label htmlFor="">Mobile No:</label>
                  <br />
                  <input type="text" className="estimateInput" disabled value={orderDetails.companyMobile}/>
                </div>
              </div>
            </div>
                <div>
                  <label htmlFor="">Checked Company:</label>
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
                    <th>Amount</th>
                </tr>
                </thead>
                <tbody>
                    {orderItems.map((data, index)=>(
                    <tr key={index}>
                        <td>{index+1}</td>
                        <td>{data.itemName}</td>
                        <td style={{textAlign:'end'}}>{parseFloat(data.amount).toFixed(2)}</td>
                    </tr>
                    ))}
             </tbody>
            </table>
        </div>
        <div className="amountContainer">
        <div className="btnSection">
          <Link to="/quotation/createQuotation">
            <button className="backBtn">Back</button>
          </Link>
          <Link to="/quotation/quotation-report">
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

export default PreviewQuotation;
