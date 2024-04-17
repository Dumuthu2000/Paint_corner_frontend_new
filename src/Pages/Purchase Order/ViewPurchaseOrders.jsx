import './viewPurchaseOrders.css'
import Navbar from '../../components/Navbar/Navbar'
import Drawer from '../../components/Drawer/Drawer'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ViewPurchaseOrders = () => {
    const[orderDetails, setOrderDetails] = useState([])
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseOrder/purchaseOrders`)
        .then((res)=>{
            setOrderDetails(res.data)
            console.log(res.data)      
        }).catch((err)=>{
            alert(err.message);
        })
    },[])

    const hansleViewBtn=async(poID)=>{
        navigate(`/purchase-order/preview-purchaseOrder/${poID}`)
    }

    const hansleEditBtn=async(poID)=>{
        navigate(`/purchase-order/update-purchaseOrder/${poID}`)
    }

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
    <div className="createEstimateContainer">
        <Drawer />
        <div className="estimateContainer">
            <Navbar className="navbarComponent" text="Purchase Orders" />
            <div className="mainContainers">
               {orderDetails.slice().reverse().map((data, index)=>(
                 <div className="poList" key={index}>
                    <p className="poNo">P/O No: <span className="poData">{data.poID}</span></p>
                    <p className="poDetails">Company: <span className="poData">{data.companyName}</span></p>
                    <p className="poDetails">Issued Date: <span className="poData" style={{color:'red'}}>{formatDate(data.issuedDate)}</span></p>
                    <div className='btnBox'>
                        <button style={{backgroundColor:'#40916c'}} className='purchaseOrderViewBtn' onClick={()=>{hansleEditBtn(data.poID)}}>edit</button>
                        <button className='purchaseOrderViewBtn' onClick={()=>{hansleViewBtn(data.poID)}}>view</button>
                    </div>
                </div>
               ))}
            </div>
        </div>
    </div>
  )
}

export default ViewPurchaseOrders
