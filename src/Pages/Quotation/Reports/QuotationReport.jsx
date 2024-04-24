import "./quotationReport.css";
import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const QuotationReport = () => {
  const [orderDetails, setOrderDetails] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const{quotationID} = useParams();

  useEffect(()=>{
    if(quotationID){
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/quotation/getQuotation/${quotationID}`)
      .then((res)=>{
          setOrderItems(res.data.quotationItems)
          setOrderDetails(res.data.quotation)
        
      }).catch((err)=>{
          alert(err.message);
      })
    }else{
       axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/quotation/getQuotation`)
      .then((res)=>{
          setOrderItems(res.data.quotationItems)
          setOrderDetails(res.data.quotation)
        
      }).catch((err)=>{
          alert(err.message);
      })
    }
},[])

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div className="estimateContainer" style={{backgroundColor:'white'}}>
      <div ref={componentRef}>
        <div className="mainContainer">
          <h3 className="purchaseReportTitle">QUOTATION</h3>
          <div className="purchaseReportContainer">
            <div className="poHeadSectionForQuotation">
                <div className="reportSection" style={{marginTop:'5px', marginBottom:'5px'}}>
                    <p className="orderTitle"  style={{marginBottom:'5px', fontSize:'12px'}}>INSURANCE: <span className="orderData" style={{fontSize:'11px', marginLeft:'1.7rem'}}>{orderDetails.insuranceName}</span></p>
                    <p className="orderTitle"  style={{marginRight:'0.7rem'}}>VEHICLE NO: <span className="orderData" style={{marginLeft:'1.5rem'}}>{orderDetails.vehicleNo}</span></p>
                    <p className="orderTitle" style={{marginBottom:'1rem'}}>VEHICLE MAKE: <span className="orderData" style={{marginLeft:'0.5rem'}}>{orderDetails.vehicleMake+' '+orderDetails.VehicleModel}</span></p>
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
                  <td style={{fontSize:'11px', textAlign:'end'}}>{parseFloat(data.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:'1rem'}}>
             <p className="orderTitle">SPARE PARTS CHECKED BY: <span className="orderData" style={{marginLeft:'0.95rem'}}>{orderDetails.companyName+' ('+orderDetails.companyMobile+')'}</span></p>
          </div>
        </div>
        <div className="signatureBox">
            <p>.............................................</p>
            <p style={{fontSize:'13px'}}>SERVICE ADVISOR SIGNATURE</p>
        </div>
      </div>
      <div className="amountContainer">
        <div className="btnSection">
          <Link to="/quotation/createQuotation">
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

export default QuotationReport;
