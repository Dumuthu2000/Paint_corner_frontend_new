import "./purchaseReport.css";
import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const PurchaseReport = () => {
  const [orderDetails, setOrderDetails] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const {poID} = useParams();

  useEffect(()=>{
    if(poID){
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseOrder/getPurchaseOrder/${poID}`)
      .then((res)=>{
          setOrderItems(res.data.purchaseItems)
          setOrderDetails(res.data.purchaseOrder)
        
      }).catch((err)=>{
          alert(err.message);
      })
    }else{
       axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseOrder/getPurchaseOrder`)
      .then((res)=>{
          setOrderItems(res.data.purchaseItems)
          setOrderDetails(res.data.purchaseOrder)
        
      }).catch((err)=>{
          alert(err.message);
      })
    }
},[])

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  
  const formatDate = (dateString) => {
    try {
      if (!dateString) return ''; // Return empty string if dateString is falsy
  
      const dateObject = new Date(dateString);
      if (isNaN(dateObject.getTime())) {
        // Check if dateObject is invalid (NaN)
        return ''; // Return empty string for invalid date
      }
  
      return dateObject.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
    } catch (error) {
      console.error('Error formatting date:', error);
      return ''; // Return empty string if there's an error
    }
  };
  return (
    <div className="estimateContainer" style={{backgroundColor:'white'}}>
      <div ref={componentRef}>
        <div className="mainContainer">
          <h3 className="purchaseReportTitle">PURCHASE ORDER</h3>
          <div className="purchaseReportContainer">
            <div className="poHeadSection">
                <div className="reportSection" style={{marginTop:'5px', marginBottom:'5px'}}>
                    <p className="orderTitle"  style={{marginBottom:'10px', fontSize:'12px'}}>P/O No: <span className="orderData" style={{color:'red', fontSize:'11px'}}>{orderDetails.poID}</span></p>
                    <p className="orderTitle">DATE: <span className="orderData" style={{marginLeft:'0.5rem'}}>{formatDate(orderDetails.issuedDate)}</span></p>
                    <p className="orderTitle">TO: <span className="orderData" style={{marginLeft:'1.4rem'}}>{orderDetails.companyName}</span></p>
                </div>
                <div className="reportSection">
                    <p className="orderTitle"  style={{marginRight:'0.7rem'}}>VEHICLE NO: <span className="orderData" style={{marginLeft:'1.45rem'}}>{orderDetails.vehicleNo}</span></p>
                    <p className="orderTitle" style={{marginBottom:'1rem'}}>VEHICLE MAKE: <span className="orderData" style={{marginLeft:'0.5rem'}}>{orderDetails.vehicleMake+' '+orderDetails.vehicleModel}</span></p>
                </div>
            </div>
          </div>
        </div>
        <hr className="horizontalLine"/>
        <div className="table-container-purchase-report">
          <table className="custom-table">
            {/* <thead className="purchaseTblHead">
              <tr >
                <th style={{fontSize:'13px'}}>Pos</th>
                <th style={{fontSize:'13px'}}>Decription</th>
                <th style={{fontSize:'13px'}}>Qty</th>
                <th style={{fontSize:'13px'}}>Amount</th>
              </tr>
            </thead> */}
            <tbody>
              {orderItems.map((data, index) => (
                <tr key={index}>
                  <td style={{fontSize:'11px'}}>{index + 1}</td>
                  <td style={{fontSize:'11px'}}>{data.itemName}</td>
                  <td style={{fontSize:'11px',  textAlign:'center'}}>{data.itemQty}</td>
                  <td style={{fontSize:'11px', textAlign:'end'}}>{parseFloat(data.itemPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{display:'flex', width:'95%', alignItems:'center', justifyContent:'end', marginTop:'35px'}}>
          <div>
              <p>....................................................</p>
              <p style={{fontSize:'13px'}}>WORKSHOP MANAGER SIGNATURE</p>
          </div>
          <div style={{marginLeft:'2rem'}}>
              <p>......................................................</p>
              <p style={{fontSize:'13px'}}>PURCHESSING OFFICER SIGNATURE</p>
          </div>
        </div>
        </div>
      <div className="amountContainer">
        <div className="btnSection">
          <Link to="/purchase-order/createPurchaseOrder">
            <button className="backBtn">Back</button>
          </Link>
          <Link to="/estimate-report">
            <button className="previewBtn" onClick={handlePrint}>
              Print
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseReport;
