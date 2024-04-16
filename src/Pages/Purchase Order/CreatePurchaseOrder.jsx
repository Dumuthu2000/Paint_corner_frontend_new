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
import { useNavigate } from 'react-router-dom';

const CreatePurchaseOrder = () => {
      //Errors
  const errorType = [
    "All fields are required"
  ]
  const [error, setError] = useState([]);
  const [erroVisible, setErrorVisible] = useState("none");
  const [backgroundColor, setBackgroundColor] = useState("#fae0e4")
  const [borderColor, setBorderColor] = useState("#ff0a54")
  const [fontColor, setFontColor] = useState("#ff0a54")
  const [iconColor, setIconColor] = useState("#ff0a54")

  
  //Options
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [vehicleModelOptions, setVehicleMakeOptions] = useState([]);
  const [companyOptions, setCompanyNameOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);

   //Product Model
  const [openProductModel, setOpenProductModel] = useState(false);
  const [addView, setAddView] = useState('block')
  const [updateView, setUpdateView] = useState('none')
  const [updateIndex, setUpdateIndex] = useState(null);

  const[vehicleNo, setVehicleNo] = useState(null);
  const[vehicleMake, setVehicleModel]= useState(null);
  const[vehicleModel, setVehicleModels]= useState(null);
  const[companyName, setCompanyName] = useState(null);
  const[issuedDate, setIssuedDate] = useState(null);

  //Purchase Item Container
  const[itemName, setItemName] = useState(null);
  const[itemQty, setItemQty] = useState('');
  const[itemPrice, setItemPrice] = useState('');
  const[purchaseTableData, setPurchaseTableData] = useState([]);

  const navigate = useNavigate();

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
    const fetchVehicleMake=async()=>{
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/job/vehicle/make`)
        .then((res)=>{
            console.log(res.data)
            const vehicleMakes = res.data.map((vehicle)=>({
                value: vehicle.make,
                label: vehicle.make,
            }));
            setVehicleMakeOptions(vehicleMakes);
        })
    }
    const fetchCompanyName=async()=>{
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseCompany/companies`)
        .then((res)=>{
            const company = res.data.map((company)=>({
                value: company.companyName,
                label: company.companyName,
            }));
            setCompanyNameOptions(company);
        })
    }
    const fetchProductItems=async()=>{
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/estimate/items`)
        .then((res)=>{
            const items = res.data.map((item)=>({
                value: item.itemName,
                label: item.itemName,
                itemID:item.itemID
            }))
            setItemOptions(items);
        })
    }
    fetchVehicleModels();
    fetchVehicleMake();
    fetchCompanyName();
    fetchProductItems();
  },[])

    const handleSelectVehicleModel = (vehicleMake) => {
        setVehicleModel(vehicleMake.value);
        console.log(vehicleMake.value)
    };

    const handleSelectVehicleMake = (vehicleModel) => {
        setVehicleModels(vehicleModel.value);
        console.log(vehicleModel.value)
    };

    const handleItemName=(itemName)=>{
        setItemName(itemName);
    }

    const handleSelectCompanyName=(companyName)=>{
        setCompanyName(companyName.value);
    }

  const handleTableBtn=async()=>{
    const newPurchaseOrderData={
        item_id:itemName.itemID,
        itemName: itemName.label, 
        itemPrice: parseFloat(itemPrice).toFixed(2),
        itemQty: itemQty,  
    }

    setPurchaseTableData((prevData)=>[...prevData, newPurchaseOrderData]);
    setItemName(null);
    setItemQty('');
    setItemPrice('');
  }

  //Handling submit button
  const handleSubmitBtn=async()=>{
    if(!vehicleNo || !vehicleMake || !vehicleModel || !companyName || !issuedDate || !purchaseTableData){
        setErrorVisible("block");
        setError(errorType[0]);
        setBackgroundColor("#fae0e4");
        setBorderColor("#ff0a54");
        setFontColor("#ff0a54");
        setIconColor("#ff0a54");
  
        setTimeout(() => {
          setErrorVisible("none");
        }, 2000);
    }else{
        const formData = {vehicleNo, vehicleMake, vehicleModel, companyName, issuedDate, purchaseTableData}
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/purchaseOrder/createPurchaseOrder`, formData)
        .then((res)=>{
            navigate(`/purchase-order/preview-purchaseOrder`)
        }).catch((err)=>{
            alert(err.message)
        })
    }
  }

  const editHandler=async(index)=>{
    setUpdateIndex(index)
    setAddView('none')
    setUpdateView('block')
    const {itemName, itemQty, itemPrice} = purchaseTableData[index];
    setItemName({label: itemName, value: itemName});
    setItemQty(itemQty)
    setItemPrice(itemPrice)
  }

  const handleUpdateBtn = async () => {
    if (updateIndex !== null) {
        const updatedPurchaseData = [...purchaseTableData];
        updatedPurchaseData[updateIndex] = {
            item_id: itemName.itemID,
            itemName: itemName.label,
            itemPrice: parseFloat(itemPrice).toFixed(2),
            itemQty: itemQty,
        };
        setPurchaseTableData(updatedPurchaseData);
        setItemName(null);
        setItemQty('');
        setItemPrice('');
        setAddView('block')
        setUpdateView('none')
    }
};

const deleteHandler=async(index)=>{
    console.log(index + 1, "Need to delete")
    const updatedPurchaseData = purchaseTableData.filter((_, i) => i !== index);
     // Update the state with the new array
    setPurchaseTableData(updatedPurchaseData);
}
  return (
    <div className="createEstimateContainer">
        <Drawer/>
        <div className="estimateContainer">
            <Navbar className='navbarComponent' text="Purchase Order / Create Purchase Order"/>
            <Error value={erroVisible} errorName={error} backColor={backgroundColor} border={borderColor} font={fontColor} icon={iconColor}/>
            <div className='mainContainer'>
                    <div className="jobDetails" style={{width:'70%'}}>
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
                                    options={vehicleModelOptions}
                                    isSearchable={true}
                                    placeholder="Ex TOYOTA"
                                    className='jobFormText'
                                    // value={vehicleModel}
                                    onChange={handleSelectVehicleMake}
                                    required
                                />
                            </div>
                            <div className="textContainer">
                                <label htmlFor="">Vehicle Model:</label><br />
                                <Select
                                    options={vehicleOptions}
                                    isSearchable={true}
                                    placeholder="EX AXIO-161"
                                    className='jobFormText'
                                    // value={vehicleMake}
                                    onChange={handleSelectVehicleModel}
                                    required
                                />
                            </div>
                            
                        </div>
                        <div className='purchaseDetails'>
                            <div className="textContainer">
                                <label htmlFor="">Company Name:</label><br />
                                <Select
                                    options={companyOptions}
                                    isSearchable={true}
                                    placeholder="Select Company"
                                    className='jobFormText'
                                    // value={companyName}
                                    onChange={handleSelectCompanyName}
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
                            <input type="text" className="purchaseInput" id='qtyInput' placeholder='Qty' value={itemQty} onChange={(e)=>{
                                setItemQty(e.target.value)
                            }}/>
                            <input type="text" className="purchaseInput" placeholder='Amount (Rs)' value={itemPrice} onChange={(e)=>{
                                setItemPrice(e.target.value)
                            }}/>
                            <button style={{display:addView}} className="purchaseAddBtn" onClick={handleTableBtn}>Add</button>
                            <button style={{display:updateView}} className="purchaseUpdateBtn" onClick={handleUpdateBtn}>Update</button>
                            <div>
                                <PurchaseTable 
                                    tableData={purchaseTableData}
                                    handleEdit={(index) => editHandler(index)}
                                    handleDelete={(index)=>deleteHandler(index)}
                                />
                            </div>
                        </div>
                        <button className='poBtn' onClick={handleSubmitBtn}>SUBMIT PURCHASE ORDER</button>
                    </div>
                </div>
        </div>
    </div>
  )
}

export default CreatePurchaseOrder
