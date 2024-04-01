import React from 'react'
import './createPurchaseOrder.css';
import Navbar from '../../components/Navbar/Navbar';
import Drawer from '../../components/Drawer/Drawer';
import Error from '../../components/Errors/Error';
import DatePicker from 'react-datepicker';
import { useState, useEffect } from 'react';
import Select from 'react-select'
import axios from 'axios';
import ProductModel from '../../components/Model/ProductModel';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import PurchaseTable from '../../components/Tables/PurchaseTable';

const CreatePurchaseOrder = () => {
      //Errors
  const errorType = [
    "Job Number is required", 
    "Enter valid mobile number",
    "Estimate is created successfully", 
    "Replacement item or Type is required",
    "Replacement item or Price is required", 
    "Price should be a number",
    "At least one item is required",
    "This Job Number related estimate already created",
  ]
  const [error, setError] = useState([]);
  const [erroVisible, setErrorVisible] = useState("none");
  const [backgroundColor, setBackgroundColor] = useState("#fae0e4")
  const [borderColor, setBorderColor] = useState("#ff0a54")
  const [fontColor, setFontColor] = useState("#ff0a54")
  const [iconColor, setIconColor] = useState("#ff0a54")

  
  //Options
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [companyOptions, setVehicleMakeOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);

   //Product Model
  const [openProductModel, setOpenProductModel] = useState(false);

  const[vehicleNo, setVehicleNo] = useState('');
  const[vehicleModel, setVehicleModel]= useState('');
  const[companyName, setCompanyName] = useState('');
  const[issuedDate, setIssuedDate] = useState('');

  //Purchase Item Container
  const[itemName, setItemName] = useState(null);
  const[itemQty, setItemQty] = useState(0);
  const[amount, setAmount] = useState(0);
  const[purchaseTableData, setPurchaseTableData] = useState([]);

  const handleSelectVehicleModel = (vehicleModel) => {
    setVehicleModel(vehicleModel);
  };

  const handleItemName=(itemName)=>{
    setItemName(itemName);
  }

  useEffect(()=>{
    const fetchVehicleModels=async()=>{
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/job/vehicle/model`)
        .then((res)=>{
            const vehicleModel = res.data.map((vehicle)=>({
                value: vehicle.model,
                label: vehicle.model,
            }));
            setVehicleOptions(vehicleModel);
        })
    }
    // const handleSelectCompanyName=async()=>{
    //     await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/job/vehicle/model`)
    //     .then((res)=>{
    //         const company = res.data.map((company)=>({
    //             value: company.companyName,
    //             label: company.companyName,
    //         }));
    //         setCompanyName(company);
    //     })
    // }
    const fetchProductItems=async()=>{
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/estimate/items`)
        .then((res)=>{
            const items = res.data.map((item)=>({
                value: item.itemName,
                label: item.itemName
            }))
            setItemOptions(items);
        })
    }
    fetchVehicleModels();
    // handleSelectCompanyName();
    fetchProductItems();
  },[])

  const handleTableBtn=async()=>{
    const newPurchaseOrderData={
        no:purchaseTableData.length + 1,
        itemName: itemName.label,
        qty: itemQty,
        amount: parseFloat(amount).toFixed(2)
    }

    setPurchaseTableData((prevData)=>[...prevData, newPurchaseOrderData]);
    setItemName(null);
    setItemQty(0);
    setAmount(0);
  }
  return (
    <div className="createEstimateContainer">
        <Drawer/>
        <div className="estimateContainer">
            <Navbar className='navbarComponent' text="Purchase Order "/>
            <Error value={erroVisible} errorName={error} backColor={backgroundColor} border={borderColor} font={fontColor} icon={iconColor}/>
            <div className='mainContainer'>
                    <div className="jobDetails">
                        <h2 style={{marginBottom:"20px", color:"red"}}>Details of Purchase Order</h2>
                        <form action="">
                        <div className='jobFormDetails'>
                            <div className="textContainer">
                                <label htmlFor="">Vehicle No:</label><br />
                                <input type="text" className='jobFormText' id='purchaseInput' placeholder='Ex. CAC-2454' onChange={(e)=>{
                                    setVehicleNo(e.target.value)
                                }}/>
                            </div>
                            <div className="textContainer">
                                <label htmlFor="">Vehicle Make:</label><br />
                                <Select
                                    options={vehicleOptions}
                                    isSearchable={true}
                                    placeholder="EX AXIO-161"
                                    className='jobFormText'
                                    value={vehicleModel}
                                    onChange={handleSelectVehicleModel}
                                    required
                                />
                            </div>
                        </div>
                        <div className='jobFormDetails'>
                            <div className="textContainer">
                                <label htmlFor="">Company Name:</label><br />
                                <Select
                                    options={companyOptions}
                                    isSearchable={true}
                                    placeholder="E Rangith Motors"
                                    className='jobFormText'
                                    value={companyName}
                                    // onChange={handleSelectCompanyName}
                                    required
                            />
                            </div>
                            <div className="textContainer">
                                <label htmlFor="">Issued Date:</label><br />
                                <DatePicker selected={issuedDate} onChange={(date)=>setIssuedDate(date)} placeholderText='Select Date' className='jobFormText' id='purchaseIssuedDate'/>
                            </div>
                        </div>
                        </form>
                    </div>
                    <div className="purchaseContainer">
                        <div className="addNewProductItem">
                            <div style={{color: "#006d77"}} onClick={()=>{
                                setOpenProductModel(true)
                            }}><LibraryAddIcon/></div>
                            {openProductModel && (
                                <ProductModel closeModel={setOpenProductModel}/>
                            )}
                        </div>
                        <h3 className='purchaseTitle'>Purchase Items</h3>
                        <div className="purchaseContent">
                            <Select
                                options={itemOptions}
                                isSearchable={true}
                                className='itemSelectOption'
                                placeholder='Select Item'
                                value={itemName}
                                onChange={handleItemName}
                                required
                            />
                            <input type="text" className="purchaseInput" id='qtyInput' placeholder='Qty' onChange={(e)=>{
                                setItemQty(e.target.value)
                            }}/>
                            <input type="text" className="purchaseInput" placeholder='Amount (Rs)' onChange={(e)=>{
                                setAmount(e.target.value)
                            }}/>
                            <button className="purchaseAddBtn" onClick={handleTableBtn}>Add</button>
                            <div>
                                <PurchaseTable tableData={purchaseTableData}/>
                            </div>
                        </div>
                        
                    </div>
                </div>
        </div>
    </div>
  )
}

export default CreatePurchaseOrder
