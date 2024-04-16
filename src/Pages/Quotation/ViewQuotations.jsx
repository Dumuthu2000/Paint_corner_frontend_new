import './viewQuotations.css'
import Navbar from '../../components/Navbar/Navbar'
import Drawer from '../../components/Drawer/Drawer'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ViewQuotations = () => {
    const[orderDetails, setOrderDetails] = useState([])
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/quotation/quotations`)
        .then((res)=>{
            setOrderDetails(res.data)
            console.log(res.data)      
        }).catch((err)=>{
            alert(err.message);
        })
    },[])

    const handleViewBtn=async(quotationID)=>{
        navigate(`/quotation/preview-quotation/${quotationID}`)
    }

    const handleEditBtn=async(quotationID)=>{
        navigate(`/quotation/update-quotation/${quotationID}`)
    }
  return (
    <div className="createEstimateContainer">
        <Drawer />
        <div className="estimateContainer">
            <Navbar className="navbarComponent" text="Quotations" />
            <div className="mainContainers">
               {orderDetails.slice().reverse().map((data, index)=>(
                 <div className="poList" key={index}>
                    <p className="poNo">Vehicle No: <span className="poData">{data.vehicleNo}</span></p>
                    <p className="poDetails">Company: <span className="poData">{data.companyName}</span></p>
                    <p className="poDetails">Insurance: <span className="poData" style={{color:'red'}}>{data.insuranceName}</span></p>
                    <div className='btnBox'>
                        <button style={{backgroundColor:'#40916c'}} className='purchaseOrderViewBtn' onClick={()=>{handleEditBtn(data.quotationID)}}>edit</button>
                        <button className='purchaseOrderViewBtn' onClick={()=>{handleViewBtn(data.quotationID)}}>view</button>
                    </div>
                </div>
               ))}
            </div>
        </div>
    </div>
  )
}

export default ViewQuotations
