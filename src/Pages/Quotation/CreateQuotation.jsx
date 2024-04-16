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
import { useNavigate } from 'react-router-dom';

const CreateQuotation = () => {
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
  const [insuranceOptions, setInsuranceOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);

   //Product Model
  const [openProductModel, setOpenProductModel] = useState(false);
  const [addView, setAddView] = useState('block')
  const [updateView, setUpdateView] = useState('none')
  const [updateIndex, setUpdateIndex] = useState(null);

  const[vehicleNo, setVehicleNo] = useState(null);
  const[vehicleMake, setVehicleModel]= useState(null);
  const[vehicleModel, setVehicleModels]= useState(null);
  const[insuranceName, setInsuranceName] = useState(null);
  const[companyName, setCompanyName] = useState(null);
  const[companyMobile, setCompanyMobile] = useState(null);

  //Purchase Item Containers
  const[itemName, setItemName] = useState(null);
  const[amount, setAmount] = useState('');
  const[quotationTableData, setQuotationTableData] = useState([]);

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
    if(!vehicleNo || !vehicleMake || !vehicleModel || !insuranceName || !companyName || !companyMobile || !quotationTableData){
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
        const formData = {vehicleNo, vehicleMake, vehicleModel, insuranceName, companyName, companyMobile, quotationTableData}
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/quotation/createQuotation`, formData)
        .then((res)=>{
            navigate(`/quotation/preview-quotation`)
        }).catch((err)=>{
            alert(err.message)
        })
    }
  }

//   const editHandler=async(index)=>{
//     setUpdateIndex(index)
//     setAddView('none')
//     setUpdateView('block')
//     const {itemName, amount} = quotationTableData[index];
//     setItemName({label: itemName, value: itemName});
//     setAmount(amount)
//   }

//   const handleUpdateBtn = async () => {
//     if (updateIndex !== null) {
//         const updatedQuotationData = [...quotationTableData];
//         updatedQuotationData[updateIndex] = {
//             itemID: itemName.itemID,
//             itemName: itemName.label,
//             amount: parseFloat(amount).toFixed(2),
//         };
//         setQuotationTableData(updatedQuotationData);
//         setItemName(null);
//         setAmount('');
//         setAddView('block')
//         setUpdateView('none')
//     }
// };

const deleteHandler=async(index)=>{
    console.log(index + 1, "Need to delete")
    const updatedQuotationData = quotationTableData.filter((_, i) => i !== index);
     // Update the state with the new array
    setQuotationTableData(updatedQuotationData);
}
  return (
    <div className="createEstimateContainer">
        <Drawer/>
        <div className="estimateContainer">
            <Navbar className='navbarComponent' text="Quotation / Create Quotation"/>
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
                            <div className="textContainer" style={{marginLeft:'0.2rem'}}>
                                <label htmlFor="">Insurance Name:</label><br />
                                <Select
                                    options={insuranceOptions}
                                    isSearchable={true}
                                    placeholder="Select Insurance"
                                    className='jobFormText'
                                    // value={companyName}
                                    onChange={handleSelectInsuranceName}
                                    required
                            />
                            </div>
                            <div className="textContainer">
                                <label htmlFor="">Company Name:</label><br />
                                <input type="text"  className='jobFormText' style={{padding:'8px', border:'1px solid #ccc', color:'black'}} placeholder='Ex. Upul Motors' onChange={(e)=>{
                                    setCompanyName(e.target.value)
                                }}/>
                            </div>
                            <div className="textContainer" style={{marginRight:'1rem'}}>
                                <label htmlFor="">Mobile No:</label><br />
                                <input type="text"  className='jobFormText' style={{padding:'8px', border:'1px solid #ccc', color:'black'}} placeholder='Ex. 07x xxx xx xx' onChange={(e)=>{
                                    setCompanyMobile(e.target.value)
                                }}/>
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
                            {/* <button style={{display:updateView}} className="purchaseUpdateBtn" onClick={handleUpdateBtn}>Update</button> */}
                            <div>
                                <QuotationTable 
                                    tableData={quotationTableData}
                                    // handleEdit={(index) => editHandler(index)}
                                    handleDelete={(index)=>deleteHandler(index)}
                                />
                            </div>
                        </div>
                        <button className='poBtn' onClick={handleSubmitBtn}>SUBMIT QUOTATION</button>
                    </div>
                </div>
        </div>
    </div>
  )
}

export default CreateQuotation

