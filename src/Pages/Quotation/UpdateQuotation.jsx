import React from 'react'
import './createQuotation.css';
import Navbar from '../../components/Navbar/Navbar';
import Drawer from '../../components/Drawer/Drawer';
import Error from '../../components/Errors/Error';
import { useState, useEffect } from 'react';
import Select from 'react-select'
import axios from 'axios';
import ProductModel from '../../components/Model/ProductModel';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import QuotationTable from '../../components/Tables/QuotationTable';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateQuotation = () => {
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
  const [vehicleMakeOptions, setVehicleMakeOptions] = useState([]);
  const [insuranceOptions, setInsuranceOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);

   //Product Model
  const [openProductModel, setOpenProductModel] = useState(false);
  const [addView, setAddView] = useState('block')
  const [updateView, setUpdateView] = useState('none')
  const [updateIndex, setUpdateIndex] = useState(null);

  const[vehicleNo, setVehicleNo] = useState(null);
  const[vehicleMake, setVehicleMake]= useState('');
  const[VehicleModel, setVehicleModel]= useState('');
  const[insuranceName, setInsuranceName] = useState(null);
  const[companyName, setCompanyName] = useState(null);
  const[companyMobile, setCompanyMobile] = useState(null);

  //Purchase Item Container
  const[itemName, setItemName] = useState(null);
  const[amount, setAmount] = useState('');
  const[quotationTableData, setQuotationTableData] = useState([]);

  const[quotation, setQuotation] = useState({})
  const[quotationItems, setQuotationItems] = useState([])


  const navigate = useNavigate();
  const {quotationID} = useParams();

  //Getting selected quotation details
  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/quotation/getQuotation/${quotationID}`)
    .then((res)=>{
        setQuotation(res.data.quotation)
        setQuotationItems(res.data.quotationItems)
    }).catch((err)=>{
        alert(err.message)
    })
  },[])

  useEffect(()=>{
    setVehicleNo(quotation.vehicleNo || '')
    setVehicleMake(quotation.vehicleMake || '');
    setVehicleModel(quotation.VehicleModel || '');
    setInsuranceName(quotation.insuranceName || '')
    setCompanyName(quotation.companyName || '')
    setCompanyMobile(quotation.companyMobile || '')
  },[quotation])

  useEffect(() => {
    const initialQuotationTableData = quotationItems.map((item) => ({
        itemID: item.itemID,
        itemName: item.itemName,
        amount: parseFloat(item.amount).toFixed(2),
    }));
    setQuotationTableData(initialQuotationTableData);
}, [quotationItems]);

  useEffect(()=>{
    const fetchVehicleModels=async()=>{
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/job/vehicle/model`)
        .then((res)=>{
            const VehicleModel = res.data.map((vehicle)=>({
                value: vehicle.model,
                label: vehicle.model,
            }));
            setVehicleMakeOptions(VehicleModel);
            console.log(VehicleModel);
        })
    }
    const fetchVehicleMake=async()=>{
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/job/vehicle/make`)
        .then((res)=>{
            const vehicleMake = res.data.map((vehicle)=>({
                value: vehicle.make,
                label: vehicle.make,
            }));
            setVehicleOptions(vehicleMake);
            console.log(vehicleMake);
        })
    }
    const fetchCompanyName=async()=>{
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/insurance/getInsurance`)
        .then((res)=>{
            const insurance = res.data.map((insurance)=>({
                value: insurance.insuranceName,
                label: insurance.insuranceName,
            }));
            setInsuranceOptions(insurance);
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

  const handleSelectVehicleModel = (VehicleModel) => {
    console.log(vehicleModel)
    setVehicleModel(VehicleModel.value);
};

const handleSelectVehicleMake = (vehicleMake) => {
    console.log(vehicleMake)
    setVehicleMake(vehicleMake.value);
};

    const handleItemName=(itemName)=>{
        setItemName(itemName);
    }

    const handleSelectInsuranceName=(insuranceName)=>{
        setInsuranceName(insuranceName.value);
    }

  const handleTableBtn=async()=>{
    const newQuotationData={
        itemID:itemName.itemID,
        itemName: itemName.label, 
        amount: parseFloat(amount).toFixed(2),
    }

    setQuotationTableData((prevData)=>[...prevData, newQuotationData]);
    setItemName(null);
    setAmount('');
  }

  //Handling submit button
  const handleSubmitBtn=async()=>{
    if(!vehicleNo || !vehicleMake || !VehicleModel || !insuranceName || !companyName || !companyMobile || !quotationTableData){
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
        const formData = {vehicleNo, vehicleMake, VehicleModel, insuranceName, companyName, companyMobile, quotationTableData}
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/quotation/updateQuotation/${quotationID}`, formData)
        .then((res)=>{
            navigate(`/quotation/preview-quotation/${quotationID}`)
        }).catch((err)=>{
            alert(err.message)
        })
    }
  }
const deleteHandler = async (index) => {
    const qID = quotationID;
    const itemID = quotationTableData[index].itemID;
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/quotation/deleteQuotation/${qID}`, {
        data:{itemID}
    })
    .then((res) => {
        window.location.reload()
    }).catch((err)=>{
        alert(err.message)
    })
};

  return (
    <div className="createEstimateContainer">
        <Drawer/>
        <div className="estimateContainer">
            <Navbar className='navbarComponent' text="Quotation / Update Quotation"/>
            <Error value={erroVisible} errorName={error} backColor={backgroundColor} border={borderColor} font={fontColor} icon={iconColor}/>
            <div className='mainContainerForQuotation'>
                    <div className="jobDetails" style={{width:'70%'}}>
                        <h2 style={{marginBottom:"20px", color:"red"}}>Details of Quotation</h2>
                        <form action="">
                        <div className='jobFormDetails'>
                            <div className="textContainer">
                                <label htmlFor="">Vehicle No:</label><br />
                                <input type="text" className='jobFormText' id='purchaseInput' placeholder='Ex. CAC-2454' onChange={(e)=>{
                                    setVehicleNo(e.target.value)
                                }} value={vehicleNo}/>
                            </div>
                            <div className="textContainer">
                                <label htmlFor="">Vehicle Make:</label><br />
                                <Select
                                    options={vehicleOptions}
                                    isSearchable={true}
                                    placeholder="EX AXIO-161"
                                    className='jobFormText'
                                    value={vehicleOptions.find(option => option.value === VehicleModel)}
                                    onChange={handleSelectVehicleModel}
                                    required
                                />
                            </div>
                            <div className="textContainer">
                                <label htmlFor="">Vehicle Model:</label><br />
                                <Select
                                    options={vehicleMakeOptions}
                                    isSearchable={true}
                                    placeholder="Ex TOYOTA"
                                    className='jobFormText'
                                    value={vehicleMakeOptions.find(option => option.value === vehicleMake)}
                                    onChange={handleSelectVehicleMake}
                                    required
                                />
                            </div>
                        </div>
                        <div className='purchaseDetails'>
                            <div className="textContainer" style={{marginLeft:'0.2rem'}}>
                                <label htmlFor="">Insurance Name:</label><br />
                                <Select
                                    options={insuranceOptions}
                                    isSearchable={true}
                                    placeholder="Select Insurance"
                                    className='jobFormText'
                                    value={insuranceOptions.find(option => option.value === insuranceName)}
                                    onChange={handleSelectInsuranceName}
                                    required
                            />
                            </div>
                            <div className="textContainer">
                                <label htmlFor="">Company Name:</label><br />
                                <input type="text"  className='jobFormText' style={{padding:'8px', border:'1px solid #ccc', color:'black'}} placeholder='Ex. Upul Motors' onChange={(e)=>{
                                    setCompanyName(e.target.value)
                                }} value={companyName}/>
                            </div>
                            <div className="textContainer" style={{marginRight:'1rem'}}>
                                <label htmlFor="">Mobile No:</label><br />
                                <input type="text"  className='jobFormText' style={{padding:'8px', border:'1px solid #ccc', color:'black'}} placeholder='Ex. 07x xxx xx xx' onChange={(e)=>{
                                    setCompanyMobile(e.target.value)
                                }} value={companyMobile}/>
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
                        <h3 className='purchaseTitle'>Quotation Items</h3>
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
                            <input type="text" className="purchaseInput" placeholder='Amount (Rs)' value={amount} onChange={(e)=>{
                                setAmount(e.target.value)
                            }}/>
                            <button style={{display:addView}} className="purchaseAddBtn" onClick={handleTableBtn}>Add</button>
                            <div>
                                <QuotationTable 
                                    tableData={quotationTableData}
                                    handleDelete={(index)=>deleteHandler(index)}
                                />
                            </div>
                        </div>
                        <button className='poBtn' onClick={handleSubmitBtn}>UPDATE QUOTATION</button>
                    </div>
                </div>
        </div>
    </div>
  )
}

export default UpdateQuotation

