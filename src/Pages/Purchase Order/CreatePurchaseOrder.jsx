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

  const[jobID, setJobID] = useState(null)
  const[purchaseItems, setPurchaseItems] = useState([]);
  const[estimateItems, setEstimateItems] = useState([]);
  const[supplimentryItems, setSupplimentryItems] = useState([]);
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

    //-------------------------------------------------------------------------------------------------------------------------------------
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
                setCompanyName(result.companyName)
                setIssuedDate(result.issuedDate)
                console.log(result)
            }).catch((err)=>{
                alert(err.message)
            })
        }).catch((err)=>{
            alert(err.message)
        })
     }
    
     useEffect(() => {
        const combinedItems = [...estimateItems, ...supplimentryItems];
        setPurchaseItems(combinedItems);
      }, [estimateItems, supplimentryItems]);
    
      useEffect(() => {
        const initialPurchaseTableData = purchaseItems.map((item) => ({
            item_id: item.itemID,
            itemName: item.itemName,
            itemPrice: parseFloat(item.amount).toFixed(2),
            itemQty: itemQty,  
        }));
        setPurchaseTableData(initialPurchaseTableData);
    }, [purchaseItems]);

  const handleTableBtn=async()=>{
    const newPurchaseOrderData={
        item_id:itemName.itemID,
        itemName: itemName.label, 
        itemPrice: itemPrice,
        itemQty: itemQty,  
    }

    setPurchaseTableData((prevData)=>[...prevData, newPurchaseOrderData]);
    setItemName(null);
    setItemQty('');
    setItemPrice('');
  }
    //Handling edit btn
    const editHandler=async(index)=>{
        setSelectedIndex(index)
      }
    
      //Handling update btn
    const updateHandler = async (index) => {
        const updatedPurchaseData = [...purchaseTableData];
        updatedPurchaseData[index].itemPrice = itemPrice;
        updatedPurchaseData[index].itemQty = itemQty;
    
        setPurchaseTableData(updatedPurchaseData);
        setSelectedIndex(null);
        };
    
        //Handling delete btn
    const deleteHandler=async(index)=>{
            const updatedPurchaseData = purchaseTableData.filter((_, i) => i !== index);
            setPurchaseTableData(updatedPurchaseData);
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

  return (
    <div className="createEstimateContainer">
        <Drawer/>
        <div className="estimateContainer">
            <Navbar className='navbarComponent' text="Purchase Order / Create Purchase Order"/>
            <Error value={erroVisible} errorName={error} backColor={backgroundColor} border={borderColor} font={fontColor} icon={iconColor}/>
            <div className="searchJob">
                <label htmlFor="" style={{fontSize:"18px"}}>Seach Job No:</label>
                <input type="text" placeholder='Enter Job No'  className='searchInput' onChange={(e)=>{
                  setJobID(e.target.value)
                }}/>
                <button className='searchBtn' onClick={handleJobSearchBtn}>Seach</button>
              </div>
            <div className='mainContainer'>
                    <div className="jobDetails" style={{width:'70%'}}>
                        <h2 style={{marginBottom:"20px", color:"red"}}>Details of Purchase Order</h2>
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
                            {/* <input type="text" className="purchaseInput" id='qtyInput' placeholder='Qty' value={itemQty} onChange={(e)=>{
                                setItemQty(e.target.value)
                            }}/>
                            <input type="text" className="purchaseInput" placeholder='Amount (Rs)' value={itemPrice} onChange={(e)=>{
                                setItemPrice(e.target.value)
                            }}/> */}
                            <button style={{display:addView}} className="purchaseAddBtn" onClick={handleTableBtn}>Add</button>
                            <div>
                              <div className="table-container">
                                <table className="custom-table">
                                    <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Item Name</th>
                                        <th>Qty</th>
                                        <th>Amount</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {purchaseTableData?.map((data, index) => (
                                        <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{data.itemName}</td>
                                        <td>
                                        {selectedIndex === index ? (
                                            <>
                                                <input
                                                    type="text"
                                                    className='insurancePrice'
                                                    style={{ padding: "5px", width: "8rem", borderRadius: "2px", }}
                                                    onChange={(e)=>{
                                                        setItemQty(e.target.value)
                                                    }}
                                                />
                                            </>
                                            ) : (
                                            <>
                                                <input
                                                    type="text"
                                                    className='insurancePrice'
                                                    style={{ padding: "5px", width: "8rem", borderRadius: "2px", color:"#c9184a", fontWeight:"bold"}}
                                                    disabled
                                                />
                                            </>
                                            )}
                                        </td>
                                        <td>
                                        {selectedIndex === index ? (
                                            <>
                                                <input
                                                    type="text"
                                                    className='insurancePrice'
                                                    style={{ padding: "5px", width: "8rem", borderRadius: "2px", }}
                                                    onChange={(e)=>{
                                                        setItemPrice(e.target.value)
                                                    }}
                                                />
                                            </>
                                            ) : (
                                            <>
                                                <input
                                                type="text"
                                                className='insurancePrice'
                                                style={{ padding: "5px", width: "8rem", borderRadius: "2px", color:"#c9184a", fontWeight:"bold"}}
                                                disabled
                                                />
                                            </>
                                            )}
                                        </td>
                                        <td >
                                            <div className="tableBtn">
                                            {selectedIndex === index ? (
                                                <>
                                                <button className='tableUpdateBtn' onClick={() => {updateHandler(index) }}>Update</button>
                                                </>
                                            ) : (
                                                <>
                                                <button className='editBtn' onClick={() => {editHandler(index) }}>Edit</button>
                                                <button className='deleteBtn' onClick={()=>{deleteHandler(index)}}>Delete</button>
                                                </>
                                            )}
                                            </div>
                                        </td>
                                        </tr>
                                    ))}
                                    {/* Add more rows as needed */}
                                </tbody>
                                </table>
                                </div>
                            </div>
                        </div>
                        </div>
                        <button className='poBtn' style={{marginBottom:'1rem', marginTop:'20px'}} onClick={handleSubmitBtn}>SUBMIT PURCHASE ORDER</button>
                    </div>
                </div>
        </div>
  )
}

export default CreatePurchaseOrder
