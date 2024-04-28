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

  //Job Data
  const[jobID, setJobID] = useState(0);
  const[estimateItems, setEstimateItems] = useState([]);
  const[supplimentryItems, setSupplimentryItems] = useState([]);
  const[quotationItems, setQuotationItems] = useState([]);
  
  //Options
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [vehicleModelOptions, setVehicleMakeOptions] = useState([]);
  const [insuranceOptions, setInsuranceOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);

   //Product Model
  const[openProductModel, setOpenProductModel] = useState(false);
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
  const[selectedIndex, setSelectedIndex] = useState(null)

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
 //-------------------------------------------------------------------------job number btn handling---------------------------------------
 
 const handleJobSearchBtn = async()=>{
    const tableCategory = "Replacement";
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/quotation/getItems`,{tableCategory, jobID})
    .then((res)=>{
        setEstimateItems(res.data.estimateItems)
        setSupplimentryItems(res.data.supplimentryItems)

        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/job/getJobDetails/${jobID}`)
        .then((res)=>{
            const result = res.data[0];
            setVehicleNo(result.vehicleNo)
            setVehicleModel(result.vehicleMake);
            setVehicleModels(result.vehicleModel);
            setInsuranceName(result.insuranceName)
            setCompanyName(result.companyName)
            setCompanyMobile(result.companyMobile)
        }).catch((err)=>{
            alert(err.message)
        })
    }).catch((err)=>{
        alert(err.message)
    })
 }

 useEffect(() => {
    const combinedItems = [...estimateItems, ...supplimentryItems];
    setQuotationItems(combinedItems);
  }, [estimateItems, supplimentryItems]);

  useEffect(() => {
    const initialQuotationTableData = quotationItems.map((item) => ({
        itemID: item.itemID,
        itemName: item.itemName,
        // amount: parseFloat(item.amount).toFixed(2),
        amount: '',
    }));
    setQuotationTableData(initialQuotationTableData);
}, [quotationItems]);

//Handling add btn
  const handleTableBtn=async()=>{
    const newQuotationData={
        itemID:itemName.itemID,
        itemName: itemName.label, 
        amount: amount,
    }
    setQuotationTableData((prevData)=>[...prevData, newQuotationData]);
    setItemName(null);
    setAmount('');
  }

  //Handling edit btn
//   const editHandler=async(index)=>{
//     setSelectedIndex(index)
//   }
const editHandler = (index) => {
    setSelectedIndex(index);
    // If selectedIndex matches the current index, set the amount to the current row's amount
    if (selectedIndex === index) {
      setAmount(quotationTableData[index].amount);
    } else {
      setAmount(null);
    }
  };
  

  //Handling update btn
const updateHandler = async (index) => {
    const updatedQuotationData = [...quotationTableData];
    updatedQuotationData[index].amount = amount;

    setQuotationTableData(updatedQuotationData);
    setSelectedIndex(null);
    setAmount('');
    };

    //Handling delete btn
    const deleteHandler = (index) => {
        const updatedQuotationData = [...quotationTableData];
        updatedQuotationData.splice(index, 1); // Remove the item at the specified index
        setQuotationTableData(updatedQuotationData);
    };
    
    

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
  return (
    <div className="createEstimateContainer">
        <Drawer/>
        <div className="estimateContainer">
            <Navbar className='navbarComponent' text="Quotation / Create Quotation"/>
            <Error value={erroVisible} errorName={error} backColor={backgroundColor} border={borderColor} font={fontColor} icon={iconColor}/>
            <div className="searchJob">
                <label htmlFor="" style={{fontSize:"18px"}}>Seach Job No:</label>
                <input type="text" placeholder='Enter Job No'  className='searchInput' onChange={(e)=>{
                  setJobID(e.target.value)
                }}/>
                <button className='searchBtn' onClick={handleJobSearchBtn}>Seach</button>
              </div>
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
                                    options={vehicleModelOptions}
                                    isSearchable={true}
                                    placeholder="Ex TOYOTA"
                                    className='jobFormText'
                                    value={vehicleModelOptions.find(option => option.value === vehicleMake)}
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
                                    value={vehicleOptions.find(option => option.value === vehicleModel)}
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
                                    value={insuranceOptions.find(option => option.value === insuranceName)}
                                    onChange={handleSelectInsuranceName}
                                    required
                            />
                            </div>
                            <div className="textContainer">
                                <label htmlFor="">Company Name:</label><br />
                                <input type="text"  className='jobFormText' style={{padding:'8px', border:'1px solid #ccc', color:'black'}} placeholder='Enter company name' onChange={(e)=>{
                                    setCompanyName(e.target.value)
                                }}/>
                            </div>
                            <div className="textContainer" style={{marginRight:'1rem'}}>
                                <label htmlFor="">Mobile No:</label><br />
                                <input type="text"  className='jobFormText' style={{padding:'8px', border:'1px solid #ccc', color:'black'}} placeholder='Enter company mobile no' onChange={(e)=>{
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
                            <button  className="purchaseAddBtn" onClick={handleTableBtn}>Add</button>
                            <div>
                              <div className="table-container">
                                <table className="custom-table">
                                    <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Item Name</th>
                                        <th>Amount</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {quotationTableData.map((data, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{data.itemName}</td>
                                            <td>
                                                {selectedIndex === index ? (
                                                    <input
                                                        type="text"
                                                        className="insurancePrice"
                                                        style={{ padding: "5px", width: "8rem", borderRadius: "2px" }}
                                                        value={amount}
                                                        onChange={(e) => {
                                                            setAmount(e.target.value);
                                                        }}
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className="insurancePrice"
                                                        style={{ padding: "5px", width: "8rem", borderRadius: "2px", color: "#c9184a", fontWeight: "bold" }}
                                                        value={data.amount}
                                                        disabled
                                                    />
                                                )}
                                            </td>
                                            <td>
                                                <div className="tableBtn">
                                                    {selectedIndex === index ? (
                                                        <button className="tableUpdateBtn" onClick={() => updateHandler(index)}>Update</button>
                                                    ) : (
                                                        <>
                                                            <button className="editBtn" onClick={() => editHandler(index)}>Edit</button>
                                                            <button className="deleteBtn" onClick={() => deleteHandler(index)}>Delete</button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                                </table>
                                </div>
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

